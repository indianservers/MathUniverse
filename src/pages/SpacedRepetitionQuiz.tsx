import { useMemo, useState } from "react";
import QuizCard from "../components/quiz/QuizCard";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { quizData } from "../data/quizData";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ReviewState = { ease: number; interval: number; due: string; reviews: number; correct: number };
type ReviewMap = Record<string, ReviewState>;

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function SpacedRepetitionQuiz() {
  const [reviews, setReviews] = useLocalStorage<ReviewMap>("math-universe-spaced-repetition", {});
  const [selected, setSelected] = useState<number | null>(null);
  const dueQuestions = useMemo(() => quizData.filter((question) => !reviews[question.id]?.due || reviews[question.id].due <= todayKey()).slice(0, 12), [reviews]);
  const current = dueQuestions[0] ?? quizData[0];
  const state = reviews[current.id] ?? freshState();

  const answer = (choice: number) => {
    setSelected(choice);
    const correct = choice === current.correctAnswerIndex;
    window.setTimeout(() => {
      setReviews((items) => ({ ...items, [current.id]: schedule(items[current.id] ?? freshState(), correct) }));
      setSelected(null);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <TopicHeader title="Spaced Repetition Quiz System" subtitle="Questions resurface with a forgetting-curve schedule stored locally in your browser." difficulty="Learning Tool" estimatedMinutes={8} />
      <SectionCard title="Due Review">
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <Metric label="Due now" value={dueQuestions.length} />
          <Metric label="Reviews" value={state.reviews} />
          <Metric label="Ease" value={state.ease.toFixed(2)} />
          <Metric label="Next interval" value={`${state.interval}d`} />
        </div>
        {current && <QuizCard question={current} selected={selected} onSelect={answer} />}
      </SectionCard>
      <SectionCard title="Review Queue">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quizData.slice(0, 18).map((question) => {
            const item = reviews[question.id] ?? freshState();
            return (
              <div key={question.id} className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="font-bold">{question.topic}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{question.question}</p>
                <p className="mt-3 text-xs font-semibold text-cyan-700 dark:text-cyan-200">Due {item.due}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}

function freshState(): ReviewState {
  return { ease: 2.5, interval: 0, due: todayKey(), reviews: 0, correct: 0 };
}

function schedule(previous: ReviewState, correct: boolean): ReviewState {
  const ease = Math.max(1.3, previous.ease + (correct ? 0.12 : -0.35));
  const interval = correct ? Math.max(1, Math.round((previous.interval || 1) * ease)) : 1;
  const due = new Date();
  due.setDate(due.getDate() + interval);
  return { ease, interval, due: due.toISOString().slice(0, 10), reviews: previous.reviews + 1, correct: previous.correct + (correct ? 1 : 0) };
}
