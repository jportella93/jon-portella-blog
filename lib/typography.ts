import Typography from "typography";
import Sutro from "typography-theme-sutro";

Sutro.overrideThemeStyles = () => {
  return {};
};

const typography = new Typography(Sutro);

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
