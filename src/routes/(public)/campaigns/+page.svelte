<script lang="ts">
  import CampaignCard from '$lib/components/CampaignCard.svelte';
  import { Search } from 'lucide-svelte';

  let { data } = $props();

  let selectedCategory = $state('Semua');
  let sort = $state<'terbaru' | 'mendesak' | 'hampir'>('terbaru');
  let searchQuery = $state('');
  let visibleCount = $state(10);

  const categories = [
    'Semua',
    'Medis & Kesehatan',
    'Bencana Alam',
    'Pendidikan & Yatim',
    'Infrastruktur Pedesaan',
    'Lansia Dhuafa',
    'Kemanusiaan'
  ];

  const sortOptions: { value: typeof sort; label: string }[] = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'mendesak', label: 'Mendesak' },
    { value: 'hampir', label: 'Hampir Tercapai' }
  ];

  let filtered = $derived(
    data.campaigns.filter((c) => {
      const matchCategory = selectedCategory === 'Semua' || c.category === selectedCategory;
      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
  );

  let sorted = $derived(
    [...filtered].sort((a, b) => {
      if (sort === 'terbaru') return b.createdAt.localeCompare(a.createdAt);
      if (sort === 'mendesak')
        return Number(b.isUrgent) - Number(a.isUrgent) || a.endAt.localeCompare(b.endAt);
      const ratioA = a.collectedAmount / (a.targetAmount || 1);
      const ratioB = b.collectedAmount / (b.targetAmount || 1);
      return ratioB - ratioA;
    })
  );

  let shown = $derived(sorted.slice(0, visibleCount));
</script>

<main class="flex-1 px-4 pt-6 pb-10">
  <h1 class="text-xl font-black text-slate-900 tracking-tight font-display">Semua Campaign</h1>
  <p class="text-sm text-slate-600 mt-0.5 mb-4">
    {sorted.length} program kebaikan menunggumu. Penyaluran terverifikasi dan amanah.
  </p>

  <!-- Search Input -->
  <div class="relative w-full mb-3">
    <Search
      class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
    />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Cari program atau nama pasien..."
      aria-label="Cari program donasi"
      class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all shadow-xs min-h-[44px]"
    />
  </div>

  <!-- Category Filter Pills -->
  <div class="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
    {#each categories as cat}
      <button
        onclick={() => (selectedCategory = cat)}
        class="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[40px] {selectedCategory ===
        cat
          ? 'text-white shadow-xs'
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}"
        style={selectedCategory === cat ? 'background-color: var(--color-brand);' : ''}
      >
        {cat}
      </button>
    {/each}
  </div>

  <!-- Sort options -->
  <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar scroll-smooth">
    {#each sortOptions as opt}
      <button
        onclick={() => (sort = opt.value)}
        aria-pressed={sort === opt.value}
        class="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[40px] {sort ===
        opt.value
          ? 'text-white shadow-xs'
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}"
        style={sort === opt.value ? 'background-color: var(--color-brand);' : ''}
      >
        {opt.label}
      </button>
    {/each}
  </div>

  {#if shown.length > 0}
    <div class="flex flex-col gap-4">
      {#each shown as campaign (campaign.id)}
        <CampaignCard {campaign} />
      {/each}
    </div>
    {#if visibleCount < sorted.length}
      <button
        onclick={() => (visibleCount += 10)}
        class="mt-4 min-h-[44px] flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
      >
        Muat Lebih Banyak
      </button>
    {/if}
  {:else}
    <div class="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
      <div
        class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3"
      >
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
</main>
