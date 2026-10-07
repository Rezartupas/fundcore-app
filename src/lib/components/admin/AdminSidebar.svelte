<script lang="ts">
  import {
    LayoutDashboard,
    HeartHandshake,
    PlusCircle,
    UserCheck,
    Receipt,
    MessageSquare,
    CreditCard,
    Palette,
    ExternalLink,
    Shield
  } from 'lucide-svelte';

  let { currentPath = '/admin', siteName = 'FundCore' } = $props<{
    currentPath?: string;
    siteName?: string;
  }>();

  const navItems = [
    { label: 'Overview Capaian', href: '/admin', icon: LayoutDashboard },
    { label: 'Kelola Campaign', href: '/admin/campaigns', icon: HeartHandshake },
    { label: 'Buat Campaign Baru', href: '/admin/campaigns/new', icon: PlusCircle },
    { label: 'Verifikasi Fundraiser', href: '/admin/fundraisers', icon: UserCheck },
    { label: 'Daftar Donasi & CSV', href: '/admin/donations', icon: Receipt },
    { label: 'Pengaturan WhatsApp', href: '/admin/whatsapp', icon: MessageSquare },
    { label: 'Pengaturan Gateway', href: '/admin/payment', icon: CreditCard },
    { label: 'Branding & Tema', href: '/admin/theme', icon: Palette }
  ];
</script>

<aside class="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
  <!-- Brand Header -->
  <div class="p-6 border-b border-slate-800/80 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-xs">
        FC
      </div>
      <div>
        <h2 class="font-black text-white text-base tracking-tight leading-none">{siteName}</h2>
        <span class="text-[11px] text-blue-400 font-medium">Executive Admin</span>
      </div>
    </div>
  </div>

  <!-- Navigation Menu -->
  <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
    {#each navItems as item}
      <a
        href={item.href}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all {currentPath === item.href ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
      >
        <item.icon class="w-4 h-4 shrink-0" />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- External Site Link -->
  <div class="p-4 border-t border-slate-800/80">
    <a
      href="/"
      target="_blank"
      class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors"
    >
      <span>Kunjungi Halaman Publik</span>
      <ExternalLink class="w-3.5 h-3.5" />
    </a>
  </div>
</aside>
