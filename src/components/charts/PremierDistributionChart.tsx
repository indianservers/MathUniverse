import * as d3 from "d3";
import { useId, useMemo } from "react";

export type PremierDistributionPoint = {
  x: number;
  y: number;
  label: string;
};

type PremierDistributionChartProps = {
  points: PremierDistributionPoint[];
  kind: "discrete" | "continuous" | "multivariate" | string;
  title?: string;
};

const chartWidth = 920;
const chartHeight = 420;
const margin = { top: 44, right: 34, bottom: 58, left: 64 };

export default function PremierDistributionChart({ points, kind, title }: PremierDistributionChartProps) {
  const rawId = useId().replace(/:/g, "");
  const isDiscrete = kind === "discrete";
  const chart = useMemo(() => buildChart(points, isDiscrete), [points, isDiscrete]);
  const gradientId = `distribution-gradient-${rawId}`;
  const areaGradientId = `distribution-area-${rawId}`;
  const glowId = `distribution-glow-${rawId}`;
  const activeLabel = isDiscrete ? "PMF: probability at exact outcomes" : "PDF: probability comes from area";

  if (!points.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-slate-300">
        Add parameters to draw the distribution.
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={title ?? `${kind} distribution chart`} className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="54%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id={areaGradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.34" />
          <stop offset="62%" stopColor="#22d3ee" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={chartWidth} height={chartHeight} rx="26" fill="#f8fafc" />
      <g>
        {chart.yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={margin.left} x2={chartWidth - margin.right} y1={chart.yScale(tick)} y2={chart.yScale(tick)} stroke="#dbeafe" strokeWidth="1" />
            <text x={margin.left - 14} y={chart.yScale(tick) + 4} textAnchor="end" className="fill-slate-500 text-[12px] font-bold">
              {chart.formatY(tick)}
            </text>
          </g>
        ))}
        {chart.xTicks.map((tick) => (
          <g key={`x-${tick.x}-${tick.label}`}>
            <line x1={chart.xScale(tick.x)} x2={chart.xScale(tick.x)} y1={margin.top} y2={chart.baseline} stroke="#e0f2fe" strokeWidth="1" />
            <text x={chart.xScale(tick.x)} y={chartHeight - 22} textAnchor="middle" className="fill-slate-500 text-[12px] font-black">
              {tick.label}
            </text>
          </g>
        ))}
      </g>

      <line x1={margin.left} x2={chartWidth - margin.right} y1={chart.baseline} y2={chart.baseline} stroke="#64748b" strokeWidth="1.3" />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={chart.baseline} stroke="#64748b" strokeWidth="1.3" />

      <text x={margin.left} y="26" className="fill-slate-700 text-[13px] font-black">
        probability {isDiscrete ? "mass" : "density"}
      </text>
      <text x={chartWidth - margin.right} y="26" textAnchor="end" className="fill-cyan-700 text-[14px] font-black">
        {activeLabel}
      </text>

      {isDiscrete ? (
        <g>
          {chart.discreteBars.map((bar) => (
            <g key={`${bar.label}-${bar.x}`}>
              <line x1={bar.cx} x2={bar.cx} y1={chart.baseline} y2={bar.y} stroke="#164e63" strokeWidth="2" opacity="0.42" />
              <rect x={bar.x0} y={bar.y} width={bar.width} height={chart.baseline - bar.y} rx="6" fill={`url(#${gradientId})`} filter={`url(#${glowId})`}>
                <title>{`${bar.label}: ${chart.formatY(bar.value)}`}</title>
              </rect>
              <rect x={bar.x0 + 2} y={bar.y + 2} width={Math.max(1, bar.width * 0.24)} height={Math.max(0, chart.baseline - bar.y - 4)} rx="4" fill="#cffafe" opacity="0.34" />
              <circle cx={bar.cx} cy={bar.y} r="5.5" fill="#f97316" stroke="#fff7ed" strokeWidth="2.5" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <path d={chart.areaPath} fill={`url(#${areaGradientId})`} />
          <path d={chart.linePath} fill="none" stroke="#7c3aed" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`} />
          <path d={chart.linePath} fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </g>
      )}

      {chart.peak && (
        <g>
          <line x1={chart.peak.x} x2={chart.peak.x} y1={chart.peak.y} y2={chart.baseline} stroke="#fb923c" strokeDasharray="6 6" strokeWidth="2" opacity="0.75" />
          <circle cx={chart.peak.x} cy={chart.peak.y} r="6.5" fill="#fb923c" stroke="#fff7ed" strokeWidth="2.5" />
          <text x={Math.min(chartWidth - 140, chart.peak.x + 14)} y={Math.max(54, chart.peak.y - 12)} className="fill-orange-700 text-[12px] font-black">
            peak {chart.peak.label}
          </text>
        </g>
      )}
    </svg>
  );
}

function buildChart(points: PremierDistributionPoint[], isDiscrete: boolean) {
  const maxY = Math.max(d3.max(points, (point) => point.y) ?? 0, 0.01);
  const [rawMinX = 0, rawMaxX = 1] = d3.extent(points, (point) => point.x);
  const xPadding = isDiscrete ? Math.max(0.5, (rawMaxX - rawMinX) * 0.035) : Math.max(0.01, (rawMaxX - rawMinX) * 0.02);
  const xScale = d3.scaleLinear()
    .domain([rawMinX - xPadding, rawMaxX + xPadding])
    .range([margin.left, chartWidth - margin.right]);
  const yScale = d3.scaleLinear()
    .domain([0, maxY * 1.12])
    .nice(5)
    .range([chartHeight - margin.bottom, margin.top]);
  const baseline = yScale(0);
  const ordered = [...points].sort((a, b) => a.x - b.x);
  const line = d3.line<PremierDistributionPoint>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
    .curve(d3.curveMonotoneX);
  const area = d3.area<PremierDistributionPoint>()
    .x((point) => xScale(point.x))
    .y0(baseline)
    .y1((point) => yScale(point.y))
    .curve(d3.curveMonotoneX);
  const labelStride = Math.max(1, Math.ceil(points.length / 9));
  const xTicks = ordered
    .filter((_, index) => index % labelStride === 0 || index === ordered.length - 1)
    .map((point) => ({ x: point.x, label: point.label }));
  const yTicks = yScale.ticks(5).filter((tick) => tick >= 0);
  const minStep = d3.min(ordered.slice(1).map((point, index) => Math.abs(point.x - ordered[index].x))) ?? 1;
  const barWidth = Math.max(5, Math.min(24, Math.abs(xScale(rawMinX + minStep) - xScale(rawMinX)) * 0.32));
  const discreteBars = ordered.map((point) => {
    const cx = xScale(point.x);
    const y = yScale(point.y);
    return { ...point, value: point.y, cx, y, x0: cx - barWidth / 2, width: barWidth };
  });
  const peakPoint = d3.max(ordered, (point) => point.y) === undefined ? undefined : ordered.reduce((best, point) => point.y > best.y ? point : best, ordered[0]);
  const peak = peakPoint ? { x: xScale(peakPoint.x), y: yScale(peakPoint.y), label: peakPoint.label } : undefined;
  const formatY = d3.format(maxY < 0.01 ? ".2e" : maxY < 1 ? ".3f" : ".2f");

  return {
    areaPath: area(ordered) ?? "",
    baseline,
    discreteBars,
    formatY,
    linePath: line(ordered) ?? "",
    peak,
    xScale,
    xTicks,
    yScale,
    yTicks,
  };
}
