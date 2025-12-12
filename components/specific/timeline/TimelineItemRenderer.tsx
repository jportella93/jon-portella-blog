import type { TimelineMainItem } from "../../../lib/timelineData";
import {
  getTimelineCategoryEmoji,
  getTimelineTypeEmoji,
} from "../../../lib/timelineData";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { getTimelineDomId } from "./permalink";
import { PermalinkButton } from "./PermalinkButton";
import { TimelineDetails } from "./TimelineDetails";
import { getTypeColor } from "./timelineStyles";
import {
  compareTimelineItemsNewestFirst,
  formatDateRange,
  getProjectRelationLabel,
} from "./timelineUtils";

interface TimelineItemRendererProps {
  item: TimelineMainItem;
  isFirst?: boolean;
}

export const TimelineItemRenderer = ({
  item,
  isFirst = false,
}: TimelineItemRendererProps) => {
  const { isDarkMode } = useTheme();
  const children = item.projects ?? [];

  // Sort all nested items chronologically (newest first), interleaving all types
  const orderedNested = [...children].sort(compareTimelineItemsNewestFirst);

  const domId = getTimelineDomId(item.id);

  return (
    <div
      id={domId}
      key={item.id}
      data-type={item.type}
      style={{
        marginBottom: rhythm(1.5),
      }}
    >
      <div style={{ padding: `${rhythm(0.5)} 0` }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: getTypeColor(item.type, isDarkMode),
            marginBottom: rhythm(0.125),
          }}
        >
          {getTimelineTypeEmoji(item.type)}{" "}
          {item.type === "study" ? "Study" : "Work"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontWeight: 600,
            fontSize: "1.1rem",
            marginBottom: rhythm(0.25),
          }}
        >
          <span>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.title} in a new tab`}
                style={{
                  color: isDarkMode ? "#5ba3d3" : "#358ccb",
                  textDecoration: "none",
                }}
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </span>
          <PermalinkButton title={item.title} domId={domId} />
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            color: isDarkMode ? "#999" : "#666",
          }}
        >
          {formatDateRange(item.startDate, item.endDate)}
        </div>
      </div>

      <TimelineDetails item={item} isFirst={isFirst} />

      {orderedNested.length > 0 && (
        <div style={{ marginTop: rhythm(1) }}>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: isDarkMode ? "#ccc" : "#666",
              marginBottom: rhythm(0.5),
            }}
          >
            Concurrent work
          </div>
          {orderedNested.map((child, childIndex) => (
            <div
              id={getTimelineDomId(child.id)}
              key={child.id}
              data-type={child.type}
              style={{
                marginBottom: rhythm(0.75),
                borderLeft: "2px solid",
                borderLeftColor: getTypeColor(child.type, isDarkMode),
                paddingLeft: rhythm(0.75),
                paddingRight: rhythm(0.75),
                position: "relative",
                borderLeftStyle: "solid",
                opacity: 0.95,
                background: isDarkMode ? "#1c1c1c" : "#fafafa",
                borderRadius: "6px",
                paddingTop: rhythm(0.5),
                paddingBottom: rhythm(0.5),
              }}
            >
              <div style={{ padding: `${rhythm(0.25)} 0` }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    fontWeight: 500,
                    fontSize: "1rem",
                    marginBottom: rhythm(0.125),
                  }}
                >
                  <span>
                    {(() => {
                      const label = getProjectRelationLabel(child, true);
                      const categoryPart =
                        child.type === "profile-picture"
                          ? ` · ${getTimelineTypeEmoji(child.type)}`
                          : ` · ${getTimelineCategoryEmoji(child.category)}`;
                      const prefix = label
                        ? `${label}${categoryPart}`
                        : categoryPart.slice(3); // Remove leading " · " if no label

                      return child.link ? (
                        <>
                          {prefix + " "}
                          <a
                            href={child.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${child.title} in a new tab`}
                            style={{
                              color: isDarkMode ? "#5ba3d3" : "#358ccb",
                              textDecoration: "none",
                            }}
                          >
                            {child.title}
                          </a>
                        </>
                      ) : (
                        <>
                          {prefix + " "}
                          {child.title}
                        </>
                      );
                    })()}
                  </span>
                  <PermalinkButton
                    title={child.title}
                    domId={getTimelineDomId(child.id)}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: isDarkMode ? "#aaa" : "#777",
                  }}
                >
                  {formatDateRange(child.startDate, child.endDate)}
                  {child.type === "blog-post" &&
                    child.readingTimeMinutes > 0 && (
                      <> • {child.readingTimeMinutes} min read</>
                    )}
                </div>
              </div>
              <TimelineDetails
                item={child}
                isFirst={isFirst && childIndex === 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
