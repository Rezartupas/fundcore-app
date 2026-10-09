import { db } from '$lib/server/db/index';
import { donations, campaigns } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.id, params.id))
    .limit(1);

  if (!donation) {
    throw error(404, 'Donasi tidak ditemukan');
  }

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, donation.campaignId))
    .limit(1);

  return {
    donation,
    campaign
  };
};
