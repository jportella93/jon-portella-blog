import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';
import { getAllPosts } from './getAllPosts';
import { siteMetadata } from './siteMetadata';

export function generateRSS(): void {
  const posts = getAllPosts();
  const siteUrl = siteMetadata.siteUrl;

  const feed = new Feed({
    title: siteMetadata.title,
    description: siteMetadata.description,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/assets/profile-pic.jpg`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteMetadata.author}`,
    updated: posts.length > 0 ? new Date(posts[0].frontmatter.date || '') : new Date(),
    generator: 'Next.js',
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
    author: {
      name: siteMetadata.author,
      email: 'jportella93@gmail.com',
      link: siteUrl,
    },
  });

  posts.forEach((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    feed.addItem({
      title: post.frontmatter.title || '',
      id: url,
      link: url,
      description: post.frontmatter.spoiler || '',
      content: post.content,
      author: [
        {
          name: siteMetadata.author,
        },
      ],
      date: post.frontmatter.date ? new Date(post.frontmatter.date) : new Date(),
    });
  });

  const rssPath = path.join(process.cwd(), 'public', 'rss.xml');
  fs.writeFileSync(rssPath, feed.rss2());
  console.log('RSS feed generated at', rssPath);
}






