import { db } from '$lib/server/db/index';
import { donations, campaigns, waMessages, waSettings } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { calculateDonationFees } from '$lib/server/payment/winpay';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  // PRD F-32: Endpoint must return plain text 'ACCEPTED'
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response('ACCEPTED', { status: 200 });
  }

  const invoiceRef = payload.ref || payload.invoice_ref || payload.merchant_ref;
  if (!invoiceRef) {
    return new Response('ACCEPTED', { status: 200 });
  }

  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.invoiceRef, invoiceRef))
    .limit(1);

  if (!donation) {
    return new Response('ACCEPTED', { status: 200 });
  }

  // Idempotency check: if already processed as paid, return immediately
  if (donation.status === 'paid') {
    return new Response('ACCEPTED', { status: 200 });
  }

  const paymentStatus = (payload.status || 'PAID').toUpperCase();

  if (paymentStatus === 'PAID') {
    const channel = payload.channel || 'QRIS';
    const fees = calculateDonationFees(donation.amount, channel);
    const actualGatewayFee = Number(payload.fee) || fees.gatewayFee;
    const actualNetAmount = Math.max(0, donation.amount - fees.platformFee - actualGatewayFee);
    const now = new Date().toISOString();

    // 1. Update donation status
    await db
      .update(donations)
      .set({
        status: 'paid',
        channel,
        gatewayFee: actualGatewayFee,
        platformFee: fees.platformFee,
        netAmount: actualNetAmount,
        paidAt: now
      })
      .where(eq(donations.id, donation.id));

    // 2. Atomically increment campaign totals
    await db
      .update(campaigns)
      .set({
        collectedAmount: sql`${campaigns.collectedAmount} + ${donation.amount}`,
        donorCount: sql`${campaigns.donorCount} + 1`
      })
      .where(eq(campaigns.id, donation.campaignId));

    // 3. Trigger WhatsApp "Donasi Sukses" message
    if (donation.waAccountId) {
      const [campaign] = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, donation.campaignId))
        .limit(1);

      const [templateRow] = await db
        .select()
        .from(waSettings)
        .where(eq(waSettings.type, 'success'))
        .limit(1);

      const successTemplate =
        templateRow?.template ||
        'Alhamdulillah, donasi Rp{nominal} untuk “{campaign}” sudah kami terima. Bantu sebarkan agar lebih banyak yang terbantu: {link_campaign}';

      const textPayload = successTemplate
        .replace('{nama}', donation.donorName)
        .replace('{nominal}', donation.amount.toLocaleString('id-ID'))
        .replace('{campaign}', campaign?.title || 'Program Kebaikan')
        .replace('{link_campaign}', `/c/${campaign?.slug || ''}`);

      await db.insert(waMessages).values({
        id: 'msg-' + Math.random().toString(36).slice(2, 10),
        donationId: donation.id,
        type: 'success',
        waAccountId: donation.waAccountId,
        toPhone: donation.donorPhone,
        payload: textPayload,
        status: 'sent',
        sentAt: now,
        createdAt: now
      });
    }
  } else if (paymentStatus === 'EXPIRED') {
    await db
      .update(donations)
      .set({ status: 'expired' })
      .where(eq(donations.id, donation.id));
  } else if (paymentStatus === 'FAILED') {
    await db
      .update(donations)
      .set({ status: 'failed' })
      .where(eq(donations.id, donation.id));
  }

  return new Response('ACCEPTED', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
};
