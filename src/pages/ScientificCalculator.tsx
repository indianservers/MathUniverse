import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalculatorDisplay from "../components/calculator/CalculatorDisplay";
import CalculatorHistory from "../components/calculator/CalculatorHistory";
import type { HistoryItem } from "../components/calculator/CalculatorHistory";
import MathKeyboardInput from "../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { calculatorExamples } from "../data/calculatorExamples";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { evaluateExpression } from "../utils/calculator";
import type { AngleMode } from "../utils/calculator";

const MAX_HISTORY = 20;

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useLocalStorage<AngleMode>("math-universe-angle-mode", "DEG");
  const [memory, setMemory] = useLocalStorage<number>("math-universe-calculator-memory", 0);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("math-universe-calculator-history", []);

  const displayExpression = useMemo(() => expression || "0", [expression]);

  const append = (value: string) => {
    setError("");
    setExpression((current) => current + value);
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setError("");
  };

  const backspace = () => {
    setError("");
    setExpression((current) => current.slice(0, -1));
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="glass-card rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Calculator</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Expressions are parsed by a restricted evaluator with approved math functions only.
              </p>
            </div>
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

        <CalculatorHistory history={Array.isArray(history) ? history : []} onUse={(item) => { setExpression(item); setError(""); }} onClear={() => setHistory([])} />
      </div>

      <SectionCard title="Supported Expressions" description="Examples: 2+3*4, sin(30), cos(60), sqrt(25), log(100), ln(e), 2^8, factorial(5), and pi*2. Trigonometric functions respect the DEG/RAD switch." />
      <Link to="/syllabus" className="action-secondary w-fit">Open Syllabus Navigator</Link>
    </div>
  );
}

function formatMemory(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(10)).toString();
}
