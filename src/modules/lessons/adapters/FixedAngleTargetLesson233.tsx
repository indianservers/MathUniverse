import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  Expand,
  Globe2,
  Lightbulb,
  ListChecks,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
  Trophy,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./FixedAngleTargetLesson233.css";

type Point = { x: number; y: number };
type DragTarget = "origin" | "point" | null;
type Feedback = "idle" | "correct" | "incorrect";

const INITIAL_TARGET = 55;
const INITIAL_LENGTH = 10.99;
const QUICK_ANGLES = [0, 30, 45, 60, 90];
const MAIN_ORIGIN = { x: 0, y: 0 };

export default function FixedAngleTargetLesson233({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [origin, setOrigin] = useState<Point>(MAIN_ORIGIN);
  const [targetAngle, setTargetAngleState] = useState(INITIAL_TARGET);
  const [rayAngle, setRayAngle] = useState(INITIAL_TARGET);
  const [rayLength, setRayLength] = useState(INITIAL_LENGTH);
  const [locked, setLocked] = useState(true);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [showArc, setShowArc] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState("Explore");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [practiceTarget, setPracticeTarget] = useState(75);
  const [practiceAngle, setPracticeAngle] = useState(75);
  const [practiceLength, setPracticeLength] = useState(5.1);
  const [practiceLocked, setPracticeLocked] = useState(true);
  const [practiceDragging, setPracticeDragging] = useState(false);
  const [practiceFeedback, setPracticeFeedback] =
    useState<Feedback>("idle");

  const error = angularError(rayAngle, targetAngle);

  const reset = () => {
    setOrigin(MAIN_ORIGIN);
    setTargetAngleState(INITIAL_TARGET);
    setRayAngle(INITIAL_TARGET);
    setRayLength(INITIAL_LENGTH);
    setLocked(true);
    setDragging(null);
    setShowArc(true);
    setShowCoordinates(true);
    setShowGrid(true);
    setZoom(1);
    setTab("Explore");
    setShared(false);
    setPracticeTarget(75);
    setPracticeAngle(75);
    setPracticeLength(5.1);
    setPracticeLocked(true);
    setPracticeDragging(false);
    setPracticeFeedback("idle");
    onInteraction();
  };

  useEffect(() => {
    setOrigin(MAIN_ORIGIN);
    setTargetAngleState(INITIAL_TARGET);
    setRayAngle(INITIAL_TARGET);
    setRayLength(INITIAL_LENGTH);
    setLocked(true);
    setDragging(null);
    setShowArc(true);
    setShowCoordinates(true);
    setShowGrid(true);
    setZoom(1);
    setTab("Explore");
    setPracticeTarget(75);
    setPracticeAngle(75);
    setPracticeLength(5.1);
    setPracticeLocked(true);
    setPracticeDragging(false);
    setPracticeFeedback("idle");
  }, [resetToken]);

  const setTargetAngle = (value: number) => {
    const next = clamp(value, -180, 180);
    setTargetAngleState(next);
    if (locked) setRayAngle(next);
    onInteraction();
  };

  const setLock = (value: boolean) => {
    setLocked(value);
    if (value) setRayAngle(targetAngle);
    onInteraction();
  };

  const moveMain = (world: Point) => {
    if (dragging === "origin") {
      setOrigin({ x: clamp(world.x, -7, 5), y: clamp(world.y, -7, 7) });
    }
    if (dragging === "point") {
      const dx = world.x - origin.x;
      const dy = world.y - origin.y;
      setRayLength(clamp(Math.hypot(dx, dy), 1.5, 14));
      if (!locked) setRayAngle(normalizeSignedAngle(toDegrees(Math.atan2(dy, dx))));
    }
    onInteraction();
  };

  const checkPractice = () => {
    setPracticeFeedback(
      angularError(practiceAngle, practiceTarget) <= 1
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="target-fixed-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0290"
      data-dedicated-lesson="233"
      data-object-model="locked-origin-ray-angle"
      aria-label="Fixed Angle dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-fixed-header">
        <div>
          <span>Dynamic Geometry Construction</span>
          <h1>
            Fixed Angle <button type="button" aria-label="Bookmark Fixed Angle">☆</button>
          </h1>
          <p>Construct a ray that makes a fixed angle with a base line.</p>
          <section>
            <b><Target /> Foundational–Advanced</b>
            <b><Crosshair /> 6–10 min</b>
            <b><Sparkles /> Geometry Tools</b>
          </section>
        </div>
        <aside>
          <label>
            <Globe2 />
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                onInteraction();
              }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
          </label>
          <button type="button" onClick={reset}><RotateCcw /> Reset</button>
          <button
            type="button"
            aria-pressed={shared}
            onClick={() => {
              setShared((value) => !value);
              onInteraction();
            }}
          ><Share2 /> {shared ? "Shared" : "Share"}</button>
        </aside>
      </header>

      <nav className="target-fixed-tabs" aria-label="Fixed Angle lesson sections">
        {["Explore", "Steps", "Insight", "Try It"].map((name, index) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "is-active" : ""}
            onClick={() => {
              setTab(name);
              document.getElementById(name === "Try It" ? "fixed-practice" : "fixed-workspace")?.scrollIntoView({ block: "start" });
              onInteraction();
            }}
          >
            {index === 0 ? <Crosshair /> : index === 1 ? <ListChecks /> : index === 2 ? <Lightbulb /> : <Trophy />}
            {name}
          </button>
        ))}
        <label>
          <Crosshair />
          <select aria-label="Workspace mode" defaultValue="Workspace">
            <option>Workspace</option>
            <option>Presentation</option>
          </select>
        </label>
      </nav>

      <section id="fixed-workspace" className="target-fixed-workspace">
        <h2>Construction Workspace</h2>
        <div className="target-fixed-workspace-grid">
          <article className="target-fixed-graph-card">
            <div className="target-fixed-live">
              <AngleIcon angle={rayAngle} />
              <span>Live angle<strong data-testid="fixed-live-angle">{formatAngle(rayAngle)}</strong></span>
            </div>
            <FixedAngleGraph
              origin={origin}
              angle={rayAngle}
              length={rayLength}
              zoom={zoom}
              showGrid={showGrid}
              showArc={showArc}
              showCoordinates={showCoordinates}
              dragging={dragging}
              onDrag={setDragging}
              onMove={moveMain}
            />
            <footer>
              <label className="target-fixed-lock"><Lock /> Lock angle <Switch checked={locked} label="Lock main angle" onChange={setLock} /></label>
              <label><input type="checkbox" checked={showArc} onChange={(event) => { setShowArc(event.target.checked); onInteraction(); }} /> Show arc</label>
              <label><input type="checkbox" checked={showCoordinates} onChange={(event) => { setShowCoordinates(event.target.checked); onInteraction(); }} /> Show coords</label>
              <label><input type="checkbox" checked={showGrid} onChange={(event) => { setShowGrid(event.target.checked); onInteraction(); }} /> Grid</label>
              <div>
                <button type="button" aria-label="Zoom out" onClick={() => { setZoom((value) => clamp(value - 0.15, 0.7, 1.5)); onInteraction(); }}><ZoomOut /></button>
                <button type="button" aria-label="Zoom in" onClick={() => { setZoom((value) => clamp(value + 0.15, 0.7, 1.5)); onInteraction(); }}><ZoomIn /></button>
                <button type="button" aria-label="Reset graph view" onClick={() => { setZoom(1); onInteraction(); }}><Expand /></button>
              </div>
            </footer>
          </article>

          <aside className="target-fixed-controls">
            <article>
              <h3>Angle Target (θ)</h3>
              <AngleDial value={targetAngle} />
              <div className="target-fixed-stepper">
                <button type="button" aria-label="Decrease target angle" onClick={() => setTargetAngle(targetAngle - 1)}><Minus /></button>
                <input
                  aria-label="Target angle"
                  type="number"
                  min="-180"
                  max="180"
                  step="1"
                  value={targetAngle.toFixed(1)}
                  onChange={(event) => setTargetAngle(Number(event.target.value))}
                />
                <button type="button" aria-label="Increase target angle" onClick={() => setTargetAngle(targetAngle + 1)}><Plus /></button>
              </div>
              <hr />
              <h4>Quick set</h4>
              <div className="target-fixed-quick">
                {QUICK_ANGLES.map((value) => <button type="button" key={value} onClick={() => setTargetAngle(value)}>{value}°</button>)}
              </div>
            </article>
            <article className="target-fixed-result">
              <div><span>Current angle<strong data-testid="fixed-current-angle">{formatAngle(rayAngle)}</strong></span><span>Error<strong data-testid="fixed-angle-error">{error.toFixed(1)}°</strong></span></div>
              <p className={error <= 0.05 ? "is-correct" : ""} role="status">
                <Check /> {error <= 0.05 ? "Great! The angle matches the target." : `Adjust the ray by ${error.toFixed(1)}°.`}
              </p>
            </article>
          </aside>
        </div>
      </section>

      <section className="target-fixed-explain target-fixed-two-col">
        <article>
          <h2>Construction Steps</h2>
          {[
            "Draw a base line with endpoint O.",
            "Choose an angle θ using the dial.",
            "A ray OP is constructed from O.",
            "The ray stays locked at angle θ.",
            "Drag point P along the ray.",
          ].map((text, index) => <p key={text}><i>{index + 1}</i>{text}</p>)}
          <aside><Lightbulb /> <b>Tip:</b> Lock keeps the angle constant while you move point P.</aside>
        </article>
        <article>
          <h2>What’s Happening?</h2>
          <p><AngleIcon angle={55} /> The arc shows the angle between the base line and ray OP.</p>
          <p><RotateCcw /> Changing θ rotates the ray, but the angle remains constant.</p>
          <p><ArrowRight /> Moving point P changes length, not direction.</p>
          <p><Target /> Angle error shows how close you are to the target.</p>
        </article>
      </section>

      <section className="target-fixed-theory target-fixed-two-col">
        <article>
          <h2>Key Idea</h2>
          <p>A fixed angle θ determines the direction of a ray.</p>
          <div>
            <h3>Definition (Fixed Angle)</h3>
            <p>A ray OP forms a fixed angle θ with a base line if</p>
            <strong>∠(OX, OP) = θ.</strong>
            <small>Where OX is the positive direction of the base line.</small>
          </div>
        </article>
        <article>
          <h2>Worked Example</h2>
          <p>Construct a ray making 30° with the base line.</p>
          <div className="target-fixed-worked">
            <MiniAngle angle={30} />
            <ol>
              <li>Set θ = 30°.</li>
              <li>Ray OP is constructed.</li>
              <li>Angle ∠(OX, OP) = 30°.</li>
              <li>Drag P to explore.</li>
            </ol>
          </div>
          <aside><Check /> You will always see 30° as long as <b>Lock</b> is on.</aside>
        </article>
      </section>

      <section id="fixed-practice" className="target-fixed-practice">
        <header><h2>Try It</h2><p><b>Your Turn</b><span>Set the angle and position point P.</span></p></header>
        <div>
          <PracticeGraph
            angle={practiceAngle}
            length={practiceLength}
            locked={practiceLocked}
            dragging={practiceDragging}
            onDrag={setPracticeDragging}
            onMove={(angle, length) => {
              setPracticeLength(length);
              if (!practiceLocked) setPracticeAngle(angle);
              onInteraction();
            }}
          />
          <article className="target-fixed-practice-controls">
            <label>Target Angle
              <input
                aria-label="Practice target angle"
                type="number"
                min="0"
                max="180"
                value={practiceTarget}
                onChange={(event) => {
                  const next = clamp(Number(event.target.value), 0, 180);
                  setPracticeTarget(next);
                  if (practiceLocked) setPracticeAngle(next);
                  setPracticeFeedback("idle");
                  onInteraction();
                }}
              />
            </label>
            <label>Lock angle <Switch checked={practiceLocked} label="Lock practice angle" onChange={(value) => {
              setPracticeLocked(value);
              if (value) setPracticeAngle(practiceTarget);
              setPracticeFeedback("idle");
              onInteraction();
            }} /></label>
            <button type="button" onClick={checkPractice}><Check /> Check Answer</button>
          </article>
          <article className="target-fixed-practice-results">
            <h3>Your Results</h3>
            <div><span>Current angle<strong>{practiceFeedback === "idle" ? "— — —" : formatAngle(practiceAngle)}</strong></span><span>Error<strong>{practiceFeedback === "idle" ? "— — —" : `${angularError(practiceAngle, practiceTarget).toFixed(1)}°`}</strong></span></div>
            <p className={`is-${practiceFeedback}`} role="status">
              <Lightbulb />
              <span>
                <b>{practiceFeedback === "correct" ? "Correct" : practiceFeedback === "incorrect" ? "Keep adjusting" : "Hint"}</b>
                {practiceFeedback === "correct" ? "The locked ray matches the target angle." : practiceFeedback === "incorrect" ? "Lock the angle or drag P to the target direction." : "Use the angle dial or type a value, then click Check Answer."}
              </span>
            </p>
          </article>
        </div>
      </section>

      <nav className="target-fixed-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/232-angle"><ArrowLeft /><span><b>Previous</b>Angle</span></a>
        <section><b>233 of 420</b><i><span /></i></section>
        <a href="/lessons/geometry/234-relation-checker"><span><b>Next</b>Relation Checker</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function FixedAngleGraph({
  origin,
  angle,
  length,
  zoom,
  showGrid,
  showArc,
  showCoordinates,
  dragging,
  onDrag,
  onMove,
}: {
  origin: Point;
  angle: number;
  length: number;
  zoom: number;
  showGrid: boolean;
  showArc: boolean;
  showCoordinates: boolean;
  dragging: DragTarget;
  onDrag: (value: DragTarget) => void;
  onMove: (point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const scaleX = 22 * zoom;
  const scaleY = 17.2 * zoom;
  const center = { x: 220, y: 210 };
  const screen = (point: Point) => ({ x: center.x + point.x * scaleX, y: center.y - point.y * scaleY });
  const world = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = ref.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: (point.x - center.x) / scaleX, y: (center.y - point.y) / scaleY };
  };
  const o = screen(origin);
  const p = screen(polarPoint(origin, length, angle));
  const visualAngle = toDegrees(Math.atan2(scaleY * Math.sin(angle * Math.PI / 180), scaleX * Math.cos(angle * Math.PI / 180)));
  const arcEnd = polarScreen(o, 70, visualAngle);
  const normalized = ((visualAngle % 360) + 360) % 360;
  return (
    <svg
      ref={ref}
      viewBox="0 0 500 410"
      role="img"
      aria-label="Fixed angle graph with draggable origin O and constrained point P"
      onPointerMove={(event) => {
        if (!dragging) return;
        const next = world(event);
        if (next) onMove(next);
      }}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
    >
      <rect width="500" height="410" fill="#fff" />
      {showGrid && <g data-testid="fixed-grid" stroke="#e7eef7" strokeWidth="1">
        {Array.from({ length: 21 }, (_, index) => <line key={`v${index}`} x1={35 + index * 22} x2={35 + index * 22} y1="15" y2="390" />)}
        {Array.from({ length: 18 }, (_, index) => <line key={`h${index}`} x1="15" x2="485" y1={18 + index * 22} y2={18 + index * 22} />)}
      </g>}
      <g stroke="#64748b" strokeWidth="1.4">
        <line x1="12" x2="488" y1={center.y} y2={center.y} />
        <line x1={center.x} x2={center.x} y1="12" y2="398" />
      </g>
      <path d={`M ${center.x - 4} 18 L ${center.x} 10 L ${center.x + 4} 18`} fill="#64748b" />
      <path d={`M 482 ${center.y - 4} L 490 ${center.y} L 482 ${center.y + 4}`} fill="#64748b" />
      <text x="492" y={center.y + 5} fill="#334155" fontSize="11">x</text>
      <text x={center.x - 12} y="13" fill="#334155" fontSize="11">y</text>
      {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((value) => <g key={value} fill="#475569" fontSize="8">
        <text x={center.x + value * scaleX - 5} y={center.y + 16}>{value}</text>
        <text x={center.x - 20} y={center.y - value * scaleY + 3}>{value}</text>
      </g>)}
      <line data-testid="fixed-base-ray" x1={o.x} y1={o.y} x2={Math.min(485, o.x + 13 * scaleX)} y2={o.y} stroke="#64748b" strokeWidth="2" />
      <line data-testid="fixed-constrained-ray" x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="#1769e8" strokeWidth="3" />
      {showArc && <path data-testid="fixed-angle-arc" d={`M ${o.x + 70} ${o.y} A 70 70 0 ${normalized > 180 ? 1 : 0} 0 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 4" />}
      <text x={o.x + 77} y={o.y - 34} fill="#1769e8" fontSize="13" fontWeight="900">{formatAngle(angle)}</text>
      <circle
        data-testid="fixed-origin"
        data-x={origin.x.toFixed(6)}
        data-y={origin.y.toFixed(6)}
        cx={o.x}
        cy={o.y}
        r="7"
        fill="#1769e8"
        stroke="#0f3c94"
        strokeWidth="2"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onDrag("origin"); }}
      />
      <circle
        data-testid="fixed-point-p"
        data-x={polarPoint(origin, length, angle).x.toFixed(6)}
        data-y={polarPoint(origin, length, angle).y.toFixed(6)}
        data-length={length.toFixed(6)}
        cx={p.x}
        cy={p.y}
        r="7"
        fill="#1769e8"
        stroke="#0f3c94"
        strokeWidth="2"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onDrag("point"); }}
      />
      {showCoordinates && <g data-testid="fixed-coordinates" fill="#475569" fontSize="9">
        <text x={o.x + 8} y={o.y + 19}>O ({origin.x.toFixed(2)}, {origin.y.toFixed(2)})</text>
        <text x={p.x - 24} y={p.y - 13}>P ({polarPoint(origin, length, angle).x.toFixed(2)}, {polarPoint(origin, length, angle).y.toFixed(2)})</text>
      </g>}
    </svg>
  );
}

function PracticeGraph({ angle, length, locked, dragging, onDrag, onMove }: {
  angle: number;
  length: number;
  locked: boolean;
  dragging: boolean;
  onDrag: (value: boolean) => void;
  onMove: (angle: number, length: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const center = { x: 132, y: 125 };
  const endpoint = polarScreen(center, length * 20, angle);
  return <svg
    ref={ref}
    viewBox="0 0 300 170"
    role="img"
    aria-label="Practice fixed angle graph with draggable point P"
    onPointerMove={(event) => {
      if (!dragging || !ref.current) return;
      const matrix = ref.current.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      const dx = point.x - center.x;
      const dy = center.y - point.y;
      const nextAngle = normalizeSignedAngle(toDegrees(Math.atan2(dy, dx)));
      onMove(locked ? angle : nextAngle, clamp(Math.hypot(dx, dy) / 20, 2, 7));
    }}
    onPointerUp={() => onDrag(false)}
    onPointerCancel={() => onDrag(false)}
  >
    <rect width="300" height="170" fill="#fff" />
    <g stroke="#edf2f7">{Array.from({ length: 15 }, (_, i) => <line key={`v${i}`} x1={10 + i * 20} x2={10 + i * 20} y1="5" y2="165" />)}{Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="5" x2="295" y1={5 + i * 20} y2={5 + i * 20} />)}</g>
    <line x1="8" x2="292" y1={center.y} y2={center.y} stroke="#64748b" />
    <line x1={center.x} x2={center.x} y1="7" y2="163" stroke="#64748b" />
    <line x1={center.x} y1={center.y} x2={endpoint.x} y2={endpoint.y} stroke="#1769e8" strokeWidth="2.5" />
    <path d={`M ${center.x + 40} ${center.y} A 40 40 0 0 0 ${polarScreen(center, 40, angle).x} ${polarScreen(center, 40, angle).y}`} fill="none" stroke="#38bdf8" strokeDasharray="5 4" />
    <circle cx={center.x} cy={center.y} r="6" fill="#1769e8" />
    <circle data-testid="fixed-practice-point" data-angle={angle.toFixed(6)} data-length={length.toFixed(6)} cx={endpoint.x} cy={endpoint.y} r="6" fill="#1769e8" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onDrag(true); }} />
    <text x={endpoint.x + 7} y={endpoint.y - 7} fill="#172554" fontSize="10" fontWeight="800">P</text>
    <text x={center.x - 14} y={center.y + 17} fill="#334155" fontSize="9">O</text>
    <text x="285" y={center.y + 12} fill="#334155" fontSize="9">x</text>
    <text x={center.x - 13} y="13" fill="#334155" fontSize="9">y</text>
  </svg>;
}

function AngleDial({ value }: { value: number }) {
  const start = polarScreen({ x: 80, y: 77 }, 52, -140);
  const end = polarScreen({ x: 80, y: 77 }, 52, 140);
  const progress = ((clamp(value, -180, 180) + 180) / 360) * 280;
  const handle = polarScreen({ x: 80, y: 77 }, 52, progress - 140);
  return <svg viewBox="0 0 160 130" role="img" aria-label={`Angle target dial set to ${value.toFixed(1)} degrees`}>
    <defs><linearGradient id="fixed-dial-gradient"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
    <path d={`M ${start.x} ${start.y} A 52 52 0 1 0 ${end.x} ${end.y}`} fill="none" stroke="#dbeafe" strokeWidth="8" strokeLinecap="round" />
    <path d={`M ${start.x} ${start.y} A 52 52 0 ${progress > 180 ? 1 : 0} 0 ${handle.x} ${handle.y}`} fill="none" stroke="url(#fixed-dial-gradient)" strokeWidth="8" strokeLinecap="round" />
    <circle cx={handle.x} cy={handle.y} r="6" fill="#fff" stroke="#168ddd" strokeWidth="2" />
    <text x="80" y="78" textAnchor="middle" fill="#0876c9" fontSize="24" fontWeight="900">{value.toFixed(1)}°</text>
    <text x="80" y="99" textAnchor="middle" fill="#64748b" fontSize="8">-180° to 180°</text>
  </svg>;
}

function AngleIcon({ angle }: { angle: number }) {
  const end = polarScreen({ x: 20, y: 24 }, 15, angle);
  return <svg viewBox="0 0 42 34" aria-hidden="true"><path d="M 5 28 L 36 28" stroke="#168ddd" strokeWidth="2" /><path d={`M 5 28 L ${end.x + 4} ${end.y + 4}`} stroke="#168ddd" strokeWidth="2" /><path d="M 19 28 A 14 14 0 0 0 13 17" fill="none" stroke="#38bdf8" /></svg>;
}

function MiniAngle({ angle }: { angle: number }) {
  const o = { x: 18, y: 82 };
  const p = polarScreen(o, 112, angle);
  return <svg viewBox="0 0 180 100" role="img" aria-label="Worked example fixed thirty degree angle"><line x1={o.x} y1={o.y} x2="168" y2={o.y} stroke="#334155" /><line x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="#1769e8" strokeWidth="2" /><path d={`M ${o.x + 42} ${o.y} A 42 42 0 0 0 ${polarScreen(o, 42, angle).x} ${polarScreen(o, 42, angle).y}`} fill="none" stroke="#38bdf8" strokeDasharray="4 3" /><circle cx={o.x} cy={o.y} r="4" fill="#1769e8" /><circle cx={p.x} cy={p.y} r="4" fill="#1769e8" /><text x={o.x - 5} y={o.y + 14} fontSize="9">O</text><text x={p.x + 6} y={p.y} fontSize="9">P</text><text x={o.x + 55} y={o.y - 12} fill="#1769e8" fontSize="10" fontWeight="800">{angle}°</text></svg>;
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <button type="button" className={`target-fixed-switch ${checked ? "is-on" : ""}`} role="switch" aria-label={label} aria-checked={checked} onClick={() => onChange(!checked)}><i /></button>;
}

function polarPoint(origin: Point, radius: number, angle: number): Point {
  const radians = angle * Math.PI / 180;
  return { x: origin.x + radius * Math.cos(radians), y: origin.y + radius * Math.sin(radians) };
}

function polarScreen(origin: Point, radius: number, angle: number): Point {
  const radians = angle * Math.PI / 180;
  return { x: origin.x + radius * Math.cos(radians), y: origin.y - radius * Math.sin(radians) };
}

function angularError(a: number, b: number) {
  return Math.abs(normalizeSignedAngle(a - b));
}

function normalizeSignedAngle(value: number) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function toDegrees(value: number) {
  return value * 180 / Math.PI;
}

function formatAngle(value: number) {
  return `${value.toFixed(1)}°`;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}
