// Chart colours for the impact page.
//
// These are tuned versions of the brand purple and pink. The raw brand values
// do not pass the accessibility checks a chart needs: #7e639c sits just under
// the chroma floor and reads grey as a data mark, and #d479b2 only reaches
// 2.93:1 against white, under the 3:1 required for a mark you must be able to
// see. The values below were validated rather than eyeballed.
//
// Two-series pair (before/after), light mode on a white surface:
//   lightness band     PASS
//   chroma floor       PASS
//   CVD separation     PASS   worst pair dE 9.9 (protanopia), 18.6 (tritanopia)
//   normal-vision      PASS   worst pair dE 16.4
//   contrast vs white  PASS   both >= 3:1
export const SERIES_BEFORE = "#6b4f91";
export const SERIES_AFTER = "#c05f9c";

// Ordinal ramp for the sign-up funnel, where the order of the stages is part of
// the meaning, so the colour has to carry it. One hue, light to dark. The last
// two steps are the brand purple and brand dark exactly.
//   lightness monotone PASS
//   adjacent step gaps PASS
//   light-end contrast PASS   #9d84c0 at 3.23:1 vs white
//   single hue         PASS   3 degrees of spread
export const RAMP = ["#9d84c0", "#7e639c", "#5f4a7d"] as const;

// Chrome. Gridlines sit one step off the surface and stay hairline and solid.
export const SURFACE = "#ffffff";
export const GRID = "#e5ddf0";
export const AXIS_TEXT = "#6f6580";
