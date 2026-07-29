import { ArrowRight, Filter, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { advancedConceptLessons, advancedConceptStrands, advancedLessonsFor, type AdvancedConceptLesson, type AdvancedConceptStrand } from "../catalog/advanced/advancedConceptLessons";
import { advancedConceptPathways, lessonsForAdvancedPathway } from "../catalog/advanced/advancedConceptPathways";

const strands: Array<AdvancedConceptStrand | "ALL"> = ["ALL", ...advancedConceptStrands];

export default function AdvancedConceptLessonsPage() {
  const [strand, setStrand] = useState<AdvancedConceptStrand | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const lessons = useMemo(() => advancedLessonsFor(strand, query), [strand, query]);
  const visibleStrands = useMemo(() => Array.from(new Set(lessons.map((lesson) => lesson.strand))), [lessons]);

  return (
    <div className="space-y-4" data-testid="advanced-concept-lessons-page">
      <header className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Phase 1 advanced concepts</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Advanced concept lessons</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              A first additive pack for the Wolfram-style gaps: continued fractions, famous problems, statistical inference, differential equations, and special functions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <Stat label="Lessons" value={advancedConceptLessons.length.toString()} />
            <Stat label="Strands" value={advancedConceptStrands.length.toString()} />
          </div>
        </div>

        <div className="mt-5 grid gap-2 lg:grid-cols-[minmax(0,1fr)_260px]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-900 dark:bg-white/10 dark:text-white">
            <Search className="h-5 w-5 text-cyan-600" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search advanced topics, keywords, objectives..." />
          </label>
          <label className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-100 px-3 text-sm font-bold dark:bg-white/10">
            <span className="sr-only">Strand</span>
            <Sparkles className="h-4 w-4 text-cyan-600" />
            <select className="min-w-0 flex-1 bg-transparent outline-none" value={strand} onChange={(event) => setStrand(event.target.value as AdvancedConceptStrand | "ALL")}>
              {strands.map((item) => <option key={item} value={item}>{item === "ALL" ? "All strands" : item}</option>)}
            </select>
          </label>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {advancedConceptStrands.map((item) => {
          const count = advancedConceptLessons.filter((lesson) => lesson.strand === item).length;
          return (
            <button key={item} type="button" onClick={() => setStrand(item)} className={`rounded-2xl border p-4 text-left transition hover:border-cyan-400 ${strand === item ? "border-cyan-400 bg-cyan-50 dark:border-cyan-300 dark:bg-cyan-300/10" : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/70"}`}>
              <p className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-300">{count} lessons</p>
              <h2 className="mt-2 font-black">{item}</h2>
            </button>
          );
        })}
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Phase 3 pathways</p>
          <h2 className="mt-1 text-xl font-black">Recommended advanced routes</h2>
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          {advancedConceptPathways.map((pathway) => {
            const pathwayLessons = lessonsForAdvancedPathway(pathway);
            return (
              <article key={pathway.id} className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-300/20 dark:bg-violet-300/10">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{pathway.title}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-violet-700 dark:bg-white/10 dark:text-violet-100">{pathwayLessons.length} lessons</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{pathway.summary}</p>
                <p className="mt-3 text-xs font-bold leading-5 text-violet-800 dark:text-violet-100">{pathway.outcome}</p>
                {pathwayLessons[0] ? (
                  <Link className="mt-4 inline-flex items-center gap-2 text-sm font-black text-violet-700 dark:text-violet-300" to={pathwayLessons[0].route}>
                    Start pathway <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black">{lessons.length} matching advanced lessons</h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100"><Filter className="h-3.5 w-3.5" />{visibleStrands.length} strands</span>
        </div>
        {visibleStrands.map((item) => (
          <div key={item}>
            <h3 className="mb-2 text-lg font-black">{item}</h3>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {lessons.filter((lesson) => lesson.strand === item).map((lesson) => <AdvancedLessonCard key={lesson.id} lesson={lesson} />)}
            </div>
          </div>
        ))}
        {lessons.length === 0 ? <p className="rounded-2xl bg-white p-4 text-sm font-bold dark:bg-slate-950">No advanced lesson matches that search.</p> : null}
      </section>
    </div>
  );
}

function AdvancedLessonCard({ lesson }: { lesson: AdvancedConceptLesson }) {
  return (
    <Link to={lesson.route} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-black uppercase text-cyan-600">#{lesson.numericId} - {lesson.strand}</span>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
      </div>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {lesson.searchKeywords.slice(0, 3).map((keyword) => <span key={keyword} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{keyword}</span>)}
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <span className="rounded-2xl bg-cyan-50 px-4 py-3 dark:bg-cyan-400/10"><strong className="block text-2xl text-cyan-700 dark:text-cyan-100">{value}</strong><span className="text-xs font-bold text-cyan-700 dark:text-cyan-200">{label}</span></span>;
}
