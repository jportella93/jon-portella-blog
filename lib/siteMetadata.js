// Centralized site metadata configuration
// Can be overridden by environment variables

const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH
const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
const siteUrl = baseUrl + basePath;

export const siteMetadata = {
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
export function getAssetPath(path) {
  // Remove leading slash if present, then add basePath
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}

