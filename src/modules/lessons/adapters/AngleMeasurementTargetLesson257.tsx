import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Share2,
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
import "./AngleMeasurementTargetLesson257.css";

type Unit = "degrees" | "radians";
type Choice = "A" | "B" | "C" | "D";
const INITIAL_ANGLE = 60;
const SPECIAL_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];

export default function AngleMeasurementTargetLesson257({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [unit, setUnit] = useState<Unit>("degrees");
  const [answer, setAnswer] = useState<Choice>("C");
  const [feedback, setFeedback] = useState<"correct" | "incorrect">("correct");
  const model = useMemo(() => angleModel(angle), [angle]);

  const updateAngle = (next: number, notify = true) => {
    setAngle(round(clamp(next, -360, 360), 1));
    if (notify) onInteraction();
  };
  const reset = (notify = true) => {
    setAngle(INITIAL_ANGLE);
    setUnit("degrees");
    setAnswer("C");
    setFeedback("correct");
    if (notify) onInteraction();
  };
  useEffect(() => {
    setAngle(INITIAL_ANGLE);
    setUnit("degrees");
    setAnswer("C");
    setFeedback("correct");
  }, [resetToken]);

  const choose = (choice: Choice) => {
    setAnswer(choice);
    setFeedback(choice === "C" ? "correct" : "incorrect");
    onInteraction();
  };
  const nearestSpecial = () => {
    const nearest = SPECIAL_ANGLES.reduce((best, candidate) =>
      Math.abs(candidate - model.normalized) < Math.abs(best - model.normalized)
        ? candidate
        : best,
    );
    updateAngle(nearest);
  };

  return (
    <section
      className="target-angle-measurement-page"
      data-testid="trigonometry-mockup-0314"
      data-dedicated-lesson="257"
      data-object-model="oriented-unit-circle-degree-radian-angle-measurement"
      data-angle-degrees={angle.toFixed(1)}
      data-normalized-degrees={model.normalized.toFixed(1)}
      data-angle-radians={model.radians.toFixed(6)}
      data-cos={model.cos.toFixed(6)}
      data-sin={model.sin.toFixed(6)}
      data-tan={model.tan === null ? "undefined" : model.tan.toFixed(6)}
      data-quadrant={model.quadrant}
      tabIndex={0}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 0.1 : 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          updateAngle(angle - step);
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          updateAngle(angle + step);
        } else if (event.key.toLowerCase() === "r") {
          reset();
        } else if (event.key.toLowerCase() === "s") {
          nearestSpecial();
        }
      }}
    >
      <header className="target-angle-measurement-header">
        <div><span>Trigonometry</span><span>Trigonometry</span></div>
        <h1>Angle Measurement</h1>
        <p>Convert angle units. Understand degrees and radians using the unit circle.</p>
        <section>
          <b>♙ Intermediate-Advanced</b><b>ϟ Visual Lab</b>
          <b>▣ Trig Graphing / Geometry</b><b>◷ 6-10 min</b>
        </section>
        <footer>
          <button type="button" onClick={() => onInteraction()}>⚑ English (English)⌄</button>
          <button type="button" onClick={() => reset()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => {
            void navigator.clipboard?.writeText(
              `${formatDegrees(angle)} = ${radianLabel(angle)} rad; (cos, sin) = (${formatNumber(model.cos)}, ${formatNumber(model.sin)})`,
            );
            onInteraction();
          }}><Share2 />Share</button>
          <button type="button" onClick={() => {
            document.querySelector(".target-angle-measurement-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
            onInteraction();
          }}>↗ Workspace</button>
        </footer>
      </header>

      <section className="target-angle-measurement-steps">
        {[
          ["1", "Observe", "Angles are measured from the positive x-axis. Degrees use °, radians use rad."],
          ["2", "Manipulate", "Drag the blue ray or the protractor/slider. Values update instantly."],
          ["3", "Notice", "Degrees and radians change together. sin, cos and tan values update too."],
          ["4", "Understand", "Every angle has unique cos θ, sin θ. Periodicity is 360° or 2π radians."],
        ].map(([number, title, text], index) => (
          <article key={String(title)}>
            <b>{String(number)}</b><span><strong>{String(title)}</strong><p>{String(text)}</p></span>
            <StageVisual index={index} />
            {index < 3 ? <ArrowRight className="target-angle-stage-arrow" /> : null}
          </article>
        ))}
      </section>

      <section className="target-angle-measurement-explorer" aria-label="Dual degree-radian explorer">
        <h2>DUAL DEGREE-RADIAN EXPLORER</h2>
        <div>
          <article className="target-angle-measurement-circle-panel">
            <b>UNIT CIRCLE</b>
            <UnitCircle angle={angle} model={model} onAngle={updateAngle} />
            <section className="target-angle-signs">
              <strong>SIGNS BY QUADRANT</strong><small>(sin θ, cos θ, tan θ)</small>
              {["I", "II", "III", "IV"].map((q, index) => (
                <p key={q} className={model.quadrant === q ? "active" : ""}>
                  <b>{q}</b><span>{index < 2 ? "+" : "−"}</span>
                  <span>{index === 0 || index === 3 ? "+" : "−"}</span>
                  <span>{index === 0 || index === 2 ? "+" : "−"}</span>
                </p>
              ))}
            </section>
          </article>
          <aside className="target-angle-measurement-controls">
            <b>CONTROLS</b>
            <div className="target-angle-unit-tabs">
              <button type="button" className={unit === "degrees" ? "active" : ""} onClick={() => { setUnit("degrees"); onInteraction(); }}>Degrees</button>
              <button type="button" className={unit === "radians" ? "active" : ""} onClick={() => { setUnit("radians"); onInteraction(); }}>Radians</button>
            </div>
            <strong>{unit === "degrees" ? formatDegrees(angle) : `${formatDecimal(model.radians, 3)} rad`}</strong>
            <p>= <span>{radianLabel(angle)}</span> rad</p>
            {unit === "degrees" ? (
              <input aria-label="Angle in degrees" type="range" min="-360" max="360" step="1" value={angle} onChange={(e) => updateAngle(Number(e.target.value))} />
            ) : (
              <input aria-label="Angle in radians" aria-valuetext={`${formatDecimal(model.radians, 3)} radians`} type="range" min="-6283" max="6283" step="1" value={Math.round(model.radians * 1000)} onChange={(e) => updateAngle(Number(e.target.value) / 1000 * 180 / Math.PI)} />
            )}
            <label>
              <span>{unit === "degrees" ? "−360°" : "−2π"}</span>
              <input
                aria-label={`Exact angle in ${unit}`}
                type="number"
                step={unit === "degrees" ? 0.1 : 0.01}
                value={unit === "degrees" ? angle : round(model.radians, 3)}
                onChange={(e) => updateAngle(unit === "degrees" ? Number(e.target.value) : Number(e.target.value) * 180 / Math.PI)}
              />
              <span>{unit === "degrees" ? "360°" : "2π"}</span>
            </label>
            <b>PROTRACTOR</b>
            <Protractor angle={angle} onAngle={updateAngle} />
          </aside>
        </div>
        <footer>
          <b>SNAP TO SPECIAL ANGLES</b>
          <div>{SPECIAL_ANGLES.map((value) => (
            <button type="button" key={value} className={near(model.normalized, value % 360) && (value !== 360 || angle === 360) ? "active" : ""} onClick={() => updateAngle(value)}>
              {value}° <span>({radianLabel(value)})</span>
            </button>
          ))}</div>
        </footer>
      </section>

      <section className="target-angle-measurement-values">
        <h2>CURRENT VALUES</h2>
        <div>
          <Value label="θ (degrees)" value={formatDegrees(angle)} />
          <Value label="θ (radians)" value={`${radianLabel(angle)} rad`} />
          <Value label="cos θ" value={formatNumber(model.cos)} />
          <Value label="sin θ" value={formatNumber(model.sin)} />
          <Value label="tan θ" value={model.tan === null ? "undefined" : formatNumber(model.tan)} />
          <Value label="(cos θ, sin θ)" value={`(${formatNumber(model.cos)}, ${formatNumber(model.sin)})`} />
        </div>
        <footer><b>Domains:</b> θ (deg) ∈ ℝ <i /> θ (rad) ∈ ℝ <i /> <b>Ranges:</b> −1 ≤ sin θ ≤ 1 <i /> −1 ≤ cos θ ≤ 1 <i /> tan θ ∈ ℝ \ {`{π/2 + kπ}`}</footer>
      </section>

      <section className="target-angle-measurement-learning">
        <article>
          <h2>▣ RULE &amp; FORMULA</h2><h3>Degree-Radian Conversion</h3>
          <p><b>2π rad</b> = <b>360°</b></p><p>1 rad = <b>180° / π</b> ≈ 57.2958°</p>
          <p>θ (rad) = θ (deg) × <b>π / 180</b></p><p>θ (deg) = θ (rad) × <b>180 / π</b></p>
        </article>
        <article>
          <h2>▣ WORKED EXAMPLE</h2><h3>Example: Convert 135° to radians and find sin and cos.</h3>
          <p>1) θ (rad) = 135° × π/180 = <b>3π/4 rad</b></p>
          <p>2) 135° is in Quadrant II.<br />Reference angle = 180° − 135° = 45°</p>
          <p>3) (cos θ, sin θ) = (−cos 45°, sin 45°)</p>
          <footer><b>sin 135° = √2/2 ≈ 0.7071</b><b>cos 135° = −√2/2 ≈ −0.7071</b></footer>
        </article>
        <article>
          <h2><TriangleAlert /> MISCONCEPTION ALERT</h2>
          <h3>Thinking degrees and radians are different kinds of angles.</h3>
          <p><b>Truth:</b> They measure the same angle quantity. Only the unit changes.</p>
          <p>180° = π rad (not 3.14 degrees!)</p><p>360° = 2π rad (not 6.28 degrees!)</p>
          <footer>Always include units in your answer.<br /><b>60° ✓ &nbsp; π/3 rad ✓ &nbsp; π ✕</b></footer>
        </article>
      </section>

      <section className="target-angle-measurement-practice">
        <article>
          <header><h2>QUICK PRACTICE</h2><span>1 of 4 &nbsp; ← →</span></header>
          <p>Choose the correct answer.</p><h3>What is the radian measure of 45°?</h3>
          <div>{(["A", "B", "C", "D"] as Choice[]).map((choice) => (
            <button type="button" key={choice} className={answer === choice ? feedback : ""} onClick={() => choose(choice)}>
              <b>{choice}</b><span>{({ A: "π/6", B: "π/3", C: "π/4", D: "2π/3" })[choice]}</span>{answer === choice && choice === "C" ? <Check /> : null}
            </button>
          ))}</div>
          <footer className={feedback} role="status">
            {feedback === "correct" ? <><Check /><b>Correct!</b> 45° × π/180 = <strong>π/4</strong> rad.</> : <><TriangleAlert /><b>Try again.</b> Multiply 45° by π/180 and simplify.</>}
          </footer>
        </article>
        <aside><h2>KEYBOARD SHORTCUTS</h2><dl><dt>Drag ray</dt><dd>Move angle</dd><dt>← →</dt><dd>Fine adjust (±1°)</dd><dt>Shift + ← →</dt><dd>Fine adjust (±0.1°)</dd><dt>R</dt><dd>Reset angle</dd><dt>S</dt><dd>Snap to special angle</dd></dl></aside>
      </section>

      <nav className="target-angle-measurement-nav">
        <a href="/lessons/trigonometry/258-unit-circle"><ArrowLeft /><span><b>Previous</b>Unit Circle</span></a>
        <a href="/lessons/trigonometry/267-compound-angle-formulae"><span><b>Next</b>Angle Addition and Subtraction</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function UnitCircle({ angle, model, onAngle }: { angle: number; model: ReturnType<typeof angleModel>; onAngle: (angle: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const center = { x: 197, y: 165 }, radius = 133;
  const point = { x: center.x + radius * model.cos, y: center.y - radius * model.sin };
  const pointerAngle = (event: ReactPointerEvent<SVGSVGElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const normalized = normalize(Math.atan2(center.y - p.y, p.x - center.x) * 180 / Math.PI);
    const candidates = [normalized - 360, normalized, normalized + 360];
    onAngle(candidates.reduce((best, value) => Math.abs(value - angle) < Math.abs(best - angle) ? value : best));
  };
  const arc = describeArc(center.x, center.y, 43, 0, Math.min(model.normalized, 359.99));
  return <svg ref={svg} className="target-angle-unit-circle" viewBox="0 0 430 330" role="img" aria-label="Draggable oriented ray on the unit circle" onPointerMove={(e) => { if (dragging.current) pointerAngle(e); }} onPointerUp={() => { dragging.current = false; }}>
    <defs><marker id="angle-ray-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7z" fill="#1473e6" /></marker></defs>
    <line x1="28" x2="345" y1={center.y} y2={center.y} stroke="#172554" /><line x1={center.x} x2={center.x} y1="20" y2="310" stroke="#172554" />
    <text x="350" y={center.y + 4}>x</text><text x={center.x - 5} y="15">y</text>
    <circle cx={center.x} cy={center.y} r={radius} fill="#fafdff" stroke="#172554" strokeWidth="1.2" />
    <line x1={center.x} y1={center.y} x2={point.x} y2={point.y} stroke="#1473e6" strokeWidth="2.2" markerEnd="url(#angle-ray-arrow)" />
    {model.normalized > 0.1 && <path d={arc} fill="none" stroke="#1473e6" strokeWidth="1.4" strokeDasharray="4 3" />}
    <text x={center.x + 54 * Math.cos(model.normalized * Math.PI / 180)} y={center.y - 54 * Math.sin(model.normalized * Math.PI / 180)} fontSize="14" fontWeight="900">θ</text>
    <circle data-testid="angle-ray-handle" data-angle={angle.toFixed(1)} cx={point.x} cy={point.y} r="7" fill="#1473e6" onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }} />
    <g transform="translate(330 29)"><rect width="112" height="52" rx="6" fill="white" stroke="#cbd5e1" /><text x="12" y="20" fontWeight="700">(cos θ, sin θ)</text><text x="12" y="40" fontSize="12" fontWeight="900">({formatNumber(model.cos)}, {formatNumber(model.sin)})</text></g>
    <text x="170" y="42" fontSize="10">1</text><text x="170" y="295" fontSize="10">−1</text><text x="54" y="180" fontSize="10">−1</text><text x="302" y="180" fontSize="10">1</text>
  </svg>;
}

function Protractor({ angle, onAngle }: { angle: number; onAngle: (value: number) => void }) {
  const svg = useRef<SVGSVGElement>(null), dragging = useRef(false);
  const display = normalize(angle) <= 180 ? normalize(angle) : 360 - normalize(angle);
  const radians = display * Math.PI / 180, point = { x: 140 + 108 * Math.cos(radians), y: 132 - 108 * Math.sin(radians) };
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    const matrix = svg.current?.getScreenCTM(); if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    onAngle(clamp(Math.atan2(132 - p.y, p.x - 140) * 180 / Math.PI, 0, 180));
  };
  return <svg ref={svg} className="target-angle-protractor" viewBox="0 0 280 150" role="img" aria-label="Interactive semicircular protractor" onPointerMove={(e) => { if (dragging.current) update(e); }} onPointerUp={() => { dragging.current = false; }} onPointerDown={(e) => { dragging.current = true; update(e); }}>
    {Array.from({ length: 37 }, (_, i) => { const a = i * 5 * Math.PI / 180; const inner = i % 3 === 0 ? 92 : 99; return <line key={i} x1={140 + inner * Math.cos(a)} y1={132 - inner * Math.sin(a)} x2={140 + 108 * Math.cos(a)} y2={132 - 108 * Math.sin(a)} stroke="#94a3b8" strokeWidth={i % 3 === 0 ? 1.1 : .55} />; })}
    {[30, 60, 90, 120, 150].map((v) => { const a = v * Math.PI / 180; return <g key={v}><line x1="140" y1="132" x2={140 + 108 * Math.cos(a)} y2={132 - 108 * Math.sin(a)} stroke="#dbe4ef" /><text x={140 + 120 * Math.cos(a) - 7} y={136 - 120 * Math.sin(a)} fontSize="9" fontWeight="700">{v}°</text></g>; })}
    <path d="M32 132 A108 108 0 0 1 248 132" fill="none" stroke="#172554" /><line x1="26" x2="254" y1="132" y2="132" stroke="#172554" />
    <line x1="140" y1="132" x2={point.x} y2={point.y} stroke="#146ee8" strokeWidth="2" /><circle data-testid="protractor-handle" cx={point.x} cy={point.y} r="4" fill="#111827" /><circle cx="140" cy="132" r="5" fill="#1473e6" />
    <text x="18" y="143" fontSize="9">180°</text><text x="251" y="143" fontSize="9">0°</text>
  </svg>;
}

function Value({ label, value }: { label: string; value: string }) { return <article><b>{label}</b><span>{value}</span></article>; }
function StageVisual({ index }: { index: number }) {
  if (index === 0) return <svg className="target-angle-stage-visual" viewBox="0 0 90 52" aria-hidden="true"><circle cx="42" cy="27" r="20" fill="none" stroke="#94a3b8" /><line x1="8" x2="78" y1="27" y2="27" stroke="#64748b" /><line x1="42" x2="42" y1="3" y2="50" stroke="#64748b" /><line x1="42" x2="70" y1="27" y2="12" stroke="#1785d4" strokeWidth="2" /><text x="80" y="30" fontSize="7">x</text><text x="39" y="7" fontSize="7">y</text></svg>;
  if (index === 1) return <svg className="target-angle-stage-visual" viewBox="0 0 90 52" aria-hidden="true"><path d="M10 43 A42 42 0 0 1 78 30" fill="none" stroke="#94a3b8" /><line x1="44" y1="43" x2="73" y2="18" stroke="#1785d4" strokeDasharray="3 2" /><circle cx="44" cy="43" r="4" fill="#0f9ca8" /><path d="M72 23l6-7 2 8" fill="none" stroke="#1785d4" strokeWidth="2" /><text x="73" y="46" fontSize="8">↔</text></svg>;
  if (index === 2) return <svg className="target-angle-stage-visual" viewBox="0 0 90 52" aria-hidden="true"><path d="M2 28 C12 3 24 3 34 28 S55 52 66 28 S80 3 89 28" fill="none" stroke="#0798aa" strokeWidth="2" /><line x1="65" x2="65" y1="4" y2="48" stroke="#64748b" strokeDasharray="3 2" /></svg>;
  return <svg className="target-angle-stage-visual" viewBox="0 0 90 52" aria-hidden="true"><path d="M22 42 A20 20 0 1 1 45 8" fill="none" stroke="#172554" strokeWidth="1.5" /><path d="M42 5l7 3-5 6" fill="none" stroke="#172554" /><text x="55" y="21" fontSize="12">+</text><text x="50" y="40" fontSize="8">360° = 2π rad</text></svg>;
}
function angleModel(angle: number) {
  const radians = angle * Math.PI / 180, normalized = normalize(angle), cos = clean(Math.cos(radians)), sin = clean(Math.sin(radians));
  const tan = Math.abs(cos) < 1e-10 ? null : clean(sin / cos);
  const quadrant = normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270 ? "axis" : normalized < 90 ? "I" : normalized < 180 ? "II" : normalized < 270 ? "III" : "IV";
  return { radians, normalized, cos, sin, tan, quadrant };
}
function radianLabel(degrees: number) {
  if (near(degrees, 0)) return "0";
  const scaled = Math.round(degrees * 10), denominator = 1800, divisor = gcd(Math.abs(scaled), denominator), numerator = scaled / divisor, bottom = denominator / divisor;
  const sign = numerator < 0 ? "−" : "", top = Math.abs(numerator);
  if (bottom === 1) return `${sign}${top === 1 ? "" : top}π`;
  return `${sign}${top === 1 ? "" : top}π/${bottom}`;
}
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }
function describeArc(cx: number, cy: number, r: number, start: number, end: number) { const a = polar(cx, cy, r, end), b = polar(cx, cy, r, start); return `M ${a.x} ${a.y} A ${r} ${r} 0 ${end - start <= 180 ? 0 : 1} 0 ${b.x} ${b.y}`; }
function polar(cx: number, cy: number, r: number, angle: number) { const a = (angle - 90) * Math.PI / 180; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; }
function normalize(value: number) { return ((value % 360) + 360) % 360; }
function formatDegrees(value: number) { return `${Number.isInteger(value) ? value : value.toFixed(1)}°`; }
function formatNumber(value: number) { return Math.abs(value) < 1e-10 ? "0.000" : value.toFixed(3); }
function formatDecimal(value: number, places: number) { return Math.abs(value) < 1e-10 ? "0" : value.toFixed(places); }
function clean(value: number) { return Math.abs(value) < 1e-12 ? 0 : value; }
function near(a: number, b: number, tolerance = .05) { return Math.abs(a - b) < tolerance; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function round(value: number, places: number) { const factor = 10 ** places; return Math.round(value * factor) / factor; }
