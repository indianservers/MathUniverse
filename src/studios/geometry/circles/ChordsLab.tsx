import { useEffect, useState } from "react";
import {
  angleOf, chordLengthFromCentral, clamp, constrainOnCircle, dist, fmt, midpoint, minorArcDeg, nearlyEqual, pointOnCircle, toDeg, toRad, type Vec,
} from "./circleMath";
import { useCircleSession, usePersisted } from "./CircleSession";
import {
  ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FilledTriangle, FormulaCard, GhostChord, LiveRow, MathLine, PresetButton, PropertyCard, RadiusLine, Slider, Toggle, WorkedCard, useSvgDrag,
} from "./primitives";

type Live = { r: number; ab: number; cd: number; om: number; on: number; arc: number; showSecond: boolean };

const CHALLENGES = [
  { id: "len8", prompt: "Create chord AB of length 8 units.", check: (m: Live) => nearlyEqual(m.ab, 8, 0.15) },
  { id: "equal", prompt: "Make AB = CD (turn on the second chord).", check: (m: Live) => m.showSecond && nearlyEqual(m.ab, m.cd, 0.12) },
  { id: "equidist", prompt: "Place two chords equidistant from O.", check: (m: Live) => m.showSecond && nearlyEqual(m.om, m.on, 0.12) },
];

export default function ChordsLab() {
  const { r, setR, origin, setOrigin, snapA, teacher, unitLabel, pushUndo, registerUndo, setAnnounce } = useCircleSession();
  const [aDeg, setA] = usePersisted("chords.a", 28);
  const [bDeg, setB] = usePersisted("chords.b", 148);
  const [cDeg, setC] = usePersisted("chords.c", 210);
  const [dDeg, setD] = usePersisted("chords.d", 300);
  const [showM, setShowM] = usePersisted("chords.m", true);
  const [showPerp, setShowPerp] = usePersisted("chords.perp", true);
  const [showSecond, setShowSecond] = usePersisted("chords.second", true);
  const [showMeas, setShowMeas] = usePersisted("chords.meas", true);
  const [lockEqual, setLock] = usePersisted("chords.lock", false);
  const [showLocus, setLocus] = usePersisted("chords.locus", true);
  const [showPy, setPy] = usePersisted("chords.py", true);
  const [showSteps, setSteps] = usePersisted("chords.steps", true);
  const [preset, setPreset] = usePersisted("chords.preset", "compare");
  const [challenge, setChallenge] = usePersisted("chords.ch", 0);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [focused, setFocused] = useState<string | null>("A");

  const snapshot = () => {
    const s = { aDeg, bDeg, cDeg, dDeg, origin, r };
    pushUndo(() => { setA(s.aDeg); setB(s.bDeg); setC(s.cDeg); setD(s.dDeg); setOrigin(s.origin); setR(s.r); });
  };
  useEffect(() => { registerUndo(() => apply("compare")); }, [registerUndo]);

  const A = pointOnCircle(origin, r, toRad(aDeg));
  const B = pointOnCircle(origin, r, toRad(bDeg));
  let C = pointOnCircle(origin, r, toRad(cDeg));
  let D = pointOnCircle(origin, r, toRad(dDeg));
  const M = midpoint(A, B);
  const om = dist(origin, M);
  const ab = dist(A, B);
  if (lockEqual) {
    const nDir = { x: Math.cos(toRad((cDeg + dDeg) / 2)), y: Math.sin(toRad((cDeg + dDeg) / 2)) };
    const Npt = { x: origin.x + nDir.x * om, y: origin.y + nDir.y * om };
    const half = ab / 2;
    C = { x: Npt.x - nDir.y * half, y: Npt.y + nDir.x * half };
    D = { x: Npt.x + nDir.y * half, y: Npt.y - nDir.x * half };
  }
  const N = midpoint(C, D);
  const cd = dist(C, D);
  const on = dist(origin, N);
  const arc = minorArcDeg(aDeg, bDeg);
  const live: Live = { r, ab, cd, om, on, arc, showSecond };
  const ghostHalf = 4;
  const ghostD = Math.sqrt(Math.max(0, r * r - ghostHalf * ghostHalf));
  const gDir = { x: Math.cos(toRad(90)), y: Math.sin(toRad(90)) };
  const gM = { x: origin.x + gDir.x * ghostD, y: origin.y + gDir.y * ghostD };
  const gA = { x: gM.x - gDir.y * ghostHalf, y: gM.y + gDir.x * ghostHalf };
  const gB = { x: gM.x + gDir.y * ghostHalf, y: gM.y - gDir.x * ghostHalf };

  const apply = (id: string) => {
    snapshot();
    setPreset(id);
    if (id === "equal") { setA(40); setB(140); setC(220); setD(320); setShowSecond(true); setLock(true); }
    if (id === "diameter") { setA(0); setB(180); setShowSecond(false); setLock(false); }
    if (id === "short") { setA(70); setB(110); setShowSecond(false); }
    if (id === "compare") { setA(20); setB(160); setC(200); setD(250); setShowSecond(true); setLock(false); }
  };

  const movePoint = (id: string, math: Vec) => {
    if (id === "O") setOrigin(math);
    if (id === "A") setA(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "B") setB(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "C") setC(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "D") setD(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "R") setR(clamp(dist(origin, math), 2.4, 7.2));
    if (id === "M") {
      const d = clamp(dist(origin, math), 0.05, r - 0.2);
      const theta = angleOf(math, origin);
      const half = Math.acos(clamp(d / r, 0, 1));
      setA(snapA(toDeg(theta + half)));
      setB(snapA(toDeg(theta - half)));
    }
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => movePoint(id, math), setFocused);

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Chord controls</h2>
        <Slider label={`Radius (${unitLabel})`} value={r} min={2.5} max={7.2} step={0.1} onChange={setR} />
        <Slider label="Endpoint A" value={aDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setA(snapA(n))} />
        <Slider label="Endpoint B" value={bDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setB(snapA(n))} />
        <Toggle label="Show midpoint M" checked={showM} onChange={setShowM} />
        <Toggle label="Show perpendicular OM" checked={showPerp} onChange={setShowPerp} />
        <Toggle label="Show second chord CD" checked={showSecond} onChange={setShowSecond} />
        <Toggle label="Show measurements" checked={showMeas} onChange={setShowMeas} />
        <Toggle label="Lock equal chords" checked={lockEqual} onChange={setLock} />
        <Toggle label="Locus of equal chords" checked={showLocus} onChange={setLocus} />
        <Toggle label="Pythagoras overlay" checked={showPy} onChange={setPy} />
        <Toggle label="Construction steps" checked={showSteps} onChange={setSteps} />
        <div className="clab-presets">
          <PresetButton label="Equal Chords" active={preset === "equal"} onClick={() => apply("equal")} />
          <PresetButton label="Diameter as Chord" active={preset === "diameter"} onClick={() => apply("diameter")} />
          <PresetButton label="Short Chord" active={preset === "short"} onClick={() => apply("short")} />
          <PresetButton label="Compare Two Chords" active={preset === "compare"} onClick={() => apply("compare")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Chord construction with circle centre O" svgRef={svgRef} unitLabel={unitLabel} focused={focused} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onKeyMove={(id, dx, dy) => {
          const p = id === "A" ? A : id === "B" ? B : id === "C" ? C : id === "D" ? D : id === "M" ? M : id === "O" ? origin : { x: origin.x + r, y: origin.y };
          movePoint(id, { x: p.x + dx, y: p.y + dy });
          setAnnounce(`${id} moved`);
        }}>
          <CircleOutline origin={origin} radius={r} />
          {showLocus ? <CircleOutline origin={origin} radius={om} dashed color="#10b981" /> : null}
          {challenge === 0 ? <GhostChord a={gA} b={gB} /> : null}
          {showPy ? <FilledTriangle a={origin} b={A} c={M} color="rgba(16,185,129,.14)" /> : null}
          <RadiusLine origin={origin} point={A} />
          <RadiusLine origin={origin} point={B} />
          <ChordLine a={A} b={B} />
          {showPerp ? <ChordLine a={origin} b={M} color="#10b981" dashed /> : null}
          {showSecond ? <ChordLine a={C} b={D} color="#8b45f4" /> : null}
          {showSecond && showPerp ? <ChordLine a={origin} b={N} color="#94a3b8" dashed /> : null}
          <DraggablePoint point={origin} label="O" color="#0f2747" dragId="O" title="Centre O" />
          <DraggablePoint point={A} label="A" dragId="A" />
          <DraggablePoint point={B} label="B" color="#f59e0b" dragId="B" />
          {showM ? <DraggablePoint point={M} label="M" color="#10b981" dragId="M" title="Midpoint M — drag along the perpendicular" /> : null}
          {showSecond ? <><DraggablePoint point={C} label="C" color="#8b45f4" dragId="C" /><DraggablePoint point={D} label="D" color="#8b45f4" dragId="D" /></> : null}
          <DraggablePoint point={{ x: origin.x + r, y: origin.y }} dragId="R" color="#08b9dd" title="Radius handle" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live measurements</h2>
        <LiveRow color="#08b9dd" label={`Radius r (${unitLabel})`} value={fmt(r)} hidden={teacher} />
        <LiveRow color="#147df2" label="Chord AB" value={fmt(ab)} hidden={teacher} />
        <LiveRow color="#10b981" label="Distance OM" value={fmt(om)} hidden={teacher} />
        {showMeas ? <LiveRow color="#8b45f4" label="Arc AB" value={`${fmt(arc, 1)}°`} hidden={teacher} /> : null}
        {showSecond ? <LiveRow color="#8b45f4" label="Chord CD" value={fmt(cd)} hidden={teacher} /> : null}
        {showSecond ? <LiveRow color="#94a3b8" label="Distance ON" value={fmt(on)} hidden={teacher} /> : null}
        <FormulaCard title="Key relationship" hidden={teacher}>
          If OM ⟂ AB, then AM = MB.
          <MathLine tex="OM^2 + (AB/2)^2 = r^2" />
        </FormulaCard>
        <WorkedCard hidden={teacher} lines={[
          `AM = ${fmt(dist(A, M))}, MB = ${fmt(dist(M, B))}`,
          `${fmt(om)}² + ${fmt(ab / 2)}² = ${fmt(om * om + (ab / 2) ** 2)} = ${fmt(r * r)} = r²`,
          `AB = 2r sin(θ/2) = ${fmt(chordLengthFromCentral(r, toRad(arc)))}`,
        ]} />
        <PropertyCard title="Chord properties" items={[
          "Equal chords are equidistant from the centre.",
          "The perpendicular from the centre bisects a chord.",
          "Equal chords subtend equal central angles.",
          "The larger chord is closer to the centre.",
        ]} />
        <p className="clab-why">Why it works: radii OA and OB are equal, so triangle OAM is congruent to OBM when OM ⟂ AB.</p>
        <p className="clab-world">Real world: a circular track’s shorter chord sits farther from the stadium centre than a longer chord.</p>
        <ChallengeCard
          prompt={CHALLENGES[challenge].prompt}
          status={status}
          onCheck={() => { const ok = CHALLENGES[challenge].check(live); setStatus(ok ? "pass" : "fail"); setAnnounce(ok ? "Challenge passed" : "Not yet"); }}
          onReset={() => { apply("compare"); setStatus("idle"); }}
          onNew={() => { setChallenge((i) => (i + 1) % CHALLENGES.length); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
