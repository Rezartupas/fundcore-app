<script lang="ts">
  import { ArrowLeft, PlusCircle, Sparkles } from 'lucide-svelte';

  let { form } = $props();

  const categories = [
    'Medis & Kesehatan',
    'Bencana Alam',
    'Pendidikan & Yatim',
    'Infrastruktur Pedesaan',
    'Lansia Dhuafa',
    'Kemanusiaan'
  ];
</script>

<div class="max-w-3xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <a
      href="/admin/campaigns"
      class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      Kembali ke Kelola Campaign
    </a>
  </div>

  <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight">
        Buat Program Campaign Baru
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Sebagai admin yayasan, program yang Anda buat akan langsung tayang di beranda donatur.
      </p>
    </div>

    {#if form?.error}
      <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
        {form.error}
      </div>
    {/if}

    <form method="POST" action="?/create" class="space-y-5">
      <!-- Title -->
      <div>
        <label for="title" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Judul Program Campaign <span class="text-rose-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Contoh: Bantu Renovasi Madrasah Ambruk di Pelosok"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
        />
      </div>

      <!-- Category & Beneficiary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="category" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Kategori <span class="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          >
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="beneficiaryName" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Penerima Manfaat <span class="text-rose-500">*</span>
          </label>
          <input
            id="beneficiaryName"
            name="beneficiaryName"
            type="text"
            required
            placeholder="Nama Pasien / Warga / Sekolah"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      <!-- Financials Target & Duration -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="targetAmount" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Target Donasi (Rupiah) <span class="text-rose-500">*</span>
          </label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            min="10000"
            step="1000"
            required
            placeholder="50000000"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label for="durationDays" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Batas Waktu (Hari) <span class="text-rose-500">*</span>
          </label>
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            min="1"
            max="180"
            value="30"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      <!-- Cover Photo URL -->
      <div>
        <label for="coverUrl" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Foto Cover (URL Gambar Unsplash / WebP)
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="url"
          placeholder="https://images.unsplash.com/..."
          class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
        />
        <p class="text-[11px] text-slate-400 mt-1">Kosongkan untuk menggunakan gambar default platform</p>
      </div>

      <!-- Story Narrative -->
      <div>
        <label for="story" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Cerita Lengkap & Rencana Penyaluran <span class="text-rose-500">*</span>
        </label>
        <textarea
          id="story"
          name="story"
          rows="5"
          required
          placeholder="Tuliskan latar belakang kondisi pasien/warga, rincian biaya yang dibutuhkan, serta harapan keluarga..."
          class="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900 resize-y"
        ></textarea>
      </div>

      <!-- Urgent Checkbox -->
      <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
        <input
          type="checkbox"
          name="isUrgent"
          class="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500"
        />
        <span class="text-xs font-bold text-slate-800">
          Tandai sebagai Kebutuhan Mendesak (Tampil di Sorotan Utama Beranda)
        </span>
      </label>

      <!-- Submit Action -->
      <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <a
          href="/admin/campaigns"
          class="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Batal
        </a>
        <button
          type="submit"
          class="px-6 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
        >
          Tayangkan Campaign Sekarang
        </button>
      </div>
    </form>
  </div>
</div>
