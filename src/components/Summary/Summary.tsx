import { useLocale } from '../../i18n';

const Summary = () => {
  const { t } = useLocale();

  return (
    <section className="space-y-4 rounded-lg border border-secondary-200 bg-white p-4 shadow-sm md:space-y-6 md:p-8">
      <h2 className="text-h2 font-semibold text-secondary-800">
        {t('summary.title')}
      </h2>
      <p className="text-body leading-relaxed text-secondary-700 md:text-body-lg">
        {t('summary.text')}
      </p>
    </section>
  );
};

export default Summary;
