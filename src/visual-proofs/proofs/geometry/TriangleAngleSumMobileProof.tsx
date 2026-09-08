import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./triangle-angle-sum-mobile.css";

type Point = { x: number; y: number };
type VertexName = "a" | "b" | "c";

const DEFAULT_POINTS: Record<VertexName, Point> = {
  a: { x: 130, y: 140 },
  b: { x: 70, y: 430 },
  c: { x: 342, y: 430 },
};

const COLORS = { a: "#ff7b66", b: "#42c8e5", c: "#ffc43d" } as const;

export default function TriangleAngleSumMobileProof() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [progress, setProgress] = useState(58);
  const [playing, setPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const dragging = useRef<VertexName | null>(null);
  const lastFrame = useRef<number | null>(null);
  const angles = useMemo(() => triangleAngles(points.a, points.b, points.c), [points]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const animate = (time: number) => {
      if (lastFrame.current === null) lastFrame.current = time;
      const elapsed = time - lastFrame.current;
      lastFrame.current = time;
      setProgress((current) => {
        const next = current + elapsed / 600;
        return next >= 100 ? 0 : next;
      });
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      lastFrame.current = null;
    };
  }, [playing]);

  const reset = () => {
    setPoints(DEFAULT_POINTS);
    setProgress(0);
    setPlaying(false);
    setLabelsVisible(true);
    setMenuOpen(false);
  };

  const moveVertex = (event: ReactPointerEvent<SVGSVGElement>) => {
    const vertex = dragging.current;
    if (!vertex) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      x: Math.max(38, Math.min(352, ((event.clientX - rect.left) / rect.width) * 390)),
      y: Math.max(72, Math.min(472, ((event.clientY - rect.top) / rect.height) * 720)),
    };
    const candidate = { ...points, [vertex]: next };
    if (triangleArea(candidate.a, candidate.b, candidate.c) < 9500) return;
    setPoints(candidate);
  };

  return (
    <main className="triangle-proof-mobile" aria-label="Triangle Angle Sum interactive proof">
      <header className="triangle-proof-header">
        <button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <div>
          <h1>Triangle Angle Sum</h1>
          <p>1 / 100</p>
        </div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="triangle-proof-stage" aria-label="Interactive triangle diagram">
        <svg
          viewBox="0 0 390 720"
          role="img"
          aria-label={`Triangle angles ${angles.map(roundAngle).join(", ")} degrees combine to form a straight angle of 180 degrees`}
          onPointerMove={moveVertex}
          onPointerUp={() => { dragging.current = null; }}
          onPointerCancel={() => { dragging.current = null; }}
          onPointerLeave={() => { dragging.current = null; }}
        >
          <defs>
            <filter id="triangle-handle-shadow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#17395a" floodOpacity=".22" />
            </filter>
          </defs>

          <path className="triangle-outline" d={`M ${points.a.x} ${points.a.y} L ${points.b.x} ${points.b.y} L ${points.c.x} ${points.c.y} Z`} />
          <AngleSector center={points.a} first={points.b} second={points.c} color={COLORS.a} radius={52} />
          <AngleSector center={points.b} first={points.c} second={points.a} color={COLORS.b} radius={48} />
          <AngleSector center={points.c} first={points.a} second={points.b} color={COLORS.c} radius={48} />

          {labelsVisible ? (
            <>
              <AngleLabel center={points.a} first={points.b} second={points.c} value={angles[0]} distance={69} />
              <AngleLabel center={points.b} first={points.c} second={points.a} value={angles[1]} distance={64} />
              <AngleLabel center={points.c} first={points.a} second={points.b} value={angles[2]} distance={64} />
            </>
          ) : null}

          <TransferArrow from={points.a} to={{ x: 152, y: 575 }} color={COLORS.a} progress={progress} bend={-58} />
          <TransferArrow from={points.b} to={{ x: 215, y: 555 }} color={COLORS.b} progress={progress} bend={50} />
          <TransferArrow from={points.c} to={{ x: 278, y: 579 }} color={COLORS.c} progress={progress} bend={-26} />

          <StraightAngle angles={angles} progress={progress} labelsVisible={labelsVisible} />

          {(["a", "b", "c"] as VertexName[]).map((vertex) => (
            <g
              key={vertex}
              className="triangle-drag-handle"
              role="button"
              aria-label={`Drag vertex ${vertex.toUpperCase()}`}
              tabIndex={0}
              transform={`translate(${points[vertex].x} ${points[vertex].y})`}
              onPointerDown={(event) => {
                dragging.current = vertex;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
            >
              <circle r="17" fill="#ffffff" stroke="#17395a" strokeWidth="3" filter="url(#triangle-handle-shadow)" />
              <circle r="9" fill="#eefbff" stroke="#35bcd8" strokeWidth="4" />
              <circle r="3" fill="#17395a" />
            </g>
          ))}
        </svg>
      </section>

      <section className="triangle-proof-controls" aria-label="Animation controls">
        <button type="button" className="triangle-control-button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause proof animation" : "Play proof animation"}>
          {playing ? <Pause /> : <Play />}
        </button>
        <label className="triangle-progress">
          <span className="sr-only">Proof progress</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(progress)}
            style={{ "--proof-progress": `${progress}%` } as CSSProperties}
            onChange={(event) => { setPlaying(false); setProgress(Number(event.target.value)); }}
            aria-label="Proof progress"
          />
        </label>
        <button type="button" className="triangle-control-button" onClick={reset} aria-label="Reset triangle proof"><RotateCcw /></button>
      </section>

      {menuOpen ? (
        <section className="triangle-proof-menu" role="dialog" aria-label="Lesson options">
          <button type="button" className="triangle-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button>
          <h2>Why it works</h2>
          <p>The three interior angles are copied without changing their size. Together they fit exactly along a straight line, so their sum is always 180°.</p>
          <label><span>Show angle labels</span><input type="checkbox" checked={labelsVisible} onChange={() => setLabelsVisible((shown) => !shown)} /></label>
        </section>
      ) : null}
    </main>
  );
}

function AngleSector({ center, first, second, radius, color }: { center: Point; first: Point; second: Point; radius: number; color: string }) {
  return <path d={sectorPath(center, first, second, radius)} fill={color} fillOpacity=".9" stroke="#17395a" strokeWidth="1.5" />;
}

function AngleLabel({ center, first, second, value, distance }: { center: Point; first: Point; second: Point; value: number; distance: number }) {
  const point = angleBisectorPoint(center, first, second, distance);
  return <text className="triangle-angle-label" x={point.x} y={point.y}>{roundAngle(value)}°</text>;
}

function TransferArrow({ from, to, color, progress, bend }: { from: Point; to: Point; color: string; progress: number; bend: number }) {
  const midX = (from.x + to.x) / 2 + bend;
  const midY = (from.y + to.y) / 2;
  const opacity = .34 + progress / 190;
  return (
    <g opacity={opacity}>
      <path d={`M ${from.x} ${from.y + 18} Q ${midX} ${midY} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
      <path d={`M ${to.x - 8} ${to.y - 8} L ${to.x} ${to.y} L ${to.x + 8} ${to.y - 8}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function StraightAngle({ angles, progress, labelsVisible }: { angles: number[]; progress: number; labelsVisible: boolean }) {
  const center = { x: 195, y: 626 };
  const radius = 93;
  let cursor = 180;
  return (
    <g className="triangle-straight-angle" opacity={.25 + progress * .0075}>
      {angles.map((angle, index) => {
        const start = cursor;
        const end = cursor - angle;
        cursor = end;
        const path = polarSector(center, radius, start, end);
        const labelPoint = polarPoint(center, 58, (start + end) / 2);
        return (
          <g key={index}>
            <path d={path} fill={[COLORS.a, COLORS.b, COLORS.c][index]} stroke="#17395a" strokeWidth="1.6" />
            {labelsVisible ? <text className="triangle-strip-label" x={labelPoint.x} y={labelPoint.y}>{roundAngle(angle)}°</text> : null}
          </g>
        );
      })}
      <line x1="84" y1={center.y} x2="306" y2={center.y} stroke="#17395a" strokeWidth="5" strokeLinecap="round" />
      <text className="triangle-total-label" x={center.x} y="690">180°</text>
    </g>
  );
}

function triangleAngles(a: Point, b: Point, c: Point) {
  return [angleAt(b, a, c), angleAt(c, b, a), angleAt(a, c, b)];
}

function angleAt(first: Point, center: Point, second: Point) {
  const v1 = { x: first.x - center.x, y: first.y - center.y };
  const v2 = { x: second.x - center.x, y: second.y - center.y };
  const cosine = (v1.x * v2.x + v1.y * v2.y) / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}

function sectorPath(center: Point, first: Point, second: Point, radius: number) {
  const a1 = Math.atan2(first.y - center.y, first.x - center.x);
  const a2 = Math.atan2(second.y - center.y, second.x - center.x);
  let delta = a2 - a1;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  const start = { x: center.x + Math.cos(a1) * radius, y: center.y + Math.sin(a1) * radius };
  const end = { x: center.x + Math.cos(a1 + delta) * radius, y: center.y + Math.sin(a1 + delta) * radius };
  return `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${delta > 0 ? 1 : 0} ${end.x} ${end.y} Z`;
}

function angleBisectorPoint(center: Point, first: Point, second: Point, distance: number) {
  const v1 = normalize({ x: first.x - center.x, y: first.y - center.y });
  const v2 = normalize({ x: second.x - center.x, y: second.y - center.y });
  const direction = normalize({ x: v1.x + v2.x, y: v1.y + v2.y });
  return { x: center.x + direction.x * distance, y: center.y + direction.y * distance + 5 };
}

function normalize(point: Point) {
  const length = Math.hypot(point.x, point.y) || 1;
  return { x: point.x / length, y: point.y / length };
}

function polarPoint(center: Point, radius: number, degrees: number) {
  const radians = degrees * Math.PI / 180;
  return { x: center.x + Math.cos(radians) * radius, y: center.y - Math.sin(radians) * radius };
}

function polarSector(center: Point, radius: number, start: number, end: number) {
  const first = polarPoint(center, radius, start);
  const second = polarPoint(center, radius, end);
  return `M ${center.x} ${center.y} L ${first.x} ${first.y} A ${radius} ${radius} 0 0 1 ${second.x} ${second.y} Z`;
}

function triangleArea(a: Point, b: Point, c: Point) {
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

function roundAngle(value: number) {
  return Math.round(value);
}
