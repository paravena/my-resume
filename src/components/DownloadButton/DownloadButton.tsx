import React, { useState, useEffect, useRef } from 'react';
import { handlePDFError } from '../../services/PDFErrors';
import { checkBrowserSupport, getUnsupportedFeaturesMessage, BrowserSupportResult } from '../../services/BrowserFeatureDetection';
import { useLocale } from '../../i18n';

/**
 * Props interface for the DownloadButton component.
 * 
 * @property targetRef - Reference to the HTML element to be captured for PDF generation
 * @property filename - Optional filename for the downloaded PDF (default: 'resume.pdf')
 * @property className - Optional CSS class name for custom styling
 * @property onSuccess - Optional callback function called when PDF generation succeeds
 * @property onError - Optional callback function called when PDF generation fails
 */
export interface DownloadButtonProps {
  /** Reference to the HTML element to be captured for PDF generation */
  targetRef: React.RefObject<HTMLElement>;
  /** Filename for the downloaded PDF (default: 'resume.pdf') */
  filename?: string;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Callback function called when PDF generation succeeds */
  onSuccess?: () => void;
  /** Callback function called when PDF generation fails */
  onError?: (error: Error) => void;
}

/**
 * DownloadButton component that triggers PDF generation and download.
 * 
 * This component provides a button that, when clicked, opens the browser's
 * native print dialog configured for PDF output. This approach uses the
 * browser's rendering engine which handles all CSS correctly including
 * flexbox, icons, and custom fonts.
 * 
 * @example
 * ```tsx
 * const resumeRef = useRef<HTMLDivElement>(null);
 * 
 * <DownloadButton
 *   targetRef={resumeRef}
 *   filename="my-resume.pdf"
 *   onSuccess={() => console.log('PDF downloaded!')}
 *   onError={(error) => console.error('Failed:', error)}
 * />
 * ```
 */
const DownloadButton: React.FC<DownloadButtonProps> = ({
  targetRef,
  filename = 'resume.pdf',
  className,
  onSuccess,
  onError,
}) => {
  const { t } = useLocale();

  /**
   * State for tracking PDF generation in progress.
   * When true, the button should be disabled and show a loading indicator.
   * Validates: Requirements 3.2, 3.3
   */
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  /**
   * State for storing error messages from PDF generation failures.
   * When not null, an error message should be displayed to the user.
   * Validates: Requirements 3.4
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * State for showing success feedback after PDF generation completes.
   * When true, displays a checkmark animation briefly.
   * Validates: Requirements 3.5
   */
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  /**
   * State for storing browser support detection result.
   * Used to determine if the browser supports all required features for PDF generation.
   * Validates: Requirements 5.4
   */
  const [browserSupport, setBrowserSupport] = useState<BrowserSupportResult | null>(null);

  /**
   * State for tracking if the operation is taking longer than expected (> 2 seconds).
   * When true, an enhanced progress indicator is displayed to provide additional feedback.
   * Validates: Requirements 6.3
   */
  const [isLongOperation, setIsLongOperation] = useState<boolean>(false);

  /**
   * State for tracking the elapsed time in seconds during long operations.
   * Used to display how long the operation has been running.
   * Validates: Requirements 6.3
   */
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  /**
   * Ref for the timeout that detects when operation takes > 2 seconds.
   * Validates: Requirements 6.3
   */
  const longOperationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Ref for the interval that updates elapsed time during long operations.
   * Validates: Requirements 6.3
   */
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Ref to track if a PDF generation is currently in progress.
   * This provides immediate protection against rapid clicks before the state update takes effect.
   * Used in conjunction with isGenerating state for double protection.
   * Validates: Requirements 3.3
   */
  const isGeneratingRef = useRef<boolean>(false);

  /**
   * Effect hook to run browser feature detection on component mount.
   * Checks for canvas, blob, and download API support.
   * Validates: Requirements 5.4
   */
  useEffect(() => {
    const support = checkBrowserSupport();
    setBrowserSupport(support);
  }, []);

  /**
   * Effect hook to manage the long operation detection timer.
   * Sets up a timeout to detect when generation takes > 2 seconds.
   * Also sets up an interval to update elapsed time during long operations.
   * Validates: Requirements 6.3
   */
  useEffect(() => {
    if (isGenerating) {
      // Set up timeout to detect long operations (> 2 seconds)
      longOperationTimeoutRef.current = setTimeout(() => {
        setIsLongOperation(true);
        setElapsedSeconds(2);
        
        // Start interval to update elapsed time every second
        elapsedIntervalRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }, 2000);
    } else {
      // Clean up timers when generation completes
      if (longOperationTimeoutRef.current) {
        clearTimeout(longOperationTimeoutRef.current);
        longOperationTimeoutRef.current = null;
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
      // Reset long operation state
      setIsLongOperation(false);
      setElapsedSeconds(0);
    }

    // Cleanup function
    return () => {
      if (longOperationTimeoutRef.current) {
        clearTimeout(longOperationTimeoutRef.current);
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
    };
  }, [isGenerating]);

  /**
   * Handles retry after a PDF generation failure.
   * 
   * This function resets the error state and triggers a new download attempt.
   * It implements the error recovery flow as specified in Requirement 7.3.
   * 
   * Validates: Requirement 7.3
   */
  const handleRetry = (): void => {
    // Reset error state
    setError(null);
    
    // Call handleDownload to retry the PDF generation
    // Note: handleDownload will set isGenerating to true, so we don't need to reset it here
    handleDownload();
  };

  /**
   * Handles the PDF download process using browser's native print functionality.
   * 
   * This function uses window.print() which leverages the browser's native
   * rendering engine. This ensures all CSS is rendered correctly including
   * flexbox layouts, SVG icons, and custom fonts.
   * 
   * The @media print CSS rules in index.css handle:
   * - Hiding elements marked with data-hide-for-print
   * - Setting proper page margins
   * - Ensuring colors print correctly
   * - Preventing page breaks inside cards
   * 
   * Validates: Requirements 1.1, 3.2, 3.3, 3.4, 3.5
   */
  const handleDownload = async (): Promise<void> => {
    // Debounce: Check ref immediately to prevent rapid clicks before state update takes effect
    // This provides double protection: immediate ref check + state-based button disable
    // Validates: Requirement 3.3
    if (isGeneratingRef.current) {
      return;
    }

    // Set ref immediately to prevent any subsequent rapid clicks
    isGeneratingRef.current = true;

    // Set loading state to true and clear any previous error
    // Validates: Requirements 3.2, 3.3
    setIsGenerating(true);
    setError(null);

    try {
      // Validate that the target element exists
      const element = targetRef.current;
      if (!element) {
        throw new Error(t('downloadButton.error.targetNotFound'));
      }

      // Store original document title to restore later
      const originalTitle = document.title;
      
      // Set document title to filename (browsers use this as default PDF filename)
      document.title = filename.replace('.pdf', '');

      // Use browser's native print functionality
      // This opens the print dialog where user can select "Save as PDF"
      // The @media print CSS rules will handle styling
      window.print();

      // Restore original title after a short delay
      // (print dialog is async, so we wait a bit)
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);

      // Show success feedback
      // Note: We can't detect if user actually saved the PDF,
      // but we show success since the print dialog opened successfully
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      onSuccess?.();

    } catch (err) {
      // Handle unexpected errors
      // Validates: Requirements 3.4
      const errorMessage = handlePDFError(err);
      setError(errorMessage);
      
      // Call onError callback
      const errorObj = err instanceof Error ? err : new Error(String(err));
      onError?.(errorObj);
    } finally {
      // Always reset loading state and ref when complete
      // Validates: Requirements 3.2, 3.3
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  /**
   * Loading spinner SVG component.
   * Displays an animated spinner when PDF generation is in progress.
   * Responsive sizing: smaller on mobile, larger on desktop.
   * Validates: Requirements 3.2
   */
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  /**
   * Download icon SVG component.
   * Displays when the button is in idle state.
   * Responsive sizing: smaller on mobile, larger on desktop.
   */
  const DownloadIcon = () => (
    <svg
      className="-ml-1 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  /**
   * Success checkmark icon SVG component.
   * Displays briefly after successful PDF generation.
   * Includes a scale animation for visual feedback.
   * Validates: Requirements 3.5
   */
  const SuccessIcon = () => (
    <svg
      className="-ml-1 mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white animate-[scale-in_0.2s_ease-out]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  /**
   * Enhanced progress indicator component for long operations.
   * Displays when PDF generation takes longer than 2 seconds.
   * Shows elapsed time and a pulsing animation to indicate ongoing progress.
   * Validates: Requirements 6.3
   */
  const LongOperationProgress = () => (
    <div 
      className="mt-3 flex flex-col items-start"
      role="status"
      aria-live="polite"
      data-testid="long-operation-progress"
    >
      <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
        {/* Animated progress indicator */}
        <div className="flex items-center mr-3">
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />
            {/* Inner spinning circle */}
            <svg
              className="relative h-6 w-6 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-blue-800">
            {t('downloadButton.longOperation.title')}
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            {t('downloadButton.longOperation.elapsed').replace('{seconds}', String(elapsedSeconds))}
          </p>
        </div>
      </div>
    </div>
  );

  /**
   * Determines the status message for screen reader announcements.
   * This provides accessible feedback for loading, error, success, and browser support states.
   * Validates: Requirements 8.2, 8.3, 5.4, 6.3, 3.5
   */
  const getStatusMessage = (): string => {
    if (browserSupport && !browserSupport.isFullySupported) {
      return getUnsupportedFeaturesMessage(browserSupport) || 'Browser features not supported';
    }
    if (isGenerating && isLongOperation) {
      return `${t('downloadButton.generating')} ${t('downloadButton.longOperation.elapsed').replace('{seconds}', String(elapsedSeconds))}`;
    }
    if (isGenerating) {
      return t('downloadButton.generating');
    }
    if (showSuccess) {
      return t('downloadButton.downloaded');
    }
    if (error) {
      return `Error: ${error}`;
    }
    return '';
  };

  /**
   * Determines if the button should be disabled.
   * Button is disabled when generating PDF or when browser features are not supported.
   * Validates: Requirements 3.3, 5.4
   */
  const isButtonDisabled = isGenerating || (browserSupport !== null && !browserSupport.isFullySupported);

  /**
   * Gets the warning message for unsupported browser features.
   * Returns null if all features are supported.
   * Validates: Requirements 5.4
   */
  const browserWarningMessage = browserSupport && !browserSupport.isFullySupported
    ? getUnsupportedFeaturesMessage(browserSupport)
    : null;

  return (
    <div className="flex flex-col items-start">
      {/* Screen reader status announcements */}
      {/* Validates: Requirements 8.3 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {getStatusMessage()}
      </div>

      {/* Main download button with Tailwind styling */}
      {/* Validates: Requirements 3.2, 3.3, 8.2, 8.3 */}
      {/* Main download button with WCAG AA compliant colors
          * Background: primary-700 (#0369a1) with white text provides 5.93:1 contrast ratio
          * This exceeds the WCAG 2.1 AA requirement of 4.5:1 for normal text
          * Responsive sizing: smaller padding on mobile, larger on desktop
          * Validates: Requirement 8.4, 3.1 */}
      <button
        type="button"
        className={`
          inline-flex items-center justify-center
          px-3 py-2 sm:px-4 sm:py-2.5
          text-xs sm:text-sm font-medium text-white
          ${showSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700 hover:bg-primary-800'}
          border border-transparent rounded-lg
          shadow-md
          transition-all duration-200 ease-in-out
          hover:shadow-lg
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md
          ${className || ''}
        `.trim().replace(/\s+/g, ' ')}
        aria-label={isGenerating ? t('downloadButton.generating') : showSuccess ? t('downloadButton.downloaded') : browserWarningMessage ? 'Download PDF - feature not supported' : t('downloadButton.download')}
        aria-busy={isGenerating}
        aria-disabled={isButtonDisabled}
        onClick={handleDownload}
        disabled={isButtonDisabled}
      >
        {isGenerating ? (
          <>
            <LoadingSpinner />
            <span>{t('downloadButton.generating')}</span>
          </>
        ) : showSuccess ? (
          <>
            <SuccessIcon />
            <span>{t('downloadButton.downloaded')}</span>
          </>
        ) : (
          <>
            <DownloadIcon />
            <span>{t('downloadButton.download')}</span>
          </>
        )}
      </button>

      {/* Browser compatibility warning message */}
      {/* Validates: Requirements 5.4 */}
      {browserWarningMessage && (
        <div className="mt-3 flex flex-col items-start">
          <div 
            className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-md"
            role="alert"
            aria-live="polite"
          >
            {/* Warning icon */}
            <svg
              className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700">{browserWarningMessage}</p>
          </div>
        </div>
      )}

      {/* Long operation progress indicator */}
      {/* Displays when PDF generation takes > 2 seconds */}
      {/* Validates: Requirements 6.3 */}
      {isGenerating && isLongOperation && <LongOperationProgress />}

      {/* Error message and retry button */}
      {/* Validates: Requirements 3.4, 7.3 */}
      {error && (
        <div className="mt-3 flex flex-col items-start">
          {/* Error message with alert styling */}
          <div 
            className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            {/* Error icon */}
            <svg
              className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>

          {/* Retry button */}
          <button
            type="button"
            onClick={handleRetry}
            disabled={isGenerating}
            aria-label="Retry PDF download"
            className={`
              mt-2
              inline-flex items-center justify-center
              px-3 py-1.5
              text-sm font-medium text-primary-700
              bg-primary-50
              border border-primary-200 rounded-md
              transition-all duration-200 ease-in-out
              hover:bg-primary-100 hover:border-primary-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            `.trim().replace(/\s+/g, ' ')}
          >
            {/* Retry icon */}
            <svg
              className="h-4 w-4 mr-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{t('downloadButton.retry')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
