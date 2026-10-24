import type { DayKey, HoursException, OpeningHours } from "@/content/business";
import { formatTime, hoursFor, toMinutes, type ZonedNow } from "./time";

export interface CollectionDay {
  date: string;
  label: string;
  slots: { id: string; label: string }[];
}

const dayOrder: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function addDays(iso: string, days: number): { date: string; day: DayKey } {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const date = dt.toISOString().slice(0, 10);
  return { date, day: dayOrder[dt.getUTCDay()] };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fromMinutes(mins: number) {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}

/**
 * Illustrative two-hour collection windows for the next few trading days,
 * starting one hour after opening and ending by closing time, with a
 * two-hour preparation lead time for same-day windows. Demo only.
 */
export function collectionDays(
  now: ZonedNow,
  weekly: Record<DayKey, OpeningHours>,
  exceptions: readonly HoursException[],
  count = 3,
): CollectionDay[] {
  const result: CollectionDay[] = [];
  for (let offset = 0; offset < 10 && result.length < count; offset++) {
    const { date, day } = addDays(now.date, offset);
    const { hours } = hoursFor({ date, day, minutes: 0 }, weekly, exceptions);
    if (!hours) continue;
    const first = toMinutes(hours.open) + 60;
    const close = toMinutes(hours.close);
    const slots: CollectionDay["slots"] = [];
    for (let start = first; start + 120 <= close; start += 120) {
      if (offset === 0 && start < now.minutes + 120) continue;
      const end = start + 120;
      slots.push({
        id: `${date}T${fromMinutes(start)}`,
        label: `${formatTime(fromMinutes(start))} to ${formatTime(fromMinutes(end))}`,
      });
    }
    if (slots.length === 0) continue;
    const [y, m, d] = date.split("-").map(Number);
    const pretty = new Intl.DateTimeFormat("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
    const label = offset === 0 ? `Today, ${pretty}` : offset === 1 ? `Tomorrow, ${pretty}` : pretty;
    result.push({ date, label, slots });
  }
  return result;
}
