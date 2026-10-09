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
