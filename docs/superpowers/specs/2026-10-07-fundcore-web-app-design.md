# Spesifikasi Desain: FundCore Web App MVP

**Tanggal:** 7 Oktober 2026  
**Status:** Disetujui (Approved)  
**Tipe:** Fullstack SvelteKit Web Application  
**Referensi:** PRD FundCore v1.0, niatbaik.id, kitabisa.com  

---

## 1. Ringkasan & Tujuan Produk

FundCore adalah platform crowdfunding donasi berbasis web yang berorientasi mobile-first, sangat ringan, dan berfokus pada kecepatan konversi donasi (<60 detik). Platform mendukung multi-peran (Donatur, Fundraiser, Admin) dan dilengkapi kemampuan **white-label** penuh (nama, logo, dan palet warna 60/30/10 dapat diatur secara dinamis tanpa perlu deploy ulang).

### Target Metrik MVP
- **Kecepatan Checkout:** < 60 detik dari klik tombol donasi hingga proses pembayaran.
- **Konversi:** ≥ 3–5% kunjungan campaign menghasilkan donasi sukses.
- **Performa:** Skor Lighthouse mobile ≥ 90, LCP < 2,5 detik pada koneksi 4G.
- **Aksesibilitas:** Seluruh komponen interaktif memenuhi standar kontras WCAG AA.

---

## 2. Arsitektur Sistem & Stack Teknologi

Aplikasi dibangun sebagai satu kesatuan fullstack monolitis terstruktur (SvelteKit) yang siap dijalankan secara lokal dan dapat dideploy ke VPS Dokku:

- **Framework Frontend & Backend:** SvelteKit (Runes mode) + TypeScript.
- **Styling:** Tailwind CSS + CSS Variables dinamis untuk white-label theming.
- **Iconography:** Lucide Icons / Tabler Icons dengan ukuran garis konsisten (`strokeWidth: 1.75`).
- **Data Persistence:** Drizzle ORM.
  - *Lingkungan Dev Lokal:* SQLite (`better-sqlite3` / `bun:sqlite` / `@libsql/client`) file lokal `./fundcore.db` untuk eksekusi instan tanpa dependensi database eksternal.
  - *Lingkungan Production VPS:* Adapter PostgreSQL untuk Dokku PostgreSQL plugin.
- **Payment Gateway Adapter:**
  - Modul adapter Winpay Checkout Page (`create invoice`, webhook callback, query status).
  - Dilengkapi simulator interaktif lokal untuk memudahkan verifikasi alur bayar sukses/pending/gagal tanpa kartu nyata.
- **WhatsApp Notification Adapter:**
  - Modul client WAHA (WhatsApp HTTP API) untuk integrasi endpoint `/api/sendText`.
  - Dilengkapi simulator pesan & log antrean untuk pengujian tanpa memerlukan server WAHA langsung.

---

## 3. Brand Identity, Visual Taste & Aturan Tema 60/30/10

### 3.1 Pemanfaatan Aset Logo FundCore
Berdasarkan logo FundCore (`fundcore-logo.png`):
- **Elemen Lambang (Emblem):** Perisai pelindung berlapis dengan dua tangan yang memberi dan menerima koin emas. Digunakan pada header mobile (lebar layar sempit), favicon browser, serta icon aplikasi.
- **Elemen Tipografi (Wordmark):** Teks "FundCore" dalam font geometric sans tebal berwarna navy pekat. Digunakan berdampingan dengan emblem pada desktop navbar, halaman login, dan invoice.
- **White-Label Adaptif:** Jika admin mengganti nama atau logo organisasi di menu pengaturan, logo dan teks default FundCore otomatis berganti ke identitas yayasan klien.

### 3.2 Palet Warna 60/30/10 Bawaan Logo
1. **60% Warna Dasar (`--color-bg` & `--color-surface`):**
   - Background halaman: `#F8FAFC` (Slate-50, bersih, tenang, melegakan mata).
   - Permukaan kartu: `#FFFFFF` dengan bayangan lembut bergradasi subtil.
2. **30% Warna Brand (`--color-brand` & `--color-brand-muted`):**
   - Deep Navy: `#0A2540` (diambil dari warna utama teks dan perisai logo FundCore). Digunakan untuk navbar desktop, judul H1/H2, tab aktif, dan progress bar donasi.
   - Sky Blue: `#0284C7` / `#38BDF8` (warna tangan & highlight perisai) sebagai aksen sekunder untuk badge verified dan tautan informatif.
3. **10% Warna Aksen Utama (`--color-accent`):**
   - Warm Amber / Gold: `#F59E0B` (diambil dari warna koin emas pada logo FundCore). Digunakan untuk tombol utama "Donasi Sekarang", chip nominal yang dipilih, dan notifikasi urgensi ("Mendesak").
   - Warna teks di atas tombol aksen dijamin kontras tinggi (Navy `#0A2540` atau Gelap pekat) memenuhi rasio kontras WCAG AA (≥ 4.5:1).

### 3.3 Pedoman Desain Anti-Slop (Design Taste)
- Menghindari gradien ungu AI generik, mesh gradient berlebihan, atau efek neon.
- Layout mobile-first 360px dengan tombol donasi sticky di bawah viewport.
- Touch target minimal 44px x 44px untuk seluruh tombol dan chip input.
- Efek mikrointeraksi taktil: tombol mengecil sedikit saat ditekan (`active:scale-[0.98]`).
- Tipografi proporsional, hierarki judul tegas, dan format nominal rupiah otomatis (`Rp 50.000`).

---

## 4. Struktur Database & Model Data (Drizzle ORM)

```typescript
// Tabel Pengaturan Situs (White-label & Brand)
export interface SiteSettings {
  id: number;
  siteName: string;            // Default: "FundCore"
  tagline: string;             // Default: "Jembatan Kebaikan Terpercaya"
  logoUrl: string;             // URL gambar logo
  faviconUrl: string;
  colorBg: string;             // Default: "#F8FAFC"
  colorBrand: string;          // Default: "#0A2540"
  colorAccent: string;         // Default: "#F59E0B"
  orgName: string;             // Nama Yayasan / Lembaga
  orgAddress: string;
  orgPhone: string;
  legalSk: string;             // Nomor SK Kemenkumham / Izin PUB
  updatedAt: string;
}

// Tabel Campaign Penggalangan Dana
export interface Campaign {
  id: string;                  // UUID / slug id
  slug: string;                // URL ramah SEO, misal: 'bantu-operasi-adik-fathir'
  ownerId: string;             // ID user pembuat
  title: string;
  category: string;            // Medis, Bencana, Pendidikan, Panti Asuhan, dll.
  targetAmount: number;        // Nominal target (Rupiah)
  collectedAmount: number;     // Nominal bruto terkumpul saat ini
  donorCount: number;          // Jumlah donatur sukses
  durationDays: number;
  startAt: string;
  endAt: string;
  coverUrl: string;
  story: string;               // Deskripsi cerita lengkap
  beneficiaryName: string;     // Nama penerima manfaat
  status: 'draft' | 'active' | 'frozen' | 'completed';
  isUrgent: boolean;           // Badge "Mendesak"
  createdAt: string;
}

// Tabel Donasi Transaksional
export interface Donation {
  id: string;                  // UUID
  campaignId: string;
  donorName: string;           // Nama atau "Orang Baik"
  donorPhone: string;          // Format 628xxx (WhatsApp)
  donorEmail?: string;
  amount: number;              // Nominal donasi yang dibayar donatur
  isAnonymous: boolean;
  prayer?: string;             // Doa atau pesan dukungan
  status: 'created' | 'pending' | 'paid' | 'expired' | 'failed';
  channel?: string;            // QRIS, BCA VA, Mandiri VA, GoPay, dll.
  invoiceRef: string;          // Ref unik ke Winpay
  invoiceUrl: string;          // URL pembayaran Winpay
  gatewayFee: number;          // Biaya MDR dari Winpay
  platformFee: number;         // 5% dari donasi kotor
  netAmount: number;           // amount - gatewayFee - platformFee
  waAccountId?: string;        // ID akun CS WAHA sticky
  paidAt?: string;
  expiredAt?: string;
  createdAt: string;
}

// Tabel Akun WhatsApp CS (WAHA)
export interface WaAccount {
  id: string;
  label: string;               // Misal: "CS Donatur 1"
  baseUrl: string;             // URL server WAHA
  session: string;             // Nama session di WAHA
  apiKey: string;              // API Key WAHA
  phone: string;               // Nomor WA yang terdeteksi
  status: 'connected' | 'qr_required' | 'disconnected';
  isActive: boolean;
  lastCheckedAt: string;
}

// Tabel Template Notifikasi WhatsApp
export interface WaSetting {
  type: 'created' | 'success' | 'followup';
  isActive: boolean;
  template: string;
  delayMinutes: number;        // Khusus followup (default: 120 menit)
}
```

---

## 5. Alur Fungsional Utama

### 5.1 Halaman Publik (Mobile-First)
1. **Beranda (`/`):**
   - Header ringkas dengan logo FundCore, tombol pencarian, dan tautan login admin/fundraiser.
   - Banner unggulan campaign mendesak dengan progress bar interaktif.
   - Filter kategori cepat berbentuk pill (Semua, Medis & Kesehatan, Bencana Alam, Pendidikan, Panti Asuhan).
   - Kartu campaign responsif: foto cover jernih, badge kategori, judul singkat padat, nama penggalang dana (verified), progress bar warna brand, nominal terkumpul, sisa hari, dan jumlah donatur.
   - Section transparansi & kepercayaan (legalitas izin PUB, garansi penyaluran 100% tepat sasaran).
2. **Detail Campaign (`/c/[slug]`):**
   - Galeri foto utama.
   - Ringkasan progress target & donatur.
   - Tab navigasi:
     - **Cerita:** Narasi kebutuhan donasi, rincian penggunaan anggaran.
     - **Kabar Terbaru:** Catatan perkembangan dari penggalang dana.
     - **Donatur & Doa:** Daftar nama donatur, nominal, waktu, doa kebaikan, dan tombol "Aamiin" (dengan counter interaktif).
   - **Sticky Bottom Donate Bar:** Tombol "Donasi Sekarang" selalu terlihat di mobile dengan estimasi waktu checkout "< 1 Menit".
   - Tombol Share cepat ke WhatsApp, salin link, dan Facebook.

### 5.2 Alur Checkout Donasi (<60 Detik)
1. Donatur menekan "Donasi Sekarang" pada campaign.
2. Muncul modal / halaman checkout ringkas:
   - **Pilihan Nominal Cepat:** Chip Rp10.000, Rp25.000, Rp50.000, Rp100.000, Rp250.000, atau input nominal bebas dengan validasi minimum Rp1.000 dan pemformatan rupiah otomatis.
   - **Data Donatur:** Input Nama Lengkap (dengan checkbox "Sembunyikan nama saya / Hamba Allah"), Nomor WhatsApp aktif (format otomatis internasional 628xx), dan Email (opsional).
   - **Dukungan Doa:** Textarea doa atau kata penyemangat untuk penerima donasi.
3. Donatur menekan "Lanjut Pembayaran".
4. Backend membuat record donasi status `pending`, mengunci nomor CS WAHA (round-robin lalu sticky), membuat invoice Winpay, dan mengarahkan donatur ke halaman pembayaran Winpay.
5. Notifikasi WhatsApp "Donasi Dibuat" otomatis terkirim ke WhatsApp donatur berisi link pembayaran dan batas waktu.
6. Halaman menunggu konfirmasi pembayaran (`/donation/status/[id]`):
   - Polling berkala (5s -> 10s -> 20s) mengecek status pembayaran.
   - Saat lunas, tampil animasi ucapan terima kasih "Alhamdulillah, Donasi Berhasil!", doa yang ditulis donatur, serta ajakan membagikan campaign ke WhatsApp grup/keluarga.

### 5.3 Integrasi Winpay & Perhitungan Dana Bersih
- Webhook receiver `/webhooks/winpay/[secret]` menerima notifikasi pembayaran:
  - Membalas string respons `ACCEPTED` seketika.
  - Memeriksa idempotensi transaksi berdasarkan `invoiceRef`.
  - Mengupdate status donasi menjadi `paid`.
  - Menghitung potongan biaya:
    - `gatewayFee` (sesuai channel yang digunakan, misal Rp1.500 atau 0.7%).
    - `platformFee` = `5% x amount`.
    - `netAmount` = `amount - gatewayFee - platformFee`.
  - Mengupdate total terkumpul dan jumlah donatur pada campaign secara atomik.
  - Memicu pengiriman pesan WhatsApp "Donasi Sukses" dan membatalkan jadwal follow-up.

### 5.4 Mesin Notifikasi WhatsApp (WAHA)
- Mendukung koneksi multi-nomor CS WAHA.
- Algoritma Sticky CS: nomor CS yang mengontrak donasi saat pertama kali dibuat akan terus menjadi pengirim untuk update donasi tersebut.
- Template variabel otomatis: `{nama}`, `{nominal}`, `{campaign}`, `{link_bayar}`, `{batas_bayar}`, `{link_campaign}`, `{nama_situs}`.
- Pengingat follow up otomatis 2 jam jika donasi belum lunas.

### 5.5 Admin Dashboard
- **Halaman Overview:**
  - KPI Cards: Total Donasi Masuk, Dana Bersih Siap Disalurkan, Jumlah Donatur, Donasi Hari Ini.
  - Grafik tren pendapatan donasi bulanan dan mingguan.
  - Funnel konversi donatur (Kunjungan -> Checkout -> Pembayaran Sukses).
  - Monitoring operasional: Status koneksi WAHA, log webhook Winpay, campaign mendesak.
- **Manajemen Campaign:**
  - Pembuatan campaign langsung oleh admin.
  - Aksi publish, edit data, bekukan (freeze), atau tandai selesai.
- **Verifikasi Fundraiser:**
  - Review pengajuan fundraiser dari donatur terdaftar beserta dokumen identitas.
- **Daftar Donasi & Laporan:**
  - Tabel transaksi lengkap dengan pencarian, filter status, filter channel bayar, dan export CSV.
- **Branding & Tema White-Label:**
  - Form Nama Situs, Tagline, dan Upload Logo.
  - Color Picker interaktif 60/30/10 dengan pratinjau langsung tampilan HP dan verifikasi rasio kontras WCAG AA.
- **Pengaturan WhatsApp & Gateway:**
  - Manajemen sesi WAHA dengan tombol uji tes kirim pesan.
  - Manajemen kredensial Winpay (Sandbox/Production switch).

---

## 6. Rencana Pengujian & Kriteria Selesai (Definition of Done)

1. **Pengujian Alur Donasi:**
   - Donasi dari halaman campaign dapat diselesaikan tanpa login.
   - Pilihan nominal cepat dan input kustom berjalan dengan format angka yang benar.
   - Simulasi bayar Winpay berhasil mengubah status donasi menjadi `paid`.
   - Angka terkumpul pada campaign bertambah secara tepat.
2. **Pengujian Notifikasi:**
   - Log pesan WhatsApp mencatat pengiriman event donasi dibuat dan donasi sukses dengan variabel nama dan nominal yang sesuai.
3. **Pengujian White-Label & Tema:**
   - Mengubah warna brand atau nama situs di admin langsung memperbarui tampilan publik secara instan tanpa perlu rebuild kode.
   - Pemeriksaan kontras memberi peringatan visual jika warna aksen sulit dibaca.
4. **Verifikasi Kualitas Kode:**
   - Typecheck TypeScript (`svelte-check` / `tsc`) bebas dari error.
   - Beban aset ringan dan responsif di resolusi mobile 360px hingga desktop.
