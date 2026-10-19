export const MINUTES_PER_DAY = 1440;
export const SUNRISE_ELEVATION = -0.833;

const RAD = Math.PI / 180;

export interface Place {
  name: string;
  latitude: number;
  longitude: number;
  utcOffsetMinutes: number;
}

export interface SunEvent {
  name: "sunrise" | "sunset";
  inMinutes: number;
}

export interface Sun {
  nowMinutes(): number;
  elevationAt(minutes: number): number;
  nextEvent(minutes: number): SunEvent;
}

function solarElevation(
  date: Date,
  latitude: number,
  longitude: number,
): number {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  const t = (julianDay - 2451545) / 36525;
  const meanLongitude = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const centre =
    Math.sin(RAD * meanAnomaly) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(RAD * 2 * meanAnomaly) * (0.019993 - 0.000101 * t) +
    Math.sin(RAD * 3 * meanAnomaly) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const apparentLongitude =
    meanLongitude + centre - 0.00569 - 0.00478 * Math.sin(RAD * omega);
  const meanObliquity =
    23 +
    (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliquity = meanObliquity + 0.00256 * Math.cos(RAD * omega);
  const declination =
    Math.asin(Math.sin(RAD * obliquity) * Math.sin(RAD * apparentLongitude)) /
    RAD;
  const y = Math.tan((RAD * obliquity) / 2) ** 2;
  const equationOfTime =
    (4 / RAD) *
    (y * Math.sin(2 * RAD * meanLongitude) -
      2 * eccentricity * Math.sin(RAD * meanAnomaly) +
      4 *
        eccentricity *
        y *
        Math.sin(RAD * meanAnomaly) *
        Math.cos(2 * RAD * meanLongitude) -
      0.5 * y * y * Math.sin(4 * RAD * meanLongitude) -
      1.25 * eccentricity * eccentricity * Math.sin(2 * RAD * meanAnomaly));
  const utcMinutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60 +
    date.getUTCMilliseconds() / 60000;
  const trueSolarTime =
    (((utcMinutes + equationOfTime + 4 * longitude) % MINUTES_PER_DAY) +
      MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hourAngle =
    trueSolarTime / 4 < 0 ? trueSolarTime / 4 + 180 : trueSolarTime / 4 - 180;
  const cosZenith =
    Math.sin(RAD * latitude) * Math.sin(RAD * declination) +
    Math.cos(RAD * latitude) *
      Math.cos(RAD * declination) *
      Math.cos(RAD * hourAngle);
  return 90 - Math.acos(Math.min(1, Math.max(-1, cosZenith))) / RAD;
}

interface DayEvents {
  rise: number | null;
  set: number | null;
}

export function createSun({
  latitude,
  longitude,
  utcOffsetMinutes,
}: Place): Sun {
  const offsetMs = utcOffsetMinutes * 60000;

  const dayStartUtc = (ms: number) => {
    const local = new Date(ms + offsetMs);
    return (
      Date.UTC(
        local.getUTCFullYear(),
        local.getUTCMonth(),
        local.getUTCDate(),
      ) - offsetMs
    );
  };
  const elevationOn = (dayStart: number, minutes: number) =>
    solarElevation(new Date(dayStart + minutes * 60000), latitude, longitude);

  function eventsOn(dayStart: number): DayEvents {
    let rise: number | null = null;
    let set: number | null = null;
    let previous = elevationOn(dayStart, 0) - SUNRISE_ELEVATION;
    for (let m = 1; m <= MINUTES_PER_DAY; m++) {
      const current = elevationOn(dayStart, m) - SUNRISE_ELEVATION;
      if (rise === null && previous < 0 && current >= 0)
        rise = m - 1 + -previous / (current - previous);
      if (set === null && previous >= 0 && current < 0)
        set = m - 1 + previous / (previous - current);
      previous = current;
    }
    return { rise, set };
  }

  let day: { start: number; events: DayEvents; tomorrowRise: number } | null =
    null;

  function today() {
    const start = dayStartUtc(Date.now());
    if (!day || day.start !== start) {
      const tomorrow = eventsOn(start + MINUTES_PER_DAY * 60000);
      day = {
        start,
        events: eventsOn(start),
        tomorrowRise: tomorrow.rise ?? 0,
      };
    }
    return day;
  }

  return {
    nowMinutes: () => (Date.now() - dayStartUtc(Date.now())) / 60000,
    elevationAt: (minutes) => elevationOn(today().start, minutes),
    nextEvent(minutes) {
      const { events, tomorrowRise } = today();
      if (events.rise !== null && minutes < events.rise)
        return { name: "sunrise", inMinutes: events.rise - minutes };
      if (events.set !== null && minutes < events.set)
        return { name: "sunset", inMinutes: events.set - minutes };
      return {
        name: "sunrise",
        inMinutes: MINUTES_PER_DAY - minutes + tomorrowRise,
      };
    },
  };
}

export function formatClock(minutes: number): string {
  const whole = Math.floor(
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY,
  );
  const h24 = Math.floor(whole / 60);
  const m = whole % 60;
  return `${h24 % 12 || 12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "am" : "pm"}`;
}

export function formatDuration(minutes: number): string {
  const total = Math.max(1, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
