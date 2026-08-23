import { useEffect, useMemo, useState } from "react";
import { BadgeInfo, CheckCircle2, ChevronRight, Eraser, Equal, History, Plus, RotateCcw } from "lucide-react";
import CalculatorDisplay from "../../../components/calculator/CalculatorDisplay";
import MathKeyboardInput from "../../../components/math-keyboard/MathKeyboardInput";
import { evaluateExpressionDetailed, type AngleMode } from "../../../utils/calculator";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { calculatorLessonPreset } from "../presets/calculatorLessonPresets";

type HistoryRow = { expression: string; result: string };

export default function CalculatorLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 1) {
    return <BasicCalculatorLessonSurface lessonId={lesson.id} resetToken={resetToken} onInteraction={onInteraction} />;
  }
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
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceStatus, setPracticeStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  useEffect(() => {
    setExpression(initialExpression);
    setAngleMode(preset.angleMode);
    setResult("5");
    setAccuracy("exact");
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
    if (normalized === "6" || normalized === "06") {
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
                  <div className="font-mono text-4xl font-semibold tracking-tight text-white sm:text-[3rem]">{formatExpression(expression || initialExpression)}</div>
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
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">Trace</span>
          </div>
          <div className="mt-4 space-y-4">
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
            </div>
          </div>

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
              <p className="text-sm font-semibold text-slate-600">Try: <strong className="font-black text-slate-950">18 - 6 × 2</strong></p>
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
                  {practiceStatus === "correct" ? "Correct. 18 - 6 × 2 = 6." : "Almost there. The correct answer is 6."}
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
