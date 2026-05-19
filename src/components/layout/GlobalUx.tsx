import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Flame, Gauge, Search, Settings, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navItems } from "./navItems";
import { useTheme } from "../../hooks/useTheme";

const recentToolsKey = "math-universe-recent-tools";
const quizXpKey = "math-universe-quiz-xp";
const quizStreakKey = "math-universe-quiz-streak";
const pendingQuizCountKey = "math-universe-pending-quiz-count";

export function BreadcrumbTrail() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-cyan-600">Home</Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const matched = navItems.find((item) => !item.isExternal && item.route === path);
        const label = matched?.title ?? segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
        const last = index === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-2">
            <span aria-hidden>&gt;</span>
            {last ? <span className="text-cyan-700 dark:text-cyan-200">{label}</span> : <Link to={path} className="hover:text-cyan-600">{label}</Link>}
          </span>
        );
      })}
    </nav>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return navItems
      .filter((item) => !item.isExternal)
      .filter((item) => !needle || item.title.toLowerCase().includes(needle) || item.route.toLowerCase().includes(needle))
      .slice(0, 12);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function launch(route: string) {
    navigate(route);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button type="button" className="tool-button hidden sm:inline-flex" onClick={() => setOpen(true)} title="Open command palette">
        <Search className="h-4 w-4" />
        <span>Ctrl+K</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] bg-slate-950/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:bg-slate-950" initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }}>
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <Search className="h-5 w-5 text-cyan-500" />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none" placeholder="Launch a visualizer, quiz, or topic..." />
                <button type="button" className="math-tool-button h-9 w-9 rounded-full" onClick={() => setOpen(false)} aria-label="Close command palette"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.route} type="button" onClick={() => launch(item.route)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cyan-50 dark:hover:bg-cyan-400/10">
                      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-black">{item.title}</span>
                        <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{item.route}</span>
                      </span>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="p-5 text-sm font-semibold text-slate-500">No matching tools.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button type="button" className="tooltip-icon fixed bottom-24 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl dark:bg-white dark:text-slate-950 lg:bottom-6" data-tooltip="Back to top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export function HeaderStats() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const read = () => {
      setXp(Number(localStorage.getItem(quizXpKey) ?? 0));
      try {
        setStreak(Number(JSON.parse(localStorage.getItem(quizStreakKey) ?? "{}").count ?? 0));
      } catch {
        setStreak(0);
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("math-universe-stats", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("math-universe-stats", read);
    };
  }, []);

  return (
    <div className="hidden items-center gap-2 md:flex">
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-2 text-xs font-black text-orange-700 dark:bg-orange-400/15 dark:text-orange-100"><Flame className="h-4 w-4" />{streak}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100"><Star className="h-4 w-4" />{xp} XP</span>
    </div>
  );
}

export function AccessibilitySettings() {
  const { fontScale, setFontScale, reducedMotion, setReducedMotion, colorBlindPalette, setColorBlindPalette } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" className="tooltip-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100" data-tooltip="Accessibility settings" aria-label="Accessibility settings" onClick={() => setOpen((value) => !value)}>
        <Settings className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-950">
          <p className="text-sm font-black">Display</p>
          <div className="mt-3 flex gap-2">
            {(["base", "large", "xlarge"] as const).map((size, index) => (
              <button key={size} type="button" className={fontScale === size ? "action-primary min-h-9 px-3 py-1" : "action-secondary min-h-9 px-3 py-1"} onClick={() => setFontScale(size)}>
                A{index === 1 ? "+" : index === 2 ? "++" : ""}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center justify-between gap-3 text-sm font-bold">
            Reduced motion
            <input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3 text-sm font-bold">
            Color-blind palette
            <input type="checkbox" checked={colorBlindPalette} onChange={(event) => setColorBlindPalette(event.target.checked)} />
          </label>
        </div>
      )}
    </div>
  );
}

export function getPendingQuizCount() {
  return Number(localStorage.getItem(pendingQuizCountKey) ?? 3);
}

export function recentRouteItems(limit = 5) {
  try {
    const routes = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
    return (Array.isArray(routes) ? routes : [])
      .filter((route): route is string => typeof route === "string")
      .map((route) => navItems.find((item) => !item.isExternal && item.route === route))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function trackQuizActivity() {
  const today = new Date().toISOString().slice(0, 10);
  const rawHeatmap = localStorage.getItem("math-universe-quiz-heatmap");
  const heatmap = rawHeatmap ? JSON.parse(rawHeatmap) as Record<string, number> : {};
  heatmap[today] = (heatmap[today] ?? 0) + 1;
  localStorage.setItem("math-universe-quiz-heatmap", JSON.stringify(heatmap));

  const rawStreak = localStorage.getItem(quizStreakKey);
  const streak = rawStreak ? JSON.parse(rawStreak) as { date?: string; count?: number } : {};
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = streak.date === today ? streak.count ?? 1 : streak.date === yesterday ? (streak.count ?? 0) + 1 : 1;
  localStorage.setItem(quizStreakKey, JSON.stringify({ date: today, count }));
  window.dispatchEvent(new Event("math-universe-stats"));
}

export function addQuizXp(points: number) {
  const next = Number(localStorage.getItem(quizXpKey) ?? 0) + points;
  localStorage.setItem(quizXpKey, String(next));
  window.dispatchEvent(new Event("math-universe-stats"));
}

export function GaugeBadge({ value }: { value: number }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black dark:bg-white/10"><Gauge className="h-3.5 w-3.5 text-cyan-500" />{value}</span>;
}
