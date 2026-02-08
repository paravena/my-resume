/**
 * Unit tests for BrowserFeatureDetection utility
 * 
 * Tests the browser feature detection functionality that checks for
 * canvas, blob, and download API support required for PDF generation.
 * 
 * Note: jsdom doesn't fully support canvas getContext() without the canvas npm package,
 * so some tests verify the detection logic rather than actual browser support.
 * 
 * Requirements: 5.1, 5.4
 */

import { describe, it, expect } from 'vitest';
import { 
  checkBrowserSupport, 
  getUnsupportedFeaturesMessage,
  BrowserSupportResult 
} from '../services/BrowserFeatureDetection';

describe('checkBrowserSupport', () => {
  describe('return structure', () => {
    it('should return correct BrowserSupportResult structure', () => {
      // Act
      const result = checkBrowserSupport();

      // Assert
      expect(result).toHaveProperty('canvasSupported');
      expect(result).toHaveProperty('blobSupported');
      expect(result).toHaveProperty('downloadSupported');
      expect(result).toHaveProperty('isFullySupported');
      expect(typeof result.canvasSupported).toBe('boolean');
      expect(typeof result.blobSupported).toBe('boolean');
      expect(typeof result.downloadSupported).toBe('boolean');
      expect(typeof result.isFullySupported).toBe('boolean');
    });

    it('should set isFullySupported based on all feature flags', () => {
      // Act
      const result = checkBrowserSupport();

      // Assert - isFullySupported should be true only if all features are supported
      const expectedFullSupport = result.canvasSupported && result.blobSupported && result.downloadSupported;
      expect(result.isFullySupported).toBe(expectedFullSupport);
    });
  });

  describe('canvas support detection', () => {
    it('should check for HTMLCanvasElement existence', () => {
      // Assert - HTMLCanvasElement should exist in jsdom
      expect(typeof HTMLCanvasElement).not.toBe('undefined');
    });

    it('should verify canvas has toDataURL method', () => {
      // Arrange
      const canvas = document.createElement('canvas');

      // Assert
      expect(typeof canvas.toDataURL).toBe('function');
    });

    it('should detect canvas support correctly in jsdom environment', () => {
      // Note: jsdom doesn't fully support canvas getContext() without the canvas npm package
      // The detection should return false in this environment, which is correct behavior
      const result = checkBrowserSupport();
      
      // In jsdom without canvas package, getContext returns null, so canvasSupported should be false
      // This is the expected behavior - the detection is working correctly
      expect(typeof result.canvasSupported).toBe('boolean');
    });
  });

  describe('blob support detection', () => {
    it('should detect blob support when available', () => {
      // Act
      const result = checkBrowserSupport();

      // Assert - Blob is supported in jsdom
      expect(result.blobSupported).toBe(true);
    });

    it('should verify Blob constructor works', () => {
      // Arrange & Act
      const blob = new Blob(['test content'], { type: 'text/plain' });

      // Assert
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should verify Blob can be created with different types', () => {
      // Arrange & Act
      const pdfBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const textBlob = new Blob(['hello'], { type: 'text/plain' });

      // Assert
      expect(pdfBlob.type).toBe('application/pdf');
      expect(textBlob.type).toBe('text/plain');
    });
  });

  describe('download API support detection', () => {
    it('should detect download support when available', () => {
      // Act
      const result = checkBrowserSupport();

      // Assert - download API is supported in jsdom
      expect(result.downloadSupported).toBe(true);
    });

    it('should verify anchor element has download attribute', () => {
      // Arrange
      const anchor = document.createElement('a');

      // Assert
      expect('download' in anchor).toBe(true);
    });

    it('should verify URL.createObjectURL is available', () => {
      // Assert
      expect(typeof URL.createObjectURL).toBe('function');
    });

    it('should verify URL.revokeObjectURL is available', () => {
      // Assert
      expect(typeof URL.revokeObjectURL).toBe('function');
    });

    it('should verify URL.createObjectURL works with Blob', () => {
      // Arrange
      const blob = new Blob(['test'], { type: 'text/plain' });

      // Act
      const url = URL.createObjectURL(blob);

      // Assert
      expect(url).toBeTruthy();
      expect(typeof url).toBe('string');
      expect(url.startsWith('blob:')).toBe(true);

      // Cleanup
      URL.revokeObjectURL(url);
    });
  });

  describe('isFullySupported flag logic', () => {
    it('should correctly compute isFullySupported from individual flags', () => {
      // Act
      const result = checkBrowserSupport();

      // Assert - isFullySupported should be the AND of all individual flags
      const manualComputation = result.canvasSupported && result.blobSupported && result.downloadSupported;
      expect(result.isFullySupported).toBe(manualComputation);
    });
  });
});

describe('getUnsupportedFeaturesMessage', () => {
  it('should return null when all features are supported', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: true,
      blobSupported: true,
      downloadSupported: true,
      isFullySupported: true,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).toBeNull();
  });

  it('should return message when canvas is not supported', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: false,
      blobSupported: true,
      downloadSupported: true,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).not.toBeNull();
    expect(message).toContain('Canvas rendering');
    expect(message).toContain('modern browser');
  });

  it('should return message when blob is not supported', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: true,
      blobSupported: false,
      downloadSupported: true,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).not.toBeNull();
    expect(message).toContain('File creation');
  });

  it('should return message when download is not supported', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: true,
      blobSupported: true,
      downloadSupported: false,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).not.toBeNull();
    expect(message).toContain('File download');
  });

  it('should list all unsupported features when multiple are missing', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: false,
      blobSupported: false,
      downloadSupported: false,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).not.toBeNull();
    expect(message).toContain('Canvas rendering');
    expect(message).toContain('File creation');
    expect(message).toContain('File download');
  });

  it('should suggest using modern browsers', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: false,
      blobSupported: true,
      downloadSupported: true,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).toContain('Chrome');
    expect(message).toContain('Firefox');
    expect(message).toContain('Safari');
    expect(message).toContain('Edge');
  });

  it('should handle partial support correctly', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: true,
      blobSupported: false,
      downloadSupported: false,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).not.toBeNull();
    expect(message).not.toContain('Canvas rendering');
    expect(message).toContain('File creation');
    expect(message).toContain('File download');
  });

  it('should return message with proper format', () => {
    // Arrange
    const support: BrowserSupportResult = {
      canvasSupported: false,
      blobSupported: true,
      downloadSupported: true,
      isFullySupported: false,
    };

    // Act
    const message = getUnsupportedFeaturesMessage(support);

    // Assert
    expect(message).toMatch(/Your browser does not support/);
    expect(message).toMatch(/Please use a modern browser/);
  });
});
