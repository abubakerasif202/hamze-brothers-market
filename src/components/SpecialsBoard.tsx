"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { categoryById } from "@/content/categories";
import { specials } from "@/content/specials";
import { activeSpecials, formatShortDate } from "@/lib/specials";
import { zonedNow } from "@/lib/time";
import type { Special } from "@/content/specials";
import { Icon } from "./Icon";

/**
 * Shows only specials whose dates include today (Sydney time). Dates are
 * checked in the browser so expired offers drop off without a redeploy.
 */
export function SpecialsBoard({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [current, setCurrent] = useState<Special[] | null>(null);

  useEffect(() => {
    const check = () => setCurrent(activeSpecials(specials, zonedNow(new Date()).date));
    check();
    const timer = window.setInterval(check, 5 * 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (current === null) {
    return (
      <div className="min-h-40 animate-pulse rounded-[var(--radius-tile)] bg-cream-deep/60" aria-busy="true">
        <span className="sr-only">Checking this week&apos;s specials…</span>
      </div>
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
              {s.startDate === s.endDate
                ? `${formatShortDate(s.startDate)} only`
                : `${formatShortDate(s.startDate)} to ${formatShortDate(s.endDate)}`}
              {s.conditions ? `. ${s.conditions}` : ""}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">In-store only while stocks last. Prices as advertised by the shop.</p>
    </div>
  );
}
