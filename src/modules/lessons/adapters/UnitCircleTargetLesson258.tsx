import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./UnitCircleTargetLesson258.css";

type Unit = "degrees" | "radians";
type Choice = "A" | "B" | "C" | "D";
const INITIAL_ANGLE = 30;
const QUICK_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];

export default function UnitCircleTargetLesson258({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [unit, setUnit] = useState<Unit>("degrees");
  const [tab, setTab] = useState("Interactive Lab");
  const [choice, setChoice] = useState<Choice | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const model = useMemo(() => circleModel(angle), [angle]);

  const updateAngle = (next: number, notify = true) => {
    setAngle(round(clamp(next, -360, 360), 1));
    if (notify) onInteraction();
  };
  const reset = (notify = true) => {
    setAngle(INITIAL_ANGLE);
    setUnit("degrees");
    setTab("Interactive Lab");
    setChoice(null);
    setFeedback("idle");
    if (notify) onInteraction();
  };
  useEffect(() => {
    setAngle(INITIAL_ANGLE);
    setUnit("degrees");
    setTab("Interactive Lab");
    setChoice(null);
    setFeedback("idle");
  }, [resetToken]);

  const selectTab = (name: string) => {
    setTab(name);
    const target = name === "Interactive Lab" ? ".target-unit-circle-workspace" : name === "Explain" || name === "Formulas" ? ".target-unit-circle-identity" : ".target-unit-circle-learning";
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
    onInteraction();
  };
  const grade = () => {
    setFeedback(choice === "A" ? "correct" : "incorrect");
    updateAngle(-60, false);
    onInteraction();
  };

  return (
    <section
      className="target-unit-circle-page"
      data-testid="trigonometry-mockup-0315"
      data-dedicated-lesson="258"
      data-object-model="linked-unit-circle-point-projection-coordinate-identity"
      data-angle-degrees={angle.toFixed(1)}
      data-normalized-degrees={model.normalized.toFixed(1)}
      data-cos={model.cos.toFixed(6)}
      data-sin={model.sin.toFixed(6)}
      data-identity={model.identity.toFixed(6)}
      data-quadrant={model.quadrant}
      data-active-tab={tab}
    >
      <header className="target-unit-circle-header">
        <div className="target-unit-circle-title">
          <span>Trigonometry</span>
          <h1>Unit Circle</h1>
          <p>Derive trig values geometrically.</p>
          <section><b>♙ Intermediate-Advanced</b><b>ϟ Visual Lab</b><b>▣ Trig Graphing / Geometry</b><b>◷ 6-10 min</b></section>
        </div>
        <QuadrantBadge />
        <footer>
          <button type="button" onClick={() => onInteraction()}>⚑ English (English)⌄</button>
          <button type="button" onClick={() => reset()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => {
            void navigator.clipboard?.writeText(`Unit-circle point at ${formatDegrees(angle)}: (${format(model.cos)}, ${format(model.sin)})`);
            onInteraction();
          }}><Share2 />Share</button>
          <button type="button" onClick={() => {
            document.querySelector(".target-unit-circle-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
            onInteraction();
          }}>↗ Workspace</button>
        </footer>
      </header>

      <nav className="target-unit-circle-tabs" aria-label="Unit circle lesson views">
        {["Interactive Lab", "Explain", "Examples", "Formulas", "Know more"].map((name, index) => {
          const Icon = [Eye, Lightbulb, Target, Target, Lightbulb][index];
          return <button type="button" key={name} className={tab === name ? "active" : ""} onClick={() => selectTab(name)}><Icon />{name}</button>;
        })}
      </nav>

      <section className="target-unit-circle-steps">
        {[
          [Eye, "Observe", "Explore the unit circle. Note angle, point and projections."],
          [Hand, "Manipulate", "Drag the point or adjust the angle slider. Watch values update."],
          [Lightbulb, "Notice", "cos θ is the x-projection. sin θ is the y-projection. cos²θ + sin²θ = 1"],
          [Target, "Understand", "Any angle θ corresponds to a unique point (cos θ, sin θ) on the unit circle."],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}><Icon /><span><b>{String(title)}</b><p>{String(text)}</p></span>{index < 3 ? <ArrowRight /> : null}</article>
        ))}
      </section>

      <section className="target-unit-circle-workspace">
        <header>
          <h2>Unit Circle - linked angle</h2>
          <div><strong>θ = {formatDegrees(angle)} = {radianLabel(angle).replace(" rad", "")}</strong><button type="button" className={unit === "degrees" ? "active" : ""} onClick={() => { setUnit("degrees"); onInteraction(); }}>Deg</button><button type="button" className={unit === "radians" ? "active" : ""} onClick={() => { setUnit("radians"); onInteraction(); }}>Rad</button></div>
        </header>
        <div>
          <article className="target-unit-circle-canvas">
            <LinkedCircle angle={angle} model={model} onAngle={updateAngle} />
            <p><b>Drag the point on the circle</b><br />or use the slider to change θ.</p>
            <input aria-label="Unit circle angle" type="range" min="-180" max="180" step="1" value={model.principal} onChange={(e) => updateAngle(Number(e.target.value))} />
            <label><span>−180°</span><input aria-label="Exact unit circle angle" type="number" step="0.1" value={angle} onChange={(e) => updateAngle(Number(e.target.value))} /><span>180°</span></label>
            <h3>Quick angles</h3>
            <div className="target-unit-circle-quick">{QUICK_ANGLES.map((value) => <button type="button" key={value} className={angle === value ? "active" : ""} onClick={() => updateAngle(value)}>{value}°</button>)}</div>
          </article>
          <aside className="target-unit-circle-readouts">
            <section><h3>Projections &amp; Coordinates</h3><p><i />cos θ (x) = <b>{format(model.cos)}</b></p><p><i />sin θ (y) = <b>{format(model.sin)}</b></p><p><i />P (cos θ, sin θ)<strong>({format(model.cos)}, {format(model.sin)})</strong></p></section>
            <section><h3>Domains &amp; Ranges</h3><p>θ ∈ ℝ (all real numbers)</p><p>cos θ ∈ [−1, 1]</p><p>sin θ ∈ [−1, 1]</p></section>
            <section className="target-unit-circle-signs"><h3>Signs by Quadrant</h3><div><b>Quadrant</b><b>cos θ (x)</b><b>sin θ (y)</b>{["I", "II", "III", "IV"].map((q, index) => <div key={q} className={`target-unit-circle-sign-row ${model.quadrant === q ? "active" : ""}`}><span><b>{q}</b><small>{["(0° to 90°)", "(90° to 180°)", "(180° to 270°)", "(270° to 360°)"][index]}</small></span><strong>{index === 0 || index === 3 ? "+" : "−"}</strong><strong>{index < 2 ? "+" : "−"}</strong></div>)}</div></section>
          </aside>
        </div>
        <footer className="target-unit-circle-identity"><h3>⌘ Pythagorean Identity (Unit Circle Rule)</h3><b>cos²θ + sin²θ = 1 &nbsp; for all θ</b><span>Check:<strong>({format(model.cos)})² + ({format(model.sin)})² = {format(model.cos * model.cos)} + {format(model.sin * model.sin)} = {model.identity.toFixed(4)}</strong></span><em><Check />True</em></footer>
      </section>

      <section className="target-unit-circle-learning">
        <article><h2>Worked Example</h2><h3>Find (cos 135°, sin 135°) on the unit circle.</h3><ExampleCircle /><footer><b>cos 135° = −√2/2, &nbsp; sin 135° = √2/2</b><strong>Point: (−√2/2, √2/2)</strong></footer></article>
        <article><h2><TriangleAlert />Common Misconception</h2><p><b>Mistake:</b> Thinking cos 135° = √2/2</p><p><b>Why it’s wrong:</b><br />135° is in Quadrant II, where cos θ (x) is negative.</p><p><b>Correct:</b> cos 135° = −√2/2</p><MisconceptionCircle /></article>
        <article className="target-unit-circle-practice"><h2>Your Turn: Quick Check</h2><p>Move the point to θ = −60°.<br />What are cos θ and sin θ?</p><div>{(["A", "B", "C", "D"] as Choice[]).map((value) => <label key={value} className={choice === value ? "selected" : ""}><input type="radio" name="unit-circle-answer" checked={choice === value} onChange={() => { setChoice(value); setFeedback("idle"); onInteraction(); }} /><b>{value}.</b><span>{({ A: "(1/2, −√3/2)", B: "(1/2, √3/2)", C: "(−1/2, −√3/2)", D: "(−1/2, √3/2)" })[value]}</span></label>)}</div><button type="button" onClick={grade}>Check Answer</button><footer className={feedback} role="status">{feedback === "correct" ? <><Check />Correct. The point is in Quadrant IV.</> : feedback === "incorrect" ? <><TriangleAlert />Check the sign of the x-coordinate.</> : <><Lightbulb />Hint: −60° is in Quadrant IV.</>}</footer></article>
      </section>

      <nav className="target-unit-circle-nav"><a href="/lessons/trigonometry/257-angle-measurement"><ArrowLeft /><span><b>Previous</b>Angle Measurement</span></a><a href="/lessons/trigonometry/259-right-triangle-ratios"><span><b>Next</b>Right-Triangle Ratios</span><ArrowRight /></a></nav>
    </section>
  );
}

function LinkedCircle({ angle, model, onAngle }: { angle: number; model: ReturnType<typeof circleModel>; onAngle: (value: number) => void }) {
  const svg = useRef<SVGSVGElement>(null), dragging = useRef(false), c = { x: 199, y: 190 }, r = 153;
  const p = { x: c.x + r * model.cos, y: c.y - r * model.sin };
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    const matrix = svg.current?.getScreenCTM(); if (!matrix) return;
    const q = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const normalized = normalize(Math.atan2(c.y - q.y, q.x - c.x) * 180 / Math.PI), candidates = [normalized - 360, normalized, normalized + 360];
    onAngle(candidates.reduce((best, value) => Math.abs(value - angle) < Math.abs(best - angle) ? value : best));
  };
  return <svg ref={svg} className="target-unit-circle-graph" viewBox="0 0 450 390" role="img" aria-label="Linked draggable point on the unit circle" onPointerMove={(e) => { if (dragging.current) update(e); }} onPointerUp={() => { dragging.current = false; }}>
    <line x1="32" x2="423" y1={c.y} y2={c.y} stroke="#334155" /><line x1={c.x} x2={c.x} y1="17" y2="363" stroke="#334155" /><circle cx={c.x} cy={c.y} r={r} fill="#fbfdff" stroke="#64748b" strokeWidth="1.4" />
    <line x1={c.x} y1={c.y} x2={p.x} y2={p.y} stroke="#7446d8" strokeWidth="2.2" /><line x1={p.x} y1={p.y} x2={p.x} y2={c.y} stroke="#18a7aa" strokeDasharray="5 3" /><line x1={c.x} y1={p.y} x2={p.x} y2={p.y} stroke="#2563eb" strokeDasharray="5 3" />
    <path d={arcPath(c.x, c.y, 39, model.normalized)} fill="none" stroke="#0891b2" strokeWidth="2" /><text x={c.x + 45} y={c.y - 12} fontSize="13">θ</text>
    <circle data-testid="unit-circle-point" data-angle={angle.toFixed(1)} cx={p.x} cy={p.y} r="7" fill="#7446d8" onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }} />
    <circle cx={c.x} cy={p.y} r="4" fill="#2563eb" /><circle cx={p.x} cy={c.y} r="4" fill="#18a7aa" />
    <text x={p.x + 8} y={p.y - 8} fontSize="12" fontWeight="800">P (cos θ, sin θ)</text><text x={c.x - 40} y={p.y + 4} fontSize="12" fill="#2563eb">sin θ</text><text x={p.x - 16} y={c.y + 20} fontSize="12" fill="#07989d">cos θ</text><text x={(c.x + p.x) / 2} y={(c.y + p.y) / 2 - 7} fontSize="12">1</text>
    <text x="409" y={c.y - 8} fontSize="11">x (cos θ)</text><text x={c.x + 7} y="14" fontSize="11">y (sin θ)</text><text x={c.x - 16} y={c.y + 18}>O</text>
    <text x={c.x + r + 8} y={c.y - 7}>0°</text><text x={c.x - 16} y={c.y - r - 7}>90°</text><text x={c.x - r - 28} y={c.y - 7}>180°</text><text x={c.x + 7} y={c.y + r + 18}>270°</text>
    <text x={c.x + r + 7} y={c.y + 18}>(1, 0)</text><text x={c.x - r - 46} y={c.y + 5}>(−1, 0)</text><text x={c.x + 7} y={c.y + r + 34}>(0, −1)</text>
  </svg>;
}

function QuadrantBadge() { return <svg className="target-unit-circle-quadrant" viewBox="0 0 210 145" aria-label="Quadrant sign overview"><circle cx="103" cy="73" r="51" fill="none" stroke="#64748b" /><line x1="45" x2="163" y1="73" y2="73" stroke="#64748b" /><line x1="103" x2="103" y1="14" y2="132" stroke="#64748b" /><text x="155" y="78">x (cos θ)</text><text x="91" y="12">y (sin θ)</text><text x="73" y="43">SII</text><text x="126" y="43">SI</text><text x="72" y="102">SIII</text><text x="125" y="102">SIV</text><text x="75" y="58" fill="#f97316">−</text><text x="129" y="58" fill="#f97316">+</text><text x="75" y="117" fill="#ef4444">−</text><text x="129" y="117" fill="#f59e0b">−</text></svg>; }
function ExampleCircle() { return <svg className="target-unit-circle-example-graph" viewBox="0 0 200 155"><line x1="12" x2="187" y1="82" y2="82" stroke="#64748b" /><line x1="100" x2="100" y1="8" y2="148" stroke="#64748b" /><circle cx="100" cy="82" r="55" fill="none" stroke="#64748b" /><line x1="100" y1="82" x2="61" y2="43" stroke="#2563eb" /><line x1="61" y1="43" x2="61" y2="82" stroke="#0891b2" strokeDasharray="3 2" /><circle cx="61" cy="43" r="4" fill="#7446d8" /><text x="32" y="42" fill="#2563eb">√2/2</text><text x="25" y="112" fill="#0891b2">−√2/2</text><text x="108" y="76">135°</text></svg>; }
function MisconceptionCircle() { return <svg className="target-unit-circle-example-graph" viewBox="0 0 200 140"><line x1="20" x2="180" y1="75" y2="75" stroke="#64748b" /><line x1="100" x2="100" y1="8" y2="135" stroke="#64748b" /><circle cx="100" cy="75" r="52" fill="none" stroke="#64748b" /><path d="M100 75L63 38A52 52 0 0 0 48 75Z" fill="#fee2e2" stroke="#ef4444" /><text x="106" y="68">135°</text><text x="54" y="32">QII</text><text x="28" y="89">−1</text></svg>; }
function circleModel(angle: number) { const radians = angle * Math.PI / 180, normalized = normalize(angle), cos = clean(Math.cos(radians)), sin = clean(Math.sin(radians)), identity = cos * cos + sin * sin, principal = normalized > 180 ? normalized - 360 : normalized, quadrant = normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270 ? "axis" : normalized < 90 ? "I" : normalized < 180 ? "II" : normalized < 270 ? "III" : "IV"; return { radians, normalized, cos, sin, identity, principal, quadrant }; }
function arcPath(cx: number, cy: number, radius: number, angle: number) { const end = Math.min(angle, 359.99), start = polar(cx, cy, radius, end), finish = polar(cx, cy, radius, 0); return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${end <= 180 ? 0 : 1} 0 ${finish.x} ${finish.y}`; }
function polar(cx: number, cy: number, radius: number, angle: number) { const a = (angle - 90) * Math.PI / 180; return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }; }
function radianLabel(degrees: number) { if (Math.abs(degrees) < .05) return "0 rad"; const scaled = Math.round(degrees * 10), denominator = 1800, divisor = gcd(Math.abs(scaled), denominator), numerator = scaled / divisor, bottom = denominator / divisor, sign = numerator < 0 ? "−" : "", top = Math.abs(numerator); return `${sign}${top === 1 ? "" : top}π${bottom === 1 ? "" : `/${bottom}`} rad`; }
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }
function normalize(value: number) { return ((value % 360) + 360) % 360; }
function format(value: number) { return Math.abs(value) < 1e-10 ? "0.0000" : value.toFixed(4); }
function formatDegrees(value: number) { return `${Number.isInteger(value) ? value : value.toFixed(1)}°`; }
function clean(value: number) { return Math.abs(value) < 1e-12 ? 0 : value; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function round(value: number, places: number) { const factor = 10 ** places; return Math.round(value * factor) / factor; }
