export interface DialMark {
  kinds: string[];
  chapter: number;
  label: string;
}

export interface Timeline {
  months: Date[];
  last: number;
  marks: DialMark[];
  chapterOf(index: number): number;
  monthOf(chapter: number): number;
  describe(index: number): string;
}

export interface Span {
  starts: string[];
  current: boolean;
  ended?: string;
}

const NOW_LABEL = "Now";

const monthStart = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month - 1, 1);
};
const addMonths = (date: Date, n: number) =>
  new Date(date.getFullYear(), date.getMonth() + n, 1);
const monthsBetween = (from: Date, to: Date) =>
  (to.getFullYear() - from.getFullYear()) * 12 +
  to.getMonth() -
  from.getMonth();
const shortMonth = (date: Date) =>
  date.toLocaleString("en", { month: "short" });

export function tenure(joined: string): string {
  const start = new Date(joined);
  const today = new Date();
  const total =
    monthsBetween(start, today) - (today.getDate() < start.getDate() ? 1 : 0);
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} yr`, months && `${months} mo`]
    .filter(Boolean)
    .join(" ");
}

export function timelineOf({
  starts: startMonths,
  current,
  ended,
}: Span): Timeline {
  const today = new Date();
  const starts = startMonths.map(monthStart);
  const end =
    current || !ended
      ? new Date(today.getFullYear(), today.getMonth(), 1)
      : monthStart(ended);
  const months = Array.from(
    { length: monthsBetween(starts[0], end) + 1 },
    (_, i) => addMonths(starts[0], i),
  );
  const last = months.length - 1;
  const nowLabel = current ? NOW_LABEL : null;
  const isStart = (date: Date) => starts.some((start) => +start === +date);
  const chapterOf = (index: number) =>
    starts.findLastIndex((start) => start <= months[index]);
  const monthOf = (chapter: number) =>
    chapter === starts.length - 1
      ? last
      : monthsBetween(starts[0], starts[chapter]);
  const describe = (index: number) =>
    index === last && nowLabel
      ? nowLabel
      : `${shortMonth(months[index])} ${months[index].getFullYear()}`;
  const labelOf = (date: Date, index: number) => {
    const isYear = date.getMonth() === 0;
    if (index === last && nowLabel) return nowLabel;
    if (isStart(date))
      return isYear
        ? `${shortMonth(date)} ${date.getFullYear()}`
        : shortMonth(date);
    return isYear ? String(date.getFullYear()) : "";
  };
  const marks = months.map((date, index) => ({
    kinds: [
      isStart(date) && "is-start",
      date.getMonth() === 0 && "is-year",
      index === last && nowLabel && "is-now",
    ].filter((kind): kind is string => Boolean(kind)),
    chapter: chapterOf(index),
    label: labelOf(date, index),
  }));
  return { months, last, marks, chapterOf, monthOf, describe };
}
