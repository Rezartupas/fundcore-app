import { db } from '$lib/server/db/index';
import { campaigns, campaignUpdates } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getActiveCampaigns() {
  return db
    .select()
    .from(campaigns)
    .where(eq(campaigns.status, 'active'))
    .orderBy(desc(campaigns.isUrgent), desc(campaigns.createdAt));
}

export async function getRecentUpdates(limit: number) {
  const updates = await db
    .select()
    .from(campaignUpdates)
    .orderBy(desc(campaignUpdates.createdAt))
    .limit(limit);
  const out = [];
  for (const u of updates) {
    const [c] = await db.select().from(campaigns).where(eq(campaigns.id, u.campaignId)).limit(1);
    out.push({ ...u, campaignTitle: c?.title ?? 'Program Kebaikan', campaignSlug: c?.slug ?? '' });
  }
  return out;
}
