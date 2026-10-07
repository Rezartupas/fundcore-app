<script lang="ts">
  import { Shield, Heart, FileCheck, Phone, MapPin } from 'lucide-svelte';

  let { settings } = $props<{
    settings: {
      siteName: string;
      tagline: string;
      orgName: string;
      orgAddress: string;
      orgPhone: string;
      legalSk: string;
    };
  }>();
</script>

<footer class="bg-white border-t border-slate-200 mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
      <!-- Brand & Mission Column -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs" style="background-color: var(--color-brand);">
            FC
          </div>
          <span class="text-xl font-black tracking-tight text-slate-900">{settings.siteName}</span>
        </div>
        <p class="text-sm text-slate-600 max-w-md leading-relaxed">
          {settings.tagline}. Memfasilitasi para dermawan dan #OrangBaik untuk bergotong-royong membantu sesama secara transparan, mudah, dan amanah.
        </p>

        <!-- Legal Badge Box -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Shield class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Legalitas & Perizinan Resmi:</span>
          </div>
          <p class="text-xs text-slate-500 leading-normal">
            {settings.legalSk}
          </p>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-3">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Sekretariat Yayasan</h4>
        <div class="space-y-2.5 text-xs text-slate-600">
          <div class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{settings.orgAddress}</span>
          </div>
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-slate-400 shrink-0" />
            <span>{settings.orgPhone}</span>
          </div>
          <div class="flex items-center gap-2">
            <FileCheck class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Laporan Penyaluran Berkala</span>
          </div>
        </div>
      </div>

      <!-- Transparency & Policies -->
      <div class="space-y-3">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Transparansi</h4>
        <ul class="space-y-2 text-xs text-slate-600">
          <li><a href="/#trust" class="hover:text-slate-900 transition-colors">Biaya Platform 5% & Gateway</a></li>
          <li><a href="/#trust" class="hover:text-slate-900 transition-colors">Standar Verifikasi Pasien & Bencana</a></li>
          <li><a href="/admin" class="hover:text-slate-900 transition-colors text-blue-600 font-medium">Masuk Panel Pengelola</a></li>
          <li><span class="text-slate-400">© 2026 {settings.orgName}. Seluruh Hak Dilindungi.</span></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Disclaimer -->
    <div class="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <div class="flex items-center gap-1">
        <span>Dibangun dengan penuh amanah untuk kebaikan bersama</span>
        <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
      </div>
      <div>
        <span>Platform Crowdfunding FundCore v1.0</span>
      </div>
    </div>
  </div>
</footer>
