import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, Segmented, SliderRow, fmt, useLabMode } from "../studioLabKit";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";

const MODES = ["Angles", "Unit Circle", "Quadrants", "Exact Values", "Reference Angles"];
const ANGLE_CHIPS = [
  { d: 0, top: "0", bot: "" },
  { d: 30, top: "π", bot: "6" },
  { d: 45, top: "π", bot: "4" },
  { d: 60, top: "π", bot: "3" },
  { d: 90, top: "π", bot: "2" },
  { d: 120, top: "2π", bot: "3" },
  { d: 135, top: "3π", bot: "4" },
  { d: 180, top: "π", bot: "" },
];

const UC_VIEWBOX = { width: 500, height: 420 } as const;
const UC_COLORS = {
  angle: "#f59e0b",
  anglePoint: "#fb923c",
  sine: "#8b5cf6",
  cosine: "#06b6d4",
  circle: "#38bdf8",
} as const;

function pointerInUnitCircle(event: ReactPointerEvent<SVGSVGElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  const scale = Math.min(box.width / UC_VIEWBOX.width, box.height / UC_VIEWBOX.height);
  const renderedWidth = UC_VIEWBOX.width * scale;
  const renderedHeight = UC_VIEWBOX.height * scale;
  return {
    x: (event.clientX - box.left - (box.width - renderedWidth) / 2) / scale,
    y: (event.clientY - box.top - (box.height - renderedHeight) / 2) / scale,
  };
}

function exactish(n: number) {
  const hits: Array<[number, string]> = [
    [0, "0"], [0.5, "1/2"], [Math.SQRT1_2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [1, "1"],
    [Math.sqrt(3) / 3, "√3/3"], [2 / Math.sqrt(3), "2√3/3"], [Math.SQRT2, "√2"], [Math.sqrt(3), "√3"], [2, "2"],
    [-0.5, "−1/2"], [-Math.SQRT1_2, "−√2/2"], [-Math.sqrt(3) / 2, "−√3/2"], [-1, "−1"],
    [-Math.sqrt(3) / 3, "−√3/3"], [-2 / Math.sqrt(3), "−2√3/3"], [-Math.SQRT2, "−√2"], [-Math.sqrt(3), "−√3"], [-2, "−2"],
  ];
  const hit = hits.find(([value]) => Math.abs(value - n) < 0.02);
  return hit ? hit[1] : fmt(n, 4);
}

function SvgExact({ x, y, value }: { x: number; y: number; value: string }) {
  const neg = value.startsWith("−") || value.startsWith("-");
  const body = neg ? value.slice(1) : value;
  if (!body.includes("/")) return <text x={x} y={y} fill="#fde68a" fontSize="11">{value}</text>;
  const [top, bot] = body.split("/");
  return (
    <g>
      {neg ? <text x={x} y={y} fill="#fde68a" fontSize="11">−</text> : null}
      <text x={x + (neg ? 8 : 0)} y={y - 7} fill="#fde68a" fontSize="10">{top}</text>
      <line x1={x + (neg ? 6 : 0)} y1={y - 3} x2={x + (neg ? 30 : 24)} y2={y - 3} stroke="#fde68a" />
      <text x={x + (neg ? 8 : 0)} y={y + 9} fill="#fde68a" fontSize="10">{bot}</text>
    </g>
  );
}

function ExactFrac({ value }: { value: string }) {
  const neg = value.startsWith("−") || value.startsWith("-");
  const body = neg ? value.slice(1) : value;
  if (!body.includes("/")) return <span>{value}</span>;
  const [top, bot] = body.split("/");
  return <span className="msk-exact">{neg ? "−" : ""}<span className="msk-frac"><b>{top}</b><b>{bot}</b></span></span>;
}

function ExactRow({ color, name, exact, approx }: { color: string; name: string; exact: string; approx: string }) {
  return (
    <div className="msk-ratio uc-target-exact-row">
      <i style={{ background: color }} />
      <em>{name}</em>
      <span>=</span>
      <ExactFrac value={exact} />
      <strong>≈ {approx}</strong>
    </div>
  );
}

function wrap180(deg: number) {
  let value = deg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function wrap360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function referenceAngle(deg: number) {
  const t = wrap360(deg);
  if (t <= 90) return t;
  if (t <= 180) return 180 - t;
  if (t < 360) return t <= 270 ? Math.abs(t - 180) : 360 - t;
  return 0;
}

const EXACT_DEGS = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

function nearestExact(deg: number) {
  const t = wrap360(deg);
  return EXACT_DEGS.reduce((best, item) => {
    const dist = Math.min(Math.abs(item - t), 360 - Math.abs(item - t));
    const bestDist = Math.min(Math.abs(best - t), 360 - Math.abs(best - t));
    return dist < bestDist ? item : best;
  }, EXACT_DEGS[0]!);
}

function toSignedAngle(deg: number) {
  const t = wrap360(deg);
  return t > 180 ? t - 360 : t;
}

export default function UnitCircleLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page, MODES);
  const session = useTrigSession();
  const units = session.units;
  const [angle, setAngle] = useState(session.theta);
  const [dir, setDir] = useState<"ccw" | "cw">("ccw");
  const [showRef, setShowRef] = useState(true);
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showTan, setShowTan] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setAngle(session.theta);
  }, [session.theta]);

  useEffect(() => {
    if (mode !== "Exact Values") return;
    setAngle((current) => toSignedAngle(nearestExact(current)));
  }, [mode]);

  useEffect(() => {
    if (mode === "Reference Angles") setShowRef(true);
    if (mode === "Unit Circle") {
      setShowX(true);
      setShowY(true);
    }
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setAngle((value) => wrap180(value + (dir === "ccw" ? 1 : -1) * speed));
    }, 40);
    return () => window.clearInterval(id);
  }, [dir, playing, speed]);

  const live = useMemo(() => {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tan = Math.abs(cos) < 1e-6 ? Infinity : sin / cos;
    const csc = Math.abs(sin) < 1e-6 ? Infinity : 1 / sin;
    const sec = Math.abs(cos) < 1e-6 ? Infinity : 1 / cos;
    const cot = Math.abs(sin) < 1e-6 ? Infinity : cos / sin;
    const t = wrap360(angle);
    const q = t === 0 ? 1 : Math.ceil(t / 90);
    const ref = referenceAngle(angle);
    return { rad, cos, sin, tan, csc, sec, cot, q, ref };
  }, [angle]);

  const cx = 250;
  const cy = 220;
  const r = 174;
  const px = cx + live.cos * r;
  const py = cy - live.sin * r;
  const wave = Array.from({ length: 541 }, (_, i) => {
    const t = i - 180;
    return `${40 + ((t + 180) / 540) * 420},${70 - Math.sin((t * Math.PI) / 180) * 36}`;
  }).join(" ");
  const cosWave = Array.from({ length: 541 }, (_, i) => {
    const t = i - 180;
    return `${40 + ((t + 180) / 540) * 420},${70 - Math.cos((t * Math.PI) / 180) * 36}`;
  }).join(" ");
  const waveX = 40 + ((angle + 180) / 540) * 420;

  const updateAngleFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = pointerInUnitCircle(event);
    const raw = Math.atan2(cy - point.y, point.x - cx) * 180 / Math.PI;
    const next = mode === "Exact Values" ? toSignedAngle(nearestExact(raw)) : raw;
    setAngle(next);
    writeTrigSession({ theta: next });
  };

  const showProjections = mode === "Unit Circle" || mode === "Angles";
  const showWaves = mode === "Angles" || mode === "Unit Circle";
  const showExactTicks = mode === "Exact Values";
  const showQuadrantFill = mode === "Quadrants";
  const showRefTriangle = mode === "Reference Angles" || (mode !== "Quadrants" && showRef);
  const showExactLabels = mode === "Exact Values" || mode === "Unit Circle" || mode === "Reference Angles";

  return (
    <>
      <nav className="msk-tabs trig-target-tabs uc-target-tabs" aria-label="Unit Circle modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab uc-target-lab" data-uc-mode={mode}>
        <Panel
          className="trig-target-controls uc-target-controls"
          title={mode === "Exact Values" ? "Special angles" : mode === "Quadrants" ? "Quadrant focus" : mode === "Reference Angles" ? "Reference angle" : "Angle Controls"}
        >
          <Field label="Angle">
            <Segmented
              value={units}
              onChange={(id) => writeTrigSession({ units: id === "rad" ? "rad" : "deg" })}
              options={[{ id: "deg", label: "Degrees (°)" }, { id: "rad", label: "Radians (rad)" }]}
            />
          </Field>
          <div className="uc-target-angle-input" aria-live="polite">
            <span>θ =</span>
            <strong>{units === "deg" ? `${fmt(angle, 0)}°` : `${fmt(live.rad, 4)} rad`}</strong>
          </div>
          <SliderRow label="θ" value={angle} min={-180} max={180} step={1} onChange={(n) => { const next = mode === "Exact Values" ? toSignedAngle(nearestExact(n)) : n; setAngle(next); writeTrigSession({ theta: next }); }} unit="°" />
          <div className="msk-preset-grid uc-target-presets">
            {ANGLE_CHIPS.map((item) => (
              <button key={item.d} type="button" className={`msk-angle-chip${angle === item.d ? " active" : ""}`} onClick={() => { setAngle(item.d); writeTrigSession({ theta: item.d }); }}>
                <b>{item.d}°</b>
                {item.bot ? <span className="msk-frac"><b>{item.top}</b><b>{item.bot}</b></span> : <span className="msk-frac"><b>{item.top}</b></span>}
              </button>
            ))}
          </div>
          <Field label="Direction">
            <Segmented value={dir} onChange={(id) => setDir(id as "ccw" | "cw")} options={[{ id: "ccw", label: "Counterclockwise" }, { id: "cw", label: "Clockwise" }]} />
          </Field>
          <p className="msk-note uc-target-section-label">Display options</p>
          {mode !== "Quadrants" && mode !== "Exact Values" ? (
            <label className="msk-toggle"><input type="checkbox" checked={showRefTriangle} onChange={(event) => setShowRef(event.target.checked)} disabled={mode === "Reference Angles"} /> Show reference triangle</label>
          ) : null}
          {mode === "Unit Circle" || mode === "Angles" ? (
            <>
              <label className="msk-toggle"><input type="checkbox" checked={showX} onChange={(event) => setShowX(event.target.checked)} /> Show x projection (cos θ)</label>
              <label className="msk-toggle"><input type="checkbox" checked={showY} onChange={(event) => setShowY(event.target.checked)} /> Show y projection (sin θ)</label>
              <label className="msk-toggle"><input type="checkbox" checked={showTan} onChange={(event) => setShowTan(event.target.checked)} /> Show tangent line</label>
            </>
          ) : null}
          {mode === "Quadrants" ? <p className="msk-note">The highlighted quadrant shows the signs of sin, cos, and tan for the current terminal ray.</p> : null}
          {mode === "Exact Values" ? <p className="msk-note">Snap θ to a special angle to read exact sine, cosine, and tangent.</p> : null}
          {mode === "Reference Angles" ? <p className="msk-note">The acute angle α to the x-axis is the reference angle. Related angles share the same exact values, with signs from the quadrant.</p> : null}
          <Field label="Animation">
            <div className="msk-btn-row">
              <button className="msk-cta" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
              <SliderRow label="Speed" value={speed} min={0.25} max={4} step={0.25} onChange={setSpeed} />
            </div>
          </Field>
        </Panel>

        <section className="msk-panel msk-canvas msk-uc-stage trig-target-canvas trig-target-dark uc-target-canvas">
          <svg
            className="msk-graph is-dark is-interactive uc-target-circle-figure"
            viewBox="0 0 500 420"
            role="img"
            aria-label="Unit circle"
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              updateAngleFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              updateAngleFromPointer(event);
            }}
            onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
          >
            <rect width="500" height="420" fill="#061428" />
            {[
              { q: 2, x: 18, y: 22, title: "Quadrant II", sign: "(sin +, cos −)" },
              { q: 1, x: 368, y: 22, title: "Quadrant I", sign: "(sin +, cos +)" },
              { q: 3, x: 18, y: 392, title: "Quadrant III", sign: "(sin −, cos −)" },
              { q: 4, x: 360, y: 392, title: "Quadrant IV", sign: "(sin −, cos +)" },
            ].map((item) => (
              <g key={item.q}>
                {showQuadrantFill ? (
                  <rect
                    x={item.q === 1 || item.q === 4 ? cx : cx - r}
                    y={item.q === 1 || item.q === 2 ? cy - r : cy}
                    width={r}
                    height={r}
                    fill={live.q === item.q ? "rgba(34,211,238,.22)" : "rgba(15,23,42,.18)"}
                  />
                ) : null}
                <text x={item.x} y={item.y} className={`msk-quad${live.q === item.q ? " is-on" : ""}`}>{item.title}</text>
                <text x={item.x} y={item.y + 14} className={`msk-quad-sign${live.q === item.q ? " is-on" : ""}`}>{item.sign}</text>
              </g>
            ))}
            {showExactTicks
              ? ANGLE_CHIPS.map((item) => {
                  const rad = (item.d * Math.PI) / 180;
                  const tx = cx + Math.cos(rad) * (r + 16);
                  const ty = cy - Math.sin(rad) * (r + 16);
                  return (
                    <g key={`tick-${item.d}`}>
                      <circle cx={cx + Math.cos(rad) * r} cy={cy - Math.sin(rad) * r} r={angle === item.d ? 5 : 3} fill={angle === item.d ? UC_COLORS.anglePoint : UC_COLORS.circle} />
                      <text x={tx} y={ty} fill="#fde68a" fontSize="10" textAnchor="middle">{item.d}°</text>
                    </g>
                  );
                })
              : null}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={UC_COLORS.circle} strokeWidth="2" />
            <line x1={cx - r - 20} y1={cy} x2={cx + r + 28} y2={cy} stroke="#64748b" />
            <line x1={cx} y1={cy + r + 16} x2={cx} y2={cy - r - 20} stroke="#64748b" />
            <text x={cx + r + 8} y={cy - 6} fill="#cbd5e1" fontSize="11">x</text>
            <text x={cx + 8} y={cy - r - 8} fill="#cbd5e1" fontSize="11">y</text>
            <text x={cx + r - 2} y={cy + 15} fill="#cbd5e1" fontSize="10">1</text>
            <text x={cx - r - 14} y={cy + 15} fill="#cbd5e1" fontSize="10">−1</text>
            <text x={cx - 13} y={cy - r + 8} fill="#cbd5e1" fontSize="10">1</text>
            <text x={cx - 17} y={cy + r + 1} fill="#cbd5e1" fontSize="10">−1</text>
            <text x={cx + 6} y={cy + 14} fill="#cbd5e1" fontSize="10">O</text>
            {showProjections && showX ? <line className="uc-target-cosine-projection" x1={cx} y1={cy} x2={px} y2={cy} stroke={UC_COLORS.cosine} strokeWidth="2" strokeDasharray="6 4" /> : null}
            {showProjections && showY ? <line className="uc-target-sine-projection" x1={px} y1={cy} x2={px} y2={py} stroke={UC_COLORS.sine} strokeWidth="2" strokeDasharray="6 4" /> : null}
            {showProjections && showX ? <text x={(cx + px) / 2} y={cy + 16} fill={UC_COLORS.cosine} fontSize="11" textAnchor="middle">cos θ</text> : null}
            {showProjections && showY ? <text x={px - 8} y={(cy + py) / 2} fill={UC_COLORS.sine} fontSize="11" textAnchor="end">sin θ</text> : null}
            {showRefTriangle ? <polygon className="uc-target-reference-triangle" points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(168,85,247,.12)" stroke={UC_COLORS.sine} /> : null}
            {showProjections && showTan && Number.isFinite(live.tan) ? (
              <line
                className="uc-target-tangent"
                x1={cx + (live.cos < 0 ? -r : r)}
                y1={cy - Math.abs(live.tan) * r}
                x2={cx + (live.cos < 0 ? -r : r)}
                y2={cy}
                stroke={UC_COLORS.angle}
                strokeDasharray="4 4"
              />
            ) : null}
            <line className="uc-target-terminal-ray" x1={cx} y1={cy} x2={px} y2={py} stroke={UC_COLORS.angle} strokeWidth="2.5" />
            <path className="uc-target-angle-arc" d={`M ${cx + 28} ${cy} A 28 28 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle >= 0 ? 0 : 1} ${cx + 28 * Math.cos(live.rad)} ${cy - 28 * Math.sin(live.rad)}`} fill="none" stroke={UC_COLORS.angle} strokeWidth="2" />
            <circle className="uc-target-angle-point" cx={px} cy={py} r="7" fill={UC_COLORS.anglePoint} stroke="#fff7ed" strokeWidth="2" />
            {showExactLabels ? (
              <>
                <text x={px + 10} y={py - 22} fill="#fde68a" fontSize="11">(cos θ, sin θ)</text>
                <SvgExact x={px + 10} y={py - 4} value={exactish(live.cos)} />
                <text x={px + 52} y={py - 4} fill="#fde68a" fontSize="11">,</text>
                <SvgExact x={px + 62} y={py - 4} value={exactish(live.sin)} />
              </>
            ) : (
              <text x={px + 10} y={py - 8} fill="#fde68a" fontSize="12">{mode === "Angles" ? `${fmt(angle, 0)}°` : `Q${live.q}`}</text>
            )}
            {mode === "Reference Angles" ? (
              <text x={cx + 40} y={cy - 8} fill="#c4b5fd" fontSize="12">α = {fmt(live.ref, 0)}°</text>
            ) : null}
            <text x={cx + 36} y={cy - 36} fill={UC_COLORS.angle} fontSize="13" fontWeight="700">{fmt(angle, 0)}°</text>
          </svg>
          {showWaves ? (
          <svg className="msk-graph is-dark uc-target-wave-figure" viewBox="0 0 500 140" aria-label="Sine and cosine waves">
            <rect width="500" height="140" fill="#061428" />
            <text x="16" y="18" fill={UC_COLORS.sine} fontSize="11">sin θ</text>
            <text x="70" y="18" fill={UC_COLORS.cosine} fontSize="11">cos θ</text>
            <text x="8" y="38" fill="#64748b" fontSize="9">1</text>
            <text x="8" y="74" fill="#64748b" fontSize="9">0</text>
            <text x="4" y="110" fill="#64748b" fontSize="9">−1</text>
            {["−180°", "−90°", "0°", "90°", "180°", "270°", "360°"].map((label, i) => (
              <text key={label} x={40 + i * 70} y="132" fill="#64748b" fontSize="9">{label}</text>
            ))}
            <line x1="40" y1="70" x2="480" y2="70" stroke="#334155" />
            <polyline className="uc-target-sine-wave" points={wave} fill="none" stroke={UC_COLORS.sine} strokeWidth="1.8" />
            <polyline className="uc-target-cosine-wave" points={cosWave} fill="none" stroke={UC_COLORS.cosine} strokeWidth="1.8" />
            <line className="uc-target-wave-cursor" x1={waveX} y1="20" x2={waveX} y2="124" stroke={UC_COLORS.angle} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={waveX} cy={70 - live.sin * 36} r="4" fill={UC_COLORS.sine} />
            <circle cx={waveX} cy={70 - live.cos * 36} r="4" fill={UC_COLORS.cosine} />
            <text x={waveX} y="134" fill={UC_COLORS.angle} fontSize="10" fontWeight="700" textAnchor="middle">{fmt(angle, 0)}°</text>
          </svg>
          ) : null}
        </section>

        <aside className="msk-panel msk-live trig-target-rail uc-target-rail">
          <section className="uc-target-rail-section uc-target-angle-card">
            <h2>Angle</h2>
            <LiveRow color={UC_COLORS.angle} label="θ" value={`${fmt(angle, 1)}° = ${fmt(live.rad, 4)} rad`} />
          </section>
            <section className="uc-target-rail-section uc-target-coordinate-card">
              <h2>Coordinates on Unit Circle</h2>
              <div className="msk-ratio">
                <i style={{ background: UC_COLORS.cosine }} />
                <em>(cos θ, sin θ)</em>
                <span>=</span>
                <span className="msk-exact">(</span>
                <ExactFrac value={exactish(live.cos)} />
                <span className="msk-exact">,</span>
                <ExactFrac value={exactish(live.sin)} />
                <span className="msk-exact">)</span>
              </div>
            </section>
            <section className="uc-target-rail-section uc-target-exact-card">
              <h2>Exact Trigonometric Values</h2>
              <ExactRow color={UC_COLORS.sine} name="sin θ" exact={exactish(live.sin)} approx={fmt(live.sin, 5)} />
              <ExactRow color={UC_COLORS.cosine} name="cos θ" exact={exactish(live.cos)} approx={fmt(live.cos, 5)} />
              <ExactRow color={UC_COLORS.angle} name="tan θ" exact={Number.isFinite(live.tan) ? exactish(live.tan) : "undefined"} approx={Number.isFinite(live.tan) ? fmt(live.tan, 5) : "—"} />
            </section>
            <section className="uc-target-rail-section uc-target-signs-card">
              <h2>Signs by Quadrant</h2>
              <table className="msk-mini-table">
                <thead><tr><th></th>{["I", "II", "III", "IV"].map((q, index) => <th key={q} className={live.q === index + 1 ? "is-active" : ""}>{q}</th>)}</tr></thead>
                <tbody>
                  {[["sin", "+", "+", "−", "−"], ["cos", "+", "−", "−", "+"], ["tan", "+", "−", "+", "−"]].map((row) => (
                    <tr key={row[0]}>{row.map((value, index) => <td key={`${row[0]}-${index}`} className={index === live.q ? "is-active" : ""}>{value}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="msk-note">Current quadrant: {["I", "II", "III", "IV"][live.q - 1]}</p>
            </section>
            <section className="uc-target-rail-section uc-target-reference-card">
              <h2>Reference Angle</h2>
              <LiveRow color={UC_COLORS.sine} label="α" value={`${fmt(live.ref, 1)}° (${live.ref === 45 ? "π/4" : live.ref === 30 ? "π/6" : live.ref === 60 ? "π/3" : live.ref === 90 ? "π/2" : `${fmt(live.ref * Math.PI / 180, 3)} rad`})`} />
            </section>
          <section className="uc-target-rail-section uc-target-explanation-card">
          <h2>Explanation</h2>
          <p className="msk-note">
            {mode === "Quadrants"
              ? `At ${fmt(angle, 0)}°, the terminal side is in Quadrant ${["I", "II", "III", "IV"][live.q - 1]}. Read signs from the CAST table.`
              : mode === "Exact Values"
                ? `Exact values at ${fmt(angle, 0)}°: sin = ${exactish(live.sin)}, cos = ${exactish(live.cos)}.`
                : mode === "Reference Angles"
                  ? `α = ${fmt(live.ref, 0)}° is the acute angle to the x-axis. Signs still come from Quadrant ${["I", "II", "III", "IV"][live.q - 1]}.`
                  : mode === "Angles"
                    ? `θ = ${units === "deg" ? `${fmt(angle, 1)}°` : `${fmt(live.rad, 4)} rad`}. Positive angles run counterclockwise.`
                    : `At ${fmt(angle, 0)}°, the terminal side lies in Quadrant ${["I", "II", "III", "IV"][live.q - 1]}. Use the unit circle to read exact values and signs.`}
          </p>
          </section>
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
      <div className="trig-target-footer uc-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}
