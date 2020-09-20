import { LightThemeMove, DarkThemeMove } from "baseui";

const BREAKPOINTS = {
  small: 400,
  medium: 800,
  large: 1200,
};

const MEDIA_QUERY = {
  small: `@media screen and (min-width: ${BREAKPOINTS.small}px)`,
  medium: `@media screen and (min-width: ${BREAKPOINTS.medium}px)`,
  large: `@media screen and (min-width: ${BREAKPOINTS.large}px)`,
};

const lightTheme = {
  ...LightThemeMove,
  breakpoints: BREAKPOINTS,
  mediaQuery: MEDIA_QUERY,
};

const darkTheme = {
  ...DarkThemeMove,
  breakpoints: BREAKPOINTS,
  mediaQuery: MEDIA_QUERY,
};

export { MEDIA_QUERY, BREAKPOINTS, lightTheme, darkTheme };
