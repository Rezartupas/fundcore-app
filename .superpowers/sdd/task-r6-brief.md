# Task R6 Brief: Instant Checkout Flow & Nominal Chips

## Target Files
- `src/routes/c/[slug]/donate/+page.svelte`
- `src/lib/components/NominalChips.svelte`

## Requirements

### 1. `src/lib/components/NominalChips.svelte`
- Presets: Rp 10.000, Rp 25.000, Rp 50.000, Rp 100.000, Rp 250.000.
- Buttons min-height 44px (touch friendly).
- Active chip styling: High contrast border & background `var(--color-accent)`, bold text.
- Custom input:
  - Prepend `Rp` prefix.
  - Clean numeric formatting (id-ID).
  - Clear label and input field with 48px height.
  - Responsive warning if amount is under min.
- Zero em dashes (`—`).

### 2. `src/routes/c/[slug]/donate/+page.svelte`
- Card layout: `max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10`.
- Container card: `bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6`.
- Breadcrumb link back to campaign detail.
- Target campaign info box with cover thumbnail and title.
- Inputs:
  - Donor Name (optional if anonymous selected).
  - WhatsApp phone number (marked required with notice: "Untuk info bukti & link bayar").
  - Email (optional).
  - Doa / Prayer textarea (optional).
- Cost breakdown:
  - Nominal Donasi.
  - Biaya Tambahan Transaksi: Rp 0 (Gratis).
  - Total Pembayaran (highlighted).
- Submit button:
  - Label: "Lanjut Pembayaran {formatRp(nominal)}".
  - Min 48px height, tap target compliant.
  - Active / loading spinner state.
- Antislop: Zero em dashes (`—`), valid forms, WCAG AA contrast.

## Verification
- Run `npm test` and `npm run check`.
- Verify `tests/checkout.test.ts` passes.
- Commit:
  `git add src/routes/c/[slug]/donate/+page.svelte src/lib/components/NominalChips.svelte`
  `git commit -m "feat(ui): polish instant checkout flow and nominal chips"`
- Write report to `.superpowers/sdd/task-r6-report.md`.
