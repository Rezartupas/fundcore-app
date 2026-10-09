import { describe, it, expect, beforeAll } from 'vitest';
import { DEFAULT_SETTINGS, loadTheme, validateThemeColors } from '../src/lib/server/theme.js';
import { initDb } from '../src/lib/server/db/index.js';
import { seedDb } from '../src/lib/server/db/seed.js';

describe('Theme module', () => {
  beforeAll(async () => {
    await initDb();
    await seedDb();
  });

  it('default palette passes its own validation', () => {
    expect(validateThemeColors(DEFAULT_SETTINGS)).toEqual([]);
  });

  it('flags white-on-white brand as unreadable', () => {
    const warnings = validateThemeColors({ colorBrand: '#FFFFFF', colorAccent: '#F59E0B' });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('brand');
  });

  it('loads settings from the database', async () => {
    const theme = await loadTheme();
    expect(theme.siteName).toBeTruthy();
    expect(theme.colorBrand).toMatch(/^#/);
  });
});
