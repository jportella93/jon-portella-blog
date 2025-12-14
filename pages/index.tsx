import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

export default function Index() {
  return (
    <Layout>
      <SEO title="Home" keywords={["blog", "javascript", "react"]} />
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
