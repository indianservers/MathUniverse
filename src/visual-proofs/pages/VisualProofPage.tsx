import { Suspense, lazy, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import FormulaPanel from "../components/FormulaPanel";
import StepPanel from "../components/StepPanel";
import VisualProofLayout from "../components/VisualProofLayout";
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
    </Suspense>
  );
}

function ComingSoonProof({ category, proof }: { category: NonNullable<ReturnType<typeof getVisualProofCategory>>; proof: NonNullable<ReturnType<typeof getVisualProof>> }) {
  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={
        <div className="flex min-h-[360px] items-center justify-center bg-slate-950 p-6 text-center text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Coming soon</p>
            <h2 className="mt-3 text-3xl font-black">Dedicated proof route reserved</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-cyan-50/75">
              This page is intentionally route-ready so future visual proofs can be added without changing the architecture.
            </p>
          </div>
        </div>
      }
      controls={<PlaceholderPanel title="Controls" body="Interactive controls will appear here when this proof is implemented." />}
      steps={
        <StepPanel
          activeStep={0}
          steps={[
            {
              id: "planned",
              title: "Proof planned",
              description: "This proof is included in the index and will receive its own SVG or canvas visualization in a later phase.",
              focusLabel: "planned",
            },
          ]}
        />
      }
      formula={<FormulaPanel formulas={["Detailed derivation coming soon"]} />}
      conceptNotes={<p>This placeholder keeps the route, metadata, and page layout consistent while the proof library grows.</p>}
      reflectionQuestions={["Which visual transformation would make this proof easiest to understand?", "What prerequisite idea should be shown first?"]}
    />
  );
}

function ProofRouteLoadingFallback({ title }: { title: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-6 dark:border-white/10 dark:bg-white/[0.05]">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Loading proof</p>
      <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{title}</h1>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-cyan-500" />
      </div>
    </section>
  );
}

function PlaceholderPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
    </section>
  );
}
