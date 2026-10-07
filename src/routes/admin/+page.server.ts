import { db } from '$lib/server/db/index';
import { campaigns, donations, waAccounts, waMessages } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allCampaigns = await db.select().from(campaigns);
  const allDonations = await db.select().from(donations);
  const activeCsAccounts = await db.select().from(waAccounts);

  const paidDonations = allDonations.filter((d) => d.status === 'paid');

  const totalGross = paidDonations.reduce((acc, d) => acc + d.amount, 0);
  const totalNet = paidDonations.reduce((acc, d) => acc + d.netAmount, 0);
  const totalPlatformFee = paidDonations.reduce((acc, d) => acc + d.platformFee, 0);
  const totalGatewayFee = paidDonations.reduce((acc, d) => acc + d.gatewayFee, 0);

  const uniqueDonorsCount = new Set(paidDonations.map((d) => d.donorPhone)).size;
  const averageDonation = paidDonations.length > 0 ? Math.round(totalGross / paidDonations.length) : 0;

  // Channel breakdown
  const channelMap: Record<string, number> = {};
  for (const d of paidDonations) {
    const ch = d.channel || 'QRIS';
    channelMap[ch] = (channelMap[ch] || 0) + d.amount;
  }

  // Top campaigns by collected amount
  const topCampaigns = [...allCampaigns]
    .sort((a, b) => b.collectedAmount - a.collectedAmount)
    .slice(0, 5);

  return {
    metrics: {
      totalGross,
      totalNet,
      totalPlatformFee,
      totalGatewayFee,
      uniqueDonorsCount,
      paidDonationCount: paidDonations.length,
      averageDonation,
      activeCampaignsCount: allCampaigns.filter((c) => c.status === 'active').length
    },
    channelBreakdown: Object.entries(channelMap).map(([channel, total]) => ({
      channel,
      total,
      percentage: totalGross > 0 ? Math.round((total / totalGross) * 100) : 0
    })),
    topCampaigns,
    operational: {
      activeCsCount: activeCsAccounts.filter((a) => a.isActive).length,
      totalCsCount: activeCsAccounts.length,
      recentDonations: allDonations.slice(-5).reverse()
    }
  };
};
