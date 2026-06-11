import { useMemo, useState } from "react";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import ResponsiveBarChart from "../components/charts/ResponsiveBarChart";
import ResponsiveLineChart from "../components/charts/ResponsiveLineChart";

export default function ProbabilityStatistics() {
  const [mean, setMean] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [x, setX] = useState(1);
  const [rawData, setRawData] = useState("4, 5, 6, 6, 7, 7, 7, 8, 9, 10, 10, 11");
  const safeSigma = Math.max(0.1, sigma);
  const z = (x - mean) / safeSigma;
  const normalData = useMemo(() => Array.from({ length: 121 }, (_, index) => {
    const value = mean - 4 * safeSigma + (index / 120) * 8 * safeSigma;
    return { x: Number(value.toFixed(2)), y: normalPdf(value, mean, safeSigma) };
  }), [mean, safeSigma]);
  const samples = useMemo(() => rawData.split(/[,\s]+/).map(Number).filter(Number.isFinite), [rawData]);
  const histogram = useMemo(() => buildHistogram(samples), [samples]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Probability & Statistics Module" subtitle="Explore normal distributions, z-scores, probability lookup, and manual-data histograms." difficulty="Statistics Tool" estimatedMinutes={10} />
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Normal Controls">
          <div className="space-y-4">
            <SliderGroup title="Distribution parameters">
              <SliderControl density="compact" label="Mean mu" value={mean} min={-10} max={10} step={0.1} onChange={setMean} />
              <SliderControl density="compact" label="Standard deviation sigma" value={safeSigma} min={0.1} max={6} step={0.1} onChange={setSigma} />
              <SliderControl density="compact" label="Observed x" value={x} min={-15} max={15} step={0.1} onChange={setX} />
            </SliderGroup>
            <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-semibold text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
              z = (x - mu) / sigma = {round(z)}<br />
              {"P(Z <= z) ~= "} {round(normalCdf(z))}
            </div>
          </div>
        </SectionCard>
        <GraphCard title="Normal Distribution Curve">
          <ResponsiveLineChart data={normalData} lineColor="#8b5cf6" />
        </GraphCard>
      </div>
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Manual Data Input" description="Enter numbers separated by commas or spaces.">
          <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950/60" value={rawData} onChange={(event) => setRawData(event.target.value)} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="n" value={samples.length} />
            <Stat label="mean" value={round(avg(samples))} />
            <Stat label="min" value={round(Math.min(...samples))} />
            <Stat label="max" value={round(Math.max(...samples))} />
          </div>
        </SectionCard>
        <GraphCard title="Histogram Builder">
          <ResponsiveBarChart data={histogram} color="#14b8a6" />
        </GraphCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><span className="text-xs uppercase text-slate-500">{label}</span><p className="font-mono font-black">{String(value)}</p></div>;
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCdf(z: number) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * a);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function buildHistogram(values: number[]) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(values.length))));
  const width = (max - min || 1) / bins;
  return Array.from({ length: bins }, (_, index) => {
    const start = min + index * width;
    const end = index === bins - 1 ? max : start + width;
    const count = values.filter((value) => value >= start && (index === bins - 1 ? value <= end : value < end)).length;
    return { name: `${round(start)}-${round(end)}`, value: count };
  });
}

function avg(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function round(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "0";
}
