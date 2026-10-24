import { describe, expect, it } from "vitest";
import { normalisePlacesResponse } from "./google-reviews";

describe("normalisePlacesResponse", () => {
  it("maps Places fields, keeps Google order and flags translations", () => {
    const out = normalisePlacesResponse({
      rating: 4.8,
      userRatingCount: 12,
      googleMapsUri: "https://maps.google.com/?cid=1",
      reviews: [
        {
          name: "places/x/reviews/a",
          rating: 5,
          text: { text: "  Great shop  ", languageCode: "en" },
          originalText: { text: "Great shop", languageCode: "en" },
          relativePublishTimeDescription: "a week ago",
          googleMapsUri: "https://www.google.com/maps/reviews/a",
          authorAttribution: {
            displayName: "Sam",
            uri: "https://www.google.com/maps/contrib/1",
            photoUri: "https://lh3.googleusercontent.com/a/p",
          },
        },
        {
          name: "places/x/reviews/b",
          rating: 3,
          text: { text: "Bueno", languageCode: "en" },
          originalText: { text: "Bueno", languageCode: "es" },
          authorAttribution: { displayName: "Ana" },
        },
      ],
    });
    expect(out.rating).toBe(4.8);
    expect(out.ratingCount).toBe(12);
    expect(out.reviews.map((r) => r.author.name)).toEqual(["Sam", "Ana"]);
    expect(out.reviews[0].text).toBe("Great shop");
    expect(out.reviews[0].translated).toBe(false);
    expect(out.reviews[1].translated).toBe(true);
    expect(out.reviews[1].reviewUrl).toBeNull();
  });

  it("drops incomplete reviews and unsafe links", () => {
    const out = normalisePlacesResponse({
      reviews: [
        { rating: 5, text: { text: "" }, authorAttribution: { displayName: "Empty" } },
        { rating: 5, text: { text: "No author" } },
        {
          rating: 9,
          text: { text: "Bad links" },
          googleMapsUri: "javascript:alert(1)",
          authorAttribution: {
            displayName: "Lee",
            uri: "https://evil.example.com",
            photoUri: "http://lh3.googleusercontent.com/x",
          },
        },
      ],
    });
    expect(out.reviews).toHaveLength(1);
    const [r] = out.reviews;
    expect(r.rating).toBe(5);
    expect(r.reviewUrl).toBeNull();
    expect(r.author.url).toBeNull();
    expect(r.author.photoUrl).toBeNull();
    expect(out.rating).toBeNull();
    expect(out.ratingCount).toBe(0);
  });
});
