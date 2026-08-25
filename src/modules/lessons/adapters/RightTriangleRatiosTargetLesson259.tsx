import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Eye,
  Hand,
  Languages,
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
import "./RightTriangleRatiosTargetLesson259.css";

type Point = { x: number; y: number };
type DragKey = "o" | "b" | "c";
type Answers = { opposite: string; hypotenuse: string; sin: string; cos: string; tan: string };
const INITIAL = { o: { x: 0, y: 0 }, adjacent: 3, opposite: 3 };
const EMPTY_ANSWERS: Answers = { opposite: "", hypotenuse: "", sin: "", cos: "", tan: "" };

export default function RightTriangleRatiosTargetLesson259({ resetToken, onInteraction }: LessonAdapterProps) {
  const [construction, setConstruction] = useState(INITIAL);
  const [snap, setSnap] = useState(true);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<"idle" | "correct" | "incorrect">("idle");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);
  const model = useMemo(() => triangleModel(construction), [construction]);

  const update = (next: typeof INITIAL, notify = true) => {
    setConstruction({
      o: { x: round(clamp(next.o.x, -2, 2), 2), y: round(clamp(next.o.y, -1, 1), 2) },
      adjacent: round(clamp(next.adjacent, .5, 8), 3),
      opposite: round(clamp(next.opposite, .25, 8), 3),
    });
    if (notify) onInteraction();
  };
  const updateAngle = (angle: number) => {
    const limited = clamp(angle, 5, 85);
    const snapped = snap ? nearest(limited, [15, 30, 45, 60, 75]) : limited;
    const hypotenuse = Math.hypot(construction.adjacent, construction.opposite);
    update({
      ...construction,
      adjacent: hypotenuse * Math.cos(snapped * Math.PI / 180),
      opposite: hypotenuse * Math.sin(snapped * Math.PI / 180),
    });
  };
  const reset = (notify = true) => {
    setConstruction(INITIAL);
    setSnap(true);
    setAnswers(EMPTY_ANSWERS);
    setResult("idle");
    setLanguageOpen(false);
    setSolutionShown(false);
    if (notify) onInteraction();
  };
  useEffect(() => {
    setConstruction(INITIAL);
    setSnap(true);
    setAnswers(EMPTY_ANSWERS);
    setResult("idle");
    setLanguageOpen(false);
    setSolutionShown(false);
  }, [resetToken]);

  const movePoint = (key: DragKey, point: Point) => {
    if (key === "o") {
      update({ ...construction, o: point });
      return;
    }
    if (key === "b") {
      update({ ...construction, adjacent: point.x - construction.o.x });
      return;
    }
    let adjacent = clamp(point.x - construction.o.x, .5, 8);
    let opposite = clamp(point.y - construction.o.y, .25, 8);
    if (snap) {
      const radius = Math.hypot(adjacent, opposite);
      const angle = nearest(Math.atan2(opposite, adjacent) * 180 / Math.PI, [15, 30, 45, 60, 75]);
      adjacent = radius * Math.cos(angle * Math.PI / 180);
      opposite = radius * Math.sin(angle * Math.PI / 180);
    }
    update({ ...construction, adjacent, opposite });
  };
  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setResult("idle");
    setSolutionShown(false);
    onInteraction();
  };
  const grade = () => {
    const expected = practiceExpected();
    const correct = (Object.keys(expected) as Array<keyof Answers>).every((key) => {
      const value = Number(answers[key]);
      return Number.isFinite(value) && Math.abs(value - expected[key]) <= .001;
    });
    setResult(correct ? "correct" : "incorrect");
    onInteraction();
  };
  const showSolution = () => {
    const expected = practiceExpected();
    setAnswers(Object.fromEntries(Object.entries(expected).map(([key, value]) => [key, String(value)])) as unknown as Answers);
    setSolutionShown(true);
    setResult("correct");
    onInteraction();
  };

  return (
    <section
      className="target-right-triangle-page"
      data-testid="trigonometry-mockup-0316"
      data-dedicated-lesson="259"
      data-object-model="axis-aligned-right-triangle-dependent-vertex-ratio-model"
      data-origin-x={model.o.x.toFixed(3)}
      data-origin-y={model.o.y.toFixed(3)}
      data-adjacent={model.adjacent.toFixed(6)}
      data-opposite={model.opposite.toFixed(6)}
      data-hypotenuse={model.hypotenuse.toFixed(6)}
      data-angle={model.angle.toFixed(6)}
      data-sin={model.sin.toFixed(6)}
      data-cos={model.cos.toFixed(6)}
      data-tan={model.tan.toFixed(6)}
      data-right-angle="true"
      data-solution-shown={solutionShown}
    >
      <header className="target-right-triangle-header">
        <div><span>Trigonometry</span><span>Trigonometry</span><h1>Right-Triangle Ratios</h1><p>Understand SOH-CAH-TOA.</p><section><b>♙ Intermediate-Advanced</b><b>ϟ Visual Lab</b><b>▣ Trig Graphing / Geometry</b><b>◷ 6-10 min</b></section></div>
        <button type="button" className="target-right-workspace-button" onClick={() => { document.querySelector(".target-right-triangle-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }); onInteraction(); }}>↗ Workspace</button>
        <footer>
          <div><button type="button" aria-expanded={languageOpen} onClick={() => { setLanguageOpen((value) => !value); onInteraction(); }}><Languages />English (English)⌄</button>{languageOpen ? <span role="status">English lesson language selected.</span> : null}</div>
          <button type="button" onClick={() => reset()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => { void navigator.clipboard?.writeText(`Right triangle: θ=${model.angle.toFixed(1)}°, opposite=${model.opposite.toFixed(3)}, adjacent=${model.adjacent.toFixed(3)}, hypotenuse=${model.hypotenuse.toFixed(3)}`); onInteraction(); }}><Share2 />Share</button>
        </footer>
      </header>

      <section className="target-right-triangle-steps">
        {[[Eye, "1 Observe", "A right triangle has one 90° angle. The sides relate to angle θ."], [Hand, "2 Manipulate", "Drag O or any vertex. Sides and ratios update in real time."], [Lightbulb, "3 Notice", "Opposite, adjacent and hypotenuse change, but ratios follow rules."], [Brain, "4 Understand", "SOH-CAH-TOA links sides to sin, cos and tan of θ."]].map(([Icon, title, text]) => <article key={String(title)}><Icon /><span><b>{String(title)}</b><p>{String(text)}</p></span></article>)}
      </section>

      <section className="target-right-triangle-workspace">
        <h2>Explore a Right Triangle</h2>
        <div>
          <aside className="target-right-angle-control"><h3>Angle θ</h3><output>{model.angle.toFixed(0)}°</output><input aria-label="Angle theta" type="range" min="5" max="85" step="1" value={model.angle} onChange={(e) => updateAngle(Number(e.target.value))} /><p><span>0°</span><span>90°</span></p><label><input type="checkbox" checked={snap} onChange={(e) => { setSnap(e.target.checked); onInteraction(); }} />Snap to special angles</label></aside>
          <article className="target-right-triangle-canvas"><RightTriangleGraph model={model} snap={snap} onPoint={movePoint} /><footer><span><i />Opposite (a)</span><span><i />Adjacent (b)</span><span><i />Hypotenuse (c)</span></footer></article>
          <aside className="target-right-ratios"><h3>Ratios for θ = {model.angle.toFixed(0)}°</h3><Ratio name="sin θ" numerator="opposite" denominator="hypotenuse" symbols="a / c" numbers={`${model.opposite.toFixed(3)} / ${model.hypotenuse.toFixed(3)}`} value={model.sin} tone="pink" /><Ratio name="cos θ" numerator="adjacent" denominator="hypotenuse" symbols="b / c" numbers={`${model.adjacent.toFixed(3)} / ${model.hypotenuse.toFixed(3)}`} value={model.cos} tone="green" /><Ratio name="tan θ" numerator="opposite" denominator="adjacent" symbols="a / b" numbers={`${model.opposite.toFixed(3)} / ${model.adjacent.toFixed(3)}`} value={model.tan} tone="blue" /><section><h3>Domains</h3><p>sin θ, cos θ, tan θ are defined for<br />θ ≠ 90° + k·180°, where k ∈ Z.</p></section><QuadrantTable /></aside>
        </div>
        <footer className="target-right-drag-note"><Hand />Drag O, B, or C. Right angle at B is fixed.</footer>
      </section>

      <section className="target-right-rules"><article><h2>The Rule (SOH-CAH-TOA)</h2><p>For angle θ in a right triangle:</p><div><b>sin θ = <Fraction top="opposite" bottom="hypotenuse" /></b><b>cos θ = <Fraction top="adjacent" bottom="hypotenuse" /></b><b>tan θ = <Fraction top="opposite" bottom="adjacent" /></b></div><p>Remember: <strong>Hypotenuse</strong> is always opposite the right angle.</p></article><article><h2><Target />Key Takeaway</h2><p>Changing the size of the triangle does not change these ratios - only the angle θ determines them.</p><footer>Use sin, cos, tan to connect angles with side lengths in any right triangle.</footer></article></section>

      <section className="target-right-examples"><article><h2>Worked Example</h2><h3>In a right triangle, θ = 30° and the hypotenuse is 10 units.<br />Find the opposite side, adjacent side and all three ratios.</h3><div><section><b>Solution:</b><p>• Opposite = 10 · sin 30° = 10 · 1/2 = 5</p><p>• Adjacent = 10 · cos 30° = 10 · √3/2 = 5√3 ≈ 8.660</p><p>• tan 30° = opposite/adjacent = 1/√3 ≈ 0.5774</p><p>• Check: sin²θ + cos²θ = 1 ✓</p></section><ExampleTriangle /></div><footer><Check />Correct! All values are consistent with SOH-CAH-TOA.</footer></article><article><h2><TriangleAlert />Common Misconception</h2><p><b>Mixing up opposite and adjacent sides.</b></p><div><SideLabelExample correct /><SideLabelExample correct={false} /></div><footer>Always identify the right angle first, then mark opposite, adjacent and hypotenuse.</footer></article></section>

      <section className="target-right-practice"><article><h2>◎ Practice Challenge</h2><p>Set θ = 60°. If the adjacent side is 6 units, find the opposite side, hypotenuse and all three ratios.<br />Round to 4 decimal places.</p><div><PracticeInput label="Opposite" value={answers.opposite} onChange={(value) => setAnswer("opposite", value)} suffix="units" /><PracticeInput label="sin 60°" value={answers.sin} onChange={(value) => setAnswer("sin", value)} /><PracticeInput label="Hypotenuse" value={answers.hypotenuse} onChange={(value) => setAnswer("hypotenuse", value)} suffix="units" /><PracticeInput label="cos 60°" value={answers.cos} onChange={(value) => setAnswer("cos", value)} /><span /><PracticeInput label="tan 60°" value={answers.tan} onChange={(value) => setAnswer("tan", value)} /></div><button type="button" onClick={grade}>⌁ Check Answer</button>{result !== "idle" ? <p role="status" className={result}>{result === "correct" ? "Correct. Every side and ratio matches." : "Check each value and round to four decimal places."}</p> : null}</article><aside><h3>☼ Need a hint?</h3><p>Use cos 60° = adjacent/hypotenuse to find hypotenuse first, then use sin 60° and tan 60°.</p><button type="button" onClick={showSolution}><Eye />Show Solution</button></aside></section>

      <nav className="target-right-triangle-nav"><a href="/lessons/trigonometry/258-unit-circle"><ArrowLeft /><span><b>Previous</b>Unit Circle</span></a><a href="/lessons/trigonometry/260-exact-trig-values"><span><b>Next</b>Exact Trig Values</span><ArrowRight /></a></nav>
    </section>
  );
}

function RightTriangleGraph({ model, snap, onPoint }: { model: ReturnType<typeof triangleModel>; snap: boolean; onPoint: (key: DragKey, point: Point) => void }) {
  const svg = useRef<SVGSVGElement>(null), drag = useRef<DragKey | null>(null), origin = { x: 58, y: 270 }, scaleX = Math.min(76, 230 / model.adjacent), scaleY = Math.min(62, 210 / model.opposite);
  const screen = (p: Point) => ({ x: origin.x + p.x * scaleX, y: origin.y - p.y * scaleY });
  const world = (event: ReactPointerEvent<SVGSVGElement>) => { const matrix = svg.current?.getScreenCTM(); if (!matrix) return null; const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()); return { x: (p.x - origin.x) / scaleX, y: (origin.y - p.y) / scaleY }; };
  const o = screen(model.o), b = screen(model.b), c = screen(model.c);
  return <svg ref={svg} className="target-right-triangle-graph" viewBox="0 0 400 360" preserveAspectRatio="none" role="img" aria-label="Coordinate-grid right triangle OBC with independently draggable O, B and C and right angle at B" data-snap={snap} onPointerMove={(e) => { if (!drag.current) return; const p = world(e); if (p) onPoint(drag.current, p); }} onPointerUp={() => { drag.current = null; }}>
    <Grid /><line x1="22" x2="398" y1={origin.y} y2={origin.y} stroke="#64748b" /><line x1={origin.x} x2={origin.x} y1="0" y2="348" stroke="#64748b" /><polygon points={`${o.x},${o.y} ${b.x},${b.y} ${c.x},${c.y}`} fill="#eff6ff" />
    <line x1={o.x} y1={o.y} x2={b.x} y2={b.y} stroke="#10b981" strokeWidth="3" /><line x1={b.x} y1={b.y} x2={c.x} y2={c.y} stroke="#ec407a" strokeWidth="3" /><line x1={o.x} y1={o.y} x2={c.x} y2={c.y} stroke="#2563eb" strokeWidth="3" />
    <path d={`M ${b.x - 16} ${b.y} L ${b.x - 16} ${b.y - 16} L ${b.x} ${b.y - 16}`} fill="none" stroke="#10b981" strokeWidth="2" /><path d={angleArc(o.x, o.y, 45, model.angle)} fill="none" stroke="#2563eb" strokeWidth="2" />
    {(["o", "b", "c"] as DragKey[]).map((key) => { const p = { o, b, c }[key]; return <circle key={key} data-testid={`right-triangle-point-${key}`} cx={p.x} cy={p.y} r="7" fill={key === "c" ? "#2563eb" : "#1d4ed8"} onPointerDown={(e) => { drag.current = key; e.currentTarget.setPointerCapture(e.pointerId); }} />; })}
    <text x={o.x - 40} y={o.y + 18}>O ({coordinate(model.o.x)}, {coordinate(model.o.y)})</text><text x={b.x + 8} y={b.y + 18}>B ({coordinate(model.b.x)}, {coordinate(model.b.y)})</text><text x={c.x + 8} y={c.y - 8}>C ({coordinate(model.c.x)}, {coordinate(model.c.y)})</text>
    <text x={(o.x + b.x) / 2 - 35} y={b.y + 30} fill="#059669" fontWeight="800">Adjacent (b) = {model.adjacent.toFixed(3)}</text><text x={b.x + 14} y={(b.y + c.y) / 2} fill="#db2777" fontWeight="800">Opposite (a) = {model.opposite.toFixed(3)}</text><text x={(o.x + c.x) / 2 - 55} y={(o.y + c.y) / 2 - 12} fill="#2563eb" fontWeight="800" transform={`rotate(${-model.angle} ${(o.x + c.x) / 2 - 55} ${(o.y + c.y) / 2 - 12})`}>Hypotenuse (c) = {model.hypotenuse.toFixed(3)}</text><text x={o.x + 55} y={o.y - 25} fill="#2563eb" fontWeight="800">θ = {model.angle.toFixed(1)}°</text>
  </svg>;
}
function Grid() { return <g stroke="#e5edf5" strokeDasharray="2 3">{Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={45 + i * 50} x2={45 + i * 50} y1="20" y2="345" />)}{Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="25" x2="455" y1={35 + i * 50} y2={35 + i * 50} />)}</g>; }
function Ratio({ name, numerator, denominator, symbols, numbers, value, tone }: { name: string; numerator: string; denominator: string; symbols: string; numbers: string; value: number; tone: string }) { return <article className={tone}><b>{name}</b><span><Fraction top={numerator} bottom={denominator} /> = {symbols} = <Fraction top={numbers.split(" / ")[0]} bottom={numbers.split(" / ")[1]} /> = <strong>{value.toFixed(4)}</strong></span></article>; }
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="target-right-fraction"><span>{top}</span><span>{bottom}</span></span>; }
function QuadrantTable() { return <section className="target-right-quadrants"><h3>Signs by Quadrant (ASTC)</h3><table><thead><tr><th /><th>I</th><th>II</th><th>III</th><th>IV</th></tr></thead><tbody>{[["sin", "+", "+", "−", "−"], ["cos", "+", "−", "−", "+"], ["tan", "+", "−", "+", "−"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></section>; }
function ExampleTriangle() { return <svg viewBox="0 0 180 125"><polygon points="12,112 160,112 160,25" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" /><path d="M147 112V99H160" fill="none" stroke="#10b981" strokeWidth="2" /><text x="45" y="106" fill="#2563eb">30°</text><text x="72" y="124" fill="#059669">5√3</text><text x="164" y="72" fill="#db2777">5</text><text x="72" y="62" fill="#2563eb">10</text><text x="160" y="20">C</text><text x="160" y="123">B</text><text x="5" y="123">A</text></svg>; }
function SideLabelExample({ correct }: { correct: boolean }) { return <section><svg viewBox="0 0 150 80"><polygon points="8,70 132,70 132,16" fill="#fff" stroke="#2563eb" /><path d="M120 70V58H132" fill="none" stroke="#10b981" /><text x="28" y="65">θ</text><text x="55" y="78" fill="#059669">{correct ? "adjacent" : "opposite"}</text><text x="134" y="48" fill="#db2777">{correct ? "opposite" : "hypotenuse"}</text></svg><b className={correct ? "correct" : "wrong"}>{correct ? "✓ Correct" : "✕ Incorrect"}</b><p>{correct ? "Opposite is across from θ." : "Adjacent is next to θ, not the hypotenuse."}</p></section>; }
function PracticeInput({ label, value, onChange, suffix }: { label: string; value: string; onChange: (value: string) => void; suffix?: string }) { return <label><b>{label} =</b><input aria-label={label} inputMode="decimal" value={value} placeholder="?" onChange={(e) => onChange(e.target.value)} /><span>{suffix}</span></label>; }
function triangleModel(value: typeof INITIAL) { const o = value.o, b = { x: o.x + value.adjacent, y: o.y }, c = { x: b.x, y: o.y + value.opposite }, hypotenuse = Math.hypot(value.adjacent, value.opposite), angle = Math.atan2(value.opposite, value.adjacent) * 180 / Math.PI; return { o, b, c, adjacent: value.adjacent, opposite: value.opposite, hypotenuse, angle, sin: value.opposite / hypotenuse, cos: value.adjacent / hypotenuse, tan: value.opposite / value.adjacent }; }
function practiceExpected() { return { opposite: 10.3923, hypotenuse: 12, sin: .866, cos: .5, tan: 1.7321 }; }
function nearest(value: number, choices: number[]) { return choices.reduce((best, item) => Math.abs(item - value) < Math.abs(best - value) ? item : best); }
function angleArc(x: number, y: number, radius: number, angle: number) { const end = angle * Math.PI / 180; return `M ${x + radius} ${y} A ${radius} ${radius} 0 0 0 ${x + radius * Math.cos(end)} ${y - radius * Math.sin(end)}`; }
function coordinate(value: number) { return Math.abs(value) < 1e-8 ? "0" : value.toFixed(3); }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function round(value: number, places: number) { const factor = 10 ** places; return Math.round(value * factor) / factor; }
