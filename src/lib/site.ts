/**
 * Site-wide configuration.
 *
 * LAUNCH SWITCH: the site is deliberately hidden from search engines until the
 * business approves a public launch. To go live, set the environment variable
 *   NEXT_PUBLIC_SITE_INDEXABLE=true
 * (and NEXT_PUBLIC_SITE_URL to the final domain) in Vercel, then redeploy.
 * This flips the robots meta tag, robots.txt and the X-Robots-Tag header.
 */

export const siteIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/our-market", label: "Our Market" },
  { href: "/produce", label: "Produce" },
  { href: "/specials", label: "Specials" },
  { href: "/visit", label: "Visit" },
  { href: "/shop", label: "Shop Preview" },
] as const;
