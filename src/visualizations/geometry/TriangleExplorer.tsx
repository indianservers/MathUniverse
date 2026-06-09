import { CSSProperties, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { Point2D, distance2D, roundTo, triangleAreaFromPoints, trianglePerimeter } from "../../utils/math";

const toSvg = (p: Point2D) => ({ x: 180 + p.x * 18, y: 180 - p.y * 18 });
const angle = (a: Point2D, b: Point2D, c: Point2D) => {
  const ab = distance2D(a.x, a.y, b.x, b.y);
  const ac = distance2D(a.x, a.y, c.x, c.y);
  const bc = distance2D(b.x, b.y, c.x, c.y);
  return Math.acos(Math.min(1, Math.max(-1, (ab * ab + ac * ac - bc * bc) / (2 * ab * ac)))) * 180 / Math.PI;
};

export default function TriangleExplorer() {
  const [a, setA] = useState<Point2D>({ x: -5, y: -3 });
  const [b, setB] = useState<Point2D>({ x: 5, y: -2 });
  const [c, setC] = useState<Point2D>({ x: 0, y: 5 });
  const [controlsWidth, setControlsWidth] = useState(380);
  const [dragVertex, setDragVertex] = useState<"A" | "B" | "C" | null>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stats = useMemo(() => ({
    ab: distance2D(a.x, a.y, b.x, b.y),
    bc: distance2D(b.x, b.y, c.x, c.y),
    ca: distance2D(c.x, c.y, a.x, a.y),
    area: triangleAreaFromPoints(a, b, c),
    perimeter: trianglePerimeter(a, b, c),
    angleA: angle(a, b, c),
    angleB: angle(b, a, c),
    angleC: angle(c, a, b),
  }), [a, b, c]);
  const semi = (stats.ab + stats.bc + stats.ca) / 2;
  const heron = Math.sqrt(Math.max(0, semi * (semi - stats.ab) * (semi - stats.bc) * (semi - stats.ca)));
  const sideType = Math.abs(stats.ab - stats.bc) < 0.05 && Math.abs(stats.bc - stats.ca) < 0.05 ? "Equilateral" : Math.abs(stats.ab - stats.bc) < 0.05 || Math.abs(stats.bc - stats.ca) < 0.05 || Math.abs(stats.ca - stats.ab) < 0.05 ? "Isosceles" : "Scalene";
  const angles = [stats.angleA, stats.angleB, stats.angleC];
  const angleType = angles.some((value) => Math.abs(value - 90) < 1) ? "Right" : angles.some((value) => value > 90) ? "Obtuse" : "Acute";
  const centroid = toSvg({ x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 });
  const A = toSvg(a), B = toSvg(b), C = toSvg(c);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      const resize = resizeRef.current;
      if (!resize) return;
      setControlsWidth(Math.min(560, Math.max(280, resize.startWidth - (event.clientX - resize.startX))));
    }
    function onPointerUp() {
      resizeRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const updateDraggedVertex = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragVertex || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * 360;
    const svgY = ((event.clientY - rect.top) / rect.height) * 360;
    const point = {
      x: Math.min(9, Math.max(-9, Number(((svgX - 180) / 18).toFixed(2)))),
      y: Math.min(9, Math.max(-9, Number(((180 - svgY) / 18).toFixed(2)))),
    };
    if (dragVertex === "A") setA(point);
    if (dragVertex === "B") setB(point);
    if (dragVertex === "C") setC(point);
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    resizeRef.current = { startX: event.clientX, startWidth: controlsWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <SectionCard title="Triangle Explorer" description="Change three vertices and watch lengths, area, perimeter, and angles update.">
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_8px_var(--triangle-controls-width)]" style={{ "--triangle-controls-width": `${controlsWidth}px` } as CSSProperties}>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg
            ref={svgRef}
            viewBox="0 0 360 360"
            className="h-[420px] w-full touch-none select-none"
            onPointerMove={updateDraggedVertex}
            onPointerUp={() => setDragVertex(null)}
            onPointerLeave={() => setDragVertex(null)}
          >
            <defs><marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3"><circle cx="3" cy="3" r="3" fill="#22d3ee" /></marker></defs>
            {Array.from({ length: 21 }, (_, i) => <line key={`x${i}`} x1={i * 18} x2={i * 18} y1="0" y2="360" stroke="rgba(148,163,184,.22)" />)}
            {Array.from({ length: 21 }, (_, i) => <line key={`y${i}`} y1={i * 18} y2={i * 18} x1="0" x2="360" stroke="rgba(148,163,184,.22)" />)}
            <line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" /><line y1="0" y2="360" x1="180" x2="180" stroke="#64748b" />
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(34,211,238,.18)" stroke="#06b6d4" strokeWidth="3" />
            {[["A", A, "#22d3ee"], ["B", B, "#a78bfa"], ["C", C, "#f59e0b"]].map(([label, p, color]) => (
              <g
                key={label as string}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragVertex(label as "A" | "B" | "C");
                }}
              >
                <circle cx={(p as typeof A).x} cy={(p as typeof A).y} r="9" fill={color as string} stroke="#020617" strokeWidth="2" />
                <text x={(p as typeof A).x + 10} y={(p as typeof A).y - 8} fill={color as string} fontWeight="700">{label as string}</text>
              </g>
            ))}
            <circle cx={centroid.x} cy={centroid.y} r="6" fill="#ef4444" />
            <text x={centroid.x + 8} y={centroid.y - 8} fill="#ef4444" fontWeight="700">G</text>
          </svg>
        </div>
        <button type="button" className="hidden cursor-col-resize rounded-full border border-transparent bg-slate-200/40 hover:border-cyan-300 hover:bg-cyan-400/20 dark:bg-white/10 lg:block" onPointerDown={startResize} aria-label="Resize vertex controls pane" />
        <div className="space-y-3">
          <div className="rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-3 text-sm font-bold text-cyan-900 dark:text-cyan-100">
            Drag A, B, or C on the grid, or adjust exact coordinates below.
          </div>
          {[
            ["Ax", a.x, (v: number) => setA({ ...a, x: v })], ["Ay", a.y, (v: number) => setA({ ...a, y: v })],
            ["Bx", b.x, (v: number) => setB({ ...b, x: v })], ["By", b.y, (v: number) => setB({ ...b, y: v })],
            ["Cx", c.x, (v: number) => setC({ ...c, x: v })], ["Cy", c.y, (v: number) => setC({ ...c, y: v })],
          ].map(([label, value, setter]) => <SliderControl key={label as string} label={label as string} value={value as number} min={-9} max={9} step={0.5} onChange={setter as (v: number) => void} />)}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="AB" value={stats.ab} /><Metric label="BC" value={stats.bc} /><Metric label="CA" value={stats.ca} /><Metric label="Perimeter" value={stats.perimeter} /><Metric label="Shoelace area" value={stats.area} /><Metric label="Heron area" value={heron} /><Metric label="Angles" value={`${roundTo(stats.angleA, 1)}°, ${roundTo(stats.angleB, 1)}°, ${roundTo(stats.angleC, 1)}°`} /><Metric label="Type" value={`${sideType}, ${angleType}`} />
          </div>
          {stats.area < 0.2 && <p className="rounded-2xl bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">The triangle is nearly flat, so its area is close to zero.</p>}
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A triangle is determined by three points. Its side lengths, angles, perimeter, and area all update when a point moves."
          formula="Area = shoelace formula = sqrt(s(s-a)(s-b)(s-c)) by Heron's formula"
          changes="Moving any vertex changes side lengths, angles, centroid, perimeter, and area."
          realWorldUse="Surveying, architecture, mesh geometry, robotics, and game collision shapes."
          warning={stats.area < 0.2 ? "Degenerate warning: the points are almost collinear, so the triangle is nearly flat." : undefined}
          steps={[`Side type: ${sideType}.`, `Angle type: ${angleType}.`, `Angle sum = ${roundTo(stats.angleA + stats.angleB + stats.angleC, 2)} degrees.`, `Centroid G is the average of the three vertices.`]}
          tasks={["Create an isosceles triangle.", "Create a right triangle.", "Move one point and watch area change.", "Make the triangle nearly flat and show the warning."]}
        />
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 2) : value}</p></div>;
}
