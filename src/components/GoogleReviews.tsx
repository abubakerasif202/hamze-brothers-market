"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { business } from "@/content/business";
import type { GoogleReview, GoogleReviewsResult } from "@/lib/google-reviews";
import { Icon } from "./Icon";

type LoadState = { status: "idle" } | GoogleReviewsResult;

/** Loads live Google rating/reviews only when the section nears the viewport. */
function useGoogleReviews<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      fetch("/api/google-reviews", { cache: "no-store" })
        .then((res) => res.json() as Promise<GoogleReviewsResult>)
        .then((data) => {
          if (!cancelled) setState(data && "status" in data ? data : { status: "error" });
        })
        .catch(() => {
          if (!cancelled) setState({ status: "error" });
        });
    };
    if (!("IntersectionObserver" in window)) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return { ref, state };
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  const id = useId();
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} viewBox="0 0 20 20" width="1em" height="1em">
            <defs>
              <linearGradient id={`${id}-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f39a1e" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${id}-${i})`}
              d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function ReviewItem({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 280;
  return (
    <li className="flex flex-col rounded-[var(--radius-tile)] border border-ink/10 bg-paper p-5 sm:p-6">
      <div className="flex items-center gap-3">
        {review.author.photoUrl ? (
          <Image
            src={review.author.photoUrl}
            alt=""
            width={40}
            height={40}
            unoptimized
            referrerPolicy="no-referrer"
            className="size-10 shrink-0 rounded-full bg-cream-deep"
          />
        ) : (
          <span
            className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-deep font-bold text-crate"
            aria-hidden="true"
          >
            {review.author.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {review.author.url ? (
              <a
                href={review.author.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:underline"
              >
                {review.author.name}
                <span className="sr-only"> (Google profile, opens in a new tab)</span>
              </a>
            ) : (
              review.author.name
            )}
          </p>
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Stars rating={review.rating} className="text-ink" />
            <span className="sr-only">Rated {review.rating} out of 5.</span>
            {review.relativeTime && <span>{review.relativeTime}</span>}
          </p>
        </div>
      </div>
      <p className={`mt-4 whitespace-pre-line text-ink ${long && !expanded ? "line-clamp-6" : ""}`}>{review.text}</p>
      {review.translated && <p className="mt-2 text-xs text-ink-soft">Translated by Google</p>}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-sm font-semibold text-crate">
        {long && (
          <button
            type="button"
            className="underline underline-offset-2"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        {review.reviewUrl && (
          <a
            href={review.reviewUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 underline underline-offset-2"
          >
            View on Google Maps <Icon name="external" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}

function FallbackCard() {
  return (
    <div className="rounded-[var(--radius-tile)] border border-ink/10 bg-paper p-6 sm:p-8">
      <p className="max-w-xl text-lg text-ink-soft">
        Read what shoppers say about {business.shortName} on its Google Maps listing.
      </p>
      <a
        href={business.links.googleMapsListing}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary mt-5"
      >
        Read reviews on Google Maps
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

/** Full reviews section for the home page. */
export function GoogleReviewsSection() {
  const { ref, state } = useGoogleReviews<HTMLElement>();
  const headingId = useId();

  return (
    <section ref={ref} aria-labelledby={headingId} className="bg-cream-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,26rem)_1fr] lg:px-8">
        <div>
          <h2 id={headingId} className="sign text-[clamp(2.75rem,7vw,5rem)] text-crate">
            What shoppers say
          </h2>
          {state.status === "ok" && state.rating !== null && state.ratingCount > 0 && (
            <div className="mt-6">
              <p className="flex items-end gap-3">
                <span className="sign text-7xl text-crate">{state.rating.toFixed(1)}</span>
                <Stars rating={state.rating} className="mb-2 text-2xl text-ink" />
              </p>
              <p className="mt-1 text-ink-soft">
                <span className="sr-only">Rated {state.rating.toFixed(1)} out of 5 </span>
                from {state.ratingCount} {state.ratingCount === 1 ? "review" : "reviews"} on Google Maps
              </p>
            </div>
          )}
          {state.status === "ok" && (
            <a
              href={state.listingUrl ?? business.links.googleMapsListing}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6"
            >
              See all reviews on Google Maps
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>

        <div aria-live="polite" aria-busy={state.status === "idle"}>
          {state.status === "idle" && (
            <ul className="grid gap-4 md:grid-cols-2" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="h-48 animate-pulse rounded-[var(--radius-tile)] bg-paper/70" />
              ))}
            </ul>
          )}
          {(state.status === "unconfigured" || state.status === "error") && <FallbackCard />}
          {state.status === "ok" &&
            (state.reviews.length === 0 ? (
              <FallbackCard />
            ) : (
              <>
                <ul className="grid gap-4 md:grid-cols-2">
                  {state.reviews.map((r) => (
                    <ReviewItem key={r.id} review={r} />
                  ))}
                </ul>
                <p className="mt-5 text-sm text-ink-soft">
                  Reviews from <span className="font-semibold whitespace-nowrap text-ink">Google Maps</span>, shown
                  unedited in Google&apos;s &ldquo;most relevant&rdquo; order (up to five). Reviews aren&apos;t verified
                  by Google, but Google checks for and removes fake content.
                </p>
              </>
            ))}
        </div>
      </div>
    </section>
  );
}

/** Compact live rating line for the Visit page. Renders nothing unless Google returns a rating. */
export function GoogleRatingSummary() {
  const { ref, state } = useGoogleReviews<HTMLSpanElement>();
  return (
    <span ref={ref} className="block min-h-6">
      {state.status === "ok" && state.rating !== null && state.ratingCount > 0 && (
        <a
          href={state.listingUrl ?? business.links.googleMapsListing}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-wrap items-center gap-2 font-semibold text-crate hover:underline"
        >
          <Stars rating={state.rating} className="text-lg text-ink" />
          <span>
            {state.rating.toFixed(1)} out of 5 from {state.ratingCount} reviews on{" "}
            <span className="whitespace-nowrap">Google Maps</span>
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </span>
  );
}
