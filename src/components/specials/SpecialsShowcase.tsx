import Link from "next/link";
import { Reveal } from "../fun/Effects";
import { SpecialsBoard } from "../SpecialsBoard";
import type { Special } from "@/content/specials";
import { business } from "@/content/business";
import { Leaf } from "./Leaf";

/**
 * Homepage "This week's specials": flyer-inspired heading and layout around the
 * live, date-checked SpecialsBoard. `source` / `todayOverride` exist only for
 * the development preview; the public page always reads the real specials.
 */
export function SpecialsShowcase({
  source,
  todayOverride,
  headingId = "specials-heading",
}: {
  source?: readonly Special[];
  todayOverride?: string;
  headingId?: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="specials-section relative overflow-hidden border-y border-ink/10 bg-[radial-gradient(ellipse_at_top,#fffdf6_0%,#f6efd9_100%)]"
    >
      <Leaf className="-top-8 -left-10 w-24 rotate-[-28deg] sm:-top-4 sm:-left-6 sm:w-32" />
      <Leaf className="-right-8 -bottom-6 w-28 rotate-[152deg] sm:w-36" style={{ animationDelay: "-3s" }} />
      <Leaf className="top-24 -right-4 hidden w-16 rotate-[28deg] md:block" style={{ animationDelay: "-6s" }} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id={headingId} className="specials-title">
            <span className="specials-title-main">Weekly</span> <span className="specials-title-accent">Specials</span>
          </h2>
          <p className="specials-ribbon mx-auto mt-6 inline-flex max-w-full items-center rounded-sm px-5 py-2 text-sm font-bold tracking-[0.14em] text-cream uppercase sm:text-base">
            {business.tagline}
          </p>
        </Reveal>
        <div className="mt-10">
          <SpecialsBoard variant="feature" source={source} todayOverride={todayOverride} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/specials" className="link font-semibold text-crate">
            How specials work
          </Link>
        </p>
      </div>
    </section>
  );
}
