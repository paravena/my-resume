import { HeartIcon, MusicalNoteIcon } from '@heroicons/react/20/solid';

const Passions = () => {
  return (
    <section className="text-md flex flex-col gap-2">
      <h3 className="text-2xl text-blue-500">Passions</h3>
      <ul className="space-y-2">
        <li>
          <h4 className="text-xl">Programming</h4>
          <span>
            <HeartIcon className="mr-2 inline h-4 w-4 text-blue-500" />
            It is not only a job for me, I really enjoy programming and learn
            new things as much as possible.
          </span>
        </li>
        <li>
          <h4 className="text-xl">Saxophone</h4>
          <span>
            <MusicalNoteIcon className="mr-2 inline h-4 w-4 text-blue-500" /> It
            is still hard for me, but since I started learning music six years
            ago and discovered this wonderful instrument, I found a new world
            for me which I really enjoy :-).
          </span>
        </li>
      </ul>
    </section>
  );
};

export default Passions;
