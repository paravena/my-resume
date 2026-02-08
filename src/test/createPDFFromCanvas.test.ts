/**
 * Unit tests for createPDFFromCanvas function
 * 
 * Tests the PDF creation functionality that converts canvas elements to PDF documents
 * with proper dimensions, metadata, and formatting.
 * 
 * Requirements: 1.4, 4.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPDFFromCanvas, DEFAULT_PDF_CONFIG, type PDFConfig } from '../services/PDFService';

// Mock jsPDF
const mockPDF = {
  addImage: vi.fn(),
  addPage: vi.fn(),
  setProperties: vi.fn(),
  output: vi.fn(() => new Blob(['mock pdf content'], { type: 'application/pdf' })),
};

vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn().mockImplementation(function() {
      return mockPDF;
    }),
  };
});

describe('createPDFFromCanvas', () => {
  let mockCanvas: HTMLCanvasElement;
  let jsPDF: any;

  beforeEach(async () => {
    // Create a mock canvas
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 1200;
    mockCanvas.height = 1600;

    // Mock toDataURL
    mockCanvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData');

    // Get the mocked jsPDF
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF;

    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Reset the mockPDF methods
    mockPDF.addImage.mockClear();
    mockPDF.addPage.mockClear();
    mockPDF.setProperties.mockClear();
    mockPDF.output.mockClear();
    mockPDF.output.mockReturnValue(new Blob(['mock pdf content'], { type: 'application/pdf' }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create PDF from canvas and return blob', async () => {
    // Act
    const result = await createPDFFromCanvas(mockCanvas);

    // Assert
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/pdf');
    expect(result.size).toBeGreaterThan(0);
  });

  it('should create jsPDF instance with correct settings for A4 portrait', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'a4',
      orientation: 'portrait',
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
  });

  it('should create jsPDF instance with correct settings for Letter landscape', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'letter',
      orientation: 'landscape',
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });
  });

  it('should use default config when no config provided', async () => {
    // Act
    await createPDFFromCanvas(mockCanvas);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: DEFAULT_PDF_CONFIG.orientation,
      unit: 'mm',
      format: DEFAULT_PDF_CONFIG.pageFormat,
      compress: true,
    });
  });

  it('should convert canvas to JPEG data URL with high quality', async () => {
    // Act
    await createPDFFromCanvas(mockCanvas);

    // Assert
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.95);
  });

  it('should add canvas image to PDF with correct dimensions for portrait A4', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'a4',
      orientation: 'portrait',
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(mockPDF.addImage).toHaveBeenCalledWith(
      'data:image/jpeg;base64,mockImageData',
      'JPEG',
      expect.any(Number), // xOffset
      expect.any(Number), // yOffset
      expect.any(Number), // width
      expect.any(Number)  // height
    );

    // Verify the call was made
    const addImageCall = mockPDF.addImage.mock.calls[0];
    expect(addImageCall).toBeDefined();
  });

  it('should calculate dimensions to fit canvas width on page with margin (wider canvas)', async () => {
    // Arrange - Create a wide canvas (aspect ratio > page aspect ratio)
    const wideCanvas = document.createElement('canvas');
    wideCanvas.width = 2000;
    wideCanvas.height = 1000;
    wideCanvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData');

    const config: Partial<PDFConfig> = {
      pageFormat: 'a4',
      orientation: 'portrait',
    };

    // Act
    await createPDFFromCanvas(wideCanvas, config);

    // Assert
    const addImageCall = mockPDF.addImage.mock.calls[0];
    const [, , xOffset, yOffset, imgWidth, imgHeight] = addImageCall;

    // For A4 portrait: 210mm x 297mm with 15mm margin
    // Image width should be 180mm (210 - 30 margin)
    expect(imgWidth).toBe(180);
    expect(imgHeight).toBe(90); // 180 / 2 (aspect ratio)
    
    // Should have margin offset
    expect(xOffset).toBe(15); // 15mm margin
    expect(yOffset).toBe(15); // 15mm margin at top
  });

  it('should calculate dimensions to fit canvas width on page with margin (taller canvas)', async () => {
    // Arrange - Create a tall canvas (aspect ratio < page aspect ratio)
    const tallCanvas = document.createElement('canvas');
    tallCanvas.width = 1000;
    tallCanvas.height = 2000;
    tallCanvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData');

    const config: Partial<PDFConfig> = {
      pageFormat: 'a4',
      orientation: 'portrait',
    };

    // Act
    await createPDFFromCanvas(tallCanvas, config);

    // Assert - For multi-page PDFs, the first page gets a slice of the canvas
    // The first addImage call should be for the first page slice
    const addImageCall = mockPDF.addImage.mock.calls[0];
    const [, , xOffset, yOffset, imgWidth, imgHeight] = addImageCall;

    // For A4 portrait: 210mm x 297mm with 15mm margin
    // Image width should be 180mm (210 - 30 margin)
    // For multi-page, the height is the usable page height (267mm)
    expect(imgWidth).toBe(180);
    expect(imgHeight).toBe(267); // First page slice height = usable page height
    
    // Should have margin offset
    expect(xOffset).toBe(15); // 15mm margin
    expect(yOffset).toBe(15); // 15mm margin at top
    
    // Should have called addPage for the second page
    expect(mockPDF.addPage).toHaveBeenCalled();
  });

  it('should add metadata when includeMetadata is true', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      includeMetadata: true,
      metadata: {
        title: 'Test Resume',
        author: 'John Doe',
        subject: 'Professional Resume',
        keywords: ['resume', 'portfolio'],
      },
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(mockPDF.setProperties).toHaveBeenCalledWith({
      title: 'Test Resume',
      author: 'John Doe',
      subject: 'Professional Resume',
      keywords: 'resume, portfolio',
      creator: 'PDF Download Feature',
    });
  });

  it('should add default metadata when includeMetadata is true and no custom metadata provided', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      includeMetadata: true,
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(mockPDF.setProperties).toHaveBeenCalledWith({
      title: DEFAULT_PDF_CONFIG.metadata!.title,
      author: DEFAULT_PDF_CONFIG.metadata!.author,
      subject: DEFAULT_PDF_CONFIG.metadata!.subject,
      keywords: DEFAULT_PDF_CONFIG.metadata!.keywords.join(', '),
      creator: 'PDF Download Feature',
    });
  });

  it('should not add metadata when includeMetadata is false', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      includeMetadata: false,
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(mockPDF.setProperties).not.toHaveBeenCalled();
  });

  it('should output PDF as blob', async () => {
    // Act
    await createPDFFromCanvas(mockCanvas);

    // Assert
    expect(mockPDF.output).toHaveBeenCalledWith('blob');
  });

  it('should throw error if PDF creation fails', async () => {
    // Arrange
    mockPDF.output.mockImplementation(() => {
      throw new Error('PDF output failed');
    });

    // Act & Assert
    await expect(createPDFFromCanvas(mockCanvas)).rejects.toThrow(
      'Failed to create PDF from canvas: PDF output failed'
    );
  });

  it('should throw error if blob is invalid (zero size)', async () => {
    // Arrange
    mockPDF.output.mockReturnValue(new Blob([], { type: 'application/pdf' }));

    // Act & Assert
    await expect(createPDFFromCanvas(mockCanvas)).rejects.toThrow(
      'Generated PDF blob is invalid or empty'
    );
  });

  it('should throw error if blob is null', async () => {
    // Arrange
    mockPDF.output.mockReturnValue(null);

    // Act & Assert
    await expect(createPDFFromCanvas(mockCanvas)).rejects.toThrow(
      'Generated PDF blob is invalid or empty'
    );
  });

  it('should handle landscape orientation correctly', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'a4',
      orientation: 'landscape',
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'landscape',
      })
    );

    // Verify dimensions are swapped for landscape
    const addImageCall = mockPDF.addImage.mock.calls[0];
    expect(addImageCall).toBeDefined();
  });

  it('should handle Letter page format correctly', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'letter',
      orientation: 'portrait',
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'letter',
      })
    );
  });

  it('should enable compression for smaller file size', async () => {
    // Act
    await createPDFFromCanvas(mockCanvas);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith(
      expect.objectContaining({
        compress: true,
      })
    );
  });

  it('should merge custom config with defaults', async () => {
    // Arrange
    const config: Partial<PDFConfig> = {
      pageFormat: 'letter',
      // Other fields should use defaults
    };

    // Act
    await createPDFFromCanvas(mockCanvas, config);

    // Assert
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: DEFAULT_PDF_CONFIG.orientation, // Default
      unit: 'mm',
      format: 'letter', // Custom
      compress: true,
    });
  });

  it('should handle canvas with square aspect ratio', async () => {
    // Arrange - Create a square canvas
    const squareCanvas = document.createElement('canvas');
    squareCanvas.width = 1000;
    squareCanvas.height = 1000;
    squareCanvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData');

    // Act
    await createPDFFromCanvas(squareCanvas);

    // Assert
    const addImageCall = mockPDF.addImage.mock.calls[0];
    const [, , , , imgWidth, imgHeight] = addImageCall;

    // Square canvas should maintain 1:1 aspect ratio
    // Width = 180mm (210 - 30 margin), Height = 180mm
    expect(imgWidth).toBe(180);
    expect(imgHeight).toBe(180);
  });

  it('should use margin offset for image placement', async () => {
    // Arrange - Create a small square canvas
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 500;
    smallCanvas.height = 500;
    smallCanvas.toDataURL = vi.fn(() => 'data:image/jpeg;base64,mockImageData');

    // Act
    await createPDFFromCanvas(smallCanvas);

    // Assert
    const addImageCall = mockPDF.addImage.mock.calls[0];
    const [, , xOffset, yOffset, imgWidth, imgHeight] = addImageCall;

    // For a square canvas on A4 portrait with 15mm margin:
    // imgWidth = 180mm (210 - 30 margin)
    // imgHeight = 180mm (maintaining 1:1 aspect ratio)
    expect(imgWidth).toBe(180);
    expect(imgHeight).toBe(180);
    expect(xOffset).toBe(15); // 15mm margin
    expect(yOffset).toBe(15); // 15mm margin at top
  });
});
