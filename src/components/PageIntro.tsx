import type { ReactNode } from "react";

/** Opening band for inner pages: big market-sign heading on deep green. */
export function PageIntro({ title, children, aside }: { title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="on-crate relative overflow-hidden bg-crate text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-12 pb-14 sm:px-6 md:pt-16 md:pb-20 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:px-8">
        <div>
          <h1 className="sign rise text-[clamp(3.25rem,11vw,8rem)] text-cream">{title}</h1>
          {children && <div className="mt-6 max-w-2xl text-lg text-cream/85 md:text-xl">{children}</div>}
        </div>
        {aside && <div className="lg:justify-self-end">{aside}</div>}
      </div>
      <div
        className="h-2 bg-[linear-gradient(90deg,var(--color-pomegranate)_0_25%,var(--color-citrus)_25%_50%,var(--color-leaf)_50%_75%,var(--color-fig)_75%)]"
        aria-hidden="true"
      />
    </section>
  );
}
