// Centralized timeline data
// Each item represents a study, job, or project with optional milestones

import timelineDataJson from "./timelineData.json";

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  type: "study" | "job" | "project";
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  startDate: string;
  endDate: string | null;
  milestones: TimelineMilestone[];
}

export const timelineData: TimelineItem[] = timelineDataJson as TimelineItem[];

// Helper function to get all unique dates for timeline axis
export function getAllTimelineDates(): string[] {
  const dates = new Set<string>();

  timelineData.forEach((item) => {
    if (item.startDate) dates.add(item.startDate);
    if (item.endDate) dates.add(item.endDate);
    item.milestones?.forEach((milestone) => {
      if (milestone.date) dates.add(milestone.date);
    });
  });

  return Array.from(dates).sort();
}

// Helper function to get items by type
export function getItemsByType(
  type: "study" | "job" | "project"
): TimelineItem[] {
  return timelineData.filter((item) => item.type === type);
}

// Helper function to get all items sorted by start date
export function getTimelineItemsSorted(): TimelineItem[] {
  return [...timelineData].sort((a, b) => {
    const dateA = a.startDate || "";
    const dateB = b.startDate || "";
    return dateA.localeCompare(dateB);
  });
}
