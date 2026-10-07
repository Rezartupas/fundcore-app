<script lang="ts">
  import { Heart, Zap, Share2 } from 'lucide-svelte';

  let { campaign, onShare } = $props<{
    campaign: {
      slug: string;
      title: string;
      targetAmount: number;
      collectedAmount: number;
    };
    onShare: () => void;
  }>();

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }
</script>

<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 sm:hidden shadow-lg">
  <div class="flex items-center gap-3">
    <!-- Quick Share Button -->
    <button
      onclick={onShare}
      class="p-3 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all flex flex-col items-center justify-center shrink-0"
      aria-label="Bagikan Campaign"
    >
      <Share2 class="w-5 h-5 text-slate-600" />
    </button>

    <!-- Main Sticky CTA Donate Button -->
    <a
      href="/c/{campaign.slug}/donate"
      class="flex-1 inline-flex items-center justify-between px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-200 active:scale-95"
      style="background-color: var(--color-accent); color: var(--color-accent-text);"
    >
      <div class="flex items-center gap-2">
        <Heart class="w-4 h-4 fill-current" />
        <span>Donasi Sekarang</span>
      </div>
      <span class="text-[11px] font-medium opacity-90 flex items-center gap-1">
        <Zap class="w-3 h-3" />
        &lt; 60 Dtk
      </span>
    </a>
  </div>
</div>
