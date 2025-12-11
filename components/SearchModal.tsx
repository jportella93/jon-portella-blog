import {
  Action,
  ActionImpl,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  useRegisterActions,
} from "kbar";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { KEYBOARD_SHORTCUTS, NAVIGATION_PAGES } from "../lib/constants";
import type { PostMetadata } from "../lib/postsMetadata";
import { postsMetadata } from "../lib/postsMetadata";
import { rhythm } from "../lib/typography";
import { useTheme } from "./ThemeProvider";

function formatPostMeta(post: PostMetadata): string | null {
  const formattedDate = post.frontmatter.date
    ? new Date(post.frontmatter.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const readingTime = post.frontmatter.readingTimeMinutes;
  const meta = [formattedDate, readingTime && `${readingTime} min read`]
    .filter(Boolean)
    .join(" • ");

  return meta || null;
}

export default function SearchModal() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { searchQuery, query } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }));

  useEffect(() => {
    const handleSlashShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isInput) return;

      if (event.key === "/") {
        event.preventDefault();
        query.toggle();
      }
    };

    document.addEventListener("keydown", handleSlashShortcut);
    return () => document.removeEventListener("keydown", handleSlashShortcut);
  }, [query]);

  const postLookup = useMemo(
    () =>
      new Map<string, PostMetadata>(
        postsMetadata.map((post) => [`post-${post.slug}`, post])
      ),
    []
  );
  const pageLookup = useMemo(
    () => new Map(NAVIGATION_PAGES.map((page) => [`page-${page.url}`, page])),
    []
  );
  const shortcutLookup = useMemo(
    () =>
      new Map(
        KEYBOARD_SHORTCUTS.map((shortcut) => [
          `shortcut-${shortcut.key}`,
          shortcut,
        ])
      ),
    []
  );

  const actions = useMemo<Action[]>(() => {
    const postActions: Action[] = postsMetadata.map((post) => ({
      id: `post-${post.slug}`,
      name: post.frontmatter.title || post.slug,
      subtitle: post.frontmatter.spoiler,
      keywords: `${post.frontmatter.title ?? ""} ${
        post.frontmatter.spoiler ?? ""
      } ${post.slug} ${post.frontmatter.date ?? ""} ${formatPostMeta(post) ?? ""}`,
      section: "Posts",
      perform: () => router.push(`/blog/${post.slug}`),
    }));

    const navigationActions: Action[] = NAVIGATION_PAGES.map((page) => ({
      id: `page-${page.url}`,
      name: page.label,
      keywords: page.url,
      section: "Navigation",
      perform: () => router.push(page.url),
    }));

    const shortcutActions: Action[] = KEYBOARD_SHORTCUTS.map((shortcut) => ({
      id: `shortcut-${shortcut.key}`,
      name: shortcut.description,
      subtitle: `Shortcut: ${shortcut.key}`,
      keywords: `${shortcut.key} ${shortcut.description}`,
      section: "Keyboard Shortcuts",
      perform: () => {
        const syntheticEvent = new KeyboardEvent("keydown", {
          key: shortcut.key,
          bubbles: true,
        });
        document.dispatchEvent(syntheticEvent);
      },
    }));

    return [...postActions, ...navigationActions, ...shortcutActions];
  }, [router]);

  useRegisterActions(actions, [actions]);

  const { results } = useMatches();

  const showEmptyState = results.length === 0 && searchQuery.trim().length > 0;

  return (
    <KBarPortal>
      <KBarPositioner style={getModalStyle(isDarkMode)}>
        <KBarAnimator style={getContentStyle(isDarkMode)}>
          <KBarSearch
            style={getInputStyle(isDarkMode)}
            placeholder="Search anything..."
            aria-label="Search anything"
          />
          <div style={resultsStyle}>
            {showEmptyState ? (
              <div style={getNoResultsStyle(isDarkMode)}>
                No results found matching "{searchQuery}"
              </div>
            ) : (
              <KBarResults
                items={results}
                onRender={({ item, active }) =>
                  renderResultItem(
                    item,
                    active,
                    isDarkMode,
                    postLookup,
                    pageLookup,
                    shortcutLookup
                  )
                }
              />
            )}
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function renderResultItem(
  item: ActionImpl | string,
  active: boolean,
  isDarkMode: boolean,
  postLookup: Map<string, PostMetadata>,
  pageLookup: Map<string, (typeof NAVIGATION_PAGES)[number]>,
  shortcutLookup: Map<string, (typeof KEYBOARD_SHORTCUTS)[number]>
) {
  if (typeof item === "string") {
    return (
      <div style={getSectionStyle(isDarkMode)}>
        <h3 style={getSectionTitleStyle(isDarkMode)}>{item}</h3>
      </div>
    );
  }

  if (postLookup.has(item.id)) {
    const post = postLookup.get(item.id);
    if (!post) return null;

    const meta = formatPostMeta(post);

    return (
      <div style={getResultItemStyle(isDarkMode, active)}>
        <div style={getTitleStyle(isDarkMode)}>
          {post.frontmatter.title || post.slug}
        </div>
        {meta ? <p style={getDateStyle(isDarkMode)}>{meta}</p> : null}
        {post.frontmatter.spoiler ? (
          <p style={getSpoilerStyle(isDarkMode)}>{post.frontmatter.spoiler}</p>
        ) : null}
      </div>
    );
  }

  if (pageLookup.has(item.id)) {
    const page = pageLookup.get(item.id);
    if (!page) return null;

    return (
      <div style={getResultItemStyle(isDarkMode, active)}>
        <div style={getTitleStyle(isDarkMode)}>{page.label}</div>
      </div>
    );
  }

  if (shortcutLookup.has(item.id)) {
    const shortcut = shortcutLookup.get(item.id);
    if (!shortcut) return null;

    return (
      <div style={getResultItemStyle(isDarkMode, active)}>
        <div style={getShortcutItemStyle(isDarkMode)}>
          <kbd style={getKbdStyle(isDarkMode)}>{shortcut.key}</kbd>
          <span>{shortcut.description}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={getResultItemStyle(isDarkMode, active)}>
      <div style={getTitleStyle(isDarkMode)}>{item.name}</div>
      {item.subtitle ? (
        <p style={getSpoilerStyle(isDarkMode)}>{item.subtitle}</p>
      ) : null}
    </div>
  );
}

const resultsStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0",
};

function getModalStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: rhythm(4),
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  };
}

function getContentStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    borderRadius: rhythm(0.5),
    boxShadow: `0 ${rhythm(1)} ${rhythm(2.5)} rgba(0, 0, 0, 0.2)`,
    width: "90%",
    maxWidth: rhythm(32),
    maxHeight: rhythm(92),
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };
}

function getInputStyle(isDarkMode: boolean): React.CSSProperties {
  return {
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
}

function getResultItemStyle(
  isDarkMode: boolean,
  active: boolean
): React.CSSProperties {
  return {
    padding: `${rhythm(0.5)} ${rhythm(1)}`,
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#f0f0f0"}`,
    cursor: "pointer",
    transition: "background-color 0.2s",
    textDecoration: "none",
    display: "block",
    color: "inherit",
    backgroundColor: active
      ? isDarkMode
        ? "#2a2a2a"
        : "#f8f8f8"
      : "transparent",
  };
}

function getTitleStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    fontWeight: "bold",
    marginBottom: "4px",
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
  };
}

function getDateStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    fontSize: "12px",
    color: isDarkMode ? "#b3b3b3" : "#555",
    margin: 0,
    marginBottom: "4px",
  };
}

function getSpoilerStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    fontSize: "14px",
    color: isDarkMode ? "#ccc" : "#666",
    margin: 0,
  };
}

function getNoResultsStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    padding: rhythm(2),
    textAlign: "center",
    color: isDarkMode ? "#ccc" : "#666",
  };
}

function getSectionStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    padding: `${rhythm(0.5)} ${rhythm(1)}`,
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#f0f0f0"}`,
  };
}

function getSectionTitleStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: isDarkMode ? "#999" : "#666",
    marginBottom: rhythm(0.25),
    marginTop: 0,
  };
}

function getKbdStyle(isDarkMode: boolean): React.CSSProperties {
  return {
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
}

function getShortcutItemStyle(isDarkMode: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    marginBottom: rhythm(0.5),
    color: isDarkMode ? "#e0e0e0" : "#2B303A",
  };
}
