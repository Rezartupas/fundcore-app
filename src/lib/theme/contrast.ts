export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function validateWcagAA(
  bgColor: string,
  textColor: string,
  isLargeText = false
): { passed: boolean; ratio: number; minRatio: number } {
  const ratio = getContrastRatio(bgColor, textColor);
  const minRatio = isLargeText ? 3.0 : 4.5;
  return {
    passed: ratio >= minRatio,
    ratio,
    minRatio
  };
}

export function getRecommendedTextColor(bgColor: string): string {
  const whiteRatio = getContrastRatio(bgColor, '#FFFFFF');
  const darkRatio = getContrastRatio(bgColor, '#0A2540');
  return whiteRatio >= darkRatio ? '#FFFFFF' : '#0A2540';
}

export function generateThemeCss(theme: {
  colorBg: string;
  colorBrand: string;
  colorAccent: string;
}): string {
  const textOnBrand = getRecommendedTextColor(theme.colorBrand);
  const textOnAccent = getRecommendedTextColor(theme.colorAccent);

  return `
:root {
  --color-bg: ${theme.colorBg};
  --color-surface: #FFFFFF;
  --color-brand: ${theme.colorBrand};
  --color-brand-muted: ${theme.colorBrand}E6;
  --color-brand-light: #E0F2FE;
  --color-brand-text: ${textOnBrand};
  --color-accent: ${theme.colorAccent};
  --color-accent-text: ${textOnAccent};
}
`.trim();
}
