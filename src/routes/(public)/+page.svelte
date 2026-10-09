<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import CampaignCard from '$lib/components/CampaignCard.svelte';
  import {
    Heart,
    Search,
    ShieldCheck,
    Zap,
    MessageCircle,
    Sparkles,
    CheckCircle2
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

  onMount(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: '#trust',
          start: 'top top+=90',
          end: 'bottom bottom',
          pin: '#trust-pin'
        });
      });
      return () => ctx.revert();
    }
  });
</script>

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

  <!-- Trust, Speed & Transparency Section (GSAP Pinned Split Scroll) -->
  <section id="trust" class="py-16 sm:py-24 bg-white border-y border-slate-200/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <!-- Left Column (Pinned on desktop via GSAP) -->
        <div class="lg:col-span-5">
          <div id="trust-pin" class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold">
              <ShieldCheck class="w-4 h-4 text-emerald-600" />
              <span>Standar Akuntabilitas Tinggi</span>
            </div>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display leading-[1.15]">
              Komitmen Amanah & Transparansi 100%
            </h2>

            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kami menjaga setiap rupiah titipan para dermawan dengan sistem pelaporan akuntabel, verifikasi lapangan yang ketat, dan notifikasi langsung tanpa hambatan.
            </p>

            <!-- Quick trust indicators -->
            <div class="pt-4 space-y-3.5 border-t border-slate-100">
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 class="w-4 h-4" />
                </div>
                <div>
                  <span class="text-sm font-bold text-slate-900 block font-display">Legalitas Terdaftar</span>
                  <span class="text-xs text-slate-600 block mt-0.5">Resmi terdaftar di Kemenkumham & Dinsos untuk penyaluran donasi publik.</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <CheckCircle2 class="w-4 h-4" />
                </div>
                <div>
                  <span class="text-sm font-bold text-slate-900 block font-display">Laporan Real-Time</span>
                  <span class="text-xs text-slate-600 block mt-0.5">Notifikasi WhatsApp instan setiap kali donasi terverifikasi dan disalurkan.</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                  <CheckCircle2 class="w-4 h-4" />
                </div>
                <div>
                  <span class="text-sm font-bold text-slate-900 block font-display">Audit Berkala</span>
                  <span class="text-xs text-slate-600 block mt-0.5">Laporan keuangan terbuka dan diaudit secara berkala untuk menjaga amanah.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (3 cards scrolling vertically) -->
        <div class="lg:col-span-7 space-y-6 sm:space-y-8">
          <!-- Card 1 -->
          <div class="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div class="flex items-center justify-between gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800">
                Tahap 1: Validasi
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Verifikasi Medis & Kebutuhan Lapangan
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Setiap pasien atau penerima manfaat wajib melalui verifikasi rekam medis rumah sakit, identitas kependudukan, serta peninjauan langsung oleh relawan kami. Hanya program yang terbukti valid yang dipublikasikan.
            </p>
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Pemeriksaan Medis</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">100% Terverifikasi</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Survei Lapangan</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">Relawan Resmi</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div class="flex items-center justify-between gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <MessageCircle class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100/70 text-blue-800">
                Tahap 2: Notifikasi
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Update Notifikasi WhatsApp Otomatis
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Tidak perlu repot cek mutasi manual. Invoice pembayaran, konfirmasi donasi berhasil, hingga kabar perkembangan kondisi pasien dikirimkan langsung ke nomor WhatsApp Anda secara otomatis.
            </p>
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Kecepatan Notifikasi</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">&lt; 60 Detik Instan</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Laporan Pasien</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">Foto & Berita Terkini</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
            <div class="flex items-center justify-between gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Zap class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100/70 text-amber-800">
                Tahap 3: Penyaluran
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Transparansi Penyaluran & Biaya Platform
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Donatur membayar tepat sesuai nominal yang diinput tanpa markup tersembunyi. Biaya platform 5% dialokasikan secara terbuka untuk pemeliharaan server, audit kepatuhan, dan logistik relawan di lapangan.
            </p>
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Biaya Tambahan Donatur</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">Rp 0 (Nol Rupiah)</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span class="text-xs text-slate-600 block">Alokasi Platform</span>
                <span class="text-sm font-bold text-slate-900 block mt-0.5">5% Transparan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Closing Action Banner (Right before Footer) -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div class="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden text-center shadow-xl">
      <div class="relative z-10 max-w-2xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold">
          <Sparkles class="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Ayo Berbagi Kebaikan</span>
        </div>

        <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-white leading-tight">
          Satu Langkah Baikmu Menghadirkan Senyum Nyata
        </h2>

        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          Jangan tunda kesempatan berbagi. Ulurkan tanganmu hari ini untuk mereka yang sangat membutuhkan bantuan.
        </p>

        <div class="pt-2">
          <a
            href="#campaigns"
            class="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-400/20"
          >
            <Heart class="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>Mulai Donasi Sekarang</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>
