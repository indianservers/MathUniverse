import { useEffect, useState, type ReactNode } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk, fmt, useLabMode } from "../studioLabKit";
import { composeWaves } from "./trigonometryTargetMath";

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle trig-target-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

function wavePoints(fn: (t: number) => number, y0: number, scaleY: number) {
  return Array.from({ length: 221 }, (_, index) => {
    const t = (index / 220) * 5;
    return `${24 + index * 2.2},${y0 - fn(t) * scaleY}`;
  }).join(" ");
}

function envelopePoints(a1: number, a2: number, f1: number, f2: number, y0: number, scaleY: number, sign: 1 | -1) {
  const beat = Math.abs(f2 - f1);
  return Array.from({ length: 221 }, (_, index) => {
    const t = (index / 220) * 5;
    return `${24 + index * 2.2},${y0 - sign * (a1 + a2) * Math.cos(Math.PI * beat * t) * scaleY}`;
  }).join(" ");
}

export function WavesHarmonicsLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [amplitude1, setAmplitude1] = useState(1);
  const [frequency1, setFrequency1] = useState(2);
  const [phase1, setPhase1] = useState(0);
  const [vertical1, setVertical1] = useState(0);
  const [amplitude2, setAmplitude2] = useState(0.7);
  const [frequency2, setFrequency2] = useState(3);
  const [phase2, setPhase2] = useState(Math.PI / 4);
  const [vertical2, setVertical2] = useState(0);
  const [secondWave, setSecondWave] = useState(true);
  const [time, setTime] = useState(1.25);
  const [standingMode, setStandingMode] = useState(3);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSecondWave(mode !== "Simple Wave");
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTime((value) => value >= 5 ? 0 : value + 0.02), 32);
    return () => window.clearInterval(timer);
  }, [playing]);

  const effectiveF2 = mode === "Harmonics" ? frequency1 * 2 : mode === "Beats" ? frequency1 + 0.4 : frequency2;
  const effectivePhase2 = mode === "Phase" || mode === "Superposition" ? phase2 : 0;
  const useSecond = mode === "Simple Wave" ? false : secondWave;
  const y1 = (t: number) => amplitude1 * Math.sin(2 * Math.PI * frequency1 * t + phase1) + vertical1;
  const y2 = (t: number) => useSecond ? amplitude2 * Math.sin(2 * Math.PI * effectiveF2 * t + effectivePhase2) + vertical2 : 0;
  const result = (t: number) => y1(t) + y2(t);
  const live = composeWaves(
    time,
    { amplitude: amplitude1, frequency: frequency1, phase: phase1, shift: vertical1 },
    { amplitude: useSecond ? amplitude2 : 0, frequency: effectiveF2, phase: effectivePhase2, shift: vertical2 },
  );
  const omega1 = 2 * Math.PI * frequency1;
  const omega2 = 2 * Math.PI * effectiveF2;
  const period1 = 1 / frequency1;
  const period2 = 1 / effectiveF2;
  const harmonics = [amplitude1, amplitude2, amplitude2 * 0.43, amplitude2 * 0.22, amplitude2 * 0.13, amplitude2 * 0.08, amplitude2 * 0.05];
  const oscillatorAngle = omega1 * time + phase1;
  const oscillatorAngle2 = omega2 * time + effectivePhase2;
  const plotHeight = mode === "Simple Wave" ? 320 : 270;

  return (
    <>
      <nav className="msk-tabs trig-target-tabs wv-target-tabs" aria-label="Waves modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab wv-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-wv-mode={mode}>
        <Panel title={mode === "Simple Wave" ? "Wave Controls" : "Wave 1 Controls"} className="trig-target-card trig-target-wave-controls wv-target-controls">
          <SliderRow label="Amplitude A₁" value={amplitude1} min={0.1} max={2} step={0.05} onChange={setAmplitude1} />
          <SliderRow label="Frequency f₁ (Hz)" value={frequency1} min={0.5} max={6} step={0.1} onChange={setFrequency1} />
          <SliderRow label="Phase φ₁ (rad)" value={phase1} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase1} />
          <SliderRow label="Vertical shift d₁" value={vertical1} min={-1} max={1} step={0.05} onChange={setVertical1} />
          {mode !== "Simple Wave" ? (
            <>
              <div className="trig-target-section-title">Wave 2</div>
              <Toggle checked={secondWave} onChange={setSecondWave}>Add second wave</Toggle>
              <SliderRow label="Amplitude A₂" value={amplitude2} min={0} max={2} step={0.05} onChange={setAmplitude2} />
              <SliderRow label={mode === "Harmonics" ? "Harmonic f₂ = 2f₁" : mode === "Beats" ? "Nearby f₂" : "Frequency f₂ (Hz)"} value={effectiveF2} min={0.5} max={8} step={0.1} onChange={setFrequency2} />
              {mode === "Phase" || mode === "Superposition" ? <SliderRow label="Phase φ₂ (rad)" value={phase2} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase2} /> : null}
              <SliderRow label="Vertical shift d₂" value={vertical2} min={-1} max={1} step={0.05} onChange={setVertical2} />
            </>
          ) : null}
          <div className="trig-target-section-title">Time</div>
          <SliderRow label="t (s)" value={time} min={0} max={5} step={0.01} onChange={setTime} />
          <div className="msk-btn-row trig-target-wave-playback">
            <button type="button" className="msk-cta" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "▶ Play"}</button>
            <button type="button" className="msk-soft" onClick={() => { setPlaying(false); setTime(0); }}>■ Stop</button>
            <button type="button" className="msk-soft" onClick={() => { setPlaying(false); setTime(1.25); }}>↻ Reset</button>
          </div>
        </Panel>

        <section className="msk-panel msk-canvas trig-target-wave-canvas wv-target-canvas" data-trig-target-mode={mode} data-wv-mode={mode}>
          <svg className="msk-graph is-dark trig-target-wave-plot" viewBox={`0 0 540 ${plotHeight}`} role="img" aria-label={`${mode} source and resultant waves`}>
            <rect width="540" height={plotHeight} rx="10" fill="#041426" />
            {Array.from({ length: 9 }, (_, index) => <line key={`v${index}`} x1={24 + index * 60} y1="22" x2={24 + index * 60} y2={plotHeight - 22} stroke="#15314b" />)}
            {Array.from({ length: 7 }, (_, index) => <line key={`h${index}`} x1="24" y1={28 + index * ((plotHeight - 50) / 6)} x2="516" y2={28 + index * ((plotHeight - 50) / 6)} stroke="#15314b" />)}
            <polyline points={wavePoints(y1, plotHeight / 2, 38)} fill="none" stroke="#22d3ee" strokeWidth="1.7" />
            {useSecond ? <polyline points={wavePoints(y2, plotHeight / 2, 38)} fill="none" stroke="#a78bfa" strokeWidth="1.7" /> : null}
            {useSecond ? (
              <>
                <polyline points={wavePoints(result, plotHeight / 2, 38)} fill="none" stroke="#f59e0b" strokeOpacity=".25" strokeWidth="9" />
                <polyline points={wavePoints(result, plotHeight / 2, 38)} fill="none" stroke="#fbbf24" strokeWidth="2.8" />
              </>
            ) : null}
            {mode === "Beats" && useSecond ? (
              <>
                <polyline points={envelopePoints(amplitude1, amplitude2, frequency1, effectiveF2, plotHeight / 2, 38, 1)} fill="none" stroke="#f97316" strokeDasharray="6 4" />
                <polyline points={envelopePoints(amplitude1, amplitude2, frequency1, effectiveF2, plotHeight / 2, 38, -1)} fill="none" stroke="#f97316" strokeDasharray="6 4" />
              </>
            ) : null}
            <line x1={24 + time * 96} y1="22" x2={24 + time * 96} y2={plotHeight - 22} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="34" y="42" fill="#22d3ee" fontSize="11">— Wave 1</text>
            {useSecond ? <text x="34" y="58" fill="#a78bfa" fontSize="11">— Wave 2</text> : null}
            {useSecond ? <text x="34" y="74" fill="#fbbf24" fontSize="11">— Resultant</text> : null}
            <text x={Math.min(470, Math.max(30, 24 + time * 96 - 20))} y={plotHeight - 10} fill="#fbbf24" fontSize="11">t = {fmt(time, 2)} s</text>
          </svg>

          <div className={`trig-target-wave-subpanels wv-target-subpanels${mode === "Simple Wave" ? " is-simple" : ""}`}>
            <section className="trig-target-wave-subpanel trig-target-oscillator">
              <h3>{mode === "Phase" || mode === "Superposition" ? "Phasors" : "Unit Circle Oscillator"}</h3>
              <svg viewBox="0 0 200 140" role="img" aria-label="Unit circle oscillator">
                <circle cx="70" cy="70" r="44" fill="none" stroke="#94a3b8" />
                <line x1="18" y1="70" x2="122" y2="70" stroke="#64748b" />
                <line x1="70" y1="18" x2="70" y2="122" stroke="#64748b" />
                <line x1="70" y1="70" x2={70 + 44 * amplitude1 * Math.cos(oscillatorAngle)} y2={70 - 44 * amplitude1 * Math.sin(oscillatorAngle)} stroke="#22d3ee" strokeWidth="2.4" />
                <circle cx={70 + 44 * amplitude1 * Math.cos(oscillatorAngle)} cy={70 - 44 * amplitude1 * Math.sin(oscillatorAngle)} r="4" fill="#fbbf24" />
                {useSecond && (mode === "Phase" || mode === "Superposition") ? (
                  <>
                    <line x1="70" y1="70" x2={70 + 44 * amplitude2 * Math.cos(oscillatorAngle2)} y2={70 - 44 * amplitude2 * Math.sin(oscillatorAngle2)} stroke="#a78bfa" strokeWidth="2.4" />
                    <line
                      x1={70 + 44 * amplitude1 * Math.cos(oscillatorAngle)}
                      y1={70 - 44 * amplitude1 * Math.sin(oscillatorAngle)}
                      x2={70 + 44 * amplitude1 * Math.cos(oscillatorAngle) + 44 * amplitude2 * Math.cos(oscillatorAngle2)}
                      y2={70 - 44 * amplitude1 * Math.sin(oscillatorAngle) - 44 * amplitude2 * Math.sin(oscillatorAngle2)}
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                  </>
                ) : null}
                <text x="128" y="48" fill="#22d3ee" fontSize="9">θ₁ = {fmt(oscillatorAngle, 2)}</text>
                <text x="128" y="66" fill="#e2e8f0" fontSize="9">sin {fmt(Math.sin(oscillatorAngle), 2)}</text>
                {useSecond ? <text x="128" y="84" fill="#a78bfa" fontSize="9">θ₂ = {fmt(oscillatorAngle2, 2)}</text> : null}
              </svg>
            </section>
            {mode !== "Simple Wave" ? (
              <section className="trig-target-wave-subpanel trig-target-spectrum">
                <h3>{mode === "Harmonics" ? "Build the spectrum" : "Harmonic Spectrum"}</h3>
                <svg viewBox="0 0 180 132" role="img" aria-label="Harmonic spectrum">
                  <line x1="20" y1="108" x2="166" y2="108" stroke="#64748b" />
                  <line x1="20" y1="16" x2="20" y2="108" stroke="#64748b" />
                  {harmonics.map((value, index) => (
                    <g key={index}>
                      <rect x={31 + index * 18} y={108 - value * 62} width="8" height={value * 62} fill={index === 0 ? "#f59e0b" : "#d79a20"} />
                      <text x={35 + index * 18} y="122" fill="#cbd5e1" fontSize="8" textAnchor="middle">{index + 1}</text>
                    </g>
                  ))}
                </svg>
              </section>
            ) : null}
            {mode === "Harmonics" || mode === "Beats" ? (
              <section className="trig-target-wave-subpanel trig-target-standing">
                <h3>Standing Wave (n = {standingMode})</h3>
                <svg viewBox="0 0 200 92" role="img" aria-label="Standing wave">
                  <line x1="16" y1="46" x2="184" y2="46" stroke="#475569" />
                  <polyline points={Array.from({ length: 81 }, (_, index) => `${16 + index * 2.1},${46 - Math.sin((index / 80) * standingMode * Math.PI) * 25 * Math.cos(time * 3)}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2" />
                  {Array.from({ length: standingMode + 1 }, (_, index) => <circle key={index} cx={16 + index * (168 / standingMode)} cy="46" r="3" fill="#e2e8f0" />)}
                </svg>
                <div className="trig-target-standing-modes">
                  {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className={value === standingMode ? "active" : ""} onClick={() => setStandingMode(value)}>{value}</button>)}
                </div>
                <p className="msk-note">Nodes: {standingMode + 1} · Antinodes: {standingMode}</p>
              </section>
            ) : null}
          </div>
        </section>

        <aside className="msk-panel msk-live trig-target-card trig-target-wave-values wv-target-rail">
          <h2>Equations</h2>
          <p className="msk-formula">y₁(t) = A₁ sin(2πf₁t + φ₁) + d₁</p>
          {useSecond ? <p className="msk-formula">y₂(t) = A₂ sin(2πf₂t + φ₂) + d₂</p> : null}
          {useSecond ? <p className="msk-formula">y(t) = y₁(t) + y₂(t)</p> : null}
          <h2>Live Values</h2>
          <LiveRow color="#22d3ee" label="Period T₁" value={`${fmt(period1, 3)} s`} />
          {useSecond ? <LiveRow color="#a78bfa" label="Period T₂" value={`${fmt(period2, 3)} s`} /> : null}
          <LiveRow color="#22d3ee" label="Angular freq. ω₁" value={`${fmt(omega1, 3)} rad/s`} />
          {useSecond ? <LiveRow color="#a78bfa" label="Angular freq. ω₂" value={`${fmt(omega2, 3)} rad/s`} /> : null}
          {useSecond ? <LiveRow color="#8b5cf6" label="Phase diff. Δφ" value={`${fmt(effectivePhase2 - phase1, 3)} rad`} /> : null}
          <LiveRow color="#fbbf24" label="Resultant y(t)" value={fmt(live.resultant, 3)} />
          <LiveRow color="#10b981" label="Resultant amplitude (max)" value={fmt(amplitude1 + (useSecond ? amplitude2 : 0), 3)} />
          <LiveRow color="#0ea5e9" label="RMS value" value={fmt(Math.sqrt((amplitude1 ** 2 + (useSecond ? amplitude2 ** 2 : 0)) / 2), 3)} />
          {mode === "Beats" ? <LiveRow color="#f59e0b" label="Beat frequency |f₂−f₁|" value={`${fmt(live.beatFrequency, 3)} Hz`} /> : null}
          <p className="msk-note">
            {mode === "Beats" ? "Nearby frequencies create a slowly changing envelope."
              : mode === "Harmonics" ? "Integer multiples build the timbre and standing-wave modes."
                : mode === "Phase" ? "Phase controls constructive and destructive interference."
                  : mode === "Simple Wave" ? "Circular motion projects to a single sine."
                    : "Superposition adds instantaneous displacements."}
          </p>
          <StatusOk>At t = {fmt(time, 2)} s, the resultant reflects the current constructive or destructive interference.</StatusOk>
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
      <div className="trig-target-footer wv-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default WavesHarmonicsLab;
