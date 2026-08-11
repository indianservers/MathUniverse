import { BookOpen, X } from "lucide-react";
import { useState } from "react";
import type { GraphStudioDimension } from "./types";

export type GraphStudioExample = { name: string; equation: string; description: string; accent: string };

export const graphStudio2DExamples: GraphStudioExample[] = [
  { name: "Linear", equation: "y = 2x + 1", description: "Constant slope and intercept.", accent: "#06b6d4" },
  { name: "Quadratic", equation: "y = x^2 - 4", description: "A parabola with two roots.", accent: "#f97316" },
  { name: "Cubic", equation: "y = x^3 - 3x", description: "Turning points and three roots.", accent: "#8b5cf6" },
  { name: "Sine wave", equation: "y = sin(x)", description: "Periodic oscillation.", accent: "#10b981" },
  { name: "Exponential", equation: "y = exp(0.4x)", description: "Continuous growth.", accent: "#ef4444" },
  { name: "Logarithm", equation: "y = ln(x)", description: "Inverse exponential behavior.", accent: "#eab308" },
  { name: "Circle", equation: "x^2 + y^2 = 25", description: "Implicit circle of radius five.", accent: "#ec4899" },
  { name: "Dynamic wave", equation: "y = a*sin(b*x+c)", description: "Amplitude, frequency, and phase sliders.", accent: "#14b8a6" },
  { name: "Lissajous", equation: "x = cos(3t), y = sin(2t)", description: "Parametric harmonic curve.", accent: "#6366f1" },
  { name: "Rose curve", equation: "r = 4sin(3theta)", description: "Three-petal polar curve.", accent: "#f43f5e" },
];

export const graphStudio3DExamples: GraphStudioExample[] = [
  { name: "Paraboloid", equation: "z = 0.25*(x^2+y^2)", description: "Convex optimization bowl.", accent: "#06b6d4" },
  { name: "Saddle", equation: "z = 0.35*(x^2-y^2)", description: "Rises and falls across principal axes.", accent: "#f97316" },
  { name: "Sine surface", equation: "z = sin(x)*cos(y)", description: "Two-dimensional standing wave.", accent: "#8b5cf6" },
  { name: "Ripple", equation: "z = sin(3*sqrt(x^2+y^2))/(1+x^2+y^2)", description: "Radial damped oscillation.", accent: "#10b981" },
  { name: "Gaussian", equation: "z = exp(-(x^2+y^2))", description: "Bell-shaped probability surface.", accent: "#ef4444" },
  { name: "Cone", equation: "z = sqrt(x^2+y^2)", description: "Linear radial height.", accent: "#eab308" },
  { name: "Dynamic bowl", equation: "z = a*(x^2+y^2)", description: "Animated curvature parameter.", accent: "#ec4899" },
];

export default function GraphExamplesGallery({ dimension, onOpen }: { dimension: GraphStudioDimension; onOpen: (example: GraphStudioExample) => void }) {
  const [open, setOpen] = useState(false);
  const examples = dimension === "2d" ? graphStudio2DExamples : graphStudio3DExamples;
  return <>
    <button type="button" className="tool-button" onClick={() => setOpen(true)}><BookOpen className="h-4 w-4" />Examples</button>
    {open && <div className="fixed inset-0 z-[80] flex items-end bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${dimension.toUpperCase()} examples gallery`}>
      <div className="max-h-[88vh] w-full max-w-5xl overflow-auto rounded-t-lg bg-white p-4 shadow-2xl dark:bg-slate-950 sm:rounded-lg">
        <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Graph Studio {dimension.toUpperCase()} examples</h2><p className="text-sm text-slate-500">Open any example as an editable project.</p></div><button type="button" className="tooltip-icon rounded p-2" aria-label="Close examples" data-tooltip="Close" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{examples.map((example) => <article key={example.name} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
          <div className="h-16 rounded-md" style={{ background: `linear-gradient(135deg, ${example.accent}33, transparent), repeating-linear-gradient(0deg, transparent 0 15px, ${example.accent}22 16px), repeating-linear-gradient(90deg, transparent 0 15px, ${example.accent}22 16px)` }} aria-hidden="true" />
          <h3 className="mt-3 font-black">{example.name}</h3><code className="mt-1 block overflow-x-auto text-xs text-cyan-700 dark:text-cyan-200">{example.equation}</code><p className="mt-2 text-sm text-slate-500">{example.description}</p>
          <button type="button" className="action-primary mt-3 w-full justify-center" onClick={() => { onOpen(example); setOpen(false); }}>Open project</button>
        </article>)}</div>
      </div>
    </div>}
  </>;
}
