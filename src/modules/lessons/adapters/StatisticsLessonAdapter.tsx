import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { linearRegression, type ResultTableRow } from "../../../components/workspace/panels/graphPanelUtils";
import { mean, median, mode, range } from "../../../utils/mathEngine/statisticsUtils";
import { createStatisticsWorkspaceObject } from "../../../workspace/dataWorkspaceIntegration";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { BoxPlotActivity } from "./p0/PriorityConceptActivities";

const baseValues = [2, 3, 4, 4, 5, 6, 7, 8];

function statisticsGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("data types")) return ["Data Types", "Classify data before choosing a graph.", "Categories, counts, and measurements need different tools."];
  if (name === "frequency tables") return ["Frequency Tables", "Tally every value once.", "Do not double-count observations."];
  if (name.includes("grouped frequency")) return ["Grouped Frequency Tables", "Use non-overlapping intervals.", "Each value belongs in one class only."];
  if (name === "mean") return ["Mean", "Add values and divide by the count.", "Outliers can pull the mean."];
  if (name === "median") return ["Median", "Sort first, then find the middle.", "The median splits ordered data in half."];
  if (name === "mode") return ["Mode", "Find the most frequent value.", "There can be no mode or more than one mode."];
  if (name.includes("weighted mean")) return ["Weighted Mean", "Multiply by weights before averaging.", "Divide by the total weight."];
  if (name === "range") return ["Range", "Subtract minimum from maximum.", "Range uses only the two end values."];
  if (name.includes("quartiles")) return ["Quartiles and IQR", "Order data, find Q1 and Q3.", "IQR is Q3 minus Q1."];
  if (name.includes("variance")) return ["Variance and Standard Deviation", "Measure spread around the mean.", "Standard deviation is in original units."];
  if (name.includes("percentiles")) return ["Percentiles", "Percentiles compare ordered positions.", "The 80th percentile is not always score 80."];
  if (name.includes("z-scores")) return ["Z-Scores", "Count standard deviations from the mean.", "Positive is above the mean."];
  if (name.includes("outliers")) return ["Outliers", "Check unusual values before removing them.", "They may be errors or real extremes."];
  if (name.includes("dot plot")) return ["Dot Plot", "Place one dot for each value.", "Stack repeated values."];
  if (name.includes("stem-and-leaf")) return ["Stem-and-Leaf Plot", "Split stems and leaves by place value.", "Sort leaves inside each stem."];
  if (name.includes("histogram")) return ["Histogram", "Use intervals with touching bars.", "Histograms show numerical distributions."];
  if (name.includes("frequency polygon")) return ["Frequency Polygon", "Plot class midpoints against frequency.", "Join the midpoint points."];
  if (name.includes("cumulative frequency")) return ["Cumulative Frequency Curve", "Plot running totals.", "Use cumulative counts, not raw frequencies."];
  if (name.includes("bar and pie")) return ["Bar and Pie Charts", "Bars compare categories; pies show parts of a whole.", "Pie slices need one meaningful total."];
  if (name.includes("scatter plot")) return ["Scatter Plot", "Plot paired numerical values.", "Look for direction, form, and strength."];
  if (name.includes("time-series")) return ["Time-Series Plot", "Put time on the horizontal axis.", "Keep values in time order."];
  if (name.includes("correlation coefficient")) return ["Correlation Coefficient", "r measures linear association.", "Correlation does not prove cause."];
  if (name.includes("linear regression")) return ["Linear Regression", "Fit a straight line to paired data.", "Check residuals and avoid far extrapolation."];
  if (name.includes("polynomial regression")) return ["Polynomial Regression", "Use the simplest useful curve.", "High degree can overfit."];
  if (name.includes("exponential regression")) return ["Exponential Regression", "Use for repeated multiplying change.", "Check that ratios are roughly steady."];
  if (name.includes("logarithmic regression")) return ["Logarithmic Regression", "Use positive x-values and slowing growth.", "Check residuals before trusting the curve."];
  if (name.includes("power regression")) return ["Power Regression", "Use y = ax^b when the variable is the base.", "Do not confuse it with exponential regression."];
  if (name.includes("logistic regression")) return ["Logistic Regression", "Use an S-shaped model with an upper limit.", "The context needs a sensible maximum."];
  if (name.includes("sinusoidal regression")) return ["Sinusoidal Regression", "Use a repeating wave model.", "Check that the data has a real cycle."];
  if (name.includes("residual plot")) return ["Residual Plot", "Plot observed minus predicted values.", "A clear pattern suggests a poor model."];
  if (name.includes("model comparison")) return ["Model Comparison", "Compare residuals, error, simplicity, and context.", "Smallest error alone is not enough."];
  if (name.includes("interpolation")) return ["Interpolation and Extrapolation", "Inside the data range is interpolation.", "Far outside predictions are less reliable."];
  return ["Statistics", "Read the data, choose the matching summary, and check context.", "One graph or number may not answer every question."];
}

export default function StatisticsLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.preset.id === "statistics.box-plot") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} - five-number-summary lab`}
        footer="Quartiles, whiskers, and outliers use the standard 1.5 x IQR rule and update from the editable sample."
      >
        <BoxPlotActivity {...props} />
      </AdapterFrame>
    );
  }
  return <LegacyStatisticsLessonAdapter {...props} />;
}

function LegacyStatisticsLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [shift, setShift] = useState(0);
  const [outlier, setOutlier] = useState(10);
  useEffect(() => {
    setShift(0);
    setOutlier(10);
  }, [resetToken]);
  const values = useMemo(() => [...baseValues.map((value) => value + shift), outlier], [outlier, shift]);
  const points = useMemo<ResultTableRow[]>(() => values.map((value, index) => ({ x: index + 1, y: value })), [values]);
  const fit = useMemo(() => linearRegression(points), [points]);
  const linked = useMemo(() => createStatisticsWorkspaceObject(values, { id: `lesson-statistics-${lesson.id}` }), [lesson.id, values]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const sx = (x: number) => 35 + ((x - 1) / Math.max(1, points.length - 1)) * 570;
  const sy = (y: number) => 320 - ((y - min) / Math.max(1, max - min)) * 270;
  const regressionY = (x: number) => fit.slope * x + fit.intercept;
  const guidance = statisticsGuidanceFor(lesson.title);
  const change = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };

  return (
    <AdapterFrame
      title={`${lesson.title} - data + graph`}
      value={linked.value}
      footer="The editable sample publishes to the shared statistics object and the graph uses the existing least-squares engine."
    >
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg viewBox="0 0 640 350" className="h-[300px] w-full" role="img" aria-label="Linked statistical plot">
            <line x1="30" x2="620" y1="320" y2="320" stroke="#64748b" />
            <line x1="30" x2="30" y1="20" y2="320" stroke="#64748b" />
            <line x1={sx(1)} y1={sy(regressionY(1))} x2={sx(points.length)} y2={sy(regressionY(points.length))} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 5" />
            {points.map((point, index) => (
              <g key={index}>
                <line x1={sx(point.x)} x2={sx(point.x)} y1="320" y2={sy(point.y)} stroke="#06b6d4" strokeWidth="12" opacity=".18" />
                <circle cx={sx(point.x)} cy={sy(point.y)} r="7" fill="#0891b2" />
              </g>
            ))}
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderControl density="compact" label="Shift sample" value={shift} min={-3} max={3} step={1} onChange={change(setShift)} />
          <SliderControl density="compact" label="Outlier" value={outlier} min={-5} max={25} step={1} onChange={change(setOutlier)} />
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Mean" value={mean(values).toFixed(2)} />
            <Metric label="Median" value={median(values).toFixed(2)} />
            <Metric label="Mode" value={mode(values).toFixed(2)} />
            <Metric label="Range" value={range(values).toFixed(2)} />
            <Metric label="Slope" value={fit.slope.toFixed(2)} />
            <Metric label="n" value={String(values.length)} />
          </div>
          <p className="rounded-xl bg-slate-100 p-2 font-mono text-xs dark:bg-white/10">{values.join(", ")}</p>
        </div>
      </div>
    </AdapterFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10">
      <span className="block text-[10px] font-bold text-slate-500">{label}</span>
      <strong className="font-mono text-sm">{value}</strong>
    </div>
  );
}
