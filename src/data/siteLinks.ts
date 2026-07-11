import { advancedSyllabusLabs } from "./advancedSyllabusLabs";
import { formulaCategories } from "./formulaLibrary";
import { mathLabTools } from "./mathLabTools";
import { geometryConcepts } from "./geometryConcepts";
import { ncertConcepts, ncertRoute } from "./ncertConcepts";
import { getNCERTConceptResourceLinks } from "./ncertResourceLinks";
import { allNavigatorCards } from "./syllabusNavigator";
import { theoremCategories } from "./theoremLibrary";
import { topics } from "./topics";
import { trigonometryConcepts } from "./trigonometryConcepts";
import { formulaVisualizerConfigs } from "./formulaVisualizerRoutes";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

export type SiteLink = {
  title: string;
  path: string;
  description: string;
  category: string;
  keywords: string[];
  details?: string[];
  isExternal?: boolean;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

const baseLinks: SiteLink[] = [
  {
    title: "Math Universe",
    path: "/",
    description: "Interactive mathematics visualizations for algebra, geometry, trigonometry, calculus, complex numbers, linear algebra, AI applications, quizzes, and learning paths.",
    category: "Core",
    keywords: ["math universe", "interactive math", "math visualizations", "learning app"],
    details: ["Main dashboard", "Topic navigation", "Visual learning entry point"],
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    title: "NCERT Dashboard",
    path: "/ncert",
    description: "Class 7, Class 10, and Class 12 NCERT visual labs with formula, theorem, visual proof, practice, and QA badges.",
    category: "NCERT",
    keywords: ["NCERT", "class 7", "class 10", "class 12", "board exam", "textbook", "visual learning", "practice", "formula", "theorem"],
    details: ["Grade 7", "Class 10", "Class 12", "Coverage dashboard", "Concept route index"],
    priority: 0.88,
    changeFrequency: "weekly",
  },
  {
    title: "Math Workspace",
    path: "/workspace",
    description: "A working area for exploring expressions, graphs, formulas, and mathematical reasoning.",
    category: "Tools",
    keywords: ["math workspace", "graphs", "formulas", "interactive calculator"],
    details: ["Graphing workspace", "CAS-style commands", "Geometry construction", "3D exploration"],
    priority: 0.86,
    changeFrequency: "monthly",
  },
  {
    title: "2D and 3D Shapes",
    path: "/shapes",
    description: "Explore two-dimensional and three-dimensional shapes with visual geometry tools.",
    category: "Geometry",
    keywords: ["2D shapes", "3D shapes", "geometry explorer", "mensuration"],
    priority: 0.78,
    changeFrequency: "monthly",
  },
  {
    title: "Circle to Triangle Visualization",
    path: "/circle-to-triangle",
    description: "Animate a 180 degree circular line as it unfolds into a straight line for the first step of a circle-to-triangle geometry visualization.",
    category: "Geometry",
    keywords: ["circle to triangle", "semicircle", "arc to line", "180 degree arc", "geometry animation"],
    details: ["180 degree circular line", "Animated straightening", "Geometry motion"],
    priority: 0.76,
    changeFrequency: "monthly",
  },
  {
    title: "Permutations and Combinations",
    path: "/math/permutations-combinations",
    description: "Build ordered arrangements and unordered selections with live nPr, nCr, factorial, tree, and group visualizations.",
    category: "Algebra",
    keywords: ["permutations", "combinations", "nPr", "nCr", "factorial", "counting", "arrangements", "selections"],
    details: ["Order matters lab", "Combination groups", "Arrangement tree", "Guided activity"],
    priority: 0.82,
    changeFrequency: "monthly",
  },
  {
    title: "Learning Hub",
    path: "/learn",
    description: "Structured learning resources, concept cards, and guided pathways for visual mathematics.",
    category: "Learning",
    keywords: ["math learning hub", "math concepts", "visual learning", "study path"],
    priority: 0.82,
    changeFrequency: "weekly",
  },
  {
    title: "Syllabus",
    path: "/syllabus",
    description: "Navigate school and advanced mathematics syllabus topics with interactive labs and concept coverage.",
    category: "Learning",
    keywords: ["math syllabus", "NCERT math", "advanced mathematics", "course roadmap"],
    details: ["B.Sc Mathematics navigator", "B.Tech CSE Mathematics navigator", "Priority visualization cards", "Advanced lab index"],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    title: "Scientific Calculator",
    path: "/calculator",
    description: "Use a browser-based scientific calculator for expressions, functions, constants, and quick computations.",
    category: "Tools",
    keywords: ["scientific calculator", "math calculator", "functions", "expressions"],
    priority: 0.72,
    changeFrequency: "monthly",
  },
  {
    title: "Quiz Zone",
    path: "/quiz",
    description: "Practice mathematics concepts with quizzes, feedback, and local progress tracking.",
    category: "Practice",
    keywords: ["math quiz", "practice questions", "concept check", "math revision"],
    priority: 0.72,
    changeFrequency: "weekly",
  },
  {
    title: "Documentation",
    path: "/documentation",
    description: "Complete Math Universe documentation with all internal module links, concept links, and learning details.",
    category: "Reference",
    keywords: ["math universe documentation", "module links", "concept index", "site guide"],
    details: ["Human-readable route index", "Module descriptions", "Keywords", "Crawl hints"],
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    title: "Sitemap",
    path: "/sitemap",
    description: "Search-engine friendly sitemap for Math Universe routes, modules, concept pages, and learning tools.",
    category: "Reference",
    keywords: ["math universe sitemap", "site map", "search engine routes"],
    details: ["Internal URL index", "Route priorities", "Change frequency", "Search engine crawl support"],
    priority: 0.66,
    changeFrequency: "weekly",
  },
  {
    title: "About Math Universe",
    path: "/about",
    description: "Learn about the purpose, coverage, and technology behind Math Universe.",
    category: "Reference",
    keywords: ["about math universe", "visual mathematics", "math education"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  {
    title: "AR Math Lab",
    path: "/modules/ar-math-lab",
    description: "Augmented reality, camera preview, WebXR-ready 3D graphing, geometry solids, coordinates, measurements, and AR math practice.",
    category: "3D / AR / XR",
    keywords: ["AR Math Lab", "augmented reality", "mixed reality", "XR", "WebXR", "camera math", "3D graphs", "solids", "measurement"],
    details: ["Camera preview", "3D graph overlay", "WebXR support", "Geometry solids", "AR practice"],
    priority: 0.84,
    changeFrequency: "weekly",
  },
  {
    title: "Statistics and Probability",
    path: "/probability-statistics",
    description: "Explore native distributions, variation, regression, probability, and uncertainty labs.",
    category: "Modules",
    keywords: ["statistics", "probability", "data visualization", "regression"],
    priority: 0.78,
    changeFrequency: "weekly",
  },
];

const topicLinks: SiteLink[] = topics
  .filter((topic) => !topic.isExternal)
  .map((topic) => ({
    title: topic.title,
    path: topic.route,
    description: topic.description,
    category: "Modules",
    keywords: [topic.id, topic.title, ...topic.concepts],
    details: topic.concepts,
    priority: 0.9,
    changeFrequency: "weekly",
  }));

const geometryLinks: SiteLink[] = geometryConcepts.map((concept) => ({
  title: concept.title,
  path: `/geometry/${concept.id}`,
  description: concept.summary,
  category: `Geometry: ${concept.category}`,
  keywords: ["geometry", concept.category, concept.title, concept.formula, concept.use],
  details: [concept.category, concept.formula, concept.use],
  priority: 0.68,
  changeFrequency: "monthly",
}));

const trigonometryLinks: SiteLink[] = trigonometryConcepts.map((concept) => ({
  title: concept.title,
  path: `/trigonometry/${concept.id}`,
  description: concept.summary,
  category: `Trigonometry: ${concept.category}`,
  keywords: ["trigonometry", concept.category, concept.title, concept.formula, concept.use],
  details: [concept.category, concept.formula, concept.use],
  priority: 0.68,
  changeFrequency: "monthly",
}));

const ncertLinks: SiteLink[] = ncertConcepts.map((concept) => {
  const resources = getNCERTConceptResourceLinks(concept);
  return {
    title: `${concept.classLevel}: ${concept.title}`,
    path: ncertRoute(concept.id),
    description: concept.summary,
    category: `NCERT ${concept.classLevel}`,
    keywords: [
      "NCERT math",
      "textbook",
      "visual lab",
      "practice",
      "formula",
      "theorem",
      "board exam",
      concept.classLevel,
      concept.unit,
      concept.title,
      concept.formula,
      concept.visual,
      ...concept.outcomes,
      ...concept.tasks,
      ...resources.flatMap((resource) => [resource.label, resource.href, resource.type, resource.exactness, ...(resource.keywords ?? [])]),
    ],
    details: [concept.classLevel, concept.unit, concept.formula, ...concept.outcomes, ...resources.map((resource) => `${resource.exactness}: ${resource.label}`)],
    priority: ["Class 7", "Class 10", "Class 12"].includes(concept.classLevel) ? 0.72 : 0.62,
    changeFrequency: "monthly" as const,
  };
});

const mathLabToolLinks: SiteLink[] = mathLabTools.map((tool) => ({
  title: tool.title,
  path: tool.route,
  description: tool.description,
  category: "Math Lab",
  keywords: ["math lab", tool.title, tool.difficulty, ...tool.useCases],
  details: [tool.difficulty, ...tool.useCases],
  priority: 0.7,
  changeFrequency: "monthly",
}));

const formulaLinks: SiteLink[] = formulaCategories.map((category) => ({
  title: `${category.title} Formulas`,
  path: `/formulas/${category.id}`,
  description: category.description,
  category: "Formula Library",
  keywords: ["formula", "formula library", category.title, category.id, ...category.formulas.flatMap((formula) => [formula.title, formula.formula])],
  details: category.formulas.slice(0, 12).map((formula) => formula.title),
  priority: 0.64,
  changeFrequency: "monthly",
}));

const formulaVisualizerLinks: SiteLink[] = [
  {
    title: "Visual Formulas",
    path: "/visual-formulas",
    description: "Interactive visual formula labs for trigonometry, algebra, geometry, coordinate geometry, calculus, matrices, vectors, probability, statistics, and mensuration.",
    category: "Formula Visualizers",
    keywords: ["visual formulas", "formula visualizer", "interactive formulas", "formula lab", ...formulaVisualizerConfigs.flatMap((config) => [config.title, config.shortTitle, config.route, ...config.searchTerms])],
    details: formulaVisualizerConfigs.map((config) => config.title),
    priority: 0.76,
    changeFrequency: "weekly",
  },
  ...formulaVisualizerConfigs.map((config) => ({
    title: config.title,
    path: config.route,
    description: config.description,
    category: "Formula Visualizers",
    keywords: ["formula visualizer", "visual formula", config.category, config.title, config.shortTitle, ...config.searchTerms, ...config.formulas.flatMap((formula) => [formula.title, formula.plainText, ...formula.tags])],
    details: [config.subtitle, ...config.formulas.slice(0, 10).map((formula) => formula.title)],
    priority: 0.72,
    changeFrequency: "weekly" as const,
  })),
];

const theoremLinks: SiteLink[] = theoremCategories.flatMap((category) => [
  {
    title: `${category.title} Theorems`,
    path: `/theorems/${category.id}`,
    description: category.description,
    category: "Theorem Library",
    keywords: ["theorem", "proof", category.title, category.id, ...category.theorems.map((theorem) => theorem.title)],
    details: category.theorems.slice(0, 12).map((theorem) => theorem.title),
    priority: 0.64,
    changeFrequency: "monthly" as const,
  },
  ...category.theorems.map((theorem) => ({
    title: theorem.title,
    path: `/theorems/${category.id}/${theorem.slug}`,
    description: theorem.statement,
    category: `Theorem: ${category.title}`,
    keywords: ["theorem", "proof", category.title, theorem.title, theorem.subtopic, theorem.statement, ...theorem.prerequisites],
    details: [theorem.subtopic, theorem.statement],
    priority: 0.54,
    changeFrequency: "monthly" as const,
  })),
]);

const visualProofLinks: SiteLink[] = visualProofsIndex.map((proof) => ({
  title: proof.title,
  path: proof.route,
  description: proof.shortDescription,
  category: `Visual Proof: ${proof.categorySlug}`,
  keywords: ["visual proof", "proof", proof.categorySlug, proof.title, proof.difficulty, ...proof.tags, ...proof.prerequisites, ...proof.learningOutcomes],
  details: [proof.categorySlug, proof.difficulty, proof.estimatedTime, ...proof.learningOutcomes],
  priority: proof.status === "available" ? 0.62 : 0.42,
  changeFrequency: "monthly" as const,
}));

const advancedLabLinks: SiteLink[] = advancedSyllabusLabs.map((lab) => ({
  title: lab.title,
  path: `/syllabus-lab/${lab.id}`,
  description: lab.summary,
  category: `Advanced Lab: ${lab.category}`,
  keywords: ["advanced mathematics", lab.category, lab.subcategory, lab.title, lab.formula],
  details: [lab.category, lab.subcategory, lab.formula, ...lab.tasks],
  priority: 0.58,
  changeFrequency: "monthly",
}));

const visualizationLinks: SiteLink[] = Array.from(new Map(allNavigatorCards
  .filter((card) => card.route.startsWith("/math/"))
  .map((card) => [card.route, card])).values()).map((card) => ({
    title: card.title,
    path: card.route,
    description: card.description,
    category: `Visualization: ${card.category}`,
    keywords: ["math visualization", card.category, card.status, card.title, ...card.topics],
    details: [card.status, card.category, ...card.topics],
    priority: card.status === "Available" ? 0.66 : 0.46,
    changeFrequency: "monthly",
  }));

export const siteLinks: SiteLink[] = [
  ...baseLinks,
  ...topicLinks,
  ...mathLabToolLinks,
  ...visualizationLinks,
  ...geometryLinks,
  ...trigonometryLinks,
  ...ncertLinks,
  ...formulaLinks,
  ...formulaVisualizerLinks,
  ...theoremLinks,
  ...visualProofLinks,
  ...advancedLabLinks,
];

export const internalSiteLinks = siteLinks.filter((link) => !link.isExternal);

export function findSiteLink(pathname: string) {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return siteLinks.find((link) => link.path === normalized);
}
