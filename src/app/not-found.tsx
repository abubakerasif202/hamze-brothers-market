import Link from "next/link";
import { Icon } from "@/components/Icon";
import { business } from "@/content/business";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6 md:py-32">
      <p className="ticket bg-pomegranate text-lg text-white">404</p>
      <h1 className="sign mt-6 text-[clamp(3rem,10vw,6.5rem)] text-crate">This aisle doesn&apos;t exist</h1>
      <p className="mt-5 max-w-xl text-lg text-ink-soft">
        The page you were after may have moved. Head back to the home page, or straight to the market.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <a
          href={business.links.googleDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline text-crate"
        >
          <Icon name="directions" />
          Get directions
          <span className="sr-only">(opens Google Maps in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
