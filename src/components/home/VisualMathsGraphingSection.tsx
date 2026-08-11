import { ArrowRight, ChartSpline, Cuboid, Orbit, Ruler, Shapes, Sigma, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export type VisualMathsGraphingModule = {
  title: string;
  description: string;
  route: string;
  action: "Open" | "Explore";
  icon: LucideIcon;
  accent: string;
};

export const visualMathsGraphingModules: VisualMathsGraphingModule[] = [
  { title: "2D Explorer", description: "Construct points, lines, vectors, angles, and geometric relationships.", route: "/workspace/geometry", action: "Explore", icon: Ruler, accent: "border-t-cyan-500 text-cyan-600 dark:text-cyan-300" },
  { title: "3D Explorer", description: "Inspect vectors, planes, solids, and spatial objects from every angle.", route: "/workspace/3d", action: "Explore", icon: Cuboid, accent: "border-t-emerald-500 text-emerald-600 dark:text-emerald-300" },
  { title: "Shapes Explorer", description: "Measure and transform 2D shapes and 3D solids with live formulas.", route: "/shapes", action: "Explore", icon: Shapes, accent: "border-t-amber-500 text-amber-600 dark:text-amber-300" },
  { title: "2D Graphs", description: "Plot equations, points, circles, derivatives, integrals, and intersections.", route: "/math-lab/graphing-calculator", action: "Open", icon: ChartSpline, accent: "border-t-rose-500 text-rose-600 dark:text-rose-300" },
  { title: "3D Graphs", description: "Explore multivariable surfaces, slices, parametric curves, and solids.", route: "/math-lab/3d-graphing", action: "Open", icon: Orbit, accent: "border-t-sky-500 text-sky-600 dark:text-sky-300" },
  { title: "CAS - Computer Algebra System", description: "Simplify, solve, differentiate, integrate, and inspect symbolic results.", route: "/workspace/data/cas", action: "Open", icon: Sigma, accent: "border-t-violet-500 text-violet-600 dark:text-violet-300" },
];

export default function VisualMathsGraphingSection() {
  return (
    <section aria-labelledby="visual-maths-graphing-title" className="py-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">Explore and model</p>
          <h2 id="visual-maths-graphing-title" className="mt-1 text-xl font-black text-slate-950 dark:text-white">Visual Maths &amp; Graphing</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">6 offline workspaces</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visualMathsGraphingModules.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title} className={`flex min-h-[174px] flex-col rounded-lg border border-slate-200 border-t-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/55 ${module.accent}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
              <h3 className="mt-3 text-base font-black text-slate-950 dark:text-white">{module.title}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{module.description}</p>
              <Link to={module.route} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-black text-slate-900 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:text-white dark:hover:text-cyan-200" aria-label={`${module.action} ${module.title}`}>
                {module.action}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
