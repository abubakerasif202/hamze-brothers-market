import { describe, expect, it } from "vitest";
import { demoBoxes } from "@/content/demo/boxes";
import { demoProductById } from "@/content/demo/products";
import { addBundle, bundleTotalCents, EMPTY_BASKET, normaliseQty, summarise } from "./basket";

describe("demo harvest boxes", () => {
  it("has three bundles with unique ids", () => {
    expect(demoBoxes).toHaveLength(3);
    expect(new Set(demoBoxes.map((b) => b.id)).size).toBe(3);
  });

  it.each(demoBoxes)("$name only uses catalogue products with valid quantities", (box) => {
    for (const line of box.lines) {
      const product = demoProductById.get(line.productId);
      expect(product, line.productId).toBeDefined();
      expect(normaliseQty(line.qty, product!), line.productId).toBe(line.qty);
    }
  });

  it.each(demoBoxes)("$name total equals the basket subtotal after adding it", (box) => {
    const next = addBundle(EMPTY_BASKET, box.lines, demoProductById);
    expect(summarise(next.lines, demoProductById).demoSubtotalCents).toBe(bundleTotalCents(box.lines, demoProductById));
  });

  it("stacks on existing lines and never exceeds maxQty", () => {
    let state = EMPTY_BASKET;
    for (let i = 0; i < 30; i++) state = addBundle(state, demoBoxes[2].lines, demoProductById);
    expect(state.lines["orange-juice"]).toBe(demoProductById.get("orange-juice")!.maxQty);
  });

  it("ignores unknown products", () => {
    const next = addBundle(EMPTY_BASKET, [{ productId: "nope", qty: 1 }], demoProductById);
    expect(next).toBe(EMPTY_BASKET);
  });
});
