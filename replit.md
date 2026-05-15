# GameDeals

A modern dark-mode web app for discovering the best video game deals across Steam, Epic Games, GOG, EA, and 30+ digital stores — powered by the CheapShark public API.

## Run & Operate

- `pnpm --filter @workspace/gamedeals run dev` — run the frontend dev server
- `pnpm --filter @workspace/gamedeals run build` — typecheck + production build (outputs to `artifacts/gamedeals/dist/public`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7, Wouter routing, TanStack Query
- Styling: Tailwind CSS v4, Framer Motion animations
- i18n: i18next + react-i18next (EN / ES)
- Icons: Lucide React, React Icons (SI)
- API: CheapShark public API (`https://www.cheapshark.com/api/1.0`) — no key required
- No backend, no database, no auth — pure frontend SPA

## Where things live

- `artifacts/gamedeals/` — the main GameDeals frontend artifact
  - `src/pages/` — Home, AllDeals, GameDetail, SearchResults, Wishlist, not-found
  - `src/components/` — Navbar, Footer, DealCard, StoreBadge, SearchBar, WishlistButton, EmptyState, SkeletonCard, PriceDisplay
  - `src/components/ui/` — Only 5 shadcn components in use: button, skeleton, toast, toaster, tooltip
  - `src/context/` — CurrencyContext (localStorage), WishlistContext, RecentlyViewedContext
  - `src/hooks/` — useDeals, useGameDetail, useSearch, useStores, use-toast, use-mobile
  - `src/services/cheapshark.ts` — all API calls with AbortSignal support
  - `src/types/index.ts` — shared TypeScript interfaces
  - `src/locales/en.ts` and `src/locales/es.ts` — translation strings
  - `src/lib/i18n.ts` — i18next initialization (imported first in main.tsx)
  - `vercel.json` — SPA rewrites + cache/security headers for Vercel deployment (when deploying `artifacts/gamedeals` as root)
  - `public/site.webmanifest` — PWA manifest for mobile installation

## Vercel Deployment

### Option A — Deploy `artifacts/gamedeals` as root (simplest)
1. In Vercel, import the repo and set **Root Directory** to `artifacts/gamedeals`
2. Framework preset: **Vite**
3. Build command: `pnpm run build`
4. Output directory: `dist/public`
5. Install command: `pnpm install`

The `artifacts/gamedeals/vercel.json` will be picked up automatically for SPA routing and caching headers.

### Option B — Deploy from monorepo root
Vercel will use the root-level `vercel.json` which is already configured:
- Build command: `pnpm --filter @workspace/gamedeals run build`
- Output directory: `artifacts/gamedeals/dist/public`

### No environment variables required
This is a pure frontend SPA using the public CheapShark API. No API keys, no secrets, no `.env` files needed.

## Architecture decisions

- **No backend**: CheapShark is a public CORS-friendly API — no proxy needed. All data fetching happens client-side via TanStack Query with appropriate stale times.
- **Always dark mode**: `document.documentElement.classList.add("dark")` in main.tsx.
- **localStorage for persistence**: Wishlist, recently viewed, currency preference, and language are all persisted to localStorage.
- **Wishlist notifications**: "Below target" badge count is computed client-side each render from wishlist items + their stored `targetPrice`.
- **Chunk splitting**: Vite build splits vendor libs into separate chunks (react, framer-motion, i18n, query, icons, router) for optimal caching.
- **AbortSignal**: All API calls pass the TanStack Query signal for proper request cancellation on unmount/refetch.

## Production Bundle (after cleanup)
- CSS: 49.63 KB uncompressed / **8.57 KB gzipped** (was 108 KB — 54% reduction)
- JS: ~566 KB uncompressed / **~180 KB gzipped** (split into 7 chunks)
- Total gzipped transfer: ~189 KB

## Product

- **Home**: Hero featured deal, recently viewed carousel, top rated / trending / biggest discounts sections
- **All Deals**: Full paginated deal browser with store, genre, price, and sort filters
- **Game Detail**: Multi-store price comparison, screenshots, cheapest-ever price, wishlist button, recently-viewed tracking
- **Search**: Navbar autocomplete + full `/search` results page
- **Wishlist**: Save games, set target prices, visual badge when price drops below target
- **i18n**: English / Spanish with language switcher in navbar; persisted to localStorage

## User preferences

- Keep the existing architecture (frontend-only SPA, CheapShark API, no backend additions)
- Do not add authentication or databases
- Keep optimized for Vercel deployment
- Always-on dark mode (no light mode toggle)
- "Powered by 2BleA" in footer

## Gotchas

- `src/lib/i18n.ts` must be imported **first** in `main.tsx` (before App) to avoid i18next not-initialized errors
- Fonts are loaded via `<link>` in `index.html` — do NOT add `@import url(...)` to `index.css` (double-loading)
- `PORT` and `BASE_PATH` env vars are required by `vite.config.ts` — injected by the Replit workflow system (not needed on Vercel)
- Never use `pnpm run dev` at the workspace root — use `restart_workflow` instead
- Only 5 shadcn/ui components are used (button, skeleton, toast, toaster, tooltip). Do not add back the other ui/* files without also adding their Radix packages.

## Pointers

- CheapShark API docs: https://apidocs.cheapshark.com/
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
