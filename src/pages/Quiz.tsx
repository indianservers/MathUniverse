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

export default function Quiz() {
  const topic = topics.find((item) => item.id === "quiz")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted, saveQuizScore } = useProgress();
  const [bestScores, setBestScores] = useLocalStorage<Record<string, number>>("math-universe-quiz-best", {});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const questions = useMemo(() => quizData.filter((question) => question.topic === selectedTopic), [selectedTopic]);
  const score = questions.reduce((sum, question, i) => sum + (answers[i] === question.correctAnswerIndex ? 1 : 0), 0);

  const finish = () => {
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    if (selectedTopic) {
      setBestScores((current) => ({ ...current, [selectedTopic]: Math.max(current[selectedTopic] ?? 0, percentage) }));
      saveQuizScore(selectedTopic, percentage);
      markTopicInteracted(topic.id);
    }
    setFinished(true);
  };

  const restart = () => { setIndex(0); setAnswers({}); setFinished(false); };
  const back = () => { setSelectedTopic(null); restart(); };

  return (
    <div className="space-y-6">
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      {!selectedTopic && <SectionCard title="Choose a Topic"><TopicQuizSelector bestScores={bestScores} onSelect={(value) => { setSelectedTopic(value); restart(); }} /></SectionCard>}
      {selectedTopic && !finished && questions[index] && (
        <SectionCard title={`${selectedTopic} Quiz`}>
          <QuizProgress current={index} total={questions.length} />
          <div className="mt-5"><QuizCard question={questions[index]} selected={answers[index] ?? null} onSelect={(choice) => setAnswers((current) => ({ ...current, [index]: choice }))} /></div>
          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold dark:bg-white/10" onClick={back}>Back to Topics</button>
            <div className="flex gap-3">
              <button className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold disabled:opacity-40 dark:bg-white/10" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Previous</button>
              {index < questions.length - 1 ? <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={() => setIndex((value) => value + 1)}>Next</button> : <button className="rounded-2xl bg-slate-950 px-5 py-3 text-white disabled:opacity-40 dark:bg-white dark:text-slate-950" disabled={answers[index] === undefined} onClick={finish}>Finish</button>}
            </div>
          </div>
        </SectionCard>
      )}
      {selectedTopic && finished && <QuizResult score={score} total={questions.length} bestScore={bestScores[selectedTopic] ?? Math.round((score / questions.length) * 100)} onRestart={restart} onBack={back} />}
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
