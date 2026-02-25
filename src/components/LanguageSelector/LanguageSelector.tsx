import React from 'react';
import { useLocale, SUPPORTED_LOCALES } from '../../i18n';

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div role="group" aria-label={t('toolbar.languageSelector.ariaLabel')}>
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          aria-pressed={locale === loc}
          aria-label={t(`toolbar.languageSelector.${loc}`)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? 'bg-primary-600 text-white'
              : 'bg-white text-secondary-700 hover:bg-secondary-100'
          } ${loc !== SUPPORTED_LOCALES[0] ? 'ml-1' : ''}`}
        >
          {t(`toolbar.languageSelector.${loc}`)}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
