import moment from "moment";
import type { TimelineItem } from "../../../lib/timelineData";

export const formatDate = (dateString: string | null): string =>
  dateString ? moment(dateString).format("MMM YYYY") : "Present";

export const formatDateFull = (dateString: string | null): string =>
  dateString ? moment(dateString).format("MMMM YYYY") : "Present";

export const formatDateRange = (
  startDate: string | null,
  endDate: string | null
): string => {
  if (startDate && endDate)
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  if (startDate && !endDate) return `${formatDate(startDate)} - Present`;
  if (!startDate && endDate) return formatDate(endDate);
  return "Present";
};

export const getSortDate = (item: TimelineItem) =>
  item.startDate || item.endDate || "";

export const getYouTubeVideoId = (url: string | null): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const getVimeoVideoId = (url: string | null): string | null => {
  if (!url) return null;
  const patterns = [
    /vimeo\.com\/(?:video\/)?(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const getGitHubEmbedUrl = (codeUrl: string | null): string | null => {
  if (!codeUrl) return null;
  const githubPattern = /github\.com\/([^\/]+)\/([^\/]+?)(?:\/|$)/;
  const match = codeUrl.match(githubPattern);
  if (!match) return null;
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\/$/, "").replace(/\.git$/, "");
  return `https://opengraph.githubassets.com/preview/${owner}/${cleanRepo}`;
};

export const getProjectRelationLabel = (
  item: TimelineItem,
  isNested = false
): string => {
  if (item.type === "profile-picture") return "";
  if (item.type === "blog-post") return "Blog post";
  if (item.type === "milestone") return "";
  if (item.type === "award") return "";
  if (item.type === "study") return "Side studies";
  if (item.type !== "project") return "Side role";
  if (item.projectRelation === "role" && isNested) return "";
  return item.projectRelation === "role" ? "Role project" : "Side project";
};

/**
 * Comparator for sorting timeline items newest→oldest (descending).
 * Uses endDate if present, otherwise startDate.
 * Treats null endDate as "Present" (newest).
 * Includes stable tie-breakers by title then id.
 */
export const compareTimelineItemsNewestFirst = (
  a: TimelineItem,
  b: TimelineItem
): number => {
  // Get effective sort date: endDate if present, otherwise startDate
  const getEffectiveDate = (item: TimelineItem): string | null =>
    item.endDate || item.startDate;

  const dateA = getEffectiveDate(a);
  const dateB = getEffectiveDate(b);

  // Null dates (Present) are considered newest, so they sort first
  if (dateA === null && dateB !== null) return -1;
  if (dateA !== null && dateB === null) return 1;
  if (dateA === null && dateB === null) {
    // Both null, use tie-breakers
  } else if (dateA !== null && dateB !== null) {
    // Both have dates, compare them (newest first)
    const comparison = dateA.localeCompare(dateB);
    if (comparison !== 0) return -comparison; // Negate for descending
    // Dates are equal, use tie-breakers
  }

  // Tie-breakers: title then id (ascending for stability)
  const titleComparison = a.title.localeCompare(b.title);
  if (titleComparison !== 0) return titleComparison;
  return a.id.localeCompare(b.id);
};
