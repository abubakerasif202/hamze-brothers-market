"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { images } from "@/content/images";
import { navItems } from "@/lib/site";
import { useBasket } from "@/lib/basket-store";
import { summarise } from "@/lib/basket";
import { demoProductById } from "@/content/demo/products";
import { Icon } from "./Icon";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedFor, setOpenedFor] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const basket = useBasket();
  const { itemCount } = summarise(basket.lines, demoProductById);

  // Close the mobile menu after navigating (derived during render, no effect needed).
  if (openedFor !== pathname) {
    setOpenedFor(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && panel) {
        const focusables = [
          toggleRef.current,
          ...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-full focus:bg-crate focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <Image
              src={images.logoMark.src}
              alt=""
              width={images.logoMark.width}
              height={images.logoMark.height}
              className="h-11 w-auto shrink-0 lg:h-12"
              loading="eager"
              sizes="56px"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="sign truncate text-[1.35rem] text-crate lg:text-[1.6rem]">Hamze Brothers</span>
              <span className="mt-0.5 truncate text-[0.8rem] font-semibold text-ink-soft">Fruit Market, Guildford</span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-ink/5 ${
                        active ? "text-crate" : "text-ink-soft"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span
                          className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-pomegranate"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <Link
              href="/shop#basket"
              className="relative inline-flex size-11 items-center justify-center rounded-full text-crate hover:bg-ink/5"
              aria-label={itemCount > 0 ? `Demo basket, ${itemCount} items` : "Demo basket, empty"}
            >
              <Icon name="basket" width="1.4em" height="1.4em" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-pomegranate px-1 text-[0.7rem] leading-5 font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <a
              href={business.links.googleDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hidden !min-h-11 !py-2 sm:inline-flex"
            >
              <Icon name="directions" />
              Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-crate hover:bg-ink/5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} width="1.5em" height="1.5em" />
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-[35] overflow-y-auto bg-crate text-cream lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto flex min-h-full max-w-xl flex-col px-6 pt-6 pb-12">
          <ul>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-cream/15">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="sign flex items-center justify-between py-4 text-[2.4rem]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    {active && <span className="size-3 rounded-full bg-citrus" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 space-y-2 text-cream/85">
            <p className="font-semibold text-cream">{business.address.centre}</p>
            <p>
              {business.address.street}, {business.address.suburb} {business.address.state} {business.address.postcode}
            </p>
            <a
              href={business.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-2 pt-2 font-semibold text-cream"
            >
              <Icon name="instagram" /> {business.links.instagramHandle}
              <span className="sr-only">(opens Instagram in a new tab)</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
