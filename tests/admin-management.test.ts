import { describe, it, expect, beforeAll } from 'vitest';
import { actions as campaignActions } from '../src/routes/admin/campaigns/+page.server.js';
import { actions as fundraiserActions, load as loadFundraisers } from '../src/routes/admin/fundraisers/+page.server.js';
import { GET as exportCsvHandler } from '../src/routes/admin/api/export-donations/+server.js';
import { initDb, db } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';
import { campaigns, fundraiserApplications } from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

describe('Admin Management: Campaigns, Fundraisers & CSV Export', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
    // @ts-expect-error mock event
    await loadFundraisers({});
  });

  it('should toggle campaign status between active and frozen', async () => {
    const [c] = await db.select().from(campaigns).limit(1);

    // Freeze
    const freezeData = new FormData();
    freezeData.append('id', c.id);
    freezeData.append('status', 'frozen');

    // @ts-expect-error mock request
    const res1 = (await campaignActions.updateStatus({
      request: new Request('http://localhost', { method: 'POST', body: freezeData })
    })) as any;
    expect(res1.success).toBe(true);

    const [frozen] = await db.select().from(campaigns).where(eq(campaigns.id, c.id));
    expect(frozen.status).toBe('frozen');

    // Unfreeze
    const activateData = new FormData();
    activateData.append('id', c.id);
    activateData.append('status', 'active');

    // @ts-expect-error mock request
    const res2 = (await campaignActions.updateStatus({
      request: new Request('http://localhost', { method: 'POST', body: activateData })
    })) as any;
    expect(res2.success).toBe(true);

    const [active] = await db.select().from(campaigns).where(eq(campaigns.id, c.id));
    expect(active.status).toBe('active');
  });

  it('should review and approve fundraiser application', async () => {
    const [app] = await db.select().from(fundraiserApplications).limit(1);

    const reviewData = new FormData();
    reviewData.append('id', app.id);
    reviewData.append('status', 'approved');

    // @ts-expect-error mock request
    const res = (await fundraiserActions.review({
      request: new Request('http://localhost', { method: 'POST', body: reviewData })
    })) as any;
    expect(res.success).toBe(true);

    const [approvedApp] = await db
      .select()
      .from(fundraiserApplications)
      .where(eq(fundraiserApplications.id, app.id));
    expect(approvedApp.status).toBe('approved');
  });

  it('should export donations as RFC-compliant CSV with proper headers', async () => {
    const res = await exportCsvHandler({} as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');

    const csvText = await res.text();
    expect(csvText).toContain('No Invoice');
    expect(csvText).toContain('Biaya Platform 5%');
    expect(csvText).toContain('Dana Bersih (Net)');
    expect(csvText.split('\n').length).toBeGreaterThan(1);
  });
});
