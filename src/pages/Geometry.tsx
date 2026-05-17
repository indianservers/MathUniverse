import SectionCard from "../components/ui/SectionCard";
import { useEffect } from "react";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import CircleExplorer from "../visualizations/geometry/CircleExplorer";
import PythagorasVisualizer from "../visualizations/geometry/PythagorasVisualizer";
import Shape3DExplorer from "../visualizations/geometry/Shape3DExplorer";
import TriangleExplorer from "../visualizations/geometry/TriangleExplorer";

export default function Geometry() {
  const topic = topics.find((item) => item.id === "geometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <TriangleExplorer />
      <PythagorasVisualizer />
      <CircleExplorer />
      <Shape3DExplorer />
      <SectionCard title="Applications">
        <div className="grid gap-3 md:grid-cols-5">{["Architecture", "Engineering", "Game design", "Robotics", "AR/VR"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
