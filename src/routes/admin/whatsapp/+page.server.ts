import { db } from '$lib/server/db/index';
import { waAccounts, waSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { testWahaConnection } from '$lib/server/whatsapp/waha';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  const accounts = await db.select().from(waAccounts);
  const settings = await db.select().from(waSettings);

  return {
    accounts,
    settings
  };
};

export const actions: Actions = {
  saveAccount: async ({ request }) => {
    const data = await request.formData();
    const label = data.get('label')?.toString().trim();
    const baseUrl = data.get('baseUrl')?.toString().trim();
    const session = data.get('session')?.toString().trim();
    const apiKey = data.get('apiKey')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();

    if (!label || !phone) {
      return { success: false, error: 'Label dan nomor WhatsApp wajib diisi' };
    }

    const accountId = 'wa-acc-' + Math.random().toString(36).slice(2, 8);
    await db.insert(waAccounts).values({
      id: accountId,
      label,
      baseUrl: baseUrl || 'https://waha.domainanda.com',
      session: session || 'default',
      apiKey: apiKey || '',
      phone,
      status: 'connected',
      isActive: true,
      lastCheckedAt: new Date().toISOString()
    });

    return { success: true };
  },

  updateTemplate: async ({ request }) => {
    const data = await request.formData();
    const type = data.get('type')?.toString();
    const template = data.get('template')?.toString();
    const isActive = data.get('isActive') === 'on';

    if (!type || !template) {
      return { success: false, error: 'Template tidak boleh kosong' };
    }

    await db
      .update(waSettings)
      .set({ template, isActive })
      .where(eq(waSettings.type, type));

    return { success: true };
  },

  testPing: async ({ request }) => {
    const data = await request.formData();
    const accountId = data.get('accountId')?.toString();

    if (!accountId) {
      return { success: false, error: 'Account ID tidak ditemukan' };
    }

    const testRes = await testWahaConnection(accountId);
    return { success: true, connected: testRes.connected, phone: testRes.phone };
  }
};
