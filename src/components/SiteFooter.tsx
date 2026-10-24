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
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[auto_1fr_1fr_1fr] lg:px-8">
        <Image
          src={images.logoBadge.src}
          alt={images.logoBadge.alt}
          width={128}
          height={128}
          sizes="128px"
          className="size-28 rounded-full"
        />
        <div>
          <h2 className="sign text-3xl text-cream">Find us</h2>
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
          <h2 className="sign text-3xl text-cream">Opening hours</h2>
          <p className="mt-4 text-cream/85">
            Monday to Sunday
            <br />
            {formatTime(hours.open)} to {formatTime(hours.close)}
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">{business.holidayNote}</p>
        </div>
        <div>
          <h2 className="sign text-3xl text-cream">Explore</h2>
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
            Website by{" "}
            <a
              href={studio.url}
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:text-cream"
            >
              {studio.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
