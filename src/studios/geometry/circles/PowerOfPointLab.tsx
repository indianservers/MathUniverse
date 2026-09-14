import { useEffect, useMemo, useState } from "react";
import {
  chordThroughPoint, clamp, constrainInside, constrainOutside, dist, fmt, nearlyEqual, powerOfPoint, radicalAxisX, tangentContactPoints, tangentLength,
} from "./circleMath";
import { parsePowerKind, type PowerKind } from "./circleMode";
import { useCircleSession, usePersisted } from "./CircleSession";
import {
  ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FilledTriangle, FormulaCard, LengthBadge, LiveRow, MathLine, PresetButton, PropertyCard, Slider, Toggle, WorkedCard, useSvgDrag,
} from "./primitives";

const SUB: Array<{ id: PowerKind; label: string }> = [
  { id: "chord", label: "Chord × Chord" },
  { id: "secant", label: "Secant × Secant" },
  { id: "tangent", label: "Tangent × Secant" },
  { id: "radical", label: "Radical Axis" },
];

export default function PowerOfPointLab() {
  const { r, setR, origin, setOrigin, teacher, unitLabel, kind, setKind, registerUndo } = useCircleSession();
  const sub = parsePowerKind(kind || "chord");
  const [px, setPx] = usePersisted("pow.px", 1.2);
  const [py, setPy] = usePersisted("pow.py", 0.8);
  const [dir1, setDir1] = usePersisted("pow.d1", 22);
  const [dir2, setDir2] = usePersisted("pow.d2", 78);
  const [r2, setR2] = usePersisted("pow.r2", 4.2);
  const [c2x, setC2x] = usePersisted("pow.c2", 6.4);
  const [labels, setLabels] = usePersisted("pow.lab", true);
  const [meas, setMeas] = usePersisted("pow.meas", true);
  const [lines, setLines] = usePersisted("pow.lines", true);
  const [similar, setSimilar] = usePersisted("pow.sim", true);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);
  const [focused, setFocused] = useState<string | null>("P");

  useEffect(() => { registerUndo(() => { setKind("chord"); setPx(1.2); setPy(0.8); }); }, [registerUndo, setKind, setPx, setPy]);

  const P = useMemo(() => {
    const raw = { x: origin.x + px, y: origin.y + py };
    if (sub === "chord") return constrainInside(origin, r, raw);
    if (sub === "radical") return raw;
    return constrainOutside(origin, r, raw);
  }, [origin, px, py, r, sub]);

  const chord1 = chordThroughPoint(origin, r, P, (dir1 * Math.PI) / 180);
  const chord2 = chordThroughPoint(origin, r, P, (dir2 * Math.PI) / 180);
  const contacts = tangentContactPoints(origin, r, P);
  const T = contacts[0];
  const power = powerOfPoint(origin, r, P);
  const pa = chord1?.pa ?? 0;
  const pb = chord1?.pb ?? 0;
  const pc = chord2?.pa ?? 0;
  const pd = chord2?.pb ?? 0;
  const left = pa * pb;
  const right = pc * pd;
  const pt = T ? dist(P, T) : tangentLength(r, dist(origin, P));
  const tanSec = pt * pt;
  const O2 = { x: origin.x + c2x, y: origin.y };
  const axisX = radicalAxisX(origin, r, O2, r2);

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    if (id === "O") setOrigin(math);
    if (id === "P") {
      const q = sub === "chord" ? constrainInside(origin, r, math) : sub === "radical" ? math : constrainOutside(origin, r, math);
      setPx(q.x - origin.x); setPy(q.y - origin.y);
    }
    if (id === "R") setR(clamp(dist(origin, math), 2.6, 6.6));
    if (id === "A" && chord1) setDir1((Math.atan2(math.y - P.y, math.x - P.x) * 180) / Math.PI);
    if (id === "C" && chord2) setDir2((Math.atan2(math.y - P.y, math.x - P.x) * 180) / Math.PI);
    if (id === "O2") setC2x(math.x - origin.x);
  }, setFocused);

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Power controls</h2>
        <div className="clab-seg" role="group" aria-label="Power mode">
          {SUB.map((item) => (
            <button key={item.id} type="button" className={sub === item.id ? "is-on" : ""} onClick={() => setKind(item.id)}>{item.label}</button>
          ))}
        </div>
        <Slider label={`Radius (${unitLabel})`} value={r} min={2.6} max={6.6} step={0.1} onChange={setR} />
        <Slider label="Distance of P from O" value={Math.hypot(px, py)} min={0.2} max={10} step={0.1} onChange={(d) => {
          const ang = Math.atan2(py, px);
          setPx(d * Math.cos(ang)); setPy(d * Math.sin(ang));
        }} />
        {sub === "radical" ? <Slider label="Second radius" value={r2} min={2} max={6} step={0.1} onChange={setR2} /> : null}
        <Toggle label="Show labels" checked={labels} onChange={setLabels} />
        <Toggle label="Show measurements" checked={meas} onChange={setMeas} />
        <Toggle label="Show construction lines" checked={lines} onChange={setLines} />
        <Toggle label="Similar-triangles overlay" checked={similar} onChange={setSimilar} />
        <div className="clab-presets">
          <PresetButton label="Intersecting chords" onClick={() => { setKind("chord"); setPx(1.1); setPy(0.6); }} />
          <PresetButton label="Two secants" onClick={() => { setKind("secant"); setPx(7.6); setPy(2.2); }} />
          <PresetButton label="Tangent-secant" onClick={() => { setKind("tangent"); setPx(8); setPy(1.4); }} />
          <PresetButton label="Two circles" onClick={() => { setKind("radical"); setPx(3.2); setPy(0); }} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Power of a point laboratory" svgRef={svgRef} unitLabel={unitLabel} focused={focused} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onKeyMove={(id, dx, dy) => {
          if (id === "P") { setPx(px + dx); setPy(py + dy); }
        }}>
          <CircleOutline origin={origin} radius={r} />
          {sub === "radical" ? <CircleOutline origin={O2} radius={r2} color="#8b45f4" /> : null}
          {sub === "radical" ? <ChordLine a={{ x: axisX, y: origin.y - 6 }} b={{ x: axisX, y: origin.y + 6 }} color="#f59e0b" dashed /> : null}
          {chord1 && lines && sub !== "radical" ? <ChordLine a={chord1.a} b={chord1.b} /> : null}
          {chord2 && lines && sub !== "tangent" && sub !== "radical" ? <ChordLine a={chord2.a} b={chord2.b} color="#8b45f4" /> : null}
          {sub === "tangent" && T ? <ChordLine a={P} b={T} color="#f59e0b" /> : null}
          {similar && chord1 && chord2 && sub === "chord" ? (
            <>
              <FilledTriangle a={P} b={chord1.a} c={chord2.a} color="rgba(20,125,242,.16)" />
              <FilledTriangle a={P} b={chord1.b} c={chord2.b} color="rgba(139,69,244,.16)" />
            </>
          ) : null}
          {Math.abs(left - 30) < 1.2 && sub !== "tangent" ? <LengthBadge a={P} b={chord1?.a ?? P} text="product 30" color="#10b981" /> : null}
          {chord1 && sub !== "radical" ? <DraggablePoint point={chord1.a} label={labels ? "A" : undefined} dragId="A" /> : null}
          {chord1 && sub !== "radical" ? <DraggablePoint point={chord1.b} label={labels ? "B" : undefined} color="#f59e0b" dragId="B" /> : null}
          {chord2 && sub !== "tangent" && sub !== "radical" ? <DraggablePoint point={chord2.a} label={labels ? "C" : undefined} color="#8b45f4" dragId="C" /> : null}
          {chord2 && sub !== "tangent" && sub !== "radical" ? <DraggablePoint point={chord2.b} label={labels ? "D" : undefined} color="#8b45f4" dragId="D" /> : null}
          {T && sub === "tangent" ? <DraggablePoint point={T} label="T" color="#f59e0b" dragId="T" /> : null}
          <DraggablePoint point={origin} label="O" color="#0f2747" dragId="O" />
          {sub === "radical" ? <DraggablePoint point={O2} label="O₂" color="#8b45f4" dragId="O2" /> : null}
          <DraggablePoint point={P} label="P" color="#10b981" dragId="P" />
          <DraggablePoint point={{ x: origin.x + r, y: origin.y }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Power of P</h2>
        <LiveRow color="#8b45f4" label="Power OP² − r²" value={fmt(power)} hidden={teacher} />
        {meas && sub !== "tangent" && sub !== "radical" ? (
          <>
            <LiveRow color="#147df2" label="PA × PB" value={`${fmt(pa)} × ${fmt(pb)} = ${fmt(left)}`} hidden={teacher} />
            <LiveRow color="#8b45f4" label="PC × PD" value={`${fmt(pc)} × ${fmt(pd)} = ${fmt(right)}`} hidden={teacher} />
          </>
        ) : null}
        {meas && sub === "tangent" && chord1 ? (
          <>
            <LiveRow color="#f59e0b" label="PT²" value={`${fmt(pt)}² = ${fmt(tanSec)}`} hidden={teacher} />
            <LiveRow color="#147df2" label="PA × PB" value={`${fmt(pa)} × ${fmt(pb)} = ${fmt(left)}`} hidden={teacher} />
          </>
        ) : null}
        {sub === "radical" ? <LiveRow color="#f59e0b" label="Radical axis x" value={fmt(axisX)} hidden={teacher} /> : null}
        <FormulaCard title="Key relationship" hidden={teacher}>
          {sub === "tangent" ? "PT² = PA × PB" : sub === "radical" ? "Points with equal power lie on the radical axis." : "PA × PB = PC × PD"}
          <MathLine tex={sub === "tangent" ? "PT^2 = PA \\cdot PB" : sub === "radical" ? "OP^2 - r^2 = O_2P^2 - r_2^2" : "PA \\cdot PB = PC \\cdot PD"} />
        </FormulaCard>
        <WorkedCard hidden={teacher} lines={sub === "tangent"
          ? [`${fmt(tanSec)} = ${fmt(left)}`]
          : sub === "radical"
            ? [`Power vs O: ${fmt(power)}`, `Power vs O₂: ${fmt(powerOfPoint(O2, r2, P))}`]
            : [`${fmt(pa)} × ${fmt(pb)} = ${fmt(left)}`, `${fmt(pc)} × ${fmt(pd)} = ${fmt(right)}`]} />
        <PropertyCard title="Power theorems" items={[
          "Intersecting chords: PA × PB = PC × PD.",
          "Two secants from P: (outer) × (whole) = (outer) × (whole).",
          "Tangent-secant: PT² = PA × PB.",
          "The radical axis is the locus of equal power with respect to two circles.",
        ]} />
        <p className="clab-why">Why it works: similar triangles at P share an angle, so corresponding side ratios multiply to the same product — the power of P.</p>
        <p className="clab-world">Mechanical design and inversion geometry keep segment products invariant as a linkage moves.</p>
        <ChallengeCard
          prompt="Adjust P until both products equal 30 (within 1.2)."
          status={status}
          onCheck={() => setStatus(nearlyEqual(left, 30, 1.2) && (sub === "tangent" || nearlyEqual(right, 30, 1.2)) ? "pass" : "fail")}
          onReset={() => { setKind("chord"); setPx(1.2); setPy(0.8); setStatus("idle"); }}
          onNew={() => { setKind("secant"); setPx(7.5); setPy(2); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
