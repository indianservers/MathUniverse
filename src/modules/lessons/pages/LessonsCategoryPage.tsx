import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { lessonCategories, lessonsForCategory } from "../catalog/lessonCatalog";

export default function LessonsCategoryPage() {
  const { categorySlug } = useParams();
  const category = lessonCategories.find((candidate) => candidate.slug === categorySlug);
  const lessons = lessonsForCategory(categorySlug);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => lessons.filter((lesson) => `${lesson.title} ${lesson.topic}`.toLowerCase().includes(query.toLowerCase())), [lessons, query]);
  if (!category) return <LessonNotFound />;
  const topics = Array.from(new Set(filtered.map((lesson) => lesson.topic)));
  const phases = Array.from(new Set(lessons.map((lesson) => lesson.phase))).join("–");
  return <div className="space-y-4" data-testid="lessons-category"><header className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/70"><p className="text-xs font-black uppercase text-cyan-600">Phase {phases} · {category.count} lessons</p><h1 className="mt-1 text-3xl font-black">{category.title}</h1><label className="mt-4 flex min-h-11 max-w-xl items-center gap-2 rounded-xl bg-slate-100 px-3 dark:bg-white/10"><Search className="h-4 w-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Filter this category…" /></label></header>{topics.map((topic) => <section key={topic}><h2 className="mb-2 text-lg font-black">{topic}</h2><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{filtered.filter((lesson) => lesson.topic === topic).map((lesson) => <Link key={lesson.id} to={lesson.route} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black uppercase text-cyan-600">Lesson {lesson.id}</span><ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" /></div><h3 className="mt-1 font-black">{lesson.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.purpose}</p></Link>)}</div></section>)}</div>;
}

function LessonNotFound() {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-2xl font-black">Lesson category not found</h1><p className="mt-2 text-sm">This category is not part of the current lesson catalog.</p><Link className="action-secondary mt-4" to="/lessons">Open lessons</Link></div>;
}
