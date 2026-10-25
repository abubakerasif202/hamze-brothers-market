"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { business, fullAddress } from "@/content/business";
import { categoryById } from "@/content/categories";
import { specials } from "@/content/specials";
import { activeSpecials, formatOfferDates } from "@/lib/specials";
import { zonedNow } from "@/lib/time";
import type { Special } from "@/content/specials";
import { Reveal } from "./fun/Effects";
import { Icon } from "./Icon";
import { SpecialCard } from "./specials/SpecialCard";

/** The home page shows two rows of four; the rest live on /specials. */
const FEATURE_LIMIT = 8;

/**
 * Shows only specials whose dates include today (Sydney time). Dates are
 * checked in the browser so expired offers drop off without a redeploy.
 */
export function SpecialsBoard({
  variant = "full",
  source = specials,
  todayOverride,
}: {
  variant?: "full" | "compact" | "feature";
  /** Defaults to the real specials. Only the development preview passes anything else. */
  source?: readonly Special[];
  /** Fixed Sydney date (YYYY-MM-DD) for the development preview; real pages use the clock. */
  todayOverride?: string;
}) {
  const [current, setCurrent] = useState<Special[] | null>(null);

  useEffect(() => {
    const check = () => setCurrent(activeSpecials(source, todayOverride ?? zonedNow(new Date()).date));
    check();
    if (todayOverride) return;
    const timer = window.setInterval(check, 5 * 60_000);
    return () => window.clearInterval(timer);
  }, [source, todayOverride]);

  if (current === null) {
    return (
      <>
        <div className="min-h-40 animate-pulse rounded-[var(--radius-tile)] bg-cream-deep/60" aria-busy="true">
          <span className="sr-only">Checking this week&apos;s specials…</span>
        </div>
        <noscript>
          <p className="text-ink-soft">
            Specials need JavaScript to check their dates.{" "}
            <a href={business.links.instagram} className="link font-semibold text-crate">
              See this week&apos;s deals on Instagram
            </a>
            .
          </p>
        </noscript>
      </>
    );
  }

  if (current.length === 0) {
    return (
      <div className="rounded-[var(--radius-tile)] border-2 border-dashed border-crate/25 bg-paper p-6 sm:p-8">
        <h3 className="sign text-3xl text-crate sm:text-4xl">Specials change every week</h3>
        <p className="mt-3 max-w-xl text-ink-soft">
          There are no specials posted on the website right now. The shop shares each week&apos;s deals on Instagram
          first — follow along so you see them before you shop.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={business.links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Icon name="instagram" />
            See this week&apos;s deals on Instagram
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {variant === "full" && (
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
          )}
        </div>
      </div>
    );
  }

  if (variant === "feature") {
    const shown = current.slice(0, FEATURE_LIMIT);
    return (
      <div>
        <ul className="grid gap-3 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {shown.map((s, i) => (
            <li key={s.id} className="flex">
              <Reveal className="flex w-full" delay={Math.min(i, 7) * 80}>
                <SpecialCard special={s} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
        {current.length > shown.length && (
          <p className="mt-6 text-center">
            <Link href="/specials" className="btn btn-primary">
              See all {current.length} specials
            </Link>
          </p>
        )}
        <p className="mt-6 text-center text-sm text-ink-soft">
          Only at {business.name} · {fullAddress}. In-store only while stocks last. Prices as advertised by the shop.
        </p>
      </div>
    );
  }

  const list = variant === "compact" ? current.slice(0, 4) : current;
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li
            key={s.id}
            className="flex flex-col rounded-[var(--radius-tile)] bg-paper p-6 shadow-[0_1px_0_rgb(14_59_42/0.08)]"
          >
            {s.category && <p className="text-sm font-semibold text-ink-soft">{categoryById[s.category]?.name}</p>}
            <h3 className="sign mt-1 text-3xl text-crate">{s.title}</h3>
            <p className="ticket mt-4 self-start bg-pomegranate text-2xl text-white">{s.price}</p>
            {s.detail && <p className="mt-3 text-ink-soft">{s.detail}</p>}
            <p className="mt-auto pt-4 text-sm text-ink-soft">
              {formatOfferDates(s.startDate, s.endDate)}
              {s.conditions ? `. ${s.conditions}` : ""}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">In-store only while stocks last. Prices as advertised by the shop.</p>
    </div>
  );
}
