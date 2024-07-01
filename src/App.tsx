import {
  Education,
  Header,
  ProfessionalExperience,
  Summary,
  Technologies,
} from './components';

const App = () => (
  <main className="font-witt container mx-auto flex flex-col text-pretty p-6 text-gray-700">
    <Header />
    <section className="flex gap-6 py-4">
      <section className="flex flex-1 flex-col">
        <ProfessionalExperience />
        <Education />
      </section>
      <section className="max-w-1/4 flex flex-col gap-4">
        <Summary />
        <Technologies />
      </section>
    </section>
  </main>
);

export default App;
