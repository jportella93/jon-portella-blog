import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import KeyboardNavHint from "../../components/KeyboardNavHint";
import Layout from "../../components/Layout";
import ReadingProgressBar from "../../components/ReadingProgressBar";
import SEO from "../../components/SEO";
import SubscriptionNotice from "../../components/SubscriptionNotice";
import {
  getAllPostsMetadata,
  type Post,
  type PostFrontmatter,
} from "../../lib/getAllPosts";
import { getPostBySlug } from "../../lib/markdown";
import { siteMetadata } from "../../lib/siteMetadata";
import { rhythm, scale } from "../../lib/typography";
import { useKeyboardNavigation } from "../../lib/useKeyboardNavigation";

interface BlogPostProps {
  post: Post;
  previous: { slug: string; frontmatter: PostFrontmatter } | null;
  next: { slug: string; frontmatter: PostFrontmatter } | null;
}

export default function BlogPost({ post, previous, next }: BlogPostProps) {
  const router = useRouter();
  const { title: postTitle, spoiler, date } = post.frontmatter;
  const postUrl = siteMetadata.siteUrl + router.asPath;

  useKeyboardNavigation({
    previous: previous?.slug,
    next: next?.slug,
  });

  const postDescriptionMetaTag = `${spoiler || ""} - ${siteMetadata.title} - ${
    siteMetadata.description
  }`;

  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const img = document.querySelector("img");
      if (img) {
        setImageUrl(img.getAttribute("src") || "");
      }
    }
  }, []);

  // Remove the first h1 tag from content if it exists (to avoid duplication with the title from frontmatter)
  const contentWithoutFirstH1 = React.useMemo(() => {
    if (!post.content) return post.content;
    // Remove the first <h1>...</h1> tag and any surrounding whitespace/newlines from the content
    return post.content.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, "");
  }, [post.content]);

  return (
    <Layout width="narrow">
      <ReadingProgressBar />
      <SEO
        title={postTitle}
        description={postDescriptionMetaTag}
        url={postUrl}
        image={imageUrl}
        type="article"
        publishedTime={date || undefined}
      />
      <h1>{postTitle}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {date ? moment(date).format("MMMM DD, YYYY") : ""}
      </p>
      <div dangerouslySetInnerHTML={{ __html: contentWithoutFirstH1 }} />
      <SubscriptionNotice />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <ul
        style={{
          display: `grid`,
          gap: rhythm(0.5),
          listStyle: `none`,
          padding: 0,
        }}
      >
        {previous && (
          <li>
            <Link
              href={`/blog/${previous.slug}`}
              rel="prev"
              style={{ display: "block" }}
            >
              ← {previous.frontmatter.title}
            </Link>
          </li>
        )}
        {next && (
          <li>
            <Link
              href={`/blog/${next.slug}`}
              rel="next"
              style={{ display: "block" }}
            >
              {next.frontmatter.title} →
            </Link>
          </li>
        )}
      </ul>
      <KeyboardNavHint />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPostsMetadata();

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);
  const posts = getAllPostsMetadata();

  const postIndex = posts.findIndex((p) => p.slug === post.slug);
  const previous = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const next = postIndex > 0 ? posts[postIndex - 1] : null;

  return {
    props: {
      post,
      previous,
      next,
    },
  };
};
