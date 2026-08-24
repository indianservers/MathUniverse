import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Clock3,
  Expand,
  Lightbulb,
  Maximize2,
  Pencil,
  RefreshCcw,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./TranslationVectorTargetLesson236.css";

type Point = { x: number; y: number };
type Triangle = { a: Point; b: Point; c: Point };
type DragState =
  | { kind: "shape"; start: Point; initial: Triangle }
  | { kind: "vector" }
  | null;

const INITIAL_TRIANGLE: Triangle = {
  a: { x: -2, y: -1 },
  b: { x: 0, y: 1 },
  c: { x: -1, y: -3 },
};
const INITIAL_VECTOR = { x: 3, y: 4 };
const PRACTICE_TRIANGLE: Triangle = {
  a: { x: -4, y: 0 },
  b: { x: -3, y: 3 },
  c: { x: -2, y: 0 },
};
const PRACTICE_VECTOR = { x: -2, y: 3 };
const STAGES = ["Observe", "Manipulate", "Notice", "Understand", "Practice"];

export default function TranslationVectorTargetLesson236({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [triangle, setTriangle] = useState<Triangle>(INITIAL_TRIANGLE);
  const [vector, setVector] = useState<Point>(INITIAL_VECTOR);
  const [stage, setStage] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("Observe: every vertex receives the same vector.");
  const [practiceTriangle, setPracticeTriangle] = useState<Triangle>(PRACTICE_TRIANGLE);
  const [practiceVector, setPracticeVector] = useState<Point>(PRACTICE_VECTOR);
  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [practiceStatus, setPracticeStatus] = useState("Enter all image coordinates, then check.");
  const canvasRef = useRef<HTMLElement>(null);

  const image = useMemo(() => translateTriangle(triangle, vector), [triangle, vector]);
  const practiceImage = useMemo(
    () => translateTriangle(practiceTriangle, practiceVector),
    [practiceTriangle, practiceVector],
  );

  const reset = () => {
    setTriangle(INITIAL_TRIANGLE);
    setVector(INITIAL_VECTOR);
    setStage(1);
    setEditing(false);
    setStatus("Observe: every vertex receives the same vector.");
    onInteraction();
  };

  useEffect(() => {
    setTriangle(INITIAL_TRIANGLE);
    setVector(INITIAL_VECTOR);
    setStage(1);
    setBookmarked(false);
    setEditing(false);
    setStatus("Observe: every vertex receives the same vector.");
    setPracticeTriangle(PRACTICE_TRIANGLE);
    setPracticeVector(PRACTICE_VECTOR);
    setAnswers(["", "", "", "", "", ""]);
    setPracticeStatus("Enter all image coordinates, then check.");
  }, [resetToken]);

  const updateVector = (axis: "x" | "y", value: number) => {
    setVector((current) => ({ ...current, [axis]: clamp(value, -6, 6) }));
    setStatus(`Vector ${axis}-component updated; all image vertices recalculated.`);
    onInteraction();
  };

  const share = async () => {
    const text = `Translation v=<${format(vector.x)}, ${format(vector.y)}> maps A${formatPoint(triangle.a)} to A'${formatPoint(image.a)}.`;
    try {
      await navigator.clipboard?.writeText(text);
      setStatus("Translation mapping copied for sharing.");
    } catch {
      setStatus("Share summary prepared.");
    }
    onInteraction();
  };

  const checkPractice = () => {
    const expected = flattenTriangle(practiceImage);
    const parsed = answers.map(Number);
    const correct = parsed.every(
      (value, index) => answers[index].trim() !== "" && Math.abs(value - expected[index]) < 0.01,
    );
    setPracticeStatus(
      correct
        ? "Correct: every practice vertex was translated by the current vector."
        : "Not yet: add the same vector components to A, B, and C.",
    );
    onInteraction();
  };

  const showSolution = () => {
    setAnswers(flattenTriangle(practiceImage).map((value) => format(value)));
    setPracticeStatus("Solution shown from the current practice construction.");
    onInteraction();
  };

  return (
    <section
      className="target-translation-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0293"
      data-dedicated-lesson="236"
      data-object-model="rigid-vector-translation-pair"
      data-vector-x={vector.x.toFixed(4)}
      data-vector-y={vector.y.toFixed(4)}
      aria-label="Translation by Vector dedicated interactive geometry model"
    >
      <header className="target-translation-header">
        <div>
          <span>Coordinate Geometry</span>
          <h1>Translation by Vector</h1>
          <p>Move every point of a figure the same distance in the same direction using a vector.</p>
          <footer>
            <b><Sparkles /> Level: Intermediate-Advanced</b>
            <b><Expand /> Tools: Drag • Vector • Translate</b>
            <b><Clock3 /> Estimated time: 6-10 min</b>
          </footer>
        </div>
        <aside>
          <button type="button" aria-label="Share translation" onClick={() => void share()}><Share2 /> Share</button>
          <button type="button" aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"} className={bookmarked ? "is-active" : ""} onClick={() => { setBookmarked((value) => !value); onInteraction(); }}><Bookmark /></button>
        </aside>
      </header>

      <nav className="target-translation-stages" aria-label="Translation lesson stages">
        {STAGES.map((name, index) => <button type="button" key={name} className={stage === index + 1 ? "is-active" : ""} onClick={() => { setStage(index + 1); setStatus(`${name} stage selected.`); onInteraction(); }}><i>{index === 0 ? "◔" : index === 1 ? "⌘" : index === 2 ? "☼" : index === 3 ? "♧" : "✓"}</i><b>{index + 1} {name}</b></button>)}
      </nav>

      <section className="target-translation-workspace">
        <article ref={canvasRef} className="target-translation-explorer">
          <header><div><h2>Explore the translation</h2><p>Drag the triangle or the vector to see how the figure moves.</p></div><aside><button type="button" onClick={reset}><RotateCcw /> Reset</button><button type="button" aria-label="Full screen translation graph" onClick={() => void toggleFullscreen(canvasRef.current)}><Maximize2 /></button></aside></header>
          <TranslationGraph triangle={triangle} vector={vector} onTriangle={setTriangle} onVector={(next) => { setVector(next); setStatus("Vector dragged; all image coordinates recalculated."); onInteraction(); }} onInteraction={onInteraction} />
          <footer>
            <div><b>Vector</b><i>v</i><strong>&lt; {format(vector.x)}, {format(vector.y)} &gt;</strong></div>
            <aside><button type="button" className={editing ? "is-active" : ""} onClick={() => { setEditing((value) => !value); onInteraction(); }}><Pencil /> Edit</button><button type="button" onClick={() => { setVector(({ x, y }) => ({ x: -x, y: -y })); setStatus("Vector reversed; the image moved by the opposite translation."); onInteraction(); }}><RefreshCcw /> Reverse</button><button type="button" aria-label="Delete vector" onClick={() => { setVector({ x: 0, y: 0 }); setStatus("Vector deleted: image and source now coincide."); onInteraction(); }}><Trash2 /></button></aside>
          </footer>
        </article>

        <aside className="target-translation-controls">
          <h2>Vector controls</h2>
          <section>
            <h3>Vector <i>v</i> = <strong>&lt; {format(vector.x)}, {format(vector.y)} &gt;</strong></h3>
            <b>Components</b>
            <div className="target-translation-component-pair"><input aria-label="Vector x component exact value" type="number" min="-6" max="6" step="1" value={vector.x} onChange={(event) => updateVector("x", Number(event.target.value))} /><span>x +</span><input aria-label="Vector y component exact value" type="number" min="-6" max="6" step="1" value={vector.y} onChange={(event) => updateVector("y", Number(event.target.value))} /><span>y</span></div>
            <VectorControl axis="x" value={vector.x} onValue={(value) => updateVector("x", value)} />
            <VectorControl axis="y" value={vector.y} onValue={(value) => updateVector("y", value)} />
            <aside><b>Component form</b><p><i>v</i> = &lt; a, b &gt; = &lt; {format(vector.x)}, {format(vector.y)} &gt;</p></aside>
          </section>
          <section className="target-translation-mapping"><h3>What happened?</h3>{(["a", "b", "c"] as const).map((key) => <p key={key}><b>{key.toUpperCase()}</b> {formatPoint(triangle[key])}<ArrowRight /><strong>{key.toUpperCase()}'</strong> {formatPoint(image[key])}</p>)}<aside><b>Observe</b><p>Each point moved {directionText(vector)}.</p><CheckCircle2 /></aside></section>
        </aside>
      </section>

      <section className="target-translation-rule">
        <h2>How to translate</h2>
        <div>
          <article><h3>Construction steps</h3><ol><li>Choose vector <i>v</i> = &lt; a, b &gt;.</li><li>From each vertex, move a units horizontally and b units vertically.</li><li>Mark the new position to get the image point.</li><li>Connect the image points to form the translated figure.</li></ol></article>
          <article><h3>Coordinate rule</h3><strong>(x, y) + &lt; a, b &gt; = (x + a, y + b)</strong><h3>General rule</h3><p>If P(x, y) is a point and <i>v</i> = &lt; a, b &gt;, then the image P'(x', y') is given by:</p><strong>P'(x', y') = (x + a, y + b)</strong></article>
          <article><h3>Key idea</h3><div><Lightbulb /><p>A translation slides a figure without rotating or resizing it. All points move the same distance and in the same direction.</p></div><p><Check /> Shape and size stay the same.</p><p><Check /> Orientation stays the same.</p></article>
        </div>
      </section>

      <section className="target-translation-practice">
        <header><h2>Try it yourself</h2><p>Translate the triangle using the given vector.</p><aside><b>Given vector</b><strong><i>v</i> = &lt; {format(practiceVector.x)}, {format(practiceVector.y)} &gt;</strong><small>Drag the triangle or the vector.</small></aside></header>
        <PracticeGraph triangle={practiceTriangle} vector={practiceVector} onTriangle={(next) => { setPracticeTriangle(next); setAnswers(["", "", "", "", "", ""]); setPracticeStatus("Practice triangle moved; recompute the image coordinates."); onInteraction(); }} onVector={(next) => { setPracticeVector(next); setAnswers(["", "", "", "", "", ""]); setPracticeStatus("Practice vector changed; recompute every image point."); onInteraction(); }} />
        <aside className="target-translation-answers"><h3>Your answers</h3>{(["A'", "B'", "C'"] as const).map((label, row) => <label key={label}><b>{label} = (</b><input aria-label={`${label} x coordinate`} inputMode="decimal" value={answers[row * 2]} onChange={(event) => setAnswers((current) => replaceAt(current, row * 2, event.target.value))} /><span>,</span><input aria-label={`${label} y coordinate`} inputMode="decimal" value={answers[row * 2 + 1]} onChange={(event) => setAnswers((current) => replaceAt(current, row * 2 + 1, event.target.value))} /><b>)</b></label>)}<div><button type="button" onClick={checkPractice}>Check</button><button type="button" onClick={showSolution}>Show solution</button></div><output role="status">{practiceStatus}</output></aside>
      </section>

      <nav className="target-translation-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry"><ArrowLeft /><span><b>Previous</b>Transformations and Loci</span></a><div><button type="button" className={stage === 1 ? "is-active" : ""} onClick={() => setStage(1)}>★</button>{[2, 3, 4, 5].map((value) => <button type="button" key={value} className={stage === value ? "is-active" : ""} onClick={() => setStage(value)}>★</button>)}<b>Step {stage} of 5</b></div><a href="/lessons/geometry/237-reflection-in-line"><span><b>Next</b>Reflection in Line</span><ArrowRight /></a></nav>
      <span className="sr-only" role="status">{status}</span>
    </section>
  );
}

function TranslationGraph({ triangle, vector, onTriangle, onVector, onInteraction }: { triangle: Triangle; vector: Point; onTriangle: (value: Triangle) => void; onVector: (value: Point) => void; onInteraction: () => void }) {
  const image = translateTriangle(triangle, vector);
  return <InteractivePlane className="target-translation-main-graph" label="Interactive translation graph with draggable source triangle and vector" triangle={triangle} image={image} vector={vector} origin={{ x: 245, y: 212 }} scale={30} vectorOrigin={{ x: 0, y: .5 }} onTriangle={(next) => { onTriangle(next); onInteraction(); }} onVector={onVector} />;
}

function PracticeGraph({ triangle, vector, onTriangle, onVector }: { triangle: Triangle; vector: Point; onTriangle: (value: Triangle) => void; onVector: (value: Point) => void }) {
  return <InteractivePlane className="target-translation-practice-graph" label="Practice translation graph with draggable triangle and vector" triangle={triangle} vector={vector} origin={{ x: 134, y: 104 }} scale={18} vectorOrigin={{ x: 7, y: -2 }} onTriangle={onTriangle} onVector={onVector} />;
}

function InteractivePlane({ className, label, triangle, image, vector, origin, scale, vectorOrigin, onTriangle, onVector }: { className: string; label: string; triangle: Triangle; image?: Triangle; vector: Point; origin: Point; scale: number; vectorOrigin: Point; onTriangle: (value: Triangle) => void; onVector: (value: Point) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const drag = useRef<DragState>(null);
  const screen = (point: Point) => ({ x: origin.x + point.x * scale, y: origin.y - point.y * scale });
  const world = (event: ReactPointerEvent<SVGSVGElement>) => {
    const matrix = ref.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: (point.x - origin.x) / scale, y: (origin.y - point.y) / scale };
  };
  const beginShape = (event: ReactPointerEvent<SVGElement>) => {
    const point = world(event as unknown as ReactPointerEvent<SVGSVGElement>);
    if (!point) return;
    drag.current = { kind: "shape", start: point, initial: cloneTriangle(triangle) };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const beginVector = (event: ReactPointerEvent<SVGCircleElement>) => {
    drag.current = { kind: "vector" };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    const active = drag.current;
    const point = world(event);
    if (!active || !point) return;
    if (active.kind === "vector") {
      onVector({ x: clamp(roundHalf(point.x - vectorOrigin.x), -6, 6), y: clamp(roundHalf(point.y - vectorOrigin.y), -6, 6) });
      return;
    }
    const dx = roundHalf(point.x - active.start.x), dy = roundHalf(point.y - active.start.y);
    onTriangle(mapTriangle(active.initial, (item) => ({ x: clamp(item.x + dx, -6, 6), y: clamp(item.y + dy, -6, 6) })));
  };
  const sourcePoints = polygonPoints(triangle, screen);
  const vectorStart = screen(vectorOrigin), vectorEnd = screen({ x: vectorOrigin.x + vector.x, y: vectorOrigin.y + vector.y });
  return <svg ref={ref} className={className} viewBox={className.includes("practice") ? "0 0 390 210" : "0 0 500 420"} role="img" aria-label={label} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
    <defs><marker id={`${className}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" /></marker></defs>
    <rect width="100%" height="100%" fill="#fff" />
    <Grid width={className.includes("practice") ? 390 : 500} height={className.includes("practice") ? 210 : 420} origin={origin} scale={scale} />
    {image && <>{(["a", "b", "c"] as const).map((key) => <line key={`guide-${key}`} x1={screen(triangle[key]).x} y1={screen(triangle[key]).y} x2={screen(image[key]).x} y2={screen(image[key]).y} stroke="#b8c4d8" strokeDasharray="5 4" />)}<polygon data-testid="translation-image-triangle" data-a-x={image.a.x.toFixed(4)} data-a-y={image.a.y.toFixed(4)} points={polygonPoints(image, screen)} fill="#8b5cf633" stroke="#7c3aed" strokeWidth="2" />{(["a", "b", "c"] as const).map((key) => <g key={`image-${key}`}><circle cx={screen(image[key]).x} cy={screen(image[key]).y} r="5" fill="#7c3aed" /><text x={screen(image[key]).x + 9} y={screen(image[key]).y - 7} fill="#7c3aed" fontSize="12" fontWeight="800">{key.toUpperCase()}'</text></g>)}</>}
    <polygon data-testid={className.includes("practice") ? "translation-practice-source" : "translation-source-triangle"} data-a-x={triangle.a.x.toFixed(4)} points={sourcePoints} fill="#0ea5e933" stroke="#168ddd" strokeWidth="2" onPointerDown={beginShape} />
    {(["a", "b", "c"] as const).map((key) => <g key={key}><circle data-testid={`translation-${className.includes("practice") ? "practice-" : ""}point-${key}`} cx={screen(triangle[key]).x} cy={screen(triangle[key]).y} r="7" fill={className.includes("practice") ? "#16a34a" : "#168ddd"} onPointerDown={beginShape} /><text pointerEvents="none" x={screen(triangle[key]).x - 18} y={screen(triangle[key]).y - 8} fill={className.includes("practice") ? "#166534" : "#087aca"} fontSize="12" fontWeight="800">{key.toUpperCase()}</text></g>)}
    <line x1={vectorStart.x} y1={vectorStart.y} x2={vectorEnd.x} y2={vectorEnd.y} stroke="#7c3aed" strokeWidth="3" markerEnd={`url(#${className}-arrow)`} />
    <circle data-testid={className.includes("practice") ? "translation-practice-vector-handle" : "translation-vector-handle"} data-x={vector.x.toFixed(4)} data-y={vector.y.toFixed(4)} cx={vectorEnd.x} cy={vectorEnd.y} r="8" fill="transparent" onPointerDown={beginVector} />
    {!className.includes("practice") && <text x={(vectorStart.x + vectorEnd.x) / 2 - 12} y={(vectorStart.y + vectorEnd.y) / 2 + 18} fill="#6d28d9" fontSize="14" fontStyle="italic" fontWeight="800">v</text>}
  </svg>;
}

function Grid({ width, height, origin, scale }: { width: number; height: number; origin: Point; scale: number }) {
  const vertical = Array.from({ length: Math.ceil(width / scale) + 2 }, (_, index) => origin.x % scale + index * scale - scale);
  const horizontal = Array.from({ length: Math.ceil(height / scale) + 2 }, (_, index) => origin.y % scale + index * scale - scale);
  return <g><g stroke="#e6edf6" strokeWidth="1">{vertical.map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2={height} />)}{horizontal.map((y) => <line key={`h${y}`} x1="0" x2={width} y1={y} y2={y} />)}</g><g stroke="#475569" strokeWidth="1.2"><line x1="0" x2={width} y1={origin.y} y2={origin.y} /><line x1={origin.x} x2={origin.x} y1="0" y2={height} /></g>{[-6, -4, -2, 0, 2, 4, 6].map((value) => <g key={value} fill="#334155" fontSize="9"><text x={origin.x + value * scale - 7} y={origin.y + 17}>{value}</text>{value !== 0 && <text x={origin.x - 18} y={origin.y - value * scale + 3}>{value}</text>}</g>)}</g>;
}

function VectorControl({ axis, value, onValue }: { axis: "x" | "y"; value: number; onValue: (value: number) => void }) {
  return <label className="target-translation-slider"><b>{axis}-component</b><div><input aria-label={`Vector ${axis} component`} type="range" min="-6" max="6" step="1" value={value} onChange={(event) => onValue(Number(event.target.value))} /><input aria-label={`Vector ${axis} component value`} type="number" min="-6" max="6" step="1" value={value} onChange={(event) => onValue(Number(event.target.value))} /></div><small><span>-6</span><span>0</span><span>6</span></small></label>;
}

function translateTriangle(triangle: Triangle, vector: Point): Triangle { return mapTriangle(triangle, (point) => ({ x: point.x + vector.x, y: point.y + vector.y })); }
function mapTriangle(triangle: Triangle, map: (point: Point) => Point): Triangle { return { a: map(triangle.a), b: map(triangle.b), c: map(triangle.c) }; }
function cloneTriangle(triangle: Triangle): Triangle { return mapTriangle(triangle, (point) => ({ ...point })); }
function polygonPoints(triangle: Triangle, screen: (point: Point) => Point) { return (["a", "b", "c"] as const).map((key) => { const point = screen(triangle[key]); return `${point.x},${point.y}`; }).join(" "); }
function flattenTriangle(triangle: Triangle) { return [triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y]; }
function format(value: number) { return Number(value.toFixed(2)).toString(); }
function formatPoint(point: Point) { return `( ${format(point.x)}, ${format(point.y)} )`; }
function directionText(vector: Point) { const horizontal = vector.x === 0 ? "" : `${Math.abs(vector.x)} units ${vector.x > 0 ? "right" : "left"}`; const vertical = vector.y === 0 ? "" : `${Math.abs(vector.y)} units ${vector.y > 0 ? "up" : "down"}`; return [horizontal, vertical].filter(Boolean).join(" and ") || "0 units"; }
function replaceAt(values: string[], index: number, value: string) { return values.map((current, currentIndex) => currentIndex === index ? value : current); }
function roundHalf(value: number) { return Math.round(value * 2) / 2; }
function clamp(value: number, minimum: number, maximum: number) { return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum)); }
async function toggleFullscreen(element: HTMLElement | null) { if (document.fullscreenElement) await document.exitFullscreen(); else await element?.requestFullscreen?.(); }
