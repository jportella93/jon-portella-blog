// Centralized timeline data
// Each item represents a study, job, or project with optional milestones

import { compareTimelineItemsNewestFirst } from "../components/specific/timeline/timelineUtils";
import { BASE_PATH } from "./constants";
import postsMetadataJson from "./postsMetadata.json";
import timelineDataJson from "./timelineData.json";

export type TimelineCategory =
  | "software"
  | "video"
  | "music"
  | "music performance"
  | "writing";

export type TimelineProjectRelation = "role" | "side";

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

interface TimelineItemBase {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  image: string | null;
  link: string | null;
  bandcampAlbumId?: string;
  bandCampTrackId?: string;
  demoVideo?: string;
  code?: string;
  category?: TimelineCategory;
  parentId?: string;
  parentType?: "study" | "job";
  parentTitle?: string;
}

export interface TimelineProject extends TimelineItemBase {
  type: "project";
  category?: TimelineCategory;
  startDate: string | null;
  endDate: string | null;
  projectRelation?: TimelineProjectRelation;
}

export interface TimelineSideItem extends TimelineItemBase {
  type: "study" | "job";
  startDate: string | null;
  endDate: string | null;
}

export interface TimelineProfilePicture extends TimelineItemBase {
  type: "profile-picture";
  startDate: null;
  endDate: string;
}

export interface TimelineBlogPost extends TimelineItemBase {
  type: "blog-post";
  startDate: string | null;
  endDate: string;
  category: "writing";
  slug: string;
  readingTimeMinutes: number;
}

export interface TimelineMilestoneItem extends TimelineItemBase {
  type: "milestone";
  startDate: null;
  endDate: string;
}

export interface TimelineAwardItem extends TimelineItemBase {
  type: "award";
  startDate: null;
  endDate: string;
}

export type TimelineChildItem =
  | TimelineProject
  | TimelineSideItem
  | TimelineProfilePicture
  | TimelineBlogPost
  | TimelineAwardItem;

export interface TimelineMainItem extends TimelineItemBase {
  type: "study" | "job";
  startDate: string | null;
  endDate: string | null;
  projects?: TimelineChildItem[];
}

export type TimelineTreeItem =
  | TimelineMainItem
  | TimelineProject
  | TimelineProfilePicture
  | TimelineBlogPost
  | TimelineMilestoneItem
  | TimelineAwardItem;

export type TimelineItem = TimelineTreeItem;

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

// Helper function to get blog posts that fall within a date range
function getBlogPostsForPeriod(
  startDate: string | null,
  endDate: string | null
): TimelineBlogPost[] {
  const posts = postsMetadataJson;

  return posts
    .filter((post) => {
      if (!post.frontmatter.date) return false;
      const postDate = new Date(post.frontmatter.date);

      const periodStart = startDate ? new Date(startDate) : new Date(0);
      const periodEnd = endDate ? new Date(endDate) : new Date();

      return postDate >= periodStart && postDate <= periodEnd;
    })
    .map((post) => ({
      id: `blog-post-${post.slug}`,
      type: "blog-post" as const,
      category: "writing" as const,
      title: post.frontmatter.title || "Untitled",
      description: post.frontmatter.spoiler || "",
      image: null,
      link: processTimelineLink(`/blog/${post.slug}`),
      startDate: null,
      endDate: post.frontmatter.date || "",
      slug: post.slug,
      readingTimeMinutes: post.frontmatter.readingTimeMinutes || 0,
      milestones: [],
    }));
}

function processTimelineItem(item: TimelineTreeItem): TimelineTreeItem {
  if (item.type === "study" || item.type === "job") {
    const existingProjects = item.projects || [];
    const blogPosts = getBlogPostsForPeriod(item.startDate, item.endDate);

    return {
      ...item,
      link: processTimelineLink(item.link),
      projects: [...existingProjects, ...blogPosts]
        .map((project) =>
          project.type === "project"
            ? {
                ...project,
                link: processTimelineLink(project.link),
                projectRelation: project.projectRelation ?? "role",
              }
            : {
                ...project,
                link: processTimelineLink(project.link),
              }
        )
        .sort(compareTimelineItemsNewestFirst),
    } as TimelineMainItem;
  }

  if (item.type === "project") {
    return {
      ...item,
      link: processTimelineLink(item.link),
      projectRelation: item.projectRelation ?? "side",
    } as TimelineProject;
  }

  // For profile-picture, blog-post, etc.
  return {
    ...item,
    link: processTimelineLink(item.link),
  } as TimelineProfilePicture | TimelineBlogPost;
}

function flattenTimelineData(items: TimelineTreeItem[]): TimelineItem[] {
  const flat: TimelineItem[] = [];

  items.forEach((item) => {
    if (item.type === "project") {
      flat.push({ ...item });
      return;
    }

    if (item.type === "study" || item.type === "job") {
      flat.push({ ...item, projects: undefined });

      if (item.projects) {
        item.projects.forEach((project) => {
          flat.push({
            ...project,
            parentId: item.id,
            parentType: item.type,
            parentTitle: item.title,
          });
        });
      }
    } else {
      // profile-picture, blog-post and any other leaf-only items
      flat.push({ ...item });
    }
  });

  return flat;
}

export const timelineDataNested: TimelineTreeItem[] = (
  timelineDataJson as TimelineTreeItem[]
).map(processTimelineItem);

export const timelineData: TimelineItem[] =
  flattenTimelineData(timelineDataNested);

const CATEGORY_EMOJI: Record<TimelineCategory, string> = {
  software: "💻",
  video: "🎬",
  music: "🎵",
  "music performance": "🎤",
  writing: "✍️",
};

const TYPE_EMOJI: Record<string, string> = {
  study: "🎓",
  job: "💼",
  "profile-picture": "📸",
  milestone: "📍",
  "blog-post": "✍️",
  award: "🏆",
};

export function getTimelineCategoryEmoji(category?: TimelineCategory): string {
  if (!category) return "";
  return CATEGORY_EMOJI[category];
}

export function getTimelineTypeEmoji(type?: string): string {
  if (!type) return "";
  return TYPE_EMOJI[type] || "";
}

// Helper function to get all unique dates for timeline axis
export function getAllTimelineDates(): string[] {
  const dates = new Set<string>();

  timelineData.forEach((item) => {
    if (item.startDate) dates.add(item.startDate);
    if (item.endDate) dates.add(item.endDate);
  });

  return Array.from(dates).sort();
}

// Helper function to get items by type
export function getItemsByType(
  type: "study" | "job" | "project" | "profile-picture" | "milestone" | "award"
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
