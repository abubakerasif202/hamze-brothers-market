import type { MetadataRoute } from "next";
import { siteIndexable, siteUrl } from "@/lib/site";

/** Blocks all crawling until NEXT_PUBLIC_SITE_INDEXABLE=true (see README "Launch switch"). */
export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
