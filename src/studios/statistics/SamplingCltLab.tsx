import { useStudioState } from "../phase1/StudioModelProvider";
import { useEffect, useMemo } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, fmt, useLabMode } from "../mockup/studioLabKit";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import { drawSample, meanOf, sampleMeans, spreadOf, type PopulationShape } from "./cltSimulation";
import "./samplingCltLab.css";

const MAX_TRIALS = 120;
const TICKS_PER_SAMPLE = 8;
const xOf = (value: number) => 28 + Math.max(0, Math.min(1, (value - 20) / 60)) * 314;

function SamplingLane({ label, color, shape, size, means, current, progress, mode }: { mode: string; label: string; color: string; shape: PopulationShape; size: number; means: number[]; current: ReturnType<typeof drawSample>; progress: number }) {
  const bins = Array.from({ length: 12 }, (_, index) => means.filter((value) => value >= 20 + index * 5 && value < 25 + index * 5).length);
  const max = Math.max(1, ...bins);
  const population = useMemo(() => drawSample(shape, 42, 497).values, [shape]);
  return <div className="clt-lane">
    <h3 style={{ color }}>{label}: n = {size}</h3>
    <svg viewBox="0 0 370 290" role="img" aria-label={`${label} sample animation and distribution of means`}>
      <rect width="370" height="290" rx="12" fill="#f8fbff" />
      <text x="16" y="18">Population</text>
      {mode==="Population" && population.map((value, index) => <circle key={index} cx={xOf(value)} cy={30 + index % 4 * 12} r="2.8" fill="#94a3b8" opacity="0.75" />)}
      <text x="16" y="104">Current sample</text>
      {mode==="Sampling" && current.values.map((value, index) => <circle key={index} cx={xOf(value) + (xOf(current.mean) - xOf(value)) * progress} cy={112 + (index % 4) * 11 + progress * 44} r={Math.max(2.2, 4 - size / 50)} fill={color} opacity="0.58" />)}
      {mode==="Sampling" && <circle cx={xOf(current.mean)} cy={166 + progress * 35} r="6" fill={color} stroke="white" strokeWidth="2" />}
      <text x="16" y="213">Collected sample means ({means.length})</text>
      {mode==="CLT" && bins.map((count, index) => <rect key={index} x={29 + index * 26} y={270 - count / max * 49} width="23" height={count / max * 49} fill={color} opacity="0.75" />)}
      <line x1="28" y1="271" x2="342" y2="271" stroke="#64748b" />
      <line x1={xOf(50)} y1="218" x2={xOf(50)} y2="270" stroke="#0f172a" strokeDasharray="4 3" />
      <text x="26" y="286">20</text><text x="178" y="286">50</text><text x="332" y="286">80</text>
    </svg>
    <p>Mean of means: {means.length ? fmt(meanOf(means), 2) : "—"} · observed spread: {means.length > 1 ? fmt(spreadOf(means), 2) : "—"} · predicted SE: {fmt(10 / Math.sqrt(size), 2)}</p>
  </div>;
}

export default function SamplingCltLab({ page }: { page: StudioMockupPage }) {
  const {mode}=useLabMode(page);
  const [shape, setShape] = useStudioState<PopulationShape>("SamplingCltLab:SamplingCltLab:shape", "skewed");
  const [small, setSmall] = useStudioState("SamplingCltLab:SamplingCltLab:small", 5);
  const [large, setLarge] = useStudioState("SamplingCltLab:SamplingCltLab:large", 25);
  const [tick, setTick] = useStudioState("SamplingCltLab:SamplingCltLab:tick", 0);
  const [playing, setPlaying] = useStudioState("SamplingCltLab:SamplingCltLab:playing", false);
  const reducedMotion = useReducedMotion();
  const count = Math.min(MAX_TRIALS, Math.floor(tick / TICKS_PER_SAMPLE));
  const progress = reducedMotion ? 1 : tick % TICKS_PER_SAMPLE / TICKS_PER_SAMPLE;
  const smallMeans = useMemo(() => sampleMeans(shape, small, count, 101), [shape, small, count]);
  const largeMeans = useMemo(() => sampleMeans(shape, large, count, 1000101), [shape, large, count]);
  const currentSmall = useMemo(() => drawSample(shape, small, 101 + count * 7919), [shape, small, count]);
  const currentLarge = useMemo(() => drawSample(shape, large, 1000101 + count * 7919), [shape, large, count]);
  useEffect(() => {
    if (!playing || count >= MAX_TRIALS) return;
    const timer = window.setInterval(() => setTick((value) => Math.min(MAX_TRIALS * TICKS_PER_SAMPLE, value + (reducedMotion ? TICKS_PER_SAMPLE : 1))), reducedMotion ? 160 : 55);
    return () => window.clearInterval(timer);
  }, [playing, count, reducedMotion]);
  const reset = () => { setPlaying(false); setTick(0); };
  return <Phase1LabChrome page={page}>
    <Panel title="Sampling controls">
      <p>Draw repeatedly from the same population. The blue and violet panels use different sample sizes.</p>
      <label className="clt-select">Population shape<select value={shape} onChange={(event) => { setShape(event.target.value as PopulationShape); reset(); }}><option value="skewed">Right-skewed</option><option value="uniform">Uniform</option></select></label>
      <SliderRow label="Blue sample size" value={small} min={2} max={80} step={1} onChange={(value) => { setSmall(value); reset(); }} />
      <SliderRow label="Violet sample size" value={large} min={2} max={80} step={1} onChange={(value) => { setLarge(value); reset(); }} />
      <div className="clt-actions"><button type="button" onClick={() => setPlaying((value) => !value)} disabled={count >= MAX_TRIALS}>{playing ? "Pause" : "Animate samples"}</button><button type="button" onClick={() => { setPlaying(false); setTick((value) => Math.min(MAX_TRIALS * TICKS_PER_SAMPLE, (Math.floor(value / TICKS_PER_SAMPLE) + 1) * TICKS_PER_SAMPLE)); }}>Draw one</button><button type="button" onClick={reset}>Reset</button></div>
      <p>Each colored sample moves toward its average. That average then joins the histogram below.</p>
    </Panel>
    <section className="msk-panel msk-canvas clt-comparison"><div className="clt-lanes"><SamplingLane label="A" color="#147df2" shape={shape} size={small} means={smallMeans} current={currentSmall} progress={progress} mode={mode} /><SamplingLane label="B" color="#8b45f4" shape={shape} size={large} means={largeMeans} current={currentLarge} progress={progress} /></div></section>
    <aside className="msk-panel msk-live"><h2>Live comparison</h2><LiveRow color="#147df2" label="A predicted SE" value={fmt(10 / Math.sqrt(small), 2)} /><LiveRow color="#8b45f4" label="B predicted SE" value={fmt(10 / Math.sqrt(large), 2)} /><LiveRow color="#10b981" label="Samples per panel" value={String(count)} /><p>The population mean is 50. For both shapes its standard deviation is 10, so the standard error is 10/√n. Larger n makes the sample means less spread out.</p><ChallengeBox kind="live" prompt="Predicted standard error for the violet sample size? Round to 3 decimals." expected={10 / Math.sqrt(large)} tolerance={.001} hint="Divide the population SD, 10, by √n." /></aside>
  </Phase1LabChrome>;
}
