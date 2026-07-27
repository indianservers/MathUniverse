import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditPath = path.join(root, "src/modules/lessons/audit/schoolSyllabusGapBacklog.generated.json");
const catalogDir = path.join(root, "src/modules/lessons/catalog/school");
const pathwayDir = path.join(root, "src/modules/lessons/pathways/school");
const docsDir = path.join(root, "docs/lessons");

const backlog = JSON.parse(fs.readFileSync(auditPath, "utf8"));
const boardLabels = {
  NCERT: "NCERT",
  CBSE: "CBSE",
  AP_SCERT: "Andhra Pradesh SCERT",
  TN_SCERT: "Tamil Nadu SCERT",
  CAMBRIDGE_IGCSE: "Cambridge IGCSE",
  IB_AA: "IB Analysis and Approaches",
  IB_AI: "IB Applications and Interpretation",
  COMMON_CORE: "Common Core",
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readableLevel(level) {
  return level.replace("CLASS_", "Class ");
}

function difficultyFor(level, lessonType) {
  if (lessonType === "PROOF") return "RIGOROUS";
  if (["CLASS_11", "CLASS_12"].includes(level)) return "ADVANCED";
  if (["CLASS_9", "CLASS_10"].includes(level)) return "INTERMEDIATE";
  return "FOUNDATION";
}

function estimatedMinutesFor(lessonType) {
  if (lessonType === "PROOF") return 30;
  if (lessonType === "VISUAL_EXPLORATION") return 24;
  if (lessonType === "PRACTICE") return 20;
  return 18;
}

function lessonPurpose(title, unit, level) {
  return `Teach ${title} as a ${readableLevel(level)} ${unit} concept with syllabus-aligned exploration, practice, and assessment.`;
}

function objectivesFor(title, unit, lessonType) {
  const base = [
    `State the meaning of ${title} in the context of ${unit}.`,
    `Connect ${title} to a visual, symbolic, or tabular representation.`,
    `Solve a syllabus-style problem involving ${title}.`,
  ];
  if (lessonType === "PROOF") {
    base.splice(2, 0, `Write a guided proof for ${title} with a reason for each step.`);
  }
  if (lessonType === "VISUAL_EXPLORATION") {
    base.splice(2, 0, `Use the interactive construction or model to test ${title}.`);
  }
  return base;
}

function contentFor(title, unit, level, lessonType) {
  const summary = `${title} fills a ${readableLevel(level)} ${unit} syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice.`;
  const content = {
    summary,
    learn: [
      `Define ${title} using the language expected in school mathematics.`,
      `Identify the key quantities, symbols, and conditions used in ${title}.`,
      `Compare one correct example and one common misconception for ${title}.`,
    ],
    explore: [
      `Manipulate the linked model to observe how ${title} changes when an input changes.`,
      `Record a prediction before using the model, then compare it with the observed result.`,
      `Use the formula, diagram, table, or graph to explain why the result is valid.`,
    ],
    practice: [
      `Solve a direct NCERT/CBSE-style problem on ${title}.`,
      `Solve one AP/TN textbook-style application problem on ${title}.`,
      `Solve one Cambridge/Common Core/IB-style reasoning problem on ${title}.`,
    ],
    assessmentPrompts: [
      `What must be true before ${title} can be applied?`,
      `Which representation best explains ${title}: diagram, table, graph, formula, or proof?`,
      `Give one error a learner might make while solving ${title}.`,
    ],
  };
  if (lessonType === "PROOF") {
    content.proofChecklist = [
      "Write the given information.",
      "Write what must be proved.",
      "Mark the diagram or algebraic statement.",
      "Add each proof step with a reason.",
      "Reject one invalid proof step and explain why it fails.",
    ];
  }
  if (lessonType === "VISUAL_EXPLORATION") {
    content.constructionChecklist = [
      "Start from the required base object.",
      "Use the correct construction/control sequence.",
      "Validate the constructed object by measurement or invariant.",
      "Explain why the construction works.",
      "Repeat in practice mode with changed inputs.",
    ];
  }
  return content;
}

function prerequisitesFor(previousLessonId, unit, level) {
  const prerequisites = [
    {
      conceptId: slugify(unit),
      description: `Foundational familiarity with ${readableLevel(level)} ${unit}.`,
    },
  ];
  if (previousLessonId) {
    prerequisites.push({
      lessonId: previousLessonId,
      description: "Previous lesson in this syllabus-aligned concept pack.",
    });
  }
  return prerequisites;
}

function keywordsFor(title, unit, level) {
  return [...new Set([
    title,
    unit,
    readableLevel(level),
    "NCERT",
    "CBSE",
    "AP SCERT",
    "TN SCERT",
    "Cambridge",
    "IB",
    "Common Core",
    ...title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
  ])];
}

const lessons = [];
let numericId = 10001;

for (const pack of backlog.conceptPacks) {
  let previousLessonId = undefined;
  for (const concept of pack.missingConcepts) {
    const slug = `${slugify(pack.academicLevel)}-${slugify(pack.unit)}-${slugify(concept.title)}`;
    const id = concept.id;
    const lessonType = concept.suggestedLessonType;
    const lesson = {
      id,
      numericId,
      slug,
      route: `/lessons/school/${pack.academicLevel.toLowerCase().replace("_", "-")}/${slug}`,
      title: concept.title,
      boardPathways: concept.boards,
      metadata: {
        academicLevel: pack.academicLevel,
        syllabusTags: concept.boards.map((board) => ({
          board,
          level: pack.academicLevel,
          unit: pack.unit,
          chapter: pack.unit,
          concept: concept.title,
          learningOutcome: lessonPurpose(concept.title, pack.unit, pack.academicLevel),
          coverage: "DIRECT",
        })),
        conceptFamily: pack.unit,
        prerequisites: prerequisitesFor(previousLessonId, pack.unit, pack.academicLevel),
        learningObjectives: objectivesFor(concept.title, pack.unit, lessonType),
        estimatedMinutes: estimatedMinutesFor(lessonType),
        difficulty: difficultyFor(pack.academicLevel, lessonType),
        lessonType,
        engineDependencies: [concept.suggestedAdapter],
        searchKeywords: keywordsFor(concept.title, pack.unit, pack.academicLevel),
        assessment: {
          diagnostic: true,
          formative: true,
          summative: lessonType === "PRACTICE" || lessonType === "PROOF",
          questionCount: lessonType === "PROOF" ? 8 : 6,
          masteryThreshold: 0.8,
        },
      },
      content: contentFor(concept.title, pack.unit, pack.academicLevel, lessonType),
    };
    lessons.push(lesson);
    previousLessonId = id;
    numericId += 1;
  }
}

const pathways = [];
for (const board of backlog.boards) {
  for (const level of [...new Set(lessons.map((lesson) => lesson.metadata.academicLevel))]) {
    const levelLessons = lessons.filter((lesson) => lesson.metadata.academicLevel === level && lesson.boardPathways.includes(board));
    if (!levelLessons.length) continue;
    const units = [...new Set(levelLessons.map((lesson) => lesson.metadata.conceptFamily))].map((unit) => ({
      unit,
      lessonIds: levelLessons.filter((lesson) => lesson.metadata.conceptFamily === unit).map((lesson) => lesson.id),
    }));
    pathways.push({
      id: `school-${slugify(board)}-${slugify(level)}`,
      title: `${boardLabels[board] ?? board} ${readableLevel(level)} Mathematics`,
      board,
      academicLevel: level,
      units,
    });
  }
}

function writeTsArray(filePath, importLine, exportName, value, typeName) {
  const source = `${importLine}

export const ${exportName} = ${JSON.stringify(value, null, 2)} satisfies readonly ${typeName}[];
`;
  fs.writeFileSync(filePath, source);
}

fs.mkdirSync(catalogDir, { recursive: true });
fs.mkdirSync(pathwayDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

writeTsArray(
  path.join(catalogDir, "schoolSyllabusLessons.generated.ts"),
  'import type { SchoolSyllabusLesson } from "../../syllabus/lessonSyllabusTypes";',
  "schoolSyllabusLessons",
  lessons,
  "SchoolSyllabusLesson",
);

fs.writeFileSync(
  path.join(catalogDir, "index.ts"),
  'export { schoolSyllabusLessons } from "./schoolSyllabusLessons.generated";\n',
);

writeTsArray(
  path.join(pathwayDir, "schoolSyllabusPathways.generated.ts"),
  'import type { SchoolSyllabusPathway } from "../../syllabus/lessonSyllabusTypes";',
  "schoolSyllabusPathways",
  pathways,
  "SchoolSyllabusPathway",
);

fs.writeFileSync(
  path.join(pathwayDir, "index.ts"),
  'export { schoolSyllabusPathways } from "./schoolSyllabusPathways.generated";\n',
);

const countsByLevel = Object.fromEntries([...lessons.reduce((map, lesson) => {
  const level = lesson.metadata.academicLevel;
  map.set(level, (map.get(level) ?? 0) + 1);
  return map;
}, new Map()).entries()]);

const countsByType = Object.fromEntries([...lessons.reduce((map, lesson) => {
  const type = lesson.metadata.lessonType;
  map.set(type, (map.get(type) ?? 0) + 1);
  return map;
}, new Map()).entries()]);

const report = `# Phase 1 School Catalog Implementation Report

Date: 2026-07-27

## Completed

Generated the next Phase 1 slice from the audited school syllabus gap backlog. This adds structured school remediation lesson definitions and pathways without changing the original 674 generated lesson rows.

| Artifact | File |
|---|---|
| School syllabus lesson metadata types | \`src/modules/lessons/syllabus/lessonSyllabusTypes.ts\` |
| School syllabus validators | \`src/modules/lessons/syllabus/lessonSyllabusValidation.ts\` |
| Generated school remediation catalog | \`src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts\` |
| School catalog index | \`src/modules/lessons/catalog/school/index.ts\` |
| Generated board/class pathways | \`src/modules/lessons/pathways/school/schoolSyllabusPathways.generated.ts\` |
| School pathways index | \`src/modules/lessons/pathways/school/index.ts\` |
| School catalog generator | \`scripts/generateSchoolSyllabusCatalog.mjs\` |

## Counts

| Metric | Count |
|---|---:|
| Generated school remediation lessons | ${lessons.length} |
| Generated board/class pathways | ${pathways.length} |
| Boards covered | ${backlog.boards.length} |

## Lessons By Level

| Level | Lessons |
|---|---:|
${Object.entries(countsByLevel).map(([level, count]) => `| ${level} | ${count} |`).join("\n")}

## Lessons By Type

| Type | Lessons |
|---|---:|
${Object.entries(countsByType).map(([type, count]) => `| ${type} | ${count} |`).join("\n")}

## Boundary

The generated school lessons are not yet merged into the public \`lessonCatalog\`. This is intentional: the next slice should add route/search integration after schema validation and dependency checks are stable.
`;

fs.writeFileSync(path.join(docsDir, "PHASE_1_SCHOOL_CATALOG_IMPLEMENTATION_REPORT.md"), report);

console.log(`Generated ${lessons.length} school lessons.`);
console.log(`Generated ${pathways.length} school pathways.`);
