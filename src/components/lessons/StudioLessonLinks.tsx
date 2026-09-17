import { ArrowUpRight, BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { advancedConceptLessons } from "../../modules/lessons/catalog/advanced/advancedConceptLessons";
import { lessonCatalog } from "../../modules/lessons/catalog/lessonCatalog";
import { schoolLessonCatalog } from "../../modules/lessons/catalog/school/schoolSyllabusCatalog";
import type { LessonDefinition } from "../../modules/lessons/types";

const totalLessonCount = lessonCatalog.length + schoolLessonCatalog.length + advancedConceptLessons.length;

type StudioConfig = { name: string; description: string; terms: string[]; exclude?: string[]; pinRoutes?: string[]; maxVisible?: number };
const studioConfigs: Record<string, StudioConfig> = {
  all: { name: "Math Universe", description: "Jump from any interactive studio into a connected lesson, school pathway, or advanced concept.", terms: [""] },
  algebra: { name: "Algebra Studio", description: "Expressions, equations, functions, polynomials, systems, and sequences.", terms: ["algebra", "expression", "equation", "polynomial", "quadratic", "sequence", "exponent", "logarithm"] },
  calculus: { name: "Calculus Studio", description: "Limits, derivatives, integrals, motion, series, and differential equations.", terms: ["calculus", "limit", "derivative", "integral", "differential", "series", "continuity", "tangent"] },
  geometry: { name: "Geometry Studio", description: "Shapes, constructions, triangles, circles, measurement, and coordinates.", terms: ["geometry", "triangle", "circle", "shape", "construction", "coordinate", "angle", "mensuration"] },
  trigonometry: { name: "Trigonometry Studio", description: "Ratios, identities, triangles, unit-circle motion, and waves.", terms: ["trigonometry", "sine", "cosine", "tangent", "triangle", "identity", "wave"] },
  statistics: { name: "Probability & Statistics Studio", description: "Data, distributions, probability, sampling, and inference.", terms: ["statistics", "probability", "data", "distribution", "sampling", "inference", "regression", "bayesian"] },
  vectors: { name: "Vectors & 3D Studio", description: "Vectors, matrices, transformations, planes, and three-dimensional geometry.", terms: ["vector", "matrix", "matrices", "linear algebra", "three dimensional", "3d", "determinant", "plane"] },
  sets: { name: "Set Theory & Relations Studio", description: "Sets, relations, functions, logic, and finite structures.", terms: ["set", "relation", "function", "logic", "discrete", "mapping", "proof"] },
  numbers: {
    name: "Number Systems Studio",
    description: "Integers, rationals, real numbers, surds, and decimal expansion.",
    terms: ["rational number", "irrational", "real number", "number system", "natural number", "whole number", "integer", "surd", "decimal expansion", "place value", "hcf", "gcd", "lcm", "prime factor", "terminating"],
    exclude: ["complex", "calculus", "integral", "derivative", "type i", "type ii", "newton", "box plot", "regression", "partial fraction", "power series", "power of a test"],
    pinRoutes: [
      "/lessons/numbers-and-arithmetic/60-rational-numbers",
      "/lessons/numbers-and-arithmetic/61-irrational-numbers",
      "/lessons/numbers-and-arithmetic/62-real-numbers",
    ],
    maxVisible: 12,
  },
  discrete: { name: "Discrete Mathematics Studio", description: "Combinatorics, graph theory, logic, algorithms, and applied mathematics.", terms: ["discrete", "combinatorics", "permutation", "combination", "graph theory", "logic", "set", "algorithm"] },
  complex: { name: "Complex Numbers Studio", description: "Complex-plane geometry, polar form, roots, and transformations.", terms: ["complex", "imaginary", "polar", "root", "number"] },
};

export function configForPath(pathname: string) {
  if (pathname === "/math-lab" || pathname.startsWith("/workspace") || pathname.startsWith("/engineering-math")) return studioConfigs.all;
  if (pathname.startsWith("/math-lab/continued-fractions") || pathname.startsWith("/math-lab/famous-problems")) return studioConfigs.discrete;
  if (pathname.startsWith("/math-lab/differential-equations") || pathname.startsWith("/math-lab/special-functions")) return studioConfigs.calculus;
  if (pathname.startsWith("/math-lab/graphing-calculator") || pathname.startsWith("/math-lab/function-explorer") || pathname.startsWith("/math-lab/conics")) return studioConfigs.algebra;
  if (pathname.startsWith("/math-lab/linear-algebra")) return studioConfigs.vectors;
  if (pathname.startsWith("/math-lab/cas-solver")) return studioConfigs.algebra;
  if (pathname.startsWith("/algebra")) return studioConfigs.algebra;
  if (pathname.startsWith("/calculus")) return studioConfigs.calculus;
  if (pathname.startsWith("/geometry") || pathname.startsWith("/shapes")) return studioConfigs.geometry;
  if (pathname.startsWith("/trigonometry")) return studioConfigs.trigonometry;
  if (pathname.startsWith("/statistics") || pathname.startsWith("/probability-statistics") || pathname.startsWith("/math-lab/probability") || pathname.startsWith("/math-lab/stats-inference")) return studioConfigs.statistics;
  if (pathname.startsWith("/linear-algebra") || pathname.startsWith("/matrices") || pathname.startsWith("/matrix-sandbox") || pathname.startsWith("/math-lab/3d-graphing")) return studioConfigs.vectors;
  if (pathname.startsWith("/set-theory")) return studioConfigs.sets;
  if (pathname.startsWith("/number-systems")) return studioConfigs.numbers;
  if (pathname.startsWith("/combinatorics") || pathname.startsWith("/graph-theory") || pathname.startsWith("/discrete-world") || pathname.startsWith("/mathematical-logic")) return studioConfigs.discrete;
  if (pathname.startsWith("/complex-numbers")) return studioConfigs.complex;
  return null;
}

type LessonLink = { key: string; title: string; route: string; track: string; description: string };
export type InternalLessonTaxonomy = {
  category: string;
  subcategory: string;
  tags: string[];
};

function words(...values: string[]) {
  return [...new Set(values.join(" ").toLowerCase().match(/[a-z0-9]+(?:[ -][a-z0-9]+)*/g) ?? [])];
}

export function taxonomyForInteractiveLesson(lesson: LessonDefinition): InternalLessonTaxonomy {
  return {
    category: lesson.categorySlug,
    subcategory: lesson.topic,
    tags: words(lesson.title, lesson.description, lesson.workspace, lesson.interactions, lesson.outcome, lesson.feature, lesson.mode),
  };
}

export function taxonomyForSchoolLesson(lesson: { title: string; metadata: { conceptFamily: string; searchKeywords: string[] } }): InternalLessonTaxonomy {
  return {
    category: lesson.metadata.conceptFamily,
    subcategory: lesson.metadata.conceptFamily,
    tags: words(lesson.title, lesson.metadata.conceptFamily, ...lesson.metadata.searchKeywords),
  };
}

export function taxonomyForAdvancedLesson(lesson: { title: string; strand: string; searchKeywords: string[] }): InternalLessonTaxonomy {
  return {
    category: lesson.strand,
    subcategory: lesson.strand,
    tags: words(lesson.title, lesson.strand, ...lesson.searchKeywords),
  };
}

function searchable(lesson: LessonDefinition) { return [lesson.title, lesson.topic, lesson.category, lesson.description, lesson.notes ?? ""].join(" "); }

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termForms(term: string) {
  const normalized = term.trim().toLowerCase();
  if (!normalized || normalized.includes(" ")) return [normalized];
  const forms = new Set([normalized]);
  if (normalized.endsWith("y")) forms.add(`${normalized.slice(0, -1)}ies`);
  else if (!normalized.endsWith("s")) forms.add(`${normalized}s`);
  return [...forms];
}

/** Match complete words so e.g. "set" does not match the word "discrete". */
export function matchesStudioTerm(text: string, term: string) {
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const normalizedTerm = term.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (!normalizedTerm) return false;
  return termForms(normalizedTerm).some((form) => new RegExp(`(?:^|\\s)${escapeRegExp(form)}(?:$|\\s)`, "i").test(normalizedText));
}

export function matchesStudioTerms(text: string, terms: string[]) {
  return terms.some((term) => matchesStudioTerm(text, term));
}

export function schoolStudioFor(lesson: { title: string; metadata: { conceptFamily: string; searchKeywords: string[] } }) {
  const text = [lesson.title, lesson.metadata.conceptFamily, ...lesson.metadata.searchKeywords].join(" ").toLowerCase();
  if (/calculus|limit|derivative|integral/.test(text)) return { label: "Calculus Studio", to: "/calculus" };
  if (/trigonometry|sine|cosine|tangent/.test(text)) return { label: "Trigonometry Studio", to: "/trigonometry" };
  if (/statistics|probability|data handling|sampling/.test(text)) return { label: "Probability & Statistics Studio", to: "/probability-statistics" };
  if (/vector|matrix|determinant|three dimensional/.test(text)) return { label: "Vectors & 3D Studio", to: "/linear-algebra" };
  if (/geometry|triangle|circle|mensuration|coordinate/.test(text)) return { label: "Geometry Studio", to: "/geometry" };
  if (/set|relation|logic|reasoning/.test(text)) return { label: "Set Theory & Relations Studio", to: "/set-theory" };
  if (/algebra|polynomial|equation|sequence/.test(text)) return { label: "Algebra Studio", to: "/algebra" };
  return { label: "Number Systems Studio", to: "/number-systems" };
}

export function StudioLessonLinks({ pathname }: { pathname: string }) {
  const config = configForPath(pathname);
  const [query, setQuery] = useState("");
  const lessons = useMemo<LessonLink[]>(() => {
    if (!config) return [];
    const terms = config.terms;
    const interactive = lessonCatalog.filter((lesson) => matchesStudioTerms(searchable(lesson), terms) || matchesStudioTerms(`${taxonomyForInteractiveLesson(lesson).category} ${taxonomyForInteractiveLesson(lesson).subcategory} ${taxonomyForInteractiveLesson(lesson).tags.join(" ")}`, terms)).map((lesson) => ({ key: `i-${lesson.id}`, title: lesson.title, route: lesson.route, track: lesson.category, description: lesson.topic }));
    const school = schoolLessonCatalog.filter((lesson) => { const taxonomy = taxonomyForSchoolLesson(lesson); return matchesStudioTerms(`${taxonomy.category} ${taxonomy.subcategory} ${taxonomy.tags.join(" ")}`, terms); }).map((lesson) => ({ key: `s-${lesson.id}`, title: lesson.title, route: lesson.route, track: `${lesson.metadata.academicLevel.replace("_", " ")} · School`, description: lesson.metadata.conceptFamily }));
    const advanced = advancedConceptLessons.filter((lesson) => { const taxonomy = taxonomyForAdvancedLesson(lesson); return matchesStudioTerms(`${taxonomy.category} ${taxonomy.subcategory} ${taxonomy.tags.join(" ")}`, terms); }).map((lesson) => ({ key: `a-${lesson.id}`, title: lesson.title, route: lesson.route, track: `Advanced · ${lesson.strand}`, description: lesson.summary }));
    const ranked = [...interactive, ...school, ...advanced].filter((lesson) => {
      const hay = `${lesson.title} ${lesson.track} ${lesson.description}`.toLowerCase();
      if (config.exclude?.some((term) => hay.includes(term))) return false;
      return true;
    });
    const pin = config.pinRoutes ?? [];
    ranked.sort((a, b) => {
      const pinA = pin.findIndex((route) => a.route === route);
      const pinB = pin.findIndex((route) => b.route === route);
      if (pinA !== -1 || pinB !== -1) return (pinA === -1 ? 99 : pinA) - (pinB === -1 ? 99 : pinB);
      return a.title.localeCompare(b.title);
    });
    return ranked;
  }, [config]);
  if (!config) return null;
  const filtered = lessons.filter((lesson) => `${lesson.title} ${lesson.track} ${lesson.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const visible = query.trim() ? filtered : filtered.slice(0, config.maxVisible ?? filtered.length);
  return <section className="studio-lesson-links" aria-label={`${config.name} lessons`}>
    <div className="studio-lesson-links-header"><div><p className="studio-eyebrow"><BookOpen /> Lesson path</p><h2>Lessons for this studio</h2><p>{config.description}</p></div><Link className="action-secondary" to="/lessons">Browse all {totalLessonCount} lessons <ArrowUpRight /></Link></div>
    <div className="studio-lesson-links-tools"><span>{lessons.length} relevant lessons{visible.length < filtered.length ? ` · showing ${visible.length}` : ""}</span><label><Search /><span className="sr-only">Search studio lessons</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter lessons…" /></label></div>
    <div className="studio-lesson-links-list">{visible.map((lesson) => <Link key={lesson.key} to={lesson.route} className="studio-lesson-link"><span><strong>{lesson.title}</strong><small>{lesson.track} · {lesson.description}</small></span><ArrowUpRight /></Link>)}{!visible.length && <p className="studio-lesson-empty">No lessons match that filter.</p>}</div>
  </section>;
}
