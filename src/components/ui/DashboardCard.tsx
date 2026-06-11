import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, ExternalLink, LucideIcon, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const actionLabel = isExternal ? "Open external lab" : "Launch";
  const [favorite, setFavorite] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const strip = difficulty.toLowerCase().includes("foundational") || difficulty.toLowerCase().includes("easy")
    ? "border-l-emerald-500"
    : difficulty.toLowerCase().includes("advanced") || difficulty.toLowerCase().includes("hard")
      ? "border-l-rose-500"
      : "border-l-amber-400";

  useEffect(() => {
    setFavorite(readFavorites().includes(route));
  }, [route]);

  useEffect(() => {
    if (!contextMenu) return;
    function close(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) setContextMenu(null);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [contextMenu]);

  function toggleFavorite() {
    const current = readFavorites();
    const next = current.includes(route) ? current.filter((item) => item !== route) : [route, ...current];
    localStorage.setItem(favoriteKey, JSON.stringify(next));
    setFavorite(next.includes(route));
  }

  function handleContextMenu(e: React.MouseEvent) {
    if (isExternal) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }

  function openInNewTab() {
    window.open(route, "_blank", "noopener,noreferrer");
    setContextMenu(null);
  }

  function launchCard() {
    if (isExternal) window.open(route, "_blank", "noopener,noreferrer");
    else navigate(route);
    setContextMenu(null);
  }

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onContextMenu={handleContextMenu}
        className={`glass-card group relative flex min-h-[190px] flex-col overflow-hidden rounded-xl border-l-4 ${strip} p-3 hover:shadow-glow`}
      >
        {(isNew || progress > 65) && <div className="absolute -right-10 top-4 rotate-45 bg-cyan-500 px-10 py-1 text-xs font-black uppercase text-white shadow-lg">{isNew ? "New" : "Updated"}</div>}
        <div className="flex items-start justify-between gap-3">
          <div className={`rounded-xl bg-gradient-to-br ${colorGradient} p-2.5 text-white shadow-lg transition group-hover:scale-105`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={`tooltip-icon inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${favorite ? "border-amber-300 bg-amber-100 text-amber-700" : "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"}`}
              data-tooltip={favorite ? "Remove favorite" : "Favorite"}
              aria-label={favorite ? "Remove favorite" : "Favorite"}
              aria-pressed={favorite}
              onClick={toggleFavorite}
            >
              <Star className={`h-3.5 w-3.5 ${favorite ? "fill-current" : ""}`} />
            </button>
            {!isExternal && (
              <a
                href={route}
                target="_blank"
                rel="noopener noreferrer"
                className="tooltip-icon inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                data-tooltip="Open in new tab"
                aria-label={`Open ${title} in new tab`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <ProgressRing progress={progress} size={40} />
          </div>
        </div>
        <h2 className="mt-2.5 text-base font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {concepts.slice(0, 4).map((concept) => (
            <span key={concept} className="mini-chip text-[11px]">
              {concept}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="mini-chip inline-flex items-center gap-1 text-[11px]"><Clock className="h-3 w-3" />~{estimatedMinutes} min</span>
          <span className="mini-chip text-[11px]">{difficulty}</span>
        </div>
        {isExternal ? (
          <a href={route} aria-label={`Open ${title}`} className="action-primary mt-auto w-full py-1.5 text-sm">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <Link
            to={route}
            aria-label={`Launch ${title}`}
            className="action-primary mt-auto w-full py-1.5 text-sm"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </motion.article>

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            ref={contextRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
            className="min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
          >
            <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-400/10" onClick={launchCard}>
              <ArrowRight className="h-4 w-4 text-cyan-500" />
              Launch
            </button>
            <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-400/10" onClick={openInNewTab}>
              <ExternalLink className="h-4 w-4 text-violet-500" />
              Open in new tab
            </button>
            <button type="button" className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-400/10" onClick={() => { toggleFavorite(); setContextMenu(null); }}>
              <Star className={`h-4 w-4 ${favorite ? "fill-amber-400 text-amber-400" : "text-amber-500"}`} />
              {favorite ? "Remove favorite" : "Add to favorites"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = size * 0.375;
  const circumference = 2 * Math.PI * radius;
  const half = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={half} cy={half} r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-white/10" />
        <circle cx={half} cy={half} r={radius} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-cyan-500 transition-all duration-500" strokeDasharray={circumference} strokeDashoffset={circumference - (clamped / 100) * circumference} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[9px] font-black">{clamped}%</span>
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
