import { useCallback, useEffect, useMemo, useState } from "react";
import { SliderRow } from "../../mockup/studioLabKit";
import {
  allDiagonals,
  combinations,
  diagonalCount,
  diagonalsFromVertex,
  fanDiagonals,
  fanTriangles,
  genericDiagonalIntersections,
  interiorDiagonalIntersections,
  isConvexPolygon,
  regularPolygonName,
  regularPolygonVertices,
  vertexLabel,
} from "./polygonMath";
import {
  ChallengePanel,
  Controls,
  FormulaCard,
  LivePanel,
  MeasureRow,
  PropertyCard,
  Toggle,
  VIEW,
  fmt,
  pointsAttr,
  toScreen,
  useRaf,
} from "./polygonUi";

type DiagSub = "from-vertex" | "all" | "triangulation" | "intersections";

const PALETTE = ["#147df2", "#8b45f4", "#08b9dd", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#0f766e"];

export default function DiagonalsLab({ pulse = "observe" }: { pulse?: string }) {
  const [n, setN] = useState(8);
  const [vertex, setVertex] = useState(0);
  const [sub, setSub] = useState<DiagSub>("from-vertex");
  const [animate, setAnimate] = useState(true);
  const [progress, setProgress] = useState(1);
  const [colorByVertex, setColorByVertex] = useState(true);
  const [labelHits, setLabelHits] = useState(false);

  const verts = useMemo(() => regularPolygonVertices(n, 3.6, 0), [n]);
  const screen = verts.map((p) => toScreen(p, 50));
  const fromV = diagonalsFromVertex(n);
  const total = diagonalCount(n);
  const diagsFrom = fanDiagonals(verts, vertex);
  const all = allDiagonals(verts);
  const triangles = fanTriangles(verts, vertex);
  const hits = useMemo(() => interiorDiagonalIntersections(verts), [verts]);
  const convex = isConvexPolygon(verts);

  const step = useCallback((dt: number) => {
    setProgress((value) => Math.min(1, value + dt * 0.00045));
  }, []);
  useRaf(animate && progress < 1, step);

  const shownFrom = Math.max(0, Math.round(progress * fromV));
  const shownAll = Math.max(0, Math.round(progress * all.length));
  const shownTri = Math.max(0, Math.round(progress * triangles.length));

  useEffect(() => {
    if (pulse === "try") { setSub("all"); setProgress(0.08); setAnimate(true); }
    if (pulse === "challenge") { setN(8); setSub("from-vertex"); }
    if (pulse === "observe") setSub("from-vertex");
    if (pulse === "understand") setSub("triangulation");
  }, [pulse]);

  return (
    <div className="poly-lab poly-lab--diagonals">
      <Controls title="Diagonals">
        <div className="poly-sub">
          {([["from-vertex", "From one vertex"], ["all", "All diagonals"], ["triangulation", "Triangulation"], ["intersections", "Intersections"]] as const).map(([id, label]) => (
            <button key={id} type="button" className={sub === id ? "active" : ""} onClick={() => { setSub(id); setProgress(0.08); }}>{label}</button>
          ))}
        </div>
        <SliderRow label="Sides n" value={n} min={3} max={16} step={1} onChange={(value) => { setN(value); setVertex((v) => Math.min(v, value - 1)); setProgress(0.08); }} />
        <SliderRow label="Selected vertex" value={vertex} min={0} max={n - 1} step={1} onChange={setVertex} />
        <Toggle checked={animate} onChange={(on) => { setAnimate(on); if (on) setProgress(0.08); }}>Animate drawing</Toggle>
        <Toggle checked={colorByVertex} onChange={setColorByVertex}>Color by vertex</Toggle>
        <Toggle checked={labelHits} onChange={setLabelHits}>Label intersections</Toggle>
        <button type="button" className="poly-ghost" onClick={() => setProgress(0.08)}>Replay animation</button>
      </Controls>

      <section className="msk-panel msk-canvas poly-stage">
        <svg className="msk-graph poly-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label="Diagonals explorer">
          <rect width={VIEW.w} height={VIEW.h} fill="none" />
          <polygon points={pointsAttr(screen)} fill="rgba(20,125,242,.07)" stroke="#147df2" strokeWidth="2.2" />
          {sub === "from-vertex" ? diagsFrom.slice(0, shownFrom).map((line, i) => {
            const a = toScreen(line[0], 50);
            const b = toScreen(line[1], 50);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={PALETTE[vertex % PALETTE.length]} strokeWidth="2" />;
          }) : null}
          {sub === "all" ? all.slice(0, shownAll).map((line, i) => {
            const a = toScreen(line[2], 50);
            const b = toScreen(line[3], 50);
            const color = colorByVertex ? PALETTE[line[0] % PALETTE.length] : "#8b45f4";
            const duplicate = progress > 0.72;
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeOpacity={duplicate ? 0.85 : 0.4} strokeWidth={duplicate ? 1.6 : 2.4} />;
          }) : null}
          {sub === "triangulation" ? triangles.slice(0, shownTri).map((tri, i) => (
            <polygon key={i} points={pointsAttr(tri.map((p) => toScreen(p, 50)))} fill={`rgba(139,69,244,${0.1 + i * 0.05})`} stroke="#8b45f4" />
          )) : null}
          {sub === "triangulation" ? fanDiagonals(verts, vertex).map((line, i) => {
            const a = toScreen(line[0], 50);
            const b = toScreen(line[1], 50);
            return <line key={`td${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b45f4" strokeDasharray="5 4" />;
          }) : null}
          {sub === "intersections" ? all.map((line, i) => {
            const a = toScreen(line[2], 50);
            const b = toScreen(line[3], 50);
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" />;
          }) : null}
          {sub === "intersections" ? hits.map((p, i) => {
            const s = toScreen(p, 50);
            return (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r="3.5" fill="#f59e0b" />
                {labelHits ? <text x={s.x + 5} y={s.y - 5} fontSize="9" fill="#b45309">{i + 1}</text> : null}
              </g>
            );
          }) : null}
          {screen.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={i === vertex ? 8 : 5} fill={i === vertex ? "#8b45f4" : "#08b9dd"} stroke="#fff" />
              <text x={p.x + 8} y={p.y - 8} fontSize="11" fontWeight="800">{vertexLabel(i)}</text>
            </g>
          ))}
          <text x="20" y="28" fontSize="14" fontWeight="800" fill="#0f172a">
            {sub === "from-vertex" ? `Diagonals from ${vertexLabel(vertex)}` : sub === "all" ? "Every diagonal counted twice, then halved" : sub === "triangulation" ? "Fan triangulation" : "Interior intersections"}
          </text>
        </svg>
      </section>

      <LivePanel title="Diagonal counts">
        <MeasureRow color="#8b45f4" label={`From ${vertexLabel(vertex)}`} value={fromV} />
        <MeasureRow color="#147df2" label="Total diagonals" value={total} />
        <MeasureRow color="#8b45f4" label="Fan triangles" value={n - 2} />
        <MeasureRow color="#0f766e" label="Fan diagonals" value={n - 3} />
        <FormulaCard title="Counting">
          Each vertex joins n − 3 non-adjacent vertices, giving n(n − 3) connections. Each diagonal has two ends, so total = n(n − 3)/2.
        </FormulaCard>
        <FormulaCard title="Fan triangulation">
          From one vertex, n − 3 diagonals create n − 2 triangles. Pentagon: 2 diagonals, 3 triangles. Octagon: {fromV} diagonals from one vertex.
        </FormulaCard>
        {sub === "intersections" ? (
          <>
            <MeasureRow color="#f59e0b" label="Drawn crossings" value={hits.length} />
            <MeasureRow color="#f59e0b" label="C(n,4) generic" value={genericDiagonalIntersections(n)} />
            <p className="poly-warn">
              Generic convex polygon — no three diagonals concurrent. Regular polygons can have extra concurrencies, so drawn crossings ({hits.length}) may be fewer than C({n},4) = {combinations(n, 4)}.
            </p>
          </>
        ) : null}
        <PropertyCard title="Networks">
          Diagonals are the bracing of a polygon frame and the edges of a complete graph minus the boundary cycle — used in meshes and structural trusses.
        </PropertyCard>
        <p className="poly-world"><b>Real world</b> Structural bracing, polygon meshes, and network connections all count non-adjacent vertex pairs the same way.</p>
        {convex ? <p className="poly-ok">Convex {regularPolygonName(n)} — every diagonal lies inside.</p> : null}
        <ChallengePanel
          prompt="Find a polygon with exactly 20 diagonals."
          hint="n(n − 3)/2 = 20 ⇒ n(n − 3) = 40 ⇒ n = 8."
          check={() => ({
            ok: n === 8,
            detail: n === 8 ? "Octagon: 8×5/2 = 20." : `Current count is ${total}.`,
          })}
          onReset={() => { setN(5); setVertex(0); setSub("from-vertex"); setProgress(1); }}
        />
      </LivePanel>
    </div>
  );
}
