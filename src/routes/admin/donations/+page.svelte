<script lang="ts">
  import { Receipt, Download, Search, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-svelte';

  let { data } = $props();

  let filterStatus = $state('all');
  let searchQuery = $state('');

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  let filteredDonations = $derived(
    data.donations.filter((d) => {
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      const matchSearch =
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    })
  );
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Daftar Transaksi Donasi
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Catatan lengkap seluruh transaksi donasi, transparansi potongan biaya, dan status pembayaran.
      </p>
    </div>

    <!-- Export Button -->
    <a
      href="/admin/api/export-donations"
      download
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95"
    >
      <Download class="w-4 h-4" />
      <span>Export Data CSV</span>
    </a>
  </div>

  <!-- Filter & Search Toolbar -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
    <!-- Status Filter Buttons -->
    <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
      <button
        onclick={() => (filterStatus = 'all')}
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors {filterStatus === 'all' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
      >
        Semua ({data.donations.length})
      </button>
      <button
        onclick={() => (filterStatus = 'paid')}
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors {filterStatus === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
      >
        Lunas ({data.donations.filter((d) => d.status === 'paid').length})
      </button>
      <button
        onclick={() => (filterStatus = 'pending')}
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors {filterStatus === 'pending' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
      >
        Pending ({data.donations.filter((d) => d.status === 'pending').length})
      </button>
    </div>

    <!-- Search Input -->
    <div class="relative w-full sm:w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari donatur atau invoice..."
        class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
      />
    </div>
  </div>

  <!-- Donations Table -->
  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
          <tr>
            <th class="py-3.5 px-4">Invoice / Donatur</th>
            <th class="py-3.5 px-4">Program Tujuan</th>
            <th class="py-3.5 px-4">Nominal Donasi</th>
            <th class="py-3.5 px-4">Biaya Gateway</th>
            <th class="py-3.5 px-4">Platform (5%)</th>
            <th class="py-3.5 px-4">Dana Bersih</th>
            <th class="py-3.5 px-4">Metode</th>
            <th class="py-3.5 px-4">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each filteredDonations as d}
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4">
                <span class="font-mono font-bold text-slate-900 block">{d.invoiceRef}</span>
                <span class="text-[11px] text-slate-600 font-medium">{d.donorName} ({d.donorPhone})</span>
              </td>

              <td class="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                {d.campaignTitle}
              </td>

              <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">
                {formatRp(d.amount)}
              </td>

              <td class="py-3.5 px-4 text-slate-500">
                {formatRp(d.gatewayFee)}
              </td>

              <td class="py-3.5 px-4 text-slate-500">
                {formatRp(d.platformFee)}
              </td>

              <td class="py-3.5 px-4 font-bold text-emerald-700">
                {formatRp(d.netAmount)}
              </td>

              <td class="py-3.5 px-4 font-semibold text-slate-600">
                {d.channel || '-'}
              </td>

              <td class="py-3.5 px-4">
                {#if d.status === 'paid'}
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 class="w-3 h-3" />
                    Lunas
                  </span>
                {:else if d.status === 'pending'}
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock class="w-3 h-3" />
                    Pending
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
                    {d.status}
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
