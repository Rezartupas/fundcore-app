import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

const dbUrl = process.env.DATABASE_URL || 'file:fundcore.db';

export const client = createClient({
  url: dbUrl
});

export const db = drizzle(client, { schema });

export async function initDb() {
  // Ensure tables exist using idempotent DDL statements
  await client.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_name TEXT NOT NULL DEFAULT 'FundCore',
      tagline TEXT NOT NULL DEFAULT 'Platform Donasi Cepat & Terpercaya',
      logo_url TEXT NOT NULL DEFAULT '/fundcore-logo.png',
      favicon_url TEXT NOT NULL DEFAULT '/favicon.svg',
      color_bg TEXT NOT NULL DEFAULT '#F8FAFC',
      color_brand TEXT NOT NULL DEFAULT '#0A2540',
      color_accent TEXT NOT NULL DEFAULT '#F59E0B',
      org_name TEXT NOT NULL DEFAULT 'Yayasan FundCore Peduli',
      org_address TEXT NOT NULL DEFAULT 'Gedung Filantropi Lt. 4, Jakarta Selatan',
      org_phone TEXT NOT NULL DEFAULT '0812-3456-7890',
      legal_sk TEXT NOT NULL DEFAULT 'AHU-0012345.AH.01.04.Tahun 2024 / Izin PUB Kemensos No. 882/HUK-PS/2026',
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      owner_id TEXT NOT NULL DEFAULT 'admin',
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      target_amount INTEGER NOT NULL,
      collected_amount INTEGER NOT NULL DEFAULT 0,
      donor_count INTEGER NOT NULL DEFAULT 0,
      duration_days INTEGER NOT NULL DEFAULT 30,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      story TEXT NOT NULL,
      beneficiary_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      is_urgent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaign_updates (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      donor_name TEXT NOT NULL,
      donor_phone TEXT NOT NULL,
      donor_email TEXT,
      amount INTEGER NOT NULL,
      is_anonymous INTEGER NOT NULL DEFAULT 0,
      prayer TEXT,
      prayer_amen_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'created',
      channel TEXT,
      invoice_ref TEXT NOT NULL UNIQUE,
      invoice_url TEXT NOT NULL,
      gateway_fee INTEGER NOT NULL DEFAULT 0,
      platform_fee INTEGER NOT NULL DEFAULT 0,
      net_amount INTEGER NOT NULL DEFAULT 0,
      wa_account_id TEXT,
      paid_at TEXT,
      expired_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS wa_accounts (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      baseUrl TEXT NOT NULL DEFAULT 'https://waha.domainanda.com',
      session TEXT NOT NULL DEFAULT 'default',
      api_key TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'connected',
      is_active INTEGER NOT NULL DEFAULT 1,
      last_checked_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS wa_settings (
      type TEXT PRIMARY KEY,
      is_active INTEGER NOT NULL DEFAULT 1,
      template TEXT NOT NULL,
      delay_minutes INTEGER NOT NULL DEFAULT 120
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS wa_messages (
      id TEXT PRIMARY KEY,
      donation_id TEXT NOT NULL,
      type TEXT NOT NULL,
      wa_account_id TEXT,
      to_phone TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'sent',
      sent_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'donor',
      fundraiser_status TEXT NOT NULL DEFAULT 'none',
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS fundraiser_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      applicant_name TEXT NOT NULL,
      id_card_number TEXT NOT NULL,
      document_url TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewed_at TEXT,
      created_at TEXT NOT NULL
    );
  `);
}
