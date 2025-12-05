import { useRouter } from "next/router";
import { useEffect } from "react";

interface KeyboardNavigationProps {
  previous?: string | null;
  next?: string | null;
}

export function useKeyboardNavigation({
  previous,
  next,
}: KeyboardNavigationProps) {
  const router = useRouter();

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

      if (event.key === "n" && next) {
        router.push(`/blog/${next}`);
      } else if (event.key === "p" && previous) {
        router.push(`/blog/${previous}`);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [previous, next, router]);
}
