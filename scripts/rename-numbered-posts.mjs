import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDir = path.join(__dirname, "..", "content", "blog");

// Get all existing slugs
const entries = fs.readdirSync(postsDir, { withFileTypes: true });
const existingSlugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

// Get numbered posts
const numberedPosts = entries
  .filter(
    (e) =>
      e.isDirectory() &&
      e.name.startsWith("1-minute-to-become-a-better-developer-")
  )
  .map((e) => {
    const indexPath = path.join(postsDir, e.name, "index.md");
    const content = fs.readFileSync(indexPath, "utf8");
    const { data } = matter(content);
    let newSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Handle conflicts
    if (existingSlugs.includes(newSlug) && e.name !== newSlug) {
      // Check if it's a duplicate or different post
      const existingPath = path.join(postsDir, newSlug, "index.md");
      const existingContent = fs.readFileSync(existingPath, "utf8");
      const { data: existingData } = matter(existingContent);

      // If same title and date, it's likely a duplicate - skip
      if (
        existingData.title === data.title &&
        existingData.date === data.date
      ) {
        console.log(`⚠️  Skipping ${e.name} - duplicate of ${newSlug}`);
        return null;
      }

      // Otherwise, add suffix
      let counter = 2;
      while (existingSlugs.includes(`${newSlug}-${counter}`)) {
        counter++;
      }
      newSlug = `${newSlug}-${counter}`;
    }

    return {
      oldSlug: e.name,
      title: data.title,
      newSlug: newSlug,
    };
  })
  .filter((p) => p !== null)
  .sort((a, b) => {
    const numA = parseInt(a.oldSlug.match(/\d+$/)?.[0] || "0");
    const numB = parseInt(b.oldSlug.match(/\d+$/)?.[0] || "0");
    return numA - numB;
  });

console.log("Renaming posts:\n");
numberedPosts.forEach((p) => {
  console.log(`${p.oldSlug} -> ${p.newSlug}`);
});

// Perform renames
numberedPosts.forEach(({ oldSlug, newSlug }) => {
  const oldPath = path.join(postsDir, oldSlug);
  const newPath = path.join(postsDir, newSlug);

  if (oldSlug === newSlug) {
    console.log(`⏭️  Skipping ${oldSlug} - already has correct name`);
    return;
  }

  try {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renamed ${oldSlug} -> ${newSlug}`);
  } catch (error) {
    console.error(`❌ Error renaming ${oldSlug}:`, error.message);
  }
});

console.log("\n✅ All renames completed!");
