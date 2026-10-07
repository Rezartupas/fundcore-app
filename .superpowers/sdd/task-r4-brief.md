# Task R4 Brief: GSAP Pinned Split Scroll for Transparency & Editorial Footer

## Target Files
- `src/routes/+page.svelte`
- `src/lib/components/Footer.svelte`

## Requirements

### 1. GSAP Pinned Split Scroll in `src/routes/+page.svelte`
- In `<script lang="ts">`, import `gsap` and `ScrollTrigger`:
  ```ts
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  onMount(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: '#trust',
          start: 'top top+=90',
          end: 'bottom bottom',
          pin: '#trust-pin'
        });
      });
      return () => ctx.revert();
    }
  });
  ```
- Section id `#trust`:
  - Outer: `py-16 sm:py-24 bg-white border-y border-slate-200/80`
  - Max container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
  - Grid: `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start`
  - Left column (`lg:col-span-5`):
    - Wrapped in `id="trust-pin"`
    - Heading: "Komitmen Amanah & Transparansi 100%"
    - Subheading: "Kami menjaga setiap rupiah titipan para dermawan dengan sistem pelaporan akuntabel, verifikasi lapangan yang ketat, dan notifikasi langsung tanpa hambatan."
    - Quick trust indicators (Legalitas Terdaftar, Laporan Real-Time, Audit Berkala).
  - Right column (`lg:col-span-7 space-y-6 sm:space-y-8`):
    - 3 cards scrolling vertically:
      1. Verifikasi Medis & Kebutuhan Lapangan
      2. Update Notifikasi WhatsApp Otomatis
      3. Transparansi Penyaluran & Biaya Platform
- Closing Action Section:
  - High-impact closing banner right before footer:
    - Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24`
    - Card: `rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden text-center`
    - Title: "Satu Langkah Baikmu Menghadirkan Senyum Nyata"
    - Subtitle: "Jangan tunda kesempatan berbagi. Ulurkan tanganmu hari ini untuk mereka yang sangat membutuhkan bantuan."
    - Button: `href="#campaigns"`, label "Mulai Donasi Sekarang", text amber/brand contrast, min 44px tap target.

### 2. Editorial Footer in `src/lib/components/Footer.svelte`
- Polish `Footer.svelte` with:
  - Font display for headings.
  - Organization name, legal SK (`settings.legalSk`), address (`settings.orgAddress`), phone (`settings.orgPhone`).
  - Strict Antislop compliance: zero em dashes (`—`), zero fake links.
  - Verified navigation links to `#campaigns`, `#trust`, `/admin`.

## Verification
- Run `npm test` and `npm run check`.
- Verify no console errors on load or scroll.
- Commit:
  `git add src/routes/+page.svelte src/lib/components/Footer.svelte`
  `git commit -m "feat(ui): add gsap pinned split scroll for transparency and editorial footer"`
- Write report to `.superpowers/sdd/task-r4-report.md`.
