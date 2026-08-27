import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Expand,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./TrigonometricEquationsTargetLesson120.css";

type TrigFunction = "sin" | "cos";
type TrigPreset = { fn: TrigFunction; angle: number; value: string };

const presets: TrigPreset[] = [
  { fn: "sin", angle: 30, value: "1/2" },
  { fn: "cos", angle: 60, value: "1/2" },
  { fn: "sin", angle: 45, value: "sqrt(2)/2" },
];

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const trigValue = (fn: TrigFunction, angle: number) =>
  fn === "sin" ? Math.sin(rad(angle)) : Math.cos(rad(angle));
const partnerAngle = (fn: TrigFunction, angle: number) =>
  fn === "sin" ? 180 - angle : 360 - angle;
const prettyValue = (preset: TrigPreset, custom: boolean) =>
  custom ? trigValue(preset.fn, preset.angle).toFixed(3) : preset.value;
const angleText = (angle: number, radians: boolean) => {
  if (!radians) return `${angle}°`;
  const known: Record<number, string> = {
    30: "π/6",
    45: "π/4",
    60: "π/3",
    120: "2π/3",
    135: "3π/4",
    150: "5π/6",
    300: "5π/3",
    315: "7π/4",
    330: "11π/6",
  };
  return known[angle] ?? `${(angle / 180).toFixed(2)}π`;
};

function UnitCircle({
  fn,
  angle,
  valueLabel,
  radians,
  onAngle,
}: {
  fn: TrigFunction;
  angle: number;
  valueLabel: string;
  radians: boolean;
  onAngle: (angle: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const center = { x: 175, y: 205 };
  const radius = 128;
  const second = partnerAngle(fn, angle);
  const point = (degrees: number) => ({
    x: center.x + radius * Math.cos(rad(degrees)),
    y: center.y - radius * Math.sin(rad(degrees)),
  });
  const firstPoint = point(angle);
  const secondPoint = point(second);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 350;
    const y = ((event.clientY - box.top) / box.height) * 430;
    const degrees = Math.round(
      (Math.atan2(center.y - y, x - center.x) * 180) / Math.PI,
    );
    onAngle(Math.max(5, Math.min(85, Math.round(degrees / 5) * 5)));
  };
  const targetY = fn === "sin" ? firstPoint.y : center.y;
  return (
    <svg
      ref={svgRef}
      className="trig120-circle"
      viewBox="0 0 350 430"
      role="img"
      aria-label={`Unit circle solutions for ${fn} theta equals ${valueLabel}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <line className="axis" x1="25" x2="327" y1={center.y} y2={center.y} />
      <line className="axis" x1={center.x} x2={center.x} y1="42" y2="365" />
      <path className="arrow" d="M327 205l-9-5v10zM175 42l-5 9h10z" />
      <circle className="unit" cx={center.x} cy={center.y} r={radius} />
      {fn === "sin" ? (
        <line className="level" x1="25" x2="327" y1={targetY} y2={targetY} />
      ) : (
        <line className="level" x1={firstPoint.x} x2={firstPoint.x} y1="55" y2="352" />
      )}
      <line className="ray" x1={center.x} y1={center.y} x2={firstPoint.x} y2={firstPoint.y} />
      <line className="ray" x1={center.x} y1={center.y} x2={secondPoint.x} y2={secondPoint.y} />
      <path className="angle-arc" d={`M${center.x + 43} ${center.y} A43 43 0 0 0 ${center.x + 43 * Math.cos(rad(angle))} ${center.y - 43 * Math.sin(rad(angle))}`} />
      <circle
        className="handle"
        cx={firstPoint.x}
        cy={firstPoint.y}
        r="7"
        role="slider"
        tabIndex={0}
        aria-label="Drag reference angle on unit circle"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onAngle(Math.max(5, angle - 5));
          if (event.key === "ArrowRight") onAngle(Math.min(85, angle + 5));
        }}
      />
      <circle className="solution" cx={secondPoint.x} cy={secondPoint.y} r="7" />
      <text className="point-label" x={firstPoint.x + 10} y={firstPoint.y - 18}>{angleText(angle, radians)}</text>
      <text className="point-label" x={secondPoint.x - 4} y={secondPoint.y - 18}>{angleText(second, radians)}</text>
      <text className="arc-label" x={center.x + 55} y={center.y - 15}>{angleText(angle, radians)}</text>
      <text className="arc-label" x={center.x - 65} y={center.y - 15}>{angleText(second, radians)}</text>
      <text x="334" y="210">x</text><text x="181" y="39">y</text>
      <text x="160" y="225">0</text><text x="160" y="81">1</text><text x="153" y="341">−1</text>
      <text className="level-label" x="302" y={fn === "sin" ? targetY - 8 : 70}>{fn} = {valueLabel}</text>
      <rect className="quadrant-box" x="69" y="380" width="212" height="35" rx="6" />
      <text className="quadrant" x="175" y="405">{fn === "sin" ? "Sine is positive in Quadrants I and II." : "Cosine is positive in Quadrants I and IV."}</text>
    </svg>
  );
}

function TrigWave({
  fn,
  angle,
  valueLabel,
  radians,
}: {
  fn: TrigFunction;
  angle: number;
  valueLabel: string;
  radians: boolean;
}) {
  const width = 350;
  const height = 245;
  const box = { left: 25, right: 332, top: 28, bottom: 188 };
  const px = (degrees: number) => box.left + (degrees / 360) * (box.right - box.left);
  const py = (value: number) => box.top + ((1 - value) / 2) * (box.bottom - box.top);
  const value = trigValue(fn, angle);
  const second = partnerAngle(fn, angle);
  const points = Array.from({ length: 181 }, (_, index) => {
    const degrees = index * 2;
    return `${px(degrees)},${py(trigValue(fn, degrees))}`;
  }).join(" ");
  return (
    <svg className="trig120-wave" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${fn} wave with two solution crossings`}>
      <text className="title" x="0" y="13">{fn === "sin" ? "Sine" : "Cosine"} wave (y = {fn} θ)</text>
      <line className="axis" x1={box.left} x2={box.right + 7} y1={py(0)} y2={py(0)} />
      <line className="axis" x1={box.left} x2={box.left} y1={box.top - 5} y2={box.bottom + 5} />
      <polyline className="curve" points={points} />
      <line className="level" x1={box.left} x2={box.right} y1={py(value)} y2={py(value)} />
      {[angle, second].map((solution) => (
        <g key={solution}>
          <line className="guide" x1={px(solution)} x2={px(solution)} y1={py(value)} y2={box.bottom + 4} />
          <circle cx={px(solution)} cy={py(value)} r="6" />
          <text className="solution-label" x={px(solution)} y={box.bottom + 27}>{angleText(solution, radians)}</text>
        </g>
      ))}
      {[0, 90, 180, 270, 360].map((tick) => <text key={tick} x={px(tick)} y={py(0) + 19}>{radians ? angleText(tick, true) : `${tick}°`}</text>)}
      <text x="8" y={py(1) + 3}>1</text><text x="8" y={py(0) + 3}>0</text><text x="5" y={py(-1) + 3}>−1</text>
      <text className="value-label" x="0" y={py(value) + 4}>{valueLabel}</text>
      <rect x="48" y="213" width="255" height="29" rx="6" />
      <text className="caption" x="175" y="231">Solutions occur where the {fn} curve equals {valueLabel}.</text>
    </svg>
  );
}

export default function TrigonometricEquationsTargetLesson120({ resetToken, onInteraction }: LessonAdapterProps) {
  const [presetIndex, setPresetIndex] = useState(0);
  const [preset, setPreset] = useState<TrigPreset>(presets[0]);
  const [custom, setCustom] = useState(false);
  const [radians, setRadians] = useState(false);
  const [activeTab, setActiveTab] = useState("Interaction + Visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const second = partnerAngle(preset.fn, preset.angle);
  const valueLabel = prettyValue(preset, custom);
  const solutionText = `${angleText(preset.angle, radians)}, ${angleText(second, radians)}`;
  const act = () => { setActions((value) => value + 1); onInteraction(); };
  const reset = () => {
    setPresetIndex(0); setPreset(presets[0]); setCustom(false); setRadians(false);
    setActiveTab("Interaction + Visualization"); setLanguage("English (English)");
    setShared(false); setWorkspace(false); setFullscreen(false); setPracticeChecked(false); setActions(0); onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const selectPreset = (index: number) => {
    setPresetIndex(index); setPreset(presets[index]); setCustom(false); setPracticeChecked(false); act();
  };
  const moveAngle = (angle: number) => {
    setPreset((current) => ({ ...current, angle })); setCustom(true); setPracticeChecked(false); act();
  };
  const nextExample = () => selectPreset((presetIndex + 1) % presets.length);

  return (
    <div
      className={`trig120-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0177"
      data-dedicated-lesson="120"
      data-object-model="editable-trigonometric-equation-preset-pointer-keyboard-draggable-unit-circle-angle-linked-periodic-wave-quadrant-reasoning-general-solution-family-angle-mode-quick-practice-model"
      data-problem={`${preset.fn},${preset.angle},${valueLabel}`}
      data-solutions={`${preset.angle},${second}`}
      data-angle-mode={radians ? "radians" : "degrees"}
      data-custom={custom}
      data-practice-checked={practiceChecked}
      data-actions={actions}
    >
      <nav className="trig120-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>120 Trigonometric Equations</b></nav>
      <header className="trig120-intro">
        <small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small>
        <h1>Trigonometric Equations</h1><p>Find periodic solution families.</p>
        <nav><b>♙ Intermediate-Advanced</b><b>ϟ Guided Practice</b><b>▣ Solve / Nsolve / Inequality Graphing</b><b>◷ 6-10 min</b></nav>
        <div>
          <label><Languages /><select aria-label="Trigonometric equations language" value={language} onChange={(event) => { setLanguage(event.target.value); act(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label>
          <button onClick={reset}><RotateCcw />Reset</button>
          <button onClick={() => { setShared(true); act(); }}><Share2 />{shared ? "Link ready" : "Share"}</button>
          <button onClick={() => { setWorkspace((value) => !value); act(); }}>↗ {workspace ? "Close workspace" : "Workspace"}</button>
        </div>
      </header>
      <nav className="trig120-tabs">{["Interaction + Visualization", "Explain", "Examples", "Formulas", "Know More"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => { setActiveTab(tab); if (tab === "Examples") nextExample(); else act(); }}>{tab}</button>)}</nav>

      <main className="trig120-lab">
        <header><span><small>INTERACTION + VISUALIZATION</small><h2>Solve using the unit circle</h2><p>Explore the unit circle and {preset.fn} wave to find all solutions.</p></span><b><Check />Interactive</b><b>{actions} actions</b><button aria-label="Expand trigonometric workspace" onClick={() => { setFullscreen((value) => !value); act(); }}><Expand /></button></header>
        <section className="trig120-body">
          <div className="trig120-visuals">
            <section className="trig120-circle-card">
              <div className="trig120-controls">
                <label>Equation to solve<select aria-label="Trigonometric equation" value={presetIndex} onChange={(event) => selectPreset(Number(event.target.value))}><option value="0">sin(θ) = 1/2</option><option value="1">cos(θ) = 1/2</option><option value="2">sin(θ) = √2/2</option></select></label>
                <label>Angle mode<select aria-label="Trigonometric angle mode" value={radians ? "Radians" : "Degrees"} onChange={(event) => { setRadians(event.target.value === "Radians"); act(); }}><option>Degrees</option><option>Radians</option></select></label>
              </div>
              <UnitCircle fn={preset.fn} angle={preset.angle} valueLabel={valueLabel} radians={radians} onAngle={moveAngle} />
            </section>
            <section className="trig120-wave-card"><TrigWave fn={preset.fn} angle={preset.angle} valueLabel={valueLabel} radians={radians} /></section>
          </div>
          <aside className="trig120-worked">
            <h2>Worked Steps</h2>
            <article><i>1</i><div><p>Reference angle is {angleText(preset.angle, radians)}.</p><strong>{preset.fn}({angleText(preset.angle, radians)}) = {valueLabel}</strong></div></article>
            <article><i>2</i><div><p>{preset.fn === "sin" ? "Sine is positive in quadrants I and II." : "Cosine is positive in quadrants I and IV."}</p><p>So there are two solutions between 0° and 360°.</p></div></article>
            <article><i>3</i><div><p>Solutions in<br />0° ≤ θ &lt; 360° are</p><strong>θ = {solutionText}</strong></div></article>
            <section><h3>General Solution Families</h3><p>All solutions are obtained by adding full rotations of 360°.</p><strong>θ = {angleText(preset.angle, radians)} + {radians ? "2πk" : "360°k"}<br /><small>or</small><br />θ = {angleText(second, radians)} + {radians ? "2πk" : "360°k"}</strong><p>where <i>k ∈ ℤ</i></p></section>
            <footer><CircleAlert /><div><b>Warning</b><h3>ONLY_FIRST_TRIG_ANGLE</h3><p>Giving only {angleText(preset.angle, radians)} misses the second solution at {angleText(second, radians)}.</p></div></footer>
          </aside>
        </section>
        <section className="trig120-practice"><Star /><span><b>Try a quick practice</b><small>Solve using the unit circle.</small></span><p>cos(θ) = 1/2 <b>→</b> <strong>θ = 60°, 300°</strong></p><button onClick={() => { setPracticeChecked(true); act(); }}>{practiceChecked ? "Correct: both angles" : "Check on your own"}</button></section>
        <nav className="trig120-adjacent"><a href="/lessons/algebra/119-logarithmic-equations"><ArrowLeft /><span><small>PREVIOUS</small>Logarithmic Equations</span></a><a href="/lessons/algebra/121-absolute-value-equations"><span><small>NEXT</small>Absolute-Value Equations</span><ArrowRight /></a></nav>
      </main>
      <footer className="trig120-footer"><section><Sparkles /><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div></section><section><b>Quick Links</b><p>Sitemap</p><p>Docs</p><p>About</p><p>Teacher Resources</p></section><section><b>Connect</b><p>info@mathuniverse.app</p><p>www.mathuniverse.app</p></section><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. ALL RIGHTS RESERVED.</small><small>www.IndianServers.com | info@IndianServers.com</small></footer>
    </div>
  );
}
