import { motion } from "framer-motion";
import { QuizQuestion } from "../../data/quizData";

type QuizCardProps = {
  question: QuizQuestion;
  selected: number | null;
  onSelect: (index: number) => void;
  assisted?: boolean;
  onHint?: () => void;
};

export default function QuizCard({ question, selected, onSelect, assisted = false, onHint }: QuizCardProps) {
  const answered = selected !== null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">{question.topic}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-white/10">{question.difficulty}</span>
        <span className="mini-chip">Grade {question.gradeBand}</span>
        <span className="mini-chip">{question.subskill.replace(/-/g, " ")}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold">{question.question}</h3>
      <div className="mt-3">
        <button type="button" className="tool-button" onClick={onHint} disabled={answered || assisted}>
          {assisted ? "Hint used" : "Use hint (-5 XP)"}
        </button>
        {assisted && <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">Hint: {question.hints[0]}</p>}
      </div>
      <div className="mt-5 grid gap-3">
        {question.options.map((option, index) => {
          const correct = answered && index === question.correctAnswerIndex;
          const wrong = answered && selected === index && index !== question.correctAnswerIndex;
          return (
            <button key={option} type="button" disabled={answered} onClick={() => onSelect(index)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${correct ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : wrong ? "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100" : "border-slate-200 bg-white/70 hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-md dark:border-white/10 dark:bg-white/5"}`}>
              {option}
            </button>
          );
        })}
      </div>
      {answered && <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm leading-6 dark:bg-white/10">
        <p>{question.explanation}</p>
        {selected !== question.correctAnswerIndex ? <p className="mt-2 font-semibold text-rose-700 dark:text-rose-200">Why that option fails: {selected != null && selected >= 0 ? question.distractorRationales[selected] : "No option was selected before the timer ended."} Tag: {question.misconceptionTag}.</p> : <p className="mt-2 font-semibold text-emerald-700 dark:text-emerald-200">Oracle verified: {question.scoringRubric.fullCredit}</p>}
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Next hint/solution step: {question.hints[1]}</p>
      </div>}
    </motion.div>
  );
}
