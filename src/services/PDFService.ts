/**
 * PDF Generation Service
 * 
 * This service provides functionality to generate PDF documents from HTML elements
 * using html2canvas and jsPDF libraries. It preserves CSS styling, custom fonts,
 * and visual effects in the generated PDF.
 * 
 * Requirements: 1.1, 1.4, 4.4
 */

import { PDFGenerationError, PDFErrorType } from './PDFErrors';
import { preparePrintLayout, cleanupPrintLayout, PrintLayoutCleanup } from './PrintLayoutUtils';

/**
 * Options for PDF generation
 */
export interface PDFGenerationOptions {
  /** The HTML element to convert to PDF */
  element: HTMLElement;
  /** The filename for the downloaded PDF */
  filename: string;
  /** Scale factor for canvas rendering (higher = better quality, larger file) */
  scale?: number;
  /** Page format for the PDF document */
  format?: 'a4' | 'letter';
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
}

/**
 * Result of PDF generation operation
 */
export interface PDFGenerationResult {
  /** Whether the PDF generation was successful */
  success: boolean;
  /** Error object if generation failed */
  error?: Error;
  /** Generated PDF blob if successful */
  blob?: Blob;
}

/**
 * Configuration for PDF document
 */
export interface PDFConfig {
  /** Filename for the PDF document */
  filename: string;
  /** Page format (A4 or Letter) */
  pageFormat: 'a4' | 'letter';
  /** Page orientation */
  orientation: 'portrait' | 'landscape';
  /** Scale factor for rendering quality (1-3) */
  scale: number;
  /** Whether to include PDF metadata */
  includeMetadata: boolean;
  /** Optional metadata for the PDF document */
  metadata?: {
    title: string;
    author: string;
    subject: string;
    keywords: string[];
  };
}

/**
 * Default PDF configuration
 * Requirements: 1.4, 4.4
 */
export const DEFAULT_PDF_CONFIG: PDFConfig = {
  filename: 'resume.pdf',
  pageFormat: 'a4',
  orientation: 'portrait',
  scale: 3, // 3x scale provides ~225 DPI quality for better readability
  includeMetadata: true,
  metadata: {
    title: 'Professional Resume',
    author: 'Resume Owner',
    subject: 'Professional Resume and Portfolio',
    keywords: ['resume', 'portfolio', 'professional'],
  },
};

/**
 * Configuration options for html2canvas
 * Requirements: 1.2, 2.1, 2.2, 2.3, 4.1
 */
export const HTML2CANVAS_OPTIONS = {
  /** Scale factor for higher quality rendering (3x = ~225 DPI) */
  scale: 3,
  /** Enable CORS for external resources */
  useCORS: true,
  /** Disable console logging */
  logging: false,
  /** Background color for the canvas */
  backgroundColor: '#ffffff',
  /** Fixed width for consistent rendering */
  windowWidth: 1200,
  /** Callback to modify cloned document before rendering */
  onclone: (clonedDoc: Document) => {
    // Remove animations and transitions for static PDF capture
    const style = clonedDoc.createElement('style');
    style.textContent = `
      * {
        animation: none !important;
        transition: none !important;
      }
    `;
    clonedDoc.head.appendChild(style);
  },
};

/**
 * Configuration options for jsPDF
 * Requirements: 1.4, 4.4
 */
export const JSPDF_OPTIONS = {
  /** Page format */
  format: 'a4' as const,
  /** Page orientation */
  orientation: 'portrait' as const,
  /** Unit of measurement */
  unit: 'mm' as const,
  /** Enable compression for smaller file size */
  compress: true,
};

/**
 * Captures an HTML element as a canvas using html2canvas
 * 
 * This function renders the provided HTML element to a canvas, preserving all CSS styling,
 * custom fonts, gradients, shadows, and other visual effects. It uses html2canvas with
 * optimized settings for high-quality PDF generation.
 * 
 * Requirements: 1.2, 2.1, 2.2, 2.3, 2.5, 4.1
 * 
 * @param element - The HTML element to capture
 * @param options - Optional configuration for canvas capture
 * @returns Promise that resolves to the generated canvas element
 * @throws Error if canvas generation fails
 */
export async function captureElement(
  element: HTMLElement,
  options?: Partial<typeof HTML2CANVAS_OPTIONS>
): Promise<HTMLCanvasElement> {
  // Dynamically import html2canvas to enable lazy loading
  const html2canvas = (await import('html2canvas')).default;

  // Merge provided options with defaults
  const captureOptions = {
    ...HTML2CANVAS_OPTIONS,
    ...options,
  };

  try {
    // Capture the element as a canvas
    // html2canvas will:
    // - Preserve all CSS styles (colors, fonts, spacing, borders, backgrounds)
    // - Render custom fonts (font-witt) if properly loaded
    // - Preserve gradients, shadows, and opacity effects
    // - Render SVG icons from Heroicons
    // - Handle CORS for external resources via useCORS option
    const canvas = await html2canvas(element, captureOptions);

    // Verify canvas was created successfully
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Generated canvas is invalid or empty');
    }

    return canvas;
  } catch (error) {
    // Re-throw with more context for debugging
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to capture element as canvas: ${message}`);
  }
}

/**
 * Creates a PDF document from a canvas element
 * 
 * This function converts a canvas to a PDF document using jsPDF. It calculates optimal
 * dimensions based on the specified page format and splits the content across multiple
 * pages if needed. It also includes metadata such as title, author, and creation date.
 * 
 * Requirements: 1.4, 4.4
 * 
 * @param canvas - The canvas element to convert to PDF
 * @param config - Configuration for the PDF document
 * @returns Promise that resolves to a PDF Blob
 * @throws Error if PDF creation fails
 */
export async function createPDFFromCanvas(
  canvas: HTMLCanvasElement,
  config: Partial<PDFConfig> = {}
): Promise<Blob> {
  // Dynamically import jsPDF to enable lazy loading
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

  // Merge provided config with defaults
  const pdfConfig: PDFConfig = {
    ...DEFAULT_PDF_CONFIG,
    ...config,
  };

  try {
    // Define page dimensions in mm for different formats
    // A4: 210mm x 297mm, Letter: 215.9mm x 279.4mm
    const pageDimensions = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
    };

    const pageSize = pageDimensions[pdfConfig.pageFormat];
    const pageWidth = pdfConfig.orientation === 'portrait' ? pageSize.width : pageSize.height;
    const pageHeight = pdfConfig.orientation === 'portrait' ? pageSize.height : pageSize.width;

    // Create jsPDF instance with specified settings
    const pdf = new jsPDF({
      orientation: pdfConfig.orientation,
      unit: 'mm',
      format: pdfConfig.pageFormat,
      compress: true,
    });

    // Calculate image width to fit page width (with margin)
    const margin = 15; // 15mm margin on each side for better readability
    const imgWidth = pageWidth - (margin * 2);
    
    // Calculate the total height based on canvas aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    const totalImgHeight = imgWidth / canvasAspectRatio;

    // Calculate usable page height (with top and bottom margins)
    const usablePageHeight = pageHeight - (margin * 2);
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(totalImgHeight / usablePageHeight);

    if (totalPages <= 1) {
      // Content fits on one page - simple case
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, totalImgHeight);
    } else {
      // Content spans multiple pages - slice the canvas for each page
      // Calculate how much of the canvas height corresponds to one page
      const canvasHeightPerPage = (usablePageHeight / totalImgHeight) * canvas.height;
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate the slice of the canvas for this page
        const sourceY = page * canvasHeightPerPage;
        const sourceHeight = Math.min(canvasHeightPerPage, canvas.height - sourceY);
        
        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          // Draw the slice of the original canvas
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,  // Source rectangle
            0, 0, canvas.width, sourceHeight          // Destination rectangle
          );
        }
        
        // Convert the page slice to data URL
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        
        // Calculate the height for this slice in mm
        const sliceHeight = (sourceHeight / canvas.height) * totalImgHeight;
        
        // Add the image slice to the PDF page
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, sliceHeight);
      }
    }

    // Add metadata if enabled
    if (pdfConfig.includeMetadata && pdfConfig.metadata) {
      pdf.setProperties({
        title: pdfConfig.metadata.title,
        author: pdfConfig.metadata.author,
        subject: pdfConfig.metadata.subject,
        keywords: pdfConfig.metadata.keywords.join(', '),
        creator: 'PDF Download Feature',
      });
    }

    // Generate PDF blob
    const blob = pdf.output('blob');

    // Verify blob was created successfully
    if (!blob || blob.size === 0) {
      throw new Error('Generated PDF blob is invalid or empty');
    }

    return blob;
  } catch (error) {
    // Re-throw with more context for debugging
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create PDF from canvas: ${message}`);
  }
}

/**
 * Downloads a PDF blob as a file using the browser's download API
 *
 * This function creates a temporary object URL from the provided blob,
 * creates an anchor element to trigger the download, and cleans up
 * resources after the download is initiated.
 *
 * Requirements: 1.3, 5.3
 *
 * @param blob - The PDF blob to download
 * @param filename - The filename for the downloaded file (should end with .pdf)
 * @throws Error if the download fails or browser doesn't support required APIs
 */
export function downloadPDF(blob: Blob, filename: string): void {
  // Validate inputs
  if (!blob || blob.size === 0) {
    throw new Error('Invalid or empty PDF blob provided');
  }

  if (!filename || typeof filename !== 'string') {
    throw new Error('Invalid filename provided');
  }

  // Ensure filename ends with .pdf
  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Create object URL from blob
  const objectUrl = URL.createObjectURL(blob);

  try {
    // Create temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = pdfFilename;

    // Make anchor invisible and add to DOM (required for Firefox)
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    // Trigger download by simulating click
    anchor.click();

    // Remove anchor from DOM
    document.body.removeChild(anchor);
  } finally {
    // Clean up object URL to free memory
    // Use setTimeout to ensure the download has started before revoking
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 100);
  }
}


/**
 * Main function to generate a PDF from an HTML element
 *
 * This function orchestrates the entire PDF generation process:
 * 1. Validates that the input element exists
 * 2. Captures the element as a canvas using html2canvas
 * 3. Creates a PDF document from the canvas using jsPDF
 * 4. Triggers a browser download of the PDF
 * 5. Returns a result object indicating success or failure
 *
 * Error handling follows Requirements 7.1 and 7.3:
 * - All errors are logged to console for debugging purposes
 * - Appropriate PDFGenerationError types are thrown for structured error handling
 * - Error results include the PDFGenerationError for caller handling
 *
 * Requirements: 1.1, 1.3, 7.1, 7.3
 *
 * @param options - Configuration options for PDF generation
 * @returns Promise that resolves to a PDFGenerationResult
 */
export async function generatePDF(
  options: PDFGenerationOptions
): Promise<PDFGenerationResult> {
  const {
    element,
    filename,
    scale = DEFAULT_PDF_CONFIG.scale,
    format = DEFAULT_PDF_CONFIG.pageFormat,
    orientation = DEFAULT_PDF_CONFIG.orientation,
  } = options;

  // Variable to hold the cleanup function for print layout optimization
  // Requirements: 1.2, 2.4
  let layoutCleanup: PrintLayoutCleanup | null = null;

  try {
    // Step 1: Validate input element exists
    // Requirement 7.1: Log errors for debugging
    if (!element) {
      const error = new PDFGenerationError(
        PDFErrorType.ELEMENT_NOT_FOUND,
        'Element is required for PDF generation'
      );
      console.error('PDF generation failed:', error);
      throw error;
    }

    // Verify element is attached to the DOM
    if (!document.body.contains(element)) {
      const error = new PDFGenerationError(
        PDFErrorType.ELEMENT_NOT_FOUND,
        'Element must be attached to the DOM'
      );
      console.error('PDF generation failed:', error);
      throw error;
    }

    // Step 2: Prepare print layout before capture
    // This removes animations and sets fixed width for consistent rendering
    // Requirements: 1.2, 2.4
    layoutCleanup = preparePrintLayout(element);

    // Step 3: Capture the element as a canvas
    let canvas: HTMLCanvasElement;
    try {
      canvas = await captureElement(element, {
        scale,
      });
    } catch (captureError) {
      const error = new PDFGenerationError(
        PDFErrorType.CANVAS_GENERATION_FAILED,
        'Failed to capture element as canvas',
        captureError instanceof Error ? captureError : new Error(String(captureError))
      );
      console.error('PDF generation failed:', error);
      throw error;
    }

    // Step 4: Create PDF from the canvas
    let blob: Blob;
    try {
      const pdfConfig: Partial<PDFConfig> = {
        filename,
        pageFormat: format,
        orientation,
        scale,
      };
      blob = await createPDFFromCanvas(canvas, pdfConfig);
    } catch (pdfError) {
      const error = new PDFGenerationError(
        PDFErrorType.PDF_CREATION_FAILED,
        'Failed to create PDF from canvas',
        pdfError instanceof Error ? pdfError : new Error(String(pdfError))
      );
      console.error('PDF generation failed:', error);
      throw error;
    }

    // Step 5: Trigger the download
    try {
      downloadPDF(blob, filename);
    } catch (downloadError) {
      const error = new PDFGenerationError(
        PDFErrorType.DOWNLOAD_FAILED,
        'Failed to download PDF file',
        downloadError instanceof Error ? downloadError : new Error(String(downloadError))
      );
      console.error('PDF generation failed:', error);
      throw error;
    }

    // Step 6: Return success result with blob
    return {
      success: true,
      blob,
    };
  } catch (error) {
    // Log error for debugging (Requirement 7.1)
    // Only log if not already logged (PDFGenerationError instances are logged when created)
    if (!(error instanceof PDFGenerationError)) {
      console.error('PDF generation failed:', error);
    }

    // Return error result with the PDFGenerationError (Requirement 7.3)
    // If it's already a PDFGenerationError, use it directly
    // Otherwise, wrap it in a generic PDFGenerationError
    const pdfError = error instanceof PDFGenerationError
      ? error
      : new PDFGenerationError(
          PDFErrorType.PDF_CREATION_FAILED,
          'An unexpected error occurred during PDF generation',
          error instanceof Error ? error : new Error(String(error))
        );

    return {
      success: false,
      error: pdfError,
    };
  } finally {
    // Step 7: Always cleanup print layout, even if an error occurred
    // This ensures the element is restored to its original state
    // Requirements: 1.2, 2.4
    if (layoutCleanup) {
      cleanupPrintLayout(layoutCleanup);
    }
  }
}

