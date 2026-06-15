import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";

type ProofControlsProps = {
  activeStep: number;
  totalSteps: number;
  isPlaying: boolean;
  labelsVisible: boolean;
  formulaVisible: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleLabels: () => void;
  onToggleFormula: () => void;
  playLabel?: string;
  labelsToggleLabel?: string;
  formulaToggleLabel?: string;
};

export default function ProofControls({
  activeStep,
  totalSteps,
  isPlaying,
  labelsVisible,
  formulaVisible,
  onPlay,
  onPause,
  onReset,
  onPrevious,
  onNext,
  onToggleLabels,
  onToggleFormula,
  playLabel = "Play proof",
  labelsToggleLabel = "Show labels",
  formulaToggleLabel = "Show formula",
}: ProofControlsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Proof controls">
      <h2 className="text-base font-black text-slate-950 dark:text-white">Watch controls</h2>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Use one button at a time. Slow is better for proofs.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
        <button type="button" className="action-primary rounded-xl px-3" onClick={isPlaying ? onPause : onPlay} aria-label={isPlaying ? "Pause animation" : playLabel}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause" : "Play story"}
        </button>
        <button type="button" className="math-tool-button w-full" onClick={onReset} aria-label="Reset proof">
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset</span>
        </button>
        <button type="button" className="action-secondary rounded-xl px-3" onClick={onPrevious} disabled={activeStep === 0}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back step
        </button>
        <button type="button" className="action-secondary rounded-xl px-3" onClick={onNext} disabled={activeStep === totalSteps - 1}>
          Next step <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <label className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
          {labelsToggleLabel}
          <input type="checkbox" checked={labelsVisible} onChange={onToggleLabels} className="h-5 w-5 accent-cyan-500" />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
          {formulaToggleLabel}
          <input type="checkbox" checked={formulaVisible} onChange={onToggleFormula} className="h-5 w-5 accent-cyan-500" />
        </label>
      </div>
    </section>
  );
}
