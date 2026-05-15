import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

// ── Color palette — optimised for print & screen readability ────────
const NAVY = '1B4F72'; // headings, name, company names
const BODY = '2D3436'; // main body text — near-black
const SUBTLE = '555555'; // secondary text (skill values, descriptions)
const DATE = '636E72'; // dates & light annotations
const DIVIDER = 'B0BEC5'; // pipes, borders

// ── Reusable helpers ─────────────────────────────────────────────────

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: NAVY,
        font: 'Calibri',
      }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 30, after: 30 },
    children: [new TextRun({ text, size: 19, color: BODY, font: 'Calibri' })],
  });
}

function jobBlock(
  title: string,
  company: string,
  dateRange: string,
): Paragraph[] {
  return [
    // blank spacer line before each job
    new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
    // title | company
    new Paragraph({
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 21,
          color: BODY,
          font: 'Calibri',
        }),
        new TextRun({
          text: '  |  ',
          size: 21,
          color: DIVIDER,
          font: 'Calibri',
        }),
        new TextRun({
          text: company,
          bold: true,
          size: 21,
          color: NAVY,
          font: 'Calibri',
        }),
      ],
    }),
    // date on its own line
    new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({
          text: dateRange,
          size: 19,
          color: DATE,
          italics: true,
          font: 'Calibri',
        }),
      ],
    }),
    // blank line after header before content
    new Paragraph({ spacing: { before: 0, after: 80 }, children: [] }),
  ];
}

function subProject(title: string, subtitle: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    indent: { left: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 19,
        color: BODY,
        font: 'Calibri',
      }),
      new TextRun({
        text: ` — ${subtitle}`,
        size: 19,
        color: SUBTLE,
        font: 'Calibri',
      }),
    ],
  });
}

function skillLine(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({
        text: `${label}:  `,
        bold: true,
        size: 19,
        color: NAVY,
        font: 'Calibri',
      }),
      new TextRun({
        text: value,
        size: 19,
        color: BODY,
        font: 'Calibri',
      }),
    ],
  });
}

// ── Main generator ───────────────────────────────────────────────────

export async function generateResumeDocx(
  _t: (key: string) => string,
  filename: string,
): Promise<void> {
  const children: Paragraph[] = [];

  // ────────────────────────────────────────────────────────────────────
  // HEADER
  // ────────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: 'PABLO ARAVENA TRONCOSO',
          bold: true,
          size: 32,
          color: NAVY,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: '+56 9 62810987',
          bold: true,
          size: 20,
          color: BODY,
          font: 'Calibri',
        }),
        new TextRun({
          text: '  |  ',
          size: 20,
          color: DIVIDER,
          font: 'Calibri',
        }),
        new TextRun({
          text: 'paravena74@gmail.com',
          bold: true,
          size: 20,
          color: BODY,
          font: 'Calibri',
        }),
        new TextRun({
          text: '  |  ',
          size: 20,
          color: DIVIDER,
          font: 'Calibri',
        }),
        new TextRun({
          text: 'Santiago, Chile',
          bold: true,
          size: 20,
          color: BODY,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new ExternalHyperlink({
          link: 'https://linkedin.com/in/paravena74',
          children: [
            new TextRun({
              text: 'linkedin.com/in/paravena74',
              style: 'Hyperlink',
              bold: true,
              size: 20,
              color: NAVY,
              font: 'Calibri',
            }),
          ],
        }),
      ],
    }),
  );

  // ────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────────────────────────────────
  children.push(sectionHeading('Summary'));
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'Full Stack Developer with 20+ years of experience building web and mobile applications across job search, logistics, retail, and fintech industries. Currently at Indeed, delivering features with React, TypeScript, GraphQL APIs, and Node.js micro frontends. Strong background in Java, Elixir, and AWS cloud infrastructure with a test-driven approach to software delivery.',
          size: 19,
          color: BODY,
          font: 'Calibri',
        }),
      ],
    }),
  );

  // ────────────────────────────────────────────────────────────────────
  // TECHNICAL SKILLS
  // ────────────────────────────────────────────────────────────────────
  children.push(sectionHeading('Technical Skills'));
  children.push(
    skillLine('Languages', 'JavaScript, TypeScript, Java, Node.js, Python, Elixir'),
    skillLine('Frontend', 'React, React Native, Next.js, Redux, React Query, Angular'),
    skillLine('Backend', 'Spring Boot, Spring Framework, Express, NestJS, Flask, Django, Phoenix'),
    skillLine('APIs', 'GraphQL (Absinthe, Apollo, Relay), REST, SOAP'),
    skillLine('Databases', 'PostgreSQL, Oracle, MySQL, MongoDB, Redis'),
    skillLine('Cloud & DevOps', 'AWS (EC2, S3, Lambda, CloudFront), Vercel, Heroku, CI/CD'),
    skillLine('Tools & Platforms', 'Contentful, Auth0, Optimizely, Git, Maven, Docker'),
  );

  // ────────────────────────────────────────────────────────────────────
  // PROFESSIONAL EXPERIENCE
  // ────────────────────────────────────────────────────────────────────
  children.push(sectionHeading('Professional Experience'));

  // ── Indeed ──
  children.push(
    ...jobBlock('Full Stack Developer', 'Indeed', 'Sep 2024 — Present'),
  );
  children.push(
    bullet(
      "Build and maintain micro frontend components using React and TypeScript within Indeed's Mosaic architecture",
    ),
    bullet(
      'Develop GraphQL APIs and server-side features using Node.js and Java for content orchestration',
    ),
    bullet(
      'Design GraphQL schemas and resolvers to optimize data fetching across Contentful and internal sources',
    ),
    bullet(
      'Implement Node.js batch processes for large-scale data processing and content indexing on AWS',
    ),
    bullet(
      'Define and manage Contentful content models consumed by GraphQL APIs for structured content delivery',
    ),
    bullet(
      'Deploy and monitor services on AWS cloud infrastructure with automated CI/CD pipelines',
    ),
    bullet(
      'Accelerate delivery using AI-powered development tools including Claude Code and Windsurf',
    ),
  );

  // ── Toptal ──
  children.push(
    ...jobBlock('Full Stack Developer', 'Toptal.com', 'Jan 2018 — Aug 2024'),
  );

  // SteadyApp
  children.push(subProject('SteadyApp', 'React Native mobile app'));
  children.push(
    bullet(
      'Built cross-platform mobile application using React Native and TypeScript with shared component library',
    ),
    bullet(
      'Implemented Auth0 authentication flows including social login, MFA, and token refresh strategies',
    ),
    bullet(
      'Integrated Plaid and Argyle APIs for real-time financial data aggregation and income verification',
    ),
    bullet(
      'Developed A/B testing infrastructure with Optimizely to drive data-informed feature rollouts',
    ),
    bullet(
      'Created reusable navigation flows and screen components with React Navigation and TypeScript',
    ),
  );

  // GigSmart
  children.push(subProject('GigSmart', 'Elixir/GraphQL backend'));
  children.push(
    bullet(
      'Built GraphQL mutations and queries using Absinthe, providing type-safe API layer for React clients',
    ),
    bullet(
      'Designed PostgreSQL database schemas and wrote Ecto migrations for complex relational data models',
    ),
    bullet(
      'Developed real-time features leveraging Elixir/Phoenix channels for live gig updates and notifications',
    ),
    bullet(
      'Built GraphQL APIs consumed by React web applications using Relay for efficient data fetching',
    ),
    bullet(
      'Wrote comprehensive unit and integration tests using ExUnit ensuring high code coverage',
    ),
  );

  // Alteryx
  children.push(subProject('Alteryx', 'Java/React license management system'));
  children.push(
    bullet(
      'Architected backend using Java and Spring Boot with RESTful API endpoints for license management',
    ),
    bullet(
      'Integrated with legacy SOAP-based APIs using Java web service clients and data normalization layers',
    ),
    bullet(
      'Implemented Redis caching layer reducing response times and minimizing load on downstream services',
    ),
    bullet(
      'Developed frontend application using React and TypeScript with component-driven architecture',
    ),
    bullet(
      'Deployed on AWS EC2 with automated CI/CD pipelines for continuous delivery',
    ),
  );

  // Halo by Hines
  children.push(
    subProject('Halo by Hines', 'AI-powered real estate marketing platform'),
  );
  children.push(
    bullet(
      'Built MVP web application using React and TypeScript for property advertisement management',
    ),
    bullet(
      'Integrated LLM APIs to automatically generate marketing copy and property descriptions',
    ),
    bullet(
      'Developed Node.js media upload and processing system for property images and floor plans',
    ),
    bullet(
      'Created AI-generated visualizations of remodeled interiors and exteriors',
    ),
    bullet(
      'Deployed on AWS using S3, Lambda, and CloudFront for media storage and delivery',
    ),
  );

  // ── RecoveryPlanner ──
  children.push(
    ...jobBlock('Software Developer', 'RecoveryPlanner', 'Dec 2016 — Apr 2019'),
  );
  children.push(
    bullet(
      'Designed and developed RPX risk management frontend using Angular and TypeScript with Material UI',
    ),
    bullet(
      'Built RESTful API integrations connecting Angular frontend with Java-based backend services',
    ),
    bullet(
      'Created Ionic mobile app prototype with TypeScript for cross-platform risk assessment',
    ),
    bullet(
      'Implemented data visualization dashboards for risk analysis reporting and monitoring',
    ),
    bullet(
      'Developed reusable Angular modules and services following component-driven architecture',
    ),
  );

  // ── Nisum ──
  children.push(
    ...jobBlock('Technical Lead', "Nisum (Macy's, GAP)", 'Jan 2013 — Sep 2016'),
  );
  children.push(
    bullet(
      "Macy's DevOps: Built deployment workflow system using Activiti BPMN and Java Spring Framework for multi-environment release management",
    ),
    bullet(
      'Size & Pack: Created Java middleware to process and transform purchase orders using TDD with Cucumber and JUnit',
    ),
    bullet(
      'GAP EMV POS: Led upgrade of Point of Sale systems to support chip and PIN cards (EMV standard) in Java',
    ),
    bullet(
      'Designed RESTful API architectures using Java and Spring MVC for system integration',
    ),
    bullet(
      'Established testing best practices with JUnit and Cucumber, achieving high code coverage across Java services',
    ),
    bullet(
      'Mentored development team on Java, Spring Framework patterns, and test-driven development',
    ),
  );

  // ── Experian ──
  children.push(
    ...jobBlock(
      'Senior Developer',
      'Experian Interactive Media',
      'Jul 2011 — Dec 2012',
    ),
  );
  children.push(
    bullet(
      'LowerMyBills.com: Built Java-based loan comparison platform integrating external credit score APIs and lender matching',
    ),
    bullet(
      'Campaign Administration: Developed internal Java web application for marketing campaign management with role-based workflows',
    ),
    bullet(
      'Implemented backend services using Java and Spring Framework with Oracle database for high-volume data processing',
    ),
    bullet(
      'Developed AngularJS frontend for interactive loan comparison user interfaces',
    ),
    bullet(
      'Built automated testing suites using JUnit and Maven for financial data processing reliability',
    ),
  );

  // ── FedEx ──
  children.push(
    ...jobBlock('Senior Developer', 'FedEx', 'Nov 2004 — Jun 2011'),
  );
  children.push(
    bullet(
      'FedEx Global Clearance: Built unified Java shipment manifest processing system replacing country-specific solutions across Latin America',
    ),
    bullet(
      'Low Value Module: Developed Java application for processing low-value shipments with real-time data updates and customs reporting',
    ),
    bullet(
      'Designed RESTful web services using Java and Spring Framework for cross-system data integration across the LAC region',
    ),
    bullet(
      'Built frontend interfaces using jQuery and JSP for real-time shipment tracking and customs clearance',
    ),
    bullet(
      'Developed comprehensive testing suites using JUnit and Maven for mission-critical logistics systems',
    ),
  );

  // ────────────────────────────────────────────────────────────────────
  // EDUCATION & CERTIFICATIONS
  // ────────────────────────────────────────────────────────────────────
  children.push(sectionHeading('Education'));
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 240 },
      children: [
        new TextRun({
          text: 'Computer Engineer',
          bold: true,
          size: 19,
          color: BODY,
          font: 'Calibri',
        }),
        new TextRun({
          text: '  —  Universidad de Santiago de Chile, 2001',
          size: 19,
          color: SUBTLE,
          font: 'Calibri',
        }),
      ],
    }),
  );

  children.push(sectionHeading('Certifications'));
  const certs = [
    'Sun Certified Java Developer',
    'Sun Certified Java Programmer',
    'Sun Certified Web Component Developer',
    'Sun Certified Business Component Developer',
  ];
  for (const cert of certs) {
    children.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        indent: { left: 240 },
        children: [
          new TextRun({ text: cert, size: 19, color: BODY, font: 'Calibri' }),
        ],
      }),
    );
  }

  // ── Build document ──
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-bullet',
          levels: [
            {
              level: 0,
              format: 'bullet',
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 480, hanging: 240 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 600, right: 720, bottom: 600, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
