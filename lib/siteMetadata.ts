// Centralized site metadata configuration
import { BASE_PATH, SITE_URL } from './constants';

const basePath = BASE_PATH;
const baseUrl = SITE_URL;
const siteUrl = baseUrl + basePath;

export interface SiteMetadata {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  basePath: string;
  social: {
    twitter: string;
  };
}

export const siteMetadata: SiteMetadata = {
  title: 'Jon Portella - Full Stack Developer',
  author: 'Jon Portella',
  description: 'Welcome to my website! Here you\'ll find articles and resources written by a Full Stack Developer.',
  siteUrl: siteUrl,
  basePath: basePath,
  social: {
    twitter: 'jportella93'
  },
};

// Helper function to get asset path with base path
export function getAssetPath(path: string): string {
  // Remove leading slash if present, then add basePath
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}






