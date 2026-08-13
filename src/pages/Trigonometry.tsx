import FormulaBlock from "../components/ui/FormulaBlock";
import MathExpression from "../components/ui/MathExpression";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import ContinueCard from "../components/ui/ContinueCard";
import ConceptAccuracyPanel from "../components/ui/ConceptAccuracyPanel";
import StudioPageShell from "../components/ui/StudioPageShell";
import { topics } from "../data/topics";
import { trigonometryConcepts } from "../data/trigonometryConcepts";
import { useProgress } from "../hooks/useProgress";
import TrigonometryMathLab from "../visualizations/trigonometry/TrigonometryMathLab";

type TrigonometryTabId = "lab" | "concepts" | "formulas" | "syllabus" | "accuracy";

export default function Trigonometry() {
  const topic = topics.find((item) => item.id === "trigonometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [activeTab, setActiveTab] = useState<TrigonometryTabId>(() => readTabFromUrl());
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  const syllabusGroups = [
    { label: "JEE", categories: ["Identities", "Equations", "Triangle Solving", "Calculus"] },
    { label: "Degree", categories: ["Advanced", "Degree", "Wave Parameters"] },
    { label: "PG", categories: ["PG", "Applications"] },
  ];
  const formulaGroups = useMemo(() => Array.from(new Set(trigonometryConcepts.map((concept) => concept.category))).map((category) => ({
    category,
    concepts: trigonometryConcepts.filter((concept) => concept.category === category),
  })), []);
  const progress = normalizeProgress(getTopicProgress(topic.id));
  const tabs = useMemo(() => [
    {
      id: "lab" as const,
      label: "Lab",
      summary: "Unit circle, waves, ratios, and live angle controls in one focused workspace.",
      tools: ["Drag angle", "Grid", "Fit view", "Fullscreen"],
      outputs: ["sin", "cos", "tan", "quadrant"],
      content: <TrigonometryMathLab compact />,
    },
    {
      id: "concepts" as const,
      label: "Concepts",
      summary: "Jump into focused visual concept pages without leaving the trigonometry track.",
      tools: ["2D views", "3D views", "Practice"],
      outputs: [`${trigonometryConcepts.length} lessons`, "visual notes"],
      content: <ConceptPages concepts={trigonometryConcepts} />,
    },
    {
      id: "formulas" as const,
      label: "Formulas",
      summary: "Grouped identity sheet for quick revision and formula recall.",
      tools: ["Grouped cards", "Concept links"],
      outputs: [`${formulaGroups.length} groups`, "identity library"],
      content: <FormulaGroups groups={formulaGroups} />,
    },
    {
      id: "syllabus" as const,
      label: "Syllabus",
      summary: "JEE, degree, and PG coverage arranged as compact learning lanes.",
      tools: ["Exam lanes", "Quick links"],
      outputs: ["JEE", "Degree", "PG"],
      content: <SyllabusCoverage groups={syllabusGroups} />,
    },
    {
      id: "accuracy" as const,
      label: "Accuracy & Examples",
      summary: "Practice checks, examples, and validation prompts for the current domain.",
      tools: ["Validate", "Examples", "Mistake review"],
      outputs: ["accuracy score", "practice state"],
      content: <ConceptAccuracyPanel domain="trigonometry" />,
    },
  ], [formulaGroups]);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    const onPopState = () => setActiveTab(readTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectTab = (tabId: TrigonometryTabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    if (tabId === "lab") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tabId);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <StudioPageShell
      className="trig-studio"
      title="Trigonometry Studio"
      subtitle={topic.description}
      breadcrumbs={["Home", "Math Topics", "Trigonometry"]}
      difficulty={topic.difficulty}
      estimatedMinutes={topic.estimatedMinutes}
      progress={progress}
      status={[
        { id: "concepts", label: "Concepts", value: trigonometryConcepts.length, tone: "cyan" },
        { id: "formula-groups", label: "Formula groups", value: formulaGroups.length, tone: "violet" },
      ]}
    >
      <div className="trig-workspace" onPointerDown={() => markTopicInteracted(topic.id)}>
        <section className="trig-main-panel" aria-label="Trigonometry workspace">
          <div className="trig-tabs" role="tablist" aria-label="Trigonometry studio sections">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === currentTab.id} className={tab.id === currentTab.id ? "active" : ""} onClick={() => selectTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="trig-context-strip">
            <div>
              <span>Active workspace</span>
              <strong>{currentTab.label}</strong>
            </div>
            <p>{currentTab.summary}</p>
          </div>
          <div className="trig-tab-content thin-scrollbar">{currentTab.content}</div>
        </section>
        <aside className="trig-inspector thin-scrollbar" aria-label="Trigonometry inspector">
          <StudioGuidePanel tab={currentTab} progress={progress} />
          <ContinueCard routePrefix="/trigonometry" />
          <div className="trig-action-grid">
            <Link to="/trigonometry/formula-visualizer">Formula Visualizer</Link>
            <Link to="/trigonometry/unit-circle">Unit Circle</Link>
            <Link to="/calculator">Scientific Calculator</Link>
          </div>
          <FormulaBlock title="Core Identity" formula={"\\sin^2\\theta+\\cos^2\\theta=1,\\quad y=A\\sin(fx+\\phi)"} />
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </StudioPageShell>
  );
}

function StudioGuidePanel({ progress, tab }: { progress: number; tab: { label: string; summary: string; tools: string[]; outputs: string[] } }) {
  return (
    <div className="trig-guide-card">
      <div className="trig-guide-head">
        <span>Phase 1 workspace</span>
        <strong>{tab.label}</strong>
      </div>
      <p>{tab.summary}</p>
      <div className="trig-guide-meter" aria-label={`Progress ${progress}%`}>
        <span style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} />
      </div>
      <div className="trig-guide-columns">
        <div>
          <span>Tools</span>
          {tab.tools.map((tool) => <b key={tool}>{tool}</b>)}
        </div>
        <div>
          <span>Live outputs</span>
          {tab.outputs.map((output) => <b key={output}>{output}</b>)}
        </div>
      </div>
    </div>
  );
}

function ConceptPages({ concepts }: { concepts: typeof trigonometryConcepts }) {
  return (
    <SectionCard title="Trigonometry Concept Pages" description={`${concepts.length} focused subpages. Standard concepts include 2D and 3D visual tabs.`} compact>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {concepts.map((concept) => (
          <ConceptLink key={concept.id} concept={concept} />
        ))}
      </div>
    </SectionCard>
  );
}

function FormulaGroups({ groups }: { groups: Array<{ category: string; concepts: typeof trigonometryConcepts }> }) {
  return (
    <SectionCard title="All Concept Formulas" description="Every trigonometry concept with its respective formula, grouped for quick revision." compact>
      <div className="grid gap-3 lg:grid-cols-2">
        {groups.map((group) => (
          <div key={group.category} className="min-w-0 rounded-lg border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-black text-slate-950 dark:text-white">{group.category}</h2>
            <div className="mt-2 space-y-2">
              {group.concepts.map((concept) => (
                <Link key={concept.id} to={`/trigonometry/${concept.id}`} className="block rounded-lg bg-slate-100 p-2 transition hover:bg-cyan-50 hover:text-cyan-800 dark:bg-slate-950/60 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100">
                  <p className="text-xs font-bold">{concept.title}</p>
                  <p className="mt-1 whitespace-normal break-words text-[11px] font-semibold leading-4 text-slate-600 dark:text-slate-300"><MathExpression value={concept.formula} /></p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SyllabusCoverage({ groups }: { groups: Array<{ label: string; categories: string[] }> }) {
  return (
    <SectionCard title="Syllabus Coverage" description="Extra concepts are grouped so JEE, degree, and PG topics stay findable without clutter." compact>
      <div className="grid gap-3 md:grid-cols-3">
        {groups.map((group) => {
          const concepts = trigonometryConcepts.filter((concept) => group.categories.includes(concept.category)).slice(0, 8);
          return (
            <div key={group.label} className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-black">{group.label}</h2>
              <div className="mt-2 grid gap-1.5">
                {concepts.map((concept) => (
                  <Link key={concept.id} to={`/trigonometry/${concept.id}`} className="rounded-md px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100">
                    {concept.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function ConceptLink({ concept }: { concept: (typeof trigonometryConcepts)[number] }) {
  const has3d = !["eclipse", "wave-applications", "experiment-catalog"].includes(concept.visual);
  return (
    <Link key={concept.id} to={`/trigonometry/${concept.id}`} className="group rounded-lg border border-slate-200 bg-white/75 p-2.5 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase text-cyan-600 dark:text-cyan-300">{concept.category}</p>
        {has3d && <span className="mini-chip text-[10px]">2D+3D</span>}
      </div>
      <h2 className="mt-1 line-clamp-1 text-sm font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-300">{concept.title}</h2>
      <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-600 dark:text-slate-300">{concept.summary}</p>
      <p className="mt-2 whitespace-normal break-words rounded-lg bg-slate-100 p-1.5 text-[11px] font-semibold leading-4 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300"><MathExpression value={concept.formula} /></p>
    </Link>
  );
}

function readTabFromUrl(): TrigonometryTabId {
  if (typeof window === "undefined") return "lab";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "concepts" || tab === "formulas" || tab === "syllabus" || tab === "accuracy") return tab;
  return "lab";
}

function normalizeProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  const percent = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percent)));
}
