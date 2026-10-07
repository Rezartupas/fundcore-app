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
</script>

<div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-3 sm:hidden shadow-lg">
  <div class="flex items-center gap-3">
    <!-- Quick Share Button -->
    <button
      type="button"
      onclick={onShare}
      class="min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
      aria-label="Bagikan Campaign"
    >
      <Share2 class="w-5 h-5 text-slate-700" />
    </button>

    <!-- Main Sticky CTA Donate Button -->
    <a
      href="/c/{campaign.slug}/donate"
      class="flex-1 min-h-[48px] inline-flex items-center justify-between px-5 py-3 rounded-xl font-bold text-sm text-slate-900 shadow-md transition-all active:scale-95"
      style="background-color: var(--color-accent);"
    >
      <div class="flex items-center gap-2">
        <Heart class="w-4 h-4 fill-slate-900" />
        <span>Donasi Sekarang</span>
      </div>
      <span class="text-[11px] font-semibold text-slate-900/90 flex items-center gap-1">
        <Zap class="w-3.5 h-3.5 fill-slate-900" />
        &lt; 60 Detik
      </span>
    </a>
  </div>
</div>
