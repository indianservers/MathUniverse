import { NavLink } from "react-router-dom";
import { Orbit } from "lucide-react";
import { navItems } from "./navItems";

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/60 bg-white/78 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72 lg:sticky lg:top-0 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-3 text-white shadow-glow">
          <Orbit className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-950 dark:text-white">Math Universe</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete Visualizations</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ title, route, icon: Icon, isExternal }) =>
          isExternal ? (
            <a
              key={route}
              href={route}
              title={title}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Icon className="h-5 w-5" />
              {title}
            </a>
          ) : (
            <NavLink
              key={route}
              to={route}
              title={title}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:translate-x-1 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {title}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}
