import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ChallengeState = Record<string, { solved: boolean; answer: string }>;

export default function DailyChallenge() {
  const [activity, setActivity] = useLocalStorage<ChallengeState>("math-universe-daily-challenges", {});
  const [answer, setAnswer] = useState("");
  const key = new Date().toISOString().slice(0, 10);
  const challenge = useMemo(() => makeChallenge(key), [key]);
  const solved = activity[key]?.solved ?? false;
  const streak = computeStreak(activity);
  const attempted = Boolean(activity[key]);
  const numericAnswer = Number(answer);
  const validAnswer = answer.trim() !== "" && Number.isFinite(numericAnswer);

  const submit = () => {
    if (!validAnswer) return;
    const ok = numericAnswer === challenge.answer;
    setActivity((items) => ({ ...items, [key]: { solved: ok, answer } }));
  };

  return (
    <StudioPageShell
      className="daily-studio"
      title="Daily Challenge Studio"
      subtitle="A deterministic problem seeded by the calendar date, with streak tracking and activity heatmap."
      breadcrumbs={["Home", "Practice", "Daily Challenge"]}
      difficulty="Daily Practice"
      estimatedMinutes={4}
      progress={solved ? 100 : attempted ? 45 : 0}
      status={[
        { id: "date", label: "Date", value: key, tone: "cyan" },
        { id: "streak", label: "Streak", value: streak, tone: solved ? "green" : "orange" },
      ]}
    >
      <div className="daily-workspace">
        <section className="daily-main-panel" aria-label="Daily challenge activity">
          <div className="daily-challenge-card">
            <span>Challenge for {key}</span>
            <h2>{challenge.prompt}</h2>
            <div className="daily-answer-row">
              <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Answer" inputMode="numeric" aria-label="Daily challenge answer" />
              <button type="button" onClick={submit} disabled={!validAnswer}>Check</button>
            </div>
            {answer.trim() && !validAnswer ? <p className="daily-feedback warn">Enter a finite numeric answer.</p> : null}
            {attempted && <p className={`daily-feedback ${solved ? "success" : "error"}`}>{solved ? "Solved. Nice streak fuel." : `Not yet. Correct answer: ${challenge.answer}`}</p>}
          </div>
          <SectionCard title="Calendar Heatmap" compact>
            <div className="daily-heatmap">
              {lastDays(56).map((day) => <div key={day} title={day} aria-label={`${day} ${activity[day]?.solved ? "solved" : activity[day] ? "attempted" : "not attempted"}`} className={activity[day]?.solved ? "solved" : activity[day] ? "missed" : ""} />)}
            </div>
          </SectionCard>
        </section>
        <aside className="daily-inspector thin-scrollbar" aria-label="Daily challenge inspector">
          <div className="daily-guide-card">
            <span>Today</span>
            <h2>{solved ? "Solved" : attempted ? "Retry ready" : "Not attempted"}</h2>
            <p>Use one short equation to keep the streak alive. The problem is deterministic, so refreshing keeps today’s challenge stable.</p>
          </div>
          <div className="daily-metric-grid">
            <Metric label="Streak" value={streak} />
            <Metric label="Answer" value={attempted ? Number(activity[key].answer) : 0} />
            <Metric label="Target" value={challenge.answer} />
            <Metric label="Solved" value={solved ? 1 : 0} />
          </div>
          <SectionCard title="Check Routine" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Isolate the x term.</p>
              <p>2. Divide by the coefficient.</p>
              <p>3. Substitute back to verify the equation.</p>
            </div>
          </SectionCard>
        </aside>
      </div>
    </StudioPageShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
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
