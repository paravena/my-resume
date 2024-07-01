import { AcademicCapIcon, MapPinIcon } from '@heroicons/react/20/solid';

const Education = () => {
  return (
    <section>
      <h2 className="text-blue-500">Education</h2>
      <ul className="flex flex-col justify-between text-sm">
        <li>
          <AcademicCapIcon className="mr-2 inline h-4 w-4 text-blue-500" />
          Universidad de Santiago
        </li>
        <li>
          <MapPinIcon className="mr-2 inline h-4 w-4 text-blue-500" /> Computer
          Engineer, graduated 2001
        </li>
      </ul>
    </section>
  );
};

export default Education;
