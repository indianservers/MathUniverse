import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import SectionCard from "../components/ui/SectionCard";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicTabs from "../components/ui/TopicTabs";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import FormulaVisualizationAtlas from "../visualizations/formulas/FormulaVisualizationAtlas";
import LinearEquationVisualizer from "../visualizations/algebra/LinearEquationVisualizer";
import QuadraticEquationVisualizer from "../visualizations/algebra/QuadraticEquationVisualizer";
import SimultaneousEquationsVisualizer from "../visualizations/algebra/SimultaneousEquationsVisualizer";

const algebraApplications = [
  { title: "Pricing models", visual: "pricing-models", description: "Linear formulas estimate revenue, discounts, and unit price changes." },
  { title: "Break-even analysis", visual: "break-even", description: "Systems of equations show where cost and revenue meet." },
  { title: "Physics motion", visual: "motion-model", description: "Quadratics model projectile height, stopping distance, and acceleration." },
  { title: "Machine learning linear models", visual: "linear-model", description: "Regression fits a weighted equation to predict outcomes from data." },
] as const;

export default function Algebra() {
  const topic = topics.find((item) => item.id === "algebra")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-5" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <ContinueCard routePrefix="/algebra" />
      <div className="flex flex-wrap gap-2">
        <Link to="/calculator" className="action-secondary">Open Scientific Calculator</Link>
      </div>
      <SectionCard title="Concept Intro" description="Algebra turns relationships into symbols. The visual layer lets you see how coefficients reshape lines, parabolas, and systems." />
      <TopicTabs tabs={[
        { id: "linear", label: "Linear", content: <LinearEquationVisualizer /> },
        { id: "quadratic", label: "Quadratic", content: <QuadraticEquationVisualizer /> },
        { id: "systems", label: "Systems", content: <SimultaneousEquationsVisualizer /> },
        { id: "formulas", label: "Formula Atlas", content: <FormulaVisualizationAtlas topic="algebra" /> },
      ]} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormulaBlock title="Line" formula="y=mx+c" />
        <FormulaBlock title="Quadratic" formula="y=ax^2+bx+c" />
      </div>
      <SectionCard title="Real-World Applications">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {algebraApplications.map((item) => (
            <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
          ))}
        </div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
