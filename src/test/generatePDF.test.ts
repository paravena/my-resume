/**
 * Unit tests for generatePDF function
 * 
 * Tests the main PDF generation orchestration function that:
 * - Validates input element exists
 * - Calls captureElement to get canvas
 * - Calls createPDFFromCanvas to get PDF
 * - Calls downloadPDF to trigger download
 * - Returns success result with blob
 * 
 * Requirements: 1.1, 1.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generatePDF, type PDFGenerationOptions } from '../services/PDFService';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    // Add a mock getContext to make the canvas valid
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return Promise.resolve(canvas);
  }),
}));

// Mock jsPDF
const mockPdfInstance = {
  addImage: vi.fn(),
  setProperties: vi.fn(),
  output: vi.fn(() => new Blob(['mock pdf content'], { type: 'application/pdf' })),
};

vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn().mockImplementation(function() {
      return mockPdfInstance;
    }),
  };
});

describe('generatePDF', () => {
  let mockElement: HTMLDivElement;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    // Create a mock element attached to the DOM
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<h1>Test Resume</h1>';
    document.body.appendChild(mockElement);

    // Mock URL methods
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    // Reset mocks
    vi.clearAllMocks();
    
    // Reset the mockPdfInstance methods
    mockPdfInstance.addImage.mockClear();
    mockPdfInstance.setProperties.mockClear();
    mockPdfInstance.output.mockClear();
    mockPdfInstance.output.mockReturnValue(new Blob(['mock pdf content'], { type: 'application/pdf' }));
  });

  afterEach(() => {
    // Clean up DOM
    if (mockElement && mockElement.parentNode) {
      document.body.removeChild(mockElement);
    }

    // Restore URL methods
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  describe('Input Validation', () => {
    it('should return error when element is null', async () => {
      const options: PDFGenerationOptions = {
        element: null as unknown as HTMLElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Element is required for PDF generation');
    });

    it('should return error when element is undefined', async () => {
      const options: PDFGenerationOptions = {
        element: undefined as unknown as HTMLElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Element is required for PDF generation');
    });

    it('should return error when element is not attached to DOM', async () => {
      const detachedElement = document.createElement('div');
      const options: PDFGenerationOptions = {
        element: detachedElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Element must be attached to the DOM');
    });
  });

  describe('Successful PDF Generation', () => {
    it('should return success with blob when element is valid', async () => {
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test-resume.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(true);
      expect(result.blob).toBeDefined();
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.error).toBeUndefined();
    });

    it('should call html2canvas with the element', async () => {
      const html2canvas = (await import('html2canvas')).default;
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.any(Object));
    });

    it('should create PDF with jsPDF', async () => {
      const { jsPDF } = await import('jspdf');
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(jsPDF).toHaveBeenCalled();
      expect(mockPdfInstance.addImage).toHaveBeenCalled();
      expect(mockPdfInstance.output).toHaveBeenCalledWith('blob');
    });

    it('should trigger download with correct filename', async () => {
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'my-resume.pdf',
      };

      await generatePDF(options);

      expect(URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Configuration Options', () => {
    it('should use default scale when not provided', async () => {
      const html2canvas = (await import('html2canvas')).default;
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(html2canvas).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({ scale: 3 })
      );
    });

    it('should use custom scale when provided', async () => {
      const html2canvas = (await import('html2canvas')).default;
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
        scale: 3,
      };

      await generatePDF(options);

      expect(html2canvas).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({ scale: 3 })
      );
    });

    it('should use default format when not provided', async () => {
      const { jsPDF } = await import('jspdf');
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(jsPDF).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'a4' })
      );
    });

    it('should use custom format when provided', async () => {
      const { jsPDF } = await import('jspdf');
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
        format: 'letter',
      };

      await generatePDF(options);

      expect(jsPDF).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'letter' })
      );
    });

    it('should use default orientation when not provided', async () => {
      const { jsPDF } = await import('jspdf');
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(jsPDF).toHaveBeenCalledWith(
        expect.objectContaining({ orientation: 'portrait' })
      );
    });

    it('should use custom orientation when provided', async () => {
      const { jsPDF } = await import('jspdf');
      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
        orientation: 'landscape',
      };

      await generatePDF(options);

      expect(jsPDF).toHaveBeenCalledWith(
        expect.objectContaining({ orientation: 'landscape' })
      );
    });
  });

  describe('Error Handling', () => {
    it('should return error result when captureElement fails', async () => {
      const html2canvas = (await import('html2canvas')).default;
      vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Canvas capture failed'));

      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      // The error is now a PDFGenerationError with the original error wrapped
      expect(result.error?.message).toContain('Failed to capture element as canvas');
    });

    it('should return error result when createPDFFromCanvas fails', async () => {
      mockPdfInstance.output.mockImplementationOnce(() => {
        throw new Error('PDF creation failed');
      });

      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should log error to console when generation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const html2canvas = (await import('html2canvas')).default;
      vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Test error'));

      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      await generatePDF(options);

      expect(consoleSpy).toHaveBeenCalledWith('PDF generation failed:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle non-Error exceptions', async () => {
      const html2canvas = (await import('html2canvas')).default;
      vi.mocked(html2canvas).mockRejectedValueOnce('String error');

      const options: PDFGenerationOptions = {
        element: mockElement,
        filename: 'test.pdf',
      };

      const result = await generatePDF(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(Error);
    });
  });
});
