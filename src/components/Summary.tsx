import { AcademicCapIcon, WrenchIcon } from '@heroicons/react/20/solid';

const Summary = () => {
  return (
    <ul className="flex w-full flex-col gap-4">
      <li className="space-y-2">
        <h2 className="text-blue-500">Summary</h2>
        <p className="text-xs">
          I have extensive experience as a software developer for over 15 years.
          My expertise lies in various technologies and programming languages,
          particularly JavaScript and Java. One of my key areas of focus in my
          daily work is unit testing and functional testing, as they aid me in
          understanding user requirements before beginning any coding tasks. In
          essence, I am a software developer who prioritizes understanding user
          needs and then strives to implement the best solutions to meet those
          expectations.
        </p>
      </li>
      <li className="space-y-2">
        <h2 className="text-blue-500">Most Proud Of</h2>
        <p className="text-xs">
          <AcademicCapIcon className="mr-2 inline h-4 w-4 text-blue-500" />
          Graduated as Computer Engineer from Universidad de Santiago de Chile
        </p>
        <p className="text-xs">
          <WrenchIcon className="mr-2 inline h-4 w-4 text-blue-500" />I have
          created my own open source project published at
          <a href="http://github.com/paravena/myui2">
            http://github.com/paravena/myui2
          </a>
        </p>
      </li>
    </ul>
  );
};

export default Summary;
