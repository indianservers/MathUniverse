type QuizResultProps = {
  score: number;
  total: number;
  bestScore: number;
  onRestart: () => void;
  onBack: () => void;
};

export default function QuizResult({ score, total, bestScore, onRestart, onBack }: QuizResultProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  const status = percentage < 50 ? "Beginner" : percentage <= 75 ? "Good" : "Excellent";
  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <p className="text-sm font-semibold uppercase text-cyan-600 dark:text-cyan-300">Final Result</p>
      <p className="mt-2 text-5xl font-bold">{percentage}%</p>
      <p className="mt-2 text-lg font-semibold">{status}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{score} of {total} correct · Best score {bestScore}%</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white dark:bg-white dark:text-slate-950" onClick={onRestart}>Restart Quiz</button>
        <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold dark:bg-white/10" onClick={onBack}>Topic Selection</button>
      </div>
    </div>
  );
}
