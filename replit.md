# GameDeals

A modern dark-mode web app for discovering the best video game deals across Steam, Epic Games, GOG, EA, and 30+ digital stores — powered by the CheapShark public API.

## Run & Operate

- `pnpm --filter @workspace/gamedeals run dev` — run the frontend dev server
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000, optional — not used by GameDeals frontend)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

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
  - `src/context/` — CurrencyContext, WishlistContext, RecentlyViewedContext
  - `src/hooks/` — useDeals, useGameDetail, useSearch, useStores
  - `src/services/cheapshark.ts` — all API calls (source of truth)
  - `src/types/index.ts` — shared TypeScript interfaces
  - `src/locales/en.ts` and `src/locales/es.ts` — translation strings
  - `src/lib/i18n.ts` — i18next initialization (imported first in main.tsx)
  - `vercel.json` — SPA rewrite rules + security headers for Vercel deployment

## Architecture decisions

- **No backend**: CheapShark is a public CORS-friendly API — no proxy needed. All data fetching happens client-side via TanStack Query with appropriate stale times.
- **Always dark mode**: `document.documentElement.classList.add("dark")` in main.tsx. `:root` vars are identical to `.dark` vars; no light mode toggle exists.
- **localStorage for persistence**: Wishlist, recently viewed, currency preference, and language are all persisted to localStorage — no server state needed.
- **Wishlist notifications**: "Below target" badge count is computed client-side each render from the wishlist items + their stored `targetPrice`.
- **Chunk splitting**: Vite build splits vendor libs into separate chunks (react, framer-motion, i18n, query, icons, router) for better caching on Vercel.

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
- `PORT` and `BASE_PATH` env vars are required by `vite.config.ts` — they are injected by the Replit workflow system
- Never use `pnpm run dev` at the workspace root — use `restart_workflow` instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- CheapShark API docs: https://apidocs.cheapshark.com/
