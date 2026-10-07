<script lang="ts">
  import './layout.css';
  import { generateThemeCss } from '$lib/theme/contrast';

  let { data, children } = $props();

  let themeCss = $derived(
    generateThemeCss({
      colorBg: data.settings?.colorBg || '#F8FAFC',
      colorBrand: data.settings?.colorBrand || '#0A2540',
      colorAccent: data.settings?.colorAccent || '#F59E0B'
    })
  );
</script>

<svelte:head>
  <title>{data.settings?.siteName || 'FundCore'} - {data.settings?.tagline || 'Platform Donasi'}</title>
  <meta name="description" content="{data.settings?.tagline || 'Platform Penggalangan Dana & Donasi Cepat'}" />
  <link rel="icon" href="{data.settings?.faviconUrl || '/fundcore-logo.png'}" />
  {@html `<style id="fundcore-dynamic-theme">${themeCss}</style>`}
</svelte:head>

<div class="min-h-screen flex flex-col font-sans antialiased text-slate-800" style="background-color: var(--color-bg);">
  {@render children()}
</div>
