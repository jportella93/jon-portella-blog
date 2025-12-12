import { useTheme } from "../../ThemeProvider";
import { LinkOutIcon } from "./LinkOutIcon";

interface TitleLinkOutProps {
  href: string;
  label: string;
}

export const TitleLinkOut = ({ href, label }: TitleLinkOutProps) => {
  const { isDarkMode } = useTheme();
  const linkColor = isDarkMode ? "#5ba3d3" : "#358ccb";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${label} in a new tab`}
      style={{
        color: linkColor,
        display: "inline",
        lineHeight: 1,
      }}
    >
      <LinkOutIcon size={14} />
    </a>
  );
};
