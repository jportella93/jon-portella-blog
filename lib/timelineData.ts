// Centralized timeline data
// Each item represents a study, job, or project with optional milestones

import { BASE_PATH } from "./constants";
import timelineDataJson from "./timelineData.json";

export type TimelineCategory = "software" | "video" | "music";

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  type: "study" | "job" | "project";
  category?: TimelineCategory;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
  milestones: TimelineMilestone[];
}

// Helper function to process links with base path
function processTimelineLink(link: string | null): string | null {
  if (!link) return null;

  // If it's an external link (starts with http), return as-is
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  // If it's a relative link starting with '/', prepend the base path
  if (link.startsWith("/")) {
    return BASE_PATH ? `${BASE_PATH}${link}` : link;
  }

  // Otherwise return as-is (shouldn't happen with current data)
  return link;
}

export const timelineData: TimelineItem[] = (
  timelineDataJson as TimelineItem[]
).map((item) => ({
  ...item,
  link: processTimelineLink(item.link),
}));

const CATEGORY_EMOJI: Record<TimelineCategory, string> = {
  software: "💻",
  video: "🎬",
  music: "🎵",
};

export function getTimelineCategoryEmoji(category?: TimelineCategory): string {
  if (!category) return "";
  return CATEGORY_EMOJI[category];
}

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
