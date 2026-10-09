<script lang="ts">
  import { page } from '$app/state';
  import { Home, LayoutGrid, Info, MessageCircle } from 'lucide-svelte';

  const items = [
    { href: '/', label: 'Beranda', Icon: Home },
    { href: '/campaigns', label: 'Campaign', Icon: LayoutGrid },
    { href: '/tentang', label: 'Tentang', Icon: Info },
    { href: 'https://wa.me/6281234567890', label: 'Bantuan', Icon: MessageCircle, external: true }
  ];
</script>

<nav class="sticky bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur">
  <div class="grid grid-cols-4">
    {#each items as { href, label, Icon, external }}
      <a
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        class="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold {page.url.pathname === href ? 'text-slate-900' : 'text-slate-500'}"
        style={page.url.pathname === href ? 'color: var(--color-brand);' : ''}
      >
        <Icon class="w-5 h-5" />
        {label}
      </a>
    {/each}
  </div>
</nav>
