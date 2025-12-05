import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { siteMetadata } from "./siteMetadata";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostFrontmatter {
  title?: string;
  date?: string | null;
  spoiler?: string;
  [key: string]: any;
}

export interface Post {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
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

  return {
    slug,
    content: htmlWithFixedImages,
    frontmatter: {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : null,
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
      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: {
          ...data,
          date: data.date ? new Date(data.date).toISOString() : null,
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
