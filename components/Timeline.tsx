import moment from "moment";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DataSet } from "vis-data";
import {
  TimelineOptions,
  Timeline as VisTimeline,
} from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { timelineData, type TimelineItem } from "../lib/timelineData";
import { rhythm, scale } from "../lib/typography";
import { useDarkMode } from "../lib/useDarkMode";
import TimelineList from "./TimelineList";
import TimelineModal from "./TimelineModal";
import TimelineSkeleton from "./TimelineSkeleton";
import TimelineZoomControls from "./TimelineZoomControls";

interface VisTimelineItem {
  id: string;
  group: string;
  content: string;
  start: Date;
  end: Date | null;
  type: "range";
  className?: string;
  data?: TimelineItem;
}

const TIMELINE_CONSTANTS = {
  ZOOM_ANIMATION_DURATION: 250,
  MIN_DATE: "2011-01-01",
  ZOOM_MIN_MONTHS: 1,
  INITIALIZATION_RETRY_COUNT: 50,
  INITIALIZATION_RETRY_DELAY: 10,
  MODAL_FADE_DURATION: 0.2,
  MODAL_SLIDE_DURATION: 0.3,
} as const;

export default function timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstanceRef = useRef<VisTimeline | null>(null);
  const [modalItem, setModalItem] = useState<TimelineItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = useDarkMode();

  // Get current time once to avoid re-computation issues
  const now = useMemo(() => moment(), []);

  // Group items by type
  const itemsByType = useMemo(() => {
    return {
      study: timelineData.filter((item) => item.type === "study"),
      job: timelineData.filter((item) => item.type === "job"),
      project: timelineData.filter((item) => item.type === "project"),
    };
  }, []);

  // Function to assign items to lanes based on overlaps
  function assignItemsToLanes(
    items: TimelineItem[],
    now: moment.Moment
  ): Map<string, number> {
    const laneAssignments = new Map<string, number>();

    // Sort items by start date
    const sortedItems = [...items].sort((a, b) =>
      moment(a.startDate).diff(moment(b.startDate))
    );

    // Track the end date of each lane
    const laneEndDates: Date[] = [];

    sortedItems.forEach((item) => {
      const itemStart = moment(item.startDate);
      const itemEnd = item.endDate ? moment(item.endDate) : now;

      // Find the first lane that doesn't have an overlapping item
      let assignedLane = laneEndDates.findIndex((laneEnd) =>
        itemStart.isAfter(moment(laneEnd))
      );

      // If no available lane found, create a new one
      if (assignedLane === -1) {
        assignedLane = laneEndDates.length;
        laneEndDates.push(itemEnd.toDate());
      } else {
        // Update the lane's end date if this item extends it
        laneEndDates[assignedLane] = moment
          .max(moment(laneEndDates[assignedLane]), itemEnd)
          .toDate();
      }

      laneAssignments.set(item.title, assignedLane);
    });

    return laneAssignments;
  }

  // Helper function to process items of a specific type
  const processItemsByType = (
    items: TimelineItem[],
    type: "study" | "job" | "project",
    groupName: string,
    order: number,
    now: moment.Moment
  ) => {
    const lanes = assignItemsToLanes(items, now);
    const laneCount = Math.max(...Array.from(lanes.values()), -1) + 1;
    const visItems: VisTimelineItem[] = [];
    const groups: Array<{ id: string; content: string; order: number }> = [];

    items.forEach((item) => {
      const lane = lanes.get(item.title) || 0;
      const groupId = laneCount > 1 ? `${groupName}-${lane}` : groupName;

      let startDate: moment.Moment;
      let endDate: Date;

      if (type === "project") {
        // Projects show as one month long
        startDate = moment(item.startDate);
        endDate = startDate.clone().add(1, "month").endOf("month").toDate();
      } else {
        startDate = moment(item.startDate);
        endDate = item.endDate
          ? moment(item.endDate).endOf("month").toDate()
          : now.toDate();
      }

      visItems.push({
        id: item.title,
        group: groupId,
        content: item.title,
        start: startDate.toDate(),
        end: endDate,
        type: "range",
        className: `timeline-item-${item.type}${
          type !== "project" && !item.endDate ? " ongoing" : ""
        }`,
        data: item,
      });
    });

    // Create groups
    if (laneCount > 1) {
      for (let i = 0; i < laneCount; i++) {
        groups.push({
          id: `${groupName}-${i}`,
          content: i === 0 ? groupName : "",
          order,
        });
      }
    } else {
      groups.push({ id: groupName, content: groupName, order });
    }

    return { visItems, groups };
  };

  // Convert timeline data to vis-timeline format with lane assignments
  const { visItems, groups } = useMemo(() => {
    const allItems: VisTimelineItem[] = [];
    const allGroups: Array<{ id: string; content: string; order: number }> = [];

    // Process each type
    const types = [
      {
        items: itemsByType.study,
        type: "study" as const,
        groupName: "studies",
        order: 0,
      },
      {
        items: itemsByType.job,
        type: "job" as const,
        groupName: "work",
        order: 1,
      },
      {
        items: itemsByType.project,
        type: "project" as const,
        groupName: "fun",
        order: 2,
      },
    ];

    types.forEach(({ items, type, groupName, order }) => {
      const { visItems: typeItems, groups: typeGroups } = processItemsByType(
        items,
        type,
        groupName,
        order,
        now
      );
      allItems.push(...typeItems);
      allGroups.push(...typeGroups);
    });

    return {
      visItems: allItems,
      groups: allGroups,
    };
  }, [itemsByType, now]);

  // Initialize timeline - use multiple checks to ensure DOM is ready
  useLayoutEffect(() => {
    // Prevent multiple initializations
    if (timelineInstanceRef.current) {
      // Update existing timeline with new data
      const itemsDataSet = new DataSet(visItems);
      const groupsDataSet = new DataSet(groups);
      timelineInstanceRef.current.setData({
        items: itemsDataSet,
        groups: groupsDataSet,
      });
      return;
    }

    const itemsDataSet = new DataSet(visItems);
    const groupsDataSet = new DataSet(groups);

    const options: TimelineOptions = {
      horizontalScroll: true,
      max: new Date(),
      min: new Date(TIMELINE_CONSTANTS.MIN_DATE),
      moveable: true,
      orientation: "top",
      showMajorLabels: true,
      showMinorLabels: true,
      stackSubgroups: true,
      verticalScroll: true,
      zoomable: false,
      stack: true,
      showCurrentTime: true,
      zoomMin: 1000 * 60 * 60 * 24 * 30 * TIMELINE_CONSTANTS.ZOOM_MIN_MONTHS,
      format: {
        minorLabels: {
          month: "MMM",
          year: "YYYY",
        },
        majorLabels: {
          month: "YYYY",
          year: "YYYY",
        },
      },
    };

    const timeline = new VisTimeline(
      timelineRef.current,
      itemsDataSet,
      groupsDataSet,
      options
    );
    timelineInstanceRef.current = timeline;

    // Handle item click/select
    const handleItemSelect = (properties: { items: (string | number)[] }) => {
      if (properties.items && properties.items.length > 0) {
        const itemId = String(properties.items[0]);
        const item = visItems.find((i) => i.id === itemId);
        if (item?.data) {
          setModalItem(item.data);
        }
      }
    };

    timeline.on("select", handleItemSelect);
  }, [visItems, groups]);

  // Set loading to false after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  function closeModal() {
    setModalItem(null);
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.setSelection([]);
    }
  }

  function showModal(item: TimelineItem) {
    setModalItem(item);
  }

  function zoomIn() {
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.zoomIn(1, {
        animation: { duration: TIMELINE_CONSTANTS.ZOOM_ANIMATION_DURATION },
      });
    }
  }

  function zoomOut() {
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.zoomOut(1, {
        animation: { duration: TIMELINE_CONSTANTS.ZOOM_ANIMATION_DURATION },
      });
    }
  }

  // Cleanup timeline instance on unmount
  useEffect(() => {
    return () => {
      if (timelineInstanceRef.current) {
        timelineInstanceRef.current.destroy();
        timelineInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape" && modalItem) {
        closeModal();
      }
    }

    if (modalItem) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [modalItem]);

  return (
    <div style={{ width: "100%", marginTop: rhythm(2) }}>
      <h1 style={{ ...scale(1.2), marginBottom: rhythm(2) }}>Timeline</h1>

      <TimelineZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />

      <div
        className="timeline-wrapper"
        style={{
          width: "100%",
          border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
          borderRadius: "8px",
          overflow: "auto",
          background: isDarkMode ? "#1a1a1a" : "white",
          position: "relative",
          minHeight: "400px",
        }}
        suppressHydrationWarning
      >
        <div ref={timelineRef} className="timeline-vis-timeline" />
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDarkMode ? "#1a1a1a" : "white",
              zIndex: 10,
            }}
          >
            <TimelineSkeleton />
          </div>
        )}
      </div>

      <TimelineList itemsByType={itemsByType} onItemClick={showModal} />

      <TimelineModal item={modalItem} onClose={closeModal} />
    </div>
  );
}
