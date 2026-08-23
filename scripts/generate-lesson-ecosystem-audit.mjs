import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = "docs/lessons/ecosystem";
const auditDataPath = "tmp/lesson-audit-data.json";

const primaryTypes = new Set(["learn", "explore", "practice", "challenge", "investigation", "visual-proof", "assessment", "revision"]);
const interactionFormats = new Set([
  "animation",
  "simulation",
  "slider",
  "drag-and-observe",
  "construction",
  "graphing",
  "cas",
  "3d",
  "ar",
  "data-experiment",
  "matching",
  "game",
  "multiple-choice",
  "numeric-answer",
  "algebraic-answer",
  "open-response",
]);
const engineTypes = new Set(["geometry-2d", "geometry-3d", "cas-data", "graph-2d", "graph-3d", "none"]);

function loadCatalogs() {
  execFileSync("npx", ["tsx", "tmp/export-lesson-audit-data.ts"], { stdio: "inherit", shell: true });
  return JSON.parse(readFileSync(auditDataPath, "utf8"));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  return [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
}

function countBy(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const key = selector(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b)));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function inferEngine({ title, topic, workspace, adapter, catalog, strand, toolRoute }) {
  const haystack = `${title} ${topic} ${workspace} ${adapter} ${strand ?? ""} ${toolRoute ?? ""}`.toLowerCase();
  if (/\b3d\b|surface|solid|sphere|cone|cylinder|plane|space|volume|cross-section|cross section|net/.test(haystack)) {
    return /surface|contour|gradient|tangent plane|partial|double integral|multivariable|z=f/.test(haystack) ? "graph-3d" : "geometry-3d";
  }
  if (/geometry|triangle|circle|angle|polygon|construction|coordinate|lines? and angles|euclidean|quadrilateral|tangent/.test(haystack)) return "geometry-2d";
  if (/cas|symbolic|algebra|equation|polynomial|matrix|determinant|factor|simplif|derivative|integral|sequence|series|continued fraction|special function|differential equation/.test(haystack)) return "cas-data";
  if (/graph|function|linear|quadratic|exponential|parabola|slope|intercept|inequal|curve|conic/.test(haystack)) return "graph-2d";
  if (/data|statistics|probability|regression|inference|distribution|sampling|finance/.test(haystack)) return "cas-data";
  if (catalog === "advanced" && toolRoute) return "cas-data";
  return "none";
}

function inferPrimaryType({ title, lessonType, adapter, topic }) {
  const haystack = `${title} ${lessonType ?? ""} ${adapter ?? ""} ${topic ?? ""}`.toLowerCase();
  if (/proof|theorem|axiom|postulate|identity|derive|why/.test(haystack)) return "visual-proof";
  if (/practice|exercise|problem|fluency|factorisation practice|checkpoint/.test(haystack)) return "practice";
  if (/assessment|test|exam|mastery|quiz/.test(haystack)) return "assessment";
  if (/challenge|game|level|target/.test(haystack)) return "challenge";
  if (/investigation|conjecture|open question|explore/.test(haystack)) return "investigation";
  if (/revision|review|summary|recap/.test(haystack)) return "revision";
  if (/explor|visual|drag|simulation|model|relationship|discover|transform/.test(haystack)) return "explore";
  return "learn";
}

function inferFormats({ title, engine, controls = [], lessonType, workspace, adapter, topic }) {
  const haystack = `${title} ${lessonType ?? ""} ${workspace ?? ""} ${adapter ?? ""} ${topic ?? ""}`.toLowerCase();
  const formats = new Set();
  if (engine === "graph-2d" || engine === "graph-3d") formats.add("graphing");
  if (engine === "geometry-2d" || engine === "geometry-3d") formats.add("construction");
  if (engine === "geometry-3d" || engine === "graph-3d") formats.add("3d");
  if (engine === "cas-data") formats.add(/data|statistics|probability|regression|sampling/.test(haystack) ? "data-experiment" : "cas");
  if (controls.includes("slider") || /slider|parameter|transform|scale|rate|vary|change/.test(haystack)) formats.add("slider");
  if (controls.includes("drag") || /drag|point|vertex|move|construct/.test(haystack)) formats.add("drag-and-observe");
  if (controls.includes("playback") || /animation|animate|unfold|orbit/.test(haystack)) formats.add("animation");
  if (/simulation|random|sampling|experiment|coin|dice/.test(haystack)) formats.add("simulation");
  if (/matching|match/.test(haystack)) formats.add("matching");
  if (/game|hot and cold|collect/.test(haystack)) formats.add("game");
  if (/proof|theorem|identity/.test(haystack)) formats.add("open-response");
  if (/practice|assessment|quiz|question/.test(haystack)) formats.add("numeric-answer");
  if (!formats.size && /calculator|number|arithmetic|ratio|percentage|fraction/.test(haystack)) formats.add("numeric-answer");
  if (!formats.size && /authoring|learning|platform|share|import|export|accessibility/.test(haystack)) formats.add("open-response");
  if (!formats.size) formats.add("open-response");
  return [...formats].filter((format) => interactionFormats.has(format));
}

function qualityFromPreset(specificity, primaryType) {
  if (primaryType === "visual-proof" && specificity !== "lesson") return "family-specific";
  if (specificity === "lesson") return "lesson-specific";
  if (specificity === "concept") return "family-specific";
  return "generated-template";
}

function specificityFromPreset(specificity, primaryType) {
  if (primaryType === "visual-proof" && specificity === "lesson") return "theorem-specific";
  if (specificity === "lesson") return "lesson-preset";
  if (specificity === "concept" || specificity === "family") return "family-preset";
  return "none";
}

function applicability(record, type) {
  if (type === record.newPrimaryType) return "available";
  if (type === "visual-proof") return /theorem|proof|identity|postulate|axiom|congruence|similarity|circle|tangent|rolle|mean value|bayes|determinant/.test(record.title.toLowerCase()) ? "applicable-missing" : "not-applicable";
  if (type === "investigation") return record.engine === "none" ? "not-applicable" : "applicable-missing";
  if (type === "challenge") return record.engine === "none" ? "optional" : "applicable-missing";
  return "applicable-missing";
}

function makeConceptId(mainTopic, subtopic, title) {
  return [mainTopic, subtopic, title].map(slugify).filter(Boolean).join(".");
}

function flowFor(primaryType, title, formats) {
  const hasDrag = formats.includes("drag-and-observe") || formats.includes("slider");
  if (primaryType === "visual-proof") {
    return [
      "State the theorem and identify given/fixed objects.",
      "Predict the invariant before manipulating the diagram.",
      "Manipulate the construction and record measurements.",
      "Bridge the visual invariant to the formal proof.",
    ];
  }
  if (primaryType === "practice") return ["Review the method.", "Answer a deterministic question.", "Check with visual or symbolic verification.", "Try another value."];
  if (primaryType === "assessment") return ["Complete mixed items.", "Submit once ready.", "Review skill-level feedback.", "Open remediation links."];
  if (hasDrag) return ["Predict what will change.", "Drag or adjust one control.", "Observe the exact output.", "Explain the relationship."];
  return [`Read the core idea for ${title}.`, "Inspect the visual or symbolic model.", "Answer the quick check.", "Choose the next resource."];
}

function normalizeCoreLesson(lesson, index, catalog) {
  const engine = inferEngine({ ...lesson, catalog: "core" });
  const primaryType = inferPrimaryType({ ...lesson, lessonType: lesson.mode });
  const formats = inferFormats({ ...lesson, engine, controls: lesson.contract?.requiredControls ?? [] });
  const conceptId = makeConceptId(lesson.category, lesson.topic, lesson.title);
  const related = catalog.filter((candidate) => candidate.topic === lesson.topic && candidate.id !== lesson.id).slice(0, 3).map((candidate) => `core-${candidate.id}`);
  const next = catalog[index + 1] ? [`core-${catalog[index + 1].id}`] : [];
  return {
    lessonId: lesson.id,
    resourceId: `core-${lesson.id}`,
    route: lesson.route,
    title: lesson.title,
    catalog: "core",
    mainTopic: lesson.category,
    subtopic: lesson.topic,
    conceptId,
    existingType: lesson.mode || lesson.feature || "interactive lesson",
    newPrimaryType: primaryType,
    interactionFormats: formats,
    engine,
    currentAdapter: lesson.adapter,
    currentPresetSpecificity: lesson.preset?.specificity ?? "missing",
    targetPresetSpecificity: primaryType === "visual-proof" ? "theorem-specific" : "lesson-preset",
    contentQuality: qualityFromPreset(lesson.preset?.specificity, primaryType),
    mathematicalReview: "needs-review",
    priority: primaryType === "visual-proof" || lesson.preset?.specificity === "family" ? "P0" : lesson.priority,
    classLevels: [lesson.level],
    estimatedMinutes: lesson.priority === "P0" ? 16 : 12,
    prerequisites: [],
    objectives: unique([lesson.outcome, ...(lesson.contract?.observableOutputs ?? [])]).slice(0, 4),
    skills: unique([lesson.contract?.concept, lesson.feature, lesson.interactions, lesson.topic]).slice(0, 5),
    relatedResources: related,
    nextResources: next,
    enginePreset: lesson.preset?.id ?? "",
    interactionSpecificity: specificityFromPreset(lesson.preset?.specificity, primaryType),
    applicabilityOfLearn: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "learn"),
    applicabilityOfExplore: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "explore"),
    applicabilityOfPractice: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "practice"),
    applicabilityOfChallenge: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "challenge"),
    applicabilityOfInvestigation: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "investigation"),
    applicabilityOfVisualProof: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "visual-proof"),
    applicabilityOfAssessment: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "assessment"),
    applicabilityOfRevision: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "revision"),
    notes: flowFor(primaryType, lesson.title, formats).join(" "),
  };
}

function normalizeSchoolLesson(lesson, index, catalog) {
  const mainTopic = lesson.metadata?.conceptFamily ?? "School Mathematics";
  const subtopic = lesson.metadata?.boardChapter ?? mainTopic;
  const primaryType = inferPrimaryType({ title: lesson.title, lessonType: lesson.metadata?.lessonType, topic: mainTopic });
  const engine = inferEngine({ title: lesson.title, topic: mainTopic, workspace: lesson.metadata?.visualModel, adapter: "school", catalog: "school" });
  const formats = inferFormats({ title: lesson.title, topic: mainTopic, lessonType: lesson.metadata?.lessonType, workspace: lesson.metadata?.visualModel, adapter: "school", engine });
  const related = catalog.filter((candidate) => candidate.metadata?.conceptFamily === mainTopic && candidate.id !== lesson.id).slice(0, 3).map((candidate) => `school-${candidate.id}`);
  const next = catalog[index + 1] ? [`school-${catalog[index + 1].id}`] : [];
  return {
    lessonId: lesson.id,
    resourceId: `school-${lesson.id}`,
    route: lesson.route,
    title: lesson.title,
    catalog: "school",
    mainTopic,
    subtopic,
    conceptId: makeConceptId(mainTopic, subtopic, lesson.title),
    existingType: lesson.metadata?.lessonType ?? "school lesson",
    newPrimaryType: primaryType,
    interactionFormats: formats,
    engine,
    currentAdapter: "school-interactive-lab",
    currentPresetSpecificity: "family",
    targetPresetSpecificity: primaryType === "visual-proof" ? "theorem-specific" : "lesson-preset",
    contentQuality: "family-specific",
    mathematicalReview: "needs-review",
    priority: primaryType === "visual-proof" ? "P0" : "P1",
    classLevels: [lesson.metadata?.academicLevel ?? ""],
    estimatedMinutes: lesson.estimatedMinutes ?? 15,
    prerequisites: [],
    objectives: lesson.metadata?.learningObjectives ?? [],
    skills: unique([...(lesson.metadata?.searchKeywords ?? []), mainTopic]).slice(0, 5),
    relatedResources: related,
    nextResources: next,
    enginePreset: lesson.metadata?.visualModel ?? "school-family-model",
    interactionSpecificity: primaryType === "visual-proof" ? "family-preset" : "family-preset",
    applicabilityOfLearn: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "learn"),
    applicabilityOfExplore: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "explore"),
    applicabilityOfPractice: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "practice"),
    applicabilityOfChallenge: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "challenge"),
    applicabilityOfInvestigation: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "investigation"),
    applicabilityOfVisualProof: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "visual-proof"),
    applicabilityOfAssessment: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "assessment"),
    applicabilityOfRevision: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "revision"),
    notes: primaryType === "visual-proof" ? "Priority theorem-specific visual proof remediation required." : flowFor(primaryType, lesson.title, formats).join(" "),
  };
}

function normalizeAdvancedLesson(lesson, index, catalog) {
  const engine = inferEngine({ title: lesson.title, topic: lesson.strand, toolRoute: lesson.toolRoute, adapter: "advanced", catalog: "advanced" });
  const primaryType = inferPrimaryType({ title: lesson.title, lessonType: "advanced concept", topic: lesson.strand });
  const formats = inferFormats({ title: lesson.title, topic: lesson.strand, toolRoute: lesson.toolRoute, adapter: "advanced", engine });
  return {
    lessonId: lesson.id,
    resourceId: `advanced-${lesson.numericId}`,
    route: lesson.route,
    title: lesson.title,
    catalog: "advanced",
    mainTopic: "Advanced Concepts",
    subtopic: lesson.strand,
    conceptId: makeConceptId("Advanced Concepts", lesson.strand, lesson.title),
    existingType: "advanced concept",
    newPrimaryType: primaryType,
    interactionFormats: formats,
    engine,
    currentAdapter: "advanced-interactive-lab",
    currentPresetSpecificity: "lesson",
    targetPresetSpecificity: "lesson-preset",
    contentQuality: "lesson-specific",
    mathematicalReview: /gamma|zeta|erf|riemann/i.test(lesson.title) ? "needs-review-approximation-label" : "needs-review",
    priority: /gamma|zeta|erf|riemann/i.test(lesson.title) ? "P1" : "P2",
    classLevels: ["Advanced"],
    estimatedMinutes: lesson.estimatedMinutes,
    prerequisites: [],
    objectives: lesson.objectives ?? [],
    skills: lesson.searchKeywords ?? [],
    relatedResources: catalog.filter((candidate) => candidate.strand === lesson.strand && candidate.id !== lesson.id).slice(0, 3).map((candidate) => `advanced-${candidate.numericId}`),
    nextResources: catalog[index + 1] ? [`advanced-${catalog[index + 1].numericId}`] : [],
    enginePreset: lesson.toolRoute,
    interactionSpecificity: "lesson-preset",
    applicabilityOfLearn: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "learn"),
    applicabilityOfExplore: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "explore"),
    applicabilityOfPractice: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "practice"),
    applicabilityOfChallenge: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "challenge"),
    applicabilityOfInvestigation: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "investigation"),
    applicabilityOfVisualProof: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "visual-proof"),
    applicabilityOfAssessment: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "assessment"),
    applicabilityOfRevision: applicability({ newPrimaryType: primaryType, engine, title: lesson.title }, "revision"),
    notes: "Advanced resource is concept-specific; numerical approximation outputs need explicit labels where applicable.",
  };
}

function mdTable(rows, headers) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${headers.map((header) => String(row[header] ?? "").replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");
}

function writeReports(records, data) {
  mkdirSync(outputDir, { recursive: true });
  const matrixColumns = [
    "lessonId",
    "route",
    "title",
    "catalog",
    "mainTopic",
    "subtopic",
    "conceptId",
    "existingType",
    "newPrimaryType",
    "interactionFormats",
    "engine",
    "currentAdapter",
    "currentPresetSpecificity",
    "targetPresetSpecificity",
    "contentQuality",
    "mathematicalReview",
    "priority",
    "applicabilityOfLearn",
    "applicabilityOfExplore",
    "applicabilityOfPractice",
    "applicabilityOfChallenge",
    "applicabilityOfInvestigation",
    "applicabilityOfVisualProof",
    "applicabilityOfAssessment",
    "applicabilityOfRevision",
    "notes",
  ];
  writeFileSync(join(outputDir, "LESSON_CLASSIFICATION_MATRIX.csv"), toCsv(records, matrixColumns));

  const engineRows = countBy(records, (record) => record.engine).map(([Engine, Lessons]) => ({ Engine, Lessons }));
  const typeRows = countBy(records, (record) => record.newPrimaryType).map(([Type, Lessons]) => ({ Type, Lessons }));
  const specificityRows = countBy(records, (record) => record.interactionSpecificity).map(([Specificity, Lessons]) => ({ Specificity, Lessons }));
  const priorityRows = countBy(records, (record) => record.priority).map(([Priority, Lessons]) => ({ Priority, Lessons }));
  const proofRows = records.filter((record) => record.newPrimaryType === "visual-proof" || record.applicabilityOfVisualProof === "applicable-missing");
  const familyPresetRows = records.filter((record) => record.currentPresetSpecificity === "family");
  const routeIssues = [];
  const duplicateRoutes = records.map((record) => record.route).filter((route, index, routes) => routes.indexOf(route) !== index);
  if (duplicateRoutes.length) routeIssues.push(`Duplicate routes: ${unique(duplicateRoutes).join(", ")}`);
  for (const record of records) {
    if (!primaryTypes.has(record.newPrimaryType)) routeIssues.push(`${record.resourceId} has invalid primary type.`);
    if (!engineTypes.has(record.engine)) routeIssues.push(`${record.resourceId} has invalid engine.`);
    if (!record.interactionFormats.length) routeIssues.push(`${record.resourceId} has no interaction format.`);
  }

  writeFileSync(
    join(outputDir, "GEOGEBRA_LESSON_PATTERN_AUDIT.md"),
    `# GeoGebra Lesson Pattern Audit\n\nGenerated on ${new Date().toISOString()}.\n\n## Sources Inspected\n\n- https://www.geogebra.org/math\n- https://www.geogebra.org/math/functions\n- https://www.geogebra.org/math/angles\n- https://www.geogebra.org/math/transformations\n- https://www.geogebra.org/math/triangles\n- https://www.geogebra.org/math/solids\n- https://www.geogebra.org/math/volume\n- https://www.geogebra.org/math/ratios-rates\n- https://www.geogebra.org/m/nvdtpdvs\n- https://www.geogebra.org/m/bnfvexmr\n\n## Patterns To Adopt With Original Content\n\n- Topic pages should group resources by grade band, then by subtopic skill.\n- Resource cards should distinguish Exploration, Practice, and game/challenge experiences without overloading the card.\n- Individual activities should expose skill metadata, prerequisites, student-share links, and related resources.\n- Strong activities end with open reflection prompts that ask learners to explain the mathematical relationship.\n- Solids and function-transformation pages make the manipulative object the center of the learning path.\n\n## Product Direction\n\nUse our broader engine set to go beyond the reference: preserve every legacy route, add normalized type/filter metadata, surface Visual Proof and Assessment resources, and keep all content original.\n`,
  );

  writeFileSync(
    join(outputDir, "OUR_LESSON_CATALOG_GAP_ANALYSIS.md"),
    `# Lesson Catalog Gap Analysis\n\nGenerated on ${new Date().toISOString()} from ${records.length} registered resources.\n\n## Primary Type Coverage\n\n${mdTable(typeRows, ["Type", "Lessons"])}\n\n## Engine Coverage\n\n${mdTable(engineRows, ["Engine", "Lessons"])}\n\n## Priority Backlog\n\n${mdTable(priorityRows, ["Priority", "Lessons"])}\n\n## Main Gaps\n\n- ${familyPresetRows.length} resources currently use family-level presets and should be reviewed for lesson-specific state.\n- ${proofRows.length} resources are Visual Proofs or Visual Proof candidates; theorem-specific construction quality is the highest-risk area.\n- School lessons are classified and mapped, but most still require exact theorem/problem-specific visual states rather than family-lab reuse.\n- Advanced special-function lessons require explicit approximation labels where numerical samplers are used.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_ENGINE_MAPPING.md"),
    `# Lesson Engine Mapping\n\nGenerated on ${new Date().toISOString()}.\n\n${mdTable(engineRows, ["Engine", "Lessons"])}\n\n## Rule Summary\n\n- Geometry and construction concepts map to \`geometry-2d\`.\n- Solids, 3D coordinates, nets, cross-sections, and spatial constructions map to \`geometry-3d\`.\n- Function curves, intercepts, inequalities, and coordinate graphing map to \`graph-2d\`.\n- Surfaces, contours, gradients, tangent planes, and multivariable visuals map to \`graph-3d\`.\n- Symbolic algebra, matrices, statistics, data, probability, and numerical advanced studios map to \`cas-data\`.\n- Non-mathematical platform/authoring lessons may map to \`none\` when no math engine is appropriate.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_PRESET_SPECIFICITY_REPORT.md"),
    `# Lesson Preset Specificity Report\n\nGenerated on ${new Date().toISOString()}.\n\n${mdTable(specificityRows, ["Specificity", "Lessons"])}\n\n## Remediation Order\n\n1. Upgrade Visual Proof candidates from family preset to theorem-specific construction.\n2. Upgrade core family presets in P0 topics to lesson presets.\n3. Replace school broad visual models with exact lesson adapter configurations.\n4. Capture deterministic thumbnail state after each preset upgrade.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_CONTENT_ENRICHMENT_BACKLOG.md"),
    `# Lesson Content Enrichment Backlog\n\nGenerated on ${new Date().toISOString()}.\n\n## P0 Visual Proof Candidates\n\n${mdTable(proofRows.slice(0, 80).map((record) => ({ ID: record.resourceId, Title: record.title, Route: record.route, Engine: record.engine, Status: record.interactionSpecificity })), ["ID", "Title", "Route", "Engine", "Status"])}\n\n## P0/P1 Family Preset Candidates\n\n${mdTable(familyPresetRows.slice(0, 120).map((record) => ({ ID: record.resourceId, Title: record.title, Topic: record.subtopic, Engine: record.engine, Target: record.targetPresetSpecificity })), ["ID", "Title", "Topic", "Engine", "Target"])}\n`,
  );

  const formulaRows = [];
  for (const lesson of data.core) {
    for (const formula of lesson.content?.formulas ?? []) {
      formulaRows.push({
        lessonId: lesson.id,
        title: lesson.title,
        displayedFormula: formula.expression,
        sourceWithinApplication: "core lesson content formula card",
        enginePreset: lesson.preset?.id ?? "",
        exampleInputs: lesson.contract?.requiredControlIds?.join("|") ?? "",
        expectedOutputs: lesson.contract?.observableOutputs?.join("|") ?? "",
        reviewStatus: "needs-review",
      });
    }
  }
  writeFileSync(join(outputDir, "LESSON_FORMULA_CROSSWALK.csv"), toCsv(formulaRows, ["lessonId", "title", "displayedFormula", "sourceWithinApplication", "enginePreset", "exampleInputs", "expectedOutputs", "reviewStatus"]));

  writeFileSync(
    join(outputDir, "LESSON_INTERACTION_COVERAGE.md"),
    `# Lesson Interaction Coverage\n\nGenerated on ${new Date().toISOString()}.\n\n${mdTable(countBy(records.flatMap((record) => record.interactionFormats), (format) => format).map(([Format, Lessons]) => ({ Format, Lessons })), ["Format", "Lessons"])}\n\n## Notes\n\nInteraction formats are metadata-level classifications. A format becomes release-ready only after its lesson has a validated engine preset, keyboard path, and screen-reader summary.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_ROUTE_REGRESSION_REPORT.md"),
    `# Lesson Route Regression Report\n\nGenerated on ${new Date().toISOString()}.\n\n## Summary\n\n- Registered resources: ${records.length}\n- Duplicate routes: ${unique(duplicateRoutes).length}\n- Metadata validation issues: ${routeIssues.length}\n\n${routeIssues.length ? routeIssues.map((issue) => `- ${issue}`).join("\n") : "No route or classification integrity issues were found in the generated matrix."}\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_ACCESSIBILITY_REPORT.md"),
    `# Lesson Accessibility Report\n\nGenerated on ${new Date().toISOString()}.\n\n## Current Contracts\n\n- Core lessons include keyboard alternatives and screen-reader summaries through existing interaction contracts.\n- New classifications require every visual engine resource to retain a non-visual mathematical summary.\n- Off-screen panels and focus-mode state must remain hidden from assistive technology when visually unavailable.\n\n## Required Batch Checks\n\n- Keyboard operate every slider and drag alternative.\n- Verify visible focus on cards, filters, dialogs, and engine controls.\n- Provide exact graph/construction summaries instead of generic visual alt text.\n- Respect reduced-motion preferences for animations and simulations.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_VISUAL_QA_REPORT.md"),
    `# Lesson Visual QA Report\n\nGenerated on ${new Date().toISOString()}.\n\n## Baseline\n\nThe catalog now has engine and interaction metadata for visual QA targeting. The next QA loop should capture representative screenshots for Learn Home, topic page, subtopic page, individual resource page, Focus Mode, and Share Current State at 1440x900, 1280x800, 1024x768, 768x1024, and 390x844.\n\n## High-Risk Areas\n\n- Visual Proof theorem diagrams.\n- 3D graph/surface lessons at tablet width.\n- CAS/Data lessons that need exact approximation labeling.\n- Large topic pages that need thumbnail lazy-loading and non-repetitive layout.\n`,
  );

  writeFileSync(
    join(outputDir, "LESSON_RELEASE_READINESS.md"),
    `# Lesson Release Readiness\n\nGenerated on ${new Date().toISOString()}.\n\n## Status\n\n- Classification matrix: complete for ${records.length} registered resources.\n- Engine mapping: complete as metadata; per-engine preset QA remains batch-based.\n- Route preservation: generated matrix preserves all existing routes.\n- Content enrichment: backlog created for Visual Proofs, family presets, and approximation labels.\n- Completion status: not release-complete until batch remediation, thumbnail capture, browser QA, accessibility checks, and production build pass.\n\n## Next Batch Recommendation\n\nStart with school proof lessons because they are high-value, visibly weak when generic, and map naturally to theorem-specific 2D Geometry/CAS/Graph engine presets.\n`,
  );
}

const data = loadCatalogs();
const records = [
  ...data.core.map((lesson, index) => normalizeCoreLesson(lesson, index, data.core)),
  ...data.school.map((lesson, index) => normalizeSchoolLesson(lesson, index, data.school)),
  ...data.advanced.map((lesson, index) => normalizeAdvancedLesson(lesson, index, data.advanced)),
];

writeReports(records, data);
console.log(`Generated ${records.length} lesson ecosystem records in ${outputDir}.`);
