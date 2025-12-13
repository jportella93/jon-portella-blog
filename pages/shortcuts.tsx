"use client";

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { useTheme } from "../components/ThemeProvider";
import { KEYBOARD_SHORTCUTS } from "../lib/constants";
import { rhythm } from "../lib/typography";

export default function ShortcutsPage() {
  const { isDarkMode } = useTheme();

  const kbdStyle = {
    fontFamily: "monospace",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5",
    border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
    borderRadius: "3px",
    padding: "2px 6px",
    marginRight: rhythm(0.5),
    fontSize: "14px",
    color: isDarkMode ? "#e0e0e0" : "#444",
    display: "inline-block",
    boxShadow: `0 1px 0 ${
      isDarkMode ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"
    }`,
  };

  const blogShortcuts = KEYBOARD_SHORTCUTS.filter((s) => s.category === "blog");
  const navigationShortcuts = KEYBOARD_SHORTCUTS.filter(
    (s) => s.category === "navigation"
  );

  return (
    <Layout>
      <SEO
        title="Keyboard Shortcuts"
        description="Keyboard shortcuts available on this site"
        url="https://jonportella.com/shortcuts"
      />
      <h1>Keyboard Shortcuts</h1>

      <p
        style={{
          marginBottom: rhythm(1),
          color: isDarkMode ? "#e0e0e0" : "#2B303A",
        }}
      >
        Use these keyboard shortcuts to navigate the site more efficiently.
      </p>

      <h2>Blog Posts</h2>
      <div style={{ marginBottom: rhythm(2) }}>
        {blogShortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: rhythm(0.5),
            }}
          >
            <kbd style={kbdStyle}>{shortcut.key}</kbd>
            <span style={{ color: isDarkMode ? "#e0e0e0" : "#2B303A" }}>
              {shortcut.description}
            </span>
          </div>
        ))}
      </div>

      <h2>Site Navigation</h2>
      <div style={{ marginBottom: rhythm(2) }}>
        {navigationShortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: rhythm(0.5),
            }}
          >
            <kbd style={kbdStyle}>{shortcut.key}</kbd>
            <span style={{ color: isDarkMode ? "#e0e0e0" : "#2B303A" }}>
              {shortcut.description}
            </span>
          </div>
        ))}
      </div>
    </Layout>
  );
}
