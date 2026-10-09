<script lang="ts">
	import { Phone, MapPin, MessageCircle, ChevronDown } from 'lucide-svelte';

	let { data } = $props();

	let siteName = $derived(data.settings?.siteName || 'FundCore');
	let tagline = $derived(
		data.settings?.tagline || 'Platform Penggalangan Dana & Donasi Cepat Terpercaya'
	);
	let logoUrl = $derived(data.settings?.logoUrl || '/fundcore-logo.png');
	let orgName = $derived(data.settings?.orgName || 'Yayasan FundCore Peduli Indonesia');
	let orgAddress = $derived(
		data.settings?.orgAddress || 'Jl. TB Simatupang No. 18, Jakarta Selatan 12520'
	);
	let orgPhone = $derived(data.settings?.orgPhone || '0812-3456-7890');
	let legalSk = $derived(
		data.settings?.legalSk ||
			'SK Kemenkumham RI: AHU-0012345.AH.01.04.Tahun 2024 | Izin PUB Kemensos: 882/HUK-PS/2026'
	);

	let waNumber = $derived(orgPhone.replace(/\D/g, '').replace(/^0/, '62'));
</script>

<main class="flex-1 px-4 pt-6 pb-10">
	<!-- Org header -->
	<section
		aria-label="Profil organisasi"
		class="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 text-center"
	>
		<img src={logoUrl} alt={siteName} class="h-16 w-auto object-contain mx-auto" />
		<h1 class="mt-3 text-xl font-black text-slate-900 tracking-tight font-display">
			{siteName}
		</h1>
		<p class="mt-1 text-sm text-slate-600 leading-relaxed">{tagline}</p>
	</section>

	<!-- Tentang -->
	<section
		aria-label="Tentang kami"
		class="mt-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5"
	>
		<h2 class="text-lg font-black text-slate-900 tracking-tight font-display">Tentang Kami</h2>
		<div class="mt-2 space-y-3 text-sm text-slate-600 leading-relaxed">
			<p>
				{orgName} adalah pengelola {siteName} — {tagline}. Setiap program donasi
				diverifikasi sebelum ditayangkan dan setiap penyaluran dilaporkan secara terbuka.
			</p>
			<p>
				Legalitas kami tercatat resmi: {legalSk}. Donasi Anda disalurkan secara amanah
				kepada para penerima manfaat yang terverifikasi.
			</p>
		</div>
	</section>

	<!-- FAQ -->
	<section aria-label="Pertanyaan umum" class="mt-4">
		<h2 class="text-lg font-black text-slate-900 tracking-tight font-display px-1">
			Pertanyaan Umum
		</h2>
		<div class="mt-3 flex flex-col gap-3">
			<details
				class="group rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
			>
				<summary
					class="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden"
				>
					<span>Apakah harus daftar untuk berdonasi?</span>
					<ChevronDown class="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
				</summary>
				<p class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
					Tidak. Anda tidak perlu membuat akun atau mendaftar — cukup isi nama dan nomor
					WhatsApp pada formulir donasi.
				</p>
			</details>
			<details
				class="group rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
			>
				<summary
					class="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden"
				>
					<span>Berapa minimal donasi?</span>
					<ChevronDown class="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
				</summary>
				<p class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
					Minimal donasi adalah Rp1.000. Setiap rupiah kebaikan Anda berarti bagi mereka yang
					membutuhkan.
				</p>
			</details>
			<details
				class="group rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
			>
				<summary
					class="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden"
				>
					<span>Apakah ada biaya tambahan?</span>
					<ChevronDown class="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
				</summary>
				<p class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
					Tidak. Donatur membayar tepat sesuai nominal donasi — biaya platform sebesar 5%
					dipotong dari dana yang disalurkan, bukan ditambahkan ke donatur.
				</p>
			</details>
			<details
				class="group rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
			>
				<summary
					class="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden"
				>
					<span>Bagaimana saya tahu donasi saya tersalurkan?</span>
					<ChevronDown class="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
				</summary>
				<p class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
					Anda akan menerima notifikasi WhatsApp setelah berdonasi, dan kabar penyaluran
					terbaru selalu diperbarui di halaman campaign yang Anda bantu.
				</p>
			</details>
			<details
				class="group rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden"
			>
				<summary
					class="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden"
				>
					<span>Bagaimana cara menghubungi pengelola?</span>
					<ChevronDown class="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
				</summary>
				<div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
					<p>
						Hubungi kami di <span class="font-bold text-slate-900">{orgPhone}</span> melalui
						telepon atau WhatsApp.
					</p>
					<a
						href="https://wa.me/{waNumber}"
						target="_blank"
						rel="noreferrer"
						class="mt-3 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
						style="background-color: var(--color-brand);"
					>
						<MessageCircle class="w-4 h-4" />
						<span>Chat WhatsApp</span>
					</a>
				</div>
			</details>
		</div>
	</section>

	<!-- Contact -->
	<section
		aria-label="Kontak pengelola"
		class="mt-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5"
	>
		<h2 class="text-lg font-black text-slate-900 tracking-tight font-display">Hubungi Kami</h2>
		<div class="mt-3 space-y-3">
			<div class="flex items-start gap-3">
				<div
					class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0"
				>
					<Phone class="w-5 h-5" />
				</div>
				<div>
					<span class="text-sm font-bold text-slate-900 block">{orgPhone}</span>
					<span class="text-xs text-slate-600 block mt-0.5">Telepon & WhatsApp pengelola</span>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<div
					class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0"
				>
					<MapPin class="w-5 h-5" />
				</div>
				<div>
					<span class="text-sm font-bold text-slate-900 block">{orgName}</span>
					<span class="text-xs text-slate-600 block mt-0.5">{orgAddress}</span>
				</div>
			</div>
		</div>
	</section>
</main>
