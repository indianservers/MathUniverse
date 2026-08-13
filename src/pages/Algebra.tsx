import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import SectionCard from "../components/ui/SectionCard";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
import ContinueCard from "../components/ui/ContinueCard";
import ConceptAccuracyPanel from "../components/ui/ConceptAccuracyPanel";
import StudioPageShell from "../components/ui/StudioPageShell";
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

type AlgebraTabId = "linear" | "quadratic" | "systems" | "formulas" | "accuracy" | "applications";

export default function Algebra() {
  const topic = topics.find((item) => item.id === "algebra")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [activeTab, setActiveTab] = useState<AlgebraTabId>(() => readAlgebraTabFromUrl());
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const progress = normalizeProgress(getTopicProgress(topic.id));
  const tabs = useMemo(() => [
    {
      id: "linear" as const,
      label: "Linear",
      summary: "Tune slope and intercept to see how a relationship moves across the coordinate plane.",
      focus: "y = mx + c",
      content: <LinearEquationVisualizer />,
    },
    {
      id: "quadratic" as const,
      label: "Quadratic",
      summary: "Shape parabolas with coefficient changes, roots, vertex, and discriminant cues.",
      focus: "ax^2 + bx + c",
      content: <QuadraticEquationVisualizer />,
    },
    {
      id: "systems" as const,
      label: "Systems",
      summary: "Compare two equations and read intersection behavior visually.",
      focus: "solve both lines",
      content: <SimultaneousEquationsVisualizer />,
    },
    {
      id: "formulas" as const,
      label: "Formula Atlas",
      summary: "Review algebra formulas as visual cards without leaving the studio.",
      focus: "formula map",
      content: <FormulaVisualizationAtlas topic="algebra" />,
    },
    {
      id: "accuracy" as const,
      label: "Accuracy",
      summary: "Check common algebra mistakes and practice with guided validation.",
      focus: "practice check",
      content: <ConceptAccuracyPanel domain="algebra" />,
    },
    {
      id: "applications" as const,
      label: "Applications",
      summary: "Connect algebraic models to pricing, break-even, motion, and regression contexts.",
      focus: "real use",
      content: <AlgebraApplications />,
    },
  ], []);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    const onPopState = () => setActiveTab(readAlgebraTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectTab = (tabId: AlgebraTabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    if (tabId === "linear") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tabId);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <StudioPageShell
      className="algebra-studio"
      title="Algebra Studio"
      subtitle={topic.description}
      breadcrumbs={["Home", "Math Topics", "Algebra"]}
      difficulty={topic.difficulty}
      estimatedMinutes={topic.estimatedMinutes}
      progress={progress}
      status={[
        { id: "models", label: "Models", value: 3, tone: "cyan" },
        { id: "applications", label: "Applications", value: algebraApplications.length, tone: "violet" },
      ]}
    >
      <div className="algebra-workspace" onPointerDown={() => markTopicInteracted(topic.id)}>
        <section className="algebra-main-panel" aria-label="Algebra workspace">
          <div className="algebra-tabs" role="tablist" aria-label="Algebra studio sections">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === currentTab.id} className={tab.id === currentTab.id ? "active" : ""} onClick={() => selectTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="algebra-context-strip">
            <div>
              <span>Current model</span>
              <strong>{currentTab.focus}</strong>
            </div>
            <p>{currentTab.summary}</p>
          </div>
          <div className="algebra-tab-content thin-scrollbar">{currentTab.content}</div>
        </section>
        <aside className="algebra-inspector thin-scrollbar" aria-label="Algebra inspector">
          <div className="algebra-guide-card">
            <span>Studio guide</span>
            <h2>{currentTab.label}</h2>
            <p>{currentTab.summary}</p>
            <div className="algebra-guide-meter"><i style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} /></div>
          </div>
          <ContinueCard routePrefix="/algebra" />
          <Link to="/calculator" className="algebra-action">Scientific Calculator</Link>
          <FormulaBlock title="Line" formula="y=mx+c" />
          <FormulaBlock title="Quadratic" formula="y=ax^2+bx+c" />
          <SectionCard title="Concept Intro" description="Algebra turns relationships into symbols. The visual layer shows how coefficients reshape lines, parabolas, and systems." compact />
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </StudioPageShell>
  );
}

function AlgebraApplications() {
  return (
    <SectionCard title="Real-World Applications" compact>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {algebraApplications.map((item) => (
          <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
        ))}
      </div>
    </SectionCard>
  );
}

function readAlgebraTabFromUrl(): AlgebraTabId {
  if (typeof window === "undefined") return "linear";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "quadratic" || tab === "systems" || tab === "formulas" || tab === "accuracy" || tab === "applications") return tab;
  return "linear";
}

function normalizeProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  const percent = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percent)));
}
