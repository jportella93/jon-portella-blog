import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const POSTS_DIR = path.join(ROOT, "content/blog");
const PUBLIC_CONTENT_DIR = path.join(ROOT, "public/content/blog");

interface ImageMeta {
  src: string;
  width: number;
  height: number;
}

interface ImageMetaMap {
  [src: string]: ImageMeta;
}

async function getImageDimensions(
  filePath: string
): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(filePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not get dimensions from metadata");
    }
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.warn(`Failed to get dimensions for ${filePath}:`, error);
    // Return reasonable defaults for layout stability
    return { width: 800, height: 600 };
  }
}

async function getRemoteImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not get dimensions from metadata");
    }
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.warn(`Failed to get dimensions for remote image ${url}:`, error);
    // Return reasonable defaults
    return { width: 800, height: 600 };
  }
}

async function extractImageUrlsFromMarkdown(
  content: string,
  slug: string
): Promise<string[]> {
  const urls: string[] = [];

  // Match markdown images: ![alt](url)
  const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownRegex.exec(content)) !== null) {
    const url = match[2];
    if (!urls.includes(url)) {
      urls.push(url);
    }
  }

  // Match HTML images: <img src="..." ...>
  const htmlRegex = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    const url = match[1];
    if (!urls.includes(url)) {
      urls.push(url);
    }
  }

  return urls;
}

async function resolveImagePath(url: string, slug: string): Promise<string> {
  // Handle relative image paths
  if (url.startsWith("./images/") || url.startsWith("images/")) {
    const imagePath = url.replace(/^(\.\/)?images\//, "");
    return path.join(PUBLIC_CONTENT_DIR, slug, "images", imagePath);
  }

  // Handle absolute paths within the blog content
  if (url.startsWith("/content/blog/")) {
    return path.join(ROOT, "public", url);
  }

  // Return as-is for remote URLs
  return url;
}

async function isLocalImage(url: string, slug: string): Promise<boolean> {
  const resolvedPath = await resolveImagePath(url, slug);
  // If it's not a remote URL (doesn't start with http/https), it's local
  return !url.startsWith("http://") && !url.startsWith("https://");
}

async function processPost(slug: string): Promise<void> {
  const postDir = path.join(POSTS_DIR, slug);
  const publicPostDir = path.join(PUBLIC_CONTENT_DIR, slug);
  const markdownPath = path.join(postDir, "index.md");

  try {
    const content = await fs.readFile(markdownPath, "utf8");
    const imageUrls = await extractImageUrlsFromMarkdown(content, slug);

    if (imageUrls.length === 0) {
      console.log(`No images found for ${slug}`);
      return;
    }

    const imageMeta: ImageMetaMap = {};

    for (const url of imageUrls) {
      console.log(`Processing ${url} for ${slug}...`);

      try {
        let dimensions: { width: number; height: number };

        if (await isLocalImage(url, slug)) {
          const filePath = await resolveImagePath(url, slug);
          dimensions = await getImageDimensions(filePath);
        } else {
          dimensions = await getRemoteImageDimensions(url);
        }

        imageMeta[url] = {
          src: url,
          width: dimensions.width,
          height: dimensions.height,
        };

        console.log(`  ✓ ${url}: ${dimensions.width}x${dimensions.height}`);
      } catch (error) {
        console.warn(`  ✗ Failed to process ${url}:`, error);
        // Use defaults for failed images
        imageMeta[url] = {
          src: url,
          width: 800,
          height: 600,
        };
      }
    }

    // Write imageMeta.json to the post directory
    const metaPath = path.join(postDir, "imageMeta.json");
    await fs.writeFile(metaPath, JSON.stringify(imageMeta, null, 2));
    console.log(
      `Wrote metadata for ${slug} (${Object.keys(imageMeta).length} images)`
    );
  } catch (error) {
    console.error(`Failed to process post ${slug}:`, error);
  }
}

async function main(): Promise<void> {
  console.log("Generating image metadata for blog posts...");

  try {
    const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
    const postDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    console.log(`Found ${postDirs.length} blog posts`);

    for (const slug of postDirs) {
      await processPost(slug);
    }

    console.log("Image metadata generation complete!");
  } catch (error) {
    console.error("Failed to generate image metadata:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
