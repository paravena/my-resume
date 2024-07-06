import { AcademicCapIcon, WrenchIcon } from '@heroicons/react/20/solid';

const ProudOf = () => {
  return (
    <section className="space-y-2 text-xl">
      <h2 className="text-2xl text-blue-500">Most Proud Of</h2>
      <p>
        <AcademicCapIcon className="mr-2 inline h-4 w-4 text-blue-500" />
        Graduated as Computer Engineer from &nbsp;
        <span className="font-bold">
          Universidad de Santiago de Chile, 2001
        </span>
      </p>
      <p>
        <WrenchIcon className="mr-2 inline h-4 w-4 text-blue-500" />I have
        created my own open source project published at
      </p>
      <a href="http://github.com/paravena/myui2">
        http://github.com/paravena/myui2
      </a>
    </section>
  );
};

export default ProudOf;
