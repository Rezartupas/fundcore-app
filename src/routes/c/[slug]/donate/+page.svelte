<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NominalChips from '$lib/components/NominalChips.svelte';
  import {
    Heart,
    ShieldCheck,
    ArrowLeft,
    User,
    Phone,
    Mail,
    MessageSquare,
    Lock,
    Zap,
    Check
  } from 'lucide-svelte';

  let { data } = $props();

  let nominal = $state(50000);
  let isAnonymous = $state(false);
  let donorName = $state('');
  let donorPhone = $state('');
  let donorEmail = $state('');
  let prayer = $state('');

  let isSubmitting = $state(false);
  let errorMessage = $state('');

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  async function handleDonateSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';

    if (nominal < 1000) {
      errorMessage = 'Nominal donasi minimal Rp 1.000';
      return;
    }

    const cleanPhone = donorPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errorMessage = 'Mohon masukkan nomor WhatsApp yang aktif untuk konfirmasi donasi.';
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      errorMessage = 'Silakan isi nama Anda atau centang opsi Hamba Allah.';
      return;
    }

    isSubmitting = true;

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: data.campaign.id,
          amount: nominal,
          donorName: isAnonymous ? 'Hamba Allah' : donorName,
          donorPhone: cleanPhone,
          donorEmail,
          isAnonymous,
          prayer
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Gagal memproses donasi.');
      }

      // Redirect immediately to payment simulation / gateway page
      window.location.href = json.redirectUrl;
    } catch (err: any) {
      errorMessage = err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.';
      isSubmitting = false;
    }
  }
</script>

<Navbar settings={data.settings} />

<main class="flex-1 py-6 sm:py-10 bg-slate-50">
  <div class="max-w-xl mx-auto px-4 sm:px-6">
    <!-- Breadcrumb -->
    <a
      href="/c/{data.campaign.slug}"
      class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
    >
      <ArrowLeft class="w-4 h-4" />
      Kembali ke Detail Campaign
    </a>

    <!-- Checkout Container Card -->
    <div class="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <!-- Target Campaign Header Pill -->
      <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <img
          src={data.campaign.coverUrl}
          alt={data.campaign.title}
          class="w-14 h-14 rounded-xl object-cover shrink-0"
        />
        <div class="min-w-0">
          <span class="text-[11px] font-bold text-blue-900 block uppercase tracking-wider">
            Kamu Berdonasi Untuk:
          </span>
          <h2 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {data.campaign.title}
          </h2>
        </div>
      </div>

      <form onsubmit={handleDonateSubmit} class="space-y-6">
        <!-- 1. Nominal Presets & Custom -->
        <NominalChips bind:value={nominal} min={1000} />

        <!-- 2. Data Donatur -->
        <div class="space-y-4 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Data Donatur</span>
            <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Zap class="w-3 h-3 text-amber-500" />
              Tanpa Wajib Login
            </span>
          </div>

          <!-- Anonymous Toggle -->
          <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
            <input
              type="checkbox"
              bind:checked={isAnonymous}
              class="w-4 h-4 text-blue-900 rounded-sm border-slate-300 focus:ring-blue-900"
            />
            <span class="text-xs font-semibold text-slate-700">
              Sembunyikan nama saya (Tampil sebagai Hamba Allah)
            </span>
          </label>

          <!-- Nama Donatur -->
          {#if !isAnonymous}
            <div>
              <label for="donor-name-input" class="block text-xs font-semibold text-slate-600 mb-1">
                Nama Lengkap
              </label>
              <div class="relative">
                <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="donor-name-input"
                  type="text"
                  bind:value={donorName}
                  placeholder="Masukkan nama Anda"
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          {/if}

          <!-- Nomor WhatsApp (Mandatory) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="donor-phone-input" class="block text-xs font-semibold text-slate-600">
                Nomor WhatsApp <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400">Untuk info bukti & link bayar</span>
            </div>
            <div class="relative">
              <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="donor-phone-input"
                type="tel"
                inputmode="numeric"
                bind:value={donorPhone}
                placeholder="08xxxxxxxxxx"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Email (Optional) -->
          <div>
            <label for="donor-email-input" class="block text-xs font-semibold text-slate-600 mb-1">
              Email (Opsional)
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="donor-email-input"
                type="email"
                bind:value={donorEmail}
                placeholder="nama@email.com"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Doa / Harapan (Optional) -->
          <div>
            <label for="donor-prayer-input" class="block text-xs font-semibold text-slate-600 mb-1">
              Sertakan Doa atau Pesan Baik (Opsional)
            </label>
            <div class="relative">
              <textarea
                id="donor-prayer-input"
                bind:value={prayer}
                rows="2"
                placeholder="Tuliskan doa kebaikan untuk penerima manfaat..."
                class="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 3. Ringkasan & Transparansi Biaya -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-600">
          <div class="flex items-center justify-between">
            <span>Nominal Donasi</span>
            <span class="font-bold text-slate-900 text-sm">{formatRp(nominal)}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>Biaya Tambahan Transaksi</span>
            <span class="font-semibold text-emerald-600">Rp 0 (Gratis)</span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
            <span>Total Pembayaran</span>
            <span class="text-base text-blue-950 font-black">{formatRp(nominal)}</span>
          </div>
        </div>

        {#if errorMessage}
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMessage}
          </div>
        {/if}

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting || nominal < 1000}
          class="w-full py-4 rounded-2xl font-black text-base shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: var(--color-accent); color: var(--color-accent-text);"
        >
          {#if isSubmitting}
            <span class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span>Membuat Invoice Pembayaran...</span>
          {:else}
            <Heart class="w-5 h-5 fill-current" />
            <span>Lanjut Pembayaran {formatRp(nominal)}</span>
          {/if}
        </button>

        <!-- Trust Guarantee Footer -->
        <div class="flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
          <Lock class="w-3.5 h-3.5" />
          <span>Transaksi aman & terenkripsi otomatis</span>
        </div>
      </form>
    </div>
  </div>
</main>

<Footer settings={data.settings} />
