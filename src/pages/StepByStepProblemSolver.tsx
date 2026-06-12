import katex from "katex";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, PresetChips, PrintWorksheetButton, RelatedToolLinks, ResetExampleButton } from "../components/ui/UiFeedback";
import { solveAlgebraSteps } from "../problem-solver/algebraStepSolver";
import { solveCalculus } from "../problem-solver/calculusSolver";
import { solveExpressionOperation } from "../problem-solver/expressionOperationSolver";
import { solveMatrix } from "../problem-solver/matrixSolver";
import { MathTokenHighlighter } from "../problem-solver/MathTokenHighlighter";
import { recognizeMathKeywords } from "../problem-solver/mathKeywordRecognizer";
import { buildMathSuggestions, detectEducationLevel } from "../problem-solver/mathSuggestions";
import { classifyProblem } from "../problem-solver/problemClassifier";
import { ProblemGraph, ValueTablePanel } from "../problem-solver/ProblemGraph";
import { solveStatistics } from "../problem-solver/statisticsSolver";
import { solveSystem } from "../problem-solver/systemSolver";
import { buildVisualVerification } from "../problem-solver/graphingUtils";
import { buildProblemResultCards, type ProblemResultCard } from "../problem-solver/resultCards";
import type { ProblemClassification, ProblemIntentKind, ProblemSolverResult } from "../problem-solver/problemTypes";
import { symbolicLatex, symbolicSolve, trySymbolic } from "../utils/symbolic";

const examples = ["sqrt(34)", "sqrt(34) + tan(45)", "sqrt 34", "sin 30", "Laplace transform of sin(t)", "Fourier series of x", "Newton Raphson method", "A train travels 60 km in 2 hours", "apple mango x + 2", "sin(30) + cos(60)", "log(100)", "ln(e)", "derivative of sin(x)", "integrate x^2", "limit x->0 sin(x)/x", "mean of 4, 6, 8, 10", "determinant [[1,2],[3,4]]", "2x + 5 = 15", "x^2 - 5x + 6 = 0", "2*x+5=11", "x^2-5*x+6=0", "(x^2 - 1)/(x - 1) = 0", "simplify (x^2 - 1)/(x - 1)", "factor x^2 - 5x + 6", "expand (x+1)^2", "2 + 3 * 4", "sin(30)", "derivative of x^2", "derivative of x^3 + 2x", "differentiate x^2 + 5x + 6", "integrate x from 0 to 2", "integrate 2x", "integral of x^2 + 3x", "limit x->2 x^2 + 1", "lim x->0 sin(x)/x", "solve 2x + y = 7 and x - y = 2", "2x + 3y = 12; x - y = 1", "x + y + z = 6; 2x - y + z = 3; x + 2y - z = 2", "x + y = 2; x + y = 3", "x + y = 2; 2x + 2y = 4", "x^2 + y = 5; x + y = 3", "median of 4, 6, 8, 10", "mode of 2, 3, 3, 5", "variance of 4, 6, 8, 10", "standard deviation of 4, 6, 8, 10", "quartiles of 2, 4, 6, 8, 10", "frequency table of 1, 2, 2, 3, 3, 3", "weighted mean values 80, 90, 100 weights 2, 3, 5", "[[1,2],[3,4]]", "inverse [[1,2],[3,4]]", "transpose [[1,2],[3,4]]", "[[1,2],[3,4]] + [[5,6],[7,8]]", "[[1,2],[3,4]] * [[5,6],[7,8]]", "solve matrix [[2,1,7],[1,-1,2]]"];
const equationKinds: ProblemIntentKind[] = ["linear-equation", "quadratic-equation", "polynomial-equation"];

export default function StepByStepProblemSolver() {
  const [equation, setEquation] = useState("2*x+5=17");
  const classification = useMemo(() => classifyProblem(equation), [equation]);
  const recognizedTokens = useMemo(() => recognizeMathKeywords(equation), [equation]);
  const mathSuggestions = useMemo(() => buildMathSuggestions(equation, recognizedTokens), [equation, recognizedTokens]);
  const educationLevel = useMemo(() => detectEducationLevel(recognizedTokens), [recognizedTokens]);
  const solverResult = useMemo(() => buildSolverResult(classification), [classification]);
  const visual = useMemo(() => buildVisualVerification(classification, solverResult), [classification, solverResult]);
  const cards = useMemo(() => buildProblemResultCards(classification, solverResult, visual), [classification, solverResult, visual]);

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
        <input className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-lg dark:border-white/10 dark:bg-slate-950/60" value={equation} onChange={(event) => setEquation(event.target.value)} />
        <div className="mt-4"><PresetChips examples={examples} onSelect={setEquation} /></div>
        <MathTokenHighlighter tokens={recognizedTokens} classification={classification} suggestions={mathSuggestions} educationLevel={educationLevel} />
      </SectionCard>
      <ResultWorkspace cards={cards} result={solverResult} visual={visual} />
    </div>
  );
}

function ResultWorkspace({ cards, result, visual }: { cards: ProblemResultCard[]; result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification> }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Wolfram-style Workspace</p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Result Cards</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{cards.length} relevant cards</span>
      </div>
      <div className="grid gap-4">
        {cards.map((card) => <ResultCard key={card.id} card={card} result={result} visual={visual} />)}
      </div>
      {result.kind === "unsupported" && <UnsupportedSuggestions />}
    </section>
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

function MathStep({ index, text }: { index: number; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {index}</p><p className="mt-2 text-sm leading-6">{text}</p></div>;
}

function ResultSummary({ result }: { result: ProblemSolverResult }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <InfoTile label="Problem Type" value={result.title} />
      <InfoTile label="Method Used" value={result.method ?? "Safe classification"} />
      <InfoTile label="Final Answer" value={result.result ?? "No final answer yet"} mono />
      {result.restrictions?.length ? <ListTile title="Domain Restrictions" items={result.restrictions} fallback="No restrictions." warning /> : null}
      {result.warnings.length ? <ListTile title="Warnings" items={result.warnings} fallback="No warnings." warning /> : null}
    </div>
  );
}

function RenderedMath({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(symbolicLatex(value), { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ClassificationPanel({ classification }: { classification: ProblemClassification }) {
  return (
    <SectionCard title="Detected Problem Type" description="Phase 2 classifies intent before any solver is called.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InfoTile label="Type" value={labelForKind(classification.kind)} />
        <InfoTile label="Confidence" value={classification.confidence} />
        <InfoTile label="Normalized Input" value={classification.normalizedInput || "none"} mono />
        <InfoTile label="Reason" value={classification.reason} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ListTile title="Assumptions" items={classification.assumptions} fallback="No special assumptions." />
        <ListTile title="Warnings" items={classification.warnings} fallback="No warnings." warning />
      </div>
    </SectionCard>
  );
}

function InfoTile({ label, mono = false, value }: { label: string; mono?: boolean; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 break-words text-sm font-bold text-slate-900 dark:text-white ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function ListTile({ fallback, items, title, warning = false }: { fallback: string; items: string[]; title: string; warning?: boolean }) {
  const entries = items.length ? items : [fallback];
  return (
    <div className={`rounded-xl p-3 ${warning && items.length ? "bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100" : "bg-slate-100 dark:bg-white/10"}`}>
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="mt-2 space-y-1 text-sm font-semibold leading-5">
        {entries.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function UnsupportedSuggestions() {
  const suggestions = ["2x + 5 = 15", "simplify (x^2 - 1)/(x - 1)", "derivative of x^3 + 2x", "mean of 4, 6, 8, 10"];
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/30 dark:bg-amber-400/10">
      <p className="font-black text-amber-900 dark:text-amber-100">This problem type is not yet supported.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => <span key={suggestion} className="mini-chip bg-white/80 text-amber-900 dark:bg-white/10 dark:text-amber-100">{suggestion}</span>)}
      </div>
    </div>
  );
}

function buildSolverResult(classification: ProblemClassification): ProblemSolverResult {
  if (equationKinds.includes(classification.kind)) {
    const algebra = solveAlgebraSteps(classification.normalizedInput);
    if (algebra) {
      return {
        kind: classification.kind,
        method: algebra.method,
        title: algebra.kind === "rational" ? "Rational Equation" : labelForKind(classification.kind),
        normalizedInput: classification.normalizedInput,
        result: algebra.finalAnswer,
        restrictions: algebra.restrictions,
        steps: algebra.steps,
        assumptions: classification.assumptions,
        verification: algebra.verification,
        warnings: [...classification.warnings, ...algebra.warnings],
        canCopy: true,
      };
    }

    const solution = trySymbolic(() => symbolicSolve(classification.normalizedInput, classification.variable ?? "x"));
    if (solution) {
      return {
        kind: classification.kind,
        method: "CAS fallback",
        title: labelForKind(classification.kind),
        normalizedInput: classification.normalizedInput,
        result: solution.result,
        steps: [
          "CAS fallback: the deterministic algebra step solver does not yet support this exact equation form.",
          "The following steps are CAS wrapper steps, not a human derivation.",
          ...solution.steps,
        ],
        assumptions: classification.assumptions,
        warnings: classification.warnings,
        canCopy: true,
      };
    }
    return safeResult(classification, "The equation was detected, but the symbolic solver could not produce a safe result.");
  }

  if (classification.kind === "unsupported") {
    return {
      kind: "unsupported",
      title: "Unsupported Problem Type",
      normalizedInput: classification.normalizedInput,
      result: "This problem type is not yet supported.",
      method: "Safe unsupported handling",
      steps: [
        "The input was classified before solving.",
        classification.reason,
        "No solver was called because the intent is unclear or not supported in Phase 2.",
      ],
      assumptions: classification.assumptions,
      warnings: classification.warnings,
      canCopy: false,
    };
  }

  const expressionResult = solveExpressionOperation(classification);
  if (expressionResult) return expressionResult;

  const calculusResult = solveCalculus(classification);
  if (calculusResult) return calculusResult;

  const systemResult = solveSystem(classification);
  if (systemResult) return systemResult;

  const statisticsResult = solveStatistics(classification);
  if (statisticsResult) return statisticsResult;

  const matrixResult = solveMatrix(classification);
  if (matrixResult) return matrixResult;

  return safeResult(classification, "This operation will be implemented in the next phase.");
}

function safeResult(classification: ProblemClassification, message: string): ProblemSolverResult {
  return {
    kind: classification.kind,
    method: "Safe classification",
    title: `Detected: ${labelForKind(classification.kind)}`,
    normalizedInput: classification.normalizedInput,
    result: `Detected: ${labelForKind(classification.kind)}`,
    steps: [
      `Detected: ${labelForKind(classification.kind)}.`,
      classification.expression ? `Expression: ${classification.expression}.` : `Normalized input: ${classification.normalizedInput}.`,
      message,
      "No equation-solving fallback was used.",
    ],
    assumptions: classification.assumptions,
    warnings: classification.warnings,
    canCopy: false,
  };
}

function labelForKind(kind: ProblemIntentKind) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
