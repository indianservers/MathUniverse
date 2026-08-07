import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import {
  bayesPosterior,
  binomialDistribution,
  simulateCoins,
  simulateDice,
  simulateMonteCarloPi,
  simulateRandomWalk,
  type FrequencyBin,
} from "../../../utils/mathEngine/probabilityUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

type ProbabilityModel = {
  title: string;
  metric: string;
  bins: FrequencyBin[];
  convergence?: Array<{ trial: number; value: number; expected: number }>;
};

function probabilityGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("sample spaces")) return ["Sample Spaces", "List every possible outcome once.", "Missing outcomes makes probabilities wrong."];
  if (name === "events") return ["Events", "An event is a set of outcomes.", "It can contain one, many, or no outcomes."];
  if (name.includes("probability scale")) return ["Probability Scale", "Probabilities stay from 0 to 1.", "0 is impossible and 1 is certain."];
  if (name.includes("complement rule")) return ["Complement Rule", "Subtract from 1 to find not A.", "A and not A cover the whole sample space."];
  if (name.includes("addition rule")) return ["Addition Rule", "Subtract overlap when events can share outcomes.", "This avoids double-counting."];
  if (name.includes("multiplication rule")) return ["Multiplication Rule", "Multiply along a sequence of events.", "Use conditional probability when events depend on each other."];
  if (name.includes("independent events")) return ["Independent Events", "One event does not change the other's probability.", "Independent does not mean impossible together."];
  if (name.includes("mutually exclusive")) return ["Mutually Exclusive Events", "The events have no shared outcomes.", "This is different from independence."];
  if (name.includes("conditional probability")) return ["Conditional Probability", "Use the reduced sample space after the condition.", "The known condition changes the denominator."];
  if (name.includes("tree diagrams")) return ["Tree Diagrams", "Multiply along paths and add matching paths.", "Branches organise multi-step chance."];
  if (name.includes("venn diagrams")) return ["Venn Diagrams", "Put shared outcomes in the overlap.", "Regions prevent double-counting."];
  if (name.includes("two-way tables")) return ["Two-Way Tables", "Use joint cells and margin totals carefully.", "Totals are not the same as inner cells."];
  if (name.includes("bayes")) return ["Bayes' Theorem", "Update a prior using evidence.", "Do not ignore the base rate."];
  if (name.includes("expected value")) return ["Expected Value", "Multiply outcomes by probabilities and add.", "It is a long-run average."];
  if (name === "simulation") return ["Simulation", "Run many trials to estimate probability.", "Small simulations are noisy."];
  if (name.includes("law of large numbers")) return ["Law of Large Numbers", "Relative frequency steadies over many trials.", "It does not force the next result."];
  if (name.includes("distribution calculator")) return ["Distribution Calculator", "Match the model before entering parameters.", "Each distribution has its own assumptions."];
  if (name.includes("probability plot")) return ["Probability Plot", "Compare data with a theoretical distribution.", "Look for overall pattern, not perfection."];
  if (name.includes("cumulative distribution")) return ["Cumulative Distribution", "Use P(X <= x).", "Cumulative means all values up to x."];
  if (name.includes("interval") || name.includes("tail probability")) return ["Interval / Tail Probability", "Check below, above, or between.", "The shaded area is the probability."];
  if (name.includes("inverse probability")) return ["Inverse Probability", "Start with probability and find the cutoff.", "The output is a value, not another probability."];
  if (name.includes("bernoulli")) return ["Bernoulli Distribution", "Model one success-or-failure trial.", "Use binomial for many fixed trials."];
  if (name.includes("negative binomial")) return ["Negative Binomial Distribution", "Count trials until a fixed number of successes.", "It extends geometric beyond one success."];
  if (name.includes("binomial")) return ["Binomial Distribution", "Count successes in fixed independent trials.", "n is fixed and p stays the same."];
  if (name.includes("hypergeometric")) return ["Hypergeometric Distribution", "Use for draws without replacement.", "The chance changes after each draw."];
  if (name.includes("poisson")) return ["Poisson Distribution", "Model counts in a fixed interval.", "Connect the rate to time, area, or space."];
  if (name.includes("geometric")) return ["Geometric Distribution", "Count trials until the first success.", "Check the convention before calculating."];
  if (name.includes("uniform")) return ["Uniform Distribution", "Allowed outcomes are equally likely.", "Do not include values outside the range."];
  if (name.includes("normal")) return ["Normal Distribution", "Use the mean for centre and standard deviation for spread.", "Area under the bell gives probability."];
  if (name.includes("student t")) return ["Student t Distribution", "Use t when sigma is unknown for mean inference.", "The tails are heavier than normal."];
  if (name.includes("chi-square")) return ["Chi-Square Distribution", "Use non-negative chi-square values.", "It often compares observed and expected counts."];
  if (name === "f distribution") return ["F Distribution", "Use a ratio of variance estimates.", "It needs two degrees-of-freedom values."];
  if (name.includes("exponential distribution")) return ["Exponential Distribution", "Model waiting time until the next event.", "Use Poisson for counts instead."];
  if (name.includes("gamma")) return ["Gamma Distribution", "Model waiting time until several events.", "Exponential is the one-event case."];
  if (name.includes("weibull")) return ["Weibull Distribution", "Model lifetimes with changing failure risk.", "The shape parameter controls risk over time."];
  if (name.includes("standardisation")) return ["Standardisation", "Subtract the mean and divide by standard deviation.", "This creates a z-score."];
  if (name.includes("distribution simulation")) return ["Distribution Simulation", "Generate random values from a chosen model.", "Simulation is not the exact theoretical distribution."];
  return ["Probability", "Probabilities stay within 0 and 1.", "Repeated samples converge toward the theoretical model."];
}

function modelFor(title: string, trials: number, parameter: number, seed: number): ProbabilityModel {
  const name = title.toLowerCase();
  if (name.includes("binomial") || name.includes("bernoulli")) {
    const bins = binomialDistribution(Math.max(2, Math.round(parameter)), 0.5);
    return { title: "Binomial mass", metric: `E[X] = ${(parameter * 0.5).toFixed(2)}`, bins };
  }
  if (name.includes("monte carlo") || name.includes("pi")) {
    const result = simulateMonteCarloPi(trials, seed);
    return { title: "Monte Carlo convergence", metric: `pi ~= ${result.estimate.toFixed(4)}`, bins: [], convergence: result.convergence };
  }
  if (name.includes("walk")) {
    const result = simulateRandomWalk(trials, parameter / 20, seed);
    return { title: "Random walk", metric: `Final = ${result.finalPosition}`, bins: [], convergence: result.path };
  }
  if (name.includes("bayes") || name.includes("conditional")) {
    const result = bayesPosterior(parameter / 20, 0.9, 0.1);
    return { title: "Bayesian update", metric: `Posterior = ${(result.posterior * 100).toFixed(1)}%`, bins: [{ label: "prior", count: result.prior, expected: 0 }, { label: "posterior", count: result.posterior, expected: 0 }] };
  }
  if (name.includes("coin") || name.includes("experimental") || name === "simulation" || name.includes("law of large numbers")) {
    const result = simulateCoins(trials, seed);
    return { title: "Coin convergence", metric: `Heads = ${(result.heads / trials).toFixed(3)}`, bins: [{ label: "H", count: result.heads, expected: trials / 2 }, { label: "T", count: result.tails, expected: trials / 2 }], convergence: result.convergence };
  }
  const result = simulateDice(trials, 2, seed);
  return { title: "Dice distribution", metric: `${trials} seeded trials`, bins: result.frequencies };
}

export default function ProbabilityLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const seed = lesson.id * 104729 + 17;
  const [trials, setTrials] = useState(120);
  const [parameter, setParameter] = useState(10);
  useEffect(() => {
    setTrials(120);
    setParameter(10);
  }, [resetToken]);
  const model = useMemo(() => modelFor(lesson.title, trials, parameter, seed), [lesson.title, parameter, seed, trials]);
  const guidance = probabilityGuidanceFor(lesson.title);
  const maxBin = Math.max(...model.bins.map((bin) => bin.count), 1);
  const path = model.convergence?.map((point, index, items) => {
    const x = 20 + index / Math.max(1, items.length - 1) * 600;
    const min = Math.min(...items.map((item) => item.value));
    const max = Math.max(...items.map((item) => item.value));
    const y = 320 - (point.value - min) / Math.max(1e-9, max - min) * 270;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };

  return (
    <AdapterFrame title={`${lesson.title} - seeded simulation`} value={model.metric} footer={`Seed ${seed}. Resetting reproduces the same experiment exactly.`}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          <p className="text-xs font-black uppercase text-slate-500">{model.title}</p>
          <svg viewBox="0 0 640 350" className="h-[285px] w-full" role="img" aria-label={model.title}>
            <line x1="20" x2="625" y1="320" y2="320" stroke="#64748b" />
            {path ? (
              <path d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />
            ) : (
              model.bins.map((bin, index) => {
                const width = 570 / Math.max(1, model.bins.length);
                const height = bin.count / maxBin * 260;
                return (
                  <g key={bin.label}>
                    <rect x={35 + index * width} y={320 - height} width={Math.max(4, width - 8)} height={height} fill="#06b6d4" rx="4" />
                    <text x={35 + index * width + width / 2} y="340" textAnchor="middle" fontSize="11" fill="#64748b">{bin.label}</text>
                  </g>
                );
              })
            )}
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="Simulation controls">
            <SliderControl density="compact" label="Trials" value={trials} min={20} max={1000} step={20} onChange={update(setTrials)} />
            <SliderControl density="compact" label="Parameter" value={parameter} min={2} max={18} step={1} onChange={update(setParameter)} />
          </SliderGroup>
          <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
            <strong>Live invariant</strong>
            <p className="mt-1 text-slate-500 dark:text-slate-300">Probabilities stay within 0 and 1; repeated samples converge toward the theoretical model.</p>
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}
