import { useTheme } from "./ThemeProvider";

export default function TimelineSkeleton() {
  const { isDark } = useTheme();

  const skeletonColors = [
    { bg: "#e3f2fd", border: "#2196f3" }, // study
    { bg: "#f3e5f5", border: "#9c27b0" }, // job
    { bg: "#e8f5e9", border: "#4caf50" }, // project
  ];

  return (
    <div
      className="timeline-skeleton"
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Time axis skeleton */}
      <div
        style={{
          height: "60px",
          borderBottom: `2px solid ${isDark ? "#444" : "#ddd"}`,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              width: "60px",
              height: "20px",
              background: isDark ? "#333" : "#f0f0f0",
              borderRadius: "4px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Timeline lanes skeleton */}
      <div style={{ padding: "20px" }}>
        {Array.from({ length: 6 }, (_, i) => {
          const color = skeletonColors[i % skeletonColors.length];
          // Use deterministic values instead of random to avoid hydration mismatches
          const widths = [35, 65, 45, 55, 75, 25];
          const heights = [28, 32, 26, 36, 30, 34];
          const positions = [5, 15, 8, 12, 3, 18];
          const width = widths[i % widths.length];
          const height = heights[i % heights.length];
          const left = positions[i % positions.length];

          return (
            <div
              key={i}
              style={{
                height: `${height}px`,
                marginBottom: "16px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  width: `${width}%`,
                  height: "100%",
                  background: isDark
                    ? `rgba(${
                        color.border === "#2196f3"
                          ? "33, 150, 243"
                          : color.border === "#9c27b0"
                          ? "156, 39, 176"
                          : "76, 175, 80"
                      }, 0.2)`
                    : color.bg,
                  border: `2px solid ${color.border}`,
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
