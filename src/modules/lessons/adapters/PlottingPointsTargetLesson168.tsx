import { ArrowLeft, ArrowRight, Bookmark, MousePointer2, Move, RotateCcw, Share2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PlottingPointsTargetLesson168.css";

type Point = { x: number; y: number };
type Mode = "point" | "pan";
const initial: Point[] = [{ x: 3, y: 2 }, { x: -4, y: 1 }, { x: -2, y: -3 }, { x: 5, y: -2 }];
const names = ["A", "B", "C", "D"];
const colors = ["#176de5", "#6541c7", "#0a9baa", "#a52bc0"];
const clamp = (value: number) => Math.max(-6, Math.min(6, value));
const quadrant = ({ x, y }: Point) => x === 0 || y === 0 ? "Axis" : x > 0 && y > 0 ? "I" : x < 0 && y > 0 ? "II" : x < 0 && y < 0 ? "III" : "IV";
const signs = ({ x, y }: Point) => `(${x > 0 ? "+" : x < 0 ? "−" : "0"}, ${y > 0 ? "+" : y < 0 ? "−" : "0"})`;

function PlotGrid({ points, selected, mode, snap, pan, treasure, onPoint, onSelect, onPan }: { points: Array<Point | null>; selected: number; mode: Mode; snap: boolean; pan: Point; treasure: boolean; onPoint: (index: number, point: Point) => void; onSelect: (index: number) => void; onPan: (point: Point) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const panStart = useRef<{ clientX: number; clientY: number; pan: Point } | null>(null);
  const width = 460, height = 440, unit = 35, originX = 230 + pan.x, originY = 220 + pan.y;
  const fromClient = (clientX: number, clientY: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    const rawX = (((clientX - box.left) / box.width) * width - originX) / unit;
    const rawY = (originY - ((clientY - box.top) / box.height) * height) / unit;
    return { x: clamp(snap ? Math.round(rawX) : Math.round(rawX * 2) / 2), y: clamp(snap ? Math.round(rawY) : Math.round(rawY * 2) / 2) };
  };
  const movePoint = (event: PointerEvent<SVGCircleElement>, index: number) => onPoint(index, fromClient(event.clientX, event.clientY));
  const keyPoint = (event: KeyboardEvent<SVGCircleElement>, index: number, point: Point) => {
    const step = snap ? 1 : .5;
    const next = { ...point };
    if (event.key === "ArrowLeft") next.x = clamp(point.x - step);
    if (event.key === "ArrowRight") next.x = clamp(point.x + step);
    if (event.key === "ArrowUp") next.y = clamp(point.y + step);
    if (event.key === "ArrowDown") next.y = clamp(point.y - step);
    if (next.x !== point.x || next.y !== point.y) { event.preventDefault(); onPoint(index, next); }
  };
  return <svg ref={ref} className="pp168-grid" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Editable plotting plane" onPointerDown={(event) => {
    if (mode === "point") onPoint(selected, fromClient(event.clientX, event.clientY));
    else { event.currentTarget.setPointerCapture(event.pointerId); panStart.current = { clientX: event.clientX, clientY: event.clientY, pan }; }
  }} onPointerMove={(event) => {
    if (mode === "pan" && panStart.current && event.currentTarget.hasPointerCapture(event.pointerId)) onPan({ x: panStart.current.pan.x + event.clientX - panStart.current.clientX, y: panStart.current.pan.y + event.clientY - panStart.current.clientY });
  }} onPointerUp={() => { panStart.current = null; }}>
    <defs><pattern id="pp168-grid" width={unit} height={unit} patternUnits="userSpaceOnUse"><path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#dfe7ee" /></pattern><marker id="pp168-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6Z" fill="#111a2c" /></marker></defs>
    <rect width={width} height={height} fill="url(#pp168-grid)" />
    <line x1="4" x2={width - 4} y1={originY} y2={originY} className="axis" markerStart="url(#pp168-arrow)" markerEnd="url(#pp168-arrow)" /><line x1={originX} x2={originX} y1={height - 4} y2="4" className="axis" markerStart="url(#pp168-arrow)" markerEnd="url(#pp168-arrow)" />
    {[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map((value) => <g key={value}><text x={originX + value * unit + (value === 0 ? 10 : 0)} y={originY + 18}>{value}</text>{value !== 0 ? <text x={originX - 12} y={originY - value * unit + 4}>{value}</text> : null}</g>)}
    <text x={width - 10} y={originY - 9}>x</text><text x={originX + 9} y="14">y</text>
    <text x="8" y="20" className="q q2">Quadrant II</text><text x={width - 72} y="20" className="q q1">Quadrant I</text><text x="8" y={height - 12} className="q q3">Quadrant III</text><text x={width - 78} y={height - 12} className="q q4">Quadrant IV</text>
    {points.map((point, index) => point ? <g key={index}><circle data-testid={`plot-point-${index}`} role="slider" tabIndex={0} aria-label={`Drag point ${names[index]}`} cx={originX + point.x * unit} cy={originY - point.y * unit} r="7" fill={colors[index]} stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.stopPropagation(); onSelect(index); event.currentTarget.setPointerCapture(event.pointerId); movePoint(event, index); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) movePoint(event, index); }} onKeyDown={(event) => keyPoint(event, index, point)} /><text x={originX + point.x * unit + 9} y={originY - point.y * unit - 10} className="point-label" fill={colors[index]}>{names[index]} ({point.x}, {point.y})</text></g> : null)}
    {treasure ? <g className="treasure"><circle cx={originX - 2 * unit} cy={originY + unit} r="8" /><text x={originX - 2 * unit + 10} y={originY + unit - 10}>T (−2, −1)</text></g> : null}
  </svg>;
}

export default function PlottingPointsTargetLesson168({ resetToken, onInteraction }: LessonAdapterProps) {
  const [points, setPoints] = useState<Array<Point | null>>(initial);
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<Mode>("point");
  const [snap, setSnap] = useState(true);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [stage, setStage] = useState(1);
  const [treasure, setTreasure] = useState(false);
  const [message, setMessage] = useState("");
  const updatePoint = (index: number, point: Point) => { setPoints((current) => current.map((value, item) => item === index ? point : value)); setSelected(index); onInteraction(); };
  useEffect(() => { setPoints(initial); setSelected(0); setMode("point"); setSnap(true); setPan({ x: 0, y: 0 }); setTreasure(false); setStage(1); setMessage(""); }, [resetToken]);
  return <main className="pp168-page" data-testid="geometry-mockup-0225" data-dedicated-lesson="168" data-object-model="four-independent-editable-pointer-keyboard-draggable-points-live-quadrants-signs-plot-pan-snap-delete-clear-worked-example-and-xp-treasure-challenge" data-points={points.map((point) => point ? `${point.x}:${point.y}` : "").join(",")} data-mode={mode} data-snap={snap} data-pan={`${pan.x}:${pan.y}`} data-stage={stage + 1} data-treasure={treasure}>
    <header className="pp168-header"><span>COORDINATE GEOMETRY</span><h1>Plotting Points</h1><p>Develop coordinate fluency.</p><div><b>▣ Level: Intermediate</b><b>⌁ Lab: Construction</b><b>▣ View: Geometry / Graphing</b><b>◷ Time: 6–10 min</b></div><aside><select aria-label="Language"><option>English (English)</option><option>हिन्दी</option></select><button aria-label="Bookmark lesson" onClick={() => setMessage("Lesson bookmarked")}><Bookmark /></button><button onClick={() => setMessage("Lesson link copied")}><Share2 /> Share</button><button onClick={() => setMessage("Workspace opened")}>↗ Workspace</button><output>{message}</output></aside></header>
    <nav className="pp168-stages">{[["Observe","See the model"],["Manipulate","Plot & explore"],["Notice","Find patterns"],["Understand","Learn the rule"],["Try","Practice"]].map(([title, subtitle], index) => <button key={title} className={stage === index ? "active" : ""} onClick={() => { setStage(index); onInteraction(); }}><i>{index + 1}</i><span><b>{title}</b><small>{subtitle}</small></span></button>)}</nav>
    <section className="pp168-workspace"><article><h2>Click to plot points or drag to move them.</h2><PlotGrid points={points} selected={selected} mode={mode} snap={snap} pan={pan} treasure={treasure} onPoint={updatePoint} onSelect={setSelected} onPan={(value) => { setPan(value); onInteraction(); }} /><div className="pp168-tools"><button className={mode === "point" ? "active" : ""} aria-label="Point tool" onClick={() => setMode("point")}><MousePointer2 /></button><button className={mode === "pan" ? "active" : ""} aria-label="Pan tool" onClick={() => setMode("pan")}><Move /></button><button onClick={() => { setPoints([null,null,null,null]); onInteraction(); }}><RotateCcw /> Clear All</button><label>Snap to grid <input type="checkbox" checked={snap} onChange={(event) => { setSnap(event.target.checked); onInteraction(); }} /></label></div><div className="pp168-rows">{points.map((point, index) => <div key={index} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><i style={{ background: colors[index] }} /><b>{names[index]}</b><span>(</span><input aria-label={`${names[index]} x coordinate`} type="number" min="-6" max="6" step={snap ? 1 : .5} value={point?.x ?? ""} onChange={(event) => updatePoint(index, { x: clamp(Number(event.target.value)), y: point?.y ?? 0 })} /><span>,</span><input aria-label={`${names[index]} y coordinate`} type="number" min="-6" max="6" step={snap ? 1 : .5} value={point?.y ?? ""} onChange={(event) => updatePoint(index, { x: point?.x ?? 0, y: clamp(Number(event.target.value)) })} /><span>)</span><em>{point ? `Quadrant ${quadrant(point)}` : "Not plotted"}</em><strong>{point ? signs(point) : ""}</strong><button aria-label={`Delete point ${names[index]}`} onClick={(event) => { event.stopPropagation(); setPoints((current) => current.map((value, item) => item === index ? null : value)); onInteraction(); }}><Trash2 /></button></div>)}</div><footer><b>◉</b><span>Click anywhere on the grid to add a point.<br />Drag a point to update its coordinates in real time.</span></footer></article>
      <aside><section><h2>Observation</h2>{points.map((point, index) => point ? <div key={index}><i style={{ background: colors[index] }} /><b>{names[index]} ({point.x}, {point.y})</b><p><em>x {point.x > 0 ? ">" : point.x < 0 ? "<" : "="} 0, y {point.y > 0 ? ">" : point.y < 0 ? "<" : "="} 0</em><span>→</span>Quadrant {quadrant(point)}</p></div> : null)}</section><section><h2>Coordinate rules</h2><p>A point on the plane is written as an <b>ordered pair (x, y)</b>.</p><ul><li>Right/Left of origin: sign of <i>x</i></li><li>Up/Down from origin: sign of <i>y</i></li></ul><div className="pp168-quads"><b>II<br /><span>(−, +)</span></b><b>I<br /><span>(+, +)</span></b><b>III<br /><span>(−, −)</span></b><b>IV<br /><span>(+, −)</span></b></div></section><section><h2>Worked example</h2><b>Plot P(−3, 4)</b><ol><li>From origin 0, go 3 units left (x = −3).</li><li>From there, go 4 units up (y = 4).</li><li>Mark the point P.</li></ol><svg viewBox="0 0 250 180"><path d="M15 95H238M128 10V170" /><path className="guide" d="M57 95V32H128" /><circle cx="57" cy="32" r="5" /><text x="32" y="23">P (−3, 4)</text><text x="49" y="110">−3</text><text x="135" y="37">4</text></svg></section></aside>
      <section className="pp168-insight"><h2>Insight</h2><p>The ordered pair <i>(x, y)</i> tells us exactly where a point is located.</p><div><b>Write → <i>(x, y)</i></b><b>Read → <i>x</i> first (horizontal), <i>y</i> second (vertical).</b></div></section></section>
    <section className="pp168-challenge"><div className="chest">▣</div><div><h2>Treasure Challenge</h2><p>Plot the treasure at <i>T(2, −1)</i> and collect 20 XP!</p></div><span><b>{treasure ? "20" : "0"} / 20 XP</b><i className={treasure ? "done" : ""} /></span><button onClick={() => { setTreasure(true); onInteraction(); }}>Plot T(2, −1) <b>◉ 20 XP</b></button></section>
    <nav className="pp168-nav"><a href="/lessons/geometry/167-cartesian-plane"><ArrowLeft /><span><small>Previous</small><b>Cartesian Plane</b></span></a><div><small>Lesson Progress</small><span>{[0,1,2,3,4,5,6,7].map((item) => <i key={item} className={item === stage ? "active" : ""} />)}</span></div><a href="/lessons/geometry/169-distance-between-points"><span><small>Next</small><b>Distance Between Points</b></span><ArrowRight /></a></nav>
  </main>;
}
