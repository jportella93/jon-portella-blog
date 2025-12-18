import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import SubscriptionNotice from "../components/SubscriptionNotice";
import { getAllPostsMetadata, type PostFrontmatter } from "../lib/getAllPosts";
import { siteMetadata } from "../lib/siteMetadata";
import {
  generateCollectionPageSchema,
  type CollectionPageSchema,
} from "../lib/structuredData";
import { rhythm } from "../lib/typography";

interface BlogIndexProps {
  posts: Array<{ slug: string; frontmatter: PostFrontmatter }>;
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const blogUrl = `${siteMetadata.siteUrl}/blog`;

  const collectionSchema: CollectionPageSchema = {
    name: "Jon Portella's Blog",
    description:
      "Technical blog posts about JavaScript, React, web development, and software engineering.",
    url: blogUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
        name: post.frontmatter.title || post.slug,
        description: post.frontmatter.spoiler || "",
      })),
    },
  };

  const structuredData = generateCollectionPageSchema(collectionSchema);

  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </Head>
      <SEO
        title="Blog"
        description="Technical blog posts about JavaScript, React, web development, and software engineering."
        canonical={blogUrl}
        keywords={[
          "blog",
          "javascript",
          "react",
          "web development",
          "software engineering",
          "technical writing",
        ]}
      />
      <h1>Jon Portella's Blog</h1>
      {posts.map((post, index) => {
        const title = post.frontmatter.title || post.slug;
        const date = post.frontmatter.date
          ? new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";
        const readingTime = post.frontmatter.readingTimeMinutes;
        const meta = [date, readingTime ? `${readingTime} min read` : null]
          .filter(Boolean)
          .join(" • ");

        return (
          <div key={post.slug}>
            <h3
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link href={`/blog/${post.slug}`} style={{ boxShadow: `none` }}>
                {title}
              </Link>
            </h3>
            <small>{meta}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: post.frontmatter.spoiler || "",
              }}
            />
            {index === 2 && <SubscriptionNotice />}
          </div>
        );
      })}
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getAllPostsMetadata();

  return {
    props: {
      posts,
    },
  };
}
