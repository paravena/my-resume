import { AcademicCapIcon } from '@heroicons/react/20/solid';

import { useLocale } from '../../i18n';
const Education = () => {
  const { t } = useLocale();

  return (
    <section className="space-y-3 md:space-y-4">
      <h2 className="text-xl font-semibold text-primary-600 sm:text-h2">
        {t('education.title')}
      </h2>
      <div className="space-y-3 text-body-sm sm:text-body">
        <p className="flex items-start">
          <AcademicCapIcon
            className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span>
            {t('education.degree.text')}{' '}
            <span className="font-bold">{t('education.degree.detail')}</span>
          </span>
        </p>
      </div>
    </section>
  );
};

export default Education;
