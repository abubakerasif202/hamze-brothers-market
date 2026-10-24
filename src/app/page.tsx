import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenStatus } from "@/components/OpenStatus";
import { Photo } from "@/components/Photo";
import { GoogleReviewsSection } from "@/components/GoogleReviews";
import { SpecialsBoard } from "@/components/SpecialsBoard";
import { business } from "@/content/business";
import { categories } from "@/content/categories";
import { images } from "@/content/images";
import { defaultDescription, pageMetadata } from "@/lib/seo";
import { formatTime } from "@/lib/time";

export const metadata = pageMetadata({ description: defaultDescription, path: "/" });

const tileLayout = [
  "sm:col-span-2 lg:col-span-4 lg:row-span-2 min-h-[20rem] lg:min-h-0",
  "lg:col-span-2 min-h-[16rem]",
  "lg:col-span-2 min-h-[16rem]",
  "lg:col-span-3 min-h-[16rem]",
  "sm:col-span-2 lg:col-span-3 min-h-[16rem]",
];

const accentBg = {
  red: "bg-pomegranate text-white",
  green: "bg-leaf text-white",
  leaf: "bg-leaf-bright text-ink",
  orange: "bg-citrus text-ink",
  purple: "bg-fig text-white",
} as const;

const juiceFlavours = categories.find((c) => c.id === "juices")?.examples ?? [];

export default function HomePage() {
  const hours = business.hours.mon;
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 md:pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-24">
          <div>
            <p className="flex items-center gap-2 font-semibold text-ink-soft">
              <Icon name="pin" className="text-pomegranate" />
              {business.address.centre}, {business.address.suburb}
            </p>
            <h1 className="sign mt-5 text-[clamp(4.25rem,15vw,9.5rem)]">
              <span className="sr-only">{business.name}: </span>
              <span className="rise block text-pomegranate">Fresh.</span>
              <span className="rise block text-leaf [animation-delay:120ms]">Local.</span>
              <span className="rise block text-fig [animation-delay:240ms]">Family.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Hamze Brothers is the family fruit market at Guildford Plaza. Fruit and veg hand-selected by the family,
              juice pressed in store and the pantry staples you came for. Open 7 days, {formatTime(hours.open)} to{" "}
              {formatTime(hours.close)}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={business.links.googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-lg"
              >
                <Icon name="directions" />
                Get directions
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
              <Link href="/shop" className="btn btn-outline text-lg text-crate">
                <Icon name="basket" />
                Explore the shopping preview
              </Link>
            </div>
            <p className="mt-6 text-[0.95rem] font-semibold text-ink-soft">
              <OpenStatus />
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-deep sm:aspect-[5/5] lg:aspect-[4/5]">
              <Photo
                image="bloodOrange"
                fallbackLabel="Fresh from the floor"
                sizes="(min-width: 1024px) 45vw, 92vw"
                preload
              />
            </div>
            <div className="absolute -bottom-6 -left-2 w-[46%] overflow-hidden rounded-[1.25rem] border-[6px] border-cream shadow-xl sm:-left-8">
              <div className="relative aspect-[4/3]">
                <Photo image="inStoreDisplay" fallbackLabel="In store" sizes="(min-width: 1024px) 22vw, 45vw" />
              </div>
            </div>
            <p className="ticket absolute top-4 right-4 bg-cream text-lg text-crate sm:text-xl">
              Straight from our floor
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="on-crate bg-crate text-cream" aria-labelledby="floor-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="floor-heading" className="sign text-[clamp(2.75rem,7vw,5.5rem)]">
              What&apos;s on the floor
            </h2>
            <p className="max-w-md text-cream/80">
              Five corners of the market, stocked fresh. Seasonal selection changes, so the examples here are a guide to
              what you&apos;ll usually find.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:auto-rows-[15rem] lg:grid-cols-6">
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                className={`group relative overflow-hidden rounded-[var(--radius-tile)] ${tileLayout[i]}`}
              >
                <Link href={`/produce#${cat.id}`} className="absolute inset-0 z-10 rounded-[var(--radius-tile)]">
                  <span className="sr-only">
                    {cat.name}: {cat.strapline}
                  </span>
                </Link>
                <Photo
                  image={cat.image}
                  fallbackLabel={cat.name}
                  sizes={
                    i === 0
                      ? "(min-width: 1024px) 60vw, 92vw"
                      : "(min-width: 1024px) 40vw, (min-width: 640px) 46vw, 92vw"
                  }
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-crate-deep/90 via-crate-deep/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6" aria-hidden="true">
                  <span className={`ticket text-xl sm:text-2xl ${accentBg[cat.accent]}`}>{cat.name}</span>
                  <p className="mt-3 max-w-sm text-[0.95rem] leading-snug text-cream/90">{cat.strapline}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Juices */}
      <section aria-labelledby="juice-heading" className="bg-cream-deep">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div className="relative order-last aspect-[4/5] overflow-hidden rounded-[2rem] md:order-first">
            <Photo image="orangeJuiceBottle" fallbackLabel="Fresh juice" sizes="(min-width: 768px) 45vw, 92vw" />
          </div>
          <div>
            <h2 id="juice-heading" className="sign text-[clamp(2.75rem,7vw,5.25rem)] text-crate">
              Juice, pressed in front of you
            </h2>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              The in-store juice machine takes whole fruit to bottle in seconds. 100% fruit, nothing added, no
              preservatives. Flavours rotate with the season.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Juices the shop has featured">
              {juiceFlavours.map((f) => (
                <li key={f} className="ticket bg-paper text-base text-crate">
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-soft">
              Ask in store, or check Instagram for today&apos;s line-up and prices.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/produce#juices" className="btn btn-primary">
                Read about the juices
              </Link>
              <a
                href={business.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-crate"
              >
                <Icon name="instagram" />
                Today&apos;s flavours
                <span className="sr-only">(opens Instagram in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the market */}
      <section aria-labelledby="inside-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h2 id="inside-heading" className="sign max-w-3xl text-[clamp(2.75rem,7vw,5.25rem)] text-crate">
            A market you can walk through, not just past
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.3fr_1fr]">
            <figure className="relative min-h-[18rem] overflow-hidden rounded-[var(--radius-tile)] md:min-h-[26rem]">
              <Photo image="inStoreDisplay" fallbackLabel="Inside the market" sizes="(min-width: 768px) 55vw, 92vw" />
              <figcaption className="ticket absolute bottom-4 left-4 bg-cream text-base text-crate">
                Staples stacked deep at Guildford Plaza
              </figcaption>
            </figure>
            <a
              href={business.links.featuredReel}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[var(--radius-tile)] bg-crate p-6 text-cream"
            >
              <Photo
                image="bloodOrange"
                fallbackLabel="Featured reel"
                sizes="(min-width: 768px) 40vw, 92vw"
                altOverride=""
                imgClassName="opacity-70 transition-opacity group-hover:opacity-85"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-crate-deep via-crate-deep/30 to-transparent"
                aria-hidden="true"
              />
              <span
                className="relative grid size-16 place-items-center rounded-full bg-cream text-crate transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                <Icon name="play" width="1.6em" height="1.6em" />
              </span>
              <span className="sign relative mt-4 text-4xl">Watch the featured reel</span>
              <span className="relative mt-2 inline-flex items-center gap-2 text-cream/85">
                Plays on Instagram <Icon name="external" />
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Vibrant fruit displays, fully stocked spice and snack aisles and cold drink fridges, plus homemade shanklish
            and fresh ginger shots.{" "}
            <Link href="/our-market" className="link font-semibold text-crate">
              More about the market
            </Link>
          </p>
        </div>
      </section>

      {/* Live Google rating and reviews */}
      <GoogleReviewsSection />

      {/* Specials */}
      <section aria-labelledby="specials-heading" className="border-y border-ink/10 bg-paper/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="specials-heading" className="sign text-[clamp(2.75rem,7vw,5rem)] text-crate">
              This week&apos;s specials
            </h2>
            <Link href="/specials" className="link font-semibold text-crate">
              How specials work
            </Link>
          </div>
          <SpecialsBoard variant="compact" />
        </div>
      </section>

      {/* Visit summary */}
      <section aria-labelledby="visit-heading" className="on-crate bg-crate text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-8">
          <div>
            <h2 id="visit-heading" className="sign text-[clamp(2.75rem,7vw,5.25rem)]">
              Come see what&apos;s fresh
            </h2>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 font-semibold text-citrus">
                  <Icon name="pin" /> Address
                </dt>
                <dd className="mt-2 text-cream/90">
                  {business.address.centre}
                  <br />
                  {business.address.street}
                  <br />
                  {business.address.suburb} {business.address.state} {business.address.postcode}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-semibold text-citrus">
                  <Icon name="clock" /> Hours
                </dt>
                <dd className="mt-2 text-cream/90">
                  Open 7 days
                  <br />
                  {formatTime(hours.open)} to {formatTime(hours.close)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-2 font-semibold text-citrus">
                  <Icon name="car" /> Parking
                </dt>
                <dd className="mt-2 text-cream/90">{business.parkingNote}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={business.links.googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-citrus"
              >
                <Icon name="directions" />
                Get directions
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
              <Link href="/visit" className="btn btn-outline text-cream">
                Visit details
              </Link>
            </div>
          </div>
          <MapEmbed />
        </div>
      </section>

      {/* Click & collect pitch */}
      <section aria-labelledby="preview-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center md:py-24 lg:px-8">
          <div>
            <h2 id="preview-heading" className="sign max-w-3xl text-[clamp(2.75rem,7vw,5.25rem)] text-crate">
              Picture ordering ahead
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft">
              This is a working preview of how click-and-collect could look at Hamze Brothers. Browse the market, fill a
              basket and pick a collection time. It&apos;s a demonstration only: nothing is ordered, paid for or sent to
              the shop.
            </p>
            <Link href="/shop" className="btn btn-primary mt-7 text-lg">
              <Icon name="basket" />
              Try the shopping preview
            </Link>
          </div>
          <Image
            src={images.logoFull.src}
            alt={images.logoFull.alt}
            width={images.logoFull.width}
            height={images.logoFull.height}
            sizes="(min-width: 768px) 260px, 200px"
            className="mx-auto h-auto w-[200px] md:w-[260px]"
          />
        </div>
      </section>
    </>
  );
}
