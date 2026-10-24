"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { categories, type CategoryId } from "@/content/categories";
import { demoProductById, demoProducts } from "@/content/demo/products";
import { summarise } from "@/lib/basket";
import { useBasket } from "@/lib/basket-store";
import { Icon } from "../Icon";
import { ShopContext } from "./actions";
import { BasketContents } from "./BasketContents";
import { CollectPreview } from "./CollectPreview";
import { Dialog } from "./Dialog";
import { ProductCard } from "./ProductCard";
import { ProductDetails } from "./ProductDetails";

type Filter = CategoryId | "all";

const isCategory = (v: string | null): v is CategoryId => categories.some((c) => c.id === v);

function normalise(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function ShopPreview() {
  const params = useSearchParams();
  const initial = params.get("category");
  const [filter, setFilter] = useState<Filter>(isCategory(initial) ? initial : "all");
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const basket = useBasket();
  const { itemCount } = summarise(basket.lines, demoProductById);
  const searchId = useId();

  // Header basket link (/shop#basket) opens the basket sheet on small screens.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#basket" && !window.matchMedia("(min-width: 1024px)").matches) {
        setBasketOpen(true);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const announce = useCallback((message: string) => {
    // Clear then set so repeated identical messages are still read out.
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  const ctx = useMemo(() => ({ announce, openProduct: setProductId }), [announce]);

  const results = useMemo(() => {
    const q = normalise(query);
    return demoProducts.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!q) return true;
      return normalise(`${p.name} ${p.description} ${(p.tags ?? []).join(" ")}`).includes(q);
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: demoProducts.length };
    for (const p of demoProducts) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, []);

  const product = productId ? demoProductById.get(productId) : undefined;
  const closeProduct = useCallback(() => setProductId(null), []);
  const closeBasket = useCallback(() => setBasketOpen(false), []);
  const closeCollect = useCallback(() => setCollectOpen(false), []);

  const startCollect = () => {
    setBasketOpen(false);
    setCollectOpen(true);
  };

  const filterButtons: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];

  return (
    <ShopContext.Provider value={ctx}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div className="min-w-0">
          <h2 className="sr-only">Demo catalogue</h2>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Search the demo catalogue
              </label>
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fruit, veg, juices…"
                autoComplete="off"
                enterKeyHint="search"
                className="h-13 w-full rounded-full border-2 border-ink/15 bg-paper pr-4 pl-12 text-base placeholder:text-ink-soft/70 focus:border-crate focus:outline-none focus-visible:outline-3 focus-visible:outline-citrus"
              />
            </div>
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {filterButtons.map((b) => {
                const active = filter === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(b.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors ${
                      active ? "bg-crate text-cream" : "bg-paper text-ink hover:bg-cream-deep"
                    }`}
                  >
                    {b.label} <span className={active ? "text-cream/70" : "text-ink-soft"}>{counts[b.id] ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold text-ink-soft" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
            {filter !== "all" ? ` in ${categories.find((c) => c.id === filter)?.name}` : ""}
            {query.trim() ? ` matching “${query.trim()}”` : ""}
          </p>

          {results.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius-tile)] border-2 border-dashed border-crate/25 bg-paper p-8 text-center">
              <p className="sign text-3xl text-crate">Nothing matches that search</p>
              <p className="mt-2 text-ink-soft">Try a different word, or show every category.</p>
              <button
                type="button"
                className="btn btn-primary mt-5"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} qty={basket.lines[p.id] ?? 0} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside id="basket" aria-labelledby="sidebar-basket-heading" className="hidden lg:block">
          <div className="sticky top-28 rounded-[var(--radius-tile)] bg-paper p-6 shadow-[0_1px_0_rgb(14_59_42/0.08)]">
            <BasketContents basket={basket} idPrefix="sidebar-basket" onStartCollect={startCollect} />
          </div>
        </aside>
      </div>

      {/* Small screens: floating basket button above the directions bar */}
      <div className="fixed inset-x-0 bottom-[5.25rem] z-30 flex justify-center px-4 lg:hidden">
        <button
          type="button"
          className="btn btn-citrus shadow-lg"
          onClick={() => setBasketOpen(true)}
          aria-haspopup="dialog"
        >
          <Icon name="basket" />
          View demo basket{itemCount > 0 ? ` (${itemCount})` : ""}
        </button>
      </div>

      <Dialog open={basketOpen} onClose={closeBasket} title="Demo basket" variant="sheet" labelId="basket-dialog-title">
        <div className="px-5 py-5 sm:px-6">
          <BasketContents basket={basket} headingLevel="h3" idPrefix="sheet-basket" onStartCollect={startCollect} />
        </div>
      </Dialog>

      <Dialog
        open={Boolean(product)}
        onClose={closeProduct}
        title={product?.name ?? "Product"}
        labelId="product-dialog-title"
      >
        {product && <ProductDetails product={product} qty={basket.lines[product.id] ?? 0} />}
      </Dialog>

      <Dialog open={collectOpen} onClose={closeCollect} title="Click & collect preview" labelId="collect-dialog-title">
        {collectOpen && <CollectPreview lines={basket.lines} onDone={closeCollect} />}
      </Dialog>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </ShopContext.Provider>
  );
}
