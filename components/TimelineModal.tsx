import moment from "moment";
import Image from "next/image";
import { TimelineItem } from "../lib/timelineData";
import { rhythm, scale } from "../lib/typography";
import { useDarkMode } from "../lib/useDarkMode";

interface TimelineModalProps {
  item: TimelineItem | null;
  onClose: () => void;
}

export default function TimelineModal({ item, onClose }: TimelineModalProps) {
  const isDarkMode = useDarkMode();

  if (!item) return null;

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMM YYYY");
  }

  function formatDateFull(dateString: string | null): string {
    if (!dateString) return "Present";
    return moment(dateString).format("MMMM YYYY");
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

  function isEmbeddableContent(link: string): boolean {
    return getYouTubeVideoId(link) !== null;
  }

  function renderEmbed(link: string) {
    const youtubeVideoId = getYouTubeVideoId(link);
    if (youtubeVideoId) {
      return (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            borderRadius: "8px",
          }}
        />
      );
    }
    return null;
  }

  function renderItemDetails(item: TimelineItem) {
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

        {item.link && isEmbeddableContent(item.link)
          ? renderEmbed(item.link)
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

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="timeline-item-link"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-block",
              marginTop: rhythm(0.5),
              color: isDarkMode ? "#5ba3d3" : "#358ccb",
              fontWeight: 500,
            }}
          >
            {isEmbeddableContent(item.link)
              ? "View on YouTube →"
              : `View ${item.type === "project" ? "Project" : "More"} →`}
          </a>
        )}

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
                    borderLeft: `2px solid ${
                      isDarkMode ? "#5ba3d3" : "#358ccb"
                    }`,
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
                  : isDarkMode
                  ? "#66bb6a"
                  : "#4caf50",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.type === "study"
              ? "Study"
              : item.type === "job"
              ? "work"
              : "fun"}
          </div>
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
            {formatDate(item.startDate)} -{" "}
            {formatDate(item.endDate)}
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
