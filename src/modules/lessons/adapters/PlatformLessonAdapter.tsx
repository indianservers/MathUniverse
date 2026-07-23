import { useEffect, useRef, useState } from "react";
import { Eye, Keyboard, MousePointer2, RotateCcw, ZoomIn } from "lucide-react";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

export default function PlatformLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [x, setX] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [contrast, setContrast] = useState(false);
  const targetRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { setX(50); setZoom(1); setContrast(false); }, [lesson.id, resetToken]);
  const move = (next: number) => { setX(Math.max(8, Math.min(92, next))); onInteraction(); };
  const capability = capabilityKind(lesson.title);

  return (
    <AdapterFrame title={`${lesson.title} capability check`} value={`${Math.round(x)}%`} footer="The same state responds to pointer, touch, buttons, and keyboard input.">
      <div className={contrast ? "rounded-xl bg-black p-4 text-white" : "rounded-xl bg-slate-50 p-4 dark:bg-slate-900"}>
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className="action-secondary" onClick={() => { setZoom((value) => value >= 1.5 ? 1 : value + 0.25); onInteraction(); }}><ZoomIn className="h-4 w-4" />Zoom</button>
          <button type="button" className="action-secondary" onClick={() => { setContrast((value) => !value); onInteraction(); }}><Eye className="h-4 w-4" />Contrast</button>
          <button type="button" className="action-secondary" onClick={() => { setX(50); setZoom(1); onInteraction(); }}><RotateCcw className="h-4 w-4" />Reset view</button>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-xl border-2 border-dashed border-cyan-400" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
          <div className="absolute inset-x-8 top-1/2 h-2 rounded-full bg-slate-300" />
          <button ref={targetRef} type="button" className="absolute top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500 text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400" style={{ left: `${x}%` }} aria-label={`Movable lesson point at ${Math.round(x)} percent. Use left and right arrow keys.`} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(x - 4); if (event.key === "ArrowRight") move(x + 4); }} onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; const bounds = event.currentTarget.parentElement?.getBoundingClientRect(); if (bounds) move(((event.clientX - bounds.left) / bounds.width) * 100); }}><MousePointer2 className="mx-auto h-5 w-5" /></button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold"><span className="flex items-center gap-1"><Keyboard className="h-4 w-4" />Arrow keys supported</span><span>{capability}</span></div>
      </div>
    </AdapterFrame>
  );
}

function capabilityKind(title: string) {
  if (/keyboard|screen reader|language/i.test(title)) return "Accessible semantics";
  if (/save|share|export/i.test(title)) return "Portable state";
  if (/animation|trace|locus/i.test(title)) return "Visible change";
  if (/contrast|text/i.test(title)) return "Readable display";
  return "Direct manipulation";
}
