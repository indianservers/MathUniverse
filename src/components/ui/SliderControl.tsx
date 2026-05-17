import { formatFormulaValue } from "../../utils/format";

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  description?: string;
};

export default function SliderControl({ label, value, min, max, step, onChange, unit = "", description }: SliderControlProps) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-cyan-100">
          {formatFormulaValue(value, unit)}
        </span>
      </div>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-500 dark:bg-slate-700"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
