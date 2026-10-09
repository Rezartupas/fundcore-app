<script lang="ts">
  import { ShieldCheck, Users, Clock, Flame } from 'lucide-svelte';

  let {
    campaign,
    featured = false
  }: {
    campaign: {
      id: string;
      slug: string;
      title: string;
      category: string;
      targetAmount: number;
      collectedAmount: number;
      donorCount: number;
      durationDays: number;
      coverUrl: string;
      beneficiaryName: string;
      isUrgent: boolean;
    };
    featured?: boolean;
  } = $props();

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  let percent = $derived(
    Math.min(100, Math.round((campaign.collectedAmount / (campaign.targetAmount || 1)) * 100))
  );
</script>

<a
  href="/c/{campaign.slug}"
  class="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 {featured ? 'shrink-0 w-72 snap-center' : ''}"
>
  <!-- Cover Image: 16:9 with badges -->
  <div class="relative w-full aspect-video bg-slate-100 overflow-hidden shrink-0">
    <img
      src={campaign.coverUrl}
      alt={campaign.title}
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs border border-slate-200/50">
        {campaign.category}
      </span>
      {#if campaign.isUrgent}
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs">
          <Flame class="w-3.5 h-3.5 fill-current" />
          Mendesak
        </span>
      {/if}
    </div>
  </div>

  <!-- Content Body: niatbaik vertical order -->
  <div class="p-4 flex-1 flex flex-col">
    <!-- Collected amount -->
    <span class="text-lg font-black text-slate-900">
      {formatRp(campaign.collectedAmount)}
    </span>

    <!-- Title: 2-line clamp -->
    <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug mt-1 mb-2 font-display">
      {campaign.title}
    </h3>

    <!-- Fundraiser + verified row -->
    <div class="flex items-center gap-1.5 text-xs mb-3 font-medium">
      <span class="truncate max-w-[200px] text-slate-600 font-semibold">{campaign.beneficiaryName}</span>
      <ShieldCheck class="w-3.5 h-3.5 text-blue-700 shrink-0" />
      <span class="text-blue-800 font-bold text-[11px]">Terverifikasi</span>
    </div>

    <!-- Thin progress bar -->
    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        style="width: {percent}%; background-color: {campaign.isUrgent ? 'var(--color-accent)' : 'var(--color-brand)'};"
      ></div>
    </div>

    <!-- Sisa hari + donatur row -->
    <div class="flex items-center justify-between text-xs text-slate-600 font-medium mt-auto">
      <div class="flex items-center gap-1">
        <Clock class="w-3.5 h-3.5 text-slate-500" />
        <span>Sisa <strong class="text-slate-900 font-semibold">{campaign.durationDays}</strong> hari</span>
      </div>
      <div class="flex items-center gap-1">
        <Users class="w-3.5 h-3.5 text-slate-500" />
        <span><strong class="text-slate-900 font-semibold">{campaign.donorCount}</strong> donatur</span>
      </div>
    </div>
  </div>
</a>
