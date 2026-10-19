import { PIN_KEY, type Daylight } from "./daylight";
import {
  formatClock,
  formatDuration,
  MINUTES_PER_DAY,
  SUNRISE_ELEVATION,
} from "./sun";

export interface SunControlElements {
  slider: HTMLElement;
  arc: SVGPathElement;
  dot: SVGCircleElement;
  text: HTMLElement;
  pin: HTMLButtonElement;
}

const LIVE_UPDATE_MS = 30000;
const RETURN_MS = 900;
const LIVE_GLIDE_MS = 1200;
const KEY_STEP_MS = 320;
const KEY_STEP_MINUTES = 15;
const ARC = { left: 2, right: 38, horizon: 13, top: 2, bottom: 17, peak: 60 };

const wrapMinutes = (m: number) =>
  ((m % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
const arcX = (minutes: number) =>
  ARC.left + (minutes / MINUTES_PER_DAY) * (ARC.right - ARC.left);
const arcY = (elevation: number) =>
  elevation >= 0
    ? ARC.horizon - (elevation / ARC.peak) * (ARC.horizon - ARC.top)
    : Math.min(ARC.bottom, ARC.horizon - elevation * 0.12);
const easeOut = (t: number) => 1 - (1 - t) ** 4;

export function startSunControl(
  { slider, arc, dot, text, pin }: SunControlElements,
  daylight: Daylight,
) {
  const { sun, apply, place } = daylight;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const labels = {
    pin: pin.dataset.pinLabel ?? "",
    unpin: pin.dataset.unpinLabel ?? "",
  };
  const time = {
    shown: daylight.pinned ?? sun.nowMinutes(),
    target: 0,
    pinned: daylight.pinned !== null,
    animation: 0,
    dragging: false,
  };
  time.target = time.shown;

  function drawArc() {
    const points: string[] = [];
    for (let m = 0; m <= MINUTES_PER_DAY; m += 20) {
      const e = sun.elevationAt(m);
      if (e >= 0) points.push(`${arcX(m).toFixed(2)} ${arcY(e).toFixed(2)}`);
    }
    arc.setAttribute("d", points.length ? `M${points.join(" L")}` : "");
  }

  function show(minutes: number) {
    const m = wrapMinutes(minutes);
    const elevation = sun.elevationAt(m);
    apply(elevation);
    dot.setAttribute("cx", arcX(m).toFixed(2));
    dot.setAttribute("cy", arcY(elevation).toFixed(2));
    dot.classList.toggle("is-down", elevation < SUNRISE_ELEVATION);
    const event = sun.nextEvent(m);
    const label = `${formatClock(m)} in ${place.name} · ${event.name} in ${formatDuration(event.inMinutes)}`;
    text.textContent = label;
    slider.setAttribute("aria-valuenow", String(Math.floor(m)));
    slider.setAttribute("aria-valuetext", label);
  }

  const settledMinutes = () => (time.animation ? time.target : time.shown);

  function stopAnimation() {
    if (time.animation) cancelAnimationFrame(time.animation);
    time.animation = 0;
  }

  function glideTo(target: number, duration: number) {
    stopAnimation();
    const from = time.shown;
    let delta = wrapMinutes(target - from);
    if (delta > MINUTES_PER_DAY / 2) delta -= MINUTES_PER_DAY;
    time.target = from + delta;
    if (reducedMotion.matches || Math.abs(delta) < 0.5) {
      time.shown = from + delta;
      show(time.shown);
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      time.shown = from + delta * easeOut(t);
      show(time.shown);
      time.animation = t < 1 ? requestAnimationFrame(step) : 0;
    };
    time.animation = requestAnimationFrame(step);
  }

  function savePin() {
    try {
      if (time.pinned)
        localStorage.setItem(PIN_KEY, String(wrapMinutes(settledMinutes())));
      else localStorage.removeItem(PIN_KEY);
    } catch {}
  }

  function renderPin() {
    const label = time.pinned ? labels.unpin : labels.pin;
    pin.setAttribute("aria-pressed", String(time.pinned));
    pin.setAttribute("aria-label", label);
    pin.title = label;
  }

  function setPinned(pinned: boolean) {
    time.pinned = pinned;
    renderPin();
    savePin();
    if (!pinned) glideTo(sun.nowMinutes(), RETURN_MS);
  }

  function settle() {
    if (time.pinned) savePin();
    else glideTo(sun.nowMinutes(), RETURN_MS);
  }

  function bindSlider() {
    let drag: { x: number; from: number; width: number } | null = null;

    slider.addEventListener("pointerdown", (event) => {
      stopAnimation();
      slider.setPointerCapture(event.pointerId);
      drag = {
        x: event.clientX,
        from: time.shown,
        width: slider.getBoundingClientRect().width,
      };
      time.dragging = true;
    });
    slider.addEventListener("pointermove", (event) => {
      if (!drag) return;
      time.shown =
        drag.from + ((event.clientX - drag.x) / drag.width) * MINUTES_PER_DAY;
      show(time.shown);
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      time.dragging = false;
      settle();
    };
    slider.addEventListener("pointerup", end);
    slider.addEventListener("pointercancel", end);

    slider.addEventListener("keydown", (event) => {
      const direction = (
        { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<
          string,
          number
        >
      )[event.key];
      if (direction) {
        event.preventDefault();
        const step = direction * KEY_STEP_MINUTES * (event.shiftKey ? 4 : 1);
        glideTo(settledMinutes() + step, KEY_STEP_MS);
        if (time.pinned) savePin();
      }
      if (event.key === "Escape") setPinned(false);
    });
    slider.addEventListener("blur", () => {
      if (!drag && !time.pinned) glideTo(sun.nowMinutes(), RETURN_MS);
    });

    pin.addEventListener("click", () => setPinned(!time.pinned));
  }

  function keepLive() {
    setInterval(() => {
      if (
        time.pinned ||
        time.dragging ||
        time.animation ||
        document.activeElement === slider
      )
        return;
      drawArc();
      glideTo(sun.nowMinutes(), LIVE_GLIDE_MS);
    }, LIVE_UPDATE_MS);
  }

  drawArc();
  renderPin();
  show(time.shown);
  bindSlider();
  keepLive();
}
