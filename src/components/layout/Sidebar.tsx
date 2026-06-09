import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronsLeft, ChevronsRight, Clock3, Menu, Orbit, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { iconMap, navItems, navSections, type NavItem } from "./navItems";

const recentToolsKey = "math-universe-recent-tools";

export default function Sidebar() {
  const location = useLocation();
  const activeSections = useMemo(
    () => navSections.filter((section) => section.items.some((item) => itemHasActiveRoute(item, location.pathname))).map((section) => section.title),
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
        items: filterNavItems(section.items, value, section.title),
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
    <aside className={`hidden h-screen shrink-0 overflow-y-auto border-r border-white/60 bg-white/78 backdrop-blur-xl transition-[width] dark:border-white/10 dark:bg-slate-950/72 lg:sticky lg:top-0 lg:block ${collapsed ? "w-24 p-3" : "w-72 p-4"}`}>
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => collapsed && toggleCollapsed()}
          className={`rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-3 text-white shadow-glow transition ${collapsed ? "cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300" : "cursor-default"}`}
          aria-label={collapsed ? "Open main menu" : "Math Universe"}
          data-tooltip={collapsed ? "Open main menu" : undefined}
        >
          <Orbit className="h-6 w-6" />
        </button>
        {!collapsed && <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">Math Universe</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete Visualizations</p>
        </div>}
        <button type="button" className="tooltip-icon ml-auto hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100 lg:inline-flex" data-tooltip={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggleCollapsed}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="mb-4 flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-cyan-300/60 bg-cyan-500 px-2 py-3 text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          aria-label="Open main menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[11px] font-black uppercase leading-none">Menu</span>
        </button>
      )}
      {!collapsed && <label className="mb-4 flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-white/5">
        <Search className="h-4 w-4 text-slate-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu, formula, topic..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" />
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
                onClick={() => collapsed ? toggleCollapsed() : toggleSection(section.title)}
                className={`tooltip-icon flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black transition ${collapsed ? "justify-center" : ""} ${active ? "text-cyan-700 dark:text-cyan-200" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"}`}
                aria-expanded={open}
                data-tooltip={collapsed ? `Open menu: ${section.title}` : section.title}
              >
                <SectionIcon className="h-4 w-4" />
                {!collapsed && <span className="min-w-0 flex-1 truncate">{section.title}</span>}
                {!collapsed && <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />}
              </button>
              {(open || collapsed) && (
                <div className="mt-1 space-y-1 pb-1">
                  {section.items.map((item) => (
                    <SidebarNavItem key={`${item.title}-${item.route}`} item={item} collapsed={collapsed} pathname={location.pathname} openKeys={openSections} onToggle={toggleSection} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarNavItem({
  item,
  collapsed,
  pathname,
  openKeys,
  onToggle,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  openKeys: string[];
  onToggle: (title: string) => void;
  depth?: number;
}) {
  const Icon = iconMap[item.icon];
  const key = navItemKey(item);
  const hasChildren = Boolean(item.children?.length);
  const active = itemHasActiveRoute(item, pathname);
  const open = hasChildren && (openKeys.includes(key) || active);
  const indent = collapsed ? "" : depth === 0 ? "" : depth === 1 ? "ml-4" : "ml-7";

  if (hasChildren) {
    return (
      <div className={`${indent} space-y-1`}>
        <button
          type="button"
          onClick={() => collapsed ? undefined : onToggle(key)}
          className={`tooltip-icon flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${collapsed ? "justify-center" : ""} ${
            active ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          }`}
          aria-expanded={open}
          data-tooltip={item.title}
        >
          <Icon className="h-4 w-4" />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
          {!collapsed && <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />}
        </button>
        {open && !collapsed && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <SidebarNavItem key={`${child.title}-${child.route}`} item={child} collapsed={collapsed} pathname={pathname} openKeys={openKeys} onToggle={onToggle} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.isExternal) {
    return (
      <a
        href={item.route}
        title={item.title}
        data-tooltip={item.title}
        className={`tooltip-icon flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${collapsed ? "justify-center" : `hover:translate-x-1 ${indent}`}`}
      >
        <Icon className="h-4 w-4" />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </a>
    );
  }

  return (
    <NavLink
      to={item.route}
      title={item.title}
      end={item.route === "/"}
      className={({ isActive }) =>
        `tooltip-icon flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${collapsed ? "justify-center" : `hover:translate-x-1 ${indent}`} ${
          isActive
            ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        }`
      }
      data-tooltip={item.title}
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </NavLink>
  );
}

function isActiveRoute(pathname: string, route: string) {
  if (/^https?:\/\//.test(route)) return false;
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

function itemHasActiveRoute(item: NavItem, pathname: string): boolean {
  if (item.children?.length) return pathname === item.route || item.children.some((child) => itemHasActiveRoute(child, pathname));
  return isActiveRoute(pathname, item.route);
}

function filterNavItems(items: NavItem[], value: string, sectionTitle: string): NavItem[] {
  return items.reduce<NavItem[]>((matches, item) => {
    const children = filterNavItems(item.children ?? [], value, sectionTitle);
    const match = `${item.title} ${sectionTitle}`.toLowerCase().includes(value);
    if (match || children.length > 0) matches.push({ ...item, children });
    return matches;
  }, []);
}

function navItemKey(item: NavItem) {
  return `${item.title}:${item.route}`;
}
