import { useEffect } from "react";
import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
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
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} formula={{ title: "Matrix Transform", formula: "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}" }} />
      <div className="compact-toolbar w-fit">
        <Link to="/calculator" className="action-secondary w-fit">Open Scientific Calculator</Link>
        <Link to="/matrix-sandbox" className="action-secondary w-fit">Open Matrix Operations Sandbox</Link>
      </div>
      <TopicTabs tabs={[
        { id: "vectors", label: "Vectors", content: <VectorVisualizer /> },
        { id: "matrix-transform", label: "Matrix Transform", content: <MatrixTransformationVisualizer /> },
        { id: "eigenvectors", label: "Eigenvectors", content: <EigenvectorVisualizer /> },
        { id: "applications", label: "Applications", content: <LinearAlgebraApplications /> },
        { id: "accuracy", label: "Accuracy & Validation", content: <PhaseTwoDomainPanel domain="linear-algebra" /> },
      ]} />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
