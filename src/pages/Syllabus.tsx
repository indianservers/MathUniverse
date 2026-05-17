import { ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { advancedLabCategories, advancedSyllabusLabs } from "../data/advancedSyllabusLabs";
import { allSyllabusTopics, syllabusLevels } from "../data/syllabus";

export default function Syllabus() {
  const { levelId } = useParams();
  const selectedLevel = syllabusLevels.find((level) => level.id === levelId);
  const topics = selectedLevel ? selectedLevel.topics : allSyllabusTopics;

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Syllabus Universe"
        subtitle="Browse grade-wise topics and advanced concept labs. Each interactive lab opens on its own dedicated page with formulas, sliders, guided tasks, and related concepts."
        difficulty={selectedLevel ? selectedLevel.title : "All levels"}
        estimatedMinutes={20}
      />

      <SectionCard title="Grade and Board Topics" description="NCERT and school syllabus topics are grouped by class, with direct links to available interactive pages.">
        <Link to="/math-lab" className="mb-5 block rounded-2xl border border-violet-200 bg-violet-50 p-4 transition hover:-translate-y-0.5 hover:border-violet-400 dark:border-violet-400/20 dark:bg-violet-400/10">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Advanced Interactive Math Tools</p>
          <h2 className="mt-2 text-xl font-black">Math Lab</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">GeoGebra-style visual tools and WolframAlpha-style solving workspace.</p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Graphing Calculator, Equation Solver, CAS Solver, Geometry Lab, Calculus Visualizer, Statistics Lab, Probability Simulator, Linear Algebra Lab, 3D Graphing, and Smart Math Query.</p>
        </Link>
        <Link to="/matrices" className="mb-5 block rounded-2xl border border-cyan-200 bg-cyan-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">New Matrix Section</p>
          <h2 className="mt-2 text-xl font-black">Matrices and Linear Algebra</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">Matrix Basics, Addition, Subtraction, Scalar Multiplication, Multiplication, Transpose, Determinant, Inverse, Rank, Row Operations, Linear Equations, Eigenvalues and Eigenvectors, and 2D Transformations.</p>
        </Link>
        <div className="mb-5 flex flex-wrap gap-2">
          <Link to="/syllabus" className="action-secondary">All</Link>
          {syllabusLevels.map((level) => <Link key={level.id} to={`/syllabus/${level.id}`} className="action-secondary">{level.title.replace(" Mathematics", "")}</Link>)}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} to={topic.linkedVisualization.route} className="rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" target={topic.linkedVisualization.isExternal ? "_blank" : undefined} rel={topic.linkedVisualization.isExternal ? "noreferrer" : undefined}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{topic.classLevel} / {topic.unit}</p>
                {topic.linkedVisualization.isExternal && <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />}
              </div>
              <h2 className="mt-2 text-lg font-bold">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.recommendedVisualization}</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Advanced Interactive Syllabus Labs" description="Each category is subcategorized so students can jump directly into a focused visualizer instead of one oversized page.">
        <div className="space-y-5">
          {advancedLabCategories.map((category) => {
            const labs = advancedSyllabusLabs.filter((lab) => lab.category === category);
            const subcategories = Array.from(new Set(labs.map((lab) => lab.subcategory)));
            return (
              <div key={category} className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <h2 className="text-xl font-bold">{category}</h2>
                <div className="mt-4 space-y-4">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory}>
                      <p className="text-sm font-bold uppercase text-violet-600 dark:text-violet-300">{subcategory}</p>
                      <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {labs.filter((lab) => lab.subcategory === subcategory).map((lab) => (
                          <Link key={lab.id} to={`/syllabus-lab/${lab.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950">
                            <h3 className="font-bold">{lab.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lab.summary}</p>
                            <p className="mt-3 font-mono text-xs text-slate-500 dark:text-slate-400">{lab.formula}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
