import { useEffect } from "react";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import EigenvectorVisualizer from "../visualizations/linear-algebra/EigenvectorVisualizer";
import LinearAlgebraApplications from "../visualizations/linear-algebra/LinearAlgebraApplications";
import MatrixTransformationVisualizer from "../visualizations/linear-algebra/MatrixTransformationVisualizer";
import VectorVisualizer from "../visualizations/linear-algebra/VectorVisualizer";

export default function LinearAlgebra() {
  const topic = topics.find((item) => item.id === "linear-algebra")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} formula={{ title: "Matrix Transform", formula: "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}" }} />
      <VectorVisualizer />
      <MatrixTransformationVisualizer />
      <EigenvectorVisualizer />
      <LinearAlgebraApplications />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
