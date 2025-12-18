import fs from "fs";
import path from "path";
import { NAVIGATION_PAGES } from "./constants";
import { getAllPosts } from "./getAllPosts";
import { siteMetadata } from "./siteMetadata";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export function generateSitemap(): void {
  const siteUrl = siteMetadata.siteUrl;
  const basePath = siteMetadata.basePath || "";

  const urls: SitemapUrl[] = [];

  // Add main navigation pages
  NAVIGATION_PAGES.forEach((page) => {
    urls.push({
      loc: `${siteUrl}${basePath}${page.url}`,
      changefreq: "weekly",
      priority: page.url === "/" ? "1.0" : "0.8",
    });
  });

  // Add timeline page (if not already included)
  if (!NAVIGATION_PAGES.find((p) => p.url === "/timeline")) {
    urls.push({
      loc: `${siteUrl}${basePath}/timeline`,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // Add standalone pages
  const standalonePages = [
    "/displaying-data-with-variable-length-example",
    "/free-instagram-random-comment-picker",
    "/job-aggregator-sub",
    "/shortcuts",
    "/you-are-using-browser-events-wrong-demo",
  ];

  standalonePages.forEach((pagePath) => {
    urls.push({
      loc: `${siteUrl}${basePath}${pagePath}`,
      changefreq: "monthly",
      priority: "0.5",
    });
  });

  // Add all blog posts
  const posts = getAllPosts();
  posts.forEach((post) => {
    const postUrl = `${siteUrl}${basePath}/blog/${post.slug}`;
    const lastmod = post.frontmatter.date
      ? new Date(post.frontmatter.date).toISOString().split("T")[0] // YYYY-MM-DD format
      : new Date().toISOString().split("T")[0];

    urls.push({
      loc: postUrl,
      lastmod,
      changefreq: "monthly",
      priority: "0.6",
    });
  });

  // Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    return `  <url>
    <loc>${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ""}
${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ""}
${url.priority ? `    <priority>${url.priority}</priority>` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  // Write to public/sitemap.xml
  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXml.trim());
  console.log("Sitemap generated at", sitemapPath);
}
