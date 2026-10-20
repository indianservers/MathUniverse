import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import registry from "../catalog/upcoming/apCurriculumRegistry.generated.json";
import mockupManifest from '../upcoming-ui/mockupManifest.json';
const mockups:Record<string,{title:string;image:string}>=mockupManifest;

export default function UpcomingLessonsPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [chapter, setChapter] = useState("All");
  const [limit,setLimit]=useState(40);
  const levels = [...new Set(registry.upcomingLessons.map((lesson) => lesson.level))];
  const chapters = [...new Set(registry.upcomingLessons.filter((lesson) => level === "All" || lesson.level === level).map((lesson) => lesson.chapterName))];
  const lessons = useMemo(() => registry.upcomingLessons.filter((lesson) => {
    const text = `${lesson.lessonId} ${lesson.level} ${lesson.chapterName} ${lesson.topicName} ${lesson.pageName}`.toLowerCase();
    return (level === "All" || lesson.level === level) && (chapter === "All" || lesson.chapterName === chapter) && text.includes(query.trim().toLowerCase());
  }), [query, level, chapter]);

  return <main className="mx-auto max-w-7xl space-y-6 p-4 text-slate-900 dark:text-slate-100 md:p-8">
    <header className="space-y-3">
      <Link to="/lessons" className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Back to lessons</Link>
      <h1 className="text-3xl font-black">Upcoming AP and JNTUK lessons</h1>
      <Link to="/lessons/upgrades" className="inline-block rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white">Review interactive upgrade ideas</Link>
      <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Reserved lesson IDs and page names with interactive content drafts. Search by ID, topic or chapter when preparing a mockup.</p>
      <p className="text-sm font-bold">{registry.upcomingLessons.filter(lesson=>lesson.contentStatus==='Drafted').length} of {registry.upcomingLessons.length} lessons have content drafts.</p>
      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Upcoming lessons are planned and are not included in completed lesson counts. Source and teaching reviews are tracked separately.</p>
    </header>
    <div className="flex flex-wrap gap-3">
      <label className="flex flex-1 flex-col gap-1 text-sm font-bold">Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lesson ID, topic or page name" className="min-w-60 rounded-xl border border-slate-300 bg-white p-3 dark:border-white/20 dark:bg-slate-950" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">Level
        <select value={level} onChange={(event) => { setLevel(event.target.value); setChapter("All"); }} className="rounded-xl border border-slate-300 bg-white p-3 dark:border-white/20 dark:bg-slate-950"><option>All</option>{levels.map((value) => <option key={value}>{value}</option>)}</select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">Chapter
        <select value={chapter} onChange={(event) => setChapter(event.target.value)} className="max-w-80 rounded-xl border border-slate-300 bg-white p-3 dark:border-white/20 dark:bg-slate-950"><option>All</option>{chapters.map((value) => <option key={value}>{value}</option>)}</select>
      </label>
    </div>
    <p className="text-sm font-bold">{lessons.length} matching upcoming lessons</p>
    {lessons.length === 0 ? <p className="rounded-xl bg-slate-100 p-6 dark:bg-white/5">No upcoming lessons match these filters.</p> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{lessons.slice(0,limit).map((lesson) => <article key={lesson.lessonId} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
      {mockups[lesson.lessonId]&&<Link to={`/lessons/planned/${lesson.lessonId}`} aria-label={`Open ${lesson.topicName}`}><img src={mockups[lesson.lessonId].image} alt={`Design reference for ${lesson.topicName}`} loading="lazy" width={768} height={512} className="mb-3 aspect-[3/2] w-full rounded-xl border border-slate-200 object-cover"/></Link>}
      <div className="flex justify-between gap-2 text-xs font-black"><span>Lesson {lesson.lessonId}</span><span className="rounded-full bg-amber-100 px-2 py-1 text-amber-900">Upcoming</span></div>
      <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">{lesson.level} · {lesson.chapterName}</p>
      <h2 className="font-black">{lesson.topicName}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Page: {lesson.pageName}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{lesson.reason}</p>
      <p className="text-xs font-semibold">Mockup: {mockups[lesson.lessonId]?'Matched by ID and topic':lesson.lessonId>=30001&&lesson.lessonId<=30040?'UI adapted from chapter designs':lesson.mockupStatus}</p>
      <p className="text-xs font-semibold">Content: {lesson.contentStatus}</p>
      {lesson.contentStatus === "Drafted" && <Link to={`/lessons/planned/${lesson.lessonId}`} className="inline-block rounded-lg bg-cyan-700 px-3 py-2 text-sm font-bold text-white">{lesson.lessonId>=30001&&lesson.lessonId<=30040?'Open interactive lesson':'Open lesson draft'}</Link>}
    </article>)}</div>}
    {lessons.length>limit&&<button className="rounded-xl bg-cyan-700 px-4 py-3 font-bold text-white" onClick={()=>setLimit(value=>value+40)}>Show more lessons ({Math.min(limit,lessons.length)} of {lessons.length})</button>}
  </main>;
}
