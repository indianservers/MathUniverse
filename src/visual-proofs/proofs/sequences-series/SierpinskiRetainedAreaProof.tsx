import { useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { generateSierpinskiRemovedSquares, getSierpinskiStats } from "../../../components/ncert/grade8/fractalsSolidViewsMath";

export default function SierpinskiRetainedAreaProof({ proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const [n, setN] = useState(3);
  const stats = getSierpinskiStats(n);
  const removed = generateSierpinskiRemovedSquares(n);

  return (
    <main className="desktop-page-shell" data-testid="visual-proof-primary-visual">
      <section className="desktop-card grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl bg-slate-950 p-3">
          <svg viewBox="0 0 520 520" className="aspect-square w-full" role="img" aria-label={proof.title}>
            <rect width="520" height="520" rx="24" fill="#020617" />
            <rect x="60" y="60" width="400" height="400" fill="#22d3ee" opacity="0.9" />
            {removed.map((cell) => (
              <rect key={cell.key} x={60 + cell.x * 400} y={60 + cell.y * 400} width={cell.size * 400} height={cell.size * 400} fill="#020617" stroke="#f97316" strokeWidth="1.2" />
            ))}
            <text x="70" y="38" fill="#e0f2fe" fontSize="18" fontWeight="900">iteration n = {n}</text>
            <text x="70" y="500" fill="#facc15" fontSize="18" fontWeight="900">retained area = {stats.retainedAreaText}</text>
          </svg>
        </div>
        <aside className="space-y-3">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">{proof.title}</h1>
          <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Each step keeps 8 of 9 equal pieces. Multiplying that area fraction n times gives the retained area.</p>
          <MathExpression value="A_n=\left(\frac{8}{9}\right)^n=\frac{8^n}{9^n}" className="rounded-xl bg-cyan-50 p-3 text-xl font-black text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100" />
          <label className="block rounded-xl border border-slate-200 p-3 text-sm font-black dark:border-white/10">
            Iteration: {n}
            <input type="range" min={0} max={5} step={1} value={n} onChange={(event) => setN(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Retained squares" value={stats.retainedSquares} />
            <Metric label="Area kept" value={`${stats.retainedPercent.toFixed(1)}%`} />
            <Metric label="Small side" value={stats.sideScaleText} />
            <Metric label="Removed area" value={stats.removedAreaText} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/5"><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 font-black text-slate-950 dark:text-white">{value}</p></div>;
}
