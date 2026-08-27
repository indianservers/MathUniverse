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
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./AbsoluteValueEquationsTargetLesson121.css";

type DragPoint = "left" | "center" | "right" | null;

function signed(value: number) {
  if (value === 0) return "";
  return value > 0 ? ` - ${value}` : ` + ${Math.abs(value)}`;
}

function NumberLine({
  center,
  distance,
  onCenter,
  onDistance,
}: {
  center: number;
  distance: number;
  onCenter: (value: number) => void;
  onDistance: (value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<DragPoint>(null);
  const width = 450;
  const min = Math.min(-1, center - Math.max(distance, 0) - 1);
  const max = Math.max(7, center + Math.max(distance, 0) + 1);
  const dragBounds = useRef({ min, max });
  const px = (value: number) => 18 + ((value - min) / (max - min)) * 414;
  const left = center - distance;
  const right = center + distance;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * width;
    const bounds = dragBounds.current;
    const value = Math.round(
      bounds.min + ((local - 18) / 414) * (bounds.max - bounds.min),
    );
    if (dragging === "center") onCenter(value);
    else onDistance(Math.max(0, Math.abs(value - center)));
  };
  const handleKey = (point: DragPoint, key: string) => {
    const delta = key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : 0;
    if (!delta) return;
    if (point === "center") onCenter(center + delta);
    else onDistance(Math.max(0, distance + (point === "left" ? -delta : delta)));
  };
  if (distance < 0) {
    return (
      <div className="abs121-no-line" role="status">
        <CircleAlert /> Distance cannot be negative, so there are no real solution points.
      </div>
    );
  }
  return (
    <svg
      ref={ref}
      className="abs121-line"
      viewBox="0 0 450 250"
      role="img"
      aria-label={`Number line centered at ${center} with solutions ${left} and ${right}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs><marker id="abs121-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7z" /></marker></defs>
      <line className="axis" x1="12" x2="438" y1="126" y2="126" />
      <path className="axis-arrow" d="M12 126l9-7v14zM438 126l-9-7v14z" />
      {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((tick) => (
        <g key={tick}><line className="tick" x1={px(tick)} x2={px(tick)} y1="121" y2="134" /><text x={px(tick)} y="157">{tick}</text></g>
      ))}
      <path className="distance" d={`M${px(center)} 105 Q${(px(center) + px(left)) / 2} 58 ${px(left)} 105`} markerEnd="url(#abs121-arrow)" />
      <path className="distance" d={`M${px(center)} 105 Q${(px(center) + px(right)) / 2} 58 ${px(right)} 105`} markerEnd="url(#abs121-arrow)" />
      <text className="distance-label" x={(px(center) + px(left)) / 2} y="54">Distance = {distance}</text>
      <text className="distance-label" x={(px(center) + px(right)) / 2} y="54">Distance = {distance}</text>
      {(["left", "center", "right"] as const).map((point) => {
        const value = point === "left" ? left : point === "right" ? right : center;
        const labelWidth = point === "center" ? 78 : 56;
        return (
          <g key={point}>
            <circle
              className={point === "center" ? "center" : "solution"}
              cx={px(value)} cy="126" r="8"
              role="slider" tabIndex={0}
              aria-label={point === "center" ? "Drag absolute value center" : `Drag ${point} absolute value solution`}
              onPointerDown={(event) => { dragBounds.current = { min, max }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(point); }}
              onKeyDown={(event) => handleKey(point, event.key)}
            />
            <path className={`label-tip ${point}`} d={`M${px(value) - labelWidth / 2} 184h${labelWidth}v34h-${labelWidth}z M${px(value) - 6} 184l6-8 6 8z`} />
            <text className={`value-label ${point}`} x={px(value)} y="206">{point === "center" ? `Center: ${value}` : `x = ${value}`}</text>
          </g>
        );
      })}
      <g className="legend"><rect x="10" y="226" width="430" height="24" rx="6" /><circle className="solution" cx="35" cy="238" r="5" /><text x="72" y="242">Solution points</text><circle className="center" cx="160" cy="238" r="5" /><text x="191" y="242">Center</text><line className="distance" x1="264" x2="296" y1="238" y2="238" /><text x="359" y="242">Equal distance ({distance})</text></g>
    </svg>
  );
}

export default function AbsoluteValueEquationsTargetLesson121({ resetToken, onInteraction }: LessonAdapterProps) {
  const [center, setCenter] = useState(3);
  const [distance, setDistance] = useState(2);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const solvable = distance >= 0;
  const left = center - distance;
  const right = center + distance;
  const act = () => { setActions((value) => value + 1); onInteraction(); };
  const reset = () => {
    setCenter(3); setDistance(2); setActiveTab("Interaction + visualization");
    setLanguage("English (English)"); setShared(false); setWorkspace(false);
    setFullscreen(false); setPracticeChecked(false); setActions(0); onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateCenter = (value: number) => { setCenter(value); setPracticeChecked(false); act(); };
  const updateDistance = (value: number) => { setDistance(value); setPracticeChecked(false); act(); };
  const loadExample = () => { setCenter(-4); setDistance(3); setPracticeChecked(false); act(); };

  return (
    <div
      className={`abs121-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0178"
      data-dedicated-lesson="121"
      data-object-model="editable-absolute-value-center-distance-pointer-keyboard-draggable-number-line-solutions-linked-two-branch-linear-equations-distance-verification-negative-distance-no-solution-practice-model"
      data-problem={`${center},${distance}`}
      data-solutions={solvable ? `${left},${right}` : "none"}
      data-solvable={solvable}
      data-practice-checked={practiceChecked}
      data-actions={actions}
    >
      <nav className="abs121-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>121 Absolute Value Equations</b></nav>
      <header className="abs121-intro"><small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small><h1>Absolute-Value Equations</h1><p>Interpret distance-based solutions.</p><nav><b>♙ Intermediate-Advanced</b><b>ϟ Guided Practice</b><b>▣ Solve / Nsolve / Inequality Graphing</b><b>◷ 6-10 min</b></nav><div><label><Languages /><select aria-label="Absolute-value equations language" value={language} onChange={(event) => { setLanguage(event.target.value); act(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label><button onClick={reset}><RotateCcw />Reset</button><button onClick={() => { setShared(true); act(); }}><Share2 />{shared ? "Link ready" : "Share"}</button><button onClick={() => { setWorkspace((value) => !value); act(); }}>↗ {workspace ? "Close workspace" : "Workspace"}</button></div></header>
      <nav className="abs121-tabs">{["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => { setActiveTab(tab); if (tab === "Examples") loadExample(); else act(); }}>{tab}</button>)}</nav>
      <main className="abs121-lab">
        <header><span><small>INTERACTION + VISUALIZATION</small><h2>Distance solver on the number line</h2></span><b>{actions ? "Interactive" : "Awaiting interaction"}</b><b>{actions} actions</b><button aria-label="Expand absolute-value workspace" onClick={() => { setFullscreen((value) => !value); act(); }}><Expand /></button></header>
        <section className="abs121-body">
          <div className="abs121-left">
            <section className="abs121-number-card"><h3>Solve the absolute-value equation</h3><div className="abs121-equation">| x <span>{center >= 0 ? "−" : "+"}</span><input aria-label="Absolute-value center" type="number" value={Math.abs(center)} onChange={(event) => updateCenter((center >= 0 ? 1 : -1) * Number(event.target.value))} /> | = <input aria-label="Absolute-value distance" type="number" value={distance} onChange={(event) => updateDistance(Number(event.target.value))} /></div><p>{solvable ? `Distance from ${center} equals ${distance}.` : "Absolute value cannot equal a negative distance."}</p><NumberLine center={center} distance={distance} onCenter={updateCenter} onDistance={updateDistance} /></section>
            <section className="abs121-branches"><h3>⌘ Two branches (two cases)</h3>{solvable ? <><div><article><b>← Left branch</b><strong>x{signed(center)} = −{distance}</strong><p>Move {Math.abs(center)} to the other side</p><em>x = {left}</em><small><Check />Matches the left solution point.</small></article><article><b>→ Right branch</b><strong>x{signed(center)} = {distance}</strong><p>Move {Math.abs(center)} to the other side</p><em>x = {right}</em><small><Check />Matches the right solution point.</small></article></div><footer><Check /><span><b>Final answer</b><strong>x = {left} or x = {right}</strong><p>Both solutions are required.</p></span></footer></> : <div className="abs121-impossible"><CircleAlert /><strong>No solution</strong><p>An absolute value is never negative.</p></div>}<aside><CircleAlert />An absolute-value equation gives two solutions that are the same distance from the center.</aside></section>
          </div>
          <aside className="abs121-right">
            <section className="abs121-reasoning"><h2>Reasoning &amp; steps</h2><article><i>1</i><div><h3>Split into two branches</h3><p>For |x{signed(center)}| = {distance}, write the two possible equations.</p><strong>x{signed(center)} = {distance}<br />x{signed(center)} = −{distance}</strong></div></article><article><i>2</i><div><h3>Solve both branches</h3><p>Solve each linear equation.</p><strong>x{signed(center)} = {distance} → x = {right}<br />x{signed(center)} = −{distance} → x = {left}</strong></div></article><article><i>3</i><div><h3>Check distance</h3><p>Verify each solution is a distance {distance} from the center {center}.</p><strong>|{left} − {center}| = {distance} <Check /><br />|{right} − {center}| = {distance} <Check /></strong><b>Both checks are true.</b></div></article></section>
            <section className="abs121-pitfall"><TriangleAlert /><div><b>Common pitfall</b><h3>ONLY_POSITIVE_BRANCH</h3><p>Solving only x{signed(center)} = {distance} gives x = {right} but misses the other valid solution x = {left}.</p></div></section>
            <section className="abs121-practice"><header><b>♜ Try one like this</b><button onClick={() => { setPracticeChecked(true); act(); }}>Practice</button></header><p>Solve: |y + 4| = 3</p><small>Distance from −4 equals 3.</small><strong>y = −7 or y = −1</strong><button onClick={() => { setWorkspace(true); setPracticeChecked(true); act(); }}>{workspace ? "Workspace open" : "Open in workspace"}</button>{practiceChecked && <em>Both branches checked.</em>}</section>
          </aside>
        </section>
        <footer className="abs121-tags"><span>☷ primary-control</span><span>▣ expression</span><span>▣ symbolic result</span></footer>
      </main>
      <nav className="abs121-adjacent"><a href="/lessons/algebra/120-trigonometric-equations"><ArrowLeft /><span><small>PREVIOUS</small>Trigonometric Equations</span></a><a href="/lessons/algebra/122-linear-inequalities"><span><small>NEXT</small>Linear Inequalities</span><ArrowRight /></a></nav>
      <footer className="abs121-footer"><b><Sparkles />Math Universe</b><span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span><nav><button>Sitemap</button><button>Docs</button><button>About</button></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}
