import { useState } from "react";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  divideWholeInRatio,
  getActualDistanceFromMapScale,
  getDirectProportionValue,
  getInverseProportionValue,
  getPieAnglesFromRatio,
  getPiePercentagesFromRatio,
  getRepresentativeFraction,
  round,
} from "../../../components/ncert/grade8/proportionalReasoningMath";

type RatioProofKind = "cross" | "scale" | "shares" | "direct-inverse";

export function RatioProofExperience({ kind, proof }: { category: VisualProofCategory; proof: VisualProof; kind: RatioProofKind }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(kind === "scale" ? 3.2 : 8);
  const [d, setD] = useState(kind === "scale" ? 50000 : 12);
  const parts = [Math.max(1, Math.round(a)), Math.max(1, Math.round(b)), Math.max(1, Math.round(c || 4))];
  const shares = divideWholeInRatio(Math.max(1, d), parts);
  const angles = getPieAnglesFromRatio(parts);
  const percentages = getPiePercentagesFromRatio(parts);
  const direct = getDirectProportionValue({ x1: 2, y1: a * 2, x2: b + 1 });
  const inverse = getInverseProportionValue({ x1: 2, y1: a * 2, x2: b + 1 });
  const scaleActual = getActualDistanceFromMapScale({ mapDistance: c, scaleDenominator: d, mapUnit: "cm", outputUnit: "km" });
  const rf = getRepresentativeFraction({ mapDistance: c, actualDistance: scaleActual.actual, mapUnit: "cm", actualUnit: "km" });
  const crossEqual = Math.abs(a * d - b * c) < 1e-9;

  const cards = {
    cross: {
      title: "Equal ratios make equal cross-products",
      formula: `${a}/${b} ${crossEqual ? "=" : "!="} ${c}/${d}; ${a} x ${d} ${crossEqual ? "=" : "!="} ${b} x ${c}`,
      note: "The two highlighted rectangles have areas ad and bc. They match only when the ratios match.",
    },
    scale: {
      title: "Map scale must use the same unit",
      formula: `${c} cm at 1:${d} = ${round(scaleActual.actual, 4)} km actual`,
      note: `Representative fraction is ${rf.text} after converting actual distance into centimetres.`,
    },
    shares: {
      title: "Each ratio part receives part/sum of the whole",
      formula: `${parts.join(":")} of ${d} -> ${shares.map((share) => round(share, 2)).join(", ")}`,
      note: `Percentages: ${percentages.join("%, ")}%. Pie angles: ${angles.join(" deg, ")} deg.`,
    },
    "direct-inverse": {
      title: "Direct keeps y/x; inverse keeps xy",
      formula: `direct y=${round(direct.y2, 2)}, inverse y=${round(inverse.y2, 2)} when x=${b + 1}`,
      note: "The straight line is a constant-ratio model. The curved/area model is a constant-product model.",
    },
  }[kind];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-4 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">Grade 8 proportional reasoning</p>
            <h1 className="mt-1 text-2xl font-black">{proof.title}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">{proof.longDescription}</p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-cyan-100">{cards.formula}</div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/80">
          <svg data-testid="visual-proof-primary-visual" viewBox="0 0 760 420" className="h-[420px] w-full rounded-2xl bg-slate-950" role="img" aria-label={cards.title}>
            <rect width="760" height="420" fill="#020617" />
            <Grid />
            {kind === "cross" && <CrossVisual a={a} b={b} c={c} d={d} />}
            {kind === "scale" && <ScaleVisual map={c} denominator={d} actual={scaleActual.actual} />}
            {kind === "shares" && <SharesVisual parts={parts} shares={shares} angles={angles} />}
            {kind === "direct-inverse" && <DirectInverseVisual direct={direct.y2} inverse={inverse.y2} x={b + 1} />}
          </svg>
        </div>
        <aside className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/80">
            <h2 className="font-black">{cards.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{cards.note}</p>
          </div>
          <Control label="a / part 1" value={a} min={1} max={12} step={1} onChange={setA} />
          <Control label="b / part 2" value={b} min={1} max={12} step={1} onChange={setB} />
          <Control label={kind === "scale" ? "map cm" : "c / part 3"} value={c} min={1} max={kind === "scale" ? 12 : 20} step={kind === "scale" ? 0.1 : 1} onChange={setC} />
          <Control label={kind === "scale" ? "scale denominator" : "d / total"} value={d} min={kind === "scale" ? 1000 : 1} max={kind === "scale" ? 100000 : 1000} step={kind === "scale" ? 1000 : 1} onChange={setD} />
        </aside>
      </section>
    </div>
  );
}

function Control({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <label className="block rounded-2xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10">{label}<input className="mt-2 w-full" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><span className="mt-1 block font-mono">{round(value, 4)}</span></label>;
}

function Grid() {
  return <g opacity="0.24">{Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="420" stroke="#164e63" />)}{Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 50} x2="760" y2={i * 50} stroke="#164e63" />)}</g>;
}

function CrossVisual({ a, b, c, d }: { a: number; b: number; c: number; d: number }) {
  const left = a * d;
  const right = b * c;
  const scale = 220 / Math.max(left, right, 1);
  return <g><rect x="90" y="120" width={Math.max(20, left * scale)} height="90" fill="#22d3ee" opacity="0.8" /><rect x="90" y="250" width={Math.max(20, right * scale)} height="90" fill="#a78bfa" opacity="0.8" /><text x="90" y="95" fill="#fff" fontWeight="900">ad = {round(left, 2)}</text><text x="90" y="240" fill="#fff" fontWeight="900">bc = {round(right, 2)}</text><text x="430" y="210" fill="#facc15" fontWeight="900" fontSize="34">{Math.abs(left - right) < 1e-9 ? "equal products" : "not equal yet"}</text></g>;
}

function ScaleVisual({ map, denominator, actual }: { map: number; denominator: number; actual: number }) {
  return <g><line x1="110" y1="170" x2="610" y2="170" stroke="#22d3ee" strokeWidth="12" /><line x1="110" y1="255" x2="610" y2="255" stroke="#facc15" strokeWidth="20" /><text x="110" y="140" fill="#fff" fontWeight="900">{map} cm on map</text><text x="110" y="310" fill="#fff" fontWeight="900">actual distance = {round(actual, 4)} km</text><text x="420" y="220" fill="#facc15" fontWeight="900">1:{denominator}</text></g>;
}

function SharesVisual({ parts, shares, angles }: { parts: number[]; shares: number[]; angles: number[] }) {
  const sum = parts.reduce((acc, part) => acc + part, 0);
  let x = 80;
  const colors = ["#22d3ee", "#a78bfa", "#f59e0b"];
  return <g>{parts.map((part, index) => { const w = (part / sum) * 520; const oldX = x; x += w; return <g key={index}><rect x={oldX} y="145" width={w} height="90" fill={colors[index]} opacity="0.85" /><text x={oldX + 18} y="195" fill="#020617" fontWeight="900">{round(shares[index], 2)}</text><text x={oldX + 18} y="260" fill="#fff" fontWeight="900">{angles[index]} deg</text></g>; })}<text x="80" y="105" fill="#fff" fontWeight="900">Ratio {parts.join(":")} split and pie angles</text></g>;
}

function DirectInverseVisual({ direct, inverse, x }: { direct: number; inverse: number; x: number }) {
  return <g><line x1="80" y1="340" x2="680" y2="340" stroke="#fff" /><line x1="90" y1="60" x2="90" y2="350" stroke="#fff" /><path d="M90 330 L650 80" stroke="#22d3ee" strokeWidth="5" fill="none" /><path d="M100 95 C210 110 320 185 650 320" stroke="#f59e0b" strokeWidth="5" fill="none" /><circle cx={90 + x * 55} cy={330 - direct * 16} r="8" fill="#22d3ee" /><circle cx={90 + x * 55} cy={330 - inverse * 16} r="8" fill="#f59e0b" /><text x="135" y="82" fill="#22d3ee" fontWeight="900">direct: constant ratio</text><text x="135" y="120" fill="#f59e0b" fontWeight="900">inverse: constant product</text></g>;
}
