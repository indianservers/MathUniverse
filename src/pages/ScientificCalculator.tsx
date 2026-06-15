import { useMemo, useState } from "react";
import katex from "katex";
import { Link } from "react-router-dom";
import { ChartSpline, ChevronRight, Ruler } from "lucide-react";
import CalculatorDisplay from "../components/calculator/CalculatorDisplay";
import CalculatorHistory from "../components/calculator/CalculatorHistory";
import type { HistoryItem } from "../components/calculator/CalculatorHistory";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, ExampleValuesButton, RelatedToolLinks, ResetValuesButton, TermTooltip } from "../components/ui/UiFeedback";
import { calculatorExamples } from "../data/calculatorExamples";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { evaluateExpression } from "../utils/calculator";
import type { AngleMode } from "../utils/calculator";
import { symbolicDerivative, symbolicIntegral, symbolicLatex, trySymbolic } from "../utils/symbolic";

const MAX_HISTORY = 20;

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useLocalStorage<AngleMode>("math-universe-angle-mode", "DEG");
  const [memory, setMemory] = useLocalStorage<number>("math-universe-calculator-memory", 0);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("math-universe-calculator-history", []);
  const [symbolicVariable, setSymbolicVariable] = useState("x");
  const [unitValue, setUnitValue] = useState(1);
  const unitRows = [
    ["cm", "in", unitValue / 2.54],
    ["in", "cm", unitValue * 2.54],
    ["rad", "deg", unitValue * 180 / Math.PI],
    ["deg", "rad", unitValue * Math.PI / 180],
  ] as const;

  const displayExpression = useMemo(() => expression || "0", [expression]);
  const symbolic = useMemo(() => {
    if (!expression.trim()) return null;
    const variable = symbolicVariable.trim() || "x";
    return {
      derivative: trySymbolic(() => symbolicDerivative(expression, variable)),
      integral: trySymbolic(() => symbolicIntegral(expression, variable)),
      variable,
    };
  }, [expression, symbolicVariable]);

  const append = (value: string) => {
    setError("");
    setExpression((current) => current + value);
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setError("");
  };

  const resetValues = () => {
    setExpression("");
    setResult("");
    setError("");
    setSymbolicVariable("x");
  };

  const setExampleValues = () => {
    setExpression("sin(30)+sqrt(144)");
    setResult("");
    setError("");
    setSymbolicVariable("x");
  };

  const calculate = () => {
    if (!expression.trim()) return;
    try {
      const nextResult = evaluateExpression(expression, angleMode);
      setResult(nextResult);
      setError("");
      setHistory((items) => [{ expression, result: nextResult }, ...(Array.isArray(items) ? items : [])].slice(0, MAX_HISTORY));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid expression");
    }
  };

  const numericValueForMemory = () => {
    try {
      return Number(result || evaluateExpression(expression || "0", angleMode));
    } catch {
      return 0;
    }
  };

  const handleMemory = (action: "MC" | "MR" | "M+" | "M-") => {
    if (action === "MC") setMemory(0);
    if (action === "MR") append(formatMemory(memory));
    if (action === "M+") setMemory((current) => current + numericValueForMemory());
    if (action === "M-") setMemory((current) => current - numericValueForMemory());
  };

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Scientific Calculator"
        subtitle="A browser-based calculator for arithmetic, trigonometry, logarithms, powers, roots, constants, memory, and expression history."
        difficulty="Tool"
        estimatedMinutes={5}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="glass-card rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Calculator</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Expressions are parsed by a restricted evaluator with approved math functions only.
              </p>
            </div>
            <div className="sticky top-20 z-20 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
              <div className="flex w-fit rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
                {(["DEG", "RAD"] as AngleMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${angleMode === mode ? "bg-cyan-500 text-white shadow" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"}`}
                    onClick={() => setAngleMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <CopyResultButton value={result} />
              <Link className="tool-button" to={`/math-lab/graphing-calculator?expr=${encodeURIComponent(expression || result || "x^2")}`}>
                <ChartSpline className="h-4 w-4" />
                Graph
              </Link>
              <ResetValuesButton onClick={resetValues} />
              <ExampleValuesButton onClick={setExampleValues} />
            </div>
          </div>

          <div className="mt-5">
            <CalculatorDisplay expression={displayExpression} result={result} error={error} angleMode={angleMode} memory={memory} />
          </div>

          <div className="mt-5">
            <MathKeyboardInput
              value={expression}
              onChange={(next) => { setExpression(next); setError(""); }}
              onSubmit={calculate}
              onClear={clear}
              label="Professional math keyboard"
              placeholder="Build a formula: sin(30), sqrt(144), 2^10..."
              mode="calculate"
              examples={calculatorExamples}
              onExample={(example) => { setExpression(example); setError(""); }}
              extraActions={
                <>
                  {(["MC", "MR", "M+", "M-"] as const).map((action) => (
                    <button key={action} type="button" onClick={() => handleMemory(action)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15">
                      {action}
                    </button>
                  ))}
                </>
              }
            />
          </div>
        </section>

        <div className="space-y-4">
          <CalculatorHistory history={Array.isArray(history) ? history : []} onUse={(item) => { setExpression(item); setError(""); }} onClear={() => setHistory([])} />
          <StepBreakdownPanel expression={expression} result={result} />
        </div>
      </div>

      <SectionCard title="Unit Converter" description="Lightweight conversions for common classroom values.">
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
            <span className="flex items-center gap-2 text-sm font-black"><Ruler className="h-4 w-4 text-cyan-500" />Input value</span>
            <input className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900" type="number" value={unitValue} onChange={(event) => setUnitValue(Number(event.target.value))} />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            {unitRows.map(([from, to, converted]) => (
              <div key={`${from}-${to}`} className="rounded-2xl border border-slate-200 bg-white/75 p-4 font-semibold dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase text-slate-500">{from} to {to}</p>
                <p className="mt-2 font-mono text-lg">{Number(converted.toFixed(6))}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Supported Expressions" description="Examples: 2+3*4, sin(30), cos(60), sqrt(25), log(100), ln(e), 2^8, factorial(5), and pi*2. Trigonometric functions respect the DEG/RAD switch." />
      <SectionCard title="Symbolic Differentiation & Integration" description="Nerdamer reads the current expression symbolically and renders exact derivative and antiderivative forms.">
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <TermTooltip term="Symbolic" tip="Exact algebraic manipulation, not just decimal approximation." /> results keep formulas like x^2 instead of only numbers. An <TermTooltip term="antiderivative" tip="A function whose derivative gives the original function." /> is the reverse idea of a derivative.
        </p>
        <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
            <span className="text-sm font-semibold">Variable</span>
            <input className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-slate-900" value={symbolicVariable} onChange={(event) => setSymbolicVariable(event.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1) || "x")} />
          </label>
          <SymbolicResultCard title={`d/d${symbolic?.variable ?? "x"}`} value={symbolic?.derivative?.result} fallback="Enter an expression using x, such as x^3+sin(x)." />
          <SymbolicResultCard title={`∫ f(${symbolic?.variable ?? "x"}) d${symbolic?.variable ?? "x"}`} value={symbolic?.integral?.result} fallback="Nerdamer will show supported antiderivatives here." />
        </div>
        <div className="mt-4">
          <RelatedToolLinks links={[{ label: "Step Solver", route: "/problem-solver" }, { label: "CAS / Algebra Solver", route: "/problem-solver" }, { label: "Graph It", route: "/math-lab/graphing-calculator" }]} />
        </div>
      </SectionCard>
      <Link to="/syllabus" className="action-secondary w-fit">Open Syllabus Navigator</Link>
    </div>
  );
}

function SymbolicResultCard({ title, value, fallback }: { title: string; value?: string; fallback: string }) {
  const html = useMemo(() => {
    if (!value) return "";
    try {
      return katex.renderToString(symbolicLatex(value), { displayMode: true, throwOnError: false });
    } catch {
      return "";
    }
  }, [value]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <h3 className="text-sm font-black text-slate-600 dark:text-slate-300">{title}</h3>
      {value ? (
        html ? <div className="mt-3 overflow-x-auto text-lg [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} /> : <p className="mt-3 font-mono">{value}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{fallback}</p>
      )}
    </div>
  );
}

function formatMemory(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(10)).toString();
}

function parseSteps(expression: string, result: string): Array<{ label: string; value: string }> {
  if (!expression.trim() || !result) return [];
  const steps: Array<{ label: string; value: string }> = [];

  steps.push({ label: "Expression", value: expression.trim() });

  const funcMatches = expression.match(/\b(sin|cos|tan|sqrt|log|ln|abs|factorial)\s*\([^)]+\)/g);
  if (funcMatches) {
    for (const match of funcMatches) {
      steps.push({ label: `Evaluate ${match}`, value: `part of expression` });
    }
  }

  if (/[+\-*/^]/.test(expression)) {
    steps.push({ label: "Apply operations", value: "left to right, respecting precedence" });
  }

  steps.push({ label: "Result", value: result });
  return steps;
}

function StepBreakdownPanel({ expression, result }: { expression: string; result: string }) {
  const steps = useMemo(() => parseSteps(expression, result), [expression, result]);
  if (!steps.length) return null;
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">Step-by-step</p>
      <div className="mt-3 space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
            <div className="min-w-0">
              <span className="font-bold text-slate-700 dark:text-slate-200">{step.label}: </span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{step.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
