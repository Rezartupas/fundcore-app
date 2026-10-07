# Task R2 Brief: Floating Glass Navigation Bar

## Requirements
1. Update `src/lib/components/Navbar.svelte`:
   - Redesign as a modern floating glass pill:
     - Outer wrapper: `sticky top-3 sm:top-5 z-40 px-4 sm:px-6 max-w-6xl mx-auto`
     - Inner bar: `bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm flex items-center justify-between gap-4 transition-all`
   - Brand Logo: Keep `settings.logoUrl || '/fundcore-logo.png'` and `settings.siteName`, height `h-8 sm:h-9`.
   - Desktop Navigation Links:
     - "Beranda" -> `/`
     - "Pilihan Program" -> `/#campaigns`
     - "Transparansi" -> `/#trust`
     - "Panel Admin" -> `/admin` (badge pill styling)
   - Action Button:
     - "Bantu Sekarang" button with heart icon, min-height 40-44px, background `var(--color-brand)`, hover effects, accessible active states.
   - Mobile Navigation:
     - Clean dropdown/sheet attached to the pill navbar or floating beneath it.
     - Accessible toggle button with 44px tap target and `aria-expanded` and `aria-label="Menu navigasi"`.
     - Support Escape key to close menu.
   - Antislop Strict Checks:
     - Zero em-dashes (`—`).
     - Real anchor targets.
     - Text contrast meeting WCAG AA.
2. Verification:
   Run `npm test` and `npm run check`.
3. Commit:
   `git add src/lib/components/Navbar.svelte`
   `git commit -m "feat(ui): redesign navbar to floating glass pill with antislop compliance"`
4. Report to `.superpowers/sdd/task-r2-report.md`.
