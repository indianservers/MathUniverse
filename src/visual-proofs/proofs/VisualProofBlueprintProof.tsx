import { ListChecks, MousePointer2, Search } from "lucide-react";
import { useState } from "react";
import { GuidedScaffoldPanel, TeacherNotes } from "../../components/ui/LearningScaffolds";
import FormulaPanel from "../components/FormulaPanel";
import StepPanel from "../components/StepPanel";
import VisualProofLayout from "../components/VisualProofLayout";
import type { ProofStep, VisualProof, VisualProofCategory } from "../data/proofTypes";

const learningSequence = [
  "Observe",
  "Predict",
  "Manipulate",
  "Rearrange",
  "Reveal Formula",
  "Explain Why",
  "Change Values",
  "Find the Mistake",
  "Practice",
];

export default function VisualProofBlueprintProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = makeSteps(proof);

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      steps={<StepPanel steps={steps} activeStep={activeStep} onSelectStep={setActiveStep} />}
      visual={<BlueprintVisual proof={proof} category={category} activeStep={activeStep} />}
      controls={<BlueprintControls proof={proof} activeStep={activeStep} onStep={setActiveStep} />}
      formula={<FormulaPanel title="Proof formula path" formulas={[proof.title, proof.shortDescription, proof.longDescription]} />}
      conceptNotes={
        <div className="space-y-3">
          <p>{proof.longDescription}</p>
          <TeacherNotes
            objective={`Use a visual argument to justify ${proof.title}.`}
            prerequisite={proof.prerequisites.join(", ") || "Core definitions"}
            prompt="Ask learners which object stays unchanged as the diagram moves from the first picture to the final formula."
            misconception="Students may remember the formula but miss the invariant. Keep asking what was counted, preserved, cancelled, balanced, or rearranged."
            extension="Have learners change one value and describe why the same argument still works."
          />
        </div>
      }
      reflectionQuestions={[
        "What stayed unchanged from the first picture to the final formula?",
        "Which part of the visual matches each symbol in the statement?",
        "What mistake would break this proof, and how would the diagram reveal it?",
      ]}
    />
  );
}

function makeSteps(proof: VisualProof): ProofStep[] {
  const focus = focusFromProof(proof);
  return learningSequence.map((title, index) => ({
    id: `${proof.slug}-${index}`,
    title,
    description: stepDescription(title, proof),
    focusLabel: index < 2 ? "claim" : index < 5 ? focus : "invariant",
  }));
}

function stepDescription(title: string, proof: VisualProof) {
  const descriptions: Record<string, string> = {
    Observe: `Name the objects in ${proof.title} before doing any algebra.`,
    Predict: `Guess what the diagram should preserve: area, count, length, angle, probability, slope, or transformation scale.`,
    Manipulate: `Move the visible parts mentally or with the step controls and track one value at a time.`,
    Rearrange: `Rebuild the same quantity in a shape or arrangement that is easier to count.`,
    "Reveal Formula": `Match each visual part to the symbols in ${proof.title}.`,
    "Explain Why": `Say why the rearranged picture proves the original claim, not just one example.`,
    "Change Values": "Try a different valid value and check that the same invariant still holds.",
    "Find the Mistake": "Look for double counting, missing overlap, sign reversal, or a hidden assumption.",
    Practice: "Use the idea on a nearby problem and explain the proof in one sentence.",
  };
  return descriptions[title] ?? proof.shortDescription;
}

function BlueprintControls({ proof, activeStep, onStep }: { proof: VisualProof; activeStep: number; onStep: (step: number) => void }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">Proof sequence</h2>
      <div className="mt-3 grid gap-2">
        {learningSequence.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => onStep(index)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-black transition ${
              index === activeStep
                ? "border-cyan-400 bg-cyan-50 text-cyan-950 dark:border-cyan-300/50 dark:bg-cyan-300/15 dark:text-cyan-50"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200"
            }`}
          >
            <span>{step}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{index + 1}</span>
          </button>
        ))}
      </div>
      <GuidedScaffoldPanel
        title="Student task"
        goal={`Justify ${proof.title} using the visual sequence.`}
        notice={proof.shortDescription}
        tryIt="Choose one example value, then replay the sequence without changing the invariant."
        explain="Point to the visual object represented by every symbol in the formula."
        checks={["The starting quantity is visible.", "The transformation preserves the key value.", "The final arrangement is easier to count or compare."]}
      />
    </section>
  );
}

function BlueprintVisual({ proof, category, activeStep }: { proof: VisualProof; category: VisualProofCategory; activeStep: number }) {
  const model = proof.proofLearningModel ?? "applied-system";
  const accent = colorForModel(model);
  const secondary = secondaryForModel(model);
  const focus = focusFromProof(proof);

  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 920 560" role="img" aria-label={`${proof.title} visual proof blueprint`} className="h-auto min-h-[340px] w-full max-w-full">
        <rect x="24" y="24" width="872" height="512" rx="18" fill="#020617" />
        <text x="58" y="74" className="fill-white text-xl font-black">{category.title}</text>
        <text x="58" y="104" className="fill-cyan-100 text-sm font-bold">{focus}</text>
        <ModelGlyph model={model} accent={accent} secondary={secondary} activeStep={activeStep} />
        <SequenceRail activeStep={activeStep} accent={accent} />
        <InvariantPanel proof={proof} accent={accent} />
      </svg>
    </div>
  );
}

function ModelGlyph({ model, accent, secondary, activeStep }: { model: string; accent: string; secondary: string; activeStep: number }) {
  if (model === "coordinate-grid" || model === "graph-limit") {
    return (
      <g>
        {Array.from({ length: 9 }, (_, i) => <line key={`v-${i}`} x1={90 + i * 42} y1="160" x2={90 + i * 42} y2="420" stroke="#334155" />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`h-${i}`} x1="90" y1={160 + i * 42} x2="430" y2={160 + i * 42} stroke="#334155" />)}
        <polyline points="104,386 166,338 230,278 298,230 392,186" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <line x1="135" y1="360" x2="345" y2={activeStep > 4 ? "214" : "260"} stroke={secondary} strokeWidth="4" strokeDasharray="9 8" />
      </g>
    );
  }

  if (model === "vector-field" || model === "transformation-grid") {
    return (
      <g>
        <rect x="104" y="170" width="250" height="190" fill="#0f172a" stroke="#334155" />
        <path d="M 140 320 L 318 218" stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <path d="M 318 218 L 292 218 L 306 241 Z" fill={accent} />
        <path d="M 140 320 L 275 320 L 275 242" stroke={secondary} strokeWidth="4" strokeDasharray="8 8" fill="none" />
        <rect x="170" y="210" width="82" height="82" fill={secondary} opacity={activeStep > 4 ? 0.55 : 0.25} />
      </g>
    );
  }

  if (model === "simulation-board" || model === "data-display") {
    return (
      <g>
        <rect x="90" y="168" width="300" height="230" rx="14" fill="#0f172a" stroke="#334155" />
        {[42, 76, 112, 148, 188, 228].map((height, index) => (
          <rect key={height} x={125 + index * 38} y={365 - height} width="24" height={height} rx="5" fill={index <= activeStep % 6 ? accent : secondary} />
        ))}
        <circle cx="304" cy="232" r="58" fill={secondary} opacity="0.28" />
        <circle cx="345" cy="232" r="58" fill={accent} opacity="0.38" />
      </g>
    );
  }

  return (
    <g>
      <rect x="92" y="165" width="130" height="130" fill={accent} opacity="0.85" />
      <rect x="222" y="165" width="90" height="130" fill={secondary} opacity="0.85" />
      <rect x="92" y="295" width="130" height="72" fill={secondary} opacity="0.65" />
      <rect x="222" y="295" width="90" height="72" fill={accent} opacity={activeStep > 3 ? 0.95 : 0.35} />
      <path d="M 365 185 C 435 215 435 320 365 350" stroke="#fde68a" strokeWidth="5" fill="none" strokeDasharray="10 8" />
    </g>
  );
}

function SequenceRail({ activeStep, accent }: { activeStep: number; accent: string }) {
  return (
    <g>
      {learningSequence.map((step, index) => {
        const x = 72 + index * 88;
        const active = index <= activeStep;
        return (
          <g key={step}>
            {index > 0 ? <line x1={x - 42} y1="475" x2={x - 14} y2="475" stroke={active ? accent : "#334155"} strokeWidth="4" /> : null}
            <circle cx={x} cy="475" r="18" fill={active ? accent : "#1e293b"} stroke={active ? "#e0f2fe" : "#475569"} strokeWidth="3" />
            <text x={x} y="480" textAnchor="middle" className="fill-white text-xs font-black">{index + 1}</text>
            <text x={x} y="512" textAnchor="middle" className="fill-slate-200 text-[10px] font-bold">{shortStep(step)}</text>
          </g>
        );
      })}
    </g>
  );
}

function InvariantPanel({ proof, accent }: { proof: VisualProof; accent: string }) {
  return (
    <g>
      <rect x="500" y="145" width="330" height="235" rx="16" fill="#0f172a" stroke="#334155" />
      <IconBadge x={526} y={178} accent={accent} icon="search" />
      <IconBadge x={526} y={238} accent={accent} icon="move" />
      <IconBadge x={526} y={298} accent={accent} icon="check" />
      <text x="572" y="184" className="fill-white text-sm font-black">Claim: {truncate(proof.title, 34)}</text>
      <text x="572" y="244" className="fill-white text-sm font-black">Visual: {truncate(proof.shortDescription, 37)}</text>
      <text x="572" y="304" className="fill-white text-sm font-black">Invariant: same value, clearer form</text>
    </g>
  );
}

function IconBadge({ x, y, accent, icon }: { x: number; y: number; accent: string; icon: "search" | "move" | "check" }) {
  const Icon = icon === "search" ? Search : icon === "move" ? MousePointer2 : ListChecks;
  return (
    <g>
      <circle cx={x} cy={y} r="18" fill={accent} />
      <foreignObject x={x - 10} y={y - 10} width="20" height="20">
        <Icon className="h-5 w-5 text-white" />
      </foreignObject>
    </g>
  );
}

function focusFromProof(proof: VisualProof) {
  if (proof.tags.includes("area") || proof.tags.includes("volume")) return "rearrange equal measure";
  if (proof.tags.includes("probability")) return "renormalize event regions";
  if (proof.tags.includes("slope") || proof.tags.includes("coordinates")) return "compare grid movements";
  if (proof.tags.includes("exponent")) return "count repeated factors";
  if (proof.tags.includes("series") || proof.tags.includes("sequence")) return "watch partial sums";
  return proof.tags.slice(0, 3).join(" / ") || "visual invariant";
}

function colorForModel(model: string) {
  const colors: Record<string, string> = {
    "area-rearrangement": "#0ea5e9",
    "tile-model": "#22c55e",
    "angle-model": "#f59e0b",
    "coordinate-grid": "#38bdf8",
    "graph-limit": "#a855f7",
    "number-model": "#14b8a6",
    "pattern-model": "#6366f1",
    "simulation-board": "#ec4899",
    "data-display": "#f97316",
    "vector-field": "#06b6d4",
    "measurement-scene": "#84cc16",
    "growth-scale": "#10b981",
  };
  return colors[model] ?? "#0ea5e9";
}

function secondaryForModel(model: string) {
  return model === "tile-model" || model === "growth-scale" ? "#f97316" : "#22c55e";
}

function shortStep(step: string) {
  return step === "Reveal Formula" ? "Reveal" : step === "Find the Mistake" ? "Mistake" : step;
}

function truncate(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 3)}...`;
}
