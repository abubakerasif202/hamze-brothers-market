"use client";

import { useRef } from "react";
import { demoProductById } from "@/content/demo/products";
import { formatCents, summarise, type BasketState } from "@/lib/basket";
import { dismissRecoveredNotice } from "@/lib/basket-store";
import { Icon } from "../Icon";
import { clearBasket, stepProduct, useShop } from "./actions";
import { QuantityStepper } from "./QuantityStepper";

export function BasketContents({
  basket,
  headingLevel = "h2",
  idPrefix,
  onStartCollect,
}: {
  basket: BasketState;
  headingLevel?: "h2" | "h3";
  idPrefix: string;
  onStartCollect: () => void;
}) {
  const { announce } = useShop();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const entries = Object.entries(basket.lines).filter(([id]) => demoProductById.has(id));
  const { itemCount, demoSubtotalCents } = summarise(basket.lines, demoProductById);
  const Heading = headingLevel;

  const moveFocusAfterRemoval = (index: number) => {
    // After React re-renders, focus the neighbouring line's "-" button, or the heading.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-line-minus]");
      const target = buttons?.[Math.min(index, (buttons?.length ?? 1) - 1)];
      if (target) target.focus();
      else headingRef.current?.focus();
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {headingLevel === "h2" ? (
        <div className="flex items-baseline justify-between gap-3">
          <Heading
            ref={headingRef}
            tabIndex={-1}
            id={`${idPrefix}-heading`}
            className="sign text-3xl text-crate focus:outline-none"
          >
            Demo basket
          </Heading>
          <span className="text-sm font-semibold text-ink-soft">
            {itemCount === 0 ? "Empty" : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          </span>
        </div>
      ) : (
        // Inside the basket sheet the dialog already carries the title; keep a focusable status line.
        <Heading
          ref={headingRef}
          tabIndex={-1}
          id={`${idPrefix}-heading`}
          className="text-sm font-semibold text-ink-soft focus:outline-none"
        >
          {itemCount === 0 ? "Nothing added yet" : `${itemCount} ${itemCount === 1 ? "item" : "items"} added`}
        </Heading>
      )}

      {basket.recovered && (
        <div className="flex items-start gap-3 rounded-xl bg-citrus/20 p-3 text-sm" role="status">
          <Icon name="info" className="mt-0.5 shrink-0" />
          <p className="flex-1">Some saved basket items couldn&apos;t be read, so they were removed.</p>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center px-2 font-semibold underline"
            onClick={dismissRecoveredNotice}
          >
            Dismiss
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-crate/20 p-5 text-ink-soft">
          <p className="font-semibold text-ink">Your demo basket is empty.</p>
          <p className="mt-1 text-sm">Add a few items to try the click-and-collect preview.</p>
        </div>
      ) : (
        <>
          <ul ref={listRef} className="divide-y divide-ink/10">
            {entries.map(([id, qty], index) => {
              const product = demoProductById.get(id)!;
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-sm text-ink-soft tabular-nums">
                      {formatCents(Math.round(product.demoPriceCents * qty))} <span className="text-xs">(demo)</span>
                    </p>
                  </div>
                  <QuantityStepper
                    size="sm"
                    product={product}
                    qty={qty}
                    minusRef={(el) => {
                      if (el) el.dataset.lineMinus = "";
                    }}
                    onStep={(dir) => {
                      const removing = dir === -1 && qty <= product.step;
                      announce(stepProduct(id, dir));
                      if (removing) moveFocusAfterRemoval(index);
                    }}
                  />
                </li>
              );
            })}
          </ul>
          <div className="rounded-2xl bg-cream-deep/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Demo subtotal</span>
              <span className="text-xl font-bold text-crate tabular-nums">{formatCents(demoSubtotalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Illustrative demo pricing only. These are not Hamze Brothers&apos; prices.
            </p>
          </div>
          <button type="button" className="btn btn-citrus w-full" onClick={onStartCollect}>
            Preview click &amp; collect
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center self-center py-2 text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-pomegranate"
            onClick={() => {
              announce(clearBasket());
              headingRef.current?.focus();
            }}
          >
            Empty demo basket
          </button>
        </>
      )}
    </div>
  );
}
