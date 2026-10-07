<script lang="ts">
  import { CreditCard, Lock, ShieldCheck, Check, Copy, Save } from 'lucide-svelte';

  let { data, form } = $props();

  let isCopied = $state(false);

  function copyCallback() {
    navigator.clipboard.writeText(data.gateway.callbackUrl);
    isCopied = true;
    setTimeout(() => (isCopied = false), 2000);
  }
</script>

<div class="space-y-6 max-w-5xl mx-auto">
  <div>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      Pengaturan Pembayaran Gateway (Winpay)
    </h1>
    <p class="text-xs sm:text-sm text-slate-500 mt-1">
      Integrasi Winpay Checkout Page: kelola kredensial merchant, environment, dan konfigurasi webhook.
    </p>
  </div>

  {#if form?.success}
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
      <Check class="w-4 h-4 text-emerald-600" />
      <span>Pengaturan Winpay berhasil diperbarui!</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Merchant Credentials Box -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Lock class="w-4 h-4 text-blue-900" />
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Kredensial Akun Winpay
        </h2>
      </div>

      <form method="POST" action="?/saveCredentials" class="space-y-4">
        <div>
          <label for="environment" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Environment
          </label>
          <select
            id="environment"
            name="environment"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
          >
            <option value="sandbox" selected={data.gateway.environment === 'sandbox'}>Sandbox (Testing / Uji Coba)</option>
            <option value="production" selected={data.gateway.environment === 'production'}>Production (Live Real Money)</option>
          </select>
        </div>

        <div>
          <label for="apiKey" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Winpay API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={data.gateway.apiKeyMasked}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50"
          />
        </div>

        <div>
          <label for="secretKey" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Winpay Secret Key (Masked)
          </label>
          <input
            id="secretKey"
            type="password"
            value={data.gateway.secretKeyMasked}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50"
          />
        </div>

        <!-- Webhook URL Display -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span class="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
            Callback Webhook URL untuk Dashboard Winpay
          </span>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              value={data.gateway.callbackUrl}
              class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 bg-white truncate"
            />
            <button
              type="button"
              onclick={copyCallback}
              class="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              title="Salin Webhook URL"
            >
              {#if isCopied}
                <Check class="w-3.5 h-3.5 text-emerald-600" />
              {:else}
                <Copy class="w-3.5 h-3.5" />
              {/if}
            </button>
          </div>
          <p class="text-[10px] text-slate-400">Endpoint ini membalas "ACCEPTED" secara instan (PRD F-32).</p>
        </div>

        <button
          type="submit"
          class="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          Simpan Kredensial Gateway
        </button>
      </form>
    </div>

    <!-- Active Channel MDR Fees Guide Box -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
        <CreditCard class="w-4 h-4 text-blue-900" />
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Referensi Biaya Kanal (MDR)
        </h2>
      </div>

      <p class="text-xs text-slate-500 leading-relaxed">
        Sesuai PRD FundCore 6.7, donatur membayar pas tanpa biaya admin. Biaya gateway ditanggung merchant dan dipotong otomatis sebelum dana disalurkan:
      </p>

      <div class="space-y-2 text-xs">
        <div class="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span class="font-bold text-slate-800">QRIS (Gopay/OVO/ShopeePay/BCA)</span>
          <span class="font-mono font-bold text-blue-900">0.7% MDR</span>
        </div>
        <div class="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span class="font-bold text-slate-800">BCA Virtual Account</span>
          <span class="font-mono font-bold text-blue-900">Rp 2.500 / trx</span>
        </div>
        <div class="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span class="font-bold text-slate-800">Mandiri Virtual Account</span>
          <span class="font-mono font-bold text-blue-900">Rp 2.500 / trx</span>
        </div>
        <div class="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span class="font-bold text-slate-800">BRI / BNI Virtual Account</span>
          <span class="font-mono font-bold text-blue-900">Rp 2.500 / trx</span>
        </div>
        <div class="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span class="font-bold text-slate-800">Potongan Platform FundCore</span>
          <span class="font-mono font-bold text-amber-700">5% Flat</span>
        </div>
      </div>
    </div>
  </div>
</div>
