import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { ChipRow, Field, Panel, Segmented } from "../../mockup/studioLabKit";
import { useGeoLabUi } from "../geometryLabUx";
import { readGeoSession, writeGeoSession } from "../geometryStudioSession";
import {
  EXPLORER_PRESETS,
  altitudeFoot,
  angleBisectorDir,
  clampPoint,
  defaultPlane,
  fromSvg,
  lineIntersection,
  measureTriangle,
  midpoint,
  perpendicularBisector,
  toSvg,
  triangleArea,
  type TrianglePts,
} from "./triangleGeometry";
import {
  applyLock,
  encodeLayers,
  encodeTriangle,
  nudgePoint,
  parseLayers,
  parseSnap,
  parseTriangle,
  setSideLength,
  snapPoint,
  type LockMode,
  type SnapMode,
} from "./triangleFigureState";
import { ChallengeCard, FormulaCard, InsightStack, LabFrame, MeasureRow, Toggle, okNum } from "./triangleLabKit";
import {
  AngleArc,
  DashedLine,
  DraggableVertex,
  GridLayer,
  RightAngleMarker,
  SideMeasurement,
  SolidLine,
  bindSvgDrag,
  pointerToSvg,
  polyPoints,
} from "./triangleSvgPrimitives";

type Sub = "explore" | "area" | "angles" | "special";
type Base = "AB" | "BC" | "CA";

const SPECIAL: Record<string, TrianglePts> = {
  "30-60-90": { B: { x: 2, y: 1.6 }, C: { x: 2 + 4 * Math.sqrt(3), y: 1.6 }, A: { x: 2, y: 5.6 } },
  "45-45-90": { B: { x: 2.4, y: 1.6 }, C: { x: 8.4, y: 1.6 }, A: { x: 2.4, y: 7.6 } },
  "3-4-5": { B: { x: 2, y: 1.5 }, C: { x: 8, y: 1.5 }, A: { x: 2, y: 6.5 } },
};

const PRESET_IDS = ["scalene", "isosceles", "equilateral", "right", "acute", "obtuse"] as const;

function PresetThumb({ id }: { id: string }) {
  const tri = EXPLORER_PRESETS[id] ?? EXPLORER_PRESETS.scalene;
  const pts = [tri.A, tri.B, tri.C].map((p) => `${8 + p.x * 3},${40 - p.y * 3}`).join(" ");
  return (
    <span className="tri-preset-thumb">
      <svg viewBox="0 0 48 44" aria-hidden="true"><polygon points={pts} fill="#dbeafe" stroke="#147df2" strokeWidth="1.4" /></svg>
      {id[0]!.toUpperCase() + id.slice(1)}
    </span>
  );
}

export default function TriangleExplorerLab({ pulse = "observe" }: { pulse?: string }) {
  const reducedMotion = useReducedMotion();
  const ui = useGeoLabUi();
  const plane = defaultPlane();
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"A" | "B" | "C" | null>(null);
  const triRef = useRef<TrianglePts>(EXPLORER_PRESETS.scalene);
  const panDrag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [params, setParams] = useSearchParams();
  const [tri, setTri] = useState<TrianglePts>(() => parseTriangle(params.get("t")) ?? EXPLORER_PRESETS.scalene);
  const [preset, setPreset] = useState("scalene");
  const [sub, setSub] = useState<Sub>("explore");
  const [base, setBase] = useState<Base>("BC");
  const [layers, setLayers] = useState(() => parseLayers(params.get("layers")) ?? {
    sides: true, angles: true, altitudes: false, median: false, bisector: false, perp: false, grid: true, coords: false, arcs: true,
  });
  const [anim, setAnim] = useState(false);
  const [areaFormula, setAreaFormula] = useState("bh");
  const [snap, setSnap] = useState<SnapMode>(() => parseSnap(params.get("snap")));
  const [lock, setLock] = useState<LockMode>("none");
  const [selected, setSelected] = useState<"A" | "B" | "C">("C");
  const [history, setHistory] = useState<TrianglePts[]>([parseTriangle(params.get("t")) ?? EXPLORER_PRESETS.scalene]);
  const [histIndex, setHistIndex] = useState(0);
  const [coach, setCoach] = useState(() => !readGeoSession().coachDismissed);
  const [warn, setWarn] = useState("");

  const m = useMemo(() => measureTriangle(tri.A, tri.B, tri.C), [tri]);
  triRef.current = tri;
  const basePts = base === "AB" ? [tri.A, tri.B, tri.C] : base === "BC" ? [tri.B, tri.C, tri.A] : [tri.C, tri.A, tri.B];
  const foot = altitudeFoot(basePts[2], basePts[0], basePts[1]);
  const height = Math.hypot(basePts[2].x - foot.x, basePts[2].y - foot.y);
  const baseLen = Math.hypot(basePts[1].x - basePts[0].x, basePts[1].y - basePts[0].y);
  const midBC = midpoint(tri.B, tri.C);
  const footA = altitudeFoot(tri.A, tri.B, tri.C);
  const footB = altitudeFoot(tri.B, tri.A, tri.C);
  const footC = altitudeFoot(tri.C, tri.A, tri.B);
  const aSvg = toSvg(plane, tri.A);
  const bSvg = toSvg(plane, tri.B);
  const cSvg = toSvg(plane, tri.C);
  const bis = lineIntersection(tri.A, angleBisectorDir(tri.A, tri.B, tri.C), tri.B, { x: tri.C.x - tri.B.x, y: tri.C.y - tri.B.y });
  const pb = perpendicularBisector(tri.B, tri.C);
  const hover = ui?.highlight;

  const commit = (next: TrianglePts, fromHistory = false) => {
    setTri(next);
    if (fromHistory) return;
    setHistory((stack) => {
      const clipped = stack.slice(0, histIndex + 1);
      const merged = [...clipped, next].slice(-40);
      setHistIndex(merged.length - 1);
      return merged;
    });
  };

  useEffect(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("t", encodeTriangle(tri));
      next.set("layers", encodeLayers(layers));
      if (snap === "off") next.delete("snap");
      else next.set("snap", snap);
      return next;
    }, { replace: true });
  }, [layers, setParams, snap, tri]);

  useEffect(() => {
    if (!anim || reducedMotion) return;
    const origin = { ...tri.C };
    let t = 0;
    let id = 0;
    const tick = () => {
      t += 0.018;
      setTri((prev) => ({ ...prev, C: clampPoint({ x: origin.x + Math.sin(t) * 1.8, y: origin.y + Math.cos(t * 0.7) * 0.35 }) }));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [anim, reducedMotion]);

  useEffect(() => {
    if (pulse === "why") setSub("area");
    if (pulse === "observe") setSub("explore");
    if (pulse === "understand") {
      setSub("angles");
      setAnim(false);
    }
    if (pulse === "try") {
      setPreset("isosceles");
      commit(EXPLORER_PRESETS.isosceles ?? EXPLORER_PRESETS.scalene);
      setAnim(false);
    }
    if (pulse === "challenge") {
      setSub("angles");
      document.getElementById("tri-challenge")?.scrollIntoView({ block: "nearest" });
    }
  }, [pulse]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      const step = event.shiftKey ? 0.4 : 0.15;
      if (event.key === "ArrowLeft") { event.preventDefault(); commit({ ...tri, [selected]: nudgePoint(tri[selected], -step, 0) }); }
      if (event.key === "ArrowRight") { event.preventDefault(); commit({ ...tri, [selected]: nudgePoint(tri[selected], step, 0) }); }
      if (event.key === "ArrowUp") { event.preventDefault(); commit({ ...tri, [selected]: nudgePoint(tri[selected], 0, step) }); }
      if (event.key === "ArrowDown") { event.preventDefault(); commit({ ...tri, [selected]: nudgePoint(tri[selected], 0, -step) }); }
      if ((event.key === "z" || event.key === "Z") && !event.ctrlKey && !event.metaKey) undo();
      if ((event.key === "y" || event.key === "Y") && !event.ctrlKey && !event.metaKey) redo();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); undo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, tri]);

  const applyPreset = (id: string) => {
    setPreset(id);
    setAnim(false);
    commit(EXPLORER_PRESETS[id] ?? EXPLORER_PRESETS.scalene);
  };

  const undo = () => {
    const next = Math.max(0, histIndex - 1);
    const item = history[next];
    if (!item) return;
    setHistIndex(next);
    setTri(item);
  };

  const redo = () => {
    const next = Math.min(history.length - 1, histIndex + 1);
    const item = history[next];
    if (!item) return;
    setHistIndex(next);
    setTri(item);
  };

  const startDrag = (who: "A" | "B" | "C") => (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    drag.current = who;
    setSelected(who);
    setPreset("custom");
    setAnim(false);
    bindSvgDrag(svgRef, (ev) => {
      const svg = svgRef.current;
      if (!svg || !drag.current) return;
      const s = pointerToSvg(svg, ev);
      const raw = snapPoint(clampPoint(fromSvg(plane, s.x, s.y)), snap, who === "C" ? triRef.current.B : triRef.current.A);
      setTri((prev) => {
        const draft = applyLock(prev, drag.current!, raw, lock);
        if (triangleArea(draft.A, draft.B, draft.C) < 0.35) {
          setWarn("That drag would collapse the triangle.");
          ui?.announce("That would collapse the triangle.");
          return prev;
        }
        setWarn("");
        return draft;
      });
    }, () => {
      drag.current = null;
      commit(triRef.current);
    });
  };

  const startPan = (event: React.PointerEvent) => {
    if ((event.target as Element).closest(".tri-vertex")) return;
    panDrag.current = { x: event.clientX, y: event.clientY, panX: ui?.panX ?? 0, panY: ui?.panY ?? 0 };
    const move = (ev: PointerEvent) => {
      if (!panDrag.current) return;
      ui?.setPan(panDrag.current.panX - (ev.clientX - panDrag.current.x), panDrag.current.panY - (ev.clientY - panDrag.current.y));
    };
    const up = () => {
      panDrag.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", onUp);
    };
    const onUp = up;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", onUp);
  };

  const reset = () => applyPreset("scalene");
  const zoom = ui?.zoom ?? 1;
  const vw = plane.width / zoom;
  const vh = plane.height / zoom;
  const vx = (plane.width - vw) / 2 + (ui?.panX ?? 0);
  const vy = (plane.height - vh) / 2 + (ui?.panY ?? 0);
  const showUnfold = pulse === "understand" || sub === "angles";
  const svgLabel = `Draggable triangle ABC. AB ${okNum(m.sides.AB)}, BC ${okNum(m.sides.BC)}, CA ${okNum(m.sides.CA)}. Angles ${okNum(m.angles.A, 1)}°, ${okNum(m.angles.B, 1)}°, ${okNum(m.angles.C, 1)}°.`;

  const setCoord = (who: "A" | "B" | "C", axis: "x" | "y", value: number) => {
    const next = { ...tri, [who]: { ...tri[who], [axis]: value } };
    if (triangleArea(next.A, next.B, next.C) < 0.35) {
      setWarn("Those coordinates would collapse the triangle.");
      return;
    }
    setPreset("custom");
    commit(next);
  };

  return (
    <LabFrame
      theme="explorer"
      ariaLabel="Triangle explorer"
      tools={(
        <>
          <button type="button" className="msk-soft" onClick={undo} aria-label="Undo vertex move">Undo</button>
          <button type="button" className="msk-soft" onClick={redo} aria-label="Redo vertex move">Redo</button>
        </>
      )}
      controls={
        <Panel title="Explorer controls">
          <Field label="Focus">
            <Segmented value={sub} onChange={(id) => setSub(id as Sub)} options={[
              { id: "explore", label: "Explore" },
              { id: "area", label: "Area" },
              { id: "angles", label: "Angles" },
              { id: "special", label: "Special" },
            ]} />
          </Field>
          <Field label="Triangle type">
            <div className="tri-preset-row">
              {PRESET_IDS.map((id) => (
                <button key={id} type="button" className={preset === id ? "active" : ""} onClick={() => applyPreset(id)}>
                  <PresetThumb id={id} />
                </button>
              ))}
            </div>
          </Field>
          {sub === "special" ? (
            <Field label="Special triangles">
              <ChipRow value="" onChange={(id) => { commit(SPECIAL[id]!); setPreset("custom"); }} options={Object.keys(SPECIAL).map((id) => ({ id, label: id }))} />
            </Field>
          ) : null}
          {sub === "area" ? (
            <>
              <Field label="Base">
                <Segmented value={base} onChange={(id) => setBase(id as Base)} options={[{ id: "AB", label: "AB" }, { id: "BC", label: "BC" }, { id: "CA", label: "CA" }]} />
              </Field>
              <Field label="Area formula">
                <Segmented value={areaFormula} onChange={setAreaFormula} options={[{ id: "bh", label: "½bh" }, { id: "heron", label: "Heron" }, { id: "coord", label: "Coordinate" }]} />
              </Field>
            </>
          ) : null}
          <Field label="Snap">
            <Segmented value={snap} onChange={(id) => setSnap(id as SnapMode)} options={[
              { id: "off", label: "Free" },
              { id: "grid", label: "Grid" },
              { id: "integer", label: "Integer" },
              { id: "angle", label: "15°" },
            ]} />
          </Field>
          <Field label="Lock while dragging">
            <Segmented value={lock} onChange={(id) => setLock(id as LockMode)} options={[
              { id: "none", label: "None" },
              { id: "isosceles", label: "Isosceles at A" },
              { id: "right", label: "Right at B" },
            ]} />
          </Field>
          <Field label="Side lengths">
            {([["AB", m.sides.AB], ["BC", m.sides.BC], ["CA", m.sides.CA]] as const).map(([side, value]) => (
              <div key={side} className="tri-coord-row">
                <span>{side}</span>
                <input aria-label={`${side} length`} type="number" step="0.1" value={okNum(value)} onChange={(event) => {
                  setPreset("custom");
                  commit(setSideLength(tri, side, Number(event.target.value)));
                }} />
              </div>
            ))}
          </Field>
          <Field label="Coordinates">
            {(["A", "B", "C"] as const).map((who) => (
              <div key={who} className="tri-coord-row">
                <span>{who}</span>
                <input aria-label={`${who} x`} type="number" step="0.1" value={okNum(tri[who].x)} onChange={(event) => setCoord(who, "x", Number(event.target.value))} />
                <input aria-label={`${who} y`} type="number" step="0.1" value={okNum(tri[who].y)} onChange={(event) => setCoord(who, "y", Number(event.target.value))} />
              </div>
            ))}
          </Field>
          <Field label="Measure">
            <Toggle checked={layers.sides} onChange={(v) => setLayers({ ...layers, sides: v })}>Side lengths</Toggle>
            <Toggle checked={layers.angles} onChange={(v) => setLayers({ ...layers, angles: v })}>Angles</Toggle>
            <Toggle checked={layers.arcs} onChange={(v) => setLayers({ ...layers, arcs: v })}>Angle arcs</Toggle>
            <Toggle checked={layers.coords} onChange={(v) => setLayers({ ...layers, coords: v })}>Coordinates</Toggle>
          </Field>
          <Field label="Lines (one family at a time)">
            <Segmented value={layers.altitudes ? "altitudes" : layers.median ? "median" : layers.bisector ? "bisector" : layers.perp ? "perp" : "none"} onChange={(id) => setLayers({
              ...layers,
              altitudes: id === "altitudes",
              median: id === "median",
              bisector: id === "bisector",
              perp: id === "perp",
            })} options={[
              { id: "none", label: "None" },
              { id: "altitudes", label: "Altitudes" },
              { id: "median", label: "Median" },
              { id: "bisector", label: "Bisector" },
              { id: "perp", label: "Perp. bisector" },
            ]} />
          </Field>
          <Field label="Grid">
            <Toggle checked={layers.grid} onChange={(v) => setLayers({ ...layers, grid: v })}>Show grid</Toggle>
          </Field>
          <Toggle checked={anim} onChange={setAnim}>Move vertex C</Toggle>
          {warn ? <p className="tri-warn" role="status">{warn}</p> : null}
        </Panel>
      }
      canvas={
        <div className="tri-stage">
          {coach ? (
            <div className="tri-coach">
              <p>Drag A, B, or C. Arrow keys nudge the selected vertex.</p>
              <button type="button" className="msk-cta" onClick={() => { setCoach(false); writeGeoSession({ coachDismissed: true }); }}>Got it</button>
            </div>
          ) : null}
          <svg ref={svgRef} viewBox={`${vx} ${vy} ${vw} ${vh}`} role="img" aria-label={svgLabel} className={ui?.challengeFlash ? "is-success" : ""} onPointerDown={startPan}>
            {layers.grid ? <GridLayer plane={plane} /> : null}
            <g aria-label="Triangle fill">
              <polygon points={polyPoints(plane, [tri.A, tri.B, tri.C])} fill="rgba(20,125,242,.10)" stroke="#147df2" strokeWidth="2.2" className={hover === "Perimeter" ? "is-hot" : ""} />
            </g>
            {showUnfold ? (
              <g className="tri-unfold" aria-hidden="true">
                <line x1={toSvg(plane, { x: 1.2, y: 0.55 }).x} y1={toSvg(plane, { x: 1.2, y: 0.55 }).y} x2={toSvg(plane, { x: 16.8, y: 0.55 }).x} y2={toSvg(plane, { x: 16.8, y: 0.55 }).y} stroke="#0f172a" strokeWidth="2" />
                <text x={toSvg(plane, { x: 9, y: 0.2 }).x} y={toSvg(plane, { x: 9, y: 0.2 }).y} textAnchor="middle" fill="#0b4f8a" fontSize="12" fontWeight="800">Straight angle = 180° = ∠A + ∠B + ∠C</text>
              </g>
            ) : null}
            {sub === "area" ? (
              <polygon points={polyPoints(plane, [basePts[0], basePts[1], basePts[2]])} fill="rgba(8,185,221,.16)" stroke="none" />
            ) : null}
            {layers.arcs || sub === "angles" ? (
              <g className="tri-print-hide" aria-label="Angle marks">
                <AngleArc plane={plane} vertex={tri.A} p={tri.B} q={tri.C} color="#08b9dd" label={`${okNum(m.angles.A, 1)}°`} />
                <AngleArc plane={plane} vertex={tri.B} p={tri.A} q={tri.C} color="#8b45f4" radius={18} label={`${okNum(m.angles.B, 1)}°`} />
                <AngleArc plane={plane} vertex={tri.C} p={tri.A} q={tri.B} color="#f59e0b" radius={18} label={`${okNum(m.angles.C, 1)}°`} />
              </g>
            ) : null}
            {layers.altitudes ? (
              <>
                <DashedLine plane={plane} a={tri.A} b={footA} color="#64748b" />
                <DashedLine plane={plane} a={tri.B} b={footB} color="#64748b" />
                <DashedLine plane={plane} a={tri.C} b={footC} color="#64748b" />
              </>
            ) : null}
            {(layers.altitudes || sub === "area") ? (
              <>
                <DashedLine plane={plane} a={basePts[2]} b={foot} color="#0ea5c6" />
                <RightAngleMarker plane={plane} vertex={foot} p={basePts[2]} q={basePts[1]} color="#0ea5c6" />
                <SideMeasurement plane={plane} a={basePts[2]} b={foot} text={`h=${okNum(height)}`} color="#0ea5c6" />
              </>
            ) : null}
            {layers.median ? <SolidLine plane={plane} a={tri.A} b={midBC} color="#10b981" /> : null}
            {layers.bisector && bis ? <SolidLine plane={plane} a={tri.A} b={bis} color="#8b45f4" /> : null}
            {layers.perp ? (
              <DashedLine plane={plane} a={{ x: pb.point.x - pb.dir.x * 0.04, y: pb.point.y - pb.dir.y * 0.04 }} b={{ x: pb.point.x + pb.dir.x * 0.04, y: pb.point.y + pb.dir.y * 0.04 }} />
            ) : null}
            {layers.sides ? (
              <>
                <g className={hover === "AB" ? "is-hot" : ""}><SideMeasurement plane={plane} a={tri.A} b={tri.B} text={`c=${okNum(m.sides.AB)}`} /></g>
                <g className={hover === "BC" ? "is-hot" : ""}><SideMeasurement plane={plane} a={tri.B} b={tri.C} text={`a=${okNum(m.sides.BC)}`} /></g>
                <g className={hover === "CA" ? "is-hot" : ""}><SideMeasurement plane={plane} a={tri.C} b={tri.A} text={`b=${okNum(m.sides.CA)}`} /></g>
              </>
            ) : null}
            <g onPointerDown={startDrag("A")}><DraggableVertex plane={plane} p={tri.A} label="A" active={selected === "A"} /></g>
            <g onPointerDown={startDrag("B")}><DraggableVertex plane={plane} p={tri.B} label="B" color="#0f766e" active={selected === "B"} /></g>
            <g onPointerDown={startDrag("C")}><DraggableVertex plane={plane} p={tri.C} label="C" color="#8b45f4" active={selected === "C"} /></g>
            {layers.coords ? (
              <>
                <text x={aSvg.x + 12} y={aSvg.y + 22} fill="#536381" fontSize="11">({okNum(tri.A.x)}, {okNum(tri.A.y)})</text>
                <text x={bSvg.x + 12} y={bSvg.y + 22} fill="#536381" fontSize="11">({okNum(tri.B.x)}, {okNum(tri.B.y)})</text>
                <text x={cSvg.x + 12} y={cSvg.y + 22} fill="#536381" fontSize="11">({okNum(tri.C.x)}, {okNum(tri.C.y)})</text>
              </>
            ) : null}
          </svg>
        </div>
      }
      insights={
        <InsightStack
          measurements={
            <>
              <div className="tri-badges">
                <span className="tri-badge">By sides: {m.bySides}</span>
                <span className="tri-badge">By angles: {m.byAngles}</span>
              </div>
              <p className="tri-note">
                {m.bySides === "Equilateral" ? "All three sides match, so every angle is 60°." : m.bySides === "Isosceles" ? "Two sides match, so their opposite angles match." : "No sides are equal, so no angles are forced equal."}
                {" "}
                {m.byAngles === "Right" ? "One angle is 90°, so Pythagoras applies on the other two sides." : m.byAngles === "Obtuse" ? "One angle is greater than 90°, so the circumcenter sits outside." : "Every angle is less than 90°."}
              </p>
              <MeasureRow label="AB" value={okNum(m.sides.AB)} metric="AB" />
              <MeasureRow label="BC" value={okNum(m.sides.BC)} color="#0f766e" metric="BC" />
              <MeasureRow label="CA" value={okNum(m.sides.CA)} color="#8b45f4" metric="CA" />
              <MeasureRow label="∠A" value={`${okNum(m.angles.A, 1)}°`} color="#08b9dd" metric="∠A" />
              <MeasureRow label="∠B" value={`${okNum(m.angles.B, 1)}°`} color="#8b45f4" metric="∠B" />
              <MeasureRow label="∠C" value={`${okNum(m.angles.C, 1)}°`} color="#f59e0b" metric="∠C" />
              <MeasureRow label="Perimeter" value={okNum(m.perimeter)} metric="Perimeter" />
              <MeasureRow label="Semiperimeter s" value={okNum(m.semiperimeter)} />
              <MeasureRow label="Area" value={okNum(m.area)} metric="Area" />
            </>
          }
          property={
            <p className="tri-ok">∠A + ∠B + ∠C = {okNum(m.angles.A, 1)}° + {okNum(m.angles.B, 1)}° + {okNum(m.angles.C, 1)}° = {okNum(m.angleSum, 1)}°</p>
          }
          formula={
            <FormulaCard
              title={sub === "area" ? "Area" : "Angle sum"}
              formula={sub === "area" ? (areaFormula === "heron" ? "A = √[s(s−a)(s−b)(s−c)]" : areaFormula === "coord" ? "A = ½|x1(y2−y3)+x2(y3−y1)+x3(y1−y2)|" : "A = ½ bh") : "∠A + ∠B + ∠C = 180°"}
              why={sub === "area" ? `Base ${base} = ${okNum(baseLen)}, height = ${okNum(height)}. ½bh = ${okNum(0.5 * baseLen * height)}. Heron = ${okNum(m.heron)}.` : "A straight line is 180°. The three interior angles copy onto that line."}
              tryThis={sub === "area" ? "Switch the base and watch height change while area stays the same." : "Turn on Move vertex C and watch the sum stay 180°."}
            />
          }
          challenge={
            <ChallengeCard
              prompt="Create an isosceles triangle with apex angle 40°."
              hint="Make AB = AC (or another pair equal), then drag until the equal-side vertex is near 40°."
              check={() => m.bySides !== "Scalene" && [m.angles.A, m.angles.B, m.angles.C].some((ang, i) => {
                const equalSides = i === 0 ? Math.abs(m.sides.AB - m.sides.CA) < 0.15 : i === 1 ? Math.abs(m.sides.AB - m.sides.BC) < 0.15 : Math.abs(m.sides.BC - m.sides.CA) < 0.15;
                return equalSides && Math.abs(ang - 40) < 2.5;
              })}
              onReset={reset}
              onSuccess={() => {
                ui?.setChallengeFlash(true);
                window.setTimeout(() => ui?.setChallengeFlash(false), 1200);
                ui?.announce("Challenge complete. Matching sides stay highlighted.");
              }}
            />
          }
        />
      }
    />
  );
}
