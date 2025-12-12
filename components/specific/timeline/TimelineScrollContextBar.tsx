import { useEffect, useState } from "react";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";

interface ScrollContextItem {
  domId: string;
  dateLabel: string;
  overarchingTitle: string;
  subTitle: string;
}

interface TimelineScrollContextBarProps {
  items: ScrollContextItem[];
}

export function TimelineScrollContextBar({
  items,
}: TimelineScrollContextBarProps) {
  const { isDarkMode } = useTheme();
  const [activeItem, setActiveItem] = useState<ScrollContextItem | null>(null);

  useEffect(() => {
    const findActiveItem = () => {
      // Find the last item whose top is at or above the threshold
      // Threshold is near the top of viewport, accounting for the fixed bar height
      const threshold = 100; // pixels from top of viewport

      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].domId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= threshold) {
            setActiveItem(items[i]);
            return;
          }
        }
      }

      // If no item is past the threshold, show the first item
      setActiveItem(items[0] || null);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          findActiveItem();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    findActiveItem();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  if (!activeItem) {
    return null;
  }

  const barStyle: React.CSSProperties = {
    position: "fixed",
    left: rhythm(2),
    right: rhythm(2),
    bottom: rhythm(1),
    zIndex: 100, // Above content but below navbar/progress bar (9999)
    backdropFilter: "blur(4px) saturate(180%)",
    WebkitBackdropFilter: "blur(4px) saturate(180%)", // Safari support
    background: isDarkMode
      ? "rgba(26, 26, 26, 0.85)"
      : "rgba(255, 255, 255, 0.85)",
    borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    padding: `${rhythm(0.25)} ${rhythm(0.5)}`,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: isDarkMode ? "#ccc" : "#666",
    display: "flex",
    alignItems: "center",
    gap: rhythm(0.5),
    minHeight: "24px",
    maxWidth: "800px", // Match timeline content width
    margin: "0 auto",
    boxShadow: isDarkMode
      ? "0 2px 16px rgba(0,0,0,0.4)"
      : "0 2px 16px rgba(0,0,0,0.15)",
    borderRadius: rhythm(1),
  };

  const dateStyle: React.CSSProperties = {
    fontWeight: 600,
    color: isDarkMode ? "#5ba3d3" : "#358ccb",
    whiteSpace: "nowrap",
  };

  const titleStyle: React.CSSProperties = {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div style={barStyle}>
      <span style={dateStyle}>{activeItem.dateLabel}</span>
      <span style={titleStyle}>
        {activeItem.overarchingTitle}
        {activeItem.subTitle && (
          <>
            {" • "}
            <span style={{ fontStyle: "italic" }}>{activeItem.subTitle}</span>
          </>
        )}
      </span>
    </div>
  );
}
