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
    <article className="card-experience group cursor-default">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <h3 className="text-xl sm:text-h3 text-secondary-800 font-semibold group-hover:text-primary-600 transition-colors duration-250">
          {title}
        </h3>
        <p className="text-body sm:text-body-lg text-primary-600 font-medium">
          {companyName}
        </p>
      </header>
      <ul className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4 text-body-sm text-secondary-600">
        <li className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary-500 flex-shrink-0" aria-hidden="true" />
          <span>
            From {fromDate} to {toDate ?? 'Present'}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0" aria-hidden="true" />
          <span>{location}</span>
        </li>
      </ul>
      <div className="text-body text-secondary-700 leading-relaxed">
        {children}
      </div>
    </article>
  );
};

export default ProfessionalExperienceEntry;
