import { useMemo, useState } from "react";
import { computeTrigFormulaValues, formatTrigNumber, type TrigFormulaValues } from "../../utils/trigFormulaUtils";

type ComparisonCurveId = "sin" | "cos" | "tan" | "sin-square" | "cos-square" | "pythagorean";

type ComparisonCurve = {
  id: ComparisonCurveId;
  label: string;
  color: string;
  getValue: (values: TrigFormulaValues) => number | null;
};

type FormulaComparisonGraphProps = {
  values: TrigFormulaValues;
};

const graphWidth = 720;
const graphHeight = 260;
const graphPadding = { left: 46, right: 22, top: 24, bottom: 34 };
const plotWidth = graphWidth - graphPadding.left - graphPadding.right;
const plotHeight = graphHeight - graphPadding.top - graphPadding.bottom;

const curves: ComparisonCurve[] = [
  { id: "sin", label: "sin theta", color: "#fb7185", getValue: (values) => values.sin },
  { id: "cos", label: "cos theta", color: "#38bdf8", getValue: (values) => values.cos },
  { id: "tan", label: "tan theta", color: "#facc15", getValue: (values) => values.tan },
  { id: "sin-square", label: "sin^2 theta", color: "#c084fc", getValue: (values) => values.sinSquare },
  { id: "cos-square", label: "cos^2 theta", color: "#34d399", getValue: (values) => values.cosSquare },
  { id: "pythagorean", label: "sin^2 + cos^2", color: "#f97316", getValue: (values) => values.identitySum },
];

export default function FormulaComparisonGraph({ values }: FormulaComparisonGraphProps) {
  const [selectedCurveIds, setSelectedCurveIds] = useState<ComparisonCurveId[]>(["sin", "cos", "pythagorean"]);
  const selectedCurves = curves.filter((curve) => selectedCurveIds.includes(curve.id));
  const markerX = xForDegrees(values.degrees);

  const paths = useMemo(
    () =>
      selectedCurves.map((curve) => ({
        curve,
        path: buildCurvePath(curve),
        liveValue: curve.getValue(values),
      })),
    [selectedCurves, values],
  );

  const toggleCurve = (curveId: ComparisonCurveId) => {
    setSelectedCurveIds((current) => {
      if (current.includes(curveId)) return current.filter((id) => id !== curveId);
      return [...current, curveId];
    });
  };

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
      data-testid="formula-comparison-mode"
      aria-label="Formula comparison mode"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700 dark:text-sky-300">Formula Comparison Mode</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Compare formulas from 0 deg to 360 deg</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            The moving vertical marker follows the current theta while selected formulas plot their full cycle.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-72">
          {curves.map((curve) => (
            <button
              key={curve.id}
              type="button"
              className={selectedCurveIds.includes(curve.id) ? "rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-left text-xs font-black text-sky-900 dark:border-sky-300/50 dark:bg-sky-400/15 dark:text-sky-50" : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-700 transition hover:border-sky-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"}
              onClick={() => toggleCurve(curve.id)}
              data-testid={`comparison-toggle-${curve.id}`}
              aria-pressed={selectedCurveIds.includes(curve.id)}
            >
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: curve.color }} />
              {curve.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg bg-slate-950" data-testid="comparison-graph-wrap">
        {selectedCurves.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center p-6 text-center text-sm font-bold text-slate-300" data-testid="comparison-empty-state">
            Select at least one formula to plot a comparison curve.
          </div>
        ) : (
          <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="block h-auto w-full max-w-full" role="img" aria-label="Trigonometric formula comparison graph" data-testid="comparison-graph-svg">
            <rect width={graphWidth} height={graphHeight} fill="#020617" />
            <line x1={graphPadding.left} x2={graphWidth - graphPadding.right} y1={yForValue(0)} y2={yForValue(0)} stroke="#64748b" strokeWidth="1.5" />
            <line x1={graphPadding.left} x2={graphPadding.left} y1={graphPadding.top} y2={graphHeight - graphPadding.bottom} stroke="#64748b" strokeWidth="1.5" />
            {[0, 90, 180, 270, 360].map((degree) => (
              <g key={degree}>
                <line x1={xForDegrees(degree)} x2={xForDegrees(degree)} y1={graphPadding.top} y2={graphHeight - graphPadding.bottom} stroke="#334155" strokeDasharray="4 6" />
                <text x={xForDegrees(degree)} y={graphHeight - 12} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="800">
                  {degree} deg
                </text>
              </g>
            ))}
            {[-1, 0, 1].map((value) => (
              <text key={value} x="12" y={yForValue(value) + 4} fill="#cbd5e1" fontSize="11" fontWeight="800">
                {value}
              </text>
            ))}
            {paths.map(({ curve, path }) => (
              <path key={curve.id} d={path} fill="none" stroke={curve.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            <line x1={markerX} x2={markerX} y1={graphPadding.top} y2={graphHeight - graphPadding.bottom} stroke="#f8fafc" strokeWidth="2" />
            <circle cx={markerX} cy={yForValue(0)} r="5" fill="#f8fafc" />
          </svg>
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map(({ curve, liveValue }) => (
          <div key={curve.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{curve.label}</p>
            <p className="mt-1 font-mono text-sm font-black text-slate-950 dark:text-white">
              {liveValue === null ? "undefined" : formatTrigNumber(liveValue)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildCurvePath(curve: ComparisonCurve) {
  const points: string[] = [];

  for (let degree = 0; degree <= 360; degree += 3) {
    const value = curve.getValue(computeTrigFormulaValues(degree));
    if (value === null || Math.abs(value) > 2) {
      continue;
    }

    const command = points.length === 0 ? "M" : "L";
    points.push(`${command} ${xForDegrees(degree).toFixed(2)} ${yForValue(value).toFixed(2)}`);
  }

  return points.join(" ");
}

function xForDegrees(degrees: number) {
  return graphPadding.left + (degrees / 360) * plotWidth;
}

function yForValue(value: number) {
  const clamped = Math.max(-1.5, Math.min(1.5, value));
  return graphPadding.top + ((1.5 - clamped) / 3) * plotHeight;
}
