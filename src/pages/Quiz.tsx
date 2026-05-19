import { useEffect, useMemo, useState } from "react";
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

export default function Quiz() {
  const topic = topics.find((item) => item.id === "quiz")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted, saveQuizScore } = useProgress();
  const [bestScores, setBestScores] = useLocalStorage<Record<string, number>>("math-universe-quiz-best", {});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [assisted, setAssisted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [timerEnabled, setTimerEnabled] = useLocalStorage("math-universe-quiz-timer", false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const questions = useMemo(() => quizData.filter((question) => question.topic === selectedTopic), [selectedTopic]);
  const score = questions.reduce((sum, question, i) => sum + (answers[i] === question.correctAnswerIndex ? 1 : 0), 0);
  const wrongQuestions = questions.map((question, i) => ({ question, index: i })).filter(({ question, index: i }) => answers[i] !== undefined && answers[i] !== question.correctAnswerIndex);

  useEffect(() => {
    if (!timerEnabled || finished || !selectedTopic) return;
    setTimeLeft(30);
  }, [finished, index, selectedTopic, timerEnabled]);

  useEffect(() => {
    if (!timerEnabled || finished || !selectedTopic) return;
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
  }, [finished, index, selectedTopic, timerEnabled]);

  const finish = () => {
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

  const restart = () => { setIndex(0); setAnswers({}); setAssisted({}); setFinished(false); };
  const back = () => { setSelectedTopic(null); restart(); };

  return (
    <div className="space-y-6">
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={timerEnabled} onChange={(event) => setTimerEnabled(event.target.checked)} />
          Timed questions
        </label>
        <button type="button" className="tool-button" onClick={() => setLeaderboardOpen((value) => !value)}>Leaderboard</button>
      </div>
      {leaderboardOpen && (
        <SectionCard title="Your Best Scores">
          <div className="grid gap-2 md:grid-cols-2">
            {Object.entries(bestScores).map(([name, value]) => <div key={name} className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-sm font-black dark:bg-white/10"><span>{name}</span><span>{value}%</span></div>)}
            {Object.keys(bestScores).length === 0 && <p className="text-sm font-semibold text-slate-500">Finish a quiz to fill this local leaderboard.</p>}
          </div>
        </SectionCard>
      )}
      {!selectedTopic && <SectionCard title="Choose a Topic"><TopicQuizSelector bestScores={bestScores} onSelect={(value) => { setSelectedTopic(value); restart(); }} /></SectionCard>}
      {selectedTopic && !finished && questions[index] && (
        <SectionCard title={`${selectedTopic} Quiz`}>
          <QuizProgress current={index} total={questions.length} />
          {timerEnabled && <div className="mt-4 rounded-full bg-slate-100 p-2 text-center text-sm font-black dark:bg-white/10">Timer: {timeLeft}s</div>}
          <div className="mt-5"><QuizCard question={questions[index]} selected={answers[index] ?? null} assisted={Boolean(assisted[index])} onHint={() => setAssisted((current) => ({ ...current, [index]: true }))} onSelect={(choice) => setAnswers((current) => ({ ...current, [index]: choice }))} /></div>
          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold dark:bg-white/10" onClick={back}>Back to Topics</button>
            <div className="flex gap-3">
              <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold disabled:opacity-40 dark:bg-white/10" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Previous</button>
              {index < questions.length - 1 ? <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={() => setIndex((value) => value + 1)}>Next</button> : <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={finish}>Finish</button>}
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
