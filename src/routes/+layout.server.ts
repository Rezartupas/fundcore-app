import { db } from '$lib/server/db/index';
import { siteSettings } from '$lib/server/db/schema';
import { seedDb } from '$lib/server/db/seed';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  await seedDb();
  const [settings] = await db.select().from(siteSettings).limit(1);

  return {
    settings: settings || {
      siteName: 'FundCore',
      tagline: 'Platform Penggalangan Dana & Donasi Cepat Terpercaya',
      logoUrl: '/fundcore-logo.png',
      faviconUrl: '/favicon.svg',
      colorBg: '#F8FAFC',
      colorBrand: '#0A2540',
      colorAccent: '#F59E0B',
      orgName: 'Yayasan FundCore Peduli Indonesia',
      orgAddress: 'Jl. TB Simatupang No. 18, Jakarta Selatan',
      orgPhone: '0812-3456-7890',
      legalSk: 'SK Kemenkumham RI: AHU-0012345.AH.01.04.Tahun 2024'
    }
  };
};
