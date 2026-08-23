import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Repeat2, RotateCcw } from "lucide-react";
import {
  samplePlotLayer,
  scaleX,
  scaleY,
  type GraphViewport,
  type PlotItem,
} from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import type { LessonAdapterProps } from "../types";

export const ANIMATION_CONTROL_FRAMES = [0, 0.5, 1, 1.5, 2, 2] as const;

export function animationFrameOutput(frame: number, x = 2) {
  const safeFrame = Math.min(Math.max(Math.round(frame), 0), ANIMATION_CONTROL_FRAMES.length - 1);
  const a = ANIMATION_CONTROL_FRAMES[safeFrame];
  return { frame: safeFrame, a, y: a * x + 1 };
}

const viewport: GraphViewport = {
  xMin: -5,
  xMax: 5,
  yMin: -3,
  yMax: 6,
  width: 640,
  height: 520,
};

const plot: PlotItem = {
  id: "animation-controls-line",
  expression: "a*x+1",
  color: "#1477f8",
  kind: "function",
  visible: true,
};

type PlaybackSpeed = "0.5" | "1" | "2";

const intervalForSpeed: Record<PlaybackSpeed, number> = {
  "0.5": 1400,
  "1": 850,
  "2": 425,
};

export default function AnimationControlsLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [frame, setFrame] = useState(3);
  const [isPlaying, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState<PlaybackSpeed>("1");
  const [reducedMotion, setReducedMotion] = useState(false);
  const current = animationFrameOutput(frame);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(Boolean(media?.matches));
    sync();
    media?.addEventListener?.("change", sync);
    return () => media?.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    setFrame(3);
    setPlaying(false);
    setLoop(true);
    setSpeed("1");
  }, [resetToken]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setFrame((before) => {
        const atEnd = before >= ANIMATION_CONTROL_FRAMES.length - 1;
        if (atEnd && !loop) {
          setPlaying(false);
          return before;
        }
        const after = atEnd ? 0 : before + 1;
        onInteraction(createLessonInteractionEvent({
          controlId: "animation-playback",
          kind: "playback",
          before,
          after,
          affectedOutputs: ["animation-graph", "animation-current-frame", "animation-frame-table"],
        }));
        return after;
      });
    }, reducedMotion ? Math.max(1800, intervalForSpeed[speed]) : intervalForSpeed[speed]);
    return () => window.clearInterval(timer);
  }, [isPlaying, loop, onInteraction, reducedMotion, speed]);

  const currentLayer = useMemo(
    () => samplePlotLayer(plot, viewport, current.a, 0),
    [current.a],
  );
  const previousLayers = useMemo(
    () => [frame - 1, frame - 2]
      .filter((index) => index >= 0)
      .map((index, order) => ({
        ...animationFrameOutput(index),
        order,
        layer: samplePlotLayer(plot, viewport, ANIMATION_CONTROL_FRAMES[index], 0),
      })),
    [frame],
  );

  const selectFrame = (after: number, controlId = "animation-timeline") => {
    const before = frame;
    const safeAfter = Math.min(Math.max(after, 0), ANIMATION_CONTROL_FRAMES.length - 1);
    setFrame(safeAfter);
    setPlaying(false);
    onInteraction(createLessonInteractionEvent({
      controlId,
      kind: "selection",
      before,
      after: safeAfter,
      affectedOutputs: ["animation-graph", "animation-current-frame", "animation-frame-table"],
    }));
  };

  const togglePlayback = () => {
    const after = !isPlaying;
    if (after && frame === ANIMATION_CONTROL_FRAMES.length - 1 && !loop) setFrame(0);
    setPlaying(after);
    onInteraction(createLessonInteractionEvent({
      controlId: "animation-playback",
      kind: "playback",
      before: isPlaying,
      after,
      affectedOutputs: ["animation-graph", "animation-current-frame"],
    }));
  };

  const changeSpeed = (after: PlaybackSpeed) => {
    const before = speed;
    setSpeed(after);
    onInteraction(createLessonInteractionEvent({
      controlId: "animation-speed",
      kind: "selection",
      before,
      after,
      affectedOutputs: ["animation-playback"],
    }));
  };

  const changeLoop = (after: boolean) => {
    const before = loop;
    setLoop(after);
    onInteraction(createLessonInteractionEvent({
      controlId: "animation-loop",
      kind: "toggle",
      before,
      after,
      affectedOutputs: ["animation-playback"],
    }));
  };

  const reset = () => {
    const before = frame;
    setFrame(0);
    setPlaying(false);
    onInteraction(createLessonInteractionEvent({
      controlId: "animation-reset",
      kind: "selection",
      before,
      after: 0,
      affectedOutputs: ["animation-graph", "animation-current-frame", "animation-frame-table"],
    }));
  };

  return (
    <AdapterFrame
      title="Animation Controls"
      value={`a = ${current.a.toFixed(1)}`}
      footer="The existing 2D graph sampler recalculates y = ax + 1 at every frame; pause to compare exact values."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section
          className="min-w-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/35 to-violet-50/35 p-3 dark:border-white/10 dark:from-slate-950 dark:via-sky-300/5 dark:to-violet-300/10 sm:p-4"
          aria-label="Animated graph of y equals a x plus 1"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 dark:text-blue-200">
                Animation rule
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                Animate parameter a from 0 to 2
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Watch the line rotate about the fixed point (0, 1), then pause to inspect the slope.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-serif text-lg font-black italic text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">
              y = ax + 1
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
            <svg
              viewBox={`0 0 ${viewport.width} ${viewport.height}`}
              className="block aspect-[16/13] min-h-[320px] w-full"
              role="img"
              aria-labelledby="animation-graph-title animation-graph-desc"
              data-testid="animation-graph"
            >
              <title id="animation-graph-title">Animated family of lines y equals a x plus 1</title>
              <desc id="animation-graph-desc">
                The current line has slope {current.a.toFixed(1)}, passes through zero comma one,
                and has value {current.y.toFixed(1)} when x equals two. Two previous frames are shown
                as lighter dashed lines when available.
              </desc>
              <GraphGrid />
              {previousLayers.slice().reverse().map(({ frame: previousFrame, layer, order, a }) => (
                <g key={previousFrame} opacity={order === 0 ? 0.48 : 0.25}>
                  {layer.paths.map((path, index) => (
                    <path
                      key={index}
                      d={path}
                      fill="none"
                      stroke="#5ca9ff"
                      strokeWidth={3}
                      strokeDasharray={order === 0 ? "10 8" : "3 8"}
                      strokeLinecap="round"
                    />
                  ))}
                  <title>{`Previous frame ${previousFrame}: a = ${a.toFixed(1)}`}</title>
                </g>
              ))}
              {currentLayer.paths.map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="none"
                  stroke="#1477f8"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              ))}
              <GraphPoint x={0} y={1} label="(0, 1)" labelDx={-42} labelDy={-16} />
              <GraphPoint x={2} y={current.y} label={`(2, ${formatNumber(current.y)})`} labelDx={12} labelDy={-16} />
            </svg>
            <div className="grid gap-2 border-t border-slate-200 p-3 text-xs font-bold text-slate-600 dark:border-white/10 dark:text-slate-300 sm:grid-cols-3">
              <LegendLine label={`Current: a = ${current.a.toFixed(1)}`} variant="current" />
              <LegendLine
                label={frame > 0 ? `Previous: a = ${ANIMATION_CONTROL_FRAMES[frame - 1].toFixed(1)}` : "Previous: none"}
                variant="previous"
              />
              <LegendLine
                label={frame > 1 ? `Earlier: a = ${ANIMATION_CONTROL_FRAMES[frame - 2].toFixed(1)}` : "Earlier: none"}
                variant="earlier"
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="animation-timeline" className="text-sm font-black text-slate-900 dark:text-white">
                Timeline
              </label>
              <output
                htmlFor="animation-timeline"
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700 dark:bg-orange-300/10 dark:text-orange-100"
              >
                Frame {frame}
              </output>
            </div>
            <input
              id="animation-timeline"
              aria-label="Animation frame"
              className="mt-4 w-full accent-blue-600"
              type="range"
              min={0}
              max={ANIMATION_CONTROL_FRAMES.length - 1}
              step={1}
              value={frame}
              onChange={(event) => selectFrame(Number(event.target.value))}
            />
            <div className="mt-1 flex justify-between px-1 text-[11px] font-black text-slate-500 dark:text-slate-400" aria-hidden="true">
              {ANIMATION_CONTROL_FRAMES.map((_, index) => <span key={index}>{index}</span>)}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <PlaybackButton
                primary
                icon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlayback}
              />
              <PlaybackButton
                icon={<ChevronLeft className="h-4 w-4" />}
                label="Step back"
                onClick={() => selectFrame(frame - 1, "animation-step-back")}
                disabled={frame === 0}
              />
              <PlaybackButton
                icon={<ChevronRight className="h-4 w-4" />}
                label="Step forward"
                onClick={() => selectFrame(frame + 1, "animation-step-forward")}
                disabled={frame === ANIMATION_CONTROL_FRAMES.length - 1}
              />
              <PlaybackButton
                icon={<RotateCcw className="h-4 w-4" />}
                label="Reset"
                onClick={reset}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-3" aria-label="Animation settings and exact outputs">
          <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-300/20 dark:bg-blue-300/10">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-blue-600 dark:bg-slate-950 dark:text-blue-200">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-200">
                  Guided investigation
                </p>
                <p className="mt-1 text-base font-black text-slate-950 dark:text-white">
                  What changes—and what stays fixed?
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                  As a increases, the slope grows. The y-intercept remains 1, so every line pivots around (0, 1).
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Playback settings</h3>
            <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
              <label htmlFor="animation-speed" className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Speed
              </label>
              <select
                id="animation-speed"
                className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                value={speed}
                onChange={(event) => changeSpeed(event.target.value as PlaybackSpeed)}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
              </select>
              <label htmlFor="animation-loop" className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Loop
              </label>
              <input
                id="animation-loop"
                type="checkbox"
                className="h-5 w-5 accent-blue-600"
                checked={loop}
                onChange={(event) => changeLoop(event.target.checked)}
              />
            </div>
            {reducedMotion ? (
              <p className="mt-3 rounded-xl bg-violet-50 p-2 text-xs font-bold leading-5 text-violet-800 dark:bg-violet-300/10 dark:text-violet-100">
                Reduced motion is enabled, so automatic frames advance more slowly. Step controls remain available.
              </p>
            ) : null}
          </section>

          <section
            className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-blue-300/20 dark:from-blue-300/10 dark:to-cyan-300/10"
            aria-live="polite"
            data-testid="animation-current-frame"
          >
            <p className="text-[10px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-200">
              Current frame {frame}
            </p>
            <p className="mt-2 font-serif text-3xl font-black italic text-blue-700 dark:text-blue-100">
              a = {current.a.toFixed(1)}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              Slope = {current.a.toFixed(1)}; y-intercept = 1
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <p className="text-xs font-black text-slate-700 dark:text-slate-200">Exact output at x = 2</p>
            <p className="mt-2 font-serif text-2xl font-black italic text-blue-700 dark:text-blue-100">
              y(2) = {formatNumber(current.y)}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {current.a.toFixed(1)} × 2 + 1 = {formatNumber(current.y)}
            </p>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70">
            <h3 className="px-4 pt-4 text-sm font-black text-slate-900 dark:text-white">Frame table</h3>
            <div className="overflow-x-auto p-3">
              <table className="w-full min-w-[310px] border-separate border-spacing-0 text-center text-xs" data-testid="animation-frame-table">
                <caption className="sr-only">Values of a, the equation, and y at x equals 2 for each animation frame.</caption>
                <thead>
                  <tr className="bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    <th className="rounded-l-lg px-2 py-2 text-left">Frame</th>
                    <th className="px-2 py-2">a</th>
                    <th className="px-2 py-2">y = ax + 1</th>
                    <th className="rounded-r-lg px-2 py-2">y(2)</th>
                  </tr>
                </thead>
                <tbody>
                  {ANIMATION_CONTROL_FRAMES.map((a, index) => {
                    const output = animationFrameOutput(index);
                    const active = index === frame;
                    return (
                      <tr key={index}>
                        <td className="p-1" colSpan={4}>
                          <button
                            type="button"
                            aria-current={active ? "step" : undefined}
                            className={active
                              ? "grid w-full grid-cols-[0.65fr_0.65fr_1.6fr_0.65fr] items-center rounded-lg border border-orange-300 bg-orange-50 px-1 py-2 font-black text-orange-700 dark:bg-orange-300/10 dark:text-orange-100"
                              : "grid w-full grid-cols-[0.65fr_0.65fr_1.6fr_0.65fr] items-center rounded-lg px-1 py-2 font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-blue-300/10 dark:hover:text-blue-100"}
                            onClick={() => selectFrame(index, "animation-frame-table")}
                          >
                            <span className="text-left">{index}</span>
                            <span>{a.toFixed(1)}</span>
                            <span className="font-serif italic">y = {a.toFixed(1)}x + 1</span>
                            <span>{formatNumber(output.y)}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-100">
              Key takeaway
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-emerald-950 dark:text-emerald-100">
              Animation is a sequence of exact mathematical states. Pause any frame to connect the visible motion to its parameter value and equation.
            </p>
          </section>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function GraphGrid() {
  const xTicks = [-4, -2, 0, 2, 4];
  const yTicks = [-2, 0, 2, 4, 6];
  const xAxis = scaleY(0, viewport);
  const yAxis = scaleX(0, viewport);
  return (
    <g aria-hidden="true">
      <defs>
        <pattern id="animation-minor-grid" width="32" height="26" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 26" fill="none" stroke="#dbeafe" strokeWidth="1" opacity="0.7" />
        </pattern>
      </defs>
      <rect width={viewport.width} height={viewport.height} fill="url(#animation-minor-grid)" />
      <line x1={0} y1={xAxis} x2={viewport.width} y2={xAxis} stroke="#0f172a" strokeWidth="2" />
      <line x1={yAxis} y1={0} x2={yAxis} y2={viewport.height} stroke="#0f172a" strokeWidth="2" />
      {xTicks.map((tick) => (
        <g key={`x-${tick}`}>
          <line x1={scaleX(tick, viewport)} y1={xAxis - 5} x2={scaleX(tick, viewport)} y2={xAxis + 5} stroke="#0f172a" />
          <text x={scaleX(tick, viewport)} y={xAxis + 20} textAnchor="middle" className="fill-slate-500 text-[12px]">{tick}</text>
        </g>
      ))}
      {yTicks.filter((tick) => tick !== 0).map((tick) => (
        <g key={`y-${tick}`}>
          <line x1={yAxis - 5} y1={scaleY(tick, viewport)} x2={yAxis + 5} y2={scaleY(tick, viewport)} stroke="#0f172a" />
          <text x={yAxis - 10} y={scaleY(tick, viewport) + 4} textAnchor="end" className="fill-slate-500 text-[12px]">{tick}</text>
        </g>
      ))}
      <text x={viewport.width - 14} y={xAxis - 10} className="fill-slate-900 text-[14px] font-bold">x</text>
      <text x={yAxis + 10} y={16} className="fill-slate-900 text-[14px] font-bold">y</text>
    </g>
  );
}

function GraphPoint({
  x,
  y,
  label,
  labelDx,
  labelDy,
}: {
  x: number;
  y: number;
  label: string;
  labelDx: number;
  labelDy: number;
}) {
  const cx = scaleX(x, viewport);
  const cy = scaleY(y, viewport);
  return (
    <g aria-hidden="true">
      <circle cx={cx} cy={cy} r={7} fill="#1477f8" stroke="white" strokeWidth={3} />
      <text x={cx + labelDx} y={cy + labelDy} className="fill-blue-600 text-[15px] font-black">{label}</text>
    </g>
  );
}

function LegendLine({ label, variant }: { label: string; variant: "current" | "previous" | "earlier" }) {
  const style = variant === "current"
    ? "border-blue-600"
    : variant === "previous"
      ? "border-blue-400 border-dashed"
      : "border-blue-300 border-dotted";
  return <span className="inline-flex items-center gap-2"><span className={`w-8 border-t-2 ${style}`} />{label}</span>;
}

function PlaybackButton({
  icon,
  label,
  onClick,
  disabled = false,
  primary = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={primary
        ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-black text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-blue-300/10"}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
