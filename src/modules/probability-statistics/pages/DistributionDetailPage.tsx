import { ArrowLeft, BarChart3, BookOpen, FunctionSquare, Sigma } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import GraphCard from "../../../components/ui/GraphCard";
import PremierDistributionChart from "../../../components/charts/PremierDistributionChart";
import SectionCard from "../../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import TopicHeader from "../../../components/ui/TopicHeader";
import { getDistribution, type DistributionParameter, type DistributionSpec } from "../data/distributionAtlas";
import { getDistributionLearningContent } from "../data/learningContent";
import LearningExpansion from "./LearningExpansion";

export default function DistributionDetailPage() {
  const { distributionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const spec = getDistribution(distributionId);
  const [params, setParams] = useState(() => readInitialParams(spec, searchParams));
  useEffect(() => {
    setParams(readInitialParams(spec, searchParams));
  }, [searchParams, spec]);
  const result = useMemo(() => spec.calculate(params), [params, spec]);
  const learningContent = useMemo(() => getDistributionLearningContent(spec), [spec]);

  const setParam = (parameter: DistributionParameter, value: number) => {
    setParams((current) => ({ ...current, [parameter.id]: value }));
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(parameterQueryKey(parameter), String(value));
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <div className="space-y-6">
      <TopicHeader
        title={spec.name}
        subtitle={`${spec.kind} distribution - ${spec.shortUse}`}
        difficulty="Distribution tool"
        estimatedMinutes={12}
        formula={{ title: spec.name, formula: spec.formula, explanation: result.focus }}
      />

      <div className="flex flex-wrap gap-2">
        <Link className="mini-chip" to="/probability-statistics/distributions">
          <ArrowLeft className="h-3.5 w-3.5" /> Atlas
        </Link>
        <Link className="mini-chip" to="/probability-statistics/module">
          <Sigma className="h-3.5 w-3.5" /> Module
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Parameters" description="Move a parameter and watch the probability shape, center, and spread change.">
          <SliderGroup>
            {spec.parameters.map((parameter) => (
              <SliderControl
                key={parameter.id}
                density="compact"
                label={parameter.label}
                value={params[parameter.id] ?? parameter.defaultValue}
                min={parameter.min}
                max={parameter.max}
                step={parameter.step}
                description={parameter.description}
                onChange={(value) => setParam(parameter, value)}
              />
            ))}
          </SliderGroup>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
            <Stat label="Support" value={result.summary.support} />
            <Stat label="Mean" value={result.summary.mean} />
            <Stat label="Variance" value={result.summary.variance} />
          </div>
        </SectionCard>

        <GraphCard title={`${spec.name} ${spec.kind === "discrete" ? "PMF" : "PDF"}`} description={result.focus}>
          <PremierDistributionChart points={result.points} kind={spec.kind} title={spec.name} />
        </GraphCard>
      </section>

      {spec.kind === "discrete" && (
        <SectionCard title="Probability Mass Table" description="Discrete distributions place probability only on separate outcomes. The gaps between bars are part of the model.">
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 text-sm sm:grid-cols-3 lg:grid-cols-6">
            {result.points.map((point) => (
              <div key={`${point.label}-${point.x}`} className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-400/10">
                <p className="font-mono text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">k = {point.label}</p>
                <p className="mt-1 font-mono font-black text-slate-950 dark:text-white">{format(point.y)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]">
        <SectionCard title="Formula and Interpretation" description="Read this with the graph: probability uses area for continuous models and bar height/mass for discrete models.">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoTile icon={<Sigma className="h-4 w-4" />} label="Formula" text={spec.formula} />
            <InfoTile icon={spec.kind === "discrete" ? <BarChart3 className="h-4 w-4" /> : <FunctionSquare className="h-4 w-4" />} label="Kind" text={spec.kind} />
          </div>
          <p className="mt-4 rounded-xl bg-cyan-50 p-3 text-sm font-semibold leading-6 text-cyan-950 dark:bg-cyan-400/10 dark:text-cyan-100">
            {result.focus}
          </p>
        </SectionCard>

        <SectionCard title="Use Cases" description="Typical situations where this model is a reasonable first choice.">
          <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {spec.examples.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">{item}</li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <SectionCard title="Theory" description="Core ideas to remember before using this distribution in a lesson or problem.">
        <div className="grid gap-3 md:grid-cols-3">
          {spec.theory.map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
              <BookOpen className="mb-2 h-4 w-4 text-cyan-500" />
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <LearningExpansion content={learningContent} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function InfoTile({ icon, label, text }: { icon: JSX.Element; label: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">{icon}{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-black text-slate-900 dark:text-white">{text}</p>
    </div>
  );
}

function readInitialParams(spec: DistributionSpec, searchParams: URLSearchParams) {
  return Object.fromEntries(spec.parameters.map((parameter) => [parameter.id, readParameterValue(parameter, searchParams)]));
}

function readParameterValue(parameter: DistributionParameter, searchParams: URLSearchParams) {
  const raw = searchParams.get(`v_${parameter.id}`) ?? searchParams.get(parameterQueryKey(parameter));
  const parsed = raw === null ? parameter.defaultValue : Number(raw);
  const value = Number.isFinite(parsed) ? parsed : parameter.defaultValue;
  const clamped = Math.min(parameter.max, Math.max(parameter.min, value));
  return parameter.step >= 1 ? Math.round(clamped) : Number(clamped.toFixed(4));
}

function parameterQueryKey(parameter: DistributionParameter) {
  return `v_${parameter.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

function format(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "0";
}
