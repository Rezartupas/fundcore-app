# Task R3 Brief: Homepage Hero & Gapless Bento Grid

## Target Files
- `src/routes/+page.svelte`
- `src/lib/components/CampaignCard.svelte`

## Requirements

### 1. Hero Section in `src/routes/+page.svelte`
- Container: Ultra-wide container `max-w-5xl mx-auto text-center px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24`.
- H1 Design:
  - Font display: `font-display tracking-tight text-slate-900 leading-[1.12]`
  - Size clamp: `text-3xl sm:text-5xl lg:text-6xl font-black`
  - Maximum 2-3 lines of text.
  - Inline typography pill:
    `Salurkan Harapan, <span class="inline-block w-14 sm:w-20 h-7 sm:h-9 rounded-full align-middle mx-1.5 overflow-hidden border border-slate-200 shadow-inner align-baseline"><img src="/fundcore-logo.png" class="w-full h-full object-cover" alt="" /></span> Hadirkan Senyum Nyata`
- Subtitle:
  - Specific, honest, without buzzwords or em dashes:
    "Salurkan donasi terpercaya dalam waktu kurang dari 60 detik tanpa wajib registrasi. Transparan dengan verifikasi relawan dan notifikasi langsung lewat WhatsApp."
- Metrics Highlight Card:
  - 3 metrics derived directly from `data.stats`:
    1. Total Terkumpul: `{formatRp(data.stats.totalCollected)}`
    2. Donatur Dermawan: `{data.stats.totalDonors.toLocaleString('id-ID')}`
    3. Program Aktif: `{data.stats.totalCampaigns} Program`
  - Background `bg-white/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs max-w-2xl mx-auto grid grid-cols-3 gap-3 text-center sm:text-left`
- Two High-Contrast CTAs:
  - Tombol Utama: `href="#campaigns"`, label "Pilih Program Kebaikan", bg `var(--color-brand)`, text white, tap target >= 44px.
  - Tombol Sekunder: `href="#trust"`, label "Pelajari Transparansi", bg slate-100, text slate-800, border slate-200, tap target >= 44px.

### 2. Gapless Bento Grid in `src/routes/+page.svelte`
- Section id `#campaigns`:
  - Header: Title "Pilihan Program Kebaikan", Subtitle "Pilih saudara yang ingin kamu bantu hari ini. Penyaluran terverifikasi dan amanah."
  - Search Bar: Input dengan ikon Search, filter judul & beneficiaryName secara real-time.
  - Category Pills: Tombol filter horizontal (Semua, Medis, dll.), active state jelas.
  - Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 grid-flow-dense`
  - Featured item (if any) or first urgent card can span `sm:col-span-2 row-span-2` if layout permits, or interlocking cleanly so NO cells are left empty.
  - Empty State: Friendly empty search state with Reset button.

### 3. CampaignCard Component (`src/lib/components/CampaignCard.svelte`)
- Hover physics: `group hover:-translate-y-1 transition-all duration-300`
- Image aspect ratio 16:10 with `group-hover:scale-105 transition-transform duration-500`
- Clear category tag, duration countdown, donor count, verified badge.
- Progress bar with amber/brand styling.
- Zero em dashes (`—`).
- WCAG AA contrast for text.

## Verification
- Run `npm test` and `npm run check`.
- Ensure public pages test passes.
- Commit:
  `git add src/routes/+page.svelte src/lib/components/CampaignCard.svelte`
  `git commit -m "feat(ui): implement editorial hero and gapless bento grid"`
- Write report to `.superpowers/sdd/task-r3-report.md`.
