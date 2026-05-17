import { useEffect } from "react";
import AITutorPanel from "../components/ui/AITutorPanel";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import AIApplicationsGrid from "../visualizations/ai/AIApplicationsGrid";
import CryptographyVisualizer from "../visualizations/ai/CryptographyVisualizer";
import GPSTriangulationVisualizer from "../visualizations/ai/GPSTriangulationVisualizer";
import GradientDescentVisualizer from "../visualizations/ai/GradientDescentVisualizer";
import ImageCompressionVisualizer from "../visualizations/ai/ImageCompressionVisualizer";
import NeuralNetworkVisualizer from "../visualizations/ai/NeuralNetworkVisualizer";
import RoboticsPathVisualizer from "../visualizations/ai/RoboticsPathVisualizer";
import SignalProcessingVisualizer from "../visualizations/ai/SignalProcessingVisualizer";

export default function AIApplications() {
  const topic = topics.find((item) => item.id === "ai")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <SectionCard title="Math Powers Modern Intelligence" description="AI systems are built from algebra, calculus, probability, geometry, signals, and linear algebra. These demos show the ideas without needing a backend." />
      <AITutorPanel />
      <NeuralNetworkVisualizer />
      <GradientDescentVisualizer />
      <SignalProcessingVisualizer />
      <ImageCompressionVisualizer />
      <GPSTriangulationVisualizer />
      <CryptographyVisualizer />
      <RoboticsPathVisualizer />
      <AIApplicationsGrid />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
