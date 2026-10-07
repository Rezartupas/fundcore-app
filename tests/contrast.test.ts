import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  validateWcagAA,
  getRecommendedTextColor,
  generateThemeCss
} from '../src/lib/theme/contrast.js';

describe('White-Label Theme & WCAG Contrast Validator', () => {
  it('should compute high contrast ratio for black on white', () => {
    const ratio = getContrastRatio('#FFFFFF', '#000000');
    expect(ratio).toBe(21);
    expect(validateWcagAA('#FFFFFF', '#000000').passed).toBe(true);
  });

  it('should compute valid contrast for FundCore brand Navy (#0A2540) on white', () => {
    const result = validateWcagAA('#FFFFFF', '#0A2540');
    expect(result.ratio).toBeGreaterThanOrEqual(10);
    expect(result.passed).toBe(true);
  });

  it('should recommend dark text for light Amber/Gold (#F59E0B) CTA button', () => {
    const recommended = getRecommendedTextColor('#F59E0B');
    expect(recommended).toBe('#0A2540');
  });

  it('should flag low contrast combination as failing WCAG AA', () => {
    // Light gray on white fails
    const result = validateWcagAA('#FFFFFF', '#E2E8F0');
    expect(result.passed).toBe(false);
  });

  it('should generate theme CSS variables with correct properties', () => {
    const css = generateThemeCss({
      colorBg: '#F8FAFC',
      colorBrand: '#0A2540',
      colorAccent: '#F59E0B'
    });
    expect(css).toContain('--color-bg: #F8FAFC');
    expect(css).toContain('--color-brand: #0A2540');
    expect(css).toContain('--color-accent: #F59E0B');
    expect(css).toContain('--color-accent-text');
  });
});
