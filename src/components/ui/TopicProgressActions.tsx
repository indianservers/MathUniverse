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
        className="action-primary"
      >
        <CheckCircle2 className="h-4 w-4" />
        {progress >= 100 ? "Completed" : "Mark as Complete"}
      </button>
    </div>
  );
}
