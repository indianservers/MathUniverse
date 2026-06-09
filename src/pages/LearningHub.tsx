import { BookOpen, ClipboardList, ExternalLink, GraduationCap, Link as LinkIcon, Megaphone, Route, Search, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { assignmentTemplates, contentLibrary, LibraryItem } from "../data/contentLibrary";
import { learningFeatures } from "../data/mathCoverageBlueprint";
import { useProgress } from "../hooks/useProgress";

const kindLabels = ["all", "lesson", "worksheet", "activity", "assignment"] as const;
const gradeLabels = ["all", "Class 3-5", "Class 7-10", "Class 8-12", "Class 9-12"] as const;

export default function LearningHub() {
  const { getOverallProgress } = useProgress();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof kindLabels)[number]>("all");
  const [grade, setGrade] = useState<(typeof gradeLabels)[number]>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return contentLibrary.filter((item) => {
      const matchesQuery = !needle || [item.title, item.topic, item.summary, item.gradeBand, item.tags.join(" ")].join(" ").toLowerCase().includes(needle);
      const matchesKind = kind === "all" || item.kind === kind;
      const matchesGrade = grade === "all" || item.gradeBand === grade;
      return matchesQuery && matchesKind && matchesGrade;
    });
  }, [grade, kind, query]);

  const shareUrl = typeof window === "undefined" ? "/learn" : `${window.location.origin}/learn`;
  const heatmap = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("math-universe-quiz-heatmap") ?? "{}") as Record<string, number>;
    } catch {
      return {};
    }
  }, []);
  const heatmapDays = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(Date.now() - (34 - index) * 86400000).toISOString().slice(0, 10);
    return { date, value: heatmap[date] ?? 0 };
  });
  const bestScores = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("math-universe-quiz-best") ?? "{}") as Record<string, number>;
    } catch {
      return {};
    }
  }, []);
  const journey = buildJourney(bestScores);

  return (
    <div className="space-y-6">
      <TopicHeader title="Learning Hub" subtitle="Teacher mode, kid activities, searchable lessons, worksheets, assignments, grade mapping, and shareable lesson paths." difficulty="All levels" estimatedMinutes={30} progress={getOverallProgress()} />

      <section className="grid gap-4 md:grid-cols-3">
        <ModeCard title="Kid Mode" icon={<Sparkles className="h-5 w-5" />} text="Stories, badges, hints, read-aloud prompts, shape activities, and no-pressure practice." />
        <ModeCard title="Teacher Mode" icon={<GraduationCap className="h-5 w-5" />} text="Assignments, progress checks, lesson launch links, worksheet prompts, and classroom projection notes." />
        <ModeCard title="Mobile Mode" icon={<Megaphone className="h-5 w-5" />} text="Bottom quick actions, compact keyboards, large sliders, and touch-first geometry/3D controls." />
      </section>

      <SectionCard title="Progress Heatmap" description="Daily quiz activity stored locally in this browser.">
        <div className="grid grid-cols-7 gap-2">
          {heatmapDays.map((day) => (
            <div key={day.date} title={`${day.date}: ${day.value} quiz actions`} className={`aspect-square rounded-md border border-slate-200 dark:border-white/10 ${day.value === 0 ? "bg-slate-100 dark:bg-white/5" : day.value < 2 ? "bg-cyan-200 dark:bg-cyan-400/30" : day.value < 4 ? "bg-cyan-400" : "bg-cyan-700"}`} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Adaptive Chapter Journey" description="A BYJU'S-style learning layer that reads local practice signals and turns them into next actions.">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3 md:grid-cols-3">
            <JourneyColumn title="Strengths" items={journey.strengths} tone="emerald" empty="Score 80%+ in any quiz to unlock strengths." />
            <JourneyColumn title="Needs Practice" items={journey.practice} tone="amber" empty="Scores from 50-79% land here." />
            <JourneyColumn title="Gaps" items={journey.gaps} tone="rose" empty="Scores below 50% or untouched core topics land here." />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-500" />
              <h2 className="font-black">Recommended next step</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{journey.nextStep}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/quiz" className="action-primary"><Route className="h-4 w-4" />Adaptive quiz</Link>
              <Link to="/syllabus" className="action-secondary">Micro-lessons</Link>
              <Link to="/daily-challenge" className="action-secondary">Daily challenge</Link>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="BYJU'S-Style Learning Features" description="Feature coverage for journeys, games, feedback, mistake diagnosis, revision, and animated micro-lessons.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {learningFeatures.map((feature) => (
            <Link key={feature.id} to={feature.route} className="rounded-xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-black">{feature.title}</h2>
                <span className="mini-chip shrink-0">{feature.status}</span>
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{feature.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {feature.signals.slice(0, 3).map((signal) => <span key={signal} className="mini-chip">{signal}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Searchable Content Library" description="Filter lessons, worksheets, activities, and assignments by grade, topic, or tag.">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold"><Search className="h-4 w-4 text-cyan-500" />Search lessons</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base dark:border-white/10 dark:bg-slate-950" placeholder="graphing, worksheet, class 9, shapes..." />
          </label>
          <SelectFilter label="Type" value={kind} values={kindLabels} onChange={(value) => setKind(value as typeof kind)} />
          <SelectFilter label="Grade" value={grade} values={gradeLabels} onChange={(value) => setGrade(value as typeof grade)} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => <LibraryCard key={item.id} item={item} />)}
        </div>
      </SectionCard>

      <SectionCard title="Teacher Assignment Builder" description="Ready-made assignment patterns for inquiry, geometry, graphing, and symbolic math.">
        <div className="grid gap-4 lg:grid-cols-3">
          {assignmentTemplates.map((assignment) => (
            <div key={assignment.title} className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="mini-chip w-fit">{assignment.mode}</p>
              <h3 className="mt-3 text-lg font-black">{assignment.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{assignment.instructions}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {assignment.evidence.map((item) => <li key={item} className="rounded-xl bg-slate-100 p-2 font-semibold dark:bg-white/10">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 rounded-2xl bg-cyan-50 p-4 dark:bg-cyan-400/10">
          <div className="min-w-0 flex-1">
            <p className="font-bold">Shareable lesson hub</p>
            <p className="mt-1 break-all font-mono text-sm text-slate-600 dark:text-slate-300">{shareUrl}</p>
          </div>
          <button type="button" className="action-primary" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
            <LinkIcon className="h-4 w-4" />Copy link
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function ModeCard({ title, text, icon }: { title: string; text: string; icon: JSX.Element }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">{icon}</div>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function SelectFilter({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base capitalize dark:border-white/10 dark:bg-slate-950">
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

function JourneyColumn({ title, items, tone, empty }: { title: string; items: string[]; tone: "emerald" | "amber" | "rose"; empty: string }) {
  const colorClass = tone === "emerald" ? "text-emerald-700 dark:text-emerald-200" : tone === "amber" ? "text-amber-700 dark:text-amber-200" : "text-rose-700 dark:text-rose-200";
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className={`font-black ${colorClass}`}>{title}</h2>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => <div key={item} className="rounded-xl bg-slate-100 p-2 text-sm font-semibold dark:bg-white/10">{item}</div>) : <p className="text-sm leading-5 text-slate-500 dark:text-slate-400">{empty}</p>}
      </div>
    </div>
  );
}

function buildJourney(bestScores: Record<string, number>) {
  const entries = Object.entries(bestScores);
  const strengths = entries.filter(([, score]) => score >= 80).map(([topic]) => topic).slice(0, 4);
  const practice = entries.filter(([, score]) => score >= 50 && score < 80).map(([topic]) => topic).slice(0, 4);
  const gaps = entries.filter(([, score]) => score < 50).map(([topic]) => topic).slice(0, 4);
  const coreFallbacks = ["Number Systems", "Algebra", "Geometry", "Trigonometry"].filter((topic) => !entries.some(([name]) => name === topic));
  const visibleGaps = [...gaps, ...coreFallbacks].slice(0, 4);
  const nextStep = visibleGaps.length
    ? `Start with ${visibleGaps[0]}: open its micro-lesson, then take a short quiz and review mistakes immediately.`
    : practice.length
      ? `Push ${practice[0]} from practice into strength with a timed quiz and one visual lab.`
      : strengths.length
        ? `You have strong signals in ${strengths[0]}; move to the next linked challenge lane.`
        : "Begin with Number Systems, Algebra, Geometry, and Trigonometry to seed your journey map.";
  return { strengths, practice, gaps: visibleGaps, nextStep };
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const isExternal = /^https?:\/\//.test(item.route);
  const className = "action-primary mt-4 w-full";
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mini-chip capitalize">{item.kind}</span>
        <span className="mini-chip">{item.gradeBand}</span>
        <span className="mini-chip">{item.audience}</span>
      </div>
      <h3 className="mt-3 text-xl font-black">{item.title}</h3>
      <p className="mt-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">{item.topic} • {item.duration} min</p>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {item.outcomes.map((outcome) => <li key={outcome} className="flex gap-2"><ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />{outcome}</li>)}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">{tag}</span>)}
      </div>
      {isExternal ? (
        <a href={item.route} className={className} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />Launch</a>
      ) : (
        <Link to={item.route} className={className}><BookOpen className="h-4 w-4" />Open lesson</Link>
      )}
    </article>
  );
}
