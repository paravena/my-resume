import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
} from '@heroicons/react/20/solid';
import { useLocale } from '../../i18n';

const Header = () => {
  const { t } = useLocale();

  return (
    <header className="flex flex-col space-y-4 md:space-y-6">
      <h1 className="text-h1 font-bold text-secondary-900 md:text-display">
        {t('header.name')}
      </h1>
      <ul className="flex flex-wrap gap-x-6 gap-y-3 text-body md:gap-x-8 md:gap-y-4 md:text-body-lg">
        <li className="flex items-center gap-2">
          <PhoneIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span className="text-secondary-700">{t('header.phone')}</span>
        </li>
        <li className="flex items-center gap-2">
          <EnvelopeIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span className="text-secondary-700">{t('header.email')}</span>
        </li>
        <li className="flex items-center gap-2">
          <LinkIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <a
            href={t('header.linkedin')}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded text-primary-700 transition-colors duration-250 hover:text-primary-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {t('header.linkedin')}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon
            className="h-5 w-5 flex-shrink-0 text-primary-500"
            aria-hidden="true"
          />
          <span className="text-secondary-700">{t('header.location')}</span>
        </li>
      </ul>
    </header>
  );
};

export default Header;
