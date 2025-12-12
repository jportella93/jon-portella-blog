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
  type?: string;
  publishedTime?: string;
}

export default function SEO({
  description,
  lang = "en",
  meta = [],
  keywords = [],
  title,
  url,
  image,
  type = "website",
  publishedTime,
}: SEOProps) {
  const metaDescription = description || siteMetadata.description;
  const fullTitle = title
    ? `${title} | ${siteMetadata.title}`
    : siteMetadata.title;

  return (
    <Head>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="author" content="Jon Portella" />
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title || siteMetadata.title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {publishedTime && (
        <meta property="og:article:published_time" content={publishedTime} />
      )}

      {meta.map((m, i) => (
        <meta key={i} {...m} />
      ))}
    </Head>
  );
}
