import ProfessionalExperienceEntry from './ProfessionalExperienceEntry.tsx';

const ProfessionalExperience = () => {
  return (
    <section className="flex flex-1 flex-col space-y-6 md:space-y-8">
      <h2 className="text-h2 md:text-3xl font-semibold text-secondary-800 mb-2">Professional Experience</h2>
      <div className="space-y-4 md:space-y-6">
      <ProfessionalExperienceEntry
        title="Full Stack Developer"
        location="Remote"
        companyName="Indeed"
        fromDate="September 2024"
      >
        <p>
          Working as a Full Stack Developer on the{' '}
          <a 
            href="https://indeed.com/career-advice" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >
            Career Guide
          </a>{' '}
          website. I build features using micro frontends with Mosaic (Indeed's in-house technology), 
          server-side components, batch processes, and GraphQL APIs.
        </p>
        <ul className="list-disc px-4 py-2">
          <li>Build and maintain micro frontend components using React and TypeScript</li>
          <li>Develop server-side features with Node.js and Java</li>
          <li>Create and optimize GraphQL APIs for data fetching</li>
          <li>Implement batch processes for data processing tasks</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Full Stack Developer"
        location="Santiago, Chile (Remote)"
        fromDate="January 2018"
        toDate="August 2024"
        companyName="Toptal.com"
      >
        <p>
          As a freelance developer at{' '}
          <a 
            href="https://toptal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >Toptal.com</a>, I worked on projects for companies like{' '}
          <a 
            href="http://gigsmart.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >GigSmart</a>,{' '}
          <a 
            href="https://steadyapp.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >SteadyApp</a>,{' '}
          <a 
            href="http://alteryx.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >Alteryx</a>, and{' '}
          <a 
            href="https://myhalo.ai" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 hover:text-primary-800 hover:underline transition-colors duration-250 cursor-pointer py-2 -my-2 inline-flex items-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >Halo By Hines</a>.
        </p>
        <p className="mt-3"><strong>SteadyApp</strong> - React Native mobile app development:</p>
        <ul className="list-disc px-4 py-1">
          <li>Built authentication system using Auth0</li>
          <li>Implemented A/B testing with Optimizely</li>
          <li>Created integrations with Plaid and Argyle for financial data</li>
          <li>Developed multiple screens and navigation flows</li>
        </ul>
        <p className="mt-3"><strong>GigSmart</strong> - Backend development with Elixir:</p>
        <ul className="list-disc px-4 py-1">
          <li>Built GraphQL mutations and queries using Absinthe</li>
          <li>Worked with Ecto for database operations</li>
          <li>APIs consumed by React web apps using Relay</li>
        </ul>
        <p className="mt-3"><strong>Alteryx</strong> - Internal software license management system:</p>
        <ul className="list-disc px-4 py-1">
          <li>Built backend with Java and Spring Framework</li>
          <li>Integrated with legacy SOAP-based APIs</li>
          <li>Implemented caching layer using Redis for better performance</li>
          <li>Created frontend with React and TypeScript</li>
        </ul>
        <p className="mt-3"><strong>Halo by Hines</strong> - AI-powered real estate marketing platform:</p>
        <ul className="list-disc px-4 py-1">
          <li>Built MVP web app for creating property advertisements</li>
          <li>Integrated AI tools to generate marketing content automatically</li>
          <li>Developed media upload system for property images</li>
          <li>Created AI-generated visualizations of remodeled interiors and exteriors</li>
        </ul>
        <p className="mt-2">Technologies I used:</p>
        <ul className="list-disc px-4 py-2">
          <li>React, React Native, Next.js, Relay</li>
          <li>JavaScript, TypeScript, Elixir</li>
          <li>Node.js, Java, Spring Framework, Python (Django, Flask)</li>
          <li>Redis, SOAP APIs, AI/ML integrations</li>
          <li>Auth0, Optimizely, Plaid, Argyle</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Software Developer"
        location="Santiago, Chile (Remote)"
        fromDate="December 2016"
        toDate="April 2019"
        companyName="RecoveryPlanner"
      >
        <p>
          I designed and built RPX, a web-based risk management application. 
          I created the frontend using Angular and Material UI. I also built 
          a mobile app prototype using Ionic and Meteor.
        </p>
        <p className="mt-2">Technologies I used:</p>
        <ul className="list-disc px-4 py-2">
          <li>Angular, Ionic, Meteor</li>
          <li>JavaScript, TypeScript</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Technical Lead"
        location="Santiago, Chile"
        fromDate="January 2013"
        toDate="September 2016"
        companyName="Nisum"
      >
        <p>Key projects I led:</p>
        <ul className="space-y-2 mt-2">
          <li>
            <strong>Macy's DevOps:</strong> Built a deployment workflow system using Activiti BPMN 
            and Spring Framework to manage software releases across multiple environments.
          </li>
          <li>
            <strong>Size & Pack:</strong> Created middleware to process and transform purchase orders 
            from different systems into a common format. Used Cucumber for testing and practiced TDD.
          </li>
          <li>
            <strong>GAP EMV POS:</strong> Upgraded Point of Sale systems to support chip and PIN 
            credit/debit cards (EMV standard).
          </li>
        </ul>
        <p className="mt-2">Technologies I used:</p>
        <ul className="list-disc px-4 py-2">
          <li>Java, Spring Framework</li>
          <li>JUnit, Cucumber, Maven</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Senior Developer"
        location="Santiago, Chile"
        fromDate="July 2011"
        toDate="December 2012"
        companyName="Experian Interactive Media"
      >
        <p>
          Built and maintained web applications for lending and marketing. Key projects:
        </p>
        <ul className="space-y-2 mt-2">
          <li>
            <strong>LowerMyBills.com:</strong> A loan comparison website that helps users find 
            the best credit options. The system collects user information, checks credit scores 
            through external APIs, and shows matching lenders.
          </li>
          <li>
            <strong>Campaign Administration System:</strong> An internal tool for creating and 
            managing marketing campaigns with workflow support for different team roles.
          </li>
        </ul>
        <p className="mt-2">Technologies I used:</p>
        <ul className="list-disc px-4 py-2">
          <li>Java, Spring Framework</li>
          <li>AngularJS, JUnit, Maven</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Senior Developer"
        location="Santiago, Chile"
        fromDate="November 2004"
        toDate="June 2011"
        companyName="FedEx"
      >
        <p>
          Built software solutions for the Latin America and Caribbean region. Key projects:
        </p>
        <ul className="mt-2 space-y-2">
          <li>
            <strong>Low Value Module:</strong> A mobile app for processing low-value shipments, 
            allowing data updates and generating customs reports.
          </li>
          <li>
            <strong>FedEx Global Clearance (FGC):</strong> A system that processes shipment 
            manifest data (list of packages arriving on each flight). I helped create a unified 
            solution that replaced country-specific systems. Started in Trinidad and Tobago, 
            then expanded to Costa Rica, Mexico, Brazil, and other countries.
          </li>
        </ul>
        <p className="mt-2">Technologies I used:</p>
        <ul className="list-disc px-4 py-2">
          <li>Java, Spring Framework</li>
          <li>JUnit, Maven, jQuery</li>
        </ul>
      </ProfessionalExperienceEntry>
      </div>
    </section>
  );
};

export default ProfessionalExperience;
