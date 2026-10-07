import { db } from '$lib/server/db/index';
import { campaigns, donations } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.status, 'active'))
    .orderBy(desc(campaigns.isUrgent), desc(campaigns.createdAt));

  const totalCollected = allCampaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalDonors = allCampaigns.reduce((acc, c) => acc + c.donorCount, 0);
  const urgentCount = allCampaigns.filter((c) => c.isUrgent).length;

  return {
    campaigns: allCampaigns,
    stats: {
      totalCollected,
      totalDonors,
      totalCampaigns: allCampaigns.length,
      urgentCount
    }
  };
};
