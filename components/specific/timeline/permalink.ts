// Permalink utilities for timeline entries

/**
 * Sanitizes a timeline item ID to create a safe DOM ID for URL fragments.
 * Converts any potentially unsafe characters to hyphens and prefixes with "timeline-".
 */
export function getTimelineDomId(id: string): string {
  // Replace any character that's not alphanumeric, hyphen, or underscore with a hyphen
  // Then prefix with "timeline-" and convert to lowercase
  const sanitized = id
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    // Collapse multiple consecutive hyphens into one
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  return `timeline-${sanitized}`;
}
