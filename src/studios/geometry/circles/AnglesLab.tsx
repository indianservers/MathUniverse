import { useEffect, useState } from "react";
import { angleBetween, angleOf, fmt, minorArcDeg, nearlyEqual, pointOnCircle, toDeg, toRad, type Vec } from "./circleMath";
import {
  AngleMarker, ArcPath, ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, PresetButton, PropertyCard, RadiusLine, Slider, Toggle, useSvgDrag,
} from "./primitives";

const O: Vec = { x: 0, y: 0 };
const SUB = [
  { id: "central", label: "Central Angle" },
  { id: "inscribed", label: "Inscribed Angle" },
  { id: "semi", label: "Angle in a Semicircle" },
  { id: "chords", label: "Intersecting Chords" },
  { id: "secants", label: "External Secants" },
  { id: "tangent", label: "Tangent–Chord Angle" },
];

export default function AnglesLab() {
  const [r, setR] = useState(5);
  const [sub, setSub] = useState("inscribed");
  const [aDeg, setA] = useState(20);
  const [bDeg, setB] = useState(120);
  const [cDeg, setC] = useState(220);
  const [dDeg, setD] = useState(300);
  const [showArc, setShowArc] = useState(true);
  const [showThm, setShowThm] = useState(true);
  const [showMeas, setShowMeas] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [preset, setPreset] = useState("same");
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const tick = () => {
      setC((value) => {
        const lo = Math.max(aDeg, bDeg) + 8;
        const span = 360 - Math.abs(bDeg - aDeg) - 20;
        return (lo + ((value + 0.7 - lo) % Math.max(40, span)));
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, aDeg, bDeg]);

  const A = pointOnCircle(O, r, toRad(aDeg));
  const B = pointOnCircle(O, r, toRad(bDeg));
  const C = pointOnCircle(O, r, toRad(cDeg));
  const D = pointOnCircle(O, r, toRad(dDeg));
  const central = minorArcDeg(aDeg, bDeg);
  const inscribed = toDeg(angleBetween(A, C, B));
  const semi = sub === "semi";
  const expectedInscribed = central / 2;

  const apply = (id: string) => {
    setPreset(id);
    if (id === "semi") { setSub("semi"); setA(0); setB(180); setC(90); }
    if (id === "same") { setSub("inscribed"); setA(20); setB(120); setC(220); }
    if (id === "chords") { setSub("chords"); setA(30); setB(200); setC(110); setD(300); }
    if (id === "external") { setSub("secants"); setA(50); setB(130); setC(200); setD(320); }
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    const ang = toDeg(angleOf(math, O));
    if (id === "A") setA(ang);
    if (id === "B") setB(ang);
    if (id === "C") setC(ang);
    if (id === "D") setD(ang);
    if (id === "R") setR(Math.max(2.5, Math.min(7, distSafe(math))));
  });

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Angle controls</h2>
        <div className="clab-seg" role="group" aria-label="Angle type">
          {SUB.map((item) => (
            <button key={item.id} type="button" className={sub === item.id ? "is-on" : ""} onClick={() => setSub(item.id)}>{item.label}</button>
          ))}
        </div>
        <Slider label="Radius" value={r} min={2.5} max={7} step={0.1} onChange={setR} />
        <Slider label="Point A" value={aDeg} min={-180} max={180} step={1} unit="°" onChange={setA} />
        <Slider label="Point B" value={bDeg} min={-180} max={180} step={1} unit="°" onChange={setB} />
        <Slider label="Point C" value={cDeg} min={-180} max={180} step={1} unit="°" onChange={setC} />
        <Toggle label="Show intercepted arc" checked={showArc} onChange={setShowArc} />
        <Toggle label="Show theorem" checked={showThm} onChange={setShowThm} />
        <Toggle label="Show measurements" checked={showMeas} onChange={setShowMeas} />
        <Toggle label="Animate C on the same arc" checked={animate} onChange={setAnimate} />
        <div className="clab-presets">
          <PresetButton label="Semicircle" active={preset === "semi"} onClick={() => apply("semi")} />
          <PresetButton label="Same Segment" active={preset === "same"} onClick={() => apply("same")} />
          <PresetButton label="Intersecting Chords" active={preset === "chords"} onClick={() => apply("chords")} />
          <PresetButton label="External Angle" active={preset === "external"} onClick={() => apply("external")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Circle angle explorer" svgRef={svgRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <CircleOutline origin={O} radius={r} />
          {showArc ? <ArcPath origin={O} radius={r} startRad={toRad(aDeg)} endRad={toRad(bDeg)} fill="rgba(139,69,244,.14)" /> : null}
          {showArc ? <ArcPath origin={O} radius={r} startRad={toRad(aDeg)} endRad={toRad(bDeg)} /> : null}
          <RadiusLine origin={O} point={A} />
          <RadiusLine origin={O} point={B} />
          <ChordLine a={A} b={C} color="#147df2" />
          <ChordLine a={B} b={C} color="#147df2" />
          {sub === "chords" || sub === "secants" ? <ChordLine a={A} b={B} color="#8b45f4" /> : null}
          {sub === "chords" ? <ChordLine a={C} b={D} color="#f59e0b" /> : null}
          {semi ? <ChordLine a={A} b={B} color="#0f2747" /> : null}
          <AngleMarker vertex={O} from={A} to={B} color="#8b45f4" />
          <AngleMarker vertex={C} from={A} to={B} radius={0.9} color="#147df2" />
          <DraggablePoint point={O} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={A} label="A" dragId="A" />
          <DraggablePoint point={B} label="B" color="#f59e0b" dragId="B" />
          <DraggablePoint point={C} label="C" color="#8b45f4" dragId="C" />
          {sub === "chords" ? <DraggablePoint point={D} label="D" color="#10b981" dragId="D" /> : null}
          <DraggablePoint point={{ x: r, y: 0 }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live relationship</h2>
        {showMeas ? (
          <>
            <LiveRow color="#8b45f4" label="Intercepted arc AB" value={`${fmt(central, 1)}°`} />
            <LiveRow color="#8b45f4" label="Central ∠AOB" value={`${fmt(central, 1)}°`} />
            <LiveRow color="#147df2" label="Inscribed ∠ACB" value={`${fmt(inscribed, 1)}°`} />
            <LiveRow color="#10b981" label="Half of central" value={`${fmt(expectedInscribed, 1)}°`} />
          </>
        ) : null}
        {showThm ? (
          <FormulaCard title="Key relationship">
            Central angle = 2 × inscribed angle when both subtend the same arc.
            <div className="clab-note">{fmt(central, 1)}° = 2 × {fmt(inscribed, 1)}° {nearlyEqual(inscribed, expectedInscribed, 1.2) ? "✓" : ""}{semi ? " · Thales: angle in a semicircle is 90°." : ""}</div>
          </FormulaCard>
        ) : null}
        <PropertyCard title="Angle theorems" items={[
          "An inscribed angle is half the central angle that subtends the same arc.",
          "Angles in the same segment are equal — move C and watch ∠ACB stay constant.",
          "An angle in a semicircle is a right angle (Thales).",
          "The angle between a tangent and a chord equals the angle in the alternate segment.",
        ]} />
        <p className="clab-why">Why it works: triangles OAC and OBC are isosceles. The exterior angle at the centre is the sum of the two base angles, which are each equal to the inscribed angle.</p>
        <p className="clab-world">Surveying and optics use inscribed-angle invariance: any viewpoint on the same circular arc sees a chord under the same angle.</p>
        <ChallengeCard
          prompt="Construct an inscribed angle of 35° (within 1.5°)."
          status={status}
          onCheck={() => setStatus(nearlyEqual(inscribed, 35, 1.5) ? "pass" : "fail")}
          onReset={() => { apply("same"); setStatus("idle"); }}
          onNew={() => { setA(10); setB(80); setC(200); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}

function distSafe(math: Vec) {
  return Math.hypot(math.x, math.y);
}
