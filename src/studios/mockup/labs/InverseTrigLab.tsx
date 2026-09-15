import { useEffect, useState } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import {
  ChallengeBox,
  Field,
  LiveRow,
  Panel,
  Segmented,
  SliderRow,
  StatusOk,
  clamp,
  fmt,
  useLabMode,
} from "../studioLabKit";
import { inversePrincipal, type InverseFamily } from "./trigonometryTargetMath";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";

const COLORS = {
  sine: "#06b6d4",
  cosine: "#8b5cf6",
  angle: "#f59e0b",
  success: "#10b981",
  paper: "#f9fcff",
} as const;

type Units = "Degrees" | "Radians";

function inverseDomain(family: InverseFamily) {
  return family === "Arctan" ? "all real x" : "−1 ≤ x ≤ 1";
}

function inverseRange(family: InverseFamily) {
  return family === "Arcsin" ? "−π/2 ≤ θ ≤ π/2" : family === "Arccos" ? "0 ≤ θ ≤ π" : "−π/2 < θ < π/2";
}

const GRAPH_SCALE = 70;

function parentCurve(family: InverseFamily) {
  const points: string[] = [];
  const min = family === "Arccos" ? 0 : -Math.PI / 2;
  const max = family === "Arccos" ? Math.PI : Math.PI / 2;
  for (let index = 0; index <= 160; index += 1) {
    const x = min + (index / 160) * (max - min);
    const y = family === "Arcsin" ? Math.sin(x) : family === "Arccos" ? Math.cos(x) : Math.tan(x);
    if (Math.abs(y) <= 3.2) points.push(`${250 + x * GRAPH_SCALE},${168 - y * GRAPH_SCALE}`);
  }
  return points.join(" ");
}

function inverseCurve(family: InverseFamily) {
  const points: string[] = [];
  const min = family === "Arctan" ? -3 : -1;
  const max = family === "Arctan" ? 3 : 1;
  for (let index = 0; index <= 160; index += 1) {
    const x = min + (index / 160) * (max - min);
    const y = inversePrincipal(family, x);
    points.push(`${250 + x * GRAPH_SCALE},${168 - y * GRAPH_SCALE}`);
  }
  return points.join(" ");
}

function ghostBranch(family: InverseFamily, shift: number) {
  const points: string[] = [];
  const min = family === "Arctan" ? -3 : -1;
  const max = family === "Arctan" ? 3 : 1;
  for (let index = 0; index <= 80; index += 1) {
    const x = min + (index / 80) * (max - min);
    const y = inversePrincipal(family, x) + shift;
    points.push(`${250 + x * GRAPH_SCALE},${168 - y * GRAPH_SCALE}`);
  }
  return points.join(" ");
}

function compositionSaw(x: number) {
  const wrapped = ((x + Math.PI / 2) % Math.PI + Math.PI) % Math.PI - Math.PI / 2;
  return wrapped;
}

export function InverseTrigLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const session = useTrigSession();
  const [family, setFamily] = useState<InverseFamily>("Arcsin");
  const [input, setInput] = useState(0.6);
  const [units, setUnits] = useState<Units>(session.units === "deg" ? "Degrees" : "Radians");
  const [principal, setPrincipal] = useState(true);
  const [playing, setPlaying] = useState(false);
  const active: InverseFamily = mode === "Arcsin" || mode === "Arccos" || mode === "Arctan" ? mode : family;
  const inputLimit = active === "Arctan" ? 3 : 1;

  useEffect(() => {
    if (mode === "Arcsin" || mode === "Arccos" || mode === "Arctan") setFamily(mode);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setInput((value) => value >= inputLimit ? -inputLimit : value + inputLimit / 80);
    }, 35);
    return () => window.clearInterval(timer);
  }, [inputLimit, playing]);

  const boundedInput = active === "Arctan" ? input : clamp(input, -1, 1);
  const angle = inversePrincipal(active, boundedInput);
  const degrees = angle * 180 / Math.PI;
  const display = units === "Degrees" ? `${fmt(degrees, 6)}°` : `${fmt(angle, 8)} rad`;
  const composition = active === "Arcsin" ? Math.sin(angle) : active === "Arccos" ? Math.cos(angle) : Math.tan(angle);
  const unitX = Math.cos(angle);
  const unitY = Math.sin(angle);
  const pointX = 120 + unitX * 72;
  const pointY = 118 - unitY * 72;
  const graphX = 250 + boundedInput * GRAPH_SCALE;
  const graphY = 168 - angle * GRAPH_SCALE;
  const rangeMin = active === "Arccos" ? 0 : -Math.PI / 2;
  const rangeMax = active === "Arccos" ? Math.PI : Math.PI / 2;

  const reset = () => {
    setFamily("Arcsin");
    setInput(0.6);
    setUnits("Radians");
    setPrincipal(true);
    setPlaying(false);
    setMode("Arcsin");
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs inv-target-tabs" aria-label="Inverse trigonometry modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab inv-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-inv-mode={mode}>
        <Panel title="Select inverse function" className="trig-target trig-target-controls inv-target-controls">
          <Field label="Inverse function">
            <Segmented
              value={active}
              onChange={(value) => {
                const next = value as InverseFamily;
                setFamily(next);
                setMode(next);
                if (next !== "Arctan") setInput((current) => clamp(current, -1, 1));
              }}
              options={(["Arcsin", "Arccos", "Arctan"] as const).map((value) => ({ id: value, label: value }))}
            />
          </Field>
          <div className="inv-target-input-readout" aria-live="polite">
            <span>x =</span>
            <strong>{fmt(boundedInput, 2)}</strong>
          </div>
          <SliderRow label="Input value x" value={boundedInput} min={active === "Arctan" ? -3 : -1} max={active === "Arctan" ? 3 : 1} step={0.01} onChange={setInput} />
          <Field label="Angle unit">
            <Segmented value={units} onChange={(value) => {
              const next = value as Units;
              setUnits(next);
              writeTrigSession({ units: next === "Degrees" ? "deg" : "rad" });
            }} options={[{ id: "Degrees", label: "Degrees" }, { id: "Radians", label: "Radians" }]} />
          </Field>
          <label className="msk-toggle"><input type="checkbox" checked={principal} onChange={(event) => setPrincipal(event.target.checked)} /> Use principal branch</label>
          <Field label="Example values">
            <div className="msk-chips">
              {[-1, -0.5, 0, 0.5, 0.6, 1].map((value) => (
                <button key={value} type="button" className={Math.abs(boundedInput - value) < 0.001 ? "active" : ""} onClick={() => setInput(value)}>{value}</button>
              ))}
            </div>
          </Field>
          <div className="msk-btn-row">
            <button type="button" className="msk-cta" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause mapping" : "Animate mapping"}</button>
            <button type="button" className="msk-soft" onClick={reset}>Reset all</button>
          </div>
        </Panel>

        <section className="msk-panel msk-canvas trig-target inv-target-canvas" data-trig-target-mode={mode} data-inv-mode={mode}>
          {mode === "Compositions" ? (
            <div className="inv-target-compose-grid">
              <figure>
                <b>sin(arcsin x) on the domain</b>
                <svg viewBox="0 0 490 220" role="img" aria-label="sin of arcsin">
                  <rect width="490" height="220" rx="10" fill={COLORS.paper} />
                  <line x1="20" y1="110" x2="470" y2="110" stroke="#475569" />
                  <line x1="245" y1="16" x2="245" y2="204" stroke="#475569" />
                  <line x1="80" y1="190" x2="410" y2="30" stroke="#94a3b8" strokeDasharray="5 4" />
                  <line x1={140} y1={110 + 80} x2={350} y2={110 - 80} stroke={COLORS.success} strokeWidth="2.4" />
                  <line x1={245 + boundedInput * 110} y1="16" x2={245 + boundedInput * 110} y2="204" stroke={COLORS.angle} strokeDasharray="4 3" />
                  <circle cx={245 + boundedInput * 110} cy={110 - boundedInput * 80} r="6" fill={COLORS.angle} />
                  <text x="28" y="28" fill={COLORS.success} fontSize="12">y = x on [−1, 1]</text>
                </svg>
              </figure>
              <figure>
                <b>arcsin(sin θ) is not the identity</b>
                <svg viewBox="0 0 490 220" role="img" aria-label="arcsin of sine">
                  <rect width="490" height="220" rx="10" fill={COLORS.paper} />
                  <line x1="20" y1="110" x2="470" y2="110" stroke="#475569" />
                  <polyline points={Array.from({ length: 200 }, (_, index) => {
                    const x = -Math.PI + (index / 199) * 2 * Math.PI;
                    return `${245 + x * 68},${110 - compositionSaw(x) * 48}`;
                  }).join(" ")} fill="none" stroke={COLORS.cosine} strokeWidth="2.4" />
                  <text x="28" y="28" fill={COLORS.cosine} fontSize="12">principal sawtooth</text>
                </svg>
              </figure>
            </div>
          ) : (
            <>
              <div className="trig-target-inverse-graph inv-target-graph">
                <b>A. Graphs: f(x) and f⁻¹(x)</b>
                <svg className="msk-graph trig-target-inverse-plot" viewBox="0 0 500 250" role="img" aria-label={`${active} inverse graph`}>
                  <rect width="500" height="250" rx="10" fill={COLORS.paper} />
                  <rect x="20" y={clamp(168 - rangeMax * GRAPH_SCALE, 16, 234)} width="460" height={clamp((rangeMax - rangeMin) * GRAPH_SCALE, 12, 200)} fill={mode === "Principal Values" ? "rgba(16,185,129,.14)" : "transparent"} />
                  <line x1="20" y1="168" x2="480" y2="168" stroke="#475569" />
                  <line x1="250" y1="16" x2="250" y2="234" stroke="#475569" />
                  <line x1="70" y1="248" x2="430" y2="8" stroke="#94a3b8" strokeDasharray="5 4" />
                  <text x="434" y="22" fill="#94a3b8" fontSize="10">y = x</text>
                  <polyline points={parentCurve(active)} fill="none" stroke={COLORS.sine} strokeWidth="2.1" />
                  {!principal ? (
                    <>
                      <polyline points={ghostBranch(active, Math.PI)} fill="none" stroke={COLORS.cosine} strokeWidth="1.6" strokeDasharray="5 4" opacity=".45" />
                      <polyline points={ghostBranch(active, -Math.PI)} fill="none" stroke={COLORS.cosine} strokeWidth="1.6" strokeDasharray="5 4" opacity=".45" />
                    </>
                  ) : null}
                  <polyline points={inverseCurve(active)} fill="none" stroke={COLORS.cosine} strokeWidth="2.6" />
                  <line x1={graphX} y1="168" x2={graphX} y2={graphY} stroke={COLORS.angle} strokeDasharray="4 3" />
                  <circle cx={graphX} cy={graphY} r="6" fill={COLORS.angle} stroke="#fff7ed" strokeWidth="1.5" />
                  <text x="24" y="28" fill={COLORS.sine} fontSize="11">f(x), restricted</text>
                  <text x="150" y="28" fill={COLORS.cosine} fontSize="11">f⁻¹(x) = {active.toLowerCase()} x</text>
                  {mode === "Principal Values" ? <text x="24" y="46" fill={COLORS.success} fontSize="11">shaded band = principal range</text> : null}
                </svg>
              </div>
              <div className="trig-target-inverse-lower inv-target-lower">
                <figure>
                  <b>B. Unit Circle Mapping</b>
                  <svg viewBox="0 0 240 220" role="img" aria-label="Unit circle mapping">
                    <rect width="240" height="220" rx="10" fill={COLORS.paper} />
                    <line x1="28" y1="118" x2="212" y2="118" stroke="#64748b" />
                    <line x1="120" y1="24" x2="120" y2="206" stroke="#64748b" />
                    <circle cx="120" cy="118" r="72" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
                    <path d={`M 148 118 A 28 28 0 ${Math.abs(angle) > Math.PI ? 1 : 0} ${angle >= 0 ? 0 : 1} ${120 + 28 * unitX} ${118 - 28 * unitY}`} fill="none" stroke={COLORS.angle} strokeWidth="2" />
                    <polygon points={`120,118 ${pointX},118 ${pointX},${pointY}`} fill="rgba(139,92,246,.12)" stroke={COLORS.cosine} />
                    <line x1="120" y1="118" x2={pointX} y2={pointY} stroke={COLORS.angle} strokeWidth="2.3" />
                    <circle cx={pointX} cy={pointY} r="6" fill={COLORS.angle} />
                    <text x="128" y="156" fill={COLORS.angle} fontSize="12">θ = {fmt(angle, 3)} rad</text>
                  </svg>
                </figure>
                <figure>
                  <b>C. Geometric Interpretation</b>
                  <svg viewBox="0 0 240 220" role="img" aria-label="Right triangle interpretation">
                    <rect width="240" height="220" rx="10" fill={COLORS.paper} />
                    <polygon points="36,176 204,176 36,48" fill="rgba(139,92,246,.10)" stroke="#334155" />
                    <rect x="36" y="164" width="12" height="12" fill="none" stroke="#334155" />
                    <text x="108" y="196" fill="#0891b2" fontSize="12">{fmt(Math.abs(unitX), 3)}</text>
                    <text x="8" y="118" fill="#7c3aed" fontSize="12">{fmt(Math.abs(unitY), 3)}</text>
                    <text x="118" y="108" fill="#334155" fontSize="12">1</text>
                    <text x="56" y="164" fill={COLORS.angle} fontSize="16">θ</text>
                    <text x="18" y="214" fill="#c2410c" fontSize="11">{active.toLowerCase()}({fmt(boundedInput, 2)}) = {fmt(angle, 4)} rad</text>
                  </svg>
                </figure>
              </div>
            </>
          )}
        </section>

        <aside className="msk-panel msk-live trig-target inv-target-rail">
          <section className="uc-target-rail-section">
            <h2>Input domain check</h2>
            <StatusOk>x = {fmt(boundedInput, 2)} is in domain ({inverseDomain(active)})</StatusOk>
          </section>
          <section className="uc-target-rail-section">
            <h2>Principal angle</h2>
            <p className="msk-formula">{inverseRange(active)}</p>
          </section>
          <section className="uc-target-rail-section">
            <h2>Inverse value</h2>
            <LiveRow color={COLORS.cosine} label="Exact" value={`${active.toLowerCase()}(${fmt(boundedInput, 2)})`} />
            <LiveRow color={COLORS.success} label="Radians" value={fmt(angle, 9)} />
            <LiveRow color={COLORS.success} label="Degrees" value={`${fmt(degrees, 7)}°`} />
            <LiveRow color={COLORS.angle} label="Selected unit" value={display} />
          </section>
          <section className="uc-target-rail-section">
            <h2>Domain &amp; Range</h2>
            <LiveRow label="Domain (x)" value={inverseDomain(active)} />
            <LiveRow label="Range (θ)" value={inverseRange(active)} />
          </section>
          <section className="uc-target-rail-section">
            <h2>Compositions</h2>
            <LiveRow color={COLORS.success} label={`f(${active.toLowerCase()} x)`} value={fmt(composition, 6)} />
            {mode === "Compositions" ? <LiveRow color={COLORS.success} label="Matches x" value={Math.abs(composition - boundedInput) < 1e-8 ? "yes ✓" : "branch restricted"} /> : null}
            <p className="msk-note">{principal ? "The principal branch returns one unique angle." : "Ghosted curves show other coterminal branches."}</p>
          </section>
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
      <div className="trig-target-footer inv-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default InverseTrigLab;
