export const ADD_EVENT = "hb:add";

export interface AddDetail {
  x: number;
  y: number;
}

/** Call from an add-to-basket click; FunProvider turns it into a flying fruit and confetti. */
export function celebrateAdd(source: HTMLElement) {
  const r = source.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent<AddDetail>(ADD_EVENT, { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }),
  );
}
