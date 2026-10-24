/**
 * SPECIALS — edit this list to publish verified, current specials.
 *
 * Rules:
 * - Only add an offer the owners have confirmed for the dates given.
 * - `startDate` / `endDate` are inclusive ISO dates (YYYY-MM-DD) in Sydney time.
 *   Expired specials disappear automatically — no redeploy needed for removal,
 *   though you should tidy old entries when you next edit the file.
 * - `price` is free text exactly as the shop advertises it (e.g. "$2.99/kg").
 * - Never copy an old Instagram offer here as if it were current.
 *
 * Example entry (do not uncomment unless it is a real, confirmed offer):
 *
 * {
 *   id: "2026-11-white-grapes",
 *   title: "White grapes",
 *   price: "$2.99/kg",
 *   detail: "Or $25 per box",
 *   startDate: "2026-11-07",
 *   endDate: "2026-11-08",
 *   category: "fruit",
 * },
 */

import type { CategoryId } from "./categories";

export interface Special {
  id: string;
  title: string;
  price: string;
  detail?: string;
  startDate: string;
  endDate: string;
  category?: CategoryId;
  /** Optional note such as "Saturday only" or "While stocks last". */
  conditions?: string;
}

export const specials: Special[] = [];
