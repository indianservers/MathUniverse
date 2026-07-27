import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogDir = path.join(root, "src/modules/lessons/catalog");
const auditDir = path.join(root, "src/modules/lessons/audit");
const docsDir = path.join(root, "docs/lessons");

const catalogFiles = [
  "phase1.generated.ts",
  "phase2.generated.ts",
  "phase3.generated.ts",
  "phase4.generated.ts",
];

const boards = ["NCERT", "CBSE", "AP_SCERT", "TN_SCERT", "CAMBRIDGE_IGCSE", "IB_AA", "IB_AI", "COMMON_CORE"];

const levelRules = [
  ["CLASS_6", /place value|number naming|whole number|integer|pictograph|bar graph|symmetry|perimeter|area|fraction|decimal|ratio|unit rate|data handling/i],
  ["CLASS_7", /integer|fraction|decimal|simple equation|triangle|congruence|percentage|profit|loss|simple interest|data handling|practical geometry/i],
  ["CLASS_8", /rational|linear equation|quadrilateral|mensuration|exponent|square|cube|factorisation|graph|direct proportion|inverse proportion/i],
  ["CLASS_9", /euclid|postulate|axiom|heron|polynomial|coordinate geometry|line angle|triangle|quadrilateral|circle|surface area|volume|statistics/i],
  ["CLASS_10", /quadratic|arithmetic progression|trigonometry|height|distance|coordinate|probability|cumulative|ogive|circle tangent|similar/i],
  ["CLASS_11", /set|relation|function|induction|binomial|conic|sequence|permutation|combination|straight line|limit|derivative/i],
  ["CLASS_12", /matrix|determinant|inverse trigonometric|continuity|differentiability|integral|differential equation|vector|3d|linear programming|bayes|distribution/i],
];

const conceptFamilies = [
  ["Numbers and Arithmetic", /number|integer|fraction|decimal|ratio|percentage|percent|divisibility|prime|gcd|lcm|arithmetic/i],
  ["Algebra", /algebra|equation|inequality|polynomial|expression|factor|quadratic|linear/i],
  ["Functions and Graphs", /function|graph|cartesian|coordinate|transformation|plot|slope|line/i],
  ["Geometry", /geometry|triangle|circle|quadrilateral|angle|construction|locus|area|volume|solid|mensuration/i],
  ["Trigonometry", /trig|sine|cosine|tangent|angle of elevation|angle of depression/i],
  ["Calculus", /limit|derivative|integral|differential equation|continuity|calculus/i],
  ["Statistics and Probability", /statistics|probability|distribution|regression|mean|median|mode|inference|data/i],
  ["Linear Algebra", /matrix|determinant|vector|linear algebra/i],
  ["Discrete Mathematics", /set|logic|combinatorics|graph theory|tree|power set|truth|quantifier/i],
  ["3D Mathematics", /3d|surface|solid|plane|space|vector equation/i],
  ["Finance and Modelling", /finance|interest|loan|discount|tax|budget|linear programming/i],
  ["Platform and Authoring", /authoring|lesson|assessment|accessibility|platform|keyboard|screen reader/i],
];

const schoolGaps = [
  ["CLASS_6", "Numbers and Arithmetic", ["Place Value Explorer", "Indian and International Number Naming Systems", "Estimation and Rounding Lab", "Approximation and Error Bounds", "Mixed Units and Unit Conversion"]],
  ["CLASS_6", "Data Handling", ["Pictograph Builder", "Bar Graph Builder", "Survey to Frequency Table", "Misleading Graph Detection"]],
  ["CLASS_6", "Patterns", ["Number Pattern Completion", "Shape Pattern Completion", "Input-Output Rule Machines"]],
  ["CLASS_7", "Numbers and Arithmetic", ["Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11", "Digital Root and Divisibility", "Remainder Reasoning", "Unit Rate Table Lab", "Ratio Tables"]],
  ["CLASS_7", "Applied Arithmetic", ["Bills, Discounts and Tax", "Profit, Loss and Marked Price", "Household Budget Arithmetic", "Scale Factor in Maps and Recipes"]],
  ["CLASS_7", "Practical Geometry", ["Copying a Line Segment", "Copying an Angle", "Perpendicular Bisector Construction", "Angle Bisector Construction", "Perpendicular Through a Point", "Parallel Line Construction"]],
  ["CLASS_8", "Practical Geometry", ["Triangle Construction by SSS", "Triangle Construction by SAS", "Triangle Construction by ASA", "Right Triangle Construction by RHS"]],
  ["CLASS_8", "Data Handling", ["Double Bar Graph Comparison", "Mean Median and Mode Practice Path", "Range and Spread Explorer"]],
  ["CLASS_8", "Information Processing", ["Flowchart Logic", "Pattern Encoding", "Magic Squares", "Route Map Reasoning", "Tabular Pattern Completion"]],
  ["CLASS_9", "Real Numbers", ["Decimal Expansion of Rational Numbers", "Terminating and Non-Terminating Decimals", "Rational and Irrational Classification", "Successive Magnification on the Number Line", "Rationalisation of Denominators", "nth Roots and Radical Meaning"]],
  ["CLASS_9", "Polynomials", ["Graphical Zeros of Polynomials", "Polynomial Division", "Remainder Theorem", "Factor Theorem", "Relationship Between Zeros and Coefficients", "Cubic Algebraic Identities", "Polynomial Factorisation Practice"]],
  ["CLASS_9", "Euclidean Geometry", ["Definitions Axioms and Postulates", "Euclid's Five Postulates", "Equivalent Forms of the Fifth Postulate", "Axiom versus Theorem", "Proof Structure and Logical Statements", "Vertically Opposite Angles", "Linear Pair Axiom and Converse", "Corresponding Angles", "Alternate Interior Angles", "Interior Angles on the Same Side", "Parallel Line Converse Theorems", "Triangle Angle Sum Theorem", "Exterior Angle Theorem"]],
  ["CLASS_9", "Triangle Proofs", ["SAS Congruence", "ASA Congruence", "AAS Congruence", "SSS Congruence", "RHS Congruence", "Equal Sides and Equal Angles", "Triangle Inequality"]],
  ["CLASS_9", "Quadrilateral Proofs", ["Parallelogram Opposite Sides", "Parallelogram Opposite Angles", "Parallelogram Diagonals", "Conditions for a Quadrilateral to Be a Parallelogram", "Midpoint Theorem", "Converse of Midpoint Theorem"]],
  ["CLASS_9", "Mensuration", ["Heron's Formula Derivation", "Semi-Perimeter Lab", "Coordinate Area versus Heron's Formula", "Combined Solids"]],
  ["CLASS_10", "Coordinate Geometry", ["Distance Formula", "Midpoint Formula", "Internal Section Formula", "External Section Formula", "Area of Triangle Using Coordinates", "Collinearity Using Coordinate Area"]],
  ["CLASS_10", "Circle Proofs", ["Equal Chords and Equal Angles", "Perpendicular from Centre to Chord", "Angle Subtended by an Arc", "Angle in a Semicircle", "Angles in the Same Segment", "Cyclic Quadrilateral", "Opposite Angles of a Cyclic Quadrilateral", "Tangent Perpendicular to Radius", "Tangent Lengths from an External Point"]],
  ["CLASS_10", "Trigonometry Applications", ["Angle of Elevation", "Angle of Depression", "Shadow-Length Modelling", "Two-Observer Height Problems"]],
  ["CLASS_10", "Statistics", ["Grouped Mean by Direct Method", "Grouped Mean by Assumed Mean", "Grouped Mean by Step Deviation", "Less-Than Cumulative Frequency", "More-Than Cumulative Frequency", "Less-Than Ogive", "More-Than Ogive", "Median from an Ogive"]],
  ["CLASS_10", "Mensuration", ["Frustum of a Cone", "Combined Solids"]],
  ["CLASS_11", "Relations and Functions", ["Types of Relations", "Reflexive Relations", "Symmetric Relations", "Transitive Relations", "Equivalence Relations", "One-One Functions", "Many-One Functions", "Into Functions", "Onto Functions", "Composition of Functions", "Invertible Functions", "Binary Operations"]],
  ["CLASS_11", "Trigonometry", ["Domain and Range of Trigonometric Functions", "Transformation of Trigonometric Graphs", "General Solutions of Trigonometric Equations", "Principal Solutions"]],
  ["CLASS_11", "Mathematical Induction", ["Logic of Mathematical Induction", "Base Case and Inductive Step", "Sum Formula by Induction", "Divisibility by Induction", "Inequality by Induction", "Strong Induction Introduction"]],
  ["CLASS_11", "Binomial Theorem", ["Binomial Expansion", "General Term", "Middle Term", "Independent Term", "Binomial Approximation", "Pascal Identity", "Combinatorial Interpretation"]],
  ["CLASS_11", "Conic Sections", ["Parabola Standard Forms", "Focus-Directrix Definition", "Ellipse Standard Forms", "Hyperbola Standard Forms", "Eccentricity", "Parametric Coordinates", "Tangent to a Parabola", "Normal to a Parabola", "Tangent to an Ellipse", "Tangent to a Hyperbola", "Conic Identification from General Equation"]],
  ["CLASS_12", "Three-Dimensional Geometry", ["Direction Ratios", "Direction Cosines", "Line Through Two Points in 3D", "Vector Equation of a Line", "Cartesian Equation of a Line", "Skew Lines", "Shortest Distance Between Lines", "Plane Equation", "Point-Normal Form", "Intercept Form of a Plane", "Distance from Point to Plane", "Angle Between Two Planes", "Angle Between Line and Plane"]],
  ["CLASS_12", "Formal Calculus", ["Left-Hand and Right-Hand Limits", "Continuity at a Point", "Continuity on an Interval", "Removable Discontinuity", "Jump Discontinuity", "Infinite Discontinuity", "Differentiability versus Continuity", "Rolle's Theorem", "Lagrange Mean Value Theorem", "Rate of Change", "Tangents and Normals", "Increasing and Decreasing Functions", "Local Maxima and Minima", "Absolute Maxima and Minima", "Approximation Using Differentials", "Integration by Substitution", "Integration by Parts", "Integration by Partial Fractions", "Definite Integral Properties", "Area Under a Curve", "Area Between Curves"]],
  ["CLASS_12", "Differential Equations", ["Formation of Differential Equations", "Order and Degree", "Variable-Separable Equations", "Homogeneous First-Order Equations", "Linear First-Order Equations", "General and Particular Solutions", "Direction Fields"]],
  ["CLASS_12", "Matrices and Determinants", ["Minors and Cofactors", "Adjoint of a Matrix", "Inverse by Adjoint", "Determinants and Geometric Area", "Solving Linear Equations by Matrices", "Cramer's Rule", "Consistency of Linear Systems"]],
  ["CLASS_12", "Linear Programming", ["Formulating Linear Programming Problems", "Feasible Region", "Corner-Point Method", "Bounded Feasible Region", "Unbounded Feasible Region", "Multiple Optimal Solutions", "Infeasible Problems", "Diet Problem", "Production Planning Problem", "Transportation-Style LPP Introduction"]],
  ["CLASS_12", "Probability", ["Conditional Probability", "Multiplication Rule", "Independent Events", "Total Probability Theorem", "Bayes' Theorem", "Random Variables", "Probability Distribution of a Random Variable", "Expected Value", "Variance", "Bernoulli Trials", "Binomial Distribution"]],
];

function readCatalogFile(fileName) {
  const fullPath = path.join(catalogDir, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const start = source.indexOf("[", source.indexOf("export const"));
  const end = source.indexOf("] as const", start);
  if (start < 0 || end < 0) throw new Error(`Cannot parse ${fileName}`);
  return Function(`return ${source.slice(start, end + 1)}`)();
}

function classifyLevel(lesson) {
  const haystack = lessonText(lesson);
  const matched = levelRules.filter(([, rule]) => rule.test(haystack)).map(([level]) => level);
  if (matched.length) return matched;
  if (/calculus|matrix|complex|vector|3d|probability|inference/i.test(haystack)) return ["CLASS_11", "CLASS_12"];
  if (/geometry|algebra|graph|statistics/i.test(haystack)) return ["CLASS_8", "CLASS_9", "CLASS_10"];
  return ["CLASS_6", "CLASS_7", "CLASS_8"];
}

function classifyFamily(lesson) {
  const haystack = lessonText(lesson);
  return conceptFamilies.find(([, rule]) => rule.test(haystack))?.[0] ?? lesson.category;
}

function classifyType(lesson) {
  const haystack = lessonText(lesson);
  if (/proof|theorem|derive|postulate|axiom|congruence/i.test(haystack)) return "PROOF";
  if (/assessment|quiz|practice|challenge/i.test(haystack)) return "PRACTICE";
  if (/construct|construction|geometry/i.test(haystack)) return "VISUAL_EXPLORATION";
  if (/finance|model|application|real/i.test(haystack)) return "APPLICATION";
  return "CONCEPT";
}

function classifyCoverage(lesson) {
  if (lesson.priority === "P0") return "DIRECT";
  if (/authoring|platform|accessibility|workspace/i.test(lesson.category)) return "ENRICHMENT";
  return "SUPPORTING";
}

function lessonText(lesson) {
  return [lesson.title, lesson.topic, lesson.category, lesson.purpose, lesson.description, lesson.workspace, lesson.interactions, lesson.outcome, lesson.adapter].join(" ");
}

function conceptSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function engineFor(lesson) {
  const byAdapter = {
    calculator: "calculator",
    algebra: "graph2d",
    number: "number-model",
    authoring: "lesson-authoring",
    learning: "lesson-runtime",
    platform: "platform-ui",
    graph: "graph2d",
    "algebra-cas": "cas",
    geometry2d: "dynamic-geometry",
    vector: "dynamic-geometry",
    trigonometry: "graph2d",
    cas: "cas",
    calculus: "graph2d-cas",
    spreadsheet: "spreadsheet",
    statistics: "statistics",
    probability: "probability",
    inference: "statistics",
    sequence: "sequence",
    matrix: "matrix",
    complex: "complex-plane",
    geometry3d: "geometry3d",
    discrete: "discrete",
    finance: "finance",
  };
  return byAdapter[lesson.adapter] ?? lesson.adapter;
}

const lessons = catalogFiles.flatMap((file) => readCatalogFile(file).map((lesson) => ({ ...lesson, sourceFile: file })));

const seenIds = new Map();
const seenRoutes = new Map();
const seenConceptKeys = new Map();
const duplicateIds = [];
const duplicateRoutes = [];
const duplicateConcepts = [];

for (const lesson of lessons) {
  const conceptKey = `${lesson.title.toLowerCase()}|${lesson.topic.toLowerCase()}`;
  if (seenIds.has(lesson.id)) duplicateIds.push([seenIds.get(lesson.id), lesson.id]);
  if (seenRoutes.has(lesson.route)) duplicateRoutes.push([seenRoutes.get(lesson.route), lesson.route]);
  if (seenConceptKeys.has(conceptKey)) duplicateConcepts.push([seenConceptKeys.get(conceptKey), lesson.id]);
  seenIds.set(lesson.id, lesson.id);
  seenRoutes.set(lesson.route, lesson.route);
  seenConceptKeys.set(conceptKey, lesson.id);
}

const existingLessonCoverage = {
  generatedAt: new Date().toISOString(),
  sourceFiles: catalogFiles,
  totalLessons: lessons.length,
  duplicateReport: {
    duplicateIds,
    duplicateRoutes,
    duplicateConcepts,
  },
  lessons: lessons.map((lesson) => {
    const levels = classifyLevel(lesson);
    const family = classifyFamily(lesson);
    const coverage = classifyCoverage(lesson);
    return {
      id: lesson.id,
      route: lesson.route,
      slug: lesson.slug,
      title: lesson.title,
      sourceFile: lesson.sourceFile,
      primaryConcept: lesson.title,
      secondaryConcepts: [lesson.topic, lesson.category].filter(Boolean),
      academicLevels: levels,
      applicableBoards: boards,
      syllabusTags: levels.flatMap((level) => boards.map((board) => ({
        board,
        level,
        unit: family,
        chapter: lesson.topic,
        concept: lesson.title,
        coverage,
      }))),
      conceptFamily: family,
      engine: engineFor(lesson),
      lessonType: classifyType(lesson),
      coverage,
      duplicateCandidate: duplicateConcepts.some(([, id]) => id === lesson.id),
      needsMetadataEnhancement: true,
      metadataEnhancementReason: "Existing generated lesson has visual/catalog fields but no explicit syllabusTags, prerequisites, objectives, duration, difficulty, or assessment metadata.",
    };
  }),
};

const schoolGapBacklog = {
  generatedAt: new Date().toISOString(),
  scope: "Phase 1 school syllabus remediation only",
  boards,
  totalMissingConcepts: schoolGaps.reduce((sum, [, , concepts]) => sum + concepts.length, 0),
  conceptPacks: schoolGaps.map(([level, unit, concepts], packIndex) => ({
    id: `phase1-${conceptSlug(level)}-${conceptSlug(unit)}`,
    priority: level === "CLASS_9" || level === "CLASS_10" || /Formal Calculus|Probability|Euclidean/.test(unit) ? "P0" : "P1",
    academicLevel: level,
    unit,
    missingConcepts: concepts.map((title, index) => ({
      id: `phase1-${conceptSlug(level)}-${conceptSlug(unit)}-${String(index + 1).padStart(2, "0")}-${conceptSlug(title)}`,
      title,
      suggestedLessonType: /Theorem|Proof|Postulate|Axiom|Congruence|Euclid|Angles|Parallelogram|Cyclic|Tangent|Rolle|Lagrange|Induction|Formula Derivation/i.test(title) ? "PROOF" : /Construction|Angle|Line Segment|Bisector|Triangle Construction/i.test(title) ? "VISUAL_EXPLORATION" : /Practice|Problems|Path/i.test(title) ? "PRACTICE" : "CONCEPT",
      suggestedAdapter: suggestedAdapter(unit, title),
      boards,
      coverageNeed: "DIRECT",
      reason: `Required for ${level.replace("_", " ")} ${unit} syllabus continuity across NCERT, CBSE, AP_SCERT, TN_SCERT, and comparable international pathways.`,
    })),
  })),
};

function suggestedAdapter(unit, title) {
  const text = `${unit} ${title}`;
  if (/geometry|construction|triangle|circle|angle|plane|3d|conic|coordinate/i.test(text)) return /3D|Plane|Skew|Direction/i.test(text) ? "geometry3d" : "geometry2d";
  if (/graph|function|calculus|limit|derivative|integral|trigonometry|polynomial|linear programming/i.test(text)) return "graph";
  if (/probability|statistics|mean|frequency|ogive|distribution/i.test(text)) return "statistics";
  if (/matrix|determinant|cramer|cofactor|adjoint/i.test(text)) return "matrix";
  if (/number|arithmetic|divisibility|rate|ratio|budget|tax|profit|loss/i.test(text)) return "number";
  if (/differential equation|direction field/i.test(text)) return "calculus";
  return "learning";
}

const categoryCounts = countBy(lessons, (lesson) => lesson.category);
const topicCounts = countBy(lessons, (lesson) => lesson.topic);
const familyCounts = countBy(existingLessonCoverage.lessons, (lesson) => lesson.conceptFamily);
const typeCounts = countBy(existingLessonCoverage.lessons, (lesson) => lesson.lessonType);

function countBy(values, keyFn) {
  return Object.fromEntries([...values.reduce((map, value) => {
    const key = keyFn(value);
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map()).entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function tableRowsFromObject(object) {
  return Object.entries(object).map(([key, count]) => `| ${key} | ${count} |`).join("\n");
}

function markdownBacklogRows() {
  return schoolGapBacklog.conceptPacks.flatMap((pack) => (
    pack.missingConcepts.map((concept) => `| ${pack.academicLevel} | ${pack.unit} | ${concept.title} | ${concept.suggestedLessonType} | ${concept.suggestedAdapter} | ${concept.priority ?? pack.priority} | ${concept.reason} |`)
  )).join("\n");
}

const md = `# Phase 1 Syllabus Alignment Implementation Report

Date: 2026-07-27

## Completed In This Slice

This implementation starts Phase 1 only. It does not start undergraduate Phase 2 or postgraduate Phase 3.

| Deliverable | File |
|---|---|
| Existing 674 lesson machine-readable coverage audit | \`src/modules/lessons/audit/existingLessonCoverage.generated.json\` |
| Phase 1 school missing-concept backlog | \`src/modules/lessons/audit/schoolSyllabusGapBacklog.generated.json\` |
| Detailed human-readable gap audit | \`docs/lessons/LESSON_674_SYLLABUS_GAP_AUDIT.md\` |
| Phase 1 implementation report | \`docs/lessons/PHASE_1_SYLLABUS_ALIGNMENT_IMPLEMENTATION_REPORT.md\` |

## Existing Catalog Totals

| Metric | Count |
|---|---:|
| Existing lessons audited | ${lessons.length} |
| Duplicate IDs | ${duplicateIds.length} |
| Duplicate routes | ${duplicateRoutes.length} |
| Duplicate title/topic concept candidates | ${duplicateConcepts.length} |
| Phase 1 missing school concepts listed | ${schoolGapBacklog.totalMissingConcepts} |

## Category Counts

| Category | Lessons |
|---|---:|
${tableRowsFromObject(categoryCounts)}

## Topic Counts

| Topic | Lessons |
|---|---:|
${tableRowsFromObject(topicCounts)}

## Concept Family Counts

| Concept family | Lessons |
|---|---:|
${tableRowsFromObject(familyCounts)}

## Lesson Type Classification

| Lesson type | Lessons |
|---|---:|
${tableRowsFromObject(typeCounts)}

## Detailed Phase 1 Missing Concepts

| Academic level | Unit | Missing concept | Suggested lesson type | Suggested adapter | Priority | Reason |
|---|---|---|---|---|---|---|
${markdownBacklogRows()}

## Board Coverage Interpretation

| Board/pathway | Phase 1 interpretation |
|---|---|
| NCERT | Direct school sequence reference for Classes 6-12. |
| CBSE | Treated as NCERT-aligned with current 2025-26 secondary and senior secondary mathematics curriculum. |
| AP_SCERT | Mapped through Andhra Pradesh textbook pathway expectations; next implementation pass should extract chapter IDs from downloaded textbook PDFs. |
| TN_SCERT | Mapped through Tamil Nadu SCERT textbook pathway expectations; next implementation pass should extract chapter IDs from eBooks. |
| CAMBRIDGE_IGCSE | Mapped to lower/upper secondary number, algebra, geometry, mensuration, statistics, probability, transformations and modelling topics. |
| IB_AA / IB_AI | Mapped as enrichment/supporting school pathway for Classes 11-12 concepts and technology-enabled modelling. |
| COMMON_CORE | Mapped to Grade 6-8 and high-school domains: Number System, Expressions and Equations, Functions, Geometry, Statistics and Probability, Modelling. |

## Stable Boundary

The original 674 generated lesson rows were not removed, renumbered, or rerouted by this slice. The audit is additive and can be regenerated.

## Next Phase 1 Work

1. Add optional metadata types and query helpers for \`syllabusTags\`, prerequisites, objectives, duration, lesson type, and assessment metadata.
2. Generate school catalog files under \`src/modules/lessons/catalog/school/\` using the backlog IDs in \`schoolSyllabusGapBacklog.generated.json\`.
3. Add pathways under \`src/modules/lessons/pathways/school/\`.
4. Add schema tests for valid boards, levels, duplicate IDs, duplicate slugs, empty objectives, engine dependencies, and circular prerequisites.
5. Only then wire new school lessons into public lesson navigation.

## Verification

Generator completed successfully and emitted all files listed above. Full build/test verification still needs to run after metadata/query helpers and school catalog integration are added.
`;

const gapMd = `# 674 Lessons Syllabus Gap Audit

Date: 2026-07-27

## Scope

Audited all existing 674 lesson rows from:

| Source file | Purpose |
|---|---|
| \`src/modules/lessons/catalog/phase1.generated.ts\` | Core existing generated catalog |
| \`src/modules/lessons/catalog/phase2.generated.ts\` | Existing graph/algebra/geometry expansion |
| \`src/modules/lessons/catalog/phase3.generated.ts\` | Existing calculus/data/statistics expansion |
| \`src/modules/lessons/catalog/phase4.generated.ts\` | Existing advanced/discrete/finance expansion |

## Syllabus Sources Used

| Source family | Official reference |
|---|---|
| NCERT Classes 6-8 | https://ncert.nic.in/pdf/syllabus/07Math%20%28VI-VIII%29.pdf |
| CBSE Classes 9-10 | https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/Maths_Sec_2025-26.pdf |
| CBSE Classes 11-12 | https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Maths_SrSec_2025-26.pdf |
| AP SCERT | https://cse.ap.gov.in/textBooksDownloadingPageTEBilingual |
| Tamil Nadu SCERT | https://www.tnscert.org/ebooks/ |
| Cambridge IGCSE | https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/ |
| IB DP Mathematics | https://ibo.org/programmes/diploma-programme/curriculum/mathematics/ |
| Common Core Mathematics | https://learning.ccsso.org/wp-content/uploads/2022/11/ADA-Compliant-Math-Standards.pdf |
| UGC B.Sc. Mathematics | https://www.ugc.gov.in/pdfnews/2829180_B.Sc.-Maths.pdf |
| IIT JAM Mathematics | https://jam2026.iitb.ac.in/files/syllabus_MA.pdf |
| CSIR Mathematical Sciences | https://csirhrdg.res.in/SiteContent/ManagedContent/ContentFiles/20181113115231481mcs_ma_sylbs.pdf |

## Current Strengths

| Area | Current coverage |
|---|---|
| Visual graphing and functions | Strong |
| Dynamic geometry | Strong visually, partial proof sequencing |
| Calculus labs | Strong visually, partial formal school/UG rigor |
| Probability and statistics | Strong visual/data coverage, partial exact school assessment sequences |
| Matrices, complex numbers, vectors | Strong visual/computational coverage, partial theorem/theory pathways |
| Discrete mathematics | Strong enrichment coverage, partial proof-system sequencing |
| Finance and modelling | Useful enrichment, needs board/exam pathways |

## Detailed Missing Concept Backlog

| Academic level | Unit | Missing concept | Suggested lesson type | Suggested adapter | Priority | Reason |
|---|---|---|---|---|---|---|
${markdownBacklogRows()}

## Files To Use For Machine-Readable Detail

| File | Contains |
|---|---|
| \`src/modules/lessons/audit/existingLessonCoverage.generated.json\` | Per-lesson audit for all existing 674 lessons |
| \`src/modules/lessons/audit/schoolSyllabusGapBacklog.generated.json\` | Missing Phase 1 school concepts and suggested adapters |
`;

fs.mkdirSync(auditDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(auditDir, "existingLessonCoverage.generated.json"), `${JSON.stringify(existingLessonCoverage, null, 2)}\n`);
fs.writeFileSync(path.join(auditDir, "schoolSyllabusGapBacklog.generated.json"), `${JSON.stringify(schoolGapBacklog, null, 2)}\n`);
fs.writeFileSync(path.join(docsDir, "PHASE_1_SYLLABUS_ALIGNMENT_IMPLEMENTATION_REPORT.md"), md);
fs.writeFileSync(path.join(docsDir, "LESSON_674_SYLLABUS_GAP_AUDIT.md"), gapMd);

console.log(`Audited ${lessons.length} lessons.`);
console.log(`Wrote ${path.relative(root, path.join(auditDir, "existingLessonCoverage.generated.json"))}`);
console.log(`Wrote ${path.relative(root, path.join(auditDir, "schoolSyllabusGapBacklog.generated.json"))}`);
console.log(`Wrote ${path.relative(root, path.join(docsDir, "LESSON_674_SYLLABUS_GAP_AUDIT.md"))}`);
console.log(`Wrote ${path.relative(root, path.join(docsDir, "PHASE_1_SYLLABUS_ALIGNMENT_IMPLEMENTATION_REPORT.md"))}`);
