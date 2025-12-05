import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ReadingProgressBar() {
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const documentElement = document.documentElement;
      const body = document.body;

      const scrollTop = window.pageYOffset || documentElement.scrollTop;
      const scrollHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        documentElement.clientHeight,
        documentElement.scrollHeight,
        documentElement.offsetHeight
      );
      const clientHeight = documentElement.clientHeight;

      const totalScroll = scrollHeight - clientHeight;
      const currentProgress =
        totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Calculate initial progress
    calculateProgress();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const barStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    backgroundColor: isDarkMode ? "#358ccb" : "#5ba3d3",
    transform: `scaleX(${progress / 100})`,
    transformOrigin: "left",
    transition: "transform 0.1s ease-out",
    zIndex: 9999,
    pointerEvents: "none",
  };

  return <div style={barStyle} aria-hidden="true" />;
}
