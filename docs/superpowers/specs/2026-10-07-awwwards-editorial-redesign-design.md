# Design Spec: Awwwards-Level Editorial Humanist Redesign for FundCore

- **Date:** 2026-10-07
- **Project:** FundCore Web App
- **Scope:** Public Pages (Homepage, Campaign Detail, Checkout Flow)
- **Visual Style:** Editorial Humanist (Warm, Dignified, High Craft, Zero AI-Slop)
- **Target Audience:** Donatur perorangan, dermawan komunitas, dan mitra kemanusiaan di Indonesia.

---

## 1. Visual Direction & Antislop Compliance

### 1.1 Brand Identity & Typography
- **Display Font:** Cabinet Grotesk (Editorial, humanis, berkarakter tegas).
- **Body & Numerics:** Satoshi (Sans-serif elegan, keterbacaan tinggi untuk nominal rupiah dan doa).
- **Color Palette:**
  - Primary Brand: Deep Navy (`#0A2540`, wibawa, stabilitas, amanah).
  - Surface & Muted: Slate Neutral (`#F8FAFC`, `#FFFFFF`, `#0F172A`).
  - Warm Accent: Amber Honey (`#F59E0B`, aksen kebaikan, harapan, dan tindakan utama).
  - Trust Accent: Emerald Herbal (`#10B981`, status verifikasi dan keberhasilan).
- **Dials (antislop Part 3):**
  - `ENERGY`: 2 (Balanced, berwibawa, hangat).
  - `RHYTHM`: 3 (Variatif, komposisi berganti antar seksi, bebas dari layout template monoton).
  - `MOTION`: 2 (GSAP scroll reveal, pin scroll, hover physics terarah).

### 1.2 Strict Anti-Slop Constraints
- **Tanpa Em Dash (R-02):** Dilarang keras menggunakan karakter `—`. Gunakan tanda koma, titik dua, atau kurung.
- **Data & Angka Nyata (R-17, R-36):** Seluruh statistik berasal langsung dari database SQLite (total terkumpul, jumlah donatur, jumlah campaign). Tidak ada angka fiktif.
- **Navigasi Valid (R-24):** Semua anchor link mengarah ke seksi yang benar-benar ada di DOM (`#program`, `#transparansi`).
- **Kontras WCAG AA (R-25):** Rasio kontras teks minimal 4.5:1 untuk teks standar dan 3:1 untuk teks besar.
- **Interaksi Nyata (R-26, C-2):** Setiap tombol memiliki handler aksi, filter, atau rute tujuan nyata.
- **Respon Mobile Penuh (R-03):** Tap target minimal 44x44px, bebas overflow horizontal (`overflow-x: hidden`), layout modular menyesuaikan layar kecil.

---

## 2. Design Plan & RNG Execution (gpt-taste Protocol)

```python
# Simulated deterministic execution based on prompt length and scope
seed = 428
hero_architecture = "Cinematic Center with Inline Typography Pill"
typography_stack = "Cabinet Grotesk + Satoshi"
components = ["Inline Typography Images", "Gapless Bento Grid", "Pinned Split-Scroll"]
gsap_paradigms = ["ScrollTrigger Pinning", "Scale & Fade Scroll Scrubbing"]
```

---

## 3. Page Architectures & Section Specifications

### 3.1 Floating Glass Navigation
- **Struktur:** Floating pill bar mengambang di bagian atas halaman dengan padding napas.
- **Konten:**
  - Logo FundCore dengan tipografi brand elegan.
  - Link navigasi presisi: Program Kebaikan (`#program`), Transparansi (`#transparansi`), Admin Dashboard (`/admin`).
  - CTA Tombol Donasi Cepat yang menggulir langsung ke daftar program unggulan.
- **Mobile Drawer:** Menu hamburger yang dapat diakses dengan keyboard (Tab, Enter, Escape) dan transisi mulus.

### 3.2 Attention: Hero Section (Cinematic Center)
- **Container Width:** `max-w-5xl mx-auto`, teks terpusat dan bernapas lega.
- **Heading 1:** Dibatasi maksimal 2 baris horizontal pada layar desktop (`clamp(2.5rem, 5vw, 4.5rem)`).
- **Inline Typography Pill:** Menyisipkan elemen visual gambar bundar/pill berresolusi tinggi di tengah kalimat judul:
  `"Salurkan Harapan,"` + `[Pill Foto Kebaikan Lapangan]` + `"Hadirkan Senyum Nyata"`.
- **Subheadline:** Kalimat deskriptif konkret (donasi instan bawah 60 detik, integrasi QRIS & Virtual Account, notifikasi WhatsApp real-time).
- **Metrics Bar:** 3 kartu metrik ringkas terintegrasi dari data database (Total Donasi, Donatur Terdaftar, Program Aktif).
- **Two Distinct CTAs:**
  - Tombol Utama: Solid Brand Amber / Navy dengan teks kontras tinggi ("Pilih Program Donasi").
  - Tombol Sekunder: Outline slate berkelas ("Pelajari Transparansi").

### 3.3 Interest: Gapless Bento Grid (Program Explorer)
- **Grid Architecture:** Menggunakan `grid-flow-dense` dengan kombinasi `col-span` dan `row-span` terkalibrasi matematis sehingga tidak meninggalkan ruang kosong.
- **Featured Card (Col 2x2):** Program paling mendesak dengan media foto dominan, live progress bar, sisa hari, dan tombol donasi langsung.
- **Standard Cards (Col 1x1):** Kartu program donasi dengan rasio gambar sinematik, kategori badge bernilai fungsional, dan data capaian real-time.
- **Category Filter Pills:** Tombol filter horizontal (Semua, Medis, Bencana Alam, Pendidikan, Dhuafa) yang responsif dan dapat di-scroll mulus di mobile.
- **Instant Search:** Field pencarian campaign/penerima manfaat dengan debounced filtering seketika.
- **Empty State:** Desain state kosong yang ramah dengan tombol reset filter saat pencarian tidak menemukan hasil.

### 3.4 Desire: GSAP Pinned Split Scroll (Transparansi & Kepercayaan)
- **Split Layout:**
  - Sisi Kiri (Desktop): Pinned section header dengan ScrollTrigger (`pin: true`), berisi pesan komitmen amanah dan transparansi 100%.
  - Sisi Kanan: 3 kartu bukti nyata yang bergulir vertikal:
    1. Verifikasi Medis & Legalitas Kasus (dokumen medis & survei relawan).
    2. Notifikasi WhatsApp Real-time (invoice, konfirmasi bayar, update berkala).
    3. Transparansi Biaya Terbuka (potongan pemeliharaan 5% transparan).

### 3.5 Action: High-Impact Closing Section & Footer
- **Closing Banner:** Card berlatar navy gelap dengan kurva halus, tipografi kuat ("Satu Langkah Kecilmu Adalah Harapan Besar Bagi Mereka"), dan tombol aksi cepat.
- **Minimalist Editorial Footer:** Informasi hak cipta, kontak WhatsApp resmi, rute verifikasi, dan status izin operasional. Bebas dari template 4-kolom fiktif.

### 3.6 Campaign Detail Page (`/c/[slug]`)
- **Header:** Foto cover sinematik 16:9, badge kategori fungsional, judul program editorial besar, nama penerima manfaat dan fundraiser terverifikasi.
- **Story Body:** Narasi cerita medis/kemanusiaan dengan tipografi Satoshi yang nyaman dibaca, pemisah bab cerita yang jelas.
- **Prayer & Donor Feed:** Feed doa donatur dengan nama dermawan (atau Hamba Allah), waktu donasi, nominal, dan pesan doa yang menyejukkan.
- **Floating Sticky Donate Bar:** Bar donasi melayang di bawah layar dengan nominal donasi terkumpul, target, dan tombol CTA "Donasi Sekarang" (tap target >= 44px).

### 3.7 Instant Checkout Flow (`/c/[slug]/donate`)
- **Quick Nominal Chips:** Pilihan nominal donasi cepat (Rp 10.000, Rp 25.000, Rp 50.000, Rp 100.000, Rp 500.000) dan custom input format Rupiah.
- **Donation Form:** Input data singkat (Nama Donatur, Nomor WhatsApp, Pesan/Doa, Opsi Hamba Allah).
- **Payment Method Selector:** Kartu pilihan metode bayar QRIS Instan dan Virtual Account (BCA, Mandiri, BNI, BRI) yang bersih dan jelas.
- **Direct Submission:** Terhubung langsung ke API donasi dan invoice Winpay/Simulator.

---

## 4. Dependencies & Technical Integration

- **Dependencies:**
  - `gsap`: Untuk GSAP core dan `ScrollTrigger` animasi pinning & scroll reveals.
  - Web fonts: `Cabinet Grotesk` dan `Satoshi` via `@import` CSS di `src/routes/layout.css`.
- **Svelte 5 Runes:** Seluruh komponen menggunakan sintaks modern (`$state`, `$derived`, `$props`, `$effect`).
- **Tailwind v4:** Menggunakan utilitas kelas Tailwind v4 modern tanpa dependensi plugin usang.

---

## 5. Verification & Testing Plan

1. **Unit & Integration Tests:**
   - Menjalankan `npm test` untuk memastikan semua pengujian yang ada (checkout, public-pages, campaign-detail, contrast, winpay) tetap 100% lulus.
2. **WCAG AA Contrast Check:**
   - Memastikan tidak ada teks yang kontrasnya di bawah 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
3. **Mobile Tap Target & Overflow Check:**
   - Memastikan tidak ada horizontal scrollbar (`overflow-x: hidden`) dan semua tombol interaktif berukuran minimal 44x44px.
4. **Interactive Controls Verification:**
   - Seluruh filter, tombol pencarian, tombol donasi, dan drawer navigasi diuji secara langsung.
