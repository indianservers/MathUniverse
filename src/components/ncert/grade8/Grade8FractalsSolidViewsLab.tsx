import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import FormulaBlock from "../../ui/FormulaBlock";
import NCERTTabbedWorkspace from "../layout/NCERTTabbedWorkspace";
import {
  changeStackHeight,
  cloneGrid,
  createEmptyGrid,
  cubeCount,
  generateSierpinskiRemovedSquares,
  getProjection,
  getSierpinskiStats,
  getSierpinskiTable,
  getSolidPreset,
  setStackHeight,
  solidPresets,
  validateProjectionMatch,
  type CarpetCell,
  type CubeStackGrid,
  type ProjectionName,
} from "./fractalsSolidViewsMath";

const retainedChoices = [
  { key: "00", label: "top left", x: 0, y: 0 },
  { key: "01", label: "top", x: 1 / 3, y: 0 },
  { key: "02", label: "top right", x: 2 / 3, y: 0 },
  { key: "10", label: "left", x: 0, y: 1 / 3 },
  { key: "12", label: "right", x: 2 / 3, y: 1 / 3 },
  { key: "20", label: "bottom left", x: 0, y: 2 / 3 },
  { key: "21", label: "bottom", x: 1 / 3, y: 2 / 3 },
  { key: "22", label: "bottom right", x: 2 / 3, y: 2 / 3 },
];

const challengePreset = getSolidPreset("grade8-challenge");

export default function Grade8FractalsSolidViewsLab() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") ?? undefined;
  const defaultTabId = ["fractal", "solid", "practice"].includes(requestedTab ?? "") ? requestedTab : "fractal";
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-200">Class 8 NCERT geometry lab</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Fractals and Solid Views</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              Explore Sierpinski carpet patterns, count retained and removed squares, then build cube stacks and read their top, front, and side views.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Sierpinski carpet", "cube stacks", "orthographic views"].map((item) => (
              <span key={item} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <NCERTTabbedWorkspace
        ariaLabel="Class 8 fractals and solid views tabs"
        defaultTabId={defaultTabId}
        tabs={[
          { id: "fractal", label: "Fractal Explorer", badge: "carpet", content: <FractalExplorer /> },
          { id: "solid", label: "Solid Views Lab", badge: "cubes", content: <SolidViewsLab /> },
          { id: "practice", label: "Practice + Teacher", badge: "checks", content: <PracticeAndResources /> },
        ]}
      />
    </div>
  );
}

function FractalExplorer() {
  const [iteration, setIteration] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showRemoved, setShowRemoved] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedSimilarity, setSelectedSimilarity] = useState(retainedChoices[0]);
  const [prediction, setPrediction] = useState("");
  const stats = getSierpinskiStats(iteration);
  const table = getSierpinskiTable(iteration);
  const removedCells = useMemo(() => generateSierpinskiRemovedSquares(iteration), [iteration]);
  const retainedMini = useMemo(() => generateSierpinskiRemovedSquares(Math.max(0, iteration - 1)), [iteration]);
  const expectedNext = 8 ** (iteration + 1);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setIteration((value) => (value >= 5 ? 0 : value + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [playing]);

  const answer = Number(prediction);
  const answerState = prediction.trim().length === 0 ? "waiting" : answer === expectedNext ? "correct" : "try";

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Sierpinski carpet explorer</h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Remove the middle ninth, then repeat the same rule in every retained square.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <IconButton label="Previous iteration" onClick={() => setIteration((value) => Math.max(0, value - 1))}>Prev</IconButton>
            <IconButton label={playing ? "Pause animation" : "Play animation"} onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </IconButton>
            <IconButton label="Next iteration" onClick={() => setIteration((value) => Math.min(5, value + 1))}>Next</IconButton>
            <IconButton label="Reset view" onClick={() => { setIteration(0); setZoom(1); setPan({ x: 0, y: 0 }); }}>
              <RotateCcw size={16} />
            </IconButton>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="rounded-2xl bg-slate-950 p-3">
            <CarpetSvg
              removedCells={removedCells}
              highlight={selectedSimilarity}
              showGrid={showGrid}
              showRemoved={showRemoved}
              showLabels={showLabels}
              zoom={zoom}
              panX={pan.x}
              panY={pan.y}
            />
          </div>
          <div className="space-y-3">
            <RangeControl label="Iteration" value={iteration} min={0} max={5} step={1} onChange={setIteration} />
            <RangeControl label="Zoom" value={zoom} min={1} max={2.5} step={0.1} onChange={setZoom} />
            <div className="grid grid-cols-2 gap-2">
              <RangeControl label="Pan X" value={pan.x} min={-40} max={40} step={5} onChange={(x) => setPan((old) => ({ ...old, x }))} />
              <RangeControl label="Pan Y" value={pan.y} min={-40} max={40} step={5} onChange={(y) => setPan((old) => ({ ...old, y }))} />
            </div>
            <Toggle label="Grid" checked={showGrid} onChange={setShowGrid} />
            <Toggle label="Removed" checked={showRemoved} onChange={setShowRemoved} />
            <Toggle label="Labels" checked={showLabels} onChange={setShowLabels} />
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <Metric label="Retained squares" value={stats.retainedSquares.toLocaleString()} />
          <Metric label="New removed" value={stats.newlyRemovedSquares.toLocaleString()} />
          <Metric label="Cumulative removed" value={stats.cumulativeRemovedSquares.toLocaleString()} />
          <Metric label="Side scale" value={stats.sideScaleText} />
        </div>
      </section>

      <aside className="space-y-4">
        <FormulaBlock title="Fractal count rule" formula="R_n=8^n,\quad A_n=(8/9)^n,\quad removed=1-(8/9)^n" explanation="Each retained square creates eight smaller copies in the next step." />
        <section className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <h3 className="font-black text-slate-950 dark:text-white">Self-similarity lens</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Pick one retained third. It contains a smaller copy of the previous carpet.</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {retainedChoices.map((choice) => (
              <button
                key={choice.key}
                type="button"
                onClick={() => setSelectedSimilarity(choice)}
                className={`rounded-xl border px-2 py-2 text-xs font-black ${selectedSimilarity.key === choice.key ? "border-cyan-400 bg-slate-950 text-white" : "border-cyan-200 bg-white text-slate-700"}`}
              >
                {choice.key}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-950 p-2">
            <MiniCarpetSvg removedCells={retainedMini} />
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="font-black text-slate-950 dark:text-white">Predict the next row</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">At iteration {iteration + 1}, how many smallest squares remain?</p>
          <div className="mt-3 flex gap-2">
            <input value={prediction} onChange={(event) => setPrediction(event.target.value)} inputMode="numeric" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-black text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white" />
            <button type="button" onClick={() => setPrediction(String(expectedNext))} className="action-secondary">Reveal</button>
          </div>
          <p className={`mt-2 text-sm font-black ${answerState === "correct" ? "text-emerald-700" : answerState === "try" ? "text-amber-700" : "text-slate-500"}`}>
            {answerState === "correct" ? "Correct. Multiply the previous row by 8." : answerState === "try" ? `Try again: use 8^${iteration + 1}.` : "Enter a prediction first."}
          </p>
        </section>
      </aside>

      <section className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
        <h3 className="mb-3 font-black text-slate-950 dark:text-white">Sequence table</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">n</th>
                <th className="px-3 py-2">Retained</th>
                <th className="px-3 py-2">New removed</th>
                <th className="px-3 py-2">Total removed</th>
                <th className="px-3 py-2">Small side</th>
                <th className="px-3 py-2">Retained area</th>
                <th className="px-3 py-2">Removed area</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.iteration} className="border-t border-slate-100 dark:border-white/10">
                  <td className="px-3 py-2 font-black">{row.iteration}</td>
                  <td className="px-3 py-2">{row.retainedSquares}</td>
                  <td className="px-3 py-2">{row.newlyRemovedSquares}</td>
                  <td className="px-3 py-2">{row.cumulativeRemovedSquares}</td>
                  <td className="px-3 py-2">{row.sideScaleText}</td>
                  <td className="px-3 py-2">{row.retainedAreaText} ({row.retainedPercent.toFixed(1)}%)</td>
                  <td className="px-3 py-2">{row.removedAreaText} ({row.removedPercent.toFixed(1)}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SolidViewsLab() {
  const [presetId, setPresetId] = useState("staircase");
  const [grid, setGrid] = useState(() => cloneGrid(getSolidPreset("staircase").grid));
  const [selected, setSelected] = useState({ row: 1, col: 1 });
  const [projection, setProjection] = useState<ProjectionName>("top");
  const [candidate, setCandidate] = useState(() => createEmptyGrid());
  const [requireCubeCount, setRequireCubeCount] = useState(false);
  const [viewAnswer, setViewAnswer] = useState<ProjectionName | "">("");
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showOutlines, setShowOutlines] = useState(true);
  const [view, setView] = useState(0);
  const target = challengePreset.grid;
  const validation = useMemo(() => validateProjectionMatch(candidate, target, requireCubeCount), [candidate, requireCubeCount, target]);

  const loadPreset = (id: string) => {
    setPresetId(id);
    setGrid(cloneGrid(getSolidPreset(id).grid));
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Build a cube solid</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Select a grid cell, then add or remove cubes from that stack.</p>
        <select value={presetId} onChange={(event) => loadPreset(event.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10 dark:text-white">
          {solidPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.title}</option>)}
        </select>
        <StackEditor grid={grid} selected={selected} onSelect={setSelected} onChange={(row, col, height) => setGrid((old) => setStackHeight(old, row, col, height))} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <IconButton label="Add cube" onClick={() => setGrid((old) => changeStackHeight(old, selected.row, selected.col, 1))}>+ Cube</IconButton>
          <IconButton label="Remove cube" onClick={() => setGrid((old) => changeStackHeight(old, selected.row, selected.col, -1))}>- Cube</IconButton>
          <IconButton label="Clear model" onClick={() => setGrid(createEmptyGrid())}>Clear</IconButton>
          <IconButton label="Reset example" onClick={() => loadPreset(presetId)}>Reset</IconButton>
        </div>
        <div className="mt-3 grid gap-2">
          <Toggle label="Grid" checked={showGrid} onChange={setShowGrid} />
          <Toggle label="Axes" checked={showAxes} onChange={setShowAxes} />
          <Toggle label="Outlines" checked={showOutlines} onChange={setShowOutlines} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">3D stack view</h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Cube count: {cubeCount(grid)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <IconButton label="Rotate view" onClick={() => setView((old) => (old + 1) % 4)}><RotateCcw size={16} /> Rotate</IconButton>
            <IconButton label="Focus diagram" onClick={() => setView(0)}><Maximize2 size={16} /> Fit</IconButton>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3">
          <SolidSvg grid={grid} showAxes={showAxes} showGrid={showGrid} showOutlines={showOutlines} view={view} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(["top", "front", "left", "right"] as ProjectionName[]).map((name) => (
            <button key={name} type="button" onClick={() => setProjection(name)} className={`rounded-xl border px-3 py-2 text-sm font-black capitalize ${projection === name ? "border-cyan-400 bg-cyan-500 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
              {name}
            </button>
          ))}
        </div>
        <ProjectionGrid title={`${projection} view`} grid={getProjection(grid, projection)} />
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-300/20 dark:bg-amber-300/10">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Reconstruction challenge</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Build any model that matches the challenge projections. Alternatives are accepted.</p>
        <StackEditor grid={candidate} selected={selected} onSelect={setSelected} onChange={(row, col, height) => setCandidate((old) => setStackHeight(old, row, col, height))} compact />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <IconButton label="Add cube to challenge" onClick={() => setCandidate((old) => changeStackHeight(old, selected.row, selected.col, 1))}>+ Cube</IconButton>
          <IconButton label="Remove cube from challenge" onClick={() => setCandidate((old) => changeStackHeight(old, selected.row, selected.col, -1))}>- Cube</IconButton>
        </div>
        <Toggle label="Require same cube count" checked={requireCubeCount} onChange={setRequireCubeCount} />
        <div className={`mt-3 rounded-xl border p-3 text-sm font-black ${validation.acceptsAlternative ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-white text-amber-800"}`}>
          {validation.message}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black">
          {[
            ["Top", validation.topMatches],
            ["Front", validation.frontMatches],
            ["Left", validation.leftMatches],
            ["Right", validation.rightMatches],
          ].map(([label, ok]) => <span key={String(label)} className={`rounded-full px-3 py-2 ${ok ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-700"}`}>{label}: {ok ? "match" : "check"}</span>)}
        </div>
        <div className="mt-3 max-h-64 overflow-auto rounded-2xl bg-white/70 p-3 dark:bg-slate-950/40">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Target views</p>
          <ProjectionGrid title="top" grid={getProjection(target, "top")} />
          <ProjectionGrid title="front" grid={getProjection(target, "front")} />
          <ProjectionGrid title="left" grid={getProjection(target, "left")} />
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
          <p className="text-sm font-black text-slate-950 dark:text-white">View-reading check</p>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Which view shows only footprint squares, not heights?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["top", "front", "left"] as ProjectionName[]).map((name) => (
              <button key={name} type="button" onClick={() => setViewAnswer(name)} className="rounded-xl border border-cyan-200 bg-cyan-50 px-2 py-2 text-xs font-black capitalize text-cyan-900">
                {name}
              </button>
            ))}
          </div>
          {viewAnswer && <p className={`mt-2 text-xs font-black ${viewAnswer === "top" ? "text-emerald-700" : "text-amber-700"}`}>{viewAnswer === "top" ? "Correct. Top view ignores height and shows occupied cells." : "Try top view: it is the footprint from above."}</p>}
        </div>
      </section>
    </div>
  );
}

function PracticeAndResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">What students should be able to do</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {[
            ["Pattern rule", "Explain why retained squares follow 1, 8, 64, 512, ..."],
            ["Area reasoning", "Use (8/9)^n to find retained area after n steps."],
            ["View reading", "Read top, front, left, and right projections of cube stacks."],
            ["Reconstruction", "Build a solid that matches given orthographic views."],
          ].map(([title, text]) => <InfoCard key={title} title={title} text={text} />)}
        </div>
      </section>
      <aside className="space-y-3">
        <FormulaBlock title="Core formulas" formula="R_n=8^n,\quad S_n=3^n,\quad area=(8/9)^n" explanation="Fractal growth is multiplicative; solid views are projections of the same object." />
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <h3 className="font-black text-slate-950 dark:text-white">Related tools</h3>
          <div className="mt-3 grid gap-2">
            <ResourceLink to="/shapes" label="2D/3D Shapes" />
            <ResourceLink to="/workspace/3d" label="3D Workspace" />
            <ResourceLink to="/math-lab/3d-graphing" label="3D Graphing Lab" />
            <ResourceLink to="/ncert" label="NCERT Dashboard" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function CarpetSvg({ removedCells, highlight, showGrid, showRemoved, showLabels, zoom, panX, panY }: { removedCells: CarpetCell[]; highlight: typeof retainedChoices[number]; showGrid: boolean; showRemoved: boolean; showLabels: boolean; zoom: number; panX: number; panY: number }) {
  return (
    <svg viewBox="0 0 520 520" className="aspect-square w-full" role="img" aria-label="Sierpinski carpet fractal">
      <rect width="520" height="520" rx="24" fill="#020617" />
      <g transform={`translate(${panX} ${panY}) scale(${zoom})`}>
        <rect x="60" y="60" width="400" height="400" fill="#22d3ee" opacity="0.9" />
        {removedCells.map((cell) => (
          <rect
            key={cell.key}
            x={60 + cell.x * 400}
            y={60 + cell.y * 400}
            width={cell.size * 400}
            height={cell.size * 400}
            fill="#020617"
            stroke={showRemoved ? "#f97316" : "#020617"}
            strokeWidth={showRemoved ? 1.4 : 0}
          />
        ))}
        {showGrid && [1, 2].map((line) => (
          <g key={line} stroke="#e0f2fe" strokeWidth="1.5" opacity="0.5">
            <line x1={60 + (line * 400) / 3} y1="60" x2={60 + (line * 400) / 3} y2="460" />
            <line x1="60" y1={60 + (line * 400) / 3} x2="460" y2={60 + (line * 400) / 3} />
          </g>
        ))}
        <rect x={60 + highlight.x * 400} y={60 + highlight.y * 400} width={400 / 3} height={400 / 3} fill="none" stroke="#facc15" strokeWidth="5" />
      </g>
      {showLabels && (
        <g fill="#e0f2fe" fontSize="18" fontWeight="800">
          <text x="30" y="35">remove middle ninth</text>
          <text x="275" y="500">8 smaller copies remain</text>
        </g>
      )}
    </svg>
  );
}

function MiniCarpetSvg({ removedCells }: { removedCells: CarpetCell[] }) {
  return (
    <svg viewBox="0 0 180 120" className="h-28 w-full" role="img" aria-label="Magnified smaller carpet">
      <rect width="180" height="120" rx="16" fill="#020617" />
      <rect x="40" y="10" width="100" height="100" fill="#22d3ee" opacity="0.9" />
      {removedCells.map((cell) => <rect key={cell.key} x={40 + cell.x * 100} y={10 + cell.y * 100} width={cell.size * 100} height={cell.size * 100} fill="#020617" />)}
      <text x="18" y="114" fill="#facc15" fontSize="12" fontWeight="800">same rule at smaller scale</text>
    </svg>
  );
}

function StackEditor({ grid, selected, onSelect, onChange, compact = false }: { grid: CubeStackGrid; selected: { row: number; col: number }; onSelect: (cell: { row: number; col: number }) => void; onChange: (row: number, col: number, height: number) => void; compact?: boolean }) {
  return (
    <div className={`mt-3 grid grid-cols-4 gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {grid.map((row, rowIndex) => row.map((height, colIndex) => {
        const active = selected.row === rowIndex && selected.col === colIndex;
        return (
          <button
            key={`${rowIndex}-${colIndex}`}
            type="button"
            onClick={() => onSelect({ row: rowIndex, col: colIndex })}
            onDoubleClick={() => onChange(rowIndex, colIndex, height + 1)}
            className={`min-h-12 rounded-xl border font-black ${active ? "border-cyan-400 bg-cyan-500 text-white" : height > 0 ? "border-cyan-200 bg-cyan-50 text-cyan-900" : "border-slate-200 bg-white text-slate-400"}`}
          >
            {height}
          </button>
        );
      }))}
    </div>
  );
}

function SolidSvg({ grid, showAxes, showGrid, showOutlines, view }: { grid: CubeStackGrid; showAxes: boolean; showGrid: boolean; showOutlines: boolean; view: number }) {
  const rotated = rotateGrid(grid, view);
  const cubes = rotated.flatMap((row, rowIndex) => row.flatMap((height, colIndex) => Array.from({ length: height }, (_, z) => ({ row: rowIndex, col: colIndex, z }))));
  const sorted = cubes.sort((a, b) => (a.row + a.col + a.z) - (b.row + b.col + b.z));
  return (
    <svg viewBox="0 0 620 420" className="h-[360px] w-full" role="img" aria-label="Isometric cube stack model">
      <rect width="620" height="420" rx="22" fill="#020617" />
      {showGrid && <g stroke="#164e63" opacity="0.35">{Array.from({ length: 8 }, (_, i) => <line key={i} x1={60 + i * 58} y1="330" x2={220 + i * 58} y2="230" />)}</g>}
      {sorted.map((cube) => <IsoCube key={`${cube.row}-${cube.col}-${cube.z}`} row={cube.row} col={cube.col} z={cube.z} outline={showOutlines} />)}
      {showAxes && (
        <g stroke="#e0f2fe" strokeWidth="3" fill="#e0f2fe" fontWeight="900">
          <line x1="70" y1="360" x2="160" y2="360" />
          <line x1="70" y1="360" x2="35" y2="330" />
          <line x1="70" y1="360" x2="70" y2="275" />
          <text x="164" y="365">x</text>
          <text x="20" y="330">y</text>
          <text x="62" y="268">z</text>
        </g>
      )}
    </svg>
  );
}

function IsoCube({ row, col, z, outline }: { row: number; col: number; z: number; outline: boolean }) {
  const baseX = 250 + (col - row) * 44;
  const baseY = 295 + (col + row) * 22 - z * 44;
  const pointsTop = `${baseX},${baseY - 22} ${baseX + 44},${baseY} ${baseX},${baseY + 22} ${baseX - 44},${baseY}`;
  const pointsLeft = `${baseX - 44},${baseY} ${baseX},${baseY + 22} ${baseX},${baseY + 66} ${baseX - 44},${baseY + 44}`;
  const pointsRight = `${baseX + 44},${baseY} ${baseX},${baseY + 22} ${baseX},${baseY + 66} ${baseX + 44},${baseY + 44}`;
  const stroke = outline ? "#e0f2fe" : "transparent";
  return (
    <g stroke={stroke} strokeWidth="1.5">
      <polygon points={pointsLeft} fill="#0891b2" />
      <polygon points={pointsRight} fill="#0e7490" />
      <polygon points={pointsTop} fill="#67e8f9" />
    </g>
  );
}

function ProjectionGrid({ title, grid }: { title: string; grid: number[][] }) {
  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-2 text-sm font-black capitalize text-slate-900 dark:text-white">{title}</h3>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(28px, 1fr))` }}>
        {grid.flatMap((row, rowIndex) => row.map((value, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className={`h-8 rounded-lg border ${value ? "border-cyan-400 bg-cyan-400" : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"}`} />
        )))}
      </div>
    </div>
  );
}

function rotateGrid(grid: CubeStackGrid, turns: number): CubeStackGrid {
  let next = cloneGrid(grid);
  for (let i = 0; i < turns; i += 1) {
    next = next[0].map((_, col) => next.map((row) => row[col]).reverse());
  }
  return next;
}

function RangeControl({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
      <span className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-500">
        {label}<b className="text-slate-950 dark:text-white">{Number(value.toFixed(2))}</b>
      </span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-cyan-500" />
    </label>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-sm hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-white/10 dark:text-white">
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function ResourceLink({ to, label }: { to: string; label: string }) {
  return <Link to={to} className="action-secondary justify-between">{label}<Sparkles size={16} /></Link>;
}
