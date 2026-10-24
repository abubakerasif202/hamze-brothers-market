import { describe, expect, it } from "vitest";
import { business } from "@/content/business";
import type { Special } from "@/content/specials";
import { specials } from "@/content/specials";
import { collectionDays } from "./slots";
import { activeSpecials, formatShortDate } from "./specials";
import { formatTime, openStatus, zonedNow } from "./time";

describe("zonedNow", () => {
  it("reads Sydney wall-clock time regardless of host time zone", () => {
    // 2026-10-24T21:50Z is Sun 25 Oct 08:50 AEDT (UTC+11)
    const z = zonedNow(new Date("2026-10-24T21:50:00Z"));
    expect(z).toEqual({ date: "2026-10-25", day: "sun", minutes: 8 * 60 + 50 });
  });

  it("handles standard time (UTC+10) in winter", () => {
    const z = zonedNow(new Date("2026-06-30T23:30:00Z"));
    expect(z.date).toBe("2026-07-01");
    expect(z.minutes).toBe(9 * 60 + 30);
  });
});

describe("openStatus", () => {
  const at = (minutes: number, date = "2026-10-25") => ({ date, day: "sun" as const, minutes });

  it("is open between 8am and 9:30pm", () => {
    expect(openStatus(at(8 * 60), business.hours).state).toBe("open");
    expect(openStatus(at(21 * 60 + 29), business.hours).state).toBe("open");
  });

  it("is before-open early and closed late", () => {
    expect(openStatus(at(7 * 60 + 59), business.hours).state).toBe("before-open");
    expect(openStatus(at(21 * 60 + 30), business.hours).state).toBe("closed-for-day");
  });

  it("applies holiday exceptions", () => {
    const closed = openStatus(at(12 * 60), business.hours, [{ date: "2026-10-25", label: "Holiday", closed: true }]);
    expect(closed).toMatchObject({ state: "closed-for-day", exception: { label: "Holiday" } });
    const short = openStatus(at(15 * 60), business.hours, [
      { date: "2026-10-25", label: "Holiday", open: "09:00", close: "14:00" },
    ]);
    expect(short.state).toBe("closed-for-day");
  });
});

describe("formatTime", () => {
  it("formats 24h to friendly 12h", () => {
    expect(formatTime("08:00")).toBe("8am");
    expect(formatTime("21:30")).toBe("9:30pm");
    expect(formatTime("12:00")).toBe("12pm");
    expect(formatTime("00:15")).toBe("12:15am");
  });
});

describe("specials", () => {
  const list: Special[] = [
    { id: "a", title: "A", price: "$1", startDate: "2026-10-20", endDate: "2026-10-26" },
    { id: "b", title: "B", price: "$2", startDate: "2026-10-25", endDate: "2026-10-25" },
    { id: "c", title: "C", price: "$3", startDate: "2026-10-01", endDate: "2026-10-24" },
    { id: "d", title: "D", price: "$4", startDate: "2026-10-26", endDate: "2026-10-30" },
  ];

  it("only returns specials running today, soonest-ending first", () => {
    expect(activeSpecials(list, "2026-10-25").map((s) => s.id)).toEqual(["b", "a"]);
    expect(activeSpecials(list, "2026-11-01")).toEqual([]);
  });

  it("every configured special has a valid, ordered date range", () => {
    for (const s of specials) {
      expect(s.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.endDate >= s.startDate).toBe(true);
    }
  });

  it("formats dates without time-zone drift", () => {
    expect(formatShortDate("2026-11-08")).toMatch(/^Sun,? 8 Nov$/);
  });
});

describe("collectionDays", () => {
  it("offers windows inside opening hours with lead time today", () => {
    const days = collectionDays({ date: "2026-10-25", day: "sun", minutes: 14 * 60 }, business.hours, []);
    expect(days).toHaveLength(3);
    expect(days[0].label.startsWith("Today")).toBe(true);
    expect(days[0].slots[0].label).toBe("5pm to 7pm");
    expect(days[1].slots.map((s) => s.label)).toEqual([
      "9am to 11am",
      "11am to 1pm",
      "1pm to 3pm",
      "3pm to 5pm",
      "5pm to 7pm",
      "7pm to 9pm",
    ]);
  });

  it("skips today when it is too late and skips closed days", () => {
    const days = collectionDays({ date: "2026-10-25", day: "sun", minutes: 20 * 60 }, business.hours, [
      { date: "2026-10-26", label: "Closed", closed: true },
    ]);
    expect(days.map((d) => d.date)).toEqual(["2026-10-27", "2026-10-28", "2026-10-29"]);
  });
});
