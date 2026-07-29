import { ArrowLeft, BookOpen, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import TopicHeader from "../../../components/ui/TopicHeader";
import { statisticsLearningContent } from "../data/learningContent";
import LearningExpansion from "./LearningExpansion";

export type ProbabilityStatisticsPhaseThreePageId = "bayesian" | "stochastic" | "advanced-models";

const configs = {
  bayesian: {
    title: "Bayesian Reasoning Studio",
    subtitle: "Turn priors, likelihood, and evidence into posterior belief with conjugate-model intuition.",
    formula: "posterior proportional to likelihood x prior",
  },
  stochastic: {
    title: "Stochastic Processes Studio",
    subtitle: "Explore Markov chains, random walks, Poisson arrivals, queues, reliability, and steady-state behavior.",
    formula: "pi_next = pi P,  R(t)=exp(-lambda t),  rho=lambda/mu",
  },
  "advanced-models": {
    title: "Advanced Statistical Models Studio",
    subtitle: "See multivariate normal geometry, covariance, entropy, KL divergence, and mixture-model intuition.",
    formula: "f(x)=exp[-0.5(x-mu)' Sigma^-1 (x-mu)] / sqrt((2pi)^k |Sigma|)",
  },
} satisfies Record<ProbabilityStatisticsPhaseThreePageId, { title: string; subtitle: string; formula: string }>;

export default function ProbabilityStatisticsPhaseThreePage({ page }: { page: ProbabilityStatisticsPhaseThreePageId }) {
  const config = configs[page];
  return (
    <div className="space-y-6">
      <TopicHeader
        title={config.title}
        subtitle={config.subtitle}
        difficulty="Phase 3"
        estimatedMinutes={18}
        formula={{ title: "Core formula", formula: config.formula, explanation: "The sliders update the model geometry and the interpretation panels below." }}
      />
      <div className="flex flex-wrap gap-2">
        <Link className="mini-chip" to="/probability-statistics/module"><ArrowLeft className="h-3.5 w-3.5" /> Module</Link>
        <Link className="mini-chip" to="/probability-statistics/distributions/beta"><Sigma className="h-3.5 w-3.5" /> Beta model</Link>
      </div>
      {page === "bayesian" && <BayesianStudio />}
      {page === "stochastic" && <StochasticStudio />}
      {page === "advanced-models" && <AdvancedModelsStudio />}
    </div>
  );
}

function BayesianStudio() {
  const [prior, setPrior] = useState(0.08);
  const [sensitivity, setSensitivity] = useState(0.92);
  const [falsePositive, setFalsePositive] = useState(0.12);
  const [trials, setTrials] = useState(12);
  const model = useMemo(() => {
    const evidence = sensitivity * prior + falsePositive * (1 - prior);
    const posterior = evidence > 0 ? (sensitivity * prior) / evidence : 0;
    const alpha = 1 + posterior * trials;
    const beta = 1 + (1 - posterior) * trials;
    return { evidence, posterior, alpha, beta, betaCurve: curve(0.01, 0.99, 90, (x) => betaPdf(x, alpha, beta)) };
  }, [falsePositive, prior, sensitivity, trials]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Bayes Controls" description="Adjust base rate and test reliability to watch posterior belief change.">
          <SliderGroup>
            <SliderControl density="compact" label="Prior probability" value={prior} min={0.01} max={0.95} step={0.01} onChange={setPrior} />
            <SliderControl density="compact" label="Sensitivity" value={sensitivity} min={0.05} max={0.99} step={0.01} onChange={setSensitivity} />
            <SliderControl density="compact" label="False positive rate" value={falsePositive} min={0.01} max={0.8} step={0.01} onChange={setFalsePositive} />
            <SliderControl density="compact" label="Evidence strength" value={trials} min={2} max={60} step={1} onChange={setTrials} />
          </SliderGroup>
          <MetricGrid items={[
            ["Evidence P(E)", fmt(model.evidence)],
            ["Posterior P(H|E)", fmt(model.posterior)],
            ["Beta alpha", fmt(model.alpha)],
            ["Beta beta", fmt(model.beta)],
          ]} />
        </SectionCard>
        <VisualFrame title="Prior x Likelihood -> Posterior">
          <BayesianSvg prior={prior} sensitivity={sensitivity} falsePositive={falsePositive} posterior={model.posterior} betaCurve={model.betaCurve} />
        </VisualFrame>
      </section>
      <TheoryBlock cards={[
        ["Prior", "A prior encodes belief before the new evidence. In base-rate problems, it often dominates the first intuition."],
        ["Likelihood", "The likelihood asks how compatible the evidence is with each hypothesis. Strong evidence separates likelihoods."],
        ["Posterior", "The posterior is normalized evidence-weighted belief. Conjugate priors make this update algebraically smooth."],
      ]} />
      <LearningExpansion content={statisticsLearningContent.bayesian} />
    </>
  );
}

function StochasticStudio() {
  const [stayA, setStayA] = useState(0.72);
  const [stayB, setStayB] = useState(0.58);
  const [lambda, setLambda] = useState(3);
  const [mu, setMu] = useState(5);
  const model = useMemo(() => {
    let a = 1;
    let b = 0;
    const chain = Array.from({ length: 18 }, (_, step) => {
      const nextA = a * stayA + b * (1 - stayB);
      const nextB = a * (1 - stayA) + b * stayB;
      const current = { step, a, b };
      a = nextA;
      b = nextB;
      return current;
    });
    const rho = Math.min(0.99, lambda / Math.max(mu, 0.1));
    const queue = Array.from({ length: 12 }, (_, k) => ({ x: k, y: (1 - rho) * rho ** k }));
    const reliability = curve(0, 8, 70, (t) => Math.exp(-lambda * t / 10));
    return { chain, queue, reliability, rho, stable: lambda < mu };
  }, [lambda, mu, stayA, stayB]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Process Controls" description="Compare transition stability, arrival pressure, queue length, and reliability decay.">
          <SliderGroup>
            <SliderControl density="compact" label="Stay in state A" value={stayA} min={0.05} max={0.95} step={0.01} onChange={setStayA} />
            <SliderControl density="compact" label="Stay in state B" value={stayB} min={0.05} max={0.95} step={0.01} onChange={setStayB} />
            <SliderControl density="compact" label="Arrival rate lambda" value={lambda} min={0.2} max={9} step={0.1} onChange={setLambda} />
            <SliderControl density="compact" label="Service rate mu" value={mu} min={0.5} max={10} step={0.1} onChange={setMu} />
          </SliderGroup>
          <MetricGrid items={[
            ["Traffic rho", fmt(model.rho)],
            ["Queue state", model.stable ? "stable" : "overloaded"],
            ["Final P(A)", fmt(model.chain[model.chain.length - 1].a)],
            ["R(8)", fmt(model.reliability[model.reliability.length - 1].y)],
          ]} />
        </SectionCard>
        <VisualFrame title="Markov Chain, Queue, and Reliability">
          <StochasticSvg chain={model.chain} queue={model.queue} reliability={model.reliability} rho={model.rho} stable={model.stable} />
        </VisualFrame>
      </section>
      <TheoryBlock cards={[
        ["Markov chain", "The next state depends on the present state through a transition matrix. Repeated multiplication reveals long-run behavior."],
        ["Queueing", "When lambda approaches or exceeds mu, traffic intensity rises and expected waiting grows quickly."],
        ["Reliability", "For constant failure rate, reliability decays exponentially. Weibull models let the hazard change over time."],
      ]} />
      <LearningExpansion content={statisticsLearningContent.stochastic} />
    </>
  );
}

function AdvancedModelsStudio() {
  const [correlation, setCorrelation] = useState(0.55);
  const [mix, setMix] = useState(0.35);
  const [entropyP, setEntropyP] = useState(0.42);
  const [separation, setSeparation] = useState(2.2);
  const model = useMemo(() => {
    const entropy = -entropyP * Math.log2(entropyP) - (1 - entropyP) * Math.log2(1 - entropyP);
    const q = Math.min(0.98, Math.max(0.02, entropyP + mix * 0.35));
    const kl = entropyP * Math.log2(entropyP / q) + (1 - entropyP) * Math.log2((1 - entropyP) / (1 - q));
    const mixture = curve(-6, 6, 120, (x) => mix * normalPdf(x, -separation, 1) + (1 - mix) * normalPdf(x, separation, 1.35));
    return { entropy, kl, mixture };
  }, [entropyP, mix, separation]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Advanced Model Controls" description="Shape covariance, mixture weight, separation, entropy, and divergence.">
          <SliderGroup>
            <SliderControl density="compact" label="Correlation rho" value={correlation} min={-0.95} max={0.95} step={0.01} onChange={setCorrelation} />
            <SliderControl density="compact" label="Mixture weight" value={mix} min={0.05} max={0.95} step={0.01} onChange={setMix} />
            <SliderControl density="compact" label="Binary probability p" value={entropyP} min={0.02} max={0.98} step={0.01} onChange={setEntropyP} />
            <SliderControl density="compact" label="Cluster separation" value={separation} min={0} max={5} step={0.1} onChange={setSeparation} />
          </SliderGroup>
          <MetricGrid items={[
            ["Entropy H(p)", fmt(model.entropy)],
            ["KL divergence", fmt(model.kl)],
            ["Correlation", fmt(correlation)],
            ["Mixture modes", separation > 1.3 ? "separated" : "overlapping"],
          ]} />
        </SectionCard>
        <VisualFrame title="Covariance Ellipse, Entropy, and Mixture Density">
          <AdvancedSvg correlation={correlation} mix={mix} entropyP={entropyP} mixture={model.mixture} />
        </VisualFrame>
      </section>
      <TheoryBlock cards={[
        ["Multivariate normal", "Covariance controls the ellipse: variances set width and height, correlation tilts the cloud."],
        ["Information theory", "Entropy measures uncertainty. KL divergence measures how much one probability model differs from another."],
        ["Mixture models", "A mixture combines simpler distributions. It can represent clusters, subpopulations, and hidden regimes."],
      ]} />
      <LearningExpansion content={statisticsLearningContent["advanced-models"]} />
    </>
  );
}

function VisualFrame({ title, children }: { title: string; children: JSX.Element }) {
  return (
    <SectionCard title={title} description="A dense visual model with live parameters and fullscreen support." allowFullscreen>
      <div className="min-h-[380px] overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 shadow-inner dark:border-white/10">
        {children}
      </div>
    </SectionCard>
  );
}

function BayesianSvg({ prior, sensitivity, falsePositive, posterior, betaCurve }: { prior: number; sensitivity: number; falsePositive: number; posterior: number; betaCurve: Point[] }) {
  const w = 900;
  const h = 400;
  const x = scale(0, 1, 530, 835);
  const y = scale(0, Math.max(...betaCurve.map((p) => p.y), 1), 330, 62);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" role="img" aria-label="Bayesian update visual">
      <VisualBg />
      <text x="54" y="48" fill="#e0f2fe" fontSize="17" fontWeight="900">Evidence tree</text>
      <line x1="82" y1="200" x2="270" y2="110" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <line x1="82" y1="200" x2="270" y2="290" stroke="#a78bfa" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <line x1="270" y1="110" x2="430" y2="72" stroke="#facc15" strokeWidth="10" strokeLinecap="round" opacity={sensitivity} />
      <line x1="270" y1="290" x2="430" y2="252" stroke="#fb7185" strokeWidth="10" strokeLinecap="round" opacity={falsePositive} />
      <circle cx="82" cy="200" r="18" fill="#67e8f9" />
      <circle cx="270" cy="110" r={10 + prior * 26} fill="#22d3ee" />
      <circle cx="270" cy="290" r={10 + (1 - prior) * 18} fill="#a78bfa" />
      <circle cx="430" cy="72" r={12 + posterior * 26} fill="#facc15" />
      <text x="300" y="118" fill="#e0f2fe" fontSize="13" fontWeight="800">H prior {pct(prior)}</text>
      <text x="300" y="300" fill="#e0f2fe" fontSize="13" fontWeight="800">not H</text>
      <text x="454" y="78" fill="#fef3c7" fontSize="14" fontWeight="900">posterior {pct(posterior)}</text>
      <text x="530" y="48" fill="#e0f2fe" fontSize="17" fontWeight="900">Posterior beta shape</text>
      <path d={pathFor(betaCurve, x, y)} fill="none" stroke="#facc15" strokeWidth="5" />
      <line x1={x(posterior)} y1="68" x2={x(posterior)} y2="338" stroke="#22d3ee" strokeWidth="4" strokeDasharray="8 8" />
    </svg>
  );
}

function StochasticSvg({ chain, queue, reliability, rho, stable }: { chain: Array<{ step: number; a: number; b: number }>; queue: Point[]; reliability: Point[]; rho: number; stable: boolean }) {
  const xChain = scale(0, chain.length - 1, 58, 340);
  const yProb = scale(0, 1, 318, 72);
  const xQueue = scale(0, queue.length - 1, 420, 610);
  const yQueue = scale(0, Math.max(...queue.map((p) => p.y), 0.1), 318, 92);
  const xRel = scale(0, 8, 660, 840);
  return (
    <svg viewBox="0 0 900 400" className="h-full w-full" role="img" aria-label="Stochastic process visual">
      <VisualBg />
      <text x="58" y="48" fill="#e0f2fe" fontSize="16" fontWeight="900">Markov probabilities</text>
      <path d={pathFor(chain.map((p) => ({ x: p.step, y: p.a })), xChain, yProb)} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <path d={pathFor(chain.map((p) => ({ x: p.step, y: p.b })), xChain, yProb)} fill="none" stroke="#a78bfa" strokeWidth="5" />
      <text x="424" y="48" fill="#e0f2fe" fontSize="16" fontWeight="900">Queue length</text>
      {queue.map((p) => <rect key={p.x} x={xQueue(p.x) - 6} y={yQueue(p.y)} width="12" height={318 - yQueue(p.y)} rx="4" fill={stable ? "#22d3ee" : "#fb7185"} />)}
      <text x="420" y="352" fill="#bae6fd" fontSize="13" fontWeight="900">rho={fmt(rho)} {stable ? "stable" : "overloaded"}</text>
      <text x="660" y="48" fill="#e0f2fe" fontSize="16" fontWeight="900">Reliability</text>
      <path d={pathFor(reliability, xRel, yProb)} fill="none" stroke="#facc15" strokeWidth="5" />
      <circle cx="164" cy="112" r="38" fill="#0e7490" opacity="0.42" />
      <circle cx="244" cy="256" r="38" fill="#6d28d9" opacity="0.42" />
      <text x="151" y="118" fill="#fff" fontSize="16" fontWeight="900">A</text>
      <text x="232" y="262" fill="#fff" fontSize="16" fontWeight="900">B</text>
    </svg>
  );
}

function AdvancedSvg({ correlation, mix, entropyP, mixture }: { correlation: number; mix: number; entropyP: number; mixture: Point[] }) {
  const xMix = scale(-6, 6, 500, 835);
  const yMix = scale(0, Math.max(...mixture.map((p) => p.y), 0.1), 330, 74);
  const angle = correlation * 42;
  const width = 180;
  const height = 80 + (1 - Math.abs(correlation)) * 70;
  return (
    <svg viewBox="0 0 900 400" className="h-full w-full" role="img" aria-label="Advanced statistical models visual">
      <VisualBg />
      <text x="58" y="48" fill="#e0f2fe" fontSize="16" fontWeight="900">Covariance ellipse</text>
      <g transform={`translate(230 190) rotate(${angle})`}>
        <ellipse cx="0" cy="0" rx={width / 2} ry={height / 2} fill="#22d3ee" opacity="0.22" stroke="#67e8f9" strokeWidth="5" />
        {Array.from({ length: 24 }, (_, i) => {
          const t = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(t) * width * 0.34} cy={Math.sin(t) * height * 0.34} r="4" fill="#facc15" opacity="0.8" />;
        })}
      </g>
      <text x="74" y="352" fill="#bae6fd" fontSize="13" fontWeight="900">rho={fmt(correlation)}</text>
      <text x="500" y="48" fill="#e0f2fe" fontSize="16" fontWeight="900">Mixture density</text>
      <path d={`${pathFor(mixture, xMix, yMix)} L ${xMix(6)} 330 L ${xMix(-6)} 330 Z`} fill="#a78bfa" opacity="0.18" />
      <path d={pathFor(mixture, xMix, yMix)} fill="none" stroke="#facc15" strokeWidth="5" />
      <rect x="500" y="348" width={260 * mix} height="14" rx="7" fill="#22d3ee" />
      <rect x={500 + 260 * mix} y="348" width={260 * (1 - mix)} height="14" rx="7" fill="#a78bfa" />
      <text x="500" y="382" fill="#bae6fd" fontSize="13" fontWeight="900">mixture weight {pct(mix)} | entropy input {pct(entropyP)}</text>
    </svg>
  );
}

function TheoryBlock({ cards }: { cards: Array<[string, string]> }) {
  return (
    <SectionCard title="Theory" description="The phase 3 tools connect probability models to modern statistics, ML, reliability, and stochastic systems.">
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
            <BookOpen className="mb-3 h-5 w-5 text-cyan-500" />
            <h2 className="mb-2 font-black text-slate-950 dark:text-white">{title}</h2>
            {text}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function VisualBg() {
  return (
    <>
      <rect width="900" height="400" rx="24" fill="#020617" />
      <path d="M0 318 C180 250 310 372 475 284 S720 218 900 292 L900 400 L0 400 Z" fill="#0e7490" opacity="0.18" />
      <path d="M0 78 C148 126 260 28 430 82 S650 150 900 58" fill="none" stroke="#4c1d95" strokeWidth="32" opacity="0.35" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={54 + i * 88} y1="58" x2={54 + i * 88} y2="338" stroke="#1e293b" strokeWidth="1" />)}
    </>
  );
}

type Point = { x: number; y: number };

function curve(min: number, max: number, steps: number, fn: (x: number) => number): Point[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const x = min + (index / steps) * (max - min);
    return { x, y: Math.max(0, fn(x)) };
  });
}

function pathFor(points: Point[], xScale: (value: number) => number, yScale: (value: number) => number) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.x)} ${yScale(point.y)}`).join(" ");
}

function scale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) {
  return (value: number) => rangeMin + ((value - domainMin) / (domainMax - domainMin || 1)) * (rangeMax - rangeMin);
}

function betaPdf(x: number, alpha: number, beta: number) {
  return x ** (alpha - 1) * (1 - x) ** (beta - 1) / betaFn(alpha, beta);
}

function betaFn(alpha: number, beta: number) {
  return gamma(alpha) * gamma(beta) / gamma(alpha + beta);
}

function gamma(z: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  let x = 0.9999999999998099;
  const adjusted = z - 1;
  for (let i = 0; i < coefficients.length; i += 1) x += coefficients[i] / (adjusted + i + 1);
  const t = adjusted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (adjusted + 0.5) * Math.exp(-t) * x;
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function fmt(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "0";
}

function pct(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}
