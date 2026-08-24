import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Circle as CircleIcon,
  Eraser,
  FilePenLine,
  Globe2,
  Hand,
  Lightbulb,
  ListChecks,
  Menu,
  MousePointer2,
  PenLine,
  RotateCcw,
  Sigma,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./RelationCheckerTargetLesson234.css";

type Point = { x: number; y: number };
type LineModel = { id: "l" | "m"; a: Point; b: Point; color: string };
type Relation = "Parallel" | "Perpendicular" | "Equal" | "Tangent" | "Incident" | "Congruent";
type Tool = "select" | "move";
type Drag = "l-a" | "l-b" | "m-a" | "m-b" | null;
type ExtraKind = "point" | "line" | "segment" | "ray" | "circle";
type Feedback = "idle" | "correct" | "incorrect";

const INITIAL_L: LineModel = { id: "l", a: { x: -2, y: -1 }, b: { x: 2, y: 3 }, color: "#1769e8" };
const INITIAL_M: LineModel = { id: "m", a: { x: -2, y: 3 }, b: { x: 2, y: -1 }, color: "#7c3aed" };
const RELATIONS: Relation[] = ["Parallel", "Perpendicular", "Equal", "Tangent", "Incident", "Congruent"];

export default function RelationCheckerTargetLesson234({ resetToken, onInteraction }: LessonAdapterProps) {
  const [lineL, setLineL] = useState<LineModel>(INITIAL_L);
  const [lineM, setLineM] = useState<LineModel>(INITIAL_M);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState<["l" | "m", "l" | "m"]>(["l", "m"]);
  const [relation, setRelation] = useState<Relation>("Perpendicular");
  const [autoCheck, setAutoCheck] = useState(true);
  const [manualChecked, setManualChecked] = useState(true);
  const [tool, setTool] = useState<Tool>("select");
  const [drag, setDrag] = useState<Drag>(null);
  const [extras, setExtras] = useState<ExtraKind[]>([]);
  const [tab, setTab] = useState("Explore");
  const [language, setLanguage] = useState("English (English)");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [practiceAngle, setPracticeAngle] = useState(0);
  const [practiceDrag, setPracticeDrag] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState<Feedback>("idle");

  const result = useMemo(() => checkLineRelation(lineL, lineM, relation), [lineL, lineM, relation]);
  const slopeL = slope(lineL);
  const slopeM = slope(lineM);
  const checked = autoCheck || manualChecked;

  const reset = () => {
    setLineL(INITIAL_L);
    setLineM(INITIAL_M);
    setVisible(true);
    setSelected(["l", "m"]);
    setRelation("Perpendicular");
    setAutoCheck(true);
    setManualChecked(true);
    setTool("select");
    setDrag(null);
    setExtras([]);
    setNotesOpen(false);
    setMenuOpen(false);
    setPracticeAngle(0);
    setPracticeDrag(false);
    setPracticeFeedback("idle");
    onInteraction();
  };

  useEffect(() => {
    setLineL(INITIAL_L);
    setLineM(INITIAL_M);
    setVisible(true);
    setSelected(["l", "m"]);
    setRelation("Perpendicular");
    setAutoCheck(true);
    setManualChecked(true);
    setTool("select");
    setDrag(null);
    setExtras([]);
    setTab("Explore");
    setPracticeAngle(0);
    setPracticeDrag(false);
    setPracticeFeedback("idle");
  }, [resetToken]);

  const mutateLine = (which: Drag, point: Point) => {
    if (!which) return;
    const next = { x: clamp(point.x, -7, 7), y: clamp(point.y, -6, 6) };
    const update = which.startsWith("l") ? setLineL : setLineM;
    update((line) => {
      if (tool === "move") {
        const anchor = which.endsWith("a") ? line.a : line.b;
        const dx = next.x - anchor.x;
        const dy = next.y - anchor.y;
        return { ...line, a: { x: line.a.x + dx, y: line.a.y + dy }, b: { x: line.b.x + dx, y: line.b.y + dy } };
      }
      return which.endsWith("a") ? { ...line, a: next } : { ...line, b: next };
    });
    if (!autoCheck) setManualChecked(false);
    onInteraction();
  };

  const addObject = (kind: ExtraKind) => {
    setExtras((items) => [...items, kind]);
    setVisible(true);
    onInteraction();
  };

  const checkPractice = () => {
    const difference = Math.abs(normalizeAngle(practiceAngle - 90));
    setPracticeFeedback(Math.abs(difference - 90) <= 1 ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      className="target-relation-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0291"
      data-dedicated-lesson="234"
      data-object-model="typed-object-exact-relation-predicates"
      data-object-count={(visible ? 2 : 0) + extras.length}
      aria-label="Relation Checker dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-relation-header">
        <div>
          <span>Dynamic Geometry Construction</span>
          <h1>Relation Checker</h1>
          <p>Verify and explore geometric relationships.</p>
          <section>
            <b><Target /> Foundational–Advanced</b>
            <b><Sparkles /> Construction Studio</b>
            <b><FilePenLine /> Geometry Tools</b>
            <b><CrosshairIcon /> 6–10 min</b>
          </section>
        </div>
        <aside>
          <h2>Learning goals</h2>
          <p><Check /> Identify relationships between geometric objects.</p>
          <p><Check /> Test and justify results visually.</p>
          <p><Check /> Build geometric reasoning.</p>
          <label><Globe2 /><select aria-label="Lesson language" value={language} onChange={(event) => { setLanguage(event.target.value); onInteraction(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label>
        </aside>
      </header>

      <nav className="target-relation-tabs" aria-label="Relation Checker lesson sections">
        {[
          ["Explore", "Build & observe"],
          ["Explain", "Understand"],
          ["Examples", "Worked cases"],
          ["Formulas", "Key ideas"],
          ["Practice", "Try it yourself"],
        ].map(([name, subtitle], index) => <button type="button" key={name} className={tab === name ? "is-active" : ""} onClick={() => { setTab(name); document.getElementById(name === "Practice" ? "relation-practice" : "relation-workspace")?.scrollIntoView({ block: "start" }); onInteraction(); }}>
          {index === 0 ? <Target /> : index === 1 ? <FilePenLine /> : index === 2 ? <Lightbulb /> : index === 3 ? <Sigma /> : <Trophy />}
          <span><b>{name}</b><small>{subtitle}</small></span>
        </button>)}
      </nav>

      <section id="relation-workspace" className="target-relation-workspace">
        <header>
          <div><h2>Build &amp; test relationships</h2><p>Select two objects in the workspace. The relation checker shows the result with visual evidence.</p></div>
          <button type="button" onClick={() => { setVisible(false); setExtras([]); onInteraction(); }}><Eraser /> Clear</button>
          <label>Auto-check <Switch checked={autoCheck} label="Auto-check relations" onChange={(value) => { setAutoCheck(value); setManualChecked(value); onInteraction(); }} /></label>
        </header>
        <div className="target-relation-main-grid">
          <aside className="target-relation-tools">
            <h3>Add objects</h3>
            {(["point", "line", "segment", "ray", "circle"] as ExtraKind[]).map((kind) => <button type="button" key={kind} onClick={() => addObject(kind)}>
              {kind === "circle" ? <CircleIcon /> : kind === "point" ? <i /> : kind === "line" ? <PenLine /> : kind === "segment" ? <MinusLine /> : <ArrowRight />}
              {capitalize(kind)}
            </button>)}
            <h3>Edit</h3>
            <button type="button" className={tool === "select" ? "is-active" : ""} onClick={() => { setTool("select"); onInteraction(); }}><MousePointer2 /> Select</button>
            <button type="button" className={tool === "move" ? "is-active" : ""} onClick={() => { setTool("move"); onInteraction(); }}><Hand /> Move</button>
          </aside>

          <RelationGraph
            lineL={lineL}
            lineM={lineM}
            visible={visible}
            extras={extras}
            drag={drag}
            selected={selected}
            onDrag={setDrag}
            onMove={mutateLine}
            onSelect={(id) => { setSelected((items) => items[1] === id ? [items[0], id] : [items[1], id]); onInteraction(); }}
          />

          <aside className="target-relation-checker">
            <h3>Relation checker</h3>
            <label>Selected objects</label>
            <div className="target-relation-selected"><button type="button" onClick={() => setSelected(["m", "l"])}><i className="is-blue" /> Line ℓ</button><span>⇄</span><button type="button" onClick={() => setSelected(["l", "m"])}><i /> Line m</button></div>
            <label>Test relation</label>
            <fieldset>{RELATIONS.map((name) => <label key={name} className={relation === name ? "is-active" : ""}><input type="radio" name="relation-kind" value={name} checked={relation === name} onChange={() => { setRelation(name); setManualChecked(autoCheck); onInteraction(); }} />{name}{name === "Parallel" ? " (∥)" : name === "Perpendicular" ? " (⊥)" : name === "Equal" ? " (=)" : ""}</label>)}</fieldset>
            {!autoCheck && <button type="button" className="target-relation-run" onClick={() => { setManualChecked(true); onInteraction(); }}>Run check</button>}
            <RelationEvidence relation={relation} result={result} checked={checked} slopeL={slopeL} slopeM={slopeM} visible={visible} />
            <footer>
              <button type="button" onClick={() => { setNotesOpen((value) => !value); onInteraction(); }}><FilePenLine /> Add to Notes</button>
              <button type="button" aria-label="Relation checker menu" onClick={() => setMenuOpen((value) => !value)}><Menu /></button>
              {menuOpen && <menu><button type="button" onClick={() => { setNotes(`${relation}: ${result ? "true" : "false"}`); setNotesOpen(true); setMenuOpen(false); }}>Copy evidence to notes</button></menu>}
            </footer>
            {notesOpen && <textarea aria-label="Relation notes" value={notes} placeholder="Record your justification..." onChange={(event) => setNotes(event.target.value)} />}
          </aside>
        </div>

        <section className="target-relation-learning">
          <article><h2>Construction steps <small>(example)</small></h2>{["Add line ℓ through A(0, 0) and B(2, 2).", "Add line m through C(0, 0) and D(1, −1).", "Select ℓ and m.", "Choose Perpendicular."].map((text, index) => <p key={text}><i>{index + 1}</i>{text}</p>)}<button type="button" onClick={reset}><RotateCcw /> Reset construction</button></article>
          <article><h2>What do you notice?</h2><p>When two lines are perpendicular, their slopes are negative reciprocals and they intersect to form right angles.</p><aside>Notice the 90° angle at the intersection.</aside><MiniPerpendicular /></article>
          <article><h2>Key idea</h2><p>Lines ℓ and m are perpendicular if and only if</p><strong>m<sub>ℓ</sub> · m<sub>m</sub> = −1</strong><small>(for non-vertical lines).</small><p>They intersect to form four 90° angles.</p></article>
        </section>
      </section>

      <section id="relation-practice" className="target-relation-practice">
        <header><h2>Try it yourself</h2><p>Complete the task using the tools above. Then check your result.</p></header>
        <div>
          <PracticeRelationGraph angle={practiceAngle} dragging={practiceDrag} onDrag={setPracticeDrag} onAngle={(value) => { setPracticeAngle(value); setPracticeFeedback("idle"); onInteraction(); }} />
          <article><h3>Task</h3><p>Draw two lines so that they are perpendicular.</p><div><h3>Your result</h3><p>Select ℓ and m, then choose <b>Perpendicular</b>.</p></div></article>
          <article><p><Lightbulb /><span><b>Tip</b>Make one line vertical or horizontal to start.</span></p><button type="button" onClick={checkPractice}>Check my relation</button><output className={`is-${practiceFeedback}`} role="status">{practiceFeedback === "correct" ? "Correct: the lines are perpendicular." : practiceFeedback === "incorrect" ? "Not yet: adjust line m to form 90°." : ""}</output></article>
        </div>
      </section>

      <nav className="target-relation-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/233-fixed-angle"><ArrowLeft /><span><b>Previous</b>233 Fixed Angle</span></a>
        <a href="/lessons"><ListChecks /> Back to lesson list</a>
        <a href="/lessons/geometry/235-construction-steps"><span><b>Next</b>235 Construction Steps</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function RelationGraph({ lineL, lineM, visible, extras, drag, selected, onDrag, onMove, onSelect }: {
  lineL: LineModel; lineM: LineModel; visible: boolean; extras: ExtraKind[]; drag: Drag;
  selected: ["l" | "m", "l" | "m"];
  onDrag: (value: Drag) => void; onMove: (which: Drag, point: Point) => void; onSelect: (id: "l" | "m") => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const origin = { x: 210, y: 205 }, scale = 32;
  const screen = (point: Point) => ({ x: origin.x + point.x * scale, y: origin.y - point.y * scale });
  const world = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!ref.current) return null;
    const matrix = ref.current.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: (point.x - origin.x) / scale, y: (origin.y - point.y) / scale };
  };
  const lClip = clipInfiniteLine(lineL, -6.5, 6.5, -6, 6);
  const mClip = clipInfiniteLine(lineM, -6.5, 6.5, -6, 6);
  const inter = lineIntersection(lineL, lineM);
  return <svg ref={ref} viewBox="0 0 470 420" role="img" aria-label="Relation workspace with draggable lines l and m and point A" onPointerMove={(event) => { if (!drag) return; const point = world(event); if (point) onMove(drag, point); }} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)}>
    <rect width="470" height="420" fill="#fff" />
    <g stroke="#e7eef7">{Array.from({ length: 15 }, (_, i) => <line key={`v${i}`} x1={34 + i * 28} x2={34 + i * 28} y1="18" y2="402" />)}{Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="18" x2="452" y1={37 + i * 28} y2={37 + i * 28} />)}</g>
    <g stroke="#64748b" strokeWidth="1.3"><line x1="10" x2="460" y1={origin.y} y2={origin.y} /><line x1={origin.x} x2={origin.x} y1="10" y2="410" /></g>
    <path d={`M 454 ${origin.y - 4} L 462 ${origin.y} L 454 ${origin.y + 4}`} fill="#64748b" /><path d={`M ${origin.x - 4} 16 L ${origin.x} 8 L ${origin.x + 4} 16`} fill="#64748b" />
    <text x="463" y={origin.y + 5} fontSize="10">x</text><text x={origin.x - 10} y="12" fontSize="10">y</text>
    {[-6,-4,-2,0,2,4,6].map((value) => <g key={value} fill="#334155" fontSize="9"><text x={origin.x + value * scale - 6} y={origin.y + 17}>{value}</text>{value !== 0 && <text x={origin.x - 18} y={origin.y - value * scale + 3}>{value}</text>}</g>)}
    {visible && <>
      <line data-testid="relation-line-l" data-slope={finiteSlope(slope(lineL))} data-selected={selected.includes("l")} x1={screen(lClip[0]).x} y1={screen(lClip[0]).y} x2={screen(lClip[1]).x} y2={screen(lClip[1]).y} stroke={lineL.color} strokeWidth="2.4" onPointerDown={() => { onSelect("l"); onDrag("l-b"); }} />
      <line data-testid="relation-line-m" data-slope={finiteSlope(slope(lineM))} data-selected={selected.includes("m")} x1={screen(mClip[0]).x} y1={screen(mClip[0]).y} x2={screen(mClip[1]).x} y2={screen(mClip[1]).y} stroke={lineM.color} strokeWidth="2.2" onPointerDown={() => { onSelect("m"); onDrag("m-b"); }} />
      <text x={screen(lClip[1]).x - 17} y={screen(lClip[1]).y - 10} fill={lineL.color} fontSize="15" fontWeight="900" fontStyle="italic">ℓ</text>
      <text x={screen(mClip[1]).x - 15} y={screen(mClip[1]).y - 9} fill={lineM.color} fontSize="15" fontWeight="900" fontStyle="italic">m</text>
      {([...[lineL.a, lineL.b].map((point, index) => [point, `l-${index ? "b" : "a"}`] as const), ...[lineM.a, lineM.b].map((point, index) => [point, `m-${index ? "b" : "a"}`] as const)]).map(([point, id]) => <circle key={id} data-testid={`relation-handle-${id}`} cx={screen(point).x} cy={screen(point).y} r={id.startsWith("l") ? 6 : 8} fill={id.startsWith("l") ? lineL.color : "transparent"} stroke={id.startsWith("l") ? "#0f3c94" : "transparent"} strokeWidth="1.5" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onDrag(id as Drag); }} />)}
      <text x={screen(lineL.b).x + 8} y={screen(lineL.b).y - 10} fill="#172554" fontSize="10" fontWeight="800">A (2, 3)</text>
      <text x={screen(lineL.a).x - 34} y={screen(lineL.a).y + 22} fill="#172554" fontSize="10" fontWeight="800">B (−2, −1)</text>
      {inter && <RightAngleMarker point={screen(inter)} line={lineL} scale={15} />}
    </>}
    <ExtraObjects kinds={extras} screen={screen} />
  </svg>;
}

function RelationEvidence({ relation, result, checked, slopeL, slopeM, visible }: { relation: Relation; result: boolean; checked: boolean; slopeL: number; slopeM: number; visible: boolean }) {
  const ready = visible && checked;
  const label = !ready ? "Ready to check" : result ? relation : `Not ${relation.toLowerCase()}`;
  return <section className={`target-relation-evidence ${ready && result ? "is-valid" : ""}`} data-testid="relation-result" data-valid={ready && result}>
    <h4>{ready && result && <Check />} {label}</h4>
    {ready && <>
      <strong>{result && relation === "Perpendicular" ? "ℓ ⟂ m" : result ? `Relation ${relation.toLowerCase()} holds` : "The selected relation does not hold."}</strong>
      <p>Evidence</p>
      <span>Slopes: m<sub>ℓ</sub> = {formatSlope(slopeL)}, m<sub>m</sub> = {formatSlope(slopeM)}</span>
      {Number.isFinite(slopeL) && Number.isFinite(slopeM) && <span>m<sub>ℓ</sub> · m<sub>m</sub> = {formatNumber(slopeL * slopeM)}</span>}
      <span>⇒ Lines are {result ? relation.toLowerCase() : `not ${relation.toLowerCase()}`}.</span>
    </>}
  </section>;
}

function PracticeRelationGraph({ angle, dragging, onDrag, onAngle }: { angle: number; dragging: boolean; onDrag: (value: boolean) => void; onAngle: (value: number) => void }) {
  const ref = useRef<SVGSVGElement>(null), center = { x: 95, y: 88 }, radius = 70, endpoint = polarScreen(center, radius, angle);
  return <svg ref={ref} viewBox="0 0 190 160" role="img" aria-label="Practice perpendicular lines with draggable line m" onPointerMove={(event) => { if (!dragging || !ref.current) return; const matrix = ref.current.getScreenCTM(); if (!matrix) return; const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()); onAngle(normalizeAngle(toDegrees(Math.atan2(center.y - point.y, point.x - center.x)))); }} onPointerUp={() => onDrag(false)} onPointerCancel={() => onDrag(false)}>
    <rect width="190" height="160" fill="#fff" /><line x1={center.x} y1="10" x2={center.x} y2="150" stroke="#1769e8" strokeWidth="2" /><line x1={center.x - radius * Math.cos(angle * Math.PI / 180)} y1={center.y + radius * Math.sin(angle * Math.PI / 180)} x2={endpoint.x} y2={endpoint.y} stroke="#1769e8" strokeWidth="2" /><circle data-testid="relation-practice-handle" data-angle={angle.toFixed(6)} cx={endpoint.x} cy={endpoint.y} r="7" fill="transparent" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onDrag(true); }} /><path d={`M ${center.x + 14} ${center.y} L ${center.x + 14} ${center.y - 14} L ${center.x} ${center.y - 14}`} fill="none" stroke="#38bdf8" /><text x="103" y="19" fontSize="10" fontStyle="italic">ℓ</text><text x={endpoint.x - 5} y={endpoint.y - 8} fontSize="10" fontStyle="italic">m</text>
  </svg>;
}

function MiniPerpendicular() { return <svg viewBox="0 0 230 110" role="img" aria-label="Perpendicular lines forming a ninety degree angle"><line x1="40" y1="91" x2="185" y2="15" stroke="#1769e8" strokeWidth="2" /><line x1="43" y1="18" x2="183" y2="92" stroke="#7c3aed" strokeWidth="2" /><path d="M 105 56 L 116 48 L 124 59 L 113 67 Z" fill="none" stroke="#34d399" /><text x="130" y="65" fill="#059669" fontSize="13" fontWeight="900">90°</text></svg>; }

function ExtraObjects({ kinds, screen }: { kinds: ExtraKind[]; screen: (point: Point) => Point }) {
  return <g data-testid="relation-extra-objects">{kinds.map((kind, index) => {
    const offset = index * 0.35;
    if (kind === "point") { const p = screen({ x: -4 + offset, y: 4.5 - offset }); return <circle key={`${kind}-${index}`} cx={p.x} cy={p.y} r="5" fill="#f97316" />; }
    if (kind === "circle") { const p = screen({ x: 4 - offset, y: -3 + offset }); return <circle key={`${kind}-${index}`} cx={p.x} cy={p.y} r="30" fill="none" stroke="#f97316" strokeWidth="2" />; }
    const a = screen({ x: -5 + offset, y: -4 + index * .2 }), b = screen({ x: -2 + offset, y: -3 + index * .2 });
    return <line key={`${kind}-${index}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f97316" strokeWidth="2" strokeDasharray={kind === "ray" ? "0" : kind === "line" ? "4 3" : undefined} />;
  })}</g>;
}

function RightAngleMarker({ point }: { point: Point; line: LineModel; scale: number }) { return <path d={`M ${point.x + 12} ${point.y} L ${point.x + 12} ${point.y - 12} L ${point.x} ${point.y - 12}`} fill="none" stroke="#34d399" strokeWidth="1.5" />; }
function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) { return <button type="button" className={`target-relation-switch ${checked ? "is-on" : ""}`} role="switch" aria-label={label} aria-checked={checked} onClick={() => onChange(!checked)}><i /></button>; }
function CrosshairIcon() { return <Target />; }
function MinusLine() { return <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="17" x2="20" y2="7" stroke="currentColor" strokeWidth="2" /><circle cx="4" cy="17" r="2" fill="currentColor" /><circle cx="20" cy="7" r="2" fill="currentColor" /></svg>; }

function checkLineRelation(first: LineModel, second: LineModel, relation: Relation) {
  const u = unitDirection(first), v = unitDirection(second), cross = Math.abs(u.x * v.y - u.y * v.x), dot = Math.abs(u.x * v.x + u.y * v.y);
  if (relation === "Parallel") return cross < 0.015;
  if (relation === "Perpendicular") return dot < 0.015;
  if (relation === "Equal") return cross < 0.015 && pointLineDistance(first.a, second) < 0.05;
  if (relation === "Incident") return Boolean(lineIntersection(first, second));
  return false;
}
function unitDirection(line: LineModel) { const dx = line.b.x - line.a.x, dy = line.b.y - line.a.y, length = Math.hypot(dx, dy) || 1; return { x: dx / length, y: dy / length }; }
function slope(line: LineModel) { const dx = line.b.x - line.a.x; return Math.abs(dx) < 1e-8 ? Number.POSITIVE_INFINITY : (line.b.y - line.a.y) / dx; }
function pointLineDistance(point: Point, line: LineModel) { const u = unitDirection(line); return Math.abs((point.x - line.a.x) * u.y - (point.y - line.a.y) * u.x); }
function lineIntersection(first: LineModel, second: LineModel): Point | null { const p = first.a, r = { x: first.b.x - first.a.x, y: first.b.y - first.a.y }, q = second.a, s = { x: second.b.x - second.a.x, y: second.b.y - second.a.y }, cross = r.x * s.y - r.y * s.x; if (Math.abs(cross) < 1e-8) return null; const t = ((q.x - p.x) * s.y - (q.y - p.y) * s.x) / cross; return { x: p.x + t * r.x, y: p.y + t * r.y }; }
function clipInfiniteLine(line: LineModel, minX: number, maxX: number, minY: number, maxY: number): [Point, Point] { const dx = line.b.x - line.a.x, dy = line.b.y - line.a.y, candidates: Point[] = []; if (Math.abs(dx) > 1e-8) { for (const x of [minX, maxX]) { const t = (x - line.a.x) / dx, y = line.a.y + t * dy; if (y >= minY && y <= maxY) candidates.push({ x, y }); } } if (Math.abs(dy) > 1e-8) { for (const y of [minY, maxY]) { const t = (y - line.a.y) / dy, x = line.a.x + t * dx; if (x >= minX && x <= maxX) candidates.push({ x, y }); } } return candidates.length >= 2 ? [candidates[0], candidates[1]] : [line.a, line.b]; }
function polarScreen(origin: Point, radius: number, angle: number): Point { const radians = angle * Math.PI / 180; return { x: origin.x + radius * Math.cos(radians), y: origin.y - radius * Math.sin(radians) }; }
function normalizeAngle(value: number) { return ((value % 180) + 180) % 180; }
function toDegrees(value: number) { return value * 180 / Math.PI; }
function formatSlope(value: number) { return Number.isFinite(value) ? formatNumber(value) : "undefined"; }
function finiteSlope(value: number) { return Number.isFinite(value) ? value.toFixed(6) : "Infinity"; }
function formatNumber(value: number) { const rounded = Math.round(value * 100) / 100; return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2); }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function clamp(value: number, minimum: number, maximum: number) { return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum)); }
