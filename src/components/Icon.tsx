import type { SVGProps } from "react";

const paths = {
  pin: (
    <>
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  basket: (
    <>
      <path d="M3 9h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 9Z" />
      <path d="m8 9 3-5M16 9l-3-5M9 13v3M15 13v3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  external: <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.5" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />,
  directions: (
    <>
      <path d="M12 2.8 21.2 12 12 21.2 2.8 12 12 2.8Z" />
      <path d="M9 14v-2.5a1.5 1.5 0 0 1 1.5-1.5H15M13 8l2 2-2 2" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  car: (
    <>
      <path d="M5 16V12l2-5h10l2 5v4M5 16h14M5 16v2M19 16v2" />
      <circle cx="8" cy="13.5" r=".6" fill="currentColor" />
      <circle cx="16" cy="13.5" r=".6" fill="currentColor" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.25em"
      height="1.25em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
