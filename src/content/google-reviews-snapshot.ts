/**
 * TEMPORARY SNAPSHOT of the shop's Google Maps rating and selected reviews.
 *
 * Copied by hand from the public Google Maps listing on 25 Oct 2026 at the
 * owner's request, as a stop-gap until GOOGLE_PLACES_API_KEY is configured.
 * Once the key is set, the live Google data replaces this automatically.
 *
 * Rules while this snapshot is in use:
 * - Copy reviews word for word; never edit, combine or write reviews.
 * - Keep `capturedOn` accurate; it is shown on the site.
 * - Update rating/count when the listing changes, or remove the snapshot.
 * - Do not add these to structured data (JSON-LD).
 */

export interface SnapshotReview {
  author: string;
  rating: number;
  text: string;
}

export const googleReviewsSnapshot = {
  capturedOn: "2026-10-25",
  capturedOnLabel: "25 October 2026",
  rating: 5.0,
  ratingCount: 8,
  /** Selection of written reviews from the listing (all reviews on the listing were 5 stars). */
  reviews: [
    {
      author: "Edison Liang",
      rating: 5,
      text: "It is a fantastic local fruit and vegetable store. It’s a family-run business, and you can really feel it from the moment you walk in, the staff are very friendly, welcoming, and always happy to help.\n\nThe produce is consistently fresh, with a great variety at reasonable prices. The shop is well organised and easy to navigate, making grocery shopping quick and convenient.\n\nA great community-style store that offers both quality and genuine customer service. Highly recommended.",
    },
    {
      author: "Moody Sabra",
      rating: 5,
      text: "Best fruit market around! 🍎🍓 Always fresh fruit and vegetables, great quality, and good prices. The staff are friendly and the service is excellent. Everything is well presented and there’s always a great variety to choose from.\n\nHighly recommend checking them out. Will definitely be coming back! 👌",
    },
    {
      author: "ali al salman",
      rating: 5,
      text: "Very friendly people, affordable prices, has everything you need from your local store",
    },
    {
      author: "Sophie",
      rating: 5,
      text: "Friendly and helpful, love the little marketing member ❤️",
    },
  ] satisfies SnapshotReview[],
} as const;
