import { RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import {
  binomialDistribution,
  clampInteger,
  drawCards,
  simulateCoins,
  simulateDice,
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
  const [runKey, setRunKey] = useState(0);

  const coins = useMemo(() => {
    void runKey;
    return simulateCoins(coinTrials);
  }, [coinTrials, runKey]);
  const dice = useMemo(() => {
    void runKey;
    return simulateDice(diceTrials, diceCount);
  }, [diceTrials, diceCount, runKey]);
  const cards = useMemo(() => {
    void runKey;
    return drawCards(cardCount);
  }, [cardCount, runKey]);
  const binomial = useMemo(() => binomialDistribution(binomialN, binomialP), [binomialN, binomialP]);
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

      <SectionCard title="Classroom Prompts">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Run 100 coin tosses, then 5000. Which result is closer to 0.5?",
            "Roll two dice and identify why 7 appears more often than 2 or 12.",
            "Change binomial p and explain how the peak moves across the chart.",
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

function diceButtonClass(active: boolean) {
  return `rounded-lg border px-4 py-3 text-sm font-black transition ${active ? "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-100" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`;
}

function format(value: number) {
  return Number.isFinite(value) ? value.toFixed(3) : "0.000";
}
