import { Pause, Play, Repeat2, Rewind, StepForward } from "lucide-react";
import type { GraphStudioVariable } from "./types";

export default function GraphAnimationTimeline({ variables, onChange }: { variables: GraphStudioVariable[]; onChange: (variables: GraphStudioVariable[]) => void }) {
  const primary = variables[0];
  const playing = variables.some((item) => item.playing);
  return <section className="sticky bottom-2 z-30 hidden min-h-14 flex-wrap items-center gap-2 rounded-lg border border-cyan-300/30 bg-slate-950/95 p-2 text-white shadow-xl backdrop-blur md:flex" aria-label="Animation timeline">
    <span className="px-2 text-[10px] font-black uppercase text-cyan-300">Timeline</span>
    <button type="button" className="tooltip-icon flex h-10 w-10 items-center justify-center rounded-md bg-white/10" aria-label={playing ? "Pause animation" : "Play animation"} data-tooltip={playing ? "Pause" : "Play"} disabled={!variables.length} onClick={() => onChange(variables.map((item) => ({ ...item, playing: !playing })))}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
    <button type="button" className="tooltip-icon flex h-10 w-10 items-center justify-center rounded-md bg-white/10" aria-label="Reverse animation" data-tooltip="Reverse" disabled={!variables.length} onClick={() => onChange(variables.map((item) => ({ ...item, direction: item.direction === 1 ? -1 : 1 })))}><Rewind className="h-4 w-4" /></button>
    <button type="button" className="tooltip-icon flex h-10 w-10 items-center justify-center rounded-md bg-white/10" aria-label="Step animation" data-tooltip="Step" disabled={!variables.length} onClick={() => onChange(variables.map((item) => ({ ...item, value: Math.min(item.max, item.value + item.step) })))}><StepForward className="h-4 w-4" /></button>
    {primary ? <>
      <label className="min-w-[150px] flex-1 text-[10px] font-bold uppercase text-slate-400">{primary.name} = {format(primary.value)}<input aria-label="Timeline scrubber" className="mt-1 w-full accent-cyan-400" type="range" min={primary.min} max={primary.max} step={primary.step} value={primary.value} onChange={(event) => onChange(variables.map((item, index) => index === 0 ? { ...item, value: Number(event.target.value) } : item))} /></label>
      <label className="flex min-h-10 items-center gap-2 rounded-md bg-white/10 px-2 text-xs font-bold"><Repeat2 className="h-4 w-4" /><select aria-label="Timeline playback mode" className="bg-transparent" value={primary.playback} onChange={(event) => onChange(variables.map((item) => ({ ...item, playback: event.target.value as GraphStudioVariable["playback"] })))}><option className="bg-slate-950" value="loop">Loop</option><option className="bg-slate-950" value="ping-pong">Ping-pong</option></select></label>
      <label className="flex min-h-10 items-center gap-1 rounded-md bg-white/10 px-2 text-xs font-bold">Speed<input aria-label="Timeline speed" type="number" min="0.1" step="0.1" className="w-14 bg-transparent font-mono" value={primary.speed} onChange={(event) => onChange(variables.map((item) => ({ ...item, speed: Math.max(0.1, Number(event.target.value)) })))} /></label>
    </> : <p className="flex-1 text-xs text-slate-400">Create a parameter slider to activate the timeline.</p>}
  </section>;
}

function format(value: number) {
  return Number(value.toFixed(3)).toString();
}
