import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  GraduationCap,
  Hand,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ExactTrigValuesTargetLesson260.css";

type SpecialAngle = 0 | 30 | 45 | 60 | 90;
type ExactValue = { display: string; numeric: number | null };
type ExactModel = {
  angle: SpecialAngle;
  radians: string;
  sin: ExactValue;
  cos: ExactValue;
  tan: ExactValue;
  cot: ExactValue;
  adjacent: string;
  opposite: string;
  hypotenuse: string;
};
type Challenge = { angle: SpecialAngle; expected: [string, string, string] };

const ANGLES: SpecialAngle[] = [0, 30, 45, 60, 90];
const CHALLENGES: Challenge[] = [
  { angle: 45, expected: ["sqrt2/2", "sqrt2/2", "1"] },
  { angle: 30, expected: ["1/2", "sqrt3/2", "sqrt3/3"] },
  { angle: 60, expected: ["sqrt3/2", "1/2", "sqrt3"] },
];
const EMPTY = ["", "", ""] as const;

export default function ExactTrigValuesTargetLesson260({ resetToken, onInteraction }: LessonAdapterProps) {
  const [angle, setAngle] = useState<SpecialAngle>(60);
  const [view, setView] = useState<"circle" | "triangle">("circle");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([...EMPTY]);
  const [result, setResult] = useState<"idle" | "correct" | "incorrect">("idle");
  const model = useMemo(() => exactModel(angle), [angle]);
  const challenge = CHALLENGES[challengeIndex];

  const chooseAngle = (next: SpecialAngle) => {
    setAngle(next);
    onInteraction();
  };
  const reset = (notify = true) => {
    setAngle(60);
    setView("circle");
    setChallengeIndex(0);
    setAnswers([...EMPTY]);
    setResult("idle");
    if (notify) onInteraction();
  };
  useEffect(() => {
    setAngle(60);
    setView("circle");
    setChallengeIndex(0);
    setAnswers([...EMPTY]);
    setResult("idle");
  }, [resetToken]);

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
    setResult("idle");
    onInteraction();
  };
  const grade = () => {
    const correct = challenge.expected.every((expected, index) => normalizeExact(answers[index]) === expected);
    setResult(correct ? "correct" : "incorrect");
    onInteraction();
  };
  const nextChallenge = (direction = 1) => {
    setChallengeIndex((current) => (current + direction + CHALLENGES.length) % CHALLENGES.length);
    setAnswers([...EMPTY]);
    setResult("idle");
    onInteraction();
  };

  return (
    <section
      className="target-exact-page"
      data-testid="trigonometry-mockup-0317"
      data-dedicated-lesson="260"
      data-object-model="snapped-special-angle-linked-circle-triangle-exact-value-model"
      data-angle={angle}
      data-radians={model.radians}
      data-sin={model.sin.display}
      data-cos={model.cos.display}
      data-tan={model.tan.display}
      data-cot={model.cot.display}
      data-view={view}
      data-challenge={challengeIndex + 1}
      data-practice-result={result}
    >
      <header className="target-exact-header">
        <div><span>Trigonometry</span><h1>Exact Trig Values</h1><p>Derive exact values of sin, cos, tan at special angles using linked triangles and the unit circle.</p></div>
        <footer>
          <label><Languages /><select aria-label="Lesson language" defaultValue="en" onChange={onInteraction}><option value="en">English (English)</option><option value="hi">हिन्दी (Hindi)</option></select></label>
          <button type="button" onClick={() => reset()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => { void navigator.clipboard?.writeText(`${angle}°: sin=${model.sin.display}, cos=${model.cos.display}, tan=${model.tan.display}`); onInteraction(); }}><Share2 />Share</button>
        </footer>
      </header>

      <section className="target-exact-steps">
        {[[Eye, "Observe", "See the model"], [Hand, "Manipulate", "Change the angle"], [Lightbulb, "Notice", "See the pattern"], [GraduationCap, "Understand", "Apply with confidence"]].map(([Icon, title, text]) => <article key={String(title)}><Icon /><span><b>{String(title)}</b><small>{String(text)}</small></span></article>)}
      </section>

      <section className="target-exact-linked">
        <article className="target-exact-circle-panel">
          <header><h2><i>1</i>Choose an angle θ</h2><label><strong>{angle}°</strong><span>=</span><select aria-label="Special angle" value={angle} onChange={(event) => chooseAngle(Number(event.target.value) as SpecialAngle)}>{ANGLES.map((item) => <option key={item} value={item}>{radian(item)}</option>)}</select></label></header>
          <div className="target-exact-tabs"><button type="button" className={view === "circle" ? "active" : ""} onClick={() => { setView("circle"); onInteraction(); }}>Unit Circle</button><button type="button" className={view === "triangle" ? "active" : ""} onClick={() => { setView("triangle"); onInteraction(); }}>Linked Triangle</button></div>
          {view === "circle" ? <UnitCircle model={model} onAngle={chooseAngle} /> : <LinkedTriangle model={model} compact />}
          <footer><span>cos θ = x = <b>{model.cos.display}</b>,</span><span>sin θ = y = <b>{model.sin.display}</b></span><strong>{axisLabel(angle)}</strong></footer>
        </article>
        <article className="target-exact-triangle-panel">
          <h2><i>2</i>Linked right triangle</h2>
          <LinkedTriangle model={model} />
          <section><b>{triangleName(angle)} Triangle rule</b><p>Sides are in the ratio: <strong>{model.adjacent} : {model.opposite} : {model.hypotenuse}</strong></p></section>
          <ul><li>Opposite {angle}° = {model.opposite}</li><li>Adjacent {angle}° = {model.adjacent}</li><li>Hypotenuse = {model.hypotenuse}</li></ul>
        </article>
      </section>

      <section className="target-exact-values">
        <h2><i>3</i>Exact trig values (derived from the model)</h2>
        <div>
          <ValueCard name="sin θ" numerator="opposite" denominator="hypotenuse" value={model.sin.display} />
          <ValueCard name="cos θ" numerator="adjacent" denominator="hypotenuse" value={model.cos.display} />
          <ValueCard name="tan θ" numerator="opposite" denominator="adjacent" value={model.tan.display} />
          <ValueCard name="cot θ" numerator="adjacent" denominator="opposite" value={model.cot.display} />
        </div>
        <p>ⓘ Values update instantly when you change the angle.</p>
      </section>

      <section className="target-exact-notes">
        <article><h2>Relevant Formula / Rule</h2><h3>{triangleName(angle)} Triangle Rule</h3><p>If the shorter leg is 1, then</p><LinkedTriangle model={exactModel(angle === 45 ? 45 : 60)} compact /><strong>Side ratio (adjacent : opposite : hypotenuse)<br />= {model.adjacent} : {model.opposite} : {model.hypotenuse}</strong></article>
        <article><h2>Worked Example</h2><h3>Find sin 60°, cos 60°, tan 60°.</h3><p>From the 30°-60°-90° triangle:</p><p>Opposite 60° = √3, &nbsp; Adjacent 60° = 1, &nbsp; Hypotenuse = 2</p><div>sin 60° = <Fraction top="√3" bottom="2" /><br />cos 60° = <Fraction top="1" bottom="2" /><br />tan 60° = <Fraction top="√3" bottom="1" /> = √3</div><footer><Check />Matches the model results.</footer></article>
        <article><h2><TriangleAlert />Common Misconception</h2><h3>Do not treat √3 as a decimal.</h3><p>Incorrect (approximation): &nbsp; sin 60° ≈ 0.866 <b>✕</b></p><p>Correct (exact): &nbsp; sin 60° = <Fraction top="√3" bottom="2" /> <strong>✓</strong></p><hr /><p>Exact trig values are precise surd forms. Rounding too early causes errors in further steps.</p></article>
      </section>

      <section className="target-exact-practice">
        <header><div><h2>Your Turn: Practice Challenge</h2><p>Using the model, find the missing exact values.</p></div><b>{challengeIndex + 1} of 3</b><button aria-label="Previous challenge" type="button" onClick={() => nextChallenge(-1)}><ArrowLeft /></button><button aria-label="Next challenge" type="button" onClick={() => nextChallenge(1)}><ArrowRight /></button></header>
        <div><article><label>Angle θ <strong>{challenge.angle}° = {radian(challenge.angle)}</strong></label><section>{["sin", "cos", "tan"].map((name, index) => <label key={name}>{name} {challenge.angle}° = <input aria-label={`${name} ${challenge.angle} degrees`} value={answers[index]} onChange={(event) => updateAnswer(index, event.target.value)} placeholder="?" />{result === "correct" ? <Check /> : null}</label>)}</section>{result === "incorrect" ? <p role="status">Use an exact fraction or surd. Do not enter a decimal.</p> : null}</article><aside><Trophy /><h3>{result === "correct" ? "Excellent!" : "Complete all three"}</h3><p>{result === "correct" ? "All values are correct." : "Enter exact values, then check."}</p><button type="button" onClick={result === "correct" ? () => nextChallenge(1) : grade}>{result === "correct" ? "Next Challenge" : "Check Values"}</button></aside></div>
      </section>

      <section className="target-exact-reference"><h2>Quick Reference: Special Angles</h2><table><thead><tr><th>θ (degrees)</th>{ANGLES.map((item) => <th key={item}>{item}°</th>)}</tr></thead><tbody>{(["sin", "cos", "tan"] as const).map((name) => <tr key={name}><th>{name} θ</th>{ANGLES.map((item) => <td key={item}>{exactModel(item)[name].display}</td>)}</tr>)}</tbody></table><p><b>Domains:</b> sin θ, cos θ ∈ [−1, 1] &nbsp;&nbsp;&nbsp; tan θ, cot θ ∈ R where their denominators are nonzero.</p></section>

      <nav className="target-exact-nav"><a href="/lessons/trigonometry/259-right-triangle-ratios"><ArrowLeft /><span><b>Previous</b>Right-Triangle Ratios</span></a><a href="/lessons/trigonometry/261-sine-graph"><span><b>Next</b>Sine Graph</span><ArrowRight /></a></nav>
    </section>
  );
}

function UnitCircle({ model, onAngle }: { model: ExactModel; onAngle: (angle: SpecialAngle) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const center = { x: 150, y: 150 }, radius = 115, theta = model.angle * Math.PI / 180;
  const point = { x: center.x + radius * Math.cos(theta), y: center.y - radius * Math.sin(theta) };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const degrees = Math.max(0, Math.min(90, Math.atan2(center.y - p.y, p.x - center.x) * 180 / Math.PI));
    onAngle(nearestAngle(degrees));
  };
  return <svg ref={svg} className="target-exact-circle" viewBox="0 0 350 300" role="img" aria-label="Draggable first-quadrant unit-circle point linked to exact values" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); move(event); }} onPointerMove={move}>
    <line x1="15" x2="338" y1={center.y} y2={center.y} /><line x1={center.x} x2={center.x} y1="8" y2="285" /><circle cx={center.x} cy={center.y} r={radius} fill="#f8fbff" /><path d={`M ${center.x} ${center.y} L ${point.x} ${point.y} L ${point.x} ${center.y} Z`} fill="#e0f2fe" /><line x1={point.x} x2={point.x} y1={point.y} y2={center.y} stroke="#f59e0b" /><line x1={center.x} x2={point.x} y1={center.y} y2={point.y} stroke="#0ea5e9" strokeWidth="2" /><circle data-testid="exact-unit-circle-handle" cx={point.x} cy={point.y} r="7" fill="#0ea5e9" />
    <text x={point.x + 7} y={point.y - 8}>({model.cos.display}, {model.sin.display})</text><text x={center.x + 27} y={center.y - 13}>{model.angle}°</text><text x="42" y="160">(−1, 0)</text><text x="284" y="160">(1, 0)</text><text x="190" y="35">(0, 1)</text><text x="190" y="265">(0, −1)</text><text x="326" y="137">x</text><text x="166" y="15">y</text>
  </svg>;
}

function LinkedTriangle({ model, compact = false }: { model: ExactModel; compact?: boolean }) {
  const y0 = compact ? 105 : 203;
  const height = compact ? 80 : 186 * Math.sin(model.angle * Math.PI / 180) / Math.sin(Math.PI / 3);
  const x0 = 25, x1 = compact ? 165 : 160, y1 = Math.max(compact ? 18 : 20, y0 - height);
  return <svg className={compact ? "target-exact-triangle compact" : "target-exact-triangle"} viewBox={`0 0 240 ${compact ? 120 : 235}`} preserveAspectRatio={compact ? "xMidYMid meet" : "none"} role="img" aria-label={`Linked right triangle for ${model.angle} degrees`}><polygon points={`${x0},${y0} ${x1},${y0} ${x1},${y1}`} fill="#eef8ff" stroke="#2563eb" strokeWidth="2" /><path d={`M ${x1 - 15} ${y0} V ${y0 - 15} H ${x1}`} fill="none" stroke="#334155" /><text x={x0 + 18} y={y0 - 8}>{model.angle}°</text><text x={x1 - 28} y={y1 + 28}>{90 - model.angle}°</text><text x={(x0 + x1) / 2} y={y0 + 17} fill="#059669">{model.adjacent}</text><text x={x1 + 9} y={(y0 + y1) / 2} fill="#7c3aed">{model.opposite}</text><text x={(x0 + x1) / 2 - 8} y={(y0 + y1) / 2 - 6} fill="#0369a1">{model.hypotenuse}</text></svg>;
}

function ValueCard({ name, numerator, denominator, value }: { name: string; numerator: string; denominator: string; value: string }) { return <article><h3>{name}</h3><p>= <Fraction top={numerator} bottom={denominator} /></p><p>= <b>{value}</b></p><footer><Check />Correct</footer></article>; }
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="target-exact-fraction"><span>{top}</span><span>{bottom}</span></span>; }

function exactModel(angle: SpecialAngle): ExactModel {
  const values: Record<SpecialAngle, Omit<ExactModel, "angle">> = {
    0: { radians: "0", sin: value("0", 0), cos: value("1", 1), tan: value("0", 0), cot: value("Undefined", null), adjacent: "1", opposite: "0", hypotenuse: "1" },
    30: { radians: "π/6", sin: value("1/2", .5), cos: value("√3/2", Math.sqrt(3) / 2), tan: value("√3/3", 1 / Math.sqrt(3)), cot: value("√3", Math.sqrt(3)), adjacent: "√3", opposite: "1", hypotenuse: "2" },
    45: { radians: "π/4", sin: value("√2/2", Math.SQRT1_2), cos: value("√2/2", Math.SQRT1_2), tan: value("1", 1), cot: value("1", 1), adjacent: "1", opposite: "1", hypotenuse: "√2" },
    60: { radians: "π/3", sin: value("√3/2", Math.sqrt(3) / 2), cos: value("1/2", .5), tan: value("√3", Math.sqrt(3)), cot: value("√3/3", 1 / Math.sqrt(3)), adjacent: "1", opposite: "√3", hypotenuse: "2" },
    90: { radians: "π/2", sin: value("1", 1), cos: value("0", 0), tan: value("Undefined", null), cot: value("0", 0), adjacent: "0", opposite: "1", hypotenuse: "1" },
  };
  return { angle, ...values[angle] };
}
function value(display: string, numeric: number | null): ExactValue { return { display, numeric }; }
function radian(angle: SpecialAngle) { return exactModel(angle).radians; }
function nearestAngle(value: number) { return ANGLES.reduce((best, item) => Math.abs(item - value) < Math.abs(best - value) ? item : best); }
function axisLabel(angle: SpecialAngle) { return angle === 0 || angle === 90 ? "On an axis" : "Quadrant I (All trig values positive)"; }
function triangleName(angle: SpecialAngle) { return angle === 45 ? "45°–45°–90°" : angle === 0 || angle === 90 ? "Axis limit" : "30°–60°–90°"; }
function normalizeExact(value: string) { return value.toLowerCase().replaceAll(" ", "").replaceAll("√", "sqrt").replaceAll("sqrt(", "sqrt").replaceAll(")", "").replace(/^\+/, ""); }
