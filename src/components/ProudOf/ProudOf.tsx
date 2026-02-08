import { AcademicCapIcon, WrenchIcon } from '@heroicons/react/20/solid';

const ProudOf = () => {
  return (
    <section className="space-y-3 md:space-y-4">
      <h2 className="text-xl sm:text-h2 text-primary-600 font-semibold">Most Proud Of</h2>
      <div className="space-y-3 text-body-sm sm:text-body">
        <p className="flex items-start">
          <AcademicCapIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
          <span>
            Graduated as Computer Engineer from{' '}
            <span className="font-bold">
              Universidad de Santiago de Chile, 2001
            </span>
          </span>
        </p>
        <p className="flex items-start">
          <WrenchIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
          <span>
            I have created my own open source project published at
          </span>
        </p>
        <a 
          href="http://github.com/paravena/myui2"
          target="_blank"
          rel="noopener noreferrer"
          className="block pl-7 text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
        >
          http://github.com/paravena/myui2
        </a>
      </div>
    </section>
  );
};

export default ProudOf;
