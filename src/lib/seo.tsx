import type { Metadata } from "next";
import { business, fullAddress } from "@/content/business";
import { siteIndexable, siteUrl } from "./site";

export const defaultDescription =
  "Hamze Brothers Fruit Market at Guildford Plaza, 282 Guildford Rd, Guildford NSW. Fresh fruit, vegetables, juices pressed in store and pantry staples. Open 7 days, 8am to 9:30pm.";

export const robots: Metadata["robots"] = siteIndexable
  ? { index: true, follow: true }
  : { index: false, follow: false, googleBot: { index: false, follow: false } };

/** Per-page metadata with canonical URL and social previews. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${business.name}` : `${business.name} | Fresh. Local. Family. | Guildford`;
  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: business.name,
      locale: "en_AU",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${business.name} logo beside a freshly cut blood orange`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

/** Structured data limited to facts the business has published. No ratings or offers. */
export function localBusinessJsonLd() {
  const h = business.hours.mon;
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": `${siteUrl}/#store`,
    name: business.name,
    alternateName: business.arabicName,
    slogan: business.tagline,
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    logo: `${siteUrl}/brand/hamze-brothers-badge-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.centre}, ${business.address.street}`,
      addressLocality: business.address.suburb,
      addressRegion: business.address.state,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    hasMap: business.links.googleMapsListing,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: h.open,
        closes: h.close,
      },
    ],
    sameAs: [business.links.instagram],
    description: `Family fruit market at ${fullAddress}.`,
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
