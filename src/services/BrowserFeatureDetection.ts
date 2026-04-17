/**
 * Browser Feature Detection Utility
 *
 * This module provides functionality to detect browser support for features
 * required by the PDF download functionality. It checks for canvas, blob,
 * and download API support to ensure the PDF generation will work correctly.
 *
 * Requirements: 5.1, 5.4
 */

/**
 * Result of browser feature detection
 */
export interface BrowserSupportResult {
  /** Whether the browser supports the Canvas API */
  canvasSupported: boolean;
  /** Whether the browser supports the Blob API */
  blobSupported: boolean;
  /** Whether the browser supports the download API (anchor download attribute) */
  downloadSupported: boolean;
  /** Whether all required features are supported */
  isFullySupported: boolean;
}

/**
 * Checks if the browser supports the Canvas API
 *
 * The Canvas API is required for html2canvas to render HTML elements
 * as images for PDF generation.
 *
 * @returns true if canvas is supported, false otherwise
 */
function checkCanvasSupport(): boolean {
  try {
    // Check if HTMLCanvasElement exists
    if (typeof HTMLCanvasElement === 'undefined') {
      return false;
    }

    // Create a test canvas element
    const canvas = document.createElement('canvas');

    // Check if we can get a 2D rendering context
    const context = canvas.getContext('2d');

    // Check if toDataURL is available (required for PDF generation)
    const hasToDataURL = typeof canvas.toDataURL === 'function';

    return context !== null && hasToDataURL;
  } catch {
    return false;
  }
}

/**
 * Checks if the browser supports the Blob API
 *
 * The Blob API is required for creating PDF files in memory
 * before triggering the download.
 *
 * @returns true if Blob is supported, false otherwise
 */
function checkBlobSupport(): boolean {
  try {
    // Check if Blob constructor exists
    if (typeof Blob === 'undefined') {
      return false;
    }

    // Try to create a test blob
    const testBlob = new Blob(['test'], { type: 'text/plain' });

    // Verify the blob was created successfully
    return testBlob instanceof Blob && testBlob.size > 0;
  } catch {
    return false;
  }
}

/**
 * Checks if the browser supports the download API
 *
 * The download API (anchor element with download attribute) is required
 * to trigger file downloads from JavaScript. Also checks for URL.createObjectURL
 * which is needed to create downloadable URLs from Blobs.
 *
 * @returns true if download API is supported, false otherwise
 */
function checkDownloadSupport(): boolean {
  try {
    // Check if we can create anchor elements
    const anchor = document.createElement('a');

    // Check if the download attribute is supported
    // The 'download' property exists on anchor elements in supporting browsers
    const hasDownloadAttribute = 'download' in anchor;

    // Check if URL.createObjectURL is available
    const hasCreateObjectURL =
      typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';

    // Check if URL.revokeObjectURL is available (for cleanup)
    const hasRevokeObjectURL =
      typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function';

    return hasDownloadAttribute && hasCreateObjectURL && hasRevokeObjectURL;
  } catch {
    return false;
  }
}

/**
 * Checks browser support for all features required by PDF generation
 *
 * This function performs comprehensive feature detection to determine
 * if the current browser supports all APIs needed for PDF generation
 * and download functionality.
 *
 * Requirements: 5.1, 5.4
 *
 * @returns BrowserSupportResult object with support status for each feature
 *
 * @example
 * ```typescript
 * const support = checkBrowserSupport();
 * if (!support.isFullySupported) {
 *   console.log('PDF download is not supported in this browser');
 *   if (!support.canvasSupported) {
 *     console.log('Canvas API is not supported');
 *   }
 *   if (!support.blobSupported) {
 *     console.log('Blob API is not supported');
 *   }
 *   if (!support.downloadSupported) {
 *     console.log('Download API is not supported');
 *   }
 * }
 * ```
 */
export function checkBrowserSupport(): BrowserSupportResult {
  const canvasSupported = checkCanvasSupport();
  const blobSupported = checkBlobSupport();
  const downloadSupported = checkDownloadSupport();

  // All features must be supported for PDF generation to work
  const isFullySupported =
    canvasSupported && blobSupported && downloadSupported;

  return {
    canvasSupported,
    blobSupported,
    downloadSupported,
    isFullySupported,
  };
}

/**
 * Gets a user-friendly message describing which features are not supported
 *
 * This function generates a helpful message for users when their browser
 * doesn't support all required features for PDF generation.
 *
 * Requirements: 5.4
 *
 * @param support - The result from checkBrowserSupport()
 * @returns A user-friendly message describing unsupported features, or null if all supported
 *
 * @example
 * ```typescript
 * const support = checkBrowserSupport();
 * const message = getUnsupportedFeaturesMessage(support);
 * if (message) {
 *   alert(message);
 * }
 * ```
 */
export function getUnsupportedFeaturesMessage(
  support: BrowserSupportResult,
): string | null {
  if (support.isFullySupported) {
    return null;
  }

  const unsupportedFeatures: string[] = [];

  if (!support.canvasSupported) {
    unsupportedFeatures.push('Canvas rendering');
  }

  if (!support.blobSupported) {
    unsupportedFeatures.push('File creation');
  }

  if (!support.downloadSupported) {
    unsupportedFeatures.push('File download');
  }

  const featureList = unsupportedFeatures.join(', ');

  return `Your browser does not support the following features required for PDF download: ${featureList}. Please use a modern browser such as Chrome, Firefox, Safari, or Edge.`;
}
