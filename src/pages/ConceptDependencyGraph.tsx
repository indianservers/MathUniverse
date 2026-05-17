import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

const nodes = [
  { id: "Algebra", x: 8, y: 44, route: "/algebra" },
  { id: "Geometry", x: 24, y: 20, route: "/geometry" },
  { id: "Trigonometry", x: 43, y: 32, route: "/trigonometry" },
  { id: "Complex Numbers", x: 64, y: 20, route: "/complex-numbers" },
  { id: "Calculus", x: 63, y: 54, route: "/calculus" },
  { id: "Linear Algebra", x: 82, y: 42, route: "/linear-algebra" },
  { id: "AI Applications", x: 88, y: 72, route: "/ai-applications" },
  { id: "Statistics", x: 45, y: 76, route: "/probability-statistics" },
];

const edges = [
  ["Algebra", "Trigonometry"], ["Geometry", "Trigonometry"], ["Trigonometry", "Complex Numbers"], ["Algebra", "Calculus"], ["Trigonometry", "Calculus"], ["Algebra", "Linear Algebra"], ["Calculus", "AI Applications"], ["Linear Algebra", "AI Applications"], ["Statistics", "AI Applications"],
];

export default function ConceptDependencyGraph() {
  return (
    <div className="space-y-6">
      <TopicHeader title="Concept Dependency Graph" subtitle="A navigable map of which topics unlock later mathematical ideas." difficulty="Learning Map" estimatedMinutes={5} />
      <SectionCard title="Topic Unlock Map">
        <div className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/60">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {edges.map(([from, to]) => {
              const a = nodes.find((node) => node.id === from)!;
              const b = nodes.find((node) => node.id === to)!;
              return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(6,182,212,.55)" strokeWidth="0.7" markerEnd="url(#arrow)" />;
            })}
            <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(6,182,212,.7)" /></marker></defs>
          </svg>
          {nodes.map((node) => (
            <Link key={node.id} to={node.route} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-center text-sm font-black text-cyan-900 shadow-lg transition hover:-translate-y-[55%] hover:shadow-cyan-500/20 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
              {node.id}
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
