import { Icon } from "@/components/Icon";
import { PageIntro } from "@/components/PageIntro";
import { SpecialsBoard } from "@/components/SpecialsBoard";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Specials",
  description:
    "Current in-store specials at Hamze Brothers Fruit Market, Guildford. Weekly deals are posted on Instagram first.",
  path: "/specials",
});

export default function SpecialsPage() {
  return (
    <>
      <PageIntro title="Specials">
        <p>
          Weekly and weekend deals on produce, juices and pantry staples. Specials only appear here while their dates
          are current, so what you see is what&apos;s on.
        </p>
      </PageIntro>

      <section aria-labelledby="current-heading">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <h2 id="current-heading" className="sign mb-8 text-[clamp(2.5rem,6vw,4.25rem)] text-crate">
            On right now
          </h2>
          <SpecialsBoard />
        </div>
      </section>

      <section aria-labelledby="good-to-know" className="bg-cream-deep">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 md:py-16 lg:px-8">
          <h2 id="good-to-know" className="sign text-[clamp(2.25rem,5vw,3.5rem)] text-crate">
            Good to know
          </h2>
          <p className="text-ink-soft">
            Specials are in-store offers and are limited to their advertised dates and while stocks last.
          </p>
          <p className="text-ink-soft">
            The fastest way to hear about new deals is Instagram.{" "}
            <a
              href={business.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link font-semibold [overflow-wrap:anywhere] text-crate"
            >
              <Icon name="instagram" className="mr-1 inline align-[-0.2em]" />
              Follow {business.links.instagramHandle}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
