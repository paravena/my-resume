import TechnologyList from './TechnologyList.tsx';

const Technologies = () => {
  return (
    <section className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t-2 border-primary-200/60">
      <h2 className="text-xl sm:text-h2 font-semibold text-secondary-800">Technologies</h2>
      <ul className="flex flex-col gap-4 md:gap-6">
        <li>
          <TechnologyList
            title="Programming Languages"
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
            title="Frameworks and Libraries"
            items={[
              'React',
              'React Native',
              'NextJS',
              'Redux',
              'React Query',
              'Express',
              'NestJs',
              'Spring Framework',
              'Flask',
              'Django',
            ]}
          />
        </li>
        <li>
          <TechnologyList
            title="Databases"
            items={['Postgres', 'Oracle', 'Mysql', 'MongoDB']}
          />
        </li>
        <li>
          <TechnologyList
            title="Clouds Environments"
            items={['AWS', 'Vercel', 'Railway', 'Heroku']}
          />
        </li>
        <li>
          <TechnologyList
            title="Certifications"
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
