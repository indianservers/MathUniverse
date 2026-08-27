import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cog,
  Expand,
  Info,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./FunctionConceptTargetLesson129.css";

type SampleIndex = 0 | 1 | 2;

const round = (value: number) => Math.round(value * 100) / 100;
const numberText = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
const signed = (value: number) => value < 0 ? `− ${numberText(Math.abs(value))}` : `+ ${numberText(value)}`;
const formula = (a: number, b: number, name = "f") => `${name}(x) = ${numberText(a)}x ${signed(b)}`;

function FunctionGraph({ a, b, samples, onMove }: { a: number; b: number; samples: number[]; onMove: (index: SampleIndex, value: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<SampleIndex | null>(null);
  const xPixel = (x: number) => 260 + x * 39;
  const yPixel = (y: number) => 244 - y * 30;
  const lineStart = { x: -4.5, y: a * -4.5 + b };
  const lineEnd = { x: 5, y: a * 5 + b };
  const pointerX = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return 0;
    return Math.max(-4, Math.min(4, Math.round((((event.clientX - box.left) / box.width) * 540 - 260) / 39)));
  };
  return (
    <svg ref={svgRef} className="fun129-graph" viewBox="0 0 540 430" role="img" aria-label="Linked function graph" onPointerMove={(event) => dragging !== null && onMove(dragging, pointerX(event))} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
      <defs><pattern id="fun129-grid" width="39" height="30" patternUnits="userSpaceOnUse"><path d="M39 0H0V30" fill="none" stroke="#e6edf2" strokeWidth="1" /></pattern><marker id="fun129-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#40506b" /></marker></defs>
      <rect x="20" y="20" width="500" height="380" fill="url(#fun129-grid)" />
      <line x1="20" x2="520" y1="244" y2="244" className="axis" markerEnd="url(#fun129-arrow)" /><line x1="260" x2="260" y1="400" y2="20" className="axis" markerEnd="url(#fun129-arrow)" />
      {[-4,-3,-2,-1,0,1,2,3,4].map((x) => <text key={`x${x}`} x={xPixel(x)} y="264">{x}</text>)}
      {[-4,-3,-2,-1,1,2,3,4,5].map((y) => <text key={`y${y}`} x="248" y={yPixel(y) + 4}>{y}</text>)}
      <text x="511" y="234" className="xy">x</text><text x="276" y="52" className="xy">y</text>
      <line x1={xPixel(lineStart.x)} y1={yPixel(lineStart.y)} x2={xPixel(lineEnd.x)} y2={yPixel(lineEnd.y)} className="function-line" />
      {samples.map((value, index) => {
        const y = a * value + b;
        return <g key={`${index}-${value}`}><line x1={xPixel(value)} x2={xPixel(value)} y1="36" y2="390" className="slice" /><circle cx={xPixel(value)} cy={yPixel(y)} r="8" className="sample" role="slider" tabIndex={0} aria-label={`Drag function input ${index + 1}`} aria-valuemin={-4} aria-valuemax={4} aria-valuenow={value} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(index as SampleIndex); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") onMove(index as SampleIndex, Math.max(-4, value - 1)); if (event.key === "ArrowRight") onMove(index as SampleIndex, Math.min(4, value + 1)); }} /><text x={xPixel(value) + 12} y={yPixel(y) + 21} className="point-label">({value}, {numberText(y)})</text><text x={xPixel(value)} y="34" className="slice-label">x = {value}</text></g>;
      })}
      <g className="legend"><rect x="344" y="344" width="162" height="44" rx="8" /><line x1="362" x2="408" y1="366" y2="366" className="function-line" /><text x="420" y="370">y = {numberText(a)}x {signed(b)}</text></g>
    </svg>
  );
}

export default function FunctionConceptTargetLesson129({ resetToken, onInteraction }: LessonAdapterProps) {
  const [a, setA] = useState(1.25);
  const [b, setB] = useState(1);
  const [samples, setSamples] = useState([-2, 0, 2]);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practiceInput, setPracticeInput] = useState(4);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const act = () => { setActions((value) => value + 1); onInteraction(); };
  const reset = () => { setA(1.25); setB(1); setSamples([-2, 0, 2]); setTab("Interaction + visualization"); setLanguage("English (English)"); setActions(0); setShared(false); setWorkspace(false); setFullscreen(false); setPracticeInput(4); setPracticeChecked(true); onInteraction(); };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateA = (value: number) => { setA(round(value)); act(); };
  const updateB = (value: number) => { setB(round(value)); act(); };
  const moveSample = (index: SampleIndex, value: number) => { setSamples((current) => current.map((item, itemIndex) => itemIndex === index ? value : item)); act(); };
  const output = (x: number) => round(a * x + b);
  const tableInputs = Array.from(new Set([...samples, -1, 0, 1])).sort((left, right) => left - right);
  const practiceOutput = 2 * practiceInput - 3;
  return (
    <div className={`fun129-page ${fullscreen ? "fullscreen" : ""}`} data-testid="graph-mockup-0186" data-dedicated-lesson="129" data-object-model="editable-linear-function-machine-linked-input-output-mappings-parameter-sliders-pointer-keyboard-draggable-sample-inputs-generated-value-table-synchronized-cartesian-graph-vertical-slice-function-test-multiple-output-counterexample-live-practice-model" data-a={a} data-b={b} data-samples={samples.join(",")} data-outputs={samples.map(output).join(",")} data-practice={`${practiceInput},${practiceOutput},${practiceChecked}`} data-actions={actions} data-direct-interaction="true">
      <nav className="fun129-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/graphs-and-functions">Graphs And Functions</a><span>&gt;</span><b>129 Function Concept</b></nav>
      <header className="fun129-intro"><small><b>GRAPHS AND FUNCTIONS</b><b>FUNCTIONS</b></small><h1>Function Concept</h1><p>Understand input-output dependency.</p><nav><b>♙ Intermediate-Advanced</b><b>ϟ Graph Explorer</b><b>▣ Graphing Calculator</b><b>◷ 6-10 min</b></nav><div><label><Languages /><select aria-label="Function concept language" value={language} onChange={(event) => { setLanguage(event.target.value); act(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label><button onClick={reset}><RotateCcw />Reset</button><button onClick={() => { setShared(true); act(); }}><Share2 />{shared ? "Link ready" : "Share"}</button><button onClick={() => { setWorkspace((value) => !value); act(); }}>↗ {workspace ? "Close workspace" : "Workspace"}</button></div><aside aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M18 78V20M18 78H82M18 78L46 54L64 38L82 20" /><circle cx="46" cy="54" r="4" /><circle cx="64" cy="38" r="4" /><circle cx="82" cy="20" r="4" /></svg></aside></header>
      <nav className="fun129-tabs">{["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"].map((name) => <button key={name} className={tab === name ? "active" : ""} onClick={() => { setTab(name); if (name === "Examples") { setA(2); setB(-3); setSamples([-1, 1, 3]); } act(); }}>{name}</button>)}</nav>
      <section className="fun129-lab"><header><div><small>INTERACTION + VISUALIZATION</small><h2>Function machine + graph cross-check</h2><p>See how each input has exactly one output.</p></div><nav><b><i />Active</b><span>{actions} actions</span><button aria-label="Expand function workspace" onClick={() => { setFullscreen((value) => !value); act(); }}><Expand /></button></nav></header>
        <div className="fun129-layout"><main className="fun129-main"><article className="fun129-machine"><h3><i>1</i> FUNCTION MACHINE</h3><strong>Rule: <em>{formula(a, b)}</em></strong><div className="machine-grid"><section><b>INPUTS (x)</b>{samples.map((value) => <span key={`in-${value}`}>{value}</span>)}</section><div className="arrows">{samples.map((value, index) => <span key={`arr-${value}-${index}`}>→</span>)}</div><figure><small>RULE</small><b>{formula(a, b)}</b><div><Cog /><Cog /></div></figure><div className="arrows">{samples.map((value, index) => <span key={`out-arr-${value}-${index}`}>→</span>)}</div><section><b>OUTPUTS (f(x))</b>{samples.map((value) => <span key={`out-${value}`}>{numberText(output(value))}</span>)}</section><table><thead><tr><th>x</th><th>{formula(a, b)}</th></tr></thead><tbody>{tableInputs.map((value) => <tr key={value}><td>{value}</td><td>{numberText(output(value))}</td></tr>)}</tbody></table></div></article>
          <article className="fun129-plot"><h3><i>2</i> GRAPH: <em>y = {numberText(a)}x {signed(b)}</em></h3><FunctionGraph a={a} b={b} samples={samples} onMove={moveSample} /><footer><Check />Each vertical slice hits the line exactly once. That’s a function.</footer></article>
          <article className="fun129-insight"><Info /><p>A function assigns each input exactly one output.<br />Our rule <em>{formula(a, b)}</em> passes the machine and the graph test!</p></article>
        </main>
        <aside className="fun129-rail"><section className="fun129-parameters"><header>FUNCTION PARAMETERS <b>a*x+b</b></header><label>Rate (a)<input aria-label="Function rate a" type="range" min="-5" max="5" step="0.25" value={a} onChange={(event) => updateA(Number(event.target.value))} /><output>{numberText(a)}</output></label><label>Start value (b)<input aria-label="Function start value b" type="range" min="-5" max="5" step="0.5" value={b} onChange={(event) => updateB(Number(event.target.value))} /><output>{numberText(b)}</output></label><strong>{formula(a, b)}</strong></section>
          <section className="fun129-how"><h3>WHY THIS IS A FUNCTION</h3>{[["Choose an input","Pick a value of x."],["Apply the rule",`Compute ${formula(a,b)}.`],["Get exactly one output","The rule returns a single value."],["Check on graph","The vertical line hits once."]].map((step,index)=><p key={step[0]}><i>{index+1}</i><span><b>{step[0]}</b><small>{step[1]}</small></span></p>)}</section>
          <section className="fun129-warning"><TriangleAlert /><div><b>MULTIPLE_OUTPUTS</b><p>One input cannot produce two different outputs in a function. It would fail the vertical line test.</p></div></section>
          <section className="fun129-not-function"><h3><X />NOT A FUNCTION (Example)</h3><p>x = 2 maps to 3 and 5.<br />Two outputs for one input.</p><table><thead><tr><th>x</th><th>y</th></tr></thead><tbody><tr><td>2</td><td>3</td></tr><tr><td>2</td><td>5</td></tr></tbody></table><b>→ Not a function</b></section>
          <section className="fun129-practice"><h3><Users />PRACTICE</h3><p>Try this rule on your own.</p><strong>g(x) = 2x − 3</strong><label>What is g(<input aria-label="Practice function input" type="number" min="-9" max="9" value={practiceInput} onChange={(event) => { setPracticeInput(Number(event.target.value)); setPracticeChecked(false); act(); }} />)?</label><button onClick={() => { setPracticeChecked(true); act(); }}><span>g({practiceInput}) = {practiceOutput}</span>{practiceChecked ? <Check /> : <Lightbulb />}</button><small>(2 × {practiceInput} − 3 = {practiceOutput})</small></section>
        </aside></div>
        <footer className="fun129-tags"><span>☷ primary-control</span><span>▣ function</span></footer>
      </section>
      <nav className="fun129-adjacent"><a href="/lessons/graphs-and-functions/130-domain-and-range"><span><small>NEXT</small>Domain and Range</span><ArrowRight /></a></nav>
      <footer className="fun129-footer"><b><Sparkles />Math Universe</b><span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span><nav><button>Sitemap</button><button>Docs</button><button>About</button></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}
