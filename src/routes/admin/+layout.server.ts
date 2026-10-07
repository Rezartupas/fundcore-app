import { db } from '$lib/server/db/index';
import { siteSettings } from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const [settings] = await db.select().from(siteSettings).limit(1);

  return {
    settings: settings || {
      siteName: 'FundCore',
      colorBrand: '#0A2540'
    }
  };
};
