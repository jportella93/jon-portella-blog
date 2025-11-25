import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataSet } from "vis-data";
import {
  TimelineOptions,
  Timeline as VisTimeline,
} from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { timelineData, type TimelineItem } from "../lib/timelineData";
import { rhythm, scale } from "../lib/typography";
import { useDarkMode } from "../lib/useDarkMode";

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

export default function Timeline3() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstanceRef = useRef<VisTimeline | null>(null);
  const [modalItem, setModalItem] = useState<TimelineItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isDarkMode = useDarkMode();

  // Group items by type
  const itemsByType = useMemo(() => {
    return {
      study: timelineData.filter((item) => item.type === "study"),
      job: timelineData.filter((item) => item.type === "job"),
      project: timelineData.filter((item) => item.type === "project"),
    };
  }, []);

  // Function to assign items to lanes based on overlaps
  function assignItemsToLanes(items: TimelineItem[]): Map<string, number> {
    const laneAssignments = new Map<string, number>();
    const now = moment();

    // Sort items by start date
    const sortedItems = [...items].sort((a, b) =>
      moment(a.startDate).diff(moment(b.startDate))
    );

    // For each item, find the first available lane that doesn't overlap
    sortedItems.forEach((item) => {
      const itemStart = moment(item.startDate);
      const itemEnd = item.endDate ? moment(item.endDate) : now;

      // Try lanes starting from 0
      let assignedLane = -1;
      for (let lane = 0; lane < sortedItems.length; lane++) {
        let hasOverlap = false;

        // Check if this lane conflicts with any already assigned item
        for (const [otherId, otherLane] of laneAssignments.entries()) {
          if (otherLane === lane) {
            const otherItem = items.find((i) => i.id === otherId);
            if (otherItem) {
              const otherStart = moment(otherItem.startDate);
              const otherEnd = otherItem.endDate
                ? moment(otherItem.endDate)
                : now;

              // Check if items overlap
              if (
                itemStart.isBefore(otherEnd) &&
                otherStart.isBefore(itemEnd)
              ) {
                hasOverlap = true;
                break;
              }
            }
          }
        }

        if (!hasOverlap) {
          assignedLane = lane;
          break;
        }
      }

      // If no lane found (shouldn't happen), assign to next available
      if (assignedLane === -1) {
        assignedLane = laneAssignments.size;
      }

      laneAssignments.set(item.id, assignedLane);
    });

    return laneAssignments;
  }

  // Convert timeline data to vis-timeline format with lane assignments
  const { visItems, groups } = useMemo(() => {
    const items: VisTimelineItem[] = [];
    const groupsList: Array<{ id: string; content: string; order: number }> =
      [];

    // Process studies
    const studyLanes = assignItemsToLanes(itemsByType.study);
    const studyLaneCount = Math.max(...Array.from(studyLanes.values()), -1) + 1;
    itemsByType.study.forEach((item) => {
      const lane = studyLanes.get(item.id) || 0;
      const groupId = studyLaneCount > 1 ? `studies-${lane}` : "studies";
      items.push({
        id: item.id,
        group: groupId,
        content: item.title,
        start: moment(item.startDate).toDate(),
        end: item.endDate
          ? moment(item.endDate).endOf("month").toDate()
          : moment().toDate(),
        type: "range",
        className: `timeline-item-${item.type}${
          item.endDate ? "" : " ongoing"
        }`,
        data: item,
      });
    });
    if (studyLaneCount > 1) {
      // Create separate groups for each lane, label only the first one
      for (let i = 0; i < studyLaneCount; i++) {
        groupsList.push({
          id: `studies-${i}`,
          content: i === 0 ? "studies" : "",
          order: 0,
        });
      }
    } else {
      groupsList.push({ id: "studies", content: "studies", order: 0 });
    }

    // Process jobs
    const jobLanes = assignItemsToLanes(itemsByType.job);
    const jobLaneCount = Math.max(...Array.from(jobLanes.values()), -1) + 1;
    itemsByType.job.forEach((item) => {
      const lane = jobLanes.get(item.id) || 0;
      const groupId = jobLaneCount > 1 ? `work-${lane}` : "work";
      items.push({
        id: item.id,
        group: groupId,
        content: item.title,
        start: moment(item.startDate).toDate(),
        end: item.endDate
          ? moment(item.endDate).endOf("month").toDate()
          : moment().toDate(),
        type: "range",
        className: `timeline-item-${item.type}${
          item.endDate ? "" : " ongoing"
        }`,
        data: item,
      });
    });
    if (jobLaneCount > 1) {
      // Create separate groups for each lane, label only the first one
      for (let i = 0; i < jobLaneCount; i++) {
        groupsList.push({
          id: `work-${i}`,
          content: i === 0 ? "work" : "",
          order: 1,
        });
      }
    } else {
      groupsList.push({ id: "work", content: "work", order: 1 });
    }

    // Process projects - show as one month each
    const projectLanes = assignItemsToLanes(itemsByType.project);
    const projectLaneCount =
      Math.max(...Array.from(projectLanes.values()), -1) + 1;
    itemsByType.project.forEach((item) => {
      const lane = projectLanes.get(item.id) || 0;
      const groupId = projectLaneCount > 1 ? `fun-${lane}` : "fun";
      const startDate = moment(item.startDate);
      // Projects show as one month long
      const endDate = startDate.clone().add(1, "month").endOf("month").toDate();
      items.push({
        id: item.id,
        group: groupId,
        content: item.title,
        start: startDate.toDate(),
        end: endDate,
        type: "range",
        className: `timeline-item-${item.type}`,
        data: item,
      });
    });
    if (projectLaneCount > 1) {
      // Create separate groups for each lane, label only the first one
      for (let i = 0; i < projectLaneCount; i++) {
        groupsList.push({
          id: `fun-${i}`,
          content: i === 0 ? "fun" : "",
          order: 2,
        });
      }
    } else {
      groupsList.push({ id: "fun", content: "fun", order: 2 });
    }

    return {
      visItems: items,
      groups: groupsList,
    };
  }, [itemsByType]);

  // Initialize timeline
  useEffect(() => {
    if (!timelineRef.current) return;

    const itemsDataSet = new DataSet(visItems);
    const groupsDataSet = new DataSet(groups);

    const options: TimelineOptions = {
      //     align?: TimelineAlignType;
      // autoResize: true,
      // clickToUse: true,
      // cluster?: TimelineOptionsCluster;
      // configure?: TimelineOptionsConfigureType;
      // dataAttributes?: TimelineOptionsDataAttributesType;
      // editable?: TimelineOptionsEditableType;
      // end?: DateType;
      // format?: TimelineFormatOption;
      // groupEditable?: TimelineOptionsGroupEditableType;
      groupHeightMode: "fixed",
      // groupOrder?: TimelineOptionsGroupOrderType;
      // groupOrderSwap?: TimelineOptionsGroupOrderSwapFunction;
      // groupTemplate?: TimelineOptionsTemplateFunction;
      // height?: HeightWidthType;
      // hiddenDates?: TimelineOptionsHiddenDatesType;
      horizontalScroll: true,
      height: 700,
      // horizontalScrollKey?: string;
      // horizontalScrollInvert?: boolean;
      // itemsAlwaysDraggable?: TimelineOptionsItemsAlwaysDraggableType;
      // locale?: string;
      // locales?: any; // TODO
      // longSelectPressTime?: number;
      // moment?: MomentConstructor;
      // margin?: TimelineOptionsMarginType;
      max: moment().toDate(),
      // maxHeight?: HeightWidthType;
      // maxMinorChars?: number;
      min: moment("2011-01-01").toDate(),
      // minHeight?: HeightWidthType;
      moveable: true,
      // multiselect?: boolean;
      // multiselectPerGroup?: boolean;
      // onAdd?: TimelineOptionsItemCallbackFunction;
      // onAddGroup?: TimelineOptionsGroupCallbackFunction;
      // onDropObjectOnItem?: any; // TODO
      // onInitialDrawComplete: () => {
      //   console.log("onInitialDrawComplete");
      // },
      // onMove?: TimelineOptionsItemCallbackFunction;
      // onMoveGroup?: TimelineOptionsGroupCallbackFunction;
      // onMoving?: TimelineOptionsItemCallbackFunction;
      // onRemove?: TimelineOptionsItemCallbackFunction;
      // onRemoveGroup?: TimelineOptionsGroupCallbackFunction;
      // order?: TimelineOptionsComparisonFunction;
      orientation: "top",
      // preferZoom?: boolean;
      // rollingMode: { follow: false, offset: 0 },
      // rtl?: boolean;
      // selectable?: boolean;
      // sequentialSelection?: boolean;
      // showCurrentTime?: boolean;
      showMajorLabels: true,
      showMinorLabels: true,
      // showWeekScale?: boolean;
      // showTooltips: true,
      // stack?: boolean;
      stackSubgroups: true,
      // snap: (date: Date, scale: string, step: number) => date,
      // template?: TimelineOptionsTemplateFunction;
      // visibleFrameTemplate?: TimelineOptionsTemplateFunction;
      // timeAxis?: TimelineTimeAxisOption;
      // type?: TimelineOptionsEventType;
      // tooltip?: TimelineTooltipOption;
      // tooltipOnItemUpdateTime?: boolean | { template(item: any): any };
      // verticalScroll: true,
      // width?: HeightWidthType;
      zoomable: false,
      // zoomKey?: TimelineOptionsZoomKey;
      // zoomFriction: 100,
      // zoomMax?: number;
      // zoomMin?: number;
      // xss?: TimelineXSSProtectionOption;
      stack: true,
      // editable: false,
      // selectable: true,
      showCurrentTime: true,
      zoomMin: 1000 * 60 * 60 * 24 * 30, // 1 month
      // zoomMax: 1000 * 60 * 60 * 24 * 365, // one year
      // groupOrder: "order",
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
      // tooltip: {
      //   followMouse: true,
      //   overflowMethod: "cap" as const,
      // },
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

    return () => {
      if (timelineInstanceRef.current) {
        timelineInstanceRef.current.destroy();
        timelineInstanceRef.current = null;
      }
    };
  }, [visItems, groups]);

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMM YYYY");
  }

  function formatDateFull(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMMM YYYY");
  }

  function closeModal() {
    setModalItem(null);
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.setSelection([]);
    }
  }

  function toggleExpand(itemId: string, item: TimelineItem) {
    const newExpanded = new Set(expandedItems);
    const wasExpanded = newExpanded.has(itemId);

    if (wasExpanded) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);

    // On desktop, show modal for all item types
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      if (!wasExpanded) {
        setModalItem(item);
      } else {
        setModalItem(null);
      }
    }
  }

  function zoomIn() {
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.zoomIn(1, { animation: { duration: 250 } });
    }
  }

  function zoomOut() {
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.zoomOut(1, { animation: { duration: 250 } });
    }
  }

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

  // Render item details for modal
  function renderItemDetails(item: TimelineItem) {
    return (
      <>
        {item.description && (
          <p
            style={{
              margin: `0 0 ${rhythm(0.75)} 0`,
              lineHeight: 1.6,
              fontSize: "0.9rem",
            }}
          >
            {item.description}
          </p>
        )}

        {item.image && (
          <div style={{ margin: `${rhythm(0.75)} 0` }}>
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "8px",
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="timeline3-item-link"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-block",
              marginTop: rhythm(0.5),
              color: isDarkMode ? "#5ba3d3" : "#358ccb",
              fontWeight: 500,
            }}
          >
            View {item.type === "project" ? "Project" : "More"} →
          </a>
        )}

        {item.milestones && item.milestones.length > 0 && (
          <div style={{ marginTop: rhythm(1) }}>
            <h4 style={{ ...scale(0.3), marginBottom: rhythm(0.5) }}>
              Milestones
            </h4>
            {item.milestones
              .sort((a, b) => moment(a.date).diff(moment(b.date)))
              .map((milestone, idx) => (
                <div
                  key={idx}
                  className="timeline3-milestone"
                  style={{
                    display: "flex",
                    gap: rhythm(0.75),
                    marginBottom: rhythm(0.75),
                    paddingLeft: rhythm(0.5),
                    borderLeft: `2px solid ${
                      isDarkMode ? "#5ba3d3" : "#358ccb"
                    }`,
                  }}
                >
                  <div
                    style={{
                      minWidth: "100px",
                      fontSize: "0.8rem",
                      color: isDarkMode ? "#999" : "#666",
                      fontWeight: 500,
                    }}
                  >
                    {formatDateFull(milestone.date)}
                  </div>
                  <div style={{ flex: 1, fontSize: "0.9rem" }}>
                    <strong>{milestone.title}</strong>
                    {milestone.description && (
                      <p style={{ margin: 0, marginTop: rhythm(0.25) }}>
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ width: "100%", marginTop: rhythm(2) }}>
      <h1 style={{ ...scale(1.2), marginBottom: rhythm(2) }}>Timeline</h1>

      {/* Mobile: Grouped by type */}
      <div className="timeline3-mobile-list">
        {/* Study section */}
        {itemsByType.study.length > 0 && (
          <div
            className="timeline3-mobile-group"
            data-type="study"
            style={{ marginBottom: rhythm(2) }}
          >
            <h2
              className="timeline3-mobile-group-title"
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "lowercase",
                marginBottom: rhythm(1),
                color: isDarkMode ? "#64b5f6" : "#2196f3",
              }}
            >
              studies
            </h2>
            {itemsByType.study
              .sort((a, b) => moment(b.startDate).diff(moment(a.startDate)))
              .map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const isOngoing = !item.endDate;

                return (
                  <div
                    key={item.id}
                    className={`timeline3-mobile-item ${
                      isOngoing ? "ongoing" : ""
                    }`}
                    data-type={item.type}
                    style={{
                      marginBottom: rhythm(1.5),
                      borderLeft: "3px solid #2196f3",
                      paddingLeft: rhythm(1),
                      position: "relative",
                      borderLeftStyle: isOngoing ? "dashed" : "solid",
                    }}
                  >
                    <div
                      className="timeline3-mobile-header"
                      onClick={() => toggleExpand(item.id, item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(item.id, item);
                        }
                      }}
                      aria-expanded={isExpanded}
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
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isDarkMode ? "#999" : "#666",
                        }}
                      >
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="timeline3-mobile-details"
                        style={{
                          marginTop: rhythm(1),
                          paddingTop: rhythm(1),
                          borderTop: `1px solid ${
                            isDarkMode ? "#444" : "#ddd"
                          }`,
                        }}
                      >
                        {renderItemDetails(item)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Job section */}
        {itemsByType.job.length > 0 && (
          <div
            className="timeline3-mobile-group"
            data-type="job"
            style={{ marginBottom: rhythm(2) }}
          >
            <h2
              className="timeline3-mobile-group-title"
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "lowercase",
                marginBottom: rhythm(1),
                color: isDarkMode ? "#ba68c8" : "#9c27b0",
              }}
            >
              work
            </h2>
            {itemsByType.job
              .sort((a, b) => moment(b.startDate).diff(moment(a.startDate)))
              .map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const isOngoing = !item.endDate;

                return (
                  <div
                    key={item.id}
                    className={`timeline3-mobile-item ${
                      isOngoing ? "ongoing" : ""
                    }`}
                    data-type={item.type}
                    style={{
                      marginBottom: rhythm(1.5),
                      borderLeft: "3px solid #9c27b0",
                      paddingLeft: rhythm(1),
                      position: "relative",
                      borderLeftStyle: isOngoing ? "dashed" : "solid",
                    }}
                  >
                    <div
                      className="timeline3-mobile-header"
                      onClick={() => toggleExpand(item.id, item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(item.id, item);
                        }
                      }}
                      aria-expanded={isExpanded}
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
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isDarkMode ? "#999" : "#666",
                        }}
                      >
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="timeline3-mobile-details"
                        style={{
                          marginTop: rhythm(1),
                          paddingTop: rhythm(1),
                          borderTop: `1px solid ${
                            isDarkMode ? "#444" : "#ddd"
                          }`,
                        }}
                      >
                        {renderItemDetails(item)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Project section */}
        {itemsByType.project.length > 0 && (
          <div
            className="timeline3-mobile-group"
            data-type="project"
            style={{ marginBottom: rhythm(2) }}
          >
            <h2
              className="timeline3-mobile-group-title"
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "lowercase",
                marginBottom: rhythm(1),
                color: isDarkMode ? "#66bb6a" : "#4caf50",
              }}
            >
              fun
            </h2>
            {itemsByType.project
              .sort((a, b) => moment(b.startDate).diff(moment(a.startDate)))
              .map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const isOngoing = !item.endDate;

                return (
                  <div
                    key={item.id}
                    className={`timeline3-mobile-item ${
                      isOngoing ? "ongoing" : ""
                    }`}
                    data-type={item.type}
                    style={{
                      marginBottom: rhythm(1.5),
                      borderLeft: "3px solid #4caf50",
                      paddingLeft: rhythm(1),
                      position: "relative",
                      borderLeftStyle: isOngoing ? "dashed" : "solid",
                    }}
                  >
                    <div
                      className="timeline3-mobile-header"
                      onClick={() => toggleExpand(item.id, item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(item.id, item);
                        }
                      }}
                      aria-expanded={isExpanded}
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
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isDarkMode ? "#999" : "#666",
                        }}
                      >
                        {formatDate(item.startDate)} -{" "}
                        {formatDate(item.endDate)}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="timeline3-mobile-details"
                        style={{
                          marginTop: rhythm(1),
                          paddingTop: rhythm(1),
                          borderTop: `1px solid ${
                            isDarkMode ? "#444" : "#ddd"
                          }`,
                        }}
                      >
                        {renderItemDetails(item)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: rhythm(0.5),
          marginBottom: rhythm(1),
          justifyContent: "flex-end",
        }}
      >
        <button
          className="timeline3-zoom-button"
          onClick={zoomOut}
          aria-label="Zoom out"
          style={{
            background: isDarkMode ? "#2a2a2a" : "white",
            border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
            borderRadius: "4px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isDarkMode ? "#e0e0e0" : "#333",
            transition: "all 0.2s ease",
            userSelect: "none",
            padding: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <button
          className="timeline3-zoom-button"
          onClick={zoomIn}
          aria-label="Zoom in"
          style={{
            background: isDarkMode ? "#2a2a2a" : "white",
            border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
            borderRadius: "4px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isDarkMode ? "#e0e0e0" : "#333",
            transition: "all 0.2s ease",
            userSelect: "none",
            padding: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
      </div>

      <div
        className="timeline3-wrapper"
        style={{
          width: "100%",
          border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
          borderRadius: "8px",
          overflow: "hidden",
          background: isDarkMode ? "#1a1a1a" : "white",
        }}
      >
        <div ref={timelineRef} className="timeline3-vis-timeline" />
      </div>

      {/* Modal */}
      {modalItem && (
        <div
          className="timeline3-modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: rhythm(2),
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            className="timeline3-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode ? "#2a2a2a" : "white",
              borderRadius: "12px",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              position: "relative",
              animation: "slideUp 0.3s ease",
              width: "100%",
            }}
          >
            <button
              className="timeline3-modal-close"
              onClick={closeModal}
              aria-label="Close"
              style={{
                position: "absolute",
                top: rhythm(1),
                right: rhythm(1),
                background: "transparent",
                border: "none",
                fontSize: "2rem",
                lineHeight: 1,
                cursor: "pointer",
                color: isDarkMode ? "#999" : "#666",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                zIndex: 1,
              }}
            >
              ×
            </button>
            <div
              className="timeline3-modal-header"
              style={{
                padding: `${rhythm(2)} ${rhythm(2)} ${rhythm(1)} ${rhythm(2)}`,
                borderBottom: `1px solid ${isDarkMode ? "#444" : "#eee"}`,
              }}
            >
              <div
                className="timeline3-modal-type"
                data-type={modalItem.type}
                style={{
                  fontSize: "0.75rem",
                  color:
                    modalItem.type === "study"
                      ? isDarkMode
                        ? "#64b5f6"
                        : "#2196f3"
                      : modalItem.type === "job"
                      ? isDarkMode
                        ? "#ba68c8"
                        : "#9c27b0"
                      : isDarkMode
                      ? "#66bb6a"
                      : "#4caf50",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: rhythm(0.5),
                }}
              >
                {modalItem.type === "study"
                  ? "Study"
                  : modalItem.type === "job"
                  ? "work"
                  : "fun"}
              </div>
              <h2
                className="timeline3-modal-title"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  margin: `0 0 ${rhythm(0.5)} 0`,
                }}
              >
                {modalItem.title}
              </h2>
              <div
                className="timeline3-modal-dates"
                style={{
                  fontSize: "0.9rem",
                  color: isDarkMode ? "#999" : "#666",
                }}
              >
                {formatDate(modalItem.startDate)} -{" "}
                {formatDate(modalItem.endDate)}
              </div>
            </div>
            <div
              className="timeline3-modal-content"
              style={{
                padding: rhythm(2),
              }}
            >
              {renderItemDetails(modalItem)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .timeline3-zoom-button:hover {
          background: #f5f5f5;
          border-color: #999;
        }

        .timeline3-zoom-button:active {
          background: #e0e0e0;
          transform: scale(0.95);
        }

        :global(html.dark) .timeline3-zoom-button {
          background: #2a2a2a;
          border-color: #444;
          color: #e0e0e0;
        }

        :global(html.dark) .timeline3-zoom-button:hover {
          background: #333;
          border-color: #666;
        }

        :global(html.dark) .timeline3-zoom-button:active {
          background: #3a3a3a;
        }

        :global(html.dark) .timeline3-wrapper {
          background: #1a1a1a;
          border-color: #444;
        }

        .timeline3-vis-timeline {
          width: 100%;
        }

        /* Override vis-timeline styles to match site theme */
        :global(.timeline3-vis-timeline .vis-timeline) {
          border: none;
          font-family: inherit;
          background: white;
        }

        :global(html.dark .timeline3-vis-timeline .vis-timeline) {
          background: #1a1a1a;
        }

        :global(.timeline3-vis-timeline .vis-item.vis-range) {
          border-radius: 4px;
          border-left-width: 4px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: ${rhythm(0.25)} ${rhythm(0.5)};
          font-size: 0.85rem;
        }

        :global(.timeline3-vis-timeline .vis-item.vis-range:hover) {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          z-index: 10;
        }

        :global(.timeline3-vis-timeline .vis-item.vis-selected) {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          z-index: 15;
        }

        /* Studies track - color coding */
        :global(.timeline3-vis-timeline .vis-item.timeline-item-study),
        :global(.timeline3-vis-timeline .vis-item[data-group="studies"]),
        :global(.timeline3-vis-timeline .vis-item[data-group^="studies-"]) {
          background-color: #e3f2fd !important;
          border-color: #2196f3 !important;
          color: #1976d2 !important;
        }

        :global(
            html.dark .timeline3-vis-timeline .vis-item.timeline-item-study
          ),
        :global(
            html.dark .timeline3-vis-timeline .vis-item[data-group="studies"]
          ),
        :global(
            html.dark .timeline3-vis-timeline .vis-item[data-group^="studies-"]
          ) {
          background-color: #1e3a5f !important;
          border-color: #2196f3 !important;
          color: #64b5f6 !important;
        }

        /* Work track - color coding */
        :global(.timeline3-vis-timeline .vis-item.timeline-item-job),
        :global(.timeline3-vis-timeline .vis-item[data-group="work"]),
        :global(.timeline3-vis-timeline .vis-item[data-group^="work-"]) {
          background-color: #f3e5f5 !important;
          border-color: #9c27b0 !important;
          color: #7b1fa2 !important;
        }

        :global(html.dark .timeline3-vis-timeline .vis-item.timeline-item-job),
        :global(html.dark .timeline3-vis-timeline .vis-item[data-group="work"]),
        :global(
            html.dark .timeline3-vis-timeline .vis-item[data-group^="work-"]
          ) {
          background-color: #4a2c5a !important;
          border-color: #9c27b0 !important;
          color: #ba68c8 !important;
        }

        /* Fun/Project track - color coding */
        :global(.timeline3-vis-timeline .vis-item.timeline-item-project),
        :global(.timeline3-vis-timeline .vis-item[data-group="fun"]),
        :global(.timeline3-vis-timeline .vis-item[data-group^="fun-"]) {
          background-color: #e8f5e9 !important;
          border-color: #4caf50 !important;
          color: #388e3c !important;
        }

        :global(
            html.dark .timeline3-vis-timeline .vis-item.timeline-item-project
          ),
        :global(html.dark .timeline3-vis-timeline .vis-item[data-group="fun"]),
        :global(
            html.dark .timeline3-vis-timeline .vis-item[data-group^="fun-"]
          ) {
          background-color: #2d4a2f !important;
          border-color: #4caf50 !important;
          color: #66bb6a !important;
        }

        /* Ongoing items */
        :global(.timeline3-vis-timeline .vis-item.ongoing) {
          border-left-style: dashed !important;
        }

        /* Hide all group labels - using color coding instead */
        :global(.timeline3-vis-timeline .vis-label) {
          display: none !important;
        }

        /* Hide the entire left sidebar containing group labels */
        :global(.timeline3-vis-timeline .vis-labelset) {
          display: none !important;
        }

        /* Time axis */
        :global(.timeline3-vis-timeline .vis-time-axis) {
          border-top: 2px solid #ddd;
        }

        :global(html.dark .timeline3-vis-timeline .vis-time-axis) {
          border-top-color: #444;
        }

        :global(.timeline3-vis-timeline .vis-text) {
          color: #666;
        }

        :global(html.dark .timeline3-vis-timeline .vis-text) {
          color: #999;
        }

        /* Today marker */
        :global(.timeline3-vis-timeline .vis-current-time) {
          background-color: #f44336;
          width: 2px;
          z-index: 20;
        }

        :global(.timeline3-vis-timeline .vis-current-time::before) {
          content: "";
          position: absolute;
          top: -6px;
          left: -4px;
          width: 10px;
          height: 10px;
          background: #f44336;
          border-radius: 50%;
        }

        /* Hide only horizontal grid lines - keep vertical lines for time reference */
        :global(.timeline3-vis-timeline .vis-grid.vis-horizontal) {
          display: none !important;
        }

        /* Keep vertical grid lines visible */
        :global(.timeline3-vis-timeline .vis-grid.vis-vertical) {
          display: block !important;
        }

        /* Hide group borders/separators that create horizontal lines */
        :global(.timeline3-vis-timeline .vis-group) {
          border-bottom: none !important;
          border-top: none !important;
        }

        /* Hide any panel borders */
        :global(.timeline3-vis-timeline .vis-panel) {
          border-bottom: none !important;
          border-top: none !important;
        }

        /* Hide content area borders */
        :global(.timeline3-vis-timeline .vis-content) {
          border-bottom: none !important;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        :global(html.dark) .timeline3-modal {
          background: #2a2a2a;
        }

        .timeline3-modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        :global(html.dark) .timeline3-modal-close {
          color: #999;
        }

        :global(html.dark) .timeline3-modal-close:hover {
          background: #444;
          color: #e0e0e0;
        }

        :global(html.dark) .timeline3-modal-header {
          border-bottom-color: #444;
        }

        .timeline3-modal-type[data-type="study"] {
          color: #2196f3;
        }

        :global(html.dark) .timeline3-modal-type[data-type="study"] {
          color: #64b5f6;
        }

        .timeline3-modal-type[data-type="job"] {
          color: #9c27b0;
        }

        :global(html.dark) .timeline3-modal-type[data-type="job"] {
          color: #ba68c8;
        }

        :global(html.dark) .timeline3-modal-type {
          color: #66bb6a;
        }

        .timeline3-modal-type[data-type="project"] {
          color: #4caf50;
        }

        :global(html.dark) .timeline3-modal-type[data-type="project"] {
          color: #66bb6a;
        }

        :global(html.dark) .timeline3-modal-dates {
          color: #999;
        }

        :global(html.dark) .timeline3-item-link {
          color: #5ba3d3;
        }

        :global(html.dark) .timeline3-milestone {
          border-left-color: #5ba3d3;
        }

        :global(html.dark) .timeline3-milestone-date {
          color: #999;
        }

        /* Mobile List Styles */
        .timeline3-mobile-list {
          display: none;
        }

        :global(html.dark)
          .timeline3-mobile-group[data-type="study"]
          .timeline3-mobile-group-title {
          color: #64b5f6;
        }

        :global(html.dark)
          .timeline3-mobile-group[data-type="job"]
          .timeline3-mobile-group-title {
          color: #ba68c8;
        }

        :global(html.dark)
          .timeline3-mobile-group[data-type="project"]
          .timeline3-mobile-group-title {
          color: #66bb6a;
        }

        :global(html.dark) .timeline3-mobile-dates {
          color: #999;
        }

        :global(html.dark) .timeline3-mobile-details {
          border-top-color: #444;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .timeline3-mobile-list {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
