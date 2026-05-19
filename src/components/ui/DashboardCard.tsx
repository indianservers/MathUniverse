import { motion } from "framer-motion";
import { ArrowRight, Clock, LucideIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type DashboardCardProps = {
  title: string;
  description: string;
  concepts: string[];
  icon: LucideIcon;
  route: string;
  isExternal?: boolean;
  progress: number;
  colorGradient: string;
  difficulty?: string;
  estimatedMinutes?: number;
  isNew?: boolean;
};

const favoriteKey = "math-universe-favorite-cards";

export default function DashboardCard({ title, description, concepts, icon: Icon, route, isExternal, progress, colorGradient, difficulty = "Intermediate", estimatedMinutes = 15, isNew = false }: DashboardCardProps) {
  const actionLabel = isExternal ? "Open Anveshak" : "Launch";
  const [favorite, setFavorite] = useState(false);
  const strip = difficulty.toLowerCase().includes("foundational") || difficulty.toLowerCase().includes("easy")
    ? "border-l-emerald-500"
    : difficulty.toLowerCase().includes("advanced") || difficulty.toLowerCase().includes("hard")
      ? "border-l-rose-500"
      : "border-l-amber-400";

  useEffect(() => {
    setFavorite(readFavorites().includes(route));
  }, [route]);

  function toggleFavorite() {
    const current = readFavorites();
    const next = current.includes(route) ? current.filter((item) => item !== route) : [route, ...current];
    localStorage.setItem(favoriteKey, JSON.stringify(next));
    setFavorite(next.includes(route));
  }

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={`glass-card group relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl border-l-4 ${strip} p-5 hover:shadow-glow`}>
      {(isNew || progress > 65) && <div className="absolute -right-10 top-5 rotate-45 bg-cyan-500 px-10 py-1 text-xs font-black uppercase text-white shadow-lg">{isNew ? "New" : "Updated"}</div>}
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${colorGradient} p-3 text-white shadow-lg transition group-hover:scale-105`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className={`tooltip-icon inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${favorite ? "border-amber-300 bg-amber-100 text-amber-700" : "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"}`} data-tooltip={favorite ? "Remove favorite" : "Favorite"} aria-label={favorite ? "Remove favorite" : "Favorite"} aria-pressed={favorite} onClick={toggleFavorite}>
            <Star className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
          </button>
          <ProgressRing progress={progress} />
        </div>
      </div>
      <div className="pointer-events-none absolute left-5 right-5 top-20 z-20 translate-y-2 rounded-2xl border border-white/70 bg-white p-2 opacity-0 shadow-2xl transition group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-slate-950">
        <div className={`h-24 rounded-xl bg-gradient-to-br ${colorGradient} p-3 text-white`}>
          <div className="grid h-full place-items-center rounded-lg border border-white/30 bg-white/10 text-center text-xs font-black uppercase tracking-wide">
            {title} preview
          </div>
        </div>
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
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mini-chip inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />~{estimatedMinutes} min</span>
        <span className="mini-chip">{difficulty}</span>
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

function ProgressRing({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-12 w-12">
      <svg viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-200 dark:text-white/10" />
        <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-cyan-500 transition-all duration-500" strokeDasharray={circumference} strokeDashoffset={circumference - (clamped / 100) * circumference} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-black">{clamped}%</span>
    </div>
  );
}

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(favoriteKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
