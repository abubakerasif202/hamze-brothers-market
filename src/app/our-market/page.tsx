import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageIntro } from "@/components/PageIntro";
import { Photo } from "@/components/Photo";
import { business } from "@/content/business";
import { images } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Market",
  description:
    "Hamze Brothers is a family-owned fruit market at Guildford Plaza, Guildford NSW. Hand-selected produce, juice pressed in store and authentic favourites. Fresh. Local. Family.",
  path: "/our-market",
});

const values = [
  {
    word: "Fresh.",
    colour: "text-pomegranate",
    body: "The family hand-selects everything that goes on the floor, and the shelves are kept packed with fresh restocks. Juice is pressed in store from whole fruit, with nothing added.",
  },
  {
    word: "Local.",
    colour: "text-leaf",
    body: "Hamze Brothers opened its doors at Guildford Plaza on 15 May 2026 and was built for the Guildford community. Seasonal favourites like Janerik come in from Young, NSW.",
  },
  {
    word: "Family.",
    colour: "text-fig",
    body: "A family-owned market with family-friendly prices, where the aim is simple: quality, wholesome food that stays affordable for the families who shop here.",
  },
];

export default function OurMarketPage() {
  return (
    <>
      <PageIntro title="Our market">
        <p>
          A family-owned fruit market at Guildford Plaza, built around three words on the sign:{" "}
          <span className="font-semibold text-cream">{business.tagline}</span>
        </p>
      </PageIntro>

      <section aria-labelledby="values-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h2 id="values-heading" className="sr-only">
            What Fresh. Local. Family. means here
          </h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {values.map((v) => (
              <article key={v.word} className="border-t-4 border-current pt-6">
                <h3 className={`sign text-[clamp(3.25rem,8vw,5rem)] ${v.colour}`}>{v.word}</h3>
                <p className="mt-4 text-lg text-ink-soft">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-deep" aria-labelledby="inside-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[var(--radius-tile)]">
              <Photo image="inStoreDisplay" fallbackLabel="Inside the market" sizes="(min-width: 768px) 45vw, 92vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-tile)]">
              <Photo image="bloodOrange" fallbackLabel="Blood oranges" sizes="(min-width: 768px) 22vw, 45vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-tile)]">
              <Photo image="spices" fallbackLabel="Spices" sizes="(min-width: 768px) 22vw, 45vw" />
            </div>
          </div>
          <div>
            <h2 id="inside-heading" className="sign text-[clamp(2.75rem,6vw,4.75rem)] text-crate">
              More inside than you&apos;d expect
            </h2>
            <div className="prose-market mt-6 max-w-xl text-lg text-ink-soft">
              <p>
                Beyond the fruit and veg you&apos;ll find fully stocked spice and snack aisles, cold drink fridges,
                eggs, pantry staples and household essentials, so one stop can cover the week&apos;s shop.
              </p>
              <p>
                There are authentic goodies you won&apos;t find everywhere too, like the shop&apos;s own homemade
                shanklish, classic herb or with a chilli kick, and fresh ginger shots with ginger, turmeric, lime and
                orange.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produce" className="btn btn-primary">
                Browse the produce guide
              </Link>
              <a
                href={business.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-crate"
              >
                <Icon name="instagram" />
                Follow on Instagram
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="visit-cta">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
          <Image
            src={images.logoFull.src}
            alt={images.logoFull.alt}
            width={images.logoFull.width}
            height={images.logoFull.height}
            sizes="240px"
            className="h-auto w-[180px] md:w-[240px]"
          />
          <h2 id="visit-cta" className="sign text-[clamp(2.5rem,6vw,4.5rem)] text-crate">
            Come and say hello
          </h2>
          <p className="max-w-lg text-lg text-ink-soft">
            {business.address.centre}, {business.address.street}, {business.address.suburb}. Open 7 days.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={business.links.googleDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <Icon name="directions" />
              Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
            <Link href="/visit" className="btn btn-outline text-crate">
              Hours and parking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
