import { BookOpen, BookOpenCheck, CheckCircle2, ChevronLeft, Link2, Search, Sigma, Sparkles, TriangleAlert } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import MathExpression, { isFormulaLike } from "../components/ui/MathExpression";
import { formulaCategories, type FormulaCategory, type FormulaLibraryItem } from "../data/formulaLibrary";
import { theoremCategories, theoremCount, type TheoremCategory, type TheoremLibraryItem } from "../data/theoremLibrary";
import { getCuratedTheoremLearningLinks } from "../proof-explanations/proofLearningLinks";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

type TheoremSheetRow = TheoremLibraryItem & {
  category: TheoremCategory;
  key: string;
};

type FormulaMatch = FormulaLibraryItem & {
  category: FormulaCategory;
  route: string;
};

type VisualProofMatch = {
  title: string;
  route: string;
  categorySlug: string;
};

type RelatedLearningLinks = {
  formulas: FormulaMatch[];
  visualProofs: VisualProofMatch[];
  theorems: Array<TheoremLibraryItem & { category: TheoremCategory; route: string }>;
};

export default function TheoremLibraryPage() {
  const { categorySlug, theoremSlug } = useParams();
  const [query, setQuery] = useState("");

  const categoriesById = useMemo(() => new Map(theoremCategories.map((category) => [category.id, category])), []);
  const activeCategory = categorySlug ? categoriesById.get(categorySlug) : undefined;
  const rows = useMemo(
    () => {
      const visibleCategories = activeCategory ? [activeCategory] : theoremCategories;
      return (
      visibleCategories.flatMap((category) =>
        category.theorems.map((theorem) => ({
          ...theorem,
          category,
          key: `${category.id}-${theorem.slug}`,
        })),
      )
      );
    },
    [activeCategory],
  );

  const activeTheorem = useMemo(() => {
    if (!categorySlug || !theoremSlug) return undefined;
    return theoremCategories
      .find((category) => category.id === categorySlug)
      ?.theorems.find((theoremItem) => theoremItem.slug === theoremSlug);
  }, [categorySlug, theoremSlug]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter((row) =>
      [
        row.title,
        row.statement,
        row.subtopic,
        row.whyItMatters,
        row.category.title,
        row.category.description,
        row.prerequisites.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, rows]);

  const isOverview = !categorySlug && !query.trim();
  const pageTitle = activeTheorem?.title ?? activeCategory?.title ?? "Theorem Library";
  const pageDescription =
    activeTheorem?.statement ??
    activeCategory?.description ??
    "A compact theorem library with 12 major categories, 200+ theorem cards, proof-ready routes, reference pages, and connected visual learning links.";
  const unknownCategory = Boolean(categorySlug && !activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-3 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-6">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-3">
        <header className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                <BookOpenCheck className="h-4 w-4" />
                <Link className="hover:text-cyan-500" to="/theorems">
                  All theorems
                </Link>
                {categorySlug ? <span className="text-slate-400">/ {activeCategory?.title ?? categorySlug}</span> : null}
                {activeTheorem ? <span className="text-slate-400">/ {activeTheorem.title}</span> : null}
              </div>
              <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-3xl">{pageTitle}</h1>
              <p className="mt-1 max-w-4xl text-sm leading-5 text-slate-600 dark:text-slate-300">{pageDescription}</p>
              {unknownCategory ? (
                <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-100">
                  No theorem category named "{categorySlug}" was found, so the full theorem library is shown.
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[340px]">
              <StatPill label={isOverview ? "Categories" : "Shown"} value={isOverview ? theoremCategories.length : filteredRows.length} />
              <StatPill label="Theorems" value={activeCategory ? activeCategory.theorems.length : theoremCount} />
              <StatPill label="Visual Proofs" value={visualProofsIndex.filter((proof) => proof.status === "available").length} />
            </div>
          </div>
        </header>

        {activeTheorem && activeCategory ? (
          <TheoremDetail theorem={activeTheorem} category={activeCategory} />
        ) : (
          <>
            <div className="sticky top-0 z-20 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
              <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                <label className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search theorems</span>
                  <input
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-950 dark:focus:ring-cyan-400/25"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search theorem, topic, use, prerequisite..."
                  />
                </label>
                <nav className="-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 xl:max-w-[820px]" aria-label="Theorem categories">
                  <CategoryChip to="/theorems" active={!categorySlug}>
                    All
                  </CategoryChip>
                  {theoremCategories.map((category) => (
                    <CategoryChip key={category.id} to={`/theorems/${category.id}`} active={categorySlug === category.id}>
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
                  Theorem categories
                </p>
                <div className="grid gap-1">
                  {theoremCategories.map((category) => (
                    <Link
                      key={category.id}
                      className={`rounded-md px-2 py-2 text-sm font-black leading-tight transition ${
                        categorySlug === category.id
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                      }`}
                      to={`/theorems/${category.id}`}
                    >
                      <span className="block">{category.title}</span>
                      <span className={`text-xs ${categorySlug === category.id ? "text-cyan-50" : "text-slate-400"}`}>
                        {category.theorems.length} theorems
                      </span>
                    </Link>
                  ))}
                </div>
              </aside>

              <section className="min-w-0">
                {isOverview ? (
                  <TheoremCategoryGrid />
                ) : filteredRows.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredRows.map((row) => (
                      <TheoremCard key={row.key} row={row} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center dark:border-white/15 dark:bg-slate-900">
                    <p className="text-lg font-black">No theorems found</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a shorter search or open a category.</p>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function TheoremCategoryGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {theoremCategories.map((category) => (
        <article
          key={category.id}
          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link className="text-xl font-black leading-tight text-slate-950 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-100" to={`/theorems/${category.id}`}>
                {category.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
            </div>
            <span className="shrink-0 rounded-md bg-cyan-50 px-3 py-1.5 text-sm font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
              {category.theorems.length}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...new Set(category.theorems.map((theorem) => theorem.subtopic))].slice(0, 6).map((subtopic) => (
              <span key={subtopic} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {subtopic}
              </span>
            ))}
          </div>
          <Link className="mt-3 inline-flex rounded-md bg-cyan-600 px-3 py-2 text-sm font-black text-white transition hover:bg-cyan-700" to={`/theorems/${category.id}`}>
            Open theorem sheet
          </Link>
        </article>
      ))}
    </div>
  );
}

function TheoremCard({ row }: { row: TheoremSheetRow }) {
  const related = useMemo(() => getRelatedLearningLinks(row, row.category), [row]);

  return (
    <article className="flex min-h-[245px] flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-300/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{row.category.title}</p>
          <h2 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-slate-950 dark:text-white">{row.title}</h2>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusTone(row.proofStatus)}`}>
          {statusLabel(row.proofStatus)}
        </span>
      </div>
      <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-base font-bold leading-6 text-slate-800 dark:bg-white/5 dark:text-slate-100">
        <TheoremStatement value={row.statement} />
      </p>
      <p className="mt-3 text-base font-semibold leading-6 text-slate-600 dark:text-slate-300">{row.whyItMatters}</p>
      <div className="mt-auto pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{row.subtopic}</span>
          {row.prerequisites.slice(0, 2).map((prerequisite) => (
            <span key={prerequisite} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
              {prerequisite}
            </span>
          ))}
        </div>
        <Link className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-100" to={`/theorems/${row.category.id}/${row.slug}`}>
          {isReferenceTheorem(row) ? "Open reference page" : "Open proof draft"}
        </Link>
        <RelatedLinkStrip related={related} compact />
      </div>
    </article>
  );
}

function TheoremDetail({ theorem, category }: { theorem: TheoremLibraryItem; category: TheoremCategory }) {
  const related = useMemo(() => getRelatedLearningLinks(theorem, category), [category, theorem]);
  const referencePage = isReferenceTheorem(theorem);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <Link className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200" to={`/theorems/${category.id}`}>
        <ChevronLeft className="h-4 w-4" />
        Back to {category.title}
      </Link>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{category.title} / {theorem.subtopic}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 dark:text-white">{theorem.title}</h2>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Statement</p>
            <p className="mt-2 text-xl font-black leading-8 text-slate-900 dark:text-white">
              <TheoremStatement value={theorem.statement} mathClassName="text-[0.95em]" />
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <InfoPanel title="Why It Matters" text={theorem.whyItMatters} />
            <InfoPanel title={referencePage ? "Reference Guide" : "Proof Draft"} text={theorem.proofPlan} />
          </div>
          <StepByStepProofPanel theorem={theorem} />
          <RelatedLearningPanel related={related} />
        </div>
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{referencePage ? "Reference Roadmap" : "Proof Roadmap"}</p>
          <ol className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            {theorem.proofSteps?.length ? (
              theorem.proofSteps.map((step, index) => (
                <li key={step.title} className="rounded-md bg-white p-2 dark:bg-slate-950/50">
                  {index + 1}. {step.title}
                </li>
              ))
            ) : (
              <>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">1. Read the theorem statement and prerequisites.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">2. Check why the result matters.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">3. Open connected formulas or visual proofs.</li>
                <li className="rounded-md bg-white p-2 dark:bg-slate-950/50">4. Use as a reference page until full proof steps are available.</li>
              </>
            )}
          </ol>
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Prerequisites</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(theorem.prerequisites.length ? theorem.prerequisites : ["Core definitions"]).map((prerequisite) => (
              <span key={prerequisite} className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-600 dark:bg-slate-950/50 dark:text-slate-200">
                {prerequisite}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TheoremStatement({ value, mathClassName = "" }: { value: string; mathClassName?: string }) {
  const trimmed = value.trim();
  const sentenceEnd = trimmed.endsWith(".") ? "." : "";
  const body = sentenceEnd ? trimmed.slice(0, -1) : trimmed;
  const commaIndex = body.lastIndexOf(",");
  const formulaCandidate = commaIndex > -1 ? body.slice(commaIndex + 1).trim() : body;

  if (commaIndex > -1 && isFormulaLike(formulaCandidate)) {
    return (
      <>
        {body.slice(0, commaIndex + 1)} <MathExpression value={formulaCandidate} className={mathClassName} />
        {sentenceEnd}
      </>
    );
  }

  if (isFormulaLike(body) && !/[a-z]{3,}\s+[a-z]{3,}/i.test(body)) {
    return (
      <>
        <MathExpression value={body} className={mathClassName} />
        {sentenceEnd}
      </>
    );
  }

  return <>{value}</>;
}

function StepByStepProofPanel({ theorem }: { theorem: TheoremLibraryItem }) {
  if (!theorem.proofSteps?.length) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/15 dark:bg-white/5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Step Proof Status</p>
        <p className="mt-2 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200">
          Reference page: this theorem currently provides the statement, prerequisites, purpose, and connected learning links. It is not marked as a complete step-by-step proof route.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Step-by-step proof</p>
          <p className="mt-2 text-base font-bold leading-6 text-slate-800 dark:text-slate-100">{theorem.proofIdea}</p>
        </div>
        <span className={`w-fit rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusTone(theorem.proofStatus)}`}>
          {statusLabel(theorem.proofStatus)}
        </span>
      </div>
      <ol className="mt-4 grid gap-3">
        {theorem.proofSteps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-white bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-600 text-sm font-black text-white">{index + 1}</span>
              <div className="min-w-0">
                <h3 className="text-lg font-black leading-tight text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200">{step.explanation}</p>
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-bold leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  Visual cue: {step.representation}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {theorem.examMemory ? (
          <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Exam Memory
            </p>
            <p className="mt-2 text-base font-bold leading-6 text-slate-700 dark:text-slate-200">{theorem.examMemory}</p>
          </div>
        ) : null}
        {theorem.commonMistakes?.length ? (
          <div className="rounded-lg bg-white p-3 dark:bg-slate-950/60">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-200">
              <TriangleAlert className="h-4 w-4" />
              Common Mistakes
            </p>
            <ul className="mt-2 grid gap-1.5 text-base font-bold leading-6 text-slate-700 dark:text-slate-200">
              {theorem.commonMistakes.map((mistake) => (
                <li key={mistake}>- {mistake}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RelatedLinkStrip({ compact, related }: { compact?: boolean; related: RelatedLearningLinks }) {
  const visualProof = related.visualProofs[0];
  const formula = related.formulas[0];
  if (!visualProof && !formula) return null;

  return (
    <div className={`mt-2 flex flex-wrap gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {visualProof ? (
        <Link className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-1 font-black text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100" to={visualProof.route}>
          <Sparkles className="h-3.5 w-3.5" />
          Visual proof
        </Link>
      ) : null}
      {formula ? (
        <Link className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-black text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200" to={formula.route}>
          <Sigma className="h-3.5 w-3.5" />
          Formula
        </Link>
      ) : null}
    </div>
  );
}

function RelatedLearningPanel({ related }: { related: RelatedLearningLinks }) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
        <Link2 className="h-4 w-4" />
        Connected learning
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <RelatedList title="Visual Proofs" icon={<Sparkles className="h-4 w-4" />} empty="Visual proof can be added next.">
          {related.visualProofs.map((proof) => (
            <Link key={proof.route} className="rounded-md bg-cyan-50 px-2 py-1.5 text-sm font-bold text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100" to={proof.route}>
              {proof.title}
            </Link>
          ))}
        </RelatedList>
        <RelatedList title="Formula Links" icon={<Sigma className="h-4 w-4" />} empty="No close formula section found.">
          {related.formulas.map((formula) => (
            <Link key={`${formula.category.id}-${formula.title}`} className="rounded-md bg-slate-100 px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200" to={formula.route}>
              {formula.title}
            </Link>
          ))}
        </RelatedList>
        <RelatedList title="Related Theorems" icon={<BookOpen className="h-4 w-4" />} empty="No close theorem neighbor found.">
          {related.theorems.map((theorem) => (
            <Link key={theorem.route} className="rounded-md bg-white px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:bg-slate-950" to={theorem.route}>
              {theorem.title}
            </Link>
          ))}
        </RelatedList>
      </div>
    </div>
  );
}

function RelatedList({ children, empty, icon, title }: { children: ReactNode; empty: string; icon: ReactNode; title: string }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const hasItems = Array.isArray(items) ? items.length > 0 : Boolean(items);
  return (
    <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {title}
      </p>
      <div className="mt-2 grid gap-1.5">
        {hasItems ? items : <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{empty}</span>}
      </div>
    </div>
  );
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-base font-semibold leading-6 text-slate-700 dark:text-slate-200">{text}</p>
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
      className={`shrink-0 snap-start whitespace-nowrap rounded-md border px-2.5 py-2 text-center text-[11px] font-black leading-none transition sm:max-w-[190px] sm:whitespace-normal sm:px-3 sm:text-xs sm:leading-tight ${
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

function statusLabel(status: TheoremLibraryItem["proofStatus"]) {
  if (status === "visual-ready") return "Visual ready";
  if (status === "draft-ready") return "Draft proof";
  if (status === "scaffold-ready") return "Reference page";
  return "Proof needed";
}

function statusTone(status: TheoremLibraryItem["proofStatus"]) {
  if (status === "visual-ready") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100";
  if (status === "draft-ready") return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100";
  if (status === "scaffold-ready") return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-300/30 dark:bg-violet-300/10 dark:text-violet-100";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100";
}

function isReferenceTheorem(theorem: Pick<TheoremLibraryItem, "proofStatus" | "proofSteps">) {
  return theorem.proofStatus === "scaffold-ready" || !theorem.proofSteps?.length;
}

const theoremToProofCategory: Record<string, string[]> = {
  algebra: ["algebraic-identities", "inequalities", "logarithms-exponents"],
  geometry: ["geometry", "mensuration", "transformations-symmetry"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry", "conic-sections", "transformations-symmetry"],
  "calculus-analysis": ["calculus", "engineering-mathematics"],
  "number-theory": ["number-theory"],
  "probability-statistics": ["probability", "statistics"],
  "linear-algebra-vectors": ["matrices-linear-algebra", "vectors"],
  "complex-numbers": ["complex-numbers"],
  "discrete-logic": ["sequences-and-series", "number-theory"],
  "graph-theory": ["engineering-mathematics"],
  "optimization-engineering": ["engineering-mathematics", "calculus"],
};

const theoremToFormulaCategory: Record<string, string[]> = {
  algebra: ["algebra", "polynomials", "inequalities", "relations-functions", "precalculus"],
  geometry: ["geometry", "euclidean-geometry-theorems", "mensuration-units"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry", "analytic-geometry-advanced", "three-d-geometry"],
  "calculus-analysis": ["limits-continuity", "derivatives", "integrals", "differential-equations", "multivariable-calculus"],
  "number-theory": ["number-systems", "olympiad-number-theory", "cryptography-math"],
  "probability-statistics": ["probability", "statistics", "probability-distributions"],
  "linear-algebra-vectors": ["matrices", "determinants", "vectors", "linear-algebra-advanced"],
  "complex-numbers": ["complex-numbers", "complex-analysis"],
  "discrete-logic": ["combinatorics", "set-theory-logic", "discrete-math", "sequences-series"],
  "graph-theory": ["discrete-math", "combinatorics"],
  "optimization-engineering": ["optimization", "linear-programming", "numerical-methods", "fourier-laplace-transforms", "pde"],
};

const stopWords = new Set([
  "theorem",
  "rule",
  "identity",
  "formula",
  "criterion",
  "principle",
  "law",
  "test",
  "for",
  "and",
  "with",
  "from",
  "into",
  "that",
  "this",
  "exactly",
  "every",
  "function",
  "functions",
]);

function getRelatedLearningLinks(theorem: TheoremLibraryItem, category: TheoremCategory): RelatedLearningLinks {
  const curated = getCuratedTheoremLearningLinks(category.id, theorem.title);
  const tokens = getSearchTokens([theorem.title, theorem.subtopic, theorem.statement, theorem.prerequisites.join(" ")]);
  const visualCategoryHints = new Set(theoremToProofCategory[category.id] ?? []);
  const formulaCategoryHints = new Set(theoremToFormulaCategory[category.id] ?? []);

  const heuristicVisualProofs = visualProofsIndex
    .filter((proof) => proof.status === "available")
    .map((proof) => ({
      proof,
      score:
        scoreText(tokens, [proof.title, proof.shortDescription, proof.longDescription, proof.tags.join(" "), proof.prerequisites.join(" ")]) +
        (visualCategoryHints.has(proof.categorySlug) ? 4 : 0),
    }))
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ proof }) => ({ title: proof.title, route: proof.route, categorySlug: proof.categorySlug }));

  const heuristicFormulas = formulaCategories
    .flatMap((formulaCategory) =>
      formulaCategory.formulas.map((formula) => ({
        ...formula,
        category: formulaCategory,
        route: `/formulas/${formulaCategory.id}`,
        score:
          scoreText(tokens, [formula.title, formula.formula, formula.note, formulaCategory.title, formulaCategory.description]) +
          (formulaCategoryHints.has(formulaCategory.id) ? 3 : 0),
      })),
    )
    .filter((match) => match.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...formula }) => formula);

  const heuristicTheorems = theoremCategories
    .flatMap((theoremCategory) =>
      theoremCategory.theorems.map((candidate) => ({
        ...candidate,
        category: theoremCategory,
        route: `/theorems/${theoremCategory.id}/${candidate.slug}`,
        score:
          scoreText(tokens, [candidate.title, candidate.subtopic, candidate.statement, candidate.prerequisites.join(" ")]) +
          (theoremCategory.id === category.id ? 2 : 0),
      })),
    )
    .filter((candidate) => candidate.slug !== theorem.slug && candidate.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...candidate }) => candidate);

  return {
    formulas: uniqueRelatedByRoute([...curated.formulas, ...heuristicFormulas]).slice(0, 3),
    visualProofs: uniqueRelatedByRoute([...curated.visualProofs, ...heuristicVisualProofs]).slice(0, 3),
    theorems: uniqueRelatedByRoute([...curated.theorems, ...heuristicTheorems]).slice(0, 3),
  };
}

function uniqueRelatedByRoute<T extends { route: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.route, item])).values());
}

function getSearchTokens(parts: string[]) {
  return Array.from(
    new Set(
      parts
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3 && !stopWords.has(token)),
    ),
  );
}

function scoreText(tokens: string[], parts: string[]) {
  const haystack = parts.join(" ").toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}
