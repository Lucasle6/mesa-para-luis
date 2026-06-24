# Mesa para Luis — A Cooking Journal

A personal, **four-language** cuisine blog tracing single ideas across the whole
map of food — from night-market street stalls to the Michelin pass. Built with
Next.js, TypeScript, Tailwind CSS and Framer Motion.

> The blog name **“Mesa para Luis”** stays in Spanish in every language version.

> Designed with the **ui-ux-pro-max** + **frontend-design** skills. The visual
> direction deliberately avoids the common AI food-blog defaults (cream + Playfair
> + terracotta) in favour of a distinctive *minimal-modern editorial* system.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase URL + anon key
npm run dev                        # http://localhost:3000  (redirects to /es)
```

Other scripts:

```bash
npm run build    # production build (Next.js server app — deploy on Vercel)
npm run start    # serve the production build
npm run lint
```

## Database, accounts & admin (Supabase)

Recipes, blog posts and uploaded images can be managed by an **admin** user; all
other accounts are **read-only**.

- **Backend:** Supabase (Postgres + Auth with email/password + Storage). One-time
  setup is in [`SUPABASE-SETUP.md`](SUPABASE-SETUP.md); the schema + security
  policies live in [`supabase/schema.sql`](supabase/schema.sql).
- **Roles:** new sign-ups get the `reader` role automatically. Row-Level Security
  blocks every write unless the user is `admin` — enforced in the database, not
  just the UI. Promote yourself with the SQL snippet at the end of `schema.sql`.
- **Admin panel:** `/[locale]/admin` (guarded server-side) to create recipes and
  blog posts and upload images. The user menu (top-right of the nav) shows the
  signed-in account and links to the panel for admins.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (both public). Set them in `.env.local` for dev and in Vercel for production.

## Deploy (Vercel)

1. Push to GitHub (done) and import the repo at **vercel.com/new**.
2. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables.
3. Deploy. Every push to `main` redeploys automatically.

## Languages

| Locale | Language | Default |
| ------ | -------- | ------- |
| `es`   | Español  | ✅ default |
| `en`   | English  |   |
| `tr`   | Türkçe   |   |
| `de`   | Deutsch  |   |

- **Routing:** every page lives under `/[locale]/…` (`/es`, `/en`, `/tr`, `/de`).
  `middleware.ts` redirects `/` and any locale-less path to the visitor's
  preferred language (cookie → `Accept-Language` → `es`).
- **Switcher:** the globe control in the nav swaps the locale segment in place,
  stores the choice in a `NEXT_LOCALE` cookie, and keeps you on the same page.
- **Translations:** all UI strings **and** all recipe/cuisine content live in
  `messages/<locale>.json`. Language-neutral facts (slugs, images, times,
  servings, difficulty, technique level) stay in `lib/data.ts` and are merged
  with the localized text at render time.

> ⚠️ The Turkish and German translations are a solid first pass — have a native
> speaker review them before going live.

## Design system

| Token  | Value     | Role                       |
| ------ | --------- | -------------------------- |
| Ink    | `#1B1714` | warm near-black text       |
| Paper  | `#F6F3ED` | warm paper background      |
| Ember  | `#BF3B2B` | single chili-red accent    |
| Muted  | `#6B655C` | secondary text             |
| Line   | `#E3DDD2` | hairline borders           |

- **Type:** `Fraunces` (display), `Inter` (body/UI), `JetBrains Mono` (spec labels).
- **Signature elements:** a *Street → Pass* **technique scale** on every recipe,
  and a monospaced recipe **spec strip** (Time · Heat · Origin · Course).
- **Motion:** staggered scroll reveals, an orchestrated hero sequence, animated
  cuisine tabs, hover image zooms — all gated by `prefers-reduced-motion`.

## Routes

| Path                          | Description                                   |
| ----------------------------- | --------------------------------------------- |
| `/[locale]`                   | Home — hero, cuisine tabs, level concept, featured |
| `/[locale]/cuisines`          | All six cuisines                              |
| `/[locale]/cuisines/[slug]`   | A single cuisine and its recipes              |
| `/[locale]/recipes`           | Full index with search + cuisine/level filters + sort |
| `/[locale]/recipes/[slug]`    | Recipe detail — servings adjuster, ingredient checklist, step tracker, print |
| `/[locale]/about`             | About the journal                             |

## Project structure

```
app/[locale]/        # localized App Router pages + layout
app/globals.css      # design tokens + base styles
components/           # UI + interactive islands (incl. LanguageSwitcher)
lib/i18n.ts          # locales, default, getDictionary, interpolate
lib/dictionary.ts    # Dictionary type (UI + cuisines + recipes shape)
lib/data.ts          # language-neutral recipe/cuisine facts + localized builders
messages/{es,en,tr,de}.json   # all translatable content
middleware.ts        # locale detection + redirect
tailwind.config.ts   # design tokens
```

## Adding a recipe

1. Add a structural entry to `RECIPE_BASE` in `lib/data.ts`
   (slug, cuisine, level, time, servings, difficulty, image).
2. Add a `recipes.<slug>` block to **each** `messages/<locale>.json`
   (title, course, origin, excerpt, intro, ingredients, steps, tips, tags).

## Accessibility & quality floor

- Locale-aware `<html lang>`, visible keyboard focus, skip link, ARIA tabs +
  ARIA listbox language menu with keyboard support.
- `prefers-reduced-motion` respected globally and per component.
- Responsive from 375px up with no visible horizontal overflow; ≥4.5:1 contrast.
- All icons are inline SVG (no emoji icons). Photography via `next/image`.
