import { useEffect, useState } from "react";
import { rhythm } from "../lib/typography";
import { useTheme } from "./ThemeProvider";

export default function KeyboardNavHint() {
  const [hasKeyboard, setHasKeyboard] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const maybeHasKeyboard =
      "keyboard" in navigator ||
      window.matchMedia("(any-hover: hover)").matches ||
      window.matchMedia("(any-pointer: fine)").matches;
    const hasTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || false;

    setHasKeyboard(maybeHasKeyboard || !hasTouch);
  }, []);

  const hintStyle = {
    backgroundColor: isDarkMode
      ? "rgba(91, 163, 211, 0.1)"
      : "rgba(53, 140, 203, 0.1)",
    border: `1px solid ${
      isDarkMode ? "rgba(91, 163, 211, 0.2)" : "rgba(53, 140, 203, 0.2)"
    }`,
    color: isDarkMode ? "#e0e0e0" : "#1a1a1a",
    borderRadius: "4px",
    padding: `${rhythm(0.5)} ${rhythm(0.75)}`,
    marginTop: rhythm(1),
    marginBottom: rhythm(1),
    fontSize: "14px",
    display: "inline-block",
  };

  const kbdStyle = {
    fontFamily: "monospace",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5",
    border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
    borderRadius: "3px",
    padding: "2px 4px",
    margin: "0 2px",
    color: isDarkMode ? "#e0e0e0" : "#444",
    display: "inline-block",
    fontSize: ".85em",
    fontWeight: "bold",
    lineHeight: "1",
    whiteSpace: "nowrap" as const,
    boxShadow: `0 1px 0 ${
      isDarkMode ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"
    }`,
  };

  if (!hasKeyboard) {
    return null;
  }

  return (
    <div style={hintStyle}>
      <strong>Tip:</strong> Use keyboard shortcuts to navigate between posts:
      <br />
      <kbd style={kbdStyle}>n</kbd> for next (newer) post,
      <kbd style={kbdStyle}>p</kbd> for previous (older) post,
      <kbd style={kbdStyle}>r</kbd> for random post.
      <br />
      Type <kbd style={kbdStyle}>/shortcuts</kbd> to see more shortcuts.
    </div>
  );
}
