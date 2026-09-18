import { useEffect, useState } from "react";
import {
  angleBetween, angleOf, clamp, clampToComplementaryArc, constrainOnCircle, constrainOutside, dist, fmt, lineIntersection, minorArcDeg, nearlyEqual, perp, pointOnCircle, stepOnComplementaryArc, toDeg, toRad, type Vec,
} from "./circleMath";
import { parseAngleKind, type AngleKind } from "./circleMode";
import { useCircleSession, usePersisted } from "./CircleSession";
import {
  AngleMarker, ArcPath, ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, MathLine, PresetButton, PropertyCard, RadiusLine, Slider, TangentLine, Toggle, WorkedCard, useSvgDrag,
} from "./primitives";

const SUB: Array<{ id: AngleKind; label: string }> = [
  { id: "central", label: "Central Angle" },
  { id: "inscribed", label: "Inscribed Angle" },
  { id: "semi", label: "Angle in a Semicircle" },
  { id: "chords", label: "Intersecting Chords" },
  { id: "secants", label: "External Secants" },
  { id: "tangent", label: "Tangent–Chord Angle" },
  { id: "cyclic", label: "Cyclic Quadrilateral" },
];

export default function AnglesLab({ active }: { active: boolean }) {
  const { r, setR, origin, setOrigin, snapA, teacher, unitLabel, kind, setKind, registerUndo, setAnnounce } = useCircleSession();
  const sub = parseAngleKind(kind || "inscribed");
  const [aDeg, setA] = usePersisted("ang.a", 20);
  const [bDeg, setB] = usePersisted("ang.b", 120);
  const [cDeg, setC] = usePersisted("ang.c", 220);
  const [dDeg, setD] = usePersisted("ang.d", 300);
  const [showArc, setShowArc] = usePersisted("ang.arc", true);
  const [showThm, setShowThm] = usePersisted("ang.thm", true);
  const [showMeas, setShowMeas] = usePersisted("ang.meas", true);
  const [lockSeg, setLock] = usePersisted("ang.lock", true);
  const [animate, setAnimate] = usePersisted("ang.anim", false);
  const [preset, setPreset] = usePersisted("ang.preset", "same");
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [focused, setFocused] = useState<string | null>("C");
  const [px, setPx] = usePersisted("ang.px", 8.4);
  const [py, setPy] = usePersisted("ang.py", 1.6);

  useEffect(() => {
    if (!animate || !active) return;
    let frame = 0;
    const tick = () => {
      setC((value) => stepOnComplementaryArc(aDeg, bDeg, value, 0.7));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, animate, aDeg, bDeg, setC]);

  useEffect(() => { registerUndo(() => apply("same")); }, [registerUndo]);

  const A = pointOnCircle(origin, r, toRad(aDeg));
  const B = pointOnCircle(origin, r, toRad(bDeg));
  const C = pointOnCircle(origin, r, toRad(lockSeg ? clampToComplementaryArc(aDeg, bDeg, cDeg) : cDeg));
  const D = pointOnCircle(origin, r, toRad(dDeg));
  const Pext = { x: origin.x + px, y: origin.y + py };
  const chordHit = lineIntersection(A, B, C, D);
  const central = minorArcDeg(aDeg, bDeg);
  const inscribed = toDeg(angleBetween(A, C, B));
  const angA = toDeg(angleBetween(B, A, D));
  const angB = toDeg(angleBetween(A, B, C));
  const angC = toDeg(angleBetween(B, C, D));
  const angD = toDeg(angleBetween(C, D, A));
  const expectedInscribed = central / 2;
  const tanDir = perp({ x: A.x - origin.x, y: A.y - origin.y });

  const apply = (id: string) => {
    setPreset(id);
    if (id === "semi") { setKind("semi"); setA(0); setB(180); setC(90); }
    if (id === "same") { setKind("inscribed"); setA(20); setB(120); setC(220); }
    if (id === "chords") { setKind("chords"); setA(30); setB(200); setC(110); setD(300); }
    if (id === "external") { setKind("secants"); setA(50); setB(130); setC(200); setD(320); }
    if (id === "cyclic") { setKind("cyclic"); setA(20); setB(100); setC(200); setD(300); }
  };

  const movePoint = (id: string, math: Vec) => {
    if (id === "O") setOrigin(math);
    if (id === "A") setA(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "B") setB(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "C") {
      const ang = snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin)));
      setC(lockSeg ? clampToComplementaryArc(aDeg, bDeg, ang) : ang);
    }
    if (id === "D") setD(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "P") {
      const q = constrainOutside(origin, r, math);
      setPx(q.x - origin.x); setPy(q.y - origin.y);
    }
    if (id === "R") setR(clamp(dist(origin, math), 2.5, 7));
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => movePoint(id, math), setFocused);
  const stayNote = lockSeg ? `∠ACB stays ${fmt(inscribed, 1)}° on this arc.` : "";

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Angle controls</h2>
        <div className="clab-seg" role="group" aria-label="Angle type">
          {SUB.map((item) => (
            <button key={item.id} type="button" className={sub === item.id ? "is-on" : ""} onClick={() => setKind(item.id)}>{item.label}</button>
          ))}
        </div>
        <Slider label={`Radius (${unitLabel})`} value={r} min={2.5} max={7} step={0.1} onChange={setR} />
        <Slider label="Point A" value={aDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setA(snapA(n))} />
        <Slider label="Point B" value={bDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setB(snapA(n))} />
        <Slider label="Point C" value={cDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setC(snapA(n))} />
        <Toggle label="Show intercepted arc" checked={showArc} onChange={setShowArc} />
        <Toggle label="Show theorem" checked={showThm} onChange={setShowThm} />
        <Toggle label="Show measurements" checked={showMeas} onChange={setShowMeas} />
        <Toggle label="Same-segment lock for C" checked={lockSeg} onChange={setLock} />
        <Toggle label="Animate C on the same arc" checked={animate} onChange={setAnimate} />
        <div className="clab-presets">
          <PresetButton label="Semicircle" active={preset === "semi"} onClick={() => apply("semi")} />
          <PresetButton label="Same Segment" active={preset === "same"} onClick={() => apply("same")} />
          <PresetButton label="Intersecting Chords" active={preset === "chords"} onClick={() => apply("chords")} />
          <PresetButton label="External Angle" active={preset === "external"} onClick={() => apply("external")} />
          <PresetButton label="Cyclic quad" active={preset === "cyclic"} onClick={() => apply("cyclic")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Circle angle explorer" svgRef={svgRef} unitLabel={unitLabel} focused={focused} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onKeyMove={(id, dx, dy) => {
          const p = id === "A" ? A : id === "B" ? B : id === "C" ? C : id === "D" ? D : origin;
          movePoint(id, { x: p.x + dx, y: p.y + dy });
        }}>
          <CircleOutline origin={origin} radius={r} />
          {showArc && sub !== "cyclic" ? <ArcPath origin={origin} radius={r} startRad={toRad(aDeg)} endRad={toRad(bDeg)} fill="rgba(139,69,244,.14)" /> : null}
          {sub === "central" || sub === "inscribed" || sub === "semi" ? (
            <>
              <RadiusLine origin={origin} point={A} />
              <RadiusLine origin={origin} point={B} />
              {sub !== "central" ? <ChordLine a={A} b={C} /> : null}
              {sub !== "central" ? <ChordLine b={B} a={C} /> : null}
              {sub === "semi" ? <ChordLine a={A} b={B} color="#0f2747" /> : null}
              <AngleMarker vertex={origin} from={A} to={B} color="#8b45f4" />
              {sub !== "central" ? <AngleMarker vertex={C} from={A} to={B} radius={0.9} color="#147df2" /> : null}
            </>
          ) : null}
          {sub === "chords" ? (
            <>
              <ChordLine a={A} b={B} />
              <ChordLine a={C} b={D} color="#f59e0b" />
              {chordHit ? <AngleMarker vertex={chordHit} from={A} to={C} color="#8b45f4" /> : null}
            </>
          ) : null}
          {sub === "secants" ? (
            <>
              <ChordLine a={Pext} b={B} color="#147df2" />
              <ChordLine a={Pext} b={D} color="#8b45f4" />
              <AngleMarker vertex={Pext} from={A} to={C} color="#f59e0b" />
              <DraggablePoint point={Pext} label="P" color="#8b45f4" dragId="P" />
            </>
          ) : null}
          {sub === "tangent" ? (
            <>
              <TangentLine point={A} direction={tanDir} />
              <ChordLine a={A} b={B} />
              <ChordLine a={B} b={C} color="#8b45f4" />
              <AngleMarker vertex={A} from={{ x: A.x + tanDir.x, y: A.y + tanDir.y }} to={B} color="#f59e0b" />
              <AngleMarker vertex={C} from={A} to={B} color="#8b45f4" />
            </>
          ) : null}
          {sub === "cyclic" ? (
            <>
              <ChordLine a={A} b={B} />
              <ChordLine a={B} b={C} />
              <ChordLine a={C} b={D} color="#8b45f4" />
              <ChordLine a={D} b={A} color="#8b45f4" />
              <AngleMarker vertex={A} from={B} to={D} color="#147df2" />
              <AngleMarker vertex={C} from={B} to={D} color="#8b45f4" />
            </>
          ) : null}
          <DraggablePoint point={origin} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={A} label="A" dragId="A" />
          <DraggablePoint point={B} label="B" color="#f59e0b" dragId="B" />
          <DraggablePoint point={C} label="C" color="#8b45f4" dragId="C" />
          {sub === "chords" || sub === "cyclic" || sub === "secants" ? <DraggablePoint point={D} label="D" color="#10b981" dragId="D" /> : null}
          <DraggablePoint point={{ x: origin.x + r, y: origin.y }} dragId="R" color="#08b9dd" title="Radius handle" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live relationship</h2>
        {showMeas && sub !== "cyclic" ? (
          <>
            <LiveRow color="#8b45f4" label="Intercepted arc AB" value={`${fmt(central, 1)}°`} hidden={teacher} />
            <LiveRow color="#8b45f4" label="Central ∠AOB" value={`${fmt(central, 1)}°`} hidden={teacher} />
            <LiveRow color="#147df2" label="Inscribed ∠ACB" value={`${fmt(inscribed, 1)}°`} hidden={teacher} />
            <LiveRow color="#10b981" label="Half of central" value={`${fmt(expectedInscribed, 1)}°`} hidden={teacher} />
          </>
        ) : null}
        {sub === "cyclic" ? (
          <>
            <LiveRow color="#147df2" label="∠A + ∠C" value={`${fmt(angA, 1)}° + ${fmt(angC, 1)}° = ${fmt(angA + angC, 1)}°`} hidden={teacher} />
            <LiveRow color="#8b45f4" label="∠B + ∠D" value={`${fmt(angB, 1)}° + ${fmt(angD, 1)}° = ${fmt(angB + angD, 1)}°`} hidden={teacher} />
          </>
        ) : null}
        {showThm ? (
          <FormulaCard title="Key relationship" hidden={teacher}>
            {sub === "cyclic" ? "Opposite angles of a cyclic quadrilateral sum to 180°." : "Central angle = 2 × inscribed angle when both subtend the same arc."}
            {sub !== "cyclic" ? <MathLine tex="\angle AOB = 2\,\angle ACB" /> : <MathLine tex="\angle A + \angle C = 180^\circ" />}
            <div className="clab-note">{stayNote}{sub === "semi" ? " Thales: angle in a semicircle is 90°." : ""}</div>
          </FormulaCard>
        ) : null}
        <WorkedCard hidden={teacher} lines={sub === "cyclic"
          ? [`∠A+∠C = ${fmt(angA + angC, 1)}°`, `∠B+∠D = ${fmt(angB + angD, 1)}°`]
          : [`${fmt(central, 1)}° = 2 × ${fmt(inscribed, 1)}°`]} />
        <PropertyCard title="Angle theorems" items={[
          "An inscribed angle is half the central angle that subtends the same arc.",
          "Angles in the same segment are equal — keep C on the complementary arc.",
          "An angle in a semicircle is a right angle (Thales).",
          "The angle between a tangent and a chord equals the angle in the alternate segment.",
          "Opposite angles of a cyclic quadrilateral add to 180°.",
        ]} />
        <p className="clab-why">Why it works: isosceles radii make the exterior central angle twice each inscribed base angle.</p>
        <p className="clab-world">Surveying uses inscribed-angle invariance: any viewpoint on the same arc sees a chord under the same angle.</p>
        <ChallengeCard
          prompt="Construct an inscribed angle of 35° (within 1.5°)."
          status={status}
          onCheck={() => { const ok = nearlyEqual(inscribed, 35, 1.5); setStatus(ok ? "pass" : "fail"); setAnnounce(ok ? "35° constructed" : "Not yet"); }}
          onReset={() => { apply("same"); setStatus("idle"); }}
          onNew={() => { setA(10); setB(80); setC(200); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
