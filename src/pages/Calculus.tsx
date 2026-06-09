import SectionCard from "../components/ui/SectionCard";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import FormulaVisualizationAtlas from "../visualizations/formulas/FormulaVisualizationAtlas";
import CalculusConceptAtlas from "../visualizations/calculus/CalculusConceptAtlas";
import DerivativeSlopeVisualizer from "../visualizations/calculus/DerivativeSlopeVisualizer";
import IntegrationAreaVisualizer from "../visualizations/calculus/IntegrationAreaVisualizer";
import LimitsVisualizer from "../visualizations/calculus/LimitsVisualizer";
import MotionVisualizer from "../visualizations/calculus/MotionVisualizer";

export default function Calculus() {
  const topic = topics.find((item) => item.id === "calculus")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <TopicTabs tabs={[
            { id: "limits", label: "Limits", content: <LimitsVisualizer /> },
            { id: "derivatives", label: "Derivatives", content: <DerivativeSlopeVisualizer /> },
            { id: "integrals", label: "Integrals", content: <IntegrationAreaVisualizer /> },
            { id: "motion", label: "Motion", content: <MotionVisualizer /> },
            { id: "atlas", label: "Atlas", content: <CalculusConceptAtlas /> },
            { id: "formulas", label: "Formula Atlas", content: <FormulaVisualizationAtlas topic="calculus" /> },
          ]} />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <ContinueCard routePrefix="/calculus" />
          <Link to="/calculator" className="action-secondary w-full">Open Scientific Calculator</Link>
          <SectionCard title="Applications" compact>
            <div className="flex flex-wrap gap-2">{["Physics", "Optimization", "Economics", "AI training", "Engineering"].map((item) => <span key={item} className="mini-chip">{item}</span>)}</div>
          </SectionCard>
        </aside>
      </div>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
