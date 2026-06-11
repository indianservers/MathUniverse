import SectionCard from "../components/ui/SectionCard";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
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
import SeriesBlockAccumulation from "../visualizations/calculus/SeriesBlockAccumulation";
import CalculusFundamentalsProblems from "../visualizations/calculus/CalculusFundamentalsProblems";

const calculusApplications = [
  { title: "Physics", visual: "physics", description: "Derivatives connect position, velocity, acceleration, and force." },
  { title: "Optimization", visual: "optimization", description: "Critical points reveal efficient designs and best operating ranges." },
  { title: "Economics", visual: "economics", description: "Marginal cost and revenue curves guide production decisions." },
  { title: "AI training", visual: "gradient-descent", description: "Gradients update model weights to reduce prediction error." },
  { title: "Engineering", visual: "engineering", description: "Integrals and rates model loads, flow, heat, and control response." },
] as const;

export default function Calculus() {
  const topic = topics.find((item) => item.id === "calculus")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="desktop-page-shell" onPointerDown={() => markTopicInteracted(topic.id)}>
      <div className="desktop-page-header">
        <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      </div>
      <div className="desktop-tab-surface grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-h-0 min-w-0 overflow-hidden">
          <TopicTabs tabs={[
            { id: "limits", label: "Limits", content: <LimitsVisualizer /> },
            { id: "derivatives", label: "Derivatives", content: <DerivativeSlopeVisualizer /> },
            { id: "integrals", label: "Integrals", content: <IntegrationAreaVisualizer /> },
            { id: "motion", label: "Motion", content: <MotionVisualizer /> },
            { id: "fundamentals-6-10", label: "Problems 6-10", content: <CalculusFundamentalsProblems /> },
            { id: "series-blocks", label: "Series Blocks", content: <SeriesBlockAccumulation /> },
            { id: "atlas", label: "Atlas", content: <CalculusConceptAtlas /> },
            { id: "formulas", label: "Formula Atlas", content: <FormulaVisualizationAtlas topic="calculus" /> },
          ]} />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
          <ContinueCard routePrefix="/calculus" />
          <Link to="/calculator" className="action-secondary w-full">Open Scientific Calculator</Link>
          <SectionCard title="Applications" compact>
            <div className="grid gap-2">
              {calculusApplications.map((item) => (
                <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
              ))}
            </div>
          </SectionCard>
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </div>
  );
}
