import { advancedConceptLessons, type AdvancedConceptLesson } from "./catalog/advanced/advancedConceptLessons";
import { lessonCatalog } from "./catalog/lessonCatalog";
import { schoolLessonCatalog } from "./catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "./syllabus/lessonSyllabusTypes";
import type { LessonDefinition } from "./types";

export type LearningLessonRef =
  | { kind: "interactive"; title: string; route: string; topic: string; level: string; summary: string; minutes: number }
  | { kind: "school"; title: string; route: string; topic: string; level: string; summary: string; minutes: number }
  | { kind: "advanced"; title: string; route: string; topic: string; level: string; summary: string; minutes: number };

export type LearningSubtopic = {
  slug: string;
  title: string;
  description: string;
  accent: string;
  classRange: string;
  lessons: LearningLessonRef[];
};

export type LearningTopic = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  prompt: string;
  accent: string;
  categories: string[];
  schoolFamilies: string[];
  advancedStrands: string[];
  subtopics: LearningSubtopic[];
};

type TopicSeed = Omit<LearningTopic, "subtopics"> & {
  subtopics: Array<Omit<LearningSubtopic, "lessons"> & { match: string[] }>;
};

const topicSeeds: TopicSeed[] = [
  {
    slug: "numbers-and-arithmetic",
    title: "Numbers and Arithmetic",
    shortTitle: "Arithmetic",
    description: "Build number sense, ratios, powers, estimation, and proportional reasoning from visual models.",
    prompt: "What changes when a number is decomposed, scaled, or compared?",
    accent: "cyan",
    categories: ["Numbers and Arithmetic", "Calculator and Arithmetic"],
    schoolFamilies: ["Number Systems", "Rational Numbers", "Fractions", "Decimals", "Percentages", "Ratio and Proportion"],
    advancedStrands: [],
    subtopics: [
      { slug: "number-systems", title: "Number Systems", description: "Place values, integers, rationals, irrationals, and real numbers.", accent: "cyan", classRange: "Classes 6-10", match: ["number system", "integer", "rational", "real number"] },
      { slug: "ratio-and-proportion", title: "Ratio and Proportion", description: "Scale quantities and compare rates with linked diagrams.", accent: "emerald", classRange: "Classes 6-9", match: ["ratio", "proportion", "percentage", "percent"] },
      { slug: "powers-and-roots", title: "Powers and Roots", description: "Connect repeated multiplication, roots, and exponent rules.", accent: "amber", classRange: "Classes 8-10", match: ["power", "root", "exponent", "surds"] },
    ],
  },
  {
    slug: "algebra",
    title: "Algebra",
    shortTitle: "Algebra",
    description: "Solve, transform, factor, and reason with symbolic structures that stay connected to graphs.",
    prompt: "How does changing a symbol move the entire structure?",
    accent: "blue",
    categories: ["Algebra", "Symbolic Mathematics"],
    schoolFamilies: ["Algebra", "Polynomials", "Linear Equations", "Quadratic Equations", "Sequences and Series"],
    advancedStrands: [],
    subtopics: [
      { slug: "expressions-and-identities", title: "Expressions and Identities", description: "Expand, factor, simplify, and compare equivalent forms.", accent: "blue", classRange: "Classes 7-10", match: ["expression", "identity", "factor", "expand"] },
      { slug: "linear-equations", title: "Linear Equations", description: "Model unknowns with balances, tables, and straight-line graphs.", accent: "cyan", classRange: "Classes 7-10", match: ["linear equation", "simultaneous", "system"] },
      { slug: "quadratic-equations", title: "Quadratic Equations", description: "Use roots, vertex, factors, and discriminants as one visual story.", accent: "violet", classRange: "Classes 9-11", match: ["quadratic", "parabola", "discriminant"] },
    ],
  },
  {
    slug: "functions-and-graphs",
    title: "Functions and Graphs",
    shortTitle: "Functions",
    description: "Understand how maps, tables, equations, and curves describe change together.",
    prompt: "What does the graph know that the equation is hiding?",
    accent: "violet",
    categories: ["Graphs and Functions"],
    schoolFamilies: ["Functions and Graphs", "Relations and Functions"],
    advancedStrands: [],
    subtopics: [
      { slug: "relations-and-functions", title: "Relations and Functions", description: "Identify functions, mappings, domains, ranges, and inverse links.", accent: "violet", classRange: "Classes 8-11", match: ["relation", "function", "domain", "range", "mapping"] },
      { slug: "linear-functions", title: "Linear Functions", description: "Read slope, intercept, rate of change, and line families.", accent: "blue", classRange: "Classes 8-10", match: ["linear function", "slope", "intercept"] },
      { slug: "quadratic-functions", title: "Quadratic Functions", description: "Explore parabolas, roots, vertex form, and transformations.", accent: "fuchsia", classRange: "Classes 9-11", match: ["quadratic", "parabola", "vertex"] },
      { slug: "exponential-functions", title: "Exponential Functions", description: "Compare repeated growth, decay, asymptotes, and compounding.", accent: "amber", classRange: "Classes 9-12", match: ["exponential", "growth", "decay", "compound"] },
      { slug: "transformations-of-functions", title: "Transformations of Functions", description: "Shift, stretch, reflect, and compose graphs with equations.", accent: "emerald", classRange: "Classes 9-12", match: ["transformation", "shift", "stretch", "reflect"] },
    ],
  },
  {
    slug: "geometry",
    title: "Geometry",
    shortTitle: "Geometry",
    description: "Turn shapes, constructions, theorems, area, and coordinate geometry into manipulable evidence.",
    prompt: "Which measurement stays invariant while the figure moves?",
    accent: "teal",
    categories: ["Geometry"],
    schoolFamilies: ["Geometry", "Coordinate Geometry", "Mensuration", "Triangles", "Circles", "Quadrilaterals"],
    advancedStrands: [],
    subtopics: [
      { slug: "shapes-and-constructions", title: "Shapes and Constructions", description: "Construct and classify figures with dynamic measurements.", accent: "teal", classRange: "Classes 6-9", match: ["shape", "construction", "angle", "line"] },
      { slug: "triangles-and-circles", title: "Triangles and Circles", description: "Use diagrams to prove congruence, similarity, and circle facts.", accent: "emerald", classRange: "Classes 8-10", match: ["triangle", "circle", "similar", "congruent"] },
      { slug: "coordinate-geometry", title: "Coordinate Geometry", description: "Link algebraic coordinates to distance, slope, and loci.", accent: "blue", classRange: "Classes 9-11", match: ["coordinate", "distance", "locus"] },
    ],
  },
  {
    slug: "trigonometry",
    title: "Trigonometry",
    shortTitle: "Trigonometry",
    description: "Connect right triangles, unit circles, identities, and waves through motion.",
    prompt: "How does rotation become a graph?",
    accent: "orange",
    categories: ["Trigonometry"],
    schoolFamilies: ["Trigonometry", "Some Applications of Trigonometry"],
    advancedStrands: [],
    subtopics: [
      { slug: "ratios-and-triangles", title: "Ratios and Triangles", description: "See sine, cosine, and tangent as changing side ratios.", accent: "orange", classRange: "Classes 9-10", match: ["sine", "cosine", "tangent", "ratio"] },
      { slug: "identities", title: "Identities", description: "Prove equivalent forms using geometric and algebraic evidence.", accent: "amber", classRange: "Classes 10-11", match: ["identity", "formula"] },
      { slug: "waves-and-graphs", title: "Waves and Graphs", description: "Move from the unit circle into sinusoidal graphs.", accent: "violet", classRange: "Classes 10-12", match: ["wave", "period", "amplitude", "graph"] },
    ],
  },
  {
    slug: "calculus",
    title: "Calculus",
    shortTitle: "Calculus",
    description: "Make limits, derivatives, integrals, area, motion, and accumulation visible.",
    prompt: "What is the instant saying about the whole curve?",
    accent: "rose",
    categories: ["Calculus"],
    schoolFamilies: ["Calculus", "Limits and Derivatives", "Applications of Derivatives", "Integrals"],
    advancedStrands: ["Differential Equations", "Special Functions"],
    subtopics: [
      { slug: "limits-and-continuity", title: "Limits and Continuity", description: "Approach values from both sides and watch jumps appear.", accent: "rose", classRange: "Classes 11-12", match: ["limit", "continuity"] },
      { slug: "derivatives", title: "Derivatives", description: "Use tangent motion to see instantaneous rate of change.", accent: "orange", classRange: "Classes 11-12", match: ["derivative", "tangent", "rate"] },
      { slug: "integrals", title: "Integrals", description: "Build area and accumulation with adjustable partitions.", accent: "emerald", classRange: "Classes 11-12", match: ["integral", "area", "accumulation"] },
    ],
  },
  {
    slug: "statistics-and-probability",
    title: "Statistics and Probability",
    shortTitle: "Statistics",
    description: "Explore distributions, samples, inference, probability models, and uncertainty.",
    prompt: "How much should one sample change our belief?",
    accent: "sky",
    categories: ["Statistics", "Probability", "Data and Statistics"],
    schoolFamilies: ["Statistics", "Probability", "Data Handling"],
    advancedStrands: ["Statistical Inference"],
    subtopics: [
      { slug: "data-and-distributions", title: "Data and Distributions", description: "Summaries, plots, outliers, and distribution shape.", accent: "sky", classRange: "Classes 6-12", match: ["data", "distribution", "mean", "median", "outlier"] },
      { slug: "probability-models", title: "Probability Models", description: "Tree diagrams, simulations, events, and conditional chance.", accent: "cyan", classRange: "Classes 8-12", match: ["probability", "event", "conditional"] },
      { slug: "inference", title: "Inference", description: "Estimate, test, and reason from sample to population.", accent: "violet", classRange: "Advanced", match: ["inference", "sample", "confidence", "hypothesis"] },
    ],
  },
  {
    slug: "vectors-and-3d-mathematics",
    title: "Vectors and 3D Mathematics",
    shortTitle: "Vectors & 3D",
    description: "Navigate vectors, matrices, surfaces, solids, transformations, and spatial reasoning.",
    prompt: "What changes when mathematics leaves the plane?",
    accent: "indigo",
    categories: ["Vectors", "Matrices", "3D Geometry", "Linear Algebra"],
    schoolFamilies: ["Vectors", "Three Dimensional Geometry", "Matrices", "Determinants"],
    advancedStrands: [],
    subtopics: [
      { slug: "vectors", title: "Vectors", description: "Represent magnitude, direction, projections, and dot products.", accent: "indigo", classRange: "Classes 11-12", match: ["vector", "projection", "dot"] },
      { slug: "matrices-and-transformations", title: "Matrices and Transformations", description: "Watch matrices move vectors, grids, and coordinate frames.", accent: "blue", classRange: "Classes 11-12", match: ["matrix", "transformation", "eigen"] },
      { slug: "3d-geometry", title: "3D Geometry", description: "Inspect lines, planes, surfaces, solids, and cross-sections.", accent: "violet", classRange: "Classes 11-12", match: ["3d", "surface", "solid", "plane"] },
    ],
  },
  {
    slug: "discrete-and-applied-mathematics",
    title: "Discrete and Applied Mathematics",
    shortTitle: "Discrete",
    description: "Model finite structures, graphs, logic, finance, algorithms, and applied systems.",
    prompt: "How do local rules create global structure?",
    accent: "lime",
    categories: ["Discrete Mathematics", "Finance", "Graph Theory", "Logic"],
    schoolFamilies: ["Mathematical Reasoning", "Linear Programming", "Sets"],
    advancedStrands: ["Famous Problems"],
    subtopics: [
      { slug: "sets-and-logic", title: "Sets and Logic", description: "Reason with membership, truth tables, predicates, and proofs.", accent: "lime", classRange: "Classes 11-12", match: ["set", "logic", "truth", "predicate"] },
      { slug: "graphs-and-combinatorics", title: "Graphs and Combinatorics", description: "Explore networks, counting, arrangements, and finite systems.", accent: "emerald", classRange: "Advanced", match: ["graph", "combinatorics", "permutation", "combination"] },
      { slug: "financial-models", title: "Financial Models", description: "Study interest, annuities, amortization, risk, and optimization.", accent: "amber", classRange: "Applied", match: ["finance", "interest", "annuity", "amortization"] },
    ],
  },
  {
    slug: "advanced-mathematics",
    title: "Advanced Mathematics",
    shortTitle: "Advanced",
    description: "Dive into proof-rich explorations, famous problems, continued fractions, and special functions.",
    prompt: "Which structure survives when the examples get difficult?",
    accent: "slate",
    categories: ["Advanced Mathematics", "Complex Numbers", "Sequences"],
    schoolFamilies: ["Complex Numbers", "Sequences and Series", "Mathematical Induction"],
    advancedStrands: ["Continued Fractions", "Famous Problems", "Differential Equations", "Special Functions", "Statistical Inference"],
    subtopics: [
      { slug: "continued-fractions", title: "Continued Fractions", description: "Build best rational approximations from nested reciprocals.", accent: "slate", classRange: "Advanced", match: ["continued fraction", "convergent"] },
      { slug: "famous-problems", title: "Famous Problems", description: "Use visual tools to enter historically important problems.", accent: "rose", classRange: "Advanced", match: ["famous", "problem", "prime", "goldbach"] },
      { slug: "special-functions", title: "Special Functions", description: "Inspect gamma, beta, Bessel, and other advanced functions.", accent: "violet", classRange: "Advanced", match: ["special function", "gamma", "bessel"] },
    ],
  },
];

export function getLearningTopics(): LearningTopic[] {
  return topicSeeds.map((topic) => ({
    ...topic,
    subtopics: topic.subtopics.map((subtopic) => ({
      ...subtopic,
      lessons: findLessonsFor(topic, subtopic.match),
    })),
  }));
}

export function getLearningTopic(slug: string | undefined) {
  return getLearningTopics().find((topic) => topic.slug === slug) ?? null;
}

export function getFeaturedLesson() {
  const preferred = lessonCatalog.find((lesson) => lesson.categorySlug === "graphs-and-functions" && /domain and range/i.test(lesson.title));
  return preferred ? refFromInteractive(preferred) : getLearningTopic("functions-and-graphs")?.subtopics[0]?.lessons[0] ?? null;
}

export function getLessonTotals() {
  return {
    total: lessonCatalog.length + schoolLessonCatalog.length + advancedConceptLessons.length,
    interactive: lessonCatalog.length,
    school: schoolLessonCatalog.length,
    advanced: advancedConceptLessons.length,
  };
}

export function allLearningLessonRefs() {
  return [
    ...lessonCatalog.map(refFromInteractive),
    ...schoolLessonCatalog.map(refFromSchool),
    ...advancedConceptLessons.map(refFromAdvanced),
  ];
}

function findLessonsFor(topic: TopicSeed, matchTerms: string[]) {
  const matches = [
    ...lessonCatalog.filter((lesson) => topic.categories.includes(lesson.category) || topicMatches(lesson.topic, matchTerms) || topicMatches(lesson.title, matchTerms)).map(refFromInteractive),
    ...schoolLessonCatalog.filter((lesson) => topic.schoolFamilies.includes(lesson.metadata.conceptFamily) || topicMatches(lesson.title, matchTerms) || topicMatches(lesson.metadata.searchKeywords.join(" "), matchTerms)).map(refFromSchool),
    ...advancedConceptLessons.filter((lesson) => topic.advancedStrands.includes(lesson.strand) || topicMatches(lesson.title, matchTerms) || topicMatches(lesson.searchKeywords.join(" "), matchTerms)).map(refFromAdvanced),
  ];
  return dedupeByRoute(matches)
    .sort((a, b) => lessonMatchScore(b, matchTerms) - lessonMatchScore(a, matchTerms) || a.title.localeCompare(b.title))
    .slice(0, 18);
}

function topicMatches(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function dedupeByRoute(lessons: LearningLessonRef[]) {
  const seen = new Set<string>();
  return lessons.filter((lesson) => {
    if (seen.has(lesson.route)) return false;
    seen.add(lesson.route);
    return true;
  });
}

function lessonMatchScore(lesson: LearningLessonRef, terms: string[]) {
  const title = lesson.title.toLowerCase();
  const topic = lesson.topic.toLowerCase();
  const summary = lesson.summary.toLowerCase();
  let score = lesson.kind === "interactive" ? 24 : lesson.kind === "school" ? 8 : 0;
  for (const term of terms) {
    const normalized = term.toLowerCase();
    if (title.includes(normalized)) score += 18;
    if (topic.includes(normalized)) score += 9;
    if (summary.includes(normalized)) score += 4;
  }
  if (/domain|range|relation|mapping|function/i.test(lesson.title) && terms.some((term) => /domain|range|relation|mapping|function/i.test(term))) score += 10;
  if (lesson.kind === "interactive" && /^domain and range$/i.test(lesson.title)) score += 60;
  return score;
}

function refFromInteractive(lesson: LessonDefinition): LearningLessonRef {
  return {
    kind: "interactive",
    title: lesson.title,
    route: lesson.route,
    topic: lesson.topic,
    level: lesson.level,
    summary: lesson.purpose,
    minutes: 8,
  };
}

function refFromSchool(lesson: SchoolSyllabusLesson): LearningLessonRef {
  return {
    kind: "school",
    title: lesson.title,
    route: lesson.route,
    topic: lesson.metadata.conceptFamily,
    level: lesson.metadata.academicLevel.replace("_", " "),
    summary: lesson.content.summary,
    minutes: lesson.metadata.estimatedMinutes,
  };
}

function refFromAdvanced(lesson: AdvancedConceptLesson): LearningLessonRef {
  return {
    kind: "advanced",
    title: lesson.title,
    route: lesson.route,
    topic: lesson.strand,
    level: lesson.difficulty,
    summary: lesson.summary,
    minutes: lesson.estimatedMinutes,
  };
}
