import type { DayKey, HoursException, OpeningHours } from "@/content/business";

export const SHOP_TIME_ZONE = "Australia/Sydney";

export interface ZonedNow {
  /** ISO date in shop time, YYYY-MM-DD. */
  date: string;
  day: DayKey;
  /** Minutes since midnight in shop time. */
  minutes: number;
}

const dayKeys: Record<string, DayKey> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

/** Read the wall-clock date/time in Sydney, independent of the visitor's time zone. */
export function zonedNow(instant: Date, timeZone = SHOP_TIME_ZONE): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    day: dayKeys[get("weekday")] ?? "mon",
    minutes: hour * 60 + Number(get("minute")),
  };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "21:30" -> "9:30pm", "08:00" -> "8am" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, "0")}${suffix}`;
}

export type OpenStatus =
  | { state: "open"; closesAt: string; exception?: HoursException }
  | { state: "before-open"; opensAt: string; exception?: HoursException }
  | { state: "closed-for-day"; nextOpensAt?: string; exception?: HoursException };

export function hoursFor(
  now: ZonedNow,
  weekly: Record<DayKey, OpeningHours>,
  exceptions: readonly HoursException[],
): { hours: OpeningHours | null; exception?: HoursException } {
  const exception = exceptions.find((e) => e.date === now.date);
  if (exception) {
    if (exception.closed || !exception.open || !exception.close) return { hours: null, exception };
    return { hours: { open: exception.open, close: exception.close }, exception };
  }
  return { hours: weekly[now.day] ?? null };
}

export function openStatus(
  now: ZonedNow,
  weekly: Record<DayKey, OpeningHours>,
  exceptions: readonly HoursException[] = [],
): OpenStatus {
  const { hours, exception } = hoursFor(now, weekly, exceptions);
  if (!hours) return { state: "closed-for-day", exception };
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (now.minutes < open) return { state: "before-open", opensAt: hours.open, exception };
  if (now.minutes < close) return { state: "open", closesAt: hours.close, exception };
  return { state: "closed-for-day", exception };
}

/** Inclusive date-range check on ISO date strings (lexicographic compare is safe for YYYY-MM-DD). */
export function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}
