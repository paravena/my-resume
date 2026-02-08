/**
 * PDF Error Types and Error Handling
 *
 * This module provides centralized error handling for PDF generation,
 * including error type definitions and a custom error class for
 * structured error handling.
 *
 * Requirements: 7.1, 7.2
 */

/**
 * Enumeration of all PDF generation error categories
 *
 * These error types allow for structured error handling and
 * mapping to user-friendly error messages.
 *
 * Requirements: 7.1, 7.2
 */
export enum PDFErrorType {
  /** Target element for PDF generation was not found in the DOM */
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',

  /** html2canvas failed to capture the element as a canvas */
  CANVAS_GENERATION_FAILED = 'CANVAS_GENERATION_FAILED',

  /** jsPDF failed to create the PDF document from the canvas */
  PDF_CREATION_FAILED = 'PDF_CREATION_FAILED',

  /** Browser failed to download the generated PDF file */
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',

  /** Browser does not support required features (canvas, blob, download API) */
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',

  /** Browser blocked the download (popup blocker or download restrictions) */
  DOWNLOAD_BLOCKED = 'DOWNLOAD_BLOCKED',
}

/**
 * Custom error class for PDF generation errors
 *
 * This class extends the standard Error class to include additional
 * context about the error type and the original error that caused it.
 * This enables structured error handling and user-friendly error messages.
 *
 * Requirements: 7.1, 7.2
 *
 * @example
 * ```typescript
 * throw new PDFGenerationError(
 *   PDFErrorType.ELEMENT_NOT_FOUND,
 *   'Resume content not found',
 *   originalError
 * );
 * ```
 */
export class PDFGenerationError extends Error {
  /** The category of the error for structured handling */
  public readonly type: PDFErrorType;

  /** The original error that caused this error, if any */
  public readonly originalError?: Error;

  /**
   * Creates a new PDFGenerationError
   *
   * @param type - The category of the error
   * @param message - A descriptive message about the error
   * @param originalError - The original error that caused this error (optional)
   */
  constructor(type: PDFErrorType, message: string, originalError?: Error) {
    super(message);

    // Set the error name to the class name for better stack traces
    this.name = 'PDFGenerationError';

    // Store the error type for structured handling
    this.type = type;

    // Store the original error for debugging purposes
    this.originalError = originalError;

    // Maintain proper prototype chain for instanceof checks
    // This is necessary when extending built-in classes in TypeScript
    Object.setPrototypeOf(this, PDFGenerationError.prototype);
  }
}

/**
 * Maps PDF generation errors to user-friendly messages
 *
 * This function accepts an unknown error type and returns an appropriate
 * user-friendly message based on the error type. For PDFGenerationError
 * instances, it maps the error type to a specific message. For unknown
 * errors, it returns a generic message.
 *
 * Requirements: 3.4, 7.2
 *
 * @param error - The error to handle (can be any type)
 * @returns A user-friendly error message string
 *
 * @example
 * ```typescript
 * try {
 *   await generatePDF(element);
 * } catch (error) {
 *   const message = handlePDFError(error);
 *   displayErrorToUser(message);
 * }
 * ```
 */
export function handlePDFError(error: unknown): string {
  if (error instanceof PDFGenerationError) {
    switch (error.type) {
      case PDFErrorType.ELEMENT_NOT_FOUND:
        return 'Could not find the resume content. Please refresh and try again.';
      case PDFErrorType.CANVAS_GENERATION_FAILED:
        return 'Failed to capture the resume layout. Please try again.';
      case PDFErrorType.PDF_CREATION_FAILED:
        return 'Failed to create PDF document. Please try again.';
      case PDFErrorType.DOWNLOAD_FAILED:
        return 'Failed to download PDF. Please check your browser settings.';
      case PDFErrorType.BROWSER_NOT_SUPPORTED:
        return 'Your browser does not support PDF downloads. Please use a modern browser.';
      case PDFErrorType.DOWNLOAD_BLOCKED:
        return "Your browser blocked the download. Please check your browser settings to allow downloads from this site, or try right-clicking the button and selecting 'Save As'.";
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

