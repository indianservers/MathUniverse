import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock3, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { iconMap, navItems, navSections } from "./navItems";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

const recentToolsKey = "math-universe-recent-tools";

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation();
  const activeSections = navSections.filter((section) => section.items.some((item) => isActiveRoute(location.pathname, item.route))).map((section) => section.title);
  const [openSections, setOpenSections] = useState<string[]>(() => Array.from(new Set(["Main", ...activeSections])));
  const [query, setQuery] = useState("");
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);
  const recentTools = useMemo(() => recentRoutes.map((route) => navItems.find((item) => item.route === route)).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 4), [recentRoutes]);
  const filteredSections = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return navSections;
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => `${item.title} ${section.title}`.toLowerCase().includes(value)),
      }))
      .filter((section) => section.items.length);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setOpenSections((current) => Array.from(new Set([...current, ...activeSections])));
    try {
      const current = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
      setRecentRoutes(Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : []);
    } catch {
      setRecentRoutes([]);
    }
  }, [open, location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-slate-950/60" type="button" aria-label="Close navigation" onClick={onClose} />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative h-full w-80 max-w-[86vw] overflow-y-auto bg-white p-5 pb-8 shadow-2xl dark:bg-slate-950"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Math Universe</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visual learning space</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mb-4 flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-white/5">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" />
            </label>
            {!query && recentTools.length > 0 && (
              <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-2 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                <p className="mb-1 flex items-center gap-2 px-2 text-xs font-black uppercase text-cyan-800 dark:text-cyan-100"><Clock3 className="h-3.5 w-3.5" />Recently opened</p>
                {recentTools.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.route} to={item.route} onClick={onClose} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-cyan-900 dark:text-cyan-100">
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
            <nav className="space-y-2" aria-label="Mobile navigation">
              {filteredSections.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-slate-400">
                  No tools found. Try graph, matrix, solver, or quiz.
                </div>
              )}
              {filteredSections.map((section) => {
                const SectionIcon = iconMap[section.icon];
                const sectionOpen = openSections.includes(section.title);
                const sectionActive = activeSections.includes(section.title);
                return (
                  <div key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.title)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black ${sectionActive ? "text-cyan-700 dark:text-cyan-200" : "text-slate-700 dark:text-slate-200"}`}
                      aria-expanded={sectionOpen}
                    >
                      <SectionIcon className="h-4 w-4" />
                      <span className="min-w-0 flex-1 truncate">{section.title}</span>
                      <ChevronDown className={`h-4 w-4 transition ${sectionOpen ? "rotate-180" : ""}`} />
                    </button>
                    {sectionOpen && (
                      <div className="mt-1 space-y-1 pb-1">
                        {section.items.map(({ title, route, icon, isExternal }) => {
                          const Icon = iconMap[icon];
                          return isExternal ? (
                            <a
                              key={route}
                              href={route}
                              onClick={onClose}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition dark:text-slate-300"
                            >
                              <Icon className="h-4 w-4" />
                              <span className="truncate">{title}</span>
                            </a>
                          ) : (
                            <NavLink
                              key={route}
                              to={route}
                              end={route === "/"}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                  isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"
                                }`
                              }
                            >
                              <Icon className="h-4 w-4" />
                              <span className="truncate">{title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function isActiveRoute(pathname: string, route: string) {
  if (/^https?:\/\//.test(route)) return false;
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}
