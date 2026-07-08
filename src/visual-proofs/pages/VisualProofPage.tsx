import { Suspense, lazy, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { formulaCategories } from "../../data/formulaLibrary";
import { theoremCategories } from "../../data/theoremLibrary";
import { GuidedScaffoldPanel, TeacherNotes } from "../../components/ui/LearningScaffolds";
import FormulaPanel from "../components/FormulaPanel";
import StepPanel from "../components/StepPanel";
import VisualProofLayout from "../components/VisualProofLayout";
import { MathText } from "../../components/ui/MathExpression";
import { getCuratedVisualProofLearningLinks } from "../../proof-explanations/proofLearningLinks";
import { getVisualProofCategory } from "../data/visualProofCategories";
import { getVisualProof } from "../data/visualProofsIndex";
import { loadVisualProofComponent } from "../proofs/loadVisualProofComponent";

export default function VisualProofPage() {
  const { categorySlug = "", proofSlug = "" } = useParams();
  const category = getVisualProofCategory(categorySlug);
  const proof = getVisualProof(categorySlug, proofSlug);

  if (!category || !proof) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white/88 p-6 dark:border-white/10 dark:bg-white/[0.05]">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Proof not found</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This proof route is not registered in the Visual Proofs index.
        </p>
        <Link to="/visual-proofs" className="action-primary mt-4 rounded-xl">Open Visual Proofs</Link>
      </section>
    );
  }

  return (
    <LazyVisualProofRoute category={category} proof={proof} />
  );
}

function LazyVisualProofRoute({ category, proof }: { category: NonNullable<ReturnType<typeof getVisualProofCategory>>; proof: NonNullable<ReturnType<typeof getVisualProof>> }) {
  const LazyProof = useMemo(
    () =>
      lazy(async () => {
        const componentModule = await loadVisualProofComponent(category.slug, proof.componentKey);
        return componentModule ?? { default: ComingSoonProof };
      }),
    [category.slug, proof.componentKey],
  );

  return (
    <Suspense fallback={<ProofRouteLoadingFallback title={proof.title} />}>
      <LazyProof category={category} proof={proof} />
      <VisualProofLearningBridge proof={proof} />
    </Suspense>
  );
}

function VisualProofLearningBridge({ proof }: { proof: NonNullable<ReturnType<typeof getVisualProof>> }) {
  const related = useMemo(() => getRelatedProofLinks(proof), [proof]);
  if (related.formulas.length === 0 && related.theorems.length === 0) return null;

  return (
    <section className="mx-auto my-4 w-full max-w-7xl rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/90">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Connected learning</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Related Theorems</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.theorems.map((theorem) => (
              <Link
                key={theorem.route}
                className="rounded-md bg-white px-2 py-1.5 text-sm font-black text-slate-700 transition hover:text-cyan-700 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:text-cyan-100"
                to={theorem.route}
              >
                {theorem.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Related Formulas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.formulas.map((formula) => (
              <Link
                key={`${formula.route}-${formula.title}`}
                className="rounded-md bg-white px-2 py-1.5 text-sm font-black text-slate-700 transition hover:text-cyan-700 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:text-cyan-100"
                to={formula.route}
              >
                {formula.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComingSoonProof({ category, proof }: { category: NonNullable<ReturnType<typeof getVisualProofCategory>>; proof: NonNullable<ReturnType<typeof getVisualProof>> }) {
  const scaffoldSteps = [
    {
      id: "read-claim",
      title: "Read the proof claim",
      description: `Start from the title and description. Identify what ${proof.title.toLowerCase()} is trying to prove or make visible.`,
      focusLabel: "claim",
    },
    {
      id: "name-prerequisites",
      title: "Name the prerequisite ideas",
      description: `Use ${proof.prerequisites.join(", ") || "the core definitions"} before expecting the visual to make sense.`,
      focusLabel: "prerequisites",
    },
    {
      id: "predict-visual",
      title: "Predict the first diagram",
      description: "Sketch or describe the diagram you expect: a shape, graph, number pattern, transformation, or measurement scene.",
      focusLabel: "expected visual",
    },
    {
      id: "connect-formula",
      title: "Connect to symbols",
      description: "Match each important object in the diagram to a formula symbol, label, or invariant that should stay true.",
      focusLabel: "symbols",
    },
    {
      id: "write-next-action",
      title: "Write the build task",
      description: "Before the custom interactive proof lands, state the next build action: which control, animation, or comparison would prove the idea most clearly.",
      focusLabel: "next build",
    },
  ];

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={
        <div className="min-h-[360px] bg-slate-950 p-6 text-white">
          <div className="mx-auto grid h-full max-w-5xl gap-5 md:grid-cols-[minmax(0,1fr)_300px] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-violet-200">Scaffold-ready proof route</p>
              <h2 className="mt-3 text-3xl font-black leading-tight"><MathText value={proof.title} /></h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-200">
                A custom animation is still pending, but this route now shows the learning goal, prerequisite ideas, symbol plan, and build-ready proof sequence.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {["Claim", "Diagram", "Invariant"].map((label, index) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/10 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-cyan-200">Step {index + 1}</p>
                    <p className="mt-1 text-lg font-black">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-cyan-100">What this page needs next</p>
              <ul className="mt-3 grid gap-2 text-sm font-bold leading-5 text-cyan-50">
                <li>- A custom animated diagram.</li>
                <li>- Live labels for each symbol.</li>
                <li>- A check question after each transformation.</li>
              </ul>
            </div>
          </div>
        </div>
      }
      controls={
        <GuidedScaffoldPanel
          title="Before the custom visual is built"
          goal={`Understand what ${proof.title} should prove and which visual evidence would make it convincing.`}
          notice={proof.shortDescription}
          tryIt="Sketch the first diagram and label every known value before reading the formula."
          explain="Say what should stay unchanged as the diagram moves or rearranges."
          checks={["The claim is written in plain words.", "Every symbol has a visible meaning.", "The final step explains why the formula follows."]}
        />
      }
      steps={
        <StepPanel
          activeStep={0}
          steps={scaffoldSteps}
        />
      }
      formula={<FormulaPanel formulas={[proof.title, proof.prerequisites[0] ? `uses ${proof.prerequisites[0]}` : "uses core definitions", "visual evidence -> theorem statement"]} />}
      conceptNotes={
        <div className="space-y-3">
          <p>This scaffold keeps the route useful while the dedicated SVG, canvas, or HTML proof is being built.</p>
          <TeacherNotes
            objective={`Prepare students to understand ${proof.title} before the custom interactive visual is available.`}
            prerequisite={proof.prerequisites.join(", ") || "Core definitions"}
            prompt="Which part of the statement should be visible first, and what should stay unchanged?"
            misconception="Students may treat a placeholder as empty; use the scaffold to make them predict the proof structure."
            extension="Ask learners to propose the first draggable control or animation frame."
          />
        </div>
      }
      reflectionQuestions={["Which visual transformation would make this proof easiest to understand?", "What prerequisite idea should be shown first?", "What label or value must be visible so the proof is not confusing?"]}
    />
  );
}

function ProofRouteLoadingFallback({ title }: { title: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-6 dark:border-white/10 dark:bg-white/[0.05]">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Loading proof</p>
      <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white"><MathText value={title} /></h1>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-cyan-500" />
      </div>
    </section>
  );
}

const proofToFormulaCategory: Record<string, string[]> = {
  geometry: ["geometry", "euclidean-geometry-theorems", "mensuration-units"],
  "algebraic-identities": ["algebra", "polynomials"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry", "analytic-geometry-advanced"],
  calculus: ["limits-continuity", "derivatives", "integrals"],
  "number-theory": ["number-systems", "olympiad-number-theory"],
  probability: ["probability", "probability-distributions"],
  statistics: ["statistics"],
  "matrices-linear-algebra": ["matrices", "determinants", "linear-algebra-advanced"],
  vectors: ["vectors", "three-d-geometry"],
  "complex-numbers": ["complex-numbers", "complex-analysis"],
  mensuration: ["geometry", "mensuration-units"],
  "conic-sections": ["coordinate-geometry", "analytic-geometry-advanced"],
  inequalities: ["inequalities", "algebra"],
  "logarithms-exponents": ["number-systems", "precalculus"],
  "transformations-symmetry": ["geometry", "coordinate-geometry"],
  "engineering-mathematics": ["linear-programming", "optimization", "fourier-laplace-transforms", "differential-equations"],
  "sequences-and-series": ["sequences-series", "combinatorics"],
};

const proofToTheoremCategory: Record<string, string[]> = {
  geometry: ["geometry"],
  "algebraic-identities": ["algebra"],
  trigonometry: ["trigonometry"],
  "coordinate-geometry": ["coordinate-geometry"],
  calculus: ["calculus-analysis"],
  "number-theory": ["number-theory"],
  probability: ["probability-statistics"],
  statistics: ["probability-statistics"],
  "matrices-linear-algebra": ["linear-algebra-vectors"],
  vectors: ["linear-algebra-vectors"],
  "complex-numbers": ["complex-numbers"],
  mensuration: ["geometry"],
  "conic-sections": ["coordinate-geometry"],
  inequalities: ["algebra", "optimization-engineering"],
  "logarithms-exponents": ["algebra"],
  "transformations-symmetry": ["geometry", "coordinate-geometry"],
  "engineering-mathematics": ["optimization-engineering", "calculus-analysis"],
  "sequences-and-series": ["discrete-logic", "calculus-analysis"],
};

const proofLinkStopWords = new Set(["proof", "visual", "theorem", "formula", "identity", "using", "with", "from", "into", "that", "this"]);

function getRelatedProofLinks(proof: NonNullable<ReturnType<typeof getVisualProof>>) {
  const curated = getCuratedVisualProofLearningLinks(proof.route);
  const tokens = getProofTokens([proof.title, proof.shortDescription, proof.longDescription, proof.tags.join(" "), proof.prerequisites.join(" ")]);
  const formulaHints = new Set(proofToFormulaCategory[proof.categorySlug] ?? []);
  const theoremHints = new Set(proofToTheoremCategory[proof.categorySlug] ?? []);

  const heuristicFormulas = formulaCategories
    .flatMap((formulaCategory) =>
      formulaCategory.formulas.map((formula) => ({
        ...formula,
        route: `/formulas/${formulaCategory.id}`,
        score:
          scoreProofText(tokens, [formula.title, formula.formula, formula.note, formulaCategory.title, formulaCategory.description]) +
          (formulaHints.has(formulaCategory.id) ? 3 : 0),
      })),
    )
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ score: _score, ...formula }) => formula);

  const heuristicTheorems = theoremCategories
    .flatMap((theoremCategory) =>
      theoremCategory.theorems.map((theorem) => ({
        ...theorem,
        route: `/theorems/${theoremCategory.id}/${theorem.slug}`,
        score:
          scoreProofText(tokens, [theorem.title, theorem.subtopic, theorem.statement, theorem.prerequisites.join(" ")]) +
          (theoremHints.has(theoremCategory.id) ? 3 : 0),
      })),
    )
    .filter((match) => match.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ score: _score, ...theorem }) => theorem);

  return {
    formulas: uniqueRelatedByRoute([...curated.formulas, ...heuristicFormulas]).slice(0, 4),
    theorems: uniqueRelatedByRoute([...curated.theorems, ...heuristicTheorems]).slice(0, 4),
  };
}

function uniqueRelatedByRoute<T extends { route: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.route, item])).values());
}

function getProofTokens(parts: string[]) {
  return Array.from(
    new Set(
      parts
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3 && !proofLinkStopWords.has(token)),
    ),
  );
}

function scoreProofText(tokens: string[], parts: string[]) {
  const haystack = parts.join(" ").toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}
