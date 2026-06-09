import { quizTopicCounts, quizTopics } from "../../data/quizData";

type TopicQuizSelectorProps = {
  bestScores: Record<string, number>;
  onSelect: (topic: string) => void;
};

export default function TopicQuizSelector({ bestScores, onSelect }: TopicQuizSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quizTopics.map((topic) => (
        <button key={topic} className="glass-card rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg dark:hover:border-cyan-400/25" onClick={() => onSelect(topic)}>
          <h3 className="font-bold">{topic}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{quizTopicCounts[topic] ?? 0} questions - Best {bestScores[topic] ?? 0}%</p>
        </button>
      ))}
    </div>
  );
}
