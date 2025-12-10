import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  type TimelineCategory,
  type TimelineItem,
  getTimelineCategoryEmoji,
} from "../lib/timelineData";
import { rhythm } from "../lib/typography";
import { useTheme } from "./ThemeProvider";

interface TimelineListProps {
  itemsByType: {
    study: TimelineItem[];
    job: TimelineItem[];
    project: TimelineItem[];
  };
  onItemClick: (item: TimelineItem) => void;
}

export default function TimelineList({
  itemsByType,
  onItemClick,
}: TimelineListProps) {
  const { isDarkMode } = useTheme();
  const projectCategories = useMemo(() => {
    const unique = new Set<TimelineCategory>();
    itemsByType.project.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return Array.from(unique);
  }, [itemsByType.project]);

  const [selectedCategory, setSelectedCategory] = useState<
    TimelineCategory | "all"
  >("all");

  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !projectCategories.includes(selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [projectCategories, selectedCategory]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return itemsByType.project;
    return itemsByType.project.filter(
      (item) => item.category === selectedCategory
    );
  }, [itemsByType.project, selectedCategory]);

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMM YYYY");
  }

  function formatDateRange(
    startDate: string | null,
    endDate: string | null
  ): string {
    if (startDate && endDate)
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    if (startDate && !endDate) return `${formatDate(startDate)} - Present`;
    if (!startDate && endDate) return formatDate(endDate);
    return "Present";
  }

  const renderProjectFilters = () => {
    if (projectCategories.length === 0) return null;

    const options: Array<TimelineCategory | "all"> = [
      "all",
      ...projectCategories,
    ];

    return (
      <div
        role="radiogroup"
        style={{
          marginBottom: rhythm(1.25),
          display: "flex",
          gap: rhythm(0.5),
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {options.map((categoryOption) => {
          const isActive = selectedCategory === categoryOption;
          const label =
            categoryOption === "all"
              ? "All"
              : (CATEGORY_LABELS[categoryOption] ?? categoryOption);

          return (
            <button
              key={categoryOption}
              type="button"
              onClick={() => setSelectedCategory(categoryOption)}
              role="radio"
              aria-checked={isActive}
              style={{
                padding: `${rhythm(0.25)} ${rhythm(0.75)}`,
                borderRadius: "999px",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                background: isActive
                  ? THEME_COLORS.project.light
                  : "transparent",
                color: isActive ? "#fff" : isDarkMode ? "#eee" : "#333",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  };

  function renderTimelineSection(
    items: TimelineItem[],
    type: "study" | "job" | "project",
    title: string,
    borderColor: string,
    textColor: string
  ) {
    if (items.length === 0) return null;

    const getItemLabel = (item: TimelineItem) => {
      const emoji = getTimelineCategoryEmoji(item.category);
      return emoji ? `${emoji} ${item.title}` : item.title;
    };

    return (
      <div
        className="timeline-list-group"
        data-type={type}
        style={{ marginBottom: rhythm(2) }}
      >
        <h2
          className="timeline-list-group-title"
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "lowercase",
            marginBottom: rhythm(1),
            color: textColor,
          }}
        >
          {title}
        </h2>
        {type === "project" && renderProjectFilters()}
        {items
          .sort((a, b) => {
            const startA = a.startDate || a.endDate || "";
            const startB = b.startDate || b.endDate || "";
            return moment(startB).diff(moment(startA));
          })
          .map((item) => {
            const isOngoing = !item.endDate;

            return (
              <div
                key={item.title}
                className={`timeline-list-item ${isOngoing ? "ongoing" : ""}`}
                data-type={item.type}
                style={{
                  marginBottom: rhythm(1.5),
                  borderLeft: "3px solid",
                  borderLeftColor: borderColor,
                  paddingLeft: rhythm(1),
                  position: "relative",
                  borderLeftStyle: "solid",
                }}
              >
                <div
                  className="timeline-list-header"
                  onClick={() => onItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onItemClick(item);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    padding: `${rhythm(0.5)} 0`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      marginBottom: rhythm(0.25),
                    }}
                  >
                    {getItemLabel(item)}
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
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div>
      {renderTimelineSection(
        itemsByType.study,
        "study",
        "studies",
        THEME_COLORS.study.light,
        isDarkMode ? THEME_COLORS.study.dark : THEME_COLORS.study.light
      )}

      {renderTimelineSection(
        itemsByType.job,
        "job",
        "work",
        THEME_COLORS.job.light,
        isDarkMode ? THEME_COLORS.job.dark : THEME_COLORS.job.light
      )}

      {renderTimelineSection(
        filteredProjects,
        "project",
        "fun",
        THEME_COLORS.project.light,
        isDarkMode ? THEME_COLORS.project.dark : THEME_COLORS.project.light
      )}
    </div>
  );
}

const THEME_COLORS = {
  study: { light: "#2196f3", dark: "#64b5f6" },
  job: { light: "#9c27b0", dark: "#ba68c8" },
  project: { light: "#4caf50", dark: "#66bb6a" },
} as const;

const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  software: "Software",
  video: "Video",
  music: "Music",
  "music performance": "Music Performance",
};
