import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { render } from '@testing-library/react';
import App from '../App';
import { LocaleContext } from '../i18n/LocaleContext';
import type { LocaleContextValue } from '../i18n/LocaleContext';

const mockLocaleContext: LocaleContextValue = {
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
  isLoading: false,
};

const renderWithLocale = (ui: React.ReactElement) =>
  render(
    <LocaleContext.Provider value={mockLocaleContext}>
      {ui}
    </LocaleContext.Provider>,
  );

/**
 * **Feature: portfolio-design-improvements**
 *
 * Task 5: Update Summary component
 * **Validates: Requirements 2.1, 2.2, 2.6, 3.1, 4.3, 8.1**
 *
 * Tests for Summary component styling improvements:
 * - Section heading (h2) with new typography scale
 * - Improved body text sizing and line height
 * - Proper spacing between heading and content
 * - Section container styling with appropriate padding
 * - Responsive text sizing
 */

describe('Summary Component Styling - Unit Tests', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    // Create a new JSDOM instance
    dom = new JSDOM(
      '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>',
      {
        url: 'http://localhost',
        pretendToBeVisual: true,
      },
    );
    document = dom.window.document;
    window = dom.window as unknown as Window & typeof globalThis;

    // Set up global window and document for React
    global.document = document;
    global.window = window as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('Section Heading Typography', () => {
    it('should use h2 typography scale for the section heading', () => {
      const { container } = renderWithLocale(<App />);

      // Find the Summary section (mock t() returns the key itself, so look for 'summary.title')
      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();

      if (summarySection) {
        const heading = summarySection.querySelector('h2');
        expect(heading).toBeTruthy();

        if (heading) {
          const classList = heading.className;

          // Should use text-h2 typography class
          expect(classList).toContain('text-h2');
        }
      }
    });

    it('should have proper color for the heading', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const heading = summarySection.querySelector('h2');

        if (heading) {
          const classList = heading.className;

          // Should use secondary color scale for headings
          expect(classList).toMatch(/text-secondary-\d+/);
        }
      }
    });
  });

  describe('Body Text Styling', () => {
    it('should use body typography scale for paragraph text', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();

      if (summarySection) {
        const paragraph = summarySection.querySelector('p');
        expect(paragraph).toBeTruthy();

        if (paragraph) {
          const classList = paragraph.className;

          // Should use text-body or text-body-lg
          const hasBodyTypography =
            classList.includes('text-body') ||
            classList.includes('text-body-lg');

          expect(hasBodyTypography).toBe(true);
        }
      }
    });

    it('should have responsive text sizing (body on mobile, body-lg on desktop)', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const paragraph = summarySection.querySelector('p');

        if (paragraph) {
          const classList = paragraph.className;

          // Should have base text-body and responsive md:text-body-lg
          expect(classList).toContain('text-body');
          expect(classList).toContain('md:text-body-lg');
        }
      }
    });

    it('should have proper line height for readability', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const paragraph = summarySection.querySelector('p');

        if (paragraph) {
          const classList = paragraph.className;

          // Should have leading-relaxed for better readability
          expect(classList).toContain('leading-relaxed');
        }
      }
    });

    it('should have proper text color', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const paragraph = summarySection.querySelector('p');

        if (paragraph) {
          const classList = paragraph.className;

          // Should use secondary color scale for body text
          expect(classList).toMatch(/text-secondary-\d+/);
        }
      }
    });
  });

  describe('Spacing and Layout', () => {
    it('should have proper spacing between heading and content', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();

      if (summarySection) {
        const classList = summarySection.className;

        // Should have space-y for vertical spacing
        expect(classList).toMatch(/space-y-\d+/);
      }
    });

    it('should have responsive spacing (smaller on mobile, larger on desktop)', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const classList = summarySection.className;

        // Should have base space-y and responsive md:space-y
        expect(classList).toMatch(/space-y-\d+/);
        expect(classList).toMatch(/md:space-y-\d+/);
      }
    });

    it('should have appropriate padding for the section container', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();

      if (summarySection) {
        const classList = summarySection.className;

        // Should have padding classes
        expect(classList).toMatch(/p-\d+/);
      }
    });

    it('should have responsive padding (smaller on mobile, larger on desktop)', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const classList = summarySection.className;

        // Should have base padding and responsive md:p-*
        expect(classList).toMatch(/p-\d+/);
        expect(classList).toMatch(/md:p-\d+/);
      }
    });
  });

  describe('Section Boundary Definition', () => {
    it('should have clear visual separation as a section', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();

      if (summarySection) {
        const classList = summarySection.className;

        // Should have at least one of: padding, margin, background, or border
        const hasBoundaryDefinition =
          classList.match(/p-\d+/) ||
          classList.match(/m-\d+/) ||
          classList.match(/bg-\w+/) ||
          classList.match(/border/);

        expect(hasBoundaryDefinition).toBeTruthy();
      }
    });

    it('should use semantic section element', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      expect(summarySection).toBeTruthy();
      expect(summarySection?.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Visual Hierarchy', () => {
    it('should have heading with larger font size than body text', () => {
      const { container } = renderWithLocale(<App />);

      const summarySection = Array.from(
        container.querySelectorAll('section'),
      ).find(section => section.textContent?.includes('summary.title'));

      if (summarySection) {
        const heading = summarySection.querySelector('h2');
        const paragraph = summarySection.querySelector('p');

        expect(heading).toBeTruthy();
        expect(paragraph).toBeTruthy();

        if (heading && paragraph) {
          const headingClasses = heading.className;
          const paragraphClasses = paragraph.className;

          // h2 should use text-h2 (30px) which is larger than text-body (16px) or text-body-lg (18px)
          expect(headingClasses).toContain('text-h2');

          const hasBodyTypography =
            paragraphClasses.includes('text-body') ||
            paragraphClasses.includes('text-body-lg');

          expect(hasBodyTypography).toBe(true);
        }
      }
    });
  });
});
