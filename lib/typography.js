import Typography from 'typography';
import Wordpress2016 from 'typography-theme-wordpress-2016';

Wordpress2016.overrideThemeStyles = () => {
  return {
    'body': {
      color: `#2B303A`,
    },
    'a': {
      color: `#358ccb`,
    },
  };
};

delete Wordpress2016.googleFonts;

const typography = new Typography(Wordpress2016);

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;

