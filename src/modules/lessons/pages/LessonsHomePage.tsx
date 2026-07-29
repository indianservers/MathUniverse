import { ArrowRight, BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { advancedConceptLessons, type AdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { lessonCatalog, lessonCategories } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";

type LessonSearchResult =
  | { kind: "interactive"; lesson: (typeof lessonCatalog)[number] }
  | { kind: "advanced"; lesson: AdvancedConceptLesson }
  | { kind: "school"; lesson: SchoolSyllabusLesson };

export default function LessonsHomePage() {
  const [query, setQuery] = useState("");
  const totalLessonCount = lessonCatalog.length + schoolLessonCatalog.length + advancedConceptLessons.length;
  const results = useMemo<LessonSearchResult[]>(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const interactiveMatches = lessonCatalog
      .filter((lesson) => `${lesson.title} ${lesson.topic} ${lesson.category} ${lesson.outcome} ${lesson.feature}`.toLowerCase().includes(normalized))
      .map((lesson) => ({ kind: "interactive" as const, lesson }));

    const schoolMatches = schoolLessonCatalog
      .filter((lesson) =>
        [
          lesson.title,
          lesson.metadata.academicLevel,
          lesson.metadata.conceptFamily,
          lesson.metadata.lessonType,
          lesson.content.summary,
          lesson.metadata.searchKeywords.join(" "),
          lesson.metadata.learningObjectives.join(" "),
          lesson.boardPathways.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .map((lesson) => ({ kind: "school" as const, lesson }));

    const advancedMatches = advancedConceptLessons
      .filter((lesson) =>
        [
          lesson.title,
          lesson.summary,
          lesson.strand,
          lesson.searchKeywords.join(" "),
          lesson.objectives.join(" "),
          lesson.learn.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .map((lesson) => ({ kind: "advanced" as const, lesson }));

    return [...interactiveMatches, ...advancedMatches, ...schoolMatches].slice(0, 36);
  }, [query]);

  return (
    <div className="space-y-4" data-testid="lessons-home">
      <header className="rounded-3xl bg-[linear-gradient(135deg,#0f172a,#164e63)] p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Lessons - All 4 phases</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Interactive lessons</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              One concept, one focused live activity across arithmetic, algebra, geometry, calculus, data, advanced, 3D, discrete, and applied mathematics.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <span className="rounded-2xl bg-white/10 px-4 py-3">
              <strong className="block text-2xl">{totalLessonCount}</strong>
              <span className="text-xs font-bold text-cyan-200">Total lessons</span>
            </span>
            <span className="rounded-2xl bg-white/10 px-4 py-3">
              <strong className="block text-2xl">{lessonCatalog.length}</strong>
              <span className="text-xs font-bold text-cyan-200">Interactive pages</span>
            </span>
            <Link to="/lessons/school" className="rounded-2xl bg-cyan-300 px-4 py-3 text-slate-950 transition hover:bg-cyan-200">
              <strong className="block text-2xl">{schoolLessonCatalog.length}</strong>
              <span className="text-xs font-black">School gaps</span>
            </Link>
          </div>
        </div>
        <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 text-slate-900 shadow">
          <Search className="h-5 w-5 text-cyan-600" />
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons, topics, outcomes..." />
        </label>
      </header>
      {query.trim() ? (
        <section>
          <h2 className="mb-2 text-sm font-black">{results.length} matches</h2>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) =>
              result.kind === "interactive" ? (
                <LessonCard key={`interactive-${result.lesson.id}`} lesson={result.lesson} />
              ) : result.kind === "advanced" ? (
                <AdvancedLessonSearchCard key={`advanced-${result.lesson.id}`} lesson={result.lesson} />
              ) : (
                <SchoolLessonSearchCard key={`school-${result.lesson.id}`} lesson={result.lesson} />
              ),
            )}
            {results.length === 0 ? <p className="rounded-2xl bg-white p-4 text-sm font-bold dark:bg-slate-950">No lesson matches that search.</p> : null}
          </div>
        </section>
      ) : (
        <section className="grid gap-3 md:grid-cols-2">
          <Link to="/lessons/advanced-concepts" className="group rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 dark:border-violet-300/20 dark:bg-violet-300/10">
            <div className="flex items-start justify-between gap-3">
              <BookOpen className="h-6 w-6 text-violet-600" />
              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-violet-700 dark:bg-white/10 dark:text-violet-100">{advancedConceptLessons.length}</span>
            </div>
            <h2 className="mt-4 text-xl font-black">Advanced Concept Lessons</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Theory-backed lessons for continued fractions, famous problems, inference, differential equations, and special functions.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-violet-700 dark:text-violet-300">
              Open advanced pack <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
          <Link to="/lessons/school" className="group rounded-2xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <div className="flex items-start justify-between gap-3">
              <BookOpen className="h-6 w-6 text-cyan-600" />
              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-cyan-700 dark:bg-white/10 dark:text-cyan-100">{schoolLessonCatalog.length}</span>
            </div>
            <h2 className="mt-4 text-xl font-black">School Syllabus Remediation</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Class 6-12 gap lessons for NCERT, CBSE, AP, TN, Cambridge, IB, and Common Core.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-700 dark:text-cyan-300">
              Open school pathways <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
          {lessonCategories.map((category) => (
            <Link key={category.slug} to={`/lessons/${category.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-start justify-between gap-3">
                <BookOpen className="h-6 w-6 text-cyan-500" />
                <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{category.count}</span>
              </div>
              <h2 className="mt-4 text-xl font-black">{category.title}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{category.topics.map((topic) => topic.title).join(" - ")}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-700 dark:text-cyan-300">
                Open lessons <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: (typeof lessonCatalog)[number] }) {
  return (
    <Link to={lesson.route} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70">
      <p className="text-[10px] font-black uppercase text-cyan-600">#{lesson.id} - {lesson.topic}</p>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.purpose}</p>
    </Link>
  );
}

function AdvancedLessonSearchCard({ lesson }: { lesson: AdvancedConceptLesson }) {
  return (
    <Link to={lesson.route} className="rounded-2xl border border-violet-200 bg-violet-50 p-4 transition hover:border-violet-400 dark:border-violet-300/20 dark:bg-violet-300/10">
      <p className="text-[10px] font-black uppercase text-violet-700 dark:text-violet-200">Advanced - {lesson.strand}</p>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{lesson.summary}</p>
      <p className="mt-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{lesson.searchKeywords.slice(0, 4).join(" - ")}</p>
    </Link>
  );
}

function SchoolLessonSearchCard({ lesson }: { lesson: SchoolSyllabusLesson }) {
  return (
    <Link to={lesson.route} className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 transition hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-cyan-300/10">
      <p className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-200">
        {lesson.metadata.academicLevel.replace("_", " ")} - {lesson.metadata.conceptFamily}
      </p>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{lesson.content.summary}</p>
      <p className="mt-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{lesson.boardPathways.slice(0, 4).join(" - ")}</p>
    </Link>
  );
}
