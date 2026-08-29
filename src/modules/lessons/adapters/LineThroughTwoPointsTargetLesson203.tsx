import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  Focus,
  Grid3X3,
  Lightbulb,
  Maximize2,
  MousePointer2,
  Move,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./LineThroughTwoPointsTargetLesson203.css";

type Point = { x: number; y: number };
type PointName = "A" | "B";
type DisplayKey = "grid" | "axes" | "coordinates" | "ticks";
const INITIAL = { A: { x: -3, y: -1 }, B: { x: 4, y: 3 } };
const TASK_INITIAL = { C: { x: -1, y: 3 }, D: { x: 3, y: -1 } };
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const round = (n: number) => Math.round(n * 100) / 100;
const gcd = (a: number, b: number): number =>
  b ? gcd(b, a % b) : Math.abs(a || 1);
const fraction = (numerator: number, denominator: number) => {
  if (!denominator) return null;
  const scale = 100;
  let n = Math.round(numerator * scale),
    d = Math.round(denominator * scale);
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  if (d < 0) {
    n *= -1;
    d *= -1;
  }
  return { n, d };
};
const signed = (n: number, digits = 3) =>
  `${n < 0 ? "-" : "+"} ${Math.abs(n).toFixed(digits).replace(/\.?0+$/, "")}`;

function CoordinateInput({
  name,
  axis,
  value,
  onChange,
}: {
  name: PointName;
  axis: "x" | "y";
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span>{axis}<sub>{name === "A" ? "1" : "2"}</sub></span>
      <input
        aria-label={`${name} ${axis} coordinate`}
        type="number"
        min="-6"
        max="6"
        step="0.25"
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value), -6, 6))}
      />
    </label>
  );
}

function LineCanvas({
  points,
  display,
  zoom,
  pan,
  selected,
  onSelected,
  onPoint,
  onPan,
}: {
  points: Record<PointName, Point>;
  display: Record<DisplayKey, boolean>;
  zoom: number;
  pan: Point;
  selected: PointName;
  onSelected: (name: PointName) => void;
  onPoint: (name: PointName, point: Point) => void;
  onPan: (point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<PointName | "pan" | null>(null);
  const last = useRef({ x: 0, y: 0 });
  const ox = 315 + pan.x,
    oy = 240 + pan.y,
    scale = 38 * zoom;
  const screen = (p: Point) => ({ x: ox + p.x * scale, y: oy - p.y * scale });
  const fromEvent = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current!.getBoundingClientRect();
    return {
      x: round((((event.clientX - box.left) / box.width) * 630 - ox) / scale),
      y: round((oy - ((event.clientY - box.top) / box.height) * 480) / scale),
    };
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    if (drag.current === "pan") {
      onPan({
        x: pan.x + event.clientX - last.current.x,
        y: pan.y + event.clientY - last.current.y,
      });
      last.current = { x: event.clientX, y: event.clientY };
      return;
    }
    const point = fromEvent(event);
    onPoint(drag.current, {
      x: clamp(point.x, -8, 8),
      y: clamp(point.y, -6, 6),
    });
  };
  const startPoint = (event: PointerEvent<SVGGElement>, name: PointName) => {
    event.stopPropagation();
    drag.current = name;
    onSelected(name);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const a = screen(points.A),
    b = screen(points.B),
    dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.hypot(dx, dy) || 1,
    ux = dx / length,
    uy = dy / length,
    line = { x1: a.x - ux * 900, y1: a.y - uy * 900, x2: b.x + ux * 900, y2: b.y + uy * 900 };
  return (
    <svg
      ref={svg}
      className="lt203-canvas"
      viewBox="0 0 630 480"
      role="img"
      aria-label="Infinite line through draggable points A and B on a coordinate plane"
      onPointerDown={(event) => {
        drag.current = "pan";
        last.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <defs>
        <pattern id="lt203-grid" width={scale} height={scale} patternUnits="userSpaceOnUse" x={ox} y={oy}>
          <path d={`M${scale} 0H0V${scale}`} fill="none" stroke="#dce4ec" />
        </pattern>
        <marker id="lt203-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8Z" fill="#0878d9" />
        </marker>
      </defs>
      <rect width="630" height="480" fill="#fff" />
      {display.grid && <rect width="630" height="480" fill="url(#lt203-grid)" />}
      {display.axes && <>
        <line x1="10" y1={oy} x2="620" y2={oy} className="axis" />
        <line x1={ox} y1="470" x2={ox} y2="10" className="axis" />
        <text x="613" y={oy - 10} className="axis-name">x</text>
        <text x={ox + 10} y="17" className="axis-name">y</text>
      </>}
      {display.ticks && [-6, -4, -2, 0, 2, 4, 6].map((tick) => <g key={tick}>
        <line x1={ox + tick * scale} y1={oy - 4} x2={ox + tick * scale} y2={oy + 4} className="tick" />
        <text x={ox + tick * scale} y={oy + 19} textAnchor="middle">{tick}</text>
        {tick !== 0 && <><line x1={ox - 4} y1={oy - tick * scale} x2={ox + 4} y2={oy - tick * scale} className="tick" /><text x={ox - 11} y={oy - tick * scale + 4} textAnchor="end">{tick}</text></>}
      </g>)}
      <line {...line} className="constructed-line" markerStart="url(#lt203-arrow)" markerEnd="url(#lt203-arrow)" />
      {(["A", "B"] as PointName[]).map((name) => {
        const p = name === "A" ? a : b;
        return <g key={name} data-testid={`line-point-${name.toLowerCase()}`} className={`line-point ${name.toLowerCase()} ${selected === name ? "selected" : ""}`} onPointerDown={(event) => startPoint(event, name)}>
          <circle cx={p.x} cy={p.y} r="8" />
          <text x={p.x + (name === "A" ? -44 : 13)} y={p.y + (name === "A" ? 26 : -14)}>{name}{display.coordinates ? `(${points[name].x}, ${points[name].y})` : ""}</text>
        </g>;
      })}
    </svg>
  );
}

export default function LineThroughTwoPointsTargetLesson203({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL);
  const [display, setDisplay] = useState<Record<DisplayKey, boolean>>({ grid: true, axes: true, coordinates: true, ticks: true });
  const [selected, setSelected] = useState<PointName>("A");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState("Explore");
  const [stepsVisible, setStepsVisible] = useState([true, true, true, true]);
  const [task, setTask] = useState(TASK_INITIAL);
  const [taskResult, setTaskResult] = useState<"idle" | "correct" | "incorrect">("idle");
  useEffect(() => {
    setPoints(INITIAL); setDisplay({ grid: true, axes: true, coordinates: true, ticks: true });
    setSelected("A"); setZoom(1); setPan({ x: 0, y: 0 }); setTab("Explore");
    setStepsVisible([true, true, true, true]); setTask(TASK_INITIAL); setTaskResult("idle");
  }, [resetToken]);
  const model = useMemo(() => {
    const dx = points.B.x - points.A.x, dy = points.B.y - points.A.y;
    const coincident = Math.hypot(dx, dy) < 0.001;
    const vertical = !coincident && Math.abs(dx) < 0.001;
    const slope = vertical || coincident ? null : dy / dx;
    const intercept = slope === null ? null : points.A.y - slope * points.A.x;
    return { dx, dy, coincident, vertical, slope, intercept, ratio: fraction(dy, dx) };
  }, [points]);
  const changePoint = (name: PointName, point: Point) => {
    setPoints((current) => ({ ...current, [name]: point }));
    onInteraction();
  };
  const taskDx = task.D.x - task.C.x;
  const taskSlope = Math.abs(taskDx) < 0.001 ? null : (task.D.y - task.C.y) / taskDx;
  const taskIntercept = taskSlope === null ? null : task.C.y - taskSlope * task.C.x;
  const equation = model.coincident ? "Choose two distinct points" : model.vertical ? `x = ${points.A.x}` : `y = ${model.slope!.toFixed(6)}x ${signed(model.intercept!, 6)}`;
  const tabs = ["Explore", "Equation & Slope", "Collinearity", "Examples", "Summary"];
  const stepLabels = [`Plotted point A(${points.A.x}, ${points.A.y})`, `Plotted point B(${points.B.x}, ${points.B.y})`, "Drew line through A and B", "Extended the line infinitely"];
  return (
    <section className="lt203-page" data-testid="dynamic-geometry-mockup-0260" data-model="two-distinct-points-unique-infinite-line" data-a={`${points.A.x}:${points.A.y}`} data-b={`${points.B.x}:${points.B.y}`} data-slope={model.slope ?? "undefined"} data-equation={equation} data-zoom={zoom} data-pan={`${round(pan.x)}:${round(pan.y)}`} data-tab={tab} data-steps={stepsVisible.filter(Boolean).length}>
      <header className="lt203-header">
        <div><small>COORDINATE GEOMETRY</small><h1>{lesson.title}</h1><p>Construct and explore the line passing through any two points.</p><aside><b>Grade 9-12</b><b>Beginner</b><b>5-10 min</b></aside></div>
        <ol>{["Observe", "Manipulate", "Notice", "Understand", "Try"].map((name, i) => <li className={i === 1 ? "active" : ""} key={name}><i>{i + 1}</i><span>{i + 1} {name}</span></li>)}</ol>
      </header>
      <nav className="lt203-tabs" aria-label="Lesson sections">{tabs.map((name) => <button type="button" key={name} className={tab === name ? "active" : ""} onClick={() => { setTab(name); onInteraction(); }}>{name}</button>)}</nav>
      <div className="lt203-main">
        <aside className="lt203-controls">
          <h2>Points</h2>
          {(["A", "B"] as PointName[]).map((name) => <section key={name} className={selected === name ? "selected" : ""} onClick={() => setSelected(name)}><h3><i className={name.toLowerCase()} />{name} (x<sub>{name === "A" ? "1" : "2"}</sub>, y<sub>{name === "A" ? "1" : "2"}</sub>)</h3><CoordinateInput name={name} axis="x" value={points[name].x} onChange={(value) => changePoint(name, { ...points[name], x: value })} /><CoordinateInput name={name} axis="y" value={points[name].y} onChange={(value) => changePoint(name, { ...points[name], y: value })} /></section>)}
          <button className="reset" type="button" onClick={() => { setPoints(INITIAL); onInteraction(); }}><RotateCcw /> Reset points</button>
          <h2 className="display-title">Display</h2>
          {(Object.keys(display) as DisplayKey[]).map((key) => <label className="check" key={key}><input type="checkbox" checked={display[key]} onChange={(e) => { setDisplay((d) => ({ ...d, [key]: e.target.checked })); onInteraction(); }} /><span><Check /></span>{key === "ticks" ? "Tick marks" : key[0].toUpperCase() + key.slice(1)}</label>)}
          <div className="tip"><Lightbulb /><b>Tip</b><p>Drag points <em>A</em> or <em>B</em>, or edit coordinates. The line and equation update instantly.</p></div>
        </aside>
        <main className="lt203-work">
          <section className="graph"><div className="toolbox"><button aria-label="Select points" className="active"><MousePointer2 /></button><button aria-label="Pan graph"><Move /></button></div><LineCanvas points={points} display={display} zoom={zoom} pan={pan} selected={selected} onSelected={setSelected} onPoint={changePoint} onPan={setPan} /><div className="view-tools"><button type="button" onClick={() => setPan({ x: 0, y: 0 })}><Focus />Center</button><button type="button" onClick={() => setZoom((z) => clamp(round(z - .2), .6, 1.8))}><ZoomOut />Zoom -</button><button type="button" onClick={() => setZoom((z) => clamp(round(z + .2), .6, 1.8))}><ZoomIn />Zoom +</button><button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><Maximize2 />Fit</button></div></section>
          <section className="challenge"><header><h2>Try It Yourself</h2><button type="button" onClick={() => { setTask(TASK_INITIAL); setTaskResult("idle"); }}><RotateCcw /> New Task</button></header><p>Place points C and D so that the line through them has slope <b>m = -1</b> and y-intercept <b>2</b>.</p><div className="task-inputs">{(["C", "D"] as const).flatMap((name) => (["x", "y"] as const).map((axis) => <label key={`${name}${axis}`}>{name}{axis}<input aria-label={`${name} ${axis} task coordinate`} type="number" step="0.5" value={task[name][axis]} onChange={(e) => { setTask((t) => ({ ...t, [name]: { ...t[name], [axis]: Number(e.target.value) } })); setTaskResult("idle"); }} /></label>))}</div><div className="hint">Hint: The line should pass through (0, 2) and have slope -1.<button type="button" onClick={() => { setTaskResult(taskSlope !== null && Math.abs(taskSlope + 1) < .001 && taskIntercept !== null && Math.abs(taskIntercept - 2) < .001 ? "correct" : "incorrect"); onInteraction(); }}>Check</button></div>{taskResult !== "idle" && <strong role="status" className={taskResult}>{taskResult === "correct" ? "Correct. C and D determine y = -x + 2." : "Not yet. Check both the slope and y-intercept."}</strong>}</section>
        </main>
        <aside className="lt203-results">
          <section className="observation"><header><h2>Observation</h2><b className={model.coincident ? "warning" : "valid"}>{model.coincident ? "Distinct points required" : model.vertical ? "Vertical line" : "Collinear"}</b></header><div className="math"><p><span>Slope (m)</span><b>{model.coincident ? "indeterminate" : model.vertical ? "undefined" : <>{model.slope!.toFixed(6)} {model.ratio && <em>= {model.ratio.n}/{model.ratio.d}</em>}</>}</b></p><article><span>Equation ({model.vertical ? "vertical form" : "slope-intercept form"})</span><strong>{equation}</strong>{!model.vertical && !model.coincident && model.ratio && <strong>y = {model.ratio.n}/{model.ratio.d} x {signed(model.intercept!)}</strong>}</article></div><footer>Line passes through A({points.A.x}, {points.A.y}) and B({points.B.x}, {points.B.y}).</footer></section>
          <section className="construction"><header><h2>Construction Steps</h2><button type="button" onClick={() => setStepsVisible((s) => s.some(Boolean) ? [false, false, false, false] : [true, true, true, true])}><RotateCcw />{stepsVisible.some(Boolean) ? "Clear steps" : "Restore steps"}</button></header><ol>{stepLabels.map((label, i) => stepsVisible[i] && <li key={i}><i>{i + 1}</i><span>{label}</span><button type="button" aria-label={`Remove step ${i + 1}`} onClick={() => setStepsVisible((s) => s.map((v, index) => index === i ? false : v))}><Trash2 /></button></li>)}</ol>{!stepsVisible.some(Boolean) && <p className="empty">Construction log cleared.</p>}</section>
          <section className="insight"><h2><Lightbulb />Key Insight</h2><p>The line through two distinct points A(x<sub>1</sub>, y<sub>1</sub>) and B(x<sub>2</sub>, y<sub>2</sub>) has</p><strong aria-label="slope m = (y₂ − y₁) / (x₂ − x₁)">slope m = (y<sub>2</sub> - y<sub>1</sub>) / (x<sub>2</sub> - x<sub>1</sub>)</strong><p>Equation (point-slope form): y - y<sub>1</sub> = m(x - x<sub>1</sub>)</p></section>
        </aside>
      </div>
      <nav className="lt203-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/202-attach-detach-point"><ArrowLeft /><span><small>Previous</small>Attach / Detach Point</span></a><div><i /><i className="active" /><i /><i /><i /><span>Step 2 of 5</span></div><a href="/lessons/geometry/204-segment"><span><small>Next</small>Segment</span><ArrowRight /></a></nav>
      <footer className="lt203-footer"><span><Grid3X3 />Coordinate Geometry</span><b><Crosshair />Two points determine exactly one line</b><button type="button" onClick={() => { setPoints(INITIAL); setZoom(1); setPan({ x: 0, y: 0 }); setStepsVisible([true, true, true, true]); onInteraction(); }}><RotateCcw />Reset lesson</button></footer>
    </section>
  );
}
