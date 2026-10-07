import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { donations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const [donation] = await db
    .select({
      id: donations.id,
      status: donations.status,
      paidAt: donations.paidAt,
      amount: donations.amount
    })
    .from(donations)
    .where(eq(donations.id, params.id))
    .limit(1);

  if (!donation) {
    throw error(404, 'Donation not found');
  }

  return json(donation);
};
