import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopPosition,
  TabStopType,
  BorderStyle,
  ExternalHyperlink,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

type T = (key: string) => string;

// ── Color constants ──────────────────────────────────────────────────
const PRIMARY = '0369A1';
const DARK = '1E293B';
const MEDIUM = '475569';
const LIGHT = '64748B';

// ── Reusable helpers ─────────────────────────────────────────────────

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: PRIMARY },
    },
    children: [new TextRun({ text, bold: true, size: 26, color: PRIMARY })],
  });
}

function bulletItem(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 20, color: DARK })],
  });
}

function techLine(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 30 },
    children: [new TextRun({ text, size: 20, color: MEDIUM })],
  });
}

// ── Job block builder ────────────────────────────────────────────────

function jobBlock(
  t: T,
  prefix: string,
  opts?: {
    activities?: number;
    subProjects?: { key: string; activityCount: number }[];
    projects?: { index: number }[];
    techList?: number;
  },
): Paragraph[] {
  const title = t(`${prefix}.title`);
  const company = t(`${prefix}.company`);
  const location = t(`${prefix}.location`);
  const fromDate = t(`${prefix}.fromDate`);
  const toDateKey = `${prefix}.toDate`;
  const toDate = t(toDateKey) === toDateKey ? t('professionalExperience.datePresent') : t(toDateKey);
  const description = t(`${prefix}.description`);

  const paragraphs: Paragraph[] = [];

  // Title + Company on one line
  paragraphs.push(
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { before: 200, after: 40 },
      children: [
        new TextRun({ text: title, bold: true, size: 22, color: DARK }),
        new TextRun({ text: '  —  ', size: 22, color: MEDIUM }),
        new TextRun({ text: company, bold: true, size: 22, color: PRIMARY }),
        new TextRun({ text: '\t', size: 22 }),
        new TextRun({ text: location, italics: true, size: 20, color: LIGHT }),
      ],
    }),
  );

  // Date range
  paragraphs.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${t('professionalExperience.dateFrom')} ${fromDate} ${t('professionalExperience.dateTo')} ${toDate}`,
          size: 20,
          color: LIGHT,
          italics: true,
        }),
      ],
    }),
  );

  // Description
  paragraphs.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: description, size: 20, color: DARK })],
    }),
  );

  // Activities (simple indexed list)
  if (opts?.activities) {
    for (let i = 0; i < opts.activities; i++) {
      const key = `${prefix}.activities.${i}`;
      const val = t(key);
      if (val !== key) paragraphs.push(bulletItem(val));
    }
  }

  // Sub-projects (e.g. Toptal's sub-companies)
  if (opts?.subProjects) {
    for (const sub of opts.subProjects) {
      const subTitle = t(`${sub.key}.title`);
      const subSubtitle = t(`${sub.key}.subtitle`);
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: subTitle, bold: true, size: 20, color: DARK }),
            new TextRun({ text: ` — ${subSubtitle}`, size: 20, color: MEDIUM }),
          ],
        }),
      );
      for (let i = 0; i < sub.activityCount; i++) {
        const key = `${sub.key}.activities.${i}`;
        const val = t(key);
        if (val !== key) paragraphs.push(bulletItem(val));
      }
    }
  }

  // Projects (e.g. Nisum, Experian, FedEx)
  if (opts?.projects) {
    for (const proj of opts.projects) {
      const projTitle = t(`${prefix}.projects.${proj.index}.title`);
      const projDesc = t(`${prefix}.projects.${proj.index}.description`);
      paragraphs.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: projTitle, bold: true, size: 20, color: DARK }),
            new TextRun({ text: ` ${projDesc}`, size: 20, color: DARK }),
          ],
        }),
      );
    }
  }

  // Technologies used
  if (opts?.techList !== undefined) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: t(`${prefix}.techUsed`),
            bold: true,
            size: 20,
            color: MEDIUM,
          }),
        ],
      }),
    );
    for (let i = 0; i <= opts.techList; i++) {
      const key = `${prefix}.techList.${i}`;
      const val = t(key);
      if (val !== key) paragraphs.push(techLine(val));
    }
  }

  return paragraphs;
}

// ── Main generator ───────────────────────────────────────────────────

export async function generateResumeDocx(t: T, filename: string): Promise<void> {
  const sections: Paragraph[] = [];

  // ── Header ──
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: t('header.name'), bold: true, size: 36, color: PRIMARY }),
      ],
    }),
  );

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({ text: t('header.phone'), size: 20, color: MEDIUM }),
        new TextRun({ text: '  |  ', size: 20, color: LIGHT }),
        new TextRun({ text: t('header.email'), size: 20, color: MEDIUM }),
        new TextRun({ text: '  |  ', size: 20, color: LIGHT }),
        new TextRun({ text: t('header.location'), size: 20, color: MEDIUM }),
      ],
    }),
  );

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new ExternalHyperlink({
          link: t('header.linkedin'),
          children: [
            new TextRun({
              text: t('header.linkedin'),
              style: 'Hyperlink',
              size: 20,
            }),
          ],
        }),
      ],
    }),
  );

  // ── Summary ──
  sections.push(sectionHeading(t('summary.title')));
  sections.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: t('summary.text'), size: 20, color: DARK })],
    }),
  );

  // ── Education ──
  sections.push(sectionHeading(t('education.title')));
  sections.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: t('education.degree.text'), bold: true, size: 20, color: DARK }),
        new TextRun({ text: ` ${t('education.degree.detail')}`, size: 20, color: DARK }),
      ],
    }),
  );

  // ── Professional Experience ──
  sections.push(sectionHeading(t('professionalExperience.title')));

  // Indeed
  sections.push(
    ...jobBlock(t, 'professionalExperience.indeed', { activities: 7 }),
  );

  // Toptal
  sections.push(
    ...jobBlock(t, 'professionalExperience.toptal', {
      subProjects: [
        { key: 'professionalExperience.toptal.steadyApp', activityCount: 4 },
        { key: 'professionalExperience.toptal.gigSmart', activityCount: 3 },
        { key: 'professionalExperience.toptal.alteryx', activityCount: 4 },
        { key: 'professionalExperience.toptal.halo', activityCount: 4 },
      ],
      techList: 4,
    }),
  );

  // RecoveryPlanner
  sections.push(
    ...jobBlock(t, 'professionalExperience.recoveryPlanner', { techList: 1 }),
  );

  // Nisum
  sections.push(
    ...jobBlock(t, 'professionalExperience.nisum', {
      projects: [{ index: 0 }, { index: 1 }, { index: 2 }],
      techList: 1,
    }),
  );

  // Experian
  sections.push(
    ...jobBlock(t, 'professionalExperience.experian', {
      projects: [{ index: 0 }, { index: 1 }],
      techList: 1,
    }),
  );

  // FedEx
  sections.push(
    ...jobBlock(t, 'professionalExperience.fedex', {
      projects: [{ index: 0 }, { index: 1 }],
      techList: 1,
    }),
  );

  // ── Technologies ──
  sections.push(sectionHeading(t('technologies.title')));

  const techCategories: { titleKey: string; items: string[] }[] = [
    {
      titleKey: 'technologies.programmingLanguages.title',
      items: ['Javascript', 'Typescript', 'Node.js', 'Java', 'Python', 'Elixir'],
    },
    {
      titleKey: 'technologies.frameworks.title',
      items: [
        'React', 'React Native', 'NextJS', 'Redux', 'React Query',
        'Express', 'NestJs', 'Spring Framework', 'Spring Boot', 'Flask', 'Django',
      ],
    },
    {
      titleKey: 'technologies.databases.title',
      items: ['Postgres', 'Oracle', 'Mysql', 'MongoDB'],
    },
    {
      titleKey: 'technologies.platforms.title',
      items: ['Contentful', 'Auth0', 'Optimizely'],
    },
    {
      titleKey: 'technologies.aiTools.title',
      items: ['Claude Code', 'Windsurf', 'Junie', 'Kiro IDE', 'ChatGPT'],
    },
    {
      titleKey: 'technologies.clouds.title',
      items: ['AWS', 'Vercel', 'Railway', 'Heroku'],
    },
    {
      titleKey: 'technologies.certifications.title',
      items: [
        'Sun Certified Java Developer',
        'Sun Certified Java Programmer',
        'Sun Certified Web Component Developer',
        'Sun Certified Business Component Developer',
      ],
    },
  ];

  for (const cat of techCategories) {
    sections.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: t(cat.titleKey), bold: true, size: 22, color: DARK }),
        ],
      }),
    );
    sections.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: cat.items.join(', '), size: 20, color: MEDIUM }),
        ],
      }),
    );
  }

  // ── Passions ──
  sections.push(sectionHeading(t('passions.title')));
  const passionKeys = ['programming', 'saxophone'] as const;
  for (const key of passionKeys) {
    sections.push(
      new Paragraph({
        spacing: { before: 80, after: 30 },
        children: [
          new TextRun({
            text: t(`passions.${key}.title`),
            bold: true,
            size: 22,
            color: DARK,
          }),
        ],
      }),
    );
    sections.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: t(`passions.${key}.description`),
            size: 20,
            color: MEDIUM,
          }),
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
              style: { paragraph: { indent: { left: 360, hanging: 180 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
