import { describe, it, expect, beforeAll } from 'vitest';
import { load as loadDetail, actions } from '../src/routes/c/[slug]/+page.server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { donations } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Campaign Detail Page Server Loader & Actions', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('should load campaign detail for valid slug', async () => {
    // @ts-expect-error mock params
    const res = (await loadDetail({
      params: { slug: 'bantu-bayi-arsyila-operasi-jantung-bocor' }
    })) as any;

    expect(res.campaign).toBeDefined();
    expect(res.campaign.slug).toBe('bantu-bayi-arsyila-operasi-jantung-bocor');
    expect(res.updates.length).toBeGreaterThanOrEqual(1);
    expect(res.donations.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle amen action to increment prayer count', async () => {
    const [sampleDonation] = await db.select().from(donations).limit(1);
    const initialCount = sampleDonation.prayerAmenCount;

    const formData = new FormData();
    formData.append('donationId', sampleDonation.id);

    // @ts-expect-error mock event
    const actionRes = (await actions.amen({
      request: new Request('http://localhost', { method: 'POST', body: formData })
    })) as any;

    expect(actionRes.success).toBe(true);

    const [updated] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, sampleDonation.id));
    expect(updated.prayerAmenCount).toBe(initialCount + 1);
  });
});
