# Awwwards Editorial Humanist Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign FundCore public pages into an Awwwards-grade Editorial Humanist experience, featuring GSAP motion, gapless bento grid, ultra-wide hero with inline typography pills, while strictly abiding by Antislop guidelines (no em dash, WCAG AA, real data, no dead controls).

**Architecture:** SvelteKit 2 + Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`) paired with Tailwind CSS v4, web typography (Cabinet Grotesk & Satoshi), and GSAP ScrollTrigger for pinning and scroll choreography.

**Tech Stack:** SvelteKit 2, Svelte 5, Tailwind CSS v4, GSAP, Lucide Svelte, SQLite/Drizzle ORM.

## Global Constraints

- Tanpa karakter em dash (`—`) di seluruh teks UI (R-02 antislop). Gunakan koma, titik dua, atau tanda kurung.
- Kontras warna teks memenuhi standar WCAG AA (R-25, minimal 4.5:1 untuk teks standar).
- Seluruh elemen interaktif memiliki aksi nyata atau destinasi valid (R-24, R-26, C-2).
- Data angka dan capaian 100% menggunakan metrik riil dari props/database (R-17, R-36, C-5).
- Responsif penuh di mobile tanpa overflow horizontal (`overflow-x: hidden`), tap target minimal 44x44px (R-03).
- Semua pengujian unit dan integrasi (`npm test`) harus tetap 100% lulus.

---

### Task 1: Dependencies, Web Fonts & Base Editorial Styling

**Files:**
- Modify: `package.json`
- Modify: `src/app.html`
- Modify: `src/routes/layout.css`
- Test: `tests/setup.test.ts`

- [ ] **Step 1: Install gsap dependency**

Run:
```bash
npm install gsap
```

- [ ] **Step 2: Update `src/app.html` to include web fonts**

Load Satoshi and Cabinet Grotesk from CDN (Fontshare):
```html
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&f[]=satoshi@700,500,400&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Update `src/routes/layout.css`**

Add font family tokens and smooth scrolling styles:
```css
@import 'tailwindcss';

:root {
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-brand: #0A2540;
  --color-brand-muted: #1E3A5F;
  --color-brand-light: #E0F2FE;
  --color-accent: #F59E0B;
  --color-accent-hover: #D97706;
  --font-display: 'Cabinet Grotesk', system-ui, sans-serif;
  --font-sans: 'Satoshi', system-ui, sans-serif;
}

body {
  background-color: var(--color-bg);
  color: #0F172A;
  font-family: var(--font-sans);
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
}

h1, h2, h3, .font-display {
  font-family: var(--font-display);
}
```

- [ ] **Step 4: Run test to verify build and basic setup**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/app.html src/routes/layout.css
git commit -m "feat(ui): install gsap and configure editorial typography fonts"
```

---

### Task 2: Floating Glass Navigation Bar

**Files:**
- Modify: `src/lib/components/Navbar.svelte`
- Test: `tests/public-pages.test.ts`

- [ ] **Step 1: Inspect and update `Navbar.svelte`**

Redesign into a floating pill navigation bar with:
- Glass pill container (`backdrop-blur-md bg-white/90 border border-slate-200/80 rounded-full px-5 py-3 shadow-xs`).
- Brand logo with text.
- Navigation links to real sections (`#program`, `#transparansi`, `/admin`).
- Quick CTA button to `#program`.
- Mobile drawer accessible via keyboard.

- [ ] **Step 2: Verify tests**

Run: `npm run test:unit -- tests/public-pages.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Navbar.svelte
git commit -m "feat(ui): redesign navbar to floating glass pill with antislop compliance"
```

---

### Task 3: Homepage Hero & Gapless Bento Grid

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/lib/components/CampaignCard.svelte`
- Test: `tests/public-pages.test.ts`

- [ ] **Step 1: Redesign Hero Section in `src/routes/+page.svelte`**

Implement:
- Ultra-wide container (`max-w-5xl mx-auto`).
- H1 limited to 2-3 lines max with inline pill image:
  `Salurkan Harapan, <span class="inline-block w-16 sm:w-20 h-7 sm:h-9 rounded-full align-middle mx-1.5 overflow-hidden border border-slate-200 shadow-inner"><img src="/fundcore-logo.png" class="w-full h-full object-cover" alt="" /></span> Hadirkan Senyum Nyata`
- 2 high-contrast CTAs ("Pilih Program Donasi" ke `#program` dan "Pelajari Transparansi" ke `#transparansi`).
- Metric highlights directly from `data.stats`.

- [ ] **Step 2: Implement Gapless Bento Grid for Programs**

In `src/routes/+page.svelte`:
- Category pills with horizontal scroll and clean border.
- Real-time search query filter.
- Grid with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense`.
- First card (urgent or featured) spans `md:col-span-2 lg:col-span-2 row-span-2` for editorial hierarchy.

- [ ] **Step 3: Enhance `src/lib/components/CampaignCard.svelte`**

- Hover physics (`group-hover:scale-[1.02] transition-transform duration-300`).
- Progress bar, sisa hari, verified fundraiser badge.
- Tap target >= 44px.

- [ ] **Step 4: Run tests**

Run: `npm run test:unit -- tests/public-pages.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/CampaignCard.svelte
git commit -m "feat(ui): implement editorial hero and gapless bento grid"
```

---

### Task 4: GSAP Pinned Split Scroll for Transparency & Editorial Footer

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/lib/components/Footer.svelte`
- Test: `tests/public-pages.test.ts`

- [ ] **Step 1: Implement GSAP Pinned Split Scroll in `+page.svelte`**

Import GSAP and ScrollTrigger:
```ts
import { onMount } from 'svelte';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

onMount(() => {
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: '#transparansi',
      start: 'top top+=80',
      end: 'bottom bottom',
      pin: '#transparansi-pin'
    });
  }
});
```
Section `#transparansi`:
- Kiri (`lg:col-span-5`): Title & commitment pinned card.
- Kanan (`lg:col-span-7`): 3 vertical transparency cards with real details.

- [ ] **Step 2: Redesign `Footer.svelte`**

Editorial footer with:
- Brand identity & license statement.
- Links to verified sections.
- Zero AI-slop 4-column fake links.

- [ ] **Step 3: Run test**

Run: `npm run test:unit -- tests/public-pages.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/Footer.svelte
git commit -m "feat(ui): add gsap pinned split scroll for transparency and editorial footer"
```

---

### Task 5: Campaign Detail Page & Sticky Donate Bar

**Files:**
- Modify: `src/routes/c/[slug]/+page.svelte`
- Modify: `src/lib/components/StickyDonateBar.svelte`
- Modify: `src/lib/components/DonorPrayerList.svelte`
- Test: `tests/campaign-detail.test.ts`

- [ ] **Step 1: Redesign `src/routes/c/[slug]/+page.svelte`**

- Editorial header: Large aspect 16:9 photo cover with rounded-3xl.
- Progress card: target, nominal terkumpul, persentase, total donatur.
- Story container: Satoshi typography, readable line-height, verified fundraiser pill.

- [ ] **Step 2: Polish `DonorPrayerList.svelte` & `StickyDonateBar.svelte`**

- Prayer cards: Warm quote formatting, real timestamps, no em dash.
- Sticky donate bar: Floating bottom bar, tap target 48px, high contrast CTA.

- [ ] **Step 3: Run tests**

Run: `npm run test:unit -- tests/campaign-detail.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/c/[slug]/+page.svelte src/lib/components/StickyDonateBar.svelte src/lib/components/DonorPrayerList.svelte
git commit -m "feat(ui): elevate campaign detail page and interactive prayer feed"
```

---

### Task 6: Instant Checkout Flow & Nominal Chips

**Files:**
- Modify: `src/routes/c/[slug]/donate/+page.svelte`
- Modify: `src/lib/components/NominalChips.svelte`
- Test: `tests/checkout.test.ts`

- [ ] **Step 1: Polish `NominalChips.svelte`**

- Chip buttons with clear active state (`text-slate-900 border-amber-500 bg-amber-50/60 font-bold`).
- Touch-friendly 44px min-height.

- [ ] **Step 2: Polish `src/routes/c/[slug]/donate/+page.svelte`**

- Clean step-by-step layout without unnecessary clutter.
- Real-time Rp formatting.
- Instant feedback on submit.

- [ ] **Step 3: Run checkout tests**

Run: `npm run test:unit -- tests/checkout.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/c/[slug]/donate/+page.svelte src/lib/components/NominalChips.svelte
git commit -m "feat(ui): polish instant checkout flow and nominal chips"
```

---

### Task 7: Full Test Suite Verification, Contrast & Antislop Delivery Gate

**Files:**
- Test: `tests/*.test.ts`
- Audit: Antislop Delivery Gate verification

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: All 11 test suites PASS

- [ ] **Step 2: Run svelte-check & build**

Run: `npm run check; if ($?) { npm run build }`
Expected: Build succeeds with 0 errors

- [ ] **Step 3: Produce Antislop Delivery Gate Report**

Verify Block 1 (Hard Gate), Block 2 (Purpose Gate), Block 3 (Liveliness), Block 4 (Craftsmanship).
Ensure zero em dashes, zero fake data, full responsiveness.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore(release): complete awwwards editorial redesign with antislop delivery gate pass"
```
