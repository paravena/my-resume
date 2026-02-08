import {
  Header,
  Passions,
  ProfessionalExperience,
  ProudOf,
  Summary,
  Technologies,
} from './components';

const App = () => (
  <main className="container mx-auto flex flex-col text-pretty py-6 font-witt text-gray-700">
    <Header />
    <section className="flex gap-6 py-4">
      <section className="flex flex-1 flex-col gap-4">
        <Summary />
        <ProfessionalExperience />
      </section>
      <section className="flex max-w-1/3 flex-col gap-4 rounded-lg bg-blue-100 p-4">
        <ProudOf />
        <Technologies />
        <Passions />
      </section>
    </section>
  </main>
);

export default App;
