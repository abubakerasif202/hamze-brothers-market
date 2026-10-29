"use client";
import { useEffect, useRef, useState } from "react";
export function FruitSurprise() {
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="market-surprise">
      <button
        className="btn btn-primary"
        type="button"
        disabled={show}
        onClick={() => {
          setVariant(Math.floor(Math.random() * 3));
          setShow(true);
          timer.current = setTimeout(() => setShow(false), 4200);
        }}
      >
        Surprise Me ✦
      </button>
      <span className="sr-only" role="status">
        {show ? "A little fruit parade, just for you!" : ""}
      </span>
      {show && (
        <div className={`fruit-parade fruit-parade-${variant}`} aria-hidden="true">
          {["🍎", "🍊", "🍓", "🍌", "🍉"].map((fruit, i) => (
            <span key={fruit} style={{ animationDelay: `${i * 120}ms` }}>
              {fruit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
