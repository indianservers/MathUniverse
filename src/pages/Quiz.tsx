import { AnimatePresence, motion } from "framer-motion";
import { Settings, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import QuizCard from "../components/quiz/QuizCard";
import QuizProgress from "../components/quiz/QuizProgress";
import QuizResult from "../components/quiz/QuizResult";
import TopicQuizSelector from "../components/quiz/TopicQuizSelector";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { quizData } from "../data/quizData";
import { topics } from "../data/topics";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useProgress } from "../hooks/useProgress";
import { addQuizXp, trackQuizActivity } from "../components/layout/GlobalUx";

function QuizSettings({ timerEnabled, setTimerEnabled, leaderboardOpen, setLeaderboardOpen }: {
  timerEnabled: boolean;
  setTimerEnabled: (v: boolean) => void;
  leaderboardOpen: boolean;
  setLeaderboardOpen: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        onClick={() => setOpen((v) => !v)}
      >
        <Settings className="h-4 w-4" />
        Settings
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <span className="text-sm font-black">Quiz Settings</span>
              <button type="button" className="math-tool-button h-7 w-7 rounded-full" onClick={() => setOpen(false)}><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              <label className="flex cursor-pointer items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Timed questions (30s)</span>
                <input type="checkbox" checked={timerEnabled} onChange={(e) => setTimerEnabled(e.target.checked)} className="h-4 w-4 accent-cyan-500" />
              </label>
              <label className="flex cursor-pointer items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Show leaderboard</span>
                <input type="checkbox" checked={leaderboardOpen} onChange={(e) => setLeaderboardOpen(e.target.checked)} className="h-4 w-4 accent-cyan-500" />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopicSummaryCard({ topic, bestScore, questionCount, onStart }: {
  topic: string;
  bestScore: number;
  questionCount: number;
  onStart: () => void;
}) {
  const difficultyMap: Record<string, string> = {
    Algebra: "Medium",
    Geometry: "Easy",
    Trigonometry: "Medium",
    Calculus: "Hard",
    "Complex Numbers": "Hard",
    "Linear Algebra": "Hard",
    "AI Applications": "Medium",
  };
  const color = difficultyMap[topic] === "Easy" ? "text-emerald-600" : difficultyMap[topic] === "Hard" ? "text-rose-600" : "text-amber-600";
  return (
    <SectionCard title="Ready to start?">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-xl font-bold">{topic} Quiz</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold dark:bg-white/10">{questionCount} questions</span>
            <span className={`rounded-full bg-slate-100 px-3 py-1 font-semibold dark:bg-white/10 ${color}`}>{difficultyMap[topic] ?? "Mixed"}</span>
            {bestScore > 0 && <span className="rounded-full bg-cyan-100 px-3 py-1 font-bold text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">Best: {bestScore}%</span>}
            {bestScore === 0 && <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500 dark:bg-white/10">Not attempted</span>}
          </div>
        </div>
        <button type="button" className="action-primary" onClick={onStart}>Start Quiz</button>
      </div>
    </SectionCard>
  );
}

export default function Quiz() {
  const topic = topics.find((item) => item.id === "quiz")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted, saveQuizScore } = useProgress();
  const [bestScores, setBestScores] = useLocalStorage<Record<string, number>>("math-universe-quiz-best", {});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [assisted, setAssisted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [timerEnabled, setTimerEnabled] = useLocalStorage("math-universe-quiz-timer", false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const questions = useMemo(() => quizData.filter((question) => question.topic === selectedTopic), [selectedTopic]);
  const score = questions.reduce((sum, question, i) => sum + (answers[i] === question.correctAnswerIndex ? 1 : 0), 0);
  const wrongQuestions = questions.map((question, i) => ({ question, index: i })).filter(({ question, index: i }) => answers[i] !== undefined && answers[i] !== question.correctAnswerIndex);

  useEffect(() => {
    if (!timerEnabled || finished || !selectedTopic || !confirmed) return;
    setTimeLeft(30);
  }, [finished, index, selectedTopic, timerEnabled, confirmed]);

  useEffect(() => {
    if (!timerEnabled || finished || !selectedTopic || !confirmed) return;
    const id = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setAnswers((current) => current[index] === undefined ? { ...current, [index]: -1 } : current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [finished, index, selectedTopic, timerEnabled, confirmed]);

  function handleAnswer(choice: number) {
    setAnswers((current) => {
      if (current[index] !== undefined) return current;
      const next = { ...current, [index]: choice };
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        setIndex((i) => {
          if (i < questions.length - 1) return i + 1;
          return i;
        });
      }, 1500);
      return next;
    });
  }

  const finish = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    if (selectedTopic) {
      setBestScores((current) => ({ ...current, [selectedTopic]: Math.max(current[selectedTopic] ?? 0, percentage) }));
      saveQuizScore(selectedTopic, percentage);
      markTopicInteracted(topic.id);
      const unassistedCorrect = questions.reduce((sum, question, i) => sum + (answers[i] === question.correctAnswerIndex && !assisted[i] ? 1 : 0), 0);
      addQuizXp(unassistedCorrect * 10 - Object.values(assisted).filter(Boolean).length * 5);
      trackQuizActivity();
    }
    setFinished(true);
  };

  const restart = () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); setIndex(0); setAnswers({}); setAssisted({}); setFinished(false); setConfirmed(false); };
  const back = () => { setSelectedTopic(null); restart(); };

  return (
    <div className="space-y-5">
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />

      <div className="flex flex-wrap items-center gap-3">
        <QuizSettings timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} leaderboardOpen={leaderboardOpen} setLeaderboardOpen={setLeaderboardOpen} />
        {selectedTopic && confirmed && !finished && (
          <button type="button" className="action-secondary" onClick={back}>← Change topic</button>
        )}
      </div>

      {leaderboardOpen && (
        <SectionCard title="Your Best Scores">
          <div className="grid gap-2 md:grid-cols-2">
            {Object.entries(bestScores).map(([name, value]) => <div key={name} className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10"><span>{name}</span><span>{value}%</span></div>)}
            {Object.keys(bestScores).length === 0 && <p className="text-sm font-semibold text-slate-500">Finish a quiz to fill this local leaderboard.</p>}
          </div>
        </SectionCard>
      )}

      {!selectedTopic && (
        <SectionCard title="Choose a Topic">
          <TopicQuizSelector bestScores={bestScores} onSelect={(value) => { setSelectedTopic(value); restart(); }} />
        </SectionCard>
      )}

      {selectedTopic && !confirmed && !finished && (
        <TopicSummaryCard
          topic={selectedTopic}
          bestScore={bestScores[selectedTopic] ?? 0}
          questionCount={questions.length}
          onStart={() => setConfirmed(true)}
        />
      )}

      {selectedTopic && confirmed && !finished && questions[index] && (
        <SectionCard title={`${selectedTopic} Quiz`}>
          <QuizProgress current={index} total={questions.length} />
          {timerEnabled && <div className="mt-3 rounded-full bg-slate-100 p-2 text-center text-sm font-black dark:bg-white/10">Timer: {timeLeft}s</div>}
          <div className="mt-4">
            <QuizCard
              question={questions[index]}
              selected={answers[index] ?? null}
              assisted={Boolean(assisted[index])}
              onHint={() => setAssisted((current) => ({ ...current, [index]: true }))}
              onSelect={handleAnswer}
            />
          </div>
          {answers[index] !== undefined && index < questions.length - 1 && (
            <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">Auto-advancing in 1.5s...</p>
          )}
          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold dark:bg-white/10" onClick={back}>Back to Topics</button>
            <div className="flex gap-3">
              <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold disabled:opacity-40 dark:bg-white/10" disabled={index === 0} onClick={() => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); setIndex((v) => v - 1); }}>Previous</button>
              {index < questions.length - 1
                ? <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={() => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); setIndex((v) => v + 1); }}>Next</button>
                : <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={finish}>Finish</button>}
            </div>
          </div>
        </SectionCard>
      )}

      {selectedTopic && finished && (
        <QuizResult score={score} total={questions.length} bestScore={bestScores[selectedTopic] ?? Math.round((score / questions.length) * 100)} onRestart={restart} onBack={back}>
          {wrongQuestions.length > 0 && (
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
              <h3 className="font-black">Review wrong answers</h3>
              <div className="mt-3 space-y-3">
                {wrongQuestions.map(({ question, index: i }) => (
                  <div key={question.id} className="rounded-xl bg-white p-3 text-sm dark:bg-slate-950/60">
                    <p className="font-bold">{question.question}</p>
                    <p className="mt-2 text-emerald-700 dark:text-emerald-200">Correct: {question.options[question.correctAnswerIndex]}</p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">{question.explanation}{assisted[i] ? " Assisted." : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </QuizResult>
      )}
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
