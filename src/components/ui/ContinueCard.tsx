import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { navItems } from "../layout/navItems";

function getLastVisited(prefix: string): { title: string; route: string } | null {
  try {
    const raw = JSON.parse(localStorage.getItem("math-universe-recent-tools") ?? "[]") as unknown[];
    const routes = raw.filter((x): x is string => typeof x === "string");
    const match = routes.find((r) => r.startsWith(prefix) && r !== prefix);
    if (!match) return null;
    const item = navItems.find((n) => n.route === match);
    return item ? { title: item.title, route: item.route } : { title: match.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), route: match };
  } catch { return null; }
}

export default function ContinueCard({ routePrefix }: { routePrefix: string }) {
  const last = getLastVisited(routePrefix);
  if (!last) return null;
  return (
    <Link
      to={last.route}
      className="flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 transition hover:border-cyan-400 hover:shadow-md dark:border-cyan-400/20 dark:bg-cyan-400/10"
    >
      <PlayCircle className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black uppercase text-cyan-600 dark:text-cyan-400">Continue where you left off</span>
        <span className="block text-sm font-bold text-slate-900 dark:text-white">{last.title}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
    </Link>
  );
}
