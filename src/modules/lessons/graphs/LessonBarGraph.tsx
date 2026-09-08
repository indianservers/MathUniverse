import { useState, type CSSProperties } from "react";

export type LessonBar = {
  id: string;
  label: string;
  value: number;
  color: string;
  /** Explicit display ratio from the lesson. Never infer or normalize lesson scales. */
  fraction: number;
  revealed?: boolean;
};

/** Categorical data adapter: exact values and a lesson-defined display scale. */
export function LessonBarGraph({ bars, label, kind='bar', highlightedId }: { bars: LessonBar[]; label: string; kind?:'bar'|'dot'; highlightedId?:string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = bars.find(bar => bar.id === selectedId);
  return <div className="lesson-bar-graph" data-graph-family={kind==='dot'?'categorical-dots':'categorical-bars'} data-mark={kind}>
    <div className="lesson-bar-scroll" role="region" aria-label={label} tabIndex={0}>
      <div className="lesson-bars" style={{ "--bar-count": bars.length } as CSSProperties}>
        {bars.map(bar => <button key={bar.id} type="button" className="lesson-bar" aria-label={`${bar.label} = ${bar.value}`} aria-pressed={selectedId === bar.id}
          data-value={bar.value} data-fraction={bar.fraction} data-revealed={bar.revealed !== false} data-highlighted={highlightedId===bar.id}
          style={{ "--bar-height": `${Math.max(0, Math.min(1, bar.fraction)) * 100}%`, "--bar-color": bar.color, opacity: bar.revealed === false ? .2 : 1 } as CSSProperties}
          onClick={() => setSelectedId(bar.id)} onFocus={() => setSelectedId(bar.id)}>
          <span className="lesson-bar-value">{bar.value}</span>
          <span className="lesson-bar-plot" aria-hidden="true"><i /></span>
          <span className="lesson-bar-label">{bar.label}</span>
        </button>)}
      </div>
    </div>
    <output className="lesson-graph-tooltip" aria-live="polite">{selected ? `${selected.label} = ${selected.value}` : `Select a ${kind==='dot'?'dot':'bar'} to inspect its value.`}</output>
  </div>;
}
