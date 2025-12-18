import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import KeyboardNavHint from "../../components/KeyboardNavHint";
import Layout from "../../components/Layout";
import ReadingProgressBar from "../../components/ReadingProgressBar";
import SEO from "../../components/SEO";
import SubscriptionNotice from "../../components/SubscriptionNotice";
import { EmailIcon } from "../../components/icons";
import {
  getAllPostsMetadata,
  type Post,
  type PostFrontmatter,
} from "../../lib/getAllPosts";
import { getPostBySlug } from "../../lib/markdown";
import { siteMetadata } from "../../lib/siteMetadata";
import {
  generateArticleSchema,
  type ArticleSchema,
} from "../../lib/structuredData";
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

  const readingTime = post.frontmatter.readingTimeMinutes;
  const meta = [
    date ? moment(date).format("MMMM DD, YYYY") : "",
    readingTime ? `${readingTime} min read` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const [imageUrl, setImageUrl] = React.useState("");

  // Generate structured data for the article
  const articleSchema: ArticleSchema = {
    headline: postTitle,
    description: spoiler || postDescriptionMetaTag,
    image: imageUrl || undefined,
    datePublished: date || new Date().toISOString(),
    dateModified: date || new Date().toISOString(), // Could be enhanced with lastModified if available
    author: {
      "@type": "Person",
      name: siteMetadata.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteMetadata.title,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  const structuredData = generateArticleSchema(articleSchema);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const img = document.querySelector("img");
      if (img) {
        setImageUrl(img.getAttribute("src") || "");
      }
    }
  }, []);

  // Handle skeleton hiding and image fade-in after hydration
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const handleImageLoad = (img: HTMLImageElement) => {
        img.style.opacity = "1";
        const skeleton = img.parentElement?.querySelector(
          ".blogImageSkeleton"
        ) as HTMLElement;
        if (skeleton) {
          skeleton.style.display = "none";
        }
      };

      const handleImageError = (img: HTMLImageElement) => {
        img.style.opacity = "1";
        const skeleton = img.parentElement?.querySelector(
          ".blogImageSkeleton"
        ) as HTMLElement;
        if (skeleton) {
          skeleton.style.display = "none";
        }
      };

      // Ensure DOM is ready after React renders dangerouslySetInnerHTML
      requestAnimationFrame(() => {
        // Handle already loaded/cached images
        const blogImages = document.querySelectorAll(".blogImageFrame img");
        blogImages.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          if (imageElement.complete && imageElement.naturalWidth > 0) {
            // Image is already loaded and successful
            handleImageLoad(imageElement);
          } else if (imageElement.complete && imageElement.naturalWidth === 0) {
            // Image failed to load
            handleImageError(imageElement);
          } else {
            // Image is still loading - attach listeners
            imageElement.addEventListener("load", () =>
              handleImageLoad(imageElement)
            );
            imageElement.addEventListener("error", () =>
              handleImageError(imageElement)
            );
          }
        });
      });
    }
  }, []);

  // Remove the first h1 tag from content if it exists (to avoid duplication with the title from frontmatter)
  const contentWithoutFirstH1 = React.useMemo(() => {
    if (!post.content) return post.content;
    // Remove the first <h1>...</h1> tag and any surrounding whitespace/newlines from the content
    return post.content.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, "");
  }, [post.content]);

  const mailtoLink = React.useMemo(() => {
    const subject = encodeURIComponent("jonportella.com blog post contact");
    const body = encodeURIComponent(
      `Regarding the post ${postTitle} ${postUrl}\n`
    );

    return `mailto:jportella93@gmail.com?subject=${subject}&body=${body}`;
  }, [postTitle, postUrl]);

  return (
    <Layout>
      <ReadingProgressBar />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </Head>
      <SEO
        title={postTitle}
        description={postDescriptionMetaTag}
        url={postUrl}
        canonical={postUrl}
        image={imageUrl}
        imageAlt={postTitle}
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
        {meta}
      </p>
      <div dangerouslySetInnerHTML={{ __html: contentWithoutFirstH1 }} />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: rhythm(0.5),
          margin: `${rhythm(1)} 0`,
        }}
      >
        <span>WDYT about this post? I read you here:</span>
        <a
          href={mailtoLink}
          aria-label="Email about this post"
          style={{ display: "inline-flex" }}
        >
          <EmailIcon />
        </a>
      </div>
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
