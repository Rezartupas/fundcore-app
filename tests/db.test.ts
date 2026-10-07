import { describe, it, expect, beforeAll } from 'vitest';
import { db, initDb } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, siteSettings, donations } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Database Schema & Seeding (SQLite/Drizzle)', () => {
  beforeAll(async () => {
    await initDb();
    await db.update(siteSettings).set({
      siteName: 'FundCore',
      colorBrand: '#0A2540',
      colorAccent: '#F59E0B'
    });
    await seedDb();
  });

  it('should have initial site settings with FundCore defaults', async () => {
    const settings = await db.select().from(siteSettings).limit(1);
    expect(settings.length).toBe(1);
    expect(settings[0].siteName).toBe('FundCore');
    expect(settings[0].colorBrand).toBe('#0A2540');
    expect(settings[0].colorAccent).toBe('#F59E0B');
  });

  it('should seed realistic campaigns', async () => {
    const allCampaigns = await db.select().from(campaigns);
    expect(allCampaigns.length).toBeGreaterThanOrEqual(6);
    const urgentCamp = allCampaigns.find((c) => c.isUrgent);
    expect(urgentCamp).toBeDefined();
    expect(urgentCamp?.targetAmount).toBeGreaterThan(0);
  });

  it('should retrieve seeded donations and calculate net amount properly', async () => {
    const allDonations = await db.select().from(donations);
    expect(allDonations.length).toBeGreaterThanOrEqual(3);
    const sample = allDonations[0];
    expect(sample.status).toBe('paid');
    expect(sample.netAmount).toBe(sample.amount - sample.gatewayFee - sample.platformFee);
  });
});
