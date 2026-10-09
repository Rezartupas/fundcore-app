<script lang="ts">
  import {
    Shield,
    QrCode,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    Lock,
    ExternalLink
  } from 'lucide-svelte';

  let { data } = $props();

  let selectedChannel = $state('QRIS');
  let isProcessing = $state(false);

  const channels = [
    { id: 'QRIS', name: 'QRIS (Semua E-Wallet & Mobile Banking)', icon: 'qris', fee: 525 },
    { id: 'BCA VA', name: 'BCA Virtual Account', icon: 'va', fee: 2500 },
    { id: 'Mandiri VA', name: 'Mandiri Virtual Account', icon: 'va', fee: 2500 },
    { id: 'BRI VA', name: 'BRI Virtual Account', icon: 'va', fee: 2500 },
    { id: 'GoPay', name: 'GoPay / GoPay Later', icon: 'ewallet', fee: 1125 }
  ];

  function formatRp(val: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  async function triggerSimulateStatus(status: 'PAID' | 'EXPIRED' | 'FAILED') {
    isProcessing = true;
    try {
      const channelObj = channels.find((c) => c.id === selectedChannel);
      await fetch('/webhooks/winpay/internal-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: data.donation.invoiceRef,
          status,
          channel: selectedChannel,
          amount: data.donation.amount,
          fee: channelObj?.fee || 1000
        })
      });

      // Redirect to status check page
      window.location.href = `/donation/status/${data.donation.id}`;
    } catch {
      alert('Gagal menyimulasikan transaksi');
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>Winpay Checkout Page (Sandbox Simulator) - {data.donation.invoiceRef}</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 py-6 sm:py-12 px-4 flex flex-col justify-center items-center font-sans">
  <!-- Simulator Banner -->
  <div class="max-w-md w-full mb-3 p-3 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-between shadow-xs">
    <div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
      <span>Winpay Checkout Page Simulator (Development Mode)</span>
    </div>
    <span class="px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px]">SANDBOX</span>
  </div>

  <!-- Winpay Checkout Card Container -->
  <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200">
    <!-- Header -->
    <div class="bg-blue-950 p-6 text-white text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-blue-200">
        <Lock class="w-3.5 h-3.5" />
        Winpay Secured Payment
      </div>
      <span class="text-xs text-blue-300 block">Total Tagihan Donasi</span>
      <h1 class="text-3xl font-black tracking-tight text-white">
        {formatRp(data.donation.amount)}
      </h1>
      <p class="text-xs text-blue-300 truncate max-w-xs mx-auto">
        Invoice: {data.donation.invoiceRef}
      </p>
    </div>

    <!-- Details -->
    <div class="p-6 space-y-5">
      <div class="space-y-1.5 text-xs text-slate-600 pb-3 border-b border-slate-100">
        <div class="flex justify-between">
          <span>Tujuan Donasi:</span>
          <span class="font-bold text-slate-900 truncate max-w-[200px]">{data.campaign?.title}</span>
        </div>
        <div class="flex justify-between">
          <span>Donatur:</span>
          <span class="font-bold text-slate-900">{data.donation.donorName}</span>
        </div>
        <div class="flex justify-between">
          <span>WhatsApp:</span>
          <span class="font-bold text-slate-900">{data.donation.donorPhone}</span>
        </div>
      </div>

      <!-- Channel Selection -->
      <div class="space-y-2">
        <label for="payment-channel-select" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pilih Metode Pembayaran
        </label>
        <div class="space-y-2">
          {#each channels as ch}
            <button
              type="button"
              onclick={() => (selectedChannel = ch.id)}
              class="w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-98 {selectedChannel === ch.id ? 'border-blue-900 bg-blue-50/60 ring-1 ring-blue-900' : 'border-slate-200 bg-white hover:bg-slate-50'}"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {#if ch.icon === 'qris'}
                    <QrCode class="w-4 h-4 text-blue-900" />
                  {:else}
                    <CreditCard class="w-4 h-4 text-slate-700" />
                  {/if}
                </div>
                <span class="text-xs sm:text-sm font-semibold text-slate-900">{ch.name}</span>
              </div>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center {selectedChannel === ch.id ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300'}">
                {#if selectedChannel === ch.id}
                  <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                {/if}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Action Simulation Buttons -->
      <div class="pt-4 border-t border-slate-100 space-y-2.5">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          Aksi Uji Coba Sandbox
        </span>

        <!-- Simulate Pay Success -->
        <button
          type="button"
          disabled={isProcessing}
          onclick={() => triggerSimulateStatus('PAID')}
          class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {#if isProcessing}
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Memproses Pembayaran...</span>
          {:else}
            <CheckCircle2 class="w-4 h-4" />
            <span>Bayar Sekarang (Simulasi Berhasil)</span>
          {/if}
        </button>

        <!-- Simulate Fail / Expire -->
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onclick={() => triggerSimulateStatus('EXPIRED')}
            class="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Clock class="w-3.5 h-3.5 text-amber-600" />
            Simulasikan Kadaluwarsa
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onclick={() => triggerSimulateStatus('FAILED')}
            class="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle class="w-3.5 h-3.5 text-rose-600" />
            Simulasikan Gagal
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 text-center">
    <a href="/c/{data.campaign?.slug}" class="text-xs text-slate-500 hover:text-slate-800 underline">
      Batalkan dan kembali ke campaign
    </a>
  </div>
</div>
