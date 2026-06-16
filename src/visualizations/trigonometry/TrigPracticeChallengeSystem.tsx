import { CheckCircle2, Lightbulb, MousePointer2, RotateCcw, Target, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import { useProgress } from "../../hooks/useProgress";

export type TrigPracticeQuestionType =
  | "visual-mcq"
  | "click-match"
  | "formula-fill"
  | "proof-step"
  | "numeric"
  | "graph-match"
  | "quadrant-sign"
  | "angle-from-ratio"
  | "undefined-check"
  | "formula-builder";

export type TrigPracticeQuestion = {
  id: string;
  conceptId: string;
  phaseOwner: "phase-02" | "phase-03" | "phase-04" | "phase-05" | "phase-06" | "phase-07" | "phase-08";
  type: TrigPracticeQuestionType;
  difficulty: "beginner" | "intermediate" | "advanced";
  prompt: string;
  visualState?: Record<string, number | string | boolean>;
  choices?: Array<{ id: string; label: string; isCorrect?: boolean; feedback?: string }>;
  matchPairs?: Array<{ source: string; target: string }>;
  answer: string | number | string[] | Record<string, string | number | boolean>;
  acceptableAnswers?: Array<string | number>;
  hints: Array<{ level: 1 | 2 | 3 | 4; title: string; body: string; visualCue?: string }>;
  explanation: string;
  commonMistake?: string;
  followUpPrompt?: string;
};

type AttemptState = {
  selectedAnswer?: string | string[] | Record<string, string | number>;
  isCorrect?: boolean;
  attempts: number;
  hintsUsed: number;
  completed: boolean;
  feedback?: string;
};

type GraphGuess = {
  amplitude: number;
  frequency: number;
  phase: number;
  verticalShift: number;
};

const DEFAULT_ATTEMPT: AttemptState = { attempts: 0, hintsUsed: 0, completed: false };
const GRAPH_TARGET: GraphGuess = { amplitude: 2, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 };

export const trigPracticeQuestions: TrigPracticeQuestion[] = [
  {
    id: "uc-quadrant-signs",
    conceptId: "unit-circle",
    phaseOwner: "phase-02",
    type: "visual-mcq",
    difficulty: "beginner",
    prompt: "Which quadrant has sine positive and cosine negative?",
    choices: [
      { id: "qi", label: "Quadrant I", feedback: "In Quadrant I, both sine and cosine are positive." },
      { id: "qii", label: "Quadrant II", isCorrect: true, feedback: "Correct. y is positive and x is negative." },
      { id: "qiii", label: "Quadrant III", feedback: "In Quadrant III, sine and cosine are both negative." },
      { id: "qiv", label: "Quadrant IV", feedback: "In Quadrant IV, sine is negative and cosine is positive." },
    ],
    answer: "qii",
    hints: [
      { level: 1, title: "Visual nudge", body: "Look for points left of the y-axis and above the x-axis." },
      { level: 2, title: "Concept nudge", body: "Cosine is the x-coordinate and sine is the y-coordinate." },
      { level: 3, title: "Formula nudge", body: "sin theta > 0 means y > 0. cos theta < 0 means x < 0." },
      { level: 4, title: "Step explanation", body: "Left and above is Quadrant II, so sine is positive and cosine is negative." },
    ],
    explanation: "Sine follows vertical position and cosine follows horizontal position on the unit circle.",
    commonMistake: "Choosing Quadrant IV swaps the signs.",
    followUpPrompt: "Now find where tangent is positive but cosine is negative.",
  },
  {
    id: "uc-special-angle",
    conceptId: "special-angles",
    phaseOwner: "phase-02",
    type: "angle-from-ratio",
    difficulty: "beginner",
    prompt: "If sin theta = 1/2, which special angle is the principal acute angle?",
    choices: [
      { id: "30", label: "30 deg", isCorrect: true, feedback: "Correct. sin 30 deg = 1/2." },
      { id: "45", label: "45 deg", feedback: "sin 45 deg = sqrt(2)/2." },
      { id: "60", label: "60 deg", feedback: "sin 60 deg = sqrt(3)/2." },
      { id: "90", label: "90 deg", feedback: "sin 90 deg = 1." },
    ],
    answer: "30",
    hints: baseHints("Look at the half-height point.", "Sine is opposite over hypotenuse.", "In the 30-60-90 triangle, the short leg is half the hypotenuse.", "The angle opposite the short leg is 30 degrees."),
    explanation: "The sine value 1/2 corresponds to 30 degrees in the principal acute special-angle table.",
  },
  {
    id: "ratios-click-match",
    conceptId: "right-triangle-ratios",
    phaseOwner: "phase-03",
    type: "click-match",
    difficulty: "beginner",
    prompt: "Match each trig ratio to its visual meaning.",
    matchPairs: [
      { source: "sin theta", target: "vertical projection / opposite over hypotenuse" },
      { source: "cos theta", target: "horizontal projection / adjacent over hypotenuse" },
      { source: "tan theta", target: "slope / opposite over adjacent" },
    ],
    answer: {
      "sin theta": "vertical projection / opposite over hypotenuse",
      "cos theta": "horizontal projection / adjacent over hypotenuse",
      "tan theta": "slope / opposite over adjacent",
    },
    hints: baseHints("Start with SOH-CAH-TOA.", "Sine uses opposite, cosine uses adjacent.", "Tangent compares opposite to adjacent.", "Match sin to vertical, cos to horizontal, tan to slope."),
    explanation: "The right-triangle ratios match the unit-circle projections when the hypotenuse is 1.",
    commonMistake: "Students often swap sine and cosine projections.",
  },
  {
    id: "reciprocal-undefined",
    conceptId: "reciprocal-ratios",
    phaseOwner: "phase-03",
    type: "undefined-check",
    difficulty: "intermediate",
    prompt: "At theta = 90 deg, which reciprocal ratio is undefined because cos theta = 0?",
    choices: [
      { id: "sec", label: "sec theta", isCorrect: true, feedback: "Correct. sec theta = 1/cos theta." },
      { id: "csc", label: "cosec theta", feedback: "cosec theta = 1/sin theta, and sin 90 deg = 1." },
      { id: "sin", label: "sin theta", feedback: "sin 90 deg is defined and equals 1." },
    ],
    answer: "sec",
    hints: baseHints("Look at the denominator.", "A ratio is undefined when its denominator is zero.", "sec theta = 1/cos theta.", "At 90 degrees, cos theta = 0, so sec theta is undefined."),
    explanation: "Division by zero is not allowed, so secant is undefined at 90 degrees.",
  },
  {
    id: "identity-fill",
    conceptId: "pythagorean-identity",
    phaseOwner: "phase-04",
    type: "formula-fill",
    difficulty: "beginner",
    prompt: "Fill the blank: sin^2 theta + cos^2 theta = ___",
    answer: "1",
    acceptableAnswers: [1, "1", "one"],
    hints: baseHints("Think of the unit-circle radius.", "The legs are sin theta and cos theta.", "Pythagoras says leg^2 + leg^2 = hypotenuse^2.", "On the unit circle, the hypotenuse is 1, so the square is 1."),
    explanation: "The identity is the Pythagorean theorem applied to a unit-radius triangle.",
  },
  {
    id: "identity-proof-step",
    conceptId: "pythagorean-identity",
    phaseOwner: "phase-04",
    type: "proof-step",
    difficulty: "intermediate",
    prompt: "Divide sin^2 theta + cos^2 theta = 1 by cos^2 theta. What identity appears?",
    answer: "tan^2 theta + 1 = sec^2 theta",
    acceptableAnswers: ["tan^2 theta + 1 = sec^2 theta", "1 + tan^2 theta = sec^2 theta", "tan²θ + 1 = sec²θ"],
    hints: baseHints("Divide every term by cos^2 theta.", "sin^2/cos^2 becomes tan^2.", "cos^2/cos^2 becomes 1.", "1/cos^2 becomes sec^2."),
    explanation: "Dividing the core identity by cos^2 theta creates the tangent/secant Pythagorean identity.",
    commonMistake: "Do not divide only the left side.",
  },
  {
    id: "sum-difference-builder",
    conceptId: "sum-difference",
    phaseOwner: "phase-05",
    type: "formula-builder",
    difficulty: "intermediate",
    prompt: "Build the expansion for cos(A+B).",
    choices: [
      { id: "cosA cosB - sinA sinB", label: "cosA cosB - sinA sinB", isCorrect: true, feedback: "Correct. Cosine addition uses the minus sign." },
      { id: "cosA cosB + sinA sinB", label: "cosA cosB + sinA sinB", feedback: "That is the cosine subtraction pattern." },
      { id: "sinA cosB + cosA sinB", label: "sinA cosB + cosA sinB", feedback: "That is sin(A+B)." },
    ],
    answer: "cosA cosB - sinA sinB",
    hints: baseHints("Cosine addition starts with cosA cosB.", "Addition inside cosine uses subtraction in the expansion.", "The second product is sinA sinB.", "cos(A+B) = cosA cosB - sinA sinB."),
    explanation: "The formula compares the x-coordinate after two rotations.",
  },
  {
    id: "double-angle-trap",
    conceptId: "double-angle",
    phaseOwner: "phase-06",
    type: "visual-mcq",
    difficulty: "intermediate",
    prompt: "Which formula is correct for sin(2 theta)?",
    choices: [
      { id: "2sin", label: "2 sin theta", feedback: "Not quite. Doubling the angle is not the same as doubling the value." },
      { id: "2sincos", label: "2 sin theta cos theta", isCorrect: true, feedback: "Correct. This comes from sin(theta + theta)." },
      { id: "sin2cos2", label: "sin^2 theta - cos^2 theta", feedback: "That is not a sine double-angle identity." },
    ],
    answer: "2sincos",
    hints: baseHints("Think theta + theta.", "Use sin(A+B).", "Substitute A = theta and B = theta.", "sin(2 theta) = sin theta cos theta + cos theta sin theta = 2 sin theta cos theta."),
    explanation: "The double-angle formula is an addition formula with both angles equal.",
  },
  {
    id: "half-angle-sign",
    conceptId: "half-angle",
    phaseOwner: "phase-06",
    type: "proof-step",
    difficulty: "advanced",
    prompt: "For half-angle formulas with square roots, what decides the plus or minus sign?",
    choices: [
      { id: "quadrant", label: "The quadrant of the half-angle", isCorrect: true, feedback: "Correct. The sign depends on where theta/2 lies." },
      { id: "always-positive", label: "Always positive", feedback: "Square roots are positive, but trig values may be negative depending on quadrant." },
      { id: "amplitude", label: "The amplitude of the graph", feedback: "Amplitude is a graph parameter, not the half-angle sign rule." },
    ],
    answer: "quadrant",
    hints: baseHints("The radical gives a magnitude.", "Trig values still have signs.", "Use the quadrant of theta/2.", "Choose the sign that matches the function in that quadrant."),
    explanation: "Half-angle identities with radicals need a sign decision from the half-angle quadrant.",
  },
  {
    id: "graph-match-sine",
    conceptId: "sine-graph",
    phaseOwner: "phase-07",
    type: "graph-match",
    difficulty: "intermediate",
    prompt: "Adjust the local sliders to match y = 2 sin(2x - pi/2) + 1.",
    visualState: { amplitude: 2, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 },
    answer: GRAPH_TARGET,
    hints: baseHints("Start with the height.", "Then count cycles.", "The phase is the horizontal slide component.", "Finally move the midline up to 1."),
    explanation: "A controls height, b controls cycle speed, c controls phase component, and d moves the midline.",
    followUpPrompt: "Try matching a cosine target with the same amplitude and shift.",
  },
  {
    id: "graph-parameter-match",
    conceptId: "period-frequency",
    phaseOwner: "phase-07",
    type: "click-match",
    difficulty: "beginner",
    prompt: "Match each graph parameter to its visual effect.",
    matchPairs: [
      { source: "a", target: "height / amplitude" },
      { source: "b", target: "cycle speed / period" },
      { source: "c", target: "phase component" },
      { source: "d", target: "vertical shift / midline" },
    ],
    answer: { a: "height / amplitude", b: "cycle speed / period", c: "phase component", d: "vertical shift / midline" },
    hints: baseHints("Look at y = a f(bx+c)+d.", "a changes vertical stretch.", "b changes how fast cycles repeat.", "d lifts the whole graph."),
    explanation: "Each parameter changes a different visual feature of the transformed graph.",
  },
  {
    id: "inverse-principal",
    conceptId: "inverse-trig",
    phaseOwner: "phase-08",
    type: "angle-from-ratio",
    difficulty: "beginner",
    prompt: "arcsin(0.5) gives which principal value?",
    choices: [
      { id: "30", label: "30 deg", isCorrect: true, feedback: "Correct. arcsin chooses the principal angle in [-90 deg, 90 deg]." },
      { id: "150", label: "150 deg", feedback: "150 deg also has sine 0.5, but it is not in the arcsin principal range." },
      { id: "60", label: "60 deg", feedback: "sin 60 deg = sqrt(3)/2." },
    ],
    answer: "30",
    hints: baseHints("First find an angle whose sine is 0.5.", "Then check the principal range.", "arcsin uses [-90 deg, 90 deg].", "30 deg is in range; 150 deg is not."),
    explanation: "Inverse trig returns the chosen principal value, not every equation solution.",
    commonMistake: "150 degrees is a valid sine-equation solution, but not arcsin's principal output.",
  },
  {
    id: "inverse-notation",
    conceptId: "inverse-principal-values",
    phaseOwner: "phase-08",
    type: "visual-mcq",
    difficulty: "beginner",
    prompt: "What does sin^-1 x mean in inverse trigonometry?",
    choices: [
      { id: "inverse-function", label: "The inverse sine function, arcsin x", isCorrect: true, feedback: "Correct. It returns an angle." },
      { id: "reciprocal", label: "1/sin x", feedback: "That is cosecant, not arcsin." },
      { id: "square", label: "(sin x)^2", feedback: "That is sin^2 x." },
    ],
    answer: "inverse-function",
    hints: baseHints("Ask what the output should be.", "Inverse trig returns an angle.", "The reciprocal of sine is cosecant.", "sin^-1 x means arcsin x in this context."),
    explanation: "The -1 notation means inverse function here.",
  },
  {
    id: "trig-equation-many",
    conceptId: "trig-equations",
    phaseOwner: "phase-08",
    type: "visual-mcq",
    difficulty: "intermediate",
    prompt: "Why is 150 deg still important when arcsin(0.5) = 30 deg?",
    choices: [
      { id: "also-solution", label: "It is another solution of sin theta = 0.5 in 0 deg to 360 deg.", isCorrect: true, feedback: "Correct. Equations may need all matching angles." },
      { id: "principal", label: "It is the principal arcsin value.", feedback: "The arcsin principal range is -90 deg to 90 deg." },
      { id: "undefined", label: "Sine is undefined there.", feedback: "Sine is defined at every angle." },
    ],
    answer: "also-solution",
    hints: baseHints("Separate inverse function from equation solving.", "arcsin gives one principal angle.", "Sine repeats and has symmetry.", "sin 30 deg and sin 150 deg both equal 0.5."),
    explanation: "Principal values start the solution process; full equations may need more angles.",
  },
];

export function getPracticeQuestionsForConcept(conceptId: string) {
  const aliases: Record<string, string> = {
    amplitude: "sine-graph",
    "wave-amplitude": "sine-graph",
    "wave-period-frequency": "period-frequency",
    "phase-shift": "sine-graph",
    "cosine-graph": "sine-graph",
    "tangent-graph": "sine-graph",
    "general-solutions": "trig-equations",
    "trigonometric-functions": "right-triangle-ratios",
    "quadrant-signs": "unit-circle",
    "degree-radian": "unit-circle",
  };
  const normalized = aliases[conceptId] ?? conceptId;
  return trigPracticeQuestions.filter((question) => question.conceptId === conceptId || question.conceptId === normalized).slice(0, 4);
}

export function validatePracticeAnswer(question: TrigPracticeQuestion, answer: unknown) {
  if (question.type === "graph-match") return validateGraphMatch(answer as Partial<GraphGuess>, question.answer as GraphGuess).matched;
  if (question.type === "click-match") return validateMatchAnswer(question, answer as Record<string, string>);
  if (Array.isArray(question.answer)) return Array.isArray(answer) && sameStringSet(question.answer, answer);
  const accepted = [question.answer, ...(question.acceptableAnswers ?? [])];
  return accepted.some((value) => normalizeAnswer(value) === normalizeAnswer(answer));
}

export function validateMatchAnswer(question: TrigPracticeQuestion, answer: Record<string, string> | undefined) {
  if (!question.matchPairs || !answer) return false;
  return question.matchPairs.every((pair) => answer[pair.source] === pair.target);
}

export function validateGraphMatch(answer: Partial<GraphGuess>, target: GraphGuess) {
  const checks = {
    amplitude: Math.abs((answer.amplitude ?? 0) - target.amplitude) <= 0.25,
    frequency: Math.abs((answer.frequency ?? 0) - target.frequency) <= 0.25,
    phase: Math.abs(wrapPhase((answer.phase ?? 0) - target.phase)) <= 0.4,
    verticalShift: Math.abs((answer.verticalShift ?? 0) - target.verticalShift) <= 0.25,
  };
  return { matched: Object.values(checks).every(Boolean), checks };
}

export function hasDuplicateQuestionIds(questions = trigPracticeQuestions) {
  const ids = questions.map((question) => question.id);
  return new Set(ids).size !== ids.length;
}

export default function TrigPracticeChallengeSystem({ conceptId, title = "Practice checkpoints" }: { conceptId: string; title?: string }) {
  const questions = useMemo(() => getPracticeQuestionsForConcept(conceptId), [conceptId]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const { markTopicInteracted, setTopicProgress } = useProgress();

  const question = questions[index] ?? trigPracticeQuestions[0];
  const attempt = attempts[question.id] ?? DEFAULT_ATTEMPT;
  const completed = questions.filter((item) => attempts[item.id]?.completed).length;
  const score = questions.length ? Math.round((completed / questions.length) * 100) : 0;

  if (!questions.length) return null;

  function updateAttempt(questionId: string, updater: (current: AttemptState) => AttemptState) {
    setAttempts((current) => ({ ...current, [questionId]: updater(current[questionId] ?? DEFAULT_ATTEMPT) }));
  }

  function handleCheck(answer: unknown) {
    const isCorrect = validatePracticeAnswer(question, answer);
    const feedback = getFeedback(question, answer, isCorrect);
    updateAttempt(question.id, (current) => ({
      ...current,
      selectedAnswer: answer as AttemptState["selectedAnswer"],
      isCorrect,
      attempts: current.attempts + 1,
      completed: current.completed || isCorrect,
      feedback,
    }));
    markTopicInteracted(`trig-practice-${conceptId}`);
    setTopicProgress(`trig-practice-${conceptId}`, isCorrect ? Math.max(score, 75) : Math.max(score, 45));
  }

  function showHint() {
    updateAttempt(question.id, (current) => ({ ...current, hintsUsed: Math.min(4, current.hintsUsed + 1) }));
    markTopicInteracted(`trig-practice-${conceptId}`);
  }

  return (
    <SectionCard
      title={title}
      description="Predict, act, check, explain, and ask for hints when the diagram needs one more clue."
      className="border-emerald-200/80 dark:border-emerald-400/20"
      allowFullscreen
    >
      <div className="space-y-4">
        <ConceptProgressMiniTracker completed={completed} total={questions.length} score={score} />
        <div className="flex flex-wrap gap-2">
          {questions.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Open practice question ${itemIndex + 1}: ${labelize(item.type)}`}
              aria-pressed={itemIndex === index}
              className={itemIndex === index ? "action-primary min-h-0 py-2" : "action-secondary min-h-0 py-2"}
              onClick={() => setIndex(itemIndex)}
            >
              {itemIndex + 1}. {labelize(item.type)}
            </button>
          ))}
        </div>
        <PracticeQuestionCard question={question} attempt={attempt} onCheck={handleCheck} onHint={showHint} onReset={() => updateAttempt(question.id, () => DEFAULT_ATTEMPT)} />
      </div>
    </SectionCard>
  );
}

function PracticeQuestionCard({
  question,
  attempt,
  onCheck,
  onHint,
  onReset,
}: {
  question: TrigPracticeQuestion;
  attempt: AttemptState;
  onCheck: (answer: unknown) => void;
  onHint: () => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">{labelize(question.type)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{question.difficulty}</span>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-400/15 dark:text-violet-100">{question.phaseOwner}</span>
        </div>
        <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{question.prompt}</h3>
        <PracticeVisual question={question} />
        <QuestionInteraction question={question} attempt={attempt} onCheck={onCheck} />
      </div>
      <div className="space-y-3">
        <VisualFeedbackPanel question={question} attempt={attempt} />
        <ProgressiveHintPanel question={question} hintsUsed={attempt.hintsUsed} onHint={onHint} />
        <button type="button" className="action-secondary w-full justify-center" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </div>
    </div>
  );
}

function PracticeVisual({ question }: { question: TrigPracticeQuestion }) {
  if (question.type === "graph-match") return <GraphMatchMiniVisual />;
  if (question.type === "quadrant-sign" || question.id.includes("quadrant")) return <QuadrantMiniVisual />;
  if (question.type === "click-match") return <MatchMiniVisual pairs={question.matchPairs ?? []} />;
  if (question.type === "angle-from-ratio" || question.conceptId.includes("inverse")) return <UnitCircleMiniVisual />;
  return <FormulaMiniVisual question={question} />;
}

function QuestionInteraction({ question, attempt, onCheck }: { question: TrigPracticeQuestion; attempt: AttemptState; onCheck: (answer: unknown) => void }) {
  if (question.type === "click-match") return <ClickMatchQuestion question={question} attempt={attempt} onCheck={onCheck} />;
  if (question.type === "formula-fill" || question.type === "proof-step" || question.type === "numeric") return <FormulaFillQuestion question={question} attempt={attempt} onCheck={onCheck} />;
  if (question.type === "graph-match") return <GraphMatchQuestion question={question} attempt={attempt} onCheck={onCheck} />;
  return <VisualMCQQuestion question={question} attempt={attempt} onCheck={onCheck} />;
}

function VisualMCQQuestion({ question, attempt, onCheck }: { question: TrigPracticeQuestion; attempt: AttemptState; onCheck: (answer: unknown) => void }) {
  const [selected, setSelected] = useState<string>(typeof attempt.selectedAnswer === "string" ? attempt.selectedAnswer : "");
  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-2 md:grid-cols-2">
        {(question.choices ?? []).map((choice) => (
          <button
            key={choice.id}
            type="button"
            aria-label={`Select answer: ${choice.label}`}
            aria-pressed={selected === choice.id}
            className={selected === choice.id ? "rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-3 text-left font-bold text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100" : "rounded-2xl border border-slate-200 bg-white p-3 text-left font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"}
            onClick={() => setSelected(choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <button type="button" className="action-primary" onClick={() => onCheck(selected)} disabled={!selected}>
        <CheckCircle2 className="h-4 w-4" /> Check answer
      </button>
    </div>
  );
}

function ClickMatchQuestion({ question, attempt, onCheck }: { question: TrigPracticeQuestion; attempt: AttemptState; onCheck: (answer: unknown) => void }) {
  const pairs = question.matchPairs ?? [];
  const [activeSource, setActiveSource] = useState(pairs[0]?.source ?? "");
  const [placements, setPlacements] = useState<Record<string, string>>((attempt.selectedAnswer as Record<string, string>) ?? {});
  const targets = pairs.map((pair) => pair.target);

  function place(target: string) {
    if (!activeSource) return;
    setPlacements((current) => ({ ...current, [activeSource]: target }));
    const currentIndex = pairs.findIndex((pair) => pair.source === activeSource);
    setActiveSource(pairs[Math.min(pairs.length - 1, currentIndex + 1)]?.source ?? activeSource);
  }

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Source chips</p>
        <div className="flex flex-wrap gap-2">
          {pairs.map((pair) => (
            <button
              key={pair.source}
              type="button"
              aria-label={`Choose source ${pair.source}`}
              aria-pressed={activeSource === pair.source}
              className={activeSource === pair.source ? "rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white dark:bg-cyan-300 dark:text-slate-950" : placements[pair.source] ? "rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-900"}
              onClick={() => setActiveSource(pair.source)}
            >
              {pair.source}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Click a target zone</p>
        <div className="grid gap-2">
          {targets.map((target) => (
            <button key={target} type="button" aria-label={`Place ${activeSource || "selected source"} on ${target}`} className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/60 p-3 text-left text-sm font-bold text-cyan-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100" onClick={() => place(target)}>
              <MousePointer2 className="mr-2 inline h-4 w-4" /> {target}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Current matches: {Object.entries(placements).map(([source, target]) => `${source} -> ${target}`).join("; ") || "none yet"}
        </p>
        <button type="button" className="action-primary mt-3" onClick={() => onCheck(placements)}>
          <CheckCircle2 className="h-4 w-4" /> Check matches
        </button>
      </div>
    </div>
  );
}

function FormulaFillQuestion({ attempt, onCheck }: { question: TrigPracticeQuestion; attempt: AttemptState; onCheck: (answer: unknown) => void }) {
  const [value, setValue] = useState(typeof attempt.selectedAnswer === "string" ? attempt.selectedAnswer : "");
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-white"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type the missing expression"
        aria-label="Practice answer"
      />
      <button type="button" className="action-primary" onClick={() => onCheck(value)}>
        <CheckCircle2 className="h-4 w-4" /> Check
      </button>
    </div>
  );
}

function GraphMatchQuestion({ question, onCheck }: { question: TrigPracticeQuestion; attempt: AttemptState; onCheck: (answer: unknown) => void }) {
  const [guess, setGuess] = useState<GraphGuess>(() => ({ amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 }));
  const result = validateGraphMatch(guess, question.answer as GraphGuess);

  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        {(["amplitude", "frequency", "phase", "verticalShift"] as Array<keyof GraphGuess>).map((key) => (
          <label key={key} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
            <span id={`trig-practice-${key}`} className="text-xs font-black uppercase tracking-wide text-slate-500">{labelize(key)}</span>
            <input
              className="mt-2 w-full accent-cyan-500"
              type="range"
              aria-labelledby={`trig-practice-${key}`}
              aria-valuetext={`${labelize(key)} ${guess[key].toFixed(2)} ${result.checks[key] ? "matched" : "needs adjustment"}`}
              min={key === "phase" ? -Math.PI : key === "verticalShift" ? -2 : 0}
              max={key === "phase" ? Math.PI : key === "frequency" ? 4 : key === "verticalShift" ? 3 : 4}
              step={key === "phase" ? 0.1 : 0.1}
              value={guess[key]}
              onChange={(event) => setGuess((current) => ({ ...current, [key]: Number(event.target.value) }))}
            />
            <output className={result.checks[key] ? "mt-1 block text-xs font-bold text-emerald-600" : "mt-1 block text-xs font-bold text-slate-500"}>
              {guess[key].toFixed(2)} {result.checks[key] ? "matched" : "adjust"}
            </output>
          </label>
        ))}
      </div>
      <button type="button" className="action-primary" onClick={() => onCheck(guess)}>
        <Target className="h-4 w-4" /> Check graph match
      </button>
    </div>
  );
}

function ProgressiveHintPanel({ question, hintsUsed, onHint }: { question: TrigPracticeQuestion; hintsUsed: number; onHint: () => void }) {
  const visibleHints = question.hints.slice(0, hintsUsed);
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-black text-amber-900 dark:text-amber-100"><Lightbulb className="h-4 w-4" /> Progressive hints</p>
        <span className="text-xs font-bold text-amber-700 dark:text-amber-200">{hintsUsed}/4 used</span>
      </div>
      <div className="mt-3 space-y-2" aria-live="polite">
        {visibleHints.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-300">Hints appear one at a time, from visual nudge to full explanation.</p>}
        {visibleHints.map((hint) => (
          <div key={hint.level} className="rounded-xl bg-white/80 p-3 dark:bg-slate-950/50">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-200">Hint {hint.level}: {hint.title}</p>
            <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">{hint.body}</p>
            {hint.visualCue && <p className="mt-1 text-xs font-bold text-cyan-700 dark:text-cyan-200">{hint.visualCue}</p>}
          </div>
        ))}
      </div>
      <button type="button" className="action-secondary mt-3 w-full justify-center" onClick={onHint} disabled={hintsUsed >= question.hints.length}>
        <Lightbulb className="h-4 w-4" /> Show hint
      </button>
    </div>
  );
}

function VisualFeedbackPanel({ question, attempt }: { question: TrigPracticeQuestion; attempt: AttemptState }) {
  const tone = attempt.isCorrect ? "border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100" : attempt.feedback ? "border-rose-200 bg-rose-50/80 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100" : "border-slate-200 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200";
  return (
    <div className={`rounded-2xl border p-4 ${tone}`} role="status" aria-live="polite">
      <p className="text-sm font-black">{attempt.feedback ? (attempt.isCorrect ? "Nice check" : "Not yet") : "Feedback"}</p>
      <p className="mt-2 text-sm leading-6">
        {attempt.feedback ?? "Make a prediction, then check it. Feedback will explain the diagram, not just mark right or wrong."}
      </p>
      {attempt.feedback && <p className="mt-2 text-sm leading-6">{attempt.isCorrect ? question.explanation : question.commonMistake ?? question.explanation}</p>}
      {attempt.isCorrect && question.followUpPrompt && <p className="mt-2 rounded-xl bg-white/70 p-2 text-sm font-bold dark:bg-slate-950/40">Transfer: {question.followUpPrompt}</p>}
    </div>
  );
}

function ConceptProgressMiniTracker({ completed, total, score }: { completed: number; total: number; score: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div>
        <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><Trophy className="h-4 w-4 text-amber-500" /> Concept practice progress</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Local browser progress only. No login or backend required.</p>
      </div>
      <div className="min-w-[180px]">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} />
        </div>
        <p className="mt-1 text-right text-xs font-bold text-slate-500">{completed}/{total} complete</p>
      </div>
    </div>
  );
}

function GraphMatchMiniVisual() {
  const target = Array.from({ length: 90 }, (_, index) => {
    const x = -Math.PI + (index / 89) * Math.PI * 2;
    const y = GRAPH_TARGET.amplitude * Math.sin(GRAPH_TARGET.frequency * x + GRAPH_TARGET.phase) + GRAPH_TARGET.verticalShift;
    return `${index ? "L" : "M"}${40 + index * 3.3},${95 - y * 18}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 360 160" className="mt-4 h-44 w-full rounded-2xl bg-slate-950">
      <line x1="28" x2="330" y1="95" y2="95" stroke="#64748b" />
      <path d={target} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="24" y="28" fill="#e0f2fe" fontSize="13" fontWeight="800">target: y = 2sin(2x - pi/2) + 1</text>
    </svg>
  );
}

function QuadrantMiniVisual() {
  return (
    <svg viewBox="0 0 260 180" className="mt-4 h-44 w-full rounded-2xl bg-slate-50 dark:bg-slate-950">
      <line x1="130" x2="130" y1="20" y2="160" stroke="#94a3b8" />
      <line x1="30" x2="230" y1="90" y2="90" stroke="#94a3b8" />
      <text x="176" y="55" className="fill-slate-700 text-sm font-black dark:fill-slate-200">I: + + +</text>
      <text x="48" y="55" className="fill-emerald-700 text-sm font-black">II: + - -</text>
      <text x="44" y="132" className="fill-slate-700 text-sm font-black dark:fill-slate-200">III: - - +</text>
      <text x="174" y="132" className="fill-slate-700 text-sm font-black dark:fill-slate-200">IV: - + -</text>
    </svg>
  );
}

function MatchMiniVisual({ pairs }: { pairs: Array<{ source: string; target: string }> }) {
  return (
    <div className="mt-4 grid gap-2 rounded-2xl bg-slate-100 p-3 dark:bg-white/10 md:grid-cols-2">
      {pairs.map((pair) => (
        <div key={pair.source} className="rounded-xl bg-white p-3 text-sm dark:bg-slate-950/60">
          <span className="font-black text-cyan-700 dark:text-cyan-200">{pair.source}</span>
          <span className="mx-2 text-slate-400">{"->"}</span>
          <span className="text-slate-600 dark:text-slate-300">{pair.target}</span>
        </div>
      ))}
    </div>
  );
}

function UnitCircleMiniVisual() {
  return (
    <svg viewBox="0 0 260 180" className="mt-4 h-44 w-full rounded-2xl bg-cyan-50 dark:bg-cyan-400/10">
      <circle cx="130" cy="92" r="62" fill="none" stroke="#06b6d4" strokeWidth="4" />
      <line x1="40" x2="220" y1="92" y2="92" stroke="#94a3b8" />
      <line x1="130" x2="130" y1="22" y2="162" stroke="#94a3b8" />
      <line x1="130" y1="92" x2="184" y2="61" stroke="#0f172a" strokeWidth="4" className="dark:stroke-white" />
      <line x1="184" y1="92" x2="184" y2="61" stroke="#10b981" strokeDasharray="5 5" strokeWidth="3" />
      <text x="24" y="28" className="fill-slate-700 text-sm font-black dark:fill-slate-200">{"input ratio -> output angle"}</text>
    </svg>
  );
}

function FormulaMiniVisual({ question }: { question: TrigPracticeQuestion }) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Visual correction area</p>
      <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{question.prompt}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Use the diagram above on this page, then check your prediction here.</p>
    </div>
  );
}

function getFeedback(question: TrigPracticeQuestion, answer: unknown, isCorrect: boolean) {
  if (isCorrect) {
    if (typeof answer === "string") {
      const choice = question.choices?.find((item) => item.id === answer);
      return choice?.feedback ?? `Correct - ${question.explanation}`;
    }
    return `Correct - ${question.explanation}`;
  }
  if (typeof answer === "string") {
    const choice = question.choices?.find((item) => item.id === answer);
    if (choice?.feedback) return `Not yet. ${choice.feedback}`;
  }
  if (question.type === "graph-match" && typeof answer === "object" && answer) {
    const graph = validateGraphMatch(answer as Partial<GraphGuess>, question.answer as GraphGuess);
    const messages = [
      graph.checks.amplitude ? "Height matched." : "Height is still different.",
      graph.checks.frequency ? "Cycle length matched." : "Cycle length still differs.",
      graph.checks.phase ? "Slide matched." : "Try sliding the graph left or right.",
      graph.checks.verticalShift ? "Midline matched." : "Midline should be higher or lower.",
    ];
    return `Not yet. ${messages.join(" ")}`;
  }
  if (question.type === "click-match") return "Not yet. Check each source chip against the visual meaning before submitting again.";
  return `Not yet. ${question.commonMistake ?? "Use a hint and compare your answer with the visual."}`;
}

function baseHints(visual: string, concept: string, formula: string, step: string): TrigPracticeQuestion["hints"] {
  return [
    { level: 1, title: "Visual nudge", body: visual },
    { level: 2, title: "Concept nudge", body: concept },
    { level: 3, title: "Formula nudge", body: formula },
    { level: 4, title: "Step explanation", body: step },
  ];
}

function normalizeAnswer(value: unknown) {
  if (typeof value === "number") return Number(value.toFixed(6)).toString();
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function sameStringSet(a: unknown[], b: unknown[]) {
  const left = a.map(normalizeAnswer).sort();
  const right = b.map(normalizeAnswer).sort();
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function wrapPhase(value: number) {
  let result = value;
  while (result > Math.PI) result -= Math.PI * 2;
  while (result < -Math.PI) result += Math.PI * 2;
  return result;
}

function labelize(value: string) {
  return value.replace(/-/g, " ").replace(/([A-Z])/g, " $1").replace(/^\w/, (letter) => letter.toUpperCase());
}
