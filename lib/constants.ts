// Site configuration constants
export const BASE_PATH = "";
export const SITE_URL = "https://jonportella.com";

export interface NavigationPage {
  label: string;
  url: string;
}

export const NAVIGATION_PAGES: NavigationPage[] = [
  { label: "Home", url: "/" },
  { label: "Blog", url: "/blog" },
  { label: "Timeline", url: "/timeline" },
];

export interface KeyboardShortcut {
  key: string;
  description: string;
  category?: "blog" | "navigation";
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: "n",
    description: "Navigate to next (newer) blog post",
    category: "blog",
  },
  {
    key: "p",
    description: "Navigate to previous (older) blog post",
    category: "blog",
  },
  {
    key: "r",
    description: "Navigate to a random blog post",
    category: "navigation",
  },
  { key: "h", description: "Navigate to homepage", category: "navigation" },
  { key: "/", description: "Open search modal", category: "navigation" },
  {
    key: "t",
    description: "Toggle theme",
    category: "navigation",
  },
];
