import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VectorProjectionTargetLesson192.css";

type Point = { x: number; y: number };
type Tool = "select" | "v" | "u" | "angle";
const INITIAL_U = { x: 5, y: 2 },
  INITIAL_V = { x: -2, y: 4 },
  problems = [
    { u: { x: 2, y: 1 }, v: { x: -1, y: 4 } },
    { u: { x: 3, y: 0 }, v: { x: 2, y: -3 } },
    { u: { x: 1, y: -1 }, v: { x: 4, y: 2 } },
  ];
const clamp = (n: number) => Math.max(-6, Math.min(6, Math.round(n * 2) / 2)),
  dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y,
  magnitude = (p: Point) => Math.hypot(p.x, p.y),
  scale = (p: Point, k: number) => ({ x: p.x * k, y: p.y * k }),
  subtract = (a: Point, b: Point) => ({ x: a.x - b.x, y: a.y - b.y }),
  projection = (v: Point, u: Point) => scale(u, dot(u, v) / (dot(u, u) || 1)),
  angle = (a: Point, b: Point) =>
    (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (magnitude(a) * magnitude(b) || 1)))) * 180) /
    Math.PI,
  fmt = (n: number, digits = 2) => (Math.abs(n) < 1e-9 ? "0" : n.toFixed(digits));

function ProjectionGraph({
  u,
  v,
  grid,
  tool,
  onPoint,
}: {
  u: Point;
  v: Point;
  grid: boolean;
  tool: Tool;
  onPoint: (name: "u" | "v", value: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<"u" | "v" | null>(null),
    unit = 36,
    sx = (x: number) => 250 + x * unit,
    sy = (y: number) => 200 - y * unit,
    foot = projection(v, u),
    toPoint = (event: PointerEvent<SVGSVGElement>) => {
      const box = ref.current!.getBoundingClientRect();
      return {
        x: clamp((((event.clientX - box.left) / box.width) * 500 - 250) / unit),
        y: clamp((200 - ((event.clientY - box.top) / box.height) * 390) / unit),
      };
    },
    keyMove = (name: "u" | "v") => (event: KeyboardEvent<SVGCircleElement>) => {
      const moves: Record<string, Point> = {
          ArrowLeft: { x: -0.5, y: 0 },
          ArrowRight: { x: 0.5, y: 0 },
          ArrowUp: { x: 0, y: 0.5 },
          ArrowDown: { x: 0, y: -0.5 },
        },
        move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      const current = name === "u" ? u : v;
      onPoint(name, { x: clamp(current.x + move.x), y: clamp(current.y + move.y) });
    };
  return (
    <svg
      ref={ref}
      className="vp192-graph"
      viewBox="0 0 500 390"
      preserveAspectRatio="none"
      aria-label="Vector projection coordinate plane"
      onPointerMove={(event) => drag.current && onPoint(drag.current, toPoint(event))}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern id="vp192-grid" width={unit} height={unit} patternUnits="userSpaceOnUse">
          <path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#e4ebf1" />
        </pattern>
        {[["u", "#1767dd"], ["v", "#079b9b"], ["p", "#8d35e8"]].map(([name, color]) => (
          <marker key={name} id={`vp192-${name}`} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
            <path d="M0 0L9 4.5L0 9Z" fill={color} />
          </marker>
        ))}
      </defs>
      <rect width="500" height="390" fill={grid ? "url(#vp192-grid)" : "#fff"} />
      <line x1="0" x2="500" y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="390" className="axis" />
      {[-6, -4, -2, 2, 4, 6].map((n) => (
        <g key={n}><text x={sx(n) - 6} y={sy(0) + 18}>{n}</text><text x={sx(0) - 22} y={sy(n) + 4}>{n}</text></g>
      ))}
      <line x1={sx(v.x)} y1={sy(v.y)} x2={sx(foot.x)} y2={sy(foot.y)} className="perpendicular" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(foot.x)} y2={sy(foot.y)} className="projection" markerEnd="url(#vp192-p)" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(u.x)} y2={sy(u.y)} className="u" markerEnd="url(#vp192-u)" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(v.x)} y2={sy(v.y)} className="v" markerEnd="url(#vp192-v)" />
      {(["u", "v"] as const).map((name) => {
        const p = name === "u" ? u : v;
        return <circle key={name} data-testid={`projection-${name}-tip`} role="slider" aria-label={`Vector ${name} tip`} tabIndex={0} cx={sx(p.x)} cy={sy(p.y)} r="10" className={`${name}-tip`} onPointerDown={(event) => { if (tool === "select" || tool === name) { drag.current = name; event.currentTarget.setPointerCapture(event.pointerId); } }} onKeyDown={keyMove(name)} />;
      })}
      <text x={sx(u.x) - 24} y={sy(u.y) - 12} className="u-label">u</text>
      <text x={sx(v.x) + 12} y={sy(v.y) - 8} className="v-label">v</text>
      <text x={sx(foot.x) + 10} y={sy(foot.y) + 25} className="p-label">projᵤ v</text>
      <path d={`M${sx(0) + 38} ${sy(0)} A38 38 0 0 0 ${sx(0) + 35} ${sy(0) - 15}`} className="angle" />
      <text x={sx(0) + 44} y={sy(0) - 9} className="angle-label">θ</text>
    </svg>
  );
}

export default function VectorProjectionTargetLesson192({ resetToken, onInteraction }: LessonAdapterProps) {
  const [u, setU] = useState(INITIAL_U), [v, setV] = useState(INITIAL_V),
    [tool, setTool] = useState<Tool>("select"), [grid, setGrid] = useState(true),
    [stage, setStage] = useState(0), [tips, setTips] = useState(false),
    [bookmarked, setBookmarked] = useState(false), [shared, setShared] = useState(false),
    [problem, setProblem] = useState(0), [answer, setAnswer] = useState({ x: "", y: "" }),
    [feedback, setFeedback] = useState(""), [hint, setHint] = useState(false);
  const projected = projection(v, u), residual = subtract(v, projected), theta = angle(u, v),
    scalar = dot(u, v) / (magnitude(u) || 1), current = problems[problem], expected = projection(current.v, current.u),
    correct = answer.x !== "" && Math.abs(+answer.x - expected.x) < 0.01 && Math.abs(+answer.y - expected.y) < 0.01,
    interact = () => onInteraction();
  useEffect(() => {
    setU(INITIAL_U); setV(INITIAL_V); setTool("select"); setGrid(true); setStage(0); setTips(false);
    setShared(false); setProblem(0); setAnswer({ x: "", y: "" }); setFeedback(""); setHint(false);
  }, [resetToken]);
  const setAngle = (degrees: number) => {
    const length = magnitude(v), direction = Math.atan2(u.y, u.x) + (degrees * Math.PI) / 180;
    setV({ x: clamp(length * Math.cos(direction)), y: clamp(length * Math.sin(direction)) }); interact();
  };
  return (
    <main className="vp192-page" data-testid="vector-mockup-0249" data-dedicated-lesson="192"
      data-object-model="two-vector-scalar-vector-projection-perpendicular-residual-practice"
      data-u={`${u.x}:${u.y}`} data-v={`${v.x}:${v.y}`} data-projection={`${fmt(projected.x)}:${fmt(projected.y)}`}
      data-dot={fmt(dot(u, v))} data-angle={fmt(theta, 1)} data-tool={tool} data-grid={grid} data-stage={stage}
      data-problem={problem} data-answer={`${answer.x}:${answer.y}`} data-correct={correct} data-feedback={feedback}
      data-bookmarked={bookmarked} data-shared={shared} data-tips={tips}>
      <header className="vp192-header">
        <section><span>GEOMETRY</span><span>VECTORS</span><h1>Vector Projection <button aria-label="Bookmark lesson" className={bookmarked ? "active" : ""} onClick={() => { setBookmarked((x) => !x); interact(); }}><Bookmark /></button></h1><p>Resolve components · See how a vector casts a shadow onto another vector.</p><aside><b>♙ Level: Intermediate-Advanced</b><b>ϟ Topics: Component form, Dot product</b><b>◷ Est. time: 6-10 min</b></aside></section>
        <nav><button onClick={() => { setU(INITIAL_U); setV(INITIAL_V); setTool("select"); setGrid(true); interact(); }}><RotateCcw />Reset</button><button onClick={() => { setShared(true); navigator.clipboard?.writeText(location.href).catch(() => undefined); interact(); }}><Share2 />{shared ? "Shared" : "Share"}</button></nav>
      </header>
      <nav className="vp192-stages">{[["Observe","See it"],["Manipulate","Drag & explore"],["Pattern","What happens?"],["Rule","Understand"],["Practice","Try it"]].map(([name, sub], index) => <button key={name} className={stage === index ? "active" : ""} onClick={() => { setStage(index); document.getElementById(index === 4 ? "vp192-practice" : "vp192-model")?.scrollIntoView({ behavior: "smooth" }); interact(); }}><i>{index + 1}</i><b>{name}</b><small>{sub}</small></button>)}</nav>
      <section className="vp192-model" id="vp192-model">
        <article className="vp192-work"><header><div><h2>Interactive Model</h2><p>Drag vectors or the angle slider. The purple dashed line shows the projection of v onto u.</p></div><button onClick={() => { setTips((x) => !x); interact(); }}><Lightbulb />Tips</button></header>
          <section><aside>{[["select","Select"],["v","Move v"],["u","Move u"],["angle","Angle θ"]].map(([value, label]) => <button key={value} className={tool === value ? "active" : ""} onClick={() => { setTool(value as Tool); interact(); }}>{label}</button>)}<label><input type="checkbox" aria-label="Show grid" checked={grid} onChange={() => { setGrid((x) => !x); interact(); }} />Show grid</label>{tips && <p>Drag either colored tip. Arrow keys move a focused tip.</p>}</aside><ProjectionGraph u={u} v={v} grid={grid} tool={tool} onPoint={(name, value) => { if (name === "u") setU(value); else setV(value); interact(); }} /></section>
          <footer><label>Angle θ <input aria-label="Projection angle" type="range" min="0" max="180" step="0.5" value={theta} onChange={(event) => setAngle(+event.target.value)} /><output>{fmt(theta, 1)}°</output></label><div><span>v (teal) given vector</span><span>u (blue) target vector</span><span>projᵤ v (purple) projection</span></div></footer>
        </article>
        <aside className="vp192-rail"><article><h2>Vectors</h2><header><b>|v| = {fmt(magnitude(v))}</b><b>|u| = {fmt(magnitude(u))}</b></header>{(["v","u"] as const).map((name) => { const value = name === "u" ? u : v; const setter = name === "u" ? setU : setV; return <section key={name}><b>{name}</b>{(["x","y"] as const).map((axis) => <label key={axis}>{axis}<input aria-label={`${name} ${axis} projection value`} type="number" min="-6" max="6" step=".5" value={value[axis]} onChange={(event) => { setter({ ...value, [axis]: clamp(+event.target.value) }); interact(); }} /></label>)}</section>; })}</article>
          <article className="vp192-results"><h2>Components & Projection</h2><section><span>Projection scalar<br /><b>u · v / |u|</b></span><output>{fmt(scalar)}</output></section><section><span>Vector projection<br /><b>projᵤ v</b></span><output>({fmt(projected.x)}, {fmt(projected.y)})</output></section><section><span>Component of v along u<br /><b>u · v</b></span><output>{fmt(dot(u, v))}</output></section><section><span>Component perpendicular to u<br /><b>v - projᵤ v</b></span><output>({fmt(residual.x)}, {fmt(residual.y)})</output></section><footer><b>|projᵤ v|<output>{fmt(magnitude(projected))}</output></b><b>θ (angle)<output>{fmt(theta, 1)}°</output></b><b>u · v<output>{fmt(dot(u, v))}</output></b></footer></article>
        </aside>
      </section>
      <section className="vp192-concepts"><article className="vp192-how"><div><h2>How it works</h2>{["The perpendicular is drawn from v to u.","Its foot on u is the projection of v onto u.","The shadow length is |projᵤ v|.","Projection plus residual reconstructs v."].map((text,index) => <p key={text}><i>{index + 1}</i>{text}</p>)}</div><svg viewBox="0 0 120 120" aria-label="Projection reconstruction diagram"><line x1="12" y1="99" x2="108" y2="99" className="mini-u" /><line x1="31" y1="99" x2="45" y2="16" className="mini-v" /><line x1="31" y1="99" x2="76" y2="30" className="mini-r" /><line x1="76" y1="30" x2="68" y2="99" className="mini-p" /><text x="95" y="94">u</text><text x="25" y="20">v</text><text x="70" y="24">v</text><text x="55" y="113">projᵤ v</text></svg></article><article><h2>Key idea</h2><p>The projection of v onto u is the shadow (component) of v in the direction of u.</p><output>projᵤ v = ((u · v) / |u|²) u</output><p>v = projᵤ v + (v - projᵤ v)</p></article><article><h2>Quick example</h2><p>Given: u=(1,2), v=(3,1)</p><p>u · v = 5 &nbsp; |u|² = 5</p><p>projᵤ v = (1,2)</p><p>v - projᵤ v = (2,-1)</p></article></section>
      <section className="vp192-practice" id="vp192-practice"><header><h2>Your turn: <b>Practice</b></h2><nav><span>{problem + 1} of {problems.length}</span><button aria-label="Previous problem" onClick={() => { setProblem((problem + problems.length - 1) % problems.length); setAnswer({ x: "", y: "" }); setFeedback(""); interact(); }}><ArrowLeft /></button><button aria-label="Next problem" onClick={() => { setProblem((problem + 1) % problems.length); setAnswer({ x: "", y: "" }); setFeedback(""); interact(); }}><ArrowRight /></button></nav></header><p>Find the projection of v onto u. Enter the vector projection (a, b).</p><main><div><b>u = ({current.u.x}, {current.u.y})</b><b>v = ({current.v.x}, {current.v.y})</b></div><span>Answer: (</span>{(["x","y"] as const).map((axis) => <input key={axis} aria-label={`Projection practice ${axis}`} type="number" value={answer[axis]} onChange={(event) => { setAnswer({ ...answer, [axis]: event.target.value }); setFeedback(""); interact(); }} />)}<span>)</span><button onClick={() => { setFeedback(correct ? "Correct projection." : "Not yet. Use the dot-product scale first."); interact(); }}>Check</button><button onClick={() => { setHint((x) => !x); interact(); }}>Show hint</button><aside><b>Need a hint?</b><p>{hint ? `projᵤ v = (${fmt(expected.x)}, ${fmt(expected.y)})` : "Compute ((u · v) / |u|²) u"}</p></aside></main><strong>{feedback}</strong></section>
      <nav className="vp192-nav"><a href="/lessons/geometry/191-cross-product"><ArrowLeft /><span>Previous<b>Cross Product</b></span></a><a href="/lessons/geometry/193-linear-combinations"><span>Next<b>Linear Combinations</b></span><ArrowRight /></a></nav>
      <footer className="vp192-footer"><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><span>www.IndianServers.com &nbsp; info@IndianServers.com</span><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav></footer>
    </main>
  );
}
