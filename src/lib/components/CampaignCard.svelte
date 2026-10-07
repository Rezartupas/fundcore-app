<script lang="ts">
  import { ShieldCheck, Users, Clock, Flame } from 'lucide-svelte';

  let { campaign } = $props<{
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
  }>();

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
  class="group block bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
>
  <!-- Cover Image Container -->
  <div class="relative w-full aspect-16/10 bg-slate-100 overflow-hidden">
    <img
      src={campaign.coverUrl}
      alt={campaign.title}
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    <!-- Category Pill -->
    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
        {campaign.category}
      </span>
      {#if campaign.isUrgent}
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs animate-pulse">
          <Flame class="w-3.5 h-3.5 fill-current" />
          Mendesak
        </span>
      {/if}
    </div>
  </div>

  <!-- Content Body -->
  <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
    <div>
      <!-- Beneficiary / Verified Label -->
      <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
        <span class="truncate max-w-[200px]">{campaign.beneficiaryName}</span>
        <ShieldCheck class="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span class="text-blue-700 font-semibold text-[11px]">Terverifikasi</span>
      </div>

      <!-- Campaign Title -->
      <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug mb-3">
        {campaign.title}
      </h3>
    </div>

    <!-- Progress & Financials -->
    <div class="pt-2 border-t border-slate-100">
      <!-- Progress Bar -->
      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
        <div
          class="h-full rounded-full transition-all duration-700 ease-out"
          style="width: {percent}%; background-color: var(--color-brand);"
        ></div>
      </div>

      <!-- Amount Row -->
      <div class="flex items-baseline justify-between mb-2">
        <div>
          <span class="text-xs text-slate-500 block">Terkumpul</span>
          <span class="text-sm sm:text-base font-bold text-slate-900">
            {formatRp(campaign.collectedAmount)}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500 block">Target</span>
          <span class="text-xs font-medium text-slate-600">
            {formatRp(campaign.targetAmount)}
          </span>
        </div>
      </div>

      <!-- Sisa Waktu & Donatur Row -->
      <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100/60 font-medium">
        <div class="flex items-center gap-1">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>Sisa <strong>{campaign.durationDays}</strong> hari</span>
        </div>
        <div class="flex items-center gap-1">
          <Users class="w-3.5 h-3.5 text-slate-400" />
          <span><strong>{campaign.donorCount}</strong> donatur</span>
        </div>
      </div>
    </div>
  </div>
</a>
