import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { siteMetadata } from "./siteMetadata";

const CHARS_PER_MINUTE = 1000;
const MIN_READING_TIME_MINUTES = 1;

function calculateReadingTime(content: string): number {
  const normalizedContent = content.replace(/\s+/g, " ").trim();
  if (!normalizedContent) {
    return MIN_READING_TIME_MINUTES;
  }

  const estimatedMinutes = Math.ceil(
    normalizedContent.length / CHARS_PER_MINUTE
  );
  return Math.max(MIN_READING_TIME_MINUTES, estimatedMinutes);
}

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostFrontmatter {
  title?: string;
  date?: string | null;
  spoiler?: string;
  hasNewsletterBeenSent: boolean;
  readingTimeMinutes?: number;
  [key: string]: any;
}

export interface Post {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
}

interface ImageMeta {
  src: string;
  width: number;
  height: number;
}

interface ImageMetaMap {
  [src: string]: ImageMeta;
}

function getImageMetaForPost(slug: string): ImageMetaMap | null {
  const metaPath = path.join(postsDirectory, slug, "imageMeta.json");
  try {
    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, "utf8");
      return JSON.parse(metaContent);
    }
  } catch (error) {
    console.warn(`Failed to read image metadata for ${slug}:`, error);
  }
  return null;
}

function wrapImageWithSkeleton(imgTag: string, meta: ImageMeta | null): string {
  const width = meta?.width || 800;
  const height = meta?.height || 600;
  const aspectRatio = width / height;

  return `
    <div class="blogImageFrame" style="aspect-ratio: ${aspectRatio}; width: 100%; max-width: ${width}px; margin: 1rem 0; position: relative;">
      <div class="blogImageSkeleton" style="position: absolute; inset: 0;"></div>
      ${imgTag.replace("<img", `<img style="width: 100%; height: auto; opacity: 0; transition: opacity 0.3s ease;" onload="this.style.opacity='1'; this.parentElement.querySelector('.blogImageSkeleton').style.display='none';" onerror="this.style.opacity='1'; this.parentElement.querySelector('.blogImageSkeleton').style.display='none';"`)}
    </div>
  `;
}

export function getPostSlugs(): string[] {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(postsDirectory, entry.name, "index.md");
      if (fs.existsSync(indexPath)) {
        slugs.push(entry.name);
      }
    }
  }

  return slugs;
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const normalizedDate = data.date ? new Date(data.date).toISOString() : null;
  const hasNewsletterBeenSent = data.hasNewsletterBeenSent ?? false;
  const readingTimeMinutes = calculateReadingTime(content);

  // Replace relative image paths with absolute paths for Next.js
  // Include basePath for GitHub Pages compatibility
  const basePath = siteMetadata.basePath || "";
  const contentWithFixedImages = content.replace(
    /!\[([^\]]*)\]\((\.\/)?images\/([^)]+)\)/g,
    (match, alt, dotSlash, imagePath) => {
      const imagePathWithBase = basePath
        ? `${basePath}/content/blog/${slug}/images/${imagePath}`
        : `/content/blog/${slug}/images/${imagePath}`;
      return `![${alt}](${imagePathWithBase})`;
    }
  );

  // Process markdown to HTML
  let processedContent = remark()
    .use(remarkRehype)
    .use(rehypePrismPlus)
    .use(rehypeStringify)
    .processSync(contentWithFixedImages);

  // Also fix any img src attributes in the HTML that might have been missed
  // This handles cases where images are in HTML format in the markdown
  const htmlContent = processedContent.toString();
  const htmlWithFixedImages = htmlContent.replace(
    /<img([^>]*)\ssrc="(\/content\/blog\/[^"]+)"/g,
    (match, attrs, imgPath) => {
      const imagePathWithBase = basePath ? `${basePath}${imgPath}` : imgPath;
      return `<img${attrs} src="${imagePathWithBase}"`;
    }
  );

  // Read image metadata and wrap image-only paragraphs with skeleton containers
  const imageMeta = getImageMetaForPost(slug);
  const htmlWithWrappedImages = htmlWithFixedImages.replace(
    /<p>\s*(?:<a[^>]*>\s*)?(<img[^>]*>)\s*(?:<\/a>\s*)?<\/p>/gi,
    (match, imgTag) => {
      // Skip if already wrapped
      if (match.includes("blogImageFrame")) return match;

      // Extract src from the img tag
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
      if (!srcMatch) return match;

      const src = srcMatch[1];
      const meta = imageMeta?.[src] || null;

      return wrapImageWithSkeleton(imgTag, meta);
    }
  );

  return {
    slug,
    content: htmlWithWrappedImages,
    frontmatter: {
      ...data,
      hasNewsletterBeenSent,
      date: normalizedDate,
      readingTimeMinutes,
    },
  };
}

export function getAllPostsMetadata(): Array<{
  slug: string;
  frontmatter: PostFrontmatter;
}> {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(postsDirectory, slug, "index.md");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const normalizedDate = data.date
        ? new Date(data.date).toISOString()
        : null;
      const hasNewsletterBeenSent = data.hasNewsletterBeenSent ?? false;
      const readingTimeMinutes = calculateReadingTime(content);

      return {
        slug,
        frontmatter: {
          ...data,
          hasNewsletterBeenSent,
          date: normalizedDate,
          readingTimeMinutes,
        },
      };
    })
    .sort((a, b) => {
      const dateA = a.frontmatter.date
        ? new Date(a.frontmatter.date)
        : new Date(0);
      const dateB = b.frontmatter.date
        ? new Date(b.frontmatter.date)
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => {
      const dateA = a.frontmatter.date
        ? new Date(a.frontmatter.date)
        : new Date(0);
      const dateB = b.frontmatter.date
        ? new Date(b.frontmatter.date)
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}
