import { ArrowRight, BookOpen, Filter, GraduationCap, Layers3, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { advancedConceptLessons, type AdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { lessonCatalog, lessonCategories } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { AcademicLevel, SchoolSyllabusLesson, SyllabusLessonType } from "../syllabus/lessonSyllabusTypes";

type LessonSearchResult =
  | { kind: "interactive"; lesson: (typeof lessonCatalog)[number] }
  | { kind: "advanced"; lesson: AdvancedConceptLesson }
  | { kind: "school"; lesson: SchoolSyllabusLesson };

type LessonSourceFilter = "ALL" | LessonSearchResult["kind"];
type LessonLevelFilter = "ALL" | "FOUNDATION" | "INTERMEDIATE" | "ADVANCED";
type LessonTypeFilter = "ALL" | SyllabusLessonType;

const classLevels: Array<AcademicLevel | "ALL"> = ["ALL", "CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];
const lessonSources: Array<{ value: LessonSourceFilter; label: string }> = [
  { value: "ALL", label: "All sources" },
  { value: "interactive", label: "Interactive" },
  { value: "school", label: "School" },
  { value: "advanced", label: "Advanced" },
];
const lessonTypes: LessonTypeFilter[] = ["ALL", "CONCEPT", "VISUAL_EXPLORATION", "PROOF", "PRACTICE", "APPLICATION", "ASSESSMENT", "PROJECT"];
const lessonLevels: LessonLevelFilter[] = ["ALL", "FOUNDATION", "INTERMEDIATE", "ADVANCED"];

export default function LessonsHomePage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<LessonSourceFilter>("ALL");
  const [classLevel, setClassLevel] = useState<AcademicLevel | "ALL">("ALL");
  const [concept, setConcept] = useState("ALL");
  const [lessonType, setLessonType] = useState<LessonTypeFilter>("ALL");
  const [lessonLevel, setLessonLevel] = useState<LessonLevelFilter>("ALL");
  const totalLessonCount = lessonCatalog.length + schoolLessonCatalog.length + advancedConceptLessons.length;
  const allResults = useMemo<LessonSearchResult[]>(() => [
    ...lessonCatalog.map((lesson) => ({ kind: "interactive" as const, lesson })),
    ...advancedConceptLessons.map((lesson) => ({ kind: "advanced" as const, lesson })),
    ...schoolLessonCatalog.map((lesson) => ({ kind: "school" as const, lesson })),
  ], []);
  const conceptOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const result of allResults) {
      const value = conceptForResult(result);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return Array.from(counts, ([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [allResults]);
  const topConcepts = conceptOptions.slice(0, 12);
  const sourceCounts = useMemo(() => ({
    interactive: lessonCatalog.length,
    school: schoolLessonCatalog.length,
    advanced: advancedConceptLessons.length,
  }), []);
  const classCounts = useMemo(() => classLevels
    .filter((level): level is AcademicLevel => level !== "ALL")
    .map((level) => ({
      level,
      count: schoolLessonCatalog.filter((lesson) => lesson.metadata.academicLevel === level).length,
    })), []);
  const results = useMemo<LessonSearchResult[]>(() => {
    const normalized = query.trim().toLowerCase();
    return allResults.filter((result) => {
      if (source !== "ALL" && result.kind !== source) return false;
      if (classLevel !== "ALL" && (result.kind !== "school" || result.lesson.metadata.academicLevel !== classLevel)) return false;
      if (concept !== "ALL" && conceptForResult(result) !== concept) return false;
      if (lessonType !== "ALL" && (result.kind !== "school" || result.lesson.metadata.lessonType !== lessonType)) return false;
      if (lessonLevel !== "ALL" && levelForResult(result) !== lessonLevel) return false;
      return !normalized || searchableTextForResult(result).includes(normalized);
    }).slice(0, 72);
  }, [allResults, classLevel, concept, lessonLevel, lessonType, query, source]);
  const hasActiveFilters = Boolean(query.trim()) || source !== "ALL" || classLevel !== "ALL" || concept !== "ALL" || lessonType !== "ALL" || lessonLevel !== "ALL";
  const groupedResults = useMemo(() => groupResults(results), [results]);

  function clearFilters() {
    setQuery("");
    setSource("ALL");
    setClassLevel("ALL");
    setConcept("ALL");
    setLessonType("ALL");
    setLessonLevel("ALL");
  }

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
          {query ? <button type="button" className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={() => setQuery("")} aria-label="Clear lesson search"><X className="h-4 w-4" /></button> : null}
        </label>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70" aria-labelledby="lesson-filter-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-cyan-700 dark:text-cyan-300"><Filter className="h-4 w-4" />Lesson filters</p>
            <h2 id="lesson-filter-title" className="mt-1 text-xl font-black">Find the right lesson path</h2>
          </div>
          <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-black transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:hover:border-cyan-300/40 dark:hover:text-cyan-200" onClick={clearFilters}>
            <X className="h-4 w-4" />Reset
          </button>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <SelectFilter label="Source" value={source} values={lessonSources.map((item) => item.value)} labelFor={(value) => lessonSources.find((item) => item.value === value)?.label ?? value} onChange={(value) => setSource(value as LessonSourceFilter)} />
          <SelectFilter label="Class" value={classLevel} values={classLevels} labelFor={formatFilterLabel} onChange={(value) => setClassLevel(value as AcademicLevel | "ALL")} />
          <SelectFilter label="Concept" value={concept} values={["ALL", ...conceptOptions.map((item) => item.label)]} labelFor={(value) => value === "ALL" ? "All concepts" : value} onChange={setConcept} />
          <SelectFilter label="Type" value={lessonType} values={lessonTypes} labelFor={formatFilterLabel} onChange={(value) => setLessonType(value as LessonTypeFilter)} />
          <SelectFilter label="Level" value={lessonLevel} values={lessonLevels} labelFor={formatFilterLabel} onChange={(value) => setLessonLevel(value as LessonLevelFilter)} />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Class wise</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={classLevel === "ALL"} onClick={() => setClassLevel("ALL")} label="All classes" count={schoolLessonCatalog.length} />
              {classCounts.map((item) => <Chip key={item.level} active={classLevel === item.level} onClick={() => setClassLevel(item.level)} label={formatFilterLabel(item.level)} count={item.count} />)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Sources</p>
            <div className="grid grid-cols-3 gap-2">
              <SourceButton active={source === "interactive"} label="Interactive" count={sourceCounts.interactive} onClick={() => setSource(source === "interactive" ? "ALL" : "interactive")} />
              <SourceButton active={source === "school"} label="School" count={sourceCounts.school} onClick={() => setSource(source === "school" ? "ALL" : "school")} />
              <SourceButton active={source === "advanced"} label="Advanced" count={sourceCounts.advanced} onClick={() => setSource(source === "advanced" ? "ALL" : "advanced")} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Concept wise</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={concept === "ALL"} onClick={() => setConcept("ALL")} label="All concepts" count={totalLessonCount} />
            {topConcepts.map((item) => <Chip key={item.label} active={concept === item.label} onClick={() => setConcept(item.label)} label={item.label} count={item.count} />)}
          </div>
        </div>
      </section>

      {hasActiveFilters ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-black">{results.length} matching lessons</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100"><Sparkles className="h-3.5 w-3.5" />Filtered explorer</span>
          </div>
          {groupedResults.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-sm font-black uppercase text-slate-500 dark:text-slate-400">{group.title}</h3>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((result) => <SearchResultCard key={`${result.kind}-${result.lesson.id}`} result={result} />)}
              </div>
            </div>
          ))}
          {results.length === 0 ? <p className="rounded-2xl bg-white p-4 text-sm font-bold dark:bg-slate-950">No lesson matches those filters.</p> : null}
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

function SearchResultCard({ result }: { result: LessonSearchResult }) {
  if (result.kind === "interactive") return <InteractiveLessonSearchCard lesson={result.lesson} />;
  if (result.kind === "advanced") return <AdvancedLessonSearchCard lesson={result.lesson} />;
  return <SchoolLessonSearchCard lesson={result.lesson} />;
}

function InteractiveLessonSearchCard({ lesson }: { lesson: (typeof lessonCatalog)[number] }) {
  return (
    <Link to={lesson.route} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70">
      <p className="text-[10px] font-black uppercase text-cyan-600">Interactive - {lesson.topic}</p>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.purpose}</p>
      <p className="mt-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{lesson.category} - {lesson.level}</p>
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

function SelectFilter({ label, value, values, labelFor, onChange }: {
  label: string;
  value: string;
  values: string[];
  labelFor: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <select className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold normal-case text-slate-900 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-white/10 dark:text-white" value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => <option key={item} value={item}>{labelFor(item)}</option>)}
      </select>
    </label>
  );
}

function Chip({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-black transition ${active ? "border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-300 dark:bg-cyan-300/15 dark:text-cyan-100" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:text-cyan-100"}`} onClick={onClick}>
      <span>{label}</span>
      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-300">{count}</span>
    </button>
  );
}

function SourceButton({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" className={`rounded-lg border p-3 text-left transition ${active ? "border-cyan-500 bg-cyan-50 dark:border-cyan-300 dark:bg-cyan-300/15" : "border-slate-200 bg-slate-50 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/40"}`} onClick={onClick}>
      <span className="flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400">{label === "School" ? <GraduationCap className="h-3.5 w-3.5" /> : label === "Advanced" ? <Layers3 className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}{label}</span>
      <strong className="mt-1 block text-lg text-slate-950 dark:text-white">{count}</strong>
    </button>
  );
}

function conceptForResult(result: LessonSearchResult) {
  if (result.kind === "school") return result.lesson.metadata.conceptFamily;
  if (result.kind === "advanced") return result.lesson.strand;
  return result.lesson.topic;
}

function levelForResult(result: LessonSearchResult): LessonLevelFilter {
  if (result.kind === "school") return result.lesson.metadata.difficulty === "RIGOROUS" ? "ADVANCED" : result.lesson.metadata.difficulty;
  if (result.kind === "advanced") return "ADVANCED";
  if (/advanced/i.test(result.lesson.level)) return "ADVANCED";
  if (/intermediate/i.test(result.lesson.level)) return "INTERMEDIATE";
  return "FOUNDATION";
}

function searchableTextForResult(result: LessonSearchResult) {
  if (result.kind === "interactive") {
    const lesson = result.lesson;
    return `${lesson.title} ${lesson.topic} ${lesson.category} ${lesson.outcome} ${lesson.feature} ${lesson.purpose} ${lesson.description} ${lesson.level}`.toLowerCase();
  }
  if (result.kind === "advanced") {
    const lesson = result.lesson;
    return [lesson.title, lesson.summary, lesson.strand, lesson.searchKeywords.join(" "), lesson.objectives.join(" "), lesson.learn.join(" ")].join(" ").toLowerCase();
  }
  const lesson = result.lesson;
  return [lesson.title, lesson.metadata.academicLevel, lesson.metadata.conceptFamily, lesson.metadata.lessonType, lesson.content.summary, lesson.metadata.searchKeywords.join(" "), lesson.metadata.learningObjectives.join(" "), lesson.boardPathways.join(" ")].join(" ").toLowerCase();
}

function groupResults(results: LessonSearchResult[]) {
  const groups = new Map<string, LessonSearchResult[]>();
  for (const result of results) {
    const title = result.kind === "school" ? formatFilterLabel(result.lesson.metadata.academicLevel) : result.kind === "advanced" ? "Advanced Concepts" : result.lesson.category;
    groups.set(title, [...(groups.get(title) ?? []), result]);
  }
  return Array.from(groups, ([title, items]) => ({ title, items }));
}

function formatFilterLabel(value: string) {
  if (value === "ALL") return "All";
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
