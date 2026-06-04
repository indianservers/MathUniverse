import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { routeQuery } from "../utils/mathEngine/queryRouter";

const recentKey = "math-universe-smart-query-history";
const examples = [
  "solve x^2 - 5*x + 6 = 0",
  "plot sin(x)",
  "differentiate x^3",
  "integrate x^2 + 2*x",
  "roll dice probability",
  "construct triangle angle",
];

export default function MathLabSmartQuery() {
  const [query, setQuery] = useState("solve x^2 - 5*x + 6 = 0");
  const [history, setHistory] = useState<string[]>(() => readQueries());
  const routed = useMemo(() => routeQuery(query), [query]);
  const targetRoute = useMemo(() => buildTargetRoute(routed), [routed]);

  useEffect(() => {
    localStorage.setItem(recentKey, JSON.stringify(history.slice(0, 12)));
  }, [history]);

  function remember() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHistory((items) => [trimmed, ...items.filter((item) => item !== trimmed)].slice(0, 12));
  }

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Smart Math Query"
        subtitle="Type a math task and jump to the best graphing, solving, CAS, geometry, or probability tool."
        difficulty="Routing Assistant"
        estimatedMinutes={10}
      />

      <SectionCard title="Ask Math Universe">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10 dark:bg-slate-950">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="plot sin(x), solve x^2=4, differentiate x^3..." />
          </label>
          <Link to={targetRoute} onClick={remember} className="action-primary inline-flex items-center justify-center gap-2">
            Open {routed.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button key={example} type="button" className="mini-chip" onClick={() => setQuery(example)}>
              {example}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Recommended Route">
          <div className="rounded-lg bg-slate-100 p-5 dark:bg-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mini-chip">{routed.intent}</span>
              <span className="mini-chip">confidence: {routed.confidence}</span>
            </div>
            <h2 className="mt-4 text-2xl font-black">{routed.label}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{routed.reason}</p>
            {routed.expression && (
              <div className="mt-4 rounded-lg bg-white p-4 dark:bg-slate-950">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Extracted expression</p>
                <p className="mt-2 break-words font-mono text-lg font-black">{routed.expression}</p>
              </div>
            )}
            {routed.operation && (
              <div className="mt-3 rounded-lg bg-white p-4 dark:bg-slate-950">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Operation</p>
                <p className="mt-2 break-words font-mono text-lg font-black">{routed.operation}</p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent Queries">
          <div className="space-y-2">
            {history.length === 0 && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Open a route to save queries here.</p>}
            {history.map((item) => (
              <button key={item} type="button" className="w-full rounded-lg bg-slate-100 p-3 text-left text-sm font-semibold transition hover:bg-cyan-100 dark:bg-white/10 dark:hover:bg-cyan-400/15" onClick={() => setQuery(item)}>
                {item}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="How It Routes">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Function words like plot and graph go to the Graphing Calculator.",
            "Symbolic words like solve, derivative, and integrate go to solver or CAS tools.",
            "Experiment words like coin, dice, card, and binomial go to Probability Simulator.",
          ].map((text) => (
            <div key={text} className="rounded-lg bg-slate-100 p-4 text-sm font-semibold leading-6 dark:bg-white/10">
              <Sparkles className="mb-2 h-4 w-4 text-cyan-500" />
              {text}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function buildTargetRoute(routed: ReturnType<typeof routeQuery>) {
  const params = new URLSearchParams();
  if (routed.expression) params.set("q", routed.expression);
  if (routed.operation) params.set("op", routed.operation);
  const suffix = params.toString();
  return suffix ? `${routed.route}?${suffix}` : routed.route;
}

function readQueries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(recentKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 12) : [];
  } catch {
    return [];
  }
}
