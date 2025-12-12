import env from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
env.config();

import matter from "gray-matter";

import { siteMetadata } from "../lib/siteMetadata";

type PostFrontmatter = {
  title?: string;
  date?: string | null;
  spoiler?: string;
  hasNewsletterBeenSent?: boolean;
  [key: string]: unknown;
};

type PostForEmail = {
  slug: string;
  filePath: string;
  frontmatter: PostFrontmatter;
  content: string;
};

type EmailPayload = {
  subject: string;
  body: string;
};

type ButtondownEmail = {
  id: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "blog");

const BUTTONDOWN_API_BASE = "https://api.buttondown.email/v1";

const isDryRun = process.argv.includes("--dry-run");
const apiKey = process.env.BUTTONDOWN_API_KEY;
const draftEmail = process.env.BUTTONDOWN_DRAFT_EMAIL;

function ensureEnv() {
  if (isDryRun) {
    return;
  }

  if (!apiKey) {
    throw new Error(
      "Missing BUTTONDOWN_API_KEY. Add it to your environment before running."
    );
  }

  if (!draftEmail) {
    throw new Error(
      "Missing BUTTONDOWN_DRAFT_EMAIL. Add it to your environment before running."
    );
  }
}

async function readAllPosts(): Promise<PostForEmail[]> {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });

  const posts: PostForEmail[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const filePath = path.join(POSTS_DIR, slug, "index.md");
    try {
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);

      posts.push({
        slug,
        filePath,
        content: content.trim(),
        frontmatter: {
          ...data,
          hasNewsletterBeenSent: data.hasNewsletterBeenSent ?? false,
        },
      });
    } catch (error) {
      console.warn(`Skipping ${slug}: ${String(error)}`);
    }
  }

  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date)
      : new Date(0);
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date)
      : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
}

function formatDate(value?: string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function absolutizeImages(markdown: string, slug: string): string {
  const base = `${siteMetadata.siteUrl}/content/blog/${slug}/images/`;

  return markdown
    .replace(/!\[([^\]]*)\]\(\.\/images\/([^)]+)\)/g, (_match, alt, image) => {
      return `![${alt}](${base}${image})`;
    })
    .replace(
      /!\[([^\]]*)\]\((images\/([^)]+))\)/g,
      (_match, alt, _rel, image) => {
        return `![${alt}](${base}${image})`;
      }
    )
    .replace(
      /<img([^>]*?)\ssrc="\.\/images\/([^"]+)"/g,
      (_match, attrs, image) => `<img${attrs} src="${base}${image}"`
    )
    .replace(
      /<img([^>]*?)\ssrc="images\/([^"]+)"/g,
      (_match, attrs, image) => `<img${attrs} src="${base}${image}"`
    );
}

function buildEmailContent(posts: PostForEmail[]): EmailPayload {
  const titles = posts.map((post) => post.frontmatter.title || post.slug);
  const subject =
    posts.length === 1
      ? `New on the blog: ${titles[0]}`
      : `New on the blog: ${titles.join(", ")}`;

  const intro =
    posts.length === 1
      ? "I just published a new post. You can read it here:"
      : "I just published some new posts. You can read them here:";

  const sections = posts.map((post) => {
    const title = post.frontmatter.title || post.slug;
    const date = formatDate(post.frontmatter.date) || "";
    const spoiler = post.frontmatter.spoiler
      ? `_${post.frontmatter.spoiler}_\n\n`
      : "";
    const url = `${siteMetadata.siteUrl}/blog/${post.slug}`;
    const content = absolutizeImages(post.content, post.slug);

    return `## ${title}${date ? ` (${date})` : ""}\n\n${spoiler}Read on the site: ${url}\n\n${content}`;
  });

  const body = `${intro}\n\n${sections.join("\n\n---\n\n")}\n\nThanks for reading!\n\n— ${siteMetadata.author}`;

  return { subject, body };
}

async function promptForSelection(
  posts: PostForEmail[]
): Promise<PostForEmail[]> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nUnsent posts:\n");
  posts.forEach((post, index) => {
    const title = post.frontmatter.title || post.slug;
    const date = formatDate(post.frontmatter.date);
    const spoiler = post.frontmatter.spoiler
      ? ` — ${post.frontmatter.spoiler}`
      : "";
    console.log(`[${index + 1}] ${title}${date ? ` (${date})` : ""}${spoiler}`);
  });

  const answer = await rl.question(
    '\nEnter comma-separated numbers to include (or "all" to include every post). Press Enter to cancel: '
  );
  rl.close();

  if (!answer.trim()) {
    return [];
  }

  if (answer.trim().toLowerCase() === "all") {
    return posts;
  }

  const indices = answer
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => Number.parseInt(part, 10) - 1)
    .filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < posts.length);

  const unique = Array.from(new Set(indices));
  return unique.map((idx) => posts[idx]);
}

async function confirmSend(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(prompt);
  rl.close();

  return ["y", "yes"].includes(answer.trim().toLowerCase());
}

async function buttondownRequest<T>(
  endpoint: string,
  init: RequestInit
): Promise<T> {
  const response = await fetch(`${BUTTONDOWN_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Buttondown request failed (${response.status} ${response.statusText}): ${text}`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function createDraftEmail(
  payload: EmailPayload
): Promise<ButtondownEmail> {
  return buttondownRequest<ButtondownEmail>("/emails", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      status: "draft",
    }),
  });
}

async function sendTestEmail(emailId: string): Promise<void> {
  await buttondownRequest(`/emails/${emailId}/send-draft`, {
    method: "POST",
    body: JSON.stringify({ recipients: [draftEmail] }),
  });
}

async function sendEmail(emailId: string): Promise<void> {
  await buttondownRequest(`/emails/${emailId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "about_to_send" }),
  });
}

async function markPostsAsSent(posts: PostForEmail[]): Promise<void> {
  await Promise.all(
    posts.map(async (post) => {
      const raw = await fs.readFile(post.filePath, "utf8");
      const parsed = matter(raw);
      const updated = matter.stringify(parsed.content.trim(), {
        ...parsed.data,
        hasNewsletterBeenSent: true,
      });
      await fs.writeFile(post.filePath, `${updated.trim()}\n`, "utf8");
    })
  );
}

async function main() {
  try {
    ensureEnv();

    const posts = await readAllPosts();
    const unsent = posts.filter(
      (post) => post.frontmatter.hasNewsletterBeenSent !== true
    );

    if (!unsent.length) {
      console.log("No unsent posts found. Exiting.");
      return;
    }

    const selected = await promptForSelection(unsent);
    if (!selected.length) {
      console.log("No posts selected. Exiting.");
      return;
    }

    const email = buildEmailContent(selected);

    console.log("\n--- Email preview ---");
    console.log(`Subject: ${email.subject}`);
    console.log(`\nBody:\n${email.body}`);
    console.log("--- End preview ---\n");

    if (isDryRun) {
      console.log("[Dry-run] Skipping Buttondown API calls and file updates.");
      return;
    }

    const draft = await createDraftEmail(email);
    console.log(`Created Buttondown draft email (id: ${draft.id}).`);

    await sendTestEmail(draft.id);
    console.log(`Sent draft/test email to ${draftEmail}.`);

    const approved = await confirmSend(
      "Send this email to all subscribers? (y/N): "
    );

    if (!approved) {
      console.log(
        "Approval declined. Draft left as-is; no subscribers emailed."
      );
      return;
    }

    await sendEmail(draft.id);
    console.log("Email sent to subscribers.");

    await markPostsAsSent(selected);
    console.log("Marked selected posts as sent.");
  } catch (error) {
    console.error(`\nError: ${String(error)}`);
    process.exitCode = 1;
  }
}

void main();
