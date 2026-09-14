import { useEffect, useState } from "react";
import {
  arcLength, chordLengthFromCentral, circumference, constrainOnCircle, dist, fmt, nearlyEqual, pointOnCircle, sectorArea, segmentArea, toDeg, toRad, type Vec,
} from "./circleMath";
import { useCircleSession, usePersisted } from "./CircleSession";
import {
  ArcPath, ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LengthBadge, LiveRow, MathLine, PresetButton, PropertyCard, RadiusLine, Slider, Toggle, WorkedCard, useSvgDrag,
} from "./primitives";

export default function ArcsSectorsLab({ active }: { active: boolean }) {
  const { r, setR, origin, setOrigin, snapA, teacher, unitLabel, registerUndo } = useCircleSession();
  const [theta, setTheta] = usePersisted("arc.th", 120);
  const [a0, setA0] = usePersisted("arc.a0", 20);
  const [major, setMajor] = usePersisted("arc.maj", false);
  const [degUnits, setDegUnits] = usePersisted("arc.du", true);
  const [showFormula, setShowFormula] = usePersisted("arc.f", true);
  const [labels, setLabels] = usePersisted("arc.lab", true);
  const [showBoth, setBoth] = usePersisted("arc.both", true);
  const [sweep, setSweep] = usePersisted("arc.sw", false);
  const [display, setDisplay] = useState(120);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [challenge, setChallenge] = usePersisted("arc.ch", 0);
  const [focused, setFocused] = useState<string | null>("B");

  useEffect(() => {
    if (!sweep || !active) { setDisplay(theta); return; }
    let frame = 0;
    const tick = () => {
      setDisplay((value) => {
        const next = value + 1.2;
        return next >= theta ? theta : next;
      });
      frame = requestAnimationFrame(tick);
    };
    setDisplay(8);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [sweep, theta, active]);

  useEffect(() => { registerUndo(() => { setTheta(120); setR(5); }); }, [registerUndo, setR, setTheta]);

  const shown = major ? 360 - Math.abs(display) : Math.abs(display);
  const A = pointOnCircle(origin, r, toRad(a0));
  const B = pointOnCircle(origin, r, toRad(a0 + shown));
  const circ = circumference(r);
  const s = arcLength(r, shown);
  const area = sectorArea(r, shown);
  const chord = chordLengthFromCentral(r, toRad(shown));
  const segment = segmentArea(r, shown);
  const majorTheta = 360 - shown;
  const sMaj = arcLength(r, majorTheta);
  const areaMaj = sectorArea(r, majorTheta);

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    if (id === "O") setOrigin(math);
    if (id === "A") setA0(snapA(toDeg(Math.atan2(math.y - origin.y, math.x - origin.x))));
    if (id === "B") {
      const ang = toDeg(Math.atan2(math.y - origin.y, math.x - origin.x));
      let d = ang - a0;
      while (d < 0) d += 360;
      while (d > 360) d -= 360;
      setTheta(Math.max(8, Math.min(350, d)));
      setMajor(d > 180);
    }
    if (id === "R") setR(Math.max(2.4, Math.min(7.2, dist(origin, math))));
  }, setFocused);

  const challenges = [
    { prompt: "Create a sector with central angle 120°.", check: () => nearlyEqual(Math.abs(theta), 120, 2) },
    { prompt: "Create a sector with area ≈ 25π (r²θ/360 ≈ 25π).", check: () => nearlyEqual(area / Math.PI, 25, 0.8) },
  ];

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Arc & sector controls</h2>
        <Slider label={`Radius r (${unitLabel})`} value={r} min={2.4} max={7.2} step={0.1} onChange={setR} />
        <Slider label="Central angle θ" value={theta} min={8} max={350} step={1} unit={degUnits ? "°" : ""} onChange={setTheta} />
        <div className="clab-seg" role="group" aria-label="Minor or major">
          <button type="button" className={!major ? "is-on" : ""} onClick={() => setMajor(false)}>Minor</button>
          <button type="button" className={major ? "is-on" : ""} onClick={() => setMajor(true)}>Major</button>
        </div>
        <div className="clab-seg" role="group" aria-label="Angle units">
          <button type="button" className={degUnits ? "is-on" : ""} onClick={() => setDegUnits(true)}>Degrees</button>
          <button type="button" className={!degUnits ? "is-on" : ""} onClick={() => setDegUnits(false)}>Radians</button>
        </div>
        <Toggle label="Show formula" checked={showFormula} onChange={setShowFormula} />
        <Toggle label="Show labels" checked={labels} onChange={setLabels} />
        <Toggle label="Show complementary sector" checked={showBoth} onChange={setBoth} />
        <Toggle label="Animate sector sweep" checked={sweep} onChange={setSweep} />
        <div className="clab-presets">
          <PresetButton label="Semicircle" onClick={() => { setTheta(180); setMajor(false); }} />
          <PresetButton label="Quarter Circle" onClick={() => { setTheta(90); setMajor(false); }} />
          <PresetButton label="60° Sector" onClick={() => { setTheta(60); setMajor(false); }} />
          <PresetButton label="120° Sector" onClick={() => { setTheta(120); setMajor(false); }} />
          <PresetButton label="Major Sector" onClick={() => { setTheta(240); setMajor(true); }} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Arc and sector explorer" svgRef={svgRef} unitLabel={unitLabel} focused={focused} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onKeyMove={(id, dx, dy) => {
          const p = id === "A" ? A : id === "B" ? B : origin;
          const hit = constrainOnCircle(origin, r, { x: p.x + dx, y: p.y + dy });
          if (id === "A" || id === "B") {
            const ang = toDeg(Math.atan2(hit.y - origin.y, hit.x - origin.x));
            if (id === "A") setA0(snapA(ang));
            else {
              let d = ang - a0; while (d < 0) d += 360; setTheta(Math.max(8, Math.min(350, d)));
            }
          }
        }}>
          <CircleOutline origin={origin} radius={r} />
          {showBoth ? <ArcPath origin={origin} radius={r} startRad={toRad(a0 + shown)} endRad={toRad(a0 + 360)} fill="rgba(148,163,184,.12)" /> : null}
          <ArcPath origin={origin} radius={r} startRad={toRad(a0)} endRad={toRad(a0 + shown)} fill="rgba(8,185,221,.22)" />
          <ArcPath origin={origin} radius={r} startRad={toRad(a0)} endRad={toRad(a0 + shown)} color="#8b45f4" width={4} />
          <RadiusLine origin={origin} point={A} />
          <RadiusLine origin={origin} point={B} />
          <ChordLine a={A} b={B} color="#147df2" />
          <LengthBadge a={A} b={B} text={`c ${fmt(chord)}`} />
          {nearlyEqual(shown, 120, 2) ? <LengthBadge a={origin} b={A} text="120°" color="#8b45f4" /> : null}
          <DraggablePoint point={origin} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={A} label={labels ? "A" : undefined} dragId="A" />
          <DraggablePoint point={B} label={labels ? "B" : undefined} color="#f59e0b" dragId="B" />
          <DraggablePoint point={{ x: origin.x + r, y: origin.y }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live calculations</h2>
        <LiveRow color="#08b9dd" label="Circumference 2πr" value={fmt(circ)} hidden={teacher} />
        <LiveRow color="#8b45f4" label="Arc length s" value={fmt(s)} hidden={teacher} />
        <LiveRow color="#147df2" label="Sector area" value={fmt(area)} hidden={teacher} />
        <LiveRow color="#f59e0b" label="Chord AB" value={fmt(chord)} hidden={teacher} />
        <LiveRow color="#10b981" label="Segment area" value={fmt(segment)} hidden={teacher} />
        <LiveRow color="#536381" label="θ" value={degUnits ? `${fmt(shown, 1)}°` : `${fmt(toRad(shown), 3)} rad`} hidden={teacher} />
        {showBoth ? <LiveRow color="#94a3b8" label="Complementary arc / area" value={`${fmt(sMaj)} / ${fmt(areaMaj)}`} hidden={teacher} /> : null}
        {showFormula ? (
          <FormulaCard title="Formulas" hidden={teacher}>
            <MathLine tex="C = 2\pi r" />
            <MathLine tex="s = \dfrac{\theta}{360^\circ}\cdot 2\pi r" />
            <MathLine tex="A = \dfrac{\theta}{360^\circ}\cdot \pi r^2" />
            <MathLine tex="c = 2r\sin(\tfrac{\theta}{2})" />
          </FormulaCard>
        ) : null}
        <WorkedCard hidden={teacher} lines={[
          `s = (${fmt(shown, 0)}/360)·2π·${fmt(r)} = ${fmt(s)}`,
          `A = (${fmt(shown, 0)}/360)·π·${fmt(r)}² = ${fmt(area)}`,
          `major = 360° − ${fmt(shown, 0)}° = ${fmt(majorTheta, 0)}°`,
        ]} />
        <PropertyCard title="Arc facts" items={[
          "Arc measure equals the central angle.",
          "Arc length is the fraction of the circumference.",
          "Sector area is the same fraction of the disk.",
          "A major sector is the complement of the minor sector.",
        ]} />
        <p className="clab-why">Why it works: a full turn is 360° of circumference 2πr and area πr². A sector is that proportional slice.</p>
        <p className="clab-world">Satellite footprints and circular-track lane distances are sector and arc-length calculations on a known radius.</p>
        <ChallengeCard
          prompt={challenges[challenge].prompt}
          status={status}
          onCheck={() => setStatus(challenges[challenge].check() ? "pass" : "fail")}
          onReset={() => { setTheta(120); setR(5); setStatus("idle"); }}
          onNew={() => { setChallenge((i) => (i + 1) % challenges.length); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
