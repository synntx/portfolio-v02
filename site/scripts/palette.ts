type Lab = [number, number, number];
export type Rgb = [number, number, number];

export interface Theme {
  isDark: boolean;
  page: string;
  tile: string;
  raised: string;
  ink: string;
  ink2: string;
  ink3: string;
  sunlight: Rgb;
  glowAlpha: number;
}

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function toOklab(hex: string): Lab {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    toLinear(v / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function toRgb([L, a, b]: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const [red, green, blue] = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.round(clamp01(toGamma(clamp01(c))) * 255));
  return [red, green, blue];
}

function toCss(lab: Lab): string {
  const [r, g, b] = toRgb(lab);
  return `rgb(${r} ${g} ${b})`;
}

const mix = (a: Lab, b: Lab, t: number): Lab => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

interface MoodHex {
  at: number;
  page: string;
  tile: string;
  raised: string;
  light: string;
  glow: number;
}

interface Mood {
  page: Lab;
  tile: Lab;
  raised: Lab;
  light: Lab;
  glow: number;
}

interface Stop extends Mood {
  at: number;
}

const prepare = ({ at, glow, page, tile, raised, light }: MoodHex): Stop => ({
  at,
  glow,
  page: toOklab(page),
  tile: toOklab(tile),
  raised: toOklab(raised),
  light: toOklab(light),
});

const DARK = [
  {
    at: -18,
    page: "#0b0b0d",
    tile: "#17171a",
    raised: "#222226",
    light: "#7f93ff",
    glow: 0.08,
  },
  {
    at: -10,
    page: "#0b0d12",
    tile: "#161920",
    raised: "#20242c",
    light: "#8b9cff",
    glow: 0.1,
  },
  {
    at: -4,
    page: "#121113",
    tile: "#1d1b1e",
    raised: "#28262a",
    light: "#f0907a",
    glow: 0.16,
  },
].map(prepare);

const LIGHT = [
  {
    at: -1,
    page: "#fcf2eb",
    tile: "#f5e7de",
    raised: "#fffaf6",
    light: "#e9785e",
    glow: 0.26,
  },
  {
    at: 4,
    page: "#fff7ed",
    tile: "#f7eee1",
    raised: "#fffcf7",
    light: "#e8a04b",
    glow: 0.2,
  },
  {
    at: 14,
    page: "#fffdf9",
    tile: "#f5f4f1",
    raised: "#ffffff",
    light: "#e3a85a",
    glow: 0.1,
  },
  {
    at: 40,
    page: "#ffffff",
    tile: "#f3f4f6",
    raised: "#ffffff",
    light: "#5b8def",
    glow: 0.06,
  },
].map(prepare);

const INK_ON_LIGHT = {
  ink: toOklab("#18181b"),
  ink2: toOklab("#71717a"),
  ink3: toOklab("#a1a1aa"),
};
const INK_ON_DARK = {
  ink: toOklab("#ededef"),
  ink2: toOklab("#a1a1aa"),
  ink3: toOklab("#71717a"),
};

function along(stops: Stop[], elevation: number): Mood {
  if (elevation <= stops[0].at) return stops[0];
  for (let i = 1; i < stops.length; i++) {
    if (elevation <= stops[i].at) {
      const a = stops[i - 1];
      const b = stops[i];
      const t = smoothstep(a.at, b.at, elevation);
      return {
        glow: lerp(a.glow, b.glow, t),
        page: mix(a.page, b.page, t),
        tile: mix(a.tile, b.tile, t),
        raised: mix(a.raised, b.raised, t),
        light: mix(a.light, b.light, t),
      };
    }
  }
  return stops[stops.length - 1];
}

const luminance = (lab: Lab) => Math.max(0, lab[0]) ** 3;
const contrast = (a: Lab, b: Lab) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function withContrast(
  color: Lab,
  background: Lab,
  target: Lab,
  minimum: number,
): Lab {
  let out = color;
  for (let step = 1; step <= 10 && contrast(out, background) < minimum; step++)
    out = mix(color, target, step / 10);
  return out;
}

export function themeAt(elevation: number): Theme {
  const dark = along(DARK, elevation);
  const light = along(LIGHT, elevation);
  const daylight = smoothstep(-4.5, -0.5, elevation);
  const inkSide = daylight >= 0.5 ? INK_ON_LIGHT : INK_ON_DARK;
  const page = mix(dark.page, light.page, daylight);
  const ink = withContrast(inkSide.ink, page, inkSide.ink, 7);
  return {
    isDark: daylight < 0.5,
    page: toCss(page),
    tile: toCss(mix(dark.tile, light.tile, daylight)),
    raised: toCss(mix(dark.raised, light.raised, daylight)),
    ink: toCss(ink),
    ink2: toCss(withContrast(inkSide.ink2, page, ink, 4.5)),
    ink3: toCss(withContrast(inkSide.ink3, page, ink, 3)),
    sunlight: toRgb(mix(dark.light, light.light, daylight)),
    glowAlpha: lerp(dark.glow, light.glow, daylight),
  };
}
