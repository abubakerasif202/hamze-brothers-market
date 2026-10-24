"use client";

import { createContext, useContext } from "react";
import { demoProductById } from "@/content/demo/products";
import { addToBasket, formatQty, setLine, stepLine } from "@/lib/basket";
import { updateBasket } from "@/lib/basket-store";

export interface ShopContextValue {
  announce: (message: string) => void;
  openProduct: (id: string) => void;
}

export const ShopContext = createContext<ShopContextValue>({
  announce: () => {},
  openProduct: () => {},
});

export const useShop = () => useContext(ShopContext);

/** Basket mutations that also return a screen-reader announcement. */
export function addProduct(id: string): string {
  let message = "";
  updateBasket((s) => {
    const next = addToBasket(s, id, demoProductById);
    const p = demoProductById.get(id);
    if (p) message = `${p.name} added. ${formatQty(next.lines[id] ?? 0, p)} in demo basket.`;
    return next;
  });
  return message;
}

export function stepProduct(id: string, direction: 1 | -1): string {
  let message = "";
  updateBasket((s) => {
    const next = stepLine(s, id, direction, demoProductById);
    const p = demoProductById.get(id);
    const qty = next.lines[id] ?? 0;
    if (p) message = qty === 0 ? `${p.name} removed from demo basket.` : `${p.name}: ${formatQty(qty, p)}.`;
    return next;
  });
  return message;
}

export function removeProduct(id: string): string {
  const p = demoProductById.get(id);
  updateBasket((s) => setLine(s, id, 0, demoProductById));
  return p ? `${p.name} removed from demo basket.` : "";
}

export function clearBasket(): string {
  updateBasket(() => ({ lines: {}, recovered: false }));
  return "Demo basket emptied.";
}
