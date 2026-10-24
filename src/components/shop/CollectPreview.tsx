"use client";

import { useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { demoProductById } from "@/content/demo/products";
import { formatCents, formatQty, summarise, type BasketLines } from "@/lib/basket";
import { collectionDays, type CollectionDay } from "@/lib/slots";
import { zonedNow } from "@/lib/time";
import { Icon } from "../Icon";

/**
 * Walkthrough of how click-and-collect could work. It never collects personal
 * details, takes payment or sends anything — the final step says so plainly.
 */
export function CollectPreview({ lines, onDone }: { lines: BasketLines; onDone: () => void }) {
  // Computed once when the walkthrough opens (client only).
  const [days] = useState<CollectionDay[]>(() =>
    collectionDays(zonedNow(new Date()), business.hours, business.hoursExceptions),
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [showSlotError, setShowSlotError] = useState(false);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  // Move focus to the start of each step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (step === 2) reviewHeading.current?.focus();
    else formRef.current?.querySelector<HTMLInputElement>("input:checked, input")?.focus();
  }, [step]);

  const entries = Object.entries(lines).filter(([id]) => demoProductById.has(id));
  const { demoSubtotalCents } = summarise(lines, demoProductById);
  const chosen = days.flatMap((d) => d.slots.map((s) => ({ ...s, day: d.label }))).find((s) => s.id === slotId);

  return (
    <div className="px-5 py-5 sm:px-6">
      <ol className="mb-6 flex gap-2 text-sm font-semibold" aria-label="Preview steps">
        {["Collection time", "Review"].map((label, i) => (
          <li
            key={label}
            aria-current={step === i + 1 ? "step" : undefined}
            className={`flex-1 rounded-full px-3 py-1.5 text-center ${
              step === i + 1 ? "bg-crate text-cream" : "bg-cream-deep text-ink-soft"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (!slotId) {
              setShowSlotError(true);
              formRef.current?.querySelector<HTMLInputElement>("input")?.focus();
              return;
            }
            setStep(2);
          }}
        >
          <fieldset aria-describedby={showSlotError ? "slot-error" : undefined}>
            <legend className="font-display text-xl font-bold">Choose a collection window</legend>
            <p className="mt-1 text-sm text-ink-soft">
              Example windows based on the shop&apos;s opening hours. Demo only.
            </p>
            {showSlotError && (
              <p
                id="slot-error"
                className="mt-3 rounded-lg bg-pomegranate/10 px-3 py-2 text-sm font-semibold text-pomegranate"
                role="alert"
              >
                Choose a collection window to continue.
              </p>
            )}
            <div className="mt-4 space-y-5">
              {days.map((day) => (
                <div key={day.date}>
                  <p className="font-semibold">{day.label}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {day.slots.map((slot) => (
                      <label
                        key={slot.id}
                        className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border-2 border-ink/15 px-2 py-2 text-center text-sm font-semibold has-[:checked]:border-crate has-[:checked]:bg-crate has-[:checked]:text-cream has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-citrus"
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          className="sr-only"
                          checked={slotId === slot.id}
                          onChange={() => {
                            setSlotId(slot.id);
                            setShowSlotError(false);
                          }}
                        />
                        {slot.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn btn-primary mt-6 w-full">
            Continue to review
          </button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h3 ref={reviewHeading} tabIndex={-1} className="font-display text-xl font-bold focus:outline-none">
            Your preview
          </h3>
          <dl className="mt-3 rounded-2xl bg-cream-deep/70 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Collect from</dt>
              <dd className="text-right font-semibold">
                {business.name}, {business.address.centre}
              </dd>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <dt className="text-ink-soft">Window</dt>
              <dd className="text-right font-semibold">{chosen ? `${chosen.day}, ${chosen.label}` : "Not chosen"}</dd>
            </div>
          </dl>
          <ul className="mt-4 divide-y divide-ink/10 text-sm">
            {entries.map(([id, qty]) => {
              const p = demoProductById.get(id)!;
              return (
                <li key={id} className="flex justify-between gap-3 py-2">
                  <span>
                    {p.name} <span className="text-ink-soft">({formatQty(qty, p)})</span>
                  </span>
                  <span className="tabular-nums">{formatCents(Math.round(p.demoPriceCents * qty))}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex justify-between border-t-2 border-ink/15 pt-3 font-bold">
            <span>Demo subtotal</span>
            <span className="text-crate tabular-nums">{formatCents(demoSubtotalCents)}</span>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-crate bg-paper p-4" role="note">
            <p className="flex items-center gap-2 font-display text-lg font-bold text-crate">
              <Icon name="info" /> This is where the preview ends
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Online ordering isn&apos;t available yet. Nothing has been sent to {business.shortName}, no order has been
              placed and no payment was taken. In a live version, this step would confirm your details and send the
              order to the shop to pack for your chosen window.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-outline flex-1 text-crate" onClick={() => setStep(1)}>
              Change window
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={onDone}>
              Finish preview
            </button>
          </div>
          <a
            href={business.links.googleDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-crate"
          >
            <Icon name="directions" /> Shop in person today: get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      )}
    </div>
  );
}
