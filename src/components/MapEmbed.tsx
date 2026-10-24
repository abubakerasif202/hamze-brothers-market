"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { images } from "@/content/images";
import { business } from "@/content/business";
import { Icon } from "./Icon";

/**
 * Click-to-load Google map. Nothing from Google loads until the visitor asks,
 * which keeps the page fast and avoids third-party requests by default.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The button disappears once clicked; hand keyboard focus to the map itself.
  useEffect(() => {
    if (loaded) frameRef.current?.focus();
  }, [loaded]);
  // Search by name + address so the embed shows the business's own listing card, not a bare pin.
  const query = encodeURIComponent(
    `${business.name}, ${business.address.streetShort}, ${business.address.suburb} ${business.address.state} ${business.address.postcode}`,
  );
  const src = `https://www.google.com/maps?q=${query}&z=17&output=embed`;

  return (
    <div className="relative aspect-square overflow-hidden rounded-[var(--radius-tile)] bg-crate-soft sm:aspect-[16/10]">
      {loaded ? (
        <iframe
          ref={frameRef}
          title={`Map showing ${business.name} at ${business.address.centre}`}
          src={src}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,#164d37,#0a2c1f)] p-6 text-center text-cream">
          <Image
            src={images.logoBadge.src}
            alt=""
            width={96}
            height={96}
            sizes="96px"
            className="size-20 rounded-full sm:size-24"
          />
          <div>
            <p className="sign text-3xl">{business.address.centre}</p>
            <p className="mt-1 text-cream/80">
              {business.address.streetShort}, {business.address.suburb}
            </p>
          </div>
          <button type="button" className="btn btn-citrus" onClick={() => setLoaded(true)}>
            <Icon name="pin" />
            Show the map
          </button>
          <p className="max-w-xs text-sm text-cream/70">Loads Google Maps on this page.</p>
        </div>
      )}
    </div>
  );
}
