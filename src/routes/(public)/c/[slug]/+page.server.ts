import { db } from '$lib/server/db/index';
import { campaigns, campaignUpdates, donations } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { error, type Actions } from '@sveltejs/kit';
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

  const updates = await db
    .select()
    .from(campaignUpdates)
    .where(eq(campaignUpdates.campaignId, campaign.id))
    .orderBy(desc(campaignUpdates.createdAt));

  const campaignDonations = await db
    .select({
      id: donations.id,
      donorName: donations.donorName,
      amount: donations.amount,
      isAnonymous: donations.isAnonymous,
      prayer: donations.prayer,
      prayerAmenCount: donations.prayerAmenCount,
      createdAt: donations.createdAt
    })
    .from(donations)
    .where(eq(donations.campaignId, campaign.id))
    .orderBy(desc(donations.createdAt));

  return {
    campaign,
    updates,
    donations: campaignDonations
  };
};

export const actions: Actions = {
  amen: async ({ request }) => {
    const data = await request.formData();
    const donationId = data.get('donationId')?.toString();

    if (!donationId) {
      return { success: false, error: 'Donation ID diperlukan' };
    }

    await db
      .update(donations)
      .set({
        prayerAmenCount: sql`${donations.prayerAmenCount} + 1`
      })
      .where(eq(donations.id, donationId));

    return { success: true };
  }
};
