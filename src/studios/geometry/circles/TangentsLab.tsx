import { useState } from "react";
import {
  angleOf, dist, fmt, nearlyEqual, perp, pointOnCircle, tangentContactPoints, tangentLength, toDeg, toRad, type Vec,
} from "./circleMath";
import {
  ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, PresetButton, PropertyCard, RadiusLine, RightAngleMarker, Slider, TangentLine, Toggle, useSvgDrag,
} from "./primitives";

const O: Vec = { x: 0, y: 0 };

export default function TangentsLab() {
  const [r, setR] = useState(5);
  const [tDeg, setT] = useState(40);
  const [px, setPx] = useState(8.2);
  const [py, setPy] = useState(2.4);
  const [showRadius, setShowRadius] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [external, setExternal] = useState(true);
  const [showSecond, setShowSecond] = useState(true);
  const [showLen, setShowLen] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [preset, setPreset] = useState("two");
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [challenge, setChallenge] = useState(0);

  const T = pointOnCircle(O, r, toRad(tDeg));
  const tanDir = perp(T);
  const P = { x: px, y: py };
  const op = dist(O, P);
  const contacts = external ? tangentContactPoints(O, r, P) : [];
  const A = contacts[0];
  const B = contacts[1];
  const pt = tangentLength(r, op);
  const pa = A ? dist(P, A) : 0;
  const pb = B ? dist(P, B) : 0;

  const apply = (id: string) => {
    setPreset(id);
    if (id === "basic") { setExternal(false); setShowSecond(false); setT(35); setR(5); }
    if (id === "external") { setExternal(true); setShowSecond(false); setPx(8.4); setPy(1.2); }
    if (id === "two") { setExternal(true); setShowSecond(true); setPx(8.2); setPy(2.4); }
    if (id === "chord") { setExternal(false); setT(55); setShowRadius(true); }
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    if (id === "T") setT(toDeg(angleOf(math, O)));
    if (id === "P") { setPx(math.x); setPy(math.y); setExternal(true); }
    if (id === "R") setR(Math.max(2.4, Math.min(6.8, dist(O, math))));
  });

  const challenges = [
    { prompt: "Place P so the tangent length PT = 6.", check: () => nearlyEqual(pt, 6, 0.2) && op > r },
    { prompt: "Move T until OT is horizontal (angle ≈ 0°).", check: () => nearlyEqual(tDeg, 0, 6) || nearlyEqual(tDeg, 360, 6) },
  ];

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Tangent controls</h2>
        <Slider label="Radius" value={r} min={2.5} max={6.8} step={0.1} onChange={setR} />
        <Slider label="Tangency point" value={tDeg} min={-180} max={180} step={1} unit="°" onChange={setT} />
        <Toggle label="Show radius OT" checked={showRadius} onChange={setShowRadius} />
        <Toggle label="Show 90° marker" checked={showRight} onChange={setShowRight} />
        <Toggle label="External point mode" checked={external} onChange={setExternal} />
        <Toggle label="Show second tangent" checked={showSecond} onChange={setShowSecond} />
        <Toggle label="Show tangent lengths" checked={showLen} onChange={setShowLen} />
        <Toggle label="Show construction steps" checked={showSteps} onChange={setShowSteps} />
        <div className="clab-presets">
          <PresetButton label="Basic Tangent" active={preset === "basic"} onClick={() => apply("basic")} />
          <PresetButton label="Tangent from External Point" active={preset === "external"} onClick={() => apply("external")} />
          <PresetButton label="Two Tangents" active={preset === "two"} onClick={() => apply("two")} />
          <PresetButton label="Tangent–Chord Angle" active={preset === "chord"} onClick={() => apply("chord")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Tangent construction with contact point T" svgRef={svgRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <CircleOutline origin={O} radius={r} />
          {showRadius ? <RadiusLine origin={O} point={T} /> : null}
          <TangentLine point={T} direction={tanDir} />
          {showRight ? <RightAngleMarker origin={O} point={T} tangentDir={tanDir} /> : null}
          {external && A ? <RadiusLine origin={O} point={A} color="#94a3b8" /> : null}
          {external && A ? <ChordLine a={P} b={A} color="#f59e0b" /> : null}
          {external && showSecond && B ? <ChordLine a={P} b={B} color="#f59e0b" /> : null}
          <DraggablePoint point={O} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={T} label="T" color="#f59e0b" dragId="T" />
          {external ? <DraggablePoint point={P} label="P" color="#8b45f4" dragId="P" /> : null}
          {external && A ? <DraggablePoint point={A} label="A" color="#147df2" dragId="A" /> : null}
          {external && showSecond && B ? <DraggablePoint point={B} label="B" color="#147df2" dragId="B" /> : null}
          <DraggablePoint point={{ x: r, y: 0 }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live values</h2>
        <LiveRow color="#08b9dd" label="Radius r" value={fmt(r)} />
        <LiveRow color="#f59e0b" label="Tangent angle" value={`${fmt(tDeg, 1)}°`} />
        {external ? <LiveRow color="#8b45f4" label="Distance OP" value={fmt(op)} /> : null}
        {showLen ? <LiveRow color="#f59e0b" label="Tangent length √(OP²−r²)" value={fmt(pt)} /> : null}
        {external && A && showLen ? <LiveRow color="#147df2" label="PA" value={fmt(pa)} /> : null}
        {external && B && showLen ? <LiveRow color="#147df2" label="PB" value={fmt(pb)} /> : null}
        <FormulaCard title="Key relationship">
          Radius at the point of contact is perpendicular to the tangent.
          {external ? <div className="clab-note">PA = PB = {fmt(pa)} (equal tangents from P)</div> : null}
        </FormulaCard>
        <PropertyCard title="Tangent properties" items={[
          "A tangent touches the circle at exactly one point.",
          "The radius at the point of contact is perpendicular to the tangent.",
          "Tangents from the same external point are equal.",
          "Tangent–chord theorem: the angle between tangent and chord equals the angle in the alternate segment.",
        ]} />
        {showSteps ? <p className="clab-why">Why it works: OT is a radius, so any tangent at T is the unique line through T orthogonal to OT. From P, the two right triangles OAP and OBP share hypotenuse OP and leg r, so PA = PB.</p> : null}
        <p className="clab-world">Real world: belt drives and gear envelopes meet a wheel along a tangent; belt length uses the same √(d² − r²) formula.</p>
        <ChallengeCard
          prompt={challenges[challenge].prompt}
          status={status}
          onCheck={() => setStatus(challenges[challenge].check() ? "pass" : "fail")}
          onReset={() => { apply("two"); setStatus("idle"); }}
          onNew={() => { setChallenge((i) => (i + 1) % challenges.length); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
