import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Hand,
  Languages,
  Lightbulb,
  Link2,
  RotateCcw,
  Share2,
  Sparkles,
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
import "./InverseTrigTargetLesson265.css";

type InverseKey = "asin" | "acos" | "atan";
type Stage = "explore" | "explain" | "examples" | "practice" | "know";

const INITIAL_ANGLE = 45;
const INITIAL_PRACTICE_RATIO = 0.75;

export default function InverseTrigTargetLesson265({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [inverseKey, setInverseKey] = useState<InverseKey>("asin");
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [stage, setStage] = useState<Stage>("explore");
  const [practiceRatio, setPracticeRatio] = useState(INITIAL_PRACTICE_RATIO);
  const [practiceAnswer, setPracticeAnswer] = useState("48.59");
  const [practiceResult, setPracticeResult] = useState<"idle" | "correct" | "incorrect">("correct");
  const [hintShown, setHintShown] = useState(false);
  const model = useMemo(() => inverseModel(inverseKey, angle), [inverseKey, angle]);
  const practiceExpected = toDegrees(Math.asin(practiceRatio));

  const reset = (notify = true) => {
    setInverseKey("asin");
    setAngle(INITIAL_ANGLE);
    setStage("explore");
    setPracticeRatio(INITIAL_PRACTICE_RATIO);
    setPracticeAnswer("48.59");
    setPracticeResult("correct");
    setHintShown(false);
    if (notify) onInteraction();
  };

  useEffect(() => {
    setInverseKey("asin");
    setAngle(INITIAL_ANGLE);
    setStage("explore");
    setPracticeRatio(INITIAL_PRACTICE_RATIO);
    setPracticeAnswer("48.59");
    setPracticeResult("correct");
    setHintShown(false);
  }, [resetToken]);

  const updateAngle = (next: number) => {
    const range = principalRange(inverseKey);
    setAngle(clamp(next, range.min, range.max));
    onInteraction();
  };

  const selectFunction = (next: InverseKey) => {
    const range = principalRange(next);
    setInverseKey(next);
    setAngle((current) => clamp(current, range.min, range.max));
    onInteraction();
  };

  const selectStage = (next: Stage) => {
    setStage(next);
    const selector = next === "explore"
      ? ".target-inverse-workspace"
      : next === "explain" || next === "know"
        ? ".target-inverse-rule"
        : next === "examples"
          ? ".target-inverse-example"
          : ".target-inverse-practice";
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    onInteraction();
  };

  const updatePracticeRatio = (ratio: number) => {
    const next = clamp(ratio, -1, 1);
    setPracticeRatio(next);
    setPracticeAnswer(toDegrees(Math.asin(next)).toFixed(2));
    setPracticeResult("idle");
    setHintShown(false);
    onInteraction();
  };

  const gradePractice = () => {
    const answer = Number(practiceAnswer);
    setPracticeResult(Number.isFinite(answer) && Math.abs(answer - practiceExpected) <= 0.02 ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      className="target-inverse-page"
      data-testid="trigonometry-mockup-0322"
      data-dedicated-lesson="265"
      data-object-model="restricted-branch-reflection-principal-inverse-trigonometry-model"
      data-function={inverseKey}
      data-angle={angle.toFixed(6)}
      data-input-value={model.input.toFixed(6)}
      data-inverse-value={model.inverse.toFixed(6)}
      data-stage={stage}
      data-practice-ratio={practiceRatio.toFixed(6)}
      data-practice-expected={practiceExpected.toFixed(6)}
      data-practice-result={practiceResult}
      data-hint-shown={hintShown}
    >
      <header className="target-inverse-header">
        <span>Trigonometry</span>
        <h1>Inverse Trig Functions</h1>
        <p>Understand restricted inverses.</p>
        <section>
          <b>♙ Intermediate–Advanced</b><b>ϟ Visual Lab</b><b>▣ Trig Graphing / Geometry</b><b>◷ 6–10 min</b>
        </section>
        <footer>
          <label><Languages /><select aria-label="Lesson language" defaultValue="en" onChange={onInteraction}><option value="en">English (English)</option><option value="hi">हिन्दी (Hindi)</option></select></label>
          <button type="button" onClick={() => reset()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => { void navigator.clipboard?.writeText(`${model.label}(${format(model.input)}) = ${formatAngle(angle)}`); onInteraction(); }}><Share2 />Share</button>
          <button type="button" onClick={() => { document.querySelector(".target-inverse-workspace")?.scrollIntoView({ behavior: "smooth" }); onInteraction(); }}>↗ Workspace</button>
        </footer>
      </header>

      <nav className="target-inverse-tabs" aria-label="Lesson stages">
        <StageButton active={stage === "explore"} icon="◉" title="Explore" subtitle="Interact + visualize" onClick={() => selectStage("explore")} />
        <StageButton active={stage === "explain"} icon="▥" title="Explain" subtitle="Concept + rules" onClick={() => selectStage("explain")} />
        <StageButton active={stage === "examples"} icon="▽" title="Examples" subtitle="See it in action" onClick={() => selectStage("examples")} />
        <StageButton active={stage === "practice"} icon="◩" title="Practice" subtitle="Your turn" onClick={() => selectStage("practice")} />
        <StageButton active={stage === "know"} icon="✣" title="Know more" subtitle="Deepen understanding" onClick={() => selectStage("know")} />
      </nav>

      <section className="target-inverse-flow">
        <FlowCard icon={Eye} title="1 Observe">See how a point and its reflection across y = x are related.</FlowCard>
        <FlowCard icon={Hand} title="2 Manipulate">Drag the point or adjust the angle within the allowed range.</FlowCard>
        <FlowCard icon={Lightbulb} title="3 Notice">The x-value becomes the inverse trig value.</FlowCard>
        <FlowCard icon={Target} title="4 Understand">Inverse trig returns the principal angle whose trig value is given.</FlowCard>
      </section>

      <section className="target-inverse-workspace">
        <h2>Restricted branches reflected across <i>y = x</i></h2>
        <div className="target-inverse-visuals">
          <article>
            <h3>UNIT CIRCLE (INPUT)</h3>
            <p>Drag the point on the restricted branch.</p>
            <InverseCircle angle={angle} inverseKey={inverseKey} output={false} onAngle={updateAngle} testId="inverse-input-handle" />
            <footer><b>sin θ = {format(Math.sin(toRadians(angle)))}</b><b>cos θ = {format(Math.cos(toRadians(angle)))}</b><b>tan θ = {format(Math.tan(toRadians(angle)))}</b></footer>
          </article>
          <div className="target-inverse-reflect"><b>y = x</b><span>↔</span></div>
          <article>
            <h3>INVERSE OUTPUT (REFLECTION)</h3>
            <p>Reflection of (x, y) across y = x.</p>
            <InverseCircle angle={angle} inverseKey={inverseKey} output onAngle={updateAngle} testId="inverse-output-handle" />
            <footer><b>arcsin({format(Math.sin(toRadians(angle)))}) = {formatAngle(toDegrees(Math.asin(Math.sin(toRadians(angle)))))}</b><b>arccos({format(Math.cos(toRadians(angle)))}) = {formatAngle(toDegrees(Math.acos(Math.cos(toRadians(angle)))))}</b><b>arctan({format(Math.tan(toRadians(clamp(angle, -89, 89))))}) = {formatAngle(toDegrees(Math.atan(Math.tan(toRadians(clamp(angle, -89, 89))))))}</b></footer>
          </article>
        </div>

        <div className="target-inverse-controls">
          <article>
            <h3>ANGLE (RESTRICTED RANGE)</h3>
            <p>Drag the slider or type a value.</p>
            <ControlRow label="Restricted branch angle" min={-360} max={360} value={angle} onValue={updateAngle} />
            <div className="target-inverse-range-tabs">
              {(["asin", "acos", "atan"] as InverseKey[]).map((key) => <button type="button" className={key === inverseKey ? "active" : ""} key={key} onClick={() => selectFunction(key)}>{shortLabel(key)} range</button>)}
            </div>
            <strong>{rangeExpression(inverseKey)}</strong>
          </article>
          <div className="target-inverse-link"><Link2 /></div>
          <article>
            <h3>INVERSE VALUE (OUTPUT)</h3>
            <p>x-value becomes the inverse trig value.</p>
            <ControlRow label="Inverse output angle" min={model.range.min} max={model.range.max} value={angle} onValue={updateAngle} />
            <div className="target-inverse-values">
              <span>arcsin({format(Math.sin(toRadians(angle)))})<b>{formatAngle(toDegrees(Math.asin(Math.sin(toRadians(angle)))))}</b></span>
              <span>arccos({format(Math.cos(toRadians(angle)))})<b>{formatAngle(toDegrees(Math.acos(Math.cos(toRadians(angle)))))}</b></span>
              <span>arctan({format(Math.tan(toRadians(clamp(angle, -89, 89))))})<b>{formatAngle(toDegrees(Math.atan(Math.tan(toRadians(clamp(angle, -89, 89))))))}</b></span>
            </div>
          </article>
        </div>
      </section>

      <section className="target-inverse-rule">
        <article>
          <h2>THE RULE <small>(How it works)</small></h2>
          <p>Inverse trig reflects a point across the line <i>y = x</i>.</p>
          <p>The x-value of the reflected point is the <b>principal angle</b>.</p>
          <div><p>y = sin⁻¹(x) &nbsp; ⇔ &nbsp; sin y = x, &nbsp; y ∈ [−90°, 90°]</p><p>y = cos⁻¹(x) &nbsp; ⇔ &nbsp; cos y = x, &nbsp; y ∈ [0°, 180°]</p><p>y = tan⁻¹(x) &nbsp; ⇔ &nbsp; tan y = x, &nbsp; y ∈ (−90°, 90°)</p></div>
        </article>
        <article>
          <h2>PRINCIPAL RANGES</h2>
          <RangeRow formula="y = sin⁻¹(x)" domain="−1 ≤ x ≤ 1" range="y ∈ [−90°, 90°]" tone="violet" />
          <RangeRow formula="y = cos⁻¹(x)" domain="−1 ≤ x ≤ 1" range="y ∈ [0°, 180°]" tone="cyan" />
          <RangeRow formula="y = tan⁻¹(x)" domain="−∞ < x < ∞" range="y ∈ (−90°, 90°)" tone="orange" />
        </article>
      </section>

      <section className="target-inverse-example">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <h3>Find sin⁻¹(0.6).</h3>
          <ol><li>On the unit circle, find the point with y = 0.6 on the restricted branch (Quadrant I).</li><li>That point is (0.8, 0.6).</li><li>Reflect across y = x → (0.6, 0.8).</li><li>The x-value of the reflected point is the answer.</li></ol>
        </article>
        <ExampleReflection />
        <aside><h3>Answer</h3><b>sin⁻¹(0.6) = 36.87°</b><h3>Check</h3><p>sin(36.87°) ≈ 0.600 <CheckCircle2 /></p><strong>Correct!</strong></aside>
      </section>

      <section className="target-inverse-misconception">
        <TriangleAlert />
        <article><h2>COMMON MISCONCEPTION</h2><p>sin⁻¹(x) is <b>NOT</b> <Fraction top="1" bottom="sin x" />.</p><small>Inverse trig returns an angle whose sine equals x, not the reciprocal of sine.</small></article>
        <p>If x = 1/2: &nbsp; <b>sin⁻¹(1/2) = 30°</b></p><strong>but</strong><p><b><Fraction top="1" bottom="sin 30°" /> = 2</b><br /><small>(not an angle)</small></p>
      </section>

      <section className="target-inverse-practice">
        <header><h2>QUICK PRACTICE CHALLENGE</h2><p>Drag the point or enter a value to find the inverse trig value.</p></header>
        <div>
          <article><h3>Given</h3><b>sin⁻¹({format(practiceRatio)})</b><PracticeCircle ratio={practiceRatio} onRatio={updatePracticeRatio} /><p>Drag the point<br />to y = {format(practiceRatio)}.</p></article>
          <article><h3>Your answer</h3><ControlRow label="Practice inverse answer" min={-90} max={90} value={Number(practiceAnswer) || 0} onValue={(value) => { setPracticeAnswer(value.toFixed(2)); setPracticeResult("idle"); setHintShown(false); onInteraction(); }} decimals={2} /><footer><button type="button" onClick={gradePractice}><CheckCircle2 />Check</button><button type="button" onClick={() => { setPracticeRatio(INITIAL_PRACTICE_RATIO); setPracticeAnswer("48.59"); setPracticeResult("idle"); setHintShown(false); onInteraction(); }}><RotateCcw />Reset</button><button type="button" onClick={() => { setHintShown(true); onInteraction(); }}><Lightbulb />Hint</button></footer>{practiceResult === "incorrect" ? <p role="status">Use the principal angle whose sine is {format(practiceRatio)}.</p> : null}{hintShown ? <p>Keep the answer between −90° and 90°.</p> : null}</article>
          <aside><h3>Feedback</h3><div className={practiceResult === "correct" ? "correct" : practiceResult === "incorrect" ? "incorrect" : "idle"}>{practiceResult === "correct" ? <Check /> : <Sparkles />}<b>{practiceResult === "correct" ? "Correct!" : practiceResult === "incorrect" ? "Try again" : "Ready to check"}</b></div><h2>sin({practiceAnswer || "?"}°) = {Number.isFinite(Number(practiceAnswer)) ? format(Math.sin(toRadians(Number(practiceAnswer)))) : "?"}</h2><p>{practiceResult === "correct" ? "Well done!" : "Match the given ratio."}</p></aside>
        </div>
      </section>

      <nav className="target-inverse-nav"><a href="/lessons/trigonometry/264-reciprocal-trig-functions"><ArrowLeft /><span><b>Previous</b>Reciprocal Trig Functions</span></a><a href="/lessons/trigonometry/266-trig-identities"><span><b>Next</b>Trig Identities</span><ArrowRight /></a></nav>
    </section>
  );
}

function StageButton({ active, icon, title, subtitle, onClick }: { active: boolean; icon: string; title: string; subtitle: string; onClick: () => void }) {
  return <button type="button" className={active ? "active" : ""} onClick={onClick}><i>{icon}</i><span><b>{title}</b><small>{subtitle}</small></span></button>;
}

function FlowCard({ icon: Icon, title, children }: { icon: typeof Eye; title: string; children: string }) {
  return <article><Icon /><div><h3>{title}</h3><p>{children}</p></div></article>;
}

function ControlRow({ label, min, max, value, onValue, decimals = 0 }: { label: string; min: number; max: number; value: number; onValue: (value: number) => void; decimals?: number }) {
  return <div className="target-inverse-control-row"><span>{formatAngle(min)}</span><input aria-label={label} type="range" min={min} max={max} step={decimals ? 0.01 : 1} value={value} onChange={(event) => onValue(Number(event.target.value))} /><span>{formatAngle(max)}</span><input aria-label={`${label} numeric`} type="number" min={min} max={max} step={decimals ? 0.01 : 1} value={value.toFixed(decimals)} onChange={(event) => onValue(Number(event.target.value))} /><b>°</b></div>;
}

function InverseCircle({ angle, inverseKey, output, onAngle, testId }: { angle: number; inverseKey: InverseKey; output: boolean; onAngle: (angle: number) => void; testId: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const cx = 160, cy = 112, radius = 90;
  const radians = toRadians(angle), x = cx + Math.cos(radians) * radius, y = cy - Math.sin(radians) * radius;
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    let next = toDegrees(Math.atan2(cy - point.y, point.x - cx));
    if (inverseKey === "acos" && next < 0) next += 360;
    const range = principalRange(inverseKey);
    onAngle(clamp(next, range.min, range.max));
  };
  const arc = branchArc(inverseKey, cx, cy, radius);
  const color = output ? "#7c3aed" : "#0798e6";
  return <svg ref={svg} viewBox="0 0 320 225" role="img" aria-label={`${output ? "Inverse output" : "Restricted input"} draggable point`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); move(event); }} onPointerMove={move}>
    <line x1="60" x2="267" y1={cy} y2={cy} /><line x1={cx} x2={cx} y1="15" y2="210" />
    <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#94a3b8" />
    <path className="target-inverse-branch" d={arc} fill="none" stroke={color} strokeWidth="2" />
    <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth="2" />
    <path d={arcPath(cx, cy, 28, 0, angle)} fill="none" stroke={color} strokeWidth="2" />
    <circle data-testid={testId} cx={x} cy={y} r="6" fill={color} />
    <text x={x + 8} y={y - 18} fill={color}>({format(Math.cos(radians))}, {format(Math.sin(radians))})</text>
    <text x={cx + 34} y={cy - 12} fill={color}>{output ? "θ⁻¹" : "θ"} = {formatAngle(angle)}</text>
    {!output ? <><text x="8" y="48" fill="#94a3b8">Quadrant II</text><text x="254" y="48" fill="#94a3b8">Quadrant I</text><text x="8" y="198" fill="#94a3b8">Quadrant III</text><text x="252" y="198" fill="#94a3b8">Quadrant IV</text></> : null}
    <text x="265" y={cy + 14}>x</text><text x={cx + 7} y="17">y</text><text x="46" y={cy + 14}>−1</text><text x="254" y={cy + 14}>1</text><text x={cx - 13} y="31">1</text><text x={cx - 17} y="207">−1</text>
  </svg>;
}

function PracticeCircle({ ratio, onRatio }: { ratio: number; onRatio: (ratio: number) => void }) {
  const svg = useRef<SVGSVGElement>(null), angle = Math.asin(ratio), cx = 100, cy = 75, radius = 55, x = cx + Math.cos(angle) * radius, y = cy - ratio * radius;
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const theta = clamp(Math.atan2(cy - point.y, point.x - cx), -Math.PI / 2, Math.PI / 2);
    onRatio(Math.sin(theta));
  };
  return <svg ref={svg} viewBox="0 0 205 145" role="img" aria-label="Practice draggable arcsine point" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); move(event); }} onPointerMove={move}><line x1="30" x2="175" y1={cy} y2={cy} /><line x1={cx} x2={cx} y1="12" y2="140" /><circle cx={cx} cy={cy} r={radius} fill="none" stroke="#94a3b8" /><path d={arcPath(cx, cy, 20, 0, toDegrees(angle))} fill="none" stroke="#0798e6" strokeWidth="2" /><line x1={cx} y1={cy} x2={x} y2={y} stroke="#0798e6" strokeWidth="2" /><circle data-testid="inverse-practice-handle" cx={x} cy={y} r="5" fill="#0798e6" /><text x="162" y="89">x</text><text x="106" y="15">y</text></svg>;
}

function ExampleReflection() {
  return <svg viewBox="0 0 310 150" role="img" aria-label="Worked inverse reflection"><g transform="translate(0 8)"><circle cx="67" cy="70" r="48" fill="none" stroke="#94a3b8" /><line x1="10" x2="124" y1="70" y2="70" /><line x1="67" x2="67" y1="12" y2="130" /><line x1="67" y1="70" x2="105" y2="41" stroke="#0798e6" /><circle cx="105" cy="41" r="4" fill="#0798e6" /><text x="89" y="26" fill="#0798e6">(0.8, 0.6)</text></g><text x="139" y="50">reflect</text><text x="139" y="63">across</text><text x="141" y="76" fill="#7c3aed">y = x</text><text x="143" y="99" fontSize="25">↔</text><g transform="translate(178 8)"><circle cx="67" cy="70" r="48" fill="none" stroke="#94a3b8" /><line x1="10" x2="124" y1="70" y2="70" /><line x1="67" x2="67" y1="12" y2="130" /><line x1="67" y1="70" x2="96" y2="32" stroke="#7c3aed" /><circle cx="96" cy="32" r="4" fill="#7c3aed" /><text x="84" y="18" fill="#7c3aed">(0.6, 0.8)</text></g></svg>;
}

function RangeRow({ formula, domain, range, tone }: { formula: string; domain: string; range: string; tone: string }) { return <div className={`target-inverse-range-row ${tone}`}><b>{formula}</b><span>{domain}</span><strong>{range}</strong></div>; }
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="target-inverse-fraction"><span>{top}</span><span>{bottom}</span></span>; }

function inverseModel(key: InverseKey, angle: number) {
  const radians = toRadians(angle), range = principalRange(key);
  if (key === "acos") return { input: Math.cos(radians), inverse: toDegrees(Math.acos(Math.cos(radians))), label: "arccos", baseLabel: "cos", range };
  if (key === "atan") return { input: Math.tan(radians), inverse: toDegrees(Math.atan(Math.tan(radians))), label: "arctan", baseLabel: "tan", range };
  return { input: Math.sin(radians), inverse: toDegrees(Math.asin(Math.sin(radians))), label: "arcsin", baseLabel: "sin", range };
}
function principalRange(key: InverseKey) { return key === "acos" ? { min: 0, max: 180 } : key === "atan" ? { min: -89, max: 89 } : { min: -90, max: 90 }; }
function shortLabel(key: InverseKey) { return key === "asin" ? "sin⁻¹" : key === "acos" ? "cos⁻¹" : "tan⁻¹"; }
function rangeExpression(key: InverseKey) { return key === "acos" ? "0°  ≤  θ  ≤  180°" : key === "atan" ? "−90°  <  θ  <  90°" : "−90°  ≤  θ  ≤  90°"; }
function branchArc(key: InverseKey, cx: number, cy: number, radius: number) { const range = principalRange(key); return arcPath(cx, cy, radius, range.min, range.max); }
function arcPath(cx: number, cy: number, radius: number, start: number, end: number) { const a = polar(cx, cy, radius, start), b = polar(cx, cy, radius, end), sweep = Math.abs(end - start) > 180 ? 1 : 0; return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${sweep} 0 ${b.x} ${b.y}`; }
function polar(cx: number, cy: number, radius: number, angle: number) { const radians = toRadians(angle); return { x: cx + radius * Math.cos(radians), y: cy - radius * Math.sin(radians) }; }
function format(value: number) { const rounded = Math.abs(value) < 0.0005 ? 0 : value; return rounded.toFixed(3); }
function formatAngle(value: number) { return `${Number(value.toFixed(2))}°`; }
function toRadians(value: number) { return value * Math.PI / 180; }
function toDegrees(value: number) { return value * 180 / Math.PI; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
