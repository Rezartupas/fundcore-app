import { db } from '$lib/server/db/index';
import { donations, siteSettings, waAccounts, waSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { interpolateTemplate } from './templates.js';
import { assignStickyWaAccount, sendWahaMessage } from './waha.js';

export type NotifyType = 'created' | 'success' | 'followup';

// Last-resort templates (PRD 6.5) when the admin has no row in wa_settings.
const FALLBACK_TEMPLATES: Record<NotifyType, string> = {
  created:
    'Halo {nama}, terima kasih atas niat mulia Anda berdonasi Rp{nominal} untuk "{campaign}". Silakan selesaikan pembayaran: {link_bayar}',
  success:
    'Alhamdulillah, donasi Rp{nominal} untuk "{campaign}" sudah kami terima. Bantu sebarkan agar lebih banyak yang terbantu: {link_campaign}',
  followup:
    'Halo {nama}, donasi Rp{nominal} untuk "{campaign}" belum selesai dibayar. Lanjutkan di sini: {link_bayar}'
};

// One deep module owns the whole notify path: template lookup,
// interpolation, sticky account resolution, and recording. Handlers pass
// data and never build message strings.
export async function notifyDonationEvent({
  donation,
  campaign,
  type
}: {
  donation: typeof donations.$inferSelect;
  campaign: { title: string; slug: string } | null;
  type: NotifyType;
}): Promise<{ success: boolean; messageId: string }> {
  const [settings] = await db.select().from(siteSettings).limit(1);
  const [templateRow] = await db.select().from(waSettings).where(eq(waSettings.type, type)).limit(1);

  // The sticky lock on the donation wins; otherwise pick deterministically.
  const accountId = donation.waAccountId ?? (await assignStickyWaAccount(donation.donorPhone));
  const [account] = accountId
    ? await db.select().from(waAccounts).where(eq(waAccounts.id, accountId)).limit(1)
    : [];

  const text = interpolateTemplate(templateRow?.template ?? FALLBACK_TEMPLATES[type], {
    nama: donation.donorName,
    nominal: donation.amount,
    campaign: campaign?.title ?? 'Program Kebaikan',
    link_bayar: donation.invoiceUrl,
    batas_bayar: donation.expiredAt
      ? new Date(donation.expiredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      : undefined,
    link_campaign: campaign ? `/c/${campaign.slug}` : undefined,
    nama_cs: account?.label,
    nama_situs: settings?.siteName
  });

  return sendWahaMessage({
    donationId: donation.id,
    type,
    waAccountId: accountId,
    toPhone: donation.donorPhone,
    text
  });
}
