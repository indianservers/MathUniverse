import { Link, Navigate, useParams } from "react-router-dom";
import { ModuleShell, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import { mathLabTools } from "../data/mathLabTools";
import { routeQuery } from "../utils/mathEngine/queryRouter";

const implementedLinks: Record<string, Array<{ label: string; route: string; note: string }>> = {
  "graphing-calculator": [
    { label: "Open Math Workspace", route: "/workspace", note: "Existing command-style graphing and geometry workspace." },
    { label: "Open Function Graphs", route: "/math/functions-graphs", note: "Existing function transformations and graph visualizer." },
    { label: "Open Graph Comparison", route: "/graph-comparison", note: "Existing two-function comparison and error curve." },
  ],
  geometry: [
    { label: "Open Geometry Universe", route: "/geometry", note: "Existing triangle, circle, Pythagoras, and theorem visualizers." },
    { label: "Open 2D/3D Shapes", route: "/shapes", note: "Existing shape measurements, area, volume, and solids." },
  ],
  "cas-solver": [
    { label: "Open Scientific Calculator", route: "/calculator", note: "Existing Nerdamer-backed symbolic derivative and integral display." },
    { label: "Open Step Solver", route: "/problem-solver", note: "Existing Nerdamer equation solving steps." },
  ],
  "equation-solver": [
    { label: "Open Step Solver", route: "/problem-solver", note: "Existing equation solving workflow." },
    { label: "Open Algebra Visualizations", route: "/algebra", note: "Existing linear, quadratic, and simultaneous equation visualizers." },
    { label: "Open Matrix Linear Systems", route: "/matrices/linear-equations", note: "Existing augmented matrix solver with graph connection." },
  ],
  "function-explorer": [
    { label: "Open Function Explorer", route: "/math/functions-graphs", note: "Existing transformations and function graph controls." },
    { label: "Open Polar Visualizer", route: "/polar-visualizer", note: "Existing polar function tracing." },
    { label: "Open Parametric Curves", route: "/parametric-curves", note: "Existing x(t), y(t) explorer." },
  ],
  calculus: [
    { label: "Open Calculus Explorer", route: "/calculus", note: "Existing limits, derivatives, integration, and motion pages." },
    { label: "Open Derivatives", route: "/math/derivatives", note: "Existing tangent/secant visualizer." },
    { label: "Open Integration", route: "/math/integration", note: "Existing area and Riemann sum visualizer." },
  ],
  statistics: [
    { label: "Open Probability & Statistics", route: "/probability-statistics", note: "Existing normal curve, z-score, and histogram builder." },
  ],
  "linear-algebra": [
    { label: "Open Linear Algebra Lab", route: "/linear-algebra", note: "Existing vector, matrix transformation, and eigenvector labs." },
    { label: "Open Matrix Operations", route: "/matrices", note: "Existing complete matrix operations section." },
  ],
  "3d-graphing": [
    { label: "Open 3D Surface Plotter", route: "/surface-plotter", note: "Existing Three.js z=f(x,y) surface mesh." },
  ],
  "step-solver": [
    { label: "Open Step-by-Step Solver", route: "/problem-solver", note: "Existing equation solver with rendered steps." },
  ],
};

const shells: Record<string, { title: string; purpose: string; planned: string[] }> = {
  probability: {
    title: "Probability Simulator",
    purpose: "Simulate random experiments and compare empirical outcomes with theoretical probability.",
    planned: ["Coin toss simulation", "Dice distribution simulation", "Card drawing without replacement", "Binomial and normal distribution experiments", "Law of large numbers visual trace"],
  },
  query: {
    title: "Smart Math Query",
    purpose: "Type a natural math question and route it to the best graphing, solving, CAS, geometry, or statistics tool.",
    planned: ["Intent detection", "Expression extraction", "Recommended tool routing", "Saved query history", "Explain why a tool was chosen"],
  },
};

export default function MathLabToolPage() {
  const { toolId } = useParams();
  if (!toolId) return <Navigate to="/math-lab" replace />;
  const tool = mathLabTools.find((item) => item.route.endsWith(`/${toolId}`));
  if (!tool) return <Navigate to="/math-lab" replace />;

  if (shells[toolId]) return <ModuleShell {...shells[toolId]} />;

  if (toolId === "query") return <SmartQueryShell />;

  const links = implementedLinks[toolId] ?? [];
  if (!links.length) return <ModuleShell title={tool.title} purpose={tool.description} planned={tool.useCases} />;

  return (
    <MathLabLayout
      title={tool.title}
      subtitle={tool.description}
      notes={<SectionCard title="Use Cases"><div className="flex flex-wrap gap-2">{tool.useCases.map((item) => <span key={item} className="mini-chip">{item}</span>)}</div></SectionCard>}
    >
      <SectionCard title="Connected Existing Tools" description="This Math Lab route connects to mature tools already present in the app instead of duplicating them.">
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <Link key={link.route} to={link.route} className="rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <h2 className="font-black">{link.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{link.note}</p>
              <span className="mt-4 inline-flex rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950">Open</span>
            </Link>
          ))}
        </div>
      </SectionCard>
      <StepPanel steps={[
        { title: "Choose the matching tool", explanation: "Each card opens a focused existing visualizer or solver.", formula: "question \\rightarrow tool" },
        { title: "Work interactively", explanation: "Use sliders, graph controls, symbolic inputs, matrix cells, or data entry depending on the tool." },
        { title: "Return to Math Lab", explanation: "The Math Lab hub remains the central index for advanced tools.", result: "Connected workspace ready." },
      ]} />
      <ResultCard result={<p className="font-semibold">This route is active and connected to working app modules.</p>} />
    </MathLabLayout>
  );
}

function SmartQueryShell() {
  const sample = "solve x^2-5x+6=0";
  const routed = routeQuery(sample);
  return (
    <MathLabLayout title="Smart Math Query" subtitle="Type a math question and route it to the right Math Lab tool.">
      <SectionCard title="Routing Preview">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Example query: <span className="font-mono font-bold">{sample}</span></p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Suggested route: <Link className="font-bold text-cyan-700 dark:text-cyan-200" to={routed.route}>{routed.label}</Link></p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Reason: {routed.reason}</p>
      </SectionCard>
      <SectionCard title="Planned Feature List">
        <div className="grid gap-3 md:grid-cols-2">
          {shells.query.planned.map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">{item}</div>)}
        </div>
      </SectionCard>
    </MathLabLayout>
  );
}
