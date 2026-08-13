import { useEffect, useMemo, useState } from "react";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import StudioPageShell from "../components/ui/StudioPageShell";
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

type ComplexTabId = "plane" | "multiply" | "euler-2d" | "euler-3d" | "identity" | "applications";

export default function ComplexNumbers() {
  const topic = topics.find((item) => item.id === "complex")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [activeTab, setActiveTab] = useState<ComplexTabId>(() => readComplexTabFromUrl());
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const progress = normalizeProgress(getTopicProgress(topic.id));
  const tabs = useMemo(() => [
    {
      id: "plane" as const,
      label: "Plane",
      summary: "Plot a + bi, read modulus and argument, and connect points to vector movement.",
      focus: "z = a + bi",
      content: <ComplexPlaneVisualizer />,
    },
    {
      id: "multiply" as const,
      label: "Multiplication",
      summary: "See multiplication as rotation plus scale instead of a symbol-only rule.",
      focus: "rotate + scale",
      content: <ComplexMultiplicationVisualizer />,
    },
    {
      id: "euler-2d" as const,
      label: "Euler 2D",
      summary: "Watch circular motion unfold into sine and cosine components.",
      focus: "e^(i theta)",
      content: <EulerFormula2D />,
    },
    {
      id: "euler-3d" as const,
      label: "Euler 3D",
      summary: "Use the existing spatial view to connect phase, rotation, and waves.",
      focus: "phase space",
      content: <EulerFormula3D />,
    },
    {
      id: "identity" as const,
      label: "Identity",
      summary: "Animate the path to Euler's identity and the special role of pi.",
      focus: "e^(i pi) + 1 = 0",
      content: <EulerIdentityAnimation />,
    },
    {
      id: "applications" as const,
      label: "Applications",
      summary: "Connect complex numbers to signals, circuits, waves, graphics, and quantum ideas.",
      focus: "real use",
      content: <ComplexApplications />,
    },
  ], []);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    const onPopState = () => setActiveTab(readComplexTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectTab = (tabId: ComplexTabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    if (tabId === "plane") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tabId);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <StudioPageShell
      className="complex-studio"
      title="Complex Numbers Studio"
      subtitle={topic.description}
      breadcrumbs={["Home", "Math Topics", "Complex Numbers"]}
      difficulty={topic.difficulty}
      estimatedMinutes={topic.estimatedMinutes}
      progress={progress}
      status={[
        { id: "visuals", label: "Visual labs", value: 5, tone: "cyan" },
        { id: "applications", label: "Applications", value: complexApplications.length, tone: "violet" },
      ]}
    >
      <div className="complex-workspace" onPointerDown={() => markTopicInteracted(topic.id)}>
        <section className="complex-main-panel" aria-label="Complex numbers workspace">
          <div className="complex-tabs" role="tablist" aria-label="Complex numbers studio sections">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === currentTab.id} className={tab.id === currentTab.id ? "active" : ""} onClick={() => selectTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="complex-context-strip">
            <div>
              <span>Current focus</span>
              <strong>{currentTab.focus}</strong>
            </div>
            <p>{currentTab.summary}</p>
          </div>
          <div className="complex-tab-content thin-scrollbar">{currentTab.content}</div>
        </section>
        <aside className="complex-inspector thin-scrollbar" aria-label="Complex numbers inspector">
          <div className="complex-guide-card">
            <span>Studio guide</span>
            <h2>{currentTab.label}</h2>
            <p>{currentTab.summary}</p>
            <div className="complex-guide-meter"><i style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} /></div>
          </div>
          <SectionCard title="Introduction" description="Complex numbers turn the plane into an arithmetic system. Addition moves points; multiplication rotates and scales; Euler's formula reveals why waves and rotations share the same mathematics." compact />
          <FormulaBlock title="Euler Formula" formula={"e^{i\\theta}=\\cos\\theta+i\\sin\\theta"} />
          <FormulaBlock title="Formula Summary" formula={"z=a+bi,\\quad |z|=\\sqrt{a^2+b^2},\\quad e^{i\\pi}+1=0"} />
          <PhaseTwoDomainPanel domain="complex-numbers" />
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </StudioPageShell>
  );
}

function ComplexApplications() {
  return (
    <SectionCard title="Applications" compact>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {complexApplications.map((item) => (
          <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
        ))}
      </div>
    </SectionCard>
  );
}

function readComplexTabFromUrl(): ComplexTabId {
  if (typeof window === "undefined") return "plane";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "multiply" || tab === "euler-2d" || tab === "euler-3d" || tab === "identity" || tab === "applications") return tab;
  return "plane";
}

function normalizeProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  const percent = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percent)));
}
