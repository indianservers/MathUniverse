import { useMemo, useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";
import { InvalidMathStateMessage } from "../../ui/LearningScaffolds";
import { evaluateArithmeticExpression, normalizeExpression } from "./grade7MathUtils";

const presets = ["8 + 4 * 3", "(8 + 4) * 3", "20 - 12 / 4", "6 + 2 * (9 - 5)", "40 / 5 * 2"];

export default function Grade7ArithmeticExpressionsLab() {
  const [expression, setExpression] = useState("6 + 2 * (9 - 5)");
  const result = useMemo(() => {
    try {
      return { data: evaluateArithmeticExpression(expression), error: "" };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Check the expression." };
    }
  }, [expression]);

  return (
    <NCERTChapterScaffold
      title="Arithmetic Expressions"
      conceptId="class-7-arithmetic-expressions"
      subtitle="Use brackets and BODMAS to decide which operation happens first."
      formula="Brackets -> divide/multiply left to right -> add/subtract left to right"
      presets={presets}
      diagramSummary="The expression lab lists each operation in the correct order and highlights common left-to-right mistakes."
      studentTask={{
        tryFirst: "Compare 8 + 4 * 3 with (8 + 4) * 3.",
        predict: "Will the answers be the same?",
        observe: "Watch which operation is solved first.",
        explain: "Explain why brackets can change the answer.",
        commonMistake: "Do not add before multiplying unless brackets tell you to.",
      }}
      teacherNote={{
        objective: "Students evaluate numeric expressions using order of operations.",
        prerequisite: "Whole-number operations and brackets.",
        prompt: "Ask students to write the first operation before calculating.",
        misconception: "Students often solve strictly left to right even when multiplication appears later.",
        extension: "Let students create two expressions with the same numbers but different brackets.",
      }}
      recap={["Brackets are solved first.", "Multiplication and division happen before addition and subtraction.", "For the same priority, move left to right."]}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="text-sm font-black text-slate-800 dark:text-slate-100">
            Expression
            <input aria-label="Arithmetic expression input" value={expression} onChange={(event) => setExpression(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-lg dark:border-white/10 dark:bg-slate-900" />
          </label>
          <div className="flex flex-wrap gap-2 self-end">
            {presets.map((preset) => (
              <button key={preset} type="button" onClick={() => setExpression(preset)} className="action-secondary">
                {preset}
              </button>
            ))}
          </div>
        </div>

        {result.error || !result.data ? (
          <div className="mt-4"><InvalidMathStateMessage>{result.error}</InvalidMathStateMessage></div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]" aria-live="polite">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Expression tree idea</p>
              <div className="mt-4 grid gap-2 text-center font-mono">
                {normalizeExpression(expression).split("").map((char, index) => (
                  <span key={`${char}-${index}`} className={char === "(" || char === ")" ? "rounded-lg bg-violet-500/40 px-2 py-1" : "rounded-lg bg-white/10 px-2 py-1"}>
                    {char}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-3xl font-black text-cyan-100">= {result.data.value}</p>
              {result.data.warning && <p className="mt-3 rounded-xl bg-amber-300/15 p-3 text-sm font-bold text-amber-100">{result.data.warning}</p>}
            </div>
            <ol className="space-y-3">
              {result.data.steps.length === 0 ? (
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold dark:border-white/10 dark:bg-slate-900">This expression is already a single number.</li>
              ) : result.data.steps.map((step, index) => (
                <li key={`${step.expression}-${index}`} className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
                  <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Step {index + 1}</p>
                  <p className="mt-1 font-mono text-lg font-black text-slate-950 dark:text-white">{step.expression}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{step.operation}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </NCERTChapterScaffold>
  );
}
