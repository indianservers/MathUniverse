import { ArrowLeft, Construction, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { allNavigatorCards, priorityVisualizations } from "../data/syllabusNavigator";

export default function MathVisualizationPage() {
  const { visualizationId } = useParams();
  const route = `/math/${visualizationId}`;
  const card = allNavigatorCards.find((item) => item.route === route);

  if (!visualizationId || !card) return <Navigate to="/syllabus" replace />;

  const related = priorityVisualizations.filter((item) => item.route !== card.route).slice(0, 4);
  const Icon = card.icon;

  return (
    <div className="space-y-6">
      <Link to="/syllabus" className="action-secondary w-fit">
        <ArrowLeft className="h-4 w-4" />
        Syllabus Navigator
      </Link>

      <TopicHeader
        title={card.title}
        subtitle={card.description}
        difficulty={`${card.category} / ${card.status}`}
        estimatedMinutes={18}
      />

      <SectionCard title="Visualization Route" description="This route is wired into the app and ready for the interactive visualization component for this concept.">
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
              <Icon className="h-8 w-8" />
            </div>
            <div className="mt-4 flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
              <Construction className="h-3.5 w-3.5" />
              {card.status}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Route: <span className="font-mono font-bold">{card.route}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
            <h2 className="text-xl font-black">Core Topics</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {card.topics.map((topic) => (
                <div key={topic} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-100">
                  {topic}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Students should be able to adjust parameters, inspect the graph or animation, compare numerical readouts, and connect the visual behavior back to the formula.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Related Priority Visualizations">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <Link key={item.route} to={item.route} className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <h3 className="font-black">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">
                Open <ExternalLink className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

