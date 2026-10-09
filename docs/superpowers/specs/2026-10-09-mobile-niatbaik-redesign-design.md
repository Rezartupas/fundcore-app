# Design: Mobile-First Niatbaik-Style Public UI

**Date:** 2026-10-09 | **Status:** approved | **Scope:** public pages only, big-bang

## 1. Goal

Public pages render in a phone-width column on all devices and follow the
niatbaik.id structure (hero slider, category icons, vertical campaign cards,
distribution reports, bottom nav). Admin is untouched.

## 2. Decisions (from brainstorming)

- Phone-width = centered `max-width: 480px` column, not a desktop block.
  Rationale: share links open on desktop too; SEO unaffected.
- Public pages only. Admin tables stay fully responsive.
- Follow niatbaik structure + components with FundCore branding (not a
  visual clone, not keeping the editorial/GSAP style).
- Bottom nav: Beranda (/), Campaign (/campaigns), Tentang (/tentang),
  Bantuan (WhatsApp CS link). No new auth/account pages.
- Big-bang in one pass (not phased, not hybrid).

## 3. Layout shell

- All public routes render inside a centered 480px column; desktop body
  gets a darker backdrop framing the column.
- Slim header: logo + site name from the theme engine (no floating pill).
- Fixed bottom nav inside the column (4 items above).
- Sticky Donasi button stays on campaign detail (PRD F-06).
- Remove from public pages: floating glass navbar, GSAP pinned-scroll,
  bento grid, editorial hero/footer. Uninstall GSAP if unreferenced
  (also recovers the PRD 9.1 JS budget).

## 4. Home (/)

Sections in niatbaik order, FundCore data:

1. Hero slider (urgent campaigns, CSS-only rotation, no heavy JS).
2. Donasi Sekarang CTA.
3. Category icon row (from campaign `category` values).
4. Campaign Pilihan (horizontal snap-scroll cards).
5. Trust strip "Kenapa donasi di sini" (PRD F-01).
6. Campaign Terbaru (vertical list + link to /campaigns).
7. Laporan Penyaluran (recent `campaign_updates`).
8. Footer: org legal (siteSettings) + social links.

Data flow, loaders, theme CSS variables, pricing/notify modules: unchanged.

## 5. Campaign card (shared component)

Vertical card: 16:9 image + category badge, bold collected amount,
2-line clamped title, fundraiser + verified badge, thin progress bar,
days left, donor count (progress bar kept per PRD F-02 even though the
reference omits it). One component used by home, /campaigns, and the
horizontal Pilihan rail.

## 6. New pages

- **/campaigns** (PRD F-03): category chip filter + sort
  (Terbaru/Mendesak/Hampir tercapai) + search, vertical list + Muat Lebih
  Banyak button. Client-side filtering over a single server load for MVP;
  cursor API recorded as future work.
- **/tentang** (PRD F-09 partial): org profile from siteSettings, static
  FAQ accordion (admin-managed FAQ = future, D-08), contact + WA link.

## 7. Detail / donate / status (minor)

- `/c/[slug]`: keep Cerita/Kabar/Donatur tabs, sticky donate bar, share
  (WA + copy link); restyle to clean cards in the column.
- `/c/[slug]/donate`, `/donation/status/[id]`, `/payment/simulate/*`:
  column fit + minor polish only. Flows and modules unchanged.

## 8. Non-goals

Admin pages, backend changes, new tables, syarat/privasi/biaya pages,
dark mode, admin-managed FAQ.

## 9. Testing & success criteria

- `vitest` stays green (no logic changes).
- Manual: 360px viewport, desktop-centered column, bottom nav on all
  public pages, filter/sort/search on /campaigns.
- Lighthouse mobile sanity, target ≥ 90 (no GSAP on public pages).
- Success: all-public phone-width, bottom-navigated, niatbaik-structured,
  admin untouched.
