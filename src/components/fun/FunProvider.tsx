"use client";

import { useEffect } from "react";
import { ADD_EVENT, type AddDetail } from "./celebrate";

const CONFETTI = ["#e63956", "#ffd23f", "#ff8a1f", "#7ed957", "#6b3fa0", "#ff4f6d"];
const FLYER_COLOURS = ["#e63956", "#ff8a1f", "#ffd23f", "#ff4f6d", "#6b3fa0"];

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function visibleCart(): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>("[data-cart-icon]");
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

function burst(x: number, y: number) {
  for (let i = 0; i < 14; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    bit.style.cssText = `left:${x}px;top:${y}px;background:${CONFETTI[i % CONFETTI.length]};--dx:${(Math.cos(angle) * dist).toFixed(1)}px;--dy:${(Math.sin(angle) * dist - 20).toFixed(1)}px;--rot:${Math.round(Math.random() * 540)}deg`;
    document.body.appendChild(bit);
    window.setTimeout(() => bit.remove(), 900);
  }
}

function fly(from: AddDetail) {
  const cart = visibleCart();
  if (!cart) return;
  const r = cart.getBoundingClientRect();
  const dx = r.left + r.width / 2 - from.x;
  const dy = r.top + r.height / 2 - from.y;
  const el = document.createElement("span");
  el.className = "fly-fruit";
  el.setAttribute("aria-hidden", "true");
  el.style.left = `${from.x}px`;
  el.style.top = `${from.y}px`;
  el.style.background = FLYER_COLOURS[Math.floor(Math.random() * FLYER_COLOURS.length)];
  document.body.appendChild(el);
  const anim = el.animate(
    [
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
      {
        transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 90}px)) scale(1.4)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.35)`, opacity: 0.9 },
    ],
    { duration: 750, easing: "cubic-bezier(.3,.1,.3,1)" },
  );
  anim.onfinish = () => {
    el.remove();
    cart.animate([{ transform: "scale(1)" }, { transform: "scale(1.35) rotate(-8deg)" }, { transform: "scale(1)" }], {
      duration: 380,
      easing: "ease-out",
    });
  };
}

/** Global behaviours: cursor tracking for fruit eyes/parallax, add-to-basket celebration. */
export function FunProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame || reducedMotion()) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        root.style.setProperty("--px", nx.toFixed(3));
        root.style.setProperty("--py", ny.toFixed(3));
        root.style.setProperty("--look-x", `${(nx * 2.5).toFixed(2)}px`);
        root.style.setProperty("--look-y", `${(ny * 2.5).toFixed(2)}px`);
      });
    };
    if (fine.matches) window.addEventListener("pointermove", onMove, { passive: true });

    const onAdd = (e: Event) => {
      if (reducedMotion()) return;
      const detail = (e as CustomEvent<AddDetail>).detail;
      burst(detail.x, detail.y);
      fly(detail);
      document.querySelectorAll<HTMLElement>(".fruit-strawberry").forEach((el) => {
        el.classList.remove("is-celebrating");
        void el.offsetWidth;
        el.classList.add("is-celebrating");
      });
    };
    window.addEventListener(ADD_EVENT, onAdd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(ADD_EVENT, onAdd);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
