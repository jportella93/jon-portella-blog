import Image from "next/image";
import type { ReactElement } from "react";
import type { TimelineItem } from "../../../lib/timelineData";
import { rhythm } from "../../../lib/typography";
import { DemoVideoEmbed } from "./DemoVideoEmbed";
import { GitHubEmbed } from "./GitHubEmbed";
import { LazyIframe } from "./LazyIframe";
import {
  getGitHubEmbedUrl,
  getVimeoVideoId,
  getYouTubeVideoId,
} from "./timelineUtils";

interface TimelineDetailsProps {
  item: TimelineItem;
  isFirst?: boolean;
}

export const TimelineDetails = ({
  item,
  isFirst = false,
}: TimelineDetailsProps) => {
  const hasEmbeds = (item: TimelineItem): boolean => {
    return Boolean(
      item.demoVideo ||
      item.code ||
      getYouTubeVideoId(item.link) ||
      getVimeoVideoId(item.link) ||
      item.bandcampAlbumId ||
      // Check for GitHub embed in project link when no code property exists
      (item.type === "project" && !item.code && getGitHubEmbedUrl(item.link))
    );
  };

  const renderEmbed = (item: TimelineItem, isFirst: boolean = false) => {
    const embeds: ReactElement[] = [];

    if (item.demoVideo) {
      embeds.push(
        <DemoVideoEmbed
          key="demoVideo"
          videoUrl={item.demoVideo}
          isFirst={isFirst}
        />
      );
    }

    if (item.code) {
      const codeUrls = Array.isArray(item.code) ? item.code : [item.code];
      codeUrls.forEach((url, index) => {
        embeds.push(
          <GitHubEmbed
            key={`code-${index}`}
            repoUrl={url}
            disableLazy={!isFirst && index > 0}
            loading={isFirst && index === 0 ? "eager" : "lazy"}
          />
        );
      });
    }

    // Check for GitHub embed in project link when no code property exists
    if (item.type === "project" && !item.code && getGitHubEmbedUrl(item.link)) {
      embeds.push(
        <GitHubEmbed
          key="github-link"
          repoUrl={item.link}
          disableLazy={!isFirst}
          loading={isFirst ? "eager" : "lazy"}
        />
      );
    }

    const youtubeVideoId = getYouTubeVideoId(item.link);
    if (youtubeVideoId) {
      embeds.push(
        <div
          key="youtube"
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "56.25%", // 16:9 aspect ratio
            marginBottom: embeds.length > 0 ? rhythm(0.75) : 0,
          }}
        >
          <LazyIframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="YouTube video player"
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
          />
        </div>
      );
    }

    const vimeoVideoId = getVimeoVideoId(item.link);
    if (vimeoVideoId) {
      embeds.push(
        <div
          key="vimeo"
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "56.25%", // 16:9 aspect ratio
            marginBottom: embeds.length > 0 ? rhythm(0.75) : 0,
          }}
        >
          <LazyIframe
            src={`https://player.vimeo.com/video/${vimeoVideoId}`}
            title="Vimeo video player"
            width="100%"
            height="100%"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            disableLazy={isFirst}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "8px",
            }}
          />
        </div>
      );
    }

    if (item.bandcampAlbumId) {
      const trackParam = item.bandCampTrackId
        ? `/track=${item.bandCampTrackId}`
        : "";
      embeds.push(
        <LazyIframe
          key="bandcamp"
          src={`https://bandcamp.com/EmbeddedPlayer/album=${item.bandcampAlbumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false${trackParam}/transparent=true/`}
          title="Bandcamp embed"
          width="100%"
          height="470px"
          disableLazy={isFirst}
          style={{ border: 0, maxWidth: 350 }}
          frameBorder={0}
          seamless
        />
      );
    }

    if (embeds.length === 0) return null;
    if (embeds.length === 1) return embeds[0];
    return <div>{embeds}</div>;
  };

  const embedContent = renderEmbed(item, isFirst);
  const shouldShowImage = !hasEmbeds(item) && Boolean(item.image);

  return (
    <div style={{ marginTop: rhythm(0.5) }}>
      {item.description && (
        <p
          style={{
            margin: `0 0 ${rhythm(0.75)} 0`,
            lineHeight: 1.6,
            fontSize: "0.9rem",
          }}
        >
          {item.description}
        </p>
      )}

      {embedContent}

      {shouldShowImage && item.image && (
        <div
          style={{
            margin: `${rhythm(0.75)} 0`,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            width={300}
            height={200}
            style={{
              // Keep aspect ratio; never exceed viewport height; left-align when height-constrained.
              objectFit: "contain",
              borderRadius: "8px",
              display: "block",
              maxHeight: "100vh",
              maxWidth: "100%",
              width: "auto",
              height: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
};
