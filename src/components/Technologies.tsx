import TechnologyList from './TechnologyList.tsx';

const Technologies = () => {
  return (
    <section className="space-y-2">
      <h2 className="text-2xl text-blue-500">Technologies</h2>
      <ul className="flex flex-col gap-4">
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
