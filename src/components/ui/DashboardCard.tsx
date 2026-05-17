import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBadge from "./ProgressBadge";

type DashboardCardProps = {
  title: string;
  description: string;
  concepts: string[];
  icon: LucideIcon;
  route: string;
  progress: number;
  colorGradient: string;
};

export default function DashboardCard({ title, description, concepts, icon: Icon, route, progress, colorGradient }: DashboardCardProps) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="glass-card group rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${colorGradient} p-3 text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <ProgressBadge progress={progress} />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <span key={concept} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {concept}
          </span>
        ))}
      </div>
      <Link
        to={route}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-cyan-200"
      >
        Launch
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}
