# Task 1 Brief: Project Scaffolding & Setup

**Project Context:**
FundCore is a mobile-first, high-conversion donation crowdfunding web application with white-label theming (60/30/10 rule).

**Task Goal:**
Scaffold SvelteKit project with TypeScript, Tailwind CSS, dependencies, and setup static asset for the FundCore logo (`fundcore-logo.png`).

**Files:**
- Create: `package.json`
- Create: `svelte.config.js`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/app.html`
- Create: `src/app.css`
- Copy/Create: `static/fundcore-logo.png` (copy from `./fundcore-logo.png`)
- Test: `tests/setup.test.ts`

**Steps:**
1. Initialize SvelteKit project with Vite, TypeScript, and `@sveltejs/adapter-auto` or `@sveltejs/adapter-node`.
2. Configure Tailwind CSS with `@tailwindcss/vite` or PostCSS.
3. Setup `src/app.css` defining the 60/30/10 root variables:
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
4. Copy `fundcore-logo.png` to `static/fundcore-logo.png`.
5. Install packages: `@libsql/client`, `drizzle-orm`, `drizzle-kit`, `lucide-svelte`, `clsx`, `tailwind-merge`.
6. Write test `tests/setup.test.ts` ensuring config and logo existence.
7. Run tests / checks and commit changes with message: `feat: scaffold SvelteKit project and asset setup`.
