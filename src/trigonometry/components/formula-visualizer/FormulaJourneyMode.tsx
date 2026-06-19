import { type TrigFormulaId } from "../../utils/trigFormulaUtils";

type JourneyStep = {
  title: string;
  focus: string;
  explanation: string;
  formulaId: TrigFormulaId;
  degrees: number;
};

type FormulaJourneyModeProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
  onSelectFormula: (formulaId: TrigFormulaId) => void;
  onAngleChange: (degrees: number) => void;
};

const journeySteps: JourneyStep[] = [
  {
    title: "What is sin theta?",
    focus: "Vertical height",
    explanation: "Sine is the up-or-down height of the point on the unit circle.",
    formulaId: "sin",
    degrees: 45,
  },
  {
    title: "What is cos theta?",
    focus: "Horizontal distance",
    explanation: "Cosine is the left-or-right distance of the same point from the origin.",
    formulaId: "cos",
    degrees: 45,
  },
  {
    title: "What is tan theta?",
    focus: "Height compared to base",
    explanation: "Tangent compares the sine height with the cosine base.",
    formulaId: "tan",
    degrees: 45,
  },
  {
    title: "Why is tan theta = sin theta / cos theta?",
    focus: "Opposite divided by adjacent",
    explanation: "In the triangle, opposite is sin theta and adjacent is cos theta, so their ratio is tangent.",
    formulaId: "tan-ratio",
    degrees: 50,
  },
  {
    title: "Why is sin^2 theta + cos^2 theta = 1?",
    focus: "Two square areas plus one unit hypotenuse",
    explanation: "The right triangle sits inside the unit circle, so base squared plus height squared equals 1 squared.",
    formulaId: "pythagorean",
    degrees: 35,
  },
  {
    title: "Why does tan theta become very large near 90 deg?",
    focus: "Cosine approaches zero",
    explanation: "Tangent is sin theta divided by cos theta. Near 90 degrees, cosine becomes tiny, so the ratio grows fast.",
    formulaId: "tan-ratio",
    degrees: 88,
  },
];

export default function FormulaJourneyMode({
  currentStep,
  onStepChange,
  onSelectFormula,
  onAngleChange,
}: FormulaJourneyModeProps) {
  const step = journeySteps[currentStep] ?? journeySteps[0];
  const isFirst = currentStep === 0;
  const isLast = currentStep === journeySteps.length - 1;

  const applyStep = (nextStep: number) => {
    const boundedStep = Math.min(journeySteps.length - 1, Math.max(0, nextStep));
    const next = journeySteps[boundedStep];
    onStepChange(boundedStep);
    onSelectFormula(next.formulaId);
    onAngleChange(next.degrees);
  };

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
      data-testid="formula-journey-mode"
      aria-label="Formula journey mode"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-300">Formula Journey Mode</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white" data-testid="journey-step-title">
            {step.title}
          </h2>
          <p className="mt-2 text-sm font-black text-cyan-700 dark:text-cyan-200" data-testid="journey-step-focus">
            {step.focus}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200" data-testid="journey-step-explanation">
            {step.explanation}
          </p>
        </div>

        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span data-testid="journey-progress">
              Step {currentStep + 1} of {journeySteps.length}
            </span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width]"
              style={{ width: `${((currentStep + 1) / journeySteps.length) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="action-secondary min-h-10 flex-1 rounded-lg py-2"
              onClick={() => applyStep(currentStep - 1)}
              disabled={isFirst}
              data-testid="journey-prev"
            >
              Previous
            </button>
            <button
              type="button"
              className="action-primary min-h-10 flex-1 rounded-lg py-2"
              onClick={() => applyStep(currentStep + 1)}
              disabled={isLast}
              data-testid="journey-next"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { journeySteps };
