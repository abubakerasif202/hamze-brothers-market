import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SpecialsShowcase } from "@/components/specials/SpecialsShowcase";
import { SAMPLE_START, sampleExpired, sampleSpecials } from "@/content/specials-sample";

/**
 * Development-only preview of the weekly specials design with SAMPLE content.
 * Production builds return 404 before anything is rendered, and the page is
 * never linked, listed in the sitemap or indexable.
 *
 *   /dev/specials-preview                     active sample specials
 *   /dev/specials-preview?state=mixed         active + one expired offer (expired must not show)
 *   /dev/specials-preview?today=2026-11-10    every sample offer has ended -> empty state
 *   /dev/specials-preview?state=empty         no offers at all -> empty state
 */
export const metadata: Metadata = {
  title: "Specials preview (development only)",
  robots: { index: false, follow: false },
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type PreviewParams = Promise<{ state?: string; today?: string }>;

async function Preview({ searchParams }: { searchParams: PreviewParams }) {
  const { state, today } = await searchParams;
  const date = today && DATE_PATTERN.test(today) ? today : SAMPLE_START;
  const source = state === "empty" ? [] : state === "mixed" ? [sampleExpired, ...sampleSpecials] : sampleSpecials;

  return (
    <>
      <div role="note" className="bg-pomegranate px-4 py-3 text-center text-sm font-semibold text-white">
        Development preview. Sample content only: these are not real offers or Hamze Brothers prices. Shown as if today
        is {date} (Sydney).
      </div>
      <SpecialsShowcase source={source} todayOverride={date} headingId="preview-specials-heading" />
    </>
  );
}

export default function SpecialsPreviewPage({ searchParams }: { searchParams: PreviewParams }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense fallback={null}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
