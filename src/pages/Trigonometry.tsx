import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect } from "react";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import SineCosineWaveVisualizer from "../visualizations/trigonometry/SineCosineWaveVisualizer";
import UnitCircleVisualizer from "../visualizations/trigonometry/UnitCircleVisualizer";
import WaveApplications from "../visualizations/trigonometry/WaveApplications";

export default function Trigonometry() {
  const topic = topics.find((item) => item.id === "trigonometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <UnitCircleVisualizer />
      <SineCosineWaveVisualizer />
      <WaveApplications />
      <FormulaBlock title="Formula Summary" formula={"\\sin^2\\theta+\\cos^2\\theta=1,\\quad y=A\\sin(fx+\\phi)"} />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
