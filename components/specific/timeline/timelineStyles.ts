export const THEME_COLORS = {
  study: { light: "#2196f3", dark: "#64b5f6" },
  job: { light: "#9c27b0", dark: "#ba68c8" },
  project: { light: "#4caf50", dark: "#66bb6a" },
  profile: { light: "#ff9800", dark: "#ffb74d" },
  milestone: { light: "#f44336", dark: "#ef5350" }, // Red color for milestones
  award: { light: "#ffeb3b", dark: "#fdd835" }, // Yellow/gold color for awards
} as const;

export const getTypeColor = (type: string, isDarkMode: boolean) => {
  switch (type) {
    case "study":
      return isDarkMode ? THEME_COLORS.study.dark : THEME_COLORS.study.light;
    case "job":
      return isDarkMode ? THEME_COLORS.job.dark : THEME_COLORS.job.light;
    case "project":
      return isDarkMode
        ? THEME_COLORS.project.dark
        : THEME_COLORS.project.light;
    case "profile-picture":
      return isDarkMode
        ? THEME_COLORS.profile.dark
        : THEME_COLORS.profile.light;
    case "blog-post":
      return isDarkMode ? "#b39ddb" : "#9c88ff"; // Purple color for blog posts
    case "milestone":
      return isDarkMode
        ? THEME_COLORS.milestone.dark
        : THEME_COLORS.milestone.light;
    case "award":
      return isDarkMode ? THEME_COLORS.award.dark : THEME_COLORS.award.light;
    default:
      return isDarkMode ? "#5ba3d3" : "#358ccb";
  }
};
