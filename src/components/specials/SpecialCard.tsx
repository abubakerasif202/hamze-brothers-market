import { categoryById } from "@/content/categories";
import type { ImageKey } from "@/content/images";
import type { Special } from "@/content/specials";
import { formatOfferDates, splitPrice } from "@/lib/specials";
import { Icon } from "../Icon";
import { Photo } from "../Photo";

/** Price tags rotate through the flyer's colours; all pass AA contrast with white text. */
const tagColours = ["bg-citrus-deep", "bg-leaf", "bg-pomegranate", "bg-fig"] as const;

export function specialImage(special: Special): ImageKey | null {
  return special.image ?? (special.category ? categoryById[special.category].image : null);
}

export function SpecialCard({ special, index }: { special: Special; index: number }) {
  const { amount, unit } = splitPrice(special.price);
  const category = special.category ? categoryById[special.category]?.name : undefined;
  return (
    <article className="special-card group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-paper shadow-[0_1px_0_rgb(14_59_42/0.1),0_10px_24px_-14px_rgb(14_59_42/0.35)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full bg-cream-deep">
        <Photo
          image={specialImage(special)}
          fallbackLabel={special.title}
          sizes="(min-width: 1024px) 22vw, (min-width: 420px) 45vw, 92vw"
          altOverride=""
          imgClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4">
        {category && <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{category}</p>}
        <h3 className="sign mt-0.5 text-[clamp(1.35rem,1.1rem+1.2vw,1.9rem)] leading-none font-extrabold tracking-tight [overflow-wrap:anywhere] text-crate uppercase">
          {special.title}
        </h3>
        <p
          className={`mt-3 flex items-baseline justify-center gap-1.5 rounded-lg px-3 py-2 text-white ${tagColours[index % tagColours.length]}`}
        >
          <span className="font-display text-[clamp(1.6rem,1.3rem+1.4vw,2.25rem)] leading-none font-extrabold tabular-nums">
            {amount}
          </span>
          {unit && <span className="text-sm font-bold tracking-wide uppercase sm:text-base">{unit}</span>}
        </p>
        {special.detail && <p className="mt-2 text-sm text-ink-soft">{special.detail}</p>}
        <p className="mt-auto flex items-start gap-1.5 pt-3 text-xs leading-snug text-ink-soft sm:text-sm">
          <Icon name="clock" className="mt-0.5 shrink-0" width="1em" height="1em" />
          <span>
            {formatOfferDates(special.startDate, special.endDate)}
            {special.conditions ? `. ${special.conditions}` : ""}
          </span>
        </p>
      </div>
    </article>
  );
}
