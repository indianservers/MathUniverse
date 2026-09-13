import { useEffect, useMemo, useRef, useState } from "react";
import { Field, Panel, Segmented, SliderRow } from "../../mockup/studioLabKit";
import {
  EXPLORER_PRESETS,
  clampPoint,
  constructSSS,
  defaultPlane,
  fromSvg,
  measureTriangle,
  ranking,
  toSvg,
  triangleArea,
  triangleInequality,
} from "./triangleGeometry";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  AngleArc,
  DashedLine,
  DraggableVertex,
  SideMeasurement,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type Mode = "inequality" | "sides" | "exterior";

export default function TriangleInequalitiesLab() {
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [mode, setMode] = useState<Mode>("inequality");
  const [a, setA] = useState(5);
  const [b, setB] = useState(6);
  const [c, setC] = useState(7);
  const [hinge, setHinge] = useState(0.72);
  const [animate, setAnimate] = useState(false);
  const [tri, setTri] = useState(EXPLORER_PRESETS.scalene);

  const tests = triangleInequality(a, b, c);
  const built = constructSSS(a, b, c, { x: 3.2, y: 1.8 });
  const m = measureTriangle(tri.A, tri.B, tri.C);
  const rank = ranking(tri.A, tri.B, tri.C);

  useEffect(() => {
    if (!animate) return;
    let t = 0;
    let id = 0;
    const tick = () => {
      t += 0.02;
      setHinge(0.12 + 0.75 * (0.5 + 0.5 * Math.sin(t)));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const hingeGeom = useMemo(() => {
    const origin = { x: 3.4, y: 2.2 };
    const P = origin;
    const Q = { x: origin.x + c, y: origin.y };
    const maxOpen = Math.PI * 0.92;
    const t = hinge;
    const ang = t * maxOpen;
    const R = { x: origin.x + b * Math.cos(ang), y: origin.y + b * Math.sin(ang) };
    const gap = Math.hypot(R.x - Q.x, R.y - Q.y);
    return { P, Q, R, gap, ang };
  }, [b, c, hinge]);

  const startDrag = (who: "A" | "B" | "C") => (event: React.PointerEvent) => {
    event.preventDefault();
    drag.current = who;
    bindSvgDrag(svgRef, (ev) => {
      const svg = svgRef.current;
      if (!svg || !drag.current) return;
      const s = pointerToSvg(svg, ev);
      const next = clampPoint(fromSvg(plane, s.x, s.y));
      setTri((prev) => {
        const draft = { ...prev, [drag.current!]: next };
        return triangleArea(draft.A, draft.B, draft.C) < 0.25 ? prev : draft;
      });
    }, () => { drag.current = null; });
  };

  const reset = () => { setA(5); setB(6); setC(7); setHinge(0.72); setTri(EXPLORER_PRESETS.scalene); setMode("inequality"); };

  const p = toSvg(plane, hingeGeom.P);
  const q = toSvg(plane, hingeGeom.Q);
  const r = toSvg(plane, hingeGeom.R);

  return (
    <LabFrame
      ariaLabel="Triangle inequalities laboratory"
      controls={
        <Panel title="Inequality controls">
          <Field label="Mode">
            <Segmented value={mode} onChange={(id) => setMode(id as Mode)} options={[
              { id: "inequality", label: "Triangle inequality" },
              { id: "sides", label: "Sides & angles" },
              { id: "exterior", label: "Exterior angle" },
            ]} />
          </Field>
          {mode === "inequality" ? (
            <>
              <SliderRow label="Side a (BC)" value={a} min={0.8} max={12} step={0.1} onChange={setA} />
              <SliderRow label="Side b (AC)" value={b} min={0.8} max={12} step={0.1} onChange={setB} />
              <SliderRow label="Side c (AB)" value={c} min={0.8} max={12} step={0.1} onChange={setC} />
              <SliderRow label="Hinge opening" value={hinge} min={0.05} max={1} step={0.01} onChange={setHinge} />
              <Toggle checked={animate} onChange={setAnimate}>Animate hinge</Toggle>
            </>
          ) : null}
          {mode !== "inequality" ? <p className="tri-note">Drag vertices A, B, C. Rankings update live.</p> : null}
        </Panel>
      }
      canvas={
        <svg ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label="Triangle inequality construction">
          <rect width={plane.width} height={plane.height} fill="#f8fbff" />
          {mode === "inequality" ? (
            tests.valid && hinge > 0.55 ? (
              <polygon points={polyPoints(plane, [built.A, built.B, built.C])} fill="rgba(16,185,129,.12)" stroke="#059669" strokeWidth="2.1" />
            ) : (
              <g>
                <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#147df2" strokeWidth="3" />
                <line x1={p.x} y1={p.y} x2={r.x} y2={r.y} stroke="#8b45f4" strokeWidth="3" />
                <line x1={r.x} y1={r.y} x2={q.x} y2={q.y} stroke={tests.degenerate ? "#f59e0b" : "#ef4444"} strokeWidth="2.2" strokeDasharray={tests.valid ? "0" : "7 5"} />
                <circle cx={p.x} cy={p.y} r="5" fill="#147df2" />
                <circle cx={q.x} cy={q.y} r="5" fill="#147df2" />
                <circle cx={r.x} cy={r.y} r="5" fill="#8b45f4" />
              </g>
            )
          ) : (
            <>
              <polygon points={polyPoints(plane, [tri.A, tri.B, tri.C])} fill="rgba(20,125,242,.10)" stroke="#147df2" strokeWidth="2.1" />
              <AngleArc plane={plane} vertex={tri.A} p={tri.B} q={tri.C} color="#08b9dd" label={`${okNum(m.angles.A, 0)}°`} />
              <AngleArc plane={plane} vertex={tri.B} p={tri.A} q={tri.C} color="#8b45f4" label={`${okNum(m.angles.B, 0)}°`} />
              <AngleArc plane={plane} vertex={tri.C} p={tri.A} q={tri.B} color="#f59e0b" label={`${okNum(m.angles.C, 0)}°`} />
              <SideMeasurement plane={plane} a={tri.B} b={tri.C} text={`a=${okNum(m.sides.BC)}`} />
              <SideMeasurement plane={plane} a={tri.A} b={tri.C} text={`b=${okNum(m.sides.CA)}`} />
              <SideMeasurement plane={plane} a={tri.A} b={tri.B} text={`c=${okNum(m.sides.AB)}`} />
              {mode === "exterior" ? (
                <>
                  <DashedLine plane={plane} a={tri.B} b={{ x: tri.C.x + (tri.C.x - tri.B.x) * 0.45, y: tri.C.y + (tri.C.y - tri.B.y) * 0.45 }} color="#64748b" />
                  <AngleArc plane={plane} vertex={tri.C} p={tri.B} q={{ x: tri.C.x + (tri.C.x - tri.B.x), y: tri.C.y + (tri.C.y - tri.B.y) }} color="#ef4444" radius={28} label="ext" />
                </>
              ) : null}
              <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={tri.A} label="A" /></g>
              <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={tri.B} label="B" /></g>
              <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={tri.C} label="C" /></g>
            </>
          )}
        </svg>
      }
      insights={
        <InsightStack
          measurements={
            mode === "inequality" ? (
              <>
                <MeasureRow label="a + b ? c" value={`${okNum(tests.ab.left)} ${tests.ab.ok ? ">" : tests.ab.equal ? "=" : "≯"} ${okNum(tests.ab.right)} ${tests.ab.ok ? "✓" : tests.ab.equal ? "=" : "✗"}`} color={tests.ab.ok ? "#059669" : "#dc2626"} />
                <MeasureRow label="b + c ? a" value={`${okNum(tests.bc.left)} ${tests.bc.ok ? ">" : tests.bc.equal ? "=" : "≯"} ${okNum(tests.bc.right)} ${tests.bc.ok ? "✓" : "✗"}`} color={tests.bc.ok ? "#059669" : "#dc2626"} />
                <MeasureRow label="c + a ? b" value={`${okNum(tests.ca.left)} ${tests.ca.ok ? ">" : tests.ca.equal ? "=" : "≯"} ${okNum(tests.ca.right)} ${tests.ca.ok ? "✓" : "✗"}`} color={tests.ca.ok ? "#059669" : "#dc2626"} />
                <p className={tests.valid ? "tri-ok" : tests.degenerate ? "tri-warn" : "tri-warn"}>
                  {tests.valid ? "VALID TRIANGLE" : tests.degenerate ? "Degenerate triangle — points lie on a straight line." : "CANNOT FORM A TRIANGLE"}
                </p>
              </>
            ) : (
              <>
                <MeasureRow label="Longest side" value={`${rank.longest.name} opposite ∠${rank.longest.angle}`} />
                <MeasureRow label="Largest angle" value={`∠${rank.longest.angle} = ${okNum(rank.longest.angle === "A" ? m.angles.A : rank.longest.angle === "B" ? m.angles.B : m.angles.C, 1)}°`} color="#dc2626" />
                <MeasureRow label="Shortest side" value={`${rank.shortest.name} opposite ∠${rank.shortest.angle}`} color="#0f766e" />
                <MeasureRow label="Smallest angle" value={`∠${rank.shortest.angle}`} color="#0f766e" />
                {mode === "exterior" ? <MeasureRow label="Exterior at C" value={`${okNum(180 - m.angles.C, 1)}° > remote ∠A, ∠B`} color="#ef4444" /> : null}
              </>
            )
          }
          property={
            <p className="tri-note">
              {mode === "inequality" && "Three segments close if and only if each pair sums to more than the third."}
              {mode === "sides" && "The larger side lies opposite the larger angle. Rankings stay consistent as you drag."}
              {mode === "exterior" && "An exterior angle is greater than each remote interior angle (and equals their sum)."}
            </p>
          }
          formula={
            <FormulaCard
              title={mode === "inequality" ? "Triangle inequality" : mode === "sides" ? "Side–angle" : "Exterior angle"}
              formula={mode === "inequality" ? "a + b > c" : mode === "sides" ? "BC > AC  ⇒  ∠A > ∠B" : "∠ext > ∠remote"}
              why={mode === "inequality" ? "The shortest path between two points is the straight segment; a detour through the third vertex is longer." : "Opening an angle stretches the opposite side."}
              tryThis={mode === "inequality" ? "Set 3, 4, 7 to see the degenerate line, then 3, 4, 8 to see the gap." : "Drag C until BC is longest and confirm ∠A is largest."}
            />
          }
          challenge={
            <ChallengeCard
              prompt="Create side lengths where the triangle just becomes degenerate."
              hint="Make a + b equal c, for example 3, 4, 7."
              check={() => tests.degenerate}
              onReset={reset}
            />
          }
        />
      }
    />
  );
}
