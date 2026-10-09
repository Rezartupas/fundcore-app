import { describe, it, expect, beforeAll } from 'vitest';
import { quoteDonation } from '../src/lib/server/payment/pricing.js';
import { settlePaidDonation } from '../src/lib/server/payment/settle.js';
import { POST as webhookHandler } from '../src/routes/webhooks/winpay/[secret]/+server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, donations, waMessages } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Winpay Payment Integration & Webhook Handler', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('should calculate 5% platform fee and channel MDR correctly', () => {
    // 100.000 donation via QRIS
    const feesQris = quoteDonation(100000, 'QRIS');
    expect(feesQris.platformFee).toBe(5000); // 5% of 100k
    expect(feesQris.gatewayFee).toBe(700); // 0.7% of 100k
    expect(feesQris.netAmount).toBe(94300); // 100k - 5k - 700

    // 100.000 donation via Virtual Account
    const feesVa = quoteDonation(100000, 'BCA VA');
    expect(feesVa.platformFee).toBe(5000);
    expect(feesVa.gatewayFee).toBe(2500); // Flat Rp 2.500
    expect(feesVa.netAmount).toBe(92500);

    // Unknown channel → documented default estimate
    const feesDefault = quoteDonation(100000);
    expect(feesDefault.platformFee).toBe(5000);
    expect(feesDefault.gatewayFee).toBe(1500);
    expect(feesDefault.netAmount).toBe(93500);

    // Callback fee wins over the estimate (explicit 0 honored)
    const feesCallback = quoteDonation(100000, 'BSI', 0);
    expect(feesCallback.gatewayFee).toBe(0);
    expect(feesCallback.netAmount).toBe(95000);
  });

  it('should handle webhook PAID callback idempotently and update campaign totals', async () => {
    const [campaignBefore] = await db.select().from(campaigns).limit(1);
    const initialCollected = campaignBefore.collectedAmount;
    const initialDonors = campaignBefore.donorCount;

    // Create a pending test donation
    const testDonationId = 'don-test-' + Date.now();
    const testInvoiceRef = 'INV-TEST-' + Date.now();
    const donationAmount = 100000;

    await db.insert(donations).values({
      id: testDonationId,
      campaignId: campaignBefore.id,
      donorName: 'Donatur Uji Webhook',
      donorPhone: '081299998888',
      amount: donationAmount,
      isAnonymous: false,
      status: 'pending',
      invoiceRef: testInvoiceRef,
      invoiceUrl: `/payment/simulate/${testDonationId}`,
      createdAt: new Date().toISOString()
    });

    // 1. First webhook call
    const payload = {
      ref: testInvoiceRef,
      status: 'PAID',
      channel: 'QRIS',
      amount: donationAmount,
      fee: 700
    };

    const req1 = new Request('http://localhost/webhooks/winpay/secret123', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const res1 = await webhookHandler({ request: req1, params: { secret: 'secret123' } } as any);
    expect(res1.status).toBe(200);
    const text1 = await res1.text();
    expect(text1).toBe('ACCEPTED');

    // Verify donation became paid
    const [paidDonation] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, testDonationId));
    expect(paidDonation.status).toBe('paid');
    expect(paidDonation.netAmount).toBe(100000 - 5000 - 700);

    // Verify campaign totals incremented
    const [campaignAfter1] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignBefore.id));
    expect(campaignAfter1.collectedAmount).toBe(initialCollected + donationAmount);
    expect(campaignAfter1.donorCount).toBe(initialDonors + 1);

    // 2. Second webhook call (idempotency check)
    const req2 = new Request('http://localhost/webhooks/winpay/secret123', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const res2 = await webhookHandler({ request: req2, params: { secret: 'secret123' } } as any);
    expect(res2.status).toBe(200);
    const text2 = await res2.text();
    expect(text2).toBe('ACCEPTED');

    // Verify totals NOT double-incremented
    const [campaignAfter2] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignBefore.id));
    expect(campaignAfter2.collectedAmount).toBe(campaignAfter1.collectedAmount);
    expect(campaignAfter2.donorCount).toBe(campaignAfter1.donorCount);
  });

  it('settlePaidDonation reports outcomes without HTTP scaffolding', async () => {
    expect(await settlePaidDonation('INV-DOES-NOT-EXIST', {})).toBe('unknown-ref');
    // Seed donation don-1 is paid: repeat settlement is a no-op report
    expect(await settlePaidDonation('INV-20261001-001', {})).toBe('already-paid');
  });
});
