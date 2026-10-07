# Task R5 Brief: Campaign Detail Page & Sticky Donate Bar

## Target Files
- `src/routes/c/[slug]/+page.svelte`
- `src/lib/components/StickyDonateBar.svelte`
- `src/lib/components/DonorPrayerList.svelte`

## Requirements

### 1. `src/routes/c/[slug]/+page.svelte`
- Layout & Container: `max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8`.
- Media Cover: Aspect 16:9 or 2:1 with `rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs`.
- Title & Header: `font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug`.
- Progress Card:
  - Collected amount: `text-2xl sm:text-4xl font-black text-slate-900 font-display`.
  - Target amount, percent progress bar with smooth transition.
  - Stats row: Donor count & Duration days remaining.
- Action Buttons (Desktop):
  - Primary button: "Donasi Sekarang (< 60 Detik)", background `var(--color-accent)` with high-contrast text, min 48px height.
  - Secondary button: "Bagikan", bg slate-100 text slate-800, min 48px height.
- Tabs: "Cerita Lengkap", "Kabar Terbaru ({data.updates.length})", "Donatur & Doa ({data.donations.length})".
- Story Body: Satoshi font, line-height relaxed, verification guarantee card.
- Share Modal: Keyboard accessible (Escape closes modal).
- Strict Antislop: zero em dashes (`—`), WCAG AA text contrast, real data only.

### 2. `src/lib/components/StickyDonateBar.svelte`
- Mobile sticky bar pinned to bottom: `fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-3 sm:hidden shadow-lg`.
- Tap target >= 44px:
  - Share button: min 44x44px.
  - Donasi Sekarang: min 48px height, high contrast background `var(--color-accent)` and text slate-900.

### 3. `src/lib/components/DonorPrayerList.svelte`
- Warm card styling with initial avatar or anonymous icon.
- Donor name, time ago, donation amount in Rp.
- Prayer text in comfortable readable font.
- Interactive "Aamiin ({d.prayerAmenCount})" button with clear focus and tap target.

## Verification
- Run `npm test` and `npm run check`.
- Verify `tests/campaign-detail.test.ts` passes.
- Commit:
  `git add src/routes/c/[slug]/+page.svelte src/lib/components/StickyDonateBar.svelte src/lib/components/DonorPrayerList.svelte`
  `git commit -m "feat(ui): elevate campaign detail page and interactive prayer feed"`
- Write report to `.superpowers/sdd/task-r5-report.md`.
