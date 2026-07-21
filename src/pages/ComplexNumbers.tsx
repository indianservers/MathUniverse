import { useEffect } from "react";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import ComplexMultiplicationVisualizer from "../visualizations/complex/ComplexMultiplicationVisualizer";
import ComplexPlaneVisualizer from "../visualizations/complex/ComplexPlaneVisualizer";
import EulerFormula2D from "../visualizations/complex/EulerFormula2D";
import EulerFormula3D from "../visualizations/complex/EulerFormula3D";
import EulerIdentityAnimation from "../visualizations/complex/EulerIdentityAnimation";

const complexApplications = [
  { title: "Signal processing", visual: "signal-processing", description: "Complex exponentials split signals into amplitude and phase." },
  { title: "Electrical engineering", visual: "electrical", description: "Phasors model AC voltage, current, impedance, and resonance." },
  { title: "Quantum mechanics", visual: "quantum", description: "Complex probability amplitudes encode phase and interference." },
  { title: "Waves", visual: "waves", description: "Rotating vectors explain oscillation, resonance, and superposition." },
  { title: "Graphics rotation", visual: "transform-3d", description: "Complex multiplication rotates and scales 2D geometry." },
  { title: "Neural frequency analysis", visual: "frequency-analysis", description: "Spectral features reveal repeating patterns in learned signals." },
] as const;

export default function ComplexNumbers() {
  const topic = topics.find((item) => item.id === "complex")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  return (
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} formula={{ title: "Euler Formula", formula: "e^{i\\theta}=\\cos\\theta+i\\sin\\theta" }} />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <TopicTabs tabs={[
            { id: "plane", label: "Plane", content: <ComplexPlaneVisualizer /> },
            { id: "multiply", label: "Multiplication", content: <ComplexMultiplicationVisualizer /> },
            { id: "euler-2d", label: "Euler 2D", content: <EulerFormula2D /> },
            { id: "euler-3d", label: "Euler 3D", content: <EulerFormula3D /> },
            { id: "identity", label: "Identity", content: <EulerIdentityAnimation /> },
          ]} />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <SectionCard title="Introduction" description="Complex numbers turn the plane into an arithmetic system. Addition moves points; multiplication rotates and scales; Euler's formula reveals why waves and rotations share the same mathematics." compact />
          <FormulaBlock title="Formula Summary" formula={"z=a+bi,\\quad |z|=\\sqrt{a^2+b^2},\\quad e^{i\\pi}+1=0"} />
          <SectionCard title="Applications" compact>
            <div className="grid gap-2">
              {complexApplications.map((item) => (
                <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
              ))}
            </div>
          </SectionCard>
        </aside>
      </div>
      <PhaseTwoDomainPanel domain="complex-numbers" />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
