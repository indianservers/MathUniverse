import { useMemo, useRef, useState } from "react";
import { ChipRow, Field, Panel, Segmented, SliderRow } from "../../mockup/studioLabKit";
import {
  clampPoint,
  defaultPlane,
  fromSvg,
  measureTriangle,
  rotateTriangle,
  scaleTriangle,
  sideRatios,
  translateTriangle,
  triangleArea,
} from "./triangleGeometry";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  AngleArc,
  DraggableVertex,
  SideMeasurement,
  SideTickMark,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type Crit = "AA" | "SAS" | "SSS";

export default function SimilarityLab() {
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [base, setBase] = useState({ A: { x: 3.4, y: 5.4 }, B: { x: 1.5, y: 1.5 }, C: { x: 6.6, y: 1.7 } });
  const [k, setK] = useState(1.5);
  const [rot, setRot] = useState(12);
  const [shiftX, setShiftX] = useState(8.4);
  const [shiftY, setShiftY] = useState(0.15);
  const [crit, setCrit] = useState<Crit>("AA");
  const [showRatios, setShowRatios] = useState(true);

  const def = useMemo(() => {
    const scaled = scaleTriangle(base, k, base.B);
    const rotated = rotateTriangle(scaled, scaled.B, rot);
    return translateTriangle(rotated, { x: shiftX - scaled.B.x + base.B.x, y: shiftY });
  }, [base, k, rot, shiftX, shiftY]);

  const m1 = measureTriangle(base.A, base.B, base.C);
  const m2 = measureTriangle(def.A, def.B, def.C);
  const ratios = sideRatios(base, def);
  const kind = k === 1 ? "Congruent" : k > 1 ? "Enlargement" : "Reduction";

  const startDrag = (who: "A" | "B" | "C") => (event: React.PointerEvent) => {
    event.preventDefault();
    drag.current = who;
    bindSvgDrag(svgRef, (ev) => {
      const svg = svgRef.current;
      if (!svg || !drag.current) return;
      const s = pointerToSvg(svg, ev);
      const next = clampPoint(fromSvg(plane, s.x, s.y), 0.5, 9.4, 0.4, 11);
      setBase((prev) => {
        const draft = { ...prev, [drag.current!]: next };
        return triangleArea(draft.A, draft.B, draft.C) < 0.4 ? prev : draft;
      });
    }, () => { drag.current = null; });
  };

  const reset = () => {
    setBase({ A: { x: 3.4, y: 5.4 }, B: { x: 1.5, y: 1.5 }, C: { x: 6.6, y: 1.7 } }); setK(1.5); setRot(12); setShiftX(8.4); setShiftY(0.15); setCrit("AA");
  };

  return (
    <LabFrame
      ariaLabel="Similarity laboratory"
      controls={
        <Panel title="Similarity controls">
          <Field label="Criterion">
            <Segmented value={crit} onChange={(id) => setCrit(id as Crit)} options={[
              { id: "AA", label: "AA" }, { id: "SAS", label: "SAS ~" }, { id: "SSS", label: "SSS ~" },
            ]} />
          </Field>
          <SliderRow label="Scale factor k" value={k} min={0.25} max={3} step={0.05} onChange={setK} />
          <Field label="Presets">
            <ChipRow value={String(k)} onChange={(id) => setK(Number(id))} options={[
              { id: "0.5", label: "Half" }, { id: "1", label: "Same size" }, { id: "1.5", label: "1.5×" }, { id: "2", label: "Double" },
            ]} />
          </Field>
          <SliderRow label="Rotation" value={rot} min={-60} max={60} step={1} onChange={setRot} unit="°" />
          <SliderRow label="Translate x" value={shiftX} min={6} max={12} step={0.1} onChange={setShiftX} />
          <Toggle checked={showRatios} onChange={setShowRatios}>Show ratios</Toggle>
          <p className="tri-note">{kind}: k = {okNum(k, 2)}. Perimeter ratio = k. Area ratio = k² = {okNum(k * k, 2)}.</p>
        </Panel>
      }
      canvas={
        <svg ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label="Similar triangles ABC and DEF">
          <rect width={plane.width} height={plane.height} fill="#f8fbff" />
          <polygon points={polyPoints(plane, [base.A, base.B, base.C])} fill="rgba(20,125,242,.10)" stroke="#147df2" strokeWidth="2.1" />
          <polygon points={polyPoints(plane, [def.A, def.B, def.C])} fill="rgba(139,69,244,.10)" stroke="#8b45f4" strokeWidth="2.1" />
          <SideTickMark plane={plane} a={base.A} b={base.B} count={1} />
          <SideTickMark plane={plane} a={def.A} b={def.B} count={1} color="#8b45f4" />
          <SideTickMark plane={plane} a={base.B} b={base.C} count={2} />
          <SideTickMark plane={plane} a={def.B} b={def.C} count={2} color="#8b45f4" />
          <AngleArc plane={plane} vertex={base.A} p={base.B} q={base.C} color="#08b9dd" />
          <AngleArc plane={plane} vertex={def.A} p={def.B} q={def.C} color="#c084fc" />
          {showRatios ? (
            <>
              <SideMeasurement plane={plane} a={base.A} b={base.B} text={`AB=${okNum(m1.sides.AB)}`} color="#147df2" />
              <SideMeasurement plane={plane} a={def.A} b={def.B} text={`DE=${okNum(m2.sides.AB)}`} color="#8b45f4" />
            </>
          ) : null}
          <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={base.A} label="A" /></g>
          <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={base.B} label="B" /></g>
          <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={base.C} label="C" /></g>
          <DraggableVertex plane={plane} p={def.A} label="D" color="#8b45f4" />
          <DraggableVertex plane={plane} p={def.B} label="E" color="#8b45f4" />
          <DraggableVertex plane={plane} p={def.C} label="F" color="#8b45f4" />
        </svg>
      }
      insights={
        <InsightStack
          measurements={
            <>
              <MeasureRow label="k = DE/AB" value={okNum(ratios.DE_AB, 3)} />
              <MeasureRow label="EF/BC" value={okNum(ratios.EF_BC, 3)} color="#8b45f4" />
              <MeasureRow label="DF/AC" value={okNum(ratios.DF_AC, 3)} color="#0f766e" />
              <MeasureRow label="Perimeter ratio" value={okNum(m2.perimeter / m1.perimeter, 3)} />
              <MeasureRow label="Area ratio" value={okNum(m2.area / m1.area, 3)} color="#f59e0b" />
              <MeasureRow label="∠A = ∠D" value={`${okNum(m1.angles.A, 1)}° = ${okNum(m2.angles.A, 1)}°`} />
              <MeasureRow label="∠B = ∠E" value={`${okNum(m1.angles.B, 1)}° = ${okNum(m2.angles.B, 1)}°`} color="#8b45f4" />
              <MeasureRow label="∠C = ∠F" value={`${okNum(m1.angles.C, 1)}° = ${okNum(m2.angles.C, 1)}°`} color="#f59e0b" />
              <p className="tri-ok">△ABC ~ △DEF by {crit === "AA" ? "AA" : crit === "SAS" ? "SAS similarity" : "SSS similarity"}.</p>
            </>
          }
          property={<p className="tri-note">Corresponding angles stay equal. All three side ratios converge to the same k. Area scales by k².</p>}
          formula={
            <FormulaCard
              title="Similarity"
              formula="Area ratio = k²"
              why="Each linear size is multiplied by k, so the parallelogram (or ½bh) area is multiplied by k·k."
              tryThis="Set k = 1.5 and confirm DE/AB = EF/BC = DF/AC."
            />
          }
          challenge={
            <ChallengeCard
              prompt="Make △DEF exactly 1.5× △ABC."
              hint="Use the 1.5× preset, then drag ABC if you want a new base triangle."
              check={() => Math.abs(k - 1.5) < 0.03 && Math.abs(ratios.DE_AB - 1.5) < 0.05}
              onReset={reset}
            />
          }
        />
      }
    />
  );
}
