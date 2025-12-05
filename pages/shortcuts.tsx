import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { useTheme } from "../components/ThemeProvider";
import { rhythm } from "../lib/typography";

export default function ShortcutsPage() {
  const { isDark } = useTheme();

  const kbdStyle = {
    fontFamily: "monospace",
    backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
    border: `1px solid ${isDark ? "#555" : "#ddd"}`,
    borderRadius: "3px",
    padding: "2px 6px",
    marginRight: rhythm(0.5),
    fontSize: "14px",
    color: isDark ? "#e0e0e0" : "#444",
    display: "inline-block",
    boxShadow: `0 1px 0 ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
  };

  return (
    <Layout width="narrow">
      <SEO
        title="Keyboard Shortcuts"
        description="Keyboard shortcuts available on this site"
        url="https://jonportella.com/shortcuts"
      />
      <h1>Keyboard Shortcuts</h1>

      <p
        style={{
          marginBottom: rhythm(1),
          color: isDark ? "#e0e0e0" : "#2B303A",
        }}
      >
        Use these keyboard shortcuts to navigate the site more efficiently.
      </p>

      <h2>Blog Posts</h2>
      <div style={{ marginBottom: rhythm(2) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: rhythm(0.5),
          }}
        >
          <kbd style={kbdStyle}>n</kbd>
          <span style={{ color: isDark ? "#e0e0e0" : "#2B303A" }}>
            Navigate to next (newer) blog post
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <kbd style={kbdStyle}>p</kbd>
          <span style={{ color: isDark ? "#e0e0e0" : "#2B303A" }}>
            Navigate to previous (older) blog post
          </span>
        </div>
      </div>
    </Layout>
  );
}
