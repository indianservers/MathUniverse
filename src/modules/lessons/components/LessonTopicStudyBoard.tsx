import { useMemo, useState } from "react";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import { batch2StudySpecs } from "../strengthening/catalogBatch2StudySpecs";
import { batch3StudySpecs } from "../strengthening/catalogBatch3StudySpecs";
import { batch4StudySpecs } from "../strengthening/catalogBatch4StudySpecs";
import { expandedWorkedExamples } from "./LessonSectionJourney";
import "./LessonTopicStudyBoard.css";

type ChartKind = "bars" | "line" | "number-line" | "circle" | "fraction";

type StudySpec = {
  chart: ChartKind;
  chartTitle: string;
  xLabel: string;
  yLabel: string;
  seriesLabel: string;
  liveLabel: string;
  liveValue: (t: number) => string;
  bars: Array<{ label: string; value: number; color: string }>;
  points: Array<{ x: number; y: number }>;
};

const SPECS: Record<number, StudySpec> = {
  1: spec("bars", "BODMAS intermediate values", "Step", "Value", "Trace", (t) => String([20, 5][Math.round(t)] ?? 5), [
    ["(12+8)", 20, "#268ff1"],
    ["20/4", 5, "#23b56e"],
  ], [[0, 20], [1, 5]]),
  2: spec("fraction", "Equivalent fraction bars", "Part", "Size", "LCD fourths", (t) => `${2 + Math.round(t * 3)}/4`, [
    ["1/2", 2, "#22c3e6"],
    ["3/4", 3, "#8d4ce4"],
    ["5/4", 5, "#23b56e"],
  ], [[1, 2], [2, 3], [3, 5]]),
  3: spec("fraction", "Mixed-number blocks", "Units", "Count", "2 1/3 = 7/3", (t) => (t < 0.5 ? "2 + 1/3" : "7/3"), [
    ["Wholes", 2, "#268ff1"],
    ["Thirds", 1, "#eaa711"],
    ["Improper", 7, "#23b56e"],
  ], [[1, 2], [2, 1], [3, 7]]),
  4: spec("bars", "Part, percent, and base", "Quantity", "Amount", "15% of 240", (t) => String(Math.round(0.15 * (80 + t * 160))), [
    ["Percent", 15, "#eaa711"],
    ["Part", 36, "#23b56e"],
    ["Base", 240, "#268ff1"],
  ], [[0, 15], [1, 36], [2, 240]]),
  5: spec("number-line", "Double number-line ratio", "Scale", "Count", "8:12 = 2:3", (t) => `${Math.round(2 + t * 6)}:${Math.round(3 + t * 9)}`, [
    ["Left", 8, "#268ff1"],
    ["Right", 12, "#8d4ce4"],
    ["GCF", 4, "#eaa711"],
  ], [[2, 3], [4, 6], [8, 12]]),
  6: spec("bars", "Repeated-factor powers", "Exponent", "Value", "2^n", (t) => String(2 ** (1 + Math.round(t * 4))), [
    ["2^3", 8, "#268ff1"],
    ["2^4", 16, "#23b56e"],
    ["2^5", 32, "#8d4ce4"],
  ], [[3, 8], [4, 16], [5, 32]]),
  7: spec("number-line", "Scientific-notation shifts", "Place", "Value", "4.5×10^k", (t) => `4.5×10^{${Math.round(-4 + t * 8)}}`, [
    ["10^-4", 0.00045, "#268ff1"],
    ["4.5", 4.5, "#eaa711"],
    ["10^4", 45000, "#23b56e"],
  ], [[-4, 0.45], [0, 4.5], [4, 45000]]),
  8: spec("bars", "Power ladder for log_2", "Power", "Value", "2^c", (t) => String(2 ** Math.round(1 + t * 4)), [
    ["2^1", 2, "#268ff1"],
    ["2^2", 4, "#23b56e"],
    ["2^3", 8, "#8d4ce4"],
    ["2^4", 16, "#eaa711"],
  ], [[1, 2], [2, 4], [3, 8], [4, 16]]),
  9: spec("line", "Exponential growth 2^n", "n", "2^n", "Doubling", (t) => String(2 ** Math.round(t * 6)), [
    ["n=4", 16, "#268ff1"],
    ["n=5", 32, "#23b56e"],
    ["n=6", 64, "#8d4ce4"],
  ], [[0, 1], [2, 4], [4, 16], [6, 64]]),
  10: spec("circle", "Unit-circle sine and cosine", "θ", "Coordinate", "sin / cos", (t) => `sin ${Math.round(t * 90)}° = ${Math.sin((t * Math.PI) / 2).toFixed(2)}`, [
    ["sin 30°", 0.5, "#268ff1"],
    ["cos 30°", 0.87, "#23b56e"],
    ["tan 45°", 1, "#eaa711"],
  ], [[0, 0], [30, 0.5], [90, 1]]),
  11: spec("line", "Principal inverse sine", "x", "arcsin x", "Principal θ", (t) => `${Math.round(Math.asin(-1 + 2 * t) * (180 / Math.PI))}°`, [
    ["x=0", 0, "#268ff1"],
    ["x=0.5", 30, "#23b56e"],
    ["x=1", 90, "#8d4ce4"],
  ], [[-1, -90], [0, 0], [0.5, 30], [1, 90]]),
  12: spec("line", "sinh and cosh from exponentials", "x", "Value", "sinh x", (t) => sinh(t * 2 - 1).toFixed(2), [
    ["sinh 0", 0, "#268ff1"],
    ["cosh 0", 1, "#23b56e"],
    ["e^1", 2.72, "#eaa711"],
  ], [[-1, -1.18], [0, 0], [1, 1.18]]),
  13: spec("bars", "n!, nPr, and nCr for n=5, r=2", "Count type", "Count", "5 items", (t) => String([120, 20, 10][Math.round(t * 2)]), [
    ["5!", 120, "#268ff1"],
    ["5P2", 20, "#23b56e"],
    ["5C2", 10, "#8d4ce4"],
  ], [[0, 120], [1, 20], [2, 10]]),
  14: spec("number-line", "Distance from zero", "x", "|x|", "Absolute value", (t) => String(Math.abs(Math.round(-7 + t * 14))), [
    ["|-7|", 7, "#268ff1"],
    ["|0|", 0, "#eaa711"],
    ["|7|", 7, "#23b56e"],
  ], [[-7, 7], [0, 0], [7, 7]]),
  15: spec("number-line", "Rounding 22/7", "Decimal", "Place", "2 d.p.", (t) => (3.14 + t * 0.002857).toFixed(4), [
    ["Exact", 3.1429, "#268ff1"],
    ["2 d.p.", 3.14, "#23b56e"],
    ["Error", 0.0029, "#eaa711"],
  ], [[3.14, 1], [3.1429, 1]]),
  16: spec("bars", "Named constants", "Constant", "Value", "π, e, φ", (t) => [Math.PI, Math.E, 1.618][Math.round(t * 2)].toFixed(3), [
    ["π", Math.PI, "#268ff1"],
    ["e", Math.E, "#23b56e"],
    ["φ", 1.618, "#eaa711"],
  ], [[1, Math.PI], [2, Math.E], [3, 1.618]]),
  17: spec("bars", "History row results", "Row", "Result", "Recall", (t) => String([20, 5, 15][Math.round(t * 2)]), [
    ["12+8", 20, "#268ff1"],
    ["20÷4", 5, "#23b56e"],
    ["5×3", 15, "#8d4ce4"],
  ], [[1, 20], [2, 5], [3, 15]]),
  18: spec("number-line", "Exact √2 versus 1.41", "Value", "Mode", "Precision", (t) => (t < 0.5 ? "√2" : "1.41"), [
    ["Exact", Math.SQRT2, "#268ff1"],
    ["2 d.p.", 1.41, "#23b56e"],
    ["Error", Math.SQRT2 - 1.41, "#eaa711"],
  ], [[1.41, 1], [1.4142, 1]]),
  19: spec("line", "Workspace rule y = 2x + 3", "x", "y", "Substitution", (t) => String(2 * Math.round(-2 + t * 8) + 3), [
    ["x=0", 3, "#268ff1"],
    ["x=4", 11, "#23b56e"],
    ["x=7", 17, "#8d4ce4"],
  ], [[-2, -1], [0, 3], [4, 11], [7, 17]]),
  20: spec("line", "One-source variable y = 2x + 3", "x", "y", "Live y", (t) => String(2 * Math.round(-2 + t * 6) + 3), [
    ["x=-2", -1, "#268ff1"],
    ["x=1", 5, "#23b56e"],
    ["x=3", 9, "#8d4ce4"],
  ], [[-2, -1], [1, 5], [3, 9]]),
  21: spec("line", "Numeric slider y = 2x + 3", "x", "y", "Step 0.1", (t) => (2 * (2 + t) + 3).toFixed(1), [
    ["x=2.0", 7, "#268ff1"],
    ["x=2.1", 7.2, "#23b56e"],
    ["x=3.0", 9, "#8d4ce4"],
  ], [[2, 7], [2.1, 7.2], [3, 9]]),
  22: spec("bars", "Integer staircase y = 2x + 3", "x", "y", "Lattice", (t) => String(2 * Math.round(t * 3) + 3), [
    ["x=0", 3, "#268ff1"],
    ["x=1", 5, "#23b56e"],
    ["x=2", 7, "#8d4ce4"],
    ["x=3", 9, "#eaa711"],
  ], [[0, 3], [1, 5], [2, 7], [3, 9]]),
  23: spec("circle", "Angle slider on the unit circle", "θ", "sin θ", "Degrees", (t) => `${Math.round(t * 360)}°`, [
    ["0°", 0, "#268ff1"],
    ["90°", 1, "#23b56e"],
    ["180°", 0, "#eaa711"],
  ], [[0, 0], [90, 1], [180, 0], [270, -1]]),
  24: spec("bars", "Animation frames 1 to 9 by 2", "Frame", "x", "Playhead", (t) => String(1 + 2 * Math.round(t * 4)), [
    ["F0", 1, "#268ff1"],
    ["F2", 5, "#23b56e"],
    ["F4", 9, "#8d4ce4"],
  ], [[0, 1], [2, 5], [4, 9]]),
  25: spec("line", "Parent points and midpoint", "x", "y", "Midpoint", (t) => `(${(t * 4).toFixed(1)}, ${(t * 2).toFixed(1)})`, [
    ["A", 0, "#268ff1"],
    ["M", 2, "#23b56e"],
    ["B", 4, "#8d4ce4"],
  ], [[0, 0], [2, 1], [4, 2]]),
  26: spec("number-line", "Visibility region x > 2", "x", "Visible", "Test point", (t) => ( -1 + t * 8 > 2 ? "visible" : "hidden"), [
    ["Hidden", 2, "#eaa711"],
    ["Open end", 2, "#268ff1"],
    ["Visible", 5, "#23b56e"],
  ], [[-1, 0], [2, 0], [5, 1]]),
  27: spec("line", "Dynamic label distance", "x", "r", "√(x²+y²)", (t) => String(5 * (1 + t)), [
    ["(3,4)", 5, "#268ff1"],
    ["(6,8)", 10, "#23b56e"],
  ], [[3, 5], [6, 10]]),
  28: spec("line", "f(x) = x² − 4", "x", "f(x)", "Sample", (t) => String(((-3 + t * 6) ** 2 - 4).toFixed(1)), [
    ["Roots", 0, "#268ff1"],
    ["Vertex", -4, "#23b56e"],
    ["f(3)", 5, "#8d4ce4"],
  ], [[-2, 0], [0, -4], [2, 0], [3, 5]]),
  29: spec("bars", "Old rule versus new rule at x=4", "Rule", "y", "Redefine", (t) => (t < 0.5 ? "9" : "10"), [
    ["2x+1", 9, "#268ff1"],
    ["3x−2", 10, "#23b56e"],
    ["Δy", 1, "#eaa711"],
  ], [[0, 9], [1, 10]]),
  30: spec("line", "Balance 2x + 3 = 11", "x", "Side", "Intersection", (t) => String(2 * (1 + t * 5) + 3), [
    ["Left at 4", 11, "#268ff1"],
    ["Right", 11, "#23b56e"],
    ["x", 4, "#eaa711"],
  ], [[0, 3], [4, 11], [6, 15]]),
  ...batch2StudySpecs,
  ...batch3StudySpecs,
  ...batch4StudySpecs,
};

function spec(
  chart: ChartKind,
  chartTitle: string,
  xLabel: string,
  yLabel: string,
  seriesLabel: string,
  liveValue: (t: number) => string,
  bars: Array<[string, number, string]>,
  points: Array<[number, number]>,
): StudySpec {
  return {
    chart,
    chartTitle,
    xLabel,
    yLabel,
    seriesLabel,
    liveLabel: seriesLabel,
    liveValue,
    bars: bars.map(([label, value, color]) => ({ label, value, color })),
    points: points.map(([x, y]) => ({ x, y })),
  };
}

function sinh(x: number) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

function isStudyView(view: string | number | undefined) {
  if (view === undefined) return false;
  if (typeof view === "number") return view > 0;
  const label = String(view).toLowerCase();
  return !/^(interaction|interact|interactive|0)\b/.test(label);
}

export function LessonTopicStudyBoard({
  lessonId,
  view,
  onInteraction,
  alwaysVisible = false,
}: {
  lessonId: number;
  view?: string | number;
  onInteraction?: () => void;
  alwaysVisible?: boolean;
}) {
  const [probe, setProbe] = useState(0.35);
  const lesson = getStrengthenedFoundationLesson(lessonId);
  const specData = SPECS[lessonId];
  const examples = useMemo(
    () => (lesson ? expandedWorkedExamples(lesson) : []),
    [lesson],
  );
  if (!lesson || !specData || (!alwaysVisible && !isStudyView(view))) return null;
  const maxBar = Math.max(...specData.bars.map((bar) => Math.abs(bar.value)), 1);
  return (
    <section
      className="lesson-topic-study-board"
      data-testid={`lesson-study-board-${lessonId}`}
      data-lesson-study-board={lessonId}
      aria-label={`${lesson.title} labelled study board`}
    >
      <header>
        <p>Topic study</p>
        <h2>{lesson.title} labelled charts and numerical examples</h2>
        <p>{lesson.introduction}</p>
      </header>
      <div className="lesson-topic-study-grid">
        <article className="lesson-topic-chart-card">
          <h3>{specData.chartTitle}</h3>
          <p className="lesson-topic-axis">
            <span>x: {specData.xLabel}</span>
            <span>y: {specData.yLabel}</span>
            <span>series: {specData.seriesLabel}</span>
          </p>
          {specData.chart === "circle" ? (
            <CircleChart probe={probe} />
          ) : specData.chart === "line" || specData.chart === "number-line" ? (
            <LineChart points={specData.points} xLabel={specData.xLabel} yLabel={specData.yLabel} />
          ) : (
            <ul className="lesson-topic-bars">
              {specData.bars.map((bar) => (
                <li key={bar.label}>
                  <span>{bar.label}</span>
                  <i style={{ width: `${(Math.abs(bar.value) / maxBar) * 100}%`, background: bar.color }} />
                  <b>{formatNumber(bar.value)}</b>
                </li>
              ))}
            </ul>
          )}
          <label>
            Interactive probe
            <input
              aria-label={`${lesson.title} study probe`}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={probe}
              onChange={(event) => {
                setProbe(Number(event.target.value));
                onInteraction?.();
              }}
            />
            <output>
              {specData.liveLabel} = {specData.liveValue(probe)}
            </output>
          </label>
        </article>
        <article>
          <h3>Numerical examples</h3>
          <ol>
            {examples.map((example) => (
              <li key={example.id}>
                <strong>{example.prompt}</strong>
                <ol>
                  {example.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p>
                  Answer: <b>{example.answer}</b>
                </p>
              </li>
            ))}
          </ol>
        </article>
        <article>
          <h3>Labels and formulas</h3>
          <p>
            <b>Definition.</b> {lesson.definitions[0]?.statement}
          </p>
          <ul>
            {lesson.formulas.slice(0, 2).map((formula) => (
              <li key={formula.id}>
                <b>{formula.label}:</b> {formula.expression}
              </li>
            ))}
          </ul>
          <p>
            <b>How it works.</b> {lesson.howItWorks}
          </p>
        </article>
      </div>
    </section>
  );
}

function LineChart({
  points,
  xLabel,
  yLabel,
}: {
  points: Array<{ x: number; y: number }>;
  xLabel: string;
  yLabel: string;
}) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const sx = (x: number) => 24 + ((x - xMin) / (xMax - xMin || 1)) * 260;
  const sy = (y: number) => 110 - ((y - yMin) / (yMax - yMin || 1)) * 88;
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"}${sx(point.x)},${sy(point.y)}`).join(" ");
  return (
    <svg viewBox="0 0 300 140" role="img" aria-label={`${yLabel} versus ${xLabel}`}>
      <line x1="24" y1="118" x2="290" y2="118" stroke="#94a3b8" />
      <line x1="24" y1="16" x2="24" y2="118" stroke="#94a3b8" />
      <text x="150" y="136" textAnchor="middle" fontSize="11">
        {xLabel}
      </text>
      <text x="12" y="14" fontSize="11">
        {yLabel}
      </text>
      <path d={d} fill="none" stroke="#268ff1" strokeWidth="3" />
      {points.map((point) => (
        <g key={`${point.x}-${point.y}`}>
          <circle cx={sx(point.x)} cy={sy(point.y)} r="4" fill="#0f172a" />
          <text x={sx(point.x)} y={sy(point.y) - 8} textAnchor="middle" fontSize="10">
            ({formatNumber(point.x)}, {formatNumber(point.y)})
          </text>
        </g>
      ))}
    </svg>
  );
}

function CircleChart({ probe }: { probe: number }) {
  const angle = probe * 2 * Math.PI;
  const x = 70 + 48 * Math.cos(angle);
  const y = 70 - 48 * Math.sin(angle);
  return (
    <svg viewBox="0 0 160 140" role="img" aria-label="Unit circle with angle probe">
      <circle cx="70" cy="70" r="48" fill="none" stroke="#94a3b8" />
      <line x1="22" y1="70" x2="118" y2="70" stroke="#cbd5e1" />
      <line x1="70" y1="22" x2="70" y2="118" stroke="#cbd5e1" />
      <text x="122" y="74" fontSize="10">
        cos
      </text>
      <text x="74" y="18" fontSize="10">
        sin
      </text>
      <line x1="70" y1="70" x2={x} y2={y} stroke="#268ff1" strokeWidth="3" />
      <circle cx={x} cy={y} r="4" fill="#0f172a" />
    </svg>
  );
}

function formatNumber(value: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(Math.abs(value) >= 10 ? 2 : 4).replace(/0+$/, "").replace(/\.$/, "");
}
