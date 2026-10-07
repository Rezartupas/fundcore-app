import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { campaigns, donations, waAccounts, waMessages, waSettings } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  const {
    campaignId,
    amount,
    donorName,
    donorPhone,
    donorEmail,
    isAnonymous = false,
    prayer = ''
  } = body;

  if (!campaignId) {
    throw error(400, 'campaignId is required');
  }

  const numAmount = Number(amount);
  if (!numAmount || numAmount < 1000) {
    throw error(400, 'Nominal donasi minimal Rp 1.000');
  }

  // Validate phone format
  const cleanPhone = String(donorPhone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 9) {
    throw error(400, 'Nomor WhatsApp tidak valid (contoh: 08123456789)');
  }

  // Ensure campaign exists
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw error(404, 'Campaign tidak ditemukan');
  }

  // Pick sticky WA account (round robin or active account)
  const activeWaAccounts = await db
    .select()
    .from(waAccounts)
    .where(eq(waAccounts.isActive, true))
    .limit(1);

  const assignedWaAccountId = activeWaAccounts[0]?.id || null;

  const donationId = 'don-' + Math.random().toString(36).slice(2, 10);
  const invoiceRef = 'INV-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const invoiceUrl = `/payment/simulate/${donationId}`;

  const platformFee = Math.round(numAmount * 0.05); // 5% platform fee
  const gatewayFee = 1000; // Estimated baseline MDR
  const netAmount = Math.max(0, numAmount - platformFee - gatewayFee);

  const finalDonorName = isAnonymous ? 'Hamba Allah' : (donorName?.trim() || 'Hamba Allah');
  const now = new Date().toISOString();
  const expiredAt = new Date(Date.now() + 24 * 3600000).toISOString();

  await db.insert(donations).values({
    id: donationId,
    campaignId,
    donorName: finalDonorName,
    donorPhone: cleanPhone,
    donorEmail: donorEmail?.trim() || null,
    amount: numAmount,
    isAnonymous: Boolean(isAnonymous),
    prayer: prayer?.trim() || null,
    prayerAmenCount: 0,
    status: 'pending',
    channel: 'QRIS / Virtual Account',
    invoiceRef,
    invoiceUrl,
    gatewayFee,
    platformFee,
    netAmount,
    waAccountId: assignedWaAccountId,
    expiredAt,
    createdAt: now
  });

  // Record initial "donasi dibuat" WhatsApp notification
  if (assignedWaAccountId) {
    const [templateRow] = await db
      .select()
      .from(waSettings)
      .where(eq(waSettings.type, 'created'))
      .limit(1);

    const messageTemplate =
      templateRow?.template ||
      'Halo {nama}, terima kasih atas niat mulia Anda berdonasi Rp{nominal} untuk "{campaign}". Silakan selesaikan pembayaran: {link_bayar}';

    const textPayload = messageTemplate
      .replace('{nama}', finalDonorName)
      .replace('{nominal}', numAmount.toLocaleString('id-ID'))
      .replace('{campaign}', campaign.title)
      .replace('{link_bayar}', invoiceUrl)
      .replace('{batas_bayar}', new Date(expiredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

    await db.insert(waMessages).values({
      id: 'msg-' + Math.random().toString(36).slice(2, 10),
      donationId,
      type: 'created',
      waAccountId: assignedWaAccountId,
      toPhone: cleanPhone,
      payload: textPayload,
      status: 'sent',
      sentAt: now,
      createdAt: now
    });
  }

  return json({
    success: true,
    donationId,
    invoiceRef,
    redirectUrl: invoiceUrl
  });
};
