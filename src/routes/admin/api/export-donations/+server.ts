import { db } from '$lib/server/db/index';
import { donations, campaigns } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const allDonations = await db.select().from(donations).orderBy(desc(donations.createdAt));
  const allCampaigns = await db.select().from(campaigns);
  const campMap = Object.fromEntries(allCampaigns.map((c) => [c.id, c.title]));

  const headers = [
    'No Invoice',
    'Tanggal Donasi',
    'Program Campaign',
    'Nama Donatur',
    'WhatsApp Donatur',
    'Nominal Donasi (Bruto)',
    'Biaya Gateway',
    'Biaya Platform 5%',
    'Dana Bersih (Net)',
    'Metode Bayar',
    'Status Pembayaran'
  ];

  const rows = allDonations.map((d) => [
    `"${d.invoiceRef}"`,
    `"${new Date(d.createdAt).toISOString()}"`,
    `"${(campMap[d.campaignId] || '').replace(/"/g, '""')}"`,
    `"${(d.donorName || '').replace(/"/g, '""')}"`,
    `"${d.donorPhone}"`,
    d.amount,
    d.gatewayFee,
    d.platformFee,
    d.netAmount,
    `"${d.channel || ''}"`,
    `"${d.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fundcore-donations-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
};
