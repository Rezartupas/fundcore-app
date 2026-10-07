import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  siteName: text('site_name').notNull().default('FundCore'),
  tagline: text('tagline').notNull().default('Platform Donasi Cepat & Terpercaya'),
  logoUrl: text('logo_url').notNull().default('/fundcore-logo.png'),
  faviconUrl: text('favicon_url').notNull().default('/favicon.svg'),
  colorBg: text('color_bg').notNull().default('#F8FAFC'),
  colorBrand: text('color_brand').notNull().default('#0A2540'),
  colorAccent: text('color_accent').notNull().default('#F59E0B'),
  orgName: text('org_name').notNull().default('Yayasan FundCore Peduli'),
  orgAddress: text('org_address').notNull().default('Gedung Filantropi Lt. 4, Jakarta Selatan'),
  orgPhone: text('org_phone').notNull().default('0812-3456-7890'),
  legalSk: text('legal_sk').notNull().default('AHU-0012345.AH.01.04.Tahun 2024 / Izin PUB Kemensos No. 882/HUK-PS/2026'),
  updatedAt: text('updated_at').notNull()
});

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull().default('admin'),
  title: text('title').notNull(),
  category: text('category').notNull(), // Medis, Bencana, Pendidikan, Panti Asuhan, Dakwah
  targetAmount: integer('target_amount').notNull(),
  collectedAmount: integer('collected_amount').notNull().default(0),
  donorCount: integer('donor_count').notNull().default(0),
  durationDays: integer('duration_days').notNull().default(30),
  startAt: text('start_at').notNull(),
  endAt: text('end_at').notNull(),
  coverUrl: text('cover_url').notNull(),
  story: text('story').notNull(),
  beneficiaryName: text('beneficiary_name').notNull(),
  status: text('status').notNull().default('active'), // draft, active, frozen, completed
  isUrgent: integer('is_urgent', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull()
});

export const campaignUpdates = sqliteTable('campaign_updates', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull()
});

export const donations = sqliteTable('donations', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  donorName: text('donor_name').notNull(),
  donorPhone: text('donor_phone').notNull(),
  donorEmail: text('donor_email'),
  amount: integer('amount').notNull(),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }).notNull().default(false),
  prayer: text('prayer'),
  prayerAmenCount: integer('prayer_amen_count').notNull().default(0),
  status: text('status').notNull().default('created'), // created, pending, paid, expired, failed
  channel: text('channel'), // QRIS, BCA VA, Mandiri VA, ShopeePay, GoPay
  invoiceRef: text('invoice_ref').notNull().unique(),
  invoiceUrl: text('invoice_url').notNull(),
  gatewayFee: integer('gateway_fee').notNull().default(0),
  platformFee: integer('platform_fee').notNull().default(0),
  netAmount: integer('net_amount').notNull().default(0),
  waAccountId: text('wa_account_id'),
  paidAt: text('paid_at'),
  expiredAt: text('expired_at'),
  createdAt: text('created_at').notNull()
});

export const waAccounts = sqliteTable('wa_accounts', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  baseUrl: text('baseUrl').notNull().default('https://waha.domainanda.com'),
  session: text('session').notNull().default('default'),
  apiKey: text('api_key').notNull().default(''),
  phone: text('phone').notNull(),
  status: text('status').notNull().default('connected'), // connected, qr_required, disconnected
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastCheckedAt: text('last_checked_at').notNull()
});

export const waSettings = sqliteTable('wa_settings', {
  type: text('type').primaryKey(), // created, success, followup
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  template: text('template').notNull(),
  delayMinutes: integer('delay_minutes').notNull().default(120)
});

export const waMessages = sqliteTable('wa_messages', {
  id: text('id').primaryKey(),
  donationId: text('donation_id').notNull(),
  type: text('type').notNull(),
  waAccountId: text('wa_account_id'),
  toPhone: text('to_phone').notNull(),
  payload: text('payload').notNull(),
  status: text('status').notNull().default('sent'), // queued, sent, failed
  sentAt: text('sent_at').notNull(),
  createdAt: text('created_at').notNull()
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  role: text('role').notNull().default('donor'), // donor, fundraiser, admin
  fundraiserStatus: text('fundraiser_status').notNull().default('none'), // none, pending, approved, rejected
  createdAt: text('created_at').notNull()
});

export const fundraiserApplications = sqliteTable('fundraiser_applications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  applicantName: text('applicant_name').notNull(),
  idCardNumber: text('id_card_number').notNull(),
  documentUrl: text('document_url').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  reviewedAt: text('reviewed_at'),
  createdAt: text('created_at').notNull()
});
