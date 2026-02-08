import { HeartIcon, MusicalNoteIcon } from '@heroicons/react/20/solid';

const Passions = () => {
  return (
    <section className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t-2 border-primary-200/60">
      <h2 className="text-xl sm:text-h2 font-semibold text-secondary-800">Passions</h2>
      <ul className="space-y-3 md:space-y-4 text-body-sm sm:text-body">
        <li className="space-y-1">
          <h3 className="text-lg sm:text-h3 font-semibold text-secondary-700">Programming</h3>
          <p className="flex items-start">
            <HeartIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
            <span>
              It is not only a job for me, I really enjoy programming and learn
              new things as much as possible.
            </span>
          </p>
        </li>
        <li className="space-y-1">
          <h3 className="text-lg sm:text-h3 font-semibold text-secondary-700">Saxophone</h3>
          <p className="flex items-start">
            <MusicalNoteIcon className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
            <span>
              It is still hard for me, but since I started learning music six years
              ago and discovered this wonderful instrument, I found a new world
              for me which I really enjoy :-).
            </span>
          </p>
        </li>
      </ul>
    </section>
  );
};

export default Passions;
