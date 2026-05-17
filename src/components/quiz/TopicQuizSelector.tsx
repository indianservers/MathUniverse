import { quizTopics } from "../../data/quizData";

type TopicQuizSelectorProps = {
  bestScores: Record<string, number>;
  onSelect: (topic: string) => void;
};

export default function TopicQuizSelector({ bestScores, onSelect }: TopicQuizSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quizTopics.map((topic) => (
        <button key={topic} className="glass-card rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:shadow-lg" onClick={() => onSelect(topic)}>
          <h3 className="font-bold">{topic}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">5 questions · Best {bestScores[topic] ?? 0}%</p>
        </button>
      ))}
    </div>
  );
}
