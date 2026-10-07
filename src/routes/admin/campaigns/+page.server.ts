import { db } from '$lib/server/db/index';
import { campaigns } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  const allCampaigns = await db
    .select()
    .from(campaigns)
    .orderBy(desc(campaigns.createdAt));

  return {
    campaigns: allCampaigns
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();
    const newStatus = data.get('status')?.toString();

    if (!id || !newStatus) {
      return { success: false, error: 'Parameter tidak lengkap' };
    }

    await db
      .update(campaigns)
      .set({ status: newStatus })
      .where(eq(campaigns.id, id));

    return { success: true };
  }
};
