"use client";

import { useRef } from "react";
import { categoryById } from "@/content/categories";
import type { DemoProduct } from "@/content/demo/products";
import { celebrateAdd } from "../fun/celebrate";
import { Icon } from "../Icon";
import { Photo } from "../Photo";
import { addProduct, stepProduct, useShop } from "./actions";
import { DemoPrice } from "./ProductCard";
import { QuantityStepper } from "./QuantityStepper";

export function ProductDetails({ product, qty }: { product: DemoProduct; qty: number }) {
  const { announce } = useShop();
  const plusRef = useRef<HTMLButtonElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <div className="relative aspect-[16/10] bg-cream-deep">
        <Photo image={product.image} fallbackLabel={product.name} sizes="(min-width: 640px) 640px, 100vw" />
      </div>
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold text-ink-soft">{categoryById[product.category].name}</p>
        <DemoPrice product={product} className="flex-wrap text-lg" />
        <p className="text-ink-soft">{product.description}</p>
        {product.tags && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {product.tags.map((t) => (
              <li key={t} className="ticket bg-cream-deep text-sm text-crate">
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="flex gap-2 rounded-xl bg-cream-deep/60 p-3 text-sm text-ink-soft">
          <Icon name="info" className="mt-0.5 shrink-0" />
          Sample product for the shopping preview. Stock, sizes and prices would come from the shop before launch.
        </p>
        <div className="flex min-h-11 items-center pt-1">
          {qty > 0 ? (
            <QuantityStepper
              product={product}
              qty={qty}
              plusRef={plusRef}
              onStep={(dir) => {
                const removing = dir === -1 && qty <= product.step;
                announce(stepProduct(product.id, dir));
                if (removing) requestAnimationFrame(() => addRef.current?.focus());
              }}
            />
          ) : (
            <button
              ref={addRef}
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                celebrateAdd(e.currentTarget);
                announce(addProduct(product.id));
                requestAnimationFrame(() => plusRef.current?.focus());
              }}
            >
              <Icon name="plus" />
              Add to demo basket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
