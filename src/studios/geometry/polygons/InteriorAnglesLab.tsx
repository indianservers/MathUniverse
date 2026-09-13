import { useCallback, useMemo, useRef, useState } from "react";
import { SliderRow } from "../../mockup/studioLabKit";
import {
  fanDiagonals,
  fanTriangles,
  interiorAngleSum,
  interiorAngles,
  interiorAngleRegular,
  exteriorAngleRegular,
  isSelfIntersecting,
  regularPolygonVertices,
  vertexLabel,
  type Vec,
} from "./polygonMath";
import {
  AngleArc,
  ChallengePanel,
  Controls,
  FormulaCard,
  LivePanel,
  MeasureRow,
  PropertyCard,
  Toggle,
  VIEW,
  clientToSvg,
  fmt,
  fmtDeg,
  fromScreen,
  pointsAttr,
  toScreen,
  useRaf,
} from "./polygonUi";

type AngleSub = "sum" | "regular" | "exterior" | "irregular";

export default function InteriorAnglesLab() {
  const [n, setN] = useState(5);
  const [sub, setSub] = useState<AngleSub>("sum");
  const [regular, setRegular] = useState(true);
  const [fan, setFan] = useState(0);
  const [walk, setWalk] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verts, setVerts] = useState<Vec[]>(() => regularPolygonVertices(5, 3.4, 0));
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<number | null>(null);

  const syncRegular = (nextN: number, keepIrregular: boolean) => {
    setN(nextN);
    setFan((v) => Math.min(v, nextN - 1));
    if (!keepIrregular) setVerts(regularPolygonVertices(nextN, 3.4, 0));
    else {
      setVerts((current) => {
        if (current.length === nextN) return current;
        return regularPolygonVertices(nextN, 3.4, 0);
      });
    }
  };

  const geometry = useMemo(() => {
    const points = regular ? regularPolygonVertices(n, 3.4, 0) : verts;
    const screen = points.map((p) => toScreen(p, 48));
    const angles = interiorAngles(points);
    const crossed = isSelfIntersecting(points);
    const triangles = fanTriangles(points, fan);
    const diagonals = fanDiagonals(points, fan);
    return { points, screen, angles, crossed, triangles, diagonals };
  }, [fan, n, regular, verts]);

  const step = useCallback((dt: number) => {
    setProgress((value) => (value + dt * 0.00035) % 1);
  }, []);
  useRaf(walk && sub === "exterior", step);

  const walkInfo = useMemo(() => {
    const edges = geometry.screen;
    const total = edges.length;
    const t = progress * total;
    const i = Math.min(total - 1, Math.floor(t));
    const local = t - i;
    const a = edges[i]!;
    const b = edges[(i + 1) % total]!;
    const x = a.x + (b.x - a.x) * local;
    const y = a.y + (b.y - a.y) * local;
    const turned = Math.min(total, Math.floor(t + 0.02) + (local > 0.92 ? 1 : 0));
    const exterior = exteriorAngleRegular(n);
    return { x, y, turned, cumulative: turned * exterior, exterior, i };
  }, [geometry.screen, n, progress]);

  const dragVertex = (index: number, event: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return;
    const s = clientToSvg(svg, event);
    const math = fromScreen(s.x, s.y, 48);
    setRegular(false);
    setSub("irregular");
    setVerts((current) => current.map((p, i) => (i === index ? math : p)));
  };

  const sum = interiorAngleSum(n);
  const each = interiorAngleRegular(n);

  return (
    <div className="poly-lab">
      <Controls title="Interior angles">
        <div className="poly-sub">
          {([
            ["sum", "Interior Angle Sum"],
            ["regular", "Regular Interior"],
            ["exterior", "Exterior Angles"],
            ["irregular", "Irregular Angles"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" className={sub === id ? "active" : ""} onClick={() => {
              setSub(id);
              if (id === "irregular") setRegular(false);
              if (id === "regular" || id === "sum") setRegular(true);
            }}>{label}</button>
          ))}
        </div>
        <SliderRow label="Sides n" value={n} min={3} max={12} step={1} onChange={(value) => syncRegular(value, !regular)} />
        <Toggle checked={regular} onChange={(on) => { setRegular(on); if (on) setVerts(regularPolygonVertices(n, 3.4, 0)); }}>Regular polygon</Toggle>
        <SliderRow label="Triangulation vertex" value={fan} min={0} max={n - 1} step={1} onChange={setFan} />
        {sub === "exterior" ? (
          <Toggle checked={walk} onChange={setWalk}>Walk around polygon</Toggle>
        ) : null}
        <p className="msk-note">Choose a vertex to fan-triangulate. Diagonals from that vertex split the n-gon into n − 2 triangles.</p>
      </Controls>

      <section className="msk-panel msk-canvas poly-stage">
        <svg ref={svgRef} className="msk-graph poly-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label="Interior angles lab">
          <rect width={VIEW.w} height={VIEW.h} fill="#fbfdff" />
          {sub === "sum" || sub === "regular" ? geometry.triangles.map((tri, i) => {
            const pts = tri.map((p) => toScreen(p, 48));
            return <polygon key={`t${i}`} points={pointsAttr(pts)} fill={`rgba(139,69,244,${0.08 + (i % 3) * 0.05})`} stroke="#8b45f4" strokeWidth="1" />;
          }) : null}
          {geometry.diagonals.map((line, i) => {
            const a = toScreen(line[0], 48);
            const b = toScreen(line[1], 48);
            return <line key={`d${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b45f4" strokeDasharray="6 4" />;
          })}
          <polygon points={pointsAttr(geometry.screen)} fill="rgba(20,125,242,.08)" stroke="#147df2" strokeWidth="2.2" />
          {geometry.screen.map((p, i) => {
            const prev = geometry.screen[(i - 1 + n) % n]!;
            const next = screenNext(geometry.screen, i);
            const show = sub !== "exterior" || i === walkInfo.i;
            return show ? <AngleArc key={`a${i}`} center={p} from={prev} to={next} radius={20} color="#8b45f4" label={fmtDeg(geometry.angles[i] ?? 0, 0)} /> : null;
          })}
          {sub === "exterior" ? geometry.screen.map((p, i) => {
            const next = geometry.screen[(i + 1) % n]!;
            const dx = next.x - p.x;
            const dy = next.y - p.y;
            return <line key={`ray${i}`} x1={next.x} y1={next.y} x2={next.x + dx * 0.28} y2={next.y + dy * 0.28} stroke="#f59e0b" />;
          }) : null}
          {sub === "exterior" ? (
            <g>
              <circle cx={walkInfo.x} cy={walkInfo.y} r="7" fill="#f59e0b" />
              <polygon points={`${walkInfo.x + 10},${walkInfo.y} ${walkInfo.x},${walkInfo.y - 6} ${walkInfo.x},${walkInfo.y + 6}`} fill="#f59e0b" />
            </g>
          ) : null}
          {geometry.screen.map((p, i) => (
            <g key={i} className="poly-handle" style={{ cursor: regular ? "default" : "grab" }}>
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" onPointerDown={(event) => {
                if (regular) return;
                drag.current = i;
                event.currentTarget.setPointerCapture(event.pointerId);
              }} onPointerMove={(event) => {
                if (drag.current !== i) return;
                dragVertex(i, event);
              }} onPointerUp={() => { drag.current = null; }} />
              <circle cx={p.x} cy={p.y} r={fan === i ? 7 : 5.5} fill={fan === i ? "#8b45f4" : "#08b9dd"} stroke="#fff" />
              <text x={p.x + 9} y={p.y - 8} fontSize="11" fontWeight="800">{vertexLabel(i)}</text>
            </g>
          ))}
          <text x="20" y="28" fill="#0f172a" fontSize="14" fontWeight="800">
            {sub === "sum" ? "Triangulation proof" : sub === "exterior" ? "Walking exterior angles" : sub === "irregular" ? "Irregular interior angles" : "Equal interior angles"}
          </text>
        </svg>
      </section>

      <LivePanel title="Angle investigation">
        {geometry.crossed ? <p className="poly-warn">Self-intersecting polygon — interior angles are not well-defined for a simple region.</p> : null}
        <MeasureRow color="#8b45f4" label="Triangles" value={n - 2} />
        <MeasureRow color="#147df2" label="Interior sum" value={fmtDeg(sum, 0)} />
        <MeasureRow color="#8b45f4" label="Regular interior" value={fmtDeg(each)} />
        <MeasureRow color="#f59e0b" label="Exterior each" value={fmtDeg(exteriorAngleRegular(n))} />
        <MeasureRow color="#f59e0b" label="Exterior sum" value="360°" />
        <MeasureRow color="#0f766e" label="Selected vertex" value={vertexLabel(fan)} />
        {!regular ? (
          <MeasureRow
            color="#147df2"
            label={geometry.angles.map((_, i) => vertexLabel(i)).join(" + ")}
            value={`${fmt(geometry.angles.reduce((s, a) => s + a, 0), 1)}°`}
          />
        ) : null}
        {sub === "exterior" ? (
          <MeasureRow color="#f59e0b" label="Cumulative turn" value={fmtDeg(Math.min(360, walkInfo.cumulative), 0)} />
        ) : null}
        <FormulaCard title="Interior angle sum">
          n − 2 triangles × 180° = {n - 2} × 180° = {sum}°. Pentagon: 3 triangles → 540°. Hexagon: 4 × 180° = 720°.
        </FormulaCard>
        <PropertyCard title="Exterior walk">
          One full circuit turns through 360°, so exterior angles always sum to 360°. Regular case: each turn is 360°/n.
        </PropertyCard>
        <p className="poly-world"><b>Real world</b> Surveyors close a traverse when turning angles around a parcel sum to a full turn — the same exterior-angle fact.</p>
        <ChallengePanel
          prompt="Create a polygon whose interior angle sum is 900°."
          hint="(n − 2) × 180° = 900 ⇒ n − 2 = 5 ⇒ n = 7."
          check={() => ({
            ok: n === 7,
            detail: n === 7 ? "Heptagon: 5 × 180° = 900°." : `Current sum is ${sum}°.`,
          })}
          onReset={() => syncRegular(5, false)}
        />
      </LivePanel>
    </div>
  );
}

function screenNext(screen: Array<{ x: number; y: number }>, i: number) {
  return screen[(i + 1) % screen.length]!;
}
