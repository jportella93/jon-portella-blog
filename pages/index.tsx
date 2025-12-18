import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { siteMetadata } from "../lib/siteMetadata";
import {
  generateWebsiteSchema,
  type WebsiteSchema,
} from "../lib/structuredData";

export default function Index() {
  const homepageUrl = siteMetadata.siteUrl;

  const websiteSchema: WebsiteSchema = {
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: homepageUrl,
  };

  const structuredData = generateWebsiteSchema(websiteSchema);

  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </Head>
      <SEO
        title="Home"
        description={siteMetadata.description}
        canonical={homepageUrl}
        keywords={[
          "blog",
          "javascript",
          "react",
          "web development",
          "software engineering",
        ]}
      />
      <h1>Hi there, I'm Jon.</h1>
      <p>Welcome to my little corner on the WWW.</p>
      <p>
        Check out the{" "}
        <Link
          href="/timeline"
          style={{ color: "#358ccb", textDecoration: "none" }}
        >
          timeline
        </Link>{" "}
        for an overview of my work and what I'm up to these days.
      </p>
      <p>
        Browse the{" "}
        <Link href="/blog" style={{ color: "#358ccb", textDecoration: "none" }}>
          blog
        </Link>{" "}
        section for some of my writings on tech and other topics.
      </p>
      <p>
        And if you want to get in touch, you can find my email in the footer.
      </p>
      <p>Hope you enjoy your stay!</p>
    </Layout>
  );
}
