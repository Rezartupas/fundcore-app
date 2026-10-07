import { db } from '$lib/server/db/index';
import { campaigns } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.slug, params.slug))
    .limit(1);

  if (!campaign) {
    throw error(404, 'Campaign tidak ditemukan');
  }

  return {
    campaign
  };
};
