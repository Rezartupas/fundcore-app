<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import CampaignCard from '$lib/components/CampaignCard.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import {
    Heart,
    Search,
    ShieldCheck,
    Zap,
    MessageCircle,
    Sparkles
  } from 'lucide-svelte';

  let { data } = $props();

  let selectedCategory = $state('Semua');
  let searchQuery = $state('');

  const categories = [
    'Semua',
    'Medis & Kesehatan',
    'Bencana Alam',
    'Pendidikan & Yatim',
    'Infrastruktur Pedesaan',
    'Lansia Dhuafa',
    'Kemanusiaan'
  ];

  let filteredCampaigns = $derived(
    data.campaigns.filter((c) => {
      const matchCategory =
        selectedCategory === 'Semua' || c.category === selectedCategory;
      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
  );

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }
</script>

<Navbar settings={data.settings} />

<main class="flex-1">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white border-b border-slate-100">
    <div class="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-900 text-xs sm:text-sm font-semibold mb-6">
        <Sparkles class="w-4 h-4 text-amber-500 fill-amber-500" />
        <span>Platform Donasi Cepat & Amanah</span>
      </div>

      <h1 class="font-display tracking-tight text-slate-900 leading-[1.12] text-3xl sm:text-5xl lg:text-6xl font-black max-w-4xl mx-auto">
        Salurkan Harapan, <span class="inline-block w-14 sm:w-20 h-7 sm:h-9 rounded-full align-middle mx-1.5 overflow-hidden border border-slate-200 shadow-inner align-baseline"><img src="/fundcore-logo.png" class="w-full h-full object-cover" alt="" /></span> Hadirkan Senyum Nyata
      </h1>

      <p class="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Salurkan donasi terpercaya dalam waktu kurang dari 60 detik tanpa wajib registrasi. Transparan dengan verifikasi relawan dan notifikasi langsung lewat WhatsApp.
      </p>

      <!-- Two High-Contrast CTAs -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <a
          href="#campaigns"
          class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-bold text-white shadow-md hover:opacity-95 transition-all duration-200 active:scale-95"
          style="background-color: var(--color-brand);"
        >
          <Heart class="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>Pilih Program Kebaikan</span>
        </a>
        <a
          href="#trust"
          class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <span>Pelajari Transparansi</span>
        </a>
      </div>

      <!-- Metrics Highlight Card -->
      <div class="mt-10 sm:mt-12 bg-white/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs max-w-2xl mx-auto grid grid-cols-3 gap-3 text-center sm:text-left">
        <div>
          <span class="text-xs font-semibold text-slate-600 block">Total Terkumpul</span>
          <span class="text-sm sm:text-lg font-bold text-slate-900 block truncate mt-0.5">
            {formatRp(data.stats.totalCollected)}
          </span>
        </div>
        <div class="border-x border-slate-200/80 px-2 sm:px-4">
          <span class="text-xs font-semibold text-slate-600 block">Donatur Dermawan</span>
          <span class="text-sm sm:text-lg font-bold text-slate-900 block truncate mt-0.5">
            {data.stats.totalDonors.toLocaleString('id-ID')}
          </span>
        </div>
        <div>
          <span class="text-xs font-semibold text-slate-600 block">Program Aktif</span>
          <span class="text-sm sm:text-lg font-bold text-slate-900 block truncate mt-0.5">
            {data.stats.totalCampaigns} Program
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Gapless Bento Grid Section -->
  <section id="campaigns" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
          Pilihan Program Kebaikan
        </h2>
        <p class="text-sm sm:text-base text-slate-600 mt-1.5">
          Pilih saudara yang ingin kamu bantu hari ini. Penyaluran terverifikasi dan amanah.
        </p>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari program atau nama pasien..."
          aria-label="Cari program donasi"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all shadow-xs min-h-[44px]"
        />
      </div>
    </div>

    <!-- Category Filter Pills (Horizontal Scrollable on Mobile) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
      {#each categories as cat}
        <button
          onclick={() => (selectedCategory = cat)}
          class="shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[40px] {selectedCategory === cat ? 'text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}"
          style={selectedCategory === cat ? 'background-color: var(--color-brand);' : ''}
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Campaign Grid -->
    {#if filteredCampaigns.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 grid-flow-dense">
        {#each filteredCampaigns as campaign, index (campaign.id)}
          <CampaignCard
            {campaign}
            featured={index === 0 && filteredCampaigns.length >= 3}
          />
        {/each}
      </div>
    {:else}
      <div class="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
        <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
          <Search class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Tidak ada program ditemukan</h3>
        <p class="text-sm text-slate-600 max-w-sm mx-auto mb-5 leading-relaxed">
          Coba ubah kata kunci pencarian atau pilih kategori lainnya.
        </p>
        <button
          onclick={() => {
            selectedCategory = 'Semua';
            searchQuery = '';
          }}
          class="min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          Reset Filter
        </button>
      </div>
    {/if}
  </section>

  <!-- Trust, Speed & Transparency Section (PRD F-01 & 6.7) -->
  <section id="trust" class="bg-white border-y border-slate-200 py-12 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
          Mengapa Berdonasi di {data.settings.siteName}?
        </h2>
        <p class="text-sm sm:text-base text-slate-600 mt-2">
          Kami mendesain alur donasi paling aman, transparan, dan tanpa hambatan bagi para dermawan.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <!-- Feature 1: Checkout Instan <60 dtk -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Zap class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 font-display">Donasi Selesai &lt; 60 Detik</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Tidak perlu registrasi akun atau isi form rumit. Cukup pilih nominal, isi nomor WhatsApp, dan bayar lewat QRIS atau Virtual Account seketika.
          </p>
        </div>

        <!-- Feature 2: WhatsApp Notification Real-time -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageCircle class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 font-display">Update Langsung via WhatsApp</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Link pembayaran invoice, bukti donasi berhasil, serta update kabar penyaluran dari pasien dikirim langsung ke WhatsApp Anda tanpa jeda.
          </p>
        </div>

        <!-- Feature 3: 100% Amanah & Transparansi Biaya -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 font-display">Transparansi 100% Terbuka</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Donatur membayar tepat nominal donasi. Biaya platform 5% dipotong transparan dari penyaluran untuk pemeliharaan sistem dan operasional relawan lapangan.
          </p>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer settings={data.settings} />
