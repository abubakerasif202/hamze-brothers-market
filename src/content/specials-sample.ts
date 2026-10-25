/**
 * SAMPLE SPECIALS — DEVELOPMENT PREVIEW ONLY, NOT REAL OFFERS.
 *
 * Used solely by /dev/specials-preview, which returns 404 in production
 * builds. These names, prices and dates are placeholders for checking the
 * layout and animation. They are not Hamze Brothers prices; never copy them
 * into specials.ts.
 */

import type { Special } from "./specials";

export const SAMPLE_START = "2026-11-07";
export const SAMPLE_END = "2026-11-08";

const base = { startDate: SAMPLE_START, endDate: SAMPLE_END } as const;

export const sampleSpecials: Special[] = [
  { id: "sample-oranges", title: "Oranges", price: "$1.00/kg", image: "oranges", category: "fruit", ...base },
  { id: "sample-mandarins", title: "Mandarins", price: "$2.00/kg", image: "mandarin", category: "fruit", ...base },
  {
    id: "sample-avocados",
    title: "Avocados",
    price: "$3.00/kg",
    image: "avocado",
    category: "fruit",
    detail: "Sample detail line",
    ...base,
  },
  { id: "sample-lemons", title: "Lemons", price: "$4.00/kg", image: "lemons", category: "fruit", ...base },
  { id: "sample-tomatoes", title: "Tomatoes", price: "$5.00/kg", image: "tomatoes", category: "vegetables", ...base },
  {
    id: "sample-carrots",
    title: "Carrots",
    price: "$1.50/kg",
    image: "carrots",
    category: "vegetables",
    conditions: "Sample condition: while stocks last",
    ...base,
  },
  { id: "sample-broccoli", title: "Broccoli", price: "$2.50/kg", image: "broccoli", category: "vegetables", ...base },
  { id: "sample-potatoes", title: "Potatoes", price: "$3.50/kg", image: "potatoes", category: "vegetables", ...base },
];

/** One already-ended offer, to show that expired entries are hidden. */
export const sampleExpired: Special = {
  id: "sample-expired",
  title: "Expired sample (must not show)",
  price: "$9.99/kg",
  image: "mango",
  startDate: "2026-10-01",
  endDate: "2026-10-02",
};
