import { ArrowLeft, Check, CircleHelp, Dice5, RotateCcw, ZoomIn, ZoomOut, Ban } from "lucide-react";
import { Fragment, useId, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { analyzeConsistency as analyze, reduceConsistency, equationGeometry, consistencyGeometryMessage } from "./linearSystemConsistencyModel";
import "./LinearSystemConsistencyTargetLesson10199.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

type LinearSystem = [number, number, number, number, number, number];
type SolutionCase = "unique" | "none" | "infinite";
const PRESETS: Record<SolutionCase, LinearSystem> = {
  unique: [15, 1, 2, 2, 2, 4],
  none: [1, 1, 2, 2, 2, 5],
  infinite: [1, 1, 2, 2, 2, 4],
};
const CASE_LABELS = { unique: "Unique", none: "No solution", infinite: "Infinite" };
const formatNumber = (value: number | null) =>
  value === null
    ? "—"
    : Number.isInteger(value)
      ? String(value)
      : Number(value.toFixed(2)).toString();

function equationLabel(a: number, b: number, c: number) {
  const terms: string[] = [];
  for (const [coefficient, variable] of [[a, "x"], [b, "y"]] as const) {
    if (coefficient === 0) continue;
    const magnitude = Math.abs(coefficient);
    const term = `${magnitude === 1 ? "" : magnitude}${variable}`;
    terms.push(`${terms.length ? (coefficient < 0 ? " − " : " + ") : coefficient < 0 ? "−" : ""}${term}`);
  }
  return `${terms.join("") || "0"} = ${c}`;
}

function StepTitle({
  number,
  title,
  copy,
}: {
  number: number;
  title: string;
  copy: string;
}) {
  return (
    <header className="lsc-step-title">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </header>
  );
}

function Matrix({
  system,
  echelon = false,
}: {
  system: LinearSystem;
  echelon?: boolean;
}) {
  const [a, b, c, d, e, f] = system;
  const values = echelon
    ? reduceConsistency(system).values
    : [a, b, c, d, e, f];
  return (
    <div
      className="lsc-matrix"
      aria-label={echelon ? "row echelon matrix" : "augmented matrix"}
    >
      {values.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </div>
  );
}

function SystemGraph({
  system,
  compact = false,
}: {
  system: LinearSystem;
  compact?: boolean;
}) {
  const result = analyze(system);
  const [zoom, setZoom] = useState(1);
  const [a, b, c, d, e, f] = system;
  const scale = 20 * zoom;
  const map = (x: number, y: number) => [150 + x * scale, 117 - y * scale];
  const extent = Math.ceil(150 / scale) + 1;
  const ticks = Array.from({ length: extent * 2 + 1 }, (_, index) => index - extent);
  const first = equationGeometry(a, b, c, extent);
  const second = equationGeometry(d, e, f, extent);
  const clipId = useId();
  return (
    <div className={`lsc-graph-wrap ${result.type} ${compact ? "compact" : ""}`}>
      <svg
        className={`lsc-graph ${result.type}`}
        viewBox="0 0 300 235"
        role="img"
        aria-label={`${CASE_LABELS[result.type]} linear system graph`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="1" y="1" width="298" height="233" rx="4" />
          </clipPath>
        </defs>
        {ticks.map((n) => (
          <Fragment key={n}>
            <line
              className="grid-line"
              x1={150 + n * scale}
              y1="0"
              x2={150 + n * scale}
              y2="235"
            />
            <line
              className="grid-line"
              x1="0"
              y1={117 - n * scale}
              x2="300"
              y2={117 - n * scale}
            />
          </Fragment>
        ))}
        <g clipPath={`url(#${clipId})`}>
          <line className="axis" x1="0" y1="117" x2="300" y2="117" />
          <line className="axis" x1="150" y1="0" x2="150" y2="235" />
          {ticks.filter(n => n !== 0).map(n => (
            <Fragment key={n}>
              <line className="axis" x1={map(n, 0)[0]} x2={map(n, 0)[0]} y1="114" y2="120" />
              <text className="tick-label" textAnchor="middle" x={map(n, 0)[0]} y="130">{n}</text>
              <line className="axis" x1="147" x2="153" y1={map(0, n)[1]} y2={map(0, n)[1]} />
              <text className="tick-label" textAnchor="end" x="142" y={map(0, n)[1] + 3}>{n}</text>
            </Fragment>
          ))}
          {[first, second].map((geometry, index) => {
            if (!geometry.endpoints) return null;
            const [x1, y1, x2, y2] = geometry.endpoints;
            const start = map(x1, y1), end = map(x2, y2);
            return <line key={index} className={index === 0 ? "line-one" : "line-two"} x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} />;
          })}
          {result.type === "unique" &&
            result.x !== null &&
            result.y !== null && (
              <>
                <circle
                  cx={map(result.x, result.y)[0]}
                  cy={map(result.x, result.y)[1]}
                  r="4.5"
                />
                  <text
                    x={map(result.x, result.y)[0] + 9}
                    y={map(result.x, result.y)[1] - 9}
                  >
                    ({formatNumber(result.x)}, {formatNumber(result.y)})
                  </text>
              </>
            )}
        </g>
          <>
            <text className="axis-label" x="286" y="110">
              x
            </text>
            <text className="axis-label" x="157" y="13">
              y
            </text>
          </>
      </svg>
      {(first.kind !== "line" || second.kind !== "line") && <p role="status">{consistencyGeometryMessage(system)}</p>}
      {!compact && (
        <div className="lsc-graph-controls" aria-label="Graph controls">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
          >
            <ZoomIn />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(0.6, value - 0.2))}
          >
            <ZoomOut />
          </button>
          <button
            type="button"
            aria-label="Reset graph view"
            onClick={() => setZoom(1)}
          >
            <RotateCcw />
          </button>
        </div>
      )}
        <div className="lsc-legend" aria-label="Equation legend">
          <span title={equationLabel(a, b, c)}>
            <i />
            Equation 1
          </span>
          <span title={equationLabel(d, e, f)}>
            <i />
            Equation 2
          </span>
          <span className="lsc-legend-kind">{first.kind === "line" && second.kind === "line" ? result.type === "unique" ? "Intersection" : result.type === "none" ? "Parallel lines" : "Coincident lines" : "Degenerate equation"}</span>
        </div>
    </div>
  );
}

function EquationRow({
  system,
  start,
  onChange,
}: {
  system: LinearSystem;
  start: 0 | 3;
  onChange: (index: number, value: number) => void;
}) {
  return (
    <div className="lsc-equation-row">
      <input
        type="number"
        aria-label={`Equation ${start ? 2 : 1} x coefficient`}
        value={system[start]}
        onChange={(e) => onChange(start, Number(e.target.value))}
      />
      <span>x</span>
      <b>+</b>
      <input
        type="number"
        aria-label={`Equation ${start ? 2 : 1} y coefficient`}
        value={system[start + 1]}
        onChange={(e) => onChange(start + 1, Number(e.target.value))}
      />
      <span>y</span>
      <b>=</b>
      <input
        type="number"
        aria-label={`Equation ${start ? 2 : 1} constant`}
        value={system[start + 2]}
        onChange={(e) => onChange(start + 2, Number(e.target.value))}
      />
    </div>
  );
}


function ResultCard({ result }: { result: ReturnType<typeof analyze> }) {
  return <section className={`lsc-result-card ${result.type}`} aria-live="polite">
    <small>ROUCHÉ–CAPELLI TEST</small>
    <div className="lsc-result-heading">
      <span>{result.type === "none" ? <Ban /> : <Check />}</span>
      <h3>{result.type === "unique" ? "Unique solution" : result.type === "none" ? "No solution" : "Infinitely many solutions"}</h3>
    </div>
    <p>rank(A) {result.rankA === result.rankAugmented ? "=" : "≠"} rank([A|B]) = {result.rankAugmented}</p>
    <p>{result.type === "unique" ? "The common rank equals the number of unknowns." : result.type === "none" ? "The ranks differ, so the system is inconsistent." : "The common rank is below the number of unknowns."}</p>
    {result.type === "unique" && <div className="lsc-solution-values">
      <span><i>x</i> = {formatNumber(result.x)}</span>
      <span><i>y</i> = {formatNumber(result.y)}</span>
    </div>}
  </section>;
}

export default function LinearSystemConsistencyTargetLesson10199({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [system, setSystem] = useState<LinearSystem>(PRESETS.unique);
  const [showHow, setShowHow] = useState(false);
  const result = analyze(system);
  const setValue = (index: number, value: number) => {
    if (!Number.isFinite(value)) return;
    setSystem(previous => previous.map((entry, position) => position === index ? value : entry) as LinearSystem);
  };
  const applyPreset = (type: SolutionCase) => setSystem([...PRESETS[type]]);
  const randomize = () => setSystem(Array.from({length: 6}, () => Math.floor(Math.random() * 11) - 5) as LinearSystem);
  const presets = (className: string) => <div className={className} aria-label="Solution presets">
    {(["unique", "none", "infinite"] as SolutionCase[]).map(type => <button type="button" key={type}
      className={`${type} ${result.type === type ? "active" : ""}`}
      aria-pressed={result.type === type} onClick={() => applyPreset(type)}>{CASE_LABELS[type]}</button>)}
      <LessonTopicStudyBoard lessonId={10199} alwaysVisible />

  </div>;
  const fallback = PRESETS.none;
  const fallbackResult = analyze(fallback);
  return <main className="lsc10199-page" data-testid="school-mockup-0873"
    data-object-model="dedicated-rouche-capelli-rank-engine" data-case={result.type}
    data-rank-a={result.rankA} data-rank-augmented={result.rankAugmented}>
    <header className="lsc-topbar">
      <Link to="/lessons/school/class-12" aria-label="Back to Class 12 lessons"><ArrowLeft /></Link>
      <div className="lsc-title"><h1>{lesson.title}</h1>
        <p>See how equations, ranks, and geometry reveal whether a system has one, none, or infinitely many solutions.</p>
      </div>
      <div className="lsc-top-actions">
        <div className="lsc-how-wrap"><button type="button" className="lsc-how-button" aria-expanded={showHow} onClick={() => setShowHow(value => !value)}><CircleHelp />How it works</button>
          {showHow && <aside>Equal ranks mean the system is consistent. A common rank of two gives a unique solution; a smaller common rank gives infinitely many solutions. Different ranks mean no solution.</aside>}
        </div>
        {presets("lsc-case-switch")}
      </div>
    </header>
    <section className="lsc-workspace">
      <article className="lsc-panel lsc-build-panel">
        <StepTitle number={1} title="Build the system" copy="Choose a preset or edit the equations." />
        <div className="lsc-field-label">Presets</div>
        {presets("lsc-preset-row")}
        <EquationRow system={system} start={0} onChange={setValue} />
        <EquationRow system={system} start={3} onChange={setValue} />
        <div className="lsc-unknowns">Unknowns <output aria-label="Number of unknowns">2</output></div>
        <div className="lsc-slider-block">
          <div><strong>Explore b<sub>2</sub></strong><span>Current value: {system[5]}</span></div>
          <div className="lsc-range-row"><span>{Math.min(2, system[5])}</span>
            <div className="lsc-range-track">
            <output style={{ left: `${100 * (system[5] - Math.min(2, system[5])) / (Math.max(6, system[5]) - Math.min(2, system[5]))}%` }}>{formatNumber(system[5])}</output>
            <input type="range" min={Math.min(2, system[5])} max={Math.max(6, system[5])} step="0.1"
              value={system[5]} aria-label="Explore second equation constant" onChange={event => setValue(5, Number(event.target.value))} />
            </div>
            <span>{Math.max(6, system[5])}</span>
          </div>
        </div>
        <footer className="lsc-build-actions">
          <button type="button" onClick={() => applyPreset("unique")}><RotateCcw />Reset</button>
          <button type="button" className="primary" onClick={randomize}><Dice5 />Try random system</button>
        </footer>
      </article>
      <article className="lsc-panel lsc-geometry-panel">
        <StepTitle number={2} title="Watch the geometry" copy="See the system as lines in the plane." />
        <SystemGraph system={system} />
        <div className={`lsc-geometry-message ${result.type}`}>{result.type === "none" ? <Ban /> : <Check />}{consistencyGeometryMessage(system)}</div>
      </article>
      <article className="lsc-panel lsc-reduction-panel">
        <StepTitle number={3} title="Row reduction" copy="Row-reduce the augmented matrix." />
        <div className="lsc-row-reduction">
          <div><b>Augmented matrix [A|b]</b><Matrix system={system} /></div>
          <div className="lsc-operation"><b>Row operation</b><span>{reduceConsistency(system).operation}</span><strong>→</strong></div>
          <div><b>Row-echelon form</b><Matrix system={system} echelon /></div>
        </div>
        <div className="lsc-rank-badges"><span>rank(A) = {result.rankA}</span><span>rank([A|B]) = {result.rankAugmented}</span></div>
        <ResultCard result={result} />
      </article>
    </section>
    <section className="lsc-change-strip" aria-label="Inconsistent system worked example">
      <div className="lsc-change-intro"><h2>What changes when b<sub>2</sub> = 5?</h2></div>
      <div className="lsc-mini-system"><b>System</b><span>1x + 1y = 2</span><span>2x + 2y = 5 (b<sub>2</sub> = 5)</span></div>
      <SystemGraph system={fallback} compact />
      <div className="lsc-mini-ranks"><span>rank(A) = {fallbackResult.rankA}</span><span>rank([A|B]) = {fallbackResult.rankAugmented}</span></div>
      <div className="lsc-none-badge"><strong><Ban />No solution</strong><span>Parallel lines never meet.</span></div>
    </section>
  </main>;
}
