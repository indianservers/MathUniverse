import { useMemo, useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";
import { InvalidMathStateMessage } from "../../ui/LearningScaffolds";
import { operateDecimals, type DecimalOperation } from "./grade7MathUtils";

const presets = [
  { label: "3.4 + 2.75", a: "3.4", b: "2.75", op: "add" as DecimalOperation },
  { label: "10.5 - 3.25", a: "10.5", b: "3.25", op: "subtract" as DecimalOperation },
  { label: "1.2 * 0.3", a: "1.2", b: "0.3", op: "multiply" as DecimalOperation },
  { label: "4.8 / 1.2", a: "4.8", b: "1.2", op: "divide" as DecimalOperation },
  { label: "2.75 * 100", a: "2.75", b: "100", op: "scale100" as DecimalOperation },
  { label: "93.5 / 10", a: "93.5", b: "10", op: "divide10" as DecimalOperation },
];

const operationLabels: Record<DecimalOperation, string> = {
  add: "add",
  subtract: "subtract",
  multiply: "multiply",
  divide: "divide",
  scale10: "multiply by 10",
  scale100: "multiply by 100",
  divide10: "divide by 10",
};

export default function Grade7DecimalOperationsLab() {
  const [a, setA] = useState("3.4");
  const [b, setB] = useState("2.75");
  const [operation, setOperation] = useState<DecimalOperation>("add");
  const result = useMemo(() => {
    try {
      return { value: operateDecimals(Number(a), Number(b), operation), error: "" };
    } catch (error) {
      return { value: 0, error: error instanceof Error ? error.message : "Use valid decimals." };
    }
  }, [a, b, operation]);

  const decimalPlaces = Math.max(decimalCount(a), decimalCount(b));

  return (
    <NCERTChapterScaffold
      title="Decimal Operations"
      subtitle="Line up decimal places, compare decimal values, and see how powers of 10 move digits."
      formula="same place values line up under each other"
      presets={presets.map((preset) => preset.label)}
      diagramSummary="The decimal lab aligns tenths, hundredths, and thousandths, then shows number-line and scaling ideas."
      studentTask={{
        tryFirst: "Try 3.4 + 2.75 and line up the decimal points.",
        predict: "Which place-value column will need careful alignment?",
        observe: "Watch tenths and hundredths stay in their own columns.",
        explain: "Why is 3.4 the same as 3.40 for addition?",
        commonMistake: "Do not line up numbers by the last digit. Line up the decimal points.",
      }}
      teacherNote={{
        objective: "Students operate on decimals by place value and scaling.",
        prerequisite: "Tenths, hundredths, thousandths, and whole-number operations.",
        prompt: "Ask students to say the place value of each digit before calculating.",
        misconception: "Students may treat 3.4 and 3.04 as having the same decimal size.",
        extension: "Use money, measurements, and scores as contexts.",
      }}
      recap={["Decimal points line up for addition and subtraction.", "Multiplying by 10 or 100 shifts digits left in the place-value table.", "Division by 10 shifts digits right."]}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid gap-3 lg:grid-cols-4">
          <DecimalInput label="Decimal A" value={a} onChange={setA} />
          <DecimalInput label="Decimal B" value={b} onChange={setB} />
          <label className="text-sm font-black text-slate-800 dark:text-slate-100">
            Operation
            <select aria-label="Decimal operation" value={operation} onChange={(event) => setOperation(event.target.value as DecimalOperation)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
              {Object.entries(operationLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <div className="self-end rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10" aria-live="polite">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Result</p>
            <p className="text-2xl font-black text-slate-950 dark:text-white">{result.error ? "-" : result.value}</p>
          </div>
        </div>

        {result.error ? (
          <div className="mt-4"><InvalidMathStateMessage>{result.error}</InvalidMathStateMessage></div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900">
              <p className="font-black">Place-value alignment</p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {["ones", "tenths", "hundredths", "thousandths"].map((place) => <p key={place} className="text-xs font-black uppercase text-slate-500">{place}</p>)}
                {placeDigits(a, decimalPlaces).map((digit, index) => <Digit key={`a-${index}`} value={digit} />)}
                {placeDigits(b, decimalPlaces).map((digit, index) => <Digit key={`b-${index}`} value={digit} />)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
              <p className="font-black">Number-line idea</p>
              <div className="mt-4 h-12 rounded-full bg-slate-100 p-2 dark:bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${Math.min(100, Math.abs(result.value) * 10)}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                For powers of 10, the decimal point does not jump. The digits shift to a new place value.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset.label} type="button" className="action-secondary" onClick={() => { setA(preset.a); setB(preset.b); setOperation(preset.op); }}>
              {preset.label}
            </button>
          ))}
        </div>
      </section>
    </NCERTChapterScaffold>
  );
}

function DecimalInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-black text-slate-800 dark:text-slate-100">
      {label}
      <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono dark:border-white/10 dark:bg-slate-900" />
    </label>
  );
}

function Digit({ value }: { value: string }) {
  return <div className="rounded-xl border border-white bg-white px-2 py-3 text-xl font-black dark:border-white/10 dark:bg-slate-950">{value}</div>;
}

function decimalCount(value: string) {
  return value.includes(".") ? value.split(".")[1].length : 0;
}

function placeDigits(value: string, places: number) {
  const number = Number(value);
  const [whole, decimal = ""] = (Number.isFinite(number) ? Math.abs(number).toFixed(Math.max(3, places)) : "0.000").split(".");
  return [whole.slice(-1), decimal[0] ?? "0", decimal[1] ?? "0", decimal[2] ?? "0"];
}
