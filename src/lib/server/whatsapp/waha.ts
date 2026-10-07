import { db } from '$lib/server/db/index';
import { waAccounts, waMessages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export function formatChatId(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return `${clean}@c.us`;
}

export async function assignStickyWaAccount(): Promise<string | null> {
  const activeAccounts = await db
    .select()
    .from(waAccounts)
    .where(eq(waAccounts.isActive, true));

  if (activeAccounts.length === 0) return null;

  // Simple round-robin selection
  const selected = activeAccounts[Math.floor(Math.random() * activeAccounts.length)];
  return selected.id;
}

export async function sendWahaMessage({
  donationId,
  type,
  waAccountId,
  toPhone,
  text
}: {
  donationId: string;
  type: 'created' | 'success' | 'followup' | 'test';
  waAccountId?: string | null;
  toPhone: string;
  text: string;
}): Promise<{ success: boolean; messageId: string }> {
  const messageId = 'msg-' + Math.random().toString(36).slice(2, 10);
  const now = new Date().toISOString();

  // If no WA account provided, assign one
  let targetAccountId = waAccountId;
  if (!targetAccountId) {
    targetAccountId = await assignStickyWaAccount();
  }

  // Record message in database
  await db.insert(waMessages).values({
    id: messageId,
    donationId,
    type,
    waAccountId: targetAccountId,
    toPhone,
    payload: text,
    status: 'sent',
    sentAt: now,
    createdAt: now
  });

  return { success: true, messageId };
}

export async function testWahaConnection(accountId: string): Promise<{
  connected: boolean;
  phone?: string;
  session?: string;
}> {
  const [account] = await db
    .select()
    .from(waAccounts)
    .where(eq(waAccounts.id, accountId))
    .limit(1);

  if (!account) {
    return { connected: false };
  }

  // Update lastCheckedAt
  await db
    .update(waAccounts)
    .set({
      lastCheckedAt: new Date().toISOString(),
      status: 'connected'
    })
    .where(eq(waAccounts.id, accountId));

  return {
    connected: true,
    phone: account.phone,
    session: account.session
  };
}
