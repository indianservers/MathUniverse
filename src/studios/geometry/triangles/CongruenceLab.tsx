import { useMemo, useRef, useState } from "react";
import { ChipRow, Field, Panel, SliderRow, StatusOk } from "../../mockup/studioLabKit";
import {
  almostEqual,
  clampPoint,
  constructAAS,
  constructASAc,
  constructRHS,
  constructSAS,
  constructSSS,
  defaultPlane,
  fromSvg,
  measureTriangle,
  ssaSolutions,
  triangleAngles,
  triangleArea,
  type Pt,
} from "./triangleGeometry";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  AngleArc,
  DraggableVertex,
  RightAngleMarker,
  SideMeasurement,
  SideTickMark,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type Test = "SSS" | "SAS" | "ASA" | "AAS" | "RHS" | "SSA";

function swapMap(swap: boolean) {
  return swap
    ? { A: "D", B: "F", C: "E", AB: "DF", BC: "FE", CA: "ED" }
    : { A: "D", B: "E", C: "F", AB: "DE", BC: "EF", CA: "FD" };
}

export default function CongruenceLab() {
  const plane = defaultPlane(720, 460);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const [test, setTest] = useState<Test>("SSS");
  const [swap, setSwap] = useState(false);
  const [ab, setAb] = useState(5.2);
  const [bc, setBc] = useState(6.4);
  const [ca, setCa] = useState(4.8);
  const [angA, setAngA] = useState(52);
  const [angB, setAngB] = useState(58);
  const [hyp, setHyp] = useState(6.5);
  const [leg, setLeg] = useState(3.9);
  const [rot, setRot] = useState(8);
  const [ssaA, setSsaA] = useState(40);
  const [ssaAopp, setSsaAopp] = useState(3.1);
  const [ssaB, setSsaB] = useState(4.4);
  const [labels, setLabels] = useState(true);
  const [free, setFree] = useState({ A: { x: 2.4, y: 6.6 }, B: { x: 1.5, y: 1.5 }, C: { x: 7.2, y: 1.6 } });

  const map = swapMap(swap);
  const leftOrigin = { x: 1.2, y: 1.5 };
  const rightOrigin = { x: 10.3, y: 1.5 };

  const pair = useMemo(() => {
    if (test === "SSS") return { L: constructSSS(bc, ca, ab, leftOrigin), R: constructSSS(bc, ca, ab, rightOrigin, rot) };
    if (test === "SAS") return { L: constructSAS(ab, angA, ca, leftOrigin), R: constructSAS(ab, angA, ca, rightOrigin, rot) };
    if (test === "ASA") return { L: constructASAc(angA, ab, angB, leftOrigin), R: constructASAc(angA, ab, angB, rightOrigin, rot) };
    if (test === "AAS") return { L: constructAAS(angA, angB, bc, leftOrigin), R: constructAAS(angA, angB, bc, rightOrigin, rot) };
    if (test === "RHS") return { L: constructRHS(hyp, leg, leftOrigin), R: constructRHS(hyp, leg, rightOrigin, rot) };
    const sols = ssaSolutions(ssaA, ssaAopp, ssaB, { x: 0, y: 0 });
    const place = (tri: { A: Pt; B: Pt; C: Pt }, origin: Pt) => ({
      A: { x: tri.A.x + origin.x, y: tri.A.y + origin.y },
      B: { x: tri.B.x + origin.x, y: tri.B.y + origin.y },
      C: { x: tri.C.x + origin.x, y: tri.C.y + origin.y },
      ok: true,
    });
    if (sols.length >= 2) return { L: place(sols[0], leftOrigin), R: place(sols[1], { x: 9.6, y: 1.5 }) };
    if (sols.length === 1) return { L: place(sols[0], leftOrigin), R: place(sols[0], rightOrigin) };
    return { L: constructSAS(ssaB, ssaA, 2.2, leftOrigin), R: constructSAS(ssaB, ssaA, 2.2, rightOrigin) };
  }, [ab, angA, angB, bc, ca, hyp, leg, rot, ssaA, ssaAopp, ssaB, test]);

  const L = pair.L;
  const R = pair.R;
  const mL = measureTriangle(L.A, L.B, L.C);
  const mR = measureTriangle(R.A, R.B, R.C);
  const sidesEq = almostEqual(mL.sides.AB, mR.sides.AB) && almostEqual(mL.sides.BC, mR.sides.BC) && almostEqual(mL.sides.CA, mR.sides.CA);
  const anglesEq = almostEqual(mL.angles.A, mR.angles.A, 0.8) && almostEqual(mL.angles.B, mR.angles.B, 0.8) && almostEqual(mL.angles.C, mR.angles.C, 0.8);
  const congruent = test !== "SSA" && sidesEq && anglesEq;

  const startDrag = (who: "A" | "B" | "C") => (event: React.PointerEvent) => {
    event.preventDefault();
    drag.current = who;
    bindSvgDrag(svgRef, (ev) => {
      const svg = svgRef.current;
      if (!svg || !drag.current) return;
      const s = pointerToSvg(svg, ev);
      const next = clampPoint(fromSvg(plane, s.x, s.y), 0.5, 9.2, 0.4, 11);
      setFree((prev) => {
        const draft = { ...prev, [drag.current!]: next };
        if (triangleArea(draft.A, draft.B, draft.C) < 0.4) return prev;
        setAb(Math.hypot(draft.A.x - draft.B.x, draft.A.y - draft.B.y));
        setBc(Math.hypot(draft.B.x - draft.C.x, draft.B.y - draft.C.y));
        setCa(Math.hypot(draft.C.x - draft.A.x, draft.C.y - draft.A.y));
        return draft;
      });
    }, () => { drag.current = null; });
  };

  const proof = () => {
    if (test === "SSS") return [`AB = ${map.AB} = ${okNum(mL.sides.AB)}`, `BC = ${map.BC} = ${okNum(mL.sides.BC)}`, `CA = ${map.CA} = ${okNum(mL.sides.CA)}`, `△ABC ≅ △${map.A}${map.B}${map.C} by SSS.`];
    if (test === "SAS") return [`AB = ${map.AB} = ${okNum(mL.sides.AB)}`, `AC = ${swap ? "DE" : "DF"} = ${okNum(mL.sides.CA)}`, `Included ∠A = ∠${map.A} = ${okNum(mL.angles.A, 1)}°`, `△ABC ≅ △${map.A}${map.B}${map.C} by SAS.`];
    if (test === "ASA") return [`∠B = ∠${map.B} = ${okNum(mL.angles.B, 1)}°`, `Included AB = ${map.AB}`, `∠A = ∠${map.A} = ${okNum(mL.angles.A, 1)}°`, `△ABC ≅ △${map.A}${map.B}${map.C} by ASA.`];
    if (test === "AAS") return [`∠A = ∠${map.A}`, `∠B = ∠${map.B}`, `Non-included BC = ${map.BC}`, `△ABC ≅ △${map.A}${map.B}${map.C} by AAS.`];
    if (test === "RHS") return [`Right angles at C and ${map.C}`, `Hypotenuse AB = ${map.AB} = ${okNum(mL.sides.AB)}`, `Leg BC = ${map.BC} = ${okNum(mL.sides.BC)}`, `△ABC ≅ △${map.A}${map.B}${map.C} by RHS.`];
    return ["Two sides and a non-included angle (SSA) can yield 0, 1, or 2 triangles.", "This is the ambiguous case — not a congruence test."];
  };

  const reset = () => {
    setTest("SSS"); setAb(5.2); setBc(6.4); setCa(4.8); setAngA(52); setAngB(58); setHyp(6.5); setLeg(3.9); setRot(8); setSwap(false);
    setFree({ A: { x: 2.4, y: 6.6 }, B: { x: 1.5, y: 1.5 }, C: { x: 7.2, y: 1.6 } });
  };

  return (
    <LabFrame
      ariaLabel="Congruence laboratory"
      controls={
        <Panel title="Congruence test">
          <Field label="Criterion">
            <ChipRow value={test} onChange={(id) => setTest(id as Test)} options={[
              { id: "SSS", label: "SSS" }, { id: "SAS", label: "SAS" }, { id: "ASA", label: "ASA" },
              { id: "AAS", label: "AAS" }, { id: "RHS", label: "RHS" }, { id: "SSA", label: "SSA (not a test)" },
            ]} />
          </Field>
          {test === "SSS" ? (
            <>
              <SliderRow label="AB = DE" value={ab} min={2} max={8} step={0.1} onChange={setAb} />
              <SliderRow label="BC = EF" value={bc} min={2} max={8} step={0.1} onChange={setBc} />
              <SliderRow label="CA = FD" value={ca} min={2} max={8} step={0.1} onChange={setCa} />
            </>
          ) : null}
          {test === "SAS" ? (
            <>
              <SliderRow label="AB = DE" value={ab} min={2} max={8} step={0.1} onChange={setAb} />
              <SliderRow label="Included ∠A = ∠D" value={angA} min={20} max={120} step={1} onChange={setAngA} unit="°" />
              <SliderRow label="AC = DF" value={ca} min={2} max={8} step={0.1} onChange={setCa} />
            </>
          ) : null}
          {test === "ASA" ? (
            <>
              <SliderRow label="∠B = ∠E" value={angB} min={20} max={80} step={1} onChange={setAngB} unit="°" />
              <SliderRow label="Included AB = DE" value={ab} min={2} max={8} step={0.1} onChange={setAb} />
              <SliderRow label="∠A = ∠D" value={angA} min={20} max={80} step={1} onChange={setAngA} unit="°" />
            </>
          ) : null}
          {test === "AAS" ? (
            <>
              <SliderRow label="∠A = ∠D" value={angA} min={20} max={80} step={1} onChange={setAngA} unit="°" />
              <SliderRow label="∠B = ∠E" value={angB} min={20} max={80} step={1} onChange={setAngB} unit="°" />
              <SliderRow label="Non-included BC = EF" value={bc} min={2} max={8} step={0.1} onChange={setBc} />
            </>
          ) : null}
          {test === "RHS" ? (
            <>
              <SliderRow label="Hypotenuse" value={hyp} min={4} max={9} step={0.1} onChange={setHyp} />
              <SliderRow label="Leg" value={leg} min={1.5} max={Math.max(2, hyp - 0.4)} step={0.1} onChange={setLeg} />
            </>
          ) : null}
          {test === "SSA" ? (
            <>
              <SliderRow label="Non-included ∠A" value={ssaA} min={20} max={70} step={1} onChange={setSsaA} unit="°" />
              <SliderRow label="Opposite side a = BC" value={ssaAopp} min={1.6} max={6} step={0.1} onChange={setSsaAopp} />
              <SliderRow label="Adjacent side b = AC" value={ssaB} min={2} max={7} step={0.1} onChange={setSsaB} />
            </>
          ) : null}
          {test !== "SSA" ? <SliderRow label="Rotate △DEF" value={rot} min={-40} max={40} step={1} onChange={setRot} unit="°" /> : null}
          <Toggle checked={swap} onChange={setSwap}>Swap correspondence</Toggle>
          <Toggle checked={labels} onChange={setLabels}>Show measures</Toggle>
          {test === "SSA"
            ? <p className="tri-warn">SSA is not a congruence criterion. Two different triangles can share those data.</p>
            : <StatusOk>{congruent ? `△ABC ≅ △${map.A}${map.B}${map.C} by ${test}.` : "Adjust the given parts until the triangles match."}</StatusOk>}
        </Panel>
      }
      canvas={
        <svg ref={svgRef} viewBox={`0 0 ${plane.width} ${plane.height}`} role="img" aria-label="Two corresponding triangles">
          <rect width={plane.width} height={plane.height} fill="#f8fbff" />
          <polygon points={polyPoints(plane, [L.A, L.B, L.C])} fill="rgba(20,125,242,.10)" stroke="#147df2" strokeWidth="2.1" />
          <polygon points={polyPoints(plane, [R.A, R.B, R.C])} fill="rgba(139,69,244,.10)" stroke="#8b45f4" strokeWidth="2.1" />
          <SideTickMark plane={plane} a={L.A} b={L.B} count={1} color="#147df2" />
          <SideTickMark plane={plane} a={R.A} b={R.B} count={1} color="#8b45f4" />
          <SideTickMark plane={plane} a={L.B} b={L.C} count={2} color="#147df2" />
          <SideTickMark plane={plane} a={R.B} b={R.C} count={2} color="#8b45f4" />
          <SideTickMark plane={plane} a={L.C} b={L.A} count={3} color="#147df2" />
          <SideTickMark plane={plane} a={R.C} b={R.A} count={3} color="#8b45f4" />
          <AngleArc plane={plane} vertex={L.A} p={L.B} q={L.C} ticks={1} color="#08b9dd" radius={20} />
          <AngleArc plane={plane} vertex={R.A} p={R.B} q={R.C} ticks={1} color="#c084fc" radius={20} />
          <AngleArc plane={plane} vertex={L.B} p={L.A} q={L.C} ticks={2} color="#147df2" radius={16} />
          <AngleArc plane={plane} vertex={R.B} p={R.A} q={R.C} ticks={2} color="#8b45f4" radius={16} />
          {test === "RHS" || Math.abs(triangleAngles(L.A, L.B, L.C).C - 90) < 2 ? (
            <>
              <RightAngleMarker plane={plane} vertex={L.C} p={L.A} q={L.B} />
              <RightAngleMarker plane={plane} vertex={R.C} p={R.A} q={R.B} />
            </>
          ) : null}
          {labels ? (
            <>
              <SideMeasurement plane={plane} a={L.A} b={L.B} text={`AB=${okNum(mL.sides.AB)}`} color="#147df2" />
              <SideMeasurement plane={plane} a={R.A} b={R.B} text={`${map.AB}=${okNum(mR.sides.AB)}`} color="#8b45f4" />
            </>
          ) : null}
          <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={L.A} label="A" /></g>
          <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={L.B} label="B" /></g>
          <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={L.C} label="C" /></g>
          <DraggableVertex plane={plane} p={R.A} label={map.A} color="#8b45f4" />
          <DraggableVertex plane={plane} p={R.B} label={map.B} color="#8b45f4" />
          <DraggableVertex plane={plane} p={R.C} label={map.C} color="#8b45f4" />
        </svg>
      }
      insights={
        <InsightStack
          measurements={
            <>
              <MeasureRow label={`A ↔ ${map.A}`} value={`${okNum(mL.angles.A, 1)}° = ${okNum(mR.angles.A, 1)}°`} />
              <MeasureRow label={`B ↔ ${map.B}`} value={`${okNum(mL.angles.B, 1)}° = ${okNum(mR.angles.B, 1)}°`} color="#8b45f4" />
              <MeasureRow label={`C ↔ ${map.C}`} value={`${okNum(mL.angles.C, 1)}° = ${okNum(mR.angles.C, 1)}°`} color="#0f766e" />
              <MeasureRow label={`AB ↔ ${map.AB}`} value={`${okNum(mL.sides.AB)} = ${okNum(mR.sides.AB)}`} />
              <MeasureRow label={`BC ↔ ${map.BC}`} value={`${okNum(mL.sides.BC)} = ${okNum(mR.sides.BC)}`} color="#8b45f4" />
              <MeasureRow label={`CA ↔ ${map.CA}`} value={`${okNum(mL.sides.CA)} = ${okNum(mR.sides.CA)}`} color="#f59e0b" />
              <p className={test === "SSA" || !congruent ? "tri-warn" : "tri-ok"}>{test === "SSA" ? "SSA does not prove congruence." : congruent ? `Congruent by ${test}.` : "Not yet congruent."}</p>
            </>
          }
          property={<p className="tri-note">Corresponding vertices stay in order. Tick marks and arcs — not color alone — show which parts match.</p>}
          steps={proof()}
          formula={
            <FormulaCard
              title={test === "SSA" ? "Ambiguous case" : `${test} congruence`}
              formula={test === "SSA" ? "SSA ⇏ congruence" : `△ABC ≅ △${map.A}${map.B}${map.C}`}
              why={test === "SSA" ? "The opposite side can swing to a second intersection on the ray, so two non-congruent triangles can share the same SSA data." : "The listed parts determine a unique triangle up to rigid motion, so a matching copy is congruent."}
              tryThis={test === "SSA" ? "Change a until two distinct triangles appear." : "Rotate △DEF and watch the marked parts stay equal."}
            />
          }
          challenge={
            <ChallengeCard
              prompt="Construct a pair congruent by SAS."
              hint="Switch to SAS and keep the included angle between the two given sides."
              check={() => test === "SAS" && congruent}
              onReset={reset}
            />
          }
        />
      }
    />
  );
}
