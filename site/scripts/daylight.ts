import type { Rgb } from "./palette";
import type { Place, Sun } from "./sun";

export const PIN_KEY = "daylight-pinned-minutes";

export interface DaylightState {
  sunlight: Rgb;
  glowAlpha: number;
  isDark: boolean | null;
  onChange: (() => void) | null;
}

export interface Daylight {
  place: Place;
  sun: Sun;
  pinned: number | null;
  state: DaylightState;
  apply(elevation: number): void;
}

declare global {
  interface Window {
    daylight: Daylight;
  }
}
