import { db, initDb } from './index.js';
import {
  siteSettings,
  campaigns,
  campaignUpdates,
  donations,
  waAccounts,
  waSettings
} from './schema.js';
import { eq, count } from 'drizzle-orm';
import { DEFAULT_SETTINGS } from '../theme.js';

export async function seedDb() {
  await initDb();

  // Check if site_settings exists
  const [existingSettings] = await db.select().from(siteSettings).limit(1);
  if (!existingSettings) {
    await db.insert(siteSettings).values({
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString()
    });
  }

  // Check if campaigns exist
  const [campaignCount] = await db.select({ total: count() }).from(campaigns);
  if (campaignCount.total === 0) {
    const sampleCampaigns = [
      {
        id: 'camp-1',
        slug: 'bantu-bayi-arsyila-operasi-jantung-bocor',
        ownerId: 'admin',
        title: 'Bantu Bayi Arsyila Bertahan Melawan Jantung Bocor Kompleks',
        category: 'Medis & Kesehatan',
        targetAmount: 85000000,
        collectedAmount: 48500000,
        donorCount: 312,
        durationDays: 24,
        startAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 24 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
        story: `Bayi Arsyila (8 bulan) lahir dengan kelainan jantung bawaan (Tetralogy of Fallot) dan defek septum ventrikel. Di usianya yang masih sangat mungil, ia sering mengalami sianosis (tubuh membiru) saat menangis karena kekurangan oksigen.

Ayah Arsyila bekerja sebagai buruh harian lepas dengan penghasilan Rp 50.000 per hari, sementara sang ibu merawat Arsyila penuh waktu. Biaya operasi rekonstruksi katup jantung dan ruang rawat intensif NICU/PICU pasca-operasi mencapai puluhan juta rupiah di luar tanggungan jaminan kesehatan.

Mari ulurkan tangan kita untuk menghadirkan nafas lega bagi Arsyila agar ia dapat tumbuh menjadi anak yang ceria dan sehat.`,
        beneficiaryName: 'Arsyila Nur Ramadhani (8 Bulan)',
        status: 'active',
        isUrgent: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp-2',
        slug: 'darurat-banjir-bandang-cianjur-selatan',
        ownerId: 'admin',
        title: 'Darurat Tanggap Bencana: Bantu Warga Terdampak Banjir Bandang',
        category: 'Bencana Alam',
        targetAmount: 120000000,
        collectedAmount: 78250000,
        donorCount: 540,
        durationDays: 14,
        startAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 14 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
        story: `Hujan berintensitas tinggi memicu banjir bandang dan longsor di wilayah pedesaan Cianjur Selatan. Ratusan kepala keluarga terpaksa mengungsi ke posko darurat dengan fasilitas terbatas.

Kebutuhan mendesak saat ini:
1. Paket pangan darurat & air mineral bersih
2. Selimut tebal, popok bayi, dan obat-obatan dasar
3. Dapur umum dan hygiene kit untuk lansia serta anak-anak

Tim relawan FundCore Peduli telah berada di lokasi untuk menyalurkan amanah donasi secara langsung kepada warga terdampak.`,
        beneficiaryName: 'Warga Pengungsi Desa Cibitung, Cianjur',
        status: 'active',
        isUrgent: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp-3',
        slug: 'beasiswa-anak-yatim-penghafal-al-quran',
        ownerId: 'admin',
        title: 'Sedekah Jariyah: Beasiswa Pendidikan 50 Yatim Penghafal Qur\'an',
        category: 'Pendidikan & Yatim',
        targetAmount: 50000000,
        collectedAmount: 32100000,
        donorCount: 228,
        durationDays: 35,
        startAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 35 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        story: `Pondok Pesantren Darul Aytam membina 50 santri yatim dan dhuafa yang bercita-cita menjadi hafidz Qur'an dan melanjutkan jenjang pendidikan formal.

Donasi Anda akan disalurkan untuk:
- Biaya SPP sekolah & seragam lengkap
- Kitab & mushaf Al-Qur'an hafalan
- Biaya konsumsi bergizi harian para santri

Setiap huruf yang mereka lantunkan dan setiap ilmu yang mereka amalkan akan menjadi pahala jariyah yang mengalir tanpa henti untuk para donatur.`,
        beneficiaryName: 'Santri Yatim Pesantren Darul Aytam',
        status: 'active',
        isUrgent: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp-4',
        slug: 'bangun-jembatan-gantung-pelosok-lebak',
        ownerId: 'admin',
        title: 'Bangun Jembatan Gantung Aman untuk Anak Sekolah Pedalaman',
        category: 'Infrastruktur Pedesaan',
        targetAmount: 65000000,
        collectedAmount: 21500000,
        donorCount: 145,
        durationDays: 45,
        startAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 45 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
        story: `Setiap pagi, lebih dari 80 anak-anak SD di pelosok Lebak Banten harus bertaruh nyawa menyeberangi sungai deras beralaskan seutas kawat tali lapuk. Saat musim hujan tiba dan debit air meluap, sekolah terpaksa diliburkan karena arus yang terlalu membahayakan.

Bersama program Jembatan Kebaikan FundCore, kita akan membangun jembatan gantung permanen berstandar teknis kuat agar generasi penerus dapat menuntut ilmu dengan rasa aman dan nyaman.`,
        beneficiaryName: 'Warga & Pelajar Desa Cidadap',
        status: 'active',
        isUrgent: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp-5',
        slug: 'bantu-kakek-sardi-penjual-sapu-lidi',
        ownerId: 'admin',
        title: 'Bantu Pengobatan Kanker Tulang Kakek Sardi Penjual Sapu Lidi',
        category: 'Lansia Dhuafa',
        targetAmount: 30000000,
        collectedAmount: 28400000,
        donorCount: 198,
        durationDays: 8,
        startAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 8 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
        story: `Kakek Sardi (73 tahun) tetap memanggul puluhan kilogram sapu lidi keliling kota sejauh 12 km setiap hari, meski kakinya membengkak parah akibat osteosarcoma. Beliau hidup sebatang kara di gubuk kontrakan sempit.

Target dana akan digunakan untuk operasi pengangkatan massa tumor, obat penunjang kemoterapi, dan modal usaha sembako di rumah agar beliau tidak perlu lagi berjalan kaki di hari tuanya.`,
        beneficiaryName: 'Kakek Sardi (73 Tahun)',
        status: 'active',
        isUrgent: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp-6',
        slug: 'air-bersih-kekeringan-gunung-kidul',
        ownerId: 'admin',
        title: 'Alirkan Air Bersih untuk 300 Keluarga Terdampak Kekeringan',
        category: 'Kemanusiaan',
        targetAmount: 40000000,
        collectedAmount: 18200000,
        donorCount: 110,
        durationDays: 30,
        startAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        endAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
        story: `Musim kemarau panjang membuat sumur-sumur warga di perbukitan Gunung Kidul mengering total. Warga harus membeli air tangki seharga Rp 250.000 per tangki, yang menghabiskan hampir separuh dari pendapatan bulanan mereka.

Program ini mencakup pipanisasi dari sumber mata air bawah tanah dan pengadaan bak penampungan air komunal untuk 3 dusun binaan.`,
        beneficiaryName: 'Warga Dusun Ngringin, Paliyan',
        status: 'active',
        isUrgent: false,
        createdAt: new Date().toISOString()
      }
    ];

    for (const c of sampleCampaigns) {
      await db.insert(campaigns).values(c);
    }

    // Add sample updates for camp-1
    await db.insert(campaignUpdates).values({
      id: 'upd-1',
      campaignId: 'camp-1',
      title: 'Pemeriksaan Awal & Penjadwalan Ruang Operasi',
      body: 'Alhamdulillah, berkat donasi tahap pertama dari #OrangBaik, Arsyila telah menjalani evaluasi ekokardiografi lanjutan di RS Jantung Nasional. Jadwal tindakan operasi dijadwalkan pekan depan.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    });

    // Add realistic sample donations with prayers
    const sampleDonations = [
      {
        id: 'don-1',
        campaignId: 'camp-1',
        donorName: 'Hamba Allah',
        donorPhone: '081298765432',
        amount: 100000,
        isAnonymous: true,
        prayer: 'Semoga adik Arsyila lekas sembuh, diberikan kekuatan untuk kedua orang tua, dan menjadi anak sholihah penyejuk hati keluarga.',
        prayerAmenCount: 14,
        status: 'paid',
        channel: 'QRIS',
        invoiceRef: 'INV-20261001-001',
        invoiceUrl: '/payment/simulate/don-1',
        gatewayFee: 700,
        platformFee: 5000,
        netAmount: 94300,
        paidAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
      },
      {
        id: 'don-2',
        campaignId: 'camp-1',
        donorName: 'Rizky Pratama',
        donorPhone: '081345678912',
        amount: 250000,
        isAnonymous: false,
        prayer: 'Bismillah, sedikit rezeki untuk kesembuhan adik Arsyila. Doa terbaik dari kami sekeluarga.',
        prayerAmenCount: 9,
        status: 'paid',
        channel: 'BCA VA',
        invoiceRef: 'INV-20261001-002',
        invoiceUrl: '/payment/simulate/don-2',
        gatewayFee: 2000,
        platformFee: 12500,
        netAmount: 235500,
        paidAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        id: 'don-3',
        campaignId: 'camp-1',
        donorName: 'Ibu Ratna Dewi',
        donorPhone: '085712345678',
        amount: 50000,
        isAnonymous: false,
        prayer: 'Semoga Allah angkat segala penyakitnya dan digantikan dengan kesehatan yang paripurna. Aamiin ya Rabbal alamin.',
        prayerAmenCount: 22,
        status: 'paid',
        channel: 'GoPay',
        invoiceRef: 'INV-20261001-003',
        invoiceUrl: '/payment/simulate/don-3',
        gatewayFee: 1000,
        platformFee: 2500,
        netAmount: 46500,
        paidAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
      }
    ];

    for (const d of sampleDonations) {
      await db.insert(donations).values(d);
    }
  }

  // Ensure default WA settings & accounts exist
  const [waAccCount] = await db.select({ total: count() }).from(waAccounts);
  if (waAccCount.total === 0) {
    await db.insert(waAccounts).values({
      id: 'wa-acc-1',
      label: 'Customer Service 1 (Utama)',
      baseUrl: 'https://waha.domainanda.com',
      session: 'cs-utama',
      apiKey: 'sec_waha_demo_token_123',
      phone: '081299990001',
      status: 'connected',
      isActive: true,
      lastCheckedAt: new Date().toISOString()
    });
  }

  const [waSetCreated] = await db.select().from(waSettings).where(eq(waSettings.type, 'created'));
  if (!waSetCreated) {
    await db.insert(waSettings).values({
      type: 'created',
      isActive: true,
      template: 'Halo {nama}, terima kasih atas niat mulia Anda berdonasi Rp{nominal} untuk "{campaign}". Silakan selesaikan pembayaran sebelum {batas_bayar} melalui tautan ini: {link_bayar}',
      delayMinutes: 0
    });
  }

  const [waSetSuccess] = await db.select().from(waSettings).where(eq(waSettings.type, 'success'));
  if (!waSetSuccess) {
    await db.insert(waSettings).values({
      type: 'success',
      isActive: true,
      template: 'Alhamdulillah {nama}, donasi sebesar Rp{nominal} untuk "{campaign}" telah kami terima dengan sukses. Semoga menjadi amal jariyah yang berlipat ganda. Anda dapat membagikan kebaikan ini: {link_campaign}',
      delayMinutes: 0
    });
  }

  const [waSetFollowup] = await db.select().from(waSettings).where(eq(waSettings.type, 'followup'));
  if (!waSetFollowup) {
    await db.insert(waSettings).values({
      type: 'followup',
      isActive: true,
      template: 'Halo {nama}, donasi Anda sebesar Rp{nominal} untuk "{campaign}" masih menunggu pembayaran. Jangan biarkan kesempatan berbuat baik ini terlewat. Lanjutkan di sini: {link_bayar}',
      delayMinutes: 120
    });
  }
}
