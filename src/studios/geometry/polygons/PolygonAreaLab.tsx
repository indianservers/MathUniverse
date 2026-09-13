import { useMemo, useRef, useState } from "react";
import { SliderRow } from "../../mockup/studioLabKit";
import {
  COMPOSITE_PRESETS,
  fanTriangles,
  isSelfIntersecting,
  polygonArea,
  polygonPerimeter,
  regularMetrics,
  regularPolygonVertices,
  shoelaceTable,
  vertexLabel,
  type Vec,
} from "./polygonMath";
import {
  ChallengePanel,
  Controls,
  FormulaCard,
  LivePanel,
  MeasureRow,
  PresetGrid,
  PropertyCard,
  Toggle,
  VIEW,
  clientToSvg,
  fmt,
  fromScreen,
  pointsAttr,
  toScreen,
} from "./polygonUi";

type AreaSub = "regular" | "decomposition" | "composite" | "coordinate";

export default function PolygonAreaLab() {
  const [sub, setSub] = useState<AreaSub>("regular");
  const [n, setN] = useState(6);
  const [R, setR] = useState(3.6);
  const [showApothem, setShowApothem] = useState(true);
  const [wedges, setWedges] = useState(6);
  const [shape, setShape] = useState("l-shape");
  const [showParts, setShowParts] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [tableOpen, setTableOpen] = useState(false);
  const [verts, setVerts] = useState<Vec[]>(() => [
    { x: -3, y: -2 }, { x: 3, y: -2 }, { x: 2.2, y: 2.4 }, { x: -0.4, y: 3.1 }, { x: -3.2, y: 1.2 },
  ]);
  const [grid, setGrid] = useState<Vec[]>(() => [
    { x: -2, y: -2 }, { x: 3, y: -2 }, { x: 3, y: 1 }, { x: 0, y: 3 }, { x: -2, y: 2 },
  ]);
  const drag = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const m = regularMetrics(n, R);
  const regularVerts = regularPolygonVertices(n, R, 0);
  const regularScreen = regularVerts.map((p) => toScreen(p, 48));
  const origin = toScreen({ x: 0, y: 0 }, 48);
  const irrScreen = verts.map((p) => toScreen(p, 42));
  const irrArea = polygonArea(verts);
  const irrPeri = polygonPerimeter(verts);
  const triangles = fanTriangles(verts, 0);
  const crossed = isSelfIntersecting(verts);
  const composite = COMPOSITE_PRESETS.find((item) => item.id === shape) ?? COMPOSITE_PRESETS[0]!;
  const partAreas = composite.parts.map((part) => ({ ...part, area: polygonArea(part.points) }));
  const compositeTotal = partAreas.reduce((s, p) => s + p.area, 0);
  const gridArea = polygonArea(grid);
  const rows = shoelaceTable(grid);

  const dragIrr = (index: number, event: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return;
    const s = clientToSvg(svg, event);
    const math = fromScreen(s.x, s.y, 42);
    setVerts((current) => current.map((p, i) => (i === index ? math : p)));
  };

  const dragGrid = (index: number, event: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return;
    const s = clientToSvg(svg, event);
    const math = fromScreen(s.x, s.y, 36);
    setGrid((current) => current.map((p, i) => (i === index ? { x: Math.round(math.x), y: Math.round(math.y) } : p)));
  };

  const wedgeCount = Math.min(n, Math.max(1, wedges));

  const target = useMemo(() => 50, []);

  return (
    <div className="poly-lab">
      <Controls title="Area explorer">
        <div className="poly-sub">
          {([["regular", "Regular area"], ["decomposition", "Decomposition"], ["composite", "Composite"], ["coordinate", "Coordinate"]] as const).map(([id, label]) => (
            <button key={id} type="button" className={sub === id ? "active" : ""} onClick={() => setSub(id)}>{label}</button>
          ))}
        </div>
        {sub === "regular" ? (
          <>
            <SliderRow label="Sides n" value={n} min={3} max={16} step={1} onChange={(value) => { setN(value); setWedges(value); }} />
            <SliderRow label="Radius R" value={R} min={1.5} max={6} step={0.05} onChange={setR} />
            <SliderRow label="Wedges shown" value={wedgeCount} min={1} max={n} step={1} onChange={setWedges} />
            <Toggle checked={showApothem} onChange={setShowApothem}>Apothem visibility</Toggle>
          </>
        ) : null}
        {sub === "decomposition" ? (
          <p className="msk-note">Drag vertices. Area is the sum of fan triangles from vertex A.</p>
        ) : null}
        {sub === "composite" ? (
          <>
            <PresetGrid value={shape} items={COMPOSITE_PRESETS.map((item) => ({ id: item.id, label: item.name }))} onChange={setShape} />
            <Toggle checked={showParts} onChange={setShowParts}>Show decomposition</Toggle>
            <Toggle checked={showDims} onChange={setShowDims}>Show dimensions</Toggle>
          </>
        ) : null}
        {sub === "coordinate" ? (
          <Toggle checked={tableOpen} onChange={setTableOpen}>Show shoelace table</Toggle>
        ) : null}
      </Controls>

      <section className="msk-panel msk-canvas poly-stage">
        <svg ref={svgRef} className="msk-graph poly-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label="Area lab">
          <rect width={VIEW.w} height={VIEW.h} fill="#fbfdff" />
          {sub === "regular" ? (
            <g>
              {regularVerts.slice(0, wedgeCount).map((_, i) => {
                const a = regularScreen[i]!;
                const b = regularScreen[(i + 1) % n]!;
                return <polygon key={i} points={`${origin.x},${origin.y} ${a.x},${a.y} ${b.x},${b.y}`} fill={`rgba(20,125,242,${0.08 + (i % 4) * 0.04})`} stroke="#147df2" />;
              })}
              <polygon points={pointsAttr(regularScreen)} fill="none" stroke="#0f172a" strokeWidth="1.4" />
              {showApothem && regularScreen[0] && regularScreen[1] ? (
                <line x1={origin.x} y1={origin.y} x2={(regularScreen[0].x + regularScreen[1].x) / 2} y2={(regularScreen[0].y + regularScreen[1].y) / 2} stroke="#0f766e" strokeWidth="2" />
              ) : null}
              <circle cx={origin.x} cy={origin.y} r="4" fill="#8b45f4" />
              <text x="20" y="28" fontSize="14" fontWeight="800" fill="#0f172a">n congruent triangles from O</text>
            </g>
          ) : null}
          {sub === "decomposition" ? (
            <g>
              {triangles.map((tri, i) => (
                <polygon key={i} points={pointsAttr(tri.map((p) => toScreen(p, 42)))} fill={`rgba(139,69,244,${0.1 + (i % 3) * 0.06})`} stroke="#8b45f4" />
              ))}
              {irrScreen.map((p, i) => (
                <g key={i} className="poly-handle">
                  <circle cx={p.x} cy={p.y} r="14" fill="transparent" onPointerDown={(e) => { drag.current = i; e.currentTarget.setPointerCapture(eventPointer(e)); }} onPointerMove={(e) => { if (drag.current === i) dragIrr(i, e); }} onPointerUp={() => { drag.current = null; }} />
                  <circle cx={p.x} cy={p.y} r="6" fill="#08b9dd" stroke="#fff" />
                  <text x={p.x + 8} y={p.y - 8} fontSize="11" fontWeight="800">{vertexLabel(i)}</text>
                </g>
              ))}
              <text x="20" y="28" fontSize="14" fontWeight="800">Fan triangulation</text>
            </g>
          ) : null}
          {sub === "composite" ? (
            <g>
              {partAreas.map((part, i) => {
                const pts = part.points.map((p) => toScreen({ x: p.x - 3, y: p.y - 3 }, 38));
                return (
                  <g key={part.id}>
                    <polygon points={pointsAttr(pts)} fill={showParts ? (i === 0 ? "rgba(20,125,242,.16)" : "rgba(245,158,11,.16)") : "rgba(20,125,242,.12)"} stroke="#147df2" />
                    {showDims ? <text x={pts[0]!.x + 12} y={pts[0]!.y + 18} fontSize="11" fill="#0f172a">{part.label}</text> : null}
                  </g>
                );
              })}
              <text x="20" y="28" fontSize="14" fontWeight="800">{composite.name} floor plan</text>
            </g>
          ) : null}
          {sub === "coordinate" ? (
            <g>
              {Array.from({ length: 13 }, (_, i) => (
                <g key={i}>
                  <line x1={80 + i * 36} y1="40" x2={80 + i * 36} y2="420" stroke="#e8eef6" />
                  <line x1="80" y1={40 + i * 36} x2="560" y2={40 + i * 36} stroke="#e8eef6" />
                </g>
              ))}
              <polygon points={pointsAttr(grid.map((p) => toScreen(p, 36)))} fill="rgba(20,125,242,.12)" stroke="#147df2" strokeWidth="2" />
              {grid.map((p, i) => {
                const s = toScreen(p, 36);
                return (
                  <g key={i} className="poly-handle">
                    <circle cx={s.x} cy={s.y} r="14" fill="transparent" onPointerDown={(e) => { drag.current = i; e.currentTarget.setPointerCapture(eventPointer(e)); }} onPointerMove={(e) => { if (drag.current === i) dragGrid(i, e); }} onPointerUp={() => { drag.current = null; }} />
                    <circle cx={s.x} cy={s.y} r="6" fill="#8b45f4" stroke="#fff" />
                    <text x={s.x + 8} y={s.y - 8} fontSize="11">{vertexLabel(i)} ({p.x},{p.y})</text>
                  </g>
                );
              })}
              <text x="20" y="28" fontSize="14" fontWeight="800">Shoelace on a coordinate grid</text>
            </g>
          ) : null}
        </svg>
      </section>

      <LivePanel title="Area">
        {sub === "regular" ? (
          <>
            <MeasureRow color="#0ea5e9" label="Perimeter" value={fmt(m.perimeter, 3)} />
            <MeasureRow color="#0f766e" label="Apothem" value={fmt(m.apothem, 3)} />
            <MeasureRow color="#147df2" label="One triangle" value={fmt(m.area / n, 3)} />
            <MeasureRow color="#147df2" label="Total area" value={fmt(m.area, 3)} />
            <FormulaCard title="Regular area">
              One triangle = ½ × side × apothem. Total = n × that = ½ P a = ½ n R² sin(2π/n).
            </FormulaCard>
          </>
        ) : null}
        {sub === "decomposition" ? (
          <>
            {crossed ? <p className="poly-warn">Self-intersecting — shoelace still runs, but the region is not simple.</p> : null}
            {triangles.map((tri, i) => (
              <MeasureRow key={i} color="#8b45f4" label={`Area ${i + 1}`} value={fmt(polygonArea(tri), 3)} />
            ))}
            <MeasureRow color="#147df2" label="Total area" value={fmt(irrArea, 3)} />
            <MeasureRow color="#0ea5e9" label="Perimeter" value={fmt(irrPeri, 3)} />
          </>
        ) : null}
        {sub === "composite" ? (
          <>
            {partAreas.map((part) => (
              <MeasureRow key={part.id} color="#f59e0b" label={part.label} value={fmt(part.area, 2)} />
            ))}
            <MeasureRow color="#147df2" label="Total area" value={fmt(compositeTotal, 2)} />
            <p className="msk-note">Find the total without opening this panel, then Check.</p>
          </>
        ) : null}
        {sub === "coordinate" ? (
          <>
            <MeasureRow color="#147df2" label="Shoelace area" value={fmt(gridArea, 3)} />
            <FormulaCard title="Shoelace">A = ½ |Σ (xᵢ yᵢ₊₁ − yᵢ xᵢ₊₁)|</FormulaCard>
            {tableOpen ? (
              <div className="poly-table-wrap">
                <table>
                  <thead><tr><th>Vertex</th><th>x</th><th>y</th><th>xᵢyᵢ₊₁</th><th>yᵢxᵢ₊₁</th></tr></thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label}><td>{row.label}</td><td>{fmt(row.x, 2)}</td><td>{fmt(row.y, 2)}</td><td>{fmt(row.xyNext, 2)}</td><td>{fmt(row.yxNext, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        ) : null}
        <PropertyCard title="Why decompose?">
          Land parcels, floor plans, and fabrication layouts are usually unions of triangles and rectangles — never one mystery formula.
        </PropertyCard>
        <ChallengePanel
          prompt="Create a regular polygon with area approximately 50 square units."
          hint="Area = ½ n R² sin(2π/n). Try a hexagon with R near 4.4, or change n."
          check={() => ({
            ok: Math.abs(m.area - target) <= 4,
            detail: `Current regular area is ${fmt(m.area, 2)} (target ≈ ${target}).`,
          })}
          onReset={() => { setN(6); setR(3.6); setSub("regular"); }}
        />
      </LivePanel>
    </div>
  );
}

function eventPointer(event: { pointerId: number }) {
  return event.pointerId;
}
