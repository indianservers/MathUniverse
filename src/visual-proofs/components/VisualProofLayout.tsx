import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Eye, Lightbulb, MousePointer2, Play, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { MathText } from "../../components/ui/MathExpression";
import type { VisualProof, VisualProofCategory } from "../data/proofTypes";
import { getAdjacentVisualProofs } from "../data/visualProofsIndex";
import ProofExplanationPanel from "./ProofExplanationPanel";

type VisualProofLayoutProps = {
  category: VisualProofCategory;
  proof: VisualProof;
  visual: ReactNode;
  controls: ReactNode;
  steps: ReactNode;
  symbolLegend?: ReactNode;
  formula: ReactNode;
  conceptNotes: ReactNode;
  reflectionQuestions: string[];
};

export default function VisualProofLayout({
  category,
  proof,
  visual,
  controls,
  steps,
  symbolLegend,
  formula,
  conceptNotes,
  reflectionQuestions,
}: VisualProofLayoutProps) {
  const adjacent = getAdjacentVisualProofs(proof.id);

  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link to="/visual-proofs" className="hover:text-cyan-700 dark:hover:text-cyan-200">Visual Proofs</Link>
        <span>/</span>
        <Link to={`/visual-proofs/${category.slug}`} className="hover:text-cyan-700 dark:hover:text-cyan-200">{category.title}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-100"><MathText value={proof.title} /></span>
      </nav>

      <section className="rounded-xl border border-cyan-200/30 bg-slate-950 p-4 text-white shadow-2xl shadow-cyan-950/20 lg:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Interactive visual proof</p>
            <h1 className="mt-2 max-w-5xl text-3xl font-black sm:text-4xl">
              <MathText value={proof.title} mathClassName="text-[0.92em]" />
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-cyan-50/75">{proof.longDescription}</p>
            <div className="mt-4 grid gap-2 text-sm font-bold text-slate-950 sm:grid-cols-3">
              <LearningPill icon={<Eye className="h-4 w-4" />} title="First look" text="Name the shape, point, area, or number being shown." />
              <LearningPill icon={<MousePointer2 className="h-4 w-4" />} title="Then move" text="Change one control and watch only one idea at a time." />
              <LearningPill icon={<Lightbulb className="h-4 w-4" />} title="Finally say why" text="Explain what stayed equal before reading the formula." />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">{proof.difficulty}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-cyan-50">
              <Clock3 className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {proof.estimatedTime}
            </span>
          </div>
        </div>
      </section>

      <ProofExplanationPanel proof={proof} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <section className="grid gap-2 rounded-xl border border-cyan-200 bg-cyan-50/85 p-3 text-sm font-black text-cyan-950 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50 sm:grid-cols-3" aria-label="How to interact with this proof">
            <div className="flex items-center gap-2 rounded-lg bg-white/75 px-3 py-2 dark:bg-slate-950/35">
              <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
              Press Play for the story.
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/75 px-3 py-2 dark:bg-slate-950/35">
              <MousePointer2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Drag bright parts slowly.
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/75 px-3 py-2 dark:bg-slate-950/35">
              <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
              Watch what stays equal.
            </div>
          </section>
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/50" aria-label="Interactive visual area">
            {visual}
          </section>
          {symbolLegend}
          <div className="grid gap-4 lg:grid-cols-2">
            {formula}
            <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <h2 className="text-base font-black text-slate-950 dark:text-white">Why this works</h2>
              <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{conceptNotes}</div>
            </section>
          </div>
          <section className="rounded-xl border border-cyan-200/70 bg-cyan-50/80 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <h2 className="text-base font-black text-cyan-950 dark:text-cyan-50">Proof check</h2>
            <div className="mt-3 grid gap-3 text-sm font-bold leading-6 text-cyan-950 dark:text-cyan-100 md:grid-cols-3">
              <CheckCard title="Same object" text="The diagram begins with the exact shape or quantity named in the formula." />
              <CheckCard title="Same value" text="Every move keeps the important count, area, length, angle, or ratio unchanged." />
              <CheckCard title="Easier ending" text="The final picture is easier to count, so the formula follows." />
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Practice and reflection</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {reflectionQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>
        </main>
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          {controls}
          {steps}
          <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Next / previous</h2>
            <div className="mt-3 grid gap-2">
              {adjacent.previous ? (
                <Link to={adjacent.previous.route} className="action-secondary rounded-xl">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous proof
                </Link>
              ) : (
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">No previous proof yet</span>
              )}
              {adjacent.next ? (
                <Link to={adjacent.next.route} className="action-secondary rounded-xl">
                  Next proof <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">No next proof yet</span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function LearningPill({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-white/90 p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700">
        {icon}
        {title}
      </div>
      <p className="mt-1.5 leading-5 text-slate-700">{text}</p>
    </div>
  );
}

function CheckCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-white/75 p-3 dark:bg-slate-950/35">
      <p className="flex items-center gap-2 text-sm font-black">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-5">{text}</p>
    </div>
  );
}
