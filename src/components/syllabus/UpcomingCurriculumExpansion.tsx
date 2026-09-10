import { BookOpenCheck, Clock3, Filter, GraduationCap, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  upcomingCurriculumItems,
  upcomingCurriculumLanes,
  upcomingCurriculumSummary,
  type UpcomingCurriculumLane,
} from "../../data/upcomingCurriculum";

type LaneFilter = "All" | UpcomingCurriculumLane;

export default function UpcomingCurriculumExpansion() {
  const [lane, setLane] = useState<LaneFilter>("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return upcomingCurriculumItems.filter((item) => {
      const laneMatch = lane === "All" || item.lane === lane;
      const searchMatch =
        !normalized ||
        [item.provider, item.levels, item.title, item.summary, item.delivery, ...item.topics]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return laneMatch && searchMatch;
    });
  }, [lane, query]);

  return (
    <section id="upcoming-curriculum" className="overflow-hidden rounded-3xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-white to-cyan-50 shadow-sm dark:border-amber-300/20 dark:from-amber-300/10 dark:via-slate-950 dark:to-cyan-300/10">
      <div className="border-b border-amber-200/80 p-5 dark:border-white/10 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-sm font-black text-amber-900 dark:border-amber-300/25 dark:bg-amber-300/15 dark:text-amber-100"><Clock3 className="h-4 w-4" />Upcoming</span>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Curriculum expansion catalog</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">Class 6 to research mathematics</h2>
            <p className="mt-2 text-base leading-7 text-slate-700 dark:text-slate-200">These pathways and content areas are planned and discoverable now, but they are not yet claimed as taught, assessed, mapped, or certified. Every card remains marked Upcoming until its evidence is complete.</p>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Metric value={upcomingCurriculumSummary.itemCount} label="roadmap items" />
            <Metric value={upcomingCurriculumSummary.providerCount} label="providers" />
            <Metric value={upcomingCurriculumSummary.laneCount} label="lanes" />
          </dl>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(260px,1fr)_minmax(220px,320px)]">
          <label className="relative block">
            <span className="sr-only">Search upcoming curriculum</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search boards, classes, university topics..." className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-base dark:border-white/10 dark:bg-slate-900" />
          </label>
          <label className="relative block">
            <span className="sr-only">Filter upcoming curriculum lane</span>
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select value={lane} onChange={(event) => setLane(event.target.value as LaneFilter)} className="min-h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-base font-bold dark:border-white/10 dark:bg-slate-900">
              <option value="All">All expansion lanes</option>
              {upcomingCurriculumLanes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <p className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-300">Showing {shown.length} of {upcomingCurriculumItems.length} upcoming roadmap items</p>
        {shown.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {shown.map((item) => (
              <article key={item.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/75">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100">Upcoming</span>
                  <span className="mini-chip">{item.lane}</span>
                  <span className="mini-chip">{item.levels}</span>
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{item.provider}</p>
                <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">{item.summary}</p>
                <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                  <p className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-100"><BookOpenCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />Relevant content planned</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {item.topics.map((topic) => <li key={topic} className="text-sm leading-5 text-slate-700 dark:text-slate-200">• {topic}</li>)}
                  </ul>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
                  <p className="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><GraduationCap className="mt-1 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" /><span><strong className="text-slate-800 dark:text-white">Before release:</strong> {item.delivery}</span></p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-white/15 dark:bg-white/5">
            <p className="font-black">No upcoming items match this search.</p>
            <button type="button" className="action-secondary mt-4" onClick={() => { setQuery(""); setLane("All"); }}>Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="min-w-20 rounded-2xl border border-white/80 bg-white/80 px-3 py-3 dark:border-white/10 dark:bg-white/5"><dt className="text-2xl font-black text-slate-950 dark:text-white">{value}</dt><dd className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-300">{label}</dd></div>;
}
