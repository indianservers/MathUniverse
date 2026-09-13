import { useState } from "react";
import {
  angleOf, chordLengthFromCentral, dist, fmt, midpoint, minorArcDeg, nearlyEqual, pointOnCircle, toDeg, toRad, type Vec,
} from "./circleMath";
import {
  ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, PresetButton, PropertyCard, RadiusLine, Slider, Toggle, useSvgDrag,
} from "./primitives";

const O: Vec = { x: 0, y: 0 };

const CHALLENGES = [
  { id: "len8", prompt: "Create chord AB of length 8 units.", check: (m: Live) => nearlyEqual(m.ab, 8, 0.15) },
  { id: "equal", prompt: "Make AB = CD (turn on the second chord).", check: (m: Live) => m.showSecond && nearlyEqual(m.ab, m.cd, 0.12) },
  { id: "equidist", prompt: "Place two chords equidistant from O.", check: (m: Live) => m.showSecond && nearlyEqual(m.om, m.on, 0.12) },
];

type Live = {
  r: number; ab: number; cd: number; om: number; on: number; arc: number; showSecond: boolean;
};

export default function ChordsLab() {
  const [r, setR] = useState(5);
  const [aDeg, setA] = useState(28);
  const [bDeg, setB] = useState(148);
  const [cDeg, setC] = useState(210);
  const [dDeg, setD] = useState(300);
  const [showM, setShowM] = useState(true);
  const [showPerp, setShowPerp] = useState(true);
  const [showSecond, setShowSecond] = useState(true);
  const [showMeas, setShowMeas] = useState(true);
  const [lockEqual, setLock] = useState(false);
  const [preset, setPreset] = useState("compare");
  const [challenge, setChallenge] = useState(0);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);

  const A = pointOnCircle(O, r, toRad(aDeg));
  const B = pointOnCircle(O, r, toRad(bDeg));
  let C = pointOnCircle(O, r, toRad(cDeg));
  let D = pointOnCircle(O, r, toRad(dDeg));
  const M = midpoint(A, B);
  const om = dist(O, M);
  const ab = dist(A, B);
  if (lockEqual) {
    const nDir = { x: Math.cos(toRad((cDeg + dDeg) / 2)), y: Math.sin(toRad((cDeg + dDeg) / 2)) };
    const N = { x: nDir.x * om * (om === 0 ? 0 : 1), y: nDir.y * om };
    const half = ab / 2;
    const px = -nDir.y;
    const py = nDir.x;
    C = { x: N.x + px * half, y: N.y + py * half };
    D = { x: N.x - px * half, y: N.y - py * half };
  }
  const N = midpoint(C, D);
  const cd = dist(C, D);
  const on = dist(O, N);
  const arc = minorArcDeg(aDeg, bDeg);
  const live: Live = { r, ab, cd, om, on, arc, showSecond };

  const apply = (id: string) => {
    setPreset(id);
    if (id === "equal") { setA(40); setB(140); setC(220); setD(320); setShowSecond(true); setLock(true); }
    if (id === "diameter") { setA(0); setB(180); setShowSecond(false); setLock(false); }
    if (id === "short") { setA(70); setB(110); setShowSecond(false); }
    if (id === "compare") { setA(20); setB(160); setC(200); setD(250); setShowSecond(true); setLock(false); }
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    const ang = toDeg(angleOf(math, O));
    if (id === "A") setA(ang);
    if (id === "B") setB(ang);
    if (id === "C") setC(ang);
    if (id === "D") setD(ang);
    if (id === "R") setR(Math.max(2, Math.min(7.2, dist(O, math))));
  });

  const theorem = showPerp
    ? "If OM ⟂ AB, then AM = MB."
    : lockEqual
      ? "Equal chords are equidistant from the centre."
      : "The larger chord is closer to the centre.";

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Chord controls</h2>
        <Slider label="Radius" value={r} min={2.5} max={7.2} step={0.1} onChange={setR} />
        <Slider label="Endpoint A" value={aDeg} min={-180} max={180} step={1} unit="°" onChange={setA} />
        <Slider label="Endpoint B" value={bDeg} min={-180} max={180} step={1} unit="°" onChange={setB} />
        <Toggle label="Show midpoint M" checked={showM} onChange={setShowM} />
        <Toggle label="Show perpendicular OM" checked={showPerp} onChange={setShowPerp} />
        <Toggle label="Show second chord CD" checked={showSecond} onChange={setShowSecond} />
        <Toggle label="Show measurements" checked={showMeas} onChange={setShowMeas} />
        <Toggle label="Lock equal chords" checked={lockEqual} onChange={setLock} />
        <div className="clab-presets">
          <PresetButton label="Equal Chords" active={preset === "equal"} onClick={() => apply("equal")} />
          <PresetButton label="Diameter as Chord" active={preset === "diameter"} onClick={() => apply("diameter")} />
          <PresetButton label="Short Chord" active={preset === "short"} onClick={() => apply("short")} />
          <PresetButton label="Compare Two Chords" active={preset === "compare"} onClick={() => apply("compare")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Chord construction with circle centre O" svgRef={svgRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <CircleOutline origin={O} radius={r} />
          <RadiusLine origin={O} point={A} />
          <RadiusLine origin={O} point={B} />
          <ChordLine a={A} b={B} />
          {showPerp ? <ChordLine a={O} b={M} color="#10b981" dashed /> : null}
          {showSecond ? <ChordLine a={C} b={D} color="#8b45f4" /> : null}
          {showSecond && showPerp ? <ChordLine a={O} b={N} color="#94a3b8" dashed /> : null}
          <DraggablePoint point={O} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={A} label="A" dragId="A" />
          <DraggablePoint point={B} label="B" color="#f59e0b" dragId="B" />
          {showM ? <DraggablePoint point={M} label="M" color="#10b981" dragId="M" /> : null}
          {showSecond ? <><DraggablePoint point={C} label="C" color="#8b45f4" dragId="C" /><DraggablePoint point={D} label="D" color="#8b45f4" dragId="D" /></> : null}
          <DraggablePoint point={{ x: r, y: 0 }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live measurements</h2>
        <LiveRow color="#08b9dd" label="Radius r" value={fmt(r)} />
        <LiveRow color="#147df2" label="Chord AB" value={fmt(ab)} />
        <LiveRow color="#10b981" label="Distance OM" value={fmt(om)} />
        {showMeas ? <LiveRow color="#8b45f4" label="Arc AB" value={`${fmt(arc, 1)}°`} /> : null}
        {showSecond ? <LiveRow color="#8b45f4" label="Chord CD" value={fmt(cd)} /> : null}
        {showSecond ? <LiveRow color="#94a3b8" label="Distance ON" value={fmt(on)} /> : null}
        <FormulaCard title="Key relationship">{theorem}<div className="clab-note">AM = {fmt(dist(A, M))} · MB = {fmt(dist(M, B))} · AB = 2r sin(θ/2) = {fmt(chordLengthFromCentral(r, toRad(arc)))}</div></FormulaCard>
        <PropertyCard title="Chord properties" items={[
          "Equal chords are equidistant from the centre.",
          "The perpendicular from the centre bisects a chord.",
          "Equal chords subtend equal central angles.",
          "The larger chord is closer to the centre.",
        ]} />
        <p className="clab-why">Why it works: radii OA and OB are equal, so triangle OAM is congruent to OBM when OM ⟂ AB. Pythagoras then gives OM² + (AB/2)² = r².</p>
        <p className="clab-world">Real world: a circular track’s shorter chord (a straight shortcut) sits farther from the stadium centre than a longer chord.</p>
        <ChallengeCard
          prompt={CHALLENGES[challenge].prompt}
          status={status}
          onCheck={() => setStatus(CHALLENGES[challenge].check(live) ? "pass" : "fail")}
          onReset={() => { apply("compare"); setStatus("idle"); }}
          onNew={() => { setChallenge((i) => (i + 1) % CHALLENGES.length); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
