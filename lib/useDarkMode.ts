import { useEffect, useState } from "react";

/**
 * Custom hook to detect and track dark mode state.
 * Watches for changes to the 'dark' class on the document element.
 *
 * @returns {boolean} True if dark mode is active, false otherwise
 */
export function useDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    // Check initial state
    checkDarkMode();

    // Watch for changes to the class attribute
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}
