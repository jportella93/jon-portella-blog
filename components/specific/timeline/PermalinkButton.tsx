import { rhythm } from "@/lib/typography";
import { useTheme } from "../../ThemeProvider";
import { PermalinkIcon } from "./PermalinkIcon";

interface PermalinkButtonProps {
  title: string;
  domId: string;
}

export const PermalinkButton = ({ title, domId }: PermalinkButtonProps) => {
  const { isDarkMode } = useTheme();

  const handleClick = async () => {
    try {
      // Update the URL hash
      const newUrl = new URL(window.location.href);
      newUrl.hash = domId;
      history.replaceState(null, "", newUrl.toString());

      // Scroll the element to the top of the viewport
      const element = document.getElementById(domId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Try to copy the URL to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(newUrl.toString());
      }
    } catch (error) {
      // If clipboard API fails, the hash is still updated so user can copy from address bar
      console.warn("Failed to copy URL to clipboard:", error);
    }
  };

  const linkColor = isDarkMode ? "#5ba3d3" : "#358ccb";

  return (
    <button
      onClick={handleClick}
      aria-label={`Copy link to ${title}`}
      style={{
        background: "none",
        border: "none",
        color: linkColor,
        cursor: "pointer",
        padding: rhythm(0.25),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        marginLeft: "auto",
        opacity: 0.7,
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.7";
      }}
    >
      <PermalinkIcon size={14} />
    </button>
  );
};
