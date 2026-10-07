import { describe, it, expect, beforeAll } from 'vitest';
import { actions as themeActions } from '../src/routes/admin/theme/+page.server.js';
import { actions as waActions } from '../src/routes/admin/whatsapp/+page.server.js';
import { actions as paymentActions } from '../src/routes/admin/payment/+page.server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { siteSettings, waAccounts, waSettings } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Admin Settings: White-Label Theme, WhatsApp & Payment', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('should update site settings and white-label branding colors', async () => {
    const formData = new FormData();
    formData.append('siteName', 'Yayasan Peduli Insan');
    formData.append('tagline', 'Bantu Sesama Bahagia');
    formData.append('colorBg', '#F1F5F9');
    formData.append('colorBrand', '#1E3A8A');
    formData.append('colorAccent', '#F97316');

    // @ts-expect-error mock request
    const res = (await themeActions.save({
      request: new Request('http://localhost', { method: 'POST', body: formData })
    })) as any;

    expect(res.success).toBe(true);

    const [updated] = await db.select().from(siteSettings).limit(1);
    expect(updated.siteName).toBe('Yayasan Peduli Insan');
    expect(updated.colorBrand).toBe('#1E3A8A');
    expect(updated.colorAccent).toBe('#F97316');

    // Reset back to FundCore defaults so other tests remain clean
    await db.update(siteSettings).set({
      siteName: 'FundCore',
      colorBrand: '#0A2540',
      colorAccent: '#F59E0B'
    });
  });

  it('should add a new WhatsApp CS account and update template', async () => {
    const testPhone = '0812' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const formData = new FormData();
    formData.append('label', 'CS Donasi Cabang');
    formData.append('phone', testPhone);
    formData.append('session', 'cs-cabang');

    // @ts-expect-error mock request
    const res = (await waActions.saveAccount({
      request: new Request('http://localhost', { method: 'POST', body: formData })
    })) as any;

    expect(res.success).toBe(true);

    const accounts = await db
      .select()
      .from(waAccounts)
      .where(eq(waAccounts.phone, testPhone));
    expect(accounts.length).toBe(1);
    expect(accounts[0].label).toBe('CS Donasi Cabang');
  });

  it('should save payment credentials environment setting', async () => {
    const formData = new FormData();
    formData.append('environment', 'production');

    // @ts-expect-error mock request
    const res = (await paymentActions.saveCredentials({
      request: new Request('http://localhost', { method: 'POST', body: formData })
    })) as any;

    expect(res.success).toBe(true);
    expect(res.environment).toBe('production');
  });
});
