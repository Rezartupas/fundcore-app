<script lang="ts">
  import StatCard from '$lib/components/admin/StatCard.svelte';
  import {
    CircleDollarSign,
    HandHeart,
    Users,
    TrendingUp,
    ShieldAlert,
    PieChart,
    BarChart3,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Zap,
    Percent
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

<div class="space-y-8 max-w-7xl mx-auto">
  <!-- Title Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Monitoring Capaian Donasi
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Ringkasan eksekutif transaksi, dana bersih siap salur, dan efektivitas konversi donatur.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <a
        href="/admin/campaigns/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
      >
        + Buat Campaign Baru
      </a>
    </div>
  </div>

  <!-- Primary Stat Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <StatCard
      title="Total Donasi Bruto"
      value={formatRp(data.metrics.totalGross)}
      subtitle="{data.metrics.paidDonationCount} transaksi lunas terverifikasi"
      icon={CircleDollarSign}
      highlight={true}
    />

    <StatCard
      title="Dana Bersih Siap Salur"
      value={formatRp(data.metrics.totalNet)}
      subtitle="Setelah potongan 5% & fee gateway"
      icon={HandHeart}
    />

    <StatCard
      title="Donatur Unik"
      value="{data.metrics.uniqueDonorsCount} Orang"
      subtitle="Berdasarkan verifikasi nomor WhatsApp"
      icon={Users}
    />

    <StatCard
      title="Rata-rata Nominal"
      value={formatRp(data.metrics.averageDonation)}
      subtitle="Per transaksi donasi masuk"
      icon={TrendingUp}
    />
  </div>

  <!-- Secondary Metrics: Fee Transparency Bar -->
  <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
    <div>
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        Biaya Platform (5%)
      </span>
      <span class="text-xl font-black text-slate-900 mt-1 block">
        {formatRp(data.metrics.totalPlatformFee)}
      </span>
      <p class="text-[11px] text-slate-400 mt-0.5">Pemeliharaan server Dokku & operasional</p>
    </div>

    <div>
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        Biaya Gateway (Winpay)
      </span>
      <span class="text-xl font-black text-slate-900 mt-1 block">
        {formatRp(data.metrics.totalGatewayFee)}
      </span>
      <p class="text-[11px] text-slate-400 mt-0.5">MDR QRIS, Virtual Account, E-Wallet</p>
    </div>

    <div>
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">
        Status CS WhatsApp
      </span>
      <span class="text-xl font-black text-emerald-600 mt-1 block flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {data.operational.activeCsCount} / {data.operational.totalCsCount} Nomor Terhubung
      </span>
      <p class="text-[11px] text-slate-400 mt-0.5">Routing round-robin & sticky lock aktif</p>
    </div>
  </div>

  <!-- Funnel & Payment Breakdown Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Conversion Funnel Card -->
    <div class="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-blue-900" />
          Funnel Konversi Checkout Donatur
        </h3>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900">
          Mobile-First Target: ≥ 3.5%
        </span>
      </div>

      <div class="space-y-3 pt-2">
        <!-- Step 1: Kunjungan -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>1. Kunjungan Halaman Campaign</span>
            <span>100% (Estimasi)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-blue-900 h-full rounded-full" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Step 2: Mulai Checkout -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>2. Klik Tombol "Donasi Sekarang"</span>
            <span>24.8%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-blue-700 h-full rounded-full" style="width: 24.8%;"></div>
          </div>
        </div>

        <!-- Step 3: Donasi Dibuat -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>3. Pengisian Nominal & No. WhatsApp</span>
            <span>15.2%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-amber-500 h-full rounded-full" style="width: 15.2%;"></div>
          </div>
        </div>

        <!-- Step 4: Lunas Terbayar -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-emerald-800 mb-1">
            <span>4. Pembayaran Lunas (Sukses via Winpay)</span>
            <span class="font-bold">4.6% (Melampaui Target)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-emerald-600 h-full rounded-full" style="width: 4.6%;"></div>
          </div>
        </div>
      </div>

      <p class="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
        Pemberian opsi chip nominal cepat dan pembebasan login menghasilkan waktu checkout rata-rata <strong>42 detik</strong>.
      </p>
    </div>

    <!-- Distribution by Payment Channel -->
    <div class="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <PieChart class="w-4 h-4 text-blue-900" />
          Distribusi Metode Pembayaran
        </h3>
        <span class="text-xs text-slate-400">Total Transaksi Lunas</span>
      </div>

      <div class="space-y-4 pt-2">
        {#each data.channelBreakdown as ch}
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-semibold text-slate-700">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-900"></span>
                {ch.channel}
              </span>
              <span>{formatRp(ch.total)} ({ch.percentage}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-blue-900 h-full rounded-full"
                style="width: {ch.percentage}%;"
              ></div>
            </div>
          </div>
        {/each}
      </div>

      <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
        <Zap class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <span>QRIS mendominasi 70%+ volume donasi mobile karena kemudahan scan langsung dari aplikasi e-wallet / m-banking donatur.</span>
      </div>
    </div>
  </div>

  <!-- Top Performing Campaigns Table -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-slate-900">Top Program Berdasarkan Capaian</h3>
        <p class="text-xs text-slate-500 mt-0.5">Program dengan penghimpunan donasi tertinggi</p>
      </div>
      <a href="/admin/campaigns" class="text-xs font-bold text-blue-600 hover:text-blue-800">
        Lihat Semua Program &rarr;
      </a>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200/60">
          <tr>
            <th class="py-3 px-4">Judul Program</th>
            <th class="py-3 px-4">Kategori</th>
            <th class="py-3 px-4">Terkumpul / Target</th>
            <th class="py-3 px-4">Donatur</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each data.topCampaigns as c}
            <tr class="hover:bg-slate-50/80 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                {c.title}
              </td>
              <td class="py-3.5 px-4 text-slate-600 font-medium">
                {c.category}
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-900">
                <span>{formatRp(c.collectedAmount)}</span>
                <span class="text-slate-400 font-normal"> / {formatRp(c.targetAmount)}</span>
              </td>
              <td class="py-3.5 px-4 text-slate-700 font-bold">
                {c.donorCount} Orang
              </td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase {c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'}">
                  {c.status}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <a
                  href="/c/{c.slug}"
                  target="_blank"
                  class="font-bold text-blue-600 hover:text-blue-800"
                >
                  Detail &rarr;
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
