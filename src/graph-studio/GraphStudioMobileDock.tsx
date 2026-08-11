import { Eye, Keyboard, Layers3, Palette } from "lucide-react";

export default function GraphStudioMobileDock({ targets }: { targets: { expressions: string; tools: string; style: string; view: string } }) {
  const items = [
    { label: "Expressions", target: targets.expressions, icon: Layers3 },
    { label: "Tools", target: targets.tools, icon: Keyboard },
    { label: "Style", target: targets.style, icon: Palette },
    { label: "View", target: targets.view, icon: Eye },
  ];
  return <nav className="fixed inset-x-2 bottom-20 z-50 grid grid-cols-4 rounded-lg border border-white/10 bg-slate-950/95 p-1 text-white shadow-2xl backdrop-blur md:hidden" aria-label="Graph Studio mobile panels">
    {items.map(({ label, target, icon: Icon }) => <button key={label} type="button" className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-bold hover:bg-cyan-400/15" onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}><Icon className="h-4 w-4" />{label}</button>)}
  </nav>;
}
