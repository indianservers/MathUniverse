import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { VisualProofCategory } from "../data/proofTypes";
import { getVisualProofIcon } from "./visualProofIcons";

type CategoryCardProps = {
  category: VisualProofCategory;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = getVisualProofIcon(category.iconName);
  const available = category.status === "available";

  return (
    <Link
      to={`/visual-proofs/${category.slug}`}
      className="group flex min-h-[210px] flex-col justify-between rounded-xl border border-slate-200 bg-white/88 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-cyan-300/40"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-cyan-200 dark:bg-cyan-300 dark:text-slate-950">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black text-slate-950 dark:text-white">{category.title}</h3>
          <span className={available ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-300/20 dark:text-cyan-100" : "mini-chip"}>
            {available ? "Available" : "Planned"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-950/70">
            <span className="block text-[10px] uppercase text-slate-400">Difficulty</span>
            {category.difficultyRange}
          </div>
          <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-950/70">
            <span className="block text-[10px] uppercase text-slate-400">Proofs</span>
            {category.proofCount || "Planned"}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-black text-cyan-700 transition group-hover:gap-3 dark:text-cyan-200">
          Open category <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
