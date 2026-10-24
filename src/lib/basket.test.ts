import { describe, expect, it } from "vitest";
import { demoProductById, demoProducts } from "@/content/demo/products";
import { categories } from "@/content/categories";
import { images } from "@/content/images";
import {
  addToBasket,
  EMPTY_BASKET,
  formatCents,
  formatQty,
  normaliseQty,
  parseStoredBasket,
  serialiseBasket,
  stepLine,
  summarise,
} from "./basket";

const kgItem = demoProductById.get("navel-oranges")!;
const eachItem = demoProductById.get("orange-juice")!;

describe("normaliseQty", () => {
  it("rounds to the product step and clamps to max", () => {
    expect(normaliseQty(1.3, kgItem)).toBe(1.5);
    expect(normaliseQty(99, kgItem)).toBe(kgItem.maxQty);
    expect(normaliseQty(-1, kgItem)).toBe(0);
    expect(normaliseQty(Number.NaN, kgItem)).toBe(0);
  });
});

describe("parseStoredBasket", () => {
  it("returns an empty basket for missing data", () => {
    expect(parseStoredBasket(null, demoProductById)).toBe(EMPTY_BASKET);
  });

  it("recovers from invalid JSON", () => {
    expect(parseStoredBasket("{nope", demoProductById)).toEqual({ lines: {}, recovered: true });
  });

  it("drops unknown products and invalid quantities", () => {
    const raw = JSON.stringify({ lines: { "navel-oranges": "lots", ghost: 2, watermelon: 2.3, "orange-juice": 2 } });
    const parsed = parseStoredBasket(raw, demoProductById);
    expect(parsed.lines).toEqual({ watermelon: 2.5, "orange-juice": 2 });
    expect(parsed.recovered).toBe(true);
  });

  it("round-trips a valid basket without flagging recovery", () => {
    const state = { lines: { "orange-juice": 3, "navel-oranges": 1.5 }, recovered: false };
    expect(parseStoredBasket(serialiseBasket(state), demoProductById)).toEqual(state);
  });

  it("rejects arrays and primitives", () => {
    expect(parseStoredBasket("[1,2]", demoProductById).recovered).toBe(true);
    expect(parseStoredBasket('{"lines":[1]}', demoProductById).recovered).toBe(true);
    expect(parseStoredBasket("42", demoProductById).recovered).toBe(true);
  });
});

describe("basket mutations", () => {
  it("adds by step, increments and removes at zero", () => {
    let s = addToBasket(EMPTY_BASKET, kgItem.id, demoProductById);
    expect(s.lines[kgItem.id]).toBe(0.5);
    s = stepLine(s, kgItem.id, 1, demoProductById);
    expect(s.lines[kgItem.id]).toBe(1);
    s = stepLine(s, kgItem.id, -1, demoProductById);
    s = stepLine(s, kgItem.id, -1, demoProductById);
    expect(kgItem.id in s.lines).toBe(false);
  });

  it("ignores unknown products", () => {
    expect(addToBasket(EMPTY_BASKET, "ghost", demoProductById)).toBe(EMPTY_BASKET);
  });

  it("summarises demo totals", () => {
    const lines = { [kgItem.id]: 1.5, [eachItem.id]: 2 };
    const sum = summarise(lines, demoProductById);
    expect(sum.itemCount).toBe(3);
    expect(sum.demoSubtotalCents).toBe(Math.round(kgItem.demoPriceCents * 1.5) + eachItem.demoPriceCents * 2);
  });

  it("formats quantities and currency", () => {
    expect(formatQty(1.5, kgItem)).toBe("1.5 kg");
    expect(formatQty(2, eachItem)).toBe("2 × 1L bottle");
    expect(formatCents(1234)).toBe("$12.34");
  });
});

describe("demo catalogue integrity", () => {
  it("has unique ids, valid categories and image keys", () => {
    const ids = new Set(demoProducts.map((p) => p.id));
    expect(ids.size).toBe(demoProducts.length);
    const cats = new Set(categories.map((c) => c.id));
    for (const p of demoProducts) {
      expect(cats.has(p.category)).toBe(true);
      if (p.image) expect(images[p.image]).toBeDefined();
      expect(p.demoPriceCents).toBeGreaterThan(0);
      expect(p.maxQty).toBeGreaterThanOrEqual(p.step);
    }
  });
});
