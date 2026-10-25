/**
 * DEMONSTRATION BUNDLES — NOT REAL PRODUCTS OR PRICES.
 *
 * Quick-fill bundles for the Online Shopping Preview. Each bundle only
 * references products from the demo catalogue, so its total is simply the sum
 * of those demo prices (no discount is implied). Contents are examples only;
 * the shop has not confirmed that it packs boxes like these.
 */

import type { ImageKey } from "../images";

export interface DemoBoxLine {
  /** Must match an id in the demo catalogue (checked by a unit test). */
  productId: string;
  qty: number;
}

export interface DemoBox {
  id: string;
  name: string;
  blurb: string;
  image: ImageKey;
  lines: readonly DemoBoxLine[];
}

export const demoBoxes: readonly DemoBox[] = [
  {
    id: "family-produce",
    name: "Family fruit & veg box",
    blurb: "A week of everyday fruit and veg for the family table.",
    image: "fruitAssortment",
    lines: [
      { productId: "navel-oranges", qty: 2 },
      { productId: "red-apples", qty: 1.5 },
      { productId: "bananas", qty: 1 },
      { productId: "tomatoes", qty: 1 },
      { productId: "carrots", qty: 1 },
      { productId: "potatoes", qty: 2 },
    ],
  },
  {
    id: "mezze-crate",
    name: "Levantine mezze crate",
    blurb: "Tomatoes, lettuce, lemons and house shanklish for a shared table.",
    image: "vegetables",
    lines: [
      { productId: "tomatoes", qty: 1 },
      { productId: "lettuce", qty: 1 },
      { productId: "lemons", qty: 0.5 },
      { productId: "shanklish", qty: 1 },
      { productId: "spice-mix", qty: 1 },
    ],
  },
  {
    id: "juice-trio",
    name: "Pressed juice trio",
    blurb: "Three 1L bottles pressed in store: orange, carrot and pomegranate.",
    image: "orangeJuiceBottle",
    lines: [
      { productId: "orange-juice", qty: 1 },
      { productId: "carrot-juice", qty: 1 },
      { productId: "pomegranate-juice", qty: 1 },
    ],
  },
];
