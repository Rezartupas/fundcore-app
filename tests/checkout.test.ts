import { describe, it, expect, beforeAll } from 'vitest';
import { POST } from '../src/routes/api/donations/+server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, donations, waMessages } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Instant Donation Checkout API (POST /api/donations)', () => {
  let sampleCampaignId: string;

  beforeAll(async () => {
    await initDb();
    await seedDb();
    const [c] = await db.select().from(campaigns).limit(1);
    sampleCampaignId = c.id;
  });

  it('should reject donation with nominal < 1000', async () => {
    const req = new Request('http://localhost/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: sampleCampaignId,
        amount: 500,
        donorPhone: '08123456789'
      })
    });

    await expect(POST({ request: req } as any)).rejects.toThrow();
  });

  it('should reject donation with invalid phone format', async () => {
    const req = new Request('http://localhost/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: sampleCampaignId,
        amount: 50000,
        donorPhone: 'abc'
      })
    });

    await expect(POST({ request: req } as any)).rejects.toThrow();
  });

  it('should create pending donation and log initial WhatsApp message', async () => {
    const req = new Request('http://localhost/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: sampleCampaignId,
        amount: 75000,
        donorName: 'Ahmad Fauzi',
        donorPhone: '081298765432',
        isAnonymous: false,
        prayer: 'Semoga berkah dan lekas tersalurkan'
      })
    });

    const res = await POST({ request: req } as any);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.donationId).toBeDefined();
    expect(json.redirectUrl).toContain('/payment/simulate/');

    // Check database persistence
    const [saved] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, json.donationId));
    expect(saved).toBeDefined();
    expect(saved.amount).toBe(75000);
    expect(saved.status).toBe('pending');
    expect(saved.platformFee).toBe(Math.round(75000 * 0.05));

    // Check WhatsApp message created
    const msgs = await db
      .select()
      .from(waMessages)
      .where(eq(waMessages.donationId, json.donationId));
    expect(msgs.length).toBeGreaterThanOrEqual(1);
    expect(msgs[0].type).toBe('created');
    expect(msgs[0].payload).toContain('Ahmad Fauzi');
  });
});
