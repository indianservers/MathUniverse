import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Eye,
  Move,
  RotateCcw,
  Target,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Drag = "center" | "radius" | "angle" | null;
type Tool = "select" | "move";

const initialCenter = { x: 0, y: 0 };
const initialRadius = 5;
const initialAngle = 60;
const practiceTarget = { radius: 7, angle: 120 };

export default function CircularSectorTargetLesson225({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [radius, setRadius] = useState(initialRadius);
  const [angle, setAngle] = useState(initialAngle);
  const [drag, setDrag] = useState<Drag>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [showHandles, setShowHandles] = useState(true);
  const [stage, setStage] = useState(0);
  const [practiceRadius, setPracticeRadius] = useState(practiceTarget.radius);
  const [practiceAngle, setPracticeAngle] = useState(practiceTarget.angle);
  const [practiceFeedback, setPracticeFeedback] = useState<
    "idle" | "correct" | "incorrect"
  >("correct");

  const theta = (angle * Math.PI) / 180;
  const arcLength = radius * theta;
  const area = 0.5 * radius * radius * theta;
  const match =
    Math.abs(radius - initialRadius) <= 0.05 &&
    Math.abs(angle - initialAngle) <= 0.05;
  const fraction = useMemo(() => simplifyFraction(Math.round(angle), 360), [angle]);

  const reset = () => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setAngle(initialAngle);
    setDrag(null);
    setTool("select");
    setShowHandles(true);
    onInteraction();
  };

  useEffect(() => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setAngle(initialAngle);
    setDrag(null);
    setTool("select");
    setShowHandles(true);
  }, [resetToken]);

  const setLiveRadius = (value: number) => {
    setRadius(clamp(value, 1, 10));
    onInteraction();
  };

  const setLiveAngle = (value: number) => {
    setAngle(clamp(value, 1, 359));
    onInteraction();
  };

  const tryExample = () => {
    setCenter(initialCenter);
    setRadius(6);
    setAngle(90);
    onInteraction();
  };

  const checkPractice = () => {
    setPracticeFeedback(
      Math.abs(practiceRadius - practiceTarget.radius) <= 0.05 &&
        Math.abs(practiceAngle - practiceTarget.angle) <= 0.05
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="target-sector-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0282"
      data-dedicated-lesson="225"
      data-object-model="center-radius-angle-sector"
      aria-label="Circular Sector dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-sector-header">
        <div>
          <div className="flex gap-2"><span>Geometry</span><span>Dynamic Geometry Constructions</span></div>
          <h1>Circular Sector</h1>
          <p>Construct sectors. Explore radius, angle, arc length and area.</p>
        </div>
        <div className="target-sector-meta"><Meta icon={<UserRound />} label="Level" value="Middle" /><Meta icon={<Clock3 />} label="Time" value="6–10 min" /><Meta icon={<BarChart3 />} label="Focus" value="Construction" /></div>
      </header>

      <nav className="target-sector-stages" aria-label="Lesson stages">
        {[
          ["Observe & Manipulate", "Explore the sector"],
          ["Notice the Pattern", "What changes?"],
          ["Understand the Rule", "Formulas & ideas"],
          ["Try Independently", "Practice your skills"],
        ].map(([title, subtitle], index) => (
          <button key={title} type="button" className={stage === index ? "is-active" : ""} onClick={() => { setStage(index); onInteraction(); }}>
            <b>{index + 1}</b><span><strong>{title}</strong><small>{subtitle}</small></span>
          </button>
        ))}
      </nav>

      <section className="target-sector-workspace">
        <article className="target-sector-plot-card">
          <div className="target-sector-plot-title"><div><h2>Explore the circular sector</h2><p>Drag the controls or the handles on the circle.</p></div><button type="button" aria-label="Move sector" aria-pressed={tool === "move"} onClick={() => { setTool((value) => value === "move" ? "select" : "move"); onInteraction(); }}><Move /></button></div>
          <SectorPlot center={center} radius={radius} angle={angle} drag={drag} tool={tool} showHandles={showHandles} onDrag={setDrag} onCenter={(value) => { setCenter(value); onInteraction(); }} onRadius={setLiveRadius} onAngle={setLiveAngle} />
          <button type="button" className="target-sector-reset" onClick={reset}><RotateCcw /> Reset</button>
          <div className="target-sector-legend"><span><i className="is-radius" />Radius <em>r</em></span><span><i className="is-arc" />Arc <em>AB</em></span><span><i className="is-sector" />Sector <em>OAB</em></span></div>
        </article>

        <aside className="target-sector-side">
          <section className="target-sector-panel target-sector-controls">
            <h2>Controls</h2>
            <SectorControl label="Radius r" aria="Sector radius" value={radius} min={1} max={10} unit="units" onChange={setLiveRadius} />
            <SectorControl label="Central angle θ" aria="Sector central angle" value={angle} min={1} max={359} unit="°" onChange={setLiveAngle} />
          </section>
          <section className="target-sector-panel target-sector-results">
            <h2>Results</h2>
            <div className="target-sector-fraction"><div style={{ "--fraction": `${angle}deg` } as CSSProperties}><span>{fraction[0]}</span><hr /><span>{fraction[1]}</span></div><b>{((angle / 360) * 100).toFixed(2)}%</b></div>
            <Result label="Arc length L" formula="L = rθ" value={`${arcLength.toFixed(2)} units`} />
            <Result label="Area of sector A" formula="A = ½ r²θ" value={`${area.toFixed(2)} sq units`} />
          </section>
          <section className="target-sector-panel target-sector-match">
            <h2>Practice target</h2><p>Use the controls to match the target.</p>
            <div><span>Angle target<b>60°</b></span><span>Radius target<b>5</b></span><output className={match ? "is-correct" : ""}><Check />{match ? "Great match!" : "Keep adjusting"}<small>Angle: {format(angle)}° · Radius: {format(radius)}</small></output></div>
          </section>
        </aside>
      </section>

      <section className="target-sector-learning">
        <article className="target-sector-card target-sector-example">
          <h2>Worked example</h2><p>Example: <em>r</em> = 6 units, <em>θ</em> = 90°</p>
          <div><MiniSector /><section><b>Arc length</b><p>L = rθ</p><p>= 6 × π/2</p><p>= 3π units</p><b>Area</b><p>A = ½ r²θ</p><p>= ½ × 6² × π/2</p><p>= 9π sq units</p></section></div>
          <button type="button" onClick={tryExample}><CircleDot /> Try this example</button>
        </article>
        <article className="target-sector-card target-sector-steps">
          <h2>Construction steps</h2>
          {["Draw a circle with center O and radius r.", "Mark a point A on the circle.", "At O, set the central angle θ.", "Mark the second point B that forms the angle θ with OA.", "The shaded region OAB is the circular sector."].map((text, index) => <p key={text}><b>{index + 1}</b>{text}</p>)}
          <button type="button" onClick={() => { setShowHandles((value) => !value); onInteraction(); }}><Eye /> {showHandles ? "Hide handles" : "Show handles"}</button>
        </article>
        <article className="target-sector-card target-sector-formulas">
          <h2>Key idea & formulas</h2><p><strong>A circular sector</strong> is the region bounded by two radii and the intercepted arc.</p><p>Let <em>r</em> be the radius and <em>θ</em> the central angle in radians.</p>
          <div className="target-sector-formula-grid"><Formula label="Arc length" value="L = rθ" /><Formula label="Area of sector" value="A = ½r²θ" /><Formula label="Fraction of circle" value="θ / 2π" /></div>
          <div className="target-sector-conversion">Conversion: <em>θ</em> (rad) = <span>π<i />180</span> × <em>θ</em>°</div>
        </article>
      </section>

      <section className="target-sector-practice">
        <div><h2>Try it yourself</h2><p>Adjust <em>r</em> and <em>θ</em> to meet the target. Click Check Answer.</p></div>
        <section className="target-sector-target"><Target /><span><b>Target</b>Angle: 120°<br />Radius: 7 units</span></section>
        <SectorControl label="Radius r" aria="Practice sector radius" value={practiceRadius} min={1} max={10} unit="units" onChange={(value) => { setPracticeRadius(value); setPracticeFeedback("idle"); onInteraction(); }} compact />
        <SectorControl label="Angle θ" aria="Practice sector angle" value={practiceAngle} min={1} max={359} unit="°" onChange={(value) => { setPracticeAngle(value); setPracticeFeedback("idle"); onInteraction(); }} compact />
        <output role="status" className={practiceFeedback === "correct" ? "is-correct" : practiceFeedback === "incorrect" ? "is-wrong" : ""}><b>Your answers</b><span>Angle: {format(practiceAngle)}° {practiceFeedback === "correct" && <Check />}</span><span>Radius: {format(practiceRadius)} units {practiceFeedback === "correct" && <Check />}</span>{practiceFeedback === "incorrect" && <small>Match both target values.</small>}</output>
        <button type="button" className="target-sector-check" onClick={checkPractice}><CheckCircle2 /> Check Answer</button>
      </section>

      <nav className="target-sector-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/224-circumcircular-arc"><ArrowLeft /><span><b>Previous</b>Circumcircular Arc</span></a>
        <a href="/concept-map">Concept Map</a>
        <a href="/lessons/geometry/226-conic-through-five-points"><span><b>Next</b>Conic Through Five Points</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function SectorPlot({ center, radius, angle, drag, tool, showHandles, onDrag, onCenter, onRadius, onAngle }: { center: Point; radius: number; angle: number; drag: Drag; tool: Tool; showHandles: boolean; onDrag: (value: Drag) => void; onCenter: (value: Point) => void; onRadius: (value: number) => void; onAngle: (value: number) => void }) {
  const origin = { x: 225 + center.x * 24, y: 204 - center.y * 24 };
  const scale = 36.5;
  const r = radius * scale;
  const radians = (angle * Math.PI) / 180;
  const a = { x: origin.x + r, y: origin.y };
  const b = { x: origin.x + r * Math.cos(radians), y: origin.y - r * Math.sin(radians) };
  const large = angle > 180 ? 1 : 0;
  const sectorPath = `M ${origin.x} ${origin.y} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 0 ${b.x} ${b.y} Z`;
  const arcPath = `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 0 ${b.x} ${b.y}`;
  const domain = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const point = svg.createSVGPoint(); point.x = clientX; point.y = clientY;
    const local = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: (local.x - 225) / 24, y: (204 - local.y) / 24, local };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const next = domain(event.currentTarget, event.clientX, event.clientY);
    if (drag === "center") onCenter({ x: clamp(next.x, -4, 4), y: clamp(next.y, -4, 4) });
    if (drag === "radius") onRadius(Math.hypot(next.local.x - origin.x, next.local.y - origin.y) / scale);
    if (drag === "angle") {
      const degrees = ((Math.atan2(origin.y - next.local.y, next.local.x - origin.x) * 180) / Math.PI + 360) % 360;
      onAngle(degrees || 1);
    }
  };
  return <svg role="img" aria-label="Interactive circular sector with draggable center radius and angle handles" viewBox="0 0 520 455" onPointerMove={move} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)} onPointerDown={() => { if (tool === "move") onDrag("center"); }}>
    <defs><pattern id="sector-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#e7edf5" /></pattern></defs>
    <rect width="520" height="455" fill="url(#sector-grid)" />
    <line x1="20" y1={origin.y} x2="500" y2={origin.y} stroke="#aab6c7" /><line x1={origin.x} y1="18" x2={origin.x} y2="435" stroke="#aab6c7" />
    <path data-testid="sector-fill" data-area={areaOf(radius, angle).toFixed(6)} d={sectorPath} fill="#dbeeff" stroke="none" />
    <circle cx={origin.x} cy={origin.y} r={r} fill="none" stroke="#2f7ee6" strokeWidth="1.4" />
    <line x1={origin.x} y1={origin.y} x2={a.x} y2={a.y} stroke="#1397ee" strokeWidth="2.2" /><line x1={origin.x} y1={origin.y} x2={b.x} y2={b.y} stroke="#1397ee" strokeWidth="2.2" />
    <path data-testid="sector-arc" data-arc-length={(radius * angle * Math.PI / 180).toFixed(6)} d={arcPath} fill="none" stroke="#7148ed" strokeWidth="2.2" strokeDasharray="5 3" />
    <path d={`M ${origin.x + 34} ${origin.y} A 34 34 0 ${angle > 180 ? 1 : 0} 0 ${origin.x + 34 * Math.cos(radians)} ${origin.y - 34 * Math.sin(radians)}`} fill="none" stroke="#1899e9" />
    <text x={origin.x + 44 * Math.cos(radians / 2)} y={origin.y - 44 * Math.sin(radians / 2)} fontSize="15" fontWeight="700">θ</text>
    <text x={origin.x - 53} y={origin.y + 20} fontSize="11">O ({format(center.x)}, {format(center.y)})</text><text x={a.x + 8} y={a.y + 20} fontSize="11">A (r, 0)</text><text x={b.x + 8} y={b.y - 9} fontSize="12" fontWeight="700">B</text>
    <text x={(origin.x + b.x) / 2 - 5} y={(origin.y + b.y) / 2 - 8} fill="#1673ca" fontSize="12" fontWeight="700">r</text><text x={(a.x + b.x) / 2 + 16} y={(a.y + b.y) / 2 - 5} fill="#6238d6" fontSize="12" fontWeight="700">Arc AB</text>
    {showHandles && <><circle data-testid="sector-center-handle" cx={origin.x} cy={origin.y} r="7" fill="#1286d5" onPointerDown={(event) => { event.stopPropagation(); onDrag("center"); }} /><circle data-testid="sector-radius-handle" cx={a.x} cy={a.y} r="7" fill="#1286d5" onPointerDown={(event) => { event.stopPropagation(); onDrag("radius"); }} /><circle data-testid="sector-angle-handle" cx={b.x} cy={b.y} r="7" fill="#7148ed" onPointerDown={(event) => { event.stopPropagation(); onDrag("angle"); }} /></>}
  </svg>;
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <section>{icon}<span>{label}<b>{value}</b></span></section>; }
function SectorControl({ label, aria, value, min, max, unit, onChange, compact = false }: { label: string; aria: string; value: number; min: number; max: number; unit: string; onChange: (value: number) => void; compact?: boolean }) { return <label className={compact ? "is-compact" : ""}><span>{label}</span><div><input type="range" aria-label={`${aria} slider`} min={min} max={max} step="1" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value))} /><input type="number" aria-label={aria} min={min} max={max} step="1" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value))} /><em>{unit}</em></div><small><i>{min}{label.includes("angle") || label.includes("Angle") ? "°" : ""}</i><i>{max}{label.includes("angle") || label.includes("Angle") ? "°" : ""}</i></small></label>; }
function Result({ label, formula, value }: { label: string; formula: string; value: string }) { return <section className="target-sector-result"><span>{label}<em>{formula}</em></span><b>{value}</b></section>; }
function Formula({ label, value }: { label: string; value: string }) { return <section><span>{label}</span><b>{value}</b></section>; }
function MiniSector() { return <svg role="img" aria-label="Worked example sector with radius six and angle ninety degrees" viewBox="0 0 145 145"><circle cx="67" cy="76" r="51" fill="none" stroke="#94a3b8" /><path d="M67 76L118 76A51 51 0 0 0 67 25Z" fill="#dbeeff" stroke="#1686d9" /><circle cx="67" cy="76" r="4" /><circle cx="118" cy="76" r="4" /><circle cx="67" cy="25" r="4" /><text x="54" y="91">O</text><text x="122" y="86">A</text><text x="72" y="19">B</text><text x="75" y="66" fontWeight="700">90°</text></svg>; }
function areaOf(radius: number, angle: number) { return 0.5 * radius * radius * angle * Math.PI / 180; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min)); }
function format(value: number) { return Math.abs(value) < 0.005 ? "0" : Number(value.toFixed(2)).toString(); }
function simplifyFraction(numerator: number, denominator: number): [number, number] { let a = Math.abs(numerator); let b = denominator; while (b) { const next = a % b; a = b; b = next; } const divisor = a || 1; return [numerator / divisor, denominator / divisor]; }
