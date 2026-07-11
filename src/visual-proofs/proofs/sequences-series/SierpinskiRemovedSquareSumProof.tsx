import { useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { getSierpinskiMathTable, getSierpinskiStats } from "../../../components/ncert/grade8/fractalsSolidViewsMath";

export default function SierpinskiRemovedSquareSumProof({ proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const [n, setN] = useState(4);
  const rows = getSierpinskiMathTable(n);
  const stats = getSierpinskiStats(n);

  return (
    <main className="desktop-page-shell" data-testid="visual-proof-primary-visual">
      <section className="desktop-card grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">{proof.title}</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">The new holes form 1, 8, 64, ... because every retained square removes one center square in the next round.</p>
          <div className="mt-4 grid gap-2">
            {rows.slice(1).map((row) => (
              <div key={row.iteration} className="grid grid-cols-[80px_minmax(0,1fr)_90px] items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-white/5">
                <span className="font-black">step {row.iteration}</span>
                <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${Math.min(100, row.newlyRemovedSquares / Math.max(1, stats.newlyRemovedSquares) * 100)}%` }} />
                </div>
                <span className="text-right font-black">{row.newlyRemovedSquares}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-3">
          <MathExpression value="C_n=1+8+8^2+\cdots+8^{n-1}=\frac{8^n-1}{7}" className="rounded-xl bg-cyan-50 p-3 text-lg font-black text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100" />
          <label className="block rounded-xl border border-slate-200 p-3 text-sm font-black dark:border-white/10">
            Iteration: {n}
            <input type="range" min={1} max={8} step={1} value={n} onChange={(event) => setN(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
          </label>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase text-slate-500">Cumulative removed</p>
            <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{stats.cumulativeRemovedSquares.toLocaleString()}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">This is a count of holes, not an area fraction.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
