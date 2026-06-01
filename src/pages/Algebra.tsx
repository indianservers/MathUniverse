import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicTabs from "../components/ui/TopicTabs";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import LinearEquationVisualizer from "../visualizations/algebra/LinearEquationVisualizer";
import QuadraticEquationVisualizer from "../visualizations/algebra/QuadraticEquationVisualizer";
import SimultaneousEquationsVisualizer from "../visualizations/algebra/SimultaneousEquationsVisualizer";

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
      ]} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormulaBlock title="Line" formula="y=mx+c" />
        <FormulaBlock title="Quadratic" formula="y=ax^2+bx+c" />
      </div>
      <SectionCard title="Real-World Applications">
        <div className="grid gap-3 md:grid-cols-4">{["Pricing models", "Break-even analysis", "Physics motion", "Machine learning linear models"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
