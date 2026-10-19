import { PIN_KEY, type DaylightState } from "./daylight";
import { themeAt } from "./palette";
import { createSun, type Place } from "./sun";

declare const PLACE: Place;

const TURN_MS = 460;
const root = document.documentElement;
const state: DaylightState = {
  sunlight: [0, 0, 0],
  glowAlpha: 0,
  isDark: null,
  onChange: null,
};
let turning = 0;

function turnSides() {
  root.classList.add("is-turning");
  clearTimeout(turning);
  turning = window.setTimeout(
    () => root.classList.remove("is-turning"),
    TURN_MS,
  );
}

function apply(elevation: number) {
  const theme = themeAt(elevation);
  root.style.setProperty("--page", theme.page);
  root.style.setProperty("--tile", theme.tile);
  root.style.setProperty("--raised", theme.raised);
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--ink-2", theme.ink2);
  root.style.setProperty("--ink-3", theme.ink3);
  root.classList.toggle("is-dark", theme.isDark);
  document.getElementById("theme-color")?.setAttribute("content", theme.page);
  if (state.isDark !== null && state.isDark !== theme.isDark) turnSides();
  state.isDark = theme.isDark;
  state.sunlight = theme.sunlight;
  state.glowAlpha = theme.glowAlpha;
  state.onChange?.();
}

function readPin(): number | null {
  try {
    const value = localStorage.getItem(PIN_KEY);
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
}

const sun = createSun(PLACE);
const pinned = readPin();
apply(sun.elevationAt(pinned ?? sun.nowMinutes()));
window.daylight = { place: PLACE, sun, pinned, state, apply };
