import { describe, it, expect, beforeAll } from 'vitest';
import { notifyDonationEvent } from '../src/lib/server/whatsapp/notify.js';
import { assignStickyWaAccount } from '../src/lib/server/whatsapp/waha.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, donations, waMessages } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('WhatsApp notify module', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('picks deterministically: same donor always lands on the same account', async () => {
    const first = await assignStickyWaAccount('081234567890');
    const second = await assignStickyWaAccount('081234567890');
    expect(first).not.toBeNull();
    expect(first).toBe(second);
  });

  it('records an interpolated created message with no leftover placeholders', async () => {
    const [campaign] = await db.select().from(campaigns).limit(1);
    const donationId = 'don-notify-' + Date.now();
    await db.insert(donations).values({
      id: donationId,
      campaignId: campaign.id,
      donorName: 'Donatur Uji Notify',
      donorPhone: '081277778888',
      amount: 50000,
      isAnonymous: false,
      status: 'pending',
      invoiceRef: 'INV-NOTIFY-' + Date.now(),
      invoiceUrl: `/payment/simulate/${donationId}`,
      expiredAt: new Date(Date.now() + 24 * 3600000).toISOString(),
      createdAt: new Date().toISOString()
    });

    const [row] = await db.select().from(donations).where(eq(donations.id, donationId));
    const result = await notifyDonationEvent({ donation: row, campaign, type: 'created' });
    expect(result.success).toBe(true);

    const [msg] = await db.select().from(waMessages).where(eq(waMessages.id, result.messageId));
    expect(msg.type).toBe('created');
    expect(msg.waAccountId).toBe(await assignStickyWaAccount('081277778888'));
    expect(msg.payload).toContain('Rp50.000');
    expect(msg.payload).toContain('Donatur Uji Notify');
    for (const key of ['{nama}', '{nominal}', '{campaign}', '{link_bayar}', '{batas_bayar}']) {
      expect(msg.payload).not.toContain(key);
    }
  });
});
