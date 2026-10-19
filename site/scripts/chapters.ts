import { dialMarkup, startDial } from "./dial";
import { timelineOf } from "./timeline";

export function wireChapters(fold: HTMLElement) {
  const tabs = [...fold.querySelectorAll<HTMLButtonElement>(".fold-item")];
  const sections = [
    ...fold.querySelectorAll<HTMLElement>(".fold-stage > section"),
  ];
  const pill = fold.querySelector<HTMLElement>(".fold-pill");
  const dialElement = fold.querySelector<HTMLElement>(".dial");
  if (!pill || !dialElement) return;

  const timeline = timelineOf({
    starts: tabs.map((tab) => tab.dataset.start ?? ""),
    current: fold.dataset.current === "true",
    ended: fold.dataset.ended,
  });
  const titleOf = (chapter: number) => tabs[chapter]?.textContent?.trim() ?? "";
  dialElement.innerHTML = dialMarkup(timeline.marks);
  dialElement.setAttribute("aria-valuemin", "0");
  dialElement.setAttribute("aria-valuemax", String(timeline.last));
  const marked = [...fold.querySelectorAll<HTMLElement>("[data-chapter]")];
  let selected = -1;

  const select = (index: number) => {
    if (index === selected) return;
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    sections.forEach((section, i) => {
      section.classList.toggle("is-active", i === index);
      section.inert = i !== index;
    });
    const tab = tabs[index];
    pill.style.setProperty(
      "--y",
      `${(tab.parentElement?.offsetTop ?? 0) + tab.offsetTop}px`,
    );
    marked.forEach((el) =>
      el.classList.toggle("is-lit", Number(el.dataset.chapter) === index),
    );
  };

  select(tabs.length - 1);
  const dial = startDial(dialElement, {
    count: timeline.months.length,
    initial: timeline.last,
    describe: timeline.describe,
    valueText: (i) =>
      `${timeline.describe(i)}, ${titleOf(timeline.chapterOf(i))}`,
    onChange: (i) => select(timeline.chapterOf(i)),
  });

  const pick = (index: number) => {
    select(index);
    if (timeline.chapterOf(dial.current()) !== index)
      dial.follow(timeline.monthOf(index));
  };
  const items = fold.querySelector<HTMLElement>(".fold-items");
  items?.addEventListener("click", (event) => {
    const tab = (event.target as Element).closest<HTMLElement>(".fold-item");
    if (tab) pick(Number(tab.dataset.index));
  });
  items?.addEventListener("keydown", (event) => {
    const step = ({ ArrowDown: 1, ArrowUp: -1 } as Record<string, number>)[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(tabs.length - 1, selected + step));
    pick(next);
    tabs[next].focus();
  });
}
