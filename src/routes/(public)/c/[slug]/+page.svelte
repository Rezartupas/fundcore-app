<script lang="ts">
  import StickyDonateBar from '$lib/components/StickyDonateBar.svelte';
  import DonorPrayerList from '$lib/components/DonorPrayerList.svelte';
  import {
    Heart,
    ShieldCheck,
    Clock,
    Users,
    Share2,
    ArrowLeft,
    Check,
    Copy,
    MessageCircle,
    Flame,
    X
  } from 'lucide-svelte';

  let { data } = $props();

  let activeTab = $state<'story' | 'updates' | 'donors'>('story');
  let isShareModalOpen = $state(false);
  let isCopied = $state(false);

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  let percent = $derived(
    Math.min(100, Math.round((data.campaign.collectedAmount / (data.campaign.targetAmount || 1)) * 100))
  );

  async function handleAmen(donationId: string) {
    const formData = new FormData();
    formData.append('donationId', donationId);
    await fetch('?/amen', {
      method: 'POST',
      body: formData
    });
    // optimistic increment
    const target = data.donations.find((d: any) => d.id === donationId);
    if (target) {
      target.prayerAmenCount += 1;
    }
  }

  function copyCampaignLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      isCopied = true;
      setTimeout(() => (isCopied = false), 2500);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isShareModalOpen) {
      isShareModalOpen = false;
    }
  }

  let shareWhatsAppUrl = $derived.by(() => {
    if (typeof window === 'undefined') return '';
    const text = encodeURIComponent(
      `Assalamu'alaikum #OrangBaik, mari bantu "${data.campaign.title}". Donasi & doa melalui link resmi: ${window.location.href}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="flex-1 pb-24 sm:pb-16 bg-slate-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
    <!-- Back to Home Bar -->
    <div class="flex items-center justify-between">
      <a
        href="/"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Kembali ke Beranda
      </a>

      <!-- Share Trigger -->
      <button
        type="button"
        onclick={() => (isShareModalOpen = true)}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
      >
        <Share2 class="w-3.5 h-3.5" />
        Bagikan
      </button>
    </div>

    <!-- Main Campaign Card -->
    <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
      <!-- Media Cover -->
      <div class="relative w-full aspect-16/9 sm:aspect-2/1 bg-slate-100 overflow-hidden">
        <img
          src={data.campaign.coverUrl}
          alt={data.campaign.title}
          class="w-full h-full object-cover"
        />
        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
            {data.campaign.category}
          </span>
          {#if data.campaign.isUrgent}
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
              <Flame class="w-3.5 h-3.5 fill-current" />
              Mendesak
            </span>
          {/if}
        </div>
      </div>

      <!-- Header & Progress Container -->
      <div class="p-5 sm:p-8 space-y-5">
        <!-- Beneficiary Info -->
        <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
          <span>Penerima Manfaat: <strong class="text-slate-800">{data.campaign.beneficiaryName}</strong></span>
          <ShieldCheck class="w-4 h-4 text-blue-600" />
          <span class="text-blue-700 font-bold">Terverifikasi</span>
        </div>

        <h1 class="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {data.campaign.title}
        </h1>

        <!-- Progress Metrics Box -->
        <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div class="flex items-baseline justify-between gap-4">
            <div>
              <span class="text-xs sm:text-sm text-slate-600 font-medium block">Dana Terkumpul</span>
              <span class="text-2xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
                {formatRp(data.campaign.collectedAmount)}
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs sm:text-sm text-slate-600 font-medium block">Target Donasi</span>
              <span class="text-sm sm:text-base font-bold text-slate-700">
                {formatRp(data.campaign.targetAmount)}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out"
              style="width: {percent}%; background-color: var(--color-brand);"
            ></div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs sm:text-sm text-slate-600">
            <div class="flex items-center gap-2 font-medium">
              <Users class="w-4 h-4 text-slate-500" />
              <span><strong class="text-slate-800">{data.campaign.donorCount}</strong> Donatur Berpartisipasi</span>
            </div>
            <div class="flex items-center justify-end gap-2 font-medium">
              <Clock class="w-4 h-4 text-slate-500" />
              <span>Sisa Waktu <strong class="text-slate-800">{data.campaign.durationDays}</strong> Hari</span>
            </div>
          </div>
        </div>

        <!-- Desktop Action Buttons -->
        <div class="hidden sm:flex items-center gap-4 pt-2">
          <a
            href="/c/{data.campaign.slug}/donate"
            class="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-bold text-slate-900 shadow-md transition-all hover:brightness-105 active:scale-95"
            style="background-color: var(--color-accent);"
          >
            <Heart class="w-5 h-5 fill-slate-900" />
            Donasi Sekarang (&lt; 60 Detik)
          </a>
          <button
            type="button"
            onclick={() => (isShareModalOpen = true)}
            class="min-h-[48px] px-6 py-3.5 rounded-2xl font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Share2 class="w-5 h-5 text-slate-700" />
            Bagikan
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-t border-slate-200 bg-white sticky top-16 sm:top-20 z-10 px-4 sm:px-8">
        <button
          type="button"
          onclick={() => (activeTab = 'story')}
          class="flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer {activeTab === 'story' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'}"
        >
          Cerita Lengkap
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'updates')}
          class="flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer {activeTab === 'updates' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'}"
        >
          Kabar Terbaru ({data.updates.length})
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'donors')}
          class="flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer {activeTab === 'donors' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'}"
        >
          Donatur & Doa ({data.donations.length})
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-5 sm:p-8">
        {#if activeTab === 'story'}
          <div class="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <h3 class="text-lg font-bold text-slate-900">Tentang Penggalangan Dana</h3>
            {#each data.campaign.story.split('\n\n') as paragraph}
              <p>{paragraph}</p>
            {/each}

            <!-- Verification & Trust Card -->
            <div class="my-6 p-5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-4">
              <ShieldCheck class="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
              <div class="text-xs sm:text-sm text-slate-700 space-y-1">
                <span class="font-bold text-blue-900 block text-sm sm:text-base">Garansi Penyaluran Resmi 100% Tepat Sasaran</span>
                <p>Identitas penerima manfaat, rekening tujuan, dan bukti rekam medis telah ditinjau dan diverifikasi oleh tim penjamin kualitas {data.settings.siteName}.</p>
              </div>
            </div>
          </div>
        {:else if activeTab === 'updates'}
          <div class="space-y-6">
            {#if data.updates.length === 0}
              <div class="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-sm text-slate-600">Belum ada kabar terbaru dari penggalang dana.</p>
              </div>
            {:else}
              {#each data.updates as update}
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span class="font-semibold text-blue-900">Update Resmi Penggalang Dana</span>
                    <span>{new Date(update.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h4 class="text-base font-bold text-slate-900">{update.title}</h4>
                  <p class="text-sm text-slate-700 leading-relaxed">{update.body}</p>
                </div>
              {/each}
            {/if}
          </div>
        {:else if activeTab === 'donors'}
          <DonorPrayerList donations={data.donations} onAmen={handleAmen} />
        {/if}
      </div>
    </div>
  </div>
</main>

<!-- Mobile Sticky Donate Bar -->
<StickyDonateBar campaign={data.campaign} onShare={() => (isShareModalOpen = true)} />

<!-- Share Modal Drawer -->
{#if isShareModalOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    role="dialog"
    aria-modal="true"
    aria-labelledby="share-modal-title"
    tabindex="-1"
    onclick={(e) => {
      if (e.target === e.currentTarget) isShareModalOpen = false;
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') isShareModalOpen = false;
    }}
  >
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-100">
      <div class="flex items-center justify-between">
        <h3 id="share-modal-title" class="text-lg font-bold text-slate-900">Bagikan Kebaikan</h3>
        <button
          type="button"
          onclick={() => (isShareModalOpen = false)}
          class="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup dialog bagikan"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Setiap kali kamu membagikan campaign ini, kamu membuka kesempatan lebih banyak orang baik untuk ikut membantu.
      </p>

      <div class="space-y-3 pt-2">
        <!-- WhatsApp Share -->
        <a
          href={shareWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-colors"
        >
          <MessageCircle class="w-5 h-5 fill-current" />
          Bagikan ke WhatsApp
        </a>

        <!-- Copy Link -->
        <button
          type="button"
          onclick={copyCampaignLink}
          class="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          {#if isCopied}
            <Check class="w-4 h-4 text-emerald-600" />
            <span class="text-emerald-700 font-bold">Link Berhasil Disalin!</span>
          {:else}
            <Copy class="w-4 h-4" />
            <span>Salin Tautan Campaign</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
