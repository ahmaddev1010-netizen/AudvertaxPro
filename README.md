# Foremint Homepage — High-Fidelity Reconstruction

A pixel-faithful Next.js (App Router + TypeScript) reconstruction of the **homepage** at
[foremint.pk](https://www.foremint.pk/), rebuilt with authorization from the site owner.

## What's included

Only the homepage is reproduced, section by section, in the same order as the live site:

1. **Fixed pill navigation** — glassmorphism nav bar, mega-menu style top-level items, mobile
   slide-in drawer.
2. **Hero** — gradient headline, purple grid/orb background, dual CTA buttons.
3. **VSL (video) section** — YouTube thumbnail facade that swaps to an embedded player on play.
4. **Problems & Solutions** — six tinted glass cards (marble icon, quote, solution copy).
5. **Services / Pricing** — Standard / Advanced (featured) / Custom plan cards.
6. **Dashboard preview** — browser-chrome frame around the real dashboard screenshot, plus a
   4-up feature grid.
7. **How it works** — 4-step numbered process.
8. **State Explorer** — interactive state picker (Wyoming, Delaware, New Mexico, Texas, Florida)
   with a live fee/renewal/first-year-cost calculator panel and package toggle.
9. **Testimonials** — two infinite CSS marquees (opposite direction, pause on hover) built from
   real founder testimonials and avatars.
10. **FAQ** — sticky-header accordion.
11. **Final CTA band** — solid purple section with grid + glow background.
12. **Footer** — five-column link grid, app-download band, social icons, partner badge,
    Trustpilot rating, legal copy.

Global/decorative pieces reconstructed to match the original's behavior:

- **Preloader** — animated 0→100% counter over a purple gradient before the page reveals.
- **Cursor glow** — a soft radial gradient that follows the pointer on hover-capable devices.
- **WhatsApp widget** — floating action button with pulsing ring and an expandable chat panel
  that opens a pre-filled `wa.me` link.

## Visual system

- **Fonts** (via `next/font/google`): Plus Jakarta Sans (headings), Manrope (body/UI),
  JetBrains Mono (labels/eyebrows), Caveat (handwritten accent), Bebas Neue (loaded for parity).
- **Color palette**: `#34078f` (deep violet), `#6a2fd6` (bright violet), `#15101f` (ink),
  `#645c73` (muted text), white glass surfaces with heavy `backdrop-blur`.
- **Assets**: the real logo, dashboard screenshot, founder avatar, and testimonial photos were
  downloaded directly from the live site and are served from `/public`.

## Getting started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

### Environment

This homepage clone doesn't require any external services or environment variables beyond the
standard `DATABASE_URL` used by the starter template's Drizzle/Postgres wiring (kept for
compatibility with the project scaffold, but unused by the homepage itself).

## Notes on fidelity

- Layout, spacing, typography scale, gradients, shadows, and border radii were reverse-engineered
  directly from the site's shipped CSS modules and rendered HTML.
- The State Explorer's interactive US map illustration and the Problems & Solutions section's
  scattered/rotated card canvas were reimplemented as responsive, accessible equivalents (grid
  layouts with rotation/hover transforms) since the original relies on absolute pixel coordinates
  tuned to a fixed canvas — the visual language (glass cards, marble icons, tints, hover lift) is
  preserved.
- FAQ question/answer copy is not present in the statically rendered markup (it's client-fetched
  on the live site), so representative, on-brand Q&A content was authored to match the site's
  tone and subject matter.
