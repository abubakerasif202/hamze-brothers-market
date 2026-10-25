import { describe, expect, it } from "vitest";
import { sampleExpired, sampleSpecials } from "@/content/specials-sample";
import { specials } from "@/content/specials";
import { activeSpecials, formatOfferDates, splitPrice } from "./specials";
import { zonedNow } from "./time";

describe("splitPrice", () => {
  it("separates amount and unit", () => {
    expect(splitPrice("$2.99/kg")).toEqual({ amount: "$2.99", unit: "kg" });
    expect(splitPrice(" 49c / kg ")).toEqual({ amount: "49c", unit: "kg" });
    expect(splitPrice("$25/box")).toEqual({ amount: "$25", unit: "box" });
  });
  it("shows free-text prices whole", () => {
    expect(splitPrice("2 for $5")).toEqual({ amount: "2 for $5" });
    expect(splitPrice("$3.99")).toEqual({ amount: "$3.99" });
  });
});

describe("formatOfferDates", () => {
  it("handles single-day and ranges", () => {
    expect(formatOfferDates("2026-11-08", "2026-11-08")).toBe("Sun, 8 Nov only");
    expect(formatOfferDates("2026-11-07", "2026-11-08")).toBe("Sat, 7 Nov to Sun, 8 Nov");
  });
});

describe("offer expiry in Sydney time", () => {
  const all = [sampleExpired, ...sampleSpecials];
  it("hides offers before they start and after they end (inclusive end date)", () => {
    expect(activeSpecials(all, "2026-11-06")).toEqual([]);
    expect(activeSpecials(all, "2026-11-07")).toHaveLength(sampleSpecials.length);
    expect(activeSpecials(all, "2026-11-08")).toHaveLength(sampleSpecials.length);
    expect(activeSpecials(all, "2026-11-09")).toEqual([]);
  });
  it("never lets an expired offer through", () => {
    expect(activeSpecials(all, "2026-11-07").map((s) => s.id)).not.toContain("sample-expired");
  });
  it("uses the Sydney calendar day, not the visitor's", () => {
    // 2026-11-08 20:00 UTC is already 7am on 9 Nov in Sydney (AEDT, UTC+11): the weekend offer has ended.
    expect(zonedNow(new Date("2026-11-08T20:00:00Z")).date).toBe("2026-11-09");
    expect(activeSpecials(sampleSpecials, zonedNow(new Date("2026-11-08T20:00:00Z")).date)).toEqual([]);
    // 2026-11-07 14:00 UTC is 1am on 8 Nov in Sydney: still inside the window.
    expect(activeSpecials(sampleSpecials, zonedNow(new Date("2026-11-07T14:00:00Z")).date)).toHaveLength(8);
  });
});

describe("public specials data", () => {
  it("never contains sample content", () => {
    const sampleIds = new Set([...sampleSpecials, sampleExpired].map((s) => s.id));
    expect(specials.filter((s) => sampleIds.has(s.id))).toEqual([]);
    expect(specials.filter((s) => s.id.startsWith("sample-"))).toEqual([]);
  });
});
