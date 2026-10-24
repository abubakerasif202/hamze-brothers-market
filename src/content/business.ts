/**
 * VERIFIED BUSINESS INFORMATION
 *
 * Everything in this file is shown to the public as fact. Only add details the
 * owners have supplied or published themselves. Sources are noted beside each
 * field so they can be re-checked. Do NOT add a phone number, email address,
 * ratings or review counts unless the business supplies them.
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface OpeningHours {
  /** 24-hour "HH:MM" in Australia/Sydney time. */
  open: string;
  close: string;
}

export interface HoursException {
  /** ISO date (YYYY-MM-DD) in Australia/Sydney time. */
  date: string;
  label: string;
  /** Omit open/close and set closed: true for a closure. */
  closed?: boolean;
  open?: string;
  close?: string;
}

const everyDay: OpeningHours = { open: "08:00", close: "21:30" };

export const business = {
  name: "Hamze Brothers Fruit Market",
  shortName: "Hamze Brothers",
  arabicName: "حمزة اخوان",
  tagline: "Fresh. Local. Family.",
  /** Source: Instagram profile category. */
  category: "Fruit market and grocery store",

  address: {
    centre: "Guildford Plaza",
    street: "282 Guildford Road",
    streetShort: "282 Guildford Rd",
    suburb: "Guildford",
    state: "NSW",
    postcode: "2161",
    country: "AU",
  },

  /** Source: Google Maps listing (https://maps.app.goo.gl/srSYqLVz4QsCJh4x7), checked 25 Oct 2026. */
  geo: { latitude: -33.8544627, longitude: 150.9874093 },
  /** Google Place ID for the listing above; used so directions land on the business itself. */
  googlePlaceId: "ChIJGwQwlcS9EmsRjPzZew1lE_8",

  /**
   * Source: Instagram bio ("OPEN 7 DAYS | 8:00AM - 9:30PM") and the Google Maps
   * listing (Monday–Sunday 8:00am–9:30pm), checked 25 Oct 2026.
   */
  hours: {
    mon: everyDay,
    tue: everyDay,
    wed: everyDay,
    thu: everyDay,
    fri: everyDay,
    sat: everyDay,
    sun: everyDay,
  } satisfies Record<DayKey, OpeningHours>,

  /**
   * Public-holiday or special trading hours. Add an entry here when the owners
   * announce a change; the "open now" status and Visit page read from it.
   */
  hoursExceptions: [] as HoursException[],

  holidayNote: "Hours can change on public holidays. Check Instagram for holiday trading updates before you travel.",

  /** Source: Instagram post welcoming the store to Guildford Plaza. */
  parkingNote: "Parking is available at the back of Guildford Plaza.",

  /** Source: Instagram grand-opening posts. */
  openedAt: "2026-05-15",

  links: {
    instagram: "https://www.instagram.com/hamzebrothersfruitmarket/",
    instagramHandle: "@hamzebrothersfruitmarket",
    featuredReel: "https://www.instagram.com/reel/DetxR1dTxrf/",
    googleMapsListing: "https://maps.app.goo.gl/srSYqLVz4QsCJh4x7",
    googleDirections:
      "https://www.google.com/maps/dir/?api=1&destination=Hamze%20Brothers%20Fruit%20Market%2C%20282%20Guildford%20Rd%2C%20Guildford%20NSW%202161&destination_place_id=ChIJGwQwlcS9EmsRjPzZew1lE_8",
    appleDirections:
      "https://maps.apple.com/?daddr=282%20Guildford%20Rd%2C%20Guildford%20NSW%202161&q=Hamze%20Brothers%20Fruit%20Market",
  },

  /** Contact channels the business has published. Instagram only for now. */
  contact: {
    phone: null as string | null,
    email: null as string | null,
  },
} as const;

export const fullAddress = `${business.address.street}, ${business.address.suburb} ${business.address.state} ${business.address.postcode}`;

export const studio = {
  name: "AB Web Studio",
  url: "https://abwebstudio.com.au",
} as const;
