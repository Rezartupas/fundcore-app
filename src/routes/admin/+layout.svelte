<script lang="ts">
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import { Menu, X, Shield, Bell } from 'lucide-svelte';
  import { page } from '$app/state';

  let { data, children } = $props();

  let isMobileNavOpen = $state(false);
</script>

<div class="min-h-screen bg-slate-100 flex">
  <!-- Desktop Sidebar -->
  <div class="hidden lg:block shrink-0">
    <AdminSidebar currentPath={page.url.pathname} siteName={data.settings?.siteName} />
  </div>

  <!-- Mobile Drawer Overlay -->
  {#if isMobileNavOpen}
    <div class="fixed inset-0 z-50 flex lg:hidden">
      <button
        type="button"
        aria-label="Tutup menu navigasi"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs w-full h-full cursor-default"
        onclick={() => (isMobileNavOpen = false)}
      ></button>
      <div class="relative z-10">
        <AdminSidebar currentPath={page.url.pathname} siteName={data.settings?.siteName} />
      </div>
    </div>
  {/if}

  <!-- Main Content Wrapper -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Top Bar Header -->
    <header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <button
          onclick={() => (isMobileNavOpen = !isMobileNavOpen)}
          class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Menu Admin"
        >
          <Menu class="w-6 h-6" />
        </button>
        <span class="text-sm font-bold text-slate-800">
          FundCore Central Control
        </span>
      </div>

      <div class="flex items-center gap-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Dokku VPS Online
        </span>
        <div class="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
          AD
        </div>
      </div>
    </header>

    <!-- Page Body -->
    <div class="flex-1 p-4 sm:p-8 overflow-y-auto">
      {@render children()}
    </div>
  </div>
</div>
