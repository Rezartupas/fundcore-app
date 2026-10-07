import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Project Setup & Static Assets', () => {
  it('should have fundcore-logo.png in static folder', () => {
    const logoPath = path.resolve(process.cwd(), 'static/fundcore-logo.png');
    expect(fs.existsSync(logoPath)).toBe(true);
    const stats = fs.statSync(logoPath);
    expect(stats.size).toBeGreaterThan(1000);
  });

  it('should have 60/30/10 root CSS variables defined', () => {
    const cssPath = path.resolve(process.cwd(), 'src/routes/layout.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    const content = fs.readFileSync(cssPath, 'utf-8');
    expect(content).toContain('--color-bg');
    expect(content).toContain('--color-brand');
    expect(content).toContain('--color-accent');
  });
});
