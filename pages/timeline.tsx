import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Timeline from "../components/Timeline";

export default function TimelinePage() {
  return (
    <Layout>
      <SEO
        title="Timeline"
        keywords={[
          "timeline",
          "gantt",
          "resume",
          "experience",
          "career",
          "projects",
        ]}
      />
      <Timeline />
    </Layout>
  );
}
