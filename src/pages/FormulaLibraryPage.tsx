import katex from "katex";
import { BookOpen, Copy, Sparkles, Search, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formulaCategories, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";
import { getFormulaVisualizerForFormulaCategory } from "../data/formulaVisualizerRoutes";
import { theoremCategories, type TheoremCategory, type TheoremLibraryItem } from "../data/theoremLibrary";
import { getCuratedFormulaLearningLinks } from "../proof-explanations/proofLearningLinks";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

type FormulaSheetRow = FormulaLibraryItem & {
  category: FormulaCategory;
  key: string;
};

type FormulaMainCategory = {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
};

const formulaMainCategories: FormulaMainCategory[] = [
  {
    id: "numbers-arithmetic",
    title: "Numbers & Arithmetic",
    description: "Number systems, fractions, mental math, commercial math, and speed calculation sheets.",
    categoryIds: [
      "number-systems",
      "early-number-sense",
      "fractions-decimals-percent",
      "mental-math",
      "commercial-math",
      "competitive-speed-time-work",
    ],
  },
  {
    id: "algebra-precalculus",
    title: "Algebra & Precalculus",
    description: "Identities, equations, polynomials, inequalities, relations, functions, and precalculus.",
    categoryIds: ["algebra", "pre-algebra", "polynomials", "inequalities", "relations-functions", "precalculus", "abstract-algebra"],
  },
  {
    id: "geometry-mensuration",
    title: "Geometry & Mensuration",
    description: "Plane geometry, theorem sheets, shapes, areas, volumes, and units.",
    categoryIds: ["geometry", "euclidean-geometry-theorems", "mensuration-units", "differential-geometry"],
  },
  {
    id: "coordinate-3d-geometry",
    title: "Coordinate & 3D Geometry",
    description: "Coordinate geometry, advanced analytic geometry, lines, planes, and 3D geometry formulas.",
    categoryIds: ["coordinate-geometry", "analytic-geometry-advanced", "three-d-geometry"],
  },
  {
    id: "trigonometry-complex",
    title: "Trigonometry & Complex",
    description: "Trigonometric identities, triangle laws, complex numbers, and complex analysis essentials.",
    categoryIds: ["trigonometry", "complex-numbers", "complex-analysis"],
  },
  {
    id: "calculus-analysis",
    title: "Calculus & Analysis",
    description: "Limits, derivatives, integrals, differential equations, multivariable calculus, and analysis.",
    categoryIds: [
      "limits-continuity",
      "derivatives",
      "integrals",
      "differential-equations",
      "calculus-applications",
      "multivariable-calculus",
      "real-analysis",
      "pde",
    ],
  },
  {
    id: "linear-algebra-vectors",
    title: "Linear Algebra & Vectors",
    description: "Matrices, determinants, vector formulas, transformations, and advanced linear algebra.",
    categoryIds: ["matrices", "determinants", "vectors", "linear-algebra-advanced"],
  },
  {
    id: "sequences-discrete",
    title: "Sequences & Discrete Math",
    description: "Series, combinatorics, set theory, logic, discrete math, number theory, and cryptography.",
    categoryIds: ["sequences-series", "combinatorics", "set-theory-logic", "discrete-math", "olympiad-number-theory", "cryptography-math"],
  },
  {
    id: "probability-statistics",
    title: "Probability & Statistics",
    description: "Probability rules, distributions, statistics, data formulas, and information theory.",
    categoryIds: ["probability", "statistics", "probability-distributions", "information-theory"],
  },
  {
    id: "applied-advanced-math",
    title: "Applied & Advanced Math",
    description: "Optimization, numerical methods, transforms, mathematical physics, topology, and ML math.",
    categoryIds: [
      "linear-programming",
      "optimization",
      "numerical-methods",
      "dynamical-systems",
      "fourier-laplace-transforms",
      "mathematical-physics",
      "topology",
      "machine-learning-math",
    ],
  },
];

const groupedCategoryAliases: Record<string, { title: string; description: string; categoryIds: string[] }> = {
  ...Object.fromEntries(
    formulaMainCategories.map((category) => [
      category.id,
      { title: category.title, description: category.description, categoryIds: category.categoryIds },
    ]),
  ),
  calculus: {
    title: "Calculus",
    description: "Limits, derivatives, integrals, differential equations, and applied calculus in one quick sheet.",
    categoryIds: ["limits-continuity", "derivatives", "integrals", "differential-equations", "calculus-applications"],
  },
  "linear-algebra": {
    title: "Linear Algebra",
    description: "Matrices, determinants, vectors, and 3D geometry formulas grouped for fast revision.",
    categoryIds: ["matrices", "determinants", "vectors", "three-d-geometry"],
  },
};

export default function FormulaLibraryPage() {
  const { categorySlug } = useParams();
  const [query, setQuery] = useState("");

  const categoriesById = useMemo(() => new Map(formulaCategories.map((category) => [category.id, category])), []);
  const activeCategory = categorySlug ? categoriesById.get(categorySlug) : undefined;
  const activeAlias = categorySlug ? groupedCategoryAliases[categorySlug] : undefined;
  const unknownCategory = Boolean(categorySlug && !activeCategory && !activeAlias);
  const isOverview = !categorySlug && !query.trim();

  const visibleCategories = useMemo(() => {
    if (activeCategory) return [activeCategory];
    if (activeAlias) {
      return activeAlias.categoryIds.map((id) => categoriesById.get(id)).filter((category): category is FormulaCategory => Boolean(category));
    }
    return formulaCategories;
  }, [activeAlias, activeCategory, categoriesById]);

  const rows = useMemo(
    () =>
      visibleCategories.flatMap((category) =>
        category.formulas.map((formula, index) => ({
          ...formula,
          category,
          key: `${category.id}-${index}-${formula.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        })),
      ),
    [visibleCategories],
  );

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter((row) =>
      [
        row.title,
        row.formula,
        row.note,
        row.category.title,
        row.category.description,
        ...getFormulaSymbolExplanations(row).flatMap((symbol) => [symbol.label, symbol.meaning]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, rows]);

  const pageTitle = activeCategory?.title ?? activeAlias?.title ?? "Formula Library";
  const pageDescription =
    activeCategory?.description ??
    activeAlias?.description ??
    "A grouped formula library with 10 main categories and focused subcategory pages for quick revision.";
  const visualizerRoute = getFormulaVisualizerForFormulaCategory(activeCategory?.id ?? categorySlug);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-6">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-3">
        <header className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                <Sigma className="h-4 w-4" />
                <Link className="hover:text-cyan-500" to="/formulas">
                  All formulas
                </Link>
                {categorySlug ? <span className="text-slate-400">/ {categorySlug}</span> : null}
              </div>
              <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-3xl">{pageTitle}</h1>
              <p className="mt-1 max-w-4xl text-sm leading-5 text-slate-600 dark:text-slate-300">{pageDescription}</p>
              {unknownCategory ? (
                <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-100">
                  No exact category named "{categorySlug}" was found, so the full formula library is shown.
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[340px]">
              <StatPill label={isOverview ? "Groups" : "Shown"} value={isOverview ? formulaMainCategories.length : filteredRows.length} />
              <StatPill label="Formulas" value={rows.length} />
              <StatPill label="Topics" value={visibleCategories.length} />
            </div>
          </div>
          {visualizerRoute ? (
            <Link to={visualizerRoute} className="action-primary mt-3 w-fit">
              <Sparkles className="h-4 w-4" />
              Open Interactive Formula Visualizer
            </Link>
          ) : null}
        </header>

        <div className="sticky top-0 z-20 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <span className="sr-only">Search formulas</span>
              <input
                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-950 dark:focus:ring-cyan-400/25"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search formula, topic, note..."
              />
            </label>
            <nav className="flex flex-wrap gap-2 pb-1 xl:max-w-[820px]" aria-label="Formula categories">
              <CategoryChip to="/formulas" active={!categorySlug}>
                All
              </CategoryChip>
              {formulaMainCategories.map((category) => (
                <CategoryChip key={category.id} to={`/formulas/${category.id}`} active={categorySlug === category.id}>
                  {category.title}
                </CategoryChip>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900 lg:block">
            <p className="mb-2 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <BookOpen className="h-4 w-4" />
              Main categories
            </p>
            <div className="grid gap-2">
              {formulaMainCategories.map((mainCategory) => (
                <div key={mainCategory.id} className="rounded-lg border border-slate-200 p-1.5 dark:border-white/10">
                  <Link
                    className={`block rounded-md px-2 py-1.5 text-sm font-black leading-tight transition ${
                      categorySlug === mainCategory.id
                        ? "bg-cyan-600 text-white shadow-sm"
                        : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                    }`}
                    to={`/formulas/${mainCategory.id}`}
                  >
                    {mainCategory.title}
                  </Link>
                  <div className="mt-1 grid gap-0.5">
                    {mainCategory.categoryIds
                      .map((id) => categoriesById.get(id))
                      .filter((category): category is FormulaCategory => Boolean(category))
                      .map((category) => (
                        <Link
                          key={category.id}
                          className={`rounded-md px-2 py-1 text-xs font-bold leading-tight transition ${
                            categorySlug === category.id
                              ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-300/15 dark:text-cyan-100"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
                          }`}
                          to={`/formulas/${category.id}`}
                        >
                          {category.title}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            {isOverview ? (
              <MainCategoryOverviewGrid groups={formulaMainCategories} categoriesById={categoriesById} />
            ) : filteredRows.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredRows.map((row) => (
                  <FormulaCheatCard key={row.key} row={row} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center dark:border-white/15 dark:bg-slate-900">
                <p className="text-lg font-black">No formulas found</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a shorter search or switch back to all formulas.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function MainCategoryOverviewGrid({
  categoriesById,
  groups,
}: {
  categoriesById: Map<string, FormulaCategory>;
  groups: FormulaMainCategory[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {groups.map((group) => {
        const subcategories = group.categoryIds.map((id) => categoriesById.get(id)).filter((category): category is FormulaCategory => Boolean(category));
        const formulaCount = subcategories.reduce((sum, category) => sum + category.formulas.length, 0);
        return (
          <article
            key={group.id}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  className="text-xl font-black leading-tight text-slate-950 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-100"
                  to={`/formulas/${group.id}`}
                >
                  {group.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300">{group.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
                {formulaCount}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {subcategories.map((category) => (
                <Link
                  key={category.id}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-100"
                  to={`/formulas/${category.id}`}
                >
                  {category.title}
                  <span className="ml-2 text-xs text-slate-400">{category.formulas.length}</span>
                </Link>
              ))}
            </div>
            <Link
              className="mt-3 inline-flex rounded-md bg-cyan-600 px-3 py-2 text-sm font-black text-white transition hover:bg-cyan-700"
              to={`/formulas/${group.id}`}
            >
              Open group sheet
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-white/10 dark:bg-white/5">
      <p className="text-lg font-black leading-none text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function CategoryChip({ active, children, to }: { active: boolean; children: string; to: string }) {
  return (
    <Link
      className={`max-w-[190px] rounded-md border px-3 py-2 text-center text-xs font-black leading-tight transition ${
        active
          ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-100"
      }`}
      to={to}
    >
      {children}
    </Link>
  );
}

function FormulaCheatCard({ row }: { row: FormulaSheetRow }) {
  const symbolExplanations = useMemo(() => getFormulaSymbolExplanations(row), [row]);
  const related = useMemo(() => getRelatedFormulaLinks(row), [row]);

  return (
    <article className="group flex min-h-[218px] flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{row.category.title}</p>
          <h2 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-slate-950 dark:text-white">{row.title}</h2>
        </div>
        <button
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-300 dark:hover:text-cyan-100"
          type="button"
          aria-label={`Copy ${row.title}`}
          onClick={() => void navigator.clipboard?.writeText(row.formula)}
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 min-h-[58px] rounded-md bg-slate-50 px-3 py-3 text-lg font-bold dark:bg-white/5 [&_.katex]:text-[1.12em]">
        <FormulaMathLines formula={row.formula} />
      </div>
      <p className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300">{row.note}</p>
      {symbolExplanations.length > 0 ? <FormulaSymbolKey symbols={symbolExplanations} /> : null}
      <FormulaRelatedLinks related={related} />
    </article>
  );
}

function FormulaRelatedLinks({
  related,
}: {
  related: {
    visualProofs: Array<{ title: string; route: string }>;
    theorems: Array<TheoremLibraryItem & { category: TheoremCategory; route: string }>;
  };
}) {
  if (related.visualProofs.length === 0 && related.theorems.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {related.visualProofs.slice(0, 2).map((proof) => (
        <Link
          key={proof.route}
          className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100"
          to={proof.route}
          title={proof.title}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Visual proof
        </Link>
      ))}
      {related.theorems.slice(0, 2).map((theorem) => (
        <Link
          key={theorem.route}
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
          to={theorem.route}
          title={theorem.title}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Theorem
        </Link>
      ))}
    </div>
  );
}

type FormulaSymbolExplanation = {
  label: string;
  meaning: string;
};

function FormulaSymbolKey({ symbols }: { symbols: FormulaSymbolExplanation[] }) {
  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-2 dark:border-white/10 dark:bg-white/5">
      <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Symbols</p>
      <div className="mt-1.5 grid gap-x-3 gap-y-1.5 sm:grid-cols-2">
        {symbols.map((symbol) => (
          <div key={`${symbol.label}-${symbol.meaning}`} className="min-w-0 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-200">
            <span className="font-black text-slate-950 dark:text-white">
              <InlineMath formula={symbol.label} />
            </span>
            <span className="text-slate-400"> = </span>
            <span>{symbol.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormulaMathLines({ formula }: { formula: string }) {
  const formulaParts = useMemo(() => splitFormulaForDisplay(formula), [formula]);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 leading-9">
      {formulaParts.map((part, index) => (
        <FormulaMathPart key={`${part}-${index}`} formula={part} />
      ))}
    </div>
  );
}

function FormulaMathPart({ formula }: { formula: string }) {
  const html = useMemo(() => katex.renderToString(formula, { displayMode: false, throwOnError: false, strict: false }), [formula]);
  return <span className="inline-block max-w-full break-normal align-middle" dangerouslySetInnerHTML={{ __html: html }} />;
}

function InlineMath({ formula }: { formula: string }) {
  const html = useMemo(() => katex.renderToString(formula, { displayMode: false, throwOnError: false, strict: false }), [formula]);
  return <span className="inline-block align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
}

function splitFormulaForDisplay(formula: string) {
  return formula
    .replace(/\\quad/g, "|||")
    .split("|||")
    .map((part) => part.trim().replace(/^,/, "").trim())
    .filter(Boolean);
}

const categorySymbolMeanings: Record<string, Record<string, string>> = {
  algebra: {
    a: "coefficient or number",
    b: "coefficient or number",
    c: "constant term",
    x: "unknown value",
    n: "power or count",
    m: "power or index",
    p: "parameter",
    q: "parameter",
  },
  "number-systems": {
    a: "number or value",
    b: "number or base",
    c: "new logarithm base",
    d: "divisor",
    n: "integer or modulus",
    p: "integer or prime",
    q: "non-zero integer denominator",
    x: "given number",
  },
  trigonometry: {
    A: "angle or triangle side",
    B: "angle or triangle side",
    C: "angle or triangle side",
    a: "angle or triangle side",
    b: "angle or triangle side",
    c: "triangle side",
    x: "angle input",
    theta: "angle",
    opposite: "side across from the angle",
    adjacent: "side next to the angle",
    hypotenuse: "longest side of a right triangle",
  },
  geometry: {
    A: "area",
    C: "circumference",
    D: "number of diagonals",
    L: "arc length or latus rectum",
    P: "perimeter",
    R: "larger radius or circumradius",
    S: "surface area or angle sum",
    V: "volume",
    a: "side length",
    b: "base or side length",
    c: "side or chord length",
    d: "diameter or diagonal",
    h: "height",
    l: "length or slant height",
    n: "number of sides",
    r: "radius or inradius",
    s: "semiperimeter",
    theta: "angle",
  },
  "coordinate-geometry": {
    A: "line coefficient or area",
    B: "line coefficient",
    C: "constant in line equation",
    G: "centroid",
    M: "midpoint",
    P: "point",
    a: "intercept or parameter",
    b: "intercept or parameter",
    d: "distance",
    h: "x-coordinate of center",
    k: "y-coordinate of center",
    m: "slope or ratio part",
    n: "ratio part",
    r: "radius",
    x: "x-coordinate",
    y: "y-coordinate",
  },
  "limits-continuity": {
    L: "limit value",
    a: "approach value",
    b: "constant",
    f: "function being studied",
    g: "comparison function",
    h: "comparison function",
    n: "large counting index",
    x: "input variable",
  },
  derivatives: {
    a: "positive base or constant",
    f: "outer function",
    g: "inner function",
    h: "small change in x",
    n: "power",
    u: "first function",
    v: "second function",
    x: "input variable",
  },
  integrals: {
    A: "area",
    C: "constant of integration",
    F: "antiderivative of f",
    a: "lower limit or constant",
    b: "upper limit",
    f: "integrand function",
    g: "second function",
    n: "power",
    u: "substitution variable",
    v: "integrated part",
    x: "input variable",
  },
  "differential-equations": {
    C: "constant of integration",
    IF: "integrating factor",
    L: "carrying capacity",
    P: "coefficient function",
    Q: "forcing function",
    a: "coefficient",
    b: "coefficient",
    c: "coefficient",
    k: "growth or decay rate",
    r: "auxiliary root",
    t: "time",
    x: "independent variable",
    y: "dependent variable",
  },
  matrices: {
    A: "matrix",
    B: "matrix or right-hand side",
    I: "identity matrix",
    X: "unknown matrix or vector",
    i: "row index",
    j: "column index",
    k: "scalar or summation index",
    n: "matrix size or shared dimension",
  },
  determinants: {
    A: "matrix",
    B: "matrix",
    C: "cofactor",
    M: "minor",
    i: "row index",
    j: "column index",
    k: "scalar",
    n: "matrix order",
  },
  vectors: {
    A: "vector magnitude or area",
    B: "vector magnitude",
    R: "resultant vector",
    a: "vector or component",
    b: "vector or component",
    c: "vector or component",
    i: "unit vector along x-axis",
    j: "unit vector along y-axis",
    k: "unit vector along z-axis",
    l: "direction cosine",
    m: "direction cosine",
    n: "direction cosine",
    theta: "angle between vectors",
  },
  "three-d-geometry": {
    A: "plane coefficient",
    B: "plane coefficient",
    C: "plane coefficient",
    D: "constant in plane equation",
    a: "direction ratio or center coordinate",
    b: "direction ratio or center coordinate",
    c: "direction ratio or center coordinate",
    d: "distance",
    l: "direction cosine",
    m: "direction cosine",
    n: "direction cosine",
    r: "position vector or radius",
    x: "x-coordinate",
    y: "y-coordinate",
    z: "z-coordinate",
  },
  "complex-numbers": {
    Re: "real part",
    Im: "imaginary part",
    a: "real part",
    b: "imaginary coefficient",
    e: "Euler's number",
    i: "imaginary unit",
    r: "modulus",
    z: "complex number",
    theta: "argument angle",
    pi: "pi constant",
  },
  "sequences-series": {
    A: "arithmetic mean",
    G: "geometric mean",
    H: "harmonic mean",
    a: "first value or expansion point",
    b: "second value",
    f: "function",
    n: "term number",
    p: "series power",
    r: "chosen count",
    x: "variable",
  },
  combinatorics: {
    A: "set",
    N: "total number of choices",
    k: "number of stages",
    n: "total objects",
    r: "selected objects",
    x: "unknown count",
  },
  "set-theory-logic": {
    A: "set",
    B: "set",
    C: "set",
    P: "power set",
    R: "relation",
    U: "universal set",
    a: "element",
    b: "element",
    c: "element",
    n: "number of elements or propositions",
    p: "proposition",
    q: "proposition",
  },
  "linear-programming": {
    A: "constraint matrix",
    B: "basis matrix",
    S: "feasible set",
    Z: "objective value",
    b: "right-hand-side resource vector",
    c: "objective coefficient vector",
    i: "constraint row index",
    j: "non-basic variable column index",
    s: "surplus variable",
    x: "decision variable vector",
    y: "dual variable vector",
  },
  "relations-functions": {
    A: "set",
    Dom: "domain",
    R: "relation",
    T: "period",
    a: "input element",
    b: "input element",
    c: "input element",
    f: "function",
    g: "function",
    x: "input value",
  },
  "mensuration-units": {
    A: "area",
    C: "temperature in Celsius",
    CSA: "curved surface area",
    F: "temperature in Fahrenheit",
    LSA: "lateral surface area",
    P: "perimeter",
    R: "major or outer radius",
    S: "surface area",
    TSA: "total surface area",
    V: "volume",
    a: "side length",
    b: "breadth or base",
    h: "height",
    l: "length or slant height",
    r: "radius",
    theta: "angle",
  },
  "differential-geometry": {
    E: "first fundamental form coefficient",
    F: "mixed first fundamental form coefficient",
    G: "first fundamental form coefficient",
    H: "mean curvature",
    K: "Gaussian curvature",
    L: "second fundamental form coefficient",
    M: "mixed second fundamental form coefficient",
    N: "second fundamental form coefficient",
    S: "shape operator",
    T: "unit tangent vector",
    a: "starting parameter value",
    b: "ending parameter value",
    k: "curvature",
    n: "normal vector",
    r: "position vector of the curve",
    "r'": "velocity vector, the derivative of r",
    s: "arc length measured along the curve",
    t: "curve parameter or upper limit",
    u: "dummy integration parameter",
    du: "tiny change in the parameter u",
    v: "surface parameter",
    theta: "turning angle",
  },
};

const globalSymbolMeanings: Record<string, string> = {
  Delta: "discriminant or change",
  alpha: "angle",
  beta: "angle",
  lambda: "scalar parameter",
  mu: "mean",
  pi: "pi constant",
  rho: "density or correlation",
  sigma: "standard deviation",
  theta: "angle",
  x_1: "first x-coordinate",
  x_2: "second x-coordinate",
  x_3: "third x-coordinate",
  y_1: "first y-coordinate",
  y_2: "second y-coordinate",
  y_3: "third y-coordinate",
  z_1: "first z-coordinate",
  z_2: "second z-coordinate",
  z_3: "third z-coordinate",
};

const commandSymbolLabels: Record<string, string> = {
  alpha: "\\alpha",
  beta: "\\beta",
  Delta: "\\Delta",
  lambda: "\\lambda",
  mu: "\\mu",
  pi: "\\pi",
  rho: "\\rho",
  sigma: "\\sigma",
  theta: "\\theta",
};

function getFormulaSymbolExplanations(row: FormulaSheetRow): FormulaSymbolExplanation[] {
  const specialCase = getSpecialSymbolExplanations(row);
  if (specialCase.length > 0) return specialCase;

  const keys = extractSymbolKeys(row.formula);
  const categoryMeanings = categorySymbolMeanings[row.category.id] ?? {};
  const symbols = keys
    .map((key) => {
      const meaning = getContextualSymbolMeaning(key, row) ?? categoryMeanings[key] ?? globalSymbolMeanings[key] ?? inferGenericSymbolMeaning(key);
      return meaning ? { label: symbolLabel(key), meaning } : null;
    })
    .filter((symbol): symbol is FormulaSymbolExplanation => Boolean(symbol));

  return dedupeSymbolExplanations(symbols);
}

function getSpecialSymbolExplanations(row: FormulaSheetRow): FormulaSymbolExplanation[] {
  if (row.category.id === "linear-programming" && row.title.toLowerCase().includes("simplex reduced cost")) {
    return [
      { label: "\\bar c_j", meaning: "reduced cost of variable j" },
      { label: "j", meaning: "candidate non-basic variable column" },
      { label: "c_j", meaning: "objective coefficient of variable j" },
      { label: "c_B", meaning: "cost vector for current basic variables" },
      { label: "T", meaning: "transpose, so row/column orientation matches" },
      { label: "B", meaning: "current basis matrix" },
      { label: "B^{-1}", meaning: "inverse of the basis matrix" },
      { label: "A_j", meaning: "constraint column for variable j" },
    ];
  }

  return [];
}

function getContextualSymbolMeaning(key: string, row: FormulaSheetRow) {
  const title = row.title.toLowerCase();
  if (row.category.id === "differential-geometry") {
    if (key === "r'") return "velocity vector, the derivative of r";
    if (key === "du") return "tiny change in the parameter u";
    if (key === "dv") return "tiny change in the surface parameter v";
    if (key === "dt") return "tiny change in the curve parameter t";
  }
  if (key === "T" && row.formula.includes("^T")) return "transpose";
  if (key === "A_b") return "area of the base";
  if (key === "P_b") return "perimeter of the base";
  if (key === "d_eq") return "equivalent discount";
  if (key === "r_eq") return "equivalent rate";
  if (key === "V_total") return "total volume";
  if (key === "S_visible") return "visible surface area";
  if (key === "m_a") return "median to side a";
  if (key === "l_a") return "angle bisector from vertex A";
  if (key === "du") return "tiny change in u";
  if (key === "dv") return "tiny change in v";
  if (key === "dx") return "tiny change in x";
  if (key === "dy") return "tiny change in y";
  if (key === "dt") return "tiny change in t";
  if (key.endsWith("'")) return `derivative of ${key.slice(0, -1)}`;
  if (key === "opposite") return "side across from the angle";
  if (key === "adjacent") return "side next to the angle";
  if (key === "hypotenuse") return "longest side of a right triangle";
  if (key === "A" && title.includes("triangle") && row.category.id !== "set-theory-logic") return "area";
  if (key === "A" && title.includes("matrix")) return "matrix";
  if (key === "C" && title.includes("constant")) return "constant";
  if (key === "d" && title.includes("distance")) return "distance";
  if (key === "r" && title.includes("radius")) return "radius";
  if (key === "h" && title.includes("height")) return "height";
  return undefined;
}

function extractSymbolKeys(formula: string) {
  const cleaned = formula
    .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, " ")
    .replace(/\\text\{([^}]*)\}/g, " $1 ")
    .replace(/\\operatorname\{([^}]*)\}/g, " $1 ");
  const symbols = new Set<string>();

  for (const match of cleaned.matchAll(/\\(alpha|beta|Delta|lambda|mu|pi|rho|sigma|theta)\b/g)) {
    symbols.add(match[1]);
  }

  for (const match of cleaned.matchAll(/\\(?:mathbf|mathrm|mathit|mathcal)\s*\{?([A-Za-z]+)\}?('?)(?:_\{?([A-Za-z0-9]+)\}?)?/g)) {
    symbols.add(compactSymbol(`${match[1]}${match[2] ?? ""}`, match[3]));
  }

  for (const match of cleaned.matchAll(/\\(?:bar|vec|hat|overline)\s*\{?([A-Za-z]+)(?:_?\{?([A-Za-z0-9]+)\}?)?/g)) {
    symbols.add(compactSymbol(match[1], match[2]));
  }

  for (const match of cleaned.matchAll(/\b(d[xyzuvt])\b/g)) {
    symbols.add(match[1]);
  }

  for (const match of cleaned.matchAll(/\b([A-Za-z])'\s*\(/g)) {
    symbols.add(`${match[1]}'`);
  }

  for (const match of cleaned.matchAll(/\b([A-Za-z])\s*\(([^)]*)\)/g)) {
    symbols.add(match[1]);
    const argument = match[2].trim();
    if (/^[A-Za-z]$/.test(argument)) symbols.add(argument);
  }

  const plainFormula = cleaned.replace(/\\[A-Za-z]+(?:\{[^}]*\})?/g, " ");

  for (const match of plainFormula.matchAll(/\b([A-Za-z]{2,})(?:_\{?([A-Za-z0-9]+)\}?)?\b/g)) {
    const word = match[1];
    if (ignoredWords.has(word)) continue;
    if (word.length <= 3 || knownWordSymbols.has(word)) symbols.add(compactSymbol(word, match[2]));
  }

  for (const match of plainFormula.matchAll(/\b([A-Za-z])(?:_\{?([A-Za-z0-9]+)\}?)?/g)) {
    symbols.add(compactSymbol(match[1], match[2]));
  }

  return [...symbols].filter((symbol) => !ignoredWords.has(symbol)).slice(0, 12);
}

function compactSymbol(base: string, subscript?: string) {
  return subscript ? `${base}_${subscript}` : base;
}

function symbolLabel(key: string) {
  const [base, subscript] = key.split("_");
  const renderedBase = commandSymbolLabels[base] ?? base;
  return subscript ? `${renderedBase}_${subscript}` : renderedBase;
}

function inferGenericSymbolMeaning(key: string) {
  if (/^[xyz]_\d$/.test(key)) return `${key[0]}-coordinate of point ${key.slice(2)}`;
  if (/^[abc]_\d$/.test(key)) return `${key[0]} component or coefficient ${key.slice(2)}`;
  if (/^[ABC]_\d$/.test(key)) return `${key[0]} object ${key.slice(2)}`;
  if (/^[ijk]$/.test(key)) return `${key} index`;
  if (/^n$/.test(key)) return "count or index";
  if (/^x$/.test(key)) return "unknown or input value";
  if (/^y$/.test(key)) return "output or dependent value";
  if (/^z$/.test(key)) return "complex value or third coordinate";
  return undefined;
}

function dedupeSymbolExplanations(symbols: FormulaSymbolExplanation[]) {
  const seen = new Set<string>();
  return symbols.filter((symbol) => {
    const key = `${symbol.label}-${symbol.meaning}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const knownWordSymbols = new Set(["CSA", "HCF", "IF", "LCM", "LSA", "TSA", "Dom", "Re", "Im"]);

const ignoredWords = new Set([
  "Rightarrow",
  "Leftrightarrow",
  "frac",
  "sqrt",
  "sin",
  "cos",
  "tan",
  "cot",
  "sec",
  "csc",
  "ln",
  "log",
  "lim",
  "int",
  "sum",
  "cdot",
  "times",
  "left",
  "right",
  "begin",
  "end",
  "case",
  "cases",
  "for",
  "all",
  "if",
  "prime",
  "diverges",
  "converges",
  "det",
  "area",
  "scale",
  "actual",
  "approx",
  "previous",
  "next",
]);

const formulaToProofCategory: Record<string, string[]> = {
  algebra: ["algebraic-identities", "inequalities", "logarithms-exponents"],
  polynomials: ["algebraic-identities"],
  inequalities: ["inequalities"],
  trigonometry: ["trigonometry"],
  geometry: ["geometry", "mensuration"],
  "euclidean-geometry-theorems": ["geometry"],
  "coordinate-geometry": ["coordinate-geometry", "conic-sections"],
  "analytic-geometry-advanced": ["conic-sections", "coordinate-geometry"],
  "limits-continuity": ["calculus"],
  derivatives: ["calculus"],
  integrals: ["calculus", "engineering-mathematics"],
  "differential-equations": ["engineering-mathematics", "calculus"],
  matrices: ["matrices-linear-algebra"],
  determinants: ["matrices-linear-algebra"],
  vectors: ["vectors"],
  "complex-numbers": ["complex-numbers"],
  "sequences-series": ["sequences-and-series"],
  combinatorics: ["sequences-and-series", "number-theory"],
  probability: ["probability"],
  statistics: ["statistics"],
  "linear-programming": ["engineering-mathematics"],
  optimization: ["engineering-mathematics", "inequalities"],
  "fourier-laplace-transforms": ["engineering-mathematics"],
  "mensuration-units": ["mensuration"],
};

const formulaToTheoremCategory: Record<string, string[]> = {
  algebra: ["algebra"],
  polynomials: ["algebra"],
  inequalities: ["algebra"],
  trigonometry: ["trigonometry"],
  geometry: ["geometry"],
  "euclidean-geometry-theorems": ["geometry"],
  "coordinate-geometry": ["coordinate-geometry"],
  "analytic-geometry-advanced": ["coordinate-geometry"],
  "limits-continuity": ["calculus-analysis"],
  derivatives: ["calculus-analysis", "optimization-engineering"],
  integrals: ["calculus-analysis", "optimization-engineering"],
  "differential-equations": ["calculus-analysis", "optimization-engineering"],
  matrices: ["linear-algebra-vectors"],
  determinants: ["linear-algebra-vectors"],
  vectors: ["linear-algebra-vectors"],
  "complex-numbers": ["complex-numbers"],
  "sequences-series": ["discrete-logic", "calculus-analysis"],
  combinatorics: ["discrete-logic"],
  probability: ["probability-statistics"],
  statistics: ["probability-statistics"],
  "linear-programming": ["optimization-engineering"],
  optimization: ["optimization-engineering"],
  "fourier-laplace-transforms": ["optimization-engineering"],
  "mensuration-units": ["geometry"],
};

const learningLinkStopWords = new Set([
  "formula",
  "theorem",
  "identity",
  "rule",
  "with",
  "from",
  "into",
  "that",
  "this",
  "area",
  "value",
  "values",
  "standard",
]);

function getRelatedFormulaLinks(row: FormulaSheetRow) {
  const curated = getCuratedFormulaLearningLinks(row.category.id, row.title);
  const tokens = getLearningTokens([row.title, row.formula, row.note, row.category.title, row.category.description]);
  const proofHints = new Set(formulaToProofCategory[row.category.id] ?? []);
  const theoremHints = new Set(formulaToTheoremCategory[row.category.id] ?? []);

  const heuristicVisualProofs = visualProofsIndex
    .filter((proof) => proof.status === "available")
    .map((proof) => ({
      proof,
      score:
        scoreLearningText(tokens, [proof.title, proof.shortDescription, proof.longDescription, proof.tags.join(" "), proof.prerequisites.join(" ")]) +
        (proofHints.has(proof.categorySlug) ? 4 : 0),
    }))
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ proof }) => ({ title: proof.title, route: proof.route }));

  const heuristicTheorems = theoremCategories
    .flatMap((theoremCategory) =>
      theoremCategory.theorems.map((theorem) => ({
        ...theorem,
        category: theoremCategory,
        route: `/theorems/${theoremCategory.id}/${theorem.slug}`,
        score:
          scoreLearningText(tokens, [theorem.title, theorem.subtopic, theorem.statement, theorem.prerequisites.join(" ")]) +
          (theoremHints.has(theoremCategory.id) ? 3 : 0),
      })),
    )
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...theorem }) => theorem);

  return {
    visualProofs: uniqueRelatedByRoute([...curated.visualProofs, ...heuristicVisualProofs]).slice(0, 3),
    theorems: uniqueRelatedByRoute([...curated.theorems, ...heuristicTheorems]).slice(0, 3),
  };
}

function uniqueRelatedByRoute<T extends { route: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.route, item])).values());
}

function getLearningTokens(parts: string[]) {
  return Array.from(
    new Set(
      parts
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3 && !learningLinkStopWords.has(token)),
    ),
  );
}

function scoreLearningText(tokens: string[], parts: string[]) {
  const haystack = parts.join(" ").toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}
