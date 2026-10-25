"use client";

import type { Ref } from "react";
import type { DemoProduct } from "@/content/demo/products";
import { formatQty } from "@/lib/basket";
import { Icon } from "../Icon";

interface Props {
  product: DemoProduct;
  qty: number;
  onStep: (direction: 1 | -1) => void;
  size?: "md" | "sm";
  plusRef?: Ref<HTMLButtonElement>;
  minusRef?: Ref<HTMLButtonElement>;
}

/**
 * The +/- buttons stay mounted while the quantity changes, so keyboard focus
 * never jumps. "+" uses aria-disabled at the limit (a disabled button would
 * drop focus). The parent decides where focus goes if the line is removed.
 */
export function QuantityStepper({ product, qty, onStep, size = "md", plusRef, minusRef }: Props) {
  const stepLabel = product.unit === "kg" ? `${product.step} kg` : "one";
  const atMax = qty >= product.maxQty;
  const removes = qty <= product.step;
  const btn =
    size === "md"
      ? "size-11 rounded-full bg-crate text-cream hover:bg-crate-soft cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
      : "size-11 rounded-full bg-cream-deep text-crate hover:bg-citrus/40 cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:opacity-40";
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Quantity of ${product.name}`}>
      <button
        ref={minusRef}
        type="button"
        className={`inline-grid place-items-center ${btn}`}
        onClick={() => onStep(-1)}
      >
        <Icon name={removes ? "trash" : "minus"} />
        <span className="sr-only">
          {removes ? `Remove ${product.name} from demo basket` : `Remove ${stepLabel} of ${product.name}`}
        </span>
      </button>
      <span className="min-w-[4.75rem] text-center font-bold tabular-nums">{formatQty(qty, product)}</span>
      <button
        ref={plusRef}
        type="button"
        className={`inline-grid place-items-center ${btn}`}
        aria-disabled={atMax || undefined}
        onClick={() => {
          if (!atMax) onStep(1);
        }}
      >
        <Icon name="plus" />
        <span className="sr-only">
          {atMax ? `Maximum quantity of ${product.name} reached` : `Add ${stepLabel} more ${product.name}`}
        </span>
      </button>
    </div>
  );
}
