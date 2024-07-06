import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
} from '@heroicons/react/20/solid';

const Header = () => (
  <header className="flex flex-col space-y-2">
    <h1 className="text-4xl">Pablo Aravena</h1>
    <ul className="flex flex-wrap justify-between gap-2 text-xl">
      <li className="flex items-center gap-2">
        <PhoneIcon className="h-4 w-4 text-blue-500" />
        <span>+56 9 62810987</span>
      </li>
      <li className="flex items-center gap-2">
        <EnvelopeIcon className="h-4 w-4 text-blue-500" />
        <span>paravena74@gmail.com</span>
      </li>
      <li className="flex items-center gap-2">
        <LinkIcon className="h-4 w-4 text-blue-500" />
        <a href="https://linkedin.com/in/paravena74" target="_blank">
          https://linkedin.com/in/paravena74
        </a>
      </li>
      <li className="flex items-center gap-2">
        <MapPinIcon className="h-4 w-4 text-blue-500" />
        <span>Santiago, Chile</span>
      </li>
    </ul>
  </header>
);

export default Header;
