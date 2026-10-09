import { describe, it, expect, beforeAll } from 'vitest';
import { load as loadHome } from '../src/routes/(public)/+page.server.js';
import { load as loadLayout } from '../src/routes/+layout.server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { siteSettings } from '../src/lib/server/db/schema.js';

describe('Public Web Pages Server Loaders', () => {
  beforeAll(async () => {
    await initDb();
    await db.update(siteSettings).set({
      siteName: 'FundCore',
      colorBrand: '#0A2540',
      colorAccent: '#F59E0B'
    });
    await seedDb();
  });

  it('layout loader should load valid site settings', async () => {
    // @ts-expect-error mock server event
    const res = (await loadLayout({})) as any;
    expect(res.settings).toBeDefined();
    expect(res.settings.siteName).toBe('FundCore');
    expect(res.settings.colorBrand).toBe('#0A2540');
  });

  it('home page loader should return active campaigns and aggregated stats', async () => {
    // @ts-expect-error mock server event
    const res = (await loadHome({})) as any;
    expect(res.campaigns.length).toBeGreaterThan(0);
    expect(res.stats.totalCollected).toBeGreaterThan(0);
    expect(res.stats.totalDonors).toBeGreaterThan(0);
    expect(res.stats.totalCampaigns).toBe(res.campaigns.length);
  });
});
