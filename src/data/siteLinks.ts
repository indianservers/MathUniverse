import { advancedSyllabusLabs } from "./advancedSyllabusLabs";
import { ANVESHAK_STATISTICS_URL } from "./externalLinks";
import { geometryConcepts } from "./geometryConcepts";
import { ncertConcepts, ncertRoute } from "./ncertConcepts";
import { allNavigatorCards } from "./syllabusNavigator";
import { topics } from "./topics";
import { trigonometryConcepts } from "./trigonometryConcepts";

export type SiteLink = {
  title: string;
  path: string;
  description: string;
  category: string;
  keywords: string[];
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
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    title: "Math Workspace",
    path: "/workspace",
    description: "A working area for exploring expressions, graphs, formulas, and mathematical reasoning.",
    category: "Tools",
    keywords: ["math workspace", "graphs", "formulas", "interactive calculator"],
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
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    title: "Sitemap",
    path: "/sitemap",
    description: "Search-engine friendly sitemap for Math Universe routes, modules, concept pages, and learning tools.",
    category: "Reference",
    keywords: ["math universe sitemap", "site map", "search engine routes"],
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
    title: "Statistics with Anveshak",
    path: ANVESHAK_STATISTICS_URL,
    description: "Open the dedicated Anveshak statistics app for distributions, variation, regression, probability, and uncertainty.",
    category: "External",
    keywords: ["statistics", "probability", "Anveshak", "data visualization"],
    isExternal: true,
    priority: 0.4,
    changeFrequency: "monthly",
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
    priority: 0.9,
    changeFrequency: "weekly",
  }));

const geometryLinks: SiteLink[] = geometryConcepts.map((concept) => ({
  title: concept.title,
  path: `/geometry/${concept.id}`,
  description: concept.summary,
  category: `Geometry: ${concept.category}`,
  keywords: ["geometry", concept.category, concept.title, concept.formula, concept.use],
  priority: 0.68,
  changeFrequency: "monthly",
}));

const trigonometryLinks: SiteLink[] = trigonometryConcepts.map((concept) => ({
  title: concept.title,
  path: `/trigonometry/${concept.id}`,
  description: concept.summary,
  category: `Trigonometry: ${concept.category}`,
  keywords: ["trigonometry", concept.category, concept.title, concept.formula, concept.use],
  priority: 0.68,
  changeFrequency: "monthly",
}));

const ncertLinks: SiteLink[] = ncertConcepts.map((concept) => ({
  title: `${concept.classLevel}: ${concept.title}`,
  path: ncertRoute(concept.id),
  description: concept.summary,
  category: `NCERT ${concept.classLevel}`,
  keywords: ["NCERT math", concept.classLevel, concept.unit, concept.title, concept.formula],
  priority: 0.62,
  changeFrequency: "monthly",
}));

const advancedLabLinks: SiteLink[] = advancedSyllabusLabs.map((lab) => ({
  title: lab.title,
  path: `/syllabus-lab/${lab.id}`,
  description: lab.summary,
  category: `Advanced Lab: ${lab.category}`,
  keywords: ["advanced mathematics", lab.category, lab.subcategory, lab.title, lab.formula],
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
    priority: card.status === "Available" ? 0.66 : 0.46,
    changeFrequency: "monthly",
  }));

export const siteLinks: SiteLink[] = [
  ...baseLinks,
  ...topicLinks,
  ...visualizationLinks,
  ...geometryLinks,
  ...trigonometryLinks,
  ...ncertLinks,
  ...advancedLabLinks,
];

export const internalSiteLinks = siteLinks.filter((link) => !link.isExternal);

export function findSiteLink(pathname: string) {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return siteLinks.find((link) => link.path === normalized);
}
