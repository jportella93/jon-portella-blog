import { useEffect, useMemo, useState } from "react";
import {
  type TimelineItem,
  type TimelineMainItem,
  type TimelineProject,
  timelineDataNested,
} from "../lib/timelineData";
import { getTimelineDomId } from "./specific/timeline/permalink";
import { TimelineItemRenderer } from "./specific/timeline/TimelineItemRenderer";
import { TimelineProjectRenderer } from "./specific/timeline/TimelineProjectRenderer";
import { TimelineScrollContextBar } from "./specific/timeline/TimelineScrollContextBar";
import {
  compareTimelineItemsNewestFirst,
  formatDateRange,
  getSortDate,
} from "./specific/timeline/timelineUtils";

export default function Timeline() {
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

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

    return [...mainItems, ...standaloneProjects].sort((a, b) => {
      const dateA = new Date(getSortDate(a));
      const dateB = new Date(getSortDate(b));
      return dateB.getTime() - dateA.getTime();
    });
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

        // Add nested items (already sorted in TimelineItemRenderer)
        const orderedNested = [...children].sort(
          compareTimelineItemsNewestFirst
        );
        orderedNested.forEach((child) => {
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
  }, [combinedItems, getDisplayTitle]);

  return (
    <div data-timeline-container>
      <h1>Timeline</h1>

      <TimelineScrollContextBar items={scrollContextItems} />

      <div>
        {combinedItems.map((item, index) =>
          item.type === "project" ? (
            <TimelineProjectRenderer
              key={item.id}
              project={item}
              isFirst={index === 0}
            />
          ) : (
            <TimelineItemRenderer
              key={item.id}
              item={item}
              isFirst={index === 0}
            />
          )
        )}
      </div>
    </div>
  );
}
