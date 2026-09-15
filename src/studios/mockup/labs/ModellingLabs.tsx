import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, SliderRow, StatusOk, clamp, fmt } from "../studioLabKit";
import { aic, fitMetrics, formatComparisonReport, parseCsvPairs, sampleGrowth } from "../../modelling/comparisonMath";
import { astarRoute, shortestRoute, trafficGraph } from "../../modelling/networkMath";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";

function Chrome({ page, children }: { page: StudioMockupPage; children: React.ReactNode | ((mode: string) => React.ReactNode) }) {
  return <Phase1LabChrome page={page}>{children}</Phase1LabChrome>;
}

function MiniPlot({ points, color, yMax, label }: { points: number[]; color: string; yMax: number; label: string }) {
  const d = points.map((y, i) => `${8 + i * (184 / Math.max(1, points.length - 1))},${88 - (y / (yMax || 1)) * 72}`).join(" ");
  return (
    <svg className="msk-graph" viewBox="0 0 200 96" role="img" aria-label={label}>
      <rect width="200" height="96" fill="#f8fbff" />
      <polyline points={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function ModellingStudioLab({ page }: { page: StudioMockupPage }) {
  switch (page.id) {
    case "motion": return <MotionLab page={page} />;
    case "population": return <PopulationLab page={page} />;
    case "epidemics": return <EpidemicLab page={page} />;
    case "finance": return <FinanceLab page={page} />;
    case "optimization": return <OptimizationLab page={page} />;
    case "networks": return <NetworksLab page={page} />;
    case "regression": return <RegressionLab page={page} />;
    case "periodic": return <PeriodicLab page={page} />;
    case "numerical": return <NumericalLab page={page} />;
    case "comparison": return <ComparisonLab page={page} />;
    default: return null;
  }
}

function projectile(v0: number, th: number, g: number, k: number, y0: number) {
  const rad = th * Math.PI / 180;
  const vx0 = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);
  const dt = 0.04;
  const pts: Array<{ t: number; x: number; y: number; vx: number; vy: number }> = [];
  let t = 0, x = 0, y = y0, vx = vx0, vy = vy0;
  for (let i = 0; i < 240 && y >= -0.05; i += 1) {
    pts.push({ t, x, y, vx, vy });
    const speed = Math.hypot(vx, vy);
    vx += -k * vx * speed * dt;
    vy += (-g - k * vy * speed) * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;
  }
  return pts;
}

function MotionLab({ page }: { page: StudioMockupPage }) {
  const [v0, setV0] = useState(22);
  const [th, setTh] = useState(45);
  const [g, setG] = useState(9.81);
  const [k, setK] = useState(0.02);
  const [y0, setY0] = useState(1.5);
  const [tPlay, setTPlay] = useState(1.23);
  const a = useMemo(() => projectile(v0, th, g, 0, y0), [v0, th, g, y0]);
  const b = useMemo(() => projectile(v0, th, g, k, y0), [v0, th, g, k, y0]);
  const tMax = Math.max(a.at(-1)?.t ?? 1, b.at(-1)?.t ?? 1);
  const at = a.find((p) => p.t >= tPlay) ?? a.at(-1)!;
  const bt = b.find((p) => p.t >= tPlay) ?? b.at(-1)!;
  const rangeA = a.at(-1)?.x ?? 0;
  const rangeB = b.at(-1)?.x ?? 0;
  const apexA = Math.max(...a.map((p) => p.y));
  const apexB = Math.max(...b.map((p) => p.y));
  const scaleX = 560 / Math.max(rangeA, 40);
  const path = (pts: typeof a) => pts.map((p) => `${24 + p.x * scaleX},${168 - p.y * 4.6}`).join(" ");
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Scenario">
            <Field label="Example">
              <select defaultValue="Soccer Kick" aria-label="Scenario"><option>Soccer Kick</option><option>Vehicle</option><option>Pursuit</option></select>
            </Field>
            <SliderRow label="Initial speed, v₀" value={v0} min={5} max={50} step={0.5} onChange={setV0} unit="m/s" />
            <SliderRow label="Launch angle, θ" value={th} min={5} max={80} step={1} onChange={setTh} unit="°" />
            <SliderRow label="Gravity, g" value={g} min={1} max={20} step={0.01} onChange={setG} unit="m/s²" />
            <SliderRow label="Drag coefficient, k" value={k} min={0} max={0.12} step={0.005} onChange={setK} />
            <SliderRow label="Launch height, y₀" value={y0} min={0} max={10} step={0.1} onChange={setY0} unit="m" />
            <p className="msk-note">Mode {mode}: Model A ignores drag; Model B uses quadratic drag.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <div className="msk-card-top"><h2>Simulation view</h2><span>{mode === "Vehicle" ? "Road" : mode === "Pursuit" ? "Chase" : "2D · 3D"}</span></div>
            <svg className="msk-graph is-interactive msk-model-field" viewBox="0 0 640 220" role="img" aria-label={`${mode} motion comparison`}>
              <defs>
                <linearGradient id="md-pitch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d7f0b8" />
                  <stop offset="1" stopColor="#b7de86" />
                </linearGradient>
              </defs>
              <rect width="640" height="220" fill={mode === "Vehicle" ? "#e8eef4" : mode === "Pursuit" ? "#f4efe6" : "url(#md-pitch)"} />
              {mode === "Vehicle" ? (
                <>
                  <rect x="0" y="150" width="640" height="70" fill="#94a3b8" />
                  <line x1="20" y1="185" x2="620" y2="185" stroke="#fff" strokeDasharray="14 10" />
                </>
              ) : (
                <>
                  <rect x="0" y="176" width="640" height="44" fill="#8fbf4a" />
                  <line x1="24" y1="176" x2="610" y2="176" stroke="#d9f0b2" strokeWidth="2" />
                  <circle cx="46" cy="168" r="10" fill="#1d4ed8" />
                  <rect x="42" y="150" width="8" height="18" fill="#1d4ed8" />
                  <rect x="560" y="132" width="56" height="44" fill="none" stroke="#64748b" strokeWidth="3" />
                  <line x1="560" y1="132" x2="616" y2="132" stroke="#64748b" strokeWidth="3" />
                </>
              )}
              {mode === "Pursuit" ? (
                <polyline points={a.map((p, i) => `${40 + i * 2.2},${150 - Math.sin(i / 6) * 28}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="2" />
              ) : null}
              <polyline points={path(a)} fill="none" stroke="#147df2" strokeDasharray="7 5" strokeWidth="2.4" />
              <polyline points={path(b)} fill="none" stroke="#8b45f4" strokeWidth="2.6" />
              {a.filter((_, i) => i % 18 === 0).map((p) => <circle key={`a-${p.t}`} cx={24 + p.x * scaleX} cy={168 - p.y * 4.6} r="3" fill="#147df2" />)}
              {b.filter((_, i) => i % 18 === 0).map((p) => <circle key={`b-${p.t}`} cx={24 + p.x * scaleX} cy={168 - p.y * 4.6} r="3" fill="#8b45f4" />)}
              <circle cx={24 + at.x * scaleX} cy={168 - at.y * 4.6} r="7" fill="#147df2" />
              <circle cx={24 + bt.x * scaleX} cy={168 - bt.y * 4.6} r="7" fill="#8b45f4" />
              <text x="16" y="18" fill="#475569" fontSize="11">y (m)</text>
              <text x="590" y="214" fill="#475569" fontSize="11">x (m)</text>
            </svg>
            <SliderRow label="t" value={tPlay} min={0} max={tMax} step={0.02} onChange={setTPlay} unit="s" />
            <div className="msk-model-minis">
              <MiniPlot points={a.map((p) => p.x)} color="#147df2" yMax={Math.max(rangeA, 1)} label="Position" />
              <MiniPlot points={a.map((p) => p.y)} color="#08b9dd" yMax={Math.max(apexA, 1)} label="Height" />
              <MiniPlot points={a.map((p) => p.vy)} color="#f59e0b" yMax={Math.max(v0, 1)} label="Velocity" />
            </div>
            <div className="msk-model-compare" aria-label="Model comparison">
              <div><b>RMSE (x)</b>{fmt(Math.abs(rangeA - rangeB) * 0.02, 2)} m</div>
              <div><b>Max error</b>{fmt(Math.abs(apexA - apexB), 2)} m</div>
              <div><b>Overall R²</b>0.97</div>
              <div><b>Best fit</b>Model B (With Drag)</div>
            </div>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Equations</h2>
            <p className="msk-formula">x(t) = v₀ cos θ · t</p>
            <p className="msk-formula">y(t) = y₀ + v₀ sin θ · t − ½ g t²</p>
            {mode === "Drag" || mode === "Projectile" ? <p className="msk-formula">m dv/dt = −mg ĵ − k |v| v</p> : null}
            <h2>Live metrics</h2>
            <LiveRow color="#147df2" label="Current time" value={`${fmt(tPlay, 2)} s`} />
            <LiveRow color="#08b9dd" label="Range A / B" value={`${fmt(rangeA, 1)} / ${fmt(rangeB, 1)} m`} />
            <LiveRow color="#8b45f4" label="Max height A / B" value={`${fmt(apexA, 1)} / ${fmt(apexB, 1)} m`} />
            <LiveRow color="#f59e0b" label="Flight time" value={`${fmt(tMax, 2)} s`} />
            <LiveRow color="#10b981" label="Impact velocity" value={`${fmt(Math.hypot(bt.vx, bt.vy), 1)} m/s`} />
            <ul className="msk-assumptions">
              <li data-ok="true">Uniform gravity</li>
              <li data-ok="true">Launched from a fixed point</li>
              <li data-ok={mode === "Drag" || mode === "Vehicle" ? "true" : "false"}>{mode === "Drag" || mode === "Vehicle" ? "Air resistance in Model B" : "No wind in Model A"}</li>
            </ul>
            <StatusOk>Model B matches the observed data better. Drag reduces range by {fmt(rangeA - rangeB, 1)} m.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function PopulationLab({ page }: { page: StudioMockupPage }) {
  const [p0, setP0] = useState(100);
  const [r, setR] = useState(0.35);
  const [k, setK] = useState(5000);
  const [h, setH] = useState(0);
  const [T, setT] = useState(50);
  const exp = useMemo(() => Array.from({ length: 81 }, (_, i) => p0 * Math.exp(r * (i * T / 80))), [p0, r, T]);
  const log = useMemo(() => Array.from({ length: 81 }, (_, i) => {
    const t = i * T / 80;
    return k / (1 + ((k - p0) / p0) * Math.exp(-(r - h) * t));
  }), [p0, r, k, h, T]);
  const path = (vals: number[], color: string) => {
    const max = Math.max(k * 1.2, ...vals);
    return <polyline points={vals.map((y, i) => `${24 + i * 4.6},${210 - (y / max) * 170}`).join(" ")} fill="none" stroke={color} strokeWidth="2.2" />;
  };
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Assumptions & parameters">
            <SliderRow label="Initial population P₀" value={p0} min={10} max={2000} step={10} onChange={setP0} />
            <SliderRow label="Growth rate r" value={r} min={0.01} max={1} step={0.01} onChange={setR} />
            <SliderRow label="Carrying capacity K" value={k} min={200} max={10000} step={50} onChange={setK} />
            <SliderRow label="Harvest rate h" value={h} min={0} max={0.6} step={0.01} onChange={setH} />
            <SliderRow label="Time horizon T" value={T} min={10} max={80} step={1} onChange={setT} />
            <p className="msk-note">{mode}: exponential vs logistic{h > 0 ? " with harvesting" : ""}.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Population over time</h2>
            <svg className="msk-graph" viewBox="0 0 420 230" role="img" aria-label="Population models">
              <rect width="420" height="230" fill="#f8fbff" />
              {path(exp, "#08b9dd")}
              {path(log, "#8b45f4")}
              <line x1="24" y1={210 - 170 / 1.2} x2="400" y2={210 - 170 / 1.2} stroke="#94a3b8" strokeDasharray="4 3" />
              <text x="300" y={206 - 170 / 1.2} fill="#64748b" fontSize="11">K = {fmt(k, 0)}</text>
            </svg>
            <svg className="msk-graph" viewBox="0 0 420 140" role="img" aria-label={`${mode} phase plot`}>
              <rect width="420" height="140" fill="#f8fbff" />
              {mode === "Age Structured" ? (
                <>
                  <rect x="40" y="40" width="70" height="60" fill="rgba(20,125,242,.2)" stroke="#147df2" />
                  <rect x="170" y="40" width="70" height="60" fill="rgba(139,69,244,.2)" stroke="#8b45f4" />
                  <rect x="300" y="40" width="70" height="60" fill="rgba(16,185,129,.2)" stroke="#10b981" />
                  <text x="52" y="75" fontSize="11">Youth</text>
                  <text x="180" y="75" fontSize="11">Adult</text>
                  <text x="314" y="75" fontSize="11">Elder</text>
                </>
              ) : (
                <path d={`M30 110 Q 140 ${mode === "Harvesting" ? 40 : 20} 390 90`} fill="none" stroke={mode === "Exponential" ? "#08b9dd" : "#8b45f4"} strokeWidth="2.2" />
              )}
              <text x="16" y="20" fill="#475569" fontSize="11">{mode === "Exponential" ? "dP/dt vs P is a ray" : mode === "Harvesting" ? "Harvest shifts equilibrium" : "Logistic parabola"}</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Equations & models</h2>
            <p className="msk-formula">dP/dt = rP · P(t)=P₀eʳᵗ</p>
            <p className="msk-formula">dP/dt = rP(1−P/K)</p>
            <LiveRow color="#08b9dd" label="P(T) exp" value={fmt(exp.at(-1) ?? 0, 0)} />
            <LiveRow color="#8b45f4" label="P(T) logistic" value={fmt(log.at(-1) ?? 0, 0)} />
            <LiveRow color="#10b981" label="Equilibrium" value={fmt(k, 0)} />
            <StatusOk>The logistic model levels off at K while exponential does not.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function EpidemicLab({ page }: { page: StudioMockupPage }) {
  const [beta, setBeta] = useState(0.45);
  const [gamma, setGamma] = useState(0.15);
  const [vax, setVax] = useState(0.02);
  const [i0, setI0] = useState(50);
  const [n, setN] = useState(100000);
  const r0 = beta / gamma;
  const pts = useMemo(() => {
    let s = n - i0 - vax * n, i = i0, r = vax * n;
    const out = [{ s, i, r }];
    for (let t = 0; t < 200; t += 1) {
      const ds = -beta * s * i / n;
      const di = beta * s * i / n - gamma * i;
      const dr = gamma * i;
      s = clamp(s + ds, 0, n); i = clamp(i + di, 0, n); r = clamp(r + dr, 0, n);
      out.push({ s, i, r });
    }
    return out;
  }, [beta, gamma, vax, i0, n]);
  const peakI = Math.max(...pts.map((p) => p.i));
  const path = (key: "s" | "i" | "r", color: string) => <polyline points={pts.map((p, idx) => `${20 + idx * 1.9},${210 - (p[key] / n) * 170}`).join(" ")} fill="none" stroke={color} strokeWidth="2.2" />;
  const last = pts[75] ?? pts.at(-1)!;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 80);
    return () => window.clearInterval(id);
  }, []);
  const re = r0 * (last.s / n);
  const hosp = n * 0.02;
  const dots = Array.from({ length: 18 }, (_, i) => {
    const t = ((tick + i * 3) % 40) / 40;
    return { x: 40 + t * 140, y: 28 + Math.sin((tick + i) / 4) * 4 };
  });
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Parameters">
            <SliderRow label="Contact rate β" value={beta} min={0.05} max={1} step={0.01} onChange={setBeta} />
            <SliderRow label="Recovery rate γ" value={gamma} min={0.04} max={0.5} step={0.01} onChange={setGamma} />
            <SliderRow label="Vaccination rate ν" value={vax} min={0} max={0.4} step={0.01} onChange={setVax} />
            <SliderRow label="Initial infected I₀" value={i0} min={1} max={2000} step={1} onChange={setI0} />
            <SliderRow label="Population N" value={n} min={1000} max={1000000} step={1000} onChange={setN} />
            <p className="msk-note">{mode} scenario. S₀ = {fmt(n - i0, 0)}</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Compartment flow (live)</h2>
            <div className="msk-sir-flow" aria-label="Compartment flow animation">
              <b className="is-s">S {fmt(last.s, 0)}</b>
              <svg width="160" height="36" aria-hidden="true">
                {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="3" fill={i % 2 ? "#8b45f4" : "#147df2"} />)}
              </svg>
              <b className="is-i">I {fmt(last.i, 0)}</b>
              <span>→</span>
              <b className="is-r">R {fmt(last.r, 0)}</b>
            </div>
            <svg className="msk-graph" viewBox="0 0 420 230" role="img" aria-label="Epidemic curves">
              <rect width="420" height="230" fill="#f8fbff" />
              {path("s", "#147df2")}
              {path("i", "#8b45f4")}
              {path("r", "#10b981")}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live metrics (Day 75)</h2>
            <LiveRow color="#ef4444" label="R₀" value={fmt(r0, 2)} />
            <LiveRow color="#f59e0b" label="Rₑ" value={fmt(re, 2)} />
            <LiveRow color="#8b45f4" label="Peak infections" value={fmt(peakI, 0)} />
            <LiveRow color="#10b981" label="Hospital capacity" value={fmt(hosp, 0)} />
            <StatusOk>{peakI > hosp ? "Peak exceeds hospital capacity." : re < 1 ? "Outbreak under control (Rₑ < 1)." : "Rₑ > 1 until susceptibles fall."}</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function FinanceLab({ page }: { page: StudioMockupPage }) {
  const [p0, setP0] = useState(10000);
  const [contrib, setContrib] = useState(500);
  const [rate, setRate] = useState(0.06);
  const [fee, setFee] = useState(0.005);
  const [inf, setInf] = useState(0.025);
  const [years, setYears] = useState(30);
  const n = 12;
  const series = useMemo(() => {
    const pts: Array<{ y: number; nom: number; real: number; paid: number }> = [];
    let nom = p0, paid = p0;
    for (let y = 0; y <= years; y += 1) {
      pts.push({ y, nom, real: nom / (1 + inf) ** y, paid });
      for (let m = 0; m < n; m += 1) {
        nom = nom * (1 + (rate - fee) / n) + contrib;
        paid += contrib;
      }
    }
    return pts;
  }, [p0, contrib, rate, fee, inf, years]);
  const last = series.at(-1)!;
  const max = last.nom;
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Assumptions & parameters">
            <SliderRow label="Initial principal" value={p0} min={500} max={50000} step={500} onChange={setP0} />
            <SliderRow label="Regular contribution" value={contrib} min={0} max={2000} step={50} onChange={setContrib} />
            <SliderRow label="Annual nominal interest" value={rate} min={0} max={0.16} step={0.005} onChange={setRate} />
            <SliderRow label="Average annual fee" value={fee} min={0} max={0.03} step={0.001} onChange={setFee} />
            <SliderRow label="Inflation rate" value={inf} min={0} max={0.08} step={0.005} onChange={setInf} />
            <SliderRow label="Time horizon" value={years} min={1} max={50} step={1} onChange={setYears} unit="years" />
            <p className="msk-note">{mode}: monthly compounding (12×).</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Account growth over time</h2>
            <svg className="msk-graph" viewBox="0 0 440 220" role="img" aria-label="Nominal vs real value">
              <rect width="440" height="220" fill="#f8fbff" />
              <polyline points={series.map((p) => `${20 + p.y * (400 / years)},${200 - (p.nom / max) * 170}`).join(" ")} fill="none" stroke="#08b9dd" strokeWidth="2.2" />
              <polyline points={series.map((p) => `${20 + p.y * (400 / years)},${200 - (p.real / max) * 170}`).join(" ")} fill="none" stroke="#8b45f4" strokeWidth="2.2" />
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live equations</h2>
            <p className="msk-formula">FV = P₀(1+r/n)ⁿᵗ + PMT · ((1+r/n)ⁿᵗ−1)/(r/n)</p>
            <LiveRow color="#08b9dd" label="Future value (nominal)" value={`$${fmt(last.nom, 0)}`} />
            <LiveRow color="#8b45f4" label="Future value (real)" value={`$${fmt(last.real, 0)}`} />
            <LiveRow color="#10b981" label="Total contributions" value={`$${fmt(last.paid, 0)}`} />
            <StatusOk>Most growth comes from interest. Inflation cuts real value.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function OptimizationLab({ page }: { page: StudioMockupPage }) {
  const [x, setX] = useState(40);
  const [labor, setLabor] = useState(100);
  const [material, setMaterial] = useState(80);
  const [machine, setMachine] = useState(90);
  const yMax = Math.min((labor - 2 * x) / 1, machine - x, 50, material);
  const y = clamp(30, 0, Math.max(0, yMax));
  const z = 50 * x + 40 * y;
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Decision variables">
            <SliderRow label="x₁ Product A" value={x} min={0} max={60} step={1} onChange={setX} />
            <p className="msk-formula">Max Z = 50x₁ + 40x₂ · Live Z = {fmt(z, 0)}</p>
            <SliderRow label="Labor (hrs)" value={labor} min={40} max={160} step={1} onChange={setLabor} />
            <SliderRow label="Material (kg)" value={material} min={20} max={120} step={1} onChange={setMaterial} />
            <SliderRow label="Machine (hrs)" value={machine} min={40} max={140} step={1} onChange={setMachine} />
            <p className="msk-note">{mode}: feasible region updates with resources.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Feasible region & objective</h2>
            <svg className="msk-graph" viewBox="0 0 420 260" role="img" aria-label="LP feasible region">
              <rect width="420" height="260" fill="#f8fbff" />
              <polygon points="40,220 40,80 180,40 300,90 300,220" fill="rgba(8,185,221,.18)" stroke="#08b9dd" />
              <circle cx={40 + x * 4.2} cy={220 - y * 3.4} r="7" fill="#f59e0b" />
              <text x="220" y="36" fill="#b45309" fontSize="12">Optimal ({fmt(x, 0)}, {fmt(y, 0)}) · Max Z = {fmt(z, 0)}</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live summary</h2>
            <LiveRow color="#f59e0b" label="Max profit Z" value={fmt(z, 0)} />
            <LiveRow color="#147df2" label="Optimal (x₁, x₂)" value={`(${fmt(x, 0)}, ${fmt(y, 0)})`} />
            <StatusOk>Increasing labor by 1 hour raises profit if the labor constraint is binding.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function NetworksLab({ page }: { page: StudioMockupPage }) {
  const [algo, setAlgo] = useState("Dijkstra");
  const [traffic, setTraffic] = useState(0.62);
  const [closed, setClosed] = useState(0.1);
  const [origin, setOrigin] = useState("A");
  const [dest, setDest] = useState("E");
  const graph = useMemo(() => trafficGraph(traffic, closed), [traffic, closed]);
  const dij = useMemo(() => shortestRoute(graph, origin, dest), [graph, origin, dest]);
  const ast = useMemo(() => astarRoute(graph, origin, dest), [graph, origin, dest]);
  const chosen = algo === "Dijkstra" ? dij : ast;
  const nodePos = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const pathPts = chosen.path.map((id) => nodePos[id]).filter(Boolean);
  return (
    <Chrome page={page}>
      {(mode) => (
      <>
      <Panel title="Route setup">
        <Field label="Origin"><select value={origin} aria-label="Origin" onChange={(e) => setOrigin(e.target.value)}><option value="A">Downtown (A)</option><option value="B">Station (B)</option></select></Field>
        <Field label="Destination"><select value={dest} aria-label="Destination" onChange={(e) => setDest(e.target.value)}><option value="E">University (E)</option><option value="C">Airport (C)</option></select></Field>
        <div className="msk-seg">
          <button type="button" className={algo === "Dijkstra" ? "active" : ""} onClick={() => setAlgo("Dijkstra")}>Dijkstra</button>
          <button type="button" className={algo === "A*" ? "active" : ""} onClick={() => setAlgo("A*")}>A* (Heuristic)</button>
        </div>
        <SliderRow label="Traffic" value={traffic} min={0} max={1} step={0.01} onChange={setTraffic} />
        <SliderRow label="Road closures" value={closed} min={0} max={0.5} step={0.01} onChange={setClosed} />
      </Panel>
      <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
        <h2>City network</h2>
        <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label="Routing map">
          <rect width="420" height="280" fill="#eef4f0" />
          {graph.edges.map((e) => {
            const a = nodePos[e.source];
            const b = nodePos[e.target];
            if (!a || !b) return null;
            return <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth="2" />;
          })}
          {pathPts.length > 1 ? <polyline points={pathPts.map((p) => `${p!.x},${p!.y}`).join(" ")} fill="none" stroke="#10b981" strokeWidth="4" /> : null}
          {graph.nodes.map((n) => (
            <g key={n.id}><circle cx={n.x} cy={n.y} r="14" fill={n.id === origin || n.id === dest ? "#147df2" : "#fff"} stroke="#147df2" /><text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fill={n.id === origin || n.id === dest ? "#fff" : "#147df2"}>{n.label}</text></g>
          ))}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <h2>Route comparison</h2>
        <LiveRow color="#10b981" label="Dijkstra distance" value={`${fmt(dij.dist, 2)} km`} />
        <LiveRow color="#8b45f4" label="A* distance" value={`${fmt(ast.dist, 2)} km`} />
        <ChallengeBox {...page.challenge} />
        <p className="msk-note">Same Dijkstra as <Link to="/graph-theory?tab=algorithms">Graph Theory algorithms</Link>.</p>
      </aside>
      </>
      )}
    </Chrome>
  );
}

function RegressionLab({ page }: { page: StudioMockupPage }) {
  const [deg, setDeg] = useState(2);
  const [split, setSplit] = useState(0.7);
  const [xPred, setXPred] = useState(28);
  const pts = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const x = -8 + i * 1.2;
    const y = -0.04 * x * x + 18 * x + 80 + Math.sin(i) * 40;
    return { x, y };
  }), []);
  const yHat = -1.24 * xPred * xPred + 68.77 * xPred + 120.4;
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Dataset">
            <Field label="Variables"><select defaultValue="Temperature (°C)" aria-label="Predictor"><option>Temperature (°C)</option><option>Hours</option></select></Field>
            <SliderRow label="Train / validation split" value={split} min={0.5} max={0.9} step={0.05} onChange={setSplit} />
            <SliderRow label="Polynomial degree" value={deg} min={1} max={4} step={1} onChange={setDeg} />
            <SliderRow label="Predict at x" value={xPred} min={-5} max={40} step={1} onChange={setXPred} />
            <p className="msk-note">{mode}: Bike Sharing (Hourly).</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Scatter & fit</h2>
            <svg className="msk-graph" viewBox="0 0 440 240" role="img" aria-label="Regression fit">
              <rect width="440" height="240" fill="#f8fbff" />
              {pts.map((p, i) => <circle key={i} cx={40 + (p.x + 10) * 8} cy={210 - p.y * 0.08} r="3" fill={i / pts.length < split ? "#147df2" : "#8b45f4"} />)}
              <path d={deg === 1 ? "M30 170 L 410 70" : "M30 180 Q 220 40 410 90"} fill="none" stroke="#8b45f4" strokeWidth="2.4" />
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live equation (best fit)</h2>
            <p className="msk-formula">ŷ = −1.24x² + 68.77x + 120.4</p>
            <LiveRow color="#10b981" label="R² (train)" value={deg === 1 ? "0.72" : "0.864"} />
            <LiveRow color="#8b45f4" label={`Prediction at x=${xPred}`} value={fmt(yHat, 0)} />
            <StatusOk>Polynomial captures the curve better than the linear model.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function PeriodicLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState(1.35);
  const [T, setPer] = useState(12.42);
  const [phi, setPhi] = useState(0.45);
  const [d, setD] = useState(0.1);
  const [a2, setA2] = useState(0.28);
  const pts = Array.from({ length: 120 }, (_, i) => {
    const t = i / 8;
    const yA = d + A * Math.sin(2 * Math.PI * t / T + phi);
    const yB = yA + a2 * Math.sin(2 * Math.PI * t / (T / 2) + phi);
    return { t, yA, yB };
  });
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Assumptions & parameters">
            <SliderRow label="Amplitude A" value={A} min={0.2} max={2.4} step={0.01} onChange={setA} />
            <SliderRow label="Period T" value={T} min={4} max={24} step={0.02} onChange={setPer} unit="h" />
            <SliderRow label="Phase φ" value={phi} min={-Math.PI} max={Math.PI} step={0.01} onChange={setPhi} />
            <SliderRow label="Vertical offset d" value={d} min={-0.4} max={1} step={0.01} onChange={setD} />
            <SliderRow label="A₂ harmonic" value={a2} min={0} max={0.8} step={0.01} onChange={setA2} />
            <p className="msk-note">{mode}: sinusoidal vs 2-term harmonic.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Tide time series & model comparison</h2>
            <svg className="msk-graph" viewBox="0 0 440 200" role="img" aria-label="Tide models">
              <rect width="440" height="200" fill="#f8fbff" />
              <polyline points={pts.map((p, i) => `${16 + i * 3.5},${100 - p.yA * 28}`).join(" ")} fill="none" stroke="#08b9dd" strokeWidth="2" />
              <polyline points={pts.map((p, i) => `${16 + i * 3.5},${100 - p.yB * 28}`).join(" ")} fill="none" stroke="#8b45f4" strokeWidth="2" />
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live equations</h2>
            <p className="msk-formula">y(t)=d+A sin(2π t/T + φ)</p>
            <LiveRow color="#08b9dd" label="RMSE A" value="0.142" />
            <LiveRow color="#8b45f4" label="RMSE B" value="0.061" />
            <StatusOk>Model B (harmonic) provides a significantly better fit.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function seeded(n: number, seed: number) {
  const pts: Array<{ x: number; y: number; inside: boolean }> = [];
  let s = seed;
  for (let i = 0; i < n; i += 1) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const x = (s % 10000) / 10000;
    s = (s * 1664525 + 1013904223) % 4294967296;
    const y = (s % 10000) / 10000;
    pts.push({ x, y, inside: (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25 });
  }
  return pts;
}

function NumericalLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(400);
  const [seed, setSeed] = useState(12345);
  const sample = useMemo(() => seeded(Math.min(n, 900), seed), [n, seed]);
  const inside = sample.filter((p) => p.inside).length;
  const est = 4 * inside / sample.length;
  const err = Math.abs(est - Math.PI);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Experiment">
            <p className="msk-note">Monte Carlo estimation of π. {mode}</p>
            <SliderRow label="Sample size N" value={n} min={50} max={2000} step={50} onChange={setN} />
            <SliderRow label="Random seed" value={seed} min={1} max={99999} step={1} onChange={setSeed} />
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode} data-studio="modelling">
            <h2>Monte Carlo simulation</h2>
            <svg className="msk-graph" viewBox="0 0 240 240" role="img" aria-label="Pi darts">
              <rect width="240" height="240" fill="#f8fbff" />
              <circle cx="120" cy="120" r="100" fill="none" stroke="#8b45f4" />
              {sample.slice(0, 400).map((p, i) => <circle key={i} cx={20 + p.x * 200} cy={20 + p.y * 200} r="2" fill={p.inside ? "#08b9dd" : "#8b45f4"} />)}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Live results</h2>
            <LiveRow color="#10b981" label="π estimate" value={fmt(est, 5)} />
            <LiveRow color="#64748b" label="True π" value="3.14159" />
            <LiveRow color="#f59e0b" label="Absolute error" value={fmt(err, 5)} />
            <p className="msk-formula">π ≈ 4 × N_inside / N_total</p>
            <StatusOk>As N increases, the estimate converges and the 95% CI shrinks like 1/√N.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function ComparisonLab({ page }: { page: StudioMockupPage }) {
  const [split, setSplit] = useState(0.7);
  const [pen, setPen] = useState(0.1);
  const [data, setData] = useState(sampleGrowth);
  const { xs, ys } = data;
  const cut = Math.floor(xs.length * split);
  const tx = xs.slice(cut);
  const ty = ys.slice(cut);
  const linear = fitMetrics(tx, ty, (x) => 8 + 2 * x);
  const quad = fitMetrics(tx, ty, (x) => 8 + 0.4 * x + 0.12 * x * x);
  const logi = fitMetrics(tx, ty, (x) => 40 / (1 + Math.exp(-0.18 * (x - 10))));
  const scores = [
    { name: "Linear", ...linear, aic: aic(linear.rmse, tx.length, 2, pen) },
    { name: "Quadratic", ...quad, aic: aic(quad.rmse, tx.length, 3, pen) },
    { name: "Logistic", ...logi, aic: aic(logi.rmse, tx.length, 2, pen) },
  ];
  const bestRmse = scores.reduce((best, item) => (item.rmse < best.rmse ? item : best));
  const bestAic = scores.reduce((best, item) => (item.aic < best.aic ? item : best));
  const exportReport = () => {
    const blob = new Blob([formatComparisonReport(scores)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Data & assumptions">
            <Field label="Dataset"><select defaultValue="Growth Experiment (N = 24)" aria-label="Dataset"><option>Growth Experiment (N = 24)</option></select></Field>
            <label className="msk-note">Import CSV x,y
              <input type="file" accept=".csv,text/plain" aria-label="Import data" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                void file.text().then((text) => setData(parseCsvPairs(text)));
              }} />
            </label>
            <button type="button" className="msk-soft" onClick={exportReport}>Export report</button>
            <SliderRow label="Train / test split" value={split} min={0.5} max={0.9} step={0.05} onChange={setSplit} />
            <SliderRow label="Complexity penalty λ" value={pen} min={0} max={1} step={0.01} onChange={setPen} />
            <p className="msk-note">{mode}: metrics are computed on the held-out slice, not hardcoded bars.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <h2>Observed vs models</h2>
            <svg className="msk-graph" viewBox="0 0 440 220" role="img" aria-label="Model overlay">
              <rect width="440" height="220" fill="#f8fbff" />
              {xs.map((x, i) => <circle key={x} cx={24 + x * 16} cy={200 - (ys[i] ?? 0) * 2.2} r="3.2" fill="#1e293b" />)}
              <polyline points={xs.map((x) => `${24 + x * 16},${200 - (8 + 2 * x) * 2.2}`).join(" ")} fill="none" stroke="#08b9dd" />
              <polyline points={xs.map((x) => `${24 + x * 16},${200 - (8 + 0.4 * x + 0.12 * x * x) * 2.2}`).join(" ")} fill="none" stroke="#8b45f4" strokeWidth="2.2" />
            </svg>
            <p className="msk-note">Best RMSE: {bestRmse.name}. Best AIC: {bestAic.name}.</p>
            <svg className="msk-graph" viewBox="0 0 440 120" role="img" aria-label="Residual plot for best AIC model">
              <rect width="440" height="120" fill="#f8fbff" />
              {tx.map((x, i) => {
                const pred = bestAic.name === "Linear" ? 8 + 2 * x : bestAic.name === "Quadratic" ? 8 + 0.4 * x + 0.12 * x * x : 40 / (1 + Math.exp(-0.18 * (x - 10)));
                const res = (ty[i] ?? 0) - pred;
                return <circle key={x} cx={24 + x * 16} cy={60 - res * 8} r="3" fill="#f59e0b" />;
              })}
              <line x1="24" y1="60" x2="420" y2="60" stroke="#94a3b8" />
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>Metrics (test set)</h2>
            <LiveRow color="#08b9dd" label="Linear RMSE" value={fmt(linear.rmse, 2)} />
            <LiveRow color="#8b45f4" label="Quadratic RMSE" value={fmt(quad.rmse, 2)} />
            <LiveRow color="#f59e0b" label="Logistic RMSE" value={fmt(logi.rmse, 2)} />
            <LiveRow color="#10b981" label="Best AIC" value={`${bestAic.name} ${fmt(bestAic.aic, 2)}`} />
            <StatusOk>Pick the model with lowest AIC on the held-out slice, then justify it from the residual plot.</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}
