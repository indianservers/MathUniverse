import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronsLeft, ChevronsRight, Clock3, Menu, Orbit, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { siteLinks } from "../../data/siteLinks";
import { basicNavItemSearchText, iconMap, navItems, navSections, normalizeNavSearchText, type NavItem } from "./navItems";

const recentToolsKey = "math-universe-recent-tools";
const siteSearchTextByPath = new Map(siteLinks.map((link) => [
  normalizeRoute(link.path),
  normalizeNavSearchText([
    link.title,
    link.description,
    link.category,
    ...link.keywords,
    ...(link.details ?? []),
  ].join(" ")),
]));

export default function Sidebar() {
  const location = useLocation();
  const activeSections = useMemo(
    () => navSections.filter((section) => section.items.some((item) => itemHasActiveRoute(item, location.pathname))).map((section) => section.title),
    [location.pathname],
  );
  const activeNavKeys = useMemo(() => navSections.flatMap((section) => section.items.flatMap((item) => activeItemKeys(item, location.pathname))), [location.pathname]);
  const [openSections, setOpenSections] = useState<string[]>(() => Array.from(new Set(["Home", ...activeSections, ...activeNavKeys])));
  const [query, setQuery] = useState("");
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("math-universe-sidebar-collapsed") === "true");
  const recentTools = useMemo(() => recentRoutes.map((route) => navItems.find((item) => item.route === route)).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 5), [recentRoutes]);
  const filteredSections = useMemo(() => {
    const searchTerms = normalizeNavSearchText(query).split(" ").filter(Boolean);
    if (!searchTerms.length) return navSections;
    return navSections
      .map((section) => ({
        ...section,
        items: filterNavItems(section.items, searchTerms, section.title),
      }))
      .filter((section) => section.items.length);
  }, [query]);

  useEffect(() => {
    setOpenSections((current) => Array.from(new Set([...current, ...activeSections, ...activeNavKeys])));
  }, [activeNavKeys, activeSections, location.pathname]);

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
    <aside className={`hidden h-screen min-h-screen shrink-0 overflow-hidden border-r border-cyan-200/25 bg-[linear-gradient(180deg,#071827_0%,#0b2230_46%,#081522_100%)] text-slate-100 shadow-2xl shadow-cyan-950/25 backdrop-blur-2xl transition-[width] dark:border-white/10 dark:bg-[linear-gradient(180deg,#06111f_0%,#0a1627_52%,#050b14_100%)] lg:sticky lg:top-0 lg:block ${collapsed ? "w-28" : "w-72"}`} data-testid="desktop-sidebar" data-collapsed={collapsed}>
      <div className={`thin-scrollbar flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden ${collapsed ? "p-3 pb-20" : "p-4 pb-20"}`}>
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="sticky left-0 top-3 z-50 mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/35 bg-white/10 px-3 py-3 text-sm font-black text-cyan-50 shadow-xl shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          aria-label="Open full menu"
          data-testid="desktop-sidebar-open-menu"
        >
          <ChevronsRight className="h-4 w-4" />
          <span>Open</span>
        </button>
      )}
      <div className={`mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 shadow-lg shadow-black/10 ${collapsed ? "justify-center" : ""}`}>
        <button
          type="button"
          onClick={() => collapsed && toggleCollapsed()}
          className={`rounded-xl bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 p-3 text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.28)] transition ${collapsed ? "cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-200" : "cursor-default"}`}
          aria-label={collapsed ? "Open main menu" : "Math Universe"}
          data-tooltip={collapsed ? "Open main menu" : undefined}
        >
          <Orbit className="h-6 w-6" />
        </button>
        {!collapsed && <div className="min-w-0">
          <p className="text-lg font-black text-white">Math Universe</p>
          <p className="text-xs font-semibold text-cyan-100/70">Complete Visualizations</p>
        </div>}
        <button type="button" className="tooltip-icon ml-auto hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-cyan-50 transition hover:bg-cyan-300/15 lg:inline-flex" data-tooltip={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggleCollapsed}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="mb-4 flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-cyan-300/60 bg-cyan-500 px-2 py-3 text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          aria-label="Open main menu"
          data-testid="desktop-sidebar-menu-button"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[11px] font-black uppercase leading-none">Menu</span>
        </button>
      )}
      {!collapsed && <label className="mb-4 flex min-h-11 items-center gap-2 rounded-xl border border-cyan-200/20 bg-white/[0.08] px-3 text-sm font-semibold shadow-inner shadow-black/10 focus-within:border-cyan-300/70 focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-cyan-300/25">
        <Search className="h-4 w-4 text-cyan-100/70" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu, formula, topic..." className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-cyan-100/55" />
      </label>}
      {!collapsed && !query && recentTools.length > 0 && (
        <div className="mb-4 rounded-xl border border-cyan-300/25 bg-cyan-300/10 p-2 shadow-lg shadow-cyan-950/10">
          <p className="mb-1 flex items-center gap-2 px-2 text-xs font-black uppercase text-cyan-100"><Clock3 className="h-3.5 w-3.5" />Recently opened</p>
          {recentTools.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.route} to={item.route} className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-cyan-50 transition hover:bg-white/10">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      )}
      <nav className="min-w-0 space-y-2" aria-label="Primary navigation">
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
            <div key={section.title} className={collapsed ? "min-w-0 space-y-1" : "min-w-0 rounded-xl border border-white/10 bg-white/[0.045] p-1 shadow-sm shadow-black/10"}>
              <button
                type="button"
                onClick={() => collapsed ? toggleCollapsed() : toggleSection(section.title)}
                className={`tooltip-icon flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-black transition ${collapsed ? "justify-center" : ""} ${active ? "bg-cyan-300/12 text-cyan-50 ring-1 ring-cyan-300/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                aria-expanded={open}
                data-tooltip={collapsed ? `Open menu: ${section.title}` : section.title}
              >
                <SectionIcon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="min-w-0 flex-1 truncate">{section.title}</span>}
                {!collapsed && <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />}
              </button>
              {open && !collapsed && (
                <div className="mt-1 min-w-0 space-y-1 pb-1">
                  {section.items.map((item) => (
                    <SidebarNavItem key={`${item.title}-${item.route}`} item={item} collapsed={collapsed} pathname={location.pathname} openKeys={openSections} onToggle={toggleSection} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      </div>
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
  const open = hasChildren && openKeys.includes(key);
  const indent = collapsed ? "" : depth === 0 ? "" : depth === 1 ? "ml-4" : "ml-7";

  if (hasChildren) {
    return (
      <div className={`${indent} min-w-0 space-y-1`}>
        <button
          type="button"
          onClick={() => collapsed ? undefined : onToggle(key)}
          className={`tooltip-icon flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${collapsed ? "justify-center" : ""} ${
            active ? "bg-cyan-300/15 text-cyan-50 ring-1 ring-cyan-300/25" : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
          aria-expanded={open}
          data-tooltip={item.title}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
          {!collapsed && <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />}
        </button>
        {open && !collapsed && (
          <div className="min-w-0 space-y-1">
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
        className={`tooltip-icon flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white ${collapsed ? "justify-center" : `hover:translate-x-1 ${indent}`}`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="min-w-0 truncate">{item.title}</span>}
      </a>
    );
  }

  return (
    <NavLink
      to={item.route}
      title={item.title}
      end={item.route === "/"}
      className={({ isActive }) =>
        `tooltip-icon flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${collapsed ? "justify-center" : `hover:translate-x-1 ${indent}`} ${
          isActive
            ? "bg-white text-slate-950 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-200/70"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
      data-tooltip={item.title}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="min-w-0 truncate">{item.title}</span>}
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

export function filterNavItems(items: NavItem[], searchTerms: string[], sectionTitle: string): NavItem[] {
  return items.reduce<NavItem[]>((matches, item) => {
    const children = filterNavItems(item.children ?? [], searchTerms, sectionTitle);
    const match = searchTerms.every((term) => navItemSearchText(item, sectionTitle).includes(term));
    if (match || children.length > 0) matches.push({ ...item, children });
    return matches;
  }, []);
}

function navItemSearchText(item: NavItem, sectionTitle: string) {
  const siteSearchText = siteSearchTextByPath.get(normalizeRoute(item.route)) ?? "";
  return normalizeNavSearchText([basicNavItemSearchText(item, sectionTitle), siteSearchText].join(" "));
}

function normalizeRoute(route: string) {
  if (route.endsWith("/") && route !== "/") return route.slice(0, -1);
  return route;
}

export function normalizeSearchText(value: string) {
  return normalizeNavSearchText(value);
}

function navItemKey(item: NavItem) {
  return `${item.title}:${item.route}`;
}

function activeItemKeys(item: NavItem, pathname: string): string[] {
  if (!item.children?.length) return [];
  const childKeys = item.children.flatMap((child) => activeItemKeys(child, pathname));
  return itemHasActiveRoute(item, pathname) ? [navItemKey(item), ...childKeys] : childKeys;
}
