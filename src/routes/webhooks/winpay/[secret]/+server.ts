import { db } from '$lib/server/db/index';
import { donations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { settlePaidDonation } from '$lib/server/payment/settle';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  // PRD F-32: Endpoint must return plain text 'ACCEPTED'
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response('ACCEPTED', { status: 200 });
  }

  const invoiceRef = payload.ref || payload.invoice_ref || payload.merchant_ref;
  if (!invoiceRef) {
    return new Response('ACCEPTED', { status: 200 });
  }

  const paymentStatus = (payload.status || 'PAID').toUpperCase();

  if (paymentStatus === 'PAID') {
    await settlePaidDonation(invoiceRef, payload);
  } else if (paymentStatus === 'EXPIRED' || paymentStatus === 'FAILED') {
    const [donation] = await db
      .select()
      .from(donations)
      .where(eq(donations.invoiceRef, invoiceRef))
      .limit(1);

    // Never regress a paid donation on a late terminal callback.
    if (donation && donation.status !== 'paid') {
      await db
        .update(donations)
        .set({ status: paymentStatus.toLowerCase() })
        .where(eq(donations.id, donation.id));
    }
  }

  return new Response('ACCEPTED', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
};
