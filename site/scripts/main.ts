import { inject } from "@vercel/analytics";
import { startCopyEmail } from "./copy-email";
import { startSunControl } from "./sun-control";
import { startSunlight } from "./sunlight";
import { startWorkDialog } from "./work-dialog";

declare const ANALYTICS: boolean;

function byId<T extends Element>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`#${id} is missing from the page`);
  return element as unknown as T;
}

const daylight = window.daylight;
daylight.state.onChange = startSunlight(
  byId<HTMLCanvasElement>("sunlight"),
  daylight.state,
);
startSunControl(
  {
    slider: byId<HTMLElement>("sun-slider"),
    arc: byId<SVGPathElement>("sun-arc"),
    dot: byId<SVGCircleElement>("sun-dot"),
    text: byId<HTMLElement>("sun-text"),
    pin: byId<HTMLButtonElement>("pin"),
  },
  daylight,
);
startCopyEmail(
  byId<HTMLButtonElement>("copy-email"),
  byId<HTMLElement>("copy-status"),
);
startWorkDialog(byId<HTMLDialogElement>("job-panel"));
if (ANALYTICS) inject({ mode: "production" });
