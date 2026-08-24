import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Expand,
  Globe2,
  Lightbulb,
  Maximize2,
  MousePointer2,
  Move,
  Plus,
  RotateCcw,
  Share2,
  Trash2,
  Wrench,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Coefficients = [number, number, number, number, number, number];
type Tool = "point" | "move";

const initialPoints: Point[] = [
  { x: 3, y: 2 },
  { x: 4, y: -1 },
  { x: -1.5, y: -2.5 },
  { x: -4, y: 1 },
  { x: 0, y: 4 },
];
const practicePoints: Point[] = [
  { x: -2, y: -1 },
  { x: -1, y: 0.5 },
  { x: 0, y: 1 },
  { x: 1, y: 0.5 },
  { x: 2, y: -1 },
];
const colors = ["#1597d5", "#22b8cf", "#54b957", "#f59b3d", "#7541e8"];

export default function ConicFivePointsTargetLesson226({ resetToken, onInteraction }: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(clone(initialPoints));
  const [tool, setTool] = useState<Tool>("move");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const [stage, setStage] = useState(0);
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const coefficients = useMemo(() => solveConic(points), [points]);
  const classification = classify(coefficients);
  const residual = coefficients ? Math.max(...points.map((point) => Math.abs(evaluate(coefficients, point)))) : Number.NaN;
  const centroid = points.length ? { x: mean(points.map((point) => point.x)), y: mean(points.map((point) => point.y)) } : null;
  const bounds = points.length ? { minX: Math.min(...points.map((point) => point.x)), maxX: Math.max(...points.map((point) => point.x)), minY: Math.min(...points.map((point) => point.y)), maxY: Math.max(...points.map((point) => point.y)) } : null;
  const ellipse = coefficients ? ellipseProperties(coefficients) : null;
  const condition = useMemo(() => constraintCondition(points), [points]);

  const reset = () => {
    setPoints(clone(initialPoints)); setTool("move"); setDragIndex(null); setZoom(1); setShowGuides(true); onInteraction();
  };

  useEffect(() => {
    setPoints(clone(initialPoints)); setTool("move"); setDragIndex(null); setZoom(1); setShowGuides(true);
  }, [resetToken]);

  const updatePoint = (index: number, point: Point) => {
    setPoints((current) => current.map((value, pointIndex) => pointIndex === index ? { x: clamp(point.x, -7, 7), y: clamp(point.y, -7, 7) } : value));
    onInteraction();
  };

  const clear = () => { setPoints([]); setTool("point"); onInteraction(); };
  const loadPractice = () => { setPoints(clone(practicePoints)); setTool("move"); setZoom(1); onInteraction(); };
  const share = async () => {
    const text = coefficients ? `${equationText(coefficients)}; ${classification}` : "Five independent points are required.";
    try { await navigator.clipboard?.writeText(text); } catch { /* Keep confirmation visible without clipboard permission. */ }
    setShared(true); window.setTimeout(() => setShared(false), 1500); onInteraction();
  };

  return <section className="target-conic-page text-slate-900" data-testid="dynamic-geometry-mockup-0283" data-dedicated-lesson="226" data-object-model="five-point-homogeneous-conic" aria-label="Conic Through Five Points dedicated interactive geometry model">
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="target-conic-header">
      <div><div><span>Geometry</span><span>Dynamic Geometry Constructions</span></div><h1>Conic through Five Points</h1><p>Construct a general conic.</p></div>
      <div className="target-conic-actions"><span>Foundation: Advanced</span><span><Wrench /> Construction Studio</span><span><CircleDot /> Geometry Tools</span><span>6–10 min</span><label><Globe2 /><select aria-label="Conic lesson language" value={language} onChange={(event) => { setLanguage(event.target.value); onInteraction(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select></label><button type="button" onClick={reset}><RotateCcw /> Reset</button><button type="button" onClick={() => void share()}><Share2 /> {shared ? "Copied" : "Share"}</button><a href="/workspace/geometry"><Maximize2 /> Workspace</a></div>
    </header>

    <section className="target-conic-shell">
      <nav className="target-conic-stages" aria-label="Lesson stages">{[["Observe & Manipulate"], ["Notice the Pattern"], ["Understand the Rule"], ["Try Independently"]].map(([text], index) => <button key={text} type="button" className={stage === index ? "is-active" : ""} onClick={() => { setStage(index); onInteraction(); }}><b>{index + 1}</b>{text}</button>)}</nav>
      <div className="target-conic-main">
        <article className="target-conic-plot">
          <h2>Drag five points to construct a conic</h2>
          <ConicPlot points={points} coefficients={coefficients} zoom={zoom} showGuides={showGuides} tool={tool} dragIndex={dragIndex} onDrag={setDragIndex} onPoint={updatePoint} onAdd={(point) => { if (points.length < 5) { setPoints((current) => [...current, point]); onInteraction(); } }} />
          <div className="target-conic-toolbar"><button type="button" className={tool === "point" ? "is-active" : ""} onClick={() => setTool("point")}><Plus /> Point tool</button><button type="button" className={tool === "move" ? "is-active" : ""} onClick={() => setTool("move")}><Move /> Move</button><span /><button type="button" aria-label="Zoom in conic" onClick={() => { setZoom((value) => clamp(value + 0.2, 0.7, 1.8)); onInteraction(); }}><ZoomIn /></button><button type="button" aria-label="Zoom out conic" onClick={() => { setZoom((value) => clamp(value - 0.2, 0.7, 1.8)); onInteraction(); }}><ZoomOut /></button><button type="button" aria-label="Fit conic view" onClick={() => { setZoom(1); onInteraction(); }}><CircleDot /></button><button type="button" aria-label="Fullscreen conic" onClick={() => void document.documentElement.requestFullscreen?.()}><Expand /></button></div>
          <div className={`target-conic-valid ${coefficients ? "is-valid" : "is-invalid"}`}><span>{coefficients ? <Check /> : <Lightbulb />}{coefficients ? "All five points lie on the conic." : points.length < 5 ? `Place ${5 - points.length} more point${points.length === 4 ? "" : "s"}.` : "The point constraints are rank deficient."}</span><button type="button" onClick={clear}><Trash2 /> Clear all</button></div>
        </article>

        <aside className="target-conic-properties">
          <h2>Point coordinates</h2>
          <div className="target-conic-point-list">{Array.from({ length: 5 }, (_, index) => <PointEditor key={index} index={index} point={points[index]} onChange={(point) => updatePoint(index, point)} />)}</div>
          <section className="target-conic-class"><h2>Live classification</h2><div><span className={`is-${classification.toLowerCase()}`}>{classification}</span><MiniConic kind={classification} /></div><p>{coefficients ? `We have ${articleFor(classification)} ${classification.toLowerCase()}.` : "A unique conic is not available."}</p></section>
          <section className="target-conic-equation"><h2>Conic equation <em>Ax² + Bxy + Cy² + Dx + Ey + F = 0</em></h2>{coefficients ? <><div>{["A", "B", "C", "D", "E", "F"].map((label, index) => <span key={label}>{label}<b>{coefficients[index].toFixed(4)}</b></span>)}</div><div><strong>Normalized</strong>{coefficients.map((value, index) => <b key={index}>{value.toFixed(4)}</b>)}</div></> : <p>Five independent rows are required to solve the coefficient null space.</p>}</section>
          <section className="target-conic-diagnostics"><span>Discriminant<small>B² − 4AC</small><b>{coefficients ? discriminant(coefficients).toFixed(4) : "—"}</b></span><span>Trace<small>A + C</small><b>{coefficients ? (coefficients[0] + coefficients[2]).toFixed(4) : "—"}</b></span><span>Condition<small>κ(M) {Number.isFinite(condition) ? condition.toFixed(1) : "∞"}</small><b>{coefficients ? condition < 1e4 ? "Well-conditioned" : "Ill-conditioned" : "Degenerate"}</b></span></section>
          <section className={`target-conic-warning ${coefficients ? "is-valid" : ""}`}><h3><Lightbulb /> Degeneracy check</h3><p>If the five constraint rows are dependent, they do not determine a unique conic.</p><p>{coefficients ? `Rank 5 · nonzero null vector · Unique ${classification.toLowerCase()} exists.` : "Rank below 5 · adjust or replace the points."}</p></section>
        </aside>
      </div>

      <section className="target-conic-lessons">
        <article><h2>Construction steps <small>(existence & uniqueness)</small></h2>{[
          <>Five points (xᵢ,yᵢ) impose five independent linear constraints on <em>Ax² + Bxy + Cy² + Dx + Ey + F = 0</em>.</>,
          <>Solve the homogeneous system <em>Mc = 0</em> for c = [A,B,C,D,E,F]ᵀ with det(M) ≠ 0.</>,
          <>The solution c (up to scale) defines a unique conic passing through the points.</>,
          <>Classification is determined by Δ = B² − 4AC.</>,
        ].map((text, index) => <p key={index}><b>{index + 1}</b><span>{text}</span></p>)}</article>
        <article className="target-conic-insight"><h2>Insight</h2><h3>Classification by Δ = B² − 4AC</h3><p>Δ &lt; 0 → Ellipse (or circle)</p><p>Δ = 0 → Parabola</p><p>Δ &gt; 0 → Hyperbola</p><ClassificationSketch /><small>Special cases occur only when additional coefficient conditions hold.</small></article>
        <article className="target-conic-practice"><h2>Practice task <button type="button" onClick={loadPractice}>Try it</button></h2><p>Construct a parabola through the five points below.</p>{practicePoints.map((point, index) => <p key={index}><em>P{index + 1}</em><span>({point.x.toFixed(1)},</span><span>{point.y.toFixed(1)})</span></p>)}<button type="button" onClick={loadPractice}>Load points</button><strong>Goal: Classification should be Parabola (Δ = 0).</strong></article>
      </section>

      <section className="target-conic-checks"><h2>Instant checks</h2><div><CheckCard icon={<Check />} label="Point on conic" value={Number.isFinite(residual) ? `Max residual ${residual.toExponential(1)}` : "Unavailable"} /><CheckCard icon={<CrosshairIcon />} label="Centroid" value={centroid ? `(${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})` : "—"} /><CheckCard icon={<BoundsIcon />} label="Bounding box" value={bounds ? `x [${bounds.minX.toFixed(1)}, ${bounds.maxX.toFixed(1)}] · y [${bounds.minY.toFixed(1)}, ${bounds.maxY.toFixed(1)}]` : "—"} /><CheckCard icon={<AspectIcon />} label="Aspect ratio" value={ellipse ? (Math.max(ellipse.rx, ellipse.ry) / Math.min(ellipse.rx, ellipse.ry)).toFixed(3) : "—"} /><CheckCard icon={<AngleIcon />} label="Orientation" value={ellipse ? `${ellipse.rotation.toFixed(1)}°` : classification} /></div></section>
    </section>

    <nav className="target-conic-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/225-circular-sector"><ArrowLeft /><span><b>Previous</b>Circular Sector</span></a><a href="/lessons">Back to lesson overview</a><a href="/lessons/geometry/227-ellipse"><span><b>Next</b>Ellipse</span><ArrowRight /></a></nav>
  </section>;
}

function ConicPlot({ points, coefficients, zoom, showGuides, tool, dragIndex, onDrag, onPoint, onAdd }: { points: Point[]; coefficients: Coefficients | null; zoom: number; showGuides: boolean; tool: Tool; dragIndex: number | null; onDrag: (value: number | null) => void; onPoint: (index: number, point: Point) => void; onAdd: (point: Point) => void }) {
  const rangeX = 7 / zoom, rangeY = 6.5 / zoom;
  const screen = (point: Point) => ({ x: 270 + (point.x / rangeX) * 245, y: 240 - (point.y / rangeY) * 220 });
  const domain = (svg: SVGSVGElement, clientX: number, clientY: number) => { const p = svg.createSVGPoint(); p.x = clientX; p.y = clientY; const local = p.matrixTransform(svg.getScreenCTM()?.inverse()); return { x: ((local.x - 270) / 245) * rangeX, y: ((240 - local.y) / 220) * rangeY }; };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => { if (dragIndex === null) return; onPoint(dragIndex, domain(event.currentTarget, event.clientX, event.clientY)); };
  const path = coefficients ? implicitPath(coefficients, rangeX, rangeY) : "";
  return <svg role="img" aria-label="Five draggable points and their solved general conic" viewBox="0 0 540 480" onPointerMove={move} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)} onClick={(event) => { if (tool === "point") onAdd(domain(event.currentTarget, event.clientX, event.clientY)); }}>
    <rect width="540" height="480" fill="#fff" />
    {showGuides && Array.from({ length: 15 }, (_, index) => { const x = 25 + index * 35; return <line key={`x${x}`} x1={x} x2={x} y1="10" y2="465" stroke="#dfe7f1" strokeDasharray="3 4" />; })}
    {showGuides && Array.from({ length: 13 }, (_, index) => { const y = 20 + index * 35; return <line key={`y${y}`} x1="12" x2="528" y1={y} y2={y} stroke="#dfe7f1" strokeDasharray="3 4" />; })}
    <line x1="10" x2="530" y1="240" y2="240" stroke="#8796a9" /><line x1="270" x2="270" y1="8" y2="470" stroke="#8796a9" />
    <path data-testid="five-point-conic-path" data-classification={classificationForData(coefficients)} d={path} fill="none" stroke="#7541e8" strokeWidth="2.5" />
    {points.map((point, index) => { const p = screen(point); return <g key={index} onClick={(event) => event.stopPropagation()}><circle data-testid={`conic-point-${index + 1}`} cx={p.x} cy={p.y} r="7" fill={colors[index]} stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.stopPropagation(); onDrag(index); }} /><text x={p.x + (point.x > 2 ? -8 : 10)} y={p.y - 12} textAnchor={point.x > 2 ? "end" : "start"} fill="#172554" fontSize="11" fontWeight="800">P{index + 1}<tspan x={p.x + (point.x > 2 ? -8 : 10)} dy="15" fontWeight="500">({format(point.x)}, {format(point.y)})</tspan></text></g>; })}
    {!coefficients && <text x="270" y="225" textAnchor="middle" fill="#be123c" fontSize="13" fontWeight="700">Place five independent points.</text>}
  </svg>;
}

function PointEditor({ index, point, onChange }: { index: number; point?: Point; onChange: (point: Point) => void }) { return <section><i style={{ background: colors[index] }} /><b>P<sub>{index + 1}</sub></b>{point ? <><label>x<input type="number" step="0.1" aria-label={`Conic point ${index + 1} x`} value={point.x} onChange={(event) => onChange({ ...point, x: Number(event.target.value) })} /></label><label>y<input type="number" step="0.1" aria-label={`Conic point ${index + 1} y`} value={point.y} onChange={(event) => onChange({ ...point, y: Number(event.target.value) })} /></label></> : <span>Missing</span>}</section>; }
function MiniConic({ kind }: { kind: string }) { return <svg viewBox="0 0 105 72" aria-label={`${kind} classification icon`}>{kind === "Hyperbola" ? <><path d="M45 8C20 20 20 52 45 64" fill="none" stroke="#334d87" /><path d="M60 8C85 20 85 52 60 64" fill="none" stroke="#334d87" /></> : kind === "Parabola" ? <path d="M18 15Q52 78 87 15" fill="none" stroke="#334d87" /> : <ellipse cx="52" cy="36" rx="39" ry="28" fill="none" stroke="#334d87" />}</svg>; }
function ClassificationSketch() { return <svg viewBox="0 0 135 100" aria-label="Ellipse parabola and hyperbola classification sketch"><line x1="8" y1="52" x2="128" y2="52" stroke="#334155" /><line x1="68" y1="8" x2="68" y2="94" stroke="#334155" /><ellipse cx="52" cy="52" rx="17" ry="33" fill="none" stroke="#a855f7" /><path d="M72 80Q83 52 72 24" fill="none" stroke="#f59e0b" /><path d="M93 25Q73 52 93 79M108 25Q128 52 108 79" fill="none" stroke="#22c55e" /></svg>; }
function CheckCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <section>{icon}<span><b>{label}</b><small>{value}</small></span></section>; }
function CrosshairIcon() { return <MousePointer2 />; } function BoundsIcon() { return <Maximize2 />; } function AspectIcon() { return <Wrench />; } function AngleIcon() { return <Move />; }

function solveConic(points: Point[]): Coefficients | null {
  if (points.length !== 5) return null;
  const matrix = points.map(({ x, y }) => [x * x, x * y, y * y, x, y, 1]);
  const vector = Array.from({ length: 6 }, (_, column) => (column % 2 ? -1 : 1) * determinant(matrix.map((row) => row.filter((_, index) => index !== column))));
  const scaleIndex = vector.findIndex((value) => Math.abs(value) > 1e-8);
  if (scaleIndex < 0 || vector.some((value) => !Number.isFinite(value))) return null;
  const scale = vector[scaleIndex];
  const normalized = vector.map((value) => Math.abs(value / scale) < 5e-10 ? 0 : value / scale) as Coefficients;
  return Math.max(...points.map((point) => Math.abs(evaluate(normalized, point)))) < 1e-5 ? normalized : null;
}
function determinant(source: number[][]) { const matrix = source.map((row) => [...row]); let result = 1; for (let column = 0; column < matrix.length; column += 1) { let pivot = column; for (let row = column + 1; row < matrix.length; row += 1) if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column])) pivot = row; if (Math.abs(matrix[pivot][column]) < 1e-10) return 0; if (pivot !== column) { [matrix[pivot], matrix[column]] = [matrix[column], matrix[pivot]]; result *= -1; } const value = matrix[column][column]; result *= value; for (let row = column + 1; row < matrix.length; row += 1) { const factor = matrix[row][column] / value; for (let index = column + 1; index < matrix.length; index += 1) matrix[row][index] -= factor * matrix[column][index]; } } return result; }
function evaluate([a, b, c, d, e, f]: Coefficients, point: Point) { return a * point.x ** 2 + b * point.x * point.y + c * point.y ** 2 + d * point.x + e * point.y + f; }
function discriminant(coefficients: Coefficients) { return coefficients[1] ** 2 - 4 * coefficients[0] * coefficients[2]; }
function classify(coefficients: Coefficients | null) { if (!coefficients) return "Degenerate"; const delta = discriminant(coefficients); const tolerance = 1e-5 * Math.max(1, ...coefficients.map(Math.abs)); if (Math.abs(delta) <= tolerance) return "Parabola"; if (delta > 0) return "Hyperbola"; return Math.abs(coefficients[0] - coefficients[2]) <= tolerance && Math.abs(coefficients[1]) <= tolerance ? "Circle" : "Ellipse"; }
function classificationForData(coefficients: Coefficients | null) { return classify(coefficients).toLowerCase(); }
function ellipseProperties([a, b, c, d, e, f]: Coefficients) { const det = 4 * a * c - b * b; if (det <= 1e-8) return null; const cx = (b * e - 2 * c * d) / det, cy = (b * d - 2 * a * e) / det; const rotation = 0.5 * Math.atan2(b, a - c); const root = Math.hypot(a - c, b); const l1 = (a + c + root) / 2, l2 = (a + c - root) / 2; const centerValue = a * cx ** 2 + b * cx * cy + c * cy ** 2 + d * cx + e * cy + f; if (-centerValue / l1 <= 0 || -centerValue / l2 <= 0) return null; return { center: { x: cx, y: cy }, rx: Math.sqrt(-centerValue / l1), ry: Math.sqrt(-centerValue / l2), rotation: rotation * 180 / Math.PI }; }
function implicitPath(coefficients: Coefficients, rangeX: number, rangeY: number) { const ellipse = ellipseProperties(coefficients); if (ellipse) { const phi = ellipse.rotation * Math.PI / 180; const points = Array.from({ length: 181 }, (_, index) => { const t = index * Math.PI * 2 / 180; const x = ellipse.center.x + ellipse.rx * Math.cos(t) * Math.cos(phi) - ellipse.ry * Math.sin(t) * Math.sin(phi); const y = ellipse.center.y + ellipse.rx * Math.cos(t) * Math.sin(phi) + ellipse.ry * Math.sin(t) * Math.cos(phi); return `${270 + x / rangeX * 245} ${240 - y / rangeY * 220}`; }); return `M ${points.join(" L ")} Z`; } return marchingPath(coefficients, rangeX, rangeY); }
function marchingPath(coefficients: Coefficients, rangeX: number, rangeY: number) { const cols = 90, rows = 80, pieces: string[] = []; const at = (ix: number, iy: number) => ({ x: -rangeX + ix * 2 * rangeX / cols, y: -rangeY + iy * 2 * rangeY / rows }); const project = (point: Point) => ({ x: 270 + point.x / rangeX * 245, y: 240 - point.y / rangeY * 220 }); for (let ix = 0; ix < cols; ix += 1) for (let iy = 0; iy < rows; iy += 1) { const corners = [at(ix, iy), at(ix + 1, iy), at(ix + 1, iy + 1), at(ix, iy + 1)]; const values = corners.map((point) => evaluate(coefficients, point)); const hits: Point[] = []; [[0,1],[1,2],[2,3],[3,0]].forEach(([start,end]) => { if ((values[start] <= 0) !== (values[end] <= 0)) { const t = values[start] / (values[start] - values[end]); hits.push({ x: corners[start].x + t * (corners[end].x - corners[start].x), y: corners[start].y + t * (corners[end].y - corners[start].y) }); } }); if (hits.length >= 2) { for (let index = 0; index + 1 < hits.length; index += 2) { const p = project(hits[index]), q = project(hits[index + 1]); pieces.push(`M ${p.x} ${p.y} L ${q.x} ${q.y}`); } } } return pieces.join(" "); }
function equationText(values: Coefficients) { return values.map((value, index) => `${value.toFixed(3)}${["x²", "xy", "y²", "x", "y", ""][index]}`).join(" + ") + " = 0"; }
function constraintCondition(points: Point[]) { if (points.length !== 5) return Infinity; const rows = points.map(({ x, y }) => [x * x, x * y, y * y, x, y, 1]); const gram = rows.map((row, i) => rows.map((other, j) => i === j ? row.reduce((sum, value, k) => sum + value * other[k], 0) : row.reduce((sum, value, k) => sum + value * other[k], 0))); const eigenvalues = jacobiEigenvalues(gram).filter((value) => value > 1e-10); return eigenvalues.length === 5 ? Math.sqrt(Math.max(...eigenvalues) / Math.min(...eigenvalues)) : Infinity; }
function jacobiEigenvalues(source: number[][]) { const matrix = source.map((row) => [...row]); const size = matrix.length; for (let iteration = 0; iteration < 80; iteration += 1) { let p = 0, q = 1, largest = 0; for (let row = 0; row < size; row += 1) for (let column = row + 1; column < size; column += 1) if (Math.abs(matrix[row][column]) > largest) { largest = Math.abs(matrix[row][column]); p = row; q = column; } if (largest < 1e-10) break; const angle = 0.5 * Math.atan2(2 * matrix[p][q], matrix[q][q] - matrix[p][p]); const cosine = Math.cos(angle), sine = Math.sin(angle); for (let index = 0; index < size; index += 1) if (index !== p && index !== q) { const aip = matrix[index][p], aiq = matrix[index][q]; matrix[index][p] = matrix[p][index] = cosine * aip - sine * aiq; matrix[index][q] = matrix[q][index] = sine * aip + cosine * aiq; } const app = matrix[p][p], aqq = matrix[q][q], apq = matrix[p][q]; matrix[p][p] = cosine * cosine * app - 2 * sine * cosine * apq + sine * sine * aqq; matrix[q][q] = sine * sine * app + 2 * sine * cosine * apq + cosine * cosine * aqq; matrix[p][q] = matrix[q][p] = 0; } return matrix.map((row, index) => row[index]); }
function articleFor(kind: string) { return /^[aeiou]/i.test(kind) ? "an" : "a"; }
function clone(points: Point[]) { return points.map((point) => ({ ...point })); }
function mean(values: number[]) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min)); }
function format(value: number) { return Math.abs(value) < 0.005 ? "0.0" : value.toFixed(1); }
