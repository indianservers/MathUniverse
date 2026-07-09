import { useMemo, useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";
import { InvalidMathStateMessage } from "../../ui/LearningScaffolds";
import { expandedForm, formatNumberBySystem, numberName, roundToPlace, sanitizeWholeNumber, type NumberSystemMode, type RoundingPlace } from "./grade7MathUtils";

const presets = ["4,56,78,901", "12,345,678", "9,99,999", "10,00,00,000", "Compare 45,60,000 and 4,560,000"];
const places: RoundingPlace[] = ["ten", "hundred", "thousand", "lakh", "million"];

export default function Grade7LargeNumbersLab() {
  const [input, setInput] = useState("45678901");
  const [compareInput, setCompareInput] = useState("12345678");
  const [mode, setMode] = useState<NumberSystemMode>("indian");
  const [place, setPlace] = useState<RoundingPlace>("thousand");
  const value = sanitizeWholeNumber(input);
  const compareValue = sanitizeWholeNumber(compareInput);

  const rows = useMemo(() => {
    if (value === null) return [];
    const digits = value.toString().padStart(mode === "indian" ? 9 : 9, "0").split("");
    const labels = mode === "indian"
      ? ["Ten crore", "Crore", "Ten lakh", "Lakh", "Ten thousand", "Thousand", "Hundred", "Ten", "One"]
      : ["Hundred million", "Ten million", "Million", "Hundred thousand", "Ten thousand", "Thousand", "Hundred", "Ten", "One"];
    return labels.map((label, index) => ({ label, digit: digits[index] ?? "0" }));
  }, [mode, value]);

  return (
    <NCERTChapterScaffold
      title="Large Numbers Around Us"
      subtitle="Read, compare, expand, and round large numbers using Indian and international place-value systems."
      formula="place value = digit x value of its place"
      presets={presets}
      diagramSummary="The place-value table breaks a large number into crores or millions, then shows expanded form and rounding."
      studentTask={{
        tryFirst: "Type a population or money amount and switch between Indian and international systems.",
        predict: "Which commas will move when the system changes?",
        observe: "Look at the place-value table and number name.",
        explain: "Why does 10,00,000 become 1,000,000 in another system?",
        commonMistake: "Do not group every comma in pairs. Indian system uses 3 digits first, then pairs.",
      }}
      teacherNote={{
        objective: "Students connect digit position, commas, number names, rounding, and estimation.",
        prerequisite: "Place value up to lakhs or millions.",
        prompt: "Ask students to read the same number in both systems and compare the words.",
        misconception: "Students often confuse lakh with million or round by chopping digits.",
        extension: "Use real city population, distance, school budget, or stadium capacity data.",
      }}
      recap={["A digit changes value when its place changes.", "Indian and international commas group the same digits differently.", "Rounding chooses the nearest useful benchmark."]}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm font-black text-slate-800 dark:text-slate-100">
            Number
            <input aria-label="Large number input" value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-lg dark:border-white/10 dark:bg-slate-900" />
          </label>
          <label className="text-sm font-black text-slate-800 dark:text-slate-100">
            Compare with
            <input aria-label="Comparison number input" value={compareInput} onChange={(event) => setCompareInput(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-lg dark:border-white/10 dark:bg-slate-900" />
          </label>
          <div className="grid grid-cols-2 gap-2 self-end">
            {(["indian", "international"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={item === mode ? "action-primary" : "action-secondary"} aria-pressed={item === mode}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {value === null || compareValue === null ? (
          <div className="mt-4"><InvalidMathStateMessage>Use whole numbers only. Commas are allowed.</InvalidMathStateMessage></div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-cyan-50/50 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <table className="w-full min-w-[720px] text-center text-sm">
                <thead>
                  <tr>{rows.map((row) => <th key={row.label} className="px-2 py-2 text-xs text-slate-500 dark:text-slate-300">{row.label}</th>)}</tr>
                </thead>
                <tbody>
                  <tr>{rows.map((row) => <td key={row.label} className="rounded-xl border border-white bg-white px-2 py-4 text-2xl font-black text-cyan-800 dark:border-white/10 dark:bg-slate-950 dark:text-cyan-100">{row.digit}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-3" aria-live="polite">
              <Fact label="With commas" value={formatNumberBySystem(value, mode)} />
              <Fact label="Number name" value={numberName(value, mode)} />
              <Fact label="Expanded form" value={expandedForm(value)} />
              <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-white/10 dark:bg-slate-900">
                Round to
                <select aria-label="Rounding place" value={place} onChange={(event) => setPlace(event.target.value as RoundingPlace)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950">
                  {places.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <Fact label="Rounded value" value={formatNumberBySystem(roundToPlace(value, place), mode)} />
              <Fact label="Comparison" value={value === compareValue ? "Both are equal" : value > compareValue ? "First number is larger" : "Second number is larger"} />
            </div>
          </div>
        )}
      </section>
    </NCERTChapterScaffold>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-base font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
