import type { TimelineItem } from "../../../lib/timelineData";
import { getTimelineCategoryEmoji } from "../../../lib/timelineData";
import { rhythm } from "../../../lib/typography";
import { useTheme } from "../../ThemeProvider";
import { TimelineDetails } from "./TimelineDetails";
import { THEME_COLORS } from "./timelineStyles";
import { formatDateRange, getProjectRelationLabel } from "./timelineUtils";
import { TitleLinkOut } from "./TitleLinkOut";
import { getTimelineDomId } from "./permalink";
import { PermalinkButton } from "./PermalinkButton";

interface TimelineProjectRendererProps {
  project: TimelineItem & { type: "project" };
  isFirst?: boolean;
}

export const TimelineProjectRenderer = ({
  project,
  isFirst = false,
}: TimelineProjectRendererProps) => {
  const { isDarkMode } = useTheme();
  const domId = getTimelineDomId(project.id);

  return (
    <div
      id={domId}
      key={project.id}
      data-type="project"
      style={{
        marginBottom: rhythm(1.5),
        borderLeft: "3px dashed",
        borderLeftColor: THEME_COLORS.project.light,
        paddingLeft: rhythm(1),
        position: "relative",
        borderLeftStyle: "dashed",
        background: isDarkMode ? "#1c1c1c" : "#fafafa",
        borderRadius: "6px",
        paddingTop: rhythm(0.5),
        paddingBottom: rhythm(0.5),
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: isDarkMode ? "#8bc34a" : THEME_COLORS.project.light,
          textTransform: "uppercase",
          marginBottom: rhythm(0.25),
        }}
      >
        {getProjectRelationLabel(project)}
      </div>
      <div style={{ padding: `${rhythm(0.25)} 0` }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontWeight: 600,
            fontSize: "1.05rem",
            marginBottom: rhythm(0.125),
          }}
        >
          <span>
            {getTimelineCategoryEmoji(project.category)} {project.title}{" "}
            {project.link && (
              <TitleLinkOut href={project.link} label={project.title} />
            )}
          </span>
          <PermalinkButton title={project.title} domId={domId} />
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: isDarkMode ? "#aaa" : "#666",
          }}
        >
          {formatDateRange(project.startDate, project.endDate)}
        </div>
      </div>
      <TimelineDetails item={project} isFirst={isFirst} />
    </div>
  );
};
