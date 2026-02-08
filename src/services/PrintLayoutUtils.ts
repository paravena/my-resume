/**
 * Print Layout Optimization Utilities
 * 
 * This module provides utilities to optimize the layout for PDF generation.
 * It handles removing animations, setting fixed widths, hiding UI elements,
 * and restoring original state after PDF capture.
 * 
 * Requirements: 1.2, 2.4
 */

/**
 * Animation class names that should be removed for PDF capture
 * These classes cause visual inconsistencies when capturing static content
 */
const ANIMATION_CLASSES = [
  'animate-fade-in',
  'animate-fade-in-delay',
  'animate-slide-in',
  'animate-slide-up',
  'animate-bounce',
  'animate-pulse',
  'animate-spin',
  'transition',
  'transition-all',
  'transition-colors',
  'transition-opacity',
  'transition-transform',
];

/**
 * Selectors for UI elements that should be hidden during PDF capture
 * These elements are interactive and shouldn't appear in the static PDF
 */
const HIDE_FOR_PRINT_SELECTORS = [
  '[data-hide-for-print]',
  '.download-button',
];

/**
 * Fixed width for consistent PDF rendering
 * This ensures the layout is captured at a consistent size regardless of viewport
 */
const PRINT_WIDTH = '1200px';

/**
 * Prepares an HTML element for PDF capture by optimizing its layout
 * 
 * This function:
 * 1. Stores the original className and style.cssText for later restoration
 * 2. Removes animation classes that could cause visual inconsistencies
 * 3. Hides UI elements that shouldn't appear in the PDF (like download button)
 * 4. Sets a fixed width (1200px) for consistent rendering across different viewports
 * 5. Sets maxWidth to 'none' to prevent responsive constraints
 * 6. Returns a cleanup function that restores the original state
 * 
 * Requirements: 1.2, 2.4
 * 
 * @param element - The HTML element to prepare for PDF capture
 * @returns A cleanup function that restores the element to its original state
 * 
 * @example
 * ```typescript
 * const cleanup = preparePrintLayout(resumeElement);
 * try {
 *   // Capture element as PDF
 *   await captureElement(resumeElement);
 * } finally {
 *   // Always restore original state
 *   cleanup();
 * }
 * ```
 */
export function preparePrintLayout(element: HTMLElement): () => void {
  // Store original state for restoration
  const originalClassName = element.className;
  const originalCssText = element.style.cssText;

  // Find and hide elements that shouldn't appear in the PDF
  const hiddenElements: { element: HTMLElement; originalDisplay: string }[] = [];
  HIDE_FOR_PRINT_SELECTORS.forEach((selector) => {
    const elements = element.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      hiddenElements.push({
        element: el,
        originalDisplay: el.style.display,
      });
      el.style.display = 'none';
    });
  });

  // Remove animation classes from the element
  // This ensures the PDF captures a static state without animation artifacts
  ANIMATION_CLASSES.forEach((animationClass) => {
    element.classList.remove(animationClass);
  });

  // Set fixed width for consistent rendering
  // This ensures the layout is captured at the same size regardless of viewport
  element.style.width = PRINT_WIDTH;
  element.style.maxWidth = 'none';

  // Return cleanup function that restores original state
  return () => {
    element.className = originalClassName;
    element.style.cssText = originalCssText;
    
    // Restore hidden elements
    hiddenElements.forEach(({ element: el, originalDisplay }) => {
      el.style.display = originalDisplay;
    });
  };
}

/**
 * Type definition for the cleanup function returned by preparePrintLayout
 */
export type PrintLayoutCleanup = () => void;

/**
 * Cleans up the print layout by restoring the original state
 *
 * This function accepts the cleanup function returned by preparePrintLayout
 * and invokes it to restore the element to its original state.
 *
 * The cleanup function:
 * 1. Restores the original className
 * 2. Restores the original inline styles (cssText)
 *
 * Requirements: 1.2, 2.4
 *
 * @param cleanup - The cleanup function returned by preparePrintLayout
 *
 * @example
 * ```typescript
 * const cleanup = preparePrintLayout(resumeElement);
 * try {
 *   // Capture element as PDF
 *   await captureElement(resumeElement);
 * } finally {
 *   // Restore original state using cleanupPrintLayout
 *   cleanupPrintLayout(cleanup);
 * }
 * ```
 */
export function cleanupPrintLayout(cleanup: PrintLayoutCleanup): void {
  if (typeof cleanup === 'function') {
    cleanup();
  }
}

