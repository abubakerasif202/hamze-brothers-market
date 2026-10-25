"use client";

import { useEffect, useRef } from "react";
import { categoryById } from "@/content/categories";
import type { DemoProduct } from "@/content/demo/products";
import { formatCents } from "@/lib/basket";
import { celebrateAdd } from "../fun/celebrate";
import { Icon } from "../Icon";
import { Photo } from "../Photo";
import { addProduct, stepProduct, useShop } from "./actions";
import { QuantityStepper } from "./QuantityStepper";

export function DemoPrice({ product, className = "" }: { product: DemoProduct; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-bold text-crate tabular-nums">{formatCents(product.demoPriceCents)}</span>
      <span className="text-sm text-ink-soft">{product.unitLabel}</span>
      <span className="ml-1 rounded-sm bg-citrus/25 px-1.5 py-px text-[0.7rem] font-bold text-ink">Demo price</span>
    </span>
  );
}

export function ProductCard({ product, qty }: { product: DemoProduct; qty: number }) {
  const { announce, openProduct } = useShop();
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<"plus" | "add" | null>(null);

  // When the control swaps between "Add" and the stepper, carry focus across.
  useEffect(() => {
    if (focusNext.current === "plus" && qty > 0) plusRef.current?.focus();
    if (focusNext.current === "add" && qty === 0) addRef.current?.focus();
    focusNext.current = null;
  }, [qty]);

  const category = categoryById[product.category];

  return (
    <article className="group flex w-full flex-row overflow-hidden rounded-[var(--radius-tile)] bg-paper shadow-[0_1px_0_rgb(14_59_42/0.08)] sm:flex-col">
      <div className="relative w-[38%] shrink-0 bg-cream-deep sm:aspect-[4/3] sm:w-full">
        <button
          type="button"
          onClick={() => openProduct(product.id)}
          className="relative block size-full overflow-hidden"
          aria-label={`View details for ${product.name}`}
        >
          <Photo
            image={product.image}
            fallbackLabel={product.name}
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 40vw"
            altOverride=""
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </button>
        {product.tags?.[0] && (
          <span
            aria-hidden="true"
            className="ticket pointer-events-none absolute top-2 left-2 bg-cream text-xs text-crate sm:top-3 sm:left-3 sm:text-sm"
          >
            {product.tags[0]}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="text-sm font-semibold text-ink-soft">{category.name}</p>
        <h3 className="mt-0.5 font-display text-xl leading-tight font-bold">
          <button type="button" className="text-left hover:text-crate" onClick={() => openProduct(product.id)}>
            {product.name}
          </button>
        </h3>
        <DemoPrice product={product} className="mt-2 flex-wrap" />
        <div className="mt-auto flex min-h-11 items-center pt-3 sm:pt-4">
          {qty > 0 ? (
            <QuantityStepper
              product={product}
              qty={qty}
              plusRef={plusRef}
              onStep={(dir) => {
                if (dir === -1 && qty <= product.step) focusNext.current = "add";
                announce(stepProduct(product.id, dir));
              }}
            />
          ) : (
            <button
              ref={addRef}
              type="button"
              className="btn btn-primary !min-h-11 !py-2"
              onClick={(e) => {
                celebrateAdd(e.currentTarget);
                focusNext.current = "plus";
                announce(addProduct(product.id));
              }}
            >
              <Icon name="plus" />
              Add<span className="sr-only"> {product.name} to demo basket</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
