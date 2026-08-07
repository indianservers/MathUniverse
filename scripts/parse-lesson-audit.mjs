import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const auditPath = join(root, "docs/lessons/GENERIC_LESSON_CONTENT_AUDIT_AND_3_PHASE_PLAN.md");
const mainBaselinePath = join(root, "docs/lessons/LESSON_PHASE_2_BASELINE_AUDIT.json");
const manifestPath = join(root, "docs/lessons/lesson-strengthening-manifest.json");
const briefsRoot = join(root, "content/lesson-briefs");
const archReportPath = join(root, "docs/lessons/LESSON_STRENGTHENING_ARCHITECTURE_REPORT.md");
const rolloutPath = join(root, "docs/lessons/LESSON_ROLLOUT_BATCHES.md");
const reviewPath = join(root, "docs/lessons/LESSON_EXPERT_REVIEW_QUEUE.md");

const markdown = readFileSync(auditPath, "utf8");
const mainBaseline = JSON.parse(readFileSync(mainBaselinePath, "utf8"));

const mainRows = parseTable(markdown, "## Main Catalog Generic Lessons", "## School Syllabus Generic Lessons");
const schoolRows = parseTable(markdown, "## School Syllabus Generic Lessons");

const mainItems = mainRows.map((row) => ({
  id: Number(row.ID),
  title: row.Lesson,
  route: row.Route,
  catalog: "main",
  category: row.Category,
  topic: row.Topic,
  genericSignals: splitSignals(row["Generic signal"]),
  status: "not_started",
  expertReviewRequired: needsExpertReview(row.Category, row.Topic, row.Lesson),
}));

const schoolItems = schoolRows.map((row) => ({
  id: Number(row.ID),
  title: row.Lesson,
  route: row.Route,
  catalog: "school",
  category: "School Syllabus",
  topic: row.Family,
  academicLevel: row.Level,
  family: row.Family,
  lessonType: row.Type,
  genericSignals: splitSignals(row["Generic signal"]),
  status: "not_started",
  expertReviewRequired: needsExpertReview("School Syllabus", row.Family, row.Lesson, row.Level),
}));

const manifest = [...mainItems, ...schoolItems];
const discrepancies = validateManifest(mainItems, schoolItems, manifest);
if (discrepancies.length) {
  throw new Error(`Lesson audit parse failed:\n${discrepancies.join("\n")}`);
}

writeJson(manifestPath, {
  generatedAt: "2026-08-06",
  sourceAudit: "docs/lessons/GENERIC_LESSON_CONTENT_AUDIT_AND_3_PHASE_PLAN.md",
  totals: {
    main: mainItems.length,
    school: schoolItems.length,
    all: manifest.length,
  },
  categoryTotals: countBy(mainItems, "category"),
  schoolLevelTotals: countBy(schoolItems, "academicLevel"),
  lessons: manifest,
});

rmSync(briefsRoot, { recursive: true, force: true });
mkdirSync(briefsRoot, { recursive: true });
const groupedBriefs = groupBy(manifest, (item) => item.catalog === "school" ? `school/${slug(item.academicLevel)}` : slug(item.category));
for (const [group, lessons] of Object.entries(groupedBriefs)) {
  writeJson(join(briefsRoot, group, "briefs.json"), {
    generatedAt: "2026-08-06",
    status: "phase_1_brief_scaffold",
    note: "These are Phase 1 briefs. They are not approved lesson replacements.",
    lessons: lessons.map(createBrief),
  });
}

writeFileSync(archReportPath, architectureReport(manifest), "utf8");
writeFileSync(rolloutPath, rolloutReport(manifest), "utf8");
writeFileSync(reviewPath, expertReviewReport(manifest), "utf8");

console.log(JSON.stringify({
  manifest: manifest.length,
  main: mainItems.length,
  school: schoolItems.length,
  expertReview: manifest.filter((item) => item.expertReviewRequired).length,
  files: [manifestPath, archReportPath, rolloutPath, reviewPath, briefsRoot],
}, null, 2));

function parseTable(text, startHeading, endHeading) {
  const start = text.indexOf(startHeading);
  if (start === -1) throw new Error(`Missing ${startHeading}`);
  const end = endHeading ? text.indexOf(endHeading, start + startHeading.length) : text.length;
  const section = text.slice(start, end === -1 ? text.length : end);
  const lines = section.split(/\r?\n/).filter((line) => line.startsWith("|"));
  if (lines.length < 2) return [];
  const headers = splitMarkdownRow(lines[0]);
  return lines.slice(2).map((line) => {
    const cells = splitMarkdownRow(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  }).filter((row) => row.ID && row.Lesson && row.Route);
}

function splitMarkdownRow(line) {
  const cells = [];
  let current = "";
  let escaped = false;
  for (const char of line.trim().replace(/^\|/, "").replace(/\|$/, "")) {
    if (char === "\\" && !escaped) {
      escaped = true;
      continue;
    }
    if (char === "|" && !escaped) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
    escaped = false;
  }
  cells.push(current.trim());
  return cells;
}

function validateManifest(main, school, all) {
  const errors = [];
  if (main.length !== 662) errors.push(`Expected 662 main lessons, found ${main.length}`);
  if (school.length !== 220) errors.push(`Expected 220 school lessons, found ${school.length}`);
  if (all.length !== 882) errors.push(`Expected 882 total lessons, found ${all.length}`);
  const routes = new Set(all.map((item) => item.route));
  if (routes.size !== all.length) errors.push("Duplicate routes found in manifest");
  const mainBaselineGeneric = mainBaseline.filter((lesson) =>
    lesson.presetSpecificity === "family" ||
    lesson.interactionStatus === "generic" ||
    lesson.challengeStatus === "family-generic" ||
    lesson.secondRepresentationStatus === "unverified-or-generic"
  );
  const baselineRoutes = new Set(mainBaselineGeneric.map((lesson) => lesson.route));
  for (const item of main) {
    if (!baselineRoutes.has(item.route)) errors.push(`Main route missing from JSON baseline: ${item.route}`);
  }
  return errors;
}

function createBrief(item) {
  const type = normalizedLessonType(item);
  const representation = representationFor(item);
  const reviewReason = item.expertReviewRequired
    ? "Requires subject review before content can be approved. Phase 1 does not certify exact facts, formulas, or advanced claims."
    : undefined;
  return {
    id: item.id,
    title: item.title,
    route: item.route,
    category: item.category,
    topic: item.topic,
    academicLevel: item.academicLevel,
    lessonType: type,
    learningObjectives: [
      `State what ${item.title} means in ${item.topic}.`,
      `Connect ${item.title} to a suitable ${representation.type.replaceAll("_", " ")} representation.`,
      `Solve a first practice task and explain the likely mistake.`,
    ],
    prerequisites: prerequisitesFor(item),
    keyVocabulary: [
      { term: item.title, meaning: `The exact concept named by this lesson inside ${item.topic}.` },
      { term: item.topic, meaning: "The lesson family that supplies prior ideas and notation." },
    ],
    introduction: `${item.title} is a ${type.replace("_", " ")} lesson in ${item.topic}. It needs exact teaching tied to this route, not shared adapter copy.`,
    basicIdea: `The brief should define ${item.title}, show a simple example, and include a non-example or boundary case when useful.`,
    howItWorks: `The lesson should show the steps or relationships that make ${item.title} work, using the existing route and shared lesson shell.`,
    whyItWorks: "The final content must justify each rule with accepted mathematics. Leave formulas empty until variables and restrictions are known.",
    definitions: [
      { id: "definition-main", statement: `Author a precise definition for ${item.title} during Phase 2.` },
    ],
    facts: [
      { id: "fact-scope", statement: `Use only accepted facts that apply to ${item.title}.`, conditions: ["Verify before approval"] },
    ],
    formulas: [],
    conditionsAndRestrictions: [
      "Add domain restrictions, excluded values, units, and exact-versus-approximate notes where applicable.",
    ],
    representations: [representation],
    workedExamples: [
      {
        id: "worked-example-1",
        prompt: `Create a worked example that directly uses ${item.title}.`,
        steps: ["State the known values or objects.", "Apply the correct rule.", "Check the result."],
        answer: "To be authored and verified in Phase 2.",
      },
    ],
    realLifeExamples: exampleContextsFor(item).map((context, index) => ({
      id: `application-${index + 1}`,
      context,
      connection: `Use only if it naturally fits ${item.title}; otherwise replace with a mathematical application.`,
    })),
    misconceptions: [
      {
        code: misconceptionCodeFor(item),
        mistake: `Using a rule from ${item.topic} without checking that it applies to ${item.title}.`,
        correction: "Ask the learner to state the condition first, then solve or classify.",
      },
    ],
    interaction: {
      id: "primary-interaction",
      learningPurpose: `Help learners see the key change or invariant in ${item.title}.`,
      parameters: [{ id: "primary-value", label: `Main value for ${item.title}` }],
      initialState: "Use a small, valid example that shows the concept clearly.",
      dynamicFeedback: "Feedback must name the mathematical change, not only say that a control moved.",
      successCriteria: [`Learner can explain ${item.title} using the chosen representation.`],
      accessibilityAlternative: "Provide an equivalent text, table, keyboard, or step-by-step path.",
    },
    guidedExploration: [
      { id: "predict", prompt: `Predict what should change in ${item.title} before using the model.` },
      { id: "observe", prompt: "Change one value and record what changed and what stayed fixed." },
      { id: "conclude", prompt: "Write one sentence linking the visual result to the rule." },
    ],
    practice: practiceFor(item),
    challenge: {
      id: "challenge-1",
      prompt: `Create a challenge that checks real understanding of ${item.title}.`,
      successCriteria: ["Uses valid conditions", "Shows correct reasoning", "Explains one misconception"],
      hints: ["Start from the definition.", "Check the restriction or boundary case.", "Verify the answer."],
    },
    exitCheck: [
      {
        id: "exit-check-1",
        prompt: `Give one correct example of ${item.title} and explain why it works.`,
        answer: "To be authored and verified in Phase 2.",
        criterion: "The answer must use the exact definition or rule.",
      },
    ],
    accessibilityNotes: [
      "Keep keyboard access for all controls.",
      "Provide text alternatives for diagrams, graphs, and simulations.",
    ],
    expertReviewRequired: item.expertReviewRequired,
    reviewReason,
    sourceNotes: [
      "Generated from the Phase 1 audit manifest.",
      "This brief is a content-planning scaffold, not strengthened production copy.",
    ],
  };
}

function normalizedLessonType(item) {
  const source = `${item.lessonType ?? ""} ${item.title} ${item.topic}`.toLowerCase();
  if (source.includes("proof") || source.includes("theorem") || source.includes("postulate")) return "proof";
  if (source.includes("calculator") || source.includes("tool") || source.includes("export") || source.includes("inspector")) return "tool";
  if (source.includes("construction") || source.includes("visual") || source.includes("graph") || source.includes("3d")) return "visual_exploration";
  if (source.includes("practice") || source.includes("assessment")) return "practice";
  if (source.includes("model") || source.includes("application") || source.includes("finance")) return "modelling";
  if (source.includes("division") || source.includes("solve") || source.includes("method") || source.includes("algorithm")) return "procedure";
  return "concept";
}

function representationFor(item) {
  const text = `${item.category} ${item.topic} ${item.title}`.toLowerCase();
  let type = "text_table";
  if (/fraction|integer|number|ratio|percent/.test(text)) type = "number_line";
  if (/algebra|equation/.test(text)) type = "balance_model";
  if (/graph|function|coordinate|linear|quadratic/.test(text)) type = "coordinate_graph";
  if (/geometry|triangle|circle|angle|construction/.test(text)) type = "geometric_construction";
  if (/trig|sine|cosine|unit circle/.test(text)) type = "unit_circle";
  if (/calculus|derivative|integral|limit/.test(text)) type = "function_graph";
  if (/probability|distribution/.test(text)) type = "probability_simulation";
  if (/statistics|data|mean|median/.test(text)) type = "table";
  if (/matrix/.test(text)) type = "matrix_grid";
  if (/vector/.test(text)) type = "vector_diagram";
  if (/set|venn/.test(text)) type = "venn_diagram";
  if (/3d|solid|surface|plane/.test(text)) type = "solid_3d";
  if (/finance|interest|loan/.test(text)) type = "financial_timeline";
  return {
    id: "primary-representation",
    type,
    learningPurpose: `Show the main structure of ${item.title} without unrelated decoration.`,
  };
}

function prerequisitesFor(item) {
  const text = `${item.category} ${item.topic}`.toLowerCase();
  if (/calculus/.test(text)) return ["Functions", "Graphs", "Algebraic notation"];
  if (/trigonometry/.test(text)) return ["Angles", "Right triangles", "Coordinate plane"];
  if (/geometry/.test(text)) return ["Points, lines, and angles", "Measurement", "Basic construction language"];
  if (/probability|statistics|data/.test(text)) return ["Fractions or decimals", "Tables", "Basic graph reading"];
  if (/algebra|symbolic/.test(text)) return ["Arithmetic operations", "Variables", "Equality"];
  if (/3d/.test(text)) return ["2D geometry", "Coordinates", "Spatial views"];
  return ["Arithmetic facts", "Reading mathematical notation"];
}

function practiceFor(item) {
  const base = [
    ["recognition", `Identify where ${item.title} appears in a simple example.`],
    ["direct", `Use the definition or rule for ${item.title} once.`],
    ["multi_step", `Solve a two-step task involving ${item.title}.`],
    ["error_diagnosis", `Find the mistake in a worked attempt about ${item.title}.`],
    ["transfer", `Apply ${item.title} in a new mathematical situation.`],
  ];
  return base.map(([difficulty, prompt], index) => ({
    id: `practice-${index + 1}`,
    prompt,
    answer: "To be authored and verified in Phase 2.",
    hints: ["State the rule first.", "Check the needed condition.", "Compare with the representation."],
    workedSolution: ["Write the known information.", "Apply the correct rule.", "Check the result."],
    misconceptionTag: misconceptionCodeFor(item),
    difficulty,
    parameterConstraints: ["Use valid values for this exact concept."],
  }));
}

function exampleContextsFor(item) {
  const text = `${item.category} ${item.topic}`.toLowerCase();
  if (/finance/.test(text)) return ["Loan repayment", "Savings growth", "Discount and tax calculation"];
  if (/probability|statistics|data/.test(text)) return ["Weather chance", "Exam score comparison", "Quality sampling"];
  if (/geometry|3d/.test(text)) return ["Floor plan measurement", "Package design", "Map scale"];
  if (/graph|function|calculus/.test(text)) return ["Speed changes", "Cost against quantity", "Area accumulation"];
  if (/algebra|number/.test(text)) return ["Budget calculation", "Recipe scaling", "Unknown quantity in a plan"];
  return ["A matching mathematical example", "A boundary example", "A non-example"];
}

function misconceptionCodeFor(item) {
  return `CHECK_${slug(item.title).replaceAll("-", "_").toUpperCase()}`.slice(0, 64);
}

function needsExpertReview(category, topic, title, level = "") {
  return /advanced|calculus|inference|distribution|differential|complex|3d|theorem|proof|postulate|matrix|vector|bayes|rolle|limit|integral|derivative/i.test(`${category} ${topic} ${title} ${level}`);
}

function splitSignals(value) {
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

function countBy(items, key) {
  return Object.fromEntries(Object.entries(items.reduce((acc, item) => {
    const value = item[key] ?? "unknown";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {})).sort(([a], [b]) => a.localeCompare(b)));
}

function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});
}

function slug(value = "unknown") {
  return String(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function writeJson(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function architectureReport(manifest) {
  return `# Lesson Strengthening Architecture Report

Generated: 2026-08-06

## Relevant Files and Directories

- Main catalog: \`src/modules/lessons/catalog/lessonCatalog.ts\`
- Generated main lessons: \`src/modules/lessons/catalog/phase*.generated.ts\`
- School catalog: \`src/modules/lessons/catalog/school/schoolSyllabusCatalog.ts\`
- Generated school lessons: \`src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts\`
- Main content factory: \`src/modules/lessons/engine/lessonContent.ts\`
- Preset resolution: \`src/modules/lessons/engine/lessonPresets.ts\`
- Contracts and enrichment: \`src/modules/lessons/engine/lessonContracts.ts\`
- Challenge runtime: \`src/modules/lessons/engine/lessonRuntime.ts\`
- Render shell: \`src/modules/lessons/components/LessonShell.tsx\`
- Main adapters: \`src/modules/lessons/adapters/\`
- School renderer: \`src/modules/lessons/pages/SchoolLessonPage.tsx\`
- School lab: \`src/modules/lessons/components/SchoolLessonInteractiveLab.tsx\`
- Math rendering: \`src/components/ui/MathExpression.tsx\` with KaTeX dependency
- Graphing and charting: Recharts, D3, React Flow, and workspace graph modules
- 3D rendering: Three.js and React Three Fiber
- Test infrastructure: Vitest, React Testing Library patterns, and Playwright e2e tests

## Existing Lesson Data Flow

Main lessons are generated in phase catalog files. \`lessonCatalog.ts\` combines them and calls \`enrichLessonDefinition\`. Enrichment resolves a preset, builds an interaction contract, and calls \`createLessonContent\`. \`LessonPage.tsx\` finds the route and renders \`LessonShell\`. The shell renders lesson content, the selected adapter, progress, challenge, formulas, examples, and language packs.

School lessons are generated in \`schoolSyllabusLessons.generated.ts\`. \`schoolSyllabusCatalog.ts\` exposes route lookup and search. \`SchoolLessonPage.tsx\` renders the generated content and \`SchoolLessonInteractiveLab\`.

## Where Generic Content Enters

- \`lessonPresets.ts\` falls back to family presets for most main lessons.
- \`lessonContent.ts\` builds shared summaries, explanations, examples, formulas, and control guides by adapter or topic regex.
- \`lessonRuntime.ts\` falls back to adapter-level challenges.
- \`lessonContracts.ts\` uses adapter-level contract templates when no lesson override exists.
- \`SchoolLessonPage.tsx\` renders generated syllabus content from title-injected arrays.
- \`SchoolLessonInteractiveLab\` is shared by concept family rather than exact lesson.

## Safe Shared Components to Retain

Keep the route system, shell layout, cards, progress storage, language loader, MathExpression renderer, adapter frame, existing graph and 3D engines, form controls, accessibility styling, and test setup. These are platform supports, not the source of generic teaching content.

## Content Generators to Replace or Bypass

Replace adapter-wide content and challenge fallbacks with structured lesson content. Keep shared mathematical generators only when the underlying mathematics is truly the same. School generated copy should be replaced by structured content loaded by route or lesson id.

## Recommended Migration Architecture

Add a structured content layer keyed by stable route and id. Validate each \`StrengthenedLesson\` before it can be used. Let adapters consume lesson-specific interaction specs, representations, misconceptions, practice, and challenge config. Keep existing lesson routes and renderers, then gradually switch families to the validated content source.

## No-Change Boundaries

Do not change authentication, payments, profiles, analytics, deployment, global navigation, unrelated workspaces, existing lesson IDs, or route URLs.

## Risks

- Some briefs are scaffolds and require expert review before approval.
- Formula validation is structural in Phase 1, not a proof of mathematical correctness.
- Route smoke testing for all 882 routes can be slow.
- Shared adapters may need small capability upgrades in Phase 2 for exact interactions.

## Phase 1 Baseline

The manifest contains ${manifest.length} lessons: ${manifest.filter((item) => item.catalog === "main").length} main and ${manifest.filter((item) => item.catalog === "school").length} school.
`;
}

function rolloutReport(manifest) {
  const batchA = manifest.filter((item) => /CLASS_6|CLASS_7|CLASS_8|CLASS_9|CLASS_10|Numbers and Arithmetic|Algebra|Graphs and Functions|Geometry/i.test(`${item.academicLevel ?? ""} ${item.category} ${item.topic}`));
  const batchB = manifest.filter((item) => /CLASS_11|CLASS_12|Trigonometry|Calculus|Probability|Matrix|Vector|Coordinate/i.test(`${item.academicLevel ?? ""} ${item.category} ${item.topic}`) && !batchA.includes(item));
  const batchC = manifest.filter((item) => !batchA.includes(item) && !batchB.includes(item));
  return `# Lesson Rollout Batches

Generated: 2026-08-06

## Batch A: School and Foundation

Count: ${batchA.length}

Start here because these lessons support the widest learner base and prerequisite chain. Work in this order: Numbers and Arithmetic, school Classes 6-8, Algebra foundations, basic graphs, core geometry, data handling, school Classes 9-10.

## Batch B: Senior School

Count: ${batchB.length}

Work in coherent families: functions, trigonometry, coordinate geometry, calculus, probability, matrices, vectors, then Class 11-12 school lessons.

## Batch C: Advanced

Count: ${batchC.length}

Work after renderer and review flow are stable: advanced calculus, linear algebra, inference, distributions, differential equations, complex numbers, discrete mathematics, 3D mathematics, symbolic mathematics, and platform lessons.

## Exact Recommended Starting Batch for Phase 2

Start with five representative Foundation Numbers and Arithmetic lessons: Natural Numbers, Whole Numbers, Integers, Fractions, and Percentages. They are high-impact, low-risk, and exercise definitions, representations, examples, misconceptions, and practice without needing advanced renderers.
`;
}

function expertReviewReport(manifest) {
  const review = manifest.filter((item) => item.expertReviewRequired);
  const rows = review.map((item) => `| ${item.id} | ${item.catalog} | ${item.title} | ${item.academicLevel ?? item.category} | ${item.topic} | Advanced, proof, formula-sensitive, or renderer-sensitive content. |`);
  return `# Lesson Expert Review Queue

Generated: 2026-08-06

Lessons requiring expert review: ${review.length}

| ID | Catalog | Lesson | Level or Category | Topic | Reason |
|---:|---|---|---|---|---|
${rows.join("\n")}
`;
}
