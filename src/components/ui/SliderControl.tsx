import { Lock, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const history = useRef<number[]>([]);
  const [locked, setLocked] = useState(false);

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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && history.current.length) {
        event.preventDefault();
        const previous = history.current.pop();
        if (previous !== undefined) onChange(previous);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onChange]);

  const commit = (next: number, remember = true) => {
    const clamped = Math.min(max, Math.max(min, Number.isFinite(next) ? next : value));
    const snapped = Number((Math.round(clamped / step) * step).toFixed(6));
    if (remember && snapped !== value) history.current.push(value);
    onChange(snapped);
  };

  const presets = [
    { label: "Zero", value: Math.min(max, Math.max(min, 0)) },
    { label: "Classic", value: Math.min(max, Math.max(min, (min + max) / 2)) },
    { label: "Extreme", value: max },
  ];

  return (
    <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-400/40">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-24 rounded-full border border-slate-200 bg-white px-3 py-1 text-right text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-cyan-100"
            type="number"
            value={Number(value.toFixed(6))}
            min={min}
            max={max}
            step={step}
            onChange={(event) => commit(Number(event.target.value))}
            aria-label={`${label} exact value`}
          />
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-cyan-100">
            {formatFormulaValue(value, unit)}
          </span>
        </div>
      </div>
      <input
        className="slider-range w-full cursor-pointer appearance-none bg-transparent accent-cyan-500 touch-pan-x"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => commit(Number(event.target.value))}
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <span>{min}</span>
        <button type="button" className={locked ? "mini-chip bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "mini-chip"} onClick={() => setLocked((value) => !value)} title="Range lock marker for paired slider work">
          {locked ? <Lock className="inline h-3 w-3" /> : <Unlock className="inline h-3 w-3" />} Lock
        </button>
        <span>{max}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset.label} type="button" className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100" onClick={() => commit(preset.value)}>
            {preset.label}
          </button>
        ))}
      </div>
    </label>
  );
}
