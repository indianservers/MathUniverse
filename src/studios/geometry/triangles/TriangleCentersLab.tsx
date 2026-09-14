import { useEffect, useMemo, useRef, useState } from "react";
import { ChipRow, Field, Panel } from "../../mockup/studioLabKit";
import {
  EXPLORER_PRESETS,
  altitudeFoot,
  angleBisectorDir,
  centroid,
  circumcenter,
  circumcenterLocation,
  clampPoint,
  defaultPlane,
  dist,
  fromSvg,
  incenter,
  inradius,
  lineIntersection,
  measureTriangle,
  midpoint,
  orthocenter,
  orthocenterLocation,
  perpDistance,
  perpendicularBisector,
  toSvg,
  triangleArea,
  add,
  scale,
  unit,
} from "./triangleGeometry";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  CenterDot,
  DashedLine,
  DraggableVertex,
  GridLayer,
  RightAngleMarker,
  SolidLine,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type CenterMode = "centroid" | "circumcenter" | "incenter" | "orthocenter" | "all";

export default function TriangleCentersLab({ pulse = "observe" }: { pulse?: string }) {
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [tri, setTri] = useState(EXPLORER_PRESETS.acute);
  const [mode, setMode] = useState<CenterMode>("centroid");
  const [advanced, setAdvanced] = useState(false);
  const [grid, setGrid] = useState(false);
  const [showCircle, setShowCircle] = useState(true);
  const [showIncircle, setShowIncircle] = useState(true);

  const geo = useMemo(() => {
    const { A, B, C } = tri;
    const G = centroid(A, B, C);
    const O = circumcenter(A, B, C);
    const I = incenter(A, B, C);
    const H = orthocenter(A, B, C);
    const Ma = midpoint(B, C);
    const Mb = midpoint(A, C);
    const Mc = midpoint(A, B);
    const Fa = altitudeFoot(A, B, C);
    const Fb = altitudeFoot(B, A, C);
    const Fc = altitudeFoot(C, A, B);
    const r = inradius(A, B, C);
    return { A, B, C, G, O, I, H, Ma, Mb, Mc, Fa, Fb, Fc, r, m: measureTriangle(A, B, C) };
  }, [tri]);

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
        return triangleArea(draft.A, draft.B, draft.C) < 0.4 ? prev : draft;
      });
    }, () => { drag.current = null; });
  };

  const show = (id: CenterMode) => mode === "all" || mode === id;
  const N = geo.O && geo.H ? { x: (geo.O.x + geo.H.x) / 2, y: (geo.O.y + geo.H.y) / 2 } : null;
  const og = geo.O ? dist(geo.O, geo.G) : 0;
  const gh = geo.H ? dist(geo.G, geo.H) : 0;
  const circLoc = circumcenterLocation(geo.A, geo.B, geo.C);
  const orthLoc = orthocenterLocation(geo.A, geo.B, geo.C);
  const oSvg = geo.O ? toSvg(plane, geo.O) : null;
  const iSvg = toSvg(plane, geo.I);
  const R = geo.O ? dist(geo.O, geo.A) : 0;
  const bisA = lineIntersection(geo.A, angleBisectorDir(geo.A, geo.B, geo.C), geo.B, { x: geo.C.x - geo.B.x, y: geo.C.y - geo.B.y });
  const bisB = lineIntersection(geo.B, angleBisectorDir(geo.B, geo.A, geo.C), geo.C, { x: geo.A.x - geo.C.x, y: geo.A.y - geo.C.y });
  const bisC = lineIntersection(geo.C, angleBisectorDir(geo.C, geo.A, geo.B), geo.A, { x: geo.B.x - geo.A.x, y: geo.B.y - geo.A.y });
  const pbAB = perpendicularBisector(geo.A, geo.B);
  const pbBC = perpendicularBisector(geo.B, geo.C);
  const pbCA = perpendicularBisector(geo.C, geo.A);
  const ray = (pb: { point: { x: number; y: number }; dir: { x: number; y: number } }) => {
    const u = unit(pb.dir);
    return { a: add(pb.point, scale(u, -8)), b: add(pb.point, scale(u, 8)) };
  };
  const pAB = ray(pbAB);
  const pBC = ray(pbBC);
  const pCA = ray(pbCA);
  const footIbc = altitudeFoot(geo.I, geo.B, geo.C);
  const footIca = altitudeFoot(geo.I, geo.C, geo.A);
  const footIab = altitudeFoot(geo.I, geo.A, geo.B);

  const reset = () => { setTri(EXPLORER_PRESETS.acute); setMode("centroid"); setAdvanced(false); };

  useEffect(() => {
    if (pulse === "observe") setMode("centroid");
    if (pulse === "understand") setMode("circumcenter");
    if (pulse === "why") { setMode("all"); setAdvanced(true); }
    if (pulse === "try" || pulse === "challenge") {
      setMode("circumcenter");
      setTri(EXPLORER_PRESETS.obtuse ?? EXPLORER_PRESETS.acute);
    }
  }, [pulse]);

  return (
    <LabFrame
      theme="centers"
      ariaLabel="Triangle centers laboratory"
      controls={
        <Panel title="Centers">
          <Field label="Construction">
            <ChipRow value={mode} onChange={(id) => setMode(id as CenterMode)} options={[
              { id: "centroid", label: "Centroid" },
              { id: "circumcenter", label: "Circumcenter" },
              { id: "incenter", label: "Incenter" },
              { id: "orthocenter", label: "Orthocenter" },
              { id: "all", label: "All / Euler" },
            ]} />
          </Field>
          <Field label="Presets">
            <ChipRow value="" onChange={(id) => setTri(EXPLORER_PRESETS[id])} options={["acute", "right", "obtuse", "equilateral"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1) }))} />
          </Field>
          <Toggle checked={showCircle} onChange={setShowCircle}>Circumcircle</Toggle>
          <Toggle checked={showIncircle} onChange={setShowIncircle}>Incircle</Toggle>
          <Toggle checked={grid} onChange={setGrid}>Grid</Toggle>
          <Toggle checked={advanced} onChange={setAdvanced}>Show advanced construction</Toggle>
        </Panel>
      }
      canvas={
        <svg ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label="Triangle centers construction">
          {grid ? <GridLayer plane={plane} /> : null}
          <polygon points={polyPoints(plane, [geo.A, geo.B, geo.C])} fill="rgba(20,125,242,.08)" stroke="#147df2" strokeWidth="2.1" />
          {show("centroid") ? (
            <>
              <SolidLine plane={plane} a={geo.A} b={geo.Ma} color="#10b981" />
              <SolidLine plane={plane} a={geo.B} b={geo.Mb} color="#10b981" />
              <SolidLine plane={plane} a={geo.C} b={geo.Mc} color="#10b981" />
              <CenterDot plane={plane} p={geo.G} label="G" color="#10b981" />
            </>
          ) : null}
          {show("circumcenter") && geo.O ? (
            <>
              <DashedLine plane={plane} a={pAB.a} b={pAB.b} color="#64748b" />
              <DashedLine plane={plane} a={pBC.a} b={pBC.b} color="#64748b" />
              <DashedLine plane={plane} a={pCA.a} b={pCA.b} color="#64748b" />
              {showCircle && oSvg ? <circle cx={oSvg.x} cy={oSvg.y} r={R * plane.unit} fill="none" stroke="#147df2" strokeWidth="1.3" /> : null}
              <CenterDot plane={plane} p={geo.O} label="O" color="#147df2" />
            </>
          ) : null}
          {show("incenter") ? (
            <>
              {bisA ? <SolidLine plane={plane} a={geo.A} b={bisA} color="#d97706" width={1.3} /> : null}
              {bisB ? <SolidLine plane={plane} a={geo.B} b={bisB} color="#d97706" width={1.3} /> : null}
              {bisC ? <SolidLine plane={plane} a={geo.C} b={bisC} color="#d97706" width={1.3} /> : null}
              <DashedLine plane={plane} a={geo.I} b={footIbc} color="#d97706" />
              <DashedLine plane={plane} a={geo.I} b={footIca} color="#d97706" />
              <DashedLine plane={plane} a={geo.I} b={footIab} color="#d97706" />
              {showIncircle ? <circle cx={iSvg.x} cy={iSvg.y} r={geo.r * plane.unit} fill="rgba(245,158,11,.08)" stroke="#d97706" strokeWidth="1.4" /> : null}
              <CenterDot plane={plane} p={footIbc} label="" color="#d97706" />
              <CenterDot plane={plane} p={footIca} label="" color="#d97706" />
              <CenterDot plane={plane} p={footIab} label="" color="#d97706" />
              <CenterDot plane={plane} p={geo.I} label="I" color="#d97706" />
            </>
          ) : null}
          {show("orthocenter") ? (
            <>
              <DashedLine plane={plane} a={geo.A} b={geo.Fa} />
              <DashedLine plane={plane} a={geo.B} b={geo.Fb} />
              <DashedLine plane={plane} a={geo.C} b={geo.Fc} />
              <RightAngleMarker plane={plane} vertex={geo.Fa} p={geo.A} q={geo.B} />
              <RightAngleMarker plane={plane} vertex={geo.Fb} p={geo.B} q={geo.A} />
              <RightAngleMarker plane={plane} vertex={geo.Fc} p={geo.C} q={geo.A} />
              {geo.H ? <CenterDot plane={plane} p={geo.H} label="H" color="#8b45f4" /> : null}
            </>
          ) : null}
          {mode === "all" && geo.O && geo.H ? (
            <>
              <DashedLine plane={plane} a={geo.O} b={geo.H} color="#334155" />
              {advanced && N ? <CenterDot plane={plane} p={N} label="N" color="#64748b" /> : null}
            </>
          ) : null}
          <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={geo.A} label="A" /></g>
          <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={geo.B} label="B" /></g>
          <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={geo.C} label="C" /></g>
        </svg>
      }
      insights={
        <InsightStack
          measurements={
            <>
              <MeasureRow label="Centroid G" value={`(${okNum(geo.G.x)}, ${okNum(geo.G.y)})`} color="#10b981" />
              {geo.O ? <MeasureRow label="Circumcenter O" value={`(${okNum(geo.O.x)}, ${okNum(geo.O.y)}) · ${circLoc}`} /> : null}
              <MeasureRow label="Incenter I" value={`(${okNum(geo.I.x)}, ${okNum(geo.I.y)})`} color="#d97706" />
              {geo.H ? <MeasureRow label="Orthocenter H" value={`(${okNum(geo.H.x)}, ${okNum(geo.H.y)}) · ${orthLoc}`} color="#8b45f4" /> : null}
              <MeasureRow label="AG : GM" value={okNum(dist(geo.A, geo.G) / dist(geo.G, geo.Ma), 2) + " : 1"} color="#10b981" />
              {geo.O ? <MeasureRow label="OA = OB = OC" value={okNum(R)} /> : null}
              <MeasureRow label="Inradius r" value={okNum(geo.r)} color="#d97706" />
              <MeasureRow label="dist(I, BC)" value={okNum(perpDistance(geo.I, geo.B, geo.C))} color="#d97706" />
              {mode === "all" ? <MeasureRow label="OG : GH" value={`${okNum(og)} : ${okNum(gh)}`} /> : null}
            </>
          }
          property={
            <p className="tri-note">
              {mode === "centroid" && "Medians meet at G and each is divided 2:1 (vertex to midpoint)."}
              {mode === "circumcenter" && `O is ${circLoc}. Acute → inside, right → hypotenuse midpoint, obtuse → outside.`}
              {mode === "incenter" && "Angle bisectors meet at I. Perpendicular distances to the sides equal the inradius."}
              {mode === "orthocenter" && `H is ${orthLoc}. Right triangles put H at the right-angle vertex.`}
              {mode === "all" && "Euler line: H, G, O are collinear with OG : GH = 1 : 2 (non-equilateral)."}
            </p>
          }
          formula={
            <FormulaCard
              title={mode === "centroid" ? "Centroid" : mode === "all" ? "Euler line" : mode}
              formula={mode === "centroid" ? "AG : GM = 2 : 1" : mode === "all" ? "OG : GH = 1 : 2" : mode === "incenter" ? "r = Area / s" : mode === "circumcenter" ? "OA = OB = OC = R" : "Altitudes concur at H"}
              why="Each center is the unique concurrence of a family of lines (medians, perp. bisectors, angle bisectors, or altitudes)."
              tryThis={mode === "circumcenter" ? "Drag to an obtuse triangle and watch O leave the triangle." : "Drag a vertex and keep the concurrence."}
            />
          }
          challenge={
            <ChallengeCard
              prompt="Move the triangle until the circumcenter lies outside."
              hint="Make one angle obtuse — O jumps outside, opposite the obtuse vertex."
              check={() => circLoc === "outside"}
              onReset={reset}
            />
          }
        />
      }
    />
  );
}
