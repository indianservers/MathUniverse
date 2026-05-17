import { useEffect } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import CoinTossSimulator from "../visualizations/statistics/CoinTossSimulator";
import DiceSimulator from "../visualizations/statistics/DiceSimulator";
import MeanMedianModeVisualizer from "../visualizations/statistics/MeanMedianModeVisualizer";
import NormalDistributionVisualizer from "../visualizations/statistics/NormalDistributionVisualizer";
import RegressionCorrelationVisualizer from "../visualizations/statistics/RegressionCorrelationVisualizer";

export default function Statistics() {
  const topic = topics.find((item) => item.id === "statistics")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <CoinTossSimulator />
      <DiceSimulator />
      <MeanMedianModeVisualizer />
      <NormalDistributionVisualizer />
      <RegressionCorrelationVisualizer />
      <SectionCard title="Applications">
        <div className="grid gap-3 md:grid-cols-5">{["Research", "AI datasets", "Business forecasting", "Risk analysis", "Quality control"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
