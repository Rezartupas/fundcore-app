# FundCore Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, high-conversion donation crowdfunding web application with white-label theming (60/30/10 rule), Winpay checkout integration, WhatsApp (WAHA) notifications, and a complete admin monitoring dashboard.

**Architecture:** Fullstack SvelteKit application in a single unified codebase. SQLite locally via Drizzle ORM (swappable to PostgreSQL on Dokku VPS). Tailwind CSS with dynamic CSS variables for real-time white-label branding without rebuilds.

**Tech Stack:** SvelteKit 5, TypeScript, Tailwind CSS, Drizzle ORM, `@libsql/client`, Lucide Icons.

## Global Constraints

- **Language & Culture:** Indonesian UX copy, Rupiah currency formatting (`Rp 50.000`), mobile-first (360px viewport priority).
- **Brand Identity:** Default colors derived from FundCore logo:
  - 60% Background: `#F8FAFC` (Slate-50) & Surface `#FFFFFF`
  - 30% Brand: Deep Navy `#0A2540` & Sky Blue `#0284C7`
  - 10% Accent: Warm Amber / Gold `#F59E0B` (High-contrast WCAG AA verified CTA button)
- **Code Quality:** Zero placeholders (`TODO`/`TBD`). Type-safe TypeScript schemas, strict error handling, and unit test coverage on fee calculations and theming contrast checks.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`
- Create: `svelte.config.js`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/app.html`
- Create: `src/app.css`
- Copy/Create: `static/fundcore-logo.png` (from `./fundcore-logo.png`)
- Test: `tests/setup.test.ts`

**Interfaces:**
- Consumes: Node.js runtime and npm packages.
- Produces: Working SvelteKit dev server, Tailwind styling, and static asset pipeline.

- [ ] **Step 1: Initialize package.json and install dependencies**
Run commands to install SvelteKit, Vite, TypeScript, Tailwind CSS, `@libsql/client`, `drizzle-orm`, `drizzle-kit`, and `lucide-svelte`.
- [ ] **Step 2: Configure svelte.config.js, vite.config.ts, and tsconfig.json**
Setup SvelteKit with `@sveltejs/adapter-node` (or `@sveltejs/adapter-auto`) and Tailwind CSS.
- [ ] **Step 3: Setup app.html and app.css with 60/30/10 CSS Variables**
Define default CSS variables:
```css
:root {
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-brand: #0A2540;
  --color-brand-muted: #1E3A5F;
  --color-accent: #F59E0B;
  --color-accent-hover: #D97706;
}
```
- [ ] **Step 4: Copy fundcore-logo.png to static/ directory**
Ensure the logo asset is accessible by `/fundcore-logo.png` on the web app.
- [ ] **Step 5: Write initial setup smoke test and verify**
Run: `npm run check` or test command to ensure zero configuration errors.

---

### Task 2: Database Layer & Seed Data (Drizzle ORM)

**Files:**
- Create: `src/lib/server/db/schema.ts`
- Create: `src/lib/server/db/index.ts`
- Create: `src/lib/server/db/seed.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: `@libsql/client`, `drizzle-orm`.
- Produces: Database client `db`, schema tables (`siteSettings`, `campaigns`, `campaignUpdates`, `donations`, `waAccounts`, `waSettings`, `users`), and seed function.

- [ ] **Step 1: Write test for database operations**
Verify insertion, query, and relation reads on campaigns and donations.
- [ ] **Step 2: Define Drizzle schema in src/lib/server/db/schema.ts**
Define exact table columns for `site_settings`, `campaigns`, `campaign_updates`, `donations`, `wa_accounts`, `wa_settings`, and `fundraiser_applications`.
- [ ] **Step 3: Implement database connection in src/lib/server/db/index.ts**
Use local SQLite file `fundcore.db` using `@libsql/client`.
- [ ] **Step 4: Create realistic seed data in src/lib/server/db/seed.ts**
Seed 6 realistic donation campaigns (Medis, Bencana Alam, Pendidikan, Yatim Piatu), default FundCore brand settings, and sample donors with prayers.
- [ ] **Step 5: Run test and seed verification**
Run test to verify SQLite database initializes and queries return correct seeded rows.

---

### Task 3: White-Label Theme Engine & WCAG Contrast Validator

**Files:**
- Create: `src/lib/theme/contrast.ts`
- Create: `src/lib/theme/store.ts`
- Test: `tests/contrast.test.ts`

**Interfaces:**
- Consumes: Hex color strings.
- Produces: `calculateLuminance(hex)`, `getContrastRatio(hex1, hex2)`, `validateWcagAA(bg, text)`.

- [ ] **Step 1: Write failing unit test for WCAG contrast calculation**
Test contrast ratio calculation for `#FFFFFF` on `#0A2540` (≥ 4.5) and warning for low-contrast pairs.
- [ ] **Step 2: Implement contrast algorithms in src/lib/theme/contrast.ts**
Convert sRGB to relative luminance and compute `(L1 + 0.05) / (L2 + 0.05)`.
- [ ] **Step 3: Run test to verify contrast algorithms pass**
- [ ] **Step 4: Implement SSR dynamic CSS variable injector**
Ensure server layout injects `:root { --color-bg: ...; --color-brand: ...; --color-accent: ... }` directly into `<head>` to avoid flash of unstyled content (FOUC).

---

### Task 4: Public Web Pages (Home & Campaign Listing)

**Files:**
- Create: `src/routes/+layout.server.ts`
- Create: `src/routes/+layout.svelte`
- Create: `src/routes/+page.server.ts`
- Create: `src/routes/+page.svelte`
- Create: `src/lib/components/Navbar.svelte`
- Create: `src/lib/components/CampaignCard.svelte`
- Create: `src/lib/components/Footer.svelte`
- Test: `tests/public-pages.test.ts`

**Interfaces:**
- Consumes: `db.select().from(campaigns)`, `siteSettings`.
- Produces: Responsive homepage with hero banner, category filter pills, urgent campaign spotlight, and campaign grid.

- [ ] **Step 1: Write test for homepage data loading**
Ensure active campaigns are loaded, sorted by urgency and date.
- [ ] **Step 2: Build Navbar component with adaptive logo**
Display emblem on mobile (< 640px) and full FundCore logo lockup on desktop (≥ 640px). Include quick links: Beranda, Cari Campaign, dan Masuk Admin.
- [ ] **Step 3: Build CampaignCard component**
Image cover, category badge, title, verified fundraiser badge, custom progress bar, amount collected, remaining days, and donor count.
- [ ] **Step 4: Build Homepage (+page.svelte)**
Implement hero section, urgent highlights, category filter buttons, trust signals (legalitas yayasan & garansi 100% tepat sasaran), and footer.
- [ ] **Step 5: Run test and verify responsive rendering**

---

### Task 5: Campaign Detail Page & Prayer Feed

**Files:**
- Create: `src/routes/c/[slug]/+page.server.ts`
- Create: `src/routes/c/[slug]/+page.svelte`
- Create: `src/lib/components/DonorPrayerList.svelte`
- Create: `src/lib/components/StickyDonateBar.svelte`
- Test: `tests/campaign-detail.test.ts`

**Interfaces:**
- Consumes: Campaign slug, updates, donations with prayers.
- Produces: Detailed campaign page with Tab switcher (Cerita, Kabar Terbaru, Donatur & Doa), interactive "Aamiin" counter, and sticky mobile donate bar.

- [ ] **Step 1: Write test for campaign detail loader**
Verify valid slug returns campaign data, donor list, and updates; invalid slug returns 404.
- [ ] **Step 2: Build DonorPrayerList with interactive 'Aamiin' button**
List donors with name/anonymous label, relative time, amount, prayer quote, and click-to-aminkan reaction counter.
- [ ] **Step 3: Build StickyDonateBar**
Sticky fixed bottom container on mobile (`z-40`), showing collected amount progress and high-visibility "Donasi Sekarang" accent button.
- [ ] **Step 4: Build Campaign Detail Page (+page.svelte)**
Full story view, budget breakdown, updates accordion, and share buttons (WhatsApp share URL generator, Copy Link toast).
- [ ] **Step 5: Run tests and verify tab switching and interactions**

---

### Task 6: Instant Checkout Flow (<60s) & Donation API

**Files:**
- Create: `src/routes/c/[slug]/donate/+page.server.ts`
- Create: `src/routes/c/[slug]/donate/+page.svelte`
- Create: `src/routes/api/donations/+server.ts`
- Create: `src/lib/components/NominalChips.svelte`
- Test: `tests/checkout.test.ts`

**Interfaces:**
- Consumes: Campaign ID, nominal presets, donor inputs.
- Produces: `POST /api/donations` returning `{ success: true, donationId, invoiceUrl }`.

- [ ] **Step 1: Write failing test for donation creation API**
Test validation: amount >= 1000, valid WhatsApp phone format (08xx or 628xx), returns created donation with pending status.
- [ ] **Step 2: Implement NominalChips component**
Preset chips: Rp 10.000, Rp 25.000, Rp 50.000, Rp 100.000, Rp 250.000, and auto-formatting Rupiah input (`Intl.NumberFormat('id-ID')`).
- [ ] **Step 3: Implement Donation Checkout Page (+page.svelte)**
One-screen mobile checkout without login requirement. Form fields: Nominal, Checkbox "Donasi sebagai Hamba Allah", Nama Donatur, No. WhatsApp, Pesan Doa.
- [ ] **Step 4: Implement POST /api/donations server handler**
Insert donation record in `donations`, generate unique invoice ref, lock sticky CS WhatsApp account, calculate fees, return invoice redirect URL.
- [ ] **Step 5: Run test to verify API passes and returns valid redirect URL**

---

### Task 7: Winpay Payment Integration & Sandbox Simulator

**Files:**
- Create: `src/lib/server/payment/winpay.ts`
- Create: `src/routes/payment/simulate/[donationId]/+page.svelte`
- Create: `src/routes/webhooks/winpay/[secret]/+server.ts`
- Create: `src/routes/donation/status/[id]/+page.server.ts`
- Create: `src/routes/donation/status/[id]/+page.svelte`
- Test: `tests/winpay.test.ts`

**Interfaces:**
- Consumes: Donation invoice ref, payment channel callback payload.
- Produces: Idempotent webhook processing, status `paid`, atomic update to campaign `collectedAmount` and `donorCount`.

- [ ] **Step 1: Write test for net donation fee calculation**
Calculate `fee = gatewayFee + (amount * 0.05)`, verify `netAmount = amount - fee`.
- [ ] **Step 2: Implement Winpay client & fee calculator in winpay.ts**
Support invoice creation, signature verification, and callback processing.
- [ ] **Step 3: Implement interactive local simulator page (/payment/simulate/[donationId])**
Allows testing payment directly in the browser (Simulate QRIS / VA / E-Wallet payment with Success, Pending, or Expire buttons).
- [ ] **Step 4: Implement Webhook receiver /webhooks/winpay/[secret]**
Verify idempotency, update donation to `paid`, calculate fees, atomically increment campaign total, return text `ACCEPTED`.
- [ ] **Step 5: Build Thank You & Polling Page (/donation/status/[id])**
Auto-refresh status with progressive polling (5s, 10s, 20s), success celebration with share-to-WhatsApp link.
- [ ] **Step 6: Run tests and verify end-to-end payment state machine**

---

### Task 8: WhatsApp (WAHA) Notification Engine & Sticky CS Router

**Files:**
- Create: `src/lib/server/whatsapp/waha.ts`
- Create: `src/lib/server/whatsapp/templates.ts`
- Create: `src/lib/server/whatsapp/queue.ts`
- Test: `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: Donor phone, template type (`created`, `success`, `followup`), variables.
- Produces: Formatted message payload, sticky CS routing, logged notification.

- [ ] **Step 1: Write test for template variable interpolation & sticky CS routing**
Ensure `{nama}`, `{nominal}`, `{campaign}`, `{link_bayar}` are correctly substituted, and subsequent messages use the same assigned CS account.
- [ ] **Step 2: Implement template engine in src/lib/server/whatsapp/templates.ts**
Format currency in Rupiah, format dates, and parse placeholders.
- [ ] **Step 3: Implement WAHA client and sticky router in waha.ts**
Handle API call `POST /api/sendText`, capture status, and fallback to simulation mode when server is offline.
- [ ] **Step 4: Implement notification queue & logger in queue.ts**
Record sent messages in `wa_messages` table with timestamps and status.
- [ ] **Step 5: Run tests and verify message formatting and sticky routing**

---

### Task 9: Admin Dashboard: Overview & Executive Monitoring

**Files:**
- Create: `src/routes/admin/+layout.server.ts`
- Create: `src/routes/admin/+layout.svelte`
- Create: `src/routes/admin/+page.server.ts`
- Create: `src/routes/admin/+page.svelte`
- Create: `src/lib/components/admin/AdminSidebar.svelte`
- Create: `src/lib/components/admin/StatCard.svelte`
- Test: `tests/admin-overview.test.ts`

**Interfaces:**
- Consumes: Aggregated donation numbers, campaign statuses, conversion analytics.
- Produces: Executive dashboard with KPI summary cards, revenue trend charts, conversion funnel, and operational status.

- [ ] **Step 1: Write test for admin overview statistics query**
Ensure calculation of total gross, net funds, unique donors, today's donations, and conversion rate.
- [ ] **Step 2: Build AdminSidebar & Layout**
Clean navigation: Overview, Campaigns, Fundraisers, Donations, WhatsApp CS, Payment Gateway, Branding & Theme.
- [ ] **Step 3: Build StatCard & Metrics Grid**
Total Donasi Terkumpul, Total Donasi Bersih (Siap Disalurkan), Jumlah Donatur, Rata-rata Donasi.
- [ ] **Step 4: Build Visual Trends & Conversion Funnel**
SVG bar chart / line chart for weekly donations, and visual funnel: Kunjungan -> Checkout -> Donasi Lunas.
- [ ] **Step 5: Run tests and verify dashboard rendering**

---

### Task 10: Admin Dashboard: Campaign, Fundraiser & Donation Management

**Files:**
- Create: `src/routes/admin/campaigns/+page.server.ts`
- Create: `src/routes/admin/campaigns/+page.svelte`
- Create: `src/routes/admin/campaigns/new/+page.server.ts`
- Create: `src/routes/admin/campaigns/new/+page.svelte`
- Create: `src/routes/admin/fundraisers/+page.server.ts`
- Create: `src/routes/admin/fundraisers/+page.svelte`
- Create: `src/routes/admin/donations/+page.server.ts`
- Create: `src/routes/admin/donations/+page.svelte`
- Create: `src/routes/admin/api/export-donations/+server.ts`
- Test: `tests/admin-management.test.ts`

**Interfaces:**
- Consumes: Campaign records, fundraiser verification submissions, donations list.
- Produces: CRUD campaign, freeze/unfreeze actions, fundraiser approval, and CSV export.

- [ ] **Step 1: Write test for campaign freeze and fundraiser approval actions**
- [ ] **Step 2: Implement Campaign Management (+page.svelte & new/+page.svelte)**
Create campaign form (title, category, target, duration, cover image, story editor), table with actions (View, Freeze, Mark Complete).
- [ ] **Step 3: Implement Fundraiser Approval (+page.svelte)**
List pending verification applications, view submitted ID document, approve or reject buttons.
- [ ] **Step 4: Implement Donations List with CSV Export**
Search by donor name or invoice ref, filter by status, and one-click "Export CSV" endpoint (`/admin/api/export-donations`).
- [ ] **Step 5: Run tests to verify all admin management operations pass**

---

### Task 11: Admin Dashboard: White-Label Branding, WhatsApp & Winpay Settings

**Files:**
- Create: `src/routes/admin/theme/+page.server.ts`
- Create: `src/routes/admin/theme/+page.svelte`
- Create: `src/routes/admin/whatsapp/+page.server.ts`
- Create: `src/routes/admin/whatsapp/+page.svelte`
- Create: `src/routes/admin/payment/+page.server.ts`
- Create: `src/routes/admin/payment/+page.svelte`
- Test: `tests/admin-settings.test.ts`

**Interfaces:**
- Consumes: Current `site_settings`, `wa_accounts`, `wa_settings`.
- Produces: Interactive settings forms with live mobile theme preview, WCAG contrast alerts, WAHA test pinger, and Winpay credential manager.

- [ ] **Step 1: Write test for theme update action with contrast validation**
- [ ] **Step 2: Build White-Label Theme Customizer (theme/+page.svelte)**
Brand Name, Tagline, Logo URL, Color Pickers for 60% Base, 30% Brand Navy, 10% Accent Gold. Live interactive mobile preview iframe/frame and WCAG AA contrast badge.
- [ ] **Step 3: Build WhatsApp CS Manager (whatsapp/+page.svelte)**
Add/edit WAHA accounts, test connection button, edit notification templates with live variable preview.
- [ ] **Step 4: Build Payment Settings (payment/+page.svelte)**
Winpay API Key, Secret Key, Sandbox/Live toggle, and fee reference breakdown.
- [ ] **Step 5: Run test to verify settings persist and reflect across the platform**

---

### Task 12: End-to-End Verification, Performance Audit & Build Check

**Files:**
- Create: `tests/e2e-flow.test.ts`
- Modify: `package.json` (add test & check scripts)
- Test: All test suites

**Interfaces:**
- Consumes: Complete codebase.
- Produces: Passing test suites, zero TypeScript errors, clean production build `npm run build`.

- [ ] **Step 1: Write comprehensive end-to-end integration test**
Simulate donor browsing campaign -> initiating Rp 50.000 donation -> processing Winpay payment -> verifying campaign collected amount increments -> checking WhatsApp notification log.
- [ ] **Step 2: Run all test suites and fix any edge cases**
Run: `npm test`
- [ ] **Step 3: Run TypeScript typecheck and linter**
Run: `npm run check` or `npx svelte-check`
- [ ] **Step 4: Run production build check**
Run: `npm run build`
Ensure no compilation errors or missing assets.
- [ ] **Step 5: Final review and handoff**
Verify mobile responsiveness, logo clarity, contrast ratios, and complete feature coverage against PRD.
