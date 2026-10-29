import Link from "next/link";
import { GoogleReviewsSection } from "@/components/GoogleReviews";
import { Banana, Watermelon } from "@/components/fun/Fruit";
import { Reveal } from "@/components/fun/Effects";
import { FruitSurprise } from "@/components/fun/FruitSurprise";
import { Photo } from "@/components/Photo";
import { MapEmbed } from "@/components/MapEmbed";
import { HarvestBoxes } from "@/components/shop/HarvestBoxes";
import { SpecialsShowcase } from "@/components/specials/SpecialsShowcase";
import { business } from "@/content/business";
import { categories } from "@/content/categories";
import { defaultDescription, pageMetadata } from "@/lib/seo";
import { formatTime } from "@/lib/time";
export const metadata = pageMetadata({ description: defaultDescription, path: "/" });
const cards = [
  ...categories.filter((c) => c.id !== "juices"),
  {
    id: "specials",
    name: "Weekly Specials",
    strapline: "See what’s fresh this week.",
    image: "fruitAssortment" as const,
  },
];
export default function HomePage() {
  return (
    <div className="market-home">
      <section className="market-hero" aria-labelledby="hero-heading">
        <Photo image="inStoreDisplay" fallbackLabel="Inside Hamze Brothers" sizes="100vw" preload />
        <div className="market-hero-shade" />
        <div className="market-wrap market-hero-content">
          <p className="eyebrow">✦ Fresh produce · Local market · Guildford</p>
          <h1 id="hero-heading">
            Fresh produce
            <br />
            for the <span>family</span>
            <br />
            table.
          </h1>
          <p className="hero-copy">
            Quality fruit, fresh vegetables and pantry essentials — a welcoming local shopping experience at Guildford
            Plaza.
          </p>
          <div className="market-actions">
            <Link href="/shop" className="btn btn-berry">
              Shop online (preview) <span aria-hidden="true">→</span>
            </Link>
            <a
              href={business.links.googleDirections}
              className="btn market-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions ↗
            </a>
          </div>
          <p className="market-script">Fresh. Local. Family.</p>
          <div className="market-hero-banana">
            <Banana />
          </div>
        </div>
      </section>
      <section className="market-values" aria-label="Our values">
        <div className="market-wrap">
          {[
            { icon: "✿", title: "Fresh.", copy: "Selected with care every day." },
            { icon: "♡", title: "Local.", copy: "Your neighbourhood market in Guildford." },
            { icon: "♧", title: "Family.", copy: "At the heart of everything we do." },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className={`market-value market-value-${i}`}>
                <span aria-hidden="true">{v.icon}</span>
                <h2>{v.title}</h2>
                <p>{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="market-wrap market-categories" aria-labelledby="categories-heading">
        <div className="market-section-head">
          <h2 id="categories-heading">
            Shop by Category <span aria-hidden="true">❧</span>
          </h2>
          <Link href="/produce">Explore the market →</Link>
        </div>
        <div className="market-category-grid">
          {cards.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 65}>
              <Link className="market-category" href={cat.id === "specials" ? "/specials" : `/produce#${cat.id}`}>
                <div className="market-category-photo">
                  <Photo
                    image={cat.image}
                    fallbackLabel={cat.name}
                    sizes="(min-width:1024px) 19vw, (min-width:640px) 45vw, 90vw"
                  />
                </div>
                <div className="market-category-copy">
                  <h3>{cat.id === "greens" ? "Greens" : cat.id === "pantry" ? "Pantry" : cat.name}</h3>
                  <p>{cat.strapline}</p>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="market-about">
        <div className="market-wrap market-split">
          <Reveal>
            <p className="eyebrow">❧ About Hamze Brothers</p>
            <h2>
              A local market,
              <br />
              <span>family values.</span>
            </h2>
            <p>
              Fruit and vegetables, fresh juice and pantry favourites, all under one roof. Discover Hamze Brothers at
              Guildford Plaza and find something good for your family table.
            </p>
            <Link href="/our-market" className="btn btn-primary">
              Our Story →
            </Link>
          </Reveal>
          <Reveal>
            <div className="market-about-photo">
              <Photo image="inStoreDisplay" fallbackLabel="Our market" sizes="(min-width:768px) 48vw, 92vw" />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="market-wrap market-visit" aria-labelledby="visit-heading">
        <div>
          <p className="eyebrow">❧ A little closer to fresh</p>
          <h2 id="visit-heading">Visit the Market</h2>
          <p>Come for your everyday essentials. Stay for a little inspiration.</p>
          <address>
            {business.address.centre}
            <br />
            {business.address.street}
            <br />
            {business.address.suburb} {business.address.state} {business.address.postcode}
          </address>
          <p>
            <strong>Open 7 days</strong>
            <br />
            {formatTime(business.hours.mon.open)}–{formatTime(business.hours.mon.close)}
          </p>
          <a
            href={business.links.googleDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Get Directions ↗
          </a>
        </div>
        <MapEmbed />
      </section>
      <section className="market-order">
        <div className="market-wrap market-order-inner">
          <div className="market-banana" aria-hidden="true">
            🍋
          </div>
          <div>
            <p className="eyebrow">Online ordering</p>
            <h2>
              Order Online <span>Soon!</span>
            </h2>
            <p>
              We’re working on bringing the market experience to your home. Explore our shopping preview in the
              meantime. No orders or payments are taken.
            </p>
            <Link href="/shop" className="btn btn-berry">
              Explore shopping preview →
            </Link>
          </div>
          <div className="market-melon">
            <Watermelon />
          </div>
        </div>
      </section>
      <section className="market-wrap market-demo">
        <div className="market-section-head">
          <h2>A basket of inspiration</h2>
          <span>Demo prices · preview only</span>
        </div>
        <HarvestBoxes />
      </section>
      <GoogleReviewsSection />
      <SpecialsShowcase />
      <FruitSurprise />
    </div>
  );
}
