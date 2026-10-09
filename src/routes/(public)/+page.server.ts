import { getActiveCampaigns, getRecentUpdates } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allCampaigns = await getActiveCampaigns();

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
    },
    updates: await getRecentUpdates(4)
  };
};
