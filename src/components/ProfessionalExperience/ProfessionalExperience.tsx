import ProfessionalExperienceEntry from './ProfessionalExperienceEntry.tsx';
import { useLocale } from '../../i18n';

const ProfessionalExperience = () => {
  const { t } = useLocale();

  return (
    <section className="flex flex-1 flex-col space-y-6 md:space-y-8">
      <h2 className="mb-2 text-h2 font-semibold text-secondary-800 md:text-3xl">
        {t('professionalExperience.title')}
      </h2>
      <div className="space-y-4 md:space-y-6">
        <ProfessionalExperienceEntry
          title={t('professionalExperience.indeed.title')}
          location={t('professionalExperience.indeed.location')}
          companyName={t('professionalExperience.indeed.company')}
          fromDate={t('professionalExperience.indeed.fromDate')}
        >
          <p>{t('professionalExperience.indeed.description')}</p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.indeed.activities.0')}</li>
            <li>{t('professionalExperience.indeed.activities.1')}</li>
            <li>{t('professionalExperience.indeed.activities.2')}</li>
            <li>{t('professionalExperience.indeed.activities.3')}</li>
            <li>{t('professionalExperience.indeed.activities.4')}</li>
            <li>{t('professionalExperience.indeed.activities.5')}</li>
          </ul>
        </ProfessionalExperienceEntry>
        <ProfessionalExperienceEntry
          title={t('professionalExperience.toptal.title')}
          location={t('professionalExperience.toptal.location')}
          fromDate={t('professionalExperience.toptal.fromDate')}
          toDate={t('professionalExperience.toptal.toDate')}
          companyName={t('professionalExperience.toptal.company')}
        >
          <p>{t('professionalExperience.toptal.description')}</p>
          <p className="mt-3">
            <strong>
              {t('professionalExperience.toptal.steadyApp.title')}
            </strong>{' '}
            - {t('professionalExperience.toptal.steadyApp.subtitle')}
          </p>
          <ul className="list-disc px-4 py-1">
            <li>{t('professionalExperience.toptal.steadyApp.activities.0')}</li>
            <li>{t('professionalExperience.toptal.steadyApp.activities.1')}</li>
            <li>{t('professionalExperience.toptal.steadyApp.activities.2')}</li>
            <li>{t('professionalExperience.toptal.steadyApp.activities.3')}</li>
          </ul>
          <p className="mt-3">
            <strong>{t('professionalExperience.toptal.gigSmart.title')}</strong>{' '}
            - {t('professionalExperience.toptal.gigSmart.subtitle')}
          </p>
          <ul className="list-disc px-4 py-1">
            <li>{t('professionalExperience.toptal.gigSmart.activities.0')}</li>
            <li>{t('professionalExperience.toptal.gigSmart.activities.1')}</li>
            <li>{t('professionalExperience.toptal.gigSmart.activities.2')}</li>
          </ul>
          <p className="mt-3">
            <strong>{t('professionalExperience.toptal.alteryx.title')}</strong>{' '}
            - {t('professionalExperience.toptal.alteryx.subtitle')}
          </p>
          <ul className="list-disc px-4 py-1">
            <li>{t('professionalExperience.toptal.alteryx.activities.0')}</li>
            <li>{t('professionalExperience.toptal.alteryx.activities.1')}</li>
            <li>{t('professionalExperience.toptal.alteryx.activities.2')}</li>
            <li>{t('professionalExperience.toptal.alteryx.activities.3')}</li>
          </ul>
          <p className="mt-3">
            <strong>{t('professionalExperience.toptal.halo.title')}</strong> -{' '}
            {t('professionalExperience.toptal.halo.subtitle')}
          </p>
          <ul className="list-disc px-4 py-1">
            <li>{t('professionalExperience.toptal.halo.activities.0')}</li>
            <li>{t('professionalExperience.toptal.halo.activities.1')}</li>
            <li>{t('professionalExperience.toptal.halo.activities.2')}</li>
            <li>{t('professionalExperience.toptal.halo.activities.3')}</li>
          </ul>
          <p className="mt-2">{t('professionalExperience.toptal.techUsed')}</p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.toptal.techList.0')}</li>
            <li>{t('professionalExperience.toptal.techList.1')}</li>
            <li>{t('professionalExperience.toptal.techList.2')}</li>
            <li>{t('professionalExperience.toptal.techList.3')}</li>
            <li>{t('professionalExperience.toptal.techList.4')}</li>
          </ul>
        </ProfessionalExperienceEntry>
        <ProfessionalExperienceEntry
          title={t('professionalExperience.recoveryPlanner.title')}
          location={t('professionalExperience.recoveryPlanner.location')}
          fromDate={t('professionalExperience.recoveryPlanner.fromDate')}
          toDate={t('professionalExperience.recoveryPlanner.toDate')}
          companyName={t('professionalExperience.recoveryPlanner.company')}
        >
          <p>{t('professionalExperience.recoveryPlanner.description')}</p>
          <p className="mt-2">
            {t('professionalExperience.recoveryPlanner.techUsed')}
          </p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.recoveryPlanner.techList.0')}</li>
            <li>{t('professionalExperience.recoveryPlanner.techList.1')}</li>
          </ul>
        </ProfessionalExperienceEntry>
        <ProfessionalExperienceEntry
          title={t('professionalExperience.nisum.title')}
          location={t('professionalExperience.nisum.location')}
          fromDate={t('professionalExperience.nisum.fromDate')}
          toDate={t('professionalExperience.nisum.toDate')}
          companyName={t('professionalExperience.nisum.company')}
        >
          <p>{t('professionalExperience.nisum.description')}</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>
                {t('professionalExperience.nisum.projects.0.title')}
              </strong>{' '}
              {t('professionalExperience.nisum.projects.0.description')}
            </li>
            <li>
              <strong>
                {t('professionalExperience.nisum.projects.1.title')}
              </strong>{' '}
              {t('professionalExperience.nisum.projects.1.description')}
            </li>
            <li>
              <strong>
                {t('professionalExperience.nisum.projects.2.title')}
              </strong>{' '}
              {t('professionalExperience.nisum.projects.2.description')}
            </li>
          </ul>
          <p className="mt-2">{t('professionalExperience.nisum.techUsed')}</p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.nisum.techList.0')}</li>
            <li>{t('professionalExperience.nisum.techList.1')}</li>
          </ul>
        </ProfessionalExperienceEntry>
        <ProfessionalExperienceEntry
          title={t('professionalExperience.experian.title')}
          location={t('professionalExperience.experian.location')}
          fromDate={t('professionalExperience.experian.fromDate')}
          toDate={t('professionalExperience.experian.toDate')}
          companyName={t('professionalExperience.experian.company')}
        >
          <p>{t('professionalExperience.experian.description')}</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>
                {t('professionalExperience.experian.projects.0.title')}
              </strong>{' '}
              {t('professionalExperience.experian.projects.0.description')}
            </li>
            <li>
              <strong>
                {t('professionalExperience.experian.projects.1.title')}
              </strong>{' '}
              {t('professionalExperience.experian.projects.1.description')}
            </li>
          </ul>
          <p className="mt-2">
            {t('professionalExperience.experian.techUsed')}
          </p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.experian.techList.0')}</li>
            <li>{t('professionalExperience.experian.techList.1')}</li>
          </ul>
        </ProfessionalExperienceEntry>
        <ProfessionalExperienceEntry
          title={t('professionalExperience.fedex.title')}
          location={t('professionalExperience.fedex.location')}
          fromDate={t('professionalExperience.fedex.fromDate')}
          toDate={t('professionalExperience.fedex.toDate')}
          companyName={t('professionalExperience.fedex.company')}
        >
          <p>{t('professionalExperience.fedex.description')}</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>
                {t('professionalExperience.fedex.projects.0.title')}
              </strong>{' '}
              {t('professionalExperience.fedex.projects.0.description')}
            </li>
            <li>
              <strong>
                {t('professionalExperience.fedex.projects.1.title')}
              </strong>{' '}
              {t('professionalExperience.fedex.projects.1.description')}
            </li>
          </ul>
          <p className="mt-2">{t('professionalExperience.fedex.techUsed')}</p>
          <ul className="list-disc px-4 py-2">
            <li>{t('professionalExperience.fedex.techList.0')}</li>
            <li>{t('professionalExperience.fedex.techList.1')}</li>
          </ul>
        </ProfessionalExperienceEntry>
      </div>
    </section>
  );
};

export default ProfessionalExperience;
