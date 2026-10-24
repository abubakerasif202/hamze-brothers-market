import { Icon } from "@/components/Icon";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenStatus } from "@/components/OpenStatus";
import { PageIntro } from "@/components/PageIntro";
import { business } from "@/content/business";
import type { DayKey } from "@/content/business";
import { pageMetadata } from "@/lib/seo";
import { formatTime } from "@/lib/time";

export const metadata = pageMetadata({
  title: "Visit & Contact",
  description:
    "Find Hamze Brothers Fruit Market at Guildford Plaza, 282 Guildford Rd, Guildford NSW 2161. Open 7 days, 8am to 9:30pm. Directions, parking and how to get in touch.",
  path: "/visit",
});

const dayNames: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export default function VisitPage() {
  const upcomingExceptions = business.hoursExceptions;
  return (
    <>
      <PageIntro
        title="Visit us"
        aside={
          <p className="ticket bg-cream text-lg text-crate">
            <OpenStatus />
          </p>
        }
      >
        <p>
          {business.address.centre}, {business.address.street}, {business.address.suburb} {business.address.state}{" "}
          {business.address.postcode}.
        </p>
      </PageIntro>

      <section aria-labelledby="directions-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.25fr] lg:px-8">
          <div>
            <h2 id="directions-heading" className="sign text-[clamp(2.5rem,6vw,4.25rem)] text-crate">
              Getting here
            </h2>
            <address className="mt-6 text-lg leading-relaxed not-italic">
              <strong className="font-semibold">{business.name}</strong>
              <br />
              {business.address.centre}
              <br />
              {business.address.street}
              <br />
              {business.address.suburb} {business.address.state} {business.address.postcode}
            </address>
            <p className="mt-4 flex items-start gap-2 text-ink-soft">
              <Icon name="car" className="mt-1 shrink-0 text-crate" />
              {business.parkingNote}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={business.links.googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Icon name="directions" />
                Directions in Google Maps
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={business.links.appleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-crate"
              >
                <Icon name="pin" />
                Apple Maps
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <a
              href={business.links.googleMapsListing}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-5 inline-flex items-center gap-2 font-semibold text-crate"
            >
              Photos and reviews on Google Maps <Icon name="external" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <MapEmbed />
        </div>
      </section>

      <section aria-labelledby="hours-heading" className="bg-cream-deep">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <h2 id="hours-heading" className="sign text-[clamp(2.5rem,6vw,4.25rem)] text-crate">
              Opening hours
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">{business.holidayNote}</p>
            {upcomingExceptions.length > 0 && (
              <div className="mt-6 rounded-2xl bg-paper p-5">
                <h3 className="font-semibold text-crate">Special trading hours</h3>
                <ul className="mt-2 space-y-1 text-ink-soft">
                  {upcomingExceptions.map((e) => (
                    <li key={e.date}>
                      {e.label}:{" "}
                      {e.closed || !e.open || !e.close ? "Closed" : `${formatTime(e.open)} to ${formatTime(e.close)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <table className="w-full self-start text-left text-lg">
            <caption className="sr-only">Weekly opening hours</caption>
            <tbody>
              {(Object.keys(dayNames) as DayKey[]).map((day) => (
                <tr key={day} className="border-b border-ink/10">
                  <th scope="row" className="py-3 font-semibold">
                    {dayNames[day]}
                  </th>
                  <td className="py-3 text-right text-ink-soft tabular-nums">
                    {formatTime(business.hours[day].open)} to {formatTime(business.hours[day].close)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="on-crate bg-crate text-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20 lg:px-8">
          <div>
            <h2 id="contact-heading" className="sign text-[clamp(2.5rem,6vw,4.25rem)]">
              Get in touch
            </h2>
            <p className="mt-4 max-w-xl text-lg text-cream/85">
              Find the shop on Instagram at{" "}
              <span className="font-semibold [overflow-wrap:anywhere] text-cream">
                {business.links.instagramHandle}
              </span>
              . The quickest way to reach the team is a direct message on Instagram, or just ask in store. For questions
              about stock, pop in or send a message before you travel.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={business.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-citrus text-lg"
            >
              <Icon name="instagram" />
              Message us on Instagram
              <span className="sr-only">(opens {business.links.instagramHandle} in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
