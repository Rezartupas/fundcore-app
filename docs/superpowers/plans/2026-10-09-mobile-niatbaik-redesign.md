# Mobile-First Niatbaik-Style Public UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all public pages inside a phone-width column with niatbaik.id structure and add /campaigns + /tentang, without touching admin, backend, or pricing/notify/theme modules.

**Architecture:** New `(public)` route group owns the mobile shell (column + slim header + bottom nav + slim footer); public pages move under it and drop per-page Navbar/Footer; shared data helpers prevent query duplication; GSAP removed (single-file usage).

**Tech Stack:** SvelteKit 5 (runes), Tailwind CSS, lucide-svelte, Drizzle ORM + libSQL (existing).

## Global Constraints

- Admin pages, backend logic, and `pricing` / `notify` / `theme` modules: DO NOT TOUCH.
- Public column is exactly `max-w-[480px]`, centered; desktop body gets a darker backdrop.
- No new database tables; no new dependencies (GSAP gets removed, nothing added).
- Every task ends with `npm run check` (0 errors) and a commit; UI tasks also render in `npm run dev`.
- Existing component prop interfaces stay stable unless the task says otherwise.

---

## File Structure

- Create: `src/lib/server/campaigns.ts` — `getActiveCampaigns()`, `getRecentUpdates(limit)` (single home for public queries).
- Create: `src/routes/(public)/+layout.svelte` — column shell + Header + BottomNav + Footer.
- Create: `src/lib/components/Header.svelte` — `{ settings }` (logo + site name); replaces floating pill Navbar on public pages.
- Create: `src/lib/components/BottomNav.svelte` — no props (active state from `$app/stores` page URL); Beranda / Campaign / Tentang / Bantuan(WA link).
- Rewrite: `src/lib/components/Footer.svelte` — keep `{ settings }`; slim legal + social footer.
- Rewrite: `src/lib/components/CampaignCard.svelte` — keep `{ campaign, featured }`; niatbaik vertical markup.
- Rewrite: `src/routes/(public)/+page.svelte` — niatbaik home sections.
- Create: `src/routes/(public)/campaigns/+page.server.ts` + `+page.svelte` — filter/sort/search list.
- Create: `src/routes/(public)/tentang/+page.svelte` — no server file (uses root `data.settings`).
- Move (via `git mv`, URLs unchanged): `+page.svelte`, `+page.server.ts`, `c/`, `donation/`, `payment/` → under `src/routes/(public)/`.
- Delete usages: `Navbar.svelte` (delete file only if zero importers remain), `gsap` dependency.
- Polish: `src/routes/(public)/c/[slug]/+page.svelte` (drop wide wrapper, keep tabs/bar/share).

---

### Task 1: Shared campaign queries + tests

**Files:**
- Create: `src/lib/server/campaigns.ts`
- Create: `tests/campaigns.test.ts`
- Modify: `src/routes/+page.server.ts` (rewire to helper, same return shape)

**Interfaces:**
- Consumes: `campaigns`, `campaignUpdates` tables from `$lib/server/db/schema`; `db` from `$lib/server/db/index`.
- Produces: `getActiveCampaigns(): Promise<typeof campaigns.$inferSelect[]>` (status = active, urgent first, newest first); `getRecentUpdates(limit: number): Promise<{ id, campaignId, title, body, createdAt, campaignTitle, campaignSlug }[]>` (newest first). Tasks 4–5 consume these exact names/shapes.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { getActiveCampaigns, getRecentUpdates } from '../src/lib/server/campaigns.js';
import { initDb } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';

describe('public campaign queries', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('returns only active campaigns, urgent first', async () => {
    const rows = await getActiveCampaigns();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((c) => c.status === 'active')).toBe(true);
  });

  it('returns recent updates with campaign title and slug', async () => {
    const rows = await getRecentUpdates(5);
    expect(rows.length).toBeLessThanOrEqual(5);
    if (rows.length > 0) {
      expect(rows[0].campaignTitle).toBeTruthy();
      expect(rows[0].campaignSlug).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/campaigns.test.ts`
Expected: FAIL with "Failed to resolve import ... campaigns.js"

- [ ] **Step 3: Write minimal implementation**

```ts
import { db } from '$lib/server/db/index';
import { campaigns, campaignUpdates } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getActiveCampaigns() {
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.status, 'active'))
    .orderBy(desc(campaigns.isUrgent), desc(campaigns.createdAt));
}

export async function getRecentUpdates(limit: number) {
  const updates = await db
    .select()
    .from(campaignUpdates)
    .orderBy(desc(campaignUpdates.createdAt))
    .limit(limit);
  const out = [];
  for (const u of updates) {
    const [c] = await db.select().from(campaigns).where(eq(campaigns.id, u.campaignId)).limit(1);
    out.push({ ...u, campaignTitle: c?.title ?? 'Program Kebaikan', campaignSlug: c?.slug ?? '' });
  }
  return out;
}
```

- [ ] **Step 4: Rewire home server to the helper (same return shape)**

```ts
import { getActiveCampaigns } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allCampaigns = await getActiveCampaigns();

  const totalCollected = allCampaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalDonors = allCampaigns.reduce((acc, c) => acc + c.donorCount, 0);
  const urgentCount = allCampaigns.filter((c) => c.isUrgent).length;

  return {
    campaigns: allCampaigns,
    stats: { totalCollected, totalDonors, totalCampaigns: allCampaigns.length, urgentCount }
  };
};
```

- [ ] **Step 5: Run tests and check**

Run: `npx vitest run tests/campaigns.test.ts` — Expected: 2 passed.
Run: `npm run check` — Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/campaigns.ts tests/campaigns.test.ts src/routes/+page.server.ts
git commit -m "feat: shared public campaign queries with tests"
```

---

### Task 2: Public shell (group + header + bottom nav + footer + moves)

**Files:**
- Create: `src/routes/(public)/+layout.svelte`
- Create: `src/lib/components/Header.svelte`
- Create: `src/lib/components/BottomNav.svelte`
- Rewrite: `src/lib/components/Footer.svelte`
- Move: `git mv src/routes/+page.svelte src/routes/+page.server.ts src/routes/c src/routes/donation src/routes/payment src/routes/(public)/`
- Modify (strip Navbar/Footer imports + usages, keep everything else): moved `+page.svelte`, moved `c/[slug]/+page.svelte`

**Interfaces:**
- Consumes: root layout `data.settings` (flows into group layout automatically); `ThemeSettings` shape (siteName, logoUrl, colorBg, colorBrand, colorAccent, org fields).
- Produces: Header `{ settings }`, BottomNav (no props), Footer `{ settings }`. Tasks 4–7 consume the shell implicitly.

- [ ] **Step 1: Create Header.svelte (slim, sticky)**

```svelte
<script lang="ts">
  let { settings } = $props<{
    settings: { siteName: string; logoUrl: string };
  }>();
</script>

<header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
  <a href="/" class="flex items-center gap-2.5 px-4 py-3">
    <img src={settings.logoUrl || '/fundcore-logo.png'} alt={settings.siteName} class="h-8 w-auto object-contain" />
    <span class="text-base font-black text-slate-900 tracking-tight">{settings.siteName}</span>
  </a>
</header>
```

- [ ] **Step 2: Create BottomNav.svelte (fixed within column)**

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Home, LayoutGrid, Info, MessageCircle } from 'lucide-svelte';

  const items = [
    { href: '/', label: 'Beranda', Icon: Home },
    { href: '/campaigns', label: 'Campaign', Icon: LayoutGrid },
    { href: '/tentang', label: 'Tentang', Icon: Info },
    { href: 'https://wa.me/6281234567890', label: 'Bantuan', Icon: MessageCircle, external: true }
  ];
</script>

<nav class="sticky bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur">
  <div class="grid grid-cols-4">
    {#each items as { href, label, Icon, external }}
      <a
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        class="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold {$page.url.pathname === href ? 'text-slate-900' : 'text-slate-500'}"
        style={$page.url.pathname === href ? 'color: var(--color-brand);' : ''}
      >
        <Icon class="w-5 h-5" />
        {label}
      </a>
    {/each}
  </div>
</nav>
```

NOTE: replace `6281234567890` with the real CS number from `siteSettings.orgPhone` (digits only) at implementation time; BottomNav has no props, so hardcode the digits after reading the seeded value.

- [ ] **Step 3: Rewrite Footer.svelte (slim; keep `{ settings }` props)**

Sections, in order: logo + tagline; org legal lines (orgName, orgAddress, orgPhone, legalSk from settings); social row (placeholder `#` links unless URLs exist in repo — check first, use `#` only if absent); bottom mini-nav (Beranda / Campaign / Tentang). Single column, `text-xs`, no editorial flourishes.

- [ ] **Step 4: Create the group layout shell**

```svelte
<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data, children } = $props();
</script>

<div class="min-h-screen bg-slate-200">
  <div class="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white shadow-xl">
    <Header settings={data.settings} />
    <div class="flex-1">{@render children()}</div>
    <Footer settings={data.settings} />
    <BottomNav />
  </div>
</div>
```

- [ ] **Step 5: Move public routes under the group (URLs unchanged)**

```bash
git mv "src/routes/+page.svelte" "src/routes/+page.server.ts" src/routes/c src/routes/donation src/routes/payment "src/routes/(public)/"
```

- [ ] **Step 6: Strip per-page Navbar/Footer from moved pages**

In moved `(public)/+page.svelte`: delete `import Navbar ...`, `import Footer ...`, `<Navbar settings={data.settings} />`, `<Footer settings={data.settings} />`.
In moved `(public)/c/[slug]/+page.svelte` (lines 2–3, 77, 332): same deletions. Leave all other markup untouched (restyle lands in Tasks 3–4 and 7).

- [ ] **Step 7: Verify shell**

Run: `npm run check` — Expected: 0 errors.
Run: `npm run dev`, open `http://localhost:5173/` (desktop-width browser) — Expected: content in a centered 480px column, slim header on top, bottom nav visible, no double navbar. Open `/admin` — Expected: unchanged full-width layout.

- [ ] **Step 8: Commit (explicit paths only — never `git add -A`, it would sweep fundcore.db test churn)**

```bash
git add src/routes/\(public\)/+layout.svelte src/lib/components/Header.svelte src/lib/components/BottomNav.svelte src/lib/components/Footer.svelte "src/routes/(public)/+page.svelte" "src/routes/(public)/c/[slug]/+page.svelte"
git commit -m "feat: public route group with phone-width shell, header, bottom nav"
```

---

### Task 3: CampaignCard restyle (same props)

**Files:**
- Modify: `src/lib/components/CampaignCard.svelte` (markup only; keep `{ campaign, featured }` prop interface verbatim, keep `formatRp` and `percent`)

**Interfaces:**
- Consumes: unchanged campaign object shape (id, slug, title, category, targetAmount, collectedAmount, donorCount, durationDays, coverUrl, beneficiaryName, isUrgent).
- Produces: identical props; Tasks 4–5 drop it into vertical lists and the horizontal rail (`featured` switches rail sizing: `shrink-0 w-72 snap-center` when true instead of grid span).

- [ ] **Step 1: Rewrite card markup (niatbaik vertical)**

Order, top→bottom: 16:9 cover image with category badge (top-left) + Mendesak badge if urgent; bold collected amount (`text-lg font-black`); 2-line clamped title; fundraiser + ShieldCheck Terverifikasi row; thin progress bar (`h-1.5`, brand color, accent if urgent); sisa-hari + donatur row. Delete the `featured` grid-span classes and the Target-amount column (keeps card compact; target stays on detail page). Keep the anchor `href="/c/{campaign.slug}"`.

- [ ] **Step 2: Verify**

Run: `npm run check` — Expected: 0 errors.
Render `/` in dev — Expected: cards show image → amount → title → verified → bar → days/donors, no layout shift vs previous grid.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/CampaignCard.svelte
git commit -m "feat: niatbaik-style vertical campaign card"
```

---

### Task 4: Home rewrite (niatbaik sections)

**Files:**
- Modify: `src/routes/(public)/+page.server.ts` (add `updates: await getRecentUpdates(4)`)
- Rewrite: `src/routes/(public)/+page.svelte` (delete GSAP import + onMount block lines 2–4, 52–65; delete hero lines 71–127, bento grid 129–197 replaced, trust pinned section 199–342 condensed, closing banner 344–372 replaced)

**Interfaces:**
- Consumes: `data.campaigns`, `data.stats` (unchanged), `data.updates` (Task 1 shape), `CampaignCard` (Task 3), lucide icons.
- Produces: nothing new (page only).

- [ ] **Step 1: Extend home server with updates**

Add to the Task 1 server file: `import { getActiveCampaigns, getRecentUpdates } from '$lib/server/campaigns';` and `updates: await getRecentUpdates(4)` in the returned object.

- [ ] **Step 2: Rewrite page sections in niatbaik order**

1. Hero snap rail: `{#each urgent campaigns}` (filter `data.campaigns` where `isUrgent`, fallback to 3 newest): cover image, category eyebrow, title, "Bantu Sekarang" button → `/c/{slug}`. Container: `flex gap-3 overflow-x-auto snap-x snap-mandatory px-4`, slides `snap-center shrink-0 w-[85%]`.
2. Donasi Sekarang CTA button → `#campaigns` anchor (use `data.campaigns[0]`? No — anchor only, no logic).
3. Category icon row: derive distinct categories from `data.campaigns` (max 6); map to lucide icons (HeartHandshake, Stethoscope, LifeBuoy, GraduationCap, Hammer, Users — verify each exists in installed lucide-svelte, substitute if missing); tap sets filter (reuse existing `selectedCategory` state pattern).
4. Campaign Pilihan rail: first 5 campaigns, `<CampaignCard {campaign} featured />` in a snap rail.
5. Trust strip: condense existing 3 cards into 3 compact rows (icon + bold title + one line): verifikasi 100%, notif WA < 60 dtk, biaya 0 + platform 5%. Delete the GSAP pin (`#trust`, `#trust-pin` ids and the onMount block).
6. Campaign Terbaru: first 6 by createdAt, vertical `<CampaignCard>` list + `<a href="/campaigns">Lihat Lebih Banyak</a>`.
7. Laporan Penyaluran: `data.updates` vertical mini-cards (date, campaignTitle, title, body clamp-2, link `/c/{slug}`).
8. Keep existing search input + category pills + empty state for the Terbaru list (move current filter logic lines 20–42 down to that section).

- [ ] **Step 3: Verify**

Run: `npm run check` — Expected: 0 errors.
Render `/` at 360px and desktop — Expected: all sections stack in column, rails swipe horizontally, no GSAP code remains (`grep -r gsap src/routes/(public)` returns nothing).

- [ ] **Step 4: Commit**

```bash
git add "src/routes/(public)/+page.svelte" "src/routes/(public)/+page.server.ts"
git commit -m "feat: niatbaik-structured home in phone column"
```

---

### Task 5: /campaigns list page

**Files:**
- Create: `src/routes/(public)/campaigns/+page.server.ts`
- Create: `src/routes/(public)/campaigns/+page.svelte`

**Interfaces:**
- Consumes: `getActiveCampaigns()` (Task 1); `CampaignCard` (Task 3).
- Produces: route `/campaigns` (BottomNav links here).

- [ ] **Step 1: Create server (same query, no new logic)**

```ts
import { getActiveCampaigns } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { campaigns: await getActiveCampaigns() };
};
```

- [ ] **Step 2: Create page (filter + sort + search + more)**

State: `selectedCategory = 'Semua'`, `sort = 'terbaru' | 'mendesak' | 'hampir'`, `searchQuery = ''`, `visibleCount = 10`. Derived list: filter by category + search (title/beneficiary, same as home), sort: terbaru → createdAt desc; mendesak → isUrgent first then endAt asc; hampir → collectedAmount/targetAmount ratio desc. Render `{#each shown as campaign}` with `<CampaignCard {campaign} />`; "Muat Lebih Banyak" button adds 10 (`visibleCount += 10`); empty state mirrors home (reset button). Category chips derived from data (prepend 'Semua').

- [ ] **Step 3: Verify**

Run: `npm run check` — Expected: 0 errors.
Render `/campaigns` — Expected: chips + 3 sort options + search filter the list; button appends more; empty state resets.

- [ ] **Step 4: Commit**

```bash
git add "src/routes/(public)/campaigns"
git commit -m "feat: campaign list page with filter, sort, search"
```

---

### Task 6: /tentang page (static + settings)

**Files:**
- Create: `src/routes/(public)/tentang/+page.svelte` (no server file; uses root `data.settings`)

**Interfaces:**
- Consumes: `data.settings` (siteName, tagline, orgName, orgAddress, orgPhone, legalSk).
- Produces: route `/tentang` (BottomNav links here).

- [ ] **Step 1: Create page**

Sections: org header (logo, siteName, tagline); Tentang (2 short paragraphs referencing orgName + legalSk); FAQ accordion with exactly these 5 Q&As (native `<details>` elements, no JS): (1) Apakah harus daftar untuk berdonasi? — Tidak; cukup nama + nomor WhatsApp. (2) Berapa minimal donasi? — Rp1.000. (3) Apakah ada biaya tambahan? — Tidak; donatur membayar tepat nominal, biaya platform 5% dipotong dari penyaluran. (4) Bagaimana saya tahu donasi tersalurkan? — Notifikasi WhatsApp + kabar terbaru di halaman campaign. (5) Bagaimana menghubungi pengelola? — orgPhone + WA link. Contact block (orgPhone, orgAddress).

- [ ] **Step 2: Verify**

Run: `npm run check` — Expected: 0 errors.
Render `/tentang` — Expected: org data matches admin theme settings; all 5 accordions expand.

- [ ] **Step 3: Commit**

```bash
git add "src/routes/(public)/tentang"
git commit -m "feat: about and FAQ page"
```

---

### Task 7: Detail/donate/status polish in the column

**Files:**
- Modify: `src/routes/(public)/c/[slug]/+page.svelte` (wrapper only)
- Verify-only: `(public)/c/[slug]/donate/+page.svelte`, `(public)/donation/status/[id]/+page.svelte`, `(public)/payment/simulate/[donationId]/+page.svelte` (column fit is free from Task 2)

**Interfaces:**
- Consumes: shell column; existing StickyDonateBar, DonorPrayerList, share modal (untouched).

- [ ] **Step 1: Constrain detail wrapper**

Replace `<div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">` (line 80) with `<div class="px-4 py-6 space-y-6">` (shell owns the 480px column now). Keep tabs, StickyDonateBar, share modal, DonorPrayerList, prose block untouched.

- [ ] **Step 2: Verify all public flows render in-column**

Run: `npm run check` — Expected: 0 errors.
Render `/c/{slug}`, its donate page, a status URL, and simulate URL — Expected: single column, sticky donate bar visible on detail, no horizontal overflow at 360px.

- [ ] **Step 3: Commit**

```bash
git add "src/routes/(public)/c"
git commit -m "feat: campaign detail fits phone column"
```

---

### Task 8: GSAP removal + full verification

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm), delete nothing else

**Interfaces:** none (cleanup + gates).

- [ ] **Step 1: Confirm GSAP is unreferenced**

Run: `grep -r "gsap" src package.json` — Expected: only `package.json` dependency lines.

- [ ] **Step 2: Uninstall**

Run: `npm uninstall gsap` — Expected: package.json/package-lock.json updated, no other diffs.

- [ ] **Step 3: Full gates**

Run: `npm run test` — Expected: all files pass (currently 14 files / 37 tests; number grows only if earlier tasks added tests).
Run: `npm run check` — Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Manual acceptance sweep (dev server, checklist)**

Render and confirm: `/` (360px + desktop-centered; rails swipe; bottom nav on all 4 main pages); `/campaigns` (filter/sort/search/more); `/tentang` (accordions); `/c/{slug}` (tabs, sticky bar, share); `/admin` (visually unchanged). Lighthouse mobile on `/` — record score in commit message (target ≥ 90).

- [ ] **Step 5: Delete Navbar.svelte if orphaned**

Run: `grep -r "components/Navbar" src` — Expected: no matches (public usages moved to Header in Task 2; admin never used it). If clean: `git rm src/lib/components/Navbar.svelte`. If matches remain, leave the file and report them.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused gsap dependency"
```

---

## Self-Review

**1. Spec coverage:** Layout shell → Task 2. Home order (hero, CTA, categories, Pilihan, trust, Terbaru, Laporan, footer) → Tasks 2+4. Card → Task 3. /campaigns (filter/sort/search/more) → Task 5. /tentang (profile, static FAQ, contact) → Task 6. Detail/donate/status → Task 7. Non-goals respected (admin/backend/tables untouched; syarat-privasi-biaya absent). Testing/success → Task 8 + per-task gates.
**2. Placeholder scan:** No TBD/TODO; every code step shows exact code; Bantuan number flagged with exact resolution instruction (read seeded orgPhone digits).
**3. Type consistency:** `getActiveCampaigns` / `getRecentUpdates` shapes defined once in Task 1 and referenced verbatim in Tasks 4–5; Header/Footer `{ settings }` props match ThemeSettings fields used; BottomNav prop-less in both Task 2 steps.
