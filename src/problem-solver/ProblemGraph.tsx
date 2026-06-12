import { useMemo, useState } from "react";
import type { ProblemVisualData, GraphPoint } from "./graphingUtils";

type ProblemGraphProps = {
  showTable?: boolean;
  visual: ProblemVisualData | null;
};

const width = 760;
const height = 420;
const padding = 42;

export function ProblemGraph({ showTable = true, visual }: ProblemGraphProps) {
  const [open, setOpen] = useState(true);
  if (!visual) return null;
  const sx = (x: number) => padding + ((x - visual.viewport.xMin) / (visual.viewport.xMax - visual.viewport.xMin)) * (width - padding * 2);
  const sy = (y: number) => height - padding - ((y - visual.viewport.yMin) / (visual.viewport.yMax - visual.viewport.yMin)) * (height - padding * 2);
  const xAxis = visual.viewport.yMin <= 0 && visual.viewport.yMax >= 0 ? sy(0) : height - padding;
  const yAxis = visual.viewport.xMin <= 0 && visual.viewport.xMax >= 0 ? sx(0) : padding;
  const grid = useMemo(() => Array.from({ length: 11 }, (_, index) => index - 5), []);

  return (
    <section className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm dark:border-cyan-300/20 dark:bg-white/5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <span>
          <span className="block text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Visual Verification</span>
          <span className="mt-1 block font-black text-slate-950 dark:text-white">{visual.title}</span>
        </span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className={`mt-4 grid gap-4 ${showTable ? "xl:grid-cols-[minmax(0,1fr)_280px]" : ""}`}>
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{visual.description}</p>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={visual.title} className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
              <title>{visual.title}</title>
              {grid.map((item) => {
                const x = sx(item * 2);
                const y = sy(item * 2);
                return (
                  <g key={item}>
                    <line x1={x} x2={x} y1={padding} y2={height - padding} stroke="#dbe5ef" strokeWidth="1" />
                    <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#dbe5ef" strokeWidth="1" />
                  </g>
                );
              })}
              <line x1={padding} x2={width - padding} y1={xAxis} y2={xAxis} stroke="#334155" strokeWidth="2" />
              <line x1={yAxis} x2={yAxis} y1={padding} y2={height - padding} stroke="#334155" strokeWidth="2" />
              <text x={width - padding + 8} y={xAxis - 8} fontSize="13" fontWeight="800" fill="#ef4444">x</text>
              <text x={yAxis + 8} y={padding - 12} fontSize="13" fontWeight="800" fill="#22c55e">y</text>
              {visual.areas?.map((area) => <path key={`${area.expression}-${area.from}-${area.to}`} d={areaPath(area.points, sx, sy, xAxis)} fill={area.color ?? "#38bdf8"} opacity="0.28" />)}
              {visual.curves.map((curve) => <path key={curve.label} d={linePath(curve.points, sx, sy)} fill="none" stroke={curve.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />)}
              {visual.markers.map((marker) => (
                <g key={marker.label}>
                  <circle cx={sx(marker.x)} cy={sy(marker.y)} r="6" fill={marker.color ?? "#dc2626"} stroke="#fff" strokeWidth="2" />
                  <text x={sx(marker.x) + 8} y={sy(marker.y) - 8} fontSize="12" fontWeight="800" fill={marker.color ?? "#dc2626"}>{marker.label}</text>
                </g>
              ))}
            </svg>
            <div className="mt-3 flex flex-wrap gap-2">
              {visual.curves.map((curve) => <span key={curve.label} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-white/10"><span style={{ color: curve.color }}>●</span> {curve.label}</span>)}
              {visual.markers.map((marker) => <span key={marker.label} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-white/10"><span style={{ color: marker.color ?? "#dc2626" }}>●</span> {marker.label}</span>)}
            </div>
            {visual.warnings.length ? <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{visual.warnings.join(" ")}</div> : null}
          </div>
          {showTable && <ValueTablePanel visual={visual} />}
        </div>
      )}
    </section>
  );
}

export function ValueTablePanel({ visual }: { visual: ProblemVisualData }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Table of Values</p>
      <table className="mt-2 w-full text-left text-sm">
        <thead><tr className="border-b border-slate-300 dark:border-white/10"><th className="py-1">x</th><th className="py-1">y</th></tr></thead>
        <tbody>
          {visual.table.map((row) => <tr key={row.x} className="border-b border-slate-200 last:border-0 dark:border-white/10"><td className="py-1 font-mono">{row.x}</td><td className="py-1 font-mono">{row.y === null ? "undefined" : row.y}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function linePath(points: GraphPoint[], sx: (x: number) => number, sy: (y: number) => number) {
  let path = "";
  let drawing = false;
  for (const point of points) {
    if (point.y === null || !Number.isFinite(point.y)) {
      drawing = false;
      continue;
    }
    path += `${drawing ? "L" : "M"} ${sx(point.x)} ${sy(point.y)} `;
    drawing = true;
  }
  return path.trim();
}

function areaPath(points: GraphPoint[], sx: (x: number) => number, sy: (y: number) => number, xAxis: number) {
  const valid = points.filter((point): point is { x: number; y: number } => point.y !== null && Number.isFinite(point.y));
  if (!valid.length) return "";
  const top = valid.map((point, index) => `${index === 0 ? "M" : "L"} ${sx(point.x)} ${sy(point.y)}`).join(" ");
  const last = valid[valid.length - 1];
  const first = valid[0];
  return `${top} L ${sx(last.x)} ${xAxis} L ${sx(first.x)} ${xAxis} Z`;
}
