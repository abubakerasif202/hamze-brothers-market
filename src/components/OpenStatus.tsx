"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { formatTime, openStatus, type OpenStatus as Status, zonedNow } from "@/lib/time";

/**
 * Live "open now" line computed in Sydney time on the client.
 * Server render shows the static hours so the line is never empty or wrong.
 */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus(zonedNow(new Date()), business.hours, business.hoursExceptions));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = business.hours.mon;
  let text = `Open 7 days, ${formatTime(today.open)}–${formatTime(today.close)}`;
  let dot = "bg-leaf-bright";
  if (status) {
    const label = status.exception ? ` (${status.exception.label})` : "";
    if (status.state === "open") text = `Open now until ${formatTime(status.closesAt)}${label}`;
    else if (status.state === "before-open") {
      text = `Opens today at ${formatTime(status.opensAt)}${label}`;
      dot = "bg-citrus";
    } else {
      text = status.exception ? `Closed today${label}` : `Closed now, opens ${formatTime(today.open)} tomorrow`;
      dot = "bg-pomegranate";
    }
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}
