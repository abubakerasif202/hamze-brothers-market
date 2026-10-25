import type { Special } from "@/content/specials";
import { isDateInRange } from "./time";

/** Specials running on the given Sydney date, soonest-ending first. */
export function activeSpecials(all: readonly Special[], sydneyDate: string): Special[] {
  return all
    .filter((s) => isDateInRange(sydneyDate, s.startDate, s.endDate))
    .sort((a, b) => a.endDate.localeCompare(b.endDate));
}

/** "2026-11-08" -> "Sun, 8 Nov" */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "$2.99/kg" -> { amount: "$2.99", unit: "kg" }. Anything else is shown whole. */
export function splitPrice(price: string): { amount: string; unit?: string } {
  const match = /^(.+?)\s*\/\s*(\S.*)$/.exec(price.trim());
  return match ? { amount: match[1], unit: match[2] } : { amount: price.trim() };
}

/** Human date range: "Sat, 7 Nov to Sun, 8 Nov", or "Sat, 7 Nov only". */
export function formatOfferDates(startDate: string, endDate: string): string {
  return startDate === endDate
    ? `${formatShortDate(startDate)} only`
    : `${formatShortDate(startDate)} to ${formatShortDate(endDate)}`;
}
