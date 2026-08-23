import { useEffect, useMemo, useState } from "react";
import { BadgeInfo, CheckCircle2, ChevronRight, Eraser, Equal, History, Plus, RotateCcw } from "lucide-react";
import CalculatorDisplay from "../../../components/calculator/CalculatorDisplay";
import MathKeyboardInput from "../../../components/math-keyboard/MathKeyboardInput";
import { evaluateExpressionDetailed, type AngleMode } from "../../../utils/calculator";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { calculatorLessonPreset } from "../presets/calculatorLessonPresets";
import { fractionToMixed, operateFractions, type Fraction } from "../../../components/ncert/grade7/grade7MathUtils";

type HistoryRow = { expression: string; result: string };

export default function CalculatorLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 1) {
    return <BasicCalculatorLessonSurface lessonId={lesson.id} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 2) {
    return <FractionCalculatorLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 3) {
    return <MixedNumbersLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 4) {
    return <PercentageCalculatorLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 5) {
    return <RatioCalculatorLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 6) {
    return <PowersAndRootsLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 7) {
    return <ScientificNotationLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 8) {
    return <LogarithmsLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 9) {
    return <ExponentialCalculationsLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 10) {
    return <TrigonometricCalculatorLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 11) {
    return <InverseTrigonometryLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 12) {
    return <HyperbolicFunctionsLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 13) {
    return <CountingChoicesLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 14) {
    return <AbsoluteValueLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 15) {
    return <RoundingPrecisionLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 16) {
    return <ConstantsLibraryLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 17) {
    return <CalculationHistoryLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 18) {
    return <ExactAndDecimalModesLessonSurface resetToken={resetToken} onInteraction={onInteraction} />;
  }
  return <DefaultCalculatorLessonSurface lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

function DefaultCalculatorLessonSurface({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const preset = calculatorLessonPreset(lesson.id);
  const initial = preset.expression;
  const guidance = calculatorGuidanceFor(lesson.id);
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
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <CalculatorConceptTrace lessonId={lesson.id} expression={expression} result={result} angleMode={angleMode} accuracy={accuracy} historyCount={history.length} />
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

function BasicCalculatorLessonSurface({ lessonId, resetToken, onInteraction }: { lessonId: number; resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const preset = calculatorLessonPreset(lessonId);
  const initialExpression = "(12+8)/4";
  const [expression, setExpression] = useState(initialExpression);
  const [angleMode, setAngleMode] = useState<AngleMode>(preset.angleMode);
  const [result, setResult] = useState("5");
  const [accuracy, setAccuracy] = useState<"exact" | "approximate">("exact");
  const [error, setError] = useState("");
  const [showReasoning, setShowReasoning] = useState(true);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceStatus, setPracticeStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setExpression(initialExpression);
    setAngleMode(preset.angleMode);
    setResult("5");
    setAccuracy("exact");
    setError("");
    setShowReasoning(true);
    setPracticeAnswer("");
    setPracticeStatus("idle");
  }, [preset.angleMode, resetToken]);

  const evaluation = useMemo(() => {
    try {
      return evaluateExpressionDetailed(expression, angleMode);
    } catch {
      return null;
    }
  }, [angleMode, expression]);

  const currentValue = evaluation?.value ?? result;
  const currentResult = result || currentValue;
  const isTargetExpression = normalizeExpression(expression) === normalizeExpression(initialExpression);

  const applyToken = (token: string) => {
    setExpression((current) => {
      if (current === "0") return token;
      return `${current}${token}`;
    });
    setPracticeStatus("idle");
    setError("");
  };

  const clearExpression = () => {
    setExpression("");
    setResult("");
    setAccuracy("exact");
    setPracticeStatus("idle");
  };

  const backspace = () => {
    setExpression((current) => current.slice(0, -1));
    setPracticeStatus("idle");
  };

  const evaluate = () => {
    const nextExpression = expression.trim() || initialExpression;
    try {
      const next = evaluateExpressionDetailed(nextExpression, angleMode);
      setResult(next.value);
      setAccuracy(next.accuracy);
      setError("");
      onInteraction(createLessonInteractionEvent({
        controlId: "calculator-expression",
        kind: "input",
        before: { expression, result, angleMode },
        after: { expression: nextExpression, result: next.value, accuracy: next.accuracy, angleMode },
        affectedOutputs: ["calculator-result", "calculator-trace", "calculator-practice"],
      }));
    } catch (error) {
      setResult("");
      setAccuracy("exact");
      setError(error instanceof Error ? error.message : "Invalid expression");
      onInteraction(createLessonInteractionEvent({
        controlId: "calculator-expression",
        kind: "input",
        before: { expression, result, angleMode },
        after: { expression: nextExpression, error: error instanceof Error ? error.message : "Invalid expression" },
        affectedOutputs: ["calculator-result", "calculator-trace"],
      }));
    }
  };

  const checkPractice = () => {
    const normalized = normalizeExpression(practiceAnswer);
    if (normalized === "28" || normalized === "028") {
      setPracticeStatus("correct");
    } else if (normalized) {
      setPracticeStatus("incorrect");
    } else {
      setPracticeStatus("idle");
    }
  };

  return (
    <AdapterFrame
      title="Basic Calculator live calculator"
      value={`Result = ${currentResult || "5"}`}
      footer="The expression, mode, result, and practice question use this lesson's explicit calculator preset."
    >
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.92fr)_320px]">
        <section className="space-y-3">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#081127] via-[#0a1230] to-[#060816] shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200/90">Expression</p>
                <h3 className="mt-1 text-sm font-black text-white">Calculate and see the order</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-cyan-100">DEG</span>
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/85 hover:bg-white/10" onClick={clearExpression}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Reset</button>
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/85 hover:bg-white/10" onClick={() => setExpression(initialExpression)}><History className="mr-1 inline h-3.5 w-3.5" />Preset</button>
              </div>
            </div>
            <div className="relative px-5 py-8 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-200/75">Current input</p>
                  <label className="sr-only" htmlFor="basic-calculator-expression">Calculator expression</label>
                  <input
                    id="basic-calculator-expression"
                    value={formatExpression(expression)}
                    onChange={(event) => {
                      setExpression(normalizeExpression(event.target.value));
                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") evaluate();
                    }}
                    className="w-full min-w-0 border-0 bg-transparent font-mono text-4xl font-semibold tracking-tight text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-300 sm:text-[3rem]"
                    placeholder={formatExpression(initialExpression)}
                    aria-describedby={error ? "basic-calculator-error" : undefined}
                  />
                  {error ? <p id="basic-calculator-error" role="alert" className="max-w-xl text-sm font-bold text-rose-300">{error}</p> : null}
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Final answer</p>
                  <p className="mt-1 text-4xl font-black text-emerald-300">{currentResult || "5"}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-sm font-black text-slate-200 sm:grid-cols-5">
                <LessonBadge label="MC" muted />
                <LessonBadge label="MR" muted />
                <LessonBadge label="M+" muted />
                <LessonBadge label="M-" muted />
                <LessonBadge label="MS" muted />
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Keyboard</p>
                <h3 className="text-lg font-black text-slate-950">Tap a key to build the expression</h3>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">Live edit</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {[
                ["7", "8", "9", "÷"],
                ["4", "5", "6", "×"],
                ["1", "2", "3", "−"],
                ["0", ".", "(", ")"],
              ].flat().map((key) => (
                <button
                  key={key}
                  type="button"
                  className={buttonClassForKey(key)}
                  onClick={() => {
                    switch (key) {
                      case "÷": applyToken("/"); break;
                      case "×": applyToken("*"); break;
                      case "−": applyToken("-"); break;
                      default: applyToken(key); break;
                    }
                  }}
                >
                  {key}
                </button>
              ))}
              <button type="button" className="keypad-action" onClick={() => applyToken("+")}><Plus className="h-5 w-5" /></button>
              <button type="button" className="keypad-action" onClick={backspace}><Eraser className="h-5 w-5" /></button>
              <button type="button" className="keypad-equals sm:col-span-2" onClick={evaluate}><Equal className="mr-2 h-5 w-5" />Evaluate</button>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/70 to-sky-50 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Concept trace</p>
              <h3 className="text-xl font-black text-slate-950">Operation order stack</h3>
            </div>
            <button
              type="button"
              className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-pressed={showReasoning}
              onClick={() => setShowReasoning((current) => !current)}
            >
              {showReasoning ? "Hide reasoning" : "Show reasoning"}
            </button>
          </div>
          {showReasoning ? <div className="mt-4 space-y-4">
            <TraceCard
              index="1"
              accent="cyan"
              title="Resolve brackets first"
              expression="(12 + 8) / 4"
              note="Inside the brackets, 12 + 8 = 20."
              chip="12 + 8 = 20"
              active
            />
            <TraceConnector />
            <TraceCard
              index="2"
              accent="violet"
              title="Then do division"
              expression="20 / 4"
              note="Use the simplified expression after the bracket step."
              chip="20 ÷ 4 = 5"
            />
            <TraceConnector />
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">Final result</p>
                  <p className="mt-1 text-3xl font-black text-emerald-800">5</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900/80">The displayed answer is exact. The trace shows why the calculator reaches 5.</p>
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-emerald-700">Order check complete. The expression tree explains the answer.</p>
            </div>
          </div> : <div className="mt-4 rounded-2xl border border-dashed border-cyan-200 bg-white/80 p-4 text-sm font-semibold leading-6 text-slate-600">Reasoning is hidden. Show it to inspect the bracket and division steps before trusting the answer.</div>}

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Step trace</p>
                <h4 className="text-sm font-black text-slate-950">Visible calculation path</h4>
              </div>
              <BadgeInfo className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["1", "(12 + 8)", "20"],
                ["2", "20 / 4", "5"],
                ["3", "Final result", "5"],
              ].map(([step, input, output]) => (
                <div key={step} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-black text-white">{step}</span>
                    <span>{input}</span>
                  </div>
                  <div className="font-mono text-sm font-black text-emerald-700">{output}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Mode</p>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              {(["DEG", "RAD"] as AngleMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={angleMode === mode ? "rounded-xl bg-cyan-600 px-3 py-2 text-sm font-black text-white shadow" : "rounded-xl px-3 py-2 text-sm font-black text-slate-700 hover:bg-white"}
                  onClick={() => setAngleMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <InfoPanel label="Memory" value={`M empty`} note={`(12 + 8) / 4`} />
          <InfoPanel label="Current expression" value={formatExpression(expression || initialExpression)} note={isTargetExpression ? "The lesson preset is loaded." : "Edited from the preset."} />

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Order rule</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">Calculators follow priority rules</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">1. Brackets first  2. Then division or multiplication  3. Then addition or subtraction</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">First priority</p>
            <div className="mt-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-mono text-sm font-black text-cyan-800">(12 + 8)</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Expressions in brackets are evaluated first.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Second priority</p>
            <div className="mt-2 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 font-mono text-sm font-black text-violet-800">20 / 4</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">After the brackets, the calculator divides 20 by 4.</p>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">Result</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-2xl font-black text-emerald-800">Result = 5</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-emerald-900/80">This is the final answer.</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-3xl font-black text-emerald-700">5</div>
            </div>
            <p className="mt-2 inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">{accuracy === "exact" ? "Exact result" : "Approximate result"}</p>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/80 to-violet-50 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Try independently</p>
                <h3 className="text-lg font-black text-slate-950">Use the calculator to evaluate the expression.</h3>
              </div>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black text-violet-700">New</span>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-600">Try: <strong className="font-black text-slate-950">(18 - 6) × 2 + 4</strong></p>
              <div className="mt-3 flex gap-2">
                <input
                  value={practiceAnswer}
                  onChange={(event) => {
                    setPracticeAnswer(event.target.value);
                    setPracticeStatus("idle");
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-cyan-400"
                  placeholder="Enter your answer..."
                />
                <button type="button" className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-black text-white shadow hover:bg-violet-500" onClick={checkPractice}>
                  Check
                </button>
              </div>
              <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold leading-6 text-slate-600">
                Tip: multiplication and division happen before addition and subtraction unless brackets intervene.
              </div>
              {practiceStatus !== "idle" ? (
                <div className={practiceStatus === "correct" ? "mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800" : "mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-800"}>
                  {practiceStatus === "correct" ? "Correct. (18 - 6) × 2 + 4 = 28." : "Almost there. Resolve the brackets first: 12 × 2 + 4 = 28."}
                </div>
              ) : null}
            </div>
          </div>

          <button type="button" className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-4 py-3 text-base font-black text-white shadow-lg shadow-violet-950/20" onClick={evaluate}>Evaluate</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function FractionCalculatorLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [a, setA] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [b, setB] = useState<Fraction>({ numerator: 3, denominator: 4 });
  const [practiceVisible, setPracticeVisible] = useState(false);

  useEffect(() => {
    setA({ numerator: 1, denominator: 2 });
    setB({ numerator: 3, denominator: 4 });
    setPracticeVisible(false);
  }, [resetToken]);

  const calculation = useMemo(() => {
    try {
      return { ...operateFractions(a, b, "add"), error: "" };
    } catch (error) {
      return {
        result: { numerator: 0, denominator: 1 },
        commonDenominator: 1,
        comparison: 0,
        error: error instanceof Error ? error.message : "Use non-zero denominators.",
      };
    }
  }, [a, b]);

  const common = calculation.commonDenominator;
  const equivalentA = Math.round(a.numerator * (common / a.denominator));
  const equivalentB = Math.round(b.numerator * (common / b.denominator));
  const resultText = `${calculation.result.numerator}/${calculation.result.denominator}`;
  const updateFraction = (side: "a" | "b", part: keyof Fraction, value: number) => {
    const setter = side === "a" ? setA : setB;
    const current = side === "a" ? a : b;
    setter((current) => ({ ...current, [part]: value }));
    onInteraction(createLessonInteractionEvent({
      controlId: `fraction-${side}-${part}`,
      kind: "input",
      before: current,
      after: { ...current, [part]: value },
      affectedOutputs: ["fraction-bars", "common-denominator", "exact-result"],
    }));
  };

  return (
    <AdapterFrame title="Fraction Calculator live calculator" value={calculation.error ? "Check denominators" : `Result = ${resultText}`} footer="Equivalent-fraction bars and the existing fraction engine use the same numerator and denominator inputs.">
      <div className="grid gap-3 xl:grid-cols-[270px_minmax(0,1fr)_300px]">
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/80" aria-label="Fraction input keypad">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Fraction rule · Enter fractions</p>
            <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Build two exact values</h3>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <FractionFields label="First fraction" value={a} onChange={(part, value) => updateFraction("a", part, value)} />
            <span className="text-2xl font-black">+</span>
            <FractionFields label="Second fraction" value={b} onChange={(part, value) => updateFraction("b", part, value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="action-secondary justify-center" onClick={() => { setA(b); setB(a); }}>Swap</button>
            <button type="button" className="action-secondary justify-center" onClick={() => { setA({ numerator: 1, denominator: 2 }); setB({ numerator: 3, denominator: 4 }); }}><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-sm font-semibold leading-6 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            <strong>Tip:</strong> change both fractions to equal-sized parts before adding.
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/50 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Concept trace · Fraction common-parts trace</p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Add fractions by matching parts</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Exact parts</span>
          </div>
          {calculation.error ? (
            <div role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-800">{calculation.error}</div>
          ) : (
            <div className="mt-5 space-y-4">
              <FractionLessonBar label={`First fraction (${a.numerator}/${a.denominator})`} numerator={a.numerator} denominator={a.denominator} color="bg-cyan-400" />
              <FractionLessonBar label={`Second fraction (${b.numerator}/${b.denominator})`} numerator={b.numerator} denominator={b.denominator} color="bg-violet-400" />
              <div className="rounded-2xl border border-dashed border-cyan-200 bg-white/80 p-4 dark:border-cyan-300/20 dark:bg-slate-950/50">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Make a common denominator ({common}ths)</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-lg font-black text-slate-950 dark:text-white">
                  <span>{a.numerator}/{a.denominator} = {equivalentA}/{common}</span>
                  <ChevronRight className="h-5 w-5 text-cyan-500" />
                  <span>{equivalentA}/{common} + {equivalentB}/{common} = {equivalentA + equivalentB}/{common}</span>
                </div>
                <FractionLessonBar label="Combined equal parts" numerator={equivalentA + equivalentB} denominator={common} color="bg-emerald-400" />
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                <FractionResultCard label="Equivalent A" value={`${equivalentA}/${common}`} />
                <span className="text-center text-xl font-black">+</span>
                <FractionResultCard label="Equivalent B" value={`${equivalentB}/${common}`} />
                <span className="text-center text-xl font-black">=</span>
                <FractionResultCard label="Exact result" value={resultText} success />
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-black leading-6 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
                Watch out: never add denominators directly. Only numerators combine after denominators match.
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Input" value={`${a.numerator}/${a.denominator} + ${b.numerator}/${b.denominator}`} />
          <FractionInspector label="Common denominator" value={String(common)} note="Least shared denominator for equal-sized parts." />
          <FractionInspector label="Equivalent fractions" value={`${equivalentA}/${common} + ${equivalentB}/${common}`} />
          <FractionInspector label="Exact result" value={resultText} success />
          <FractionInspector label="Mixed number" value={fractionToMixed(calculation.result)} success />
          <FractionInspector label="Decimal check" value={calculation.error ? "—" : String(calculation.result.numerator / calculation.result.denominator)} />
          <button type="button" className="action-primary w-full justify-center" onClick={() => onInteraction(createLessonInteractionEvent({ controlId: "fraction-evaluate", kind: "input", before: { a, b }, after: { result: resultText, common }, affectedOutputs: ["fraction-bars", "exact-result"] }))}>Evaluate exact fractions</button>
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-4 dark:border-violet-300/20 dark:from-slate-950 dark:to-violet-300/10">
            <p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try next</p>
            <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">2/3 + 1/6</h3>
            <button type="button" className="action-secondary mt-3 w-full justify-center" onClick={() => setPracticeVisible((current) => !current)}>{practiceVisible ? "Hide reasoning" : "Show reasoning"}</button>
            {practiceVisible ? <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold leading-6 text-slate-700 dark:bg-white/10 dark:text-slate-100">2/3 = 4/6, so 4/6 + 1/6 = 5/6.</p> : null}
          </div>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function FractionFields({ label, value, onChange }: { label: string; value: Fraction; onChange: (part: keyof Fraction, value: number) => void }) {
  return (
    <fieldset className="min-w-0 rounded-2xl border border-slate-200 p-2 dark:border-white/10">
      <legend className="sr-only">{label}</legend>
      <input aria-label={`${label} numerator`} type="number" value={value.numerator} onChange={(event) => onChange("numerator", Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-center font-mono font-black dark:border-white/10 dark:bg-slate-900" />
      <div className="my-1 h-0.5 bg-slate-950 dark:bg-white" />
      <input aria-label={`${label} denominator`} type="number" value={value.denominator} onChange={(event) => onChange("denominator", Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-center font-mono font-black dark:border-white/10 dark:bg-slate-900" />
    </fieldset>
  );
}

function FractionLessonBar({ label, numerator, denominator, color }: { label: string; numerator: number; denominator: number; color: string }) {
  const safeDenominator = Math.min(24, Math.max(1, Math.abs(Math.round(denominator))));
  const safeNumerator = Math.max(0, Math.abs(Math.round(numerator)));
  const groupCount = Math.max(1, Math.ceil(safeNumerator / safeDenominator));
  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white/90 p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="mb-2 flex items-center justify-between gap-2 text-sm font-black"><span>{label}</span><span>{numerator}/{denominator}</span></div>
      <div className="space-y-1">
        {Array.from({ length: groupCount }, (_, groupIndex) => (
          <div key={groupIndex} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${safeDenominator}, minmax(0, 1fr))` }}>
            {Array.from({ length: safeDenominator }, (_unused, partIndex) => {
              const absoluteIndex = groupIndex * safeDenominator + partIndex;
              return <span key={partIndex} className={`h-9 rounded-md border border-slate-200 ${absoluteIndex < safeNumerator ? color : "bg-white dark:bg-slate-900"}`} aria-hidden="true" />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function FractionResultCard({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return <div className={success ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center text-emerald-800" : "rounded-2xl border border-slate-200 bg-white p-3 text-center text-slate-950 dark:bg-slate-950 dark:text-white"}><p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p><p className="mt-1 font-mono text-xl font-black">{value}</p></div>;
}

function FractionInspector({ label, value, note, success = false }: { label: string; value: string; note?: string; success?: boolean }) {
  return <div className={success ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-300/10 dark:text-emerald-100" : "rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/80"}><p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p><p className="mt-1 font-mono text-lg font-black">{value}</p>{note ? <p className="mt-1 text-xs font-semibold leading-5 opacity-75">{note}</p> : null}</div>;
}

type MixedInput = { whole: number; numerator: number; denominator: number };

function MixedNumbersLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [first, setFirst] = useState<MixedInput>({ whole: 2, numerator: 1, denominator: 3 });
  const [second, setSecond] = useState<MixedInput>({ whole: 1, numerator: 3, denominator: 4 });
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setFirst({ whole: 2, numerator: 1, denominator: 3 });
    setSecond({ whole: 1, numerator: 3, denominator: 4 });
    setShowPractice(false);
  }, [resetToken]);

  const calculation = useMemo(() => {
    try {
      const improperFirst = { numerator: first.whole * first.denominator + first.numerator, denominator: first.denominator };
      const improperSecond = { numerator: second.whole * second.denominator + second.numerator, denominator: second.denominator };
      const sum = operateFractions(improperFirst, improperSecond, "add");
      return { improperFirst, improperSecond, ...sum, error: "" };
    } catch (error) {
      return {
        improperFirst: { numerator: 0, denominator: 1 },
        improperSecond: { numerator: 0, denominator: 1 },
        result: { numerator: 0, denominator: 1 },
        commonDenominator: 1,
        comparison: 0,
        error: error instanceof Error ? error.message : "Use non-zero denominators.",
      };
    }
  }, [first, second]);

  const common = calculation.commonDenominator;
  const commonFirst = calculation.improperFirst.numerator * (common / calculation.improperFirst.denominator);
  const commonSecond = calculation.improperSecond.numerator * (common / calculation.improperSecond.denominator);
  const exactResult = `${calculation.result.numerator}/${calculation.result.denominator}`;
  const mixedResult = fractionToMixed(calculation.result);
  const update = (side: "first" | "second", part: keyof MixedInput, value: number) => {
    const current = side === "first" ? first : second;
    const setter = side === "first" ? setFirst : setSecond;
    setter({ ...current, [part]: value });
    onInteraction(createLessonInteractionEvent({ controlId: `mixed-${side}-${part}`, kind: "input", before: current, after: { ...current, [part]: value }, affectedOutputs: ["mixed-blocks", "improper-form", "mixed-result"] }));
  };

  return (
    <AdapterFrame title="Mixed Numbers live calculator" value={calculation.error ? "Check denominators" : `Result = ${mixedResult}`} footer="Whole blocks, fraction strips, and the exact fraction engine stay linked to the mixed-number inputs.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Mixed-number rule · Concept trace</p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Convert before you calculate</h3>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Build mixed numbers, convert to improper fractions, then add exactly.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Mixed to improper fraction</span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <MixedNumberBuilder label="First mixed number" value={first} color="cyan" onChange={(part, value) => update("first", part, value)} />
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-2xl font-black text-white">+</span>
            <MixedNumberBuilder label="Second mixed number" value={second} color="violet" onChange={(part, value) => update("second", part, value)} />
          </div>

          {calculation.error ? <div role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-800">{calculation.error}</div> : (
            <div className="mt-4 space-y-3" aria-live="polite">
              <MixedStep label="Step 1 · Convert to improper fractions" value={`${first.whole} ${first.numerator}/${first.denominator} = ${calculation.improperFirst.numerator}/${calculation.improperFirst.denominator}   +   ${second.whole} ${second.numerator}/${second.denominator} = ${calculation.improperSecond.numerator}/${calculation.improperSecond.denominator}`} note="Multiply each whole part by its denominator, then add the numerator." />
              <MixedStep label={`Step 2 · Use common denominator ${common}`} value={`${commonFirst}/${common} + ${commonSecond}/${common} = ${commonFirst + commonSecond}/${common}`} note="Equal denominators mean equal-sized parts, so the numerators can combine." />
              <MixedStep label="Step 3 · Simplify and write as a mixed number" value={`${exactResult} = ${mixedResult}`} note="Divide the numerator by the denominator: the quotient is the whole part and the remainder is the new numerator." success />
              <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-300/10 dark:text-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-wide">Exact result</p>
                  <p className="mt-2 font-mono text-3xl font-black">{exactResult} = {mixedResult}</p>
                </div>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 dark:border-white/20 dark:bg-slate-950/60">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Decimal check</p>
                  <p className="mt-2 font-mono text-xl font-black">≈ {(calculation.result.numerator / calculation.result.denominator).toFixed(5)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-violet-100 bg-white/80 p-4 dark:border-violet-300/20 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try this next</p><p className="mt-1 font-mono text-xl font-black">3 1/2 − 1 2/5</p></div>
              <button type="button" className="action-secondary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide solution" : "Start practice"}</button>
            </div>
            {showPractice ? <p className="mt-3 rounded-2xl bg-violet-50 p-3 text-sm font-bold leading-6 text-violet-950 dark:bg-violet-300/10 dark:text-violet-100">7/2 − 7/5 = 35/10 − 14/10 = 21/10 = 2 1/10.</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:bg-amber-300/10 dark:text-amber-100"><p className="text-[10px] font-black uppercase tracking-wide">Remember</p><p className="mt-2 text-sm font-black leading-6">A mixed number means whole part plus fraction.</p></div>
          <FractionInspector label="Mixed structure" value={`${first.whole} + ${first.numerator}/${first.denominator}; ${second.whole} + ${second.numerator}/${second.denominator}`} />
          <FractionInspector label="Improper form" value={`${calculation.improperFirst.numerator}/${calculation.improperFirst.denominator} + ${calculation.improperSecond.numerator}/${calculation.improperSecond.denominator}`} />
          <FractionInspector label={`Common denominator (${common})`} value={`${commonFirst}/${common} + ${commonSecond}/${common}`} />
          <FractionInspector label="Exact result" value={`${exactResult} = ${mixedResult}`} success />
          <FractionInspector label="Decimal check" value={calculation.error ? "—" : (calculation.result.numerator / calculation.result.denominator).toFixed(5)} />
        </aside>
      </div>
    </AdapterFrame>
  );
}

function MixedNumberBuilder({ label, value, color, onChange }: { label: string; value: MixedInput; color: "cyan" | "violet"; onChange: (part: keyof MixedInput, value: number) => void }) {
  const accent = color === "cyan" ? "text-cyan-700 dark:text-cyan-200" : "text-violet-700 dark:text-violet-200";
  const block = color === "cyan" ? "bg-cyan-500" : "bg-violet-500";
  return (
    <fieldset className="rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <legend className={`px-1 text-sm font-black ${accent}`}>{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {(["whole", "numerator", "denominator"] as const).map((part) => <label key={part} className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{part}<input aria-label={`${label} ${part}`} type="number" min={part === "denominator" ? 1 : 0} value={value[part]} onChange={(event) => onChange(part, Number(event.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-center font-mono text-base font-black dark:border-white/10 dark:bg-slate-900" /></label>)}
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        {Array.from({ length: Math.max(0, Math.min(6, value.whole)) }, (_, index) => <span key={index} className={`h-12 w-12 rounded-xl ${block} shadow-sm`} aria-label="one whole" />)}
        <div className="min-w-[120px] flex-1"><FractionLessonBar label={`${value.numerator}/${value.denominator} fractional part`} numerator={value.numerator} denominator={value.denominator} color={block} /></div>
      </div>
      <p className={`mt-3 text-center font-mono text-2xl font-black ${accent}`}>{value.whole} {value.numerator}/{value.denominator}</p>
    </fieldset>
  );
}

function MixedStep({ label, value, note, success = false }: { label: string; value: string; note: string; success?: boolean }) {
  return <article className={success ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-300/10 dark:text-emerald-100" : "rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"}><p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p><p className="mt-2 font-mono text-lg font-black">{value}</p><p className="mt-2 text-sm font-semibold leading-6 opacity-75">{note}</p></article>;
}

function PercentageCalculatorLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [percent, setPercent] = useState(15);
  const [base, setBase] = useState(240);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setPercent(15);
    setBase(240);
    setAnswer("");
    setFeedback("idle");
  }, [resetToken]);

  const part = Number(((percent / 100) * base).toFixed(6));
  const shadedCells = Math.max(0, Math.min(100, Math.round(percent)));
  const changeValue = (kind: "percent" | "base", value: number) => {
    const before = kind === "percent" ? percent : base;
    if (kind === "percent") setPercent(value); else setBase(value);
    setFeedback("idle");
    onInteraction(createLessonInteractionEvent({ controlId: `percentage-${kind}`, kind: "slider", before, after: value, affectedOutputs: ["hundred-grid", "percent-bars", "percentage-result"] }));
  };

  return (
    <AdapterFrame title="Percentage Calculator live calculator" value={`Part = ${part}`} footer="The hundred grid, percent strip, base bar, formula, and result all read the same percent and base values.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Percent rule · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Visual model: {percent}% of {base}</h3></div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Percent of base amount</span>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div>
              <div className="grid grid-cols-10 gap-1 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60" role="img" aria-label={`${shadedCells} of 100 cells highlighted`}>
                {Array.from({ length: 100 }, (_, index) => <span key={index} className={index < shadedCells ? "aspect-square rounded-sm bg-cyan-500 shadow-sm" : "aspect-square rounded-sm border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900"} />)}
              </div>
              <p className="mt-2 text-center text-sm font-black text-slate-700 dark:text-slate-200">{shadedCells} shaded squares = {shadedCells} hundredths</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-center text-sm"><caption className="sr-only">Percent quick look for base {base}</caption><tbody><tr className="bg-slate-50 dark:bg-white/10"><th className="p-2">Percent</th>{[5, 10, 15, 20].map((value) => <td key={value} className={value === percent ? "bg-emerald-50 p-2 font-black text-emerald-800" : "p-2 font-bold"}>{value}%</td>)}</tr><tr><th className="p-2">Part</th>{[5, 10, 15, 20].map((value) => <td key={value} className={value === percent ? "bg-emerald-50 p-2 font-black text-emerald-800" : "p-2 font-bold"}>{Number(((value / 100) * base).toFixed(2))}</td>)}</tr></tbody></table>
              </div>
            </div>

            <div className="space-y-4">
              <PercentBar label="Percent (per 100)" value={percent} max={100} color="bg-cyan-500" output={`${percent} per 100`} />
              <PercentBar label="Base (the whole)" value={base} max={Math.max(1, base)} color="bg-violet-500" output={`Whole = ${base}`} />
              <PercentBar label="Part (the result)" value={part} max={Math.max(1, base)} color="bg-emerald-500" output={`Part = ${part}`} />
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-center font-mono text-xl font-black text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100">{percent}% of {base} = {percent}/100 × {base} = <span className="text-emerald-700 dark:text-emerald-300">{part}</span></div>
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: {percent}% means {percent} per 100; it is not the same as adding {percent} to the base.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
            <label className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-black dark:border-white/10 dark:bg-slate-950/60">Percent (per 100)<div className="mt-2 flex items-center gap-3"><input aria-label="Percent" type="range" min="0" max="100" step="1" value={percent} onChange={(event) => changeValue("percent", Number(event.target.value))} className="min-w-0 flex-1" /><output className="w-14 rounded-xl bg-cyan-50 px-2 py-1 text-center font-mono text-cyan-800">{percent}%</output></div></label>
            <label className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-black dark:border-white/10 dark:bg-slate-950/60">Base (whole)<div className="mt-2 flex items-center gap-3"><input aria-label="Base whole" type="range" min="0" max="1000" step="10" value={base} onChange={(event) => changeValue("base", Number(event.target.value))} className="min-w-0 flex-1" /><output className="w-16 rounded-xl bg-violet-50 px-2 py-1 text-center font-mono text-violet-800">{base}</output></div></label>
          </div>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/80 p-4 dark:border-violet-300/20 dark:bg-slate-950/50">
            <p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p>
            <p className="mt-1 text-base font-black">If 15% of a quantity is 36, what is the whole?</p>
            <div className="mt-3 flex flex-wrap gap-2"><input aria-label="Practice whole amount" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback("idle"); }} className="min-w-[180px] flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-mono font-black dark:border-white/10 dark:bg-slate-900" placeholder="Enter the whole" /><button type="button" className="action-primary" onClick={() => setFeedback(Number(answer) === 240 ? "correct" : "incorrect")}>Check answer</button></div>
            {feedback !== "idle" ? <p role="status" className={feedback === "correct" ? "mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800" : "mt-3 rounded-2xl bg-amber-50 p-3 font-black text-amber-900"}>{feedback === "correct" ? "Correct. 36 ÷ 0.15 = 240." : "Use whole = part ÷ percent as a decimal: 36 ÷ 0.15."}</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Percent" value={`${percent} per 100`} />
          <FractionInspector label="Base" value={String(base)} note="The whole amount." />
          <FractionInspector label="Part" value={String(part)} note="The portion being found." success />
          <FractionInspector label="Rule" value="Part = Percent/100 × Base" />
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-300/10 dark:text-emerald-100"><p className="text-[10px] font-black uppercase tracking-wide">Result</p><p className="mt-2 text-3xl font-black">Part = {part}</p></div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setPercent(15); setBase(240); setAnswer(""); setFeedback("idle"); }}><RotateCcw className="h-4 w-4" />Reset example</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function PercentBar({ label, value, max, color, output }: { label: string; value: number; max: number; color: string; output: string }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return <div><div className="mb-2 flex items-center justify-between gap-2 text-sm font-black"><span>{label}</span><span>{output}</span></div><div className="h-5 overflow-hidden rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"><div className={`h-full rounded-full transition-[width] motion-reduce:transition-none ${color}`} style={{ width: `${width}%` }} /></div></div>;
}

function RatioCalculatorLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [partA, setPartA] = useState(24);
  const [partB, setPartB] = useState(36);
  const [practiceA, setPracticeA] = useState("3");
  const [practiceB, setPracticeB] = useState("5");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setPartA(24);
    setPartB(36);
    setPracticeA("3");
    setPracticeB("5");
    setFeedback("idle");
  }, [resetToken]);

  const commonFactor = greatestCommonDivisor(partA, partB);
  const simpleA = partA / commonFactor;
  const simpleB = partB / commonFactor;
  const update = (side: "a" | "b", value: number) => {
    const safeValue = Math.max(1, Math.round(value));
    const before = side === "a" ? partA : partB;
    if (side === "a") setPartA(safeValue); else setPartB(safeValue);
    setFeedback("idle");
    onInteraction(createLessonInteractionEvent({ controlId: `ratio-${side}`, kind: "slider", before, after: safeValue, affectedOutputs: ["ratio-bars", "ratio-factor", "ratio-simplest"] }));
  };

  return (
    <AdapterFrame title="Ratio Calculator live calculator" value={`${partA}:${partB} = ${simpleA}:${simpleB}`} footer="The ratio bars, tile groups, double number line, and simplification trace share the same pair of values.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Ratio rule · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Ratio Lab: simplify and compare {partA}:{partB}</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Ratio simplification trace</span></div>

          <div className="mt-5 space-y-5">
            <RatioComparisonBar label="Part A" value={partA} groupSize={commonFactor} color="bg-cyan-500" onChange={(value) => update("a", value)} />
            <RatioComparisonBar label="Part B" value={partB} groupSize={commonFactor} color="bg-violet-500" onChange={(value) => update("b", value)} />
            <div className="rounded-2xl border border-cyan-200 bg-white/85 p-4 text-center dark:border-cyan-300/20 dark:bg-slate-950/60">
              <p className="font-mono text-2xl font-black text-slate-950 dark:text-white">{partA} : {partB} = {partA}/{commonFactor} : {partB}/{commonFactor} = <span className="text-cyan-700 dark:text-cyan-300">{simpleA} : {simpleB}</span></p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-black"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">same factor ÷ {commonFactor}</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">comparison preserved</span></div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-sm font-black text-slate-950 dark:text-white">Tile model</p><RatioTiles label={`A = ${partA}`} count={partA} groupSize={commonFactor} color="bg-cyan-400" /><RatioTiles label={`B = ${partB}`} count={partB} groupSize={commonFactor} color="bg-violet-400" /></div>
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-sm font-black text-slate-950 dark:text-white">Double number line</p><DoubleRatioLine label="A" end={partA} step={commonFactor} color="bg-cyan-500" /><DoubleRatioLine label="B" end={partB} step={commonFactor} color="bg-violet-500" /></div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-3xl border border-violet-100 bg-white/85 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><p className="mt-1 text-sm font-black">Simplify 18:30 and describe the comparison.</p><div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2"><input aria-label="Simplified ratio first term" value={practiceA} onChange={(event) => { setPracticeA(event.target.value); setFeedback("idle"); }} className="rounded-xl border border-slate-200 px-3 py-2 text-center font-mono font-black dark:border-white/10 dark:bg-slate-900" /><span className="font-black">:</span><input aria-label="Simplified ratio second term" value={practiceB} onChange={(event) => { setPracticeB(event.target.value); setFeedback("idle"); }} className="rounded-xl border border-slate-200 px-3 py-2 text-center font-mono font-black dark:border-white/10 dark:bg-slate-900" /></div><button type="button" className="action-primary mt-3 w-full justify-center" onClick={() => setFeedback(Number(practiceA) === 3 && Number(practiceB) === 5 ? "correct" : "incorrect")}>Check ratio</button></div>
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Feedback</p>{feedback === "idle" ? <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Use the greatest common factor to simplify both terms.</p> : <p role="status" className={feedback === "correct" ? "mt-2 rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-800" : "mt-2 rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-900"}>{feedback === "correct" ? "18:30 simplifies to 3:5. For every 3 of A, there are 5 of B." : "Divide both 18 and 30 by their greatest common factor, 6."}</p>}</div>
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Ratio" value={`${partA} : ${partB}`} note="Part A : Part B" />
          <FractionInspector label="Common factor" value={String(commonFactor)} note={`Divide both terms by ${commonFactor}.`} />
          <FractionInspector label="Simplest form" value={`${simpleA} : ${simpleB}`} success />
          <FractionInspector label="Meaning" value={`For every ${simpleA} of A, there are ${simpleB} of B.`} />
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: divide both terms by the same factor. Changing only one term changes the comparison.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setPartA(24); setPartB(36); }}><RotateCcw className="h-4 w-4" />Reset 24:36</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function RatioComparisonBar({ label, value, groupSize, color, onChange }: { label: string; value: number; groupSize: number; color: string; onChange: (value: number) => void }) {
  const groups = Math.max(1, Math.round(value / groupSize));
  return <div className="grid gap-3 md:grid-cols-[110px_minmax(0,1fr)] md:items-center"><label className="text-sm font-black">{label} ({value})<input aria-label={`${label} value`} type="range" min="1" max="60" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 block w-full" /></label><div><p className="mb-2 text-center text-xs font-bold text-slate-500 dark:text-slate-300">Split into equal groups of {groupSize}</p><div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(12, groups)}, minmax(0,1fr))` }}>{Array.from({ length: Math.min(12, groups) }, (_, index) => <span key={index} className={`flex h-12 items-center justify-center rounded-xl font-mono text-xs font-black text-white ${color}`}>{groupSize}</span>)}</div><p className="mt-2 text-center text-xs font-black">{groups} {groups === 1 ? "group" : "groups"}</p></div></div>;
}

function RatioTiles({ label, count, groupSize, color }: { label: string; count: number; groupSize: number; color: string }) {
  const visibleCount = Math.min(60, Math.max(1, count));
  return <div className="mt-3"><div className="mb-1 flex items-center justify-between text-xs font-black"><span>{label}</span><span>{Math.round(count / groupSize)} groups of {groupSize}</span></div><div className="flex flex-wrap gap-1">{Array.from({ length: visibleCount }, (_, index) => <span key={index} className={`h-3 w-3 rounded-sm ${color} ${(index + 1) % groupSize === 0 ? "mr-2" : ""}`} />)}</div></div>;
}

function DoubleRatioLine({ label, end, step, color }: { label: string; end: number; step: number; color: string }) {
  const marks = Array.from({ length: Math.max(2, Math.min(6, Math.floor(end / step) + 1)) }, (_, index) => Math.min(end, index * step));
  return <div className="mt-5"><div className="flex items-center gap-2"><span className="w-5 text-xs font-black">{label}</span><div className="relative h-1 flex-1 rounded-full bg-slate-200 dark:bg-white/20"><div className={`absolute inset-y-0 left-0 right-0 rounded-full ${color}`} />{marks.map((mark) => <span key={mark} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950" style={{ left: `${(mark / end) * 100}%` }}><span className="absolute left-1/2 top-3 -translate-x-1/2 text-[9px] font-black">{mark}</span></span>)}</div></div></div>;
}

function greatestCommonDivisor(first: number, second: number) {
  let a = Math.abs(Math.round(first));
  let b = Math.abs(Math.round(second));
  while (b) [a, b] = [b, a % b];
  return Math.max(1, a);
}

function PowersAndRootsLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [radicand, setRadicand] = useState(144);
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setRadicand(144);
    setBase(2);
    setExponent(3);
    setShowPractice(false);
  }, [resetToken]);

  const root = Math.sqrt(radicand);
  const rootLabel = Number.isInteger(root) ? String(root) : root.toFixed(3);
  const power = base ** exponent;
  const total = root + power;
  const totalLabel = Number.isInteger(total) ? String(total) : total.toFixed(3);
  const squareSide = Math.max(1, Math.min(16, Math.round(root)));
  const changeValue = (kind: "radicand" | "base" | "exponent", nextValue: number) => {
    const before = kind === "radicand" ? radicand : kind === "base" ? base : exponent;
    if (kind === "radicand") setRadicand(Math.max(1, Math.round(nextValue)));
    if (kind === "base") setBase(Math.max(1, Math.round(nextValue)));
    if (kind === "exponent") setExponent(Math.max(1, Math.round(nextValue)));
    onInteraction(createLessonInteractionEvent({ controlId: `power-root-${kind}`, kind: "slider", before, after: nextValue, affectedOutputs: ["root-square", "power-model", "power-root-result"] }));
  };

  return (
    <AdapterFrame title="Powers and Roots live calculator" value={`√${radicand} + ${base}^${exponent} = ${totalLabel}`} footer="The square model, repeated factors, result trace, and inspector all respond to the same three controls.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Power-root rule · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Build √{radicand} + {base}<sup>{exponent}</sup></h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Power-root inverse pair</span></div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Square root</p><h4 className="mt-1 text-lg font-black">What side makes area {radicand}?</h4></div><strong className="font-mono text-3xl text-cyan-700 dark:text-cyan-300">√{radicand}</strong></div>
              <div className="mx-auto mt-4 grid aspect-square w-full max-w-[280px] gap-px rounded-2xl border-4 border-cyan-500 bg-cyan-200 p-1 shadow-inner dark:bg-cyan-950" style={{ gridTemplateColumns: `repeat(${squareSide}, minmax(0,1fr))` }} role="img" aria-label={`${squareSide} by ${squareSide} square grid representing area ${squareSide * squareSide}`}>
                {Array.from({ length: squareSide * squareSide }, (_, index) => <span key={index} className="rounded-[2px] bg-cyan-400/80 dark:bg-cyan-300/70" />)}
              </div>
              <p className="mt-3 text-center font-mono text-base font-black">{rootLabel} × {rootLabel} = {Number.isInteger(root) ? radicand : `${rootLabel}² (approximately)`}</p>
              {!Number.isInteger(root) ? <p className="mt-2 rounded-xl bg-amber-50 p-2 text-center text-xs font-black text-amber-900">{radicand} is not a perfect square, so the grid rounds to {squareSide} × {squareSide}.</p> : null}
            </article>

            <article className="rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Power</p><h4 className="mt-1 text-lg font-black">Repeat the base {exponent} times</h4></div><strong className="font-mono text-3xl text-violet-700 dark:text-violet-300">{base}<sup>{exponent}</sup></strong></div>
              <div className="mt-5 flex min-h-32 flex-wrap items-center justify-center gap-2" role="img" aria-label={`${base} multiplied by itself ${exponent} times`}>
                {Array.from({ length: exponent }, (_, index) => <div key={index} className="flex items-center gap-2"><span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-violet-300 bg-violet-100 font-mono text-2xl font-black text-violet-800 shadow-[6px_6px_0_rgba(139,92,246,0.18)] dark:bg-violet-300/15 dark:text-violet-100">{base}</span>{index < exponent - 1 ? <span className="text-2xl font-black text-slate-400">×</span> : null}</div>)}
              </div>
              <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-center dark:bg-violet-300/10"><p className="font-mono text-lg font-black">{Array.from({ length: exponent }, () => base).join(" × ")} = {power}</p><p className="mt-1 text-xs font-bold text-violet-700 dark:text-violet-200">Exponent {exponent} counts equal factors—not multiplication by {exponent}.</p></div>
            </article>
          </div>

          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:bg-emerald-300/10"><p className="text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Exact result overlay</p><p className="mt-2 font-mono text-2xl font-black text-slate-950 dark:text-white">√{radicand} + {base}<sup>{exponent}</sup> = {rootLabel} + {power} = <span className="text-emerald-700 dark:text-emerald-300">{totalLabel}</span></p></div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <PowerRootControl label="Radicand" value={radicand} min={1} max={225} onChange={(value) => changeValue("radicand", value)} />
            <PowerRootControl label="Base" value={base} min={1} max={8} onChange={(value) => changeValue("base", value)} />
            <PowerRootControl label="Exponent" value={exponent} min={1} max={5} onChange={(value) => changeValue("exponent", value)} />
          </div>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/85 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-xl font-black">√81 + 3<sup>2</sup> = ?</p><button type="button" className="action-primary" onClick={() => { setShowPractice((current) => !current); onInteraction(createLessonInteractionEvent({ controlId: "power-root-practice", kind: "selection", before: showPractice, after: !showPractice, affectedOutputs: ["power-root-practice-answer"] })); }}>{showPractice ? "Hide reasoning" : "Reveal reasoning"}</button></div>{showPractice ? <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">√81 + 3² = 9 + 9 = 18</p> : <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Find the square root and power separately, then add.</p>}</div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Root" value={`√${radicand} = ${rootLabel}`} note="A square root asks for the side length." />
          <FractionInspector label="Power" value={`${base}^${exponent} = ${power}`} note={`${exponent} equal factors of ${base}.`} />
          <FractionInspector label="Result" value={totalLabel} success />
          <FractionInspector label="Rule" value="Roots undo powers" note={`When a ≥ 0, √(a²) = a.`} />
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: {base}<sup>{exponent}</sup> means repeated multiplication. It does not mean {base} × {exponent}.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setRadicand(144); setBase(2); setExponent(3); setShowPractice(false); }}><RotateCcw className="h-4 w-4" />Reset example</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function PowerRootControl({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-black dark:border-white/10 dark:bg-slate-950/60">{label}<div className="mt-2 flex items-center gap-3"><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-w-0 flex-1" /><output className="w-14 rounded-xl bg-slate-100 px-2 py-1 text-center font-mono dark:bg-white/10">{value}</output></div></label>;
}

function ScientificNotationLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [coefficient, setCoefficient] = useState(6.02);
  const [exponent, setExponent] = useState(5);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setCoefficient(6.02);
    setExponent(5);
    setPracticeAnswer("");
    setFeedback("idle");
  }, [resetToken]);

  const standardValue = coefficient * 10 ** exponent;
  const standardLabel = formatStandardNumber(standardValue);
  const movement = Array.from({ length: exponent + 1 }, (_, step) => formatStandardNumber(coefficient * 10 ** step));
  const update = (kind: "coefficient" | "exponent", nextValue: number) => {
    const before = kind === "coefficient" ? coefficient : exponent;
    if (kind === "coefficient") setCoefficient(Number(nextValue.toFixed(2))); else setExponent(Math.round(nextValue));
    setFeedback("idle");
    onInteraction(createLessonInteractionEvent({ controlId: `scientific-${kind}`, kind: "slider", before, after: nextValue, affectedOutputs: ["coefficient-line", "decimal-track", "scientific-result"] }));
  };

  return (
    <AdapterFrame title="Scientific Notation live calculator" value={`${coefficient} × 10^${exponent} = ${standardLabel}`} footer="The coefficient line, decimal jumps, powers-of-ten ladder, and standard form remain linked.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Scientific notation · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Coefficient × power of ten</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Scientific notation scale</span></div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <PowerRootControl label="Coefficient (1 to 10)" value={coefficient} min={1} max={9.99} step={0.01} onChange={(value) => update("coefficient", value)} />
            <PowerRootControl label="Exponent (power of ten)" value={exponent} min={0} max={6} onChange={(value) => update("exponent", value)} />
          </div>

          <article className="mt-4 rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-2"><h4 className="font-black">1. Coefficient on the number line</h4><span className="text-xs font-bold text-slate-500">between 1 and 10</span></div>
            <div className="relative mx-3 mt-10 h-12" role="img" aria-label={`Coefficient ${coefficient} between 1 and 10`}><div className="absolute inset-x-0 top-2 h-1 rounded-full bg-cyan-300" />{Array.from({ length: 10 }, (_, index) => <span key={index} className="absolute top-0 h-5 w-px bg-slate-500" style={{ left: `${(index / 9) * 100}%` }} />)}<span className="absolute top-0 h-6 w-6 -translate-x-1/2 -translate-y-2 rounded-full border-4 border-white bg-cyan-600 shadow" style={{ left: `${((coefficient - 1) / 9) * 100}%` }}><strong className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-cyan-700 dark:text-cyan-300">{coefficient}</strong></span><span className="absolute left-0 top-7 text-xs font-black">1</span><span className="absolute right-0 top-7 text-xs font-black">10</span></div>
          </article>

          <article className="mt-4 rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60">
            <h4 className="font-black">2. Move the decimal {exponent} {exponent === 1 ? "place" : "places"} to the right</h4>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-label="Decimal movement track">{movement.map((value, index) => <div key={`${value}-${index}`} className="flex items-center gap-2"><span className={index === movement.length - 1 ? "rounded-xl bg-cyan-600 px-3 py-2 font-mono text-sm font-black text-white shadow" : "rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-mono text-sm font-black text-cyan-950"}>{value}</span>{index < movement.length - 1 ? <span className="flex items-center gap-1 text-cyan-700"><small className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 font-black">{index + 1}</small>→</span> : null}</div>)}</div>
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-violet-50 p-4 text-center dark:from-cyan-300/10 dark:to-violet-300/10"><p className="font-mono text-2xl font-black">{coefficient} × 10<sup>{exponent}</sup> = <span className="text-cyan-700 dark:text-cyan-300">{standardLabel}</span></p><p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">Each × 10 jump moves every digit one place left in the place-value chart.</p></div>
          </article>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><p className="mt-1 text-base font-black">Write 4.7 × 10<sup>3</sup> in standard form.</p><div className="mt-3 flex flex-wrap gap-2"><input aria-label="Scientific notation practice answer" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(event.target.value); setFeedback("idle"); }} className="min-w-[180px] flex-1 rounded-2xl border border-slate-200 px-3 py-2 font-mono font-black dark:border-white/10 dark:bg-slate-900" placeholder="Standard form" /><button type="button" className="action-primary" onClick={() => setFeedback(Number(practiceAnswer.replace(/,/g, "")) === 4700 ? "correct" : "incorrect")}>Check answer</button></div>{feedback !== "idle" ? <p role="status" className={feedback === "correct" ? "mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800" : "mt-3 rounded-2xl bg-amber-50 p-3 font-black text-amber-900"}>{feedback === "correct" ? "Correct: 4.7 → 47 → 470 → 4,700." : "Make three × 10 jumps to the right: 4.7 → 47 → 470 → 4,700."}</p> : null}</div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Coefficient" value={String(coefficient)} note="It stays at least 1 and less than 10." />
          <FractionInspector label="Power" value={`10^${exponent}`} note={`Multiply by 10, ${exponent} ${exponent === 1 ? "time" : "times"}.`} />
          <FractionInspector label="Decimal moves" value={`${exponent} ${exponent === 1 ? "place" : "places"} right`} />
          <FractionInspector label="Standard form" value={standardLabel} success />
          <div className="rounded-3xl border border-violet-200 bg-white p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-sm font-black">Powers of ten ladder</p><div className="mt-3 space-y-2">{Array.from({ length: 6 }, (_, powerIndex) => <div key={powerIndex} className={powerIndex === exponent ? "flex items-center justify-between rounded-xl bg-violet-100 px-3 py-2 font-mono text-sm font-black text-violet-900" : "flex items-center justify-between border-l-2 border-violet-300 px-3 font-mono text-xs font-bold"}><span>10<sup>{powerIndex}</sup></span><span>{formatStandardNumber(Math.pow(10, powerIndex))}</span></div>)}</div></div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: the exponent counts place-value jumps. Do not multiply the coefficient by the exponent.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setCoefficient(6.02); setExponent(5); setPracticeAnswer(""); setFeedback("idle"); }}><RotateCcw className="h-4 w-4" />Reset example</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function formatStandardNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(Number(value.toFixed(8)));
}

function LogarithmsLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [base, setBase] = useState(10);
  const [exponent, setExponent] = useState(3);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setBase(10);
    setExponent(3);
    setShowPractice(false);
  }, [resetToken]);

  const target = base ** exponent;
  const targetLabel = formatStandardNumber(target);
  const update = (kind: "base" | "exponent", value: number) => {
    const safeValue = Math.round(value);
    const before = kind === "base" ? base : exponent;
    if (kind === "base") setBase(safeValue); else setExponent(safeValue);
    onInteraction(createLessonInteractionEvent({ controlId: `logarithm-${kind}`, kind: "slider", before, after: safeValue, affectedOutputs: ["log-power-ladder", "log-inverse-strip", "log-result"] }));
  };

  return (
    <AdapterFrame title="Logarithms live calculator" value={`log${base}(${targetLabel}) = ${exponent}`} footer="The logarithm question and power check are two directions through the same base–exponent–target relationship.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Log rule · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">A logarithm asks for an exponent</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Log as exponent question</span></div>
          <p className="mt-3 rounded-2xl bg-white/70 p-3 font-mono text-lg font-black dark:bg-white/10">We’re solving: log<sub>{base}</sub>({targetLabel}). What exponent on {base} gives {targetLabel}?</p>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)]">
            <article className="rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><h4 className="font-black text-violet-800 dark:text-violet-100">Build powers of {base}</h4><div className="mt-3 space-y-2">{Array.from({ length: exponent + 1 }, (_, powerIndex) => { const ladderValue = base ** powerIndex; const active = powerIndex === exponent; return <div key={powerIndex} className={active ? "grid grid-cols-[1fr_auto_1fr] items-center rounded-2xl border-2 border-violet-300 bg-violet-50 p-3 font-mono text-lg font-black text-violet-900" : "grid grid-cols-[1fr_auto_1fr] items-center border-l-2 border-slate-200 px-3 py-2 font-mono text-sm font-bold"}><span>{base}<sup>{powerIndex}</sup></span><span>=</span><span className="text-right">{formatStandardNumber(ladderValue)}</span></div>; })}</div><p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">Find the exponent whose power matches the target.</p></article>

            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60"><div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-violet-50 p-5 text-center dark:from-cyan-300/10 dark:to-violet-300/10"><p className="font-mono text-3xl font-black">log<sub>{base}</sub>({targetLabel}) = <span className="text-violet-700 dark:text-violet-300">{exponent}</span></p><p className="mt-3 font-mono text-lg font-black">because {base}<sup>{exponent}</sup> = {targetLabel}</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-center dark:bg-cyan-300/10"><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Exponentiation →</p><p className="mt-2 font-mono font-black">base + exponent → power</p><p className="mt-2 text-sm font-bold">{base}, {exponent} → {targetLabel}</p></div><div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center dark:bg-violet-300/10"><p className="text-xs font-black uppercase text-violet-700 dark:text-violet-200">← Logarithm</p><p className="mt-2 font-mono font-black">base + power → exponent</p><p className="mt-2 text-sm font-bold">{base}, {targetLabel} → {exponent}</p></div></div><p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center text-sm font-black text-emerald-800">Match found: {base}<sup>{exponent}</sup> lands exactly on {targetLabel}.</p></article>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2"><PowerRootControl label="Base" value={base} min={2} max={12} onChange={(value) => update("base", value)} /><PowerRootControl label="Exponent (answer)" value={exponent} min={0} max={5} onChange={(value) => update("exponent", value)} /></div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-xl font-black">What is log<sub>10</sub>(10,000)?</p><button type="button" className="action-primary" onClick={() => { setShowPractice((current) => !current); onInteraction(createLessonInteractionEvent({ controlId: "log-practice", kind: "selection", before: showPractice, after: !showPractice, affectedOutputs: ["log-practice-answer"] })); }}>{showPractice ? "Hide answer" : "Reveal answer"}</button></div>{showPractice ? <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">4, because 10⁴ = 10,000</p> : <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Ask: “10 to what power gives 10,000?”</p>}</div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Question" value={`log_${base}(${targetLabel})`} note={`What exponent gives ${targetLabel}?`} />
          <FractionInspector label="Base" value={String(base)} note={base === 10 ? "Base 10 is the common logarithm." : `This example uses base ${base}.`} />
          <FractionInspector label="Power check" value={`${base}^${exponent} = ${targetLabel}`} />
          <FractionInspector label="Output" value={String(exponent)} note="The exponent is the answer." success />
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100"><p className="text-[10px] font-black uppercase tracking-wide">Key idea</p><p className="mt-2 text-lg font-black">Log is the exponent answer.</p><p className="mt-1 text-sm font-semibold">A logarithm reverses exponentiation.</p></div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: log<sub>10</sub>({targetLabel}) is not {targetLabel} ÷ 10. It asks how many factors of 10 build the target.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setBase(10); setExponent(3); setShowPractice(false); }}><RotateCcw className="h-4 w-4" />Reset log₁₀(1000)</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function ExponentialCalculationsLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(8);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setBase(2);
    setExponent(8);
    setPracticeAnswer("");
    setFeedback("idle");
  }, [resetToken]);

  const output = base ** exponent;
  const growthSteps = Array.from({ length: exponent + 1 }, (_, index) => base ** index);
  const maxGrowth = Math.max(...growthSteps);
  const update = (kind: "base" | "exponent", value: number) => {
    const safeValue = Math.round(value);
    const before = kind === "base" ? base : exponent;
    if (kind === "base") setBase(safeValue); else setExponent(safeValue);
    setFeedback("idle");
    onInteraction(createLessonInteractionEvent({ controlId: `exponential-${kind}`, kind: "slider", before, after: safeValue, affectedOutputs: ["factor-chain", "growth-staircase", "growth-chart", "exponential-output"] }));
  };

  return (
    <AdapterFrame title="Exponential Calculations live calculator" value={`${base}^${exponent} = ${formatStandardNumber(output)}`} footer="Every model uses the same base and exponent: the exponent counts equal factors and growth steps.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Exponential rule · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Exponential growth lab: {base}<sup>{exponent}</sup></h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">Exponential repeated factors</span></div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(230px,.6fr)]">
            <article className="rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-sm font-black">Repeated multiplication (factor chain)</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2">{Array.from({ length: exponent }, (_, index) => <div key={index} className="flex items-center gap-2"><span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-violet-300 bg-violet-50 font-mono text-lg font-black text-violet-800 dark:bg-violet-300/10 dark:text-violet-100">{base}</span>{index < exponent - 1 ? <span className="font-black text-violet-500">×</span> : null}</div>)}</div><p className="mt-3 text-center text-xs font-black">{exponent} {exponent === 1 ? "factor" : "factors"} of {base}</p></article>
            <article className="flex flex-col items-center justify-center rounded-3xl border border-orange-200 bg-gradient-to-br from-violet-50 to-orange-50 p-4 text-center dark:border-orange-300/20 dark:from-violet-300/10 dark:to-orange-300/10"><p className="font-mono text-4xl font-black text-violet-800 dark:text-violet-200">{base}<sup>{exponent}</sup> = <span className="text-orange-600 dark:text-orange-300">{formatStandardNumber(output)}</span></p><p className="mt-3 rounded-full bg-white px-3 py-1 text-sm font-black text-rose-600 shadow-sm dark:bg-white/10">not {base} × {exponent}</p></article>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2"><PowerRootControl label="Base" value={base} min={2} max={6} onChange={(value) => update("base", value)} /><PowerRootControl label="Exponent" value={exponent} min={1} max={8} onChange={(value) => update("exponent", value)} /></div>

          <article className="mt-4 rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60"><div className="flex items-center justify-between gap-2"><h4 className="font-black">Growth staircase</h4><span className="text-xs font-black text-cyan-700 dark:text-cyan-200">each step × {base}</span></div><div className="mt-5 flex items-end overflow-x-auto pb-2">{growthSteps.map((value, index) => <div key={index} className="min-w-[72px] flex-1 text-center"><strong className={index === exponent ? "font-mono text-sm text-orange-600" : "font-mono text-xs"}>{formatStandardNumber(value)}</strong><div className={index === exponent ? "mt-1 border-r-2 border-t-2 border-orange-500 bg-orange-100/70" : "mt-1 border-r-2 border-t-2 border-violet-500 bg-violet-100/60"} style={{ height: `${32 + index * 11}px` }} /><span className={index === exponent ? "font-mono text-sm font-black text-orange-600" : "font-mono text-xs font-black"}>{base}<sup>{index}</sup></span></div>)}</div></article>

          <article className="mt-4 rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><h4 className="font-black">Growth chart</h4><div className="mt-4 flex h-44 items-end gap-2" role="img" aria-label={`Growth bars from ${base} to exponent ${exponent}`}>{growthSteps.map((value, index) => <div key={index} className="flex min-w-0 flex-1 flex-col items-center justify-end"><span className="mb-1 truncate font-mono text-[10px] font-black">{formatStandardNumber(value)}</span><span className={index === exponent ? "w-full rounded-t-lg bg-orange-500" : "w-full rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-400"} style={{ height: `${Math.max(8, (value / maxGrowth) * 118)}px` }} /><span className="mt-1 font-mono text-[10px] font-black">{base}<sup>{index}</sup></span></div>)}</div></article>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><p className="mt-1 text-base font-black">Evaluate 3<sup>4</sup> = 3 × 3 × 3 × 3.</p><div className="mt-3 flex flex-wrap gap-2"><input aria-label="Exponential calculation practice answer" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(event.target.value); setFeedback("idle"); }} className="min-w-[180px] flex-1 rounded-2xl border border-slate-200 px-3 py-2 font-mono font-black dark:border-white/10 dark:bg-slate-900" placeholder="Product" /><button type="button" className="action-primary" onClick={() => setFeedback(Number(practiceAnswer) === 81 ? "correct" : "incorrect")}>Check answer</button></div>{feedback !== "idle" ? <p role="status" className={feedback === "correct" ? "mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800" : "mt-3 rounded-2xl bg-amber-50 p-3 font-black text-amber-900"}>{feedback === "correct" ? "Correct: 3 × 3 × 3 × 3 = 9 × 9 = 81." : "Multiply four factors of 3: 3 × 3 × 3 × 3."}</p> : null}</div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Base" value={String(base)} note="The number being multiplied." />
          <FractionInspector label="Exponent" value={String(exponent)} note="How many times the base is used as a factor." />
          <FractionInspector label="Repeated factors" value={Array.from({ length: exponent }, () => base).join(" × ")} />
          <FractionInspector label="Output" value={formatStandardNumber(output)} success />
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-black leading-6 text-rose-900 dark:bg-rose-300/10 dark:text-rose-100"><p className="text-[10px] uppercase tracking-wide">Misconception guard</p>Exponent counts factors. {base}<sup>{exponent}</sup> means {exponent} {base}s multiplied, not {base} × {exponent}.</div>
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100"><strong>Think bigger:</strong> increasing the exponent by 1 multiplies the previous value by {base}.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setBase(2); setExponent(8); setPracticeAnswer(""); setFeedback("idle"); }}><RotateCcw className="h-4 w-4" />Reset 2⁸</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function TrigonometricCalculatorLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [mode, setMode] = useState<AngleMode>("DEG");
  const [sineAngle, setSineAngle] = useState(30);
  const [cosineAngle, setCosineAngle] = useState(60);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setMode("DEG");
    setSineAngle(30);
    setCosineAngle(60);
    setShowPractice(false);
  }, [resetToken]);

  const toRadians = (angle: number) => mode === "DEG" ? angle * Math.PI / 180 : angle;
  const sineValue = Math.sin(toRadians(sineAngle));
  const cosineValue = Math.cos(toRadians(cosineAngle));
  const output = sineValue + cosineValue;
  const sineLabel = trigDecimal(sineValue);
  const cosineLabel = trigDecimal(cosineValue);
  const outputLabel = trigDecimal(output);
  const updateAngle = (kind: "sine" | "cosine", value: number) => {
    const nextValue = Math.round(value);
    const before = kind === "sine" ? sineAngle : cosineAngle;
    if (kind === "sine") setSineAngle(nextValue); else setCosineAngle(nextValue);
    onInteraction(createLessonInteractionEvent({ controlId: `trig-${kind}-angle`, kind: "slider", before, after: nextValue, affectedOutputs: ["unit-circle", "trig-triangles", "trig-output"] }));
  };
  const setAngleMode = (nextMode: AngleMode) => {
    const before = mode;
    setMode(nextMode);
    onInteraction(createLessonInteractionEvent({ controlId: "trig-angle-mode", kind: "selection", before, after: nextMode, affectedOutputs: ["trig-values", "trig-output", "mode-warning"] }));
  };

  return (
    <AdapterFrame title="Trigonometric Calculator live calculator" value={`sin(${sineAngle}${mode === "DEG" ? "°" : ""}) + cos(${cosineAngle}${mode === "DEG" ? "°" : ""}) = ${outputLabel}`} footer="Angle handles, mode, unit-circle rays, component triangles, and output are evaluated together.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Trig mode · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Special-angle lab: sine + cosine</h3></div><div className="flex items-center gap-2"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">Mode matters</span><div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/10" aria-label="Trig angle mode">{(["DEG", "RAD"] as AngleMode[]).map((angleMode) => <button key={angleMode} type="button" className={mode === angleMode ? "rounded-lg bg-cyan-600 px-3 py-2 text-xs font-black text-white" : "rounded-lg px-3 py-2 text-xs font-black"} onClick={() => setAngleMode(angleMode)}>{angleMode}</button>)}</div></div></div>
          <p className="mt-3 rounded-2xl bg-white/70 p-3 font-mono text-lg font-black dark:bg-white/10">sin({sineAngle}{mode === "DEG" ? "°" : " rad"}) + cos({cosineAngle}{mode === "DEG" ? "°" : " rad"})</p>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(300px,1fr)_minmax(280px,1fr)]">
            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60"><h4 className="font-black">Unit circle and angle handles</h4><TrigUnitCircle sineAngle={sineAngle} cosineAngle={cosineAngle} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><PowerRootControl label="Sine angle" value={sineAngle} min={0} max={90} onChange={(value) => updateAngle("sine", value)} /><PowerRootControl label="Cosine angle" value={cosineAngle} min={0} max={90} onChange={(value) => updateAngle("cosine", value)} /></div></article>
            <div className="space-y-3"><TrigTriangleCard kind="sin" angle={sineAngle} value={sineLabel} accent="cyan" /><TrigTriangleCard kind="cos" angle={cosineAngle} value={cosineLabel} accent="violet" /></div>
          </div>

          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:bg-emerald-300/10"><p className="text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Combine the values</p><p className="mt-2 font-mono text-2xl font-black text-slate-950 dark:text-white">sin({sineAngle}{mode === "DEG" ? "°" : ""}) + cos({cosineAngle}{mode === "DEG" ? "°" : ""}) = {sineLabel} + {cosineLabel} = <span className="text-emerald-700 dark:text-emerald-300">{outputLabel}</span></p>{mode === "RAD" ? <p className="mt-2 rounded-xl bg-amber-100 p-2 text-sm font-black text-amber-900">These inputs are now radians. The familiar 30° and 60° special-angle values no longer apply.</p> : null}</div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/60"><table className="w-full text-center text-sm"><caption className="p-3 text-left font-black">Special-angle values (DEG)</caption><thead className="bg-slate-50 dark:bg-white/10"><tr><th className="p-2">Angle</th><th>30°</th><th>45°</th><th>60°</th></tr></thead><tbody><tr><th className="p-2 text-cyan-700">sin θ</th><td>1/2</td><td>√2/2</td><td>√3/2</td></tr><tr><th className="p-2 text-violet-700">cos θ</th><td>√3/2</td><td>√2/2</td><td>1/2</td></tr></tbody></table></div>
            <div className="rounded-3xl border border-violet-100 bg-white/85 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><p className="mt-1 text-base font-black">Evaluate sin(45°) + cos(45°).</p><button type="button" className="action-primary mt-3 w-full justify-center" onClick={() => { setShowPractice((current) => !current); onInteraction(createLessonInteractionEvent({ controlId: "trig-practice", kind: "selection", before: showPractice, after: !showPractice, affectedOutputs: ["trig-practice-answer"] })); }}>{showPractice ? "Hide answer" : "Reveal answer"}</button>{showPractice ? <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">√2 ≈ 1.414, because √2/2 + √2/2 = √2</p> : null}</div>
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Mode" value={mode} note={mode === "DEG" ? "Values are computed in degree mode." : "Values are computed in radian mode."} />
          <FractionInspector label={`sin(${sineAngle}${mode === "DEG" ? "°" : ""})`} value={sineLabel} note={mode === "DEG" && sineAngle === 30 ? "Exact value = 1/2" : undefined} />
          <FractionInspector label={`cos(${cosineAngle}${mode === "DEG" ? "°" : ""})`} value={cosineLabel} note={mode === "DEG" && cosineAngle === 60 ? "Exact value = 1/2" : undefined} />
          <FractionInspector label="Output" value={outputLabel} success />
          <FractionInspector label="Check" value="Trig angle-mode check" note="Confirm DEG or RAD before evaluating." />
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Wrong mode gives a misleading answer. A calculator reads 30 as 30 radians when RAD is selected.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setMode("DEG"); setSineAngle(30); setCosineAngle(60); setShowPractice(false); }}><RotateCcw className="h-4 w-4" />Reset special angles</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function TrigUnitCircle({ sineAngle, cosineAngle }: { sineAngle: number; cosineAngle: number }) {
  const point = (angle: number) => ({ x: 150 + 105 * Math.cos(angle * Math.PI / 180), y: 150 - 105 * Math.sin(angle * Math.PI / 180) });
  const sinePoint = point(sineAngle);
  const cosinePoint = point(cosineAngle);
  return <svg viewBox="0 0 300 300" className="mx-auto mt-3 w-full max-w-[330px]" role="img" aria-label={`Unit circle with ${sineAngle} degree and ${cosineAngle} degree rays`}><circle cx="150" cy="150" r="105" fill="rgba(14,165,233,.05)" stroke="currentColor" strokeWidth="2" className="text-slate-700 dark:text-slate-200"/><line x1="28" y1="150" x2="272" y2="150" stroke="currentColor" strokeDasharray="5 4" className="text-slate-400"/><line x1="150" y1="28" x2="150" y2="272" stroke="currentColor" strokeDasharray="5 4" className="text-slate-400"/><line x1="150" y1="150" x2={sinePoint.x} y2={sinePoint.y} stroke="#0891b2" strokeWidth="4"/><line x1="150" y1="150" x2={cosinePoint.x} y2={cosinePoint.y} stroke="#7c3aed" strokeWidth="4"/><circle cx={sinePoint.x} cy={sinePoint.y} r="7" fill="#0891b2"/><circle cx={cosinePoint.x} cy={cosinePoint.y} r="7" fill="#7c3aed"/><text x={sinePoint.x + 8} y={sinePoint.y - 8} fill="#0891b2" fontWeight="800" fontSize="13">{sineAngle}°</text><text x={cosinePoint.x + 8} y={cosinePoint.y - 8} fill="#7c3aed" fontWeight="800" fontSize="13">{cosineAngle}°</text><text x="265" y="166" fontSize="12" fontWeight="700">1</text><text x="156" y="42" fontSize="12" fontWeight="700">1</text></svg>;
}

function TrigTriangleCard({ kind, angle, value, accent }: { kind: "sin" | "cos"; angle: number; value: string; accent: "cyan" | "violet" }) {
  const color = accent === "cyan" ? "text-cyan-700 border-cyan-200 bg-cyan-50 dark:text-cyan-200 dark:bg-cyan-300/10" : "text-violet-700 border-violet-200 bg-violet-50 dark:text-violet-200 dark:bg-violet-300/10";
  return <article className={`rounded-3xl border p-4 ${color}`}><div className="flex items-center justify-between"><h4 className="font-black">{kind}({angle}°)</h4><strong className="font-mono text-2xl">{value}</strong></div><svg viewBox="0 0 220 125" className="mt-2 w-full" aria-label={`Right triangle illustrating ${kind} of ${angle} degrees`}><path d="M28 105 L188 105 L188 20 Z" fill="rgba(255,255,255,.55)" stroke="currentColor" strokeWidth="3"/><path d="M172 105 L172 89 L188 89" fill="none" stroke="currentColor" strokeWidth="2"/><text x="43" y="98" fontWeight="800" fontSize="13">{angle}°</text><text x="95" y="119" fontWeight="700" fontSize="12">adjacent</text><text x="192" y="70" fontWeight="700" fontSize="12">opposite</text></svg><p className="text-center text-xs font-bold">{kind === "sin" ? "opposite ÷ hypotenuse" : "adjacent ÷ hypotenuse"} = {value}</p></article>;
}

function trigDecimal(value: number) {
  const rounded = Math.abs(value) < 0.0000005 ? 0 : Number(value.toFixed(3));
  return String(rounded);
}

function InverseTrigonometryLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [ratio, setRatio] = useState(0.5);
  const [mode, setMode] = useState<AngleMode>("DEG");
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setRatio(0.5);
    setMode("DEG");
    setShowPractice(false);
  }, [resetToken]);

  const radians = Math.asin(ratio);
  const degrees = radians * 180 / Math.PI;
  const angleValue = mode === "DEG" ? degrees : radians;
  const angleLabel = `${trigDecimal(angleValue)}${mode === "DEG" ? "°" : " rad"}`;
  const checkLabel = trigDecimal(Math.sin(radians));
  const circleX = 150 + 105 * Math.cos(radians);
  const circleY = 150 - 105 * Math.sin(radians);
  const updateRatio = (value: number) => {
    const next = Number(Math.max(-1, Math.min(1, value)).toFixed(2));
    const before = ratio;
    setRatio(next);
    onInteraction(createLessonInteractionEvent({ controlId: "inverse-sine-ratio", kind: "slider", before, after: next, affectedOutputs: ["inverse-unit-circle", "inverse-triangle", "principal-angle", "inverse-check"] }));
  };

  return (
    <AdapterFrame title="Inverse Trigonometry live calculator" value={`asin(${ratio}) = ${angleLabel}`} footer="The ratio selects one principal angle; substituting that angle back into sine verifies the result.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Inverse trig · Concept trace</p><h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Inverse sine: ratio to principal angle</h3></div><div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/10">{(["DEG", "RAD"] as AngleMode[]).map((angleMode) => <button key={angleMode} type="button" className={mode === angleMode ? "rounded-lg bg-orange-500 px-3 py-2 text-xs font-black text-white" : "rounded-lg px-3 py-2 text-xs font-black"} onClick={() => setMode(angleMode)}>{angleMode}</button>)}</div></div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[240px_minmax(300px,1fr)_260px]">
            <article className="rounded-3xl border border-cyan-200 bg-white/90 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60"><p className="text-sm font-black">1. Set the sine ratio</p><p className="mt-2 text-xs font-semibold text-slate-500">On the unit circle, sine is the vertical coordinate.</p><div className="mt-12"><input aria-label="Inverse sine ratio" type="range" min="-1" max="1" step="0.01" value={ratio} onChange={(event) => updateRatio(Number(event.target.value))} className="w-full" /><div className="flex justify-between text-xs font-black"><span>−1</span><span>0</span><span>1</span></div></div><div className="mt-8 rounded-2xl bg-cyan-50 p-4 text-center dark:bg-cyan-300/10"><p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Current ratio</p><p className="mt-2 font-mono text-3xl font-black">y = {ratio}</p></div></article>

            <article className="rounded-3xl border border-violet-200 bg-white/90 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-sm font-black">2. Unit circle finds the main angle</p><svg viewBox="0 0 300 300" className="mx-auto mt-2 w-full max-w-[340px]" role="img" aria-label={`Unit circle principal angle ${angleLabel}`}><circle cx="150" cy="150" r="105" fill="rgba(139,92,246,.05)" stroke="currentColor" strokeWidth="2"/><line x1="28" y1="150" x2="272" y2="150" stroke="currentColor" strokeDasharray="5 4" className="text-slate-400"/><line x1="150" y1="28" x2="150" y2="272" stroke="currentColor" strokeDasharray="5 4" className="text-slate-400"/><line x1="45" y1={circleY} x2={circleX} y2={circleY} stroke="#0891b2" strokeDasharray="5 4"/><line x1="150" y1="150" x2={circleX} y2={circleY} stroke="#7c3aed" strokeWidth="4"/><circle cx={circleX} cy={circleY} r="8" fill="#7c3aed"/><text x={circleX > 225 ? circleX - 70 : circleX + 8} y={circleY - 10} fill="#7c3aed" fontWeight="800" fontSize="13">P(cos θ, {ratio})</text><text x="165" y={ratio >= 0 ? 138 : 170} fill="#7c3aed" fontWeight="800" fontSize="14">θ = {trigDecimal(degrees)}°</text></svg><p className="rounded-2xl bg-violet-50 p-3 text-center text-xs font-black text-violet-800 dark:bg-violet-300/10 dark:text-violet-100">The purple ray stays inside asin’s principal range, −90° to 90°.</p></article>

            <article className="rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-sm font-black">3. Right-triangle view</p><svg viewBox="0 0 220 180" className="mt-5 w-full" role="img" aria-label={`Right triangle with sine ratio ${ratio}`}><path d="M25 150 L190 150 L190 35 Z" fill="rgba(14,165,233,.05)" stroke="currentColor" strokeWidth="3"/><path d="M174 150 L174 134 L190 134" fill="none" stroke="currentColor" strokeWidth="2"/><text x="45" y="142" fill="#7c3aed" fontWeight="800">θ</text><text x="195" y="95" fill="#0891b2" fontWeight="800">opposite</text><text x="95" y="170" fontWeight="800">adjacent</text><text x="85" y="80" fontWeight="800">1</text></svg><p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-center font-mono text-sm font-black text-cyan-900">sin θ = opposite / hypotenuse = {ratio} / 1 = {ratio}</p></article>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 text-center dark:bg-violet-300/10"><p className="text-xs font-black uppercase text-violet-700 dark:text-violet-200">Principal result</p><p className="mt-2 font-mono text-3xl font-black">asin({ratio}) = {angleLabel}</p></div><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:bg-emerald-300/10"><p className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-200">Verify the result</p><p className="mt-2 font-mono text-2xl font-black">sin({trigDecimal(degrees)}°) = {checkLabel}</p></div></div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"><p className="text-sm font-black">Principal-value range for asin</p><div className="relative mx-4 mt-9 h-10"><div className="absolute inset-x-0 top-2 h-1 rounded-full bg-violet-300"/><span className="absolute top-0 h-5 w-5 -translate-x-1/2 -translate-y-2 rounded-full bg-violet-600" style={{ left: `${((degrees + 90) / 180) * 100}%` }}><strong className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-violet-600 px-2 py-1 text-xs text-white">{trigDecimal(degrees)}°</strong></span><span className="absolute left-0 top-6 text-xs font-black">−90°</span><span className="absolute left-1/2 top-6 -translate-x-1/2 text-xs font-black">0°</span><span className="absolute right-0 top-6 text-xs font-black">90°</span></div></div>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/85 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-xl font-black">What is asin(1)?</p><button type="button" className="action-primary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide answer" : "Reveal answer"}</button></div>{showPractice ? <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">90°, and sin(90°) = 1</p> : null}</div>
        </section>

        <aside className="space-y-3"><FractionInspector label="Ratio" value={String(ratio)} note="This is the sine value."/><FractionInspector label="Principal angle" value={angleLabel} note={mode === "DEG" ? "Within −90° to 90°." : "Within −π/2 to π/2."}/><FractionInspector label="Check" value={`sin(${trigDecimal(degrees)}°) = ${checkLabel}`} success/><FractionInspector label="Trace" value="Ratio to principal angle"/><div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100"><p className="text-[10px] font-black uppercase">Key idea</p><p className="mt-2 text-lg font-black">Inverse trig returns the main angle.</p></div><div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: infinitely many angles can share a sine value, but asin returns one principal angle.</div><button type="button" className="action-secondary w-full justify-center" onClick={() => { setRatio(.5); setMode("DEG"); setShowPractice(false); }}><RotateCcw className="h-4 w-4"/>Reset asin(0.5)</button></aside>
      </div>
    </AdapterFrame>
  );
}

function HyperbolicFunctionsLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [x, setX] = useState(1);
  const [showPractice, setShowPractice] = useState(false);
  useEffect(() => { setX(1); setShowPractice(false); }, [resetToken]);
  const positive = Math.exp(x);
  const negative = Math.exp(-x);
  const sinh = (positive - negative) / 2;
  const label = (value: number) => Number(value.toFixed(3)).toString();
  const updateX = (value: number) => { const next = Number(value.toFixed(1)); const before = x; setX(next); onInteraction(createLessonInteractionEvent({ controlId: "hyperbolic-x", kind: "slider", before, after: next, affectedOutputs: ["hyperbolic-curves", "hyperbolic-values", "hyperbolic-result"] })); };
  const curve = (inverse: boolean) => Array.from({ length: 81 }, (_, index) => { const sampleX = -2 + index * .05; const sampleY = Math.exp(inverse ? -sampleX : sampleX); return `${50 + ((sampleX + 2) / 4) * 500},${300 - Math.min(5, sampleY) / 5 * 250}`; }).join(" ");
  const probeX = 50 + ((x + 2) / 4) * 500;
  const positiveY = 300 - Math.min(5, positive) / 5 * 250;
  const negativeY = 300 - Math.min(5, negative) / 5 * 250;

  return <AdapterFrame title="Hyperbolic Functions live calculator" value={`sinh(${x}) ≈ ${label(sinh)}`} footer="The two exponential traces feed the hyperbolic-sine definition directly; no circular-trig model is used."><div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Hyperbolic rule · Concept trace</p><h3 className="mt-1 text-xl font-black">Hyperbolic sine using exponentials</h3></div><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">Hyperbolic exponential formula</span></div><div className="mt-4 rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"><div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-orange-50 p-4 text-center font-mono text-2xl font-black dark:from-cyan-300/10 dark:to-orange-300/10">sinh({x}) = (e<sup>{x}</sup> − e<sup>{-x}</sup>) / 2 ≈ <span className="text-orange-600">{label(sinh)}</span></div><svg viewBox="0 0 600 340" className="mt-3 w-full" role="img" aria-label={`Curves e to x and e to negative x with probe at x ${x}`}><line x1="35" y1="300" x2="575" y2="300" stroke="currentColor"/><line x1="300" y1="25" x2="300" y2="320" stroke="currentColor"/><polyline points={curve(false)} fill="none" stroke="#0891b2" strokeWidth="4"/><polyline points={curve(true)} fill="none" stroke="#7c3aed" strokeWidth="4"/><line x1={probeX} y1="35" x2={probeX} y2="305" stroke="#64748b" strokeDasharray="6 5"/><circle cx={probeX} cy={positiveY} r="7" fill="#0891b2"/><circle cx={probeX} cy={negativeY} r="7" fill="#7c3aed"/><text x="470" y="65" fill="#0891b2" fontWeight="800">y = eˣ</text><text x="470" y="265" fill="#7c3aed" fontWeight="800">y = e⁻ˣ</text><text x={Math.min(500, probeX + 10)} y={positiveY - 10} fill="#0891b2" fontWeight="800">{label(positive)}</text><text x={Math.min(500, probeX + 10)} y={negativeY + 22} fill="#7c3aed" fontWeight="800">{label(negative)}</text></svg><label className="mt-2 block rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-black dark:bg-cyan-300/10">Drag x-value probe: {x}<input aria-label="Hyperbolic x value" type="range" min="-2" max="2" step="0.1" value={x} onChange={(event) => updateX(Number(event.target.value))} className="mt-2 block w-full"/></label></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr]"><FractionInspector label={`e^${x}`} value={label(positive)} note="Growing exponential"/><div className="flex items-center justify-center text-2xl font-black">− then ÷ 2</div><FractionInspector label={`e^${-x}`} value={label(negative)} note="Reciprocal exponential"/></div><div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-center dark:bg-orange-300/10"><p className="text-xs font-black uppercase text-orange-700">Average of the difference</p><p className="mt-2 font-mono text-xl font-black">({label(positive)} − {label(negative)}) / 2 = {label(sinh)}</p></div><div className="mt-4 rounded-3xl border border-violet-100 bg-white/85 p-4 dark:border-violet-300/20 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase text-violet-700">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-xl font-black">What is sinh(0)?</p><button type="button" className="action-primary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide answer" : "Reveal answer"}</button></div>{showPractice ? <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">0, because (e⁰ − e⁰) / 2 = (1 − 1) / 2</p> : null}</div></section><aside className="space-y-3"><FractionInspector label="Definition" value="sinh(x) = (e^x − e^-x)/2" note="Hyperbolic, not circular sine."/><FractionInspector label="Input" value={`x = ${x}`}/><FractionInspector label={`e^${x}`} value={label(positive)}/><FractionInspector label={`e^${-x}`} value={label(negative)}/><FractionInspector label="Output" value={`sinh(${x}) ≈ ${label(sinh)}`} success/><div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 dark:bg-cyan-300/10"><p className="text-sm font-black">Why hyperbolic?</p><svg viewBox="0 0 180 120" className="mt-2 w-full"><path d="M18 15 Q75 60 18 105 M162 15 Q105 60 162 105" fill="none" stroke="#0284c7" strokeWidth="3"/><line x1="10" y1="60" x2="170" y2="60" stroke="currentColor"/><line x1="90" y1="10" x2="90" y2="110" stroke="currentColor"/></svg><p className="text-center font-mono font-black">x² − y² = 1</p></div><div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Watch out: sinh(x) is built from exponentials and is not sin(x).</div><button type="button" className="action-secondary w-full justify-center" onClick={() => {setX(1);setShowPractice(false);}}><RotateCcw className="h-4 w-4"/>Reset x = 1</button></aside></div></AdapterFrame>;
}

function CountingChoicesLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [mode, setMode] = useState<"factorial" | "permutation" | "combination">("factorial");
  const [n, setN] = useState(6);
  const [r, setR] = useState(3);
  const [showPractice, setShowPractice] = useState(false);
  useEffect(() => { setMode("factorial"); setN(6); setR(3); setShowPractice(false); }, [resetToken]);
  const factorial = (value: number) => Array.from({ length: value }, (_, index) => index + 1).reduce((product, value) => product * value, 1);
  const count = mode === "factorial" ? factorial(n) : mode === "permutation" ? factorial(n) / factorial(n-r) : factorial(n) / (factorial(r) * factorial(n-r));
  const factors = Array.from({ length: mode === "factorial" ? n : r }, (_, index) => n-index);
  const selectMode = (next: typeof mode) => { const before=mode; setMode(next); onInteraction(createLessonInteractionEvent({controlId:"counting-mode",kind:"selection",before,after:next,affectedOutputs:["choice-slots","counting-equation","counting-output"]})); };
  return <AdapterFrame title="Factorial, Permutation and Combination live calculator" value={`${mode === "factorial" ? `${n}!` : mode === "permutation" ? `${n}P${r}` : `${n}C${r}`} = ${count}`} footer="Choice slots make the shrinking number of available options visible before the formulas summarize the count."><div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10"><div><p className="text-[10px] font-black uppercase text-cyan-700">Counting rule · Concept trace</p><h3 className="mt-1 text-xl font-black">Counting choices visually</h3></div><div className="mt-4 grid grid-cols-3 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">{(["factorial","permutation","combination"] as const).map((option)=><button key={option} type="button" onClick={()=>selectMode(option)} className={mode===option?"rounded-xl bg-cyan-600 px-3 py-2 text-sm font-black capitalize text-white":"rounded-xl px-3 py-2 text-sm font-black capitalize"}>{option}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><PowerRootControl label="Items n" value={n} min={2} max={8} onChange={(value)=>{setN(Math.round(value));setR((current)=>Math.min(current,Math.round(value)));}} />{mode!=="factorial"?<PowerRootControl label="Selected r" value={r} min={1} max={n} onChange={(value)=>setR(Math.round(value))}/>:<div className="rounded-2xl border border-violet-200 bg-violet-50 p-3 text-sm font-black text-violet-900">Factorial arranges all {n} items, so r = n.</div>}</div><article className="mt-4 rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"><h4 className="font-black">Build {mode === "factorial" ? `${n}!` : mode === "permutation" ? `${n}P${r}` : `${n}C${r}`} one choice at a time</h4><div className="mt-4 flex flex-wrap justify-center gap-3">{factors.map((choices,index)=><div key={index} className="w-28 rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-3 text-center dark:bg-cyan-300/10"><p className="text-xs font-black text-slate-500">Step {index+1}</p><p className="mt-2 font-mono text-3xl font-black text-cyan-700">{choices}</p><p className="text-xs font-bold">{choices===1?"choice":"choices"}</p><span className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-black text-white">{index+1}</span></div>)}</div>{mode==="combination"?<p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center font-black text-emerald-800">Remove order duplicates by dividing the ordered selections by {r}! = {factorial(r)}.</p>:null}</article><div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-center font-mono text-2xl font-black dark:bg-orange-300/10">{mode === "factorial" ? `${n}! = ${factors.join(" × ")}` : mode === "permutation" ? `${n}P${r} = ${factors.join(" × ")}` : `${n}C${r} = (${factors.join(" × ")}) ÷ ${r}!`} = <span className="text-orange-600">{count}</span></div><div className="mt-4 grid gap-3 md:grid-cols-3"><FractionInspector label="n! arrangements" value={`${n}! = ${factorial(n)}`} note="All items; order matters."/><FractionInspector label="nPr ordered selections" value={`${n}P${r} = ${factorial(n)/factorial(n-r)}`} note="Choose r; order matters."/><FractionInspector label="nCr unordered selections" value={`${n}C${r} = ${factorial(n)/(factorial(r)*factorial(n-r))}`} note="Choose r; order does not matter."/></div><div className="mt-4 rounded-3xl border border-violet-100 bg-white/85 p-4"><p className="text-[10px] font-black uppercase text-violet-700">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-black">How many ways can 4 distinct books be arranged?</p><button type="button" className="action-primary" onClick={()=>setShowPractice((current)=>!current)}>{showPractice?"Hide answer":"Show answer"}</button></div>{showPractice?<p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">4! = 4 × 3 × 2 × 1 = 24</p>:null}</div></section><aside className="space-y-3"><FractionInspector label="Factorial" value={`${n}!`}/><FractionInspector label="Expansion" value={factors.join(" × ")}/><FractionInspector label="Output" value={String(count)} success/><FractionInspector label="Order matters" value={mode==="combination"?"no":"yes"}/><FractionInspector label="Trace" value="Counting choices trace"/><div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Order matters for factorial and permutation; combinations remove order duplicates.</div><button type="button" className="action-secondary w-full justify-center" onClick={()=>{setMode("factorial");setN(6);setR(3);setShowPractice(false);}}><RotateCcw className="h-4 w-4"/>Reset 6!</button></aside></div></AdapterFrame>;
}

function AbsoluteValueLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [input, setInput] = useState(-12); const [view, setView] = useState<"distance"|"direction">("distance"); const [showPractice,setShowPractice]=useState(false);
  useEffect(()=>{setInput(-12);setView("distance");setShowPractice(false);},[resetToken]);
  const distance=Math.abs(input); const position=(value:number)=>((value+15)/30)*100;
  const update=(value:number)=>{const next=Math.round(value);const before=input;setInput(next);onInteraction(createLessonInteractionEvent({controlId:"absolute-input",kind:"slider",before,after:next,affectedOutputs:["absolute-number-line","absolute-distance","absolute-output"]}));};
  return <AdapterFrame title="Absolute Value live calculator" value={`|${input}| = ${distance}`} footer="The point’s direction and its nonnegative distance from zero are shown as separate ideas."><div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase text-cyan-700">Absolute value · Concept trace</p><h3 className="mt-1 text-xl font-black">Absolute Value Distance Lab</h3></div><div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">{(["distance","direction"] as const).map((option)=><button key={option} onClick={()=>setView(option)} className={view===option?"rounded-lg bg-cyan-600 px-3 py-2 text-xs font-black capitalize text-white":"rounded-lg px-3 py-2 text-xs font-black capitalize"}>{option}</button>)}</div></div><div className="mt-4 rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"><div className="mx-auto max-w-md rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-center"><p className="font-mono text-3xl font-black">|{input}| = {distance}</p><p className="mt-1 font-black">distance cannot be negative</p></div><div className="relative mx-4 mt-20 h-28"><div className="absolute inset-x-0 top-10 h-1 bg-slate-500"/>{Array.from({length:16},(_,index)=>-15+index*2).map((value)=><span key={value} className="absolute top-8 h-5 w-px bg-slate-500" style={{left:`${position(value)}%`}}><small className="absolute top-6 -translate-x-1/2 font-mono text-[10px] font-black">{value}</small></span>)}<span className="absolute top-7 h-7 w-7 -translate-x-1/2 rounded-full border-4 border-white bg-cyan-600 shadow" style={{left:`${position(input)}%`}}/><span className="absolute top-7 h-7 w-7 -translate-x-1/2 rounded-full border-4 border-white bg-violet-600 shadow" style={{left:`${position(-input)}%`}}/><span className="absolute top-5 h-11 w-1 -translate-x-1/2 bg-orange-500" style={{left:"50%"}}/><div className="absolute h-14 rounded-[50%] border-t-4 border-cyan-500" style={{left:`${Math.min(position(input),50)}%`,top:"0",width:`${Math.abs(position(input)-50)}%`}}><strong className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-cyan-700">{distance} units</strong></div></div><label className="mt-3 block rounded-2xl bg-slate-50 p-3 text-sm font-black dark:bg-white/10">Drag input: {input}<input aria-label="Absolute value input" type="range" min="-15" max="15" value={input} onChange={(event)=>update(Number(event.target.value))} className="mt-2 w-full"/></label>{view==="direction"?<p className="mt-3 rounded-2xl bg-violet-50 p-3 text-center font-black text-violet-900">{input<0?"Left of zero":input>0?"Right of zero":"At zero"} describes direction; {distance} describes distance.</p>:<p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-center font-black text-cyan-900">From {input} to 0 is {distance} units.</p>}</div><div className="mt-4 rounded-3xl border border-violet-200 bg-white/90 p-4 text-center"><p className="text-xs font-black uppercase text-violet-700">Symmetry view</p><div className="mt-3 flex flex-wrap items-center justify-center gap-5 font-mono text-2xl font-black"><span>{-distance} → {distance}</span><span>|−a| = |a|</span><span>{distance} → {distance}</span></div></div><div className="mt-4 rounded-3xl border border-violet-100 bg-white/85 p-4"><p className="text-[10px] font-black uppercase text-violet-700">Try it yourself</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="font-black">What is |7|? What is |−7|?</p><button className="action-primary" onClick={()=>setShowPractice((current)=>!current)}>{showPractice?"Hide":"Reveal"}</button></div>{showPractice?<p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800">Both are 7: both points are 7 units from zero.</p>:null}</div></section><aside className="space-y-3"><FractionInspector label="Input" value={String(input)}/><FractionInspector label="Sign (direction)" value={input<0?"Left of zero":input>0?"Right of zero":"At zero"}/><FractionInspector label="Distance" value={`${distance} units`}/><FractionInspector label="Output" value={String(distance)} success/><FractionInspector label="Trace" value="Distance from zero"/><div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Watch out: absolute value is distance, not merely a command to flip a sign.</div><button className="action-secondary w-full justify-center" onClick={()=>{setInput(-12);setView("distance");setShowPractice(false);}}><RotateCcw className="h-4 w-4"/>Reset −12</button></aside></div></AdapterFrame>;
}

function RoundingPrecisionLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [precision, setPrecision] = useState(2);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setPrecision(2);
    setShowPractice(false);
  }, [resetToken]);

  const exact = 10 / 3;
  const rounded = exact.toFixed(precision);
  const error = Math.abs(exact - Number(rounded));
  const nextDigit = "3";
  const exactPosition = 45;
  const roundedPosition = precision === 1 ? 0 : precision === 2 ? 33 : 42;

  const update = (value: number) => {
    const next = Math.round(value);
    const before = precision;
    setPrecision(next);
    onInteraction(createLessonInteractionEvent({
      controlId: "precision-places",
      kind: "slider",
      before,
      after: next,
      affectedOutputs: ["rounded-report", "next-digit-rule", "precision-number-line"],
    }));
  };

  const resetPrecision = () => {
    setPrecision(2);
    setShowPractice(false);
    onInteraction(createLessonInteractionEvent({
      controlId: "precision-reset",
      kind: "tool",
      before: { precision },
      after: { precision: 2 },
      affectedOutputs: ["rounded-report", "next-digit-rule", "precision-number-line", "practice-answer"],
    }));
  };

  return (
    <AdapterFrame title="Rounding and Precision live calculator" value={`10/3 ≈ ${rounded} (${precision} d.p.)`} footer="The repeating exact value stays visible while only the final reported value changes precision.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/45 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Precision rule - Concept trace</p>
            <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Exact value vs displayed precision</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">See how rounding changes only what we report, not the exact value.</p>
          </div>

          <article className="mt-4 grid items-center gap-4 rounded-3xl border border-cyan-200 bg-white/95 p-5 dark:border-cyan-300/20 dark:bg-slate-950/60 md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="text-center">
              <p className="text-xs font-black uppercase text-cyan-700">Exact value (never rounded)</p>
              <p className="mt-3 font-mono text-4xl font-black text-slate-950 dark:text-white">10/3 = <span className="text-cyan-700">3.3333...</span></p>
              <p className="mt-2 font-bold text-slate-600 dark:text-slate-300">The 3 repeats forever.</p>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-center text-cyan-950">
              <p className="text-xs font-black uppercase">Repeating digit</p>
              <p className="mt-2 font-mono text-5xl font-black">3</p>
              <p className="mt-1 text-sm font-bold">The 3 repeats infinitely.</p>
            </div>
          </article>

          <article className="mt-4 rounded-3xl border border-violet-200 bg-white/95 p-5 dark:border-violet-300/20 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-black text-slate-950 dark:text-white">Set displayed precision</p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drag the handle to choose how many decimal places to show.</p>
              </div>
              <span className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 font-black text-violet-800">Currently: {precision} decimal places</span>
            </div>
            <label className="sr-only" htmlFor="rounding-precision-slider">Decimal places</label>
            <input id="rounding-precision-slider" aria-label="Decimal places" type="range" min="1" max="4" value={precision} onChange={(event) => update(Number(event.target.value))} className="mt-6 w-full accent-violet-600" />
            <div className="mt-2 flex justify-between font-mono text-sm font-black">
              {[1, 2, 3, 4].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} decimal places`}
                  className={value === precision ? "rounded-full bg-violet-600 px-3 py-1 text-white" : "rounded-full px-3 py-1 text-slate-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-200 dark:hover:bg-white/10"}
                  onClick={() => update(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-orange-50 p-4 text-center ring-1 ring-orange-100">
                <p className="text-xs font-black uppercase text-orange-700">Report to {precision} d.p.</p>
                <p className="mt-2 font-mono text-4xl font-black text-orange-600">{rounded}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10">
                <p className="text-xs font-black uppercase">Equation view</p>
                <p className="mt-2 font-mono text-xl font-black">10/3 ≈ {rounded}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">(to {precision} d.p.)</p>
              </div>
            </div>
          </article>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/95 p-4">
            <p className="font-black">Rounding rule (next digit)</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-black">For {rounded},</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 font-mono text-2xl font-black text-cyan-800">{nextDigit}</span>
              <span className="font-bold text-slate-700">is the next digit. Since it is less than 5, keep the last shown digit.</span>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/95 p-4">
            <p className="font-black">Where does the exact value lie?</p>
            <div className="relative mx-4 mt-10 h-20">
              <div className="absolute inset-x-0 top-5 h-1 bg-slate-400" />
              {["3.30", "3.31", "3.32", "3.33", "3.34", "3.35", "3.36"].map((tick, index) => (
                <span key={tick} className="absolute top-3 h-5 w-px bg-slate-500" style={{ left: `${(index / 6) * 100}%` }}>
                  <small className="absolute top-7 -translate-x-1/2 font-mono text-xs font-black text-slate-600">{tick}</small>
                </span>
              ))}
              <span className="absolute top-3 h-7 w-7 -translate-x-1/2 -translate-y-2 rounded-full bg-violet-600 ring-4 ring-white" style={{ left: `${roundedPosition}%` }}>
                <strong className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-violet-700">{rounded} reported</strong>
              </span>
              <span className="absolute top-3 h-7 w-7 -translate-x-1/2 -translate-y-2 rounded-full bg-cyan-600 ring-4 ring-white" style={{ left: `${exactPosition}%` }}>
                <strong className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-cyan-700">3.333... exact</strong>
              </span>
            </div>
            <p className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-800">Rounding introduces a small difference: |3.333... - {rounded}| ≈ {error.toFixed(Math.min(6, precision + 3))}.</p>
          </div>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/90 p-4">
            <p className="text-[10px] font-black uppercase text-violet-700">Practice</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">Round 22/7 to 3 decimal places.</p>
              <button type="button" className="action-primary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide answer" : "Show answer"}</button>
            </div>
            {showPractice ? <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">22/7 = 3.142857... {"->"} 3.143</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Exact division" value="10/3" note="This is the exact value." />
          <FractionInspector label="Decimal form" value="3.3333..." note="The 3 repeats forever." />
          <FractionInspector label="Displayed precision" value={`${precision} decimal places`} note="Choose how many places to show." />
          <FractionInspector label="Rounded output" value={rounded} success note="This is what we report." />
          <FractionInspector label="Trace" value="Exact value to rounded report" note="Round only at the final reporting step." />
          <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4 text-sm font-black text-sky-900">Key idea: exact value is infinite; precision is a choice.</div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Watch out: never replace the exact value during intermediate work.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={resetPrecision}><RotateCcw className="h-4 w-4" />Reset 2 d.p.</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

type ConstantKey = "pi" | "e" | "tau" | "phi";

const constantChoices: Record<ConstantKey, { label: string; symbol: string; value: number; stored: string; note: string }> = {
  pi: { label: "pi", symbol: "π", value: Math.PI, stored: "3.141592653589793...", note: "Circle circumference and angle measure." },
  e: { label: "e", symbol: "e", value: Math.E, stored: "2.718281828459045...", note: "Natural growth and logarithms." },
  tau: { label: "tau", symbol: "τ", value: Math.PI * 2, stored: "6.283185307179586...", note: "One full turn in radians." },
  phi: { label: "phi", symbol: "φ", value: (1 + Math.sqrt(5)) / 2, stored: "1.618033988749895...", note: "Golden-ratio scaling." },
};

function ConstantsLibraryLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [constant, setConstant] = useState<ConstantKey>("pi");
  const [storedDigits, setStoredDigits] = useState(40);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setConstant("pi");
    setStoredDigits(40);
    setShowPractice(false);
  }, [resetToken]);

  const selected = constantChoices[constant];
  const circumference = 2 * selected.value;
  const roundedEarly = 2 * Number(selected.value.toFixed(2));
  const storedOutput = truncateDecimals(circumference, 5);
  const earlyOutput = roundedEarly.toFixed(2);
  const difference = Math.abs(circumference - roundedEarly);

  const selectConstant = (next: ConstantKey) => {
    const before = constant;
    setConstant(next);
    onInteraction(createLessonInteractionEvent({
      controlId: "constant-chip",
      kind: "selection",
      before,
      after: next,
      affectedOutputs: ["constant-circle", "constant-formula", "stored-output", "precision-comparison"],
    }));
  };

  const updateDigits = (value: number) => {
    const next = Math.round(value);
    const before = storedDigits;
    setStoredDigits(next);
    onInteraction(createLessonInteractionEvent({
      controlId: "stored-precision",
      kind: "slider",
      before,
      after: next,
      affectedOutputs: ["stored-constant-value", "precision-comparison"],
    }));
  };

  const resetConstants = () => {
    setConstant("pi");
    setStoredDigits(40);
    setShowPractice(false);
    onInteraction(createLessonInteractionEvent({
      controlId: "constants-reset",
      kind: "tool",
      before: { constant, storedDigits },
      after: { constant: "pi", storedDigits: 40 },
      affectedOutputs: ["constant-circle", "constant-formula", "stored-output", "practice-answer"],
    }));
  };

  return (
    <AdapterFrame title="Constants Library live calculator" value={`2 x ${selected.label} ≈ ${storedOutput}`} footer="Stored constants keep full precision during calculation; rounding is applied only when the result is displayed.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/45 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Constant rule - Concept trace</p>
            <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Reliable constant insertion in action</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Choose a stored constant, use it in a formula, then round only the final result.</p>
          </div>

          <fieldset className="mt-4 flex flex-wrap gap-3" aria-label="Choose constant">
            <legend className="sr-only">Choose constant</legend>
            {(Object.keys(constantChoices) as ConstantKey[]).map((key) => {
              const item = constantChoices[key];
              return (
                <label
                  key={key}
                  className={constant === key ? "cursor-pointer rounded-2xl bg-violet-600 px-5 py-3 font-black text-white shadow-lg shadow-violet-500/25" : "cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-900 hover:border-violet-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-500"}
                >
                  <input className="sr-only" type="radio" name="constants-library-choice" checked={constant === key} onChange={() => selectConstant(key)} aria-label={`${item.label} constant`} />
                  <span className="mr-2 font-mono text-xl">{item.symbol}</span>{item.label}
                </label>
              );
            })}
          </fieldset>

          <div className="mt-5 grid items-center gap-5 lg:grid-cols-[minmax(320px,1fr)_260px]">
            <div className="rounded-3xl border border-cyan-200 bg-white/95 p-5 dark:border-cyan-300/20 dark:bg-slate-950/60">
              <svg viewBox="0 0 520 420" className="h-[360px] w-full" role="img" aria-label="Circle with radius 1, diameter 2, and circumference calculated using the selected constant">
                <defs>
                  <marker id="constants-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="6" refY="4">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#0891b2" />
                  </marker>
                </defs>
                <circle cx="250" cy="205" r="135" fill="#e8f7ff" stroke="#0891b2" strokeWidth="4" />
                <circle cx="250" cy="205" r="150" fill="none" stroke="#7c3aed" strokeDasharray="9 8" strokeWidth="3" />
                <line x1="250" y1="205" x2="345" y2="110" stroke="#0891b2" strokeWidth="4" markerEnd="url(#constants-arrow)" />
                <line x1="115" y1="205" x2="385" y2="205" stroke="#2563eb" strokeWidth="4" markerEnd="url(#constants-arrow)" markerStart="url(#constants-arrow)" />
                <circle cx="250" cy="205" r="7" fill="#0f172a" />
                <text x="304" y="158" fill="#0e7490" fontSize="24" fontWeight="800">r = 1</text>
                <text x="205" y="252" fill="#1d4ed8" fontSize="24" fontWeight="800">Diameter = 2r</text>
                <text x="203" y="285" fill="#1d4ed8" fontSize="22" fontWeight="800">= 2</text>
                <text x="165" y="44" fill="#7c3aed" fontSize="24" fontWeight="800" transform="rotate(-12 165 44)">Circumference C</text>
              </svg>
              <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-center">
                <p className="font-mono text-3xl font-black text-slate-950">2 x {selected.label} = 2{selected.symbol} ≈ <span className="text-orange-600">{storedOutput}</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-violet-200 bg-white/95 p-4 text-center">
                <p className="text-xs font-black uppercase text-violet-700">Circumference formula</p>
                <p className="mt-2 font-mono text-2xl font-black">C = 2πr</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 text-center">
                <p className="text-sm font-black text-slate-600">With r = 1</p>
                <p className="mt-3 font-mono text-xl font-black">C = 2π(1)</p>
                <p className="mt-3 font-mono text-2xl font-black text-violet-700">C = 2π</p>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Watch out: using 3.14 too early gives a slightly different result.</div>
            </div>
          </div>

          <article className="mt-5 rounded-3xl border border-slate-200 bg-white/95 p-4">
            <p className="font-black">Precision matters</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Use full precision for calculations. Round only at the end.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-3">
                <p className="text-xs font-black uppercase text-violet-700">Stored value of {selected.label}</p>
                <p className="mt-2 truncate font-mono text-sm font-black text-violet-900">{selected.symbol} = {selected.stored}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-black uppercase text-slate-600">Rounded early</p>
                <p className="mt-2 font-mono text-sm font-black">{selected.symbol} ≈ {selected.value.toFixed(2)}</p>
              </div>
            </div>
            <label className="mt-4 block text-sm font-black text-slate-700">
              Stored precision: {storedDigits} digits
              <input aria-label="Stored precision digits" type="range" min="10" max="50" step="10" value={storedDigits} onChange={(event) => updateDigits(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[10, 20, 30, 40, 50].map((digits) => (
                <button
                  key={digits}
                  type="button"
                  aria-label={`${digits} stored digits`}
                  className={digits === storedDigits ? "rounded-full bg-violet-600 px-3 py-1 text-xs font-black text-white" : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700 hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"}
                  onClick={() => updateDigits(digits)}
                >
                  {digits}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-900">Calculations use the stored constant above. Rounding is applied only when you choose to display the result.</div>
          </article>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/90 p-4">
            <p className="text-[10px] font-black uppercase text-violet-700">Practice with constants</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">Use pi to estimate circumference when r = 2.</p>
              <button type="button" className="action-primary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide answer" : "Show answer"}</button>
            </div>
            {showPractice ? <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">C = 2π(2) = 4π. 4π ≈ 12.566</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Constant" value={`${selected.symbol} (${selected.label})`} note={selected.note} />
          <FractionInspector label="Stored value" value={selected.stored} note={`${storedDigits} digits are available internally.`} />
          <FractionInspector label="Formula" value="C = 2π" note="For radius 1, circumference is 2π." />
          <FractionInspector label="Output" value={`C ≈ ${storedOutput}`} success note="Final display shown to 5 decimals." />
          <FractionInspector label="Constant insertion check" value="2 x pi -> 2pi" note="The stored constant is inserted before calculation." />
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="font-black">Why stored precision matters</p>
            <div className="mt-3 grid gap-2">
              <div className="rounded-2xl bg-rose-50 p-3 font-mono text-sm font-black text-rose-900">Using {selected.symbol} ≈ {selected.value.toFixed(2)}: 2 x {selected.value.toFixed(2)} = {earlyOutput}</div>
              <div className="rounded-2xl bg-emerald-50 p-3 font-mono text-sm font-black text-emerald-900">Using stored {selected.label}: 2 x {selected.value.toFixed(5)} = {storedOutput}</div>
              <div className="rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-900">Difference ≈ {difference.toFixed(5)}. Small now, but it grows in longer calculations.</div>
            </div>
          </div>
          <button type="button" className="action-secondary w-full justify-center" onClick={resetConstants}><RotateCcw className="h-4 w-4" />Reset pi</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

type HistoryAction = "reuse input" | "copy result" | "pin note" | "inspect source";

const calculationHistoryRows = [
  { id: 1, expression: "7 x 8", result: "56", time: "Just now", source: "Multiplication fact: 7 groups of 8 make 56." },
  { id: 2, expression: "56 / 7", result: "8", time: "2 min ago", source: "This row reused 56 from row 1, then divided by 7." },
  { id: 3, expression: "12 + 5", result: "17", time: "5 min ago", source: "Addition row kept with its original input." },
  { id: 4, expression: "17 x 4", result: "68", time: "7 min ago", source: "This row reused row 3 after checking that 17 came from 12 + 5." },
];

function historyActionFeedback(action: HistoryAction, row: (typeof calculationHistoryRows)[number]) {
  if (action === "reuse input") return `Reused input from row ${row.id}: ${row.expression} = ${row.result}.`;
  if (action === "copy result") return `Copied result ${row.result} from row ${row.id}. Keep the matching input visible: ${row.expression}.`;
  if (action === "pin note") return `Pinned note for row ${row.id}: ${row.expression} produced ${row.result}.`;
  return `Source check for row ${row.id}: ${row.source} No hidden steps.`;
}

function CalculationHistoryLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [selectedRow, setSelectedRow] = useState(1);
  const [lastAction, setLastAction] = useState<HistoryAction>("inspect source");
  const [showPractice, setShowPractice] = useState(false);
  const active = calculationHistoryRows.find((row) => row.id === selectedRow) ?? calculationHistoryRows[0];
  const actionFeedback = historyActionFeedback(lastAction, active);

  useEffect(() => {
    setSelectedRow(1);
    setLastAction("inspect source");
    setShowPractice(false);
  }, [resetToken]);

  const selectRow = (id: number) => {
    const before = selectedRow;
    setSelectedRow(id);
    onInteraction(createLessonInteractionEvent({
      controlId: "history-row",
      kind: "selection",
      before,
      after: id,
      affectedOutputs: ["history-equation-overlay", "history-concept-trace", "history-source-inspector"],
    }));
  };

  const runAction = (action: HistoryAction, id: number) => {
    const row = calculationHistoryRows.find((item) => item.id === id) ?? active;
    setSelectedRow(row.id);
    setLastAction(action);
    onInteraction(createLessonInteractionEvent({
      controlId: `history-${action.replace(/\s+/g, "-")}`,
      kind: "tool",
      before: { selectedRow, lastAction },
      after: { selectedRow: row.id, action, expression: row.expression, result: row.result },
      affectedOutputs: ["history-feedback", "history-source-inspector", "history-concept-trace"],
    }));
  };

  const resetHistory = () => {
    setSelectedRow(1);
    setLastAction("inspect source");
    setShowPractice(false);
    onInteraction(createLessonInteractionEvent({
      controlId: "history-reset",
      kind: "tool",
      before: { selectedRow, lastAction },
      after: { selectedRow: 1, lastAction: "inspect source" },
      affectedOutputs: ["history-equation-overlay", "history-feedback", "practice-answer"],
    }));
  };

  return (
    <AdapterFrame title="Calculation History live calculator" value={`${active.expression} = ${active.result}`} footer="Calculation history is reliable only when every result stays paired with the expression that produced it.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/45 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">History rule - Concept trace</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Every result has a source. Verify before you reuse.</h3>
            </div>
            <span className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-800">Do not copy a result without its input</span>
          </div>

          <article className="mt-4 rounded-3xl bg-slate-950 p-5 text-center text-white shadow-xl">
            <p className="font-mono text-5xl font-black tracking-wide">{active.expression} = <span className="text-cyan-300">{active.result}</span></p>
            <p className="mt-2 text-sm font-bold text-cyan-100">{actionFeedback}</p>
          </article>

          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/95">
            <div className="grid grid-cols-[48px_minmax(120px,1fr)_48px_90px_90px_220px] bg-slate-50 px-3 py-3 text-xs font-black uppercase text-slate-500">
              <span>#</span><span>Expression input</span><span>=</span><span>Result</span><span>Time</span><span>Actions</span>
            </div>
            {calculationHistoryRows.map((row) => (
              <div key={row.id} className={row.id === selectedRow ? "grid grid-cols-[48px_minmax(120px,1fr)_48px_90px_90px_220px] items-center border-t border-cyan-200 bg-cyan-50 px-3 py-3 ring-2 ring-cyan-300/50" : "grid grid-cols-[48px_minmax(120px,1fr)_48px_90px_90px_220px] items-center border-t border-slate-100 px-3 py-3"}>
                <button type="button" className="text-left font-mono font-black" onClick={() => selectRow(row.id)}>{row.id}</button>
                <button type="button" className="text-left font-mono text-lg font-black text-slate-950" onClick={() => selectRow(row.id)}>{row.expression}</button>
                <span className="font-mono font-black text-slate-500">=</span>
                <span className="font-mono text-lg font-black text-cyan-700">{row.result}</span>
                <span className="text-sm font-bold text-slate-600">{row.time}</span>
                <div className="flex gap-2">
                  <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-violet-700 hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label={`Reuse input from row ${row.id}`} onClick={() => runAction("reuse input", row.id)}><RotateCcw className="h-4 w-4" /></button>
                  <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" aria-label={`Copy result from row ${row.id}`} onClick={() => runAction("copy result", row.id)}><History className="h-4 w-4" /></button>
                  <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-violet-700 hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label={`Pin note for row ${row.id}`} onClick={() => runAction("pin note", row.id)}><BadgeInfo className="h-4 w-4" /></button>
                  <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" aria-label={`Inspect source for row ${row.id}`} onClick={() => runAction("inspect source", row.id)}><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {(["reuse input", "copy result", "pin note", "inspect source"] as HistoryAction[]).map((action) => (
              <button key={action} type="button" className={lastAction === action ? "rounded-2xl bg-violet-600 px-3 py-3 text-sm font-black capitalize text-white" : "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-black capitalize text-slate-700 hover:border-violet-300"} onClick={() => runAction(action, selectedRow)}>
                {action}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/95 p-4">
            <p className="text-xs font-black uppercase text-violet-700">Source inspector</p>
            <p className="mt-2 font-mono text-xl font-black">{active.expression} = {active.result}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">{active.source}</p>
            <p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-sm font-black text-cyan-900">Latest action: {lastAction}. {actionFeedback}</p>
          </div>

          <div className="mt-4 rounded-3xl border border-violet-100 bg-white/90 p-4">
            <p className="text-[10px] font-black uppercase text-violet-700">Practice check</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">Which history row produced 56?</p>
              <button type="button" className="action-primary" onClick={() => setShowPractice((current) => !current)}>{showPractice ? "Hide answer" : "Show answer"}</button>
            </div>
            {showPractice ? <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">Row 1 produced 56: 7 x 8 = 56.</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <FractionInspector label="Latest input" value={active.expression} note="The expression that produced the selected row." />
          <FractionInspector label="Latest result" value={active.result} success note="The result is meaningful only with its input." />
          <FractionInspector label="Rows stored" value="Expression + result" note="A history row stores both pieces together." />
          <FractionInspector label="History pairs input with output" value="Source visible" note="Reuse safely by checking the source expression." />
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="font-black text-violet-800">Dependency chain</p>
            <div className="mt-3 grid gap-2 text-center font-mono font-black">
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-3">7 x 8 = 56</div>
              <ChevronRight className="mx-auto h-5 w-5 rotate-90 text-violet-600" />
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3">56 / 7 = 8</div>
              <ChevronRight className="mx-auto h-5 w-5 rotate-90 text-violet-600" />
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-800">56 + 3 = 59 only after source check</div>
            </div>
            <p className="mt-3 rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-900">Keep the source visible. Reuse with confidence.</p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Watch out: copying `56` without `7 x 8` removes the reason that made the result trustworthy.</div>
          <button type="button" className="action-secondary w-full justify-center" onClick={resetHistory}><RotateCcw className="h-4 w-4" />Reset row 1</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

type ExactDecimalMode = "exact" | "decimal";

function ExactAndDecimalModesLessonSurface({ resetToken, onInteraction }: { resetToken: number; onInteraction: LessonAdapterProps["onInteraction"] }) {
  const [mode, setMode] = useState<ExactDecimalMode>("exact");
  const [precision, setPrecision] = useState(3);
  const [practiceChoice, setPracticeChoice] = useState<ExactDecimalMode>("exact");
  const [showPractice, setShowPractice] = useState(false);
  const [eventLog, setEventLog] = useState("Exact mode selected - radical form stays unchanged.");
  const decimalPreview = Math.SQRT2.toFixed(precision);
  const decimalPosition = Math.min(93, Math.max(7, ((Number(decimalPreview) - 1.41) / 0.01) * 100));

  useEffect(() => {
    setMode("exact");
    setPrecision(3);
    setPracticeChoice("exact");
    setShowPractice(false);
    setEventLog("Exact mode selected - radical form stays unchanged.");
  }, [resetToken]);

  const chooseMode = (nextMode: ExactDecimalMode) => {
    const before = mode;
    setMode(nextMode);
    setEventLog(nextMode === "exact" ? "Exact mode selected - use structure for proof and algebra." : `Decimal preview selected - display rounds to ${decimalPreview}.`);
    onInteraction(createLessonInteractionEvent({
      controlId: "exact-decimal-mode",
      kind: "selection",
      before,
      after: nextMode,
      affectedOutputs: ["unit-square-diagonal", "decimal-preview", "mode-trace"],
    }));
  };

  const updatePrecision = (nextPrecision: number) => {
    const before = precision;
    setPrecision(nextPrecision);
    setEventLog(`Action fired - decimal display now shows ${nextPrecision} places, while sqrt(2) stays exact.`);
    onInteraction(createLessonInteractionEvent({
      controlId: "decimal-precision",
      kind: "slider",
      before,
      after: nextPrecision,
      affectedOutputs: ["decimal-preview", "comparison-table", "event-log"],
    }));
  };

  const selectPractice = (choice: ExactDecimalMode) => {
    const before = practiceChoice;
    setPracticeChoice(choice);
    setShowPractice(true);
    setEventLog(choice === "exact" ? "Practice choice checked - exact is best for the 1 by 1 diagonal." : "Practice choice checked - decimal is useful after the exact source is known.");
    onInteraction(createLessonInteractionEvent({
      controlId: "exact-decimal-practice",
      kind: "selection",
      before,
      after: choice,
      affectedOutputs: ["practice-answer", "event-log"],
    }));
  };

  const resetExactDecimal = () => {
    setMode("exact");
    setPrecision(3);
    setPracticeChoice("exact");
    setShowPractice(false);
    setEventLog("Exact mode selected - radical form stays unchanged.");
    onInteraction(createLessonInteractionEvent({
      controlId: "exact-decimal-reset",
      kind: "tool",
      before: { mode, precision, practiceChoice },
      after: { mode: "exact", precision: 3, practiceChoice: "exact" },
      affectedOutputs: ["unit-square-diagonal", "decimal-preview", "practice-answer"],
    }));
  };

  return (
    <AdapterFrame title="Exact and Decimal Modes" value={`sqrt(2) = √2 ≈ ${decimalPreview}${precision < 8 ? "..." : ""}`} footer="Exact and decimal modes represent the same value in different forms. Keep the radical for structure; use decimals for measurement.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/35 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Interaction + visualization</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Exact vs. Decimal: Explore the difference</h3>
            </div>
            <span className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-800">{mode === "exact" ? "Exact selected" : "Decimal preview"}</span>
          </div>

          <div className="mt-4 rounded-3xl bg-white/90 p-5 text-center shadow-inner dark:bg-slate-950/60">
            <p className="font-mono text-3xl font-black text-slate-950 dark:text-white sm:text-5xl">
              sqrt(2) = <span className="text-cyan-600">√2</span> <span className="text-slate-400">≈</span> <span className="text-violet-700">1.41421356...</span>
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm font-black">
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-800">√2 is exact</span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-800">1.41421356... is approximate</span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-cyan-200 bg-white/95 p-4 dark:border-cyan-300/20 dark:bg-slate-950/60">
              <p className="text-xs font-black uppercase text-cyan-700">Exact (symbolic)</p>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">The diagonal of a 1 x 1 square</p>
              <svg viewBox="0 0 260 260" className="mx-auto mt-4 w-full max-w-[340px]" role="img" aria-label="Unit square with diagonal labeled square root of 2">
                <rect x="38" y="28" width="184" height="184" fill="rgba(14,165,233,.06)" stroke="#0891b2" strokeWidth="3" />
                <line x1="38" y1="212" x2="222" y2="28" stroke="#0891b2" strokeWidth="3" strokeDasharray="8 6" />
                <circle cx="38" cy="28" r="5" fill="#0891b2" />
                <circle cx="222" cy="28" r="5" fill="#0891b2" />
                <circle cx="38" cy="212" r="5" fill="#0891b2" />
                <circle cx="222" cy="212" r="5" fill="#0891b2" />
                <text x="18" y="126" fill="#0f172a" fontWeight="900" fontSize="18">1</text>
                <text x="124" y="240" fill="#0f172a" fontWeight="900" fontSize="18">1</text>
                <text x="112" y="132" fill="#7c3aed" fontWeight="900" fontSize="28">√2</text>
              </svg>
              <p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-sm font-black text-cyan-900">The exact length is √2. It is irrational, so no finite decimal can finish it.</p>
            </article>

            <article className="rounded-3xl border border-violet-200 bg-white/95 p-4 dark:border-violet-300/20 dark:bg-slate-950/60">
              <p className="text-xs font-black uppercase text-violet-700">Decimal (approximation)</p>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">Zoom in on the length</p>
              <div className="relative mt-12 h-24 rounded-3xl bg-gradient-to-r from-violet-50 via-violet-100 to-white">
                <div className="absolute left-3 right-3 top-9 h-1 rounded-full bg-slate-300" />
                {[1.41, 1.414, 1.42].map((mark) => (
                  <span key={mark} className="absolute top-2 -translate-x-1/2 font-mono text-sm font-black text-slate-700" style={{ left: `${((mark - 1.41) / 0.01) * 100}%` }}>{mark}</span>
                ))}
                <span className="absolute top-8 h-11 w-1 -translate-x-1/2 rounded-full bg-violet-600" style={{ left: `${decimalPosition}%` }} />
                <span className="absolute left-1/2 top-16 -translate-x-1/2 rounded-2xl border border-violet-200 bg-white px-6 py-3 font-mono text-3xl font-black text-violet-700 shadow-sm">{decimalPreview}</span>
              </div>
              <p className="mt-6 text-center font-mono text-xl font-black">√2 ≈ {decimalPreview}{precision < 8 ? "..." : ""}</p>
              <p className="mt-2 text-center text-sm font-bold text-slate-600 dark:text-slate-300">The decimal goes on forever without repeating.</p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(240px,.8fr)_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <p className="font-black text-slate-950 dark:text-white">Display mode</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["exact", "decimal"] as ExactDecimalMode[]).map((option) => (
                  <button key={option} type="button" className={mode === option ? "rounded-2xl bg-cyan-600 px-3 py-3 text-sm font-black text-white shadow" : "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-700 hover:border-cyan-300"} onClick={() => chooseMode(option)}>
                    {option === "exact" ? "Exact (Symbolic)" : "Decimal (Preview)"}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black text-slate-950 dark:text-white">Decimal precision</p>
                <span className="rounded-2xl border border-violet-200 bg-white px-4 py-2 font-mono font-black text-violet-700">{decimalPreview}</span>
              </div>
              <label className="sr-only" htmlFor="exact-decimal-precision">Decimal precision</label>
              <input id="exact-decimal-precision" aria-label="Decimal precision" type="range" min="2" max="8" value={precision} onChange={(event) => updatePrecision(Number(event.target.value))} className="mt-4 w-full accent-violet-600" />
              <div className="mt-3 flex flex-wrap gap-2">
                {[2, 3, 5, 8].map((place) => (
                  <button key={place} type="button" className={precision === place ? "rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white" : "rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-700"} onClick={() => updatePrecision(place)}>{place} places</button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 dark:border-white/10 dark:bg-slate-950/60">
            <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-xs font-black uppercase text-slate-500 dark:bg-white/5 dark:text-slate-300"><span>Aspect</span><span>Exact (Symbolic)</span><span>Decimal (Approximate)</span></div>
            {[
              ["Representation", "√2", decimalPreview],
              ["Nature", "Irrational full value", "Rounded finite display"],
              ["Purpose", "Proofs, algebra, structure", "Measurements, estimates"],
              ["Key point", "Keeps the full value", "Approximates the value"],
            ].map(([aspect, exact, decimal]) => (
              <div key={aspect} className="grid grid-cols-3 border-t border-slate-100 px-3 py-2 text-sm font-semibold dark:border-white/10">
                <span>{aspect}</span><span className="font-mono">{exact}</span><span className="font-mono">{decimal}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-black text-amber-900">Both represent the same number; only the form is different.</p>

          <div className="mt-4 rounded-3xl border border-emerald-200 bg-white/95 p-4 dark:border-emerald-300/20 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-emerald-700">Practice</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">Choose exact or decimal for the diagonal of a 1 by 1 square.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={practiceChoice === "exact" ? "action-primary" : "action-secondary"} onClick={() => selectPractice("exact")}>Exact (√2)</button>
                <button type="button" className={practiceChoice === "decimal" ? "action-primary" : "action-secondary"} onClick={() => selectPractice("decimal")}>Decimal ({decimalPreview})</button>
              </div>
            </div>
            {showPractice ? <p className={practiceChoice === "exact" ? "mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800" : "mt-3 rounded-2xl bg-amber-50 p-3 font-mono text-lg font-black text-amber-900"}>{practiceChoice === "exact" ? "Exact: √2; Decimal estimate: 1.414." : "Decimal estimate: 1.414, but choose exact when the square diagonal is the object."}</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Concept trace - Exact versus decimal classification</p>
          <FractionInspector label="Exact form" value="√2" success note="The exact, symbolic form." />
          <FractionInspector label="Decimal form" value={`≈ ${decimalPreview}${precision < 8 ? "..." : ""}`} note="An approximation that continues without end." />
          <FractionInspector label="Mode" value={mode} note="Current display mode." />
          <FractionInspector label="Use exact for" value="Structure" note="Proofs, simplification, algebraic work." />
          <FractionInspector label="Use decimal for" value="Measurement" note="Estimation and real-world context." />
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100">
            <p className="text-[10px] font-black uppercase">Why this works</p>
            <p className="mt-2 text-sm font-bold leading-6">A 1 x 1 square has diagonal length √(1² + 1²) = √2. Exact mode keeps √2; decimal mode rounds it for display.</p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">Watch out: 1.414 is not equal to √2. It is a rounded report of the exact value.</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-slate-500">Event log</p>
            <p className="mt-2 text-sm font-black text-slate-800 dark:text-slate-100">{eventLog}</p>
          </div>
          <button type="button" className="action-secondary w-full justify-center" onClick={resetExactDecimal}><RotateCcw className="h-4 w-4" />Reset exact mode</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function truncateDecimals(value: number, places: number) {
  const factor = 10 ** places;
  return (Math.trunc(value * factor) / factor).toFixed(places);
}

function normalizeExpression(value: string) {
  return value.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

function formatExpression(value: string) {
  return value.replace(/\*/g, "×").replace(/\//g, "÷");
}

function buttonClassForKey(key: string) {
  const base = "rounded-2xl border px-3 py-3 text-base font-black transition active:scale-[0.99]";
  if (["+", "−", "×", "÷"].includes(key)) return `${base} border-slate-900 bg-slate-950 text-white shadow hover:bg-slate-900`;
  if (["(", ")"].includes(key)) return `${base} border-amber-100 bg-amber-50 text-amber-900 hover:bg-amber-100`;
  if (key === "0") return `${base} border-slate-200 bg-white text-slate-950 hover:bg-slate-50 sm:col-span-2`;
  return `${base} border-slate-200 bg-slate-50 text-slate-950 hover:bg-white`;
}

function LessonBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return <span className={muted ? "inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2" : "inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-950"}>{label}</span>;
}

function TraceCard({ index, accent, title, expression, note, chip, active = false }: { index: string; accent: "cyan" | "violet"; title: string; expression: string; note: string; chip: string; active?: boolean }) {
  const accentStyles = accent === "cyan"
    ? "border-cyan-200 bg-white shadow-cyan-100/60"
    : "border-violet-200 bg-white shadow-violet-100/60";
  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${accentStyles} ${active ? "ring-2 ring-cyan-300/30" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white ${accent === "cyan" ? "bg-cyan-600" : "bg-violet-600"}`}>{index}</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{title}</p>
            <p className="mt-1 font-mono text-lg font-black text-slate-950">{expression}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${accent === "cyan" ? "bg-cyan-50 text-cyan-700" : "bg-violet-50 text-violet-700"}`}>{chip}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{note}</p>
    </article>
  );
}

function TraceConnector() {
  return (
    <div className="flex justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-cyan-300 bg-white text-cyan-600">
        <ChevronRight className="h-4 w-4 rotate-90" />
      </div>
    </div>
  );
}

function InfoPanel({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-base font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function CalculatorConceptTrace({ lessonId, expression, result, angleMode, accuracy, historyCount }: { lessonId: number; expression: string; result: string; angleMode: AngleMode; accuracy: "exact" | "approximate"; historyCount: number }) {
  const trace = calculatorConceptTraceFor(lessonId, expression, result, angleMode, accuracy, historyCount);
  return (
    <section className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/70 to-sky-50 p-3 dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-sky-300/10" aria-label={`${trace.title} concept trace`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Concept trace</p>
          <h3 className="text-sm font-black text-slate-950 dark:text-white">{trace.title}</h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-100">{trace.badge}</span>
      </div>
      <div className="mt-3 grid gap-2">
        {trace.rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-slate-950/55">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{row.label}</span>
              <strong className="max-w-[150px] truncate font-mono text-sm text-slate-950 dark:text-white">{row.value}</strong>
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-cyan-100/70 p-2 text-xs font-black leading-5 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-100">{trace.validity}</p>
    </section>
  );
}

type CalculatorConceptTrace = {
  title: string;
  badge: string;
  validity: string;
  rows: Array<{ label: string; value: string; note: string }>;
};

function calculatorConceptTraceFor(lessonId: number, expression: string, result: string, angleMode: AngleMode, accuracy: "exact" | "approximate", historyCount: number): CalculatorConceptTrace {
  const displayedResult = result || "evaluate to reveal";
  const common = (title: string, badge: string, rows: CalculatorConceptTrace["rows"], validity: string): CalculatorConceptTrace => ({ title, badge, rows, validity });
  if (lessonId === 1) return common("Operation order stack", "BODMAS", [
    { label: "Expression", value: expression, note: "Read brackets before ordinary left-to-right calculation." },
    { label: "First priority", value: "brackets/division", note: "For (12+8)/4, add inside brackets, then divide." },
    { label: "Result", value: displayedResult, note: "The calculator result is valid only after operation order is applied." },
  ], "A basic calculator lesson must show operation priority, not only a final answer.");
  if (lessonId === 2) return common("Fraction common-parts trace", "Exact parts", [
    { label: "Input", value: expression, note: "Each fraction keeps numerator and denominator visible." },
    { label: "Common denominator", value: "4", note: "1/2 becomes 2/4 before adding to 3/4." },
    { label: "Output", value: displayedResult, note: "The answer should preserve the exact fraction idea before decimalizing." },
  ], "Fraction visuals should show common parts and the non-zero denominator rule.");
  if (lessonId === 3) return common("Mixed to improper fraction", "Whole + part", [
    { label: "Mixed structure", value: "2 + 1/3", note: "Mixed numbers mean addition, not multiplication." },
    { label: "Improper form", value: "7/3", note: "Convert whole units into matching fraction parts." },
    { label: "Calculated", value: displayedResult, note: "The calculator checks the converted value." },
  ], "Mixed-number pages need whole-plus-fraction structure visible.");
  if (lessonId === 4) return common("Percent of base amount", "Per 100", [
    { label: "Percent", value: "15/100", note: "Percent must be divided by 100 before multiplying." },
    { label: "Base", value: "240", note: "The base is the whole amount the percent acts on." },
    { label: "Part", value: displayedResult, note: "The result is the requested part of the base." },
  ], "Percentage visuals should show percent, base, and part together.");
  if (lessonId === 5) return common("Ratio simplification trace", "Same factor", [
    { label: "Ratio", value: "24:36", note: "Both parts must change together." },
    { label: "Common factor", value: "12", note: "Divide both 24 and 36 by the same factor." },
    { label: "Simplest form", value: "2:3", note: "The comparison is preserved." },
  ], "A ratio lesson is about preserving comparison, not ordinary division alone.");
  if (lessonId === 6) return common("Power-root inverse pair", "Undo rules", [
    { label: "Root", value: "sqrt(144)=12", note: "A square root asks which number squares to 144." },
    { label: "Power", value: "2^3=8", note: "The exponent counts repeated factors." },
    { label: "Combined", value: displayedResult, note: "Operation order combines the two exact pieces." },
  ], "Power/root visuals should expose repeated multiplication and inverse square logic.");
  if (lessonId === 7) return common("Scientific notation scale", "x10^n", [
    { label: "Coefficient", value: "6.02", note: "Keep one non-zero digit before the decimal." },
    { label: "Power", value: "10^5", note: "Five decimal moves create the exponent." },
    { label: "Calculator input", value: expression, note: "The calculator evaluates the scaled value." },
  ], "Scientific notation needs coefficient and power-of-ten roles visible.");
  if (lessonId === 8) return common("Log as exponent question", "Inverse power", [
    { label: "Question", value: "log(1000)", note: "Ask: 10 to what power gives 1000?" },
    { label: "Power check", value: "10^3=1000", note: "The exponent is the answer." },
    { label: "Output", value: displayedResult, note: "The calculator confirms the exponent." },
  ], "Logarithm visuals should show the reversed exponential relationship.");
  if (lessonId === 9) return common("Exponential repeated factors", "Growth", [
    { label: "Base", value: "2", note: "The base is repeatedly multiplied." },
    { label: "Exponent", value: "8", note: "Eight means eight factors, not 2 x 8." },
    { label: "Output", value: displayedResult, note: "Repeated multiplication grows quickly." },
  ], "Exponential pages must prevent the common multiply-base-by-exponent mistake.");
  if (lessonId === 10) return common("Trig angle-mode check", angleMode, [
    { label: "Mode", value: angleMode, note: "Degree questions need DEG mode." },
    { label: "Known ratios", value: "sin30=cos60=0.5", note: "The two special-angle ratios add." },
    { label: "Output", value: displayedResult, note: "Wrong mode gives a misleading answer." },
  ], "Trig calculator visuals must make angle mode impossible to miss.");
  if (lessonId === 11) return common("Ratio to principal angle", angleMode, [
    { label: "Ratio", value: "0.5", note: "The input is a side ratio between -1 and 1." },
    { label: "Principal angle", value: "30 degrees", note: "asin returns the calculator's main angle." },
    { label: "Check", value: "sin(30)=0.5", note: "Apply sine again to verify." },
  ], "Inverse trig pages should show principal value, not imply all angles are returned.");
  if (lessonId === 12) return common("Hyperbolic exponential formula", "sinh", [
    { label: "Definition", value: "(e^x-e^-x)/2", note: "Hyperbolic functions are built from exponentials." },
    { label: "Input", value: "x=1", note: "Substitute the chosen input carefully." },
    { label: "Output", value: displayedResult, note: "This is not the circular sine function." },
  ], "Hyperbolic pages need exponential structure to avoid trig-name confusion.");
  if (lessonId === 13) return common("Counting choices trace", "n!", [
    { label: "Factorial", value: "6!", note: "Multiply choices as they decrease." },
    { label: "Expansion", value: "6x5x4x3x2x1", note: "Each selected item leaves one fewer choice." },
    { label: "Output", value: displayedResult, note: "Use nCr instead when order does not matter." },
  ], "Counting calculator pages must show whether order matters.");
  if (lessonId === 14) return common("Distance from zero", "Magnitude", [
    { label: "Input", value: "-12", note: "The sign shows direction from zero." },
    { label: "Distance", value: "12 units", note: "Distance cannot be negative." },
    { label: "Output", value: displayedResult, note: "Absolute value returns magnitude." },
  ], "Absolute value visuals should be a distance trace, not just sign flipping.");
  if (lessonId === 15) return common("Exact value to rounded report", "Precision", [
    { label: "Exact division", value: "10/3", note: "The decimal repeats forever." },
    { label: "Displayed mode", value: accuracy, note: "A finite decimal is an approximation." },
    { label: "Output", value: displayedResult, note: "Round only at the reporting step." },
  ], "Rounding lessons must show exact versus displayed precision.");
  if (lessonId === 16) return common("Constant insertion check", "pi", [
    { label: "Constant", value: "pi", note: "The library stores more digits than a rough typed value." },
    { label: "Formula", value: "2*pi", note: "For radius 1, circumference is 2pi." },
    { label: "Output", value: displayedResult, note: "Round after the accurate constant is used." },
  ], "Constants pages should show stored constant use and avoid early rounding.");
  if (lessonId === 17) return common("History pairs input with output", "Trace", [
    { label: "Latest input", value: expression, note: "History is useful only when the source expression is visible." },
    { label: "Rows stored", value: String(historyCount), note: "Each evaluation adds a visible expression-result row." },
    { label: "Latest result", value: displayedResult, note: "Do not copy a result without its input." },
  ], "Calculation history is a record model, not a calculation-only screen.");
  if (lessonId === 18) return common("Exact versus decimal classification", accuracy, [
    { label: "Exact form", value: "sqrt(2)", note: "The radical preserves the complete value." },
    { label: "Decimal form", value: "1.414...", note: "Any finite decimal is rounded." },
    { label: "Mode", value: accuracy, note: "Choose exact for structure, decimal for measurement." },
  ], "Exact/decimal pages must teach answer form, not just evaluate a number.");
  return common("Calculator concept trace", "checked", [
    { label: "Input", value: expression, note: "Read the expression before trusting output." },
    { label: "Mode", value: angleMode, note: "Mode affects selected function families." },
    { label: "Output", value: displayedResult, note: "The result should match the lesson rule." },
  ], "Every calculator lesson needs input, mode, and result visible together.");
}

function calculatorGuidanceFor(lessonId: number) {
  const guidance: Record<number, [string, string, string]> = {
    1: ["Order rule", "Multiply and divide before adding or subtracting.", "Use brackets when you want a different order."],
    2: ["Fraction rule", "Use common denominators for fraction addition.", "Never add denominators directly."],
    3: ["Mixed-number rule", "A mixed number means whole part plus fraction.", "Convert to improper fractions before complex operations."],
    4: ["Percent rule", "Percent means parts per hundred.", "Divide by 100 before multiplying by the base."],
    5: ["Ratio rule", "Change both ratio parts by the same factor.", "Simplest form keeps the same comparison."],
    6: ["Power-root rule", "Powers repeat multiplication; roots reverse powers.", "sqrt(144) is 12, not 72."],
    7: ["Scientific notation", "Write a coefficient times a power of ten.", "Large numbers use positive exponents."],
    8: ["Log rule", "A logarithm asks for an exponent.", "log_10(1000) is 3 because 10^3 is 1000."],
    9: ["Exponential rule", "The exponent counts repeated factors.", "2^8 is not 2 times 8."],
    10: ["Trig mode", "Degree questions need DEG mode.", "Check angle mode before trusting a trig value."],
    11: ["Inverse trig", "Inverse trig finds a principal angle from a ratio.", "Some equations need extra angles later."],
    12: ["Hyperbolic rule", "Hyperbolic functions are built from exponentials.", "sinh is not the same as sin."],
    13: ["Counting rule", "Factorials count shrinking choices.", "Use combinations when order does not matter."],
    14: ["Absolute value", "Absolute value is distance from zero.", "The result is never negative."],
    15: ["Precision rule", "Rounded decimals are usually approximate.", "Keep exact values until the final answer."],
    16: ["Constant rule", "Use stored constants for accuracy.", "Round only after the calculation."],
    17: ["History rule", "History pairs each result with its expression.", "Check the input before reusing an answer."],
    18: ["Exact mode", "Exact form keeps full value when possible.", "A decimal for sqrt(2) is approximate."],
  };
  return guidance[lessonId] ?? ["Calculator rule", "Check input, mode, and output together.", "Use the visible trace to catch mistakes."];
}

function challengeFor(mode: "result" | "history-count" | "accuracy", expression: string, result: string, accuracy: "exact" | "approximate", historyCount: number) {
  if (mode === "history-count") return { challengePrompt: "How many calculations are currently stored in the visible history?", challengeExpected: String(historyCount), challengeHint: "Count the visible history rows.", challengeKind: "numeric" };
  if (mode === "accuracy") return { challengePrompt: "Is the current result exact or approximate?", challengeExpected: accuracy, challengeHint: "Read the result-mode indicator.", challengeKind: "keywords" };
  return { challengePrompt: `What result is displayed for ${expression}?`, challengeExpected: result, challengeHint: "Read the calculated result and preserve its displayed precision.", challengeKind: "numeric" };
}
