<script lang="ts">
  import CampaignCard from '$lib/components/CampaignCard.svelte';
  import {
    Heart,
    Search,
    ShieldCheck,
    MessageCircle,
    Zap,
    HeartHandshake,
    Stethoscope,
    LifeBuoy,
    GraduationCap,
    Hammer,
    Users
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

  const categoryIcons = [HeartHandshake, Stethoscope, LifeBuoy, GraduationCap, Hammer, Users];

  let urgentCampaigns = $derived(data.campaigns.filter((c) => c.isUrgent));
  let heroSlides = $derived(
    urgentCampaigns.length > 0 ? urgentCampaigns : data.campaigns.slice(0, 3)
  );

  let distinctCategories = $derived(
    [...new Set(data.campaigns.map((c) => c.category))].slice(0, 6)
  );

  let pilihanCampaigns = $derived(data.campaigns.slice(0, 5));

  let terbaruBase = $derived(
    [...data.campaigns].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );

  let filteredCampaigns = $derived(
    terbaruBase
      .filter((c) => {
        const matchCategory =
          selectedCategory === 'Semua' || c.category === selectedCategory;
        const matchSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      })
      .slice(0, 6)
  );

  function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<main class="flex-1">
  <!-- 1. Hero snap rail -->
  {#if heroSlides.length > 0}
    <section aria-label="Program mendesak" class="pt-4">
      <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 no-scrollbar">
        {#each heroSlides as campaign (campaign.id)}
          <article class="relative snap-center shrink-0 w-[85%] rounded-2xl overflow-hidden bg-slate-900 min-h-[220px] flex">
            <img
              src={campaign.coverUrl}
              alt={campaign.title}
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
            <div class="relative mt-auto p-4 w-full">
              <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-white/90 text-slate-800 mb-2">
                {campaign.category}
              </span>
              <h2 class="text-lg font-black text-white leading-snug line-clamp-2 font-display">
                {campaign.title}
              </h2>
              <a
                href="/c/{campaign.slug}"
                class="mt-3 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
                style="background-color: var(--color-brand);"
              >
                <Heart class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Bantu Sekarang</span>
              </a>
            </div>
          </article>
        {/each}
      </div>
    </section>
  {/if}

  <!-- 2. Donasi Sekarang CTA -->
  <section class="px-4 pt-4">
    <a
      href="#campaigns"
      class="min-h-[48px] flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl text-base font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-lg shadow-amber-400/20"
    >
      <Heart class="w-5 h-5 fill-slate-950 text-slate-950" />
      <span>Donasi Sekarang</span>
    </a>
  </section>

  <!-- 3. Category icon row -->
  {#if distinctCategories.length > 0}
    <section aria-label="Kategori donasi" class="pt-5">
      <div class="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        {#each distinctCategories as cat, i (cat)}
          {@const Icon = categoryIcons[i % categoryIcons.length]}
          <button
            onclick={() => (selectedCategory = selectedCategory === cat ? 'Semua' : cat)}
            aria-pressed={selectedCategory === cat}
            class="flex flex-col items-center gap-1.5 shrink-0 w-16 py-1"
          >
            <span
              class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors {selectedCategory === cat ? 'text-white border-transparent shadow-md' : 'bg-slate-100 text-slate-700 border-slate-200'}"
              style={selectedCategory === cat ? 'background-color: var(--color-brand);' : ''}
            >
              <Icon class="w-6 h-6" />
            </span>
            <span class="text-[11px] font-semibold text-slate-700 text-center leading-tight line-clamp-2">
              {cat}
            </span>
          </button>
        {/each}
      </div>
    </section>
  {/if}

  <!-- 4. Campaign Pilihan rail -->
  {#if pilihanCampaigns.length > 0}
    <section aria-label="Campaign pilihan" class="pt-6">
      <div class="px-4 mb-3">
        <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">
          Campaign Pilihan
        </h2>
        <p class="text-sm text-slate-600 mt-0.5">
          Pilihan program kebaikan untukmu hari ini.
        </p>
      </div>
      <div class="flex gap-3 overflow-x-auto snap-x px-4 pb-2 no-scrollbar">
        {#each pilihanCampaigns as campaign (campaign.id)}
          <CampaignCard {campaign} featured />
        {/each}
      </div>
    </section>
  {/if}

  <!-- 5. Trust strip -->
  <section aria-label="Kepercayaan donatur" class="px-4 pt-6">
    <div class="rounded-2xl bg-slate-50 border border-slate-200/80 divide-y divide-slate-200/70">
      <div class="flex items-start gap-3 p-4">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div>
          <span class="text-sm font-bold text-slate-900 block">Verifikasi 100%</span>
          <span class="text-xs text-slate-600 block mt-0.5">Setiap program terverifikasi rekam medis & survei relawan lapangan.</span>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
          <MessageCircle class="w-5 h-5" />
        </div>
        <div>
          <span class="text-sm font-bold text-slate-900 block">Notifikasi WA &lt; 60 Detik</span>
          <span class="text-xs text-slate-600 block mt-0.5">Konfirmasi donasi & kabar penyaluran terkirim otomatis via WhatsApp.</span>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4">
        <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <Zap class="w-5 h-5" />
        </div>
        <div>
          <span class="text-sm font-bold text-slate-900 block">Biaya Rp 0 + Platform 5%</span>
          <span class="text-xs text-slate-600 block mt-0.5">Donatur tanpa markup tersembunyi; alokasi platform terbuka & transparan.</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Campaign Terbaru -->
  <section id="campaigns" aria-label="Campaign terbaru" class="px-4 pt-8 scroll-mt-20">
    <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">
      Campaign Terbaru
    </h2>
    <p class="text-sm text-slate-600 mt-0.5 mb-4">
      Pilih saudara yang ingin kamu bantu hari ini. Penyaluran terverifikasi dan amanah.
    </p>

    <!-- Search Input -->
    <div class="relative w-full mb-3">
      <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari program atau nama pasien..."
        aria-label="Cari program donasi"
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all shadow-xs min-h-[44px]"
      />
    </div>

    <!-- Category Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar scroll-smooth">
      {#each categories as cat}
        <button
          onclick={() => (selectedCategory = cat)}
          class="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[40px] {selectedCategory === cat ? 'text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}"
          style={selectedCategory === cat ? 'background-color: var(--color-brand);' : ''}
        >
          {cat}
        </button>
      {/each}
    </div>

    {#if filteredCampaigns.length > 0}
      <div class="flex flex-col gap-4">
        {#each filteredCampaigns as campaign (campaign.id)}
          <CampaignCard {campaign} />
        {/each}
      </div>
      <a
        href="/campaigns"
        class="mt-4 min-h-[44px] flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
      >
        Lihat Lebih Banyak
      </a>
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

  <!-- 7. Laporan Penyaluran -->
  <section aria-label="Laporan penyaluran" class="px-4 pt-8 pb-10">
    <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">
      Laporan Penyaluran
    </h2>
    <p class="text-sm text-slate-600 mt-0.5 mb-4">
      Kabar terkini penyaluran donasi ke para penerima manfaat.
    </p>

    {#if data.updates.length > 0}
      <div class="flex flex-col gap-3">
        {#each data.updates as update (update.id)}
          <a
            href="/c/{update.campaignSlug}"
            class="block p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div class="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>{formatDate(update.createdAt)}</span>
              <span aria-hidden="true">•</span>
              <span class="truncate text-blue-800">{update.campaignTitle}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 leading-snug">
              {update.title}
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
              {update.body}
            </p>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-slate-500 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
        Belum ada laporan penyaluran. Kabar terbaru akan tampil di sini.
      </p>
    {/if}
  </section>
</main>
