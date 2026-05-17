import { useEffect, useRef } from "react";
import { formatFormulaValue } from "../../utils/format";
import { readSliderParam, writeSliderParam } from "../../utils/shareableState";

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
  const hydratedFromUrl = useRef(false);
  const skipNextUrlWrite = useRef(false);

  useEffect(() => {
    if (hydratedFromUrl.current) return;
    hydratedFromUrl.current = true;

    const queryValue = readSliderParam(label);
    if (queryValue === null) return;

    const clamped = Math.min(max, Math.max(min, queryValue));
    const snapped = Math.round(clamped / step) * step;
    skipNextUrlWrite.current = true;
    onChange(Number(snapped.toFixed(6)));
  }, [label, max, min, onChange, step]);

  useEffect(() => {
    if (!hydratedFromUrl.current) return;
    if (skipNextUrlWrite.current) {
      skipNextUrlWrite.current = false;
      return;
    }
    writeSliderParam(label, value);
  }, [label, value]);

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
        className="slider-range w-full cursor-pointer appearance-none bg-transparent accent-cyan-500 touch-pan-x"
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
