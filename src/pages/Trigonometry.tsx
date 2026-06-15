import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { trigonometryConcepts } from "../data/trigonometryConcepts";
import { useProgress } from "../hooks/useProgress";
import TrigIdentityVisualizations from "../visualizations/trigonometry/TrigIdentityVisualizations";
import TrigonometryMathLab from "../visualizations/trigonometry/TrigonometryMathLab";

export default function Trigonometry() {
  const topic = topics.find((item) => item.id === "trigonometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const syllabusGroups = [
    { label: "JEE", categories: ["Identities", "Equations", "Triangle Solving", "Calculus"] },
    { label: "Degree", categories: ["Advanced", "Degree", "Wave Parameters"] },
    { label: "PG", categories: ["PG", "Applications"] },
  ];
  const formulaGroups = Array.from(new Set(trigonometryConcepts.map((concept) => concept.category))).map((category) => ({
    category,
    concepts: trigonometryConcepts.filter((concept) => concept.category === category),
  }));
  return (
    <div className="desktop-page-shell" onPointerDown={() => markTopicInteracted(topic.id)}>
      <div className="desktop-page-header">
        <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      </div>
      <div className="desktop-tab-surface grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-0 min-w-0 overflow-hidden">
          <TopicTabs tabs={[
            { id: "lab", label: "Lab", content: <TrigonometryMathLab compact /> },
            { id: "visualizations", label: "Visualizations", content: <TrigIdentityVisualizations /> },
            { id: "concepts", label: "Concepts", content: <ConceptPages concepts={trigonometryConcepts} /> },
            { id: "formulas", label: "Formulas", content: <FormulaGroups groups={formulaGroups} /> },
            { id: "syllabus", label: "Syllabus", content: <SyllabusCoverage groups={syllabusGroups} /> },
          ]} />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
          <ContinueCard routePrefix="/trigonometry" />
          <Link to="/trigonometry/unit-circle" className="action-primary w-full">Start Unit Circle</Link>
          <Link to="/calculator" className="action-secondary w-full">Open Scientific Calculator</Link>
          <FormulaBlock title="Formula Summary" formula={"\\sin^2\\theta+\\cos^2\\theta=1,\\quad y=A\\sin(fx+\\phi)"} />
          <TopicProgressActions topicId={topic.id} />
        </aside>
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
                  <p className="mt-1 whitespace-normal break-words font-mono text-[11px] leading-4 text-slate-600 dark:text-slate-300">{concept.formula}</p>
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
      <p className="mt-2 whitespace-normal break-words rounded-lg bg-slate-100 p-1.5 font-mono text-[11px] leading-4 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">{concept.formula}</p>
    </Link>
  );
}
