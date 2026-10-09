<script lang="ts">
  let { settings } = $props<{
    settings: {
      siteName: string;
      tagline: string;
      logoUrl: string;
      orgName: string;
      orgAddress: string;
      orgPhone: string;
      legalSk: string;
    };
  }>();
</script>

<footer class="border-t border-slate-200/80 bg-white px-4 py-6 text-xs text-slate-600">
  <div class="space-y-4">
    <div>
      <div class="flex items-center gap-2">
        <img src={settings.logoUrl || '/fundcore-logo.png'} alt={settings.siteName} class="h-7 w-auto object-contain" />
        <span class="text-sm font-black tracking-tight text-slate-900">{settings.siteName}</span>
      </div>
      <p class="mt-1.5 leading-relaxed">{settings.tagline}</p>
    </div>

    <div class="space-y-1 leading-relaxed">
      <p class="font-semibold text-slate-800">{settings.orgName}</p>
      <p>{settings.orgAddress}</p>
      <p>{settings.orgPhone}</p>
      <p>{settings.legalSk}</p>
    </div>

    <div class="flex items-center gap-4 font-semibold">
      <a href="#" class="hover:text-slate-900">Instagram</a>
      <a href="#" class="hover:text-slate-900">Facebook</a>
      <a href="#" class="hover:text-slate-900">X</a>
      <a href="#" class="hover:text-slate-900">YouTube</a>
    </div>

    <nav class="flex items-center gap-4 border-t border-slate-100 pt-4 font-semibold">
      <a href="/" class="hover:text-slate-900">Beranda</a>
      <a href="/campaigns" class="hover:text-slate-900">Campaign</a>
      <a href="/tentang" class="hover:text-slate-900">Tentang</a>
    </nav>

    <p class="text-slate-400">© 2026 {settings.orgName}. Seluruh hak cipta dilindungi.</p>
  </div>
</footer>
