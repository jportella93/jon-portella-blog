import { useEffect, useMemo, useState } from "react";
import {
  type TimelineItem,
  type TimelineMainItem,
  type TimelineMilestoneItem,
  type TimelineProject,
  timelineDataNested,
} from "../lib/timelineData";
import { rhythm } from "../lib/typography";
import { getTimelineDomId } from "./specific/timeline/permalink";
import { TimelineFilterMenu } from "./specific/timeline/TimelineFilterMenu";
import { TimelineItemRenderer } from "./specific/timeline/TimelineItemRenderer";
import { TimelineMilestoneRenderer } from "./specific/timeline/TimelineMilestoneRenderer";
import { TimelineProjectRenderer } from "./specific/timeline/TimelineProjectRenderer";
import { TimelineScrollContextBar } from "./specific/timeline/TimelineScrollContextBar";
import {
  compareTimelineItemsNewestFirst,
  formatDateRange,
  getSortDate,
} from "./specific/timeline/timelineUtils";
import { useTimelineFilters } from "./specific/timeline/useTimelineFilters";
import { useTheme } from "./ThemeProvider";

export default function Timeline() {
  const { isDarkMode } = useTheme();
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  // Filter state and handlers
  const {
    selectedTypes,
    selectedCategories,
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    getAllAvailableTypes,
    getAllAvailableCategories,
    shouldShowItem,
    updateFilters,
  } = useTimelineFilters();

  const isFullMode =
    selectedTypes.size === getAllAvailableTypes.length &&
    selectedCategories.size === getAllAvailableCategories.length;
  const isCondensedMode = selectedTypes.size === 0 && selectedCategories.size === 0;

  const setFullMode = () => {
    updateFilters(
      new Set(getAllAvailableTypes),
      new Set(getAllAvailableCategories)
    );
  };

  const setCondensedMode = () => {
    updateFilters(new Set(), new Set());
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsNarrowScreen(window.innerWidth < 768); // Consider narrow screens < 768px
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  // Helper function to get display title (shortTitle if available and on narrow screens, otherwise title)
  const getDisplayTitle = useMemo(
    () =>
      (item: TimelineItem): string => {
        return (isNarrowScreen && item.shortTitle) || item.title;
      },
    [isNarrowScreen]
  );
  const combinedItems = useMemo(() => {
    const mainItems = timelineDataNested.filter(
      (item): item is TimelineMainItem =>
        item.type === "study" || item.type === "job"
    );
    const standaloneProjects = timelineDataNested.filter(
      (item): item is TimelineProject => item.type === "project"
    );
    const milestoneItems = timelineDataNested.filter(
      (item): item is TimelineMilestoneItem => item.type === "milestone"
    );

    return [...mainItems, ...standaloneProjects, ...milestoneItems].sort(
      (a, b) => {
        const dateA = new Date(getSortDate(a));
        const dateB = new Date(getSortDate(b));
        return dateB.getTime() - dateA.getTime();
      }
    );
  }, []);

  const scrollContextItems = useMemo(() => {
    const items: Array<{
      domId: string;
      dateLabel: string;
      overarchingTitle: string;
      subTitle: string;
    }> = [];

    combinedItems.forEach((item) => {
      if (item.type === "project") {
        // Standalone project
        items.push({
          domId: getTimelineDomId(item.id),
          dateLabel: formatDateRange(item.startDate, item.endDate),
          overarchingTitle: getDisplayTitle(item),
          subTitle: "",
        });
      } else if (item.type === "milestone") {
        // Standalone milestone
        items.push({
          domId: getTimelineDomId(item.id),
          dateLabel: formatDateRange(item.startDate, item.endDate),
          overarchingTitle: getDisplayTitle(item),
          subTitle: "",
        });
      } else {
        // Job/Study with potential nested items
        const mainItem = item as TimelineMainItem;
        const children = mainItem.projects ?? [];

        // Add the main item
        items.push({
          domId: getTimelineDomId(mainItem.id),
          dateLabel: formatDateRange(mainItem.startDate, mainItem.endDate),
          overarchingTitle: getDisplayTitle(mainItem),
          subTitle: "",
        });

        // Add nested items that pass the filter (already sorted in TimelineItemRenderer)
        const orderedNested = [...children].sort(
          compareTimelineItemsNewestFirst
        );
        orderedNested.filter(shouldShowItem).forEach((child) => {
          items.push({
            domId: getTimelineDomId(child.id),
            dateLabel: formatDateRange(child.startDate, child.endDate),
            overarchingTitle: getDisplayTitle(mainItem),
            subTitle: getDisplayTitle(child),
          });
        });
      }
    });

    return items;
  }, [combinedItems, getDisplayTitle, shouldShowItem]);

  return (
    <div data-timeline-container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: rhythm(1 / 2),
          // `h1` normally has a top margin from Typography.js, but wrapping it in a
          // flex container prevents margin-collapsing. Add explicit top spacing.
          marginTop: rhythm(2),
          marginBottom: rhythm(1),
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Timeline</h1>

        <div
          role="group"
          aria-label="Timeline mode"
          style={{
            display: "inline-flex",
            borderRadius: 999,
            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
            background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            padding: 2,
            gap: 2,
          }}
        >
          <button
            type="button"
            aria-pressed={isCondensedMode}
            onClick={setCondensedMode}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              background: isCondensedMode
                ? isDarkMode
                  ? "#5ba3d3"
                  : "#358ccb"
                : "transparent",
              color: isCondensedMode
                ? "#fff"
                : isDarkMode
                  ? "#e0e0e0"
                  : "#2b303a",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            Condensed mode
          </button>
          <button
            type="button"
            aria-pressed={isFullMode}
            onClick={setFullMode}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              background: isFullMode
                ? isDarkMode
                  ? "#5ba3d3"
                  : "#358ccb"
                : "transparent",
              color: isFullMode
                ? "#fff"
                : isDarkMode
                  ? "#e0e0e0"
                  : "#2b303a",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            Full
          </button>
        </div>
      </div>

      <TimelineScrollContextBar
        items={scrollContextItems}
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
      />

      <TimelineFilterMenu
        isOpen={isFilterMenuOpen}
        selectedTypes={selectedTypes}
        selectedCategories={selectedCategories}
        availableTypes={getAllAvailableTypes}
        availableCategories={getAllAvailableCategories}
        onUpdateFilters={updateFilters}
        onClose={() => setIsFilterMenuOpen(false)}
      />

      <div>
        {combinedItems.map((item, index) =>
          item.type === "project" ? (
            <TimelineProjectRenderer
              key={item.id}
              project={item}
              isFirst={index === 0}
            />
          ) : item.type === "milestone" ? (
            <TimelineMilestoneRenderer
              key={item.id}
              milestone={item}
              isFirst={index === 0}
            />
          ) : (
            <TimelineItemRenderer
              key={item.id}
              item={item}
              isFirst={index === 0}
              shouldShowItem={shouldShowItem}
            />
          )
        )}
      </div>
    </div>
  );
}
