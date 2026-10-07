import { describe, it, expect, beforeAll } from 'vitest';
import { interpolateTemplate } from '../src/lib/server/whatsapp/templates.js';
import {
  formatChatId,
  assignStickyWaAccount,
  sendWahaMessage,
  testWahaConnection
} from '../src/lib/server/whatsapp/waha.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { waMessages } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('WhatsApp (WAHA) Notification Engine & Sticky CS Router', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('should interpolate template variables correctly', () => {
    const rawTemplate =
      'Halo {nama}, terima kasih berdonasi Rp{nominal} untuk "{campaign}". Batas: {batas_bayar}. Link: {link_bayar}';

    const output = interpolateTemplate(rawTemplate, {
      nama: 'Budi Santoso',
      nominal: 50000,
      campaign: 'Bantu Balita Sakit',
      batas_bayar: '23:59 WIB',
      link_bayar: 'https://fundcore.app/pay/123'
    });

    expect(output).toContain('Halo Budi Santoso');
    expect(output).toContain('Rp50.000');
    expect(output).toContain('"Bantu Balita Sakit"');
    expect(output).toContain('23:59 WIB');
    expect(output).toContain('https://fundcore.app/pay/123');
  });

  it('should format Indonesian phone numbers into WAHA chatId format', () => {
    expect(formatChatId('08123456789')).toBe('628123456789@c.us');
    expect(formatChatId('628123456789')).toBe('628123456789@c.us');
    expect(formatChatId('+62 812-3456-789')).toBe('628123456789@c.us');
  });

  it('should assign an active CS account and log outgoing message', async () => {
    const assignedAccountId = await assignStickyWaAccount();
    expect(assignedAccountId).toBeDefined();

    const sendRes = await sendWahaMessage({
      donationId: 'don-sticky-test',
      type: 'success',
      waAccountId: assignedAccountId,
      toPhone: '081298765432',
      text: 'Pesan konfirmasi donasi sukses'
    });

    expect(sendRes.success).toBe(true);

    const [logged] = await db
      .select()
      .from(waMessages)
      .where(eq(waMessages.id, sendRes.messageId));

    expect(logged).toBeDefined();
    expect(logged.waAccountId).toBe(assignedAccountId);
    expect(logged.type).toBe('success');
    expect(logged.payload).toBe('Pesan konfirmasi donasi sukses');
  });

  it('should test connection status for a valid WA account', async () => {
    const accountId = await assignStickyWaAccount();
    expect(accountId).not.toBeNull();

    const conn = await testWahaConnection(accountId!);
    expect(conn.connected).toBe(true);
    expect(conn.phone).toBeDefined();
  });
});
