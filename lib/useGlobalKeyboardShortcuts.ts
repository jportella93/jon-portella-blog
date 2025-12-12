import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { getRandomPost } from "./postsMetadata";

export function useGlobalKeyboardShortcuts() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not typing in inputs/textareas
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isInput) {
        return;
      }

      // Don't trigger shortcuts if any modifier keys are pressed
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
        return;
      }

      // Handle theme toggle
      if (event.key === "t") {
        if (theme === "system") {
          // When on system, switch to the opposite of what system is currently showing
          const systemIsDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          setTheme(systemIsDark ? "light" : "dark");
        } else {
          // When on light or dark (opposite of system), switch back to system
          setTheme("system");
        }
        return;
      }

      // Handle home navigation
      if (event.key === "h") {
        router.push("/");
        return;
      }

      // Handle random post navigation
      if (event.key === "r") {
        // Get current post slug if on a blog post page
        const currentSlug =
          router.pathname === "/blog/[slug]"
            ? (router.query.slug as string)
            : undefined;

        const randomPost = getRandomPost(currentSlug);
        if (randomPost) {
          router.push(`/blog/${randomPost.slug}`);
        }
        return;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [router, theme, setTheme]);
}
