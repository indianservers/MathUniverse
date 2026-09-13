import { useEffect, useMemo, useState } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, Segmented, SliderRow, fmt, useLabMode } from "../studioLabKit";

const MODES = ["Angles", "Unit Circle", "Quadrants", "Exact Values", "Reference Angles"];
const ANGLE_CHIPS = [
  { d: 0, top: "π", bot: "" },
  { d: 30, top: "π", bot: "6" },
  { d: 45, top: "π", bot: "4" },
  { d: 60, top: "π", bot: "3" },
  { d: 90, top: "π", bot: "2" },
  { d: 120, top: "2π", bot: "3" },
  { d: 135, top: "3π", bot: "4" },
  { d: 180, top: "π", bot: "" },
];

function exactish(n: number) {
  const hits: Array<[number, string]> = [
    [0, "0"], [0.5, "1/2"], [Math.SQRT1_2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [1, "1"],
    [-0.5, "−1/2"], [-Math.SQRT1_2, "−√2/2"], [-Math.sqrt(3) / 2, "−√3/2"], [-1, "−1"],
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
    <div className="msk-ratio">
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

export default function UnitCircleLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page, MODES);
  const [units, setUnits] = useState<"deg" | "rad">("deg");
  const [angle, setAngle] = useState(135);
  const [dir, setDir] = useState<"ccw" | "cw">("ccw");
  const [showRef, setShowRef] = useState(true);
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showTan, setShowTan] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

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
    const q = angle >= 0 && angle <= 90 ? 1 : angle > 90 ? 2 : angle >= -90 ? 4 : 3;
    const ref = Math.min(Math.abs(angle % 180), 180 - Math.abs(angle % 180));
    return { rad, cos, sin, tan, q, ref: Math.abs(angle) > 90 ? 180 - Math.abs(angle) : Math.abs(angle) || ref };
  }, [angle]);

  const cx = 250;
  const cy = 168;
  const r = 118;
  const px = cx + live.cos * r;
  const py = cy - live.sin * r;
  const wave = Array.from({ length: 361 }, (_, i) => {
    const t = i - 180;
    return `${40 + ((t + 180) / 360) * 420},${70 - Math.sin((t * Math.PI) / 180) * 36}`;
  }).join(" ");
  const cosWave = Array.from({ length: 361 }, (_, i) => {
    const t = i - 180;
    return `${40 + ((t + 180) / 360) * 420},${70 - Math.cos((t * Math.PI) / 180) * 36}`;
  }).join(" ");

  return (
    <>
      <nav className="msk-tabs" aria-label="Unit Circle modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab">
        <Panel title="Angle Controls">
          <Field label="Angle">
            <Segmented value={units} onChange={(id) => setUnits(id as "deg" | "rad")} options={[{ id: "deg", label: "Degrees (°)" }, { id: "rad", label: "Radians (rad)" }]} />
          </Field>
          <SliderRow label="θ" value={angle} min={-180} max={180} step={1} onChange={setAngle} unit="°" />
          <div className="msk-preset-grid">
            {ANGLE_CHIPS.map((item) => (
              <button key={item.d} type="button" className={`msk-angle-chip${angle === item.d ? " active" : ""}`} onClick={() => setAngle(item.d)}>
                <b>{item.d}°</b>
                {item.bot ? <span className="msk-frac"><b>{item.top}</b><b>{item.bot}</b></span> : <span className="msk-frac"><b>{item.top}</b></span>}
              </button>
            ))}
          </div>
          <Field label="Direction">
            <Segmented value={dir} onChange={(id) => setDir(id as "ccw" | "cw")} options={[{ id: "ccw", label: "Counterclockwise" }, { id: "cw", label: "Clockwise" }]} />
          </Field>
          <p className="msk-note">Display options</p>
          <label className="msk-toggle"><input type="checkbox" checked={showRef} onChange={(event) => setShowRef(event.target.checked)} /> Show reference triangle</label>
          <label className="msk-toggle"><input type="checkbox" checked={showX} onChange={(event) => setShowX(event.target.checked)} /> Show x projection (cos θ)</label>
          <label className="msk-toggle"><input type="checkbox" checked={showY} onChange={(event) => setShowY(event.target.checked)} /> Show y projection (sin θ)</label>
          <label className="msk-toggle"><input type="checkbox" checked={showTan} onChange={(event) => setShowTan(event.target.checked)} /> Show tangent line</label>
          <Field label="Animation">
            <div className="msk-btn-row">
              <button className="msk-cta" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
              <SliderRow label="Speed" value={speed} min={0.25} max={4} step={0.25} onChange={setSpeed} />
            </div>
          </Field>
        </Panel>

        <section className="msk-panel msk-canvas msk-uc-stage">
          <svg className="msk-graph is-dark" viewBox="0 0 500 340" role="img" aria-label="Unit circle">
            <rect width="500" height="340" fill="#061428" />
            {[
              { q: 2, x: 18, y: 22, title: "Quadrant II", sign: "(sin +, cos −)" },
              { q: 1, x: 368, y: 22, title: "Quadrant I", sign: "(sin +, cos +)" },
              { q: 3, x: 18, y: 312, title: "Quadrant III", sign: "(sin −, cos −)" },
              { q: 4, x: 360, y: 312, title: "Quadrant IV", sign: "(sin −, cos +)" },
            ].map((item) => (
              <g key={item.q}>
                <text x={item.x} y={item.y} className={`msk-quad${live.q === item.q ? " is-on" : ""}`}>{item.title}</text>
                <text x={item.x} y={item.y + 14} className={`msk-quad-sign${live.q === item.q ? " is-on" : ""}`}>{item.sign}</text>
              </g>
            ))}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22d3ee" strokeWidth="2" />
            <line x1={cx - r - 20} y1={cy} x2={cx + r + 28} y2={cy} stroke="#64748b" />
            <line x1={cx} y1={cy + r + 16} x2={cx} y2={cy - r - 20} stroke="#64748b" />
            <text x={cx + r + 8} y={cy - 6} fill="#cbd5e1" fontSize="11">x</text>
            <text x={cx + 8} y={cy - r - 8} fill="#cbd5e1" fontSize="11">y</text>
            {showX ? <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#22d3ee" strokeDasharray="5 4" /> : null}
            {showY ? <line x1={px} y1={cy} x2={px} y2={py} stroke="#a78bfa" strokeDasharray="5 4" /> : null}
            {showRef ? <polygon points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(167,139,250,.12)" stroke="#a78bfa" /> : null}
            {showTan && Number.isFinite(live.tan) ? <line x1={cx + r} y1={cy - live.tan * r} x2={cx + r} y2={cy} stroke="#f59e0b" strokeDasharray="4 4" /> : null}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f8fafc" strokeWidth="2" />
            <path d={`M ${cx + 28} ${cy} A 28 28 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle >= 0 ? 0 : 1} ${cx + 28 * Math.cos(live.rad)} ${cy - 28 * Math.sin(live.rad)}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx={px} cy={py} r="6" fill="#fbbf24" />
            <text x={px + 10} y={py - 22} fill="#fde68a" fontSize="11">(cos θ, sin θ)</text>
            <SvgExact x={px + 10} y={py - 4} value={exactish(live.cos)} />
            <text x={px + 52} y={py - 4} fill="#fde68a" fontSize="11">,</text>
            <SvgExact x={px + 62} y={py - 4} value={exactish(live.sin)} />
            <text x={cx + 36} y={cy - 36} fill="#fbbf24" fontSize="13">{fmt(angle, 0)}°</text>
          </svg>
          <svg className="msk-graph is-dark" viewBox="0 0 500 140" aria-label="Sine and cosine waves">
            <rect width="500" height="140" fill="#061428" />
            <text x="16" y="18" fill="#22d3ee" fontSize="11">sin θ</text>
            <text x="70" y="18" fill="#a78bfa" fontSize="11">cos θ</text>
            <text x="8" y="38" fill="#64748b" fontSize="9">1</text>
            <text x="8" y="74" fill="#64748b" fontSize="9">0</text>
            <text x="4" y="110" fill="#64748b" fontSize="9">−1</text>
            {["−180°", "−90°", "0°", "90°", "180°", "270°", "360°"].map((label, i) => (
              <text key={label} x={40 + i * 70} y="132" fill="#64748b" fontSize="9">{label}</text>
            ))}
            <line x1="40" y1="70" x2="480" y2="70" stroke="#334155" />
            <polyline points={wave} fill="none" stroke="#22d3ee" strokeWidth="1.8" />
            <polyline points={cosWave} fill="none" stroke="#a78bfa" strokeWidth="1.6" />
            <line x1={40 + ((angle + 180) / 360) * 420} y1="20" x2={40 + ((angle + 180) / 360) * 420} y2="124" stroke="#fbbf24" strokeDasharray="3 3" />
            <circle cx={40 + ((angle + 180) / 360) * 420} cy={70 - live.sin * 36} r="4" fill="#fbbf24" />
          </svg>
        </section>

        <aside className="msk-panel msk-live">
          <h2>Angle</h2>
          <LiveRow color="#f59e0b" label="θ" value={`${fmt(angle, 1)}° = ${fmt(live.rad, 4)} rad`} />
          <h2>Coordinates on Unit Circle</h2>
          <LiveRow color="#22d3ee" label="(cos θ, sin θ)" value={`(${exactish(live.cos)}, ${exactish(live.sin)})`} />
          <h2>Exact Trigonometric Values</h2>
          <ExactRow color="#22d3ee" name="sin θ" exact={exactish(live.sin)} approx={fmt(live.sin, 5)} />
          <ExactRow color="#8b45f4" name="cos θ" exact={exactish(live.cos)} approx={fmt(live.cos, 5)} />
          <ExactRow color="#f59e0b" name="tan θ" exact={Number.isFinite(live.tan) ? exactish(live.tan) : "undefined"} approx={Number.isFinite(live.tan) ? fmt(live.tan, 5) : "—"} />
          <h2>Signs by Quadrant</h2>
          <table className="msk-mini-table">
            <thead><tr><th></th><th>I</th><th>II</th><th>III</th><th>IV</th></tr></thead>
            <tbody>
              <tr><td>sin</td><td>+</td><td>+</td><td>−</td><td>−</td></tr>
              <tr><td>cos</td><td>+</td><td>−</td><td>−</td><td>+</td></tr>
              <tr><td>tan</td><td>+</td><td>−</td><td>+</td><td>−</td></tr>
            </tbody>
          </table>
          <h2>Reference Angle</h2>
          <LiveRow color="#8b45f4" label="α" value={`${fmt(live.ref, 1)}°`} />
          <p className="msk-note">At {fmt(angle, 0)}°, the terminal side lies in Quadrant {["I", "II", "III", "IV"][live.q - 1]}. Use the unit circle to read exact values and signs.</p>
          <ChallengeBox prompt={page.challenge.prompt} expected={page.challenge.expected} hint={page.challenge.hint} />
        </aside>
      </div>
      <MockupLearningStrip page={page} />
    </>
  );
}
