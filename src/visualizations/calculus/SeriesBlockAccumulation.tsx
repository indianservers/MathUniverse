import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

const terms = Array.from({ length: 10 }, (_, index) => {
  const n = index + 1;
  return { n, value: (n * n + n + 1) / factorial(n) };
});
const target = 4 * Math.E - 1;

export default function SeriesBlockAccumulation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const accumulated = useMemo(() => terms.slice(0, step).reduce((sum, term) => sum + term.value, 0), [step]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => (value >= terms.length ? 0 : value + 1)), 760);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <SectionCard title="Series Block Accumulation" description="Blocks show terms (n^2+n+1)/n!. The reservoir quickly approaches the flat ceiling 4e - 1 without overlapping.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SeriesCanvas step={step} accumulated={accumulated} />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button className={playing ? "action-primary" : "action-secondary"} type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button className="action-secondary" type="button" onClick={() => { setStep(0); setPlaying(false); }}>
              <RotateCcw className="h-4 w-4" />Reset
            </button>
          </div>
          <label className="block rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
            Term scanner
            <input className="mt-3 w-full accent-cyan-500" type="range" min={0} max={terms.length} step={1} value={step} onChange={(event) => { setStep(Number(event.target.value)); setPlaying(false); }} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="terms dropped" value={step.toString()} />
            <Metric label="partial sum" value={roundTo(accumulated, 5).toString()} />
            <Metric label="ceiling" value={roundTo(target, 5).toString()} />
            <Metric label="gap" value={roundTo(target - accumulated, 5).toString()} />
          </div>
          <div className="rounded-xl bg-slate-100 p-3 font-mono text-sm dark:bg-white/10">
            Sum = Σ(n²+n+1)/n! = 4e - 1
          </div>
        </div>
      </div>
      <div className="mt-4">
        <VisualLearningPanel
          concept="The factorial in the denominator rapidly crushes the block sizes, so the accumulated total reaches a visible ceiling quickly."
          formula="sum_{n=1}^{infty}(n^2+n+1)/n! = 4e - 1"
          changes="As the scanning line passes each integer, that term drops into the reservoir without overlap and adds to the total height."
          realWorldUse="Series convergence, factorial decay, exponential generating functions, and approximation bounds."
          steps={[`Current partial sum = ${roundTo(accumulated, 5)}`, `Limit ceiling = ${roundTo(target, 5)}`, `Remaining visible gap = ${roundTo(Math.max(0, target - accumulated), 5)}`, "Later blocks are tiny because n! outruns n^2+n+1."]}
          tasks={["Pause at n = 4.", "Compare the first block with the tenth block.", "Drag the scanner to fill the reservoir.", "Watch the top become almost flat."]}
        />
      </div>
    </SectionCard>
  );
}

function SeriesCanvas({ step, accumulated }: { step: number; accumulated: number }) {
  const maxTerm = terms[0].value;
  const reservoirHeight = Math.min(178, (accumulated / target) * 178);
  const scannerX = 64 + Math.min(step, terms.length) * 48;
  return (
    <svg viewBox="0 0 820 390" className="h-[390px] w-full rounded-xl bg-slate-950">
      <defs>
        <pattern id="series-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(148,163,184,0.14)" />
        </pattern>
        <filter id="series-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="820" height="390" fill="url(#series-grid)" />
      <line x1="54" y1="304" x2="570" y2="304" stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      <line x1="54" y1="58" x2="54" y2="304" stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />
      <text x="60" y="38" fill="#e2e8f0" fontSize="14" fontWeight="900">term magnitude</text>
      <text x="506" y="326" fill="#e2e8f0" fontSize="14" fontWeight="900">n</text>
      {terms.map((term, index) => {
        const height = (term.value / maxTerm) * 210;
        const x = 72 + index * 48;
        const dropped = term.n <= step;
        return (
          <g key={term.n}>
            <rect x={x} y={304 - height} width="30" height={height} rx="5" fill={dropped ? "#22d3ee" : "#64748b"} opacity={dropped ? 0.32 : 0.72} />
            <text x={x + 9} y="326" fill="#cbd5e1" fontSize="12" fontWeight="900">{term.n}</text>
            {term.n === Math.max(1, step) && <text x={x - 12} y={292 - height} fill="#67e8f9" fontSize="12" fontWeight="900">{roundTo(term.value, 3)}</text>}
          </g>
        );
      })}
      <line x1={scannerX} y1="50" x2={scannerX} y2="326" stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 7" filter="url(#series-glow)" />

      <rect x="622" y="82" width="146" height="222" rx="16" fill="rgba(15,23,42,0.9)" stroke="#67e8f9" strokeWidth="3" />
      <line x1="622" y1="106" x2="768" y2="106" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" />
      <text x="632" y="98" fill="#fde68a" fontSize="13" fontWeight="900">4e - 1 ceiling</text>
      <rect x="638" y={304 - reservoirHeight} width="114" height={reservoirHeight} rx="10" fill="#22d3ee" opacity="0.72" filter="url(#series-glow)" />
      {terms.slice(0, step).map((term, index) => {
        const blockHeight = Math.max(2, (term.value / target) * 178);
        const offset = terms.slice(0, index).reduce((sum, item) => sum + Math.max(2, (item.value / target) * 178), 0);
        return <rect key={term.n} x="638" y={304 - offset - blockHeight} width="114" height={blockHeight} fill="none" stroke="rgba(248,250,252,0.35)" />;
      })}
      <text x="632" y="334" fill="#e2e8f0" fontSize="13" fontWeight="900">sum = {roundTo(accumulated, 4)}</text>
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function factorial(n: number) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((product, value) => product * value, 1);
}
