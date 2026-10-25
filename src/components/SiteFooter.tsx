import Image from "next/image";
import Link from "next/link";
import { business, studio } from "@/content/business";
import { images } from "@/content/images";
import { navItems } from "@/lib/site";
import { formatTime } from "@/lib/time";
import { Icon } from "./Icon";

export function SiteFooter() {
  const hours = business.hours.mon;
  return (
    <footer className="on-crate bg-crate-deep pb-28 text-cream lg:pb-0">
      <div className="mx-auto max-w-7xl border-b border-cream/15 px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <p className="eyebrow mb-4 text-citrus">Hamze Brothers · Guildford Plaza</p>
        <p className="sign max-w-3xl text-[clamp(2.75rem,6vw,5rem)]">
          Fresh food.
          <br />A familiar face.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[auto_1fr_1fr_1fr] lg:gap-12 lg:px-8">
        <Image
          src={images.logoBadge.src}
          alt={images.logoBadge.alt}
          width={128}
          height={128}
          sizes="128px"
          className="size-28 rounded-full"
        />
        <div>
          <h2 className="eyebrow text-cream">Find us</h2>
          <address className="mt-4 leading-relaxed text-cream/85 not-italic">
            {business.name}
            <br />
            {business.address.centre}
            <br />
            {business.address.street}
            <br />
            {business.address.suburb} {business.address.state} {business.address.postcode}
          </address>
          <a
            href={business.links.googleDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="link mt-4 inline-flex items-center gap-2 font-semibold"
          >
            <Icon name="directions" /> Directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
        <div>
          <h2 className="eyebrow text-cream">Opening hours</h2>
          <p className="mt-4 text-cream/85">
            Monday to Sunday
            <br />
            {formatTime(hours.open)} to {formatTime(hours.close)}
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">{business.holidayNote}</p>
        </div>
        <div>
          <h2 className="eyebrow text-cream">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-cream/85">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-citrus">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={business.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link mt-5 inline-flex items-center gap-2 font-semibold"
          >
            <Icon name="instagram" /> Follow on Instagram
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-cream/65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {business.name}. {business.tagline}
          </p>
          <p>
            Designed & built by{" "}
            <a
              href={studio.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-cream underline underline-offset-4 hover:text-citrus"
            >
              {studio.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
