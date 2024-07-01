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
      <h3 className="text-lg text-blue-500">{title}</h3>
      <h4 className="text-sm">{companyName}</h4>
      <ul className="flex gap-2 text-xs">
        <li>
          <CalendarIcon className="mr-2 inline h-4 w-4 text-blue-500" />
          From {fromDate} to {toDate ?? 'Present'}
        </li>
        <li>
          <MapPinIcon className="mr-2 inline h-4 w-4 text-blue-500" />
          {location}
        </li>
      </ul>
      <article className="py-2 text-xs">{children}</article>
    </section>
  );
};

export default ProfessionalExperienceEntry;
