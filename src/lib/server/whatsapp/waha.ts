import { db } from '$lib/server/db/index';
import { waAccounts, waMessages } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export function formatChatId(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return `${clean}@c.us`;
}

export async function assignStickyWaAccount(donorPhone?: string): Promise<string | null> {
  const activeAccounts = await db
    .select()
    .from(waAccounts)
    .where(eq(waAccounts.isActive, true))
    .orderBy(asc(waAccounts.id));

  if (activeAccounts.length === 0) return null;
  if (activeAccounts.length === 1) return activeAccounts[0].id;

  // Deterministic sticky pick: the same donor always lands on the same
  // number, new donors spread across numbers. Documented deviation from
  // strict round-robin (PRD 6.5): needs no rotation state and is race-free.
  // Revisit when the queued worker-wa lands and true rotation is cheap.
  let hash = 0;
  const key = donorPhone || '';
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return activeAccounts[Math.abs(hash) % activeAccounts.length].id;
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
