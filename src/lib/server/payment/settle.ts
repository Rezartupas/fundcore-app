import { db } from '$lib/server/db/index';
import { campaigns, donations } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { quoteDonation } from './pricing.js';
import { notifyDonationEvent } from '../whatsapp/notify.js';

export type SettleOutcome = 'paid' | 'already-paid' | 'unknown-ref';

// Settles a PAID callback: idempotent status transition, fee quote with
// callback-fee-wins, atomic campaign totals, success notification.
// The webhook stays a thin HTTP shell: parse ref → call → ACCEPTED.
export async function settlePaidDonation(
  invoiceRef: string,
  payload: { channel?: string; fee?: number | string }
): Promise<SettleOutcome> {
  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.invoiceRef, invoiceRef))
    .limit(1);

  if (!donation) return 'unknown-ref';
  if (donation.status === 'paid') return 'already-paid';

  const channel = payload.channel || 'QRIS';
  const fees = quoteDonation(donation.amount, channel, payload.fee == null ? undefined : Number(payload.fee));
  const now = new Date().toISOString();

  // 1. Update donation status
  await db
    .update(donations)
    .set({
      status: 'paid',
      channel,
      gatewayFee: fees.gatewayFee,
      platformFee: fees.platformFee,
      netAmount: fees.netAmount,
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

  // 3. Trigger WhatsApp "Donasi Sukses" message through the notify module
  if (donation.waAccountId) {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, donation.campaignId))
      .limit(1);

    await notifyDonationEvent({
      donation: {
        ...donation,
        status: 'paid',
        gatewayFee: fees.gatewayFee,
        platformFee: fees.platformFee,
        netAmount: fees.netAmount,
        paidAt: now
      },
      campaign: campaign ?? null,
      type: 'success'
    });
  }

  return 'paid';
}
