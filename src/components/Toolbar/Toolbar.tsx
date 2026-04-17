import React from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import DownloadButton from '../DownloadButton/DownloadButton';

interface ToolbarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  pdfFilename?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ targetRef, pdfFilename }) => {
  return (
    <div
      data-hide-for-print
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-end gap-4 bg-blue-50 px-4 py-2"
    >
      <LanguageSelector />
      <DownloadButton targetRef={targetRef} filename={pdfFilename} />
    </div>
  );
};

export default Toolbar;
