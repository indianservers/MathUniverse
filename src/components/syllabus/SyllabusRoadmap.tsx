import { Link } from "react-router-dom";
import { syllabusLevels } from "../../data/syllabus";

export default function SyllabusRoadmap({ activeLevel, onLevelChange }: { activeLevel: string; onLevelChange: (level: string) => void }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="text-xl font-bold">Learning Roadmap</h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link to="/syllabus" aria-current={activeLevel === "All" ? "page" : undefined} onClick={() => onLevelChange("All")} className={`rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${activeLevel === "All" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"}`}>
          All
        </Link>
        {syllabusLevels.map((level) => (
          <div key={level.id} className="flex items-center gap-2">
            <span className="text-slate-400">-&gt;</span>
            <Link to={level.route} aria-current={activeLevel === level.id ? "page" : undefined} onClick={() => onLevelChange(level.id)} className={`rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${activeLevel === level.id ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"}`}>
              {level.title.replace(" Mathematics", "")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
