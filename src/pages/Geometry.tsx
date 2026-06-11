import SectionCard from "../components/ui/SectionCard";
import { CSSProperties, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { Cuboid, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
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

const geometryApplications = [
  { title: "Architecture", visual: "architecture", description: "Angles, triangles, and solids guide stable spans and roof forms." },
  { title: "Engineering", visual: "engineering", description: "Geometric constraints shape joints, tolerances, frames, and load paths." },
  { title: "Game design", visual: "game-design", description: "Collision, paths, cameras, and level spaces depend on geometric models." },
  { title: "Robotics", visual: "robotics", description: "Pose, reach, and path planning combine coordinate geometry with constraints." },
  { title: "AR/VR", visual: "ar-vr", description: "Projection and tracking place virtual objects into real spatial scenes." },
] as const;

export default function Geometry() {
  const topic = topics.find((item) => item.id === "geometry")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(240);
  const dragRef = useRef<{ side: "left" | "right"; startX: number; startWidth: number } | null>(null);

  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;
      const delta = event.clientX - drag.startX;
      if (drag.side === "left") setLeftWidth(Math.min(430, Math.max(220, drag.startWidth + delta)));
      else setRightWidth(Math.min(380, Math.max(180, drag.startWidth - delta)));
    }
    function onPointerUp() {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const startResize = (side: "left" | "right", startWidth: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragRef.current = { side, startX: event.clientX, startWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div className="desktop-page-shell" onPointerDown={() => markTopicInteracted(topic.id)}>
      <div className="desktop-page-header">
        <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      </div>
      <div className="desktop-tab-surface grid gap-3 xl:grid-cols-[var(--geometry-left)_8px_minmax(0,1fr)_8px_var(--geometry-right)]" style={{ "--geometry-left": leftOpen ? `${leftWidth}px` : "52px", "--geometry-right": rightOpen ? `${rightWidth}px` : "52px" } as CSSProperties}>
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
          <button type="button" className="tool-button w-full justify-between" onClick={() => setLeftOpen((value) => !value)} aria-label={leftOpen ? "Collapse left panel" : "Expand left panel"}>
            {leftOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            {leftOpen && <span>Left panel</span>}
          </button>
          {leftOpen ? (
            <>
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
            </>
          ) : (
            <Link to="/shapes" className="tool-button aspect-square w-full p-0" aria-label="Open 2D/3D Shapes"><Cuboid className="h-4 w-4" /></Link>
          )}
        </aside>
        <button type="button" className={`-mx-2 hidden rounded-full border border-transparent xl:block ${leftOpen ? "cursor-col-resize hover:border-cyan-300 hover:bg-cyan-400/15" : "pointer-events-none opacity-0"}`} onPointerDown={startResize("left", leftWidth)} aria-label="Resize left panel" />
        <div className="min-h-0 min-w-0 overflow-hidden">
          <TopicTabs tabs={[
            { id: "triangle", label: "Triangles", content: <TriangleExplorer /> },
            { id: "pythagoras", label: "Pythagoras", content: <PythagorasVisualizer /> },
            { id: "theorems", label: "Theorems", content: <GeometryTheoremVisualizers /> },
            { id: "circles", label: "Circles", content: <CircleExplorer /> },
            { id: "solids", label: "3D Solids", content: <Shape3DExplorer /> },
          ]} />
        </div>
        <button type="button" className={`-mx-2 hidden rounded-full border border-transparent xl:block ${rightOpen ? "cursor-col-resize hover:border-cyan-300 hover:bg-cyan-400/15" : "pointer-events-none opacity-0"}`} onPointerDown={startResize("right", rightWidth)} aria-label="Resize right panel" />
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
          <button type="button" className="tool-button w-full justify-between" onClick={() => setRightOpen((value) => !value)} aria-label={rightOpen ? "Collapse right panel" : "Expand right panel"}>
            {rightOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            {rightOpen && <span>Right panel</span>}
          </button>
          {rightOpen && (
            <>
              <SectionCard title="Applications" compact>
                <div className="grid gap-2">
                  {geometryApplications.map((item) => (
                    <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
                  ))}
                </div>
              </SectionCard>
              <TopicProgressActions topicId={topic.id} />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
