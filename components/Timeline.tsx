import { useEffect, useMemo, useState } from "react";
import {
  type TimelineItem,
  type TimelineMainItem,
  type TimelineMilestoneItem,
  type TimelineProject,
  timelineDataNested,
} from "../lib/timelineData";
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

export default function Timeline() {
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
      <h1>Timeline</h1>

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
