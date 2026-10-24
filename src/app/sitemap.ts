import type { MetadataRoute } from "next";
import { navItems, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navItems.map((item) => ({
    url: `${siteUrl}${item.href === "/" ? "" : item.href}`,
    changeFrequency: item.href === "/specials" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/shop" ? 0.4 : 0.7,
  }));
}
