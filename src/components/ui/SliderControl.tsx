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
    <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-400/40">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-cyan-100">
          {formatFormulaValue(value, unit)}
        </span>
      </div>
      <input
        className="h-8 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 accent-cyan-500 touch-pan-x dark:from-cyan-500/50 dark:via-violet-500/50 dark:to-fuchsia-500/50"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </label>
  );
}
