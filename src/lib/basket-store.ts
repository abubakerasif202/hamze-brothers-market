"use client";

import { useSyncExternalStore } from "react";
import { demoProductById } from "@/content/demo/products";
import { BASKET_STORAGE_KEY, EMPTY_BASKET, type BasketState, parseStoredBasket, serialiseBasket } from "./basket";

/**
 * Tiny external store for the demo basket, persisted to localStorage.
 * useSyncExternalStore keeps server render (empty basket) and client
 * hydration consistent, and the storage event keeps tabs in sync.
 */

let state: BasketState = EMPTY_BASKET;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): BasketState {
  try {
    return parseStoredBasket(window.localStorage.getItem(BASKET_STORAGE_KEY), demoProductById);
  } catch {
    // Storage blocked (private mode, disabled cookies): basket works in memory only.
    return EMPTY_BASKET;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readStorage();
  if (state.recovered) writeStorage(state);
}

function writeStorage(next: BasketState) {
  try {
    window.localStorage.setItem(BASKET_STORAGE_KEY, serialiseBasket(next));
  } catch {
    /* ignore quota / privacy-mode errors; in-memory state still works */
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== BASKET_STORAGE_KEY) return;
    state = readStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return EMPTY_BASKET;
}

export function updateBasket(updater: (current: BasketState) => BasketState) {
  ensureLoaded();
  const next = updater(state);
  if (next === state) return;
  state = next;
  writeStorage(state);
  emit();
}

export function dismissRecoveredNotice() {
  updateBasket((s) => (s.recovered ? { ...s, recovered: false } : s));
}

export function useBasket(): BasketState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
