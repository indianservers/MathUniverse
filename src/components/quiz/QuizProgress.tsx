type QuizProgressProps = {
  current: number;
  total: number;
};

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = total === 0 ? 0 : (current / total) * 100;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-semibold"><span>Question {Math.min(current + 1, total)} of {total}</span><span>{Math.round(percentage)}%</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300" style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
