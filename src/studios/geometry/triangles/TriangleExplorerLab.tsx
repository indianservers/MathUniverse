import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { ChipRow, Field, Panel, Segmented } from "../../mockup/studioLabKit";
import {
  EXPLORER_PRESETS,
  altitudeFoot,
  angleBisectorDir,
  clampPoint,
  defaultPlane,
  fromSvg,
  lineIntersection,
  measureTriangle,
  midpoint,
  perpendicularBisector,
  triangleArea,
  type Pt,
} from "./triangleGeometry";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  AngleArc,
  DashedLine,
  DraggableVertex,
  GridLayer,
  SideMeasurement,
  SolidLine,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type Sub = "explore" | "area" | "angles" | "special";
type Base = "AB" | "BC" | "CA";

const SPECIAL: Record<string, { A: Pt; B: Pt; C: Pt }> = {
  "30-60-90": { B: { x: 2, y: 1.6 }, C: { x: 2 + 4 * Math.sqrt(3), y: 1.6 }, A: { x: 2, y: 5.6 } },
  "45-45-90": { B: { x: 2.4, y: 1.6 }, C: { x: 8.4, y: 1.6 }, A: { x: 2.4, y: 7.6 } },
  "3-4-5": { B: { x: 2, y: 1.5 }, C: { x: 8, y: 1.5 }, A: { x: 2, y: 6.5 } },
};

export default function TriangleExplorerLab() {
  const reducedMotion = useReducedMotion();
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [tri, setTri] = useState(EXPLORER_PRESETS.scalene);
  const [preset, setPreset] = useState("scalene");
  const [sub, setSub] = useState<Sub>("explore");
  const [base, setBase] = useState<Base>("BC");
  const [layers, setLayers] = useState({ sides: true, angles: true, altitudes: false, median: false, bisector: false, perp: false, grid: true, coords: false, arcs: true });
  const [anim, setAnim] = useState(false);
  const [areaFormula, setAreaFormula] = useState("bh");

  const m = useMemo(() => measureTriangle(tri.A, tri.B, tri.C), [tri]);
  const basePts = base === "AB" ? [tri.A, tri.B, tri.C] : base === "BC" ? [tri.B, tri.C, tri.A] : [tri.C, tri.A, tri.B];
  const foot = altitudeFoot(basePts[2], basePts[0], basePts[1]);
  const height = Math.hypot(basePts[2].x - foot.x, basePts[2].y - foot.y);
  const baseLen = Math.hypot(basePts[1].x - basePts[0].x, basePts[1].y - basePts[0].y);
  const midBC = midpoint(tri.B, tri.C);
  const midCA = midpoint(tri.C, tri.A);
  const midAB = midpoint(tri.A, tri.B);
  const bis = lineIntersection(tri.A, angleBisectorDir(tri.A, tri.B, tri.C), tri.B, { x: tri.C.x - tri.B.x, y: tri.C.y - tri.B.y });
  const pb = perpendicularBisector(tri.B, tri.C);

  useEffect(() => {
    if (!anim || reducedMotion) return;
    const origin = { ...tri.C };
    let t = 0;
    let id = 0;
    const tick = () => {
      t += 0.018;
      setTri((prev) => ({ ...prev, C: clampPoint({ x: origin.x + Math.sin(t) * 1.8, y: origin.y + Math.cos(t * 0.7) * 0.35 }) }));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [anim]);

  const applyPreset = (id: string) => {
    setPreset(id);
    setAnim(false);
    setTri(EXPLORER_PRESETS[id] ?? EXPLORER_PRESETS.scalene);
  };

  const startDrag = (who: "A" | "B" | "C") => (event: React.PointerEvent) => {
    event.preventDefault();
    drag.current = who;
    setPreset("custom");
    setAnim(false);
    bindSvgDrag(svgRef, (ev) => {
      const svg = svgRef.current;
      if (!svg || !drag.current) return;
      const s = pointerToSvg(svg, ev);
      const next = clampPoint(fromSvg(plane, s.x, s.y));
      setTri((prev) => {
        const draft = { ...prev, [drag.current!]: next };
        return triangleArea(draft.A, draft.B, draft.C) < 0.35 ? prev : draft;
      });
    }, () => { drag.current = null; });
  };

  const reset = () => applyPreset("scalene");

  return (
    <LabFrame
      ariaLabel="Triangle explorer"
      controls={
        <Panel title="Explorer controls">
          <Field label="Focus">
            <Segmented value={sub} onChange={(id) => setSub(id as Sub)} options={[
              { id: "explore", label: "Explore" },
              { id: "area", label: "Area" },
              { id: "angles", label: "Angles" },
              { id: "special", label: "Special" },
            ]} />
          </Field>
          <Field label="Triangle type">
            <ChipRow value={preset} onChange={applyPreset} options={["scalene", "isosceles", "equilateral", "right", "acute", "obtuse"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1) }))} />
          </Field>
          {sub === "special" ? (
            <Field label="Special triangles">
              <ChipRow value="" onChange={(id) => { setTri(SPECIAL[id]); setPreset("custom"); }} options={Object.keys(SPECIAL).map((id) => ({ id, label: id }))} />
            </Field>
          ) : null}
          {sub === "area" ? (
            <>
              <Field label="Base">
                <Segmented value={base} onChange={(id) => setBase(id as Base)} options={[{ id: "AB", label: "AB" }, { id: "BC", label: "BC" }, { id: "CA", label: "CA" }]} />
              </Field>
              <Field label="Area formula">
                <Segmented value={areaFormula} onChange={setAreaFormula} options={[{ id: "bh", label: "½bh" }, { id: "heron", label: "Heron" }, { id: "coord", label: "Coordinate" }]} />
              </Field>
            </>
          ) : null}
          <Field label="Display">
            <Toggle checked={layers.sides} onChange={(v) => setLayers({ ...layers, sides: v })}>Side lengths</Toggle>
            <Toggle checked={layers.angles} onChange={(v) => setLayers({ ...layers, angles: v })}>Angles</Toggle>
            <Toggle checked={layers.arcs} onChange={(v) => setLayers({ ...layers, arcs: v })}>Angle arcs</Toggle>
            <Toggle checked={layers.altitudes} onChange={(v) => setLayers({ ...layers, altitudes: v })}>Altitudes</Toggle>
            <Toggle checked={layers.median} onChange={(v) => setLayers({ ...layers, median: v })}>Median</Toggle>
            <Toggle checked={layers.bisector} onChange={(v) => setLayers({ ...layers, bisector: v })}>Angle bisector</Toggle>
            <Toggle checked={layers.perp} onChange={(v) => setLayers({ ...layers, perp: v })}>Perpendicular bisector</Toggle>
            <Toggle checked={layers.grid} onChange={(v) => setLayers({ ...layers, grid: v })}>Grid</Toggle>
            <Toggle checked={layers.coords} onChange={(v) => setLayers({ ...layers, coords: v })}>Coordinates</Toggle>
          </Field>
          <Toggle checked={anim} onChange={setAnim}>Move vertex C</Toggle>
        </Panel>
      }
      canvas={
        <svg ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label="Draggable triangle ABC">
          <rect width={plane.width} height={plane.height} fill="#f8fbff" />
          {layers.grid ? <GridLayer plane={plane} /> : null}
          <polygon points={polyPoints(plane, [tri.A, tri.B, tri.C])} fill="rgba(20,125,242,.10)" stroke="#147df2" strokeWidth="2.2" />
          {sub === "area" ? (
            <polygon points={polyPoints(plane, [basePts[0], basePts[1], basePts[2]])} fill="rgba(8,185,221,.16)" stroke="none" />
          ) : null}
          {layers.arcs || sub === "angles" ? (
            <>
              <AngleArc plane={plane} vertex={tri.A} p={tri.B} q={tri.C} color="#08b9dd" label={`${okNum(m.angles.A, 1)}°`} />
              <AngleArc plane={plane} vertex={tri.B} p={tri.A} q={tri.C} color="#8b45f4" radius={18} label={`${okNum(m.angles.B, 1)}°`} />
              <AngleArc plane={plane} vertex={tri.C} p={tri.A} q={tri.B} color="#f59e0b" radius={18} label={`${okNum(m.angles.C, 1)}°`} />
            </>
          ) : null}
          {(layers.altitudes || sub === "area") ? <DashedLine plane={plane} a={basePts[2]} b={foot} color="#64748b" /> : null}
          {layers.median ? <SolidLine plane={plane} a={tri.A} b={midBC} color="#10b981" /> : null}
          {layers.bisector && bis ? <SolidLine plane={plane} a={tri.A} b={bis} color="#8b45f4" /> : null}
          {layers.perp ? (
            <DashedLine plane={plane} a={{ x: pb.point.x - pb.dir.x * 0.04, y: pb.point.y - pb.dir.y * 0.04 }} b={{ x: pb.point.x + pb.dir.x * 0.04, y: pb.point.y + pb.dir.y * 0.04 }} />
          ) : null}
          {layers.sides ? (
            <>
              <SideMeasurement plane={plane} a={tri.A} b={tri.B} text={`c=${okNum(m.sides.AB)}`} />
              <SideMeasurement plane={plane} a={tri.B} b={tri.C} text={`a=${okNum(m.sides.BC)}`} />
              <SideMeasurement plane={plane} a={tri.C} b={tri.A} text={`b=${okNum(m.sides.CA)}`} />
            </>
          ) : null}
          <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={tri.A} label="A" active={drag.current === "A"} /></g>
          <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={tri.B} label="B" color="#0f766e" /></g>
          <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={tri.C} label="C" color="#8b45f4" /></g>
        </svg>
      }
      insights={
        <InsightStack
          measurements={
            <>
              <div className="tri-badges">
                <span className="tri-badge">By sides: {m.bySides}</span>
                <span className="tri-badge">By angles: {m.byAngles}</span>
              </div>
              <MeasureRow label="AB" value={okNum(m.sides.AB)} />
              <MeasureRow label="BC" value={okNum(m.sides.BC)} color="#0f766e" />
              <MeasureRow label="CA" value={okNum(m.sides.CA)} color="#8b45f4" />
              <MeasureRow label="∠A" value={`${okNum(m.angles.A, 1)}°`} color="#08b9dd" />
              <MeasureRow label="∠B" value={`${okNum(m.angles.B, 1)}°`} color="#8b45f4" />
              <MeasureRow label="∠C" value={`${okNum(m.angles.C, 1)}°`} color="#f59e0b" />
              <MeasureRow label="Perimeter" value={okNum(m.perimeter)} />
              <MeasureRow label="Semiperimeter s" value={okNum(m.semiperimeter)} />
              <MeasureRow label="Area" value={okNum(m.area)} />
              {layers.coords ? (
                <>
                  <MeasureRow label="A" value={`(${okNum(tri.A.x)}, ${okNum(tri.A.y)})`} />
                  <MeasureRow label="B" value={`(${okNum(tri.B.x)}, ${okNum(tri.B.y)})`} />
                  <MeasureRow label="C" value={`(${okNum(tri.C.x)}, ${okNum(tri.C.y)})`} />
                </>
              ) : null}
            </>
          }
          property={
            <p className="tri-ok">∠A + ∠B + ∠C = {okNum(m.angles.A, 1)}° + {okNum(m.angles.B, 1)}° + {okNum(m.angles.C, 1)}° = {okNum(m.angleSum, 1)}°</p>
          }
          formula={
            <FormulaCard
              title={sub === "area" ? "Area" : "Angle sum"}
              formula={sub === "area" ? (areaFormula === "heron" ? "A = √[s(s−a)(s−b)(s−c)]" : areaFormula === "coord" ? "A = ½|x1(y2−y3)+x2(y3−y1)+x3(y1−y2)|" : "A = ½ bh") : "∠A + ∠B + ∠C = 180°"}
              why={sub === "area" ? `Base ${base} = ${okNum(baseLen)}, height = ${okNum(height)}. ½bh = ${okNum(0.5 * baseLen * height)}. Heron = ${okNum(m.heron)}.` : "A straight line is 180°. Parallel-line transfer maps the three interior angles onto that line."}
              tryThis={sub === "area" ? "Switch the base and watch height change while area stays the same." : "Turn on Move vertex C and watch the sum stay 180°."}
            />
          }
          challenge={
            <ChallengeCard
              prompt="Create an isosceles triangle with apex angle 40°."
              hint="Make AB = AC (or another pair equal), then drag until the equal-side vertex is near 40°."
              check={() => m.bySides !== "Scalene" && [m.angles.A, m.angles.B, m.angles.C].some((ang, i, arr) => {
                const equalSides = i === 0 ? Math.abs(m.sides.AB - m.sides.CA) < 0.15 : i === 1 ? Math.abs(m.sides.AB - m.sides.BC) < 0.15 : Math.abs(m.sides.BC - m.sides.CA) < 0.15;
                return equalSides && Math.abs(ang - 40) < 2.5;
              })}
              onReset={reset}
            />
          }
        />
      }
    />
  );
}
