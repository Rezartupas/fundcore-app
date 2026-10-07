import { describe, it, expect, beforeAll } from 'vitest';
import { load as loadAdminOverview } from '../src/routes/admin/+page.server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';

describe('Admin Dashboard Overview Loader', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('should calculate gross, net, platform fees, and donor counts accurately', async () => {
    // @ts-expect-error mock event
    const res = (await loadAdminOverview({})) as any;

    expect(res.metrics).toBeDefined();
    expect(res.metrics.totalGross).toBeGreaterThan(0);
    expect(res.metrics.totalNet).toBeGreaterThan(0);
    expect(res.metrics.totalPlatformFee).toBe(Math.round(res.metrics.totalGross * 0.05));
    expect(res.metrics.uniqueDonorsCount).toBeGreaterThanOrEqual(1);

    expect(res.topCampaigns.length).toBeGreaterThan(0);
    expect(res.topCampaigns[0].collectedAmount).toBeGreaterThanOrEqual(
      res.topCampaigns[res.topCampaigns.length - 1].collectedAmount
    );
  });
});
