import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Info, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { boundFromPosition, INFEASIBLE_PRACTICE, overlapModel, OVERLAP_EXAMPLES } from "./infeasibleProblemsModel";
import "./InfeasibleProblemsTargetLesson10206.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const px = (value: number) => 35 + (value + 10) * 30.5;
const tabs = ["Interact", "Learn", "Worked Check", "Rule", "Practice"];

function MiniOverlap({ lower, upper }: { lower: number; upper: number }) {
  const x = (value: number) => 18 + (value + 1) * 18;
  return <svg viewBox="0 0 160 54" aria-label={`Lower bound ${lower}, upper bound ${upper}`} role="img">
    <path d="M8 24H152 M12 21L8 24L12 27 M148 21L152 24L148 27" fill="none" stroke="#5a6171" />
    <path d={`M8 24H${x(upper)}`} stroke="#ff8519" strokeWidth="2" />
    <path d={`M${x(lower)} 24H152`} stroke="#1264ce" strokeWidth="2" />
    {lower < upper && <path d={`M${x(lower)} 24H${x(upper)}`} stroke="#159e75" strokeWidth="5" />}
    {lower > upper && <path d={`M${x(upper)} 24H${x(lower)}`} stroke="#ef4656" strokeDasharray="3 3" />}
    <circle cx={x(lower)} cy="24" r="4.5" fill="#1264ce" stroke="white" />
    <circle cx={x(upper)} cy="24" r="4.5" fill="#ff8519" stroke="white" />
    <text x={x(lower)} y="45" textAnchor="middle">{lower}</text>
    {lower !== upper && <text x={x(upper)} y="45" textAnchor="middle">{upper}</text>}
  </svg>;
}

function HalfPlaneComparison() {
  const x = (n: number) => 180 + n * 21;
  const y = (n: number) => 135 - n * 17;
  return <svg className="ip-plane" viewBox="0 0 360 270" role="img" aria-label="Disjoint half planes y greater than or equal to x plus 2 and y less than or equal to x minus 1">
    <defs><clipPath id="ip-plane-clip"><rect x="12" y="10" width="336" height="250" /></clipPath></defs>
    <g clipPath="url(#ip-plane-clip)">
      <polygon points={`${x(-8)},${y(8)} ${x(6)},${y(8)} ${x(-8)},${y(-6)}`} fill="#b9ccff" opacity=".6" />
      <polygon points={`${x(-7)},${y(-8)} ${x(8)},${y(7)} ${x(8)},${y(-8)}`} fill="#ffdfb8" opacity=".6" />
      {Array.from({ length: 17 }, (_, i) => i - 8).map(n => <path key={n} d={`M${x(n)} 10V260 M12 ${y(n)}H348`} stroke="#e1e6ee" strokeWidth=".7" />)}
      <path d={`M${x(-8)} ${y(-6)}L${x(8)} ${y(10)}`} stroke="#265cd4" strokeWidth="2" />
      <path d={`M${x(-8)} ${y(-9)}L${x(8)} ${y(7)}`} stroke="#f28a24" strokeWidth="2" />
    </g>
    <path d="M12 135H348 M180 260V10 M343 132L348 135L343 138 M177 15L180 10L183 15" fill="none" stroke="#344153" />
    {[-6, -4, -2, 2, 4, 6].map(n => <g key={n}><text x={x(n)} y="151" textAnchor="middle">{n}</text><text x="166" y={y(n) + 4}>{n}</text></g>)}
    <text x="164" y="151">0</text><text x="349" y="131">x</text><text x="187" y="13">y</text>
    <text x="236" y="44" fill="#265cd4">y = x + 2</text><text x="245" y="230" fill="#d97510">y = x − 1</text>
    <path d={`M${x(1)} ${y(3)}V${y(0)} M${x(1)-3} ${y(3)+5}L${x(1)} ${y(3)}L${x(1)+3} ${y(3)+5} M${x(1)-3} ${y(0)-5}L${x(1)} ${y(0)}L${x(1)+3} ${y(0)-5}`} fill="none" stroke="#26354b" />
    <text x="217" y="103">No overlap</text><text x="217" y="118">(empty strip)</text>
  </svg>;
}

export default function InfeasibleProblemsTargetLesson10206({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [lower, setLower] = useState(5), [upper, setUpper] = useState(2);
  const [info, setInfo] = useState(false), [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState<number | null>(null), [checked, setChecked] = useState(false);
  const dragging = useRef<"lower" | "upper" | null>(null);
  const model = overlapModel(lower, upper);
  const setBound = (which: "lower" | "upper", value: number) => {
    if (Number.isFinite(value)) (which === "lower" ? setLower : setUpper)(Math.round(Math.max(-10, Math.min(10, value)) * 2) / 2);
  };
  const reset = () => { setLower(5); setUpper(2); setInfo(false); setAnswer(null); setChecked(false); };
  const stopDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <main className="ip10206" data-testid="school-mockup-0880">
    <header><Link to="/lessons/school/class-12"><ArrowLeft size={14} />School lessons</Link><small>CLASS 12 · LINEAR PROGRAMMING</small><h1>{lesson.title}</h1><p>No point satisfies all constraints simultaneously.</p><p>Learn to detect infeasibility by finding the overlap (or lack of it) of the feasible regions.</p><div className="ip-tags">20 min · ADVANCED · PRACTICE · graph · inequality</div></header>
    <nav className="ip-tabs" aria-label="Lesson sections">{tabs.map(name => <button key={name} aria-current={tab === name ? "location" : undefined} onClick={() => { setTab(name); document.getElementById(`ip-${name}`)?.scrollIntoView({ behavior: "smooth" }); }}>{name}</button>)}</nav>
    <section id="ip-Interact" className="ip-lab">
      <div className="ip-toolbar"><div><h2><ClipboardList size={14} />FIND THE OVERLAP (1D LAB)</h2><p>Move the sliders to change bounds. Overlap is the intersection of the two conditions.</p></div><div><button onClick={reset}><RotateCcw size={14} />Reset</button><button onClick={() => setInfo(v => !v)} aria-expanded={info} aria-controls="ip-info"><Info size={14} />Info</button></div></div>
      {info && <p id="ip-info" className="ip-info">Blue includes every x ≥ L; orange includes every x ≤ U. Closed endpoints are included. A solution must belong to both sets.</p>}
      <div className="ip-bounds">{(["lower", "upper"] as const).map(which => {
        const value = which === "lower" ? lower : upper, symbol = which === "lower" ? "L" : "U";
        return <div className={`ip-bound ip-${which}`} key={which}><label htmlFor={`ip-${which}-range`}>{which === "lower" ? "Lower" : "Upper"} bound</label><div><strong>x {which === "lower" ? "≥" : "≤"} {symbol}</strong><label>{symbol} = <input aria-label={`${which} bound value`} type="number" min="-10" max="10" step=".5" value={value} onChange={e => setBound(which, e.target.valueAsNumber)} /></label></div><input id={`ip-${which}-range`} aria-label={`${which} bound`} type="range" min="-10" max="10" step=".5" value={value} onChange={e => setBound(which, Number(e.target.value))} /><div className="ip-scale">{[-10, -5, 0, 5, 10].map(n => <span key={n}>{n}</span>)}</div></div>;
      })}</div>
      <h3>Number line view</h3>
      <svg className="ip-number-line" viewBox="0 0 680 145" aria-label="Interactive intersection of two bounds" onPointerMove={event => {
        if (!dragging.current) return;
        const matrix = event.currentTarget.getScreenCTM();
        if (!matrix) return;
        const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
        setBound(dragging.current, boundFromPosition(point.x));
      }} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={() => { dragging.current = null; }}>
        <path d="M24 108H656 M29 104L24 108L29 112 M651 104L656 108L651 112" fill="none" stroke="#424d61" />
        {Array.from({ length: 11 }, (_, i) => -10 + i * 2).map(n => <g key={n}><path d={`M${px(n)} 108v6`} stroke="#64748b" /><text x={px(n)} y="131" textAnchor="middle">{n}</text></g>)}
        <path d={`M24 53H${px(upper)} M33 46L24 53L33 60`} fill="none" stroke="#ff8619" strokeWidth="3" />
        <path d={`M${px(lower)} 32H656 M647 25L656 32L647 39`} fill="none" stroke="#1264ce" strokeWidth="3" />
        {model.kind === "empty" ? <g><path d={`M${px(upper)} 76H${px(lower)}`} stroke="#ef4656" strokeWidth="2" strokeDasharray="5 4" /><text x={(px(lower) + px(upper)) / 2} y="94" textAnchor="middle" fill="#d7223b">Empty gap</text></g> : <g><path d={`M${px(lower)} 76H${px(upper)}`} stroke="#159e75" strokeWidth="6" /><circle cx={px(lower)} cy="76" r="4" fill="#159e75" /><circle cx={px(upper)} cy="76" r="4" fill="#159e75" /><text x={(px(lower) + px(upper)) / 2} y="96" textAnchor="middle" fill="#117d5e">{model.kind === "point" ? `{${lower}}` : `[${lower}, ${upper}]`}</text></g>}
        {(["lower", "upper"] as const).map(which => {
          const value = which === "lower" ? lower : upper, y = which === "lower" ? 32 : 53;
          return <g key={which} role="slider" tabIndex={0} aria-label={`Drag ${which} endpoint`} aria-valuemin={-10} aria-valuemax={10} aria-valuenow={value} aria-orientation="horizontal" onKeyDown={event => {
            const next = event.key === "Home" ? -10 : event.key === "End" ? 10 : ["ArrowRight", "ArrowUp"].includes(event.key) ? value + .5 : ["ArrowLeft", "ArrowDown"].includes(event.key) ? value - .5 : null;
            if (next !== null) { event.preventDefault(); setBound(which, next); }
          }} onPointerDown={event => { event.preventDefault(); dragging.current = which; event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); }}>
            <path d={`M${px(value)} ${y}V108`} stroke="#8793a7" strokeDasharray="2 3" />
            <circle cx={px(value)} cy={y} r="16" fill="transparent" /><circle cx={px(value)} cy={y} r="6" fill={which === "lower" ? "#1264ce" : "#ff8619"} stroke="white" strokeWidth="2" />
            <text x={px(value)} y={y - 12} textAnchor="middle">{value}</text>
          </g>;
        })}
      </svg>
      <div className="ip-results" aria-live="polite"><article className={model.kind === "empty" ? "ip-empty" : "ip-feasible"}><h3>{model.kind === "empty" ? <XCircle size={16} /> : <Check size={16} />}{model.count} — {model.kind === "empty" ? "infeasible" : "feasible"}</h3><p>{model.kind === "empty" ? `Since ${lower} ≤ x ≤ ${upper} is impossible (${lower} > ${upper}), no value of x satisfies both conditions.` : model.kind === "point" ? `Only x = ${lower} satisfies both conditions.` : `Every x in [${lower}, ${upper}] satisfies both conditions.`}</p></article><article><h3>Algebraic certificate</h3><p>x ≥ {lower} and x ≤ {upper} ⇒ {lower} ≤ x ≤ {upper}</p><p>{model.kind === "empty" ? `Impossible since ${lower} > ${upper}. Therefore, the system has no solution.` : model.kind === "point" ? `The bounds coincide. Solution set = {${lower}}.` : `The lower bound does not exceed the upper bound. Solution set = [${lower}, ${upper}].`}</p></article></div>
    </section>
    <section id="ip-Worked Check" className="ip-transitions"><h2>TRANSITIONS: FROM INFEASIBLE TO FEASIBLE</h2><div className="ip-example-grid">{OVERLAP_EXAMPLES.map(example => {
      const state = overlapModel(example.lower, example.upper);
      return <button key={example.title} className="ip-example" onClick={() => { setLower(example.lower); setUpper(example.upper); }} aria-label={`Explore ${example.title}`}><strong>{example.title}</strong><span>L = {example.lower}, U = {example.upper}</span><MiniOverlap {...example} /><span>{state.kind === "empty" ? "No overlap" : state.kind === "point" ? `Overlap = {${example.lower}}` : `Overlap = [${example.lower}, ${example.upper}]`}</span><b className={`ip-count-${state.kind}`}>{state.count}</b></button>;
    })}</div><p><b>Rule of thumb:</b> If L &gt; U → infeasible. If L = U → one point. If L &lt; U → interval [L, U].</p></section>
    <section className="ip-comparison"><h2>2D COMPARISON: PARALLEL, NON-OVERLAPPING HALF-PLANES</h2><p>The two shaded regions never meet, so there is no feasible point.</p><div><article><h3>Inequalities</h3><p className="ip-math">y ≥ x + 2</p><p>(above the blue line)</p><p className="ip-math">y ≤ x − 1</p><p>(below the orange line)</p><p>The lines are parallel, with vertical separation 3.</p></article><HalfPlaneComparison /><article><h3>Conclusion</h3><p>The shaded regions (solutions) do not overlap.</p><strong className="ip-count-empty">No common points — infeasible</strong></article></div></section>
    <section id="ip-Rule" className="ip-rule"><h2>BEFORE OPTIMIZING, ALWAYS:</h2><ol>{[["Graph", "Draw each constraint."], ["Shade", "Mark the solution side."], ["Inspect overlap", "Check if regions intersect."], ["Stop before optimizing", "If no overlap → infeasible."]].map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol></section>
    <section id="ip-Learn" className="ip-notes"><article><h2>WHAT IS AN INFEASIBLE PROBLEM?</h2><p>A system of linear inequalities is infeasible if the intersection of all solution regions is empty. No point satisfies all constraints at the same time.</p><p><b>Symbols:</b> <span className="ip-count-empty">Feasible set = ∅</span></p></article><article><h2><Lightbulb size={16} />COMMON MISCONCEPTION</h2><p>Thinking that because each inequality has solutions, the system must too. <b>Wrong!</b> The solution sets can be disjoint.</p><strong>Always check overlap.</strong></article></section>
<section id="ip-Practice" className="ip-practice"><h2><ClipboardList size={14} />TRY IT YOURSELF <small>Practice</small></h2><fieldset><legend>Which of the following systems is infeasible?</legend><div>{INFEASIBLE_PRACTICE.map(([l, u], i) => <label key={i} className={checked && answer === i ? (overlapModel(l, u).kind === "empty" ? "ip-correct" : "ip-incorrect") : ""}><input type="radio" name="ip-answer" checked={answer === i} onChange={() => { setAnswer(i); setChecked(false); }} /><b>{String.fromCharCode(65 + i)}</b><span>x ≥ {l}<br />x ≤ {u}</span></label>)}</div></fieldset>{checked && <p role="status">{answer === null ? "Select a system first." : overlapModel(INFEASIBLE_PRACTICE[answer][0], INFEASIBLE_PRACTICE[answer][1]).kind === "empty" ? "Correct. Option C requires 2 ≤ x ≤ 0, which is impossible." : "This system has an overlap. Look for a lower bound greater than the upper bound."}</p>}<button onClick={() => setChecked(true)}>Check answer<Check size={14} /></button></section>
    <nav className="ip-next"><Link to="/lessons/school/class-12/class-12-linear-programming-multiple-optimal-solutions"><ArrowLeft size={14} />Previous: Multiple Optimal Solutions</Link><Link to="/lessons/school/class-12/class-12-linear-programming-diet-problem">Next: Diet Problem<ArrowRight size={14} /></Link></nav>
      <LessonTopicStudyBoard lessonId={10206} view={tab} />

  </main>;
}
