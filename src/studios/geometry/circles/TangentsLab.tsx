import { useEffect, useState } from "react";
import {
  angleBetween, angleOf, clamp, constrainOnCircle, constrainOutside, dist, fmt, nearlyEqual, perp, pointOnCircle, tangentContactPoints, tangentLength, toDeg, toRad, type Vec,
} from "./circleMath";
import { useCircleSession, usePersisted } from "./CircleSession";
import {
  AngleMarker, ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, MathLine, PresetButton, PropertyCard, RadiusLine, RightAngleMarker, Slider, TangentLine, Toggle, WorkedCard, useSvgDrag,
} from "./primitives";

export default function TangentsLab() {
  const { r, setR, origin, setOrigin, snapA, teacher, unitLabel, pushUndo, registerUndo, setAnnounce } = useCircleSession();
  const [tDeg, setT] = usePersisted("tan.t", 40);
  const [px, setPx] = usePersisted("tan.px", 8.2);
  const [py, setPy] = usePersisted("tan.py", 2.4);
  const [showRadius, setShowRadius] = usePersisted("tan.sr", true);
  const [showRight, setShowRight] = usePersisted("tan.right", true);
  const [external, setExternal] = usePersisted("tan.ext", true);
  const [showSecond, setShowSecond] = usePersisted("tan.s2", true);
  const [showLen, setShowLen] = usePersisted("tan.len", true);
  const [showSteps, setShowSteps] = usePersisted("tan.steps", true);
  const [altSeg, setAlt] = usePersisted("tan.alt", false);
  const [preset, setPreset] = usePersisted("tan.preset", "two");
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [challenge, setChallenge] = usePersisted("tan.ch", 0);
  const [collapsed, setCollapsed] = useState(false);
  const [focused, setFocused] = useState<string | null>("P");

  const T = pointOnCircle(origin, r, toRad(tDeg));
  const tanDir = perp({ x: T.x - origin.x, y: T.y - origin.y });
  const P = { x: origin.x + px, y: origin.y + py };
  const op = dist(origin, P);
  const contacts = external ? tangentContactPoints(origin, r, P) : [];
  const A = contacts[0];
  const B = contacts[1];
  const contact = external && A ? A : T;
  const pt = tangentLength(r, op);
  const pa = A ? dist(P, A) : 0;
  const pb = B ? dist(P, B) : 0;
  const chordPt = pointOnCircle(origin, r, toRad(tDeg + 70));
  const tanChord = toDeg(angleBetween(P, T, chordPt));
  const altAngle = toDeg(angleBetween(T, chordPt, pointOnCircle(origin, r, toRad(tDeg + 200))));

  const apply = (id: string) => {
    pushUndo(() => { setT(40); setPx(8.2); setPy(2.4); setExternal(true); });
    setPreset(id);
    if (id === "basic") { setExternal(false); setShowSecond(false); setAlt(false); setT(35); }
    if (id === "external") { setExternal(true); setShowSecond(false); setAlt(false); setPx(8.4); setPy(1.2); }
    if (id === "two") { setExternal(true); setShowSecond(true); setAlt(false); setPx(8.2); setPy(2.4); }
    if (id === "chord") { setExternal(false); setAlt(true); setT(55); setShowRadius(true); }
  };
  useEffect(() => { registerUndo(() => apply("two")); }, [registerUndo]);

  const movePoint = (id: string, math: Vec) => {
    if (id === "O") setOrigin(math);
    if (id === "T") setT(snapA(toDeg(angleOf(constrainOnCircle(origin, r, math), origin))));
    if (id === "P") {
      const q = constrainOutside(origin, r, math);
      setPx(q.x - origin.x); setPy(q.y - origin.y); setExternal(true);
    }
    if (id === "R") setR(clamp(dist(origin, math), 2.4, 6.8));
  };

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => movePoint(id, math), setFocused);
  const ghostR = Math.sqrt(r * r + 36);

  const challenges = [
    { prompt: "Place P so the tangent length PT = 6.", check: () => nearlyEqual(pt, 6, 0.2) && op > r },
    { prompt: "Move T until OT is horizontal (angle ≈ 0°).", check: () => nearlyEqual(tDeg, 0, 6) || nearlyEqual(Math.abs(tDeg), 360, 6) },
  ];

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Tangent controls</h2>
        <Slider label={`Radius (${unitLabel})`} value={r} min={2.5} max={6.8} step={0.1} onChange={setR} />
        <Slider label="Tangency point" value={tDeg} min={-180} max={180} step={1} unit="°" onChange={(n) => setT(snapA(n))} />
        <Toggle label="Show radius OT" checked={showRadius} onChange={setShowRadius} />
        <Toggle label="Show 90° marker" checked={showRight} onChange={setShowRight} />
        <Toggle label="External point mode" checked={external} onChange={setExternal} />
        <Toggle label="Show second tangent" checked={showSecond} onChange={setShowSecond} />
        <Toggle label="Show tangent lengths" checked={showLen} onChange={setShowLen} />
        <Toggle label="Alternate-segment theorem" checked={altSeg} onChange={setAlt} />
        <Toggle label="Show construction steps" checked={showSteps} onChange={setShowSteps} />
        <div className="clab-presets">
          <PresetButton label="Basic Tangent" active={preset === "basic"} onClick={() => apply("basic")} />
          <PresetButton label="Tangent from External Point" active={preset === "external"} onClick={() => apply("external")} />
          <PresetButton label="Two Tangents" active={preset === "two"} onClick={() => apply("two")} />
          <PresetButton label="Tangent–Chord Angle" active={preset === "chord"} onClick={() => apply("chord")} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Tangent construction with contact point T" svgRef={svgRef} unitLabel={unitLabel} focused={focused} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onKeyMove={(id, dx, dy) => {
          const p = id === "T" ? T : id === "P" ? P : id === "O" ? origin : { x: origin.x + r, y: origin.y };
          movePoint(id, { x: p.x + dx, y: p.y + dy });
        }}>
          <CircleOutline origin={origin} radius={r} />
          {challenge === 0 ? <CircleOutline origin={origin} radius={ghostR} dashed color="#f59e0b" /> : null}
          {showRadius ? <RadiusLine origin={origin} point={contact} /> : null}
          {!external ? <TangentLine point={T} direction={tanDir} /> : null}
          {!external && showRight ? <RightAngleMarker origin={origin} point={T} tangentDir={tanDir} /> : null}
          {external && A ? <RadiusLine origin={origin} point={A} color="#94a3b8" /> : null}
          {external && A ? <ChordLine a={P} b={A} color="#f59e0b" /> : null}
          {external && showSecond && B ? <ChordLine a={P} b={B} color="#f59e0b" /> : null}
          {external && A && showRight ? <RightAngleMarker origin={origin} point={A} tangentDir={perp({ x: A.x - origin.x, y: A.y - origin.y })} /> : null}
          {altSeg ? <ChordLine a={T} b={chordPt} color="#8b45f4" /> : null}
          {altSeg ? <AngleMarker vertex={T} from={P} to={chordPt} color="#f59e0b" /> : null}
          {altSeg ? <AngleMarker vertex={chordPt} from={T} to={pointOnCircle(origin, r, toRad(tDeg + 200))} color="#8b45f4" /> : null}
          <DraggablePoint point={origin} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={T} label="T" color="#f59e0b" dragId="T" />
          {external ? <DraggablePoint point={P} label="P" color="#8b45f4" dragId="P" /> : null}
          {external && A ? <DraggablePoint point={A} label="A" color="#147df2" dragId="A" /> : null}
          {external && showSecond && B ? <DraggablePoint point={B} label="B" color="#147df2" dragId="B" /> : null}
          <DraggablePoint point={{ x: origin.x + r, y: origin.y }} dragId="R" color="#08b9dd" title="Radius handle" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Live values</h2>
        <LiveRow color="#08b9dd" label={`Radius r (${unitLabel})`} value={fmt(r)} hidden={teacher} />
        <LiveRow color="#f59e0b" label="Tangent angle" value={`${fmt(tDeg, 1)}°`} hidden={teacher} />
        {external ? <LiveRow color="#8b45f4" label="Distance OP" value={fmt(op)} hidden={teacher} /> : null}
        {showLen ? <LiveRow color="#f59e0b" label="Tangent length" value={fmt(pt)} hidden={teacher} /> : null}
        {external && A && showLen ? <LiveRow color="#147df2" label="PA" value={fmt(pa)} hidden={teacher} /> : null}
        {external && B && showLen ? <LiveRow color="#147df2" label="PB" value={fmt(pb)} hidden={teacher} /> : null}
        <FormulaCard title="Key relationship" hidden={teacher}>
          Radius at the point of contact is perpendicular to the tangent.
          <MathLine tex="PT = \sqrt{OP^2 - r^2}" />
          {altSeg ? <div className="clab-note">Tangent–chord {fmt(tanChord, 1)}° vs alternate segment {fmt(altAngle, 1)}°.</div> : null}
        </FormulaCard>
        <WorkedCard hidden={teacher} lines={external ? [
          `PA = ${fmt(pa)}, PB = ${fmt(pb)}`,
          `√(OP² − r²) = ${fmt(pt)}`,
        ] : [`OT ⟂ tangent at T`]} />
        <PropertyCard title="Tangent properties" items={[
          "A tangent touches the circle at exactly one point.",
          "The radius at the point of contact is perpendicular to the tangent.",
          "Tangents from the same external point are equal.",
          "Tangent–chord theorem: the angle between tangent and chord equals the angle in the alternate segment.",
        ]} />
        {showSteps ? <p className="clab-why">Why it works: OT ⟂ tangent, and right triangles OAP and OBP share hypotenuse OP and leg r, so PA = PB.</p> : null}
        <p className="clab-world">Real world: belt drives meet a wheel along a tangent; belt length uses √(d² − r²).</p>
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
