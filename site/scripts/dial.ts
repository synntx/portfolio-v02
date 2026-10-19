import { flickLanding } from "./flick";
import type { DialMark } from "./timeline";

const ARC = { radius: 300, edge: 26, spacing: 16, inset: 14, labelGap: 8 };
const MINOR_PARTS = [0.25, 0.5, 0.75];
const WHEEL_NOTCH_PX = 100;
const MOMENTUM_SAMPLE_MS = 100;

export interface DialOptions {
  count: number;
  initial: number;
  describe(index: number): string;
  valueText(index: number): string;
  onChange(index: number): void;
}

export interface DialHandle {
  current(): number;
  follow(index: number): void;
}

interface Positioned {
  el: HTMLElement;
  at: number;
}

export function dialMarkup(marks: DialMark[]): string {
  const last = marks.length - 1;
  const ticks = marks
    .flatMap((mark, m) => [
      `<i class="dial-tick ${mark.kinds.join(" ")}" data-at="${m}" data-chapter="${mark.chapter}"></i>`,
      ...(m < last
        ? MINOR_PARTS.map(
            (part) =>
              `<i class="dial-tick is-minor" data-at="${m + part}"></i>`,
          )
        : []),
    ])
    .join("");
  const labels = marks
    .map((mark, m) =>
      mark.label
        ? `<b class="dial-label" data-at="${m}">${mark.label}</b>`
        : "",
    )
    .join("");
  return `
    <span class="dial-ticks" aria-hidden="true">${ticks}</span>
    <span class="dial-labels" aria-hidden="true">${labels}</span>
    <span class="dial-needle" aria-hidden="true"></span>
    <span class="dial-bubble" aria-hidden="true"></span>`;
}

const fadeTowardEdge = (share: number) =>
  1 - Math.min(1, Math.max(0, (share - 0.55) / 0.45)) ** 2;
const positioned = (root: HTMLElement, selector: string): Positioned[] =>
  [...root.querySelectorAll<HTMLElement>(selector)].map((el) => ({
    el,
    at: Number(el.dataset.at),
  }));

function arcPainter(dial: HTMLElement, last: number) {
  const centerY = dial.clientHeight / 2;
  const centerX = ARC.edge - ARC.radius;
  const step = ARC.spacing / ARC.radius;
  const maxAngle = Math.asin(Math.min(1, (centerY - ARC.inset) / ARC.radius));
  const labelRadius = ARC.radius + ARC.labelGap;
  dial.style.setProperty("--r", `${ARC.radius}px`);
  dial.style.setProperty("--cx", `${centerX}px`);
  dial.style.setProperty("--edge", `${ARC.edge}px`);
  const ticks = positioned(dial, ".dial-tick");
  const labels = positioned(dial, ".dial-label");

  const paint = (pos: number) => {
    const nearest = Math.round(Math.min(Math.max(pos, 0), last));
    for (const { el, at } of ticks) {
      const angle = (at - pos) * step;
      const share = Math.abs(angle) / maxAngle;
      el.style.visibility = share < 1 ? "visible" : "hidden";
      if (share >= 1) continue;
      el.style.rotate = `${angle}rad`;
      el.style.opacity = String(fadeTowardEdge(share));
      el.classList.toggle("is-centre", at === nearest);
    }
    for (const { el, at } of labels) {
      const angle = (at - pos) * step;
      const share = Math.abs(angle) / maxAngle;
      el.style.visibility = share < 1 ? "visible" : "hidden";
      if (share >= 1) continue;
      el.style.transform = `translate(${centerX + labelRadius * Math.cos(angle)}px, ${centerY + labelRadius * Math.sin(angle)}px) translateY(-50%)`;
      const clearOfBubble = Math.min(
        1,
        Math.max(0, (Math.abs(at - pos) - 1.2) / 1),
      );
      el.style.opacity = String(clearOfBubble * fadeTowardEdge(share));
    }
  };
  const monthsFromCentre = (offsetY: number) =>
    Math.asin(Math.max(-1, Math.min(1, offsetY / ARC.radius))) / step;
  return { paint, monthsFromCentre };
}

export function startDial(
  dial: HTMLElement,
  { count, initial, describe, valueText, onChange }: DialOptions,
): DialHandle {
  const last = count - 1;
  const bubble = dial.querySelector<HTMLElement>(".dial-bubble");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clampIndex = (value: number) =>
    Math.min(last, Math.max(0, Math.round(value)));
  const overscroll = (beyond: number) => (1 - 1 / (beyond * 0.6 + 1)) / 0.6;
  const resist = (value: number) =>
    value < 0
      ? -overscroll(-value)
      : value > last
        ? last + overscroll(value - last)
        : value;
  let painter = arcPainter(dial, last);
  let pos = initial;
  let shown = -1;
  let frame = 0;
  let paintQueued = 0;
  let drag: {
    id: number;
    y: number;
    pos: number;
    moved: boolean;
    samples: { t: number; pos: number }[];
  } | null = null;
  let scrollTimer = 0;
  let following = false;
  let heading: number | null = null;

  const render = () => {
    painter.paint(pos);
    const index = clampIndex(pos);
    if (index === shown) return;
    shown = index;
    if (bubble) bubble.textContent = describe(index);
    dial.setAttribute("aria-valuenow", String(index));
    dial.setAttribute("aria-valuetext", valueText(index));
    if (!following) onChange(index);
  };
  const renderNextFrame = () => {
    if (paintQueued) return;
    paintQueued = requestAnimationFrame(() => {
      paintQueued = 0;
      render();
    });
  };

  const stopFollowing = () => {
    if (!following) return;
    following = false;
    onChange(clampIndex(pos));
  };
  const takeOver = () => {
    cancelAnimationFrame(frame);
    clearTimeout(scrollTimer);
    heading = null;
    stopFollowing();
  };
  const stepFrom = () => heading ?? clampIndex(pos);

  const glideTo = (target: number, speed = 0) => {
    cancelAnimationFrame(frame);
    heading = target;
    const from = pos;
    const distance = Math.abs(target - from);
    const matched = speed && distance ? (3 * distance) / speed : 0;
    const duration = reduceMotion
      ? 0
      : Math.min(900, Math.max(220, matched || 260 + distance * 30));
    const started = performance.now();
    dial.classList.toggle("is-moving", !following);
    const step = (now: number) => {
      if (!dial.isConnected) return;
      const t = duration ? Math.min(1, (now - started) / duration) : 1;
      pos = from + (target - from) * (1 - (1 - t) ** 3);
      render();
      if (t < 1) {
        frame = requestAnimationFrame(step);
        return;
      }
      dial.classList.remove("is-moving");
      heading = null;
      stopFollowing();
    };
    frame = requestAnimationFrame(step);
  };

  dial.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || drag) return;
    takeOver();
    dial.setPointerCapture(event.pointerId);
    dial.classList.add("is-moving");
    drag = {
      id: event.pointerId,
      y: event.clientY,
      pos,
      moved: false,
      samples: [{ t: event.timeStamp, pos }],
    };
  });
  dial.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (Math.abs(event.clientY - drag.y) > 3) drag.moved = true;
    pos = resist(drag.pos - (event.clientY - drag.y) / ARC.spacing);
    drag.samples = [...drag.samples, { t: event.timeStamp, pos }].filter(
      (sample) => event.timeStamp - sample.t < MOMENTUM_SAMPLE_MS,
    );
    renderNextFrame();
  });
  const release = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { moved, samples } = drag;
    drag = null;
    if (!moved) {
      const box = dial.getBoundingClientRect();
      glideTo(
        clampIndex(
          pos +
            painter.monthsFromCentre(
              event.clientY - (box.top + box.height / 2),
            ),
        ),
      );
      return;
    }
    const first = samples[0];
    const latest = samples[samples.length - 1];
    const velocity =
      (latest.pos - first.pos) / Math.max(16, latest.t - first.t);
    const target = flickLanding(pos, velocity, last);
    glideTo(
      target,
      Math.sign(velocity) === Math.sign(target - pos) ? Math.abs(velocity) : 0,
    );
  };
  dial.addEventListener("pointerup", release);
  dial.addEventListener("pointercancel", release);
  dial.addEventListener("lostpointercapture", release);

  dial.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey || drag) return;
      event.preventDefault();
      const isNotch =
        event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL ||
        (Math.abs(event.deltaY) >= WHEEL_NOTCH_PX &&
          Number.isInteger(event.deltaY));
      if (isNotch) {
        glideTo(clampIndex(stepFrom() + Math.sign(event.deltaY)));
        return;
      }
      takeOver();
      dial.classList.add("is-moving");
      pos = Math.min(
        last + 0.4,
        Math.max(-0.4, pos + event.deltaY / ARC.spacing / 2),
      );
      renderNextFrame();
      scrollTimer = window.setTimeout(() => glideTo(clampIndex(pos)), 100);
    },
    { passive: false },
  );

  dial.addEventListener("keydown", (event) => {
    const steps = (
      {
        ArrowUp: -1,
        ArrowLeft: -1,
        ArrowDown: 1,
        ArrowRight: 1,
        PageUp: -3,
        PageDown: 3,
      } as Record<string, number>
    )[event.key];
    const target =
      steps !== undefined
        ? clampIndex(stepFrom() + steps)
        : ({ Home: 0, End: last } as Record<string, number>)[event.key];
    if (target === undefined) return;
    event.preventDefault();
    glideTo(target);
  });

  new ResizeObserver(() => {
    painter = arcPainter(dial, last);
    painter.paint(pos);
  }).observe(dial);
  render();

  return {
    current: () => clampIndex(pos),
    follow(index) {
      if (drag) return;
      following = true;
      glideTo(index);
    },
  };
}
