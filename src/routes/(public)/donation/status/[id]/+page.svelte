<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  import {
    CheckCircle2,
    Clock,
    XCircle,
    Heart,
    Share2,
    MessageCircle,
    ArrowRight,
    Sparkles,
    ShieldCheck
  } from 'lucide-svelte';

  let { data } = $props();

  let donationStatus = $state('');
  $effect(() => {
    if (data.donation?.status && !donationStatus) {
      donationStatus = data.donation.status;
    }
  });
  let isChecking = $state(false);

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  // Progressive polling for pending payment (5s -> 10s -> 20s)
  onMount(() => {
    if (donationStatus === 'pending') {
      let interval = 5000;
      let timer: any;

      async function poll() {
        try {
          const res = await fetch(`/api/donations/${data.donation.id}/status`);
          if (res.ok) {
            const json = await res.json();
            if (json.status !== donationStatus) {
              donationStatus = json.status;
              if (donationStatus === 'paid') return;
            }
          }
        } catch {
          // ignore network hiccups
        }

        interval = Math.min(20000, interval * 1.5);
        if (donationStatus === 'pending') {
          timer = setTimeout(poll, interval);
        }
      }

      timer = setTimeout(poll, interval);
      return () => clearTimeout(timer);
    }
  });

  async function checkManualStatus() {
    isChecking = true;
    try {
      const res = await fetch(`/api/donations/${data.donation.id}/status`);
      if (res.ok) {
        const json = await res.json();
        donationStatus = json.status;
      }
    } finally {
      isChecking = false;
    }
  }

  let shareWhatsAppUrl = $derived.by(() => {
    if (typeof window === 'undefined') return '';
    const text = encodeURIComponent(
      `Alhamdulillah, saya baru saja berdonasi untuk "${data.campaign?.title}". Mari bersama-sama menebar kebaikan melalui: ${window.location.origin}/c/${data.campaign?.slug}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  });
</script>

<Navbar settings={data.settings} />

<main class="flex-1 py-8 sm:py-16 bg-slate-50 flex items-center justify-center">
  <div class="max-w-lg w-full px-4 sm:px-6">
    {#if donationStatus === 'paid'}
      <!-- Success State -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-6">
        <!-- Success Badge -->
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xs">
          <CheckCircle2 class="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div class="space-y-2">
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Sparkles class="w-3.5 h-3.5" />
            Pembayaran Berhasil Diterima
          </span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Alhamdulillah, Terima Kasih!
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Donasi Anda untuk <strong>{data.campaign?.title}</strong> telah tercatat dan tersalurkan dengan amanah.
          </p>
        </div>

        <!-- Receipt Details Box -->
        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 text-left">
          <div class="flex justify-between border-b border-slate-200/60 pb-2">
            <span class="text-slate-500">Nomor Invoice</span>
            <span class="font-bold text-slate-900">{data.donation.invoiceRef}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200/60 pb-2">
            <span class="text-slate-500">Nama Donatur</span>
            <span class="font-bold text-slate-900">
              {data.donation.isAnonymous ? 'Hamba Allah' : data.donation.donorName}
            </span>
          </div>
          <div class="flex justify-between border-b border-slate-200/60 pb-2">
            <span class="text-slate-500">Nominal Donasi</span>
            <span class="font-bold text-emerald-700 text-base">{formatRp(data.donation.amount)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Metode Pembayaran</span>
            <span class="font-semibold text-slate-900">{data.donation.channel || 'QRIS'}</span>
          </div>
        </div>

        <!-- Prayer Box if any -->
        {#if data.donation.prayer}
          <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-left space-y-1">
            <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Doa yang Anda Kirimkan:
            </span>
            <p class="text-xs sm:text-sm text-amber-950 italic">
              "{data.donation.prayer}"
            </p>
          </div>
        {/if}

        <!-- Share & Action Buttons -->
        <div class="space-y-3 pt-2">
          <a
            href={shareWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-4 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle class="w-5 h-5 fill-current" />
            Sebarkan Kebaikan ke WhatsApp
          </a>

          <a
            href="/c/{data.campaign?.slug}"
            class="w-full py-3.5 rounded-2xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Kembali ke Halaman Campaign</span>
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
      </div>
    {:else if donationStatus === 'pending'}
      <!-- Pending State -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-6">
        <div class="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-4 border-amber-100">
          <Clock class="w-8 h-8 animate-pulse" />
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-black text-slate-900">Menunggu Pembayaran</h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Invoice donasi sebesar <strong>{formatRp(data.donation.amount)}</strong> telah dibuat. Silakan selesaikan pembayaran.
          </p>
        </div>

        <div class="space-y-3 pt-2">
          <a
            href="/payment/simulate/{data.donation.id}"
            class="w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            style="background-color: var(--color-accent); color: var(--color-accent-text);"
          >
            Lanjutkan Pembayaran
          </a>

          <button
            onclick={checkManualStatus}
            disabled={isChecking}
            class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {isChecking ? 'Memeriksa status...' : 'Cek Status Sekarang'}
          </button>
        </div>
      </div>
    {:else}
      <!-- Expired / Failed State -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-6">
        <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-4 border-rose-100">
          <XCircle class="w-8 h-8" />
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-black text-slate-900">Donasi {donationStatus === 'expired' ? 'Kedaluwarsa' : 'Dibatalkan'}</h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Waktu pembayaran telah habis. Anda dapat membuat donasi baru kapan saja.
          </p>
        </div>

        <a
          href="/c/{data.campaign?.slug}/donate"
          class="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white shadow-md"
          style="background-color: var(--color-brand);"
        >
          <Heart class="w-4 h-4 fill-current" />
          Mulai Donasi Ulang
        </a>
      </div>
    {/if}
  </div>
</main>

<Footer settings={data.settings} />
