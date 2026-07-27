import { ArrowRight, Filter, GraduationCap, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonsFor, schoolPathways } from "../catalog/school/schoolSyllabusCatalog";
import type { AcademicLevel, SchoolSyllabusLesson, SyllabusBoard } from "../syllabus/lessonSyllabusTypes";

const levels: Array<AcademicLevel | "ALL"> = ["ALL", "CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"];
const boards: Array<SyllabusBoard | "ALL"> = ["ALL", "NCERT", "CBSE", "AP_SCERT", "TN_SCERT", "CAMBRIDGE_IGCSE", "IB_AA", "IB_AI", "COMMON_CORE"];

export default function SchoolLessonsPage() {
  const [level, setLevel] = useState<AcademicLevel | "ALL">("ALL");
  const [board, setBoard] = useState<SyllabusBoard | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const lessons = useMemo(() => schoolLessonsFor(level, board, query), [level, board, query]);
  const units = useMemo(() => Array.from(new Set(lessons.map((lesson) => lesson.metadata.conceptFamily))), [lessons]);

  return (
    <div className="space-y-4" data-testid="school-lessons-page">
      <header className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Phase 1 school syllabus</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">School syllabus remediation</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Generated Class 6-12 concept lessons for NCERT, CBSE, AP, TN, Cambridge, IB, and Common Core gaps. These are additive pathway lessons; the original 674 lesson routes remain unchanged.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <Stat label="Lessons" value="220" />
            <Stat label="Pathways" value={schoolPathways.length.toString()} />
          </div>
        </div>

        <div className="mt-5 grid gap-2 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-900 dark:bg-white/10 dark:text-white">
            <Search className="h-5 w-5 text-cyan-600" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search theorem, class, board, concept..." />
          </label>
          <Select label="Class" value={level} values={levels} onChange={(value) => setLevel(value as AcademicLevel | "ALL")} />
          <Select label="Board" value={board} values={boards} onChange={(value) => setBoard(value as SyllabusBoard | "ALL")} />
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {schoolPathways.slice(0, 8).map((pathway) => (
          <article key={pathway.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-2 text-xs font-black text-cyan-700 dark:text-cyan-300">
              <span>{pathway.board}</span>
              <span>{pathway.units.reduce((sum, unit) => sum + unit.lessonIds.length, 0)} lessons</span>
            </div>
            <h2 className="mt-2 font-black">{pathway.title}</h2>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{pathway.units.map((unit) => unit.unit).join(" · ")}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black">{lessons.length} matching school lessons</h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100"><Filter className="h-3.5 w-3.5" />{units.length} units</span>
        </div>
        {units.map((unit) => (
          <div key={unit}>
            <h3 className="mb-2 text-lg font-black">{unit}</h3>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {lessons.filter((lesson) => lesson.metadata.conceptFamily === unit).map((lesson) => <SchoolLessonCard key={lesson.id} lesson={lesson} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function SchoolLessonCard({ lesson }: { lesson: SchoolSyllabusLesson }) {
  return (
    <Link to={lesson.route} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-black uppercase text-cyan-600">{lesson.metadata.academicLevel} · {lesson.metadata.lessonType}</span>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
      </div>
      <h3 className="mt-1 font-black">{lesson.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{lesson.content.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {lesson.boardPathways.slice(0, 4).map((board) => <span key={board} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{board}</span>)}
      </div>
    </Link>
  );
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-100 px-3 text-sm font-bold dark:bg-white/10">
      <span className="sr-only">{label}</span>
      <GraduationCap className="h-4 w-4 text-cyan-600" />
      <select className="min-w-0 flex-1 bg-transparent outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => <option key={item} value={item}>{item === "ALL" ? `All ${label.toLowerCase()}s` : item}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <span className="rounded-2xl bg-cyan-50 px-4 py-3 dark:bg-cyan-400/10"><strong className="block text-2xl text-cyan-700 dark:text-cyan-100">{value}</strong><span className="text-xs font-bold text-cyan-700 dark:text-cyan-200">{label}</span></span>;
}
