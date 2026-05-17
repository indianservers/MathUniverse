import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ChallengeState = Record<string, { solved: boolean; answer: string }>;

export default function DailyChallenge() {
  const [activity, setActivity] = useLocalStorage<ChallengeState>("math-universe-daily-challenges", {});
  const [answer, setAnswer] = useState("");
  const key = new Date().toISOString().slice(0, 10);
  const challenge = useMemo(() => makeChallenge(key), [key]);
  const solved = activity[key]?.solved ?? false;
  const streak = computeStreak(activity);

  const submit = () => {
    const ok = Number(answer) === challenge.answer;
    setActivity((items) => ({ ...items, [key]: { solved: ok, answer } }));
  };

  return (
    <div className="space-y-6">
      <TopicHeader title="Daily Challenge" subtitle="A deterministic problem seeded by the calendar date, with streak tracking and activity heatmap." difficulty="Daily Practice" estimatedMinutes={4} />
      <SectionCard title={`Challenge for ${key}`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <p className="text-2xl font-black">{challenge.prompt}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono dark:border-white/10 dark:bg-slate-950/60" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Answer" />
              <button className="action-primary" type="button" onClick={submit}>Check</button>
            </div>
            {activity[key] && <p className={`mt-4 font-bold ${solved ? "text-emerald-600" : "text-rose-600"}`}>{solved ? "Solved. Nice streak fuel." : `Not yet. Correct answer: ${challenge.answer}`}</p>}
          </div>
          <div className="rounded-2xl bg-slate-100 p-5 dark:bg-white/10">
            <p className="text-xs font-bold uppercase text-slate-500">Current streak</p>
            <p className="mt-2 text-5xl font-black">{streak}</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Calendar Heatmap">
        <div className="grid grid-cols-14 gap-1">
          {lastDays(56).map((day) => <div key={day} title={day} className={`h-5 rounded ${activity[day]?.solved ? "bg-emerald-500" : activity[day] ? "bg-rose-300" : "bg-slate-200 dark:bg-white/10"}`} />)}
        </div>
      </SectionCard>
    </div>
  );
}

function makeChallenge(date: string) {
  const seed = [...date].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const a = (seed % 9) + 2;
  const b = (seed % 7) + 3;
  const c = (seed % 5) + 1;
  return { prompt: `Solve for x: ${a}x + ${b} = ${a * c + b}`, answer: c };
}

function lastDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    return date.toISOString().slice(0, 10);
  });
}

function computeStreak(activity: ChallengeState) {
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (activity[date.toISOString().slice(0, 10)]?.solved) streak += 1;
    else break;
  }
  return streak;
}
