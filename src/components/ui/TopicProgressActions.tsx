import { CheckCircle2 } from "lucide-react";
import { useProgress } from "../../hooks/useProgress";

type TopicProgressActionsProps = {
  topicId: string;
};

export default function TopicProgressActions({ topicId }: TopicProgressActionsProps) {
  const { markTopicCompleted, getTopicProgress } = useProgress();
  const progress = getTopicProgress(topicId);

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => markTopicCompleted(topicId)}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
      >
        <CheckCircle2 className="h-4 w-4" />
        {progress >= 100 ? "Completed" : "Mark as Complete"}
      </button>
    </div>
  );
}
