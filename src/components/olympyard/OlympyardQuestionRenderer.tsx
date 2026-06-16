import { CheckCircle2, Eye, HelpCircle, Lightbulb, MousePointer2, RefreshCw, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  revealNextHintCount,
  solutionRevealState,
  validateOlympyardAnswer,
  type OlympyardQuestion,
  type OlympyardValidationResult,
} from "../../data/olympyardQuestions";

type OlympyardQuestionRendererProps = {
  question: OlympyardQuestion;
  onAttempt?: (result: OlympyardValidationResult) => void;
  onTrySimilar?: () => void;
};

export function OlympyardChallengeCard({ question, index, total, onAttempt, onTrySimilar }: {
  question: OlympyardQuestion;
  index: number;
  total: number;
  onAttempt?: (question: OlympyardQuestion, result: OlympyardValidationResult) => void;
  onTrySimilar?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mini-chip">Question {index + 1} of {total}</span>
          <span className="mini-chip bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{question.type.replace("-", " ")}</span>
          <span className="mini-chip bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-100">{question.difficulty}</span>
        </div>
        <span className="mini-chip">{question.estimatedSeconds ? `${question.estimatedSeconds}s estimate` : "No timer"}</span>
      </div>
      <OlympyardQuestionRenderer question={question} onAttempt={(result) => onAttempt?.(question, result)} onTrySimilar={onTrySimilar} />
    </div>
  );
}

export default function OlympyardQuestionRenderer({ question, onAttempt, onTrySimilar }: OlympyardQuestionRendererProps) {
  const [answer, setAnswer] = useState<unknown>(initialAnswer(question));
  const [attempt, setAttempt] = useState<OlympyardValidationResult | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const canCheck = isAnswerReady(question, answer);
  const showSolution = solutionRevealState(solutionOpen, Boolean(attempt));

  function checkAnswer() {
    const result = validateOlympyardAnswer(question, answer);
    setAttempt(result);
    onAttempt?.(result);
  }

  function tryAgain() {
    setAnswer(initialAnswer(question));
    setAttempt(null);
    setSolutionOpen(false);
    setHintCount(0);
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{question.title}</h3>
        <p className="mt-2 text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">{question.prompt}</p>
      </div>

      <QuestionVisual question={question} />

      {question.type === "mcq" || question.type === "visual-mcq" || question.type === "geometry-marker" ? (
        <OlympyardVisualMCQ question={question} answer={answer} onAnswer={setAnswer} checked={attempt} />
      ) : null}
      {question.type === "numeric" ? <OlympyardNumericQuestion question={question} answer={answer} onAnswer={setAnswer} checked={attempt} /> : null}
      {question.type === "click-match" ? <OlympyardClickMatch question={question} answer={answer} onAnswer={setAnswer} checked={attempt} /> : null}
      {question.type === "pattern" ? <OlympyardPatternQuestion question={question} answer={answer} onAnswer={setAnswer} checked={attempt} /> : null}
      {question.type === "step-fill" ? <OlympyardStepFill question={question} answer={answer} onAnswer={setAnswer} checked={attempt} /> : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="action-primary disabled:cursor-not-allowed disabled:opacity-60" onClick={checkAnswer} disabled={!canCheck} aria-disabled={!canCheck}>
          <CheckCircle2 className="h-4 w-4" />
          Check
        </button>
        <button type="button" className="action-secondary" onClick={tryAgain}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <button
          type="button"
          className="tool-button"
          onClick={() => setHintCount((count) => revealNextHintCount(count, question.hints.length))}
          disabled={hintCount >= question.hints.length}
        >
          <Lightbulb className="h-4 w-4" />
          {hintCount >= question.hints.length ? "All hints shown" : "Reveal hint"}
        </button>
        <button type="button" className="tool-button" onClick={() => setSolutionOpen((value) => !value)}>
          <Eye className="h-4 w-4" />
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      </div>

      <OlympyardHintLadder hints={question.hints} visibleCount={hintCount} />
      {attempt ? <OlympyardFeedbackPanel result={attempt} /> : null}
      {showSolution ? <OlympyardSolutionReveal question={question} onTrySimilar={onTrySimilar} /> : null}
    </div>
  );
}

export function OlympyardVisualMCQ({ question, answer, onAnswer, checked }: {
  question: OlympyardQuestion;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  checked: OlympyardValidationResult | null;
}) {
  const selected = Array.isArray(answer) ? answer.map(String) : [String(answer ?? "")];
  const multi = Array.isArray(question.answer);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(question.choices ?? []).map((choice) => {
        const active = selected.includes(choice.id);
        const correct = checked && choice.correct;
        const wrong = checked && active && !choice.correct;
        return (
          <button
            key={choice.id}
            type="button"
            aria-pressed={active}
          className={`min-h-24 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              correct
                ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-100"
                : wrong
                  ? "border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-400/15 dark:text-rose-100"
                  : active
                    ? "border-cyan-400 bg-cyan-50 text-cyan-900 shadow-md dark:bg-cyan-400/10 dark:text-cyan-50"
                    : "border-slate-200 bg-white hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
            }`}
            onClick={() => onAnswer(nextChoiceAnswer(selected, choice.id, multi))}
            aria-label={`Answer ${choice.id}: ${choice.label}`}
          >
            <span className="text-sm font-black uppercase text-slate-500">{choice.id}</span>
            <span className="mt-1 block text-base font-black">{choice.label}</span>
            {choice.visual ? <span className="mt-2 block rounded-lg bg-slate-100 p-2 text-sm font-semibold dark:bg-white/10">{choice.visual}</span> : null}
            {checked && (active || correct) && choice.feedback ? <span className="mt-2 block text-sm">{choice.feedback}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function OlympyardNumericQuestion({ question: _question, answer, onAnswer, checked }: {
  question: OlympyardQuestion;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  checked: OlympyardValidationResult | null;
}) {
  return (
    <label className="block max-w-md">
      <span className="text-sm font-black text-slate-700 dark:text-slate-200">Your number</span>
      <input
        className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-lg font-black dark:bg-slate-950 ${
          checked?.correct ? "border-emerald-400" : checked ? "border-rose-400" : "border-slate-200 dark:border-white/10"
        }`}
        inputMode="decimal"
        value={String(answer ?? "")}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder="Type the value"
      />
    </label>
  );
}

export function OlympyardClickMatch({ question, answer, onAnswer, checked }: {
  question: OlympyardQuestion;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  checked: OlympyardValidationResult | null;
}) {
  const pairs = useMemo(() => question.matchingPairs ?? [], [question.matchingPairs]);
  const current = asRecord(answer);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const rightItems = useMemo(() => [...pairs].sort((left, right) => left.right.localeCompare(right.right)), [pairs]);

  function place(leftId: string, rightId: string) {
    onAnswer({ ...current, [leftId]: rightId });
    setSelectedLeft(null);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase text-slate-500">Click a left chip</p>
        {pairs.map((pair) => (
          <button
            key={pair.leftId}
            type="button"
            className={`w-full rounded-xl border p-3 text-left font-black ${selectedLeft === pair.leftId ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`}
            aria-pressed={selectedLeft === pair.leftId}
            onClick={() => setSelectedLeft(pair.leftId)}
          >
            {pair.left}
            <span className="ml-2 text-sm font-semibold text-slate-500">{current[pair.leftId] ? `-> ${rightLabel(pairs, current[pair.leftId])}` : "not matched"}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-black uppercase text-slate-500">Then place a match</p>
        {rightItems.map((pair) => (
          <button
            key={pair.rightId}
            type="button"
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left font-black transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
            onClick={() => selectedLeft && place(selectedLeft, pair.rightId)}
            disabled={!selectedLeft}
          >
            <MousePointer2 className="mr-2 inline h-4 w-4 text-cyan-600" />
            {pair.right}
          </button>
        ))}
      </div>
      {checked ? <PairStatus question={question} answer={current} /> : null}
    </div>
  );
}

export function OlympyardPatternQuestion({ question, answer, onAnswer, checked }: {
  question: OlympyardQuestion;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  checked: OlympyardValidationResult | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(question.pattern?.sequence ?? []).map((item, index) => (
          <div key={`${item}-${index}`} className="grid h-14 min-w-14 place-items-center rounded-xl border border-slate-200 bg-white px-4 text-xl font-black dark:border-white/10 dark:bg-white/5">
            {index === question.pattern?.blankIndex ? "?" : item}
          </div>
        ))}
      </div>
      <OlympyardNumericQuestion question={question} answer={answer} onAnswer={onAnswer} checked={checked} />
    </div>
  );
}

export function OlympyardStepFill({ question, answer, onAnswer, checked }: {
  question: OlympyardQuestion;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  checked: OlympyardValidationResult | null;
}) {
  const values = Array.isArray(answer) ? answer.map(String) : [];
  return (
    <div className="space-y-3">
      {(question.stepFill?.steps ?? []).map((step, index) => (
        <label key={`${step}-${index}`} className="block rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{step}</span>
          <input
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold dark:border-white/10 dark:bg-slate-950"
            value={values[index] ?? ""}
            onChange={(event) => onAnswer(values.map((value, valueIndex) => valueIndex === index ? event.target.value : value))}
            placeholder="Fill this step"
          />
        </label>
      ))}
      {checked ? <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Each blank is checked in order.</p> : null}
    </div>
  );
}

export function OlympyardHintLadder({ hints, visibleCount }: { hints: OlympyardQuestion["hints"]; visibleCount: number }) {
  if (visibleCount <= 0) return null;
  return (
    <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-400/10" aria-live="polite">
      <p className="flex items-center gap-2 text-sm font-black uppercase text-amber-800 dark:text-amber-100">
        <HelpCircle className="h-4 w-4" />
        Hint ladder
      </p>
      <div className="mt-3 grid gap-2">
        {hints.slice(0, visibleCount).map((hint) => (
          <div key={hint.level} className="rounded-lg bg-white/80 p-3 text-sm dark:bg-slate-950/40">
            <p className="font-black">{hint.level}. {hint.title}</p>
            <p className="mt-1 leading-6">{hint.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OlympyardSolutionReveal({ question, onTrySimilar }: { question: OlympyardQuestion; onTrySimilar?: () => void }) {
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-400/20 dark:bg-violet-400/10">
      <p className="flex items-center gap-2 text-sm font-black uppercase text-violet-800 dark:text-violet-100">
        <Sparkles className="h-4 w-4" />
        Solution path
      </p>
      <ol className="mt-3 space-y-2">
        {question.solutionSteps.map((step, index) => (
          <li key={step} className="rounded-lg bg-white/80 p-3 text-sm font-semibold leading-6 dark:bg-slate-950/40">
            {index + 1}. {step}
          </li>
        ))}
      </ol>
      {question.commonMistake ? <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm font-semibold text-rose-700 dark:bg-slate-950/40 dark:text-rose-100">Common mistake: {question.commonMistake}</p> : null}
      <button type="button" className="action-secondary mt-3" onClick={onTrySimilar}>
        <RefreshCw className="h-4 w-4" />
        Try Similar
      </button>
    </div>
  );
}

export function OlympyardFeedbackPanel({ result }: { result: OlympyardValidationResult }) {
  return (
    <div className={`rounded-xl p-4 ${result.correct ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-100"}`} aria-live="polite">
      <p className="flex items-center gap-2 font-black">
        {result.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        {result.correct ? "That works." : "Not yet."}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6">{result.feedback}</p>
    </div>
  );
}

function QuestionVisual({ question }: { question: OlympyardQuestion }) {
  if (!question.visualModel && !question.visualState) return null;
  return (
    <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500">Visual model</p>
      <p className="mt-1 text-sm font-bold">{question.visualModel ?? "Visual reasoning model"}</p>
      {question.visualState ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(question.visualState).map(([key, value]) => (
            <span key={key} className="mini-chip">{key}: {String(value)}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PairStatus({ question, answer }: { question: OlympyardQuestion; answer: Record<string, string> }) {
  return (
    <div className="md:col-span-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
      {(question.matchingPairs ?? []).map((pair) => {
        const correct = answer[pair.leftId] === pair.rightId;
        return (
          <span key={pair.leftId} className={`mr-2 inline-flex rounded-full px-3 py-1 font-bold ${correct ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>
            {pair.left}: {correct ? "matched" : "check"}
          </span>
        );
      })}
    </div>
  );
}

function initialAnswer(question: OlympyardQuestion): unknown {
  if (Array.isArray(question.answer)) return question.type === "step-fill" ? question.answer.map(() => "") : [];
  if (question.type === "click-match") return {};
  return "";
}

function isAnswerReady(question: OlympyardQuestion, answer: unknown) {
  if (question.type === "click-match") return Object.keys(asRecord(answer)).length > 0;
  if (Array.isArray(answer)) return answer.some((item) => String(item).trim().length > 0);
  return String(answer ?? "").trim().length > 0;
}

function nextChoiceAnswer(selected: string[], choiceId: string, multi: boolean) {
  if (!multi) return choiceId;
  return selected.includes(choiceId) ? selected.filter((id) => id !== choiceId) : [...selected.filter(Boolean), choiceId];
}

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, String(entry)]));
}

function rightLabel(pairs: NonNullable<OlympyardQuestion["matchingPairs"]>, rightId: string) {
  return pairs.find((pair) => pair.rightId === rightId)?.right ?? rightId;
}
