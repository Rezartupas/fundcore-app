import { db } from '$lib/server/db/index';
import { donations, campaigns } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allDonations = await db
    .select({
      id: donations.id,
      invoiceRef: donations.invoiceRef,
      donorName: donations.donorName,
      donorPhone: donations.donorPhone,
      amount: donations.amount,
      gatewayFee: donations.gatewayFee,
      platformFee: donations.platformFee,
      netAmount: donations.netAmount,
      channel: donations.channel,
      status: donations.status,
      campaignId: donations.campaignId,
      paidAt: donations.paidAt,
      createdAt: donations.createdAt
    })
    .from(donations)
    .orderBy(desc(donations.createdAt));

  const allCampaigns = await db.select({ id: campaigns.id, title: campaigns.title }).from(campaigns);
  const campMap = Object.fromEntries(allCampaigns.map((c) => [c.id, c.title]));

  const enrichedDonations = allDonations.map((d) => ({
    ...d,
    campaignTitle: campMap[d.campaignId] || 'Program Kebaikan'
  }));

  return {
    donations: enrichedDonations
  };
};
