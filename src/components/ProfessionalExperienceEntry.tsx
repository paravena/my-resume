import { ReactNode } from 'react';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/20/solid';

type ProfessionalExperienceEntryProps = {
  title: string;
  companyName: string;
  fromDate: string;
  toDate?: string;
  location: string;
  children: ReactNode;
};

const ProfessionalExperienceEntry = ({
  companyName,
  fromDate,
  toDate,
  title,
  location,
  children,
}: ProfessionalExperienceEntryProps) => {
  return (
    <section className="flex flex-col space-y-2">
      <header className="flex justify-between text-xl text-blue-500">
        <h3>{title}</h3>
        <h3>{companyName}</h3>
      </header>
      <ul className="text-md flex justify-between">
        <li className="flex items-center gap-2">
          <CalendarIcon className="inline h-4 w-4 text-blue-500" />
          <span>
            From {fromDate} to {toDate ?? 'Present'}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon className="inline h-4 w-4 text-blue-500" />
          <span>{location}</span>
        </li>
      </ul>
      <article className="text-md py-2 text-justify">{children}</article>
    </section>
  );
};

export default ProfessionalExperienceEntry;
