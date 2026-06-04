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
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)_240px]">
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <Link to="/shapes" className="action-secondary w-full">
            <Cuboid className="h-4 w-4" />
            2D/3D Shapes
          </Link>
          <SectionCard title="Concept Pages" description={`${geometryConcepts.length} focused pages.`} compact>
            <div className="grid gap-2">
              {geometryConcepts.map((concept) => (
                <Link key={concept.id} to={`/geometry/${concept.id}`} className="group rounded-lg border border-slate-200 bg-white/75 p-2.5 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-bold uppercase text-cyan-600 dark:text-cyan-300">{concept.category}</p>
                  <h2 className="mt-1 line-clamp-1 text-sm font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-300">{concept.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-600 dark:text-slate-300">{concept.summary}</p>
                </Link>
              ))}
            </div>
          </SectionCard>
        </aside>
        <div className="min-w-0">
          <TopicTabs tabs={[
            { id: "triangle", label: "Triangles", content: <TriangleExplorer /> },
            { id: "pythagoras", label: "Pythagoras", content: <PythagorasVisualizer /> },
            { id: "theorems", label: "Theorems", content: <GeometryTheoremVisualizers /> },
            { id: "circles", label: "Circles", content: <CircleExplorer /> },
            { id: "solids", label: "3D Solids", content: <Shape3DExplorer /> },
          ]} />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <SectionCard title="Applications" compact>
            <div className="flex flex-wrap gap-2">{["Architecture", "Engineering", "Game design", "Robotics", "AR/VR"].map((item) => <span key={item} className="mini-chip">{item}</span>)}</div>
          </SectionCard>
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </div>
  );
}
