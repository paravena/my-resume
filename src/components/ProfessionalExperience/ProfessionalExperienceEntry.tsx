import { ReactNode } from 'react';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/20/solid';
import { useLocale } from '../../i18n';

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
  const { t } = useLocale();

  return (
    <article className="card-experience group cursor-default">
      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-xl font-semibold text-secondary-800 transition-colors duration-250 group-hover:text-primary-600 sm:text-h3">
          {title}
        </h3>
        <p className="text-body font-medium text-primary-600 sm:text-body-lg">
          {companyName}
        </p>
      </header>
      <ul className="mb-4 flex flex-col gap-2 text-body-sm text-secondary-600 sm:flex-row sm:justify-between">
        <li className="flex items-center gap-2">
          <CalendarIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span>
            {t('professionalExperience.dateFrom')} {fromDate}{' '}
            {t('professionalExperience.dateTo')}{' '}
            {toDate ?? t('professionalExperience.datePresent')}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span>{location}</span>
        </li>
      </ul>
      <div className="text-body leading-relaxed text-secondary-700">
        {children}
      </div>
    </article>
  );
};

export default ProfessionalExperienceEntry;
