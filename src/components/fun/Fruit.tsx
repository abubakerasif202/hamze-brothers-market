"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Original SVG fruit characters. Pupils follow the cursor through the
 * --look-x / --look-y CSS variables set by FunProvider (fine pointers only).
 */

type FaceMood = "happy" | "surprised" | "wink";

function Face({ x, y, mood = "happy", scale = 1 }: { x: number; y: number; mood?: FaceMood; scale?: number }) {
  const surprised = mood === "surprised";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[-13, 13].map((dx, i) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          {mood === "wink" && i === 1 ? (
            <path d="M-6 0 Q0 -5 6 0" stroke="#182f29" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <>
              <ellipse rx={surprised ? 9 : 8} ry={surprised ? 11 : 10} fill="#fff" />
              <circle className="fruit-pupil" r={surprised ? 3 : 4.5} cx="0" cy="1" fill="#182f29" />
            </>
          )}
        </g>
      ))}
      {surprised ? (
        <ellipse cx="0" cy="22" rx="7" ry="9" fill="#7a1f2b" />
      ) : (
        <path d="M-11 15 Q0 29 11 15 Z" fill="#7a1f2b" stroke="#182f29" strokeWidth="2" strokeLinejoin="round" />
      )}
      <circle cx="-24" cy="16" r="5" fill="#ff7a8a" opacity=".55" />
      <circle cx="24" cy="16" r="5" fill="#ff7a8a" opacity=".55" />
    </g>
  );
}

export function Banana({ className = "" }: { className?: string }) {
  const [clicks, setClicks] = useState(0);
  const dancing = clicks > 0 && clicks % 5 === 0;
  return (
    <button
      type="button"
      className={`fruit-char fruit-banana ${dancing ? "is-dancing" : ""} ${className}`}
      onClick={() => setClicks((c) => c + 1)}
      aria-label="Mr Banana. Tap him five times to make him dance."
    >
      <svg viewBox="0 0 160 200" aria-hidden="true" focusable="false">
        <g className="fruit-body">
          <path
            d="M96 12 C118 12 132 40 128 84 C124 140 90 186 36 186 C20 186 14 170 28 164 C62 150 80 118 80 84 C80 56 76 34 84 18 Q88 12 96 12 Z"
            fill="#ffd23f"
            stroke="#182f29"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M96 12 L100 0" stroke="#5b3a1e" strokeWidth="9" strokeLinecap="round" />
          <path
            d="M110 40 C116 80 100 130 56 168"
            stroke="#f2b705"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity=".7"
          />
          <Face x={104} y={78} mood={dancing ? "wink" : "happy"} scale={0.9} />
        </g>
        <g className="fruit-arm" style={{ transformOrigin: "128px 96px" }}>
          <path d="M126 100 Q150 90 150 62" stroke="#182f29" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="58" r="8" fill="#ffd23f" stroke="#182f29" strokeWidth="3.5" />
        </g>
      </svg>
    </button>
  );
}

export function Strawberry({ className = "" }: { className?: string }) {
  return (
    <span className={`fruit-char fruit-strawberry ${className}`} role="img" aria-label="Captain Strawberry">
      <svg viewBox="0 0 160 190" aria-hidden="true" focusable="false">
        <g className="fruit-body">
          <path
            d="M80 40 C128 34 150 62 140 100 C130 144 100 178 80 182 C60 178 30 144 20 100 C10 62 32 34 80 40 Z"
            fill="#e63956"
            stroke="#182f29"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {[
            [50, 70],
            [110, 66],
            [34, 104],
            [126, 104],
            [58, 140],
            [102, 140],
            [80, 160],
          ].map(([cx, cy]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="3" ry="4.5" fill="#ffe08a" />
          ))}
          <path
            d="M80 42 L58 20 L74 28 L80 8 L88 28 L104 18 Z"
            fill="#4caf50"
            stroke="#182f29"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <Face x={80} y={92} mood="happy" />
          <path d="M44 38 Q80 -4 116 38 Z" fill="#173f35" stroke="#182f29" strokeWidth="3" strokeLinejoin="round" />
          <rect x="42" y="34" width="76" height="9" rx="4" fill="#e7a34a" stroke="#182f29" strokeWidth="2.5" />
        </g>
      </svg>
    </span>
  );
}

export function Orange({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <span className={`fruit-char fruit-orange ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" focusable="false" style={flip ? { transform: "scaleX(-1)" } : undefined}>
        <g className="fruit-body">
          <circle cx="60" cy="64" r="48" fill="#ff8a1f" stroke="#182f29" strokeWidth="4" />
          <path d="M60 18 C56 8 66 4 72 10 C68 14 64 16 60 18Z" fill="#4caf50" stroke="#182f29" strokeWidth="3" />
          <ellipse cx="38" cy="44" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 38 44)" />
          <Face x={60} y={64} mood="happy" scale={0.8} />
        </g>
      </svg>
    </span>
  );
}

export function Watermelon({ className = "" }: { className?: string }) {
  const [surprised, setSurprised] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <button
      type="button"
      className={`fruit-char fruit-watermelon ${surprised ? "is-surprised" : ""} ${className}`}
      aria-label="Happy Watermelon. Tap for a surprise."
      onClick={() => {
        setSurprised(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setSurprised(false), 2000);
      }}
    >
      {surprised && (
        <span className="melon-speech" role="status">
          Looking fresh today!
        </span>
      )}
      <svg viewBox="0 0 200 130" aria-hidden="true" focusable="false">
        <g className="fruit-body">
          <path
            d="M10 30 H190 C190 90 150 124 100 124 C50 124 10 90 10 30 Z"
            fill="#2e7d32"
            stroke="#182f29"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M22 30 H178 C178 82 144 112 100 112 C56 112 22 82 22 30 Z" fill="#ff4f6d" />
          <path d="M16 30 H184" stroke="#bfe3a0" strokeWidth="6" />
          {[
            [60, 50],
            [140, 50],
            [80, 76],
            [120, 76],
          ].map(([cx, cy]) => (
            <ellipse
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx="3.5"
              ry="6"
              fill="#182f29"
              transform={`rotate(20 ${cx} ${cy})`}
            />
          ))}
          <Face x={100} y={62} mood={surprised ? "surprised" : "happy"} scale={0.85} />
        </g>
      </svg>
    </button>
  );
}

/** A tiny mascot peeking over a section divider. */
export function PeekingFruit({ kind = "strawberry" }: { kind?: "strawberry" | "orange" }) {
  return (
    <div className="peek" aria-hidden="true">
      {kind === "strawberry" ? <Strawberry /> : <Orange />}
    </div>
  );
}

/** Two oranges racing across the section now and then. */
export function OrangeBros() {
  return (
    <div className="race-lane" aria-hidden="true">
      <div className="race-runner race-a">
        <Orange />
      </div>
      <div className="race-runner race-b">
        <Orange flip />
      </div>
    </div>
  );
}
