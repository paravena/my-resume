import TechnologyList from './TechnologyList.tsx';
import { useLocale } from '../../i18n';

const Technologies = () => {
  const { t } = useLocale();

  return (
    <section className="space-y-3 border-t-2 border-primary-200/60 pt-4 md:space-y-4 md:pt-6">
      <h2 className="text-xl font-semibold text-secondary-800 sm:text-h2">
        {t('technologies.title')}
      </h2>
      <ul className="flex flex-col gap-4 md:gap-6">
        <li>
          <TechnologyList
            title={t('technologies.programmingLanguages.title')}
            items={[
              'Javascript',
              'Typescript',
              'Node.js',
              'Java',
              'Python',
              'Elixir',
            ]}
          />
        </li>
        <li>
          <TechnologyList
            title={t('technologies.frameworks.title')}
            items={[
              'React',
              'React Native',
              'NextJS',
              'Redux',
              'React Query',
              'Express',
              'NestJs',
              'Spring Framework',
              'Spring Boot',
              'Flask',
              'Django',
            ]}
          />
        </li>
        <li>
          <TechnologyList
            title={t('technologies.databases.title')}
            items={['Postgres', 'Oracle', 'Mysql', 'MongoDB', 'Contentful']}
          />
        </li>
        <li>
          <TechnologyList
            title={t('technologies.clouds.title')}
            items={['AWS', 'Vercel', 'Railway', 'Heroku']}
          />
        </li>
        <li>
          <TechnologyList
            title={t('technologies.certifications.title')}
            items={[
              'Sun Certified Java Developer',
              'Sun Certified Java Programmer',
              'Sun Certified Web Component Developer',
              'Sun Certified Business Component Developer',
            ]}
          />
        </li>
      </ul>
    </section>
  );
};

export default Technologies;
