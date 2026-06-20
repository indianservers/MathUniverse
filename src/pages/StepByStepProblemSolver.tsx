import katex from "katex";
import { useMemo, useState } from "react";
import SmartMathInput from "../components/math-input/SmartMathInput";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, PresetChips, PrintWorksheetButton, RelatedToolLinks, ResetExampleButton } from "../components/ui/UiFeedback";
import { MathRecognitionPanel } from "../problem-solver/intelligence/MathRecognitionPanel";
import { recognizeMathInput } from "../problem-solver/intelligence/mathRecognizer";
import { ProblemGraph, ValueTablePanel } from "../problem-solver/ProblemGraph";
import { buildVisualVerification } from "../problem-solver/graphingUtils";
import { solveProblem } from "../problem-solver/problemSolverEngine";
import { buildProblemResultCards, type ProblemResultCard } from "../problem-solver/resultCards";
import type { ProblemIntentKind, ProblemSolverResult } from "../problem-solver/problemTypes";
import type { SolverResult } from "../problem-solver/types/solverResult";
import { symbolicLatex } from "../utils/symbolic";
import { buildProblemSolverWorkspaceObjects } from "../workspace/universalObjectGraph";
import { useUniversalObjectGraphPublisher } from "../workspace/useUniversalObjectGraphPublisher";

const examples = ["sqrt(34)", "sqrt(34) + tan(45)", "sqrt 34", "sin 30", "Laplace transform of sin(t)", "Fourier series of x", "Newton Raphson method", "A train travels 60 km in 2 hours", "A car travels at 50 km/h for 3 hours", "Percent increase from 50 to 60", "Rectangle length 8 width 5 area", "Circle radius 7 circumference", "Ratio of 12 to 18", "Simple interest principal 5000 rate 8 time 2 years", "120 for 6 notebooks", "apple mango x + 2", "sin(30) + cos(60)", "log(100)", "ln(e)", "sqrt(-1)", "log(0)", "sqrt(x-2)", "derivative of sin(x)", "integrate x^2", "limit x->0 sin(x)/x", "mean of 4, 6, 8, 10", "determinant [[1,2],[3,4]]", "2x + 5 = 15", "0x + 5 = 5", "0x + 5 = 8", "x + 1 = x + 2", "x^2 - 5x + 6 = 0", "x^2 - 2x + 1 = 0", "2*x+5=11", "x^2-5*x+6=0", "(x^2 - 1)/(x - 1) = 0", "simplify (x^2 - 1)/(x - 1)", "factor x^2 - 5x + 6", "expand (x+1)^2", "2 + 3 * 4", "sum 2, 3, 4", "add 12 18 30", "multiply 7 and 8", "mul 6 9", "subtract 3 from 10", "divide 100 by 4", "mod 17 5", "power 2 to 3", "square 12", "cube 5", "reciprocal 8", "15% of 200", "percent 12.5 of 640", "gcd 48 180", "lcm 12 18", "minimum 9, 4, 12", "maximum 9, 4, 12", "factorial 6", "sin(30)", "derivative of x^2", "derivative of x^3 + 2x", "differentiate x^2 + 5x + 6", "integrate x from 0 to 2", "integrate 2x", "integral of x^2 + 3x", "limit x->2 x^2 + 1", "lim x->0 sin(x)/x", "solve 2x + y = 7 and x - y = 2", "2x + 3y = 12; x - y = 1", "x + y + z = 6; 2x - y + z = 3; x + 2y - z = 2", "x + y = 2; x + y = 3", "x + y = 2; 2x + 2y = 4", "x^2 + y = 5; x + y = 3", "median of 4, 6, 8, 10", "mode of 2, 3, 3, 5", "variance of 4, 6, 8, 10", "sample variance of 4", "standard deviation of 4, 6, 8, 10", "quartiles of 2, 4, 6, 8, 10", "frequency table of 1, 2, 2, 3, 3, 3", "weighted mean values 80, 90, 100 weights 2, 3, 5", "[[1,2],[3,4]]", "inverse [[1,2],[3,4]]", "inverse [[1,2],[2,4]]", "transpose [[1,2],[3,4]]", "[[1,2],[3,4]] + [[5,6],[7,8]]", "[[1,2],[3,4]] * [[5,6],[7,8]]", "solve matrix [[2,1,7],[1,-1,2]]"];
const equationKinds: ProblemIntentKind[] = ["linear-equation", "quadratic-equation", "polynomial-equation"];

export default function StepByStepProblemSolver() {
  const [equation, setEquation] = useState("2*x+5=17");
  const trustedOutput = useMemo(() => solveProblem(equation), [equation]);
  const { classification, result: solverResult, trust } = trustedOutput;
  const recognition = useMemo(() => recognizeMathInput(equation, labelForKind(classification.kind), classification.assumptions, classification.warnings), [equation, classification]);
  const visual = useMemo(() => buildVisualVerification(classification, solverResult), [classification, solverResult]);
  const cards = useMemo(() => buildProblemResultCards(classification, solverResult, visual), [classification, solverResult, visual]);
  const workspaceObjects = useMemo(() => buildProblemSolverWorkspaceObjects({
    input: equation,
    problemType: classification.kind,
    confidence: classification.confidence,
    method: solverResult.method,
    finalAnswer: solverResult.result,
    assumptions: solverResult.assumptions,
    restrictions: solverResult.restrictions,
    warnings: solverResult.warnings,
    steps: solverResult.steps,
    visual: visual ? {
      title: visual.title,
      description: visual.description,
      curves: visual.curves.map((curve) => ({ expression: curve.expression, label: curve.label, color: curve.color })),
      markers: visual.markers.map((marker) => ({ label: marker.label, x: marker.x, y: marker.y })),
      table: visual.table.map((row) => ({ x: row.x, y: row.y })),
    } : null,
  }), [classification.confidence, classification.kind, equation, solverResult, visual]);
  useUniversalObjectGraphPublisher("problem-solver", workspaceObjects);

  return (
    <div className="space-y-6">
      <TopicHeader title="Step-by-Step Problem Solver" subtitle="Enter an equation and inspect the algebraic path with Nerdamer-backed exact math." difficulty="Algebra Tool" estimatedMinutes={7} />
      <SectionCard title="Equation Input" description="Use Ctrl/Cmd+Enter in keyboard-enabled inputs elsewhere; here the solver updates as you type.">
        <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
          <CopyResultButton value={solverResult.canCopy ? solverResult.result : undefined} />
          <ResetExampleButton onClick={() => setEquation("2*x+5=11")} />
          <PrintWorksheetButton />
          <RelatedToolLinks links={[{ label: "Calculator", route: "/calculator" }, { label: "Equation Solver", route: "/math-lab/equation-solver" }]} />
        </div>
        <SmartMathInput ariaLabel="Smart math problem editor" mode="math" placeholder="Type: sum 2, 3, 4 or expand (x+1)^2" value={equation} onChange={setEquation} />
      </SectionCard>
      <ResultWorkspace cards={cards} result={solverResult} trust={trust} visual={visual} />
      <SolverReferencePanels recognition={recognition} onSelectExample={setEquation} />
    </div>
  );
}

function SolverReferencePanels({ recognition, onSelectExample }: { recognition: ReturnType<typeof recognizeMathInput>; onSelectExample: (value: string) => void }) {
  return (
    <section className="space-y-3">
      <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
        <summary className="cursor-pointer text-sm font-black text-slate-950 dark:text-white">Examples and recent inputs</summary>
        <div className="mt-4">
          <PresetChips examples={examples} onSelect={onSelectExample} />
        </div>
      </details>
      <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
        <summary className="cursor-pointer text-sm font-black text-slate-950 dark:text-white">Recognition, suggestions, and debug audit</summary>
        <MathRecognitionPanel result={recognition} />
      </details>
    </section>
  );
}

function ResultWorkspace({ cards, result, trust, visual }: { cards: ProblemResultCard[]; result: ProblemSolverResult; trust: SolverResult; visual: ReturnType<typeof buildVisualVerification> }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Wolfram-style Workspace</p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Result Cards</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TrustBadge trust={trust} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{cards.length} relevant cards</span>
        </div>
      </div>
      <TrustSummary trust={trust} />
      <div className="grid gap-4">
        {cards.map((card) => <ResultCard key={card.id} card={card} result={result} visual={visual} />)}
      </div>
      {trust.confidence === "unsupported" && <UnsupportedSuggestions reason={trust.unsupportedReason} />}
    </section>
  );
}

function TrustBadge({ trust }: { trust: SolverResult }) {
  const styles: Record<SolverResult["confidence"], string> = {
    ambiguous: "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100",
    error: "bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-100",
    "partially-supported": "bg-violet-50 text-violet-800 dark:bg-violet-400/10 dark:text-violet-100",
    unsupported: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
    verified: "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${styles[trust.confidence]}`}>{trust.confidence.replace(/-/g, " ")}</span>;
}

function TrustSummary({ trust }: { trust: SolverResult }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-3 md:grid-cols-3">
        <TrustTile label="Trust status" value={trust.confidence.replace(/-/g, " ")} />
        <TrustTile label="Verification" value={`${trust.verification?.method ?? "Not available"}${trust.verification?.passed ? " passed" : ""}`} />
        <TrustTile label="Solver family" value={trust.metadata?.solverFamily ?? "Safe gate"} />
      </div>
      {trust.unsupportedReason ? <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{trust.unsupportedReason}</p> : null}
      {trust.verification?.notes?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {trust.verification.notes.map((note) => <span key={note} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">{note}</span>)}
        </div>
      ) : null}
    </div>
  );
}

function TrustTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/40">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black capitalize text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ResultCard({ card, result, visual }: { card: ProblemResultCard; result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification> }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950 dark:text-white">{card.title}</h3>
        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black uppercase text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{card.type.replace(/-/g, " ")}</span>
      </div>
      {card.type === "visual" && visual ? <ProblemGraph visual={visual} showTable={false} /> : null}
      {card.type === "table" && visual ? <ValueTablePanel visual={visual} /> : null}
      {card.type === "steps" && Array.isArray(card.content) ? <StepList items={card.content} /> : null}
      {card.type === "verification" && Array.isArray(card.content) ? <StepList items={card.content} startLabel="Check" /> : null}
      {card.type === "final-answer" && typeof card.content === "string" ? (
        <div className="rounded-xl bg-cyan-50 p-4 dark:bg-cyan-400/10">
          {equationKinds.includes(result.kind) ? <RenderedMath value={card.content} /> : <p className="break-words font-mono text-sm font-black text-cyan-950 dark:text-cyan-100">{card.content}</p>}
        </div>
      ) : null}
      {card.type !== "visual" && card.type !== "table" && card.type !== "steps" && card.type !== "verification" && card.type !== "final-answer" ? <CardContent content={card.content} /> : null}
    </section>
  );
}

function StepList({ items, startLabel = "Step" }: { items: string[]; startLabel?: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/40">
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{startLabel} {index + 1}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{item}</p>
        </div>
      ))}
    </div>
  );
}

function CardContent({ content }: { content: ProblemResultCard["content"] }) {
  if (typeof content === "string") return <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{content}</p>;
  if (Array.isArray(content)) {
    return (
      <div className="flex flex-wrap gap-2">
        {content.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">{item}</span>)}
      </div>
    );
  }
  const entries = Object.entries(content).filter(([, value]) => value !== undefined && value !== "");
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
          <p className="mt-1 break-words font-mono text-sm font-bold text-slate-900 dark:text-white">{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function RenderedMath({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(symbolicLatex(value), { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

function UnsupportedSuggestions({ reason }: { reason?: string }) {
  const suggestions = ["2x + 5 = 15", "simplify (x^2 - 1)/(x - 1)", "derivative of x^3 + 2x", "mean of 4, 6, 8, 10"];
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/30 dark:bg-amber-400/10">
      <p className="font-black text-amber-900 dark:text-amber-100">This problem type is not yet supported.</p>
      {reason ? <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">{reason}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => <span key={suggestion} className="mini-chip bg-white/80 text-amber-900 dark:bg-white/10 dark:text-amber-100">{suggestion}</span>)}
      </div>
    </div>
  );
}

function labelForKind(kind: ProblemIntentKind) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
