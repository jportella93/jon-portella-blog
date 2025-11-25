import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { getAllPostsMetadata, type PostFrontmatter } from "../lib/getAllPosts";
import { rhythm } from "../lib/typography";

interface BlogIndexProps {
  posts: Array<{ slug: string; frontmatter: PostFrontmatter }>;
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Layout maxWidth={rhythm(22)}>
      <SEO title="Blog" keywords={["blog", "javascript", "react"]} />
      {posts.map((post) => {
        const title = post.frontmatter.title || post.slug;
        const date = post.frontmatter.date
          ? new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";

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
            <small>{date}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: post.frontmatter.spoiler || "",
              }}
            />
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
