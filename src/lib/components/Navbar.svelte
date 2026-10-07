<script lang="ts">
  import { Heart, Search, ShieldCheck, UserCheck, Menu, X } from 'lucide-svelte';

  let { settings } = $props<{
    settings: {
      siteName: string;
      logoUrl: string;
      colorBrand: string;
      colorAccent: string;
    };
  }>();

  let isMobileMenuOpen = $state(false);
</script>

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
    <!-- Brand / Logo -->
    <a href="/" class="flex items-center gap-3 group focus:outline-hidden">
      <div class="relative flex items-center justify-center">
        <!-- FundCore Logo image -->
        <img
          src={settings.logoUrl || '/fundcore-logo.png'}
          alt={settings.siteName}
          class="h-9 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    </a>

    <!-- Desktop Navigation Links -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
      <a href="/" class="text-slate-900 font-semibold hover:text-slate-900 transition-colors">Beranda</a>
      <a href="/#campaigns" class="hover:text-slate-900 transition-colors">Pilihan Donasi</a>
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
        class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-xs transition-all duration-200 active:scale-95"
        style="background-color: var(--color-brand);"
      >
        <Heart class="w-4 h-4 text-amber-400 fill-amber-400" />
        Bantu Sekarang
      </a>

      <!-- Mobile Hamburger Toggle -->
      <button
        onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
        class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
        aria-label="Buka Menu"
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
    <div class="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
      <a
        href="/"
        onclick={() => (isMobileMenuOpen = false)}
        class="block px-3 py-2 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-50"
      >
        Beranda
      </a>
      <a
        href="/#campaigns"
        onclick={() => (isMobileMenuOpen = false)}
        class="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50"
      >
        Pilihan Donasi
      </a>
      <a
        href="/#trust"
        onclick={() => (isMobileMenuOpen = false)}
        class="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50"
      >
        Transparansi & Legalitas
      </a>
      <a
        href="/admin"
        onclick={() => (isMobileMenuOpen = false)}
        class="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-blue-900 bg-blue-50"
      >
        <span>Dashboard Admin & Pengaturan</span>
        <ShieldCheck class="w-5 h-5 text-blue-600" />
      </a>
      <div class="pt-2">
        <a
          href="/#campaigns"
          onclick={() => (isMobileMenuOpen = false)}
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white shadow-xs"
          style="background-color: var(--color-brand);"
        >
          <Heart class="w-4 h-4 text-amber-400 fill-amber-400" />
          Mulai Berdonasi
        </a>
      </div>
    </div>
  {/if}
</header>
