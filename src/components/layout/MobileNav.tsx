import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock3, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { basicNavItemSearchText, iconMap, navItems, navSections, normalizeNavSearchText, type NavItem } from "./navItems";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

const recentToolsKey = "math-universe-recent-tools";

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation();
  const activeSections = useMemo(
    () => navSections.filter((section) => section.items.some((item) => itemHasActiveRoute(item, location.pathname))).map((section) => section.title),
    [location.pathname],
  );
  const activeNavKeys = useMemo(() => navSections.flatMap((section) => section.items.flatMap((item) => activeItemKeys(item, location.pathname))), [location.pathname]);
  const [openSections, setOpenSections] = useState<string[]>(() => Array.from(new Set(["Home", ...activeSections, ...activeNavKeys])));
  const [query, setQuery] = useState("");
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);
  const recentTools = useMemo(() => recentRoutes.map((route) => navItems.find((item) => item.route === route)).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 4), [recentRoutes]);
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
    if (!open) return;
    setOpenSections((current) => Array.from(new Set([...current, ...activeSections, ...activeNavKeys])));
    try {
      const current = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
      setRecentRoutes(Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : []);
    } catch {
      setRecentRoutes([]);
    }
  }, [activeNavKeys, activeSections, open, location.pathname]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  const toggleSection = (title: string) => {
    setOpenSections((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 z-0 bg-slate-950/60" type="button" aria-label="Close navigation" onClick={onClose} />
          <motion.aside
            id="mobile-navigation"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 h-full w-[min(21rem,92vw)] overflow-y-auto bg-white p-3 pb-24 shadow-2xl sm:p-5 sm:pb-8 dark:bg-slate-950"
            aria-label="Mobile navigation"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-6">
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
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu, formula, topic..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" />
            </label>
            {!query && recentTools.length > 0 && (
              <div className="mb-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-2 dark:border-cyan-400/20 dark:bg-cyan-400/10 sm:mb-4">
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
            <nav className="space-y-1.5 sm:space-y-2" aria-label="Mobile navigation">
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
                        {section.items.map((item) => (
                          <MobileNavItem
                            key={`${item.title}-${item.route}`}
                            item={item}
                            pathname={location.pathname}
                            openKeys={openSections}
                            onToggle={toggleSection}
                            onClose={onClose}
                          />
                        ))}
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

function MobileNavItem({
  item,
  pathname,
  openKeys,
  onToggle,
  onClose,
  depth = 0,
}: {
  item: NavItem;
  pathname: string;
  openKeys: string[];
  onToggle: (title: string) => void;
  onClose: () => void;
  depth?: number;
}) {
  const Icon = iconMap[item.icon];
  const key = navItemKey(item);
  const hasChildren = Boolean(item.children?.length);
  const active = itemHasActiveRoute(item, pathname);
  const open = hasChildren && openKeys.includes(key);
  const indent = depth === 0 ? "" : depth === 1 ? "ml-4" : "ml-7";

  if (hasChildren) {
    return (
      <div className={`${indent} space-y-1`}>
        <button
          type="button"
          onClick={() => onToggle(key)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
            active ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100" : "text-slate-600 dark:text-slate-300"
          }`}
          aria-expanded={open}
        >
          <Icon className="h-4 w-4" />
          <span className="min-w-0 flex-1 truncate">{item.title}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <MobileNavItem key={`${child.title}-${child.route}`} item={child} pathname={pathname} openKeys={openKeys} onToggle={onToggle} onClose={onClose} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.isExternal) {
    return (
      <a href={item.route} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition dark:text-slate-300 ${indent}`}>
        <Icon className="h-4 w-4" />
        <span className="truncate">{item.title}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={item.route}
      end={item.route === "/"}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${indent} ${
          isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{item.title}</span>
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

function filterNavItems(items: NavItem[], searchTerms: string[], sectionTitle: string): NavItem[] {
  return items.reduce<NavItem[]>((matches, item) => {
    const children = filterNavItems(item.children ?? [], searchTerms, sectionTitle);
    const match = searchTerms.every((term) => basicNavItemSearchText(item, sectionTitle).includes(term));
    if (match || children.length > 0) matches.push({ ...item, children });
    return matches;
  }, []);
}

function navItemKey(item: NavItem) {
  return `${item.title}:${item.route}`;
}

function activeItemKeys(item: NavItem, pathname: string): string[] {
  if (!item.children?.length) return [];
  const childKeys = item.children.flatMap((child) => activeItemKeys(child, pathname));
  return itemHasActiveRoute(item, pathname) ? [navItemKey(item), ...childKeys] : childKeys;
}
