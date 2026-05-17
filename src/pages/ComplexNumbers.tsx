import { useEffect } from "react";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import ComplexMultiplicationVisualizer from "../visualizations/complex/ComplexMultiplicationVisualizer";
import ComplexPlaneVisualizer from "../visualizations/complex/ComplexPlaneVisualizer";
import EulerFormula2D from "../visualizations/complex/EulerFormula2D";
import EulerFormula3D from "../visualizations/complex/EulerFormula3D";
import EulerIdentityAnimation from "../visualizations/complex/EulerIdentityAnimation";

export default function ComplexNumbers() {
  const topic = topics.find((item) => item.id === "complex")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} formula={{ title: "Euler Formula", formula: "e^{i\\theta}=\\cos\\theta+i\\sin\\theta" }} />
      <SectionCard title="Introduction" description="Complex numbers turn the plane into an arithmetic system. Addition moves points; multiplication rotates and scales; Euler's formula reveals why waves and rotations share the same mathematics." />
      <ComplexPlaneVisualizer />
      <ComplexMultiplicationVisualizer />
      <EulerFormula2D />
      <EulerFormula3D />
      <EulerIdentityAnimation />
      <FormulaBlock title="Formula Summary" formula={"z=a+bi,\\quad |z|=\\sqrt{a^2+b^2},\\quad e^{i\\pi}+1=0"} />
      <SectionCard title="Applications">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{["Signal processing", "Electrical engineering", "Quantum mechanics", "Waves", "Graphics rotation", "Neural frequency analysis"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
