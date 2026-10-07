export interface WinpayInvoiceParams {
  ref: string;
  amount: number;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  campaignTitle: string;
  backUrl: string;
}

export interface WinpayCallbackPayload {
  ref: string;
  status: 'PAID' | 'EXPIRED' | 'FAILED';
  channel: string;
  amount: number;
  fee?: number;
  paidAt?: string;
}

export function calculateDonationFees(amount: number, channel: string): {
  platformFee: number;
  gatewayFee: number;
  netAmount: number;
} {
  // 5% platform fee as specified in PRD 6.7
  const platformFee = Math.round(amount * 0.05);

  // Realistic channel MDR fees
  let gatewayFee = 1500;
  if (channel.toUpperCase().includes('QRIS')) {
    gatewayFee = Math.max(500, Math.round(amount * 0.007)); // 0.7% MDR for QRIS
  } else if (channel.toUpperCase().includes('VA')) {
    gatewayFee = 2500; // Flat Rp 2.500 for Virtual Accounts
  } else if (channel.toUpperCase().includes('EWALLET') || channel.toUpperCase().includes('GOPAY')) {
    gatewayFee = Math.round(amount * 0.015); // 1.5% for e-wallets
  }

  const netAmount = Math.max(0, amount - platformFee - gatewayFee);

  return {
    platformFee,
    gatewayFee,
    netAmount
  };
}

export async function processPaymentSuccess(
  donation: {
    id: string;
    campaignId: string;
    amount: number;
    donorName: string;
    donorPhone: string;
    status: string;
    waAccountId: string | null;
  },
  channel: string,
  gatewayFee?: number
) {
  const fees = calculateDonationFees(donation.amount, channel);
  const actualGatewayFee = gatewayFee ?? fees.gatewayFee;
  const actualNetAmount = donation.amount - fees.platformFee - actualGatewayFee;

  return {
    status: 'paid' as const,
    channel,
    gatewayFee: actualGatewayFee,
    platformFee: fees.platformFee,
    netAmount: actualNetAmount,
    paidAt: new Date().toISOString()
  };
}
