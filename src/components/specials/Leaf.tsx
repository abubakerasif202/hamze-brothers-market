import type { CSSProperties } from "react";

/** Decorative leaf. Purely visual, so it is hidden from assistive tech. */
export function Leaf({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 160"
      className={`specials-leaf pointer-events-none absolute ${className}`}
      style={style}
    >
      <path d="M60 154C14 120 10 52 60 6c50 46 46 114 0 148Z" fill="#2f7a3f" />
      <path d="M60 154C34 112 36 56 60 6c-8 52-4 100 0 148Z" fill="#3f9a4f" opacity=".55" />
      <path d="M60 150V24" stroke="#1b4f2a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
