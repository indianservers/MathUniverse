import SectionCard from "../components/ui/SectionCard";
import { useEffect } from "react";
import { Cuboid } from "lucide-react";
import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import { topics } from "../data/topics";
import { geometryConcepts } from "../data/geometryConcepts";
import { useProgress } from "../hooks/useProgress";
import CircleExplorer from "../visualizations/geometry/CircleExplorer";
import GeometryTheoremVisualizers from "../visualizations/geometry/GeometryTheoremVisualizers";
import PythagorasVisualizer from "../visualizations/geometry/PythagorasVisualizer";
import Shape3DExplorer from "../visualizations/geometry/Shape3DExplorer";
import TriangleExplorer from "../visualizations/geometry/TriangleExplorer";

export default function Geometry() {
  const topic = topics.find((item) => item.id === "geometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <Link to="/shapes" className="action-secondary w-fit">
        <Cuboid className="h-4 w-4" />
        Open 2D/3D Shapes Explorer
      </Link>
      <SectionCard title="Geometry Concept Pages" description={`${geometryConcepts.length} dedicated subpages with focused visualizations, formulas, measurements, and guided tasks.`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {geometryConcepts.map((concept) => (
            <Link key={concept.id} to={`/geometry/${concept.id}`} className="group rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
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
      <TopicTabs tabs={[
        { id: "triangle", label: "Triangles", content: <TriangleExplorer /> },
        { id: "pythagoras", label: "Pythagoras", content: <PythagorasVisualizer /> },
        { id: "theorems", label: "Theorems", content: <GeometryTheoremVisualizers /> },
        { id: "circles", label: "Circles", content: <CircleExplorer /> },
        { id: "solids", label: "3D Solids", content: <Shape3DExplorer /> },
      ]} />
      <SectionCard title="Applications">
        <div className="grid gap-3 md:grid-cols-5">{["Architecture", "Engineering", "Game design", "Robotics", "AR/VR"].map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
