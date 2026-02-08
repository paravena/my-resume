import { useRef } from 'react';
import {
  Header,
  Passions,
  ProfessionalExperience,
  ProudOf,
  Summary,
  Technologies,
} from './components';
import DownloadButton from './components/DownloadButton/DownloadButton';

const App = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={resumeRef}
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-witt text-secondary-700"
    >
    {/* Download PDF button - fixed position top-right with responsive positioning */}
    {/* data-hide-for-print ensures this button is hidden during PDF capture */}
    <div data-hide-for-print>
      <DownloadButton
        targetRef={resumeRef}
        filename="professional-resume.pdf"
        className="fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50"
      />
    </div>
    <header className="animate-fade-in">
      <Header />
    </header>
    <main className="flex flex-col md:flex-row gap-4 md:gap-8 py-4 md:py-8">
      <div className="flex flex-1 md:w-2/3 flex-col gap-4 md:gap-8 animate-fade-in-delay">
        <Summary />
        <ProfessionalExperience />
      </div>
      <aside className="flex flex-col md:w-1/3 md:max-w-md gap-4 md:gap-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-4 md:p-8 shadow-md border border-primary-200/50 animate-fade-in-delay">
        <ProudOf />
        <Technologies />
        <Passions />
      </aside>
    </main>
    </div>
  );
};

export default App;
