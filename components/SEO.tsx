import Head from "next/head";
import { siteMetadata } from "../lib/siteMetadata";

interface SEOProps {
  description?: string;
  lang?: string;
  meta?: Array<{ name?: string; property?: string; content: string }>;
  keywords?: string[];
  title?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noIndex?: boolean;
}

export default function SEO({
  description,
  lang = "en",
  meta = [],
  keywords = [],
  title,
  url,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  type = "website",
  publishedTime,
  modifiedTime,
  canonical,
  noIndex = false,
}: SEOProps) {
  const metaDescription = description || siteMetadata.description;
  const fullTitle = title
    ? `${title} | ${siteMetadata.title}`
    : siteMetadata.title;

  // Construct canonical URL
  const canonicalUrl =
    canonical ||
    url ||
    `${siteMetadata.siteUrl}${typeof window !== "undefined" ? window.location.pathname : ""}`;

  return (
    <Head>
      <html lang={lang} />
      <title>{fullTitle}</title>

      {/* Essential Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#358ccb" />
      <meta name="author" content="Jon Portella" />
      <meta name="description" content={metaDescription} />

      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title || siteMetadata.title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:locale" content="en_US" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {imageWidth && (
        <meta property="og:image:width" content={imageWidth.toString()} />
      )}
      {imageHeight && (
        <meta property="og:image:height" content={imageHeight.toString()} />
      )}
      {image && <meta property="og:image:type" content="image/jpeg" />}

      {/* Twitter/X Card */}
      <meta
        name="twitter:card"
        content={type === "article" ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title || siteMetadata.title} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {/* Article-specific meta tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={siteMetadata.author} />
      )}
      {type === "article" &&
        keywords.length > 0 &&
        keywords.map((keyword, i) => (
          <meta
            key={`article-tag-${i}`}
            property="article:tag"
            content={keyword}
          />
        ))}

      {/* Custom meta tags */}
      {meta.map((m, i) => (
        <meta key={i} {...m} />
      ))}
    </Head>
  );
}
