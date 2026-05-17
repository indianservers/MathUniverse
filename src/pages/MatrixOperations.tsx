import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import SectionCard from "../components/ui/SectionCard";
import { matrixOperations } from "../data/matrixOperations";

export default function MatrixOperations() {
  return (
    <div className="space-y-6">
      <TopicHeader
        title="Matrix Operations Visualizer"
        subtitle="Learn matrix addition, subtraction, multiplication, transpose, determinant, inverse, rank and more through interactive visual steps."
        difficulty="Matrices and Linear Algebra"
        estimatedMinutes={75}
      />
      <SectionCard className="overflow-hidden">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 p-6 text-white md:p-8">
          <p className="text-sm font-black uppercase text-white/75">Interactive Matrix Universe</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Matrix Operations Visualizer</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-white/90 md:text-base">
            Explore matrix structure, arithmetic, row operations, determinants, inverses, rank, systems, eigenvectors, and 2D transformations with animated cells and worked explanations.
          </p>
        </div>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matrixOperations.map((operation) => {
          const Icon = operation.icon;
          return (
            <Link key={operation.id} to={operation.route} className="group rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 transition group-hover:scale-105 dark:bg-cyan-400/15 dark:text-cyan-200">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{operation.difficulty}</span>
              </div>
              <h2 className="mt-4 text-xl font-black">{operation.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{operation.explanation}</p>
              <p className="mt-3 text-xs font-bold uppercase text-violet-600 dark:text-violet-300">{operation.classRelevance}</p>
              {operation.topics && <p className="mt-3 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{operation.topics.join(" / ")}</p>}
              <span className="mt-5 inline-flex rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950">Open Visualizer</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
