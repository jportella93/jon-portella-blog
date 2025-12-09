import moment from "moment";
import Image from "next/image";
import React from "react";
import { TimelineItem, getTimelineCategoryEmoji } from "../lib/timelineData";
import { rhythm, scale } from "../lib/typography";
import { useTheme } from "./ThemeProvider";

export interface ProfilePhotoModalItem {
  id: string;
  type: "photo";
  title: string;
  image: string;
  year: number;
  startDate: string;
  endDate: string;
  description: string | null;
  link: null;
  milestones: [];
}

export type TimelineModalItem = TimelineItem | ProfilePhotoModalItem;

interface TimelineModalProps {
  item: TimelineModalItem | null;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function TimelineModal({
  item,
  onClose,
  onNavigate,
  hasPrev = false,
  hasNext = false,
}: TimelineModalProps) {
  const { isDarkMode } = useTheme();

  if (!item) return null;

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMM YYYY");
  }

  function formatDateRange(
    startDate: string | null,
    endDate: string | null
  ): string {
    if (startDate && endDate)
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    if (startDate && !endDate) return `${formatDate(startDate)} - Present`;
    if (!startDate && endDate) return formatDate(endDate);
    return "Present";
  }

  function formatDateFull(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMMM YYYY");
  }

  function getDateLabel(currentItem: TimelineModalItem): string {
    if (currentItem.type === "photo") {
      return String(currentItem.year);
    }
    return formatDateRange(currentItem.startDate, currentItem.endDate);
  }

  function getYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  function getGitHubEmbedUrl(codeUrl: string): string | null {
    // Match GitHub URLs like:
    // https://github.com/jportella93/make-me-drink-client
    // https://github.com/jportella93/jon-portella-blog/blob/f63a506ffad76809525e3af63c487880db9958eb/components/specific/InstagramCommentPickerApp.tsx
    // https://jportella93.github.io/flickr-gallery/
    const githubPattern = /github\.com\/([^\/]+)\/([^\/]+?)(?:\/|$)/;
    const match = codeUrl.match(githubPattern);
    if (match) {
      const [, owner, repo] = match;
      // Clean up repo name (remove trailing slashes, .git, etc.)
      const cleanRepo = repo.replace(/\/$/, "").replace(/\.git$/, "");
      // Use a random hash for the OpenGraph URL
      const hash = Math.random().toString(36).substring(2, 15);
      return `https://opengraph.githubassets.com/${hash}/${owner}/${cleanRepo}`;
    }
    return null;
  }

  function isEmbeddableContent(item: TimelineModalItem): boolean {
    if (item.type === "photo") return false;
    return (
      getYouTubeVideoId(item.link || "") !== null ||
      !!(item as any).bandcampAlbumId ||
      !!(item as any).demoVideo ||
      !!(item as any).code
    );
  }

  function GitHubEmbed({
    repoUrl,
    embedUrl,
  }: {
    repoUrl: string;
    embedUrl: string;
  }) {
    const [imageError, setImageError] = React.useState(false);

    if (imageError) return null;

    return (
      <div style={{ margin: `${rhythm(0.75)} 0` }}>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block" }}
        >
          <Image
            src={embedUrl}
            alt="GitHub repository preview"
            width={600}
            height={300}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              maxWidth: "600px",
            }}
            onError={() => setImageError(true)}
          />
        </a>
      </div>
    );
  }

  function renderEmbed(item: TimelineModalItem) {
    if (item.type === "photo") return null;

    const embeds: React.ReactElement[] = [];

    // Handle demoVideo - treat as YouTube URL
    const demoVideo = (item as any).demoVideo;
    if (demoVideo && demoVideo.trim()) {
      const youtubeVideoId = getYouTubeVideoId(demoVideo);
      if (youtubeVideoId) {
        embeds.push(
          <iframe
            key="demoVideo"
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="Demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              borderRadius: "8px",
              marginBottom: embeds.length > 0 ? rhythm(0.75) : 0,
            }}
          />
        );
      }
    }

    // Handle code - GitHub embed
    const code = (item as any).code;
    if (code && code.trim()) {
      const embedUrl = getGitHubEmbedUrl(code);
      if (embedUrl) {
        embeds.push(
          <GitHubEmbed key="code" repoUrl={code} embedUrl={embedUrl} />
        );
      }
    }

    // Handle YouTube links
    const youtubeVideoId = getYouTubeVideoId(item.link || "");
    if (youtubeVideoId) {
      embeds.push(
        <iframe
          key="youtube"
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            borderRadius: "8px",
            marginBottom: embeds.length > 0 ? rhythm(0.75) : 0,
          }}
        />
      );
    }

    // Handle Bandcamp
    const bandcampAlbumId = (item as any).bandcampAlbumId;
    if (bandcampAlbumId) {
      embeds.push(
        <iframe
          key="bandcamp"
          style={{ border: 0, width: "350px", height: "470px" }}
          src={`https://bandcamp.com/EmbeddedPlayer/album=${bandcampAlbumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`}
          seamless
          title="Bandcamp embed"
        >
          <a href={item.link || "#"}>Listen to the album on Bandcamp</a>
        </iframe>
      );
    }

    if (embeds.length === 0) return null;
    if (embeds.length === 1) return embeds[0];

    return <div>{embeds}</div>;
  }

  function renderItemDetails(item: TimelineModalItem) {
    if (item.type === "photo") {
      return (
        <div style={{ margin: `${rhythm(0.75)} 0` }}>
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={400}
            style={{
              objectFit: "cover",
              borderRadius: "8px",
              width: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              marginTop: rhythm(0.5),
              marginBottom: 0,
              color: isDarkMode ? "#ccc" : "#444",
              fontSize: "0.95rem",
            }}
          >
            That's me in {item.year}
          </p>
        </div>
      );
    }

    return (
      <>
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

        {(item.link && isEmbeddableContent(item)) ||
        (item as any).demoVideo ||
        (item as any).code
          ? renderEmbed(item)
          : item.image && (
              <div style={{ margin: `${rhythm(0.75)} 0` }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            )}

        {item.link || (item as any).demoVideo || (item as any).code ? (
          <div style={{ marginTop: rhythm(0.5) }}>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-item-link"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  marginBottom: rhythm(0.25),
                  color: isDarkMode ? "#5ba3d3" : "#358ccb",
                  fontWeight: 500,
                }}
              >
                {isEmbeddableContent(item)
                  ? getYouTubeVideoId(item.link || "") !== null
                    ? "View on YouTube →"
                    : (item as any).bandcampAlbumId
                      ? "View on Bandcamp →"
                      : `View ${item.type === "project" ? "Project" : "More"} →`
                  : `View ${item.type === "project" ? "Project" : "More"} →`}
              </a>
            )}
            {(item as any).demoVideo && (
              <a
                href={(item as any).demoVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-item-link"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  marginBottom: rhythm(0.25),
                  color: isDarkMode ? "#5ba3d3" : "#358ccb",
                  fontWeight: 500,
                }}
              >
                View Demo Video →
              </a>
            )}
            {(item as any).code && (
              <a
                href={(item as any).code}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-item-link"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  color: isDarkMode ? "#5ba3d3" : "#358ccb",
                  fontWeight: 500,
                }}
              >
                View Code on GitHub →
              </a>
            )}
          </div>
        ) : null}

        {item.milestones && item.milestones.length > 0 && (
          <div style={{ marginTop: rhythm(1) }}>
            <h4 style={{ ...scale(0.3), marginBottom: rhythm(0.5) }}>
              Milestones
            </h4>
            {item.milestones
              .sort((a, b) => moment(a.date).diff(moment(b.date)))
              .map((milestone, idx) => (
                <div
                  key={idx}
                  className="timeline-milestone"
                  style={{
                    display: "flex",
                    gap: rhythm(0.75),
                    marginBottom: rhythm(0.75),
                    paddingLeft: rhythm(0.5),
                    borderLeft: `2px solid ${isDarkMode ? "#5ba3d3" : "#358ccb"}`,
                  }}
                >
                  <div
                    style={{
                      minWidth: "100px",
                      fontSize: "0.8rem",
                      color: isDarkMode ? "#999" : "#666",
                      fontWeight: 500,
                    }}
                  >
                    {formatDateFull(milestone.date)}
                  </div>
                  <div style={{ flex: 1, fontSize: "0.9rem" }}>
                    <strong>{milestone.title}</strong>
                    {milestone.description && (
                      <p style={{ margin: 0, marginTop: rhythm(0.25) }}>
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </>
    );
  }

  const navigationButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: isDarkMode ? "#ccc" : "#FFF",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "42px",
    transition: "all 0.2s ease",
    zIndex: 1001,
  };

  return (
    <div
      className="timeline-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: rhythm(1),
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Floating Navigation Arrows */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.("prev");
          }}
          style={{
            ...navigationButtonStyle,
            left: "5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
          aria-label="Previous item"
        >
          ‹
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.("next");
          }}
          style={{
            ...navigationButtonStyle,
            right: "5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
          aria-label="Next item"
        >
          ›
        </button>
      )}

      <div
        className="timeline-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDarkMode ? "#2a2a2a" : "white",
          borderRadius: "12px",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
          animation: "slideUp 0.3s ease",
          width: "100%",
        }}
      >
        <div
          className="timeline-modal-header"
          style={{
            padding: `${rhythm(1)} ${rhythm(1)} ${rhythm(1)} ${rhythm(1)}`,
            borderBottom: `1px solid ${isDarkMode ? "#444" : "#eee"}`,
          }}
        >
          <div
            className="timeline-modal-type"
            data-type={item.type}
            style={{
              fontSize: "0.75rem",
              color:
                item.type === "study"
                  ? isDarkMode
                    ? "#64b5f6"
                    : "#2196f3"
                  : item.type === "job"
                    ? isDarkMode
                      ? "#ba68c8"
                      : "#9c27b0"
                    : item.type === "project"
                      ? isDarkMode
                        ? "#66bb6a"
                        : "#4caf50"
                      : isDarkMode
                        ? "#90a4ae"
                        : "#607d8b",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.type === "study"
              ? "Study"
              : item.type === "job"
                ? "work"
                : item.type === "project"
                  ? "fun"
                  : "photo"}
          </div>
          {item.type === "project" && item.category && (
            <div
              className="timeline-modal-category"
              style={{
                fontSize: "0.75rem",
                color: isDarkMode ? "#ccc" : "#666",
                fontWeight: 500,
                marginTop: "4px",
                textTransform: "capitalize",
              }}
            >
              {getTimelineCategoryEmoji(item.category)} {item.category}
            </div>
          )}
          <h2
            className="timeline-modal-title"
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {item.title}
          </h2>
          <div
            className="timeline-modal-dates"
            style={{
              fontSize: "0.9rem",
              color: isDarkMode ? "#999" : "#666",
            }}
          >
            {getDateLabel(item)}
          </div>
        </div>
        <div
          className="timeline-modal-content"
          style={{
            padding: rhythm(1),
          }}
        >
          {renderItemDetails(item)}
        </div>
      </div>
    </div>
  );
}
