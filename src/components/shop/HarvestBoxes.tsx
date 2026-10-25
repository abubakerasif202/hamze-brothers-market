"use client";

import { useState } from "react";
import { demoBoxes } from "@/content/demo/boxes";
import { demoProductById } from "@/content/demo/products";
import { addBundle, bundleTotalCents, formatCents, formatQty } from "@/lib/basket";
import { updateBasket } from "@/lib/basket-store";
import { celebrateAdd } from "../fun/celebrate";
import { Icon } from "../Icon";
import { Photo } from "../Photo";
import { useShop } from "./actions";

/**
 * Quick-fill bundles for the shopping preview. Rendered on the home page
 * (outside the shop provider) and inside the shop, so it keeps its own
 * screen-reader announcement and forwards it to the shop one when present.
 */
export function HarvestBoxes({ compact = false }: { compact?: boolean }) {
  const { announce } = useShop();
  const [message, setMessage] = useState("");

  const add = (boxId: string, source: HTMLElement) => {
    const box = demoBoxes.find((b) => b.id === boxId);
    if (!box) return;
    celebrateAdd(source);
    updateBasket((s) => addBundle(s, box.lines, demoProductById));
    const text = `${box.name} added to the demo basket.`;
    announce(text);
    setMessage("");
    requestAnimationFrame(() => setMessage(text));
  };

  return (
    <div>
      <ul className={`grid gap-4 ${compact ? "md:grid-cols-3" : "md:grid-cols-3 lg:gap-6"}`}>
        {demoBoxes.map((box) => {
          const total = bundleTotalCents(box.lines, demoProductById);
          return (
            <li
              key={box.id}
              className="flex flex-col overflow-hidden rounded-[var(--radius-tile)] bg-paper shadow-[0_1px_0_rgb(14_59_42/0.08)]"
            >
              {!compact && (
                <div className="relative aspect-[16/10] bg-cream-deep">
                  <Photo
                    image={box.image}
                    fallbackLabel={box.name}
                    sizes="(min-width: 768px) 30vw, 92vw"
                    altOverride=""
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-display text-xl leading-tight font-bold text-crate">{box.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{box.blurb}</p>
                <ul className="mt-3 space-y-0.5 text-sm text-ink">
                  {box.lines.map((line) => {
                    const product = demoProductById.get(line.productId);
                    if (!product) return null;
                    return (
                      <li key={line.productId}>
                        {product.name} <span className="text-ink-soft">· {formatQty(line.qty, product)}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-crate">
                  <span className="font-bold tabular-nums">{formatCents(total)}</span>
                  <span className="rounded-sm bg-citrus/25 px-1.5 py-px text-[0.7rem] font-bold text-ink">
                    Demo price
                  </span>
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-4 !min-h-11 !py-2"
                  onClick={(e) => add(box.id, e.currentTarget)}
                >
                  <Icon name="plus" />
                  Add box<span className="sr-only"> {box.name} to demo basket</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-ink-soft">
        Example bundles for the shopping preview only. Prices are demo prices, not store prices, and no order or payment
        is submitted.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
