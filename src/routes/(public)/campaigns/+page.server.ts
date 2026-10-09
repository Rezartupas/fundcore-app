import { getActiveCampaigns } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { campaigns: await getActiveCampaigns() };
};
