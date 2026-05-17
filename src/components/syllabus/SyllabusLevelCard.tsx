import { Link } from "react-router-dom";
import type { SyllabusLevel } from "../../data/syllabus";

export default function SyllabusLevelCard({ level, active = false }: { level: SyllabusLevel; active?: boolean }) {
  return (
    <Link to={level.route} className={`glass-card block rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-200 dark:hover:border-cyan-400/25 ${active ? "ring-2 ring-cyan-300 dark:ring-cyan-400/50" : ""}`}>
      <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{level.difficulty}</p>
      <h3 className="mt-2 text-lg font-bold">{level.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{level.subtitle}</p>
      <p className="mt-4 text-sm font-semibold">{level.totalTopics} topics</p>
    </Link>
  );
}
