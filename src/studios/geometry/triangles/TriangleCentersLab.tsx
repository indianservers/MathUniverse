import GeometryLessonCanvas from "./TriangleReferenceCanvas";
import { triangleLessonScene } from "../geometryLessonScene";
import { useStudioState } from "../../phase1/StudioModelProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChipRow, Panel } from "../../mockup/studioLabKit";
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
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum, useTriangleReset } from "./triangleLabKit";
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
const INITIAL_TRIANGLE = { A: { x: 5.5, y: 9.5 }, B: { x: 1.6, y: 2 }, C: { x: 9.4, y: 2 } };

export default function TriangleCentersLab({ pulse = "observe" }: { pulse?: string }) {
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [tri, setTri] = useStudioState("TriangleCentersLab:TriangleCentersLab:tri", INITIAL_TRIANGLE);
  const [mode, setMode] = useState<CenterMode>("all");
  const [advanced, setAdvanced] = useStudioState("TriangleCentersLab:TriangleCentersLab:advanced", false);
  const [grid, setGrid] = useStudioState("TriangleCentersLab:TriangleCentersLab:grid", true);
  const [showCircle, setShowCircle] = useState(true);
  const [showIncircle, setShowIncircle] = useState(true);

  const [digits, setDigits] = useState(2);
  const display = (value: number) => okNum(value, digits);
  const randomTriangle = () => {
    let next; do { next = { A: { x: 3 + Math.random() * 5, y: 6 + Math.random() * 3 }, B: { x: 1 + Math.random() * 3, y: 1 + Math.random() * 2 }, C: { x: 8 + Math.random() * 3, y: 1 + Math.random() * 2 } }; } while (triangleArea(next.A, next.B, next.C) < 3);
    setTri(next);
  };

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
  const fitBounds = [
    ...(show("circumcenter") && oSvg ? [oSvg, ...(showCircle ? [{ x: oSvg.x - R * plane.unit, y: oSvg.y - R * plane.unit }, { x: oSvg.x + R * plane.unit, y: oSvg.y + R * plane.unit }] : [])] : []),
    ...(show("orthocenter") && geo.H ? [toSvg(plane, geo.H), toSvg(plane, geo.Fa), toSvg(plane, geo.Fb), toSvg(plane, geo.Fc)] : []),
  ];
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

  const reset = () => { setTri(INITIAL_TRIANGLE); setMode("all"); setAdvanced(false); setGrid(true); setShowCircle(true); setShowIncircle(true); };

  useEffect(() => {
    if (pulse === "observe") setMode("all");
    if (pulse === "understand") setMode("circumcenter");
    if (pulse === "why") { setMode("all"); setAdvanced(true); }
    if (pulse === "try" || pulse === "challenge") {
      setMode("circumcenter");
      setTri(EXPLORER_PRESETS.obtuse ?? EXPLORER_PRESETS.acute);
    }
  }, [pulse]);

  useTriangleReset("centers", reset);

  return (
    <LabFrame
      theme="centers"
      ariaLabel="Triangle centers laboratory"
      controls={
        <Panel title="Construction layers">
          <div className="msk-field"><span>Construction</span>
            <ChipRow value={mode} onChange={(id) => setMode(id as CenterMode)} options={[
              { id: "centroid", label: "Centroid" },
              { id: "circumcenter", label: "Circumcenter" },
              { id: "incenter", label: "Incenter" },
              { id: "orthocenter", label: "Orthocenter" },
              { id: "all", label: "All / Euler" },
            ]} />
          </div>
          <div className="msk-field"><span>Presets</span>
            <ChipRow value="" onChange={(id) => setTri(EXPLORER_PRESETS[id])} options={["acute", "right", "obtuse", "equilateral"].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1) }))} />
          </div>
          <div className="tri-center-reset"><button type="button" onClick={reset}>↻ Reset</button><button type="button" onClick={randomTriangle}>⤨ Random triangle</button></div>
          <details className="tri-more"><summary>Display options</summary>
          <Toggle checked={showCircle} onChange={setShowCircle}>Circumcircle</Toggle>
          <Toggle checked={showIncircle} onChange={setShowIncircle}>Incircle</Toggle>
          <Toggle checked={grid} onChange={setGrid}>Grid</Toggle>
          <Toggle checked={advanced} onChange={setAdvanced}>Show advanced construction</Toggle></details>
        </Panel>
      }
      canvas={
        <GeometryLessonCanvas fitBounds={fitBounds} activityId={`centers-${mode}`} legend={mode === "centroid" ? [["Triangle (ABC)","#147df2"],["Medians (AG, BG, CG)","#10b981"],["Midpoints (D, E, F)","#ff9500"],["Centroid (G)","#10b981"]] : mode === "circumcenter" ? [["Triangle (ABC)","#147df2"],["Circumcircle","#147df2"],["Perpendicular bisectors","#64748b"],["Circumcenter (O)","#147df2"]] : mode === "incenter" ? [["Triangle (ABC)","#147df2"],["Angle bisectors","#ff9500"],["Incircle (I)","#ff9500"],["Tangency points","#ff9500"]] : mode === "orthocenter" ? [["Triangle (ABC)","#147df2"],["Altitudes","#8b45f4"],["Orthocenter (H)","#8b45f4"],["Right angle markers","#64748b"]] : undefined} onPointChange={(id, point) => { if (id === "A" || id === "B" || id === "C") setTri(current => ({ ...current, [id]: fromSvg(plane, point.x, point.y) })); }} scene={triangleLessonScene(plane, [tri], p => toSvg(plane, p))} ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label={`Triangle centers construction. Circumcenter O is ${circLoc}.`}>
          {grid ? <GridLayer plane={plane} /> : null}

          <polygon points={polyPoints(plane, [geo.A, geo.B, geo.C])} fill="rgba(20,125,242,.08)" stroke="#147df2" strokeWidth="2.1" />
          {show("centroid") ? (
            <>
              <SolidLine plane={plane} a={geo.A} b={geo.Ma} color="#10b981" />
              <SolidLine plane={plane} a={geo.B} b={geo.Mb} color="#10b981" />
              <SolidLine plane={plane} a={geo.C} b={geo.Mc} color="#10b981" />
              <CenterDot plane={plane} p={geo.G} label="G" color="#10b981" />
              <CenterDot plane={plane} p={geo.Ma} label="D" color="#ff9500" /><CenterDot plane={plane} p={geo.Mb} label="E" color="#ff9500" /><CenterDot plane={plane} p={geo.Mc} label="F" color="#ff9500" />
            </>
          ) : null}
          {show("circumcenter") && geo.O ? (
            <>
              {(advanced || mode === "circumcenter") && <><DashedLine plane={plane} a={pAB.a} b={pAB.b} color="#64748b" />
              <DashedLine plane={plane} a={pBC.a} b={pBC.b} color="#64748b" />
              <DashedLine plane={plane} a={pCA.a} b={pCA.b} color="#64748b" /></>}
              {showCircle && oSvg ? <circle cx={oSvg.x} cy={oSvg.y} r={R * plane.unit} fill="none" stroke="#147df2" strokeWidth="1.3" /> : null}
              <CenterDot plane={plane} p={geo.O} label="O" color="#147df2" />
            </>
          ) : null}
          {show("incenter") ? (
            <>
              {(advanced || mode === "incenter") && <>{bisA ? <SolidLine plane={plane} a={geo.A} b={bisA} color="#d97706" width={1.3} /> : null}
              {bisB ? <SolidLine plane={plane} a={geo.B} b={bisB} color="#d97706" width={1.3} /> : null}
              {bisC ? <SolidLine plane={plane} a={geo.C} b={bisC} color="#d97706" width={1.3} /> : null}
              <DashedLine plane={plane} a={geo.I} b={footIbc} color="#d97706" />
              <DashedLine plane={plane} a={geo.I} b={footIca} color="#d97706" />
              <DashedLine plane={plane} a={geo.I} b={footIab} color="#d97706" /></>}
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
              <DashedLine plane={plane} a={geo.O} b={geo.H} color="#ff32cc" />
              {advanced && N ? <CenterDot plane={plane} p={N} label="N" color="#64748b" /> : null}
            </>
          ) : null}
          <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={geo.A} label="A" /></g>
          <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={geo.B} label="B" /></g>
          <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={geo.C} label="C" /></g>
        </GeometryLessonCanvas>
      }
      insights={
        <InsightStack
          compact
          measurements={
            <>
              <label className="tri-center-units">Display<select aria-label="Measurement precision" value={digits} onChange={e => setDigits(Number(e.target.value))}><option value={2}>Decimal</option><option value={4}>4 decimal places</option></select></label>
              <MeasureRow label="Centroid G" value={`(${display(geo.G.x)}, ${display(geo.G.y)})`} color="#10b981" />
              {geo.O ? <MeasureRow label="Circumcenter O" value={`(${display(geo.O.x)}, ${display(geo.O.y)}) · ${circLoc}`} /> : null}
              <MeasureRow label="Incenter I" value={`(${display(geo.I.x)}, ${display(geo.I.y)})`} color="#d97706" />
              {geo.H ? <MeasureRow label="Orthocenter H" value={`(${display(geo.H.x)}, ${display(geo.H.y)}) · ${orthLoc}`} color="#8b45f4" /> : null}
              {mode === "centroid" && <><MeasureRow label="BG : GE" value="2 : 1" color="#10b981" /><MeasureRow label="CG : GF" value="2 : 1" color="#10b981" /></>}
              {mode === "incenter" && <><MeasureRow label="dist(I, AC)" value={display(perpDistance(geo.I,geo.A,geo.C))} color="#ff9500" /><MeasureRow label="dist(I, AB)" value={display(perpDistance(geo.I,geo.A,geo.B))} color="#ff9500" /></>}
              {mode === "circumcenter" && <><MeasureRow label="Circumradius R" value={display(R)} /><MeasureRow label="Triangle perimeter" value={display(geo.m.perimeter)} /><MeasureRow label="Triangle area" value={display(geo.m.area)} /></>}
              {mode !== "incenter" && mode !== "circumcenter" && <MeasureRow label="AG : GM" value={display(dist(geo.A, geo.G) / dist(geo.G, geo.Ma)) + " : 1"} color="#10b981" />}
              {geo.O && mode !== "incenter" ? <MeasureRow label="OA = OB = OC" value={display(R)} /> : null}
              {mode !== "circumcenter" && <MeasureRow label="Inradius r" value={display(geo.r)} color="#d97706" />}
              {mode !== "circumcenter" && <MeasureRow label="dist(I, BC)" value={display(perpDistance(geo.I, geo.B, geo.C))} color="#d97706" />}
              {mode !== "all" && <p className={`tri-center-explanation tri-center-explanation--${mode}`}><b>{mode === "centroid" ? "Centroid" : mode === "circumcenter" ? "Circumcenter" : mode === "incenter" ? "Incenter" : "Orthocenter"}</b><br/>{mode === "centroid" ? "G is the intersection of the medians. Each median is divided in a 2 : 1 ratio." : mode === "circumcenter" ? "O is equidistant from all three vertices and is the center of the circumcircle." : mode === "incenter" ? "I is the center of the incircle and is equidistant from all three sides." : "H is where the three altitudes concur."}</p>}
              {mode === "all" ? <p className="tri-center-euler">✓ <b>Euler line</b><br/>{og < 1e-8 && gh < 1e-8 ? "O, G and H coincide; there is no unique Euler line." : "O, G, H are collinear. OG : GH = 1 : 2."}</p> : null}
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
