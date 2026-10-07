<script lang="ts">
  import { Sparkles, User, MessageCircleHeart } from 'lucide-svelte';

  let { donations = [], onAmen } = $props<{
    donations: Array<{
      id: string;
      donorName: string;
      amount: number;
      isAnonymous: boolean;
      prayer: string | null;
      prayerAmenCount: number;
      createdAt: string;
    }>;
    onAmen?: (donationId: string) => void;
  }>();

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  function formatRelativeTime(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari lalu`;
  }
</script>

<div class="space-y-4">
  {#if donations.length === 0}
    <div class="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-100">
      <MessageCircleHeart class="w-10 h-10 text-slate-400 mx-auto mb-2" />
      <p class="text-sm font-semibold text-slate-700">Belum ada donasi terdata</p>
      <p class="text-xs text-slate-500 mt-1">Jadilah orang baik pertama yang berdonasi dan mendoakan campaign ini!</p>
    </div>
  {:else}
    {#each donations as d (d.id)}
      <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <!-- Header: Donor Avatar & Name & Amount -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-900 border border-blue-200/70 shrink-0">
              {#if d.isAnonymous}
                <User class="w-5 h-5 text-blue-800" />
              {:else}
                {d.donorName.charAt(0).toUpperCase()}
              {/if}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-900">
                  {d.isAnonymous ? 'Hamba Allah' : d.donorName}
                </span>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80">
                  Donatur
                </span>
              </div>
              <span class="text-xs text-slate-500 font-medium">
                {formatRelativeTime(d.createdAt)}
              </span>
            </div>
          </div>

          <!-- Nominal Tag -->
          <div class="text-right">
            <span class="text-xs text-slate-500 block">Berdonasi</span>
            <span class="text-sm font-bold text-slate-900">
              {formatRp(d.amount)}
            </span>
          </div>
        </div>

        <!-- Prayer Text -->
        {#if d.prayer}
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            "{d.prayer}"
          </div>
        {/if}

        <!-- Interactive Aamiin Action -->
        {#if d.prayer}
          <div class="flex items-center justify-between pt-1">
            <button
              type="button"
              onclick={() => onAmen?.(d.id)}
              class="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles class="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
              <span>Aamiin ({d.prayerAmenCount})</span>
            </button>
            <span class="text-xs text-slate-500 font-medium">
              {d.prayerAmenCount} orang mengaminkan
            </span>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>
