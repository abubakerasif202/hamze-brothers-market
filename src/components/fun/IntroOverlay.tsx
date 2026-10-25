"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { Banana, Orange, Strawberry, Watermelon } from "./Fruit";

export const INTRO_SEEN_KEY = "hb-intro-seen";
/** Matches the CSS timeline in globals.css (.intro). */
const INTRO_MS = 3600;

/**
 * First-visit-per-session opening scene. The animation is pure CSS and fades
 * itself out, so a JS failure can never leave a blank screen. An inline script
 * in <head> sets data-intro="skip" before paint for returning and
 * reduced-motion visitors.
 */
export function IntroOverlay() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // data-intro="skip" already hides the overlay via CSS; nothing to animate.
    if (document.documentElement.dataset.intro === "skip") return;
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* storage blocked: intro may replay, harmless */
    }
    const timer = window.setTimeout(() => setGone(true), INTRO_MS + 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGone(true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="intro" role="region" aria-label="Welcome animation">
      <div className="intro-leaves" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <svg key={i} viewBox="0 0 40 60" className="intro-leaf" style={{ ["--i" as string]: i }}>
            <path d="M20 2 C36 20 36 44 20 58 C4 44 4 20 20 2 Z" fill="#4caf50" stroke="#102f28" strokeWidth="2.5" />
            <path d="M20 8 V54" stroke="#102f28" strokeWidth="2" />
          </svg>
        ))}
      </div>
      <div className="intro-fruit intro-strawberry" aria-hidden="true">
        <Strawberry />
      </div>
      <div className="intro-fruit intro-orange" aria-hidden="true">
        <Orange />
      </div>
      <div className="intro-fruit intro-banana" aria-hidden="true">
        <Banana />
      </div>
      <div className="intro-fruit intro-melon" aria-hidden="true">
        <Watermelon />
      </div>
      <div className="intro-brand">
        <p className="intro-name">{business.name}</p>
        <p className="intro-headline" aria-label="Freshness has arrived!">
          {["FRESHNESS", "HAS", "ARRIVED!"].map((w, i) => (
            <span key={w} aria-hidden="true" style={{ ["--w" as string]: i }}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
      <button type="button" className="intro-skip" onClick={() => setGone(true)}>
        Skip intro
      </button>
    </div>
  );
}
