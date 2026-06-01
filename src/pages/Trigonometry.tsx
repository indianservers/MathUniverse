import FormulaBlock from "../components/ui/FormulaBlock";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { trigonometryConcepts } from "../data/trigonometryConcepts";
import { useProgress } from "../hooks/useProgress";

export default function Trigonometry() {
  const topic = topics.find((item) => item.id === "trigonometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-5" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <ContinueCard routePrefix="/trigonometry" />
      <div className="flex flex-wrap gap-3">
        <Link to="/calculator" className="action-secondary">Open Scientific Calculator</Link>
        <Link to="/trigonometry/unit-circle" className="action-primary">Start Unit Circle</Link>
      </div>
      <SectionCard title="Trigonometry Concept Pages" description={`${trigonometryConcepts.length} focused subpages. Each page keeps one concept, one formula, and one visual lab so the topic does not become one huge scrolling page.`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {trigonometryConcepts.map((concept) => (
            <Link key={concept.id} to={`/trigonometry/${concept.id}`} className="group rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{concept.category}</p>
                  <h2 className="mt-2 text-lg font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-300">{concept.title}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">Lab</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{concept.summary}</p>
              <p className="mt-3 rounded-xl bg-slate-100 p-2 font-mono text-xs text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">{concept.formula}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
      <FormulaBlock title="Formula Summary" formula={"\\sin^2\\theta+\\cos^2\\theta=1,\\quad y=A\\sin(fx+\\phi)"} />
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
