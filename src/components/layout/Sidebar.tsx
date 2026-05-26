import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronsLeft, ChevronsRight, Clock3, Orbit, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { iconMap, navItems, navSections } from "./navItems";

const recentToolsKey = "math-universe-recent-tools";

export default function Sidebar() {
  const location = useLocation();
  const activeSections = useMemo(
    () => navSections.filter((section) => section.items.some((item) => isActiveRoute(location.pathname, item.route))).map((section) => section.title),
    [location.pathname],
  );
  const [openSections, setOpenSections] = useState<string[]>(() => Array.from(new Set(["Main", ...activeSections])));
  const [query, setQuery] = useState("");
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("math-universe-sidebar-collapsed") === "true");
  const recentTools = useMemo(() => recentRoutes.map((route) => navItems.find((item) => item.route === route)).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 5), [recentRoutes]);
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
    setOpenSections((current) => Array.from(new Set([...current, ...activeSections])));
  }, [activeSections, location.pathname]);

  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
      setRecentRoutes(Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : []);
    } catch {
      setRecentRoutes([]);
    }
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  };

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      localStorage.setItem("math-universe-sidebar-collapsed", String(!value));
      return !value;
    });
  };

  return (
    <aside className={`hidden h-screen shrink-0 overflow-y-auto border-r border-white/60 bg-white/78 p-4 backdrop-blur-xl transition-[width] dark:border-white/10 dark:bg-slate-950/72 lg:sticky lg:top-0 lg:block ${collapsed ? "w-20" : "w-72"}`}>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-3 text-white shadow-glow">
          <Orbit className="h-6 w-6" />
        </div>
        {!collapsed && <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">Math Universe</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete Visualizations</p>
        </div>}
        <button type="button" className="tooltip-icon ml-auto hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100 lg:inline-flex" data-tooltip={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggleCollapsed}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
      {!collapsed && <label className="mb-4 flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-white/5">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" />
      </label>}
      {!collapsed && !query && recentTools.length > 0 && (
        <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-2 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <p className="mb-1 flex items-center gap-2 px-2 text-xs font-black uppercase text-cyan-800 dark:text-cyan-100"><Clock3 className="h-3.5 w-3.5" />Recently opened</p>
          {recentTools.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.route} to={item.route} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-cyan-900 hover:bg-white/70 dark:text-cyan-100 dark:hover:bg-white/10">
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      )}
      <nav className="space-y-2" aria-label="Primary navigation">
        {filteredSections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-slate-400">
            No tools found. Try graph, matrix, solver, or quiz.
          </div>
        )}
        {filteredSections.map((section) => {
          const SectionIcon = iconMap[section.icon];
          const open = openSections.includes(section.title);
          const active = activeSections.includes(section.title);
          return (
            <div key={section.title} className={collapsed ? "space-y-1" : "rounded-2xl border border-slate-200/70 bg-white/55 p-1 dark:border-white/10 dark:bg-white/[0.03]"}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className={`tooltip-icon flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black transition ${collapsed ? "justify-center" : ""} ${active ? "text-cyan-700 dark:text-cyan-200" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"}`}
                aria-expanded={open}
                data-tooltip={section.title}
              >
                <SectionIcon className="h-4 w-4" />
                {!collapsed && <span className="min-w-0 flex-1 truncate">{section.title}</span>}
                {!collapsed && <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />}
              </button>
              {(open || collapsed) && (
                <div className="mt-1 space-y-1 pb-1">
                  {section.items.map(({ title, route, icon, isExternal }) => {
                    const Icon = iconMap[icon];
                    return isExternal ? (
                      <a
                        key={route}
                        href={route}
                        title={title}
                        data-tooltip={title}
                        className={`tooltip-icon flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${collapsed ? "justify-center" : "hover:translate-x-1"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span className="truncate">{title}</span>}
                      </a>
                    ) : (
                      <NavLink
                        key={route}
                        to={route}
                        title={title}
                        end={route === "/"}
                        className={({ isActive }) =>
                          `tooltip-icon flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${collapsed ? "justify-center" : "hover:translate-x-1"} ${
                            isActive
                              ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                          }`
                        }
                        data-tooltip={title}
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span className="truncate">{title}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function isActiveRoute(pathname: string, route: string) {
  if (/^https?:\/\//.test(route)) return false;
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}
