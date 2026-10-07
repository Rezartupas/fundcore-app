<script lang="ts">
  import {
    HeartHandshake,
    PlusCircle,
    Flame,
    Lock,
    Unlock,
    CheckCircle,
    ExternalLink
  } from 'lucide-svelte';

  let { data } = $props();

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Kelola Program Campaign
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Pantau, aktifkan, atau bekukan program penggalangan dana aktif di platform.
      </p>
    </div>

    <a
      href="/admin/campaigns/new"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
    >
      <PlusCircle class="w-4 h-4" />
      <span>Buat Campaign Baru</span>
    </a>
  </div>

  <!-- Campaign Table Card -->
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
          <tr>
            <th class="py-3.5 px-4">Program</th>
            <th class="py-3.5 px-4">Kategori</th>
            <th class="py-3.5 px-4">Terkumpul / Target</th>
            <th class="py-3.5 px-4">Donatur</th>
            <th class="py-3.5 px-4">Status</th>
            <th class="py-3.5 px-4 text-right">Aksi Kelola</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each data.campaigns as c}
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <img
                    src={c.coverUrl}
                    alt={c.title}
                    class="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div class="min-w-0 max-w-xs">
                    <span class="font-bold text-slate-900 block truncate leading-tight">
                      {c.title}
                    </span>
                    <span class="text-[11px] text-slate-400 block truncate mt-0.5">
                      Penerima: {c.beneficiaryName}
                    </span>
                  </div>
                </div>
              </td>

              <td class="py-4 px-4 font-medium text-slate-600">
                <span class="inline-flex items-center gap-1">
                  {c.category}
                  {#if c.isUrgent}
                    <Flame class="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {/if}
                </span>
              </td>

              <td class="py-4 px-4 font-semibold text-slate-900">
                <span class="text-blue-900 font-bold block">{formatRp(c.collectedAmount)}</span>
                <span class="text-[11px] text-slate-400 font-normal">dari {formatRp(c.targetAmount)}</span>
              </td>

              <td class="py-4 px-4 font-bold text-slate-700">
                {c.donorCount} Orang
              </td>

              <td class="py-4 px-4">
                {#if c.status === 'active'}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Aktif
                  </span>
                {:else if c.status === 'frozen'}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-100">
                    Dibekukan
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {c.status}
                  </span>
                {/if}
              </td>

              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a
                    href="/c/{c.slug}"
                    target="_blank"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Buka Halaman Publik"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>

                  {#if c.status === 'active'}
                    <form method="POST" action="?/updateStatus" class="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="frozen" />
                      <button
                        type="submit"
                        class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                      >
                        Bekukan
                      </button>
                    </form>
                  {:else if c.status === 'frozen'}
                    <form method="POST" action="?/updateStatus" class="inline">
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value="active" />
                      <button
                        type="submit"
                        class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        Aktifkan
                      </button>
                    </form>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
