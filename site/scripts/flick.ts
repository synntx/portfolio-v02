const CARRY_MS = 180;

export function flickLanding(
  positionInMonths: number,
  monthsPerMs: number,
  lastMonth: number,
): number {
  const carried = positionInMonths + monthsPerMs * CARRY_MS;
  return Math.min(lastMonth, Math.max(0, Math.round(carried)));
}
