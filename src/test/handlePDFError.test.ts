/**
 * Unit tests for handlePDFError function
 *
 * Tests the error handling function that maps PDF generation errors
 * to user-friendly messages.
 *
 * Requirements: 3.4, 7.2
 */

import { describe, it, expect } from 'vitest';
import {
  handlePDFError,
  PDFGenerationError,
  PDFErrorType,
} from '../services/PDFErrors';

describe('handlePDFError', () => {
  describe('PDFGenerationError handling', () => {
    it('should return correct message for ELEMENT_NOT_FOUND error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.ELEMENT_NOT_FOUND,
        'Element not found'
      );
      const message = handlePDFError(error);
      expect(message).toBe(
        'Could not find the resume content. Please refresh and try again.'
      );
    });

    it('should return correct message for CANVAS_GENERATION_FAILED error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.CANVAS_GENERATION_FAILED,
        'Canvas generation failed'
      );
      const message = handlePDFError(error);
      expect(message).toBe(
        'Failed to capture the resume layout. Please try again.'
      );
    });

    it('should return correct message for PDF_CREATION_FAILED error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.PDF_CREATION_FAILED,
        'PDF creation failed'
      );
      const message = handlePDFError(error);
      expect(message).toBe('Failed to create PDF document. Please try again.');
    });

    it('should return correct message for DOWNLOAD_FAILED error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.DOWNLOAD_FAILED,
        'Download failed'
      );
      const message = handlePDFError(error);
      expect(message).toBe(
        'Failed to download PDF. Please check your browser settings.'
      );
    });

    it('should return correct message for BROWSER_NOT_SUPPORTED error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.BROWSER_NOT_SUPPORTED,
        'Browser not supported'
      );
      const message = handlePDFError(error);
      expect(message).toBe(
        'Your browser does not support PDF downloads. Please use a modern browser.'
      );
    });

    it('should return correct message for DOWNLOAD_BLOCKED error', () => {
      const error = new PDFGenerationError(
        PDFErrorType.DOWNLOAD_BLOCKED,
        'Download blocked'
      );
      const message = handlePDFError(error);
      expect(message).toBe(
        "Your browser blocked the download. Please check your browser settings to allow downloads from this site, or try right-clicking the button and selecting 'Save As'."
      );
    });

    it('should preserve original error in PDFGenerationError', () => {
      const originalError = new Error('Original error');
      const error = new PDFGenerationError(
        PDFErrorType.ELEMENT_NOT_FOUND,
        'Element not found',
        originalError
      );
      expect(error.originalError).toBe(originalError);
      // handlePDFError should still return the correct message
      const message = handlePDFError(error);
      expect(message).toBe(
        'Could not find the resume content. Please refresh and try again.'
      );
    });
  });

  describe('Unknown error handling', () => {
    it('should return default message for standard Error', () => {
      const error = new Error('Some error');
      const message = handlePDFError(error);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for string error', () => {
      const message = handlePDFError('string error');
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for null', () => {
      const message = handlePDFError(null);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for undefined', () => {
      const message = handlePDFError(undefined);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for number', () => {
      const message = handlePDFError(42);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should return default message for object', () => {
      const message = handlePDFError({ code: 'ERROR' });
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('All error types coverage', () => {
    it('should handle all PDFErrorType values', () => {
      // Verify all enum values are handled
      const errorTypes = Object.values(PDFErrorType);
      
      for (const errorType of errorTypes) {
        const error = new PDFGenerationError(errorType, `Test ${errorType}`);
        const message = handlePDFError(error);
        
        // All messages should be non-empty strings
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        
        // All messages should be user-friendly (not technical)
        expect(message).not.toContain('undefined');
        expect(message).not.toContain('null');
      }
    });
  });
});
