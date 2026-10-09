import { db } from '$lib/server/db/index';
import { siteSettings } from '$lib/server/db/schema';
import { getRecommendedTextColor, validateWcagAA } from '$lib/theme/contrast';

export type ThemeSettings = Omit<typeof siteSettings.$inferSelect, 'id' | 'updatedAt'>;

// Canonical defaults (were scattered across seed.ts, +layout.server.ts and
// admin/theme/+page.server.ts with drift in tagline/org/legal copy).
// Seed's copy won: most complete, already 1:1 with the layout loader.
export const DEFAULT_SETTINGS: ThemeSettings = {
  siteName: 'FundCore',
  tagline: 'Platform Penggalangan Dana & Donasi Cepat Terpercaya',
  logoUrl: '/fundcore-logo.png',
  faviconUrl: '/favicon.svg',
  colorBg: '#F8FAFC',
  colorBrand: '#0A2540',
  colorAccent: '#F59E0B',
  orgName: 'Yayasan FundCore Peduli Indonesia',
  orgAddress: 'Jl. TB Simatupang No. 18, Jakarta Selatan 12520',
  orgPhone: '0812-3456-7890',
  legalSk: 'SK Kemenkumham RI: AHU-0012345.AH.01.04.Tahun 2024 | Izin PUB Kemensos: 882/HUK-PS/2026'
};

export async function loadTheme(): Promise<ThemeSettings> {
  const [settings] = await db.select().from(siteSettings).limit(1);
  if (!settings) return DEFAULT_SETTINGS;
  const { id, updatedAt, ...theme } = settings;
  return theme;
}

// Server-side readability check (PRD F-52), mirroring the admin live
// preview: white text on brand, recommended text on accent. Returns one
// warning string per failing pair; empty means AA-clean.
export function validateThemeColors(colors: { colorBrand: string; colorAccent: string }): string[] {
  const warnings: string[] = [];

  const brand = validateWcagAA('#FFFFFF', colors.colorBrand);
  if (!brand.passed) {
    warnings.push(
      `Teks putih di atas warna brand (${colors.colorBrand}) hanya ${brand.ratio}:1, minimal ${brand.minRatio}:1 (WCAG AA).`
    );
  }

  const accentText = getRecommendedTextColor(colors.colorAccent);
  const accent = validateWcagAA(colors.colorAccent, accentText);
  if (!accent.passed) {
    warnings.push(
      `Teks di atas warna aksen (${colors.colorAccent}) hanya ${accent.ratio}:1, minimal ${accent.minRatio}:1 (WCAG AA).`
    );
  }

  return warnings;
}
