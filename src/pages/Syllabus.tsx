import { CheckSquare, ExternalLink, MonitorPlay, Route, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { advancedLabCategories, advancedSyllabusLabs } from "../data/advancedSyllabusLabs";
import { boardSyllabusTopics, syllabusBoards } from "../data/boardSyllabus";
import { coreMathLanes, interactiveMathTools } from "../data/mathCoverageBlueprint";
import { allSyllabusTopics, syllabusLevels } from "../data/syllabus";
import { showUndoToast } from "../components/layout/GlobalUx";

const COMPLETE_KEY = "math-universe-syllabus-complete";

function readComplete(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(COMPLETE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}

function writeComplete(ids: string[]) {
  localStorage.setItem(COMPLETE_KEY, JSON.stringify(ids));
}

export default function Syllabus() {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const [selectedBoard, setSelectedBoard] = useState<string>("All");
  const selectedLevel = syllabusLevels.find((level) => level.id === levelId);
  const topics = selectedLevel ? selectedLevel.topics : allSyllabusTopics;
  const boardTopics = selectedBoard === "All" ? boardSyllabusTopics : boardSyllabusTopics.filter((topic) => topic.board === selectedBoard);

  function markAllComplete(ids: string[]) {
    const prev = readComplete();
    const next = Array.from(new Set([...prev, ...ids]));
    writeComplete(next);
    showUndoToast(`Marked ${ids.length} topics complete`, () => {
      const restored = prev;
      writeComplete(restored);
    });
  }

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Syllabus Universe"
        subtitle="Browse AP State, CBSE, Cambridge/IGCSE, and IB mathematics coverage from Grade 6 to 12."
        difficulty={selectedLevel ? selectedLevel.title : "All levels"}
        estimatedMinutes={20}
      />

      <SectionCard id="board-coverage" title="Boards Covered From 6th to 12th" description="Each board-grade pack opens a reusable interactive lab with both 2D and 3D visualizations.">
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", ...syllabusBoards].map((board) => (
            <button
              key={board}
              type="button"
              onClick={() => setSelectedBoard(board)}
              className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${selectedBoard === board ? "border-cyan-400 bg-cyan-500 text-white" : "border-slate-200 bg-white/80 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
            >
              {board}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {boardTopics.map((topic) => (
            <Link key={topic.id} to={topic.route} className="rounded-xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{topic.board} / {topic.grade}</p>
                  <h2 className="mt-1.5 text-base font-bold">{topic.strand}</h2>
                </div>
                <MonitorPlay className="h-5 w-5 shrink-0 text-cyan-500" />
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{topic.title}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="mini-chip">2D</span>
                <span className="mini-chip">3D</span>
                <span className="mini-chip">{topic.phase}</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="core-math-lanes" title="Core Maths Lanes" description="The Class 6-12 path is grouped into four continuous lanes so students can move from foundations to board-level calculus and vectors.">
        <div className="grid gap-3 lg:grid-cols-2">
          {coreMathLanes.map((lane) => (
            <div key={lane.id} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-300">{lane.gradeBand}</p>
                  <h2 className="mt-1.5 text-lg font-black">{lane.title}</h2>
                </div>
                <span className="mini-chip">{lane.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {lane.topics.map((item) => <span key={item} className="mini-chip">{item}</span>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={lane.primaryRoute} className="action-primary"><Route className="h-4 w-4" />Open lane</Link>
                {lane.labRoutes.slice(0, 3).map((route) => <Link key={route} to={route} className="action-secondary">Lab</Link>)}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="interactive-tools" title="Interactive Maths Tools" description="More than notes and calculators: these are the hands-on visual labs mapped to the missing-tool checklist.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {interactiveMathTools.map((tool) => (
            <Link key={tool.id} to={tool.route} className="rounded-xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <Wrench className="h-5 w-5 shrink-0 text-cyan-500" />
                <span className="mini-chip">{tool.dimensions}</span>
              </div>
              <h2 className="mt-3 text-base font-black">{tool.title}</h2>
              <p className="mt-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{tool.gradeBand} / {tool.status}</p>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{tool.purpose}</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="grade-topics" title="Grade and Board Topics" description="NCERT and school syllabus topics grouped by class, with links to interactive pages.">
        <Link to="/math-lab" className="mb-4 block rounded-2xl border border-violet-200 bg-violet-50 p-4 transition hover:-translate-y-0.5 hover:border-violet-400 dark:border-violet-400/20 dark:bg-violet-400/10">
          <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-200">Advanced Interactive Math Tools</p>
          <h2 className="mt-1.5 text-lg font-black">Math Lab</h2>
          <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">GeoGebra-style visual tools and WolframAlpha-style solving workspace.</p>
        </Link>
        <Link to="/matrices" className="mb-4 block rounded-2xl border border-cyan-200 bg-cyan-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <p className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">New Matrix Section</p>
          <h2 className="mt-1.5 text-lg font-black">Matrices and Linear Algebra</h2>
          <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">Matrix Basics, Addition, Multiplication, Determinant, Inverse, Eigenvalues, and 2D Transformations.</p>
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => navigate("/syllabus")}
              className={`px-4 py-2 text-sm font-bold transition ${!levelId ? "bg-cyan-500 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
            >
              All
            </button>
            {syllabusLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => navigate(`/syllabus/${level.id}`)}
                className={`px-4 py-2 text-sm font-bold transition ${levelId === level.id ? "bg-cyan-500 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
              >
                {level.title.replace(" Mathematics", "")}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => markAllComplete(topics.map((t) => t.id))}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
          >
            <CheckSquare className="h-4 w-4" />
            Mark All Complete
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} to={topic.linkedVisualization.route} className="rounded-2xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" target={topic.linkedVisualization.isExternal ? "_blank" : undefined} rel={topic.linkedVisualization.isExternal ? "noreferrer" : undefined}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{topic.classLevel} / {topic.unit}</p>
                {topic.linkedVisualization.isExternal && <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />}
              </div>
              <h2 className="mt-1.5 text-base font-bold">{topic.title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{topic.recommendedVisualization}</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="advanced-labs" title="Advanced Interactive Syllabus Labs" description="Each category is subcategorized for focused visualizers.">
        <div className="space-y-4">
          {advancedLabCategories.map((category) => {
            const labs = advancedSyllabusLabs.filter((lab) => lab.category === category);
            const subcategories = Array.from(new Set(labs.map((lab) => lab.subcategory)));
            return (
              <div key={category} className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold">{category}</h2>
                  <button
                    type="button"
                    onClick={() => markAllComplete(labs.map((l) => l.id))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    Mark All
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory}>
                      <p className="text-xs font-bold uppercase text-violet-600 dark:text-violet-300">{subcategory}</p>
                      <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {labs.filter((lab) => lab.subcategory === subcategory).map((lab) => (
                          <Link key={lab.id} to={`/syllabus-lab/${lab.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950">
                            <h3 className="font-bold">{lab.title}</h3>
                            <p className="mt-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">{lab.summary}</p>
                            <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">{lab.formula}</p>
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
