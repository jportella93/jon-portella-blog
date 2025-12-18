import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";
import { siteMetadata } from "../lib/siteMetadata";

export default function TimelinePage() {
  return (
    <Layout>
      <SEO
        title="Timeline"
        description="Interactive timeline showcasing Jon Portella's career journey, work experience, education, and notable projects in software engineering."
        canonical={`${siteMetadata.siteUrl}/timeline`}
        keywords={[
          "timeline",
          "gantt",
          "resume",
          "experience",
          "career",
          "projects",
          "software engineer",
          "web development",
        ]}
      />
      <Timeline />
    </Layout>
  );
}
