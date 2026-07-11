import { useMemo, useState } from "react";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { getProjection, getSolidPreset, type ProjectionName } from "../../../components/ncert/grade8/fractalsSolidViewsMath";

const views: ProjectionName[] = ["top", "front", "left", "right"];

export default function OrthographicProjectionFromCubeStacksProof({ proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const [view, setView] = useState<ProjectionName>("front");
  const grid = useMemo(() => getSolidPreset("grade8-challenge").grid, []);
  const projection = getProjection(grid, view);

  return (
    <main className="desktop-page-shell" data-testid="visual-proof-primary-visual">
      <section className="desktop-card grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl bg-slate-950 p-4">
          <svg viewBox="0 0 620 380" className="h-[360px] w-full" role="img" aria-label={proof.title}>
            <rect width="620" height="380" rx="22" fill="#020617" />
            {grid.flatMap((row, r) => row.map((height, c) => height > 0 ? (
              <g key={`${r}-${c}`} transform={`translate(${150 + c * 70 - r * 16} ${270 - r * 18})`}>
                {Array.from({ length: height }, (_, z) => <rect key={z} x="0" y={-z * 34} width="44" height="30" fill="#22d3ee" opacity={0.35 + z * 0.12} stroke="#e0f2fe" />)}
              </g>
            ) : null))}
            <text x="36" y="42" fill="#e0f2fe" fontSize="18" fontWeight="900">Cube stack model</text>
            <text x="360" y="42" fill="#facc15" fontSize="18" fontWeight="900">{view} view uses {view === "top" ? "occupied cells" : "maximum heights"}</text>
          </svg>
        </div>
        <aside className="space-y-3">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">{proof.title}</h1>
          <div className="grid grid-cols-2 gap-2">
            {views.map((item) => <button key={item} type="button" onClick={() => setView(item)} className={item === view ? "action-primary" : "action-secondary"}>{item}</button>)}
          </div>
          <ProjectionGrid grid={projection} />
          <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Projection is deterministic: choose an orientation, collapse depth, and keep the visible footprint or maximum height.</p>
        </aside>
      </section>
    </main>
  );
}

function ProjectionGrid({ grid }: { grid: number[][] }) {
  return <div className="inline-grid gap-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 32px)` }}>{grid.flatMap((row, r) => row.map((value, c) => <span key={`${r}-${c}`} className={`h-8 rounded-lg border ${value ? "border-cyan-400 bg-cyan-400" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900"}`} />))}</div>;
}
