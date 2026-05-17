import { MathToolCard } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { mathLabTools } from "../data/mathLabTools";

export default function MathLab() {
  return (
    <div className="space-y-6">
      <TopicHeader
        title="Math Lab"
        subtitle="Graph, solve, visualize, calculate, and explore mathematics interactively."
        difficulty="Advanced Workspace"
        estimatedMinutes={60}
      />
      <SectionCard className="overflow-hidden">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-700 to-violet-700 p-6 text-white md:p-8">
          <p className="text-sm font-black uppercase text-cyan-100/80">GeoGebra-style visuals + WolframAlpha-style solving</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Math Lab</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-white/90 md:text-base">
            A central workspace for graphing, symbolic algebra, equation solving, calculus, statistics, probability, geometry, linear algebra, matrices, and 3D graphs.
          </p>
        </div>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mathLabTools.map((tool) => <MathToolCard key={tool.route} {...tool} />)}
      </div>
    </div>
  );
}
