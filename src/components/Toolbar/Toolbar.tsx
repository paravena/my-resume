import React from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import DownloadMenu from '../DownloadMenu/DownloadMenu';

interface ToolbarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  pdfFilename?: string;
  wordFilename?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  targetRef,
  pdfFilename,
  wordFilename,
}) => {
  return (
    <div
      data-hide-for-print
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-end gap-4 bg-blue-50 px-4 py-2"
    >
      <LanguageSelector />
      <DownloadMenu
        targetRef={targetRef}
        pdfFilename={pdfFilename}
        wordFilename={wordFilename}
      />
    </div>
  );
};

export default Toolbar;
