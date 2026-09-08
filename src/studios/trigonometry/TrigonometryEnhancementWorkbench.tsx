import { useState, type ReactNode } from "react";
import * as trig from "./trigonometryEnhancementEngine";

function Tool({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <article data-enhancement-id={id} className="min-h-40 rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70"><h2 className="text-sm font-black text-slate-950 dark:text-white">{title}</h2>{children}</article>;
}
function Output({ children }: { children: unknown }) { return <output className="mt-3 block break-words rounded-lg bg-cyan-50 p-2 font-mono text-[11px] leading-5 text-slate-800 dark:bg-cyan-950/40 dark:text-cyan-50">{JSON.stringify(children, (_key, value) => typeof value === "number" ? Number.isFinite(value) ? Math.round(value * 1e6) / 1e6 : String(value) : value)}</output>; }
function Input({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) { return <label className="grid gap-1 text-xs font-bold text-slate-700 dark:text-slate-200"><span>{label}</span><input className="h-10 rounded-lg border border-slate-200 bg-white px-2 dark:border-white/10 dark:bg-slate-900" type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }

export default function TrigonometryEnhancementWorkbench() {
  const [degrees, setDegrees] = useState(45), [amplitude, setAmplitude] = useState(2), [frequency, setFrequency] = useState(1), [secondary, setSecondary] = useState(30), [harmonics, setHarmonics] = useState(6);
  const angle = trig.toRadians(degrees, "degrees"), beta = trig.toRadians(secondary, "degrees"), count = Math.max(1, Math.min(20, Math.round(Math.abs(harmonics))));
  return <div className="space-y-4 p-1">
    <section className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-violet-50 p-4 dark:border-cyan-400/20 dark:from-cyan-950/40 dark:to-violet-950/40"><h1 className="text-xl font-black">Advanced Trigonometry Workbench</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Twenty-five synchronized circular, triangular, wave, phasor, and advanced trigonometry tools.</p></section>
    <section aria-label="Shared trigonometry parameters" className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 sm:grid-cols-2 xl:grid-cols-5 dark:border-white/10 dark:bg-white/5"><Input label="Angle θ (degrees)" value={degrees} onChange={setDegrees} /><Input label="Amplitude / side a" value={amplitude} step={.1} onChange={setAmplitude} /><Input label="Frequency / side b" value={frequency} step={.1} onChange={setFrequency} /><Input label="Second angle / phase" value={secondary} onChange={setSecondary} /><Input label="Harmonics" value={harmonics} onChange={setHarmonics} /></section>
    <section aria-label="Twenty-five Trigonometry enhancements" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <Tool id="TRIG-01" title="1. Exact-angle snapping"><Output>{trig.snapNotableAngle(degrees)}</Output></Tool>
      <Tool id="TRIG-02" title="2. Degree, radian, and gradian modes"><Output>{{ degrees, radians: angle, gradians: trig.fromRadians(angle, "gradians") }}</Output></Tool>
      <Tool id="TRIG-03" title="3. All six trigonometric functions"><Output>{trig.sixTrigFunctions(angle)}</Output></Tool>
      <Tool id="TRIG-04" title="4. Signed reference triangle"><Output>{trig.referenceTriangle(angle)}</Output></Tool>
      <Tool id="TRIG-05" title="5. Inverse branch restrictions"><Output>{trig.inverseBranch("asin", Math.sin(angle))}</Output></Tool>
      <Tool id="TRIG-06" title="6. Wave transformation handles"><Output>{trig.waveTransform(amplitude, frequency, beta, 0, angle)}</Output></Tool>
      <Tool id="TRIG-07" title="7. Unit-circle and wave synchronization"><Output>{trig.circleWaveSync(angle)}</Output></Tool>
      <Tool id="TRIG-08" title="8. Sum-and-difference derivation"><Output>{trig.sumDifference(angle, beta)}</Output></Tool>
      <Tool id="TRIG-09" title="9. Double- and half-angle identities"><Output>{trig.doubleHalf(angle)}</Output></Tool>
      <Tool id="TRIG-10" title="10. Identity proof verifier"><Output>{trig.verifyIdentity((x) => Math.sin(x) ** 2 + Math.cos(x) ** 2, () => 1)}</Output></Tool>
      <Tool id="TRIG-11" title="11. Trig equation solution families"><p className="mt-2 text-xs">sin x = sin θ on [0, 2π]</p><Output>{trig.sineEquationSolutions(Math.sin(angle))}</Output></Tool>
      <Tool id="TRIG-12" title="12. Trig inequality intervals"><p className="mt-2 text-xs">sin x &gt; 0</p><Output>{trig.sinePositiveIntervals()}</Output></Tool>
      <Tool id="TRIG-13" title="13. SSA ambiguous case"><Output>{trig.ambiguousSSA(Math.max(.1, Math.abs(amplitude)), Math.max(.1, Math.abs(frequency)), Math.max(.01, Math.min(Math.PI - .01, angle)))}</Output></Tool>
      <Tool id="TRIG-14" title="14. Sine/cosine-law triangle solver"><Output>{trig.solveTriangleSAS(Math.max(.1, Math.abs(amplitude)), Math.max(.1, Math.abs(frequency)), Math.max(.01, Math.min(Math.PI - .01, angle)))}</Output></Tool>
      <Tool id="TRIG-15" title="15. Triangle measurement uncertainty"><Output>{trig.triangleUncertainty(Math.max(.1, Math.abs(amplitude)), Math.max(.1, Math.abs(frequency)), Math.max(.02, Math.min(Math.PI - .02, angle)), .01)}</Output></Tool>
      <Tool id="TRIG-16" title="16. Heights and distances"><Output>{trig.heightFromElevation(Math.abs(amplitude) * 10, angle, 1.6)}</Output></Tool>
      <Tool id="TRIG-17" title="17. Bearings and navigation"><Output>{trig.bearingVector(Math.abs(amplitude) * 10, angle)}</Output></Tool>
      <Tool id="TRIG-18" title="18. Polar rose connection"><Output>{trig.polarRose(Math.max(1, Math.round(Math.abs(frequency))), angle)}</Output></Tool>
      <Tool id="TRIG-19" title="19. Phasor addition"><Output>{trig.addPhasors({ magnitude: Math.abs(amplitude), phase: angle }, { magnitude: Math.abs(frequency), phase: beta })}</Output></Tool>
      <Tool id="TRIG-20" title="20. Fourier harmonic synthesis"><Output>{trig.fourierSynthesis(angle, count)}</Output></Tool>
      <Tool id="TRIG-21" title="21. Resonance and beats"><Output>{trig.beatWave(Math.abs(amplitude), Math.abs(frequency), Math.abs(frequency) + Math.abs(secondary) / 100, angle)}</Output></Tool>
      <Tool id="TRIG-22" title="22. Spherical triangle"><Output>{trig.sphericalTriangleSide(Math.abs(angle % Math.PI), Math.abs(beta % Math.PI), Math.PI / 3)}</Output></Tool>
      <Tool id="TRIG-23" title="23. Hyperbolic functions"><Output>{trig.hyperbolicFunctions(angle)}</Output></Tool>
      <Tool id="TRIG-24" title="24. Singularity stability warning"><Output>{trig.singularityStability(angle)}</Output></Tool>
      <Tool id="TRIG-25" title="25. Exact-value challenge"><Output>{trig.exactAngleValue(trig.snapNotableAngle(degrees).snapped)}</Output></Tool>
    </section>
  </div>;
}
