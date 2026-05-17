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
  isExternal?: boolean;
  progress: number;
  colorGradient: string;
};

export default function DashboardCard({ title, description, concepts, icon: Icon, route, isExternal, progress, colorGradient }: DashboardCardProps) {
  const actionLabel = isExternal ? "Open Anveshak" : "Launch";

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="glass-card group flex min-h-[360px] flex-col rounded-2xl p-5 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${colorGradient} p-3 text-white shadow-lg transition group-hover:scale-105`}>
          <Icon className="h-6 w-6" />
        </div>
        <ProgressBadge progress={progress} />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <span key={concept} className="mini-chip">
            {concept}
          </span>
        ))}
      </div>
      {isExternal ? (
        <a href={route} aria-label={`Open ${title}`} className="action-primary mt-auto w-full">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      ) : (
        <Link
          to={route}
          aria-label={`Launch ${title}`}
          className="action-primary mt-auto w-full"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </motion.article>
  );
}
