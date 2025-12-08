import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(__dirname, "..", "content", "blog");

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to check if slug exists
function slugExists(slug) {
  const slugPath = path.join(postsDirectory, slug);
  return fs.existsSync(slugPath);
}

// Helper function to prompt for multiline content
async function promptMultiline() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    "Paste your blog post (first line = title, second line = spoiler, rest = content):"
  );
  console.log("(Press Ctrl+D when finished)");

  return new Promise((resolve) => {
    const lines = [];

    rl.on("line", (line) => {
      lines.push(line);
    });

    rl.on("close", () => {
      resolve(lines.join("\n").trim());
    });
  });
}

// Main function
async function createBlogPost() {
  try {
    // Prompt for content
    const rawContent = await promptMultiline();

    if (!rawContent) {
      console.error("Error: No content provided");
      process.exit(1);
    }

    // Parse content: first line = title, second line = spoiler, rest = content
    const lines = rawContent.split("\n");

    if (lines.length < 2) {
      console.error(
        "Error: Content must have at least 2 lines (title and spoiler)"
      );
      process.exit(1);
    }

    const title = lines[0].trim();
    const spoiler = lines[1].trim();
    const content = lines.slice(2).join("\n").trim();

    if (!title) {
      console.error("Error: Title (first line) is required");
      process.exit(1);
    }

    // Generate date (always current timestamp)
    const dateISO = new Date().toISOString();

    // Generate slug
    let slug = generateSlug(title);

    // Check if slug exists and handle conflicts
    if (slugExists(slug)) {
      console.error(`Error: Slug "${slug}" already exists`);
      process.exit(1);
    }

    // Create directory structure
    const postDirectory = path.join(postsDirectory, slug);
    const imagesDirectory = path.join(postDirectory, "images");

    fs.mkdirSync(postDirectory, { recursive: true });
    fs.mkdirSync(imagesDirectory, { recursive: true });

    // Create frontmatter
    const frontmatter = `---
title: ${title}
spoiler: ${spoiler || ""}
date: '${dateISO}'
---
`;

    // Write markdown file
    const markdownContent = frontmatter + "\n" + content + "\n";
    const indexPath = path.join(postDirectory, "index.md");
    fs.writeFileSync(indexPath, markdownContent, "utf8");

    console.log(`✓ Blog post created successfully!`);
    console.log(`  Location: ${path.relative(process.cwd(), indexPath)}`);
    console.log(`  Slug: ${slug}`);
    console.log(
      `  Images directory: ${path.relative(process.cwd(), imagesDirectory)}`
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

createBlogPost();
