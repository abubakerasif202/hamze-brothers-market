/**
 * Google Places API (New) — rating and reviews for the shop's Google listing.
 *
 * Google's Places policies do not allow pre-fetching, caching or storing
 * Places content (other than the place ID), so this module is only ever called
 * at request time with `cache: "no-store"`. Never copy review text or the
 * rating into the codebase.
 */

export interface GoogleReview {
  id: string;
  rating: number;
  text: string;
  /** True when Google translated the review from another language. */
  translated: boolean;
  relativeTime: string;
  publishTime: string | null;
  reviewUrl: string | null;
  author: { name: string; url: string | null; photoUrl: string | null };
}

export type GoogleReviewsResult =
  | {
      status: "ok";
      rating: number | null;
      ratingCount: number;
      listingUrl: string | null;
      reviews: GoogleReview[];
    }
  | { status: "unconfigured" }
  | { status: "error" };

interface PlacesLocalizedText {
  text?: string;
  languageCode?: string;
}

interface PlacesReview {
  name?: string;
  rating?: number;
  text?: PlacesLocalizedText;
  originalText?: PlacesLocalizedText;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}

export interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

const FIELD_MASK = "rating,userRatingCount,googleMapsUri,reviews";

/** Only allow https links back to Google properties. */
function safeGoogleUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname;
    const allowed =
      host === "google.com" ||
      host.endsWith(".google.com") ||
      host === "goo.gl" ||
      host.endsWith(".goo.gl") ||
      host.endsWith(".googleusercontent.com");
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

function clampRating(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(5, Math.max(1, value)) : null;
}

/** Normalise the raw Places response into the shape the UI renders. Pure, so it is unit tested. */
export function normalisePlacesResponse(data: PlacesResponse): Extract<GoogleReviewsResult, { status: "ok" }> {
  const reviews: GoogleReview[] = [];
  for (const [index, r] of (data.reviews ?? []).entries()) {
    const text = r.text?.text?.trim();
    const rating = clampRating(r.rating);
    const name = r.authorAttribution?.displayName?.trim();
    if (!text || rating === null || !name) continue;
    const original = r.originalText?.languageCode;
    reviews.push({
      id: r.name ?? `review-${index}`,
      rating,
      text,
      translated: Boolean(original && r.text?.languageCode && original !== r.text.languageCode),
      relativeTime: r.relativePublishTimeDescription ?? "",
      publishTime: r.publishTime ?? null,
      reviewUrl: safeGoogleUrl(r.googleMapsUri),
      author: {
        name,
        url: safeGoogleUrl(r.authorAttribution?.uri),
        photoUrl: safeGoogleUrl(r.authorAttribution?.photoUri),
      },
    });
  }
  return {
    status: "ok",
    rating: clampRating(data.rating),
    ratingCount: typeof data.userRatingCount === "number" ? Math.max(0, Math.floor(data.userRatingCount)) : 0,
    listingUrl: safeGoogleUrl(data.googleMapsUri),
    reviews,
  };
}

/** Server-side only: reads GOOGLE_PLACES_API_KEY. Called per request, never cached. */
export async function fetchGoogleReviews(placeId: string): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { status: "unconfigured" };

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en&regionCode=AU`,
      {
        headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) {
      // Log status only — never the key or response body.
      console.error(`Google Places request failed with status ${res.status}`);
      return { status: "error" };
    }
    return normalisePlacesResponse((await res.json()) as PlacesResponse);
  } catch (error) {
    console.error("Google Places request failed:", error instanceof Error ? error.name : "unknown error");
    return { status: "error" };
  }
}
