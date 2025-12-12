import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { LazyIframe } from "./LazyIframe";
import { getYouTubeVideoId } from "./timelineUtils";

interface DemoVideoEmbedProps {
  videoUrl?: string | null;
  isFirst?: boolean;
}

export const DemoVideoEmbed = ({
  videoUrl,
  isFirst = false,
}: DemoVideoEmbedProps): ReactElement | null => {
  const { isDarkMode } = useTheme();
  const linkColor = isDarkMode ? "#5ba3d3" : "#358ccb";
  const videoId = getYouTubeVideoId(videoUrl ?? null);
  const hasLoadedRef = useRef(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    hasLoadedRef.current = false;
    setLoadError(false);

    if (!videoId) return undefined;

    const timeoutId = window.setTimeout(() => {
      if (!hasLoadedRef.current) setLoadError(true);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [videoId]);

  if (!videoUrl) return null;

  if (!videoId || loadError) {
    return (
      <div style={{ margin: `${rhythm(0.75)} 0` }}>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            color: linkColor,
            fontWeight: 500,
          }}
        >
          View Demo Video →
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "56.25%", // 16:9 aspect ratio
        marginBottom: rhythm(0.75),
      }}
    >
      <LazyIframe
        key="demoVideo"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Demo video"
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        disableLazy={isFirst}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "8px",
        }}
        onLoad={() => {
          hasLoadedRef.current = true;
          setLoadError(false);
        }}
        onError={() => setLoadError(true)}
      />
    </div>
  );
};
