import { connection } from "next/server";
import { business } from "@/content/business";
import { fetchGoogleReviews, type GoogleReviewsResult } from "@/lib/google-reviews";

/**
 * Live Google rating and reviews for the shop's listing.
 * Always runs at request time and is never cached, per Google's Places policies.
 * The place ID is fixed server-side, so callers can't use this to query other places.
 */

// Share one upstream call between requests that arrive while it is in flight
// (de-duplication only — results are not kept after the call completes).
let inFlight: Promise<GoogleReviewsResult> | null = null;

export async function GET() {
  await connection();
  if (!inFlight) {
    inFlight = fetchGoogleReviews(business.googlePlaceId).finally(() => {
      inFlight = null;
    });
  }
  const result = await inFlight;
  return Response.json(result, {
    status: result.status === "error" ? 502 : 200,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
