import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../../i18n';
import { generateResumeDocx } from '../../services/WordGenerator';
import { handlePDFError } from '../../services/PDFErrors';

export interface DownloadMenuProps {
  targetRef: React.RefObject<HTMLElement | null>;
  pdfFilename?: string;
  wordFilename?: string;
}

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="-ml-1 mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5"
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

const LoadingSpinner = () => (
  <svg
    className="-ml-1 mr-1.5 h-4 w-4 animate-spin text-white sm:mr-2 sm:h-5 sm:w-5"
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

const DownloadMenu: React.FC<DownloadMenuProps> = ({
  targetRef,
  pdfFilename = 'resume.pdf',
  wordFilename = 'resume.docx',
}) => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'pdf' | 'word' | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handlePdfDownload = async () => {
    if (isGenerating) return;
    setIsOpen(false);
    setIsGenerating('pdf');

    try {
      const element = targetRef.current;
      if (!element) {
        throw new Error(t('downloadButton.error.targetNotFound'));
      }

      const originalTitle = document.title;
      document.title = pdfFilename.replace('.pdf', '');
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    } catch (err) {
      const errorMessage = handlePDFError(err);
      console.error('PDF generation error:', errorMessage);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleWordDownload = async () => {
    if (isGenerating) return;
    setIsOpen(false);
    setIsGenerating('word');

    try {
      await generateResumeDocx(t, wordFilename);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Word generation error:', message);
    } finally {
      setIsGenerating(null);
    }
  };

  const buttonLabel = isGenerating
    ? isGenerating === 'pdf'
      ? t('downloadButton.generating')
      : t('downloadWordButton.generating')
    : t('downloadMenu.download');

  return (
    <div ref={menuRef} className="relative">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isGenerating === 'pdf' && t('downloadButton.generating')}
        {isGenerating === 'word' && t('downloadWordButton.generating')}
      </div>

      <button
        type="button"
        className={`inline-flex items-center justify-center rounded-lg border border-transparent px-3 py-2 text-xs font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-sm ${
          isGenerating
            ? 'bg-primary-600'
            : 'bg-primary-700 hover:bg-primary-800'
        }`}
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-busy={!!isGenerating}
        onClick={() => {
          if (!isGenerating) setIsOpen(!isOpen);
        }}
        disabled={!!isGenerating}
      >
        {isGenerating ? (
          <>
            <LoadingSpinner />
            <span>{buttonLabel}</span>
          </>
        ) : (
          <>
            <DownloadIcon />
            <span>{t('downloadMenu.download')}</span>
            <ChevronIcon open={isOpen} />
          </>
        )}
      </button>

      {isOpen && !isGenerating && (
        <div
          className="absolute right-0 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          role="menu"
          aria-label={t('downloadMenu.ariaLabel')}
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
            onClick={handlePdfDownload}
          >
            <svg
              className="mr-2.5 h-4 w-4 text-red-500"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            {t('downloadMenu.asPdf')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center border-t border-gray-100 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
            onClick={handleWordDownload}
          >
            <svg
              className="mr-2.5 h-4 w-4 text-blue-600"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            {t('downloadMenu.asWord')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadMenu;
