import { useMemo, useState } from "react";
import {
  chordThroughPoint, dist, fmt, nearlyEqual, powerOfPoint, tangentContactPoints, tangentLength, type Vec,
} from "./circleMath";
import {
  ChallengeCard, ChordLine, CircleOutline, CircleSvg, DraggablePoint, FormulaCard, LiveRow, PresetButton, PropertyCard, Slider, Toggle, useSvgDrag,
} from "./primitives";

const O: Vec = { x: 0, y: 0 };
const SUB = [
  { id: "chord", label: "Chord × Chord" },
  { id: "secant", label: "Secant × Secant" },
  { id: "tangent", label: "Tangent × Secant" },
];

export default function PowerOfPointLab() {
  const [r, setR] = useState(5);
  const [sub, setSub] = useState("chord");
  const [px, setPx] = useState(1.2);
  const [py, setPy] = useState(0.8);
  const [dir1, setDir1] = useState(22);
  const [dir2, setDir2] = useState(78);
  const [labels, setLabels] = useState(true);
  const [meas, setMeas] = useState(true);
  const [lines, setLines] = useState(true);
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");
  const [collapsed, setCollapsed] = useState(false);

  const P = useMemo(() => {
    if (sub === "chord") {
      const d = Math.min(Math.hypot(px, py), r * 0.85);
      const ang = Math.atan2(py, px);
      return { x: d * Math.cos(ang), y: d * Math.sin(ang) };
    }
    const d = Math.max(Math.hypot(px, py), r + 1.2);
    const ang = Math.atan2(py, px);
    return { x: d * Math.cos(ang), y: d * Math.sin(ang) };
  }, [px, py, r, sub]);

  const chord1 = chordThroughPoint(O, r, P, (dir1 * Math.PI) / 180);
  const chord2 = chordThroughPoint(O, r, P, (dir2 * Math.PI) / 180);
  const contacts = tangentContactPoints(O, r, P);
  const T = contacts[0];
  const power = powerOfPoint(O, r, P);
  const pa = chord1?.pa ?? 0;
  const pb = chord1?.pb ?? 0;
  const pc = chord2?.pa ?? 0;
  const pd = chord2?.pb ?? 0;
  const left = pa * pb;
  const right = pc * pd;
  const pt = T ? dist(P, T) : tangentLength(r, dist(O, P));
  const tanSec = pt * pt;

  const { svgRef, onPointerDown, onPointerMove, onPointerUp } = useSvgDrag((id, math) => {
    if (id === "P") { setPx(math.x); setPy(math.y); }
    if (id === "R") setR(Math.max(2.6, Math.min(6.6, Math.hypot(math.x, math.y))));
    if (id === "A" && chord1) setDir1((Math.atan2(math.y - P.y, math.x - P.x) * 180) / Math.PI);
    if (id === "C" && chord2) setDir2((Math.atan2(math.y - P.y, math.x - P.x) * 180) / Math.PI);
  });

  return (
    <div className="clab-workspace">
      <aside className={`clab-col clab-controls ${collapsed ? "is-collapsed" : ""}`}>
        <button type="button" className="clab-mobile-toggle" onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Show controls" : "Hide controls"}</button>
        <h2>Power controls</h2>
        <div className="clab-seg" role="group" aria-label="Power mode">
          {SUB.map((item) => (
            <button key={item.id} type="button" className={sub === item.id ? "is-on" : ""} onClick={() => setSub(item.id)}>{item.label}</button>
          ))}
        </div>
        <Slider label="Radius" value={r} min={2.6} max={6.6} step={0.1} onChange={setR} />
        <Slider label="External / interior distance" value={Math.hypot(px, py)} min={0.2} max={10} step={0.1} onChange={(d) => {
          const ang = Math.atan2(py, px);
          setPx(d * Math.cos(ang));
          setPy(d * Math.sin(ang));
        }} />
        <Toggle label="Show labels" checked={labels} onChange={setLabels} />
        <Toggle label="Show measurements" checked={meas} onChange={setMeas} />
        <Toggle label="Show construction lines" checked={lines} onChange={setLines} />
        <div className="clab-presets">
          <PresetButton label="Intersecting chords" onClick={() => { setSub("chord"); setPx(1.1); setPy(0.6); }} />
          <PresetButton label="Two secants" onClick={() => { setSub("secant"); setPx(7.6); setPy(2.2); }} />
          <PresetButton label="Tangent-secant" onClick={() => { setSub("tangent"); setPx(8); setPy(1.4); }} />
        </div>
      </aside>
      <section className="clab-col clab-viz">
        <CircleSvg ariaLabel="Power of a point laboratory" svgRef={svgRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <CircleOutline origin={O} radius={r} />
          {chord1 && lines ? <ChordLine a={chord1.a} b={chord1.b} /> : null}
          {chord2 && lines && sub !== "tangent" ? <ChordLine a={chord2.a} b={chord2.b} color="#8b45f4" /> : null}
          {sub === "tangent" && T ? <ChordLine a={P} b={T} color="#f59e0b" /> : null}
          {chord1 ? <DraggablePoint point={chord1.a} label={labels ? "A" : undefined} dragId="A" /> : null}
          {chord1 ? <DraggablePoint point={chord1.b} label={labels ? "B" : undefined} color="#f59e0b" dragId="B" /> : null}
          {chord2 && sub !== "tangent" ? <DraggablePoint point={chord2.a} label={labels ? "C" : undefined} color="#8b45f4" dragId="C" /> : null}
          {chord2 && sub !== "tangent" ? <DraggablePoint point={chord2.b} label={labels ? "D" : undefined} color="#8b45f4" dragId="D" /> : null}
          {T && sub === "tangent" ? <DraggablePoint point={T} label="T" color="#f59e0b" dragId="T" /> : null}
          <DraggablePoint point={O} label="O" color="#0f2747" dragId="O" />
          <DraggablePoint point={P} label="P" color="#10b981" dragId="P" />
          <DraggablePoint point={{ x: r, y: 0 }} label="r" color="#08b9dd" dragId="R" />
        </CircleSvg>
      </section>
      <aside className="clab-col clab-insights">
        <h2>Power of P</h2>
        <LiveRow color="#8b45f4" label="Power OP² − r²" value={fmt(power)} />
        {meas && sub !== "tangent" ? (
          <>
            <LiveRow color="#147df2" label="PA × PB" value={`${fmt(pa)} × ${fmt(pb)} = ${fmt(left)}`} />
            <LiveRow color="#8b45f4" label="PC × PD" value={`${fmt(pc)} × ${fmt(pd)} = ${fmt(right)}`} />
          </>
        ) : null}
        {meas && sub === "tangent" && chord1 ? (
          <>
            <LiveRow color="#f59e0b" label="PT²" value={`${fmt(pt)}² = ${fmt(tanSec)}`} />
            <LiveRow color="#147df2" label="PA × PB" value={`${fmt(pa)} × ${fmt(pb)} = ${fmt(left)}`} />
          </>
        ) : null}
        <FormulaCard title="Key relationship">
          {sub === "tangent" ? "PT² = PA × PB" : "PA × PB = PC × PD"}
          <div className="clab-note">
            {sub === "tangent"
              ? `${fmt(tanSec)} = ${fmt(left)}`
              : `${fmt(left)} = ${fmt(right)}`}
          </div>
        </FormulaCard>
        <PropertyCard title="Power theorems" items={[
          "Intersecting chords: PA × PB = PC × PD.",
          "Two secants from P: (outer) × (whole) = (outer) × (whole).",
          "Tangent-secant: PT² = PA × PB.",
          "All three are the same signed power of P relative to the circle.",
        ]} />
        <p className="clab-why">Why it works: similar triangles formed by the intersecting lines share an angle at P (or a tangent-chord angle), so corresponding side ratios multiply to the same product.</p>
        <p className="clab-world">Mechanical design and inversion geometry use power of a point to keep products of segments invariant as a linkage moves.</p>
        <ChallengeCard
          prompt="Adjust P until both products equal 30 (within 1.2)."
          status={status}
          onCheck={() => setStatus(nearlyEqual(left, 30, 1.2) && nearlyEqual(right, 30, 1.2) ? "pass" : "fail")}
          onReset={() => { setSub("chord"); setPx(1.2); setPy(0.8); setStatus("idle"); }}
          onNew={() => { setSub("secant"); setPx(7.5); setPy(2); setStatus("idle"); }}
        />
      </aside>
    </div>
  );
}
