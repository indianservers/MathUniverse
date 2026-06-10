import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Calculator, CheckCircle2, Command, Download, Eye, Flame, Gauge, HelpCircle, Keyboard, Layers3, MousePointer2, Search, Settings, Sigma, Star, Wand2, X, Zap } from "lucide-react";
import { type ComponentType, type KeyboardEvent as ReactKeyboardEvent, type SVGProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navItems } from "./navItems";
import { useTheme } from "../../hooks/useTheme";

type UndoToastPayload = { message: string; onUndo: () => void };
const undoListeners = new Set<(p: UndoToastPayload) => void>();
export function showUndoToast(message: string, onUndo: () => void) {
  undoListeners.forEach((fn) => fn({ message, onUndo }));
}

export function UndoToastHost() {
  const [toast, setToast] = useState<UndoToastPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (p: UndoToastPayload) => {
      setToast(p);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToast(null), 5000);
    };
    undoListeners.add(handler);
    return () => { undoListeners.delete(handler); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed bottom-28 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xl dark:border-white/10 dark:bg-slate-950 lg:bottom-8"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <span className="text-sm font-semibold">{toast.message}</span>
          <button type="button" className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-cyan-700 transition hover:bg-cyan-100 dark:bg-white/10 dark:text-cyan-200" onClick={() => { toast.onUndo(); dismiss(); }}>Undo</button>
          <button type="button" className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={dismiss} aria-label="Dismiss"><X className="h-3.5 w-3.5" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const SHORTCUTS = [
  { keys: "Ctrl+K", description: "Open command palette" },
  { keys: "?", description: "Show keyboard shortcuts" },
  { keys: "Ctrl+Enter", description: "Run workspace command" },
  { keys: "1-4", description: "Switch workspace panes" },
  { keys: "/", description: "Focus search (Math Lab)" },
  { keys: "Ctrl+Z", description: "Undo last slider change" },
  { keys: "Esc", description: "Close any open overlay" },
  { keys: "Left/Right", description: "Previous/Next in quiz" },
  { keys: "P", description: "Toggle parameter panel (visualizers)" },
  { keys: "T", description: "Cycle through topic tabs" },
];

export function KeyboardShortcutsPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "?" && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape") setOpen(false);
    }
    function openFromCommandCenter() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("math-universe-open-shortcuts", openFromCommandCenter);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("math-universe-open-shortcuts", openFromCommandCenter);
    };
  }, []);

  return (
    <>
      <button type="button" className="tooltip-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100" data-tooltip="Keyboard shortcuts (?)" aria-label="Keyboard shortcuts" onClick={() => setOpen((v) => !v)}>
        <Keyboard className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] bg-slate-950/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="mx-auto mt-24 max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:bg-slate-950" initial={{ y: 12, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 12, scale: 0.97 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
                <div className="flex items-center gap-2 font-black"><HelpCircle className="h-5 w-5 text-cyan-500" />Keyboard Shortcuts</div>
                <button type="button" className="math-tool-button h-8 w-8 rounded-full" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {SHORTCUTS.map(({ keys, description }) => (
                  <div key={keys} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{description}</span>
                    <kbd className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">{keys}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commandItems = useMemo(() => buildCommandItems(), []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const recentRoutes = recentRouteItems(5).map((item) => item.route);
    return commandItems
      .map((item) => ({
        ...item,
        score: scoreCommandItem(item, needle, recentRoutes),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 18);
  }, [commandItems, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

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

  function launch(item: CommandItem) {
    if (item.kind === "action") {
      item.run();
    } else {
      navigate(item.route);
    }
    setOpen(false);
    setQuery("");
  }

  function handlePaletteKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(filtered.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      launch(filtered[activeIndex]);
    }
  }

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  return (
    <>
      <button type="button" className="tool-button hidden sm:inline-flex" onClick={() => setOpen(true)} title="Open command palette">
        <Search className="h-4 w-4" />
        <span>Ctrl+K</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] bg-slate-950/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:bg-slate-950" initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <Command className="h-5 w-5 text-cyan-500" />
                <input ref={inputRef} autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handlePaletteKeyDown} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none" placeholder="Search tools, formulas, workspace commands, exports..." />
                <kbd className="hidden rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-black text-slate-500 dark:bg-white/10 dark:text-slate-300 sm:inline">Enter</kbd>
                <button type="button" className="math-tool-button h-9 w-9 rounded-full" onClick={() => setOpen(false)} aria-label="Close command palette"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-0 md:grid-cols-[1fr_240px]">
                <div className="max-h-[62vh] overflow-y-auto p-2 thin-scrollbar">
                {filtered.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === activeIndex;
                  return (
                    <button key={item.id} type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => launch(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-cyan-50 ring-1 ring-cyan-200 dark:bg-cyan-400/10 dark:ring-cyan-400/30" : "hover:bg-cyan-50 dark:hover:bg-cyan-400/10"}`}>
                      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-black">{item.title}</span>
                        <span className="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">{item.group}</span>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="p-5 text-sm font-semibold text-slate-500">No matching tools.</p>}
                </div>
                <aside className="hidden border-l border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03] md:block">
                  <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Command Center</p>
                  <div className="mt-3 space-y-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
                    <p>Type a topic, command, object, export, or workspace mode.</p>
                    <p>Use arrow keys to move. Press Enter to launch.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["workspace", "circle", "solve", "3d", "export", "teacher"].map((chip) => (
                      <button key={chip} type="button" onClick={() => setQuery(chip)} className="mini-chip">{chip}</button>
                    ))}
                  </div>
                </aside>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type CommandItem =
  | { id: string; kind: "route"; title: string; subtitle: string; group: string; route: string; keywords: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
  | { id: string; kind: "action"; title: string; subtitle: string; group: string; keywords: string; icon: ComponentType<SVGProps<SVGSVGElement>>; run: () => void };

function buildCommandItems(): CommandItem[] {
  const routeItems: CommandItem[] = navItems
    .filter((item) => !item.isExternal)
    .map((item) => ({
      id: `route:${item.route}:${item.title}`,
      kind: "route",
      title: item.title,
      subtitle: item.route,
      group: routeGroup(item.route),
      route: item.route,
      keywords: `${item.title} ${item.route}`,
      icon: item.icon,
    }));

  const actions: CommandItem[] = [
    { id: "action:workspace-polynomial", kind: "route", title: "Open Polynomial Workspace", subtitle: "Template with graph, algebra and guided controls", group: "Template", route: "/workspace?template=polynomials", keywords: "polynomial template graph roots workspace", icon: Sigma },
    { id: "action:workspace-3d", kind: "route", title: "Open 3D Workspace", subtitle: "Surface, solid and vector tools", group: "Template", route: "/workspace?mode=3d", keywords: "3d surface solid vector workspace", icon: Layers3 },
    { id: "action:workspace-geometry", kind: "route", title: "Open Geometry Constructor", subtitle: "2D construction tools and object inspector", group: "Template", route: "/workspace?mode=geometry", keywords: "geometry constructor point line circle polygon", icon: MousePointer2 },
    { id: "action:formula-circles", kind: "route", title: "Circle Formulas", subtitle: "Jump to formula library for circle and sector formulas", group: "Formula", route: "/formulas?category=geometry&formula=geometry-0-0-circle-area#formula-geometry-0-0-circle-area", keywords: "circle formulas area circumference sector", icon: Sigma },
    { id: "action:export-help", kind: "route", title: "Export Tools", subtitle: "Open workspace export panel", group: "Export", route: "/workspace?panel=export", keywords: "export png svg pdf json share url", icon: Download },
    { id: "action:teacher", kind: "action", title: "Toggle Teacher Mode", subtitle: "Switch classroom presentation controls", group: "Action", keywords: "teacher presentation lock reveal classroom", icon: Eye, run: () => window.dispatchEvent(new Event("math-universe-toggle-teacher-mode")) },
    { id: "action:shortcuts", kind: "action", title: "Show Keyboard Shortcuts", subtitle: "Open the keyboard reference", group: "Help", keywords: "keyboard shortcut help", icon: Keyboard, run: () => window.dispatchEvent(new Event("math-universe-open-shortcuts")) },
    { id: "action:focus-search", kind: "action", title: "Focus Page Search", subtitle: "Focus the first search field on this page", group: "Action", keywords: "search focus find page", icon: Search, run: () => focusFirstSearchInput() },
    { id: "action:solve", kind: "route", title: "Solve Command", subtitle: "Open workspace with solve command examples", group: "Command", route: "/workspace?command=solve%20x%5E2-4%3D0", keywords: "solve equation command cas", icon: Calculator },
    { id: "action:graph", kind: "route", title: "Graph Function", subtitle: "Open workspace with graph command examples", group: "Command", route: "/workspace?command=graph%20y%3Dx%5E2-4", keywords: "graph function plot command", icon: Zap },
    { id: "action:guided", kind: "route", title: "Guided Activity Mode", subtitle: "Prediction, manipulation, check, reflection", group: "Teaching", route: "/workspace?mode=guided", keywords: "guided activity predict manipulate check reflect", icon: Wand2 },
  ];

  return [...actions, ...routeItems];
}

function scoreCommandItem(item: CommandItem, needle: string, recentRoutes: string[]) {
  const recentBoost = item.kind === "route" && recentRoutes.includes(item.route) ? 25 : 0;
  if (!needle) return 50 + recentBoost;
  const haystack = `${item.title} ${item.subtitle} ${item.group} ${item.keywords}`.toLowerCase();
  const terms = needle.split(/\s+/).filter(Boolean);
  if (!terms.every((term) => haystack.includes(term))) return 0;
  const titleBoost = item.title.toLowerCase().includes(needle) ? 45 : 0;
  const groupBoost = item.group.toLowerCase().includes(needle) ? 12 : 0;
  return 20 + titleBoost + groupBoost + recentBoost - Math.min(15, item.title.length / 10);
}

function routeGroup(route: string) {
  if (route === "/workspace") return "Workspace";
  if (route.includes("formula")) return "Formula";
  if (route.includes("syllabus") || route.includes("ncert")) return "Syllabus";
  if (route.includes("math-lab") || route.includes("calculator")) return "Tool";
  if (route.includes("quiz") || route.includes("challenge") || route.includes("worked")) return "Practice";
  return "Topic";
}

function focusFirstSearchInput() {
  const input = document.querySelector<HTMLInputElement>("input[type='search'], input[placeholder*='Search'], input[placeholder*='search']");
  input?.focus();
  input?.select();
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
