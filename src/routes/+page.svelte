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
    CheckCircle2,
    ArrowRight,
    TrendingUp,
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

  const urgentHero = $derived(data.campaigns.find((c) => c.isUrgent) || data.campaigns[0]);
</script>

<Navbar settings={data.settings} />

<main class="flex-1">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-white border-b border-slate-100 py-8 sm:py-16 lg:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- Hero Text & Value Props -->
        <div class="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-900 text-xs sm:text-sm font-semibold">
            <Sparkles class="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Platform Donasi Cepat & Amanah</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Setiap Kebaikan Kecil <br class="hidden sm:inline" />
            <span class="text-blue-900">Menghadirkan Senyum Nyata</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Salurkan bantuan terbaikmu dalam waktu kurang dari 60 detik tanpa wajib registrasi. Pembayaran terintegrasi QRIS & Virtual Account dengan notifikasi update WhatsApp.
          </p>

          <!-- Quick Metric Highlights -->
          <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-2 text-left">
            <div class="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-[11px] sm:text-xs font-medium text-slate-500 block">Terkumpul</span>
              <span class="text-sm sm:text-lg font-bold text-slate-900 block truncate">
                {formatRp(data.stats.totalCollected)}
              </span>
            </div>
            <div class="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-[11px] sm:text-xs font-medium text-slate-500 block">Donatur</span>
              <span class="text-sm sm:text-lg font-bold text-slate-900 block">
                {data.stats.totalDonors.toLocaleString('id-ID')}
              </span>
            </div>
            <div class="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-[11px] sm:text-xs font-medium text-slate-500 block">Campaign</span>
              <span class="text-sm sm:text-lg font-bold text-slate-900 block">
                {data.stats.totalCampaigns} Program
              </span>
            </div>
          </div>

          <!-- Hero Action CTA -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="#campaigns"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white shadow-md transition-all duration-200 active:scale-95"
              style="background-color: var(--color-brand);"
            >
              <Heart class="w-5 h-5 text-amber-400 fill-amber-400" />
              Pilih Campaign Donasi
            </a>
            <a
              href="#trust"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Pelajari Transparansi
            </a>
          </div>
        </div>

        <!-- Hero Spotlight Card (Urgent) -->
        {#if urgentHero}
          <div class="lg:col-span-5">
            <div class="bg-gradient-to-b from-blue-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
                  <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  Kebutuhan Mendesak
                </span>
                <span class="text-xs text-blue-200 font-medium">Batas Waktu {urgentHero.durationDays} Hari</span>
              </div>

              <div class="rounded-2xl overflow-hidden aspect-16/10 mb-4 bg-slate-800">
                <img
                  src={urgentHero.coverUrl}
                  alt={urgentHero.title}
                  class="w-full h-full object-cover"
                />
              </div>

              <h2 class="text-lg sm:text-xl font-bold leading-snug mb-3 line-clamp-2">
                {urgentHero.title}
              </h2>

              <!-- Progress -->
              <div class="space-y-2 mb-5">
                <div class="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style="width: {Math.min(100, Math.round((urgentHero.collectedAmount / urgentHero.targetAmount) * 100))}%;"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-xs text-blue-100">
                  <span>Terkumpul: <strong>{formatRp(urgentHero.collectedAmount)}</strong></span>
                  <span>Target: {formatRp(urgentHero.targetAmount)}</span>
                </div>
              </div>

              <!-- Button to Donate -->
              <a
                href="/c/{urgentHero.slug}"
                class="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-slate-900 shadow-md transition-all active:scale-95"
                style="background-color: var(--color-accent);"
              >
                Donasi Sekarang
                <ArrowRight class="w-4 h-4" />
              </a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- Campaign Explorer Section -->
  <section id="campaigns" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pilihan Program Kebaikan
        </h2>
        <p class="text-sm sm:text-base text-slate-600 mt-1">
          Pilih saudara yang ingin kamu bantu hari ini. 100% tersalurkan tepat sasaran.
        </p>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-72">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari campaign atau pasien..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Category Filter Pills (Horizontal Scrollable on Mobile) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 no-scrollbar scroll-smooth">
      {#each categories as cat}
        <button
          onclick={() => (selectedCategory = cat)}
          class="shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 {selectedCategory === cat ? 'text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}"
          style={selectedCategory === cat ? 'background-color: var(--color-brand);' : ''}
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Campaign Grid -->
    {#if filteredCampaigns.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {#each filteredCampaigns as campaign (campaign.id)}
          <CampaignCard {campaign} />
        {/each}
      </div>
    {:else}
      <div class="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
        <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Search class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Tidak ada campaign ditemukan</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto mb-4">
          Coba ubah kata kunci pencarian atau pilih kategori lainnya.
        </p>
        <button
          onclick={() => {
            selectedCategory = 'Semua';
            searchQuery = '';
          }}
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
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
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
          <h3 class="text-lg font-bold text-slate-900">Donasi Selesai &lt; 60 Detik</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Tidak perlu registrasi akun atau isi form rumit. Cukup pilih nominal, isi nomor WhatsApp, dan bayar lewat QRIS atau Virtual Account seketika.
          </p>
        </div>

        <!-- Feature 2: WhatsApp Notification Real-time -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageCircle class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Update Langsung via WhatsApp</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Link pembayaran invoice, bukti donasi berhasil, serta update kabar penyaluran dari pasien dikirim langsung ke WhatsApp Anda tanpa jeda.
          </p>
        </div>

        <!-- Feature 3: 100% Amanah & Transparansi Biaya -->
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Transparansi 100% Terbuka</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Donatur membayar tepat nominal donasi. Biaya platform 5% dipotong transparan dari penyaluran untuk pemeliharaan sistem dan operasional relawan lapangan.
          </p>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer settings={data.settings} />
