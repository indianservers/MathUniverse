import { BookOpen, Calculator, Cuboid, Home, Keyboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const dockItems = [
  { title: "Home", route: "/", icon: Home },
  { title: "Workspace", route: "/workspace", icon: Keyboard },
  { title: "Shapes", route: "/shapes", icon: Cuboid },
  { title: "Learn", route: "/learn", icon: BookOpen },
  { title: "Calc", route: "/calculator", icon: Calculator },
];

export default function MobileLearningDock() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-2xl shadow-slate-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 lg:hidden" aria-label="Mobile learning shortcuts">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {dockItems.map((item) => {
          const active = item.route === "/" ? location.pathname === "/" : location.pathname.startsWith(item.route);
          const Icon = item.icon;
          return (
            <Link key={item.route} to={item.route} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-bold transition ${active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}>
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
