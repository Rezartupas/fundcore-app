<script lang="ts">
  import {
    Palette,
    CheckCircle2,
    AlertTriangle,
    Smartphone,
    Save,
    RotateCcw,
    Shield
  } from 'lucide-svelte';
  import { validateWcagAA, getRecommendedTextColor } from '$lib/theme/contrast';

  let { data, form } = $props();

  let siteName = $state('');
  let tagline = $state('');
  let logoUrl = $state('');
  let colorBg = $state('');
  let colorBrand = $state('');
  let colorAccent = $state('');
  let orgName = $state('');
  let orgAddress = $state('');
  let orgPhone = $state('');
  let legalSk = $state('');

  $effect(() => {
    if (data.settings && !siteName) {
      siteName = data.settings.siteName;
      tagline = data.settings.tagline;
      logoUrl = data.settings.logoUrl;
      colorBg = data.settings.colorBg;
      colorBrand = data.settings.colorBrand;
      colorAccent = data.settings.colorAccent;
      orgName = data.settings.orgName;
      orgAddress = data.settings.orgAddress;
      orgPhone = data.settings.orgPhone;
      legalSk = data.settings.legalSk;
    }
  });

  // Live Contrast Checks
  let brandContrast = $derived(validateWcagAA('#FFFFFF', colorBrand));
  let accentContrast = $derived(
    validateWcagAA(colorAccent, getRecommendedTextColor(colorAccent))
  );

  function resetDefaultLogoColors() {
    colorBg = '#F8FAFC';
    colorBrand = '#0A2540';
    colorAccent = '#F59E0B';
    logoUrl = '/fundcore-logo.png';
  }
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <div>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      Branding & Kustomisasi Tema (White-Label)
    </h1>
    <p class="text-xs sm:text-sm text-slate-500 mt-1">
      Atur nama organisasi, logo, dan palet warna 60/30/10. Perubahan langsung aktif ke seluruh situs secara real-time.
    </p>
  </div>

  {#if form?.success}
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
      <CheckCircle2 class="w-4 h-4 text-emerald-600" />
      <span>Pengaturan tema berhasil disimpan dan langsung diterapkan ke seluruh halaman!</span>
    </div>
  {/if}

  {#if form?.warning}
    <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-2">
      <AlertTriangle class="w-4 h-4 text-amber-600" />
      <span>{form.warning}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- Form Settings Column -->
    <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <form method="POST" action="?/save" class="space-y-6">
        <!-- Brand Identity Section -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Identitas Platform
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="theme-sitename" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Situs / Brand <span class="text-rose-500">*</span>
              </label>
              <input
                id="theme-sitename"
                name="siteName"
                type="text"
                bind:value={siteName}
                required
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label for="theme-logourl" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Logo URL (Default: FundCore)
              </label>
              <input
                id="theme-logourl"
                name="logoUrl"
                type="text"
                bind:value={logoUrl}
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label for="theme-tagline" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tagline Slogan
            </label>
            <input
              id="theme-tagline"
              name="tagline"
              type="text"
              bind:value={tagline}
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>
        </div>

        <!-- 60/30/10 Color Rules Section -->
        <div class="space-y-4 pt-2">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Palet Warna 60 / 30 / 10
            </h2>
            <button
              type="button"
              onclick={resetDefaultLogoColors}
              class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw class="w-3 h-3" />
              Reset ke Warna Logo FundCore
            </button>
          </div>

          <!-- Color Pickers Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- 60% Base -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-xs font-bold text-slate-800 block">60% Warna Dasar</span>
              <span class="text-[11px] text-slate-500 block">Latar halaman & kartu</span>
              <div class="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  name="colorBg"
                  bind:value={colorBg}
                  class="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  bind:value={colorBg}
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <!-- 30% Brand -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-xs font-bold text-slate-800 block">30% Warna Brand</span>
              <span class="text-[11px] text-slate-500 block">Header, judul, progress</span>
              <div class="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  name="colorBrand"
                  bind:value={colorBrand}
                  class="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  bind:value={colorBrand}
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <!-- 10% Accent -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span class="text-xs font-bold text-slate-800 block">10% Warna Aksen</span>
              <span class="text-[11px] text-slate-500 block">Tombol Donasi Sekarang</span>
              <div class="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  name="colorAccent"
                  bind:value={colorAccent}
                  class="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  bind:value={colorAccent}
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          <!-- WCAG Contrast Feedback -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Evaluasi Aksesibilitas WCAG AA
            </span>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="flex items-center gap-2">
                {#if brandContrast.passed}
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                  <span class="text-slate-700">Kontras Brand: <strong>{brandContrast.ratio}:1 (Lolos AA)</strong></span>
                {:else}
                  <AlertTriangle class="w-4 h-4 text-amber-600" />
                  <span class="text-amber-800">Kontras Brand: {brandContrast.ratio}:1 (Kurang kontras)</span>
                {/if}
              </div>

              <div class="flex items-center gap-2">
                {#if accentContrast.passed}
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                  <span class="text-slate-700">Kontras Tombol: <strong>{accentContrast.ratio}:1 (Lolos AA)</strong></span>
                {:else}
                  <AlertTriangle class="w-4 h-4 text-amber-600" />
                  <span class="text-amber-800">Kontras Tombol: {accentContrast.ratio}:1 (Perlu dicek)</span>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Organization Legal Data -->
        <div class="space-y-4 pt-2">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Legalitas & Informasi Yayasan
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="theme-orgname" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Resmi Yayasan
              </label>
              <input
                id="theme-orgname"
                name="orgName"
                type="text"
                bind:value={orgName}
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label for="theme-orgphone" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Kontak Layanan
              </label>
              <input
                id="theme-orgphone"
                name="orgPhone"
                type="text"
                bind:value={orgPhone}
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label for="theme-legalsk" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              SK Kemenkumham & Nomor Izin PUB
            </label>
            <input
              id="theme-legalsk"
              name="legalSk"
              type="text"
              bind:value={legalSk}
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label for="theme-orgaddress" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Sekretariat
            </label>
            <textarea
              id="theme-orgaddress"
              name="orgAddress"
              rows="2"
              bind:value={orgAddress}
              class="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            ></textarea>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            class="px-6 py-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Save class="w-4 h-4" />
            <span>Simpan & Terapkan Perubahan Tema</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Live Mobile Preview Column -->
    <div class="lg:col-span-5 space-y-3 sticky top-24">
      <div class="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
        <span class="flex items-center gap-1.5">
          <Smartphone class="w-4 h-4 text-blue-900" />
          Pratinjau Layar Mobile Donatur
        </span>
        <span class="text-[11px] text-slate-400 font-normal">Real-Time UI</span>
      </div>

      <!-- Mobile Device Mockup Frame -->
      <div
        class="rounded-[2.5rem] border-8 border-slate-900 overflow-hidden shadow-2xl p-4 space-y-4"
        style="background-color: {colorBg};"
      >
        <!-- Mock Navbar -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div class="flex items-center gap-2">
            <img src={logoUrl || '/fundcore-logo.png'} alt="Logo" class="h-6 w-auto object-contain" />
          </div>
          <span class="w-6 h-6 rounded-md bg-slate-200/80"></span>
        </div>

        <!-- Mock Campaign Card -->
        <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 space-y-3">
          <div class="w-full h-28 bg-slate-200 rounded-xl overflow-hidden relative">
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800">
              Medis & Kesehatan
            </span>
          </div>

          <h3 class="text-xs font-bold text-slate-900 line-clamp-2">
            Bantu Balita Sakit Parah Pulih Kembali
          </h3>

          <!-- Progress -->
          <div class="space-y-1">
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                class="h-full rounded-full"
                style="width: 65%; background-color: {colorBrand};"
              ></div>
            </div>
            <div class="flex justify-between text-[10px] font-bold">
              <span style="color: {colorBrand};">Rp 32.500.000</span>
              <span class="text-slate-400">Target Rp 50 Jt</span>
            </div>
          </div>
        </div>

        <!-- Mock Sticky Button -->
        <div class="pt-2">
          <button
            type="button"
            class="w-full py-3 rounded-xl font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
            style="background-color: {colorAccent}; color: {getRecommendedTextColor(colorAccent)};"
          >
            <span>Donasi Sekarang (&lt; 60 Dtk)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
