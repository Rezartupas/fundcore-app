import { db } from '$lib/server/db/index';
import { campaigns } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();

    const title = data.get('title')?.toString().trim();
    const category = data.get('category')?.toString();
    const targetAmount = Number(data.get('targetAmount'));
    const durationDays = Number(data.get('durationDays')) || 30;
    const beneficiaryName = data.get('beneficiaryName')?.toString().trim();
    const coverUrl = data.get('coverUrl')?.toString().trim();
    const story = data.get('story')?.toString().trim();
    const isUrgent = data.get('isUrgent') === 'on';

    if (!title || !category || !targetAmount || !beneficiaryName || !story) {
      return fail(400, { error: 'Semua kolom wajib diisi' });
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = baseSlug + '-' + Math.floor(Math.random() * 1000);
    const campaignId = 'camp-' + Math.random().toString(36).slice(2, 10);
    const now = new Date().toISOString();
    const endAt = new Date(Date.now() + durationDays * 86400000).toISOString();

    const finalCoverUrl =
      coverUrl ||
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80';

    await db.insert(campaigns).values({
      id: campaignId,
      slug,
      ownerId: 'admin',
      title,
      category,
      targetAmount,
      collectedAmount: 0,
      donorCount: 0,
      durationDays,
      startAt: now,
      endAt,
      coverUrl: finalCoverUrl,
      story,
      beneficiaryName,
      status: 'active',
      isUrgent,
      createdAt: now
    });

    throw redirect(303, '/admin/campaigns');
  }
};
