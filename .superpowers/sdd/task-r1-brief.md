# Task R1 Brief: Dependencies, Web Fonts & Base Editorial Styling

## Requirements
1. Install `gsap` dependency:
   ```bash
   npm install gsap
   ```
2. Update `src/app.html`:
   Add Google / Fontshare fonts link inside `<head>`:
   ```html
   <link rel="preconnect" href="https://api.fontshare.com">
   <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&f[]=satoshi@700,500,400&display=swap" rel="stylesheet" />
   ```
3. Update `src/routes/layout.css`:
   Define CSS custom properties:
   - `--font-display: 'Cabinet Grotesk', system-ui, sans-serif;`
   - `--font-sans: 'Satoshi', system-ui, sans-serif;`
   - Set `body { font-family: var(--font-sans); overflow-x: hidden; }`
   - Set `h1, h2, h3, .font-display { font-family: var(--font-display); }`
   - Preserve existing color variables (`--color-bg`, `--color-surface`, `--color-brand`, etc.)
4. Verification:
   Run `npm test` to ensure existing tests pass.
5. Commit:
   `git add package.json package-lock.json src/app.html src/routes/layout.css`
   `git commit -m "feat(ui): install gsap and configure editorial typography fonts"`
6. Write summary to `.superpowers/sdd/task-r1-report.md`.
