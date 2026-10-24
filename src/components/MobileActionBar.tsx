import { business } from "@/content/business";
import { Icon } from "./Icon";
import { OpenStatus } from "./OpenStatus";

/** Persistent bottom bar on small screens: the primary visit action is always one tap away. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(14_59_42/0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1 text-[0.8rem] leading-tight font-semibold text-ink-soft">
          <OpenStatus />
          <span className="mt-0.5 block truncate pl-[1.125rem] font-normal">
            {business.address.streetShort}, Guildford
          </span>
        </div>
        <a
          href={business.links.googleDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary shrink-0 !px-5"
        >
          <Icon name="directions" />
          Directions
          <span className="sr-only">(opens Google Maps in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
