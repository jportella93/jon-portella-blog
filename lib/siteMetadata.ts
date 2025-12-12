// Centralized site metadata configuration
import { BASE_PATH, SITE_URL } from "./constants";

const basePath = BASE_PATH;
const baseUrl = SITE_URL;
const siteUrl = baseUrl + basePath;

export interface SiteMetadata {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  basePath: string;
}

export const siteMetadata: SiteMetadata = {
  title: "Jon Portella",
  author: "Jon Portella",
  description:
    "Personal website of Jon Portella featuring a blog with tech articles and a work/education timeline.",
  siteUrl: siteUrl,
  basePath: basePath,
};

// Helper function to get asset path with base path
export function getAssetPath(path: string): string {
  // Remove leading slash if present, then add basePath
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}
