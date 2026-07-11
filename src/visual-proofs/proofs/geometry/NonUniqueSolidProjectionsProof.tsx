import { useState } from "react";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { cubeCount, getProjectionSet, nonUniqueProjectionExamples, validateSolidReconstruction, type CubeStackGrid } from "../../../components/ncert/grade8/fractalsSolidViewsMath";

export default function NonUniqueSolidProjectionsProof({ proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const example = nonUniqueProjectionExamples[0];
  const [showB, setShowB] = useState(false);
  const grid = showB ? example.b : example.a;
  const validation = validateSolidReconstruction(grid, example.projections);

  return (
    <main className="desktop-page-shell" data-testid="visual-proof-primary-visual">
      <section className="desktop-card grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">{proof.title}</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Switch between two solids. Their visible projections match, but their cube counts differ.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <SolidTable title={showB ? "Solid B" : "Solid A"} grid={grid} />
            <div className="space-y-2">
              {Object.entries(getProjectionSet(grid)).map(([name, projection]) => <MiniProjection key={name} title={name} grid={projection} />)}
            </div>
          </div>
        </div>
        <aside className="space-y-3">
          <button type="button" onClick={() => setShowB((value) => !value)} className="action-primary w-full">Switch to Solid {showB ? "A" : "B"}</button>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase text-slate-500">Projection match</p>
            <p className="mt-1 text-2xl font-black text-emerald-600">{validation.acceptsAlternative ? "yes" : "no"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase text-slate-500">Cube count</p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{cubeCount(grid)}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">A cube-count condition can make an otherwise ambiguous reconstruction stricter.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function SolidTable({ title, grid }: { title: string; grid: CubeStackGrid }) {
  return <div><p className="mb-2 font-black">{title}</p><div className="grid grid-cols-4 gap-1">{grid.flatMap((row, r) => row.map((value, c) => <span key={`${r}-${c}`} className="rounded-lg bg-cyan-50 p-3 text-center font-black text-cyan-900 dark:bg-cyan-300/10 dark:text-cyan-100">{value}</span>))}</div></div>;
}

function MiniProjection({ title, grid }: { title: string; grid: number[][] }) {
  return <div><p className="mb-1 text-xs font-black uppercase text-slate-500">{title}</p><div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 22px)` }}>{grid.flatMap((row, r) => row.map((value, c) => <span key={`${r}-${c}`} className={`h-5 rounded ${value ? "bg-cyan-400" : "bg-slate-100 dark:bg-white/10"}`} />))}</div></div>;
}
