import SectionCard from "../components/ui/SectionCard";
import { useEffect } from "react";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import DerivativeSlopeVisualizer from "../visualizations/calculus/DerivativeSlopeVisualizer";
import IntegrationAreaVisualizer from "../visualizations/calculus/IntegrationAreaVisualizer";
import LimitsVisualizer from "../visualizations/calculus/LimitsVisualizer";
import MotionVisualizer from "../visualizations/calculus/MotionVisualizer";

export default function Calculus() {
  const topic = topics.find((item) => item.id === "calculus")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <LimitsVisualizer />
      <DerivativeSlopeVisualizer />
      <IntegrationAreaVisualizer />
      <MotionVisualizer />
      <SectionCard title="Applications">
        <div className="grid gap-3 md:grid-cols-5">{["Physics", "Optimization", "Economics", "AI training", "Engineering"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
