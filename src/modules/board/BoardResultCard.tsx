import { lazy, Suspense, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, ExternalLink, Grid3X3, MoveDown, MoveLeft, MoveRight, MoveUp, Play, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { boardToScreen } from "./boardGeometry";
import type { BoardResultElement, BoardViewport } from "./types";

const FunctionGraphCanvas = lazy(() => import("../../components/math-lab/FunctionGraphCanvas"));

type BoardResultCardProps = {
  result: BoardResultElement;
  viewport: BoardViewport;
  selected: boolean;
  onSelect: () => void;
  onMove: (dx: number, dy: number) => void;
  onToggle: () => void;
  onDelete: () => void;
  onRerun: () => void;
  onInsert: () => void;
};

export default function BoardResultCard({
  result,
  viewport,
  selected,
  onSelect,
  onMove,
  onToggle,
  onDelete,
  onRerun,
  onInsert,
}: BoardResultCardProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [traceX, setTraceX] = useState(0);
  const defaultView = result.graph?.view ?? { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
  const [view, setView] = useState(defaultView);
  const point = boardToScreen({ x: result.bounds.x, y: result.bounds.y }, viewport);
  const style = {
    left: point.x,
    top: point.y,
    width: Math.max(280, Math.min(440, result.bounds.width * viewport.zoom)),
  };
  const summary = result.status === "loading"
    ? `${result.title} is running.`
    : result.status === "error"
      ? `${result.title} failed: ${result.error?.userMessage ?? "unknown error"}`
      : `${result.title}: ${result.plainTextOutput ?? result.exactOutputLatex ?? "complete"}`;
  const graphSeries = useMemo(() => result.graph?.series ?? [], [result.graph?.series]);

  return (
    <article
      className={`pointer-events-auto absolute z-10 max-w-[calc(100%-1rem)] overflow-hidden rounded-xl border bg-white/95 shadow-xl backdrop-blur dark:bg-slate-900/95 ${selected ? "border-cyan-400 ring-2 ring-cyan-400/30" : "border-slate-200 dark:border-white/10"}`}
      style={style}
      aria-label={summary}
      onClick={onSelect}
      data-testid={`board-result-${result.id}`}
    >
      <header className="flex items-center gap-1 border-b border-slate-200 px-2 py-1.5 dark:border-white/10">
        <span className={`h-2 w-2 rounded-full ${result.status === "success" ? "bg-emerald-500" : result.status === "loading" ? "animate-pulse bg-cyan-500" : "bg-rose-500"}`} />
        <strong className="min-w-0 flex-1 truncate text-sm">{result.title}</strong>
        <button type="button" className="tool-button min-h-8 px-2" onClick={(event) => { event.stopPropagation(); onToggle(); }} aria-label={result.collapsed ? "Expand result" : "Collapse result"}>
          {result.collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <button type="button" className="tool-button min-h-8 px-2 text-rose-600" onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label="Delete result"><Trash2 className="h-4 w-4" /></button>
      </header>

      {!result.collapsed && (
        <div className="max-h-[440px] overflow-y-auto p-2">
          {result.status === "loading" && <p className="py-4 text-center text-sm text-slate-500" aria-live="polite">Calculating with {result.engine.adapter}…</p>}
          {result.status === "error" && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200" role="alert">{result.error?.userMessage}</p>}
          {result.status === "cancelled" && <p className="py-3 text-sm text-slate-500">Calculation cancelled.</p>}
          {result.status === "success" && (
            <>
              {(result.exactOutputLatex || result.plainTextOutput) && <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-2 font-mono text-sm dark:bg-white/5">{result.exactOutputLatex ?? result.plainTextOutput}</pre>}
              {result.graph?.series?.length ? (
                <div className="mt-2" onPointerDown={(event) => event.stopPropagation()}>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <button type="button" className="tool-button min-h-8 px-2" onClick={() => setView((current) => zoomView(current, 0.75))}>Zoom in</button>
                    <button type="button" className="tool-button min-h-8 px-2" onClick={() => setView((current) => zoomView(current, 1.35))}>Zoom out</button>
                    <button type="button" className="tool-button min-h-8 px-2" onClick={() => setView(defaultView)}><RotateCcw className="h-3.5 w-3.5" />Reset</button>
                    <button type="button" className={showGrid ? "action-primary min-h-8 px-2" : "tool-button min-h-8 px-2"} onClick={() => setShowGrid((value) => !value)}><Grid3X3 className="h-3.5 w-3.5" />Grid</button>
                    <button type="button" className={showAxes ? "action-primary min-h-8 px-2" : "tool-button min-h-8 px-2"} onClick={() => setShowAxes((value) => !value)}>Axes</button>
                  </div>
                  <div className="h-64 overflow-hidden">
                    <Suspense fallback={<p className="p-4 text-sm text-slate-500">Loading existing graph engine…</p>}>
                      <FunctionGraphCanvas series={graphSeries} view={view} showGrid={showGrid} showAxes={showAxes} selectedSeriesId={graphSeries[0]?.id} traceX={traceX} onTraceChange={setTraceX} />
                    </Suspense>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{result.graph.accessibilitySummary} Trace x = {traceX.toFixed(2)}</p>
                </div>
              ) : null}
              {result.steps?.length ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-bold">Engine steps ({result.steps.length})</summary>
                  <ol className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {result.steps.map((step) => <li key={step.id}>{step.index + 1}. {step.explanation ?? step.outputLatex}</li>)}
                  </ol>
                </details>
              ) : null}
            </>
          )}

          <div className="mt-2 flex flex-wrap gap-1">
            <button type="button" className="tool-button min-h-8 px-2" onClick={() => navigator.clipboard?.writeText(result.exactOutputLatex ?? result.plainTextOutput ?? "")}><Copy className="h-3.5 w-3.5" />Copy</button>
            <button type="button" className="tool-button min-h-8 px-2" disabled={result.status !== "success" || !result.exactOutputLatex} onClick={onInsert}><Plus className="h-3.5 w-3.5" />Use result</button>
            <button type="button" className="tool-button min-h-8 px-2" onClick={onRerun}><Play className="h-3.5 w-3.5" />Re-run</button>
            {result.workspaceRoute && <Link className="tool-button min-h-8 px-2" to={result.workspaceRoute}><ExternalLink className="h-3.5 w-3.5" />Open workspace</Link>}
          </div>

          <div className="mt-2 flex items-center gap-1" aria-label="Move result without dragging">
            <span className="mr-1 text-xs text-slate-500">Move</span>
            <button type="button" className="tool-button min-h-8 px-2" aria-label="Move result left" onClick={() => onMove(-20, 0)}><MoveLeft className="h-3.5 w-3.5" /></button>
            <button type="button" className="tool-button min-h-8 px-2" aria-label="Move result right" onClick={() => onMove(20, 0)}><MoveRight className="h-3.5 w-3.5" /></button>
            <button type="button" className="tool-button min-h-8 px-2" aria-label="Move result up" onClick={() => onMove(0, -20)}><MoveUp className="h-3.5 w-3.5" /></button>
            <button type="button" className="tool-button min-h-8 px-2" aria-label="Move result down" onClick={() => onMove(0, 20)}><MoveDown className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )}
    </article>
  );
}

function zoomView(view: { xMin: number; xMax: number; yMin: number; yMax: number }, factor: number) {
  const xCenter = (view.xMin + view.xMax) / 2;
  const yCenter = (view.yMin + view.yMax) / 2;
  const xHalf = ((view.xMax - view.xMin) * factor) / 2;
  const yHalf = ((view.yMax - view.yMin) * factor) / 2;
  return { xMin: xCenter - xHalf, xMax: xCenter + xHalf, yMin: yCenter - yHalf, yMax: yCenter + yHalf };
}

