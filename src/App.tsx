import { useRef } from 'react';
import {
  Header,
  Passions,
  ProfessionalExperience,
  Education,
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
        className="container mx-auto max-w-7xl px-4 pb-8 pt-16 font-witt text-secondary-700 sm:px-6 md:pb-12 md:pt-20 lg:px-8"
      >
        <header className="animate-fade-in">
          <Header />
        </header>
        <main className="flex flex-col gap-4 py-4 md:flex-row md:gap-8 md:py-8">
          <div className="animate-fade-in-delay flex flex-1 flex-col gap-4 md:w-2/3 md:gap-8">
            <Summary />
            <ProfessionalExperience />
          </div>
          <aside className="animate-fade-in-delay flex flex-col gap-4 rounded-xl border border-primary-200/50 bg-gradient-to-br from-primary-50 to-primary-100 p-4 shadow-md md:w-1/3 md:max-w-md md:gap-6 md:p-8">
            <Education />
            <Technologies />
            <Passions />
          </aside>
        </main>
      </div>
    </LocaleProvider>
  );
};

export default App;
