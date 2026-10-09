import { db } from '$lib/server/db/index';
import { siteSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { loadTheme, validateThemeColors } from '$lib/server/theme';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  return {
    settings: await loadTheme()
  };
};

export const actions: Actions = {
  save: async ({ request }) => {
    const data = await request.formData();

    const siteName = data.get('siteName')?.toString().trim();
    const tagline = data.get('tagline')?.toString().trim();
    const logoUrl = data.get('logoUrl')?.toString().trim();
    const colorBg = data.get('colorBg')?.toString().trim();
    const colorBrand = data.get('colorBrand')?.toString().trim();
    const colorAccent = data.get('colorAccent')?.toString().trim();
    const orgName = data.get('orgName')?.toString().trim();
    const orgAddress = data.get('orgAddress')?.toString().trim();
    const orgPhone = data.get('orgPhone')?.toString().trim();
    const legalSk = data.get('legalSk')?.toString().trim();

    if (!siteName || !colorBrand || !colorAccent) {
      return fail(400, { error: 'Nama situs dan warna wajib diisi' });
    }

    const [existing] = await db.select().from(siteSettings).limit(1);
    const now = new Date().toISOString();

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          siteName,
          tagline: tagline || existing.tagline,
          logoUrl: logoUrl || existing.logoUrl,
          colorBg: colorBg || existing.colorBg,
          colorBrand,
          colorAccent,
          orgName: orgName || existing.orgName,
          orgAddress: orgAddress || existing.orgAddress,
          orgPhone: orgPhone || existing.orgPhone,
          legalSk: legalSk || existing.legalSk,
          updatedAt: now
        })
        .where(eq(siteSettings.id, existing.id));
    }

    return { success: true, warning: validateThemeColors({ colorBrand, colorAccent }).join(' ') || undefined };
  }
};
