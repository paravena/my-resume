import ProfessionalExperienceEntry from './ProfessionalExperienceEntry.tsx';

const ProfessionalExperience = () => {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <h2 className="text-2xl">Professional Experience</h2>
      <ProfessionalExperienceEntry
        title="Full Stack Developer"
        location="Santigo, Chile (Remote)"
        fromDate="January 2018"
        companyName="Toptal.com"
      >
        <p className="text-xs">
          During my time at <a href="https://total.com">Toptal.com</a>, I have
          been involved in numerous interesting projects for various companies,
          such as{' '}
          <a href="http://gigsmart.com" target="_blank">
            GigSmart
          </a>
          , &nbsp;
          <a href="https://steadyapp.com" target="_blank">
            SteadyApp
          </a>
          , &nbsp;
          <a href="http://alteryx.com" target="_blank">
            Alteryx
          </a>
          , and &nbsp;
          <a href="https://myhalo.ai" target="_blank">
            Halo By Hines
          </a>
          . Here are some of the technologies and tools I have had the
          opportunity to work with:
        </p>
        <ul className="list-disc px-4 py-2">
          <li>React</li>
          <li>React Native</li>
          <li>Next</li>
          <li>Javascript</li>
          <li>Typescript</li>
          <li>Node.js</li>
          <li>Python</li>
          <li>Java</li>
          <li>Elixir</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Software Developer"
        location="Santigo, Chile (Remote)"
        fromDate="December 2016"
        toDate="April 2019"
        companyName="RecoveryPlanner"
      >
        <p>
          I was in charge of creating and designing the latest iteration of RPX,
          an online risk management application. The web-based version of the
          app was developed with Angular 2+ and Material UI, while I also worked
          on designing a mobile version using Ionix and the Meteor framework.
          Some of the technologies and tools I have had the opportunity to work
          with:
        </p>
        <ul className="list-disc px-4 py-2">
          <li>Angular</li>
          <li>Ionix</li>
          <li>Meteor</li>
          <li>Javascript</li>
          <li>Typescript</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Technical Lead"
        location="Santigo, Chile"
        fromDate="January 2013"
        toDate="September 2016"
        companyName="Nisum"
      >
        <ul className="space-y-2">
          <li>
            I have been working in lot of things during my time here at Nisum
            Technologies, the most important and relevant projects I have been
            involved with, are the following:
          </li>
          <li>
            Macys Devops I was working in the definition and implementation of a
            workflow which define how software artifacts are deployed in
            multiple environment. The most relevant tool we used for this
            project was Activiti BPMN and Spring Framework as well.
          </li>
          <li>
            Size & Pack project is a middleware software component, whose main
            purpose is processing Purchase Orders coming from two different
            systems, enriching the information and restructuring to a common
            format.Working on this project give me the chance to be exposed to
            new technologies like Cucumber component testing tool and the new
            features provided by last version of the Spring Framework , as well
            to reinforce my knowledge about TDD practices.
          </li>
          <li>
            EMV POS, I was working in maintenance and upgrading of Point of Sale
            solutions (Oracle POS) used by GAP retail company. One of the
            projects I was involved was called EMV (European Mastercard Visa),
            whose purpose was to upgrade the current POS solution used by Gap,
            to allow the usage of EMV Credit / Debit cards which use the Chip &
            Pin as the transaction authorization mechanism.
          </li>
        </ul>
        <p>
          Some of the technologies and tools I have had the opportunity to work
          with:
        </p>
        <ul className="list-disc px-4 py-2">
          <li>Java</li>
          <li>Spring Framework</li>
          <li>JUnit</li>
          <li>Cucumber</li>
          <li>Maven</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Senior Developer"
        location="Santigo, Chile"
        fromDate="July 2011"
        toDate="December 2013"
        companyName="Experian Interactive Media"
      >
        <p>
          Development, maintenance, upgrading, and supporting of Lending
          andMarketing web based solutions. Some of the main systems I was
          involved with were:
        </p>
        <ul className="space-y-2">
          <li>
            Lending Vertical Is a web based consultancy system that allows users
            to query for the best credit alternative available in the
            market.(http://www.lowermybills.com). Once the user provides the
            information required by the system, this was expressed as a kind of
            survey, then the system responds with a list of possible lender
            institutions. Behind the scene, there was a fully implemented
            workflow process that interact with external or third party systems
            that provides information like the credit score or correct identity
            of the person authenticated.
          </li>
          <li>
            Campaign Administration System (CAS) Is an internal system that
            allows the creation and management of web based campaigns. This
            system provides a workflow that involves the participation of
            campaign managers, creative managers, media buyers etc.
          </li>
        </ul>
        <p>
          Some of the technologies and tools I have had the opportunity to work
          with:
        </p>
        <ul className="list-disc px-4 py-2">
          <li>Java</li>
          <li>Spring Framework</li>
          <li>JUnit</li>
          <li>Maven</li>
          <li>AngularJS</li>
        </ul>
      </ProfessionalExperienceEntry>
      <ProfessionalExperienceEntry
        title="Senior Developer"
        location="Santigo, Chile"
        fromDate="November 2004"
        toDate="June 2011"
        companyName="FeDex"
      >
        <p>
          Design and implementation of new software solutions targeted to LAC
          region. Some of the most important projects I was involved with were:
        </p>
        <ul className="mt-2 space-y-2">
          <li>
            FGC Low Value Module A mobile application specifically dedicated, to
            shipments classified as low value, allowing data adjustment and
            reports generation which are transferred to Customs.
          </li>
          <li>
            FGC FedEx Global Clearance System, is a system dedicated to the
            depuration, adjustment, and enrichment of the manifest data which is
            the list of all shipments packages that are arriving to a specific
            location for a given date and fligth. Initially each country had its
            own home made solution for this proplem, mostly because of the
            different legislation rules that each country imposed. The purpose
            of this software application was to define and implement a unified
            solution for processing manifest data.Initially a basic solution was
            deployed in Trinidad and Tobago country after that the solution was
            evolved providing new features that make it possible to be deployed
            in other countries like Costa Rica, Mexico, Brazil etc.
          </li>
        </ul>
        <p>
          Some of the technologies and tools I have had the opportunity to work
          with:
        </p>
        <ul className="list-disc px-4 py-2">
          <li>Java</li>
          <li>Spring Framework</li>
          <li>JUnit</li>
          <li>Maven</li>
          <li>JQuery</li>
          <li>Javascript</li>
        </ul>
      </ProfessionalExperienceEntry>
    </div>
  );
};

export default ProfessionalExperience;
