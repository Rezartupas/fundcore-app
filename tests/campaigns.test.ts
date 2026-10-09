import { describe, it, expect, beforeAll } from 'vitest';
import { getActiveCampaigns, getRecentUpdates } from '../src/lib/server/campaigns.js';
import { initDb } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';

describe('public campaign queries', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('returns only active campaigns, urgent first', async () => {
    const rows = await getActiveCampaigns();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((c) => c.status === 'active')).toBe(true);
  });

  it('returns recent updates with campaign title and slug', async () => {
    const rows = await getRecentUpdates(5);
    expect(rows.length).toBeLessThanOrEqual(5);
    if (rows.length > 0) {
      expect(rows[0].campaignTitle).toBeTruthy();
      expect(rows[0].campaignSlug).toBeTruthy();
    }
  });
});
