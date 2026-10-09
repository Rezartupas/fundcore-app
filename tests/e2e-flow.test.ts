import { describe, it, expect, beforeAll } from 'vitest';
import { load as loadHome } from '../src/routes/(public)/+page.server.js';
import { load as loadDetail } from '../src/routes/(public)/c/[slug]/+page.server.js';
import { POST as createDonationApi } from '../src/routes/api/donations/+server.js';
import { POST as webhookWinpayApi } from '../src/routes/webhooks/winpay/[secret]/+server.js';
import { GET as getStatusApi } from '../src/routes/api/donations/[id]/status/+server.js';
import { load as loadAdminOverview } from '../src/routes/admin/+page.server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, donations, waMessages } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('End-to-End Full User & Admin Flow Verification', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('completes the entire end-to-end journey from browsing to donation, payment callback, whatsapp notification, and admin monitoring', async () => {
    // 1. Visitor opens homepage
    // @ts-expect-error mock event
    const homeData = (await loadHome({})) as any;
    expect(homeData.campaigns.length).toBeGreaterThan(0);
    const chosenCampaign = homeData.campaigns[0];

    // 2. Visitor views campaign detail page
    // @ts-expect-error mock event
    const detailData = (await loadDetail({ params: { slug: chosenCampaign.slug } })) as any;
    expect(detailData.campaign.id).toBe(chosenCampaign.id);

    const initialCollected = chosenCampaign.collectedAmount;
    const initialDonors = chosenCampaign.donorCount;
    const donationAmount = 150000;

    // 3. Visitor initiates instant donation checkout (<60s)
    const donateReq = new Request('http://localhost/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: chosenCampaign.id,
        amount: donationAmount,
        donorName: 'Dr. Hendra Wijaya',
        donorPhone: '081288887777',
        donorEmail: 'hendra@example.com',
        isAnonymous: false,
        prayer: 'Semoga segera diberikan kesembuhan dan kelapangan rezeki.'
      })
    });

    const createRes = await createDonationApi({ request: donateReq } as any);
    expect(createRes.status).toBe(200);
    const createJson = await createRes.json();
    expect(createJson.success).toBe(true);
    expect(createJson.donationId).toBeDefined();
    expect(createJson.invoiceRef).toBeDefined();

    // 4. Verify initial WhatsApp notification "donasi dibuat" was dispatched
    const initialWaMsgs = await db
      .select()
      .from(waMessages)
      .where(eq(waMessages.donationId, createJson.donationId));
    expect(initialWaMsgs.length).toBeGreaterThanOrEqual(1);
    expect(initialWaMsgs[0].type).toBe('created');
    expect(initialWaMsgs[0].payload).toContain('150.000');

    // 5. Visitor is redirected to payment gateway (Winpay checkout) & completes payment
    const webhookReq = new Request('http://localhost/webhooks/winpay/production-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: createJson.invoiceRef,
        status: 'PAID',
        channel: 'QRIS',
        amount: donationAmount,
        fee: 1050
      })
    });

    const webhookRes = await webhookWinpayApi({
      request: webhookReq,
      params: { secret: 'production-secret' }
    } as any);
    expect(webhookRes.status).toBe(200);
    const webhookText = await webhookRes.text();
    expect(webhookText).toBe('ACCEPTED');

    // 6. Visitor checks donation status via polling API
    const statusRes = await getStatusApi({ params: { id: createJson.donationId } } as any);
    expect(statusRes.status).toBe(200);
    const statusJson = await statusRes.json();
    expect(statusJson.status).toBe('paid');

    // 7. Verify atomic update in campaign table
    const [updatedCampaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, chosenCampaign.id));
    expect(updatedCampaign.collectedAmount).toBe(initialCollected + donationAmount);
    expect(updatedCampaign.donorCount).toBe(initialDonors + 1);

    // 8. Verify "donasi sukses" WhatsApp notification was recorded
    const successWaMsgs = await db
      .select()
      .from(waMessages)
      .where(eq(waMessages.donationId, createJson.donationId));
    const successMsg = successWaMsgs.find((m) => m.type === 'success');
    expect(successMsg).toBeDefined();
    expect(successMsg?.payload).toContain('150.000');

    // 9. Admin checks overview dashboard and sees updated transaction
    // @ts-expect-error mock event
    const adminOverview = (await loadAdminOverview({})) as any;
    expect(adminOverview.metrics.totalGross).toBeGreaterThanOrEqual(donationAmount);
    expect(adminOverview.metrics.paidDonationCount).toBeGreaterThanOrEqual(1);
    expect(adminOverview.channelBreakdown.length).toBeGreaterThan(0);
  });
});
