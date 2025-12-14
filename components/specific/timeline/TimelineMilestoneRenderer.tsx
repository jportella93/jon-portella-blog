import type { TimelineItem } from "../../../lib/timelineData";
import { getTimelineTypeEmoji } from "../../../lib/timelineData";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { getTimelineDomId } from "./permalink";
import { PermalinkButton } from "./PermalinkButton";
import { TimelineDetails } from "./TimelineDetails";
import { THEME_COLORS } from "./timelineStyles";
import { formatDateFull } from "./timelineUtils";

interface TimelineMilestoneRendererProps {
  milestone: TimelineItem & { type: "milestone" };
  isFirst?: boolean;
}

export const TimelineMilestoneRenderer = ({
  milestone,
  isFirst = false,
}: TimelineMilestoneRendererProps) => {
  const { isDarkMode } = useTheme();
  const domId = getTimelineDomId(milestone.id);

  return (
    <div
      id={domId}
      key={milestone.id}
      data-type="milestone"
      style={{
        marginBottom: rhythm(1.5),
        borderLeft: "4px solid",
        borderLeftColor: THEME_COLORS.milestone.light,
        paddingLeft: rhythm(1),
        position: "relative",
        background: isDarkMode ? "#1c1c1c" : "#fafafa",
        borderRadius: "6px",
        paddingTop: rhythm(0.5),
        paddingBottom: rhythm(0.5),
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: THEME_COLORS.milestone.light,
          marginBottom: rhythm(0.125),
        }}
      >
        {getTimelineTypeEmoji(milestone.type)} Milestone
      </div>
      <div style={{ padding: `${rhythm(0.25)} 0` }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontWeight: 600,
            fontSize: "1.1rem",
            marginBottom: rhythm(0.125),
          }}
        >
          <span>{milestone.title}</span>
          <PermalinkButton title={milestone.title} domId={domId} />
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            color: isDarkMode ? "#999" : "#666",
            fontWeight: 500,
          }}
        >
          {formatDateFull(milestone.endDate)}
        </div>
      </div>
      <TimelineDetails item={milestone} isFirst={isFirst} />
    </div>
  );
};
