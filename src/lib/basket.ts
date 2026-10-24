import type { DemoProduct } from "@/content/demo/products";

/** Demo basket: product id -> quantity (in the product's unit). */
export type BasketLines = Readonly<Record<string, number>>;

export interface BasketState {
  lines: BasketLines;
  /** True when stored data was unreadable or partly invalid and has been cleaned. */
  recovered: boolean;
}

export const BASKET_STORAGE_KEY = "hamze-demo-basket:v1";
export const EMPTY_BASKET: BasketState = Object.freeze({ lines: Object.freeze({}), recovered: false });

type Catalogue = ReadonlyMap<string, Pick<DemoProduct, "step" | "maxQty">>;

/** Round to the product's step and clamp to its limits. Returns 0 to mean "remove". */
export function normaliseQty(qty: number, product: Pick<DemoProduct, "step" | "maxQty">): number {
  if (!Number.isFinite(qty) || qty <= 0) return 0;
  const stepped = Math.round(qty / product.step) * product.step;
  const clamped = Math.min(stepped, product.maxQty);
  return Math.round(clamped * 100) / 100;
}

/**
 * Validate data read from localStorage. Anything malformed, unknown products,
 * or out-of-range quantities are dropped rather than crashing the page.
 */
export function parseStoredBasket(raw: string | null, catalogue: Catalogue): BasketState {
  if (raw === null || raw === "") return EMPTY_BASKET;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { lines: {}, recovered: true };
  }
  const linesSource =
    data && typeof data === "object" && "lines" in data ? (data as { lines: unknown }).lines : undefined;
  if (!linesSource || typeof linesSource !== "object" || Array.isArray(linesSource)) {
    return { lines: {}, recovered: true };
  }
  const lines: Record<string, number> = {};
  let recovered = false;
  for (const [id, value] of Object.entries(linesSource as Record<string, unknown>)) {
    const product = catalogue.get(id);
    if (!product || typeof value !== "number") {
      recovered = true;
      continue;
    }
    const qty = normaliseQty(value, product);
    if (qty !== value) recovered = true;
    if (qty > 0) lines[id] = qty;
  }
  return { lines, recovered };
}

export function serialiseBasket(state: BasketState): string {
  return JSON.stringify({ version: 1, lines: state.lines });
}

export function setLine(state: BasketState, id: string, qty: number, catalogue: Catalogue): BasketState {
  const product = catalogue.get(id);
  if (!product) return state;
  const next = normaliseQty(qty, product);
  const lines = { ...state.lines };
  if (next === 0) delete lines[id];
  else lines[id] = next;
  return { lines, recovered: false };
}

export function addToBasket(state: BasketState, id: string, catalogue: Catalogue): BasketState {
  const product = catalogue.get(id);
  if (!product) return state;
  return setLine(state, id, (state.lines[id] ?? 0) + product.step, catalogue);
}

export function stepLine(state: BasketState, id: string, direction: 1 | -1, catalogue: Catalogue): BasketState {
  const product = catalogue.get(id);
  if (!product) return state;
  return setLine(state, id, (state.lines[id] ?? 0) + direction * product.step, catalogue);
}

export interface BasketSummary {
  itemCount: number;
  demoSubtotalCents: number;
}

export function summarise(
  lines: BasketLines,
  catalogue: ReadonlyMap<string, Pick<DemoProduct, "demoPriceCents" | "unit">>,
): BasketSummary {
  let itemCount = 0;
  let demoSubtotalCents = 0;
  for (const [id, qty] of Object.entries(lines)) {
    const product = catalogue.get(id);
    if (!product) continue;
    itemCount += product.unit === "kg" ? 1 : qty;
    demoSubtotalCents += Math.round(product.demoPriceCents * qty);
  }
  return { itemCount, demoSubtotalCents };
}

export function formatQty(qty: number, product: Pick<DemoProduct, "unit" | "unitLabel">): string {
  if (product.unit === "kg") return `${qty % 1 === 0 ? qty : qty.toFixed(1)} kg`;
  return `${qty} × ${product.unitLabel}`;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}
