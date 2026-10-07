import { db } from '$lib/server/db/index';
import { fundraiserApplications, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  // Ensure sample application exists for verification demonstration if empty
  const apps = await db
    .select()
    .from(fundraiserApplications)
    .orderBy(desc(fundraiserApplications.createdAt));

  if (apps.length === 0) {
    await db.insert(fundraiserApplications).values({
      id: 'app-demo-1',
      userId: 'user-sample-1',
      applicantName: 'Ustadz Ahmad Shodiq',
      idCardNumber: '3201020304050001',
      documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      reason: 'Penggalangan dana pembangunan asrama santri yatim di Desa Sukamaju',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  }

  const updatedApps = await db
    .select()
    .from(fundraiserApplications)
    .orderBy(desc(fundraiserApplications.createdAt));

  return {
    applications: updatedApps
  };
};

export const actions: Actions = {
  review: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();
    const status = data.get('status')?.toString();

    if (!id || !status) {
      return { success: false, error: 'Parameter tidak lengkap' };
    }

    await db
      .update(fundraiserApplications)
      .set({
        status,
        reviewedAt: new Date().toISOString()
      })
      .where(eq(fundraiserApplications.id, id));

    return { success: true };
  }
};
