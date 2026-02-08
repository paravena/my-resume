import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Header from '../components/Header/Header';

/**
 * Unit tests for contact info styling improvements (Task 4.2)
 * 
 * Tests verify:
 * - Icon sizes and colors match the design system
 * - Icon-text alignment uses flex utilities
 * - Hover states on links (LinkedIn)
 * - Responsive wrapping on mobile
 * - Proper spacing between contact items
 * 
 * Requirements: 9.1, 9.2, 9.3, 11.1, 11.4
 */

describe('Contact Info Styling', () => {
  describe('Icon Styling', () => {
    it('should have icons with correct size classes (h-5 w-5)', () => {
      const { container } = render(<Header />);
      const icons = container.querySelectorAll('svg');
      
      expect(icons.length).toBeGreaterThan(0);
      
      icons.forEach((icon) => {
        const classList = icon.getAttribute('class') || '';
        expect(classList).toContain('h-5');
        expect(classList).toContain('w-5');
      });
    });

    it('should have icons with primary color scheme', () => {
      const { container } = render(<Header />);
      const icons = container.querySelectorAll('svg');
      
      icons.forEach((icon) => {
        const classList = icon.getAttribute('class') || '';
        expect(classList).toContain('text-primary-500');
      });
    });

    it('should have icons with flex-shrink-0 to prevent shrinking', () => {
      const { container } = render(<Header />);
      const icons = container.querySelectorAll('svg');
      
      icons.forEach((icon) => {
        const classList = icon.getAttribute('class') || '';
        expect(classList).toContain('flex-shrink-0');
      });
    });
  });

  describe('Icon-Text Alignment', () => {
    it('should use flex utilities for icon-text alignment', () => {
      const { container } = render(<Header />);
      const listItems = container.querySelectorAll('li');
      
      expect(listItems.length).toBeGreaterThan(0);
      
      listItems.forEach((li) => {
        const classList = li.getAttribute('class') || '';
        expect(classList).toContain('flex');
        expect(classList).toContain('items-center');
        expect(classList).toContain('gap-2');
      });
    });
  });

  describe('Link Hover States', () => {
    it('should have LinkedIn link with hover state classes', () => {
      const { container } = render(<Header />);
      const linkedInLink = container.querySelector('a[href*="linkedin"]');
      
      expect(linkedInLink).toBeTruthy();
      
      if (linkedInLink) {
        const classList = linkedInLink.getAttribute('class') || '';
        
        // Should have base color - using primary-700 for better contrast
        expect(classList).toContain('text-primary-700');
        
        // Should have hover color
        expect(classList).toContain('hover:text-primary-800');
        
        // Should have transition
        expect(classList).toContain('transition-colors');
        expect(classList).toContain('duration-250');
        
        // Should have hover underline
        expect(classList).toContain('hover:underline');
        
        // Should have cursor pointer
        expect(classList).toContain('cursor-pointer');
      }
    });

    it('should have LinkedIn link with proper accessibility attributes', () => {
      const { container } = render(<Header />);
      const linkedInLink = container.querySelector('a[href*="linkedin"]');
      
      expect(linkedInLink).toBeTruthy();
      
      if (linkedInLink) {
        // Should have target="_blank"
        expect(linkedInLink.getAttribute('target')).toBe('_blank');
        
        // Should have rel="noopener noreferrer" for security
        expect(linkedInLink.getAttribute('rel')).toBe('noopener noreferrer');
      }
    });

    it('should have LinkedIn link with focus-visible styles', () => {
      const { container } = render(<Header />);
      const linkedInLink = container.querySelector('a[href*="linkedin"]');
      
      expect(linkedInLink).toBeTruthy();
      
      if (linkedInLink) {
        const classList = linkedInLink.getAttribute('class') || '';
        
        // Should have focus-visible styles
        expect(classList).toContain('focus-visible:outline-none');
        expect(classList).toContain('focus-visible:ring-2');
        expect(classList).toContain('focus-visible:ring-primary-500');
        expect(classList).toContain('focus-visible:ring-offset-2');
        expect(classList).toContain('rounded');
      }
    });
  });

  describe('Responsive Layout', () => {
    it('should have flex-wrap for responsive wrapping', () => {
      const { container } = render(<Header />);
      const contactList = container.querySelector('ul');
      
      expect(contactList).toBeTruthy();
      
      if (contactList) {
        const classList = contactList.getAttribute('class') || '';
        expect(classList).toContain('flex');
        expect(classList).toContain('flex-wrap');
      }
    });

    it('should have responsive text sizing', () => {
      const { container } = render(<Header />);
      const contactList = container.querySelector('ul');
      
      expect(contactList).toBeTruthy();
      
      if (contactList) {
        const classList = contactList.getAttribute('class') || '';
        expect(classList).toContain('text-body');
        expect(classList).toContain('md:text-body-lg');
      }
    });
  });

  describe('Spacing', () => {
    it('should have proper spacing between contact items', () => {
      const { container } = render(<Header />);
      const contactList = container.querySelector('ul');
      
      expect(contactList).toBeTruthy();
      
      if (contactList) {
        const classList = contactList.getAttribute('class') || '';
        
        // Should have horizontal and vertical gap
        expect(classList).toMatch(/gap-x-\d+/);
        expect(classList).toMatch(/gap-y-\d+/);
        
        // Should have responsive gap
        expect(classList).toMatch(/md:gap-x-\d+/);
        expect(classList).toMatch(/md:gap-y-\d+/);
      }
    });

    it('should use larger horizontal gap than vertical gap', () => {
      const { container } = render(<Header />);
      const contactList = container.querySelector('ul');
      
      expect(contactList).toBeTruthy();
      
      if (contactList) {
        const classList = contactList.getAttribute('class') || '';
        
        // Extract gap values
        const gapXMatch = classList.match(/gap-x-(\d+)/);
        const gapYMatch = classList.match(/gap-y-(\d+)/);
        
        expect(gapXMatch).toBeTruthy();
        expect(gapYMatch).toBeTruthy();
        
        if (gapXMatch && gapYMatch) {
          const gapX = parseInt(gapXMatch[1]);
          const gapY = parseInt(gapYMatch[1]);
          
          // Horizontal gap should be larger for better visual separation
          expect(gapX).toBeGreaterThan(gapY);
        }
      }
    });
  });

  describe('Contact Items', () => {
    it('should render all contact items (phone, email, LinkedIn, location)', () => {
      const { container } = render(<Header />);
      const listItems = container.querySelectorAll('li');
      
      // Should have 4 contact items
      expect(listItems.length).toBe(4);
    });

    it('should have phone contact with PhoneIcon', () => {
      const { container } = render(<Header />);
      const phoneItem = Array.from(container.querySelectorAll('li')).find(
        (li) => li.textContent?.includes('+56')
      );
      
      expect(phoneItem).toBeTruthy();
      expect(phoneItem?.querySelector('svg')).toBeTruthy();
    });

    it('should have email contact with EnvelopeIcon', () => {
      const { container } = render(<Header />);
      const emailItem = Array.from(container.querySelectorAll('li')).find(
        (li) => li.textContent?.includes('@gmail.com')
      );
      
      expect(emailItem).toBeTruthy();
      expect(emailItem?.querySelector('svg')).toBeTruthy();
    });

    it('should have LinkedIn contact with LinkIcon', () => {
      const { container } = render(<Header />);
      const linkedInItem = Array.from(container.querySelectorAll('li')).find(
        (li) => li.textContent?.includes('linkedin')
      );
      
      expect(linkedInItem).toBeTruthy();
      expect(linkedInItem?.querySelector('svg')).toBeTruthy();
      expect(linkedInItem?.querySelector('a')).toBeTruthy();
    });

    it('should have location contact with MapPinIcon', () => {
      const { container } = render(<Header />);
      const locationItem = Array.from(container.querySelectorAll('li')).find(
        (li) => li.textContent?.includes('Santiago')
      );
      
      expect(locationItem).toBeTruthy();
      expect(locationItem?.querySelector('svg')).toBeTruthy();
    });
  });
});
