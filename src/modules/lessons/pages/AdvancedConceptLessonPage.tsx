import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, ExternalLink, FlaskConical, ListChecks, Route, SearchCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { adjacentAdvancedConceptLessons, findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { adjacentLessonInPathway, pathwaysForAdvancedLesson } from "../catalog/advanced/advancedConceptPathways";
import AdvancedLessonInteractiveLab from "../components/AdvancedLessonInteractiveLab";
import AdvancedLessonMasteryPanel from "../components/AdvancedLessonMasteryPanel";

export default function AdvancedConceptLessonPage() {
  const { lessonSlug } = useParams();
  const lesson = findAdvancedConceptLesson(lessonSlug);
  if (!lesson) return <LessonNotFound />;
  const adjacent = adjacentAdvancedConceptLessons(lesson);
  const pathways = pathwaysForAdvancedLesson(lesson.id);

  return (
    <div className="space-y-4" data-testid="advanced-concept-lesson-page">
      <header className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Phase 1 - {lesson.strand}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{lesson.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.summary}</p>
          </div>
          <Link className="action-secondary" to="/lessons/advanced-concepts"><ArrowLeft className="h-4 w-4" />Advanced lessons</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label={`#${lesson.numericId}`} />
          <Chip label={`${lesson.estimatedMinutes} min`} />
          <Chip label={lesson.difficulty} />
          <Chip label={lesson.strand} />
        </div>
      </header>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-emerald-800 dark:text-emerald-100"><FlaskConical className="h-4 w-4" />Interactive studio</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900 dark:text-emerald-100">Use the companion tool first, then return here to formalize the vocabulary and exit checks.</p>
          </div>
          <Link className="action-primary" to={lesson.toolRoute}>Open studio <ExternalLink className="h-4 w-4" /></Link>
        </div>
      </section>

      <AdvancedLessonInteractiveLab lesson={lesson} />

      <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <LessonArc lessonTitle={lesson.title} strand={lesson.strand} />
          <Section icon={<BookOpen className="h-4 w-4" />} title="Learn" items={lesson.learn} />
          <Section icon={<Route className="h-4 w-4" />} title="Explore" items={lesson.explore} />
          <Section icon={<ListChecks className="h-4 w-4" />} title="Practice" items={lesson.practice} />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300"><ClipboardCheck className="h-4 w-4" />Objectives</h2>
            <ul className="mt-3 space-y-2">
              {lesson.objectives.map((objective) => <li key={objective} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{objective}</li>)}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">Search tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.searchKeywords.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{tag}</span>)}
            </div>
          </section>
          <AdvancedLessonMasteryPanel lesson={lesson} />
          {pathways.length ? (
            <section className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-300/20 dark:bg-violet-300/10">
              <h2 className="text-sm font-black uppercase text-violet-800 dark:text-violet-100">Pathway position</h2>
              <div className="mt-3 space-y-3">
                {pathways.map((pathway) => {
                  const pathwayAdjacent = adjacentLessonInPathway(pathway, lesson.id);
                  return (
                    <article key={pathway.id} className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
                      <h3 className="text-sm font-black">{pathway.title}</h3>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{pathway.outcome}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pathwayAdjacent.previous ? <Link className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black text-violet-800 dark:bg-violet-300/20 dark:text-violet-100" to={pathwayAdjacent.previous.route}>Previous</Link> : null}
                        {pathwayAdjacent.next ? <Link className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-black text-white" to={pathwayAdjacent.next.route}>Next: {pathwayAdjacent.next.title}</Link> : <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800 dark:bg-emerald-300/20 dark:text-emerald-100">Capstone ready</span>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
          <Section icon={<SearchCheck className="h-4 w-4" />} title="Assessment prompts" items={lesson.assessmentPrompts} />
        </aside>
      </main>

      {pathways.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h2 className="text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">Capstone prompts</h2>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {pathways.map((pathway) => (
              <article key={pathway.id} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                <h3 className="text-sm font-black">{pathway.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{pathway.capstonePrompt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="grid gap-3 sm:grid-cols-2" aria-label="Adjacent advanced lessons">
        {adjacent.previous ? <Link className="action-secondary justify-start" to={adjacent.previous.route}><ArrowLeft className="h-4 w-4" />{adjacent.previous.title}</Link> : <span />}
        {adjacent.next ? <Link className="action-secondary justify-end text-right" to={adjacent.next.route}>{adjacent.next.title}<ArrowRight className="h-4 w-4" /></Link> : <span />}
      </nav>
    </div>
  );
}

function Section({ icon, title, items }: { icon: JSX.Element; title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">{icon}{title}</h2>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{index + 1}</span><span>{item}</span></li>)}
      </ol>
    </section>
  );
}

function LessonArc({ lessonTitle, strand }: { lessonTitle: string; strand: string }) {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/20 dark:bg-violet-300/10">
      <h2 className="text-sm font-black uppercase text-violet-800 dark:text-violet-100">Lesson arc</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">Hook</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">Start with one surprising example from {lessonTitle}, then ask learners to predict the next value, shape, or exception.</p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">Worked connection</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">Tie the studio output to the formal language used in {strand}, keeping each symbol attached to a visible quantity.</p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">Exit check</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">Ask for one computation, one interpretation, and one limitation of what the visualization proves.</p>
        </article>
      </div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{label}</span>;
}

function LessonNotFound() {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-2xl font-black">Advanced lesson not found</h1><p className="mt-2 text-sm">This advanced concept lesson is not registered.</p><Link className="action-secondary mt-4" to="/lessons/advanced-concepts">Open advanced lessons</Link></div>;
}
