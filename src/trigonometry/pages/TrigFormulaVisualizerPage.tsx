import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FormulaComparisonGraph from "../components/formula-visualizer/FormulaComparisonGraph";
import FormulaGallery from "../components/formula-visualizer/FormulaGallery";
import FormulaJourneyMode from "../components/formula-visualizer/FormulaJourneyMode";
import FormulaPracticeMode from "../components/formula-visualizer/FormulaPracticeMode";
import FormulaSelector from "../components/formula-visualizer/FormulaSelector";
import IdentityProofPanel from "../components/formula-visualizer/IdentityProofPanel";
import MisconceptionAlerts from "../components/formula-visualizer/MisconceptionAlerts";
import UnitCircleFormulaVisualizer from "../components/formula-visualizer/UnitCircleFormulaVisualizer";
import {
  type AngleUnit,
  type ExplanationLevel,
  type TrigFormulaId,
  computeTrigFormulaValues,
  formatAngle,
  formatTrigNumber,
  getFormulaDefinition,
  normalizeDegrees,
  snapToSpecialAngle,
  specialAngleMarkers,
} from "../utils/trigFormulaUtils";

export default function TrigFormulaVisualizerPage() {
  const [degrees, setDegrees] = useState(45);
  const [selectedFormulaId, setSelectedFormulaId] = useState<TrigFormulaId>("sin");
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>("degrees");
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>("simple");
  const [compareEvenOdd, setCompareEvenOdd] = useState(false);
  const [compareComplementary, setCompareComplementary] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const values = useMemo(() => computeTrigFormulaValues(degrees), [degrees]);
  const selectedFormula = getFormulaDefinition(selectedFormulaId);

  const updateDegrees = (nextDegrees: number) => {
    const normalized = normalizeDegrees(nextDegrees);
    setDegrees(snapEnabled ? snapToSpecialAngle(normalized) : normalized);
  };

  const selectFormula = (formulaId: TrigFormulaId) => {
    setSelectedFormulaId(formulaId);
    if (formulaId.startsWith("even-")) setCompareEvenOdd(true);
    if (formulaId.startsWith("comp-")) setCompareComplementary(true);
  };

  return (
    <main className="desktop-page-shell" data-testid="trig-formula-visualizer-page">
      <div className="desktop-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Trigono / Formula Visualizer</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Trigonometric Formula Visualizer
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Drag theta on the unit circle and watch sine, cosine, tangent, squared ratios, and the core identity change as geometry.
            </p>
          </div>
          <Link to="/trigonometry" className="action-secondary w-fit">
            Back to Trigonometry
          </Link>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
        <div className="min-w-0 space-y-4">
          <UnitCircleFormulaVisualizer
            values={values}
            selectedFormulaId={selectedFormulaId}
            onAngleChange={updateDegrees}
            compareEvenOdd={compareEvenOdd}
            compareComplementary={compareComplementary}
          />

          <section className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/50" aria-label="Angle controls">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-950 dark:text-white">theta angle</span>
                  <span className="rounded-lg bg-cyan-50 px-2 py-1 font-mono text-sm font-black text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100" data-testid="theta-live-value">
                    {angleUnit === "degrees" ? `${values.degrees.toFixed(0)} deg` : `${values.radians.toFixed(3)} rad`} / {values.radiansLabel}
                  </span>
                </div>
                <input
                  className="slider-range w-full cursor-pointer appearance-none accent-cyan-500 touch-pan-x"
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={values.degrees}
                  onChange={(event) => updateDegrees(Number(event.target.value))}
                  aria-label="theta angle"
                  aria-valuetext={formatAngle(values, angleUnit)}
                  data-testid="theta-slider"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <Metric label="display" value={formatAngle(values, angleUnit)} />
                <Metric label="point" value={`(${formatTrigNumber(values.coordinate.x)}, ${formatTrigNumber(values.coordinate.y)})`} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Formula visualizer controls">
              <button
                type="button"
                className={snapEnabled ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-100" : "mini-chip"}
                onClick={() => setSnapEnabled((value) => !value)}
                data-testid="snap-toggle"
                aria-pressed={snapEnabled}
              >
                Snap special angles
              </button>
              <button
                type="button"
                className={angleUnit === "radians" ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-100" : "mini-chip"}
                onClick={() => setAngleUnit((unit) => (unit === "degrees" ? "radians" : "degrees"))}
                data-testid="angle-unit-toggle"
              >
                {angleUnit === "degrees" ? "Show radians" : "Show degrees"}
              </button>
              <button type="button" className="mini-chip" onClick={() => setDegrees(45)} data-testid="reset-angle-button">
                Reset
              </button>
              <button
                type="button"
                className={compareEvenOdd ? "mini-chip bg-rose-100 text-rose-800 dark:bg-rose-400/20 dark:text-rose-100" : "mini-chip"}
                onClick={() => setCompareEvenOdd((value) => !value)}
                data-testid="even-odd-compare-toggle"
                aria-pressed={compareEvenOdd}
              >
                Compare theta and -theta
              </button>
              <button
                type="button"
                className={compareComplementary ? "mini-chip bg-sky-100 text-sky-800 dark:bg-sky-400/20 dark:text-sky-100" : "mini-chip"}
                onClick={() => setCompareComplementary((value) => !value)}
                data-testid="complementary-compare-toggle"
                aria-pressed={compareComplementary}
              >
                Compare theta and 90 deg - theta
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Special angle markers">
              {specialAngleMarkers.map((angle) => (
                <button
                  key={angle}
                  type="button"
                  className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100"
                  onClick={() => updateDegrees(angle)}
                  data-testid={`special-angle-${angle}`}
                >
                  {angle} deg
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60" data-testid="selected-formula-panel">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Explanation level</p>
            <div className="mt-3 grid gap-2">
              {[
                ["simple", "Simple"],
                ["detailed", "Detailed"],
                ["memory", "Exam Memory Trick"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={explanationLevel === id ? "rounded-lg border border-cyan-400 bg-cyan-50 px-3 py-2 text-left text-sm font-black text-cyan-900 dark:border-cyan-300/70 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"}
                  onClick={() => setExplanationLevel(id as ExplanationLevel)}
                  data-testid={`explanation-level-${id}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <IdentityProofPanel
            formula={selectedFormula}
            values={values}
            explanationLevel={explanationLevel}
            compareEvenOdd={compareEvenOdd}
            compareComplementary={compareComplementary}
          />
        </aside>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.55fr)]">
        <div className="min-w-0 space-y-4">
          <FormulaJourneyMode
            currentStep={journeyStep}
            onStepChange={setJourneyStep}
            onSelectFormula={selectFormula}
            onAngleChange={updateDegrees}
          />
          <FormulaComparisonGraph values={values} />
        </div>
        <div className="min-w-0 space-y-4">
          <FormulaPracticeMode />
          <MisconceptionAlerts />
        </div>
      </section>

      <FormulaGallery values={values} selectedFormulaId={selectedFormulaId} onSelect={selectFormula} />

      <FormulaSelector selectedFormulaId={selectedFormulaId} onSelect={selectFormula} />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
