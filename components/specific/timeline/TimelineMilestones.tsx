import moment from "moment";
import type { TimelineItem } from "../../../lib/timelineData";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { formatDateFull } from "./timelineUtils";

interface TimelineMilestonesProps {
  item: TimelineItem;
}

export const TimelineMilestones = ({ item }: TimelineMilestonesProps) => {
  const { isDarkMode } = useTheme();

  if (!item.milestones || item.milestones.length === 0) return null;

  return (
    <div style={{ marginTop: rhythm(1) }}>
      <h4 style={{ marginBottom: rhythm(0.5), fontSize: "1rem" }}>
        Milestones
      </h4>
      {item.milestones
        .slice()
        .sort((a, b) => moment(a.date).diff(moment(b.date)))
        .map((milestone, idx) => (
          <div
            key={`${milestone.title}-${idx}`}
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
  );
};
