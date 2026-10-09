import { seedDb } from '$lib/server/db/seed';
import { loadTheme } from '$lib/server/theme';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  await seedDb();

  return {
    settings: await loadTheme()
  };
};
