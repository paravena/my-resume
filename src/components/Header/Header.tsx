import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
} from '@heroicons/react/20/solid';

const Header = () => (
  <header className="flex flex-col space-y-4 md:space-y-6">
    <h1 className="text-h1 md:text-display font-bold text-secondary-900">Pablo Aravena</h1>
    <ul className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8 md:gap-y-4 text-body md:text-body-lg">
      <li className="flex items-center gap-2">
        <PhoneIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
        <span className="text-secondary-700">+56 9 62810987</span>
      </li>
      <li className="flex items-center gap-2">
        <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
        <span className="text-secondary-700">paravena74@gmail.com</span>
      </li>
      <li className="flex items-center gap-2">
        <LinkIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
        <a 
          href="https://linkedin.com/in/paravena74" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 hover:text-primary-800 transition-colors duration-250 cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
        >
          https://linkedin.com/in/paravena74
        </a>
      </li>
      <li className="flex items-center gap-2">
        <MapPinIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
        <span className="text-secondary-700">Santiago, Chile</span>
      </li>
    </ul>
  </header>
);

export default Header;
