import { useLocale } from '../../i18n';

const Summary = () => {
  const { t } = useLocale();

  return (
    <section className="space-y-4 md:space-y-6 p-4 md:p-8 rounded-lg bg-white shadow-sm border border-secondary-200">
      <h2 className="text-h2 text-secondary-800 font-semibold">{t('summary.title')}</h2>
      <p className="text-body md:text-body-lg text-secondary-700 leading-relaxed">
        {t('summary.text')}
      </p>
    </section>
  );
};

export default Summary;
