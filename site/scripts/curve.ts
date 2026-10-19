const TRACK = { gauge: 18, sleeper: 30, pitch: 7, step: 0.5, railEvery: 4 };
const degrees = (d: number) => (d * Math.PI) / 180;

interface Bend {
  fromCorner: [number, number];
  heading: number;
  lead: number;
  radius: number;
  transition: number;
  turn: number;
}

interface TrackPoint {
  s: number;
  x: number;
  y: number;
  heading: number;
}

const BENDS: Record<"wide" | "tall", Bend> = {
  wide: {
    fromCorner: [384, -90],
    heading: degrees(-80),
    lead: 14,
    radius: 320,
    transition: 160,
    turn: degrees(68),
  },
  tall: {
    fromCorner: [279.5, -30.5],
    heading: degrees(-90),
    lead: 24,
    radius: 260,
    transition: 130,
    turn: degrees(78),
  },
};

// Real railways ease in and out of a bend: curvature ramps up over a
// transition, holds through the arc, then ramps back down.
function railCentreline(
  bend: Bend,
  start: [number, number],
  inside: (x: number, y: number) => boolean,
): TrackPoint[] {
  const { lead, radius, transition, turn } = bend;
  const arc = radius * turn - transition;
  const curvatureAt = (s: number) => {
    const t = s - lead;
    if (t <= 0 || t >= 2 * transition + arc) return 0;
    if (t < transition) return t / transition / radius;
    if (t < transition + arc) return 1 / radius;
    return (2 * transition + arc - t) / transition / radius;
  };
  const points: TrackPoint[] = [];
  let [x, y] = start;
  let heading = bend.heading;
  for (let s = 0; inside(x, y) && s < 3000; s += TRACK.step) {
    points.push({ s, x, y, heading });
    x += Math.cos(heading) * TRACK.step;
    y += Math.sin(heading) * TRACK.step;
    heading += curvatureAt(s) * TRACK.step;
  }
  return points;
}

function curveSvg(width: number, height: number): string {
  const bend = BENDS[width > height ? "wide" : "tall"];
  const start: [number, number] = [
    width - bend.fromCorner[0],
    height - bend.fromCorner[1],
  ];
  const points = railCentreline(
    bend,
    start,
    (x, y) => x < width + 40 && y > -40,
  );
  const across = (p: TrackPoint, d: number) =>
    `${(p.x - Math.sin(p.heading) * d).toFixed(2)} ${(p.y + Math.cos(p.heading) * d).toFixed(2)}`;
  const railPoints = points.filter(
    (_, i) => i % TRACK.railEvery === 0 || i === points.length - 1,
  );
  const rails = [-TRACK.gauge / 2, TRACK.gauge / 2].map(
    (d) =>
      `<path class="curve-rail" d="M ${railPoints.map((p) => across(p, d)).join(" L ")}"/>`,
  );
  const sleepers = points
    .filter((p) => p.s % TRACK.pitch === 0)
    .map(
      (p) =>
        `<path class="curve-sleeper" d="M ${across(p, -TRACK.sleeper / 2)} L ${across(p, TRACK.sleeper / 2)}"/>`,
    );
  return `<svg class="curve" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${sleepers.join("")}${rails.join("")}</svg>`;
}

export function drawCurve(card: HTMLElement) {
  const observer = new ResizeObserver(() => {
    if (!card.isConnected) {
      observer.disconnect();
      return;
    }
    card.querySelector(".curve")?.remove();
    card.insertAdjacentHTML(
      "afterbegin",
      curveSvg(card.clientWidth, card.clientHeight),
    );
  });
  observer.observe(card);
}
