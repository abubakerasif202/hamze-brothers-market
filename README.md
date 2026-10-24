# Hamze Brothers Fruit Market website

Website for **Hamze Brothers Fruit Market**, Guildford Plaza, 282 Guildford Road, Guildford NSW 2161. *Fresh. Local. Family.*

Built by [AB Web Studio](https://abwebstudio.com.au) with Next.js 16 (App Router, Turbopack), React 19, TypeScript and Tailwind CSS 4. All pages are statically prerendered. There's no backend, database or environment secret.

> **Status: client preview.** The site is hidden from search engines until the business approves launch. See [Launch switch](#launch-switch).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Introduction, directions (primary action), produce categories, juices, store imagery, specials, location, shopping-preview pitch |
| `/our-market` | About the market, using only facts the business has published |
| `/produce` | Fruit, vegetables, herbs & greens, fresh juices, pantry & deli, with example items |
| `/specials` | Date-driven specials board. Shows an Instagram prompt when nothing current is listed |
| `/visit` | Address, hours, holiday note, parking, directions, click-to-load map, Instagram contact |
| `/shop` | **Online Shopping Preview (demo only)**: catalogue, search, filters, product details, persistent demo basket, click-and-collect walkthrough |

## Local development

Requires Node.js 20.9+ and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Quality checks:

```bash
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint (next/core-web-vitals + TypeScript)
pnpm test           # Vitest unit tests (basket validation, hours, specials, collection slots)
pnpm build          # production build
pnpm check          # all of the above
pnpm format         # Prettier
```

## Deployment

The project deploys to Vercel with zero configuration (framework preset **Next.js**, install `pnpm install`, build `pnpm build`). Pushes to `main` deploy to production once the GitHub repository is connected to the Vercel project.

Optional environment variables (see `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Vercel production URL | Canonical URL for metadata, sitemap and structured data |
| `NEXT_PUBLIC_SITE_INDEXABLE` | unset (= hidden) | Launch switch, see below |
| `GOOGLE_PLACES_API_KEY` | unset | Server-only key for the live Google rating and reviews, see below |

### Launch switch

While `NEXT_PUBLIC_SITE_INDEXABLE` is not `true`:

- every page has `<meta name="robots" content="noindex, nofollow">`
- every response carries an `X-Robots-Tag: noindex, nofollow` header (`next.config.ts`)
- `/robots.txt` disallows all crawling

**To launch:** in Vercel → Project → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_INDEXABLE=true` and `NEXT_PUBLIC_SITE_URL=https://<final-domain>` for Production, then redeploy. Then submit `/sitemap.xml` in Google Search Console. Update the Google Business Profile website link too.

### Google rating and reviews

The home page ("What shoppers say") and the Visit page show the shop's **live** Google rating, review count and up to five reviews from its Google Maps listing (place ID in `business.googlePlaceId`).

- Data comes from Google Places API (New) through `/api/google-reviews` (`src/lib/google-reviews.ts`). It is fetched **at request time and never cached or stored**, as Google's Places policies require. It loads only when a visitor scrolls near the section.
- Reviews are shown unedited, in Google's "most relevant" order, with the reviewer's name, photo and profile link, a link to each review on Google Maps, a "Translated by Google" note where relevant, and "Google Maps" attribution. Nothing is filtered by star rating.
- The rating is **not** added to the structured data (Google doesn't allow third-party reviews to be used as self-serving review markup).
- **Until the key is added**, a hand-copied snapshot is shown instead: `src/content/google-reviews-snapshot.ts` (rating 5.0 from 8 reviews and four selected reviews, copied word for word on 25 Oct 2026, at the owner's request). The site labels it with that date. Keep it accurate or delete it; once the key is set the live data replaces it automatically. Note that Google's terms only allow review content to be shown live, so treat the snapshot as temporary.

**To switch it on** (needs a Google Cloud account with billing, chosen by the business or studio):

1. In Google Cloud Console, create or choose a project and enable **Places API (New)**.
2. Create an API key. Under *API restrictions*, allow **Places API (New)** only.
3. Under *Quotas* for Places API (New), set a daily request cap (e.g. 500/day) so costs stay bounded. Reviews and rating are billed as Place Details (Enterprise + Atmosphere); check current pricing and free usage.
4. In Vercel → Project → Settings → Environment Variables, add `GOOGLE_PLACES_API_KEY` for Production (and Preview if wanted), then redeploy.
5. Check `https://<site>/api/google-reviews` returns `"status":"ok"`.

## Updating content

All content lives in typed files under `src/content/`. Page layouts don't need to change for routine edits.

| What | File | Notes |
| --- | --- | --- |
| Name, address, hours, links, parking | `src/content/business.ts` | **Verified facts only.** Phone and email are `null` until the business supplies them. |
| Holiday / special trading hours | `business.hoursExceptions` | Add `{ date: "2026-12-25", label: "Christmas Day", closed: true }` or with `open`/`close`. The live "open now" status and the Visit page use these. Remove past entries. |
| Specials | `src/content/specials.ts` | Each special has `startDate`/`endDate` (inclusive, Sydney time). Expired specials hide automatically in the browser. Never re-post an old Instagram offer as current. |
| Produce categories and example items | `src/content/categories.ts` | Examples are labelled "seasonal availability varies". They are not a stock list. |
| Images and alt text | `src/content/images.ts` | Put new files in `public/images/…`, register them here and record the source in `IMAGE_SOURCES.md`. Use JPEGs about 1400–2000 px on the long edge. Next.js serves AVIF/WebP at the right size automatically. |
| Demo catalogue | `src/content/demo/products.ts` | Demonstration data only (see below). |

Add a special:

```ts
// src/content/specials.ts
export const specials: Special[] = [
  {
    id: "2026-11-white-grapes",
    title: "White grapes",
    price: "$2.99/kg",
    detail: "Or $25 per box",
    startDate: "2026-11-07",
    endDate: "2026-11-08",
    category: "fruit",
    conditions: "While stocks last",
  },
];
```

## Demonstration-only features

The **Online Shopping Preview** (`/shop`) exists to show the owners how online shopping and click-and-collect could work. It is labelled throughout:

- Products, sizes and prices are samples from `src/content/demo/products.ts`. Every price is marked **"Demo price"** and is **not** a Hamze Brothers price.
- The basket is stored only in the visitor's browser (`localStorage` key `hamze-demo-basket:v1`). Invalid or tampered data is discarded safely.
- The click-and-collect flow lets visitors choose an example collection window. The final step states that **nothing was ordered, sent or paid**. There's no checkout, no payment, no order confirmation and no personal-data collection.
- No contact form exists, because there's no verified destination for messages.

### Before enabling real commerce

1. Owner decision on the model: click-and-collect only, or delivery too (delivery areas, fees).
2. Real product data: ideally a feed from the POS / inventory system (names, units, prices, stock, GST), replacing `demo/products.ts`.
3. Rules for weight-based items (estimated vs. final price, substitutions).
4. Order destination and workflow: how staff receive, pick and mark orders ready (email, tablet dashboard, POS integration).
5. Payments: a provider account (e.g. Stripe or Square) in the business's name, plus refunds and pay-on-pickup policy.
6. Customer details and privacy: what's collected, a privacy policy, and terms of sale.
7. Real collection capacity per time window, cut-off times and holiday handling.
8. A server-side order API with validation and rate limiting (prices must be calculated on the server, never trusted from the browser).
9. Notifications (order received / ready) and an authenticated staff view.

## Information to confirm with the owners

- **Opening hours:** 8:00am–9:30pm, 7 days, matching both the Instagram bio and the Google Maps listing (checked 25 Oct 2026). Keep Google, Instagram and `business.ts` in sync when hours change.
- **Parking:** "parking available at the back of Guildford Plaza" comes from an Instagram post. Please confirm.
- Whether to switch on the live Google reviews (needs a Google Cloud key with billing, see above).
- Phone number and email, if they want them published.
- Holiday trading hours (Christmas, New Year, Easter, Eid).
- Original store photos and short videos (portrait clips under 30 s are ideal). The featured Instagram reel is linked rather than embedded, so no Instagram scripts or tracking load on the site.
- Whether the "Janerik from Young, NSW" note should stay year-round.

## Project structure

```
src/
  app/                # routes, metadata, sitemap.ts, robots.ts, icons
  components/         # header, footer, mobile action bar, map, specials, photo
    shop/             # shopping-preview UI (dialogs, basket, stepper, collect flow)
  content/            # typed content: business facts, categories, specials, images
    demo/             # demonstration-only catalogue
  lib/                # basket logic + store, Sydney time/hours, specials, slots, SEO
assets/brand/         # master logo (not served)
public/               # served images, logos, OG image
```

Image provenance: [IMAGE_SOURCES.md](./IMAGE_SOURCES.md).
