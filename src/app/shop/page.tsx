import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ShopPreview } from "@/components/shop/ShopPreview";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Online Shopping Preview",
  description:
    "A demonstration of how online shopping and click-and-collect could work at Hamze Brothers Fruit Market. Preview only: ordering is not available yet.",
  path: "/shop",
});

const steps = [
  { title: "Browse and fill a basket", body: "Search the sample catalogue or filter by aisle." },
  { title: "Pick a collection window", body: "Choose a time based on the shop's opening hours." },
  { title: "Review the preview", body: "See how a collection summary could look. Nothing is sent." },
];

export default function ShopPage() {
  return (
    <>
      <section className="on-crate bg-crate text-cream" aria-labelledby="shop-heading">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 md:pt-14 md:pb-16 lg:px-8">
          <p className="ticket bg-citrus text-base text-ink">Preview only. Ordering isn&apos;t available yet.</p>
          <h1 id="shop-heading" className="sign rise mt-5 text-[clamp(3rem,10vw,7rem)]">
            Online shopping preview
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream/85">
            A working demonstration of how click-and-collect could look at {business.shortName}. You can try every step,
            but no order is placed, no payment is taken and no personal details are asked for. Products and prices are
            samples, marked &ldquo;demo price&rdquo;.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-crate-soft/80 p-4">
                <p className="sign text-4xl text-citrus">{i + 1}</p>
                <p className="mt-1 font-semibold text-cream">{s.title}</p>
                <p className="mt-1 text-sm text-cream/90">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-cream/90">
            Want to shop today?{" "}
            <a
              href={business.links.googleDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1 font-semibold text-cream"
            >
              <Icon name="directions" /> Get directions to the market
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>{" "}
            or read about{" "}
            <Link href="/produce" className="link font-semibold text-cream">
              what&apos;s usually in store
            </Link>
            .
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-busy="true">
            <div className="h-13 animate-pulse rounded-full bg-cream-deep" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-[var(--radius-tile)] bg-cream-deep" />
              ))}
            </div>
          </div>
        }
      >
        <ShopPreview />
      </Suspense>
    </>
  );
}
