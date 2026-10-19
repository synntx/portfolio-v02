import type { DaylightState } from "./daylight";

const SCALE = 0.5;
const DITHER_SHADES = 1.5;

export function startSunlight(
  canvas: HTMLCanvasElement,
  state: DaylightState,
): () => void {
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  const ctx = context;
  let falloff = new Float32Array(0);
  let dither = new Float32Array(0);
  let image = ctx.createImageData(1, 1);
  let pending = 0;

  function size() {
    const w = Math.max(1, Math.round(innerWidth * SCALE));
    const h = Math.max(1, Math.round(innerHeight * SCALE));
    canvas.width = w;
    canvas.height = h;
    image = ctx.createImageData(w, h);
    falloff = new Float32Array(w * h);
    dither = new Float32Array(w * h);
    const cx = 0.5 * w;
    const cy = 1.06 * h;
    const rx = 0.95 * w;
    const ry = 0.62 * h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
        falloff[i] = d < 1 ? (1 - d) ** 2 : 0;
        dither[i] =
          falloff[i] > 0 ? (Math.random() * 2 - 1) * DITHER_SHADES : 0;
      }
    }
  }

  function draw() {
    pending = 0;
    const [r, g, b] = state.sunlight;
    const strength = state.glowAlpha * 255;
    const data = image.data;
    for (let i = 0, p = 0; i < falloff.length; i++, p += 4) {
      data[p] = r;
      data[p + 1] = g;
      data[p + 2] = b;
      data[p + 3] = falloff[i] * strength + dither[i];
    }
    ctx.putImageData(image, 0, 0);
  }

  function request() {
    if (!pending) pending = requestAnimationFrame(draw);
  }

  size();
  draw();
  addEventListener("resize", () => {
    size();
    request();
  });
  return request;
}
