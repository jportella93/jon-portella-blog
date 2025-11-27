import { useDarkMode } from "../lib/useDarkMode";

interface TimelineZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function TimelineZoomControls({
  onZoomIn,
  onZoomOut,
}: TimelineZoomControlsProps) {
  const isDarkMode = useDarkMode();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        justifyContent: "flex-start",
      }}
    >
      <button
        className="timeline-zoom-button"
        onClick={onZoomOut}
        aria-label="Zoom out"
        style={{
          background: isDarkMode ? "#2a2a2a" : "white",
          border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
          borderRadius: "4px",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isDarkMode ? "#e0e0e0" : "#333",
          transition: "all 0.2s ease",
          userSelect: "none",
          padding: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
      <button
        className="timeline-zoom-button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        style={{
          background: isDarkMode ? "#2a2a2a" : "white",
          border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
          borderRadius: "4px",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isDarkMode ? "#e0e0e0" : "#333",
          transition: "all 0.2s ease",
          userSelect: "none",
          padding: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
    </div>
  );
}
