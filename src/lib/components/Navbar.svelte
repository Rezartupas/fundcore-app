<script lang="ts">
  import { Heart, ShieldCheck, Menu, X } from 'lucide-svelte';

  let { settings } = $props<{
    settings: {
      siteName: string;
      logoUrl: string;
      colorBrand: string;
      colorAccent: string;
    };
  }>();

  let isMobileMenuOpen = $state(false);

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      isMobileMenuOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="sticky top-3 sm:top-5 z-40 px-4 sm:px-6 max-w-6xl mx-auto">
  <div class="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm flex items-center justify-between gap-4 transition-all">
    <!-- Brand / Logo -->
    <a href="/" class="flex items-center gap-3 group rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
      <div class="relative flex items-center justify-center">
        <img
          src={settings.logoUrl || '/fundcore-logo.png'}
          alt={settings.siteName}
          class="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    </a>

    <!-- Desktop Navigation Links -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
      <a href="/" class="text-slate-900 font-semibold hover:text-slate-900 transition-colors">Beranda</a>
      <a href="/#campaigns" class="hover:text-slate-900 transition-colors">Pilihan Program</a>
      <a href="/#trust" class="hover:text-slate-900 transition-colors">Transparansi</a>
      <a href="/admin" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
        <ShieldCheck class="w-3.5 h-3.5 text-blue-600" />
        Panel Admin
      </a>
    </nav>

    <!-- Right Actions -->
    <div class="flex items-center gap-2 sm:gap-3">
      <a
        href="/#campaigns"
        class="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] rounded-full text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        style="background-color: var(--color-brand);"
      >
        <Heart class="w-4 h-4 text-amber-400 fill-amber-400" />
        Bantu Sekarang
      </a>

      <!-- Mobile Hamburger Toggle -->
      <button
        type="button"
        onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
        class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors"
        aria-label="Menu navigasi"
        aria-expanded={isMobileMenuOpen}
      >
        {#if isMobileMenuOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if isMobileMenuOpen}
    <div class="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 shadow-lg flex flex-col gap-2 transition-all">
      <a
        href="/"
        onclick={() => (isMobileMenuOpen = false)}
        class="flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
      >
        Beranda
      </a>
      <a
        href="/#campaigns"
        onclick={() => (isMobileMenuOpen = false)}
        class="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        Pilihan Program
      </a>
      <a
        href="/#trust"
        onclick={() => (isMobileMenuOpen = false)}
        class="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        Transparansi
      </a>
      <a
        href="/admin"
        onclick={() => (isMobileMenuOpen = false)}
        class="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-blue-900 bg-blue-50/80 hover:bg-blue-100 transition-colors"
      >
        <span>Panel Admin</span>
        <ShieldCheck class="w-4 h-4 text-blue-600" />
      </a>
      <div class="pt-2">
        <a
          href="/#campaigns"
          onclick={() => (isMobileMenuOpen = false)}
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
          style="background-color: var(--color-brand);"
        >
          <Heart class="w-4 h-4 text-amber-400 fill-amber-400" />
          Bantu Sekarang
        </a>
      </div>
    </div>
  {/if}
</header>
