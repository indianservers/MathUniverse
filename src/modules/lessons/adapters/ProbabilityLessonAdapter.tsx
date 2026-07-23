import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { bayesPosterior, binomialDistribution, simulateCoins, simulateDice, simulateMonteCarloPi, simulateRandomWalk, type FrequencyBin } from "../../../utils/mathEngine/probabilityUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

type ProbabilityModel = { title: string; metric: string; bins: FrequencyBin[]; convergence?: Array<{ trial: number; value: number; expected: number }> };

function modelFor(title: string, trials: number, parameter: number, seed: number): ProbabilityModel {
  const name = title.toLowerCase();
  if (name.includes("binomial") || name.includes("bernoulli")) { const bins = binomialDistribution(Math.max(2, Math.round(parameter)), 0.5); return { title: "Binomial mass", metric: `E[X] = ${(parameter * .5).toFixed(2)}`, bins }; }
  if (name.includes("monte carlo") || name.includes("pi")) { const result = simulateMonteCarloPi(trials, seed); return { title: "Monte Carlo convergence", metric: `π ≈ ${result.estimate.toFixed(4)}`, bins: [], convergence: result.convergence }; }
  if (name.includes("walk")) { const result = simulateRandomWalk(trials, parameter / 20, seed); return { title: "Random walk", metric: `Final = ${result.finalPosition}`, bins: [], convergence: result.path }; }
  if (name.includes("bayes") || name.includes("conditional")) { const result = bayesPosterior(parameter / 20, .9, .1); return { title: "Bayesian update", metric: `Posterior = ${(result.posterior * 100).toFixed(1)}%`, bins: [{ label: "prior", count: result.prior, expected: 0 }, { label: "posterior", count: result.posterior, expected: 0 }] }; }
  if (name.includes("coin") || name.includes("experimental")) { const result = simulateCoins(trials, seed); return { title: "Coin convergence", metric: `Heads = ${(result.heads / trials).toFixed(3)}`, bins: [{ label: "H", count: result.heads, expected: trials / 2 }, { label: "T", count: result.tails, expected: trials / 2 }], convergence: result.convergence }; }
  const result = simulateDice(trials, 2, seed); return { title: "Dice distribution", metric: `${trials} seeded trials`, bins: result.frequencies };
}

export default function ProbabilityLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const seed = lesson.id * 104729 + 17; const [trials, setTrials] = useState(120); const [parameter, setParameter] = useState(10);
  useEffect(() => { setTrials(120); setParameter(10); }, [resetToken]);
  const model = useMemo(() => modelFor(lesson.title, trials, parameter, seed), [lesson.title, parameter, seed, trials]);
  const maxBin = Math.max(...model.bins.map((bin) => bin.count), 1);
  const path = model.convergence?.map((point, index, items) => { const x = 20 + index / Math.max(1, items.length - 1) * 600; const min = Math.min(...items.map((item) => item.value)); const max = Math.max(...items.map((item) => item.value)); const y = 320 - (point.value - min) / Math.max(1e-9, max - min) * 270; return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · seeded simulation`} value={model.metric} footer={`Seed ${seed}. Resetting reproduces the same experiment exactly.`}>
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><p className="text-xs font-black uppercase text-slate-500">{model.title}</p><svg viewBox="0 0 640 350" className="h-[285px] w-full" role="img" aria-label={model.title}><line x1="20" x2="625" y1="320" y2="320" stroke="#64748b" />{path ? <path d={path} fill="none" stroke="#06b6d4" strokeWidth="4" /> : model.bins.map((bin, index) => { const width = 570 / Math.max(1, model.bins.length); const height = bin.count / maxBin * 260; return <g key={bin.label}><rect x={35 + index * width} y={320 - height} width={Math.max(4, width - 8)} height={height} fill="#06b6d4" rx="4" /><text x={35 + index * width + width / 2} y="340" textAnchor="middle" fontSize="11" fill="#64748b">{bin.label}</text></g>; })}</svg></div><div className="space-y-3"><SliderGroup title="Simulation controls"><SliderControl density="compact" label="Trials" value={trials} min={20} max={1000} step={20} onChange={update(setTrials)} /><SliderControl density="compact" label="Parameter" value={parameter} min={2} max={18} step={1} onChange={update(setParameter)} /></SliderGroup><div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10"><strong>Live invariant</strong><p className="mt-1 text-slate-500 dark:text-slate-300">Probabilities stay within 0 and 1; repeated samples converge toward the theoretical model.</p></div></div></div>
  </AdapterFrame>;
}
