import { useRef } from 'react';
import {
  Header,
  Passions,
  ProfessionalExperience,
  ProudOf,
  Summary,
  Technologies,
} from './components';
import Toolbar from './components/Toolbar/Toolbar';
import { LocaleProvider } from './i18n';

const App = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <LocaleProvider>
      <Toolbar targetRef={resumeRef} pdfFilename="professional-resume.pdf" />
      <div
        ref={resumeRef}
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 md:pt-20 md:pb-12 font-witt text-secondary-700"
      >
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
    </LocaleProvider>
  );
};

export default App;
