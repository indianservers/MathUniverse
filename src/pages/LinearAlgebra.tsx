import { CheckCircle2, Clock3, ExternalLink, Home, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import EigenvectorVisualizer from "../visualizations/linear-algebra/EigenvectorVisualizer";
import LinearAlgebraApplications from "../visualizations/linear-algebra/LinearAlgebraApplications";
import MatrixTransformationVisualizer from "../visualizations/linear-algebra/MatrixTransformationVisualizer";
import VectorVisualizer from "../visualizations/linear-algebra/VectorVisualizer";

type LinearAlgebraMode = "vectors" | "matrix-transform" | "eigenvectors" | "applications" | "accuracy";

const modes: Array<{ id: LinearAlgebraMode; label: string }> = [
  { id: "vectors", label: "Vectors" },
  { id: "matrix-transform", label: "Matrix Transform" },
  { id: "eigenvectors", label: "Eigenvectors" },
  { id: "applications", label: "Applications" },
  { id: "accuracy", label: "Accuracy & Validation" },
];

export default function LinearAlgebra() {
  const topic = topics.find((item) => item.id === "linear-algebra")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [mode, setMode] = useState<LinearAlgebraMode>("vectors");
  const progress = getTopicProgress(topic.id);
  const progressPercent = useMemo(() => {
    const normalized = progress > 1 ? progress : progress * 100;
    return Math.max(25, Math.min(100, Math.round(normalized)));
  }, [progress]);

  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  const shareSetup = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Linear Algebra Lab", url });
      return;
    }
    await navigator.clipboard?.writeText(url);
  };

  return (
    <main className="linear-algebra-lab" onPointerDown={() => markTopicInteracted(topic.id)}>
      <header className="la-header">
        <div className="la-header-copy">
          <nav aria-label="Breadcrumb" className="la-breadcrumb"><Link to="/"><Home />Home</Link><span>Vectors</span><span>Vector Visualizer</span></nav>
          <div>
            <span className="la-kicker"><Sparkles />Scientific workspace</span>
            <h1>Linear Algebra Lab</h1>
            <p>Visualize vectors, matrices, transformations, rotations, scaling, and shearing.</p>
          </div>
        </div>
        <div className="la-header-actions">
          <span className="la-progress"><CheckCircle2 />In progress - {progressPercent}%</span>
          <span>Advanced</span>
          <span><Clock3 />60 min</span>
          <button type="button" onClick={() => void shareSetup()}><Share2 />Share this setup</button>
        </div>
      </header>

      <nav className="la-mode-tabs" aria-label="Linear algebra modes">
        {modes.map((item) => (
          <button key={item.id} type="button" className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {mode === "vectors" ? (
        <VectorVisualizer variant="workspace" />
      ) : (
        <section className="la-secondary-panel">
          <div className="la-secondary-head">
            <div>
              <span>{modes.find((item) => item.id === mode)?.label}</span>
              <h2>{mode === "matrix-transform" ? "Matrix transformation workspace" : mode === "eigenvectors" ? "Eigenvector explorer" : mode === "applications" ? "Applications and modelling" : "Accuracy and validation"}</h2>
            </div>
            <div>
              <Link to="/calculator">Calculator <ExternalLink /></Link>
              <Link to="/matrix-sandbox">Matrix sandbox <ExternalLink /></Link>
            </div>
          </div>
          {mode === "matrix-transform" && <MatrixTransformationVisualizer />}
          {mode === "eigenvectors" && <EigenvectorVisualizer />}
          {mode === "applications" && <LinearAlgebraApplications />}
          {mode === "accuracy" && <PhaseTwoDomainPanel domain="linear-algebra" />}
        </section>
      )}
    </main>
  );
}
