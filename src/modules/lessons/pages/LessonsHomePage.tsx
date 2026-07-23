import { ArrowRight, BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { lessonCatalog, lessonCategories } from "../catalog/lessonCatalog";

export default function LessonsHomePage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return lessonCatalog.filter((lesson) => `${lesson.title} ${lesson.topic} ${lesson.category} ${lesson.outcome} ${lesson.feature}`.toLowerCase().includes(normalized)).slice(0, 24);
  }, [query]);

  return (
    <div className="space-y-4" data-testid="lessons-home">
      <header className="rounded-3xl bg-[linear-gradient(135deg,#0f172a,#164e63)] p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Lessons · All 4 phases</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Interactive lessons</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">One concept, one focused live activity across arithmetic, algebra, geometry, calculus, data, advanced, 3D, discrete, and applied mathematics.</p></div><span className="rounded-2xl bg-white/10 px-4 py-3 text-center"><strong className="block text-2xl">674</strong><span className="text-xs font-bold text-cyan-200">Interactive pages</span></span></div>
        <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 text-slate-900 shadow"><Search className="h-5 w-5 text-cyan-600" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons, topics, outcomes…" /></label>
      </header>
      {query.trim() ? <section><h2 className="mb-2 text-sm font-black">{results.length} matches</h2><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{results.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}{results.length === 0 ? <p className="rounded-2xl bg-white p-4 text-sm font-bold dark:bg-slate-950">No lesson matches that search.</p> : null}</div></section> : <section className="grid gap-3 md:grid-cols-2">{lessonCategories.map((category) => <Link key={category.slug} to={`/lessons/${category.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70"><div className="flex items-start justify-between gap-3"><BookOpen className="h-6 w-6 text-cyan-500" /><span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{category.count}</span></div><h2 className="mt-4 text-xl font-black">{category.title}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{category.topics.map((topic) => topic.title).join(" · ")}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-700 dark:text-cyan-300">Open lessons <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</section>}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: (typeof lessonCatalog)[number] }) {
  return <Link to={lesson.route} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70"><p className="text-[10px] font-black uppercase text-cyan-600">#{lesson.id} · {lesson.topic}</p><h3 className="mt-1 font-black">{lesson.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.purpose}</p></Link>;
}
