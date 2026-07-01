import { Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ProofControls from "./ProofControls";
import { FormulaInsightPanel } from "./FormulaInsightPanel";
import { FormulaHighlighter, type FormulaToken } from "./FormulaHighlighter";
import { MisconceptionCheck, type MisconceptionCheckConfig } from "./MisconceptionCheck";
import { PredictionPrompt, type PredictionPromptConfig } from "./PredictionPrompt";
import { ProofStateInspector } from "./ProofStateInspector";
import { SnapshotExportButton, VISUAL_PROOF_SNAPSHOT_VERSION } from "./SnapshotExportButton";
import { VisualProofShell } from "./VisualProofShell";
import type { ProofInvariant, ProofLiveValue, ProofParameter, ProofStep, VisualProof, VisualProofCategory } from "../data/proofTypes";
import { useProofPlayback } from "../hooks/useProofPlayback";

export type PhaseTwoValues = Record<string, number>;
export type PhaseTwoToggles = Record<string, boolean>;

export type PhaseTwoParameter = {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  unit?: string;
};

export type PhaseTwoToggle = {
  id: string;
  label: string;
  defaultValue: boolean;
};

export type PhaseTwoProofConfig = {
  steps: ProofStep[];
  parameters: PhaseTwoParameter[];
  toggles: PhaseTwoToggle[];
  olympyardRoute: string;
  prediction: PredictionPromptConfig;
  misconception: MisconceptionCheckConfig;
  formulaTokens: (values: PhaseTwoValues) => FormulaToken[];
  formula: (values: PhaseTwoValues) => string;
  explanation: (values: PhaseTwoValues, activeStep: number, revealed: boolean) => string;
  liveValues: (values: PhaseTwoValues) => ProofLiveValue[];
  invariants: (values: PhaseTwoValues) => ProofInvariant[];
  assumptions: string[];
  renderVisual: (state: {
    values: PhaseTwoValues;
    toggles: PhaseTwoToggles;
    activeStep: number;
    revealed: boolean;
    challengeMode: boolean;
    activeHighlight: string | null;
    onHighlight: (token: string | null) => void;
    onValueChange: (id: string, value: number) => void;
  }) => ReactNode;
};

export function PhaseTwoProofExperience({ category, proof, config }: { category: VisualProofCategory; proof: VisualProof; config: PhaseTwoProofConfig }) {
  const defaults = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue])) as PhaseTwoValues;
  const defaultToggles = Object.fromEntries(config.toggles.map((toggle) => [toggle.id, toggle.defaultValue])) as PhaseTwoToggles;
  const [values, setValues] = useState<PhaseTwoValues>(defaults);
  const [toggles, setToggles] = useState<PhaseTwoToggles>(defaultToggles);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);
  const [predictionAnswered, setPredictionAnswered] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [visualHintToken, setVisualHintToken] = useState<string | null>(null);
  const playback = useProofPlayback({ totalSteps: config.steps.length });
  const liveValues = config.liveValues(values);
  const invariants = config.invariants(values);
  const formulaTokens = config.formulaTokens(values);
  const changeValue = (id: string, value: number) => {
    const parameter = config.parameters.find((item) => item.id === id);
    if (!parameter) return;
    const clamped = Math.max(parameter.min, Math.min(parameter.max, value));
    setValues((current) => ({ ...current, [id]: Number(clamped.toFixed(2)) }));
  };

  const resetProof = () => {
    playback.reset();
    setValues(defaults);
    setToggles(defaultToggles);
    setFormulaVisible(true);
    setRevealed(false);
    setChallengeMode(false);
    setTeacherMode(false);
    setPredictionAnswered(false);
    setActiveHighlight(null);
    setVisualHintToken(null);
  };

  const parameters: ProofParameter[] = [
    ...config.parameters.map((parameter) => ({
      id: parameter.id,
      label: parameter.label,
      value: values[parameter.id],
      unit: parameter.unit,
    })),
    ...config.toggles.map((toggle) => ({ id: toggle.id, label: toggle.label, value: toggles[toggle.id] })),
  ];

  return (
    <VisualProofShell
      proof={proof}
      title={proof.title}
      difficulty={proof.difficulty}
      category={category.title}
      route={proof.route}
      steps={withTimelineState(config.steps, playback.activeStep)}
      activeStep={playback.activeStep}
      onStepChange={playback.scrubToStep}
      summary={proof.longDescription}
      canvasContent={config.renderVisual({
        values,
        toggles,
        activeStep: playback.activeStep,
        revealed,
        challengeMode,
        activeHighlight: visualHintToken ?? activeHighlight,
        onHighlight: setActiveHighlight,
        onValueChange: changeValue,
      })}
      controlsContent={
        <div className="space-y-3">
          <ProofControls
            activeStep={playback.activeStep}
            totalSteps={config.steps.length}
            isPlaying={playback.isPlaying}
            labelsVisible={toggles.labels ?? true}
            formulaVisible={formulaVisible}
            playLabel={`Play ${proof.title}`}
            onPlay={playback.play}
            onPause={playback.pause}
            onReset={resetProof}
            onPrevious={playback.previous}
            onNext={playback.next}
            onToggleLabels={() => setToggles((current) => ({ ...current, labels: !(current.labels ?? true) }))}
            onToggleFormula={() => setFormulaVisible((visible) => !visible)}
            onReveal={() => {
              setPredictionAnswered(true);
              setRevealed(true);
              playback.scrubToStep(config.steps.length - 1);
            }}
            onChallengeMode={() => setChallengeMode((enabled) => !enabled)}
            onTeacherMode={() => setTeacherMode((enabled) => !enabled)}
          />
          <ParameterPanel
            parameters={config.parameters}
            values={values}
            onChange={(id, value) => setValues((current) => ({ ...current, [id]: value }))}
            toggles={config.toggles}
            toggleValues={toggles}
            onToggle={(id) => setToggles((current) => ({ ...current, [id]: !(current[id] ?? false) }))}
          />
          <MisconceptionCheck
            config={config.misconception}
            onShowHint={() => {
              const token = formulaTokens[0]?.id ?? null;
              setVisualHintToken(token);
              window.setTimeout(() => setVisualHintToken(null), 1600);
            }}
          />
          {challengeMode ? <ModePanel title="Challenge mode" body="Predict the next visual change before pressing Next or Reveal." /> : null}
          {teacherMode ? (
            <SnapshotExportButton
              snapshot={{
                snapshotVersion: VISUAL_PROOF_SNAPSHOT_VERSION,
                proofTitle: proof.title,
                route: proof.route,
                category: proof.categorySlug,
                activeStep: playback.activeStep,
                parameters,
                liveValues,
                invariants,
                timestamp: new Date().toISOString(),
              }}
            />
          ) : null}
        </div>
      }
      formulaPanel={
        formulaVisible ? (
          <div className="space-y-4">
            <FormulaInsightPanel
              formula={config.formula(values)}
              explanation={config.explanation(values, playback.activeStep, revealed)}
              liveValues={liveValues}
              invariants={invariants}
              assumptions={config.assumptions}
              warnings={playback.reducedMotion ? ["Reduced motion is enabled, so use step controls instead of autoplay."] : []}
            />
            <FormulaHighlighter tokens={formulaTokens} activeToken={activeHighlight} onActiveToken={setActiveHighlight} />
            {!revealed || !predictionAnswered ? (
              <PredictionPrompt
                config={config.prediction}
                answered={predictionAnswered}
                onAnswered={(correct) => {
                  setPredictionAnswered(true);
                  if (correct && config.prediction.revealAfterAnswer) setRevealed(true);
                }}
              />
            ) : null}
          </div>
        ) : (
          <ModePanel title="Formula hidden" body="Make a prediction from the visual, then reveal the formula again." />
        )
      }
      stateInspector={<ProofStateInspector parameters={parameters} liveValues={liveValues} invariants={invariants} warnings={playback.reducedMotion ? ["reduced-motion"] : []} />}
      practiceExit={
          <Link to={config.olympyardRoute} className="action-primary rounded-xl">
          Practice this idea in Olympyard
        </Link>
      }
    />
  );
}

function ParameterPanel({
  parameters,
  values,
  onChange,
  toggles,
  toggleValues,
  onToggle,
}: {
  parameters: PhaseTwoParameter[];
  values: PhaseTwoValues;
  onChange: (id: string, value: number) => void;
  toggles: PhaseTwoToggle[];
  toggleValues: PhaseTwoToggles;
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">Manipulate</h2>
      <div className="mt-3 space-y-3">
        {parameters.map((parameter) => (
          <StepperSlider key={parameter.id} parameter={parameter} value={values[parameter.id]} onChange={(value) => onChange(parameter.id, value)} />
        ))}
        {toggles.map((toggle) => (
          <label key={toggle.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
            {toggle.label}
            <input type="checkbox" checked={toggleValues[toggle.id] ?? false} onChange={() => onToggle(toggle.id)} className="h-5 w-5 accent-cyan-500" />
          </label>
        ))}
      </div>
    </section>
  );
}

function StepperSlider({ parameter, value, onChange }: { parameter: PhaseTwoParameter; value: number; onChange: (value: number) => void }) {
  const step = parameter.step ?? 1;
  const clamp = (next: number) => Math.max(parameter.min, Math.min(parameter.max, next));
  return (
    <label className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
      <span className="flex items-center justify-between gap-3">
        <span>{parameter.label}</span>
        <span>{value}{parameter.unit ? ` ${parameter.unit}` : ""}</span>
      </span>
      <span className="mt-2 grid grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-2">
        <button type="button" className="math-tool-button h-9 w-9" onClick={() => onChange(clamp(value - step))} aria-label={`Decrease ${parameter.label}`}>
          <Minus className="h-4 w-4" />
        </button>
        <input aria-label={parameter.label} type="range" min={parameter.min} max={parameter.max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan-500" />
        <button type="button" className="math-tool-button h-9 w-9" onClick={() => onChange(clamp(value + step))} aria-label={`Increase ${parameter.label}`}>
          <Plus className="h-4 w-4" />
        </button>
      </span>
    </label>
  );
}

function ModePanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
    </section>
  );
}

function withTimelineState(steps: ProofStep[], activeStep: number): ProofStep[] {
  return steps.map((step, index) => ({
    ...step,
    state: index < activeStep ? "completed" : index === activeStep ? "current" : "locked",
  }));
}
