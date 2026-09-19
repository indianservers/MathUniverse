import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, ExternalLink, FlaskConical, ListChecks, Route, SearchCheck } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { adjacentAdvancedConceptLessons, findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { adjacentLessonInPathway, pathwaysForAdvancedLesson } from "../catalog/advanced/advancedConceptPathways";
import AdvancedLessonInteractiveLab from "../components/AdvancedLessonInteractiveLab";
import AdvancedLessonMasteryPanel from "../components/AdvancedLessonMasteryPanel";
import PartialQuotientsTargetLesson2001 from "../schoolTargets/PartialQuotientsTargetLesson2001";
import ConvergentsTargetLesson2002 from "../schoolTargets/ConvergentsTargetLesson2002";
import EuclideanAlgorithmLinkTargetLesson2003 from "../schoolTargets/EuclideanAlgorithmLinkTargetLesson2003";
import BestRationalApproximationsTargetLesson2004 from "../schoolTargets/BestRationalApproximationsTargetLesson2004";
import PeriodicSquareRootsTargetLesson2005 from "../schoolTargets/PeriodicSquareRootsTargetLesson2005";
import CollatzConjectureTargetLesson2006 from "../schoolTargets/CollatzConjectureTargetLesson2006";
import GoldbachConjectureTargetLesson2007 from "../schoolTargets/GoldbachConjectureTargetLesson2007";
import RiemannHypothesisTargetLesson2008 from "../schoolTargets/RiemannHypothesisTargetLesson2008";
import FermatLastTheoremTargetLesson2009 from "../schoolTargets/FermatLastTheoremTargetLesson2009";
import FourColorTheoremTargetLesson2010 from "../schoolTargets/FourColorTheoremTargetLesson2010";
import ConfidenceIntervalsTargetLesson2011 from "../schoolTargets/ConfidenceIntervalsTargetLesson2011";
import MarginSampleSizeTargetLesson2012 from "../schoolTargets/MarginSampleSizeTargetLesson2012";
import HypothesisTestsTargetLesson2013 from "../schoolTargets/HypothesisTestsTargetLesson2013";
import PValuesTargetLesson2014 from "../schoolTargets/PValuesTargetLesson2014";
import TypeErrorsTargetLesson2015 from "../schoolTargets/TypeErrorsTargetLesson2015";
import SlopeFieldsTargetLesson2016 from "../schoolTargets/SlopeFieldsTargetLesson2016";
import EulerMethodTargetLesson2017 from "../schoolTargets/EulerMethodTargetLesson2017";
import GrowthDecayTargetLesson2018 from "../schoolTargets/GrowthDecayTargetLesson2018";
import LogisticTargetLesson2019 from "../schoolTargets/LogisticTargetLesson2019";
import OscillatorTargetLesson2020 from "../schoolTargets/OscillatorTargetLesson2020";
import GammaTargetLesson2021 from "../schoolTargets/GammaTargetLesson2021";
import BetaTargetLesson2022 from "../schoolTargets/BetaTargetLesson2022";
import ErrorFunctionTargetLesson2023 from "../schoolTargets/ErrorFunctionTargetLesson2023";
import ZetaTargetLesson2024 from "../schoolTargets/ZetaTargetLesson2024";
import BesselTargetLesson2025 from "../schoolTargets/BesselTargetLesson2025";
import { type LessonTryItem, type LessonWorkedExample } from "../components/LessonSectionJourney";
import DedicatedLessonTabHost from "../components/DedicatedLessonTabHost";
import LessonSimpleEnglishGuide from "../components/LessonSimpleEnglishGuide";
import { getSupplementalNumericalExamples } from "../strengthening/catalogNumericalExamples";

export default function AdvancedConceptLessonPage() {
  const { lessonSlug } = useParams();
  const lesson = findAdvancedConceptLesson(lessonSlug);
  if (!lesson) return <LessonNotFound />;
  const targetLesson = renderAdvancedTargetLesson(lesson);
  if (targetLesson) return <AdvancedTargetLessonShell lesson={lesson}>{targetLesson}</AdvancedTargetLessonShell>;
  const adjacent = adjacentAdvancedConceptLessons(lesson);
  const pathways = pathwaysForAdvancedLesson(lesson.id);

  return (
    <div
      className="space-y-4"
      data-testid="advanced-concept-lesson-page"
      data-lesson-viewport="advanced"
    >
      <header className="advanced-lesson-header rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Phase 1 - {lesson.strand}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{lesson.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.summary}</p>
          </div>
          <Link className="action-secondary" to="/lessons/advanced-concepts"><ArrowLeft className="h-4 w-4" />Advanced lessons</Link>
        </div>
        <div className="advanced-lesson-header-meta mt-4 flex flex-wrap gap-2">
          <Chip label={`Lesson ID: ${lesson.numericId}`} />
          <Chip label={`${lesson.estimatedMinutes} min`} />
          <Chip label={lesson.difficulty} />
          <Chip label={lesson.strand} />
        </div>
      </header>

      <LessonSimpleEnglishGuide
        lessonId={lesson.numericId}
        title={lesson.title}
        summary={[lesson.summary, lesson.learn[0]].filter(Boolean).join(" ")}
      />

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

function renderAdvancedTargetLesson(lesson: NonNullable<ReturnType<typeof findAdvancedConceptLesson>>) {
  switch (lesson.numericId) {
    case 2001: return <PartialQuotientsTargetLesson2001 lesson={lesson} />;
    case 2002: return <ConvergentsTargetLesson2002 lesson={lesson} />;
    case 2003: return <EuclideanAlgorithmLinkTargetLesson2003 lesson={lesson} />;
    case 2004: return <BestRationalApproximationsTargetLesson2004 lesson={lesson} />;
    case 2005: return <PeriodicSquareRootsTargetLesson2005 lesson={lesson} />;
    case 2006: return <CollatzConjectureTargetLesson2006 lesson={lesson} />;
    case 2007: return <GoldbachConjectureTargetLesson2007 lesson={lesson} />;
    case 2008: return <RiemannHypothesisTargetLesson2008 lesson={lesson} />;
    case 2009: return <FermatLastTheoremTargetLesson2009 lesson={lesson} />;
    case 2010: return <FourColorTheoremTargetLesson2010 lesson={lesson} />;
    case 2011: return <ConfidenceIntervalsTargetLesson2011 lesson={lesson} />;
    case 2012: return <MarginSampleSizeTargetLesson2012 lesson={lesson} />;
    case 2013: return <HypothesisTestsTargetLesson2013 lesson={lesson} />;
    case 2014: return <PValuesTargetLesson2014 lesson={lesson} />;
    case 2015: return <TypeErrorsTargetLesson2015 lesson={lesson} />;
    case 2016: return <SlopeFieldsTargetLesson2016 lesson={lesson} />;
    case 2017: return <EulerMethodTargetLesson2017 lesson={lesson} />;
    case 2018: return <GrowthDecayTargetLesson2018 lesson={lesson} />;
    case 2019: return <LogisticTargetLesson2019 lesson={lesson} />;
    case 2020: return <OscillatorTargetLesson2020 lesson={lesson} />;
    case 2021: return <GammaTargetLesson2021 lesson={lesson} />;
    case 2022: return <BetaTargetLesson2022 lesson={lesson} />;
    case 2023: return <ErrorFunctionTargetLesson2023 lesson={lesson} />;
    case 2024: return <ZetaTargetLesson2024 lesson={lesson} />;
    case 2025: return <BesselTargetLesson2025 lesson={lesson} />;
    default: return null;
  }
}

function AdvancedTargetLessonShell({ lesson, children }: { lesson: NonNullable<ReturnType<typeof findAdvancedConceptLesson>>; children: ReactNode }) {
  return (
    <DedicatedLessonTabHost
      className="lesson-page-target"
      testId="advanced-concept-lesson-page"
    >
      <div data-advanced-target-shell={lesson.numericId}>{children}</div>
    </DedicatedLessonTabHost>
  );
}

export function advancedStepExamples(lesson: NonNullable<ReturnType<typeof findAdvancedConceptLesson>>): LessonWorkedExample[] {
  const numericalExamples = getSupplementalNumericalExamples(lesson.numericId);
  if (numericalExamples.length >= 3) return numericalExamples.slice(0, 3);

  return lesson.explore.slice(0, 3).map((prompt, index) => ({
    id: `${lesson.id}-example-${index + 1}`,
    prompt,
    steps: [
      `Set the goal: ${lesson.objectives[index % lesson.objectives.length]}`,
      `Apply this ${lesson.title} principle: ${lesson.learn[index % lesson.learn.length]}`,
      `Verify the result by answering: ${lesson.assessmentPrompts[index % lesson.assessmentPrompts.length]}`,
    ],
    answer: `A complete response should demonstrate that ${lesson.learn[index % lesson.learn.length]}`,
  }));
}

export function advancedTryItems(lesson: NonNullable<ReturnType<typeof findAdvancedConceptLesson>>): LessonTryItem[] {
  return lesson.practice.map((prompt, index) => ({
    id: `${lesson.id}-try-${index + 1}`,
    prompt,
    hint: lesson.objectives[index % lesson.objectives.length],
    steps: [
      `Use the ${lesson.title} idea: ${lesson.learn[index % lesson.learn.length]}`,
      `Check the explanation against this question: ${lesson.assessmentPrompts[index % lesson.assessmentPrompts.length]}`,
    ],
    answer: `Model answer: ${lesson.learn[index % lesson.learn.length]}`,
  }));
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
