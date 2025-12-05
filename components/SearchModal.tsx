import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { KEYBOARD_SHORTCUTS, NAVIGATION_PAGES } from "../lib/constants";
import { searchPosts } from "../lib/postsMetadata";
import { rhythm } from "../lib/typography";
import { useTheme } from "./ThemeProvider";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function matchesQuery(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  return normalizedText.includes(normalizedQuery);
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const filteredPosts = hasQuery ? searchPosts(query) : [];
  const filteredPages = hasQuery
    ? NAVIGATION_PAGES.filter(
        (page) =>
          matchesQuery(page.label, query) || matchesQuery(page.url, query)
      )
    : [];
  const filteredShortcuts = hasQuery
    ? KEYBOARD_SHORTCUTS.filter(
        (shortcut) =>
          matchesQuery(shortcut.key, query) ||
          matchesQuery(shortcut.description, query)
      )
    : KEYBOARD_SHORTCUTS;

  const hasResults =
    filteredPosts.length > 0 ||
    filteredPages.length > 0 ||
    filteredShortcuts.length > 0;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "10vh",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "70vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: rhythm(1),
    border: "none",
    borderBottom: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
    backgroundColor: "transparent",
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
    fontSize: "18px",
    outline: "none",
    fontFamily: "inherit",
  };

  const resultsStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "0",
  };

  const resultItemStyle: React.CSSProperties = {
    padding: rhythm(1),
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#f0f0f0"}`,
    cursor: "pointer",
    transition: "background-color 0.2s",
    textDecoration: "none",
    display: "block",
    color: "inherit",
  };

  const resultItemHoverStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f8f8",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "4px",
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
  };

  const spoilerStyle: React.CSSProperties = {
    fontSize: "14px",
    color: isDarkMode ? "#ccc" : "#666",
    margin: 0,
  };

  const noResultsStyle: React.CSSProperties = {
    padding: rhythm(2),
    textAlign: "center",
    color: isDarkMode ? "#ccc" : "#666",
  };

  const sectionStyle: React.CSSProperties = {
    padding: rhythm(1),
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#f0f0f0"}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: isDarkMode ? "#999" : "#666",
    marginBottom: rhythm(0.75),
    marginTop: 0,
  };

  const kbdStyle: React.CSSProperties = {
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

  const shortcutItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: rhythm(0.5),
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
  };

  return (
    <div style={modalStyle} onClick={handleBackdropClick} ref={modalRef}>
      <div style={contentStyle}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
          aria-label="Search anything"
        />
        <div style={resultsStyle}>
          {hasQuery && !hasResults && (
            <div style={noResultsStyle}>
              No results found matching "{query}"
            </div>
          )}
          {filteredPosts.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Posts</h3>
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={resultItemStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, resultItemHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={onClose}
                >
                  <div style={titleStyle}>
                    {post.frontmatter.title || post.slug}
                  </div>
                  {post.frontmatter.spoiler && (
                    <p style={spoilerStyle}>{post.frontmatter.spoiler}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
          {filteredPages.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Navigation</h3>
              {filteredPages.map((page) => (
                <Link
                  key={page.url}
                  href={page.url}
                  style={resultItemStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, resultItemHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={onClose}
                >
                  <div style={titleStyle}>{page.label}</div>
                </Link>
              ))}
            </div>
          )}
          {filteredShortcuts.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Keyboard Shortcuts</h3>
              {filteredShortcuts.map((shortcut) => (
                <div key={shortcut.key} style={shortcutItemStyle}>
                  <kbd style={kbdStyle}>{shortcut.key}</kbd>
                  <span>{shortcut.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
