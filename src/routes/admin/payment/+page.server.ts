import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  return {
    gateway: {
      provider: 'Winpay',
      environment: process.env.WINPAY_ENV || 'sandbox',
      apiKeyMasked: 'winpay_live_••••••••••••391a',
      secretKeyMasked: 'sec_••••••••••••88fd',
      callbackUrl: 'https://fundcore.app/webhooks/winpay/production-secret',
      webhookStatus: 'active'
    }
  };
};

export const actions: Actions = {
  saveCredentials: async ({ request }) => {
    const data = await request.formData();
    const env = data.get('environment')?.toString();
    return { success: true, environment: env || 'sandbox' };
  }
};
