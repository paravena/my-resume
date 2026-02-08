import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { render } from '@testing-library/react';
import App from '../App';

/**
 * **Feature: portfolio-design-improvements**
 * 
 * Property 7: Name Prominence in Header
 * **Validates: Requirements 4.2**
 * For any element within the header section, the name element SHALL have the largest
 * font-size value, establishing it as the primary visual element.
 * 
 * Property 28: Icon Size Proportionality
 * **Validates: Requirements 9.1**
 * For any icon adjacent to text, the icon height SHALL be between 0.75x and 1.25x
 * the line-height of the adjacent text, ensuring appropriate relative sizing.
 */

describe('Header Styling - Property-Based Tests', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    // Create a new JSDOM instance
    dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    document = dom.window.document;
    window = dom.window as any;
    
    // Set up global window and document for React
    global.document = document;
    global.window = window as any;
  });

  afterEach(() => {
    dom.window.close();
  });

  /**
   * Helper function to parse font size from Tailwind classes
   */
  function parseFontSizeFromClasses(classList: string): number {
    // Map of Tailwind font size classes to pixel values
    const fontSizeMap: Record<string, number> = {
      'text-display': 56,
      'text-h1': 40,
      'text-h2': 30,
      'text-h3': 24,
      'text-body-lg': 18,
      'text-body': 16,
      'text-body-sm': 14,
      'text-caption': 12,
      'text-4xl': 36,
      'text-3xl': 30,
      'text-2xl': 24,
      'text-xl': 20,
      'text-lg': 18,
      'text-base': 16,
      'text-sm': 14,
      'text-xs': 12,
    };

    // Check for responsive classes (md:text-*)
    const mdMatch = classList.match(/md:text-(\S+)/);
    if (mdMatch && window.innerWidth >= 768) {
      const mdClass = `text-${mdMatch[1]}`;
      if (fontSizeMap[mdClass]) {
        return fontSizeMap[mdClass];
      }
    }

    // Check for base classes
    for (const [className, size] of Object.entries(fontSizeMap)) {
      if (classList.includes(className)) {
        return size;
      }
    }

    return 16; // Default body text size
  }

  /**
   * Helper function to parse line height from Tailwind classes
   */
  function parseLineHeightFromClasses(classList: string): number {
    // Custom typography scale line heights
    const lineHeightMap: Record<string, number> = {
      'text-display': 56 * 1.1,
      'text-h1': 40 * 1.2,
      'text-h2': 30 * 1.3,
      'text-h3': 24 * 1.4,
      'text-body-lg': 18 * 1.7,
      'text-body': 16 * 1.7,
      'text-body-sm': 14 * 1.6,
      'text-caption': 12 * 1.5,
    };

    // Check for responsive classes
    const mdMatch = classList.match(/md:text-(\S+)/);
    if (mdMatch && window.innerWidth >= 768) {
      const mdClass = `text-${mdMatch[1]}`;
      if (lineHeightMap[mdClass]) {
        return lineHeightMap[mdClass];
      }
    }

    // Check for base classes
    for (const [className, lineHeight] of Object.entries(lineHeightMap)) {
      if (classList.includes(className)) {
        return lineHeight;
      }
    }

    return 16 * 1.5; // Default line height
  }

  /**
   * Helper function to parse icon size from Tailwind classes
   */
  function parseIconSizeFromClasses(element: Element): number {
    const classList = element.getAttribute('class') || '';
    
    const sizeMap: Record<string, number> = {
      'h-3': 12,
      'h-4': 16,
      'h-5': 20,
      'h-6': 24,
      'h-7': 28,
      'h-8': 32,
    };

    for (const [className, size] of Object.entries(sizeMap)) {
      if (classList.includes(className)) {
        return size;
      }
    }

    return 16; // Default icon size
  }

  describe('Property 7: Name Prominence in Header', () => {
    it('should have the name element with the largest font-size in the header', () => {
      fc.assert(
        fc.property(
          // Generate random viewport widths to test responsive behavior
          fc.integer({ min: 320, max: 2560 }),
          (viewportWidth) => {
            // Set viewport width
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            // Render the App component
            const { container } = render(<App />);

            // Find the header element
            const header = container.querySelector('header');
            expect(header).toBeTruthy();

            if (header) {
              // Find the name element (h1)
              const nameElement = header.querySelector('h1');
              expect(nameElement).toBeTruthy();

              if (nameElement) {
                const nameFontSize = parseFontSizeFromClasses(nameElement.className);

                // Get all other text elements in the header
                const allTextElements = header.querySelectorAll('span, a, li');
                
                // Check that name has the largest font size
                allTextElements.forEach((element) => {
                  const elementFontSize = parseFontSizeFromClasses((element as HTMLElement).className);
                  expect(nameFontSize).toBeGreaterThanOrEqual(elementFontSize);
                });
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use display or h1 typography classes for the name', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      const nameElement = header?.querySelector('h1');

      expect(nameElement).toBeTruthy();
      
      if (nameElement) {
        const classList = nameElement.className;
        
        // Should have either text-display, text-h1, or responsive variants
        const hasProperTypography = 
          classList.includes('text-display') ||
          classList.includes('text-h1') ||
          classList.includes('md:text-display') ||
          classList.includes('md:text-h1');
        
        expect(hasProperTypography).toBe(true);
      }
    });

    it('should have responsive font sizing (smaller on mobile, larger on desktop)', () => {
      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container: mobileContainer } = render(<App />);
      const mobileHeader = mobileContainer.querySelector('header');
      const mobileNameElement = mobileHeader?.querySelector('h1');
      
      expect(mobileNameElement).toBeTruthy();
      
      const mobileFontSize = mobileNameElement ? 
        parseFontSizeFromClasses(mobileNameElement.className) : 0;

      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      const { container: desktopContainer } = render(<App />);
      const desktopHeader = desktopContainer.querySelector('header');
      const desktopNameElement = desktopHeader?.querySelector('h1');
      
      expect(desktopNameElement).toBeTruthy();
      
      const desktopFontSize = desktopNameElement ? 
        parseFontSizeFromClasses(desktopNameElement.className) : 0;

      // Desktop should have larger or equal font size
      expect(desktopFontSize).toBeGreaterThanOrEqual(mobileFontSize);
    });
  });

  describe('Property 28: Icon Size Proportionality', () => {
    it('should have icon height between 0.75x and 1.25x the text line-height', () => {
      fc.assert(
        fc.property(
          // Generate random viewport widths
          fc.integer({ min: 320, max: 2560 }),
          (viewportWidth) => {
            // Set viewport width
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            // Render the App component
            const { container } = render(<App />);

            // Find the header element
            const header = container.querySelector('header');
            expect(header).toBeTruthy();

            if (header) {
              // Find all list items with icons
              const listItems = header.querySelectorAll('li');
              
              listItems.forEach((li) => {
                // Find icon (svg element)
                const icon = li.querySelector('svg');
                // Find text element (span or a)
                const textElement = li.querySelector('span, a');

                if (icon && textElement) {
                  const iconHeight = parseIconSizeFromClasses(icon);
                  const textLineHeight = parseLineHeightFromClasses((textElement as HTMLElement).className);

                  // Icon height should be between 0.75x and 1.25x the line height
                  expect(iconHeight).toBeGreaterThanOrEqual(textLineHeight * 0.75);
                  expect(iconHeight).toBeLessThanOrEqual(textLineHeight * 1.25);
                }
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent icon sizing across all header icons', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      
      expect(header).toBeTruthy();

      if (header) {
        const icons = header.querySelectorAll('svg');
        
        expect(icons.length).toBeGreaterThan(0);

        // Get the size of the first icon
        const firstIconSize = parseIconSizeFromClasses(icons[0]);

        // All icons should have the same size
        icons.forEach((icon) => {
          const iconSize = parseIconSizeFromClasses(icon);
          expect(iconSize).toBe(firstIconSize);
        });
      }
    });

    it('should use appropriate icon size classes (h-5 w-5)', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      const icons = header?.querySelectorAll('svg');

      expect(icons).toBeTruthy();
      expect(icons!.length).toBeGreaterThan(0);

      icons?.forEach((icon) => {
        const classList = icon.getAttribute('class') || '';
        
        // Should have height and width classes
        expect(classList).toMatch(/h-\d+/);
        expect(classList).toMatch(/w-\d+/);
        
        // Should use h-5 w-5 for proper proportionality
        expect(classList).toContain('h-5');
        expect(classList).toContain('w-5');
      });
    });
  });

  describe('Header Integration Tests', () => {
    it('should have proper spacing between name and contact info', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      
      expect(header).toBeTruthy();

      if (header) {
        const classList = header.className;
        
        // Should have space-y classes for vertical spacing
        expect(classList).toMatch(/space-y-\d+/);
        
        // Should have responsive spacing (md:space-y-*)
        expect(classList).toMatch(/md:space-y-\d+/);
      }
    });

    it('should have semantic header element', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      
      expect(header).toBeTruthy();
      expect(header?.tagName.toLowerCase()).toBe('header');
    });

    it('should have proper flex layout for contact info', () => {
      const { container } = render(<App />);
      const header = container.querySelector('header');
      const contactList = header?.querySelector('ul');
      
      expect(contactList).toBeTruthy();

      if (contactList) {
        const classList = contactList.className;
        
        // Should have flex and flex-wrap for responsive layout
        expect(classList).toContain('flex');
        expect(classList).toContain('flex-wrap');
        
        // Should have gap for spacing (either gap-* or gap-x-* and gap-y-*)
        const hasGap = classList.match(/gap-\d+/) || 
                       (classList.match(/gap-x-\d+/) && classList.match(/gap-y-\d+/));
        expect(hasGap).toBeTruthy();
      }
    });
  });
});
