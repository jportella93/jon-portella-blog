import { useState } from "react";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { LazyImage } from "./LazyImage";
import { getGitHubEmbedUrl } from "./timelineUtils";

interface GitHubEmbedProps {
  repoUrl: string;
  disableLazy?: boolean;
  loading?: "lazy" | "eager";
}

export const GitHubEmbed = ({
  repoUrl,
  disableLazy = false,
  loading,
}: GitHubEmbedProps) => {
  const { isDarkMode } = useTheme();
  const linkColor = isDarkMode ? "#5ba3d3" : "#358ccb";
  const [imageError, setImageError] = useState(false);
  const embedUrl = getGitHubEmbedUrl(repoUrl);
  const shouldShowEmbed = Boolean(embedUrl && !imageError);

  if (!shouldShowEmbed) {
    return (
      <div style={{ margin: `${rhythm(0.75)} 0` }}>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            color: linkColor,
            fontWeight: 500,
          }}
        >
          View Code on GitHub →
        </a>
      </div>
    );
  }

  return (
    <div style={{ margin: `${rhythm(0.75)} 0` }}>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block" }}
      >
        <LazyImage
          src={embedUrl}
          alt="GitHub repository preview"
          width={600}
          height={300}
          disableLazy={disableLazy}
          loading={loading}
          style={{
            maxWidth: "600px",
            width: "100%",
          }}
          onError={() => setImageError(true)}
        />
      </a>
    </div>
  );
};
