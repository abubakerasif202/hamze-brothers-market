"use client";

import Image from "next/image";
import { useState } from "react";
import { images, type ImageKey } from "@/content/images";

interface PhotoProps {
  image: ImageKey | null;
  /** Text shown on the fallback tile when no photo exists or it fails to load. */
  fallbackLabel: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  altOverride?: string;
}

/**
 * Fills its (positioned) parent. If the photo is missing or fails to load, a
 * branded typographic tile takes its place instead of a broken image icon.
 */
export function Photo({
  image,
  fallbackLabel,
  sizes,
  className = "",
  imgClassName = "",
  preload,
  altOverride,
}: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const meta = image ? images[image] : null;

  if (!meta || failed) {
    return (
      <div
        className={`absolute inset-0 grid place-items-center bg-cream-deep bg-[radial-gradient(circle_at_30%_25%,#f39a1e33,transparent_55%),radial-gradient(circle_at_75%_80%,#4f9a2533,transparent_50%)] p-4 text-center ${className}`}
        role="img"
        aria-label={fallbackLabel}
      >
        <span className="sign text-3xl text-crate/80">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={meta.src}
      alt={altOverride ?? meta.alt}
      fill
      sizes={sizes}
      preload={preload}
      onError={() => setFailed(true)}
      className={`object-cover ${imgClassName} ${className}`}
    />
  );
}
