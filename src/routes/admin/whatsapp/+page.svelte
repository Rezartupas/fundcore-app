<script lang="ts">
  import {
    MessageSquare,
    CheckCircle2,
    Clock,
    PlusCircle,
    Send,
    Shield,
    Smartphone,
    Save
  } from 'lucide-svelte';

  let { data, form } = $props();

  let newLabel = $state('');
  let newPhone = $state('');
  let newSession = $state('default');
  let newBaseUrl = $state('https://waha.domainanda.com');
  let newApiKey = $state('');
</script>

<div class="space-y-8 max-w-7xl mx-auto">
  <div>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      Integrasi Notifikasi WhatsApp (WAHA)
    </h1>
    <p class="text-xs sm:text-sm text-slate-500 mt-1">
      Kelola nomor customer service pengirim pesan, routing sticky CS per donasi, dan template pesan otomatis.
    </p>
  </div>

  {#if form?.connected}
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
      <CheckCircle2 class="w-4 h-4 text-emerald-600" />
      <span>Koneksi ke sesi WAHA ({form.phone}) berhasil terverifikasi aktif!</span>
    </div>
  {/if}

  <!-- Section 1: CS Accounts Grid -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-bold text-slate-900">
        Daftar Nomor CS WhatsApp Aktif ({data.accounts.length})
      </h2>
      <span class="text-xs text-slate-400 font-medium">Sticky CS Round-Robin Routing</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data.accounts as acc}
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-900">{acc.label}</span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {acc.status}
              </span>
            </div>
            <p class="text-xs font-mono text-slate-600">{acc.phone}</p>
            <p class="text-[11px] text-slate-400">Sesi: {acc.session}</p>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Terakhir dicek: Hari ini</span>
            <form method="POST" action="?/testPing">
              <input type="hidden" name="accountId" value={acc.id} />
              <button
                type="submit"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
              >
                <Send class="w-3 h-3 text-blue-600" />
                <span>Tes Ping</span>
              </button>
            </form>
          </div>
        </div>
      {/each}

      <!-- Add New Account Box -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <PlusCircle class="w-4 h-4 text-blue-600" />
          Tambah Nomor CS WAHA
        </h3>

        <form method="POST" action="?/saveAccount" class="space-y-3">
          <input
            type="text"
            name="label"
            bind:value={newLabel}
            placeholder="Label (contoh: CS Bantuan 2)"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
          />
          <input
            type="text"
            name="phone"
            bind:value={newPhone}
            placeholder="Nomor WA (contoh: 081234567890)"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
          />
          <input
            type="text"
            name="session"
            bind:value={newSession}
            placeholder="Session WAHA (default)"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
          />
          <button
            type="submit"
            class="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Simpan Nomor CS
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Section 2: Notification Templates -->
  <div class="space-y-4 pt-4 border-t border-slate-200">
    <h2 class="text-base font-bold text-slate-900">
      Pengaturan Template Pesan Otomatis
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each data.settings as st}
        <div class="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {#if st.type === 'created'}
                  1. Donasi Dibuat
                {:else if st.type === 'success'}
                  2. Donasi Sukses
                {:else}
                  3. Follow Up 2 Jam
                {/if}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900">
                {st.isActive ? 'Aktif' : 'Non-aktif'}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 mb-3">
              Tag: {'{nama}'}, {'{nominal}'}, {'{campaign}'}, {'{link_bayar}'}
            </p>

            <form method="POST" action="?/updateTemplate" class="space-y-3">
              <input type="hidden" name="type" value={st.type} />
              <textarea
                name="template"
                rows="4"
                required
                class="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans"
              >{st.template}</textarea>

              <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={st.isActive}
                  class="rounded-sm border-slate-300 text-blue-600"
                />
                <span>Aktifkan pengiriman event ini</span>
              </label>

              <button
                type="submit"
                class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save class="w-3.5 h-3.5" />
                <span>Simpan Template</span>
              </button>
            </form>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
