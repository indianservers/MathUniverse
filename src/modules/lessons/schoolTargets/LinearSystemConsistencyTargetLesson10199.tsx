import { ArrowLeft, Check, CircleHelp, Dice5, RotateCcw, ZoomIn, ZoomOut, Ban } from "lucide-react";
import { Fragment, useId, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { analyzeConsistency as analyze, reduceConsistency, equationGeometry, consistencyGeometryMessage } from "./linearSystemConsistencyModel";
import "./LinearSystemConsistencyTargetLesson10199.css";
import MathExpression from "../../../components/ui/MathExpression";
import LessonMockupFooter from "../components/LessonMockupFooter";
import "../components/LessonMockupReference.css";

type LinearSystem = [number, number, number, number, number, number];
type SolutionCase = "unique" | "none" | "infinite";
const PRESETS: Record<SolutionCase, LinearSystem> = {
  unique: [2, 1, 5, 1, -1, 1],
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
        <span key={index} className={echelon&&index>=3&&values.slice(3).every(v=>v===0)?"lsc-zero-row":echelon&&index===5&&values[3]===0&&values[4]===0&&value!==0?"lsc-contradiction":""}>{formatNumber(value)}</span>
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
  const scale = 28 * zoom;
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
            {equationLabel(a,b,c)}
          </span>
          <span title={equationLabel(d, e, f)}>
            <i />
            {equationLabel(d,e,f)}
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
    <p>Comparison: rank(A) = {result.rankA} {result.rankA === result.rankAugmented ? "=" : "≠"} rank([A|B]) = {result.rankAugmented}</p>
    <p>{result.type === "unique" ? "The common rank equals the number of unknowns." : result.type === "none" ? "The ranks differ, so the system is inconsistent." : "The common rank is below the number of unknowns."}</p>
    {result.type === "unique" && <div className="lsc-solution-values">
      <span><i>x</i> = {formatNumber(result.x)}</span>
      <span><i>y</i> = {formatNumber(result.y)}</span>
    </div>}
  </section>;
}

function Reduction({system}:{system:LinearSystem}) {
 const result=analyze(system);
 return <><div className="lsc-row-reduction"><div><b>Augmented matrix [A | b]</b><Matrix system={system}/></div><div className="lsc-operation"><b>Row operations</b><span>{reduceConsistency(system).operation}</span></div><div><b>Row-echelon form</b><Matrix system={system} echelon/></div><div><b>Coefficient matrix A</b><div className="lsc-coefficient-matrix">{[system[0],system[1],system[3],system[4]].map((v,i)=><span key={i}>{formatNumber(v)}</span>)}</div></div><div className="lsc-rank-cell">rank(A) = {result.rankA}</div><div className="lsc-rank-cell">rank([A | b]) = {result.rankAugmented}</div></div><ResultCard result={result}/></>;
}
function WorkedCase({system,title}:{system:LinearSystem;title:string}) {const result=analyze(system);return <section className={`lsc-worked-case ${result.type}`} aria-label={result.type==="none"?"Inconsistent system worked example":"Unique system worked example"}><div><h2>{title}</h2><div className="lsc-worked-system"><strong>System</strong><MathExpression value={equationLabel(...system.slice(0,3) as [number,number,number])}/><MathExpression value={equationLabel(...system.slice(3,6) as [number,number,number])}/></div><Reduction system={system}/></div><div><h3>Lines in the plane</h3><SystemGraph system={system} compact/><p>{consistencyGeometryMessage(system)}</p></div></section>;}
const PRACTICE:LinearSystem[]=[[1,1,3,2,2,6],[1,2,1,2,4,2],[3,-1,7,1,1,1]];
function ConsistencyPractice(){const [answers,setAnswers]=useState(["","",""]),[checked,setChecked]=useState(false),[reveal,setReveal]=useState(false);return <section className="lsc-practice" aria-label="Consistency practice"><div><h2>PRACTICE</h2><p>Classify each system.</p><div className="lsc-practice-systems">{PRACTICE.map((system,i)=><article key={i}><b>{i+1}</b><MathExpression value={equationLabel(...system.slice(0,3) as [number,number,number])}/><MathExpression value={equationLabel(...system.slice(3,6) as [number,number,number])}/><select aria-label={`Practice system ${i+1} classification`} value={answers[i]} onChange={e=>{setAnswers(a=>a.map((v,j)=>i===j?e.target.value:v));setChecked(false);}}><option value="">Choose classification</option><option value="infinite">Infinitely many solutions</option><option value="none">No solution</option><option value="unique">Unique solution</option></select>{checked&&<p className={answers[i]===analyze(system).type?"correct":"incorrect"}>{answers[i]===analyze(system).type?"Correct":"Try again"}</p>}</article>)}</div><button onClick={()=>setChecked(true)}>Check answers</button></div><aside><button aria-expanded={reveal} onClick={()=>setReveal(v=>!v)}>Answers (click to {reveal?"hide":"reveal"})</button>{reveal&&<ol><li>Infinitely many solutions</li><li>Infinitely many solutions</li><li>Unique solution: x = 2, y = −1</li></ol>}</aside><aside><h3>Try it</h3><p>Edit the system above, row-reduce, and observe how ranks and geometry change!</p></aside></section>;}
export default function LinearSystemConsistencyTargetLesson10199({lesson}:{lesson:SchoolSyllabusLesson}) {
 const [system,setSystem]=useState<LinearSystem>([...PRESETS.infinite]),[showHow,setShowHow]=useState(false);
 const result=analyze(system);
 const setValue=(index:number,value:number)=>{if(Number.isFinite(value))setSystem(previous=>previous.map((v,i)=>i===index?value:v) as LinearSystem);};
 const applyPreset=(type:SolutionCase)=>setSystem([...PRESETS[type]]);
 return <main className="lsc10199-page lesson-reference" data-testid="school-mockup-0873" data-object-model="dedicated-rouche-capelli-rank-engine" data-case={result.type} data-rank-a={result.rankA} data-rank-augmented={result.rankAugmented}>
 <header className="lsc-topbar"><div className="lsc-title"><h1>{lesson.title}</h1><p>Explore consistency using ranks (Rouché–Capelli Theorem): compare rank(A) and rank([A|b]).<br/>Edit any system, row-reduce, and see geometry and solution classification in real time.</p></div><div className="lsc-how-wrap"><button className="lsc-how-button" aria-expanded={showHow} onClick={()=>setShowHow(v=>!v)}><CircleHelp/>How it works</button>{showHow&&<aside>Equal ranks mean the system is consistent. Rank two gives a unique solution; a smaller common rank gives infinitely many solutions. Different ranks mean no solution.</aside>}</div></header>
 <section className="lsc-editor"><StepTitle number={1} title="EDIT THE SYSTEM" copy=""/><div className="lsc-editor-grid"><div><h3>Presets</h3><div className="lsc-preset-row">{(["infinite","none","unique"] as SolutionCase[]).map(type=><button key={type} className={type} aria-pressed={system.every((v,i)=>v===PRESETS[type][i])} onClick={()=>applyPreset(type)}><strong>{CASE_LABELS[type]}</strong><span>{equationLabel(...PRESETS[type].slice(0,3) as [number,number,number])}, {equationLabel(...PRESETS[type].slice(3,6) as [number,number,number])}</span></button>)}</div></div><div className="lsc-equations"><h3>System Ax = b</h3><EquationRow system={system} start={0} onChange={setValue}/><EquationRow system={system} start={3} onChange={setValue}/><div className="lsc-editor-actions"><span>Unknowns: <output aria-label="Number of unknowns">2</output></span><button onClick={()=>applyPreset("infinite")}><RotateCcw/>Reset system</button><button onClick={()=>setSystem(Array.from({length:6},()=>Math.floor(Math.random()*11)-5) as LinearSystem)}><Dice5/>Random</button><Link to="/lessons/school/class-12" aria-label="Back to Class 12 lessons"><ArrowLeft/>School lessons</Link></div></div><aside className="lsc-constant-card"><h3>Change constant (b₂)</h3><p>Current b₂ = {formatNumber(system[5])}</p><div>{[4,5].map(n=><button key={n} aria-label={`Set second constant to ${n}`} aria-pressed={system[5]===n} onClick={()=>setValue(5,n)}>{n}</button>)}</div><input type="range" aria-label="Explore second equation constant" min={Math.min(2,system[5])} max={Math.max(6,system[5])} step=".1" value={system[5]} onChange={e=>setValue(5,Number(e.target.value))}/><p>For the infinite preset, 4 gives infinitely many solutions and 5 gives none.</p></aside></div></section>
 <section className="lsc-analysis"><article className="lsc-reduction-panel"><h2>2. ROW-REDUCE AND ANALYZE.</h2><Reduction system={system}/></article><article className="lsc-geometry-panel"><h2>3. GEOMETRIC VIEW (IN ℝ²)</h2><h3>Lines in the plane</h3><SystemGraph system={system}/><p className="lsc-current-geometry">{consistencyGeometryMessage(system)}</p>{result.type==="infinite"&&system.every((v,i)=>v===PRESETS.infinite[i])&&<p>Example points: (0, 2), (2, 0), (1, 1), (−1, 3) …</p>}</article><article className="lsc-theorem" aria-label="Rouche-Capelli theorem"><h2>ROUCHÉ–CAPELLI THEOREM</h2><p>A linear system Ax = b is:</p><ul><li><strong>Consistent</strong> (at least one solution)<p>if rank(A) = rank([A | b])</p></li><li><strong>Inconsistent</strong> (no solution)<p>if rank(A) &lt; rank([A | b])</p></li><li><strong>Consistent with infinitely many solutions</strong><p>if rank(A) = rank([A | b]) &lt; n</p></li></ul><p>where n = number of unknowns.</p></article></section>
 <WorkedCase system={PRESETS.none} title="WHAT IF b₂ = 5?"/><WorkedCase system={PRESETS.unique} title="UNIQUE SOLUTION CASE (Preset)"/><ConsistencyPractice/><LessonMockupFooter/>
 </main>;
}
