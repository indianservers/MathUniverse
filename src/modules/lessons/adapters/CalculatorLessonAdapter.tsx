import { useEffect, useState } from "react";
import CalculatorDisplay from "../../../components/calculator/CalculatorDisplay";
import MathKeyboardInput from "../../../components/math-keyboard/MathKeyboardInput";
import { evaluateExpressionDetailed, type AngleMode } from "../../../utils/calculator";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { calculatorLessonPreset } from "../presets/calculatorLessonPresets";

type HistoryRow = { expression: string; result: string };

export default function CalculatorLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const preset = calculatorLessonPreset(lesson.id);
  const initial = preset.expression;
  const [expression, setExpression] = useState(initial);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>(preset.angleMode);
  const [accuracy, setAccuracy] = useState<"exact" | "approximate">("exact");
  const [history, setHistory] = useState<HistoryRow[]>([]);

  useEffect(() => {
    setExpression(initial);
    setResult("");
    setError("");
    setHistory([]);
    setAngleMode(preset.angleMode);
    setAccuracy("exact");
  }, [initial, preset.angleMode, resetToken]);

  const calculate = () => {
    try {
      const evaluation = evaluateExpressionDetailed(expression, angleMode);
      setResult(evaluation.value);
      setAccuracy(evaluation.accuracy);
      const nextHistory = [{ expression, result: evaluation.value }, ...history].slice(0, 4);
      setHistory(nextHistory);
      setError("");
      const challenge = challengeFor(preset.challengeMode, expression, evaluation.value, evaluation.accuracy, nextHistory.length);
      onInteraction(createLessonInteractionEvent({ controlId: "calculator-expression", kind: "input", before: { expression, historyCount: history.length }, after: { expression, result: evaluation.value, accuracy: evaluation.accuracy, historyCount: nextHistory.length, ...challenge }, affectedOutputs: ["calculator-result", "calculator-history", "calculator-accuracy"] }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid expression");
    }
  };

  return (
    <AdapterFrame title={`${lesson.title} live calculator`} value={result || "ready"} footer="The expression, mode, result, and practice question use this lesson's explicit calculator preset.">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-3">
          <CalculatorDisplay expression={expression || "0"} result={result} error={error} angleMode={angleMode} memory={0} accuracy={accuracy} />
          <MathKeyboardInput value={expression} onChange={setExpression} onSubmit={calculate} onClear={() => setExpression("")} label="Lesson calculator" placeholder="Enter an expression" mode="calculate" examples={[initial]} onExample={setExpression} />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-white/10" aria-label="Angle mode">
            {(["DEG", "RAD"] as AngleMode[]).map((mode) => <button key={mode} type="button" className={angleMode === mode ? "rounded-lg bg-cyan-500 px-3 py-2 text-sm font-black text-white" : "rounded-lg px-3 py-2 text-sm font-black"} onClick={() => { const before=angleMode; setAngleMode(mode); onInteraction(createLessonInteractionEvent({controlId:"calculator-expression",kind:"selection",before,after:{angleMode:mode},affectedOutputs:["calculator-result"]})); }}>{mode}</button>)}
          </div>
          <button type="button" onClick={calculate} className="action-primary w-full justify-center">Evaluate</button>
          <div className="max-h-44 space-y-2 overflow-auto" aria-label="Recent calculations">
            {history.map((row, index) => <button key={`${row.expression}-${index}`} type="button" className="block w-full rounded-xl bg-slate-100 p-2 text-left dark:bg-white/10" onClick={() => setExpression(row.expression)}><span className="block truncate font-mono text-xs">{row.expression}</span><span className="font-mono text-sm font-black">{row.result}</span></button>)}
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function challengeFor(mode: "result" | "history-count" | "accuracy", expression: string, result: string, accuracy: "exact" | "approximate", historyCount: number) {
  if (mode === "history-count") return { challengePrompt: "How many calculations are currently stored in the visible history?", challengeExpected: String(historyCount), challengeHint: "Count the visible history rows.", challengeKind: "numeric" };
  if (mode === "accuracy") return { challengePrompt: "Is the current result exact or approximate?", challengeExpected: accuracy, challengeHint: "Read the result-mode indicator.", challengeKind: "keywords" };
  return { challengePrompt: `What result is displayed for ${expression}?`, challengeExpected: result, challengeHint: "Read the calculated result and preserve its displayed precision.", challengeKind: "numeric" };
}
