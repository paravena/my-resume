import { HeartIcon, MusicalNoteIcon } from '@heroicons/react/20/solid';
import { useLocale } from '../../i18n';

const Passions = () => {
  const { t } = useLocale();

  return (
    <section className="space-y-3 border-t-2 border-primary-200/60 pt-4 md:space-y-4 md:pt-6">
      <h2 className="text-xl font-semibold text-secondary-800 sm:text-h2">
        {t('passions.title')}
      </h2>
      <ul className="space-y-3 text-body-sm sm:text-body md:space-y-4">
        <li className="space-y-1">
          <h3 className="text-lg font-semibold text-secondary-700 sm:text-h3">
            {t('passions.programming.title')}
          </h3>
          <p className="flex items-start">
            <HeartIcon
              className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
              aria-hidden="true"
            />
            <span>{t('passions.programming.description')}</span>
          </p>
        </li>
        <li className="space-y-1">
          <h3 className="text-lg font-semibold text-secondary-700 sm:text-h3">
            {t('passions.saxophone.title')}
          </h3>
          <p className="flex items-start">
            <MusicalNoteIcon
              className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
              aria-hidden="true"
            />
            <span>{t('passions.saxophone.description')}</span>
          </p>
        </li>
      </ul>
    </section>
  );
};

export default Passions;
