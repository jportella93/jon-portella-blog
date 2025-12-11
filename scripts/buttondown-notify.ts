import matter from "gray-matter";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface PostFrontmatter {
  title?: string;
  spoiler?: string;
  date?: string;
}

interface PostContent {
  slug: string;
  title: string;
  spoiler?: string;
  date?: string;
  body: string;
}

interface EmailPayload {
  subject: string;
  body: string;
  email_type: string;
}

const DEFAULT_MAX_BODY = 15000;
const DEFAULT_EMAIL_TYPE = "public";
const BLOG_PATH_GLOB = "content/blog/**/index.md";
const BUTTONDOWN_API_URL = process.env.BUTTONDOWN_API_URL;

function resolveDiffRange(): [string, string] {
  const current = process.env.CURRENT_SHA ?? process.env.GITHUB_SHA ?? "HEAD";
  const before = process.env.BEFORE_SHA;
  const zeroCommit = "0000000000000000000000000000000000000000";

  if (before && before !== zeroCommit) {
    return [before, current];
  }

  return [`${current}^`, current];
}

function findNewPostPaths(): string[] {
  const [from, to] = resolveDiffRange();
  const diffCommand = `git diff --diff-filter=A --name-only ${from} ${to} -- ${BLOG_PATH_GLOB}`;

  try {
    const output = execSync(diffCommand, { encoding: "utf8" }).trim();
    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch (error) {
    console.error("Failed to run git diff for new posts:", error);
    return [];
  }
}

async function loadPost(filePath: string): Promise<PostContent> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  const fileContent = await readFile(absolutePath, "utf8");
  const parsed = matter(fileContent);
  const frontmatter = parsed.data as PostFrontmatter;
  const slug = path.basename(path.dirname(filePath));
  const title = frontmatter.title?.trim() || slug;

  return {
    slug,
    title,
    spoiler: frontmatter.spoiler?.toString().trim() || undefined,
    date: frontmatter.date?.toString().trim() || undefined,
    body: parsed.content.trim(),
  };
}

function buildCanonicalUrl(slug: string): string {
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  const basePath = process.env.BASE_PATH;
  const withLeadingSlash = basePath
    ? `${basePath}/blog/${slug}`
    : `/blog/${slug}`;
  return `${siteUrl}${withLeadingSlash}`;
}

function truncateBody(body: string, maxLength: number): string {
  if (body.length <= maxLength) return body;

  const trimmed = body.slice(0, Math.max(0, maxLength - 3)).trimEnd();
  return `${trimmed}...`;
}

function buildEmail(post: PostContent): EmailPayload {
  const canonicalUrl = buildCanonicalUrl(post.slug);
  const maxLength =
    Number.parseInt(process.env.BUTTONDOWN_MAX_BODY ?? "", 10) ||
    DEFAULT_MAX_BODY;
  const emailType = process.env.BUTTONDOWN_EMAIL_TYPE || DEFAULT_EMAIL_TYPE;

  const intro = post.spoiler ? `${post.spoiler}\n\n` : "";
  const bodyWithLink = `${intro}${post.body}\n\nRead online: ${canonicalUrl}`;
  const body = truncateBody(bodyWithLink, maxLength);

  return {
    subject: post.title,
    body,
    email_type: emailType,
  };
}

async function sendEmail(payload: EmailPayload, slug: string): Promise<void> {
  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    console.warn(
      "BUTTONDOWN_API_KEY not set; skipping Buttondown notification."
    );
    return;
  }

  const response = await fetch(BUTTONDOWN_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Buttondown API returned ${response.status}: ${response.statusText}\n${errorBody}`
    );
  }

  console.log(`Buttondown email queued for ${slug}.`);
}

async function main(): Promise<void> {
  const newPostPaths = findNewPostPaths();
  if (newPostPaths.length === 0) {
    console.log("No new posts detected; exiting.");
    return;
  }

  for (const filePath of newPostPaths) {
    const post = await loadPost(filePath);
    const payload = buildEmail(post);
    await sendEmail(payload, post.slug);
  }
}

await main();
