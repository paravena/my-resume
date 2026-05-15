import React, { useState } from 'react';
import { useLocale } from '../../i18n';
import { generateResumeDocx } from '../../services/WordGenerator';

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

const WordIcon = () => (
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

const SuccessIcon = () => (
  <svg
    className="-ml-1 mr-1.5 h-4 w-4 animate-[scale-in_0.2s_ease-out] text-white sm:mr-2 sm:h-5 sm:w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export interface DownloadWordButtonProps {
  filename?: string;
  className?: string;
}

const DownloadWordButton: React.FC<DownloadWordButtonProps> = ({
  filename = 'resume.docx',
  className,
}) => {
  const { t } = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      await generateResumeDocx(t, filename);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isGenerating && t('downloadWordButton.generating')}
        {showSuccess && t('downloadWordButton.downloaded')}
        {error && `Error: ${error}`}
      </div>

      <button
        type="button"
        className={`inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white sm:px-4 sm:py-2.5 sm:text-sm ${showSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700 hover:bg-primary-800'} rounded-lg border border-transparent shadow-md transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-md ${className || ''}`
          .trim()
          .replace(/\s+/g, ' ')}
        aria-label={
          isGenerating
            ? t('downloadWordButton.generating')
            : showSuccess
              ? t('downloadWordButton.downloaded')
              : t('downloadWordButton.download')
        }
        aria-busy={isGenerating}
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <LoadingSpinner />
            <span>{t('downloadWordButton.generating')}</span>
          </>
        ) : showSuccess ? (
          <>
            <SuccessIcon />
            <span>{t('downloadWordButton.downloaded')}</span>
          </>
        ) : (
          <>
            <WordIcon />
            <span>{t('downloadWordButton.download')}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 flex flex-col items-start">
          <div
            className="flex items-start rounded-lg border border-red-200 bg-red-50 p-3"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
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

          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            aria-label={t('downloadWordButton.retry')}
            className="mt-2 inline-flex items-center justify-center rounded-md border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-all duration-200 ease-in-out hover:border-primary-300 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="mr-1.5 h-4 w-4"
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
            <span>{t('downloadWordButton.retry')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadWordButton;
