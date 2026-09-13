import { useEffect, useState } from "react";
import {
  arcLength, chordLengthFromCentral, circumference, fmt, nearlyEqual, pointOnCircle, sectorArea, segmentArea, toRad, type Vec,
} from "./circleMath";
import {
  ArcPath, ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, PresetButton, PropertyCard, RadiusLine, Slider, Toggle, useSvgDrag,
} from "./primitives";

const O: Vec = { x: 0, y: 0 };

export default function ArcsSectorsLab() {
  const [r, setR] = useState(5);
  const [theta, setTheta] = useState(120);
  const [major, setMajor] = useState(false);
  const [units, setUnits] = useState<"deg" | "rad">("deg");
  const [showFormula, setShowFormula] = useState(true);
  const [labels, setLabels] = useState(true);
  const [sweep, setSweep] = useState(false);
  const [display, setDisplay] = useState(120);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [challenge, setChallenge] = useState(0);

  useEffect(() => {
    if (!sweep) { setDisplay(theta); return; }
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
  }, [sweep, theta]);

  const shown = major ? 360 - Math.abs(display) : Math.abs(display);
  const aDeg = 20;
  const A = pointOnCircle(O, r, toRad(aDeg));
  const B = pointOnCircle(O, r, toRad(aDeg + (major ? 360 - Math.abs(display) : Math.abs(display))));
  const C = circumference(r);
  const s = arcLength(r, shown);
  const area = sectorArea(r, shown);
  const chord = chordLengthFromCentral(r, toRad(shown));
  const segment = segmentArea(r, shown);

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    if (id === "A" || id === "B") {
      const ang = (Math.atan2(math.y, math.x) * 180) / Math.PI;
      if (id === "B") {
        let d = ang - aDeg;
        while (d < 0) d += 360;
        while (d > 360) d -= 360;
        setTheta(Math.max(8, Math.min(350, d)));
        setMajor(d > 180);
      }
    }
    if (id === "R") setR(Math.max(2.4, Math.min(7.2, Math.hypot(math.x, math.y))));
  });

  const challenges = [
    { prompt: "Create a sector with central angle 120°.", check: () => nearlyEqual(Math.abs(theta), 120, 2) },
    { prompt: "Create a sector with area ≈ 25π (r²θ/360 ≈ 25π).", check: () => nearlyEqual(area / Math.PI, 25, 0.8) },
  ];

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Arc & sector controls</h2>
        <Slider label="Radius r" value={r} min={2.4} max={7.2} step={0.1} onChange={setR} />
        <Slider label={units === "deg" ? "Central angle θ" : "Central angle θ"} value={theta} min={8} max={350} step={1} unit={units === "deg" ? "°" : ""} onChange={setTheta} />
        <div className="clab-seg" role="group" aria-label="Minor or major">
          <button type="button" className={!major ? "is-on" : ""} onClick={() => setMajor(false)}>Minor</button>
          <button type="button" className={major ? "is-on" : ""} onClick={() => setMajor(true)}>Major</button>
        </div>
        <div className="clab-seg" role="group" aria-label="Angle units">
          <button type="button" className={units === "deg" ? "is-on" : ""} onClick={() => setUnits("deg")}>Degrees</button>
          <button type="button" className={units === "rad" ? "is-on" : ""} onClick={() => setUnits("rad")}>Radians</button>
        </div>
        <Toggle label="Show formula" checked={showFormula} onChange={setShowFormula} />
        <Toggle label="Show labels" checked={labels} onChange={setLabels} />
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
        <CircleSvg ariaLabel="Arc and sector explorer" svgRef={svgRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <CircleOutline origin={O} radius={r} />
          <ArcPath origin={O} radius={r} startRad={toRad(aDeg)} endRad={toRad(aDeg + shown)} fill="rgba(8,185,221,.22)" />
          <ArcPath origin={O} radius={r} startRad={toRad(aDeg)} endRad={toRad(aDeg + shown)} color="#8b45f4" width={4} />
          <RadiusLine origin={O} point={A} />
          <RadiusLine origin={O} point={B} />
          <ChordLine a={A} b={B} color="#147df2" />
          <DraggablePoint point={O} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={A} label={labels ? "A" : undefined} dragId="A" />
          <DraggablePoint point={B} label={labels ? "B" : undefined} color="#f59e0b" dragId="B" />
          <DraggablePoint point={{ x: r, y: 0 }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live calculations</h2>
        <LiveRow color="#08b9dd" label="Circumference 2πr" value={fmt(C)} />
        <LiveRow color="#8b45f4" label="Arc length s" value={fmt(s)} />
        <LiveRow color="#147df2" label="Sector area" value={fmt(area)} />
        <LiveRow color="#f59e0b" label="Chord AB" value={fmt(chord)} />
        <LiveRow color="#10b981" label="Segment area" value={fmt(segment)} />
        <LiveRow color="#536381" label="θ" value={units === "deg" ? `${fmt(shown, 1)}°` : `${fmt(toRad(shown), 3)} rad`} />
        {showFormula ? (
          <FormulaCard title="Formulas">
            C = 2πr<br />
            s = (θ/360°) × 2πr<br />
            A = (θ/360°) × πr²<br />
            c = 2r sin(θ/2)
          </FormulaCard>
        ) : null}
        <PropertyCard title="Arc facts" items={[
          "Arc measure equals the central angle.",
          "Arc length is the fraction of the circumference.",
          "Sector area is the same fraction of the disk.",
          "A major sector is the complement of the minor sector.",
        ]} />
        <p className="clab-why">Why it works: a full turn is 360° of circumference 2πr and area πr². A sector is the proportional slice of that disk.</p>
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
