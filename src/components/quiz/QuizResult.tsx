type QuizResultProps = {
  score: number;
  total: number;
  bestScore: number;
  onRestart: () => void;
  onBack: () => void;
  children?: React.ReactNode;
};

export default function QuizResult({ score, total, bestScore, onRestart, onBack, children }: QuizResultProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  const status = percentage < 50 ? "Beginner" : percentage <= 75 ? "Good" : "Excellent";
  return (
    <div className={`glass-card relative overflow-hidden rounded-2xl p-6 text-center ${percentage >= 80 ? "result-pop" : ""}`}>
      {percentage >= 80 && <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,#22d3ee_0_3px,transparent_4px),radial-gradient(circle_at_80%_30%,#f59e0b_0_3px,transparent_4px),radial-gradient(circle_at_45%_75%,#10b981_0_3px,transparent_4px)] [background-size:80px_80px]" />}
      <p className="text-sm font-semibold uppercase text-cyan-600 dark:text-cyan-300">Final Result</p>
      <p className="mt-2 text-5xl font-bold">{percentage}%</p>
      <p className="mt-2 text-lg font-semibold">{status}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{score} of {total} correct · Best score {bestScore}%</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white dark:bg-white dark:text-slate-950" onClick={onRestart}>Restart Quiz</button>
        <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold dark:bg-white/10" onClick={onBack}>Topic Selection</button>
      </div>
      {children && <div className="relative mt-6 text-left">{children}</div>}
    </div>
  );
}
