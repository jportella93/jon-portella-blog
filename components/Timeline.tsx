import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DataSet } from "vis-data";
import {
  TimelineOptions,
  Timeline as VisTimeline,
} from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { BASE_PATH } from "../lib/constants";
import {
  getTimelineCategoryEmoji,
  timelineData,
  type TimelineItem,
} from "../lib/timelineData";
import { rhythm, scale } from "../lib/typography";
import { useTheme } from "./ThemeProvider";
import TimelineList from "./TimelineList";
import TimelineModal, {
  ProfilePhotoModalItem,
  TimelineModalItem,
} from "./TimelineModal";
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
  style?: string;
  data?: TimelineModalItem;
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

const PROFILE_PHOTO_YEARS = [
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
] as const;

export default function timeline() {
  const router = useRouter();
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstanceRef = useRef<VisTimeline | null>(null);
  const [modalItem, setModalItem] = useState<TimelineModalItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // Get current time once to avoid re-computation issues
  const now = useMemo(() => moment(), []);

  const getItemStartDate = (item: TimelineItem) => {
    if (item.type === "project" && !item.startDate && item.endDate) {
      return moment(item.endDate).subtract(3, "months").startOf("month");
    }
    if (item.startDate) return moment(item.startDate);
    if (item.endDate) return moment(item.endDate);
    return now.clone();
  };

  const getItemLabel = (item: TimelineItem) => {
    const emoji = getTimelineCategoryEmoji(item.category);
    return emoji ? `${emoji} ${item.title}` : item.title;
  };

  // Helper function to create URL-safe slug from title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Helper function to find item by slug
  const findItemBySlug = (slug: string): TimelineModalItem | null => {
    // Check timeline data first
    const timelineItem = timelineData.find(
      (item) => createSlug(item.title) === slug
    );
    if (timelineItem) return timelineItem;

    // Check profile photos
    if (slug.startsWith("photo-")) {
      const year = parseInt(slug.replace("photo-", ""));
      if (
        PROFILE_PHOTO_YEARS.includes(
          year as (typeof PROFILE_PHOTO_YEARS)[number]
        )
      ) {
        const photoSrc = `${BASE_PATH || ""}/assets/${year}.jpeg`;
        return {
          id: `photo-${year}`,
          type: "photo",
          title: `Profile photo ${year}`,
          image: photoSrc,
          year,
          startDate: `${year}-01-01`,
          endDate: `${year}-01-31`,
          description: null,
          link: null,
          milestones: [],
        } as ProfilePhotoModalItem;
      }
    }

    return null;
  };

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
      getItemStartDate(a).diff(getItemStartDate(b))
    );

    // Track the end date of each lane
    const laneEndDates: Date[] = [];

    sortedItems.forEach((item) => {
      const itemStart = getItemStartDate(item);
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

      const startDate = getItemStartDate(item);
      const endDate =
        type === "project"
          ? item.endDate
            ? moment(item.endDate).endOf("month").toDate()
            : startDate.clone().add(1, "month").endOf("month").toDate()
          : item.endDate
            ? moment(item.endDate).endOf("month").toDate()
            : now.toDate();

      visItems.push({
        id: createSlug(item.title),
        group: groupId,
        content: getItemLabel(item),
        start: startDate.toDate(),
        end: endDate,
        type: "range",
        className: `timeline-item-${item.type}`,
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

    const photoItems: VisTimelineItem[] = PROFILE_PHOTO_YEARS.map((year) => {
      const photoStart = moment({ year }).startOf("year");
      const photoEnd = photoStart.clone().add(1, "months");
      const photoSrc = `${BASE_PATH || ""}/assets/${year}.jpeg`;

      const size = 56;
      const borderColor = isDarkMode ? "#555" : "#ddd";
      const backgroundColor = isDarkMode ? "#0f0f0f" : "#fafafa";

      const content = `
        <div
          style="
            display:flex;
            align-items:center;
            justify-content:center;
            width:${size}px;
            height:${size}px;
            padding:0;
            border-radius:8px;
            background:${backgroundColor};
            border:1px solid ${borderColor};
            box-shadow:0 2px 6px rgba(0,0,0,0.06);
            box-sizing:border-box;
          "
        >
          <div
            style="
              width:100%;
              height:100%;
              border-radius:8px;
              overflow:hidden;
              border:2px solid ${borderColor};
              background:${isDarkMode ? "#111" : "#f0f0f0"};
              box-sizing:border-box;
            "
          >
            <img
              src="${photoSrc}"
              alt="Jon Portella profile ${year}"
              loading="lazy"
              style="width:100%;height:100%;object-fit:contain;display:block;"
            />
          </div>
        </div>
      `;

      const photoData: ProfilePhotoModalItem = {
        id: `photo-${year}`,
        type: "photo",
        title: `Profile photo ${year}`,
        image: photoSrc,
        year,
        startDate: photoStart.format("YYYY-MM-DD"),
        endDate: photoEnd.format("YYYY-MM-DD"),
        description: null,
        link: null,
        milestones: [],
      };

      return {
        id: `photo-${year}`,
        group: "photos",
        content,
        start: photoStart.toDate(),
        end: photoEnd.toDate(),
        type: "range",
        style: `
          padding:0;
          height:${size}px;
          min-height:${size}px;
          max-height:${size}px;
          width:${size}px;
          min-width:${size}px;
          max-width:${size}px;
          display:flex;
          align-items:center;
          justify-content:center;
          box-sizing:border-box;
        `,
        data: photoData,
      };
    });

    allItems.push(...photoItems);
    allGroups.push({ id: "photos", content: "photos", order: -1 });

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
  }, [isDarkMode, itemsByType, now]);

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
          showModal(item.data);
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
    // Clear URL param
    const { item, ...otherQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: otherQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  function showModal(item: TimelineModalItem) {
    setModalItem(item);
    // Update URL with item slug
    const slug =
      item.type === "photo" ? `photo-${item.year}` : createSlug(item.title);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, item: slug },
      },
      undefined,
      { shallow: true }
    );
  }

  const handleListItemClick = (item: TimelineItem) => {
    showModal(item);
  };

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

  // Handle URL params for modal state
  useEffect(() => {
    const handleRouteChange = () => {
      const { item } = router.query;
      if (typeof item === "string") {
        const foundItem = findItemBySlug(item);
        if (foundItem) {
          setModalItem(foundItem);
        }
      } else if (!item) {
        setModalItem(null);
      }
    };

    // Check on mount
    if (router.isReady) {
      handleRouteChange();
    }

    // Listen for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.isReady, router.query, router.events]);

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
          minHeight: isLoading ? "500px" : "auto",
          overflow: "auto",
          background: isDarkMode ? "#1a1a1a" : "white",
          position: "relative",
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

      <TimelineList
        itemsByType={itemsByType}
        onItemClick={handleListItemClick}
      />

      <TimelineModal item={modalItem} onClose={closeModal} />
    </div>
  );
}
