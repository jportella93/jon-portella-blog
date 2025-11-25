import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { rhythm } from "../lib/typography";

export default function Index() {
  return (
    <Layout maxWidth={rhythm(22)}>
      <SEO title="Home" keywords={["blog", "javascript", "react"]} />

      <div
        style={{
          textAlign: "left",
          gap: rhythm(1),
        }}
      >
        <h1>Hi there, I'm Jon.</h1>
        <p>
          Welcome to my little corner on the WWW.
          <br />
          <br />
          Check out the{" "}
          <Link
            href="/timeline"
            style={{ color: "#358ccb", textDecoration: "none" }}
          >
            timeline
          </Link>{" "}
          for an overview of my work and what I'm up to these days. <br />
          <br />
          Browse the{" "}
          <Link
            href="/blog"
            style={{ color: "#358ccb", textDecoration: "none" }}
          >
            blog
          </Link>{" "}
          section for some of my writings on tech and other topics. <br />
          <br />
          And if you want to get in touch, you can find my contact information
          in the footer.
          <br />
          <br />
          Hope you enjoy your stay!
          <br />
        </p>
      </div>
    </Layout>
  );
}
