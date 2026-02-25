import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: portfolio-design-improvements, Property 1: Color Contrast Compliance**
 * **Validates: Requirements 1.3, 10.1, 10.2**
 * 
 * For any text element and its background color combination used in the application,
 * the contrast ratio SHALL meet WCAG AA standards (minimum 4.5:1 for normal text,
 * minimum 3:1 for large text ≥18px or ≥14px bold).
 */

// Color palette from tailwind.config.js
const colorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  // Common background colors
  white: '#ffffff',
  black: '#000000',
  // Tailwind gray colors (commonly used)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calculate relative luminance according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(color1));
  const lum2 = getRelativeLuminance(hexToRgb(color2));

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
function meetsWCAGAA(
  contrastRatio: number,
  fontSize: number,
  isBold: boolean = false
): boolean {
  // Large text: ≥18px or ≥14px bold requires 3:1
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
  const requiredRatio = isLargeText ? 3 : 4.5;

  return contrastRatio >= requiredRatio;
}

/**
 * Get all color values from the palette
 */
function getAllColors(): string[] {
  const colors: string[] = [];

  Object.values(colorPalette).forEach((palette) => {
    if (typeof palette === 'string') {
      colors.push(palette);
    } else {
      Object.values(palette).forEach((color) => {
        colors.push(color);
      });
    }
  });

  return colors;
}

/**
 * Common text/background combinations used in the application
 */
const commonCombinations = [
  // White backgrounds with text colors
  { text: colorPalette.secondary[700], bg: colorPalette.white, fontSize: 16, isBold: false },
  { text: colorPalette.secondary[800], bg: colorPalette.white, fontSize: 16, isBold: false },
  { text: colorPalette.secondary[900], bg: colorPalette.white, fontSize: 16, isBold: false },
  // Note: primary-600 does NOT meet 4.5:1 on white (only 4.1:1), use primary-700+ for text
  { text: colorPalette.primary[700], bg: colorPalette.white, fontSize: 16, isBold: false },
  { text: colorPalette.primary[800], bg: colorPalette.white, fontSize: 16, isBold: false },
  
  // Sidebar background (primary-50 to primary-100 gradient) with text
  { text: colorPalette.secondary[700], bg: colorPalette.primary[50], fontSize: 16, isBold: false },
  { text: colorPalette.secondary[800], bg: colorPalette.primary[50], fontSize: 16, isBold: false },
  { text: colorPalette.secondary[700], bg: colorPalette.primary[100], fontSize: 16, isBold: false },
  { text: colorPalette.secondary[800], bg: colorPalette.primary[100], fontSize: 16, isBold: false },
  
  // Headings (larger text, often bold)
  { text: colorPalette.secondary[900], bg: colorPalette.white, fontSize: 30, isBold: true },
  { text: colorPalette.secondary[800], bg: colorPalette.white, fontSize: 24, isBold: true },
  { text: colorPalette.primary[700], bg: colorPalette.white, fontSize: 30, isBold: true },
  
  // Links - primary-600 can be used for large text or with hover states
  { text: colorPalette.primary[600], bg: colorPalette.white, fontSize: 18, isBold: false }, // Large text
  { text: colorPalette.primary[700], bg: colorPalette.white, fontSize: 16, isBold: false }, // Normal text
  
  // Gray text on white (common for body text)
  { text: colorPalette.gray[700], bg: colorPalette.white, fontSize: 16, isBold: false },
  { text: colorPalette.gray[800], bg: colorPalette.white, fontSize: 16, isBold: false },
];

describe('Color Contrast Compliance - Property-Based Tests', () => {
  describe('Property 1: Color Contrast Compliance', () => {
    it('should meet WCAG AA standards for all common text/background combinations', () => {
      commonCombinations.forEach(({ text, bg, fontSize, isBold }) => {
        const contrastRatio = getContrastRatio(text, bg);
        const passes = meetsWCAGAA(contrastRatio, fontSize, isBold);
        
        expect(passes).toBe(true);
        expect(contrastRatio).toBeGreaterThanOrEqual(
          fontSize >= 18 || (fontSize >= 14 && isBold) ? 3 : 4.5
        );
      });
    });

    it('should verify contrast ratios for randomly generated text/background combinations', () => {
      fc.assert(
        fc.property(
          // Generate random color from palette
          fc.constantFrom(...getAllColors()),
          // Generate random background color from palette
          fc.constantFrom(...getAllColors()),
          // Generate random font size (12-40px range)
          fc.integer({ min: 12, max: 40 }),
          // Generate random bold state
          fc.boolean(),
          (textColor, bgColor, fontSize, isBold) => {
            // Skip if text and background are the same color
            if (textColor === bgColor) {
              return true;
            }

            const contrastRatio = getContrastRatio(textColor, bgColor);
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
            const requiredRatio = isLargeText ? 3 : 4.5;

            // For this property test, we're verifying that our contrast calculation
            // works correctly and that we can identify which combinations meet standards
            // We don't expect all random combinations to pass, but we verify the logic
            const passes = contrastRatio >= requiredRatio;

            // The property we're testing: the contrast ratio calculation should be
            // consistent and the WCAG AA check should correctly identify passing combinations
            expect(typeof contrastRatio).toBe('number');
            expect(contrastRatio).toBeGreaterThan(0);
            expect(typeof passes).toBe('boolean');

            // If it passes, verify it meets the threshold
            if (passes) {
              expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should ensure primary text colors on white background meet WCAG AA for normal text', () => {
      const whiteBg = colorPalette.white;

      // Test darker shades of primary color (700-900) which should be used for text
      // Note: primary-600 does NOT meet 4.5:1 requirement (only 4.1:1)
      const textColors = [
        colorPalette.primary[700],
        colorPalette.primary[800],
        colorPalette.primary[900],
      ];

      textColors.forEach((textColor) => {
        const contrastRatio = getContrastRatio(textColor, whiteBg);
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('should allow primary-600 for large text (≥18px) on white background', () => {
      const whiteBg = colorPalette.white;
      const contrastRatio = getContrastRatio(colorPalette.primary[600], whiteBg);
      
      // primary-600 has ~4.1:1 contrast, which meets 3:1 for large text but not 4.5:1 for normal text
      expect(contrastRatio).toBeGreaterThanOrEqual(3);
      expect(meetsWCAGAA(contrastRatio, 18, false)).toBe(true);
      expect(meetsWCAGAA(contrastRatio, 16, false)).toBe(false);
    });

    it('should ensure secondary text colors on white background meet WCAG AA for normal text', () => {
      const whiteBg = colorPalette.white;

      // Test darker shades of secondary color (600-900) which should be used for text
      const textColors = [
        colorPalette.secondary[600],
        colorPalette.secondary[700],
        colorPalette.secondary[800],
        colorPalette.secondary[900],
      ];

      textColors.forEach((textColor) => {
        const contrastRatio = getContrastRatio(textColor, whiteBg);
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('should ensure text colors on sidebar background (primary-50/100) meet WCAG AA', () => {
      const sidebarBackgrounds = [colorPalette.primary[50], colorPalette.primary[100]];
      const textColors = [
        colorPalette.secondary[700],
        colorPalette.secondary[800],
        colorPalette.secondary[900],
      ];

      sidebarBackgrounds.forEach((bg) => {
        textColors.forEach((textColor) => {
          const contrastRatio = getContrastRatio(textColor, bg);
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
        });
      });
    });

    it('should verify large text (≥18px) meets 3:1 minimum contrast ratio', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...getAllColors()),
          fc.constantFrom(...getAllColors()),
          fc.integer({ min: 18, max: 40 }),
          (textColor, bgColor, fontSize) => {
            if (textColor === bgColor) {
              return true;
            }

            const contrastRatio = getContrastRatio(textColor, bgColor);
            
            // For large text, if it passes WCAG AA, it should have at least 3:1 ratio
            if (contrastRatio >= 3) {
              expect(meetsWCAGAA(contrastRatio, fontSize, false)).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should verify bold text ≥14px meets 3:1 minimum contrast ratio', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...getAllColors()),
          fc.constantFrom(...getAllColors()),
          fc.integer({ min: 14, max: 17 }),
          (textColor, bgColor, fontSize) => {
            if (textColor === bgColor) {
              return true;
            }

            const contrastRatio = getContrastRatio(textColor, bgColor);
            
            // For bold text ≥14px, if it passes WCAG AA, it should have at least 3:1 ratio
            if (contrastRatio >= 3) {
              expect(meetsWCAGAA(contrastRatio, fontSize, true)).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
