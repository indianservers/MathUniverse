import { ArrowLeft, ArrowRight, CheckCircle2, Eye, ExternalLink, RotateCcw, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PolarTrigonometryTargetLesson276.css";

type View = "polar" | "cartesian" | "trace";
type Curve = "cos" | "sin" | "double";
type TracePoint = { r: number; theta: number };
const DEG = Math.PI / 180;

export default function PolarTrigonometryTargetLesson276({ resetToken, onInteraction }: LessonAdapterProps) {
  const [radius, setRadius] = useState(Math.sqrt(3));
  const [theta, setTheta] = useState(30);
  const [view, setView] = useState<View>("polar");
  const [curve, setCurve] = useState<Curve>("cos");
  const [stage, setStage] = useState(0);
  const [language, setLanguage] = useState("English (English)");
  const [trace, setTrace] = useState<TracePoint[]>([]);
  const [answers, setAnswers] = useState(["", ""]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [shareCount, setShareCount] = useState(0);
  const model = useMemo(() => polarModel(radius, theta), [radius, theta]);

  const reset = () => {
    setRadius(Math.sqrt(3)); setTheta(30); setView("polar"); setCurve("cos"); setStage(0);
    setTrace([]); setAnswers(["", ""]); setFeedback("idle"); setShareCount(0); onInteraction();
  };
  useEffect(() => {
    setRadius(Math.sqrt(3)); setTheta(30); setView("polar"); setCurve("cos"); setStage(0);
    setTrace([]); setAnswers(["", ""]); setFeedback("idle"); setShareCount(0);
  }, [resetToken]);

  const update = (nextRadius: number, nextTheta: number) => {
    const r = clamp(nextRadius, -3, 3);
    const angle = clamp(nextTheta, -360, 360);
    setRadius(r); setTheta(angle); setTrace((current) => [...current.slice(-39), { r, theta: angle }]); onInteraction();
  };
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 300 - 150;
    const y = 150 - ((event.clientY - rect.top) / rect.height) * 300;
    update(Math.min(3, Math.hypot(x, y) / 42), normalizeSigned(Math.atan2(y, x) / DEG));
  };
  const check = () => {
    const ok = Math.abs(Number(answers[0]) - 1.5) < 0.01 && Math.abs(Number(answers[1]) + 2.598) < 0.01;
    setFeedback(ok ? "correct" : "incorrect"); onInteraction();
  };
  const share = async () => {
    try { await navigator.clipboard?.writeText(`Polar point (${format(radius)}, ${format(theta)} degrees) = (${format(model.x)}, ${format(model.y)})`); }
    finally { setShareCount((value) => value + 1); onInteraction(); }
  };

  return <section className="polar276-page" data-testid="trigonometry-mockup-0333" data-dedicated-lesson="276" data-object-model="linked-polar-cartesian-curve-trace" data-radius={radius.toFixed(4)} data-theta={theta.toFixed(4)} data-x={model.x.toFixed(4)} data-y={model.y.toFixed(4)} data-view={view} data-curve={curve} data-stage={stage} data-trace-count={trace.length} data-feedback={feedback} data-language={language} data-share-count={shareCount}>
    <span className="sr-only">Polar trigonometry interactive lesson. Live verification.</span>
    <header className="polar276-header">
      <div><small>TRIGONOMETRY</small><small>TRIGONOMETRY</small><h1>Polar Trigonometry</h1><p>Connect polar coordinates and trig.</p><div className="polar276-chips"><span>Intermediate-Advanced</span><span>Visual Lab</span><span>Trig Graphing / Geometry</span><span>6-10 min</span></div></div>
      <div className="polar276-actions"><select aria-label="Lesson language" value={language} onChange={(event) => { setLanguage(event.target.value); onInteraction(); }}><option>English (English)</option><option>Hindi (Hindi)</option></select><button type="button" onClick={reset}><RotateCcw/>Reset</button><button type="button" onClick={() => void share()}><Share2/>Share</button><a href="/workspace/trigonometry"><ExternalLink/>Workspace</a></div>
    </header>

    <nav className="polar276-stages" aria-label="Polar trigonometry lesson views">{[["Interaction + Visualization","Interaction"],["Explain","Explain"],["Examples","Examples"],["Formulas","Formulas"],["Know more","Know more"]].map(([label,name], index) => <button type="button" key={label} aria-label={name} aria-pressed={stage === index} onClick={() => { setStage(index); document.getElementById(index === 0 ? "polar-lab" : index === 4 ? "polar-practice" : `polar-section-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); onInteraction(); }}><span>{index === 0 ? <Eye/> : null}</span>{label}</button>)}</nav>

    <section id="polar-lab" className="polar276-lab">
      <header><div><small>INTERACTION + VISUALIZATION</small><h2>Work directly on the model</h2></div><div><b><CheckCircle2/>All good!</b><span>{trace.length} actions</span><button type="button" aria-label="Expand model" onClick={() => document.querySelector<HTMLElement>(".polar276-lab")?.requestFullscreen?.()}><ExternalLink/></button></div></header>
      <div className="polar276-workspace">
          <article className="polar276-point"><h3>POLAR COORDINATE POINT <i>(r, theta)</i></h3><div className="polar276-view-tabs"><button className={view === "polar" ? "active" : ""} onClick={() => { setView("polar"); onInteraction(); }}>Polar Grid</button><button className={view === "cartesian" ? "active" : ""} onClick={() => { setView("cartesian"); onInteraction(); }}>Cartesian Grid</button><button className={view === "trace" ? "active" : ""} onClick={() => { setView("trace"); onInteraction(); }}>Trace Curve</button></div><PolarPointSvg model={model} theta={theta} view={view} trace={trace} onPoint={dragPoint}/><p className="polar276-drag">Drag the blue point or sliders</p><PolarSlider label="r (radius)" min={-3} max={3} step={0.01} value={radius} display={format(radius)} onChange={(value) => update(value, theta)}/><PolarSlider label="theta (angle)" min={-360} max={360} step={1} value={theta} display={format(theta)} suffix="deg" onChange={(value) => update(radius, value)}/><small>Angle range: -360 degrees to 360 degrees</small></article>
        <article className="polar276-conversion"><h3>CARTESIAN CONVERSION</h3><p className="polar276-xy"><i>(x, y)</i><span><b>x</b>{format(model.x, 4)}</span><span><b>y</b>{format(model.y, 4)}</span></p><h4>Conversion</h4><div className="polar276-equation">x = r cos theta<br/>y = r sin theta</div><h4>Current values</h4><div className="polar276-current"><p>r = {format(radius, 4)} <small>({radius >= 0 ? "positive" : "negative"})</small></p><p>theta = {format(theta)} degrees</p><p>x = r cos theta</p><p>= {format(radius, 4)} cos {format(theta)} degrees</p><p>= {format(model.x, 4)}</p><p>y = r sin theta</p><p>= {format(radius, 4)} sin {format(theta)} degrees</p><p>= {format(model.y, 4)}</p></div></article>
        <article className="polar276-curve"><h3>POLAR CURVE TRACER</h3><select aria-label="Polar curve" value={curve} onChange={(event) => { setCurve(event.target.value as Curve); onInteraction(); }}><option value="cos">r = cos theta</option><option value="sin">r = sin theta</option><option value="double">r = cos 2theta</option></select><PolarCurveSvg curve={curve}/><p>Domain: theta in [-360 degrees, 360 degrees]</p><button type="button" onClick={() => { setTrace([]); onInteraction(); }}><Trash2/>Clear Trace</button></article>
      </div>
    </section>

    <section id="polar-section-1" className="polar276-flow">{[["1 Observe","Notice how r (distance) and theta (direction) place the point."],["Manipulate","Drag the blue point or adjust the sliders."],["Notice","Watch how x and y change when r or theta changes."],["Understand","Every polar point converts to a unique Cartesian point."]].map(([title,text], index) => <article key={title}><h3>{title}</h3><p>{text}</p>{index === 0 && <ul><li>theta is measured from the positive x-axis.</li><li>Positive r goes outward; negative r goes opposite.</li></ul>}</article>)}</section>

    <section className="polar276-learning"><article id="polar-section-3"><h2>Key Formulas</h2><b>Polar to Cartesian</b><p className="formula">x = r cos theta, &nbsp; y = r sin theta</p><b>Cartesian to Polar</b><p className="formula">r = sqrt(x^2 + y^2), &nbsp; theta = atan2(y, x)</p><b>Equivalent representations</b><p>(r, theta) = (r, theta + 360k) = (-r, theta + 180 + 360k).</p></article><article id="polar-section-2"><h2>Worked Example</h2><p>Convert (r, theta) = (2, 45 degrees) to Cartesian.</p><b>Solution:</b><p className="worked">x = 2 cos 45 degrees = sqrt(2)<br/><br/>y = 2 sin 45 degrees = sqrt(2)</p><p>Therefore, (x, y) = (sqrt(2), sqrt(2)) approximately (1.414, 1.414).</p></article><article><h2>Common Misconception</h2><b>Do not ignore the sign of r.</b><p>(-2, 30 degrees) is not the same as (2, 30 degrees). It points in the opposite direction.</p><MisconceptionSvg/></article></section>

    <section id="polar-practice" className="polar276-practice"><div><h2>Your Turn: Practice Challenge</h2><p>Convert the given polar coordinate to Cartesian coordinate.</p><strong>(r, theta) = (3, -60 degrees)</strong><p>Hint: x = r cos theta, &nbsp; y = r sin theta</p></div><div><h3>Your Answer</h3><label>x = <input aria-label="Practice x coordinate" value={answers[0]} onChange={(event) => { setAnswers([event.target.value, answers[1]]); setFeedback("idle"); }}/></label><label>y = <input aria-label="Practice y coordinate" value={answers[1]} onChange={(event) => { setAnswers([answers[0], event.target.value]); setFeedback("idle"); }}/></label><button type="button" onClick={check}>Check Answer</button>{feedback !== "idle" && <p role="status" className={feedback}>{feedback === "correct" ? "Correct Cartesian coordinates." : "Recalculate both coordinates."}</p>}</div><aside><h3>Quick Check / Solution</h3><p>x = 3 cos(-60 degrees) = 1.5</p><p>y = 3 sin(-60 degrees) = -3sqrt(3)/2</p><b>Answer: (x, y) = (1.5, -3sqrt(3)/2)</b></aside></section>
    <nav className="polar276-adjacent" aria-label="Adjacent lessons"><a href="/lessons/trigonometry/275-harmonic-motion"><ArrowLeft/><span><small>Previous</small>Harmonic Motion</span></a><a href="/lessons/trigonometry/277-trigonometric-identities"><span><small>Next Lesson</small>Trigonometric Identities</span><ArrowRight/></a></nav>
  </section>;
}

function polarModel(radius: number, theta: number) { const radians = theta * DEG; return { x: radius * Math.cos(radians), y: radius * Math.sin(radians), radians }; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function normalizeSigned(value: number) { let angle = value; while (angle > 180) angle -= 360; while (angle <= -180) angle += 360; return angle; }
function format(value: number, digits = 3) { const rounded = Math.abs(value) < 1e-10 ? 0 : value; return Number(rounded.toFixed(digits)).toString(); }

function PolarSlider({ label, min, max, step, value, display, suffix, onChange }: { label: string; min: number; max: number; step: number; value: number; display: string; suffix?: string; onChange: (value: number) => void }) { return <label className="polar276-slider"><b>{label}</b><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}/><input aria-label={`${label} exact value`} type="number" min={min} max={max} step={step} value={Number(value.toFixed(3))} onChange={(event) => onChange(Number(event.target.value))}/><span>{display !== String(Number(value.toFixed(3))) ? display : ""}{suffix}</span></label>; }

function PolarPointSvg({ model, theta, view, trace, onPoint }: { model: ReturnType<typeof polarModel>; theta: number; view: View; trace: TracePoint[]; onPoint: (event: ReactPointerEvent<SVGCircleElement>) => void }) { const px = 150 + model.x * 42, py = 150 - model.y * 42; return <svg className="polar276-point-svg" viewBox="0 0 300 300" role="img" aria-label="Draggable polar coordinate point and grid"><g className="grid">{[42,84,126].map((r) => <circle key={r} cx="150" cy="150" r={r}/>)}{Array.from({length:12},(_,i)=>{const a=i*30*DEG;return <line key={i} x1="150" y1="150" x2={150+126*Math.cos(a)} y2={150-126*Math.sin(a)}/>})}</g><line className="axis" x1="18" y1="150" x2="282" y2="150"/><line className="axis" x1="150" y1="18" x2="150" y2="282"/>{view === "trace" && trace.map((point,index)=>{const p=polarModel(point.r,point.theta);return <circle key={index} cx={150+p.x*42} cy={150-p.y*42} r="2" className="trace"/>})}{view === "cartesian" && <><line className="projection" x1={px} y1={py} x2={px} y2="150"/><line className="projection" x1={px} y1={py} x2="150" y2={py}/></>}<line className="radius" x1="150" y1="150" x2={px} y2={py}/><path className="angle" d={`M180 150 A30 30 0 0 ${theta < 0 ? 1 : 0} ${150+30*Math.cos(model.radians)} ${150-30*Math.sin(model.radians)}`}/><circle data-testid="polar-point-handle" cx={px} cy={py} r="7" tabIndex={0} onPointerDown={onPoint} onPointerMove={onPoint}/><text x={px+10} y={py-8}>(r, theta)</text><text x="276" y="143">0 degrees</text><text x="143" y="16">90 degrees</text><text x="3" y="143">180 degrees</text><text x="140" y="296">270 degrees</text></svg>; }

function PolarCurveSvg({ curve }: { curve: Curve }) { const points: string[][] = []; const part: string[] = []; for(let degree=-360; degree<=360; degree+=2){const t=degree*DEG;const r=curve === "cos" ? Math.cos(t) : curve === "sin" ? Math.sin(t) : Math.cos(2*t);const x=150+r*Math.cos(t)*100,y=150-r*Math.sin(t)*100;part.push(`${x},${y}`);} points.push(part); return <svg className="polar276-curve-svg" viewBox="0 0 300 300" role="img" aria-label="Selected polar curve"><g className="grid">{[50,100].map((r)=><circle key={r} cx="150" cy="150" r={r}/>)}{Array.from({length:12},(_,i)=>{const a=i*30*DEG;return <line key={i} x1="150" y1="150" x2={150+115*Math.cos(a)} y2={150-115*Math.sin(a)}/>})}</g><line className="axis" x1="25" y1="150" x2="275" y2="150"/><line className="axis" x1="150" y1="25" x2="150" y2="275"/>{points.map((value,index)=><polyline key={index} points={value.join(" ")}/>)}</svg>; }
function MisconceptionSvg(){return <svg className="polar276-misconception-svg" viewBox="0 0 250 90"><line x1="25" y1="65" x2="230" y2="65"/><line x1="130" y1="82" x2="130" y2="8"/><line className="positive" x1="130" y1="65" x2="215" y2="24"/><line className="negative" x1="130" y1="65" x2="45" y2="24"/><circle cx="130" cy="65" r="3"/><text x="205" y="20">(2, 30 degrees)</text><text x="10" y="20">(-2, 30 degrees)</text></svg>}
