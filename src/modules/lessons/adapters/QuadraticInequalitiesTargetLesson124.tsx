import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, Expand, Languages,
  Lightbulb, Rocket, RotateCcw, Share2, Sparkles, TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./QuadraticInequalitiesTargetLesson124.css";

type Relation = ">" | ">=" | "<" | "<=";
type RootName = "first" | "second";

const prettyRelation = (relation: Relation) => relation === ">=" ? "≥" : relation === "<=" ? "≤" : relation;
const factor = (root: number) => root === 0 ? "x" : root > 0 ? `(x − ${root})` : `(x + ${Math.abs(root)})`;
const number = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const intervalEnd = (value: number, closed: boolean, left: boolean) => `${closed ? left ? "[" : "]" : left ? "(" : ")"}${number(value)}`;

function solutionFor(a: number, r1: number, r2: number, relation: Relation) {
  const [left, right] = [Math.min(r1, r2), Math.max(r1, r2)];
  const include = relation.includes("=");
  const wantsPositive = relation.startsWith(">");
  const outside = wantsPositive === (a > 0);
  if (left === right) {
    if (outside) return include ? { text: "All real numbers", interval: "(−∞, ∞)" } : { text: `x ≠ ${number(left)}`, interval: `(−∞, ${number(left)}) ∪ (${number(left)}, ∞)` };
    return include ? { text: `x = ${number(left)}`, interval: `{${number(left)}}` } : { text: "No solution", interval: "∅" };
  }
  if (outside) return {
    text: `x ${include ? "≤" : "<"} ${number(left)}  or  x ${include ? "≥" : ">"} ${number(right)}`,
    interval: `(−∞, ${number(left)}${include ? "]" : ")"} ∪ ${include ? "[" : "("}${number(right)}, ∞)`,
  };
  return {
    text: `${number(left)} ${include ? "≤" : "<"} x ${include ? "≤" : "<"} ${number(right)}`,
    interval: `${intervalEnd(left, include, true)}, ${number(right)}${include ? "]" : ")"}`,
  };
}

function RootLine({ first, second, onMove }: { first: number; second: number; onMove: (name: RootName, value: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<RootName | null>(null);
  const frozen = useRef({ min: -2, max: 7 });
  const min = Math.min(-2, first - 2, second - 2);
  const max = Math.max(7, first + 2, second + 2);
  const x = (value: number, range = { min, max }) => 42 + ((value - range.min) / (range.max - range.min)) * 608;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * 692;
    const range = frozen.current;
    const value = Math.round(range.min + ((local - 42) / 608) * (range.max - range.min));
    onMove(dragging, value);
  };
  const marker = (name: RootName, value: number) => <circle
    className="quad124-root" cx={x(value)} cy="58" r="8" role="slider" tabIndex={0}
    aria-label={`Drag quadratic ${name} root`} aria-valuenow={value}
    onPointerDown={(event) => { frozen.current = { min, max }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(name); }}
    onKeyDown={(event) => { if (event.key === "ArrowLeft") onMove(name, value - 1); if (event.key === "ArrowRight") onMove(name, value + 1); }}
  />;
  return <svg ref={svg} className="quad124-sign-line" viewBox="0 0 692 105" onPointerMove={move} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
    <defs><marker id="quad124-left" markerWidth="10" markerHeight="10" refX="2" refY="5" orient="auto"><path d="M10 0L0 5L10 10z" /></marker><marker id="quad124-right" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" /></marker></defs>
    <text x={(42 + x(first)) / 2} y="20">(−∞, {number(first)})</text><text x={(x(first) + x(second)) / 2} y="20">({number(first)}, {number(second)})</text><text x={(x(second) + 650) / 2} y="20">({number(second)}, ∞)</text>
    <line className="quad124-axis" x1="42" x2="650" y1="58" y2="58" markerStart="url(#quad124-left)" markerEnd="url(#quad124-right)" />
    {marker("first", first)}{marker("second", second)}
    <text x={x(first)} y="91">{number(first)}</text><text x={x(second)} y="91">{number(second)}</text>
  </svg>;
}

function Parabola({ a, first, second, relation }: { a: number; first: number; second: number; relation: Relation }) {
  const [left, right] = [Math.min(first, second), Math.max(first, second)];
  const minX = left - 2, maxX = right + 2, width = 330, height = 210;
  const value = (x: number) => a * (x - left) * (x - right);
  const samples = Array.from({ length: 81 }, (_, index) => minX + (index / 80) * (maxX - minX));
  const values = samples.map(value);
  const positiveSpan = Math.max(0.1, ...values.filter((sample) => sample > 0));
  const negativeSpan = Math.max(0.1, ...values.filter((sample) => sample < 0).map(Math.abs));
  const sx = (x: number) => 24 + ((x - minX) / (maxX - minX)) * 282;
  const sy = (y: number) => y >= 0 ? 101 - (y / positiveSpan) * 77 : 101 + (Math.abs(y) / negativeSpan) * 55;
  const path = samples.map((sample, index) => `${index ? "L" : "M"}${sx(sample).toFixed(1)} ${sy(values[index]).toFixed(1)}`).join(" ");
  const wantsPositive = relation.startsWith(">");
  const area = (start: number, end: number) => {
    const points = Array.from({ length: 31 }, (_, index) => start + (index / 30) * (end - start));
    return `M${sx(start)} 101 ${points.map((point) => `L${sx(point).toFixed(1)} ${sy(value(point)).toFixed(1)}`).join(" ")} L${sx(end)} 101Z`;
  };
  const regions = [[minX, left], [left, right], [right, maxX]];
  return <svg className="quad124-parabola" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Quadratic inequality parabola with roots">
    <line className="axis" x1="16" x2="316" y1="101" y2="101" /><line className="axis" x1="24" x2="24" y1="18" y2="194" />
    <text x="315" y="113">x</text><text x="10" y="21">y</text>
    {regions.map(([start, end], index) => <path key={index} className={(value((start + end) / 2) > 0) === wantsPositive ? "solution-area" : "rejected-area"} d={area(start, end)} />)}
    <path className="curve" d={path} />
    <circle cx={sx(left)} cy="101" r="5" /><circle cx={sx(right)} cy="101" r="5" />
    <text x={sx(left)} y="122">{number(left)}</text><text x={sx(right)} y="122">{number(right)}</text>
    <text className="formula" x="168" y="24">y = {a === 1 ? "" : a === -1 ? "−" : number(a)}{factor(left)}{factor(right)}</text>
    <rect className="positive-key" x="18" y="182" width="12" height="12" /><text x="36" y="192">y {wantsPositive ? ">" : "<"} 0 (solution regions)</text>
  </svg>;
}

export default function QuadraticInequalitiesTargetLesson124({ resetToken, onInteraction }: LessonAdapterProps) {
  const [first, setFirst] = useState(2); const [second, setSecond] = useState(3);
  const [a, setA] = useState(1); const [relation, setRelation] = useState<Relation>(">");
  const [tab, setTab] = useState("Interaction + visualization"); const [language, setLanguage] = useState("English (English)");
  const [actions, setActions] = useState(0); const [shared, setShared] = useState(false); const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false); const [practiceChecked, setPracticeChecked] = useState(false);
  const roots = [Math.min(first, second), Math.max(first, second)];
  const b = -a * (roots[0] + roots[1]); const c = a * roots[0] * roots[1]; const solution = solutionFor(a, roots[0], roots[1], relation);
  const evalAt = (x: number) => a * (x - roots[0]) * (x - roots[1]);
  const tests = [roots[0] - 1, roots[0], (roots[0] + roots[1]) / 2, roots[1], roots[1] + 1];
  const qualifies = (value: number) => relation === ">" ? value > 0 : relation === ">=" ? value >= 0 : relation === "<" ? value < 0 : value <= 0;
  const act = () => { setActions((value) => value + 1); onInteraction(); };
  const reset = () => { setFirst(2); setSecond(3); setA(1); setRelation(">"); setTab("Interaction + visualization"); setLanguage("English (English)"); setActions(0); setShared(false); setWorkspace(false); setFullscreen(false); setPracticeChecked(false); onInteraction(); };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const moveRoot = (name: RootName, value: number) => { if (name === "first") setFirst(value); else setSecond(value); setPracticeChecked(false); act(); };
  const loadExample = () => { setFirst(-2); setSecond(4); setA(-1); setRelation(">="); setPracticeChecked(false); act(); };
  const coefficientText = `${a === 1 ? "" : a === -1 ? "−" : number(a)}x² ${b < 0 ? "−" : "+"} ${number(Math.abs(b))}x ${c < 0 ? "−" : "+"} ${number(Math.abs(c))}`;

  return <div className={`quad124-page ${fullscreen ? "fullscreen" : ""}`} data-testid="algebra-mockup-0181" data-dedicated-lesson="124" data-object-model="editable-quadratic-inequality-two-pointer-keyboard-draggable-roots-linked-factorization-sign-chart-substitution-values-parabola-regions-interval-solution-inclusive-endpoints-practice-model" data-roots={`${roots[0]},${roots[1]}`} data-relation={`${a},${relation}`} data-solution={solution.interval} data-actions={actions}>
    <nav className="quad124-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>124 Quadratic Inequalities</b></nav>
    <header className="quad124-intro"><small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small><h1>Quadratic Inequalities</h1><p>Relate signs to graph position.</p><nav><b>♙ Intermediate-Advanced</b><b>ϟ Guided Practice</b><b>☷ Solve / Nsolve / Inequality Graphing</b><b>◷ 6-10 min</b></nav><div><label><Languages /><select aria-label="Quadratic inequalities language" value={language} onChange={(event) => { setLanguage(event.target.value); act(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label><button onClick={reset}><RotateCcw />Reset</button><button onClick={() => { setShared(true); act(); }}><Share2 />{shared ? "Link ready" : "Share"}</button><button onClick={() => { setWorkspace((value) => !value); act(); }}>↗ {workspace ? "Close workspace" : "Workspace"}</button></div></header>
    <nav className="quad124-tabs">{["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"].map((name) => <button key={name} className={tab === name ? "active" : ""} onClick={() => { setTab(name); if (name === "Examples") loadExample(); else act(); }}>{name}</button>)}</nav>
    <main className="quad124-lab">
      <header><span><small>INTERACTION · SIGN-INTERVAL SOLVER</small><h2>Solve <i>{coefficientText} {prettyRelation(relation)} 0</i></h2></span><b>{actions ? "Model updated" : "Awaiting interaction"}</b><b>{actions} actions</b><button aria-label="Expand quadratic inequality workspace" onClick={() => { setFullscreen((value) => !value); act(); }}><Expand /></button></header>
      <section className="quad124-summary"><button onClick={() => { setA(a === 1 ? -1 : 1); act(); }}><small>Factorization</small><strong>{a === 1 ? "" : "−"}{factor(roots[0])}{factor(roots[1])}</strong></button><button onClick={() => { moveRoot("first", roots[0] - 1); }}><small>Critical Points (Roots)</small><strong>x = {number(roots[0])}, x = {number(roots[1])}</strong></button><button onClick={() => { const order: Relation[] = [">", ">=", "<", "<="]; setRelation(order[(order.indexOf(relation) + 1) % order.length]); act(); }}><small>Inequality</small><strong>{coefficientText} {prettyRelation(relation)} 0</strong></button></section>
      <section className="quad124-chart"><h3>SIGN CHART (NUMBER LINE)</h3><RootLine first={roots[0]} second={roots[1]} onMove={moveRoot} /><div className="quad124-table"><b>Sign of expression</b>{tests.map((test, index) => <strong key={`sign-${index}`} className={evalAt(test) > 0 ? "positive" : evalAt(test) < 0 ? "negative" : "zero"}>{evalAt(test) > 0 ? "+" : evalAt(test) < 0 ? "−" : "0"}</strong>)}<b>Test point</b>{tests.map((test, index) => <span key={`test-${index}`}>x = {number(test)}</span>)}<b>Expression value</b>{tests.map((test, index) => <span key={`value-${index}`} className={qualifies(evalAt(test)) ? "positive" : evalAt(test) === 0 ? "zero" : "negative"}>{number(evalAt(test))}</span>)}<b>Conclusion</b>{tests.map((test, index) => <strong key={`result-${index}`} className={qualifies(evalAt(test)) ? "positive" : "negative"}>{evalAt(test) === 0 ? "Zero" : evalAt(test) > 0 ? "Positive" : "Negative"}</strong>)}</div><footer><Check /><span>Solution (where {coefficientText} {prettyRelation(relation)} 0)<strong>{solution.text}</strong><b>Interval notation: {solution.interval}</b></span></footer></section>
      <section className="quad124-middle"><article><h3>PARABOLA VIEW</h3><Parabola a={a} first={roots[0]} second={roots[1]} relation={relation} /></article><article><h3>HOW TO THINK</h3>{[["Factor", `Write ${coefficientText} as ${a === 1 ? "" : "−"}${factor(roots[0])}${factor(roots[1])}.`],["Find roots", `Set each factor to zero: x = ${number(roots[0])}, x = ${number(roots[1])}.`],["Test intervals", `Signs are ${evalAt(roots[0] - 1) > 0 ? "+" : "−"}, ${evalAt((roots[0] + roots[1]) / 2) > 0 ? "+" : "−"}, ${evalAt(roots[1] + 1) > 0 ? "+" : "−"}.`],["Select matching sign", `Keep ${solution.interval}.`]].map((step, index) => <p key={step[0]}><i>{index + 1}</i><span><b>{step[0]}</b><small>{step[1]}</small></span></p>)}</article></section>
      <section className="quad124-lower"><article><TriangleAlert /><div><small>COMMON MISTAKE</small><h3>ROOTS_ONLY</h3><p>Giving x = {number(roots[0])} and x = {number(roots[1])} as the answer misses the intervals.</p><b>For inequalities, always report intervals where the expression satisfies the condition.</b></div></article><article><Rocket /><div><small>QUICK PRACTICE</small><b>Try this similar one</b><h3>y² − 4 ≤ 0</h3><p>Solution: −2 ≤ y ≤ 2<br />Interval notation: [−2, 2]</p><small>(Closed endpoints because ≤ includes equality.)</small></div><button onClick={() => { setPracticeChecked(true); act(); }}><Check />{practiceChecked ? "Correct" : "Check solution"}</button></article></section>
      <p className="quad124-note">This algebra page uses a lesson-specific calculation workspace focused on sign-interval analysis.</p><footer className="quad124-tags"><span>☷ primary-control</span><span>▣ expression</span><span>▣ symbolic result</span></footer>
    </main>
    <nav className="quad124-adjacent"><a href="/lessons/algebra/123-compound-inequalities"><ArrowLeft /><span><small>PREVIOUS</small>Compound Inequalities</span></a><a href="/lessons/algebra/125-polynomial-inequalities"><span><small>NEXT</small>Polynomial Inequalities</span><ArrowRight /></a></nav>
    <footer className="quad124-footer"><b><Sparkles />Math Universe</b><span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span><nav><button><Lightbulb />Sitemap</button><button><CircleAlert />Docs</button><button>About</button></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
  </div>;
}
