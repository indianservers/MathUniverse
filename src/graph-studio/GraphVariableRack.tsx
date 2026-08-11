import { Pause, Play, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { createGraphVariable, detectGraphVariables } from "./expressionEngine";
import type { GraphStudioVariable } from "./types";

export default function GraphVariableRack({ expressions, variables, onChange }: { expressions: string[]; variables: GraphStudioVariable[]; onChange: (variables: GraphStudioVariable[]) => void }) {
  const detected = useMemo(() => detectGraphVariables(expressions), [expressions]);

  useEffect(() => {
    if (!variables.some((item) => item.playing)) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const seconds = Math.min(0.1, (now - previous) / 1000);
      previous = now;
      onChange(variables.map((variable) => advanceVariable(variable, seconds)));
    }, 40);
    return () => window.clearInterval(timer);
  }, [onChange, variables]);

  const missing = detected.filter((name) => !variables.some((item) => item.name === name));
  return (
    <section className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/70" aria-label="Dynamic variables">
      <div className="flex items-center justify-between gap-2">
        <div><h3 className="text-sm font-black">Variables & animation</h3><p className="text-xs text-slate-500">Parameters update the scene in real time.</p></div>
        {missing.length > 0 && <button type="button" className="tool-button" onClick={() => onChange([...variables, ...missing.map((name) => createGraphVariable(name))])}><Plus className="h-4 w-4" />Create {missing.join(", ")}</button>}
      </div>
      {variables.length ? <div className="mt-3 space-y-3">{variables.map((variable) => (
        <div key={variable.id} className="rounded-md border border-slate-200 p-2 dark:border-white/10">
          <div className="flex items-center gap-2">
            <strong className="w-8 font-mono text-cyan-700 dark:text-cyan-200">{variable.name}</strong>
            <input aria-label={`${variable.name} value`} type="number" className="w-20 rounded border border-slate-200 bg-transparent px-2 py-1 font-mono text-sm dark:border-white/10" value={variable.value} step={variable.step} onChange={(event) => patch(variable.id, { value: Number(event.target.value) })} />
            <button type="button" className="tooltip-icon ml-auto rounded p-2 hover:bg-cyan-100 dark:hover:bg-cyan-400/10" aria-label={variable.playing ? `Pause ${variable.name}` : `Animate ${variable.name}`} data-tooltip={variable.playing ? "Pause" : "Animate"} onClick={() => patch(variable.id, { playing: !variable.playing })}>{variable.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
            <button type="button" className="tooltip-icon rounded p-2 text-rose-500" aria-label={`Delete variable ${variable.name}`} data-tooltip="Delete variable" onClick={() => onChange(variables.filter((item) => item.id !== variable.id))}><Trash2 className="h-4 w-4" /></button>
          </div>
          <input aria-label={`${variable.name} slider`} type="range" className="slider-range mt-2 w-full" min={variable.min} max={variable.max} step={variable.step} value={variable.value} onChange={(event) => patch(variable.id, { value: Number(event.target.value) })} />
          <div className="mt-2 grid grid-cols-4 gap-2">
            <MiniNumber label="Min" value={variable.min} onChange={(value) => patch(variable.id, { min: Math.min(value, variable.max - variable.step) })} />
            <MiniNumber label="Max" value={variable.max} onChange={(value) => patch(variable.id, { max: Math.max(value, variable.min + variable.step) })} />
            <MiniNumber label="Step" value={variable.step} onChange={(value) => patch(variable.id, { step: Math.max(0.0001, Math.abs(value)) })} />
            <MiniNumber label="Speed" value={variable.speed} onChange={(value) => patch(variable.id, { speed: Math.max(0.1, value) })} />
          </div>
        </div>
      ))}</div> : <p className="mt-3 rounded-md bg-slate-100 p-3 text-xs font-semibold text-slate-500 dark:bg-white/5">Use parameters such as a, b, c, or r in an expression to create sliders.</p>}
    </section>
  );

  function patch(id: string, values: Partial<GraphStudioVariable>) {
    onChange(variables.map((item) => item.id === id ? { ...item, ...values } : item));
  }
}

function MiniNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="text-[10px] font-bold uppercase text-slate-500">{label}<input aria-label={label} type="number" className="mt-1 w-full rounded border border-slate-200 bg-transparent px-1 py-1 text-xs dark:border-white/10" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function advanceVariable(variable: GraphStudioVariable, seconds: number) {
  if (!variable.playing) return variable;
  let value = variable.value + variable.direction * variable.speed * seconds;
  let direction = variable.direction;
  if (value > variable.max || value < variable.min) {
    if (variable.playback === "ping-pong") {
      direction = variable.direction === 1 ? -1 : 1;
      value = Math.max(variable.min, Math.min(variable.max, value));
    } else value = value > variable.max ? variable.min : variable.max;
  }
  return { ...variable, value, direction };
}
