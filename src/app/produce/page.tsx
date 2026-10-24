import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageIntro } from "@/components/PageIntro";
import { Photo } from "@/components/Photo";
import { business } from "@/content/business";
import { categories } from "@/content/categories";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Produce",
  description:
    "Fruit, vegetables, herbs and greens, fresh juices pressed in store, and pantry and deli favourites at Hamze Brothers Fruit Market, Guildford.",
  path: "/produce",
});

const accentText = {
  red: "text-pomegranate",
  green: "text-leaf",
  leaf: "text-leaf",
  orange: "text-citrus",
  purple: "text-fig",
} as const;

export default function ProducePage() {
  return (
    <>
      <PageIntro
        title="Produce"
        aside={
          <nav aria-label="Produce categories">
            <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="ticket bg-cream text-base text-crate hover:bg-citrus">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <p>
          What you&apos;ll usually find on the floor. The market buys with the seasons, so the examples below are a
          guide, not a stock list. For what&apos;s in today, ask the team or check Instagram.
        </p>
      </PageIntro>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categories.map((cat, i) => (
          <section
            key={cat.id}
            id={cat.id}
            aria-labelledby={`${cat.id}-heading`}
            className="grid scroll-mt-24 gap-8 border-b border-ink/10 py-14 last:border-b-0 md:grid-cols-2 md:items-center md:gap-14 md:py-20"
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-tile)] ${i % 2 ? "md:order-last" : ""}`}
            >
              <Photo image={cat.image} fallbackLabel={cat.name} sizes="(min-width: 768px) 45vw, 92vw" />
            </div>
            <div>
              <h2 id={`${cat.id}-heading`} className={`sign text-[clamp(3rem,7vw,5.25rem)] ${accentText[cat.accent]}`}>
                {cat.name}
              </h2>
              <p className="mt-3 text-xl font-semibold text-crate">{cat.strapline}</p>
              <p className="mt-4 max-w-xl text-lg text-ink-soft">{cat.description}</p>
              <h3 className="mt-7 font-semibold text-ink">Examples you might find</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cat.examples.map((ex) => (
                  <li key={ex} className="ticket bg-paper text-[0.95rem] text-crate">
                    {ex}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-soft">Seasonal availability varies.</p>
              <Link href={`/shop?category=${cat.id}`} className="link mt-6 inline-block font-semibold text-crate">
                See {cat.name.toLowerCase()} in the shopping preview
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="on-crate bg-crate text-cream" aria-labelledby="fresh-today">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 id="fresh-today" className="sign text-[clamp(2.5rem,6vw,4rem)]">
              Want to know what came in today?
            </h2>
            <p className="mt-3 max-w-xl text-cream/85">
              Restocks, seasonal arrivals and weekend deals are posted on Instagram.
            </p>
          </div>
          <a
            href={business.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-citrus shrink-0"
          >
            <Icon name="instagram" />
            {business.links.instagramHandle}
            <span className="sr-only">(opens Instagram in a new tab)</span>
          </a>
        </div>
      </section>
    </>
  );
}
