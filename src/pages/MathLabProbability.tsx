import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import {
  bayesPosterior,
  binomialDistribution,
  clampInteger,
  drawCards,
  oneProportionZTest,
  simulateConfidenceIntervals,
  simulateCoins,
  simulateDice,
  simulateMarkovChain,
  simulateMonteCarloPi,
  simulateRandomWalk,
  simulateSamplingDistribution,
  type FrequencyBin,
  type TrialPoint,
} from "../utils/mathEngine/probabilityUtils";

export default function MathLabProbability() {
  const [coinTrials, setCoinTrials] = useState(500);
  const [diceTrials, setDiceTrials] = useState(600);
  const [diceCount, setDiceCount] = useState<1 | 2>(2);
  const [cardCount, setCardCount] = useState(5);
  const [binomialN, setBinomialN] = useState(10);
  const [binomialP, setBinomialP] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(12);
  const [sampleRuns, setSampleRuns] = useState(600);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  const [randomWalkSteps, setRandomWalkSteps] = useState(300);
  const [walkDrift, setWalkDrift] = useState(0.5);
  const [monteCarloSamples, setMonteCarloSamples] = useState(3000);
  const [prior, setPrior] = useState(0.02);
  const [sensitivity, setSensitivity] = useState(0.94);
  const [falsePositiveRate, setFalsePositiveRate] = useState(0.08);
  const [markovStayHealthy, setMarkovStayHealthy] = useState(0.86);
  const [markovRecover, setMarkovRecover] = useState(0.42);
  const [runKey, setRunKey] = useState(0);

  const coins = useMemo(() => {
    void runKey;
    return simulateCoins(coinTrials, 1001 + runKey);
  }, [coinTrials, runKey]);
  const dice = useMemo(() => {
    return simulateDice(diceTrials, diceCount, 2001 + runKey);
  }, [diceTrials, diceCount, runKey]);
  const cards = useMemo(() => {
    return drawCards(cardCount, 3001 + runKey);
  }, [cardCount, runKey]);
  const binomial = useMemo(() => binomialDistribution(binomialN, binomialP), [binomialN, binomialP]);
  const sampling = useMemo(() => simulateSamplingDistribution(sampleRuns, sampleSize, 4001 + runKey), [sampleRuns, sampleSize, runKey]);
  const intervals = useMemo(() => simulateConfidenceIntervals(80, sampleSize, confidenceLevel, 5001 + runKey), [sampleSize, confidenceLevel, runKey]);
  const randomWalk = useMemo(() => simulateRandomWalk(randomWalkSteps, walkDrift, 6001 + runKey), [randomWalkSteps, walkDrift, runKey]);
  const monteCarlo = useMemo(() => simulateMonteCarloPi(monteCarloSamples, 7001 + runKey), [monteCarloSamples, runKey]);
  const bayes = useMemo(() => bayesPosterior(prior, sensitivity, falsePositiveRate), [prior, sensitivity, falsePositiveRate]);
  const hypothesis = useMemo(() => oneProportionZTest(coins.heads, Math.max(1, coins.heads + coins.tails), 0.5), [coins.heads, coins.tails]);
  const markov = useMemo(() => simulateMarkovChain([
    [markovStayHealthy, 1 - markovStayHealthy],
    [markovRecover, 1 - markovRecover],
  ], [0.8, 0.2], 18, ["Stable", "At risk"]), [markovStayHealthy, markovRecover]);
  const headsRate = coins.heads / Math.max(1, coins.heads + coins.tails);
  const redCards = cards.filter((card) => card.color === "red").length;

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Probability Simulator"
        subtitle="Run random experiments, compare outcomes with theory, and watch probability stabilize as trials grow."
        difficulty="Intermediate Lab"
        estimatedMinutes={20}
      />

      <div className="flex flex-wrap gap-3">
        {[100, 500, 1000, 5000].map((count) => (
          <button key={count} type="button" className="mini-chip" onClick={() => { setCoinTrials(count); setDiceTrials(count); }}>
            {count} trials
          </button>
        ))}
        <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={() => setRunKey((value) => value + 1)}>
          <RotateCcw className="h-4 w-4" />
          Rerun experiments
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Coin Toss Controls" description="Compare experimental heads frequency with the theoretical probability of 0.5.">
          <SliderControl label="Tosses" value={coinTrials} min={10} max={10000} step={10} onChange={(value) => setCoinTrials(clampInteger(value, 10, 10000))} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <Metric label="Heads" value={coins.heads} />
            <Metric label="Tails" value={coins.tails} />
            <Metric label="P(heads)" value={format(headsRate)} />
          </div>
        </SectionCard>
        <SectionCard title="Law of Large Numbers Trace" description="The running heads ratio moves around, then trends toward the expected value as trials increase.">
          <LineChart points={coins.convergence} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Dice Controls" description="Roll one die or two dice and compare actual counts with expected frequencies.">
          <SliderControl label="Rolls" value={diceTrials} min={12} max={10000} step={12} onChange={(value) => setDiceTrials(clampInteger(value, 12, 10000))} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setDiceCount(1)} className={diceButtonClass(diceCount === 1)}>1 die</button>
            <button type="button" onClick={() => setDiceCount(2)} className={diceButtonClass(diceCount === 2)}>2 dice</button>
          </div>
        </SectionCard>
        <SectionCard title="Dice Frequency Distribution">
          <BarChart bins={dice.frequencies} valueLabel="rolls" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Card Draws" description="Draw without replacement from a standard 52-card deck.">
          <SliderControl label="Cards drawn" value={cardCount} min={1} max={10} step={1} onChange={(value) => setCardCount(clampInteger(value, 1, 10))} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
            {cards.map((card) => (
              <div key={`${card.rank}-${card.suit}`} className={`rounded-lg border p-3 text-center font-black ${card.color === "red" ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100" : "border-slate-200 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white"}`}>
                <p className="text-lg">{card.rank}</p>
                <p className="mt-1 text-xs uppercase">{card.suit}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Red cards: {redCards} of {cards.length}</p>
        </SectionCard>

        <SectionCard title="Binomial Distribution" description="Model the probability of k successes in n independent trials.">
          <SliderGroup title="Binomial controls">
            <SliderControl density="compact" label="Trials n" value={binomialN} min={1} max={50} step={1} onChange={(value) => setBinomialN(clampInteger(value, 1, 50))} />
            <SliderControl density="compact" label="Success probability p" value={binomialP} min={0.05} max={0.95} step={0.05} onChange={setBinomialP} />
          </SliderGroup>
          <BarChart bins={binomial} valueLabel="probability" normalize />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Sampling Distribution And CLT" description="Sample means from repeated die-roll samples become more concentrated around the population mean.">
          <SliderGroup title="CLT controls">
            <SliderControl density="compact" label="Sample size" value={sampleSize} min={2} max={80} step={1} onChange={(value) => setSampleSize(clampInteger(value, 2, 80))} />
            <SliderControl density="compact" label="Repeated samples" value={sampleRuns} min={50} max={3000} step={50} onChange={(value) => setSampleRuns(clampInteger(value, 50, 3000))} />
          </SliderGroup>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <Metric label="Population mean" value={format(sampling.populationMean)} />
            <Metric label="Mean of means" value={format(sampling.meanOfMeans)} />
            <Metric label="Std. error" value={format(sampling.standardError)} />
          </div>
        </SectionCard>
        <SectionCard title="Sample Mean Histogram">
          <BarChart bins={sampling.histogram} valueLabel="samples" />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Confidence Interval Coverage" description="Repeated confidence intervals should capture the true mean at about the chosen confidence level.">
          <SliderGroup title="Interval controls">
            <SliderControl density="compact" label="Sample size" value={sampleSize} min={5} max={120} step={1} onChange={(value) => setSampleSize(clampInteger(value, 5, 120))} />
            <SliderControl density="compact" label="Confidence" value={confidenceLevel} min={0.9} max={0.99} step={0.01} onChange={setConfidenceLevel} />
          </SliderGroup>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Metric label="Capture rate" value={format(intervals.captureRate)} />
            <Metric label="Target" value={format(intervals.expectedCaptureRate)} />
          </div>
        </SectionCard>
        <SectionCard title="Interval Simulation">
          <IntervalChart intervals={intervals.intervals.slice(0, 60)} target={3.5} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Hypothesis Test From Coin Data" description="A one-proportion z-test compares your simulated heads rate with H0: p = 0.5.">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="z score" value={format(hypothesis.z)} />
            <Metric label="p value" value={format(hypothesis.pValue)} />
          </div>
          <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-white/10 dark:text-slate-200">{hypothesis.conclusion}</p>
        </SectionCard>
        <SectionCard title="Bayes Diagnostic Test" description="Move prior probability, sensitivity, and false-positive rate to see how evidence changes belief.">
          <SliderGroup title="Bayes controls">
            <SliderControl density="compact" label="Prior P(A)" value={prior} min={0.001} max={0.5} step={0.001} onChange={setPrior} />
            <SliderControl density="compact" label="Sensitivity P(+|A)" value={sensitivity} min={0.5} max={0.999} step={0.001} onChange={setSensitivity} />
            <SliderControl density="compact" label="False positive P(+|not A)" value={falsePositiveRate} min={0.001} max={0.5} step={0.001} onChange={setFalsePositiveRate} />
          </SliderGroup>
          <ProbabilityMeter label="Posterior P(A|+)" value={bayes.posterior} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Monte Carlo Pi" description="Throw random points into a unit square. The quarter-circle hit rate estimates pi.">
          <SliderControl label="Samples" value={monteCarloSamples} min={100} max={20000} step={100} onChange={(value) => setMonteCarloSamples(clampInteger(value, 100, 20000))} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <Metric label="Inside" value={monteCarlo.inside} />
            <Metric label="Total" value={monteCarlo.total} />
            <Metric label="Pi estimate" value={format(monteCarlo.estimate)} />
          </div>
        </SectionCard>
        <SectionCard title="Monte Carlo Visual Check">
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <MonteCarloScatter points={monteCarlo.sample} />
            <FlexibleLineChart points={monteCarlo.convergence} expected={Math.PI} label="pi estimate" color="#a855f7" />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Random Walk" description="A one-dimensional walk reveals drift, spread, and path dependence.">
          <SliderGroup title="Walk controls">
            <SliderControl density="compact" label="Steps" value={randomWalkSteps} min={20} max={3000} step={20} onChange={(value) => setRandomWalkSteps(clampInteger(value, 20, 3000))} />
            <SliderControl density="compact" label="Probability of +1" value={walkDrift} min={0.05} max={0.95} step={0.01} onChange={setWalkDrift} />
          </SliderGroup>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Metric label="Final position" value={randomWalk.finalPosition} />
            <Metric label="Max distance" value={randomWalk.maxDistance} />
          </div>
        </SectionCard>
        <SectionCard title="Walk Path">
          <FlexibleLineChart points={randomWalk.path} expected={0} label="position" color="#14b8a6" />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Markov Chain" description="A two-state transition model shows how probabilities evolve toward equilibrium.">
          <SliderGroup title="Transition controls">
            <SliderControl density="compact" label="Stable -> Stable" value={markovStayHealthy} min={0.05} max={0.98} step={0.01} onChange={setMarkovStayHealthy} />
            <SliderControl density="compact" label="At risk -> Stable" value={markovRecover} min={0.02} max={0.95} step={0.01} onChange={setMarkovRecover} />
          </SliderGroup>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {markov.states.map((stateName, index) => <Metric key={stateName} label={`Final ${stateName}`} value={format(markov.steadyState[index])} />)}
          </div>
        </SectionCard>
        <SectionCard title="State Probability Evolution">
          <MarkovChart simulation={markov} />
        </SectionCard>
      </div>

      <SectionCard title="Classroom Prompts">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Run 100 coin tosses, then 5000. Which result is closer to 0.5?",
            "Roll two dice and identify why 7 appears more often than 2 or 12.",
            "Increase sample size in the CLT panel and describe how standard error changes.",
            "Use Bayes controls to explain why rare events can still have low posterior probability after a positive test.",
            "Change Markov transition probabilities and predict the long-run equilibrium.",
            "Estimate pi with 300 samples and 10000 samples. Which is steadier?",
          ].map((prompt) => (
            <div key={prompt} className="rounded-lg bg-slate-100 p-4 text-sm font-semibold leading-6 dark:bg-white/10">
              <Sparkles className="mb-2 h-4 w-4 text-cyan-500" />
              {prompt}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-lg font-black">{value}</p>
    </div>
  );
}

function LineChart({ points }: { points: TrialPoint[] }) {
  const width = 720;
  const height = 260;
  const padding = 28;
  const maxTrial = Math.max(1, points.at(-1)?.trial ?? 1);
  const path = points.map((point, index) => {
    const x = padding + (point.trial / maxTrial) * (width - padding * 2);
    const y = padding + (1 - point.value) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const expectedY = padding + 0.5 * (height - padding * 2);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-h-64 w-full min-w-[520px] rounded-lg bg-slate-950 text-xs">
        <line x1={padding} x2={width - padding} y1={expectedY} y2={expectedY} stroke="#22c55e" strokeDasharray="6 6" />
        <path d={path} fill="none" stroke="#38bdf8" strokeWidth="3" />
        <text x={padding} y={24} fill="#cbd5e1">running P(heads)</text>
        <text x={width - 160} y={expectedY - 8} fill="#86efac">expected 0.5</text>
      </svg>
    </div>
  );
}

function BarChart({ bins, valueLabel, normalize = false }: { bins: FrequencyBin[]; valueLabel: string; normalize?: boolean }) {
  const max = Math.max(...bins.map((bin) => normalize ? bin.count : Math.max(bin.count, bin.expected)), 1);
  return (
    <div className="mt-4 space-y-2">
      {bins.map((bin) => {
        const value = normalize ? bin.count : bin.count;
        const expected = normalize ? 0 : bin.expected;
        return (
          <div key={bin.label} className="grid grid-cols-[2.5rem_minmax(0,1fr)_5rem] items-center gap-3 text-sm">
            <span className="font-mono font-black">{bin.label}</span>
            <div className="relative h-8 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
              {!normalize && <div className="absolute inset-y-1 bg-emerald-300/60" style={{ width: `${(expected / max) * 100}%` }} />}
              <div className="absolute inset-y-0 bg-cyan-500" style={{ width: `${(value / max) * 100}%` }} />
            </div>
            <span className="text-right font-mono text-xs font-bold">{normalize ? format(value) : Math.round(value)} {normalize ? "" : valueLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

function FlexibleLineChart({ points, expected, label, color }: { points: TrialPoint[]; expected: number; label: string; color: string }) {
  const width = 720;
  const height = 260;
  const padding = 32;
  const maxTrial = Math.max(1, points.at(-1)?.trial ?? 1);
  const values = [...points.map((point) => point.value), expected];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const span = maxValue - minValue || 1;
  const yFor = (value: number) => padding + (1 - (value - minValue) / span) * (height - padding * 2);
  const path = points.map((point, index) => {
    const x = padding + (point.trial / maxTrial) * (width - padding * 2);
    const y = yFor(point.value);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const expectedY = yFor(expected);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-h-64 w-full min-w-[520px] rounded-lg bg-slate-950 text-xs">
        <line x1={padding} x2={width - padding} y1={expectedY} y2={expectedY} stroke="#facc15" strokeDasharray="6 6" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" />
        <text x={padding} y={24} fill="#cbd5e1">{label}</text>
        <text x={width - 170} y={expectedY - 8} fill="#fde68a">reference {format(expected)}</text>
        <text x={padding} y={height - 10} fill="#94a3b8">min {format(minValue)}</text>
        <text x={width - 120} y={height - 10} fill="#94a3b8">max {format(maxValue)}</text>
      </svg>
    </div>
  );
}

function IntervalChart({ intervals, target }: { intervals: Array<{ index: number; lower: number; upper: number; captures: boolean }>; target: number }) {
  const width = 720;
  const height = 300;
  const padding = 32;
  const values = intervals.flatMap((interval) => [interval.lower, interval.upper, target]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const span = maxValue - minValue || 1;
  const xFor = (value: number) => padding + ((value - minValue) / span) * (width - padding * 2);
  const targetX = xFor(target);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-h-72 w-full min-w-[520px] rounded-lg bg-slate-950">
        <line x1={targetX} x2={targetX} y1={padding} y2={height - padding} stroke="#facc15" strokeDasharray="6 6" />
        {intervals.map((interval, index) => {
          const y = padding + (index / Math.max(1, intervals.length - 1)) * (height - padding * 2);
          return (
            <g key={interval.index}>
              <line x1={xFor(interval.lower)} x2={xFor(interval.upper)} y1={y} y2={y} stroke={interval.captures ? "#22c55e" : "#fb7185"} strokeWidth="3" />
              <circle cx={xFor((interval.lower + interval.upper) / 2)} cy={y} r="3" fill={interval.captures ? "#86efac" : "#fecdd3"} />
            </g>
          );
        })}
        <text x={padding} y={22} fill="#cbd5e1" fontSize="12">green intervals capture true mean; rose intervals miss</text>
      </svg>
    </div>
  );
}

function MonteCarloScatter({ points }: { points: Array<{ x: number; y: number; inside: boolean }> }) {
  const size = 260;
  const padding = 18;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-64 w-full rounded-lg bg-slate-950">
      <path d={`M ${padding} ${size - padding} A ${size - padding * 2} ${size - padding * 2} 0 0 1 ${size - padding} ${padding}`} fill="none" stroke="#facc15" strokeWidth="3" />
      <rect x={padding} y={padding} width={size - padding * 2} height={size - padding * 2} fill="none" stroke="#475569" />
      {points.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`}
          cx={padding + point.x * (size - padding * 2)}
          cy={size - padding - point.y * (size - padding * 2)}
          r="2"
          fill={point.inside ? "#38bdf8" : "#fb7185"}
          opacity="0.75"
        />
      ))}
    </svg>
  );
}

function ProbabilityMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4 rounded-lg bg-slate-100 p-4 dark:bg-white/10">
      <div className="flex items-center justify-between gap-3 text-sm font-black">
        <span>{label}</span>
        <span className="font-mono">{format(value)}</span>
      </div>
      <div className="mt-3 h-5 overflow-hidden rounded-full bg-white dark:bg-slate-950">
        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Bayes: posterior = sensitivity x prior / evidence.</p>
    </div>
  );
}

function MarkovChart({ simulation }: { simulation: ReturnType<typeof simulateMarkovChain> }) {
  const width = 720;
  const height = 260;
  const padding = 32;
  const maxStep = Math.max(1, simulation.steps.at(-1)?.step ?? 1);
  const colors = ["#38bdf8", "#fb7185", "#22c55e"];
  const paths = simulation.states.map((_, stateIndex) => simulation.steps.map((step, index) => {
    const x = padding + (step.step / maxStep) * (width - padding * 2);
    const y = padding + (1 - step.probabilities[stateIndex]) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" "));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-h-64 w-full min-w-[520px] rounded-lg bg-slate-950 text-xs">
        {[0.25, 0.5, 0.75].map((value) => {
          const y = padding + (1 - value) * (height - padding * 2);
          return <line key={value} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#334155" strokeDasharray="4 8" />;
        })}
        {paths.map((path, index) => <path key={simulation.states[index]} d={path} fill="none" stroke={colors[index % colors.length]} strokeWidth="3" />)}
        {simulation.states.map((stateName, index) => <text key={stateName} x={padding + index * 120} y={24} fill={colors[index % colors.length]}>{stateName}</text>)}
      </svg>
    </div>
  );
}

function diceButtonClass(active: boolean) {
  return `rounded-lg border px-4 py-3 text-sm font-black transition ${active ? "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-100" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`;
}

function format(value: number) {
  return Number.isFinite(value) ? value.toFixed(3) : "0.000";
}
