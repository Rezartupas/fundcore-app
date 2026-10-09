import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { campaigns, donations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { quoteDonation } from '$lib/server/payment/pricing';
import { assignStickyWaAccount } from '$lib/server/whatsapp/waha';
import { notifyDonationEvent } from '$lib/server/whatsapp/notify';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  const {
    campaignId,
    amount,
    donorName,
    donorPhone,
    donorEmail,
    isAnonymous = false,
    prayer = ''
  } = body;

  if (!campaignId) {
    throw error(400, 'campaignId is required');
  }

  const numAmount = Number(amount);
  if (!numAmount || numAmount < 1000) {
    throw error(400, 'Nominal donasi minimal Rp 1.000');
  }

  // Validate phone format
  const cleanPhone = String(donorPhone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 9) {
    throw error(400, 'Nomor WhatsApp tidak valid (contoh: 08123456789)');
  }

  // Ensure campaign exists
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw error(404, 'Campaign tidak ditemukan');
  }

  // Sticky CS number locked to this donation (deterministic pick; see waha.ts)
  const assignedWaAccountId = await assignStickyWaAccount(cleanPhone);

  const donationId = 'don-' + Math.random().toString(36).slice(2, 10);
  const invoiceRef = 'INV-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const invoiceUrl = `/payment/simulate/${donationId}`;

  // Channel is unknown until payment; quote the documented default estimate.
  // The webhook overwrites all three with final values at settlement.
  const { platformFee, gatewayFee, netAmount } = quoteDonation(numAmount);

  const finalDonorName = isAnonymous ? 'Hamba Allah' : (donorName?.trim() || 'Hamba Allah');
  const now = new Date().toISOString();
  const expiredAt = new Date(Date.now() + 24 * 3600000).toISOString();

  await db.insert(donations).values({
    id: donationId,
    campaignId,
    donorName: finalDonorName,
    donorPhone: cleanPhone,
    donorEmail: donorEmail?.trim() || null,
    amount: numAmount,
    isAnonymous: Boolean(isAnonymous),
    prayer: prayer?.trim() || null,
    prayerAmenCount: 0,
    status: 'pending',
    channel: 'QRIS / Virtual Account',
    invoiceRef,
    invoiceUrl,
    gatewayFee,
    platformFee,
    netAmount,
    waAccountId: assignedWaAccountId,
    expiredAt,
    createdAt: now
  });

  // Record the "donasi dibuat" WhatsApp notification through the notify module
  if (assignedWaAccountId) {
    const [donationRow] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, donationId))
      .limit(1);

    if (donationRow) {
      await notifyDonationEvent({ donation: donationRow, campaign, type: 'created' });
    }
  }

  return json({
    success: true,
    donationId,
    invoiceRef,
    redirectUrl: invoiceUrl
  });
};
