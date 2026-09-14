import { useEffect, useMemo, useState } from "react";
import { SliderRow } from "../../mockup/studioLabKit";
import {
  apothemFoot,
  regularMetrics,
  regularPolygonName,
  regularPolygonVertices,
  tessellationAngleCheck,
} from "./polygonMath";
import {
  AngleArc,
  ChallengePanel,
  Controls,
  FormulaCard,
  LivePanel,
  MeasureRow,
  PresetGrid,
  PropertyCard,
  Stage,
  Toggle,
  fmt,
  fmtDeg,
  pointsAttr,
  toScreen,
} from "./polygonUi";

const PRESETS = [
  { id: "3", label: "Triangle", n: 3 },
  { id: "4", label: "Square", n: 4 },
  { id: "5", label: "Pentagon", n: 5 },
  { id: "6", label: "Hexagon", n: 6 },
  { id: "8", label: "Octagon", n: 8 },
  { id: "10", label: "Decagon", n: 10 },
  { id: "12", label: "Dodecagon", n: 12 },
  { id: "20", label: "20-gon", n: 20 },
];

type HL = "interior" | "exterior" | "apothem" | "radius" | "side" | "diagonals" | "area" | "center" | "circle" | null;

export default function RegularPolygonLab({ pulse = "observe" }: { pulse?: string }) {
  const [n, setN] = useState(8);
  const [R, setR] = useState(4);
  const [rot, setRot] = useState(0);
  const [opacity, setOpacity] = useState(0.16);
  const [advanced, setAdvanced] = useState(false);
  const [showCenter, setShowCenter] = useState(true);
  const [showCircle, setShowCircle] = useState(true);
  const [showApothem, setShowApothem] = useState(true);
  const [showRadius, setShowRadius] = useState(true);
  const [showSides, setShowSides] = useState(true);
  const [showInterior, setShowInterior] = useState(true);
  const [showExterior, setShowExterior] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [highlight, setHL] = useState<HL>(null);
  const [challengeN, setChallengeN] = useState(8);

  const m = useMemo(() => regularMetrics(n, R), [n, R]);
  const verts = useMemo(() => regularPolygonVertices(n, R, rot), [n, R, rot]);
  const screen = verts.map((p) => toScreen(p));
  const origin = toScreen({ x: 0, y: 0 });
  const foot = toScreen(apothemFoot(n, R, rot).foot);
  const scale = 42;
  const rPx = R * scale;
  const names = PRESETS.find((p) => p.n === n)?.id ?? String(n);

  const hover = (key: HL) => (on: boolean) => setHL(on ? key : null);
  const on = (key: HL) => highlight === key;

  useEffect(() => {
    if (pulse === "try" || pulse === "challenge") setN(8);
    if (pulse === "understand") { setShowApothem(true); setHL("apothem"); }
    if (pulse === "why") { setShowInterior(true); setHL("interior"); }
  }, [pulse]);

  return (
    <div className="poly-lab poly-lab--regular">
      <Controls title="Regular polygon">
        <SliderRow label="Sides n" value={n} min={3} max={advanced ? 50 : 20} step={1} onChange={setN} />
        <Toggle checked={advanced} onChange={setAdvanced}>Advanced: n up to 50</Toggle>
        <SliderRow label="Circumradius R" value={R} min={1} max={6} step={0.05} onChange={setR} />
        <SliderRow label="Orientation" value={rot} min={-180} max={180} step={1} onChange={setRot} unit="°" />
        <SliderRow label="Fill opacity" value={opacity} min={0} max={0.45} step={0.01} onChange={setOpacity} />
        <PresetGrid value={names} items={PRESETS} onChange={(id) => setN(Number(id))} />
        <Toggle checked={showCenter} onChange={setShowCenter}>Show center</Toggle>
        <Toggle checked={showCircle} onChange={setShowCircle}>Show circumcircle</Toggle>
        <Toggle checked={showApothem} onChange={setShowApothem}>Show apothem</Toggle>
        <Toggle checked={showRadius} onChange={setShowRadius}>Show radius lines</Toggle>
        <Toggle checked={showSides} onChange={setShowSides}>Show side lengths</Toggle>
        <Toggle checked={showInterior} onChange={setShowInterior}>Show interior angles</Toggle>
        <Toggle checked={showExterior} onChange={setShowExterior}>Show exterior angles</Toggle>
        <Toggle checked={showLabels} onChange={setShowLabels}>Show vertex labels</Toggle>
      </Controls>

      <Stage
        label={`Regular ${regularPolygonName(n)}`}
      >
        {showCircle || on("circle") ? (
          <circle cx={origin.x} cy={origin.y} r={rPx} fill="none" stroke={on("circle") ? "#0891b2" : "#c9d8ea"} strokeWidth={on("circle") ? 2.2 : 1.2} />
        ) : null}
        {showRadius || on("radius") ? screen.map((p, i) => (
          <line key={`r${i}`} x1={origin.x} y1={origin.y} x2={p.x} y2={p.y} stroke={on("radius") ? "#147df2" : "#d5e3f2"} strokeWidth={on("radius") ? 2 : 1} />
        )) : null}
        <polygon
          points={pointsAttr(screen)}
          fill={`rgba(20,125,242,${on("area") ? Math.max(opacity, 0.28) : opacity})`}
          stroke="#147df2"
          strokeWidth={2.2}
        />
        {(showApothem || on("apothem")) && screen[0] && screen[1] ? (
          <g>
            <line x1={origin.x} y1={origin.y} x2={foot.x} y2={foot.y} stroke={on("apothem") ? "#0f766e" : "#14b8a6"} strokeWidth={2.2} />
            <circle cx={foot.x} cy={foot.y} r="3.5" fill="#0f766e" />
            <text x={(origin.x + foot.x) / 2 + 8} y={(origin.y + foot.y) / 2} fill="#0f766e" fontSize="11" fontWeight="700">a</text>
          </g>
        ) : null}
        {(showInterior || on("interior")) && screen.map((p, i) => {
          const prev = screen[(i - 1 + screen.length) % screen.length]!;
          const next = screen[(i + 1) % screen.length]!;
          return <AngleArc key={`in${i}`} center={p} from={prev} to={next} radius={18} color="#8b45f4" label={fmtDeg(m.interior, 0)} />;
        })}
        {(showExterior || on("exterior")) && screen.map((p, i) => {
          const next = screen[(i + 1) % screen.length]!;
          const dx = next.x - p.x;
          const dy = next.y - p.y;
          const ext = { x: p.x + dx * 0.45, y: p.y + dy * 0.45 };
          const ray = { x: next.x + dx * 0.35, y: next.y + dy * 0.35 };
          return (
            <g key={`ex${i}`}>
              <line x1={next.x} y1={next.y} x2={ray.x} y2={ray.y} stroke="#f59e0b" strokeDasharray="4 3" />
              {i === 0 ? <text x={ext.x} y={ext.y} fill="#d97706" fontSize="10">{fmtDeg(m.exterior, 1)}</text> : null}
            </g>
          );
        })}
        {on("diagonals") ? screen.flatMap((p, i) => screen.map((q, j) => {
          if (j <= i + 1) return null;
          if (i === 0 && j === screen.length - 1) return null;
          return <line key={`d${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#8b45f4" strokeOpacity="0.45" />;
        })) : null}
        {showSides ? screen.map((p, i) => {
          const q = screen[(i + 1) % screen.length]!;
          return <text key={`s${i}`} x={(p.x + q.x) / 2} y={(p.y + q.y) / 2 - 6} fontSize="10" fill="#147df2" textAnchor="middle">{fmt(m.side, 2)}</text>;
        }) : null}
        {showCenter || on("center") ? <circle cx={origin.x} cy={origin.y} r="4.5" fill="#8b45f4" /> : null}
        {showLabels ? screen.map((p, i) => (
          <text key={`L${i}`} x={p.x + (p.x - origin.x) * 0.08} y={p.y + (p.y - origin.y) * 0.08} fontSize="11" fontWeight="800" fill="#0f172a">{String.fromCharCode(65 + (i % 26))}</text>
        )) : null}
        {screen.map((p, i) => <circle key={`v${i}`} cx={p.x} cy={p.y} r="5" fill="#08b9dd" stroke="#fff" strokeWidth="1.4" />)}
        <text x="20" y="28" fill="#0f172a" fontSize="14" fontWeight="800" className={pulse === "observe" ? "poly-focus" : undefined}>Regular {regularPolygonName(n)}</text>
        <text x="20" y="46" fill="#536381" fontSize="11">n = {m.n} · vertex-up orientation {fmt(rot, 0)}°</text>
      </Stage>

      <LivePanel title="Live measurements">
        <MeasureRow color="#147df2" label="n" value={m.n} />
        <MeasureRow color="#0891b2" label="R" value={fmt(m.R, 3)} />
        <MeasureRow color="#147df2" label="Side length" value={fmt(m.side, 3)} active={on("side")} onHover={hover("side")} />
        <MeasureRow color="#0ea5e9" label="Perimeter" value={fmt(m.perimeter, 3)} />
        <MeasureRow color="#8b45f4" label="Interior angle" value={fmtDeg(m.interior)} active={on("interior")} onHover={hover("interior")} />
        <MeasureRow color="#f59e0b" label="Exterior angle" value={fmtDeg(m.exterior)} active={on("exterior")} onHover={hover("exterior")} />
        <MeasureRow color="#8b45f4" label="Interior sum" value={fmtDeg(m.interiorSum, 0)} />
        <MeasureRow color="#0f766e" label="Apothem" value={fmt(m.apothem, 3)} active={on("apothem")} onHover={hover("apothem")} />
        <MeasureRow color="#0891b2" label="Circumradius" value={fmt(m.R, 3)} active={on("circle")} onHover={hover("circle")} />
        <MeasureRow color="#147df2" label="Area" value={fmt(m.area, 3)} active={on("area")} onHover={hover("area")} />
        <MeasureRow color="#8b45f4" label="Diagonals" value={m.diagonals} active={on("diagonals")} onHover={hover("diagonals")} />
        <FormulaCard title="Formulas">
          Interior ((n−2)×180°)/n = {fmtDeg(m.interior)}. Exterior 360°/n = {fmtDeg(m.exterior)}. Side s = 2R sin(π/n). Apothem a = R cos(π/n). Area = ½ n R² sin(2π/n).
        </FormulaCard>
        <PropertyCard title="Why it matters">
          Equal sides and equal angles make a regular {regularPolygonName(n)} the model for bolt heads, stop signs, and honeycomb cells.
        </PropertyCard>
        <p className="poly-world"><b>Real world</b> Hex nuts, octagonal stop signs, and honeycomb cells are regular polygons because equal angles pack or grip evenly.</p>
        <ChallengePanel
          prompt={`Create a polygon with exterior angle ${challengeN === 8 ? "45°" : `${360 / challengeN}°`}.`}
          hint="Exterior angle = 360° / n. For 45°, n = 8."
          check={() => {
            const ok = Math.abs(m.exterior - 360 / challengeN) < 0.05;
            return { ok, detail: ok ? `n = ${m.n} gives exterior ${fmtDeg(m.exterior)}.` : `Current exterior is ${fmtDeg(m.exterior)}. Need ${fmtDeg(360 / challengeN)}.` };
          }}
          onReset={() => { setN(6); setR(4); setRot(0); }}
          onNew={() => setChallengeN((value) => (value === 8 ? 6 : value === 6 ? 9 : 8))}
        />
        <p className="poly-ok">{tessellationAngleCheck(n).tessellates ? "This regular polygon can tile the plane alone." : "This regular polygon cannot tile the plane alone."}</p>
      </LivePanel>
    </div>
  );
}
