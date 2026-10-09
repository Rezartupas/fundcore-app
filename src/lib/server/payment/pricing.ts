// Donation pricing (PRD 6.7): platform fee is 5% of gross, gateway fee is
// borne by the merchant, net = gross - platform fee - gateway fee.
//
// Estimates below are merchant-configured (recheck per-channel MDR against
// the Winpay dashboard/contract; the API docs publish no fee table). The
// final fee always comes from the Winpay callback (`fee` field, see
// docs.winpay.id/payments/checkout-page/callback) — pass it as
// `actualGatewayFee` at settlement and it wins over any estimate.

const DEFAULT_GATEWAY_FEE = 1500;

// Company policy (PRD 6.7): platform fee is 5% of gross donation.
const PLATFORM_FEE_RATE = 0.05;

export interface DonationQuote {
  platformFee: number;
  gatewayFee: number;
  netAmount: number;
}

export function quoteDonation(amount: number, channel?: string, actualGatewayFee?: number): DonationQuote {
  const platformFee = Math.round(amount * PLATFORM_FEE_RATE);

  let estimatedGatewayFee = DEFAULT_GATEWAY_FEE;
  const normalized = (channel || '').toUpperCase();
  if (normalized.includes('QRIS')) {
    estimatedGatewayFee = Math.max(500, Math.round(amount * 0.007));
  } else if (normalized.includes('VA')) {
    estimatedGatewayFee = 2500;
  } else if (normalized.includes('EWALLET') || normalized.includes('GOPAY')) {
    estimatedGatewayFee = Math.round(amount * 0.015);
  }

  const gatewayFee = actualGatewayFee ?? estimatedGatewayFee;

  return {
    platformFee,
    gatewayFee,
    netAmount: Math.max(0, amount - platformFee - gatewayFee)
  };
}
