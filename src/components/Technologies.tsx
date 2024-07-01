import TechnologyList from './TechnologyList.tsx';

const Technologies = () => {
  return (
    <section>
      <h2 className="text-blue-500">Technologies</h2>
      <ul className="flex flex-col gap-1">
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
          <TechnologyList
            title="Databases"
            items={['Postgres', 'Oracle', 'Mysql', 'MongoDB']}
          />
          <TechnologyList
            title="Clouds Environments"
            items={['AWS', 'Vercel', 'Railway', 'Heroku']}
          />
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
