import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  Route,
  SearchCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  adjacentSchoolLessons,
  findSchoolLesson,
} from "../catalog/school/schoolSyllabusCatalog";
import SchoolLessonInteractiveLab from "../components/SchoolLessonInteractiveLab";
import { DecimalExpansionLessonPage } from "../decimalExpansion/DecimalExpansionLessonPage";
import PlaceValueTargetLesson10001 from "../schoolTargets/PlaceValueTargetLesson10001";
import NumberNamingTargetLesson10002 from "../schoolTargets/NumberNamingTargetLesson10002";
import EstimationRoundingTargetLesson10003 from "../schoolTargets/EstimationRoundingTargetLesson10003";
import ErrorBoundsTargetLesson10004 from "../schoolTargets/ErrorBoundsTargetLesson10004";
import MixedUnitsTargetLesson10005 from "../schoolTargets/MixedUnitsTargetLesson10005";
import PictographTargetLesson10006 from "../schoolTargets/PictographTargetLesson10006";
import BarGraphTargetLesson10007 from "../schoolTargets/BarGraphTargetLesson10007";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { SchoolLessonContent } from "../syllabus/lessonSyllabusTypes";

const DECIMAL_EXPANSION_ROUTE_SLUG =
  "class-9-real-numbers-decimal-expansion-of-rational-numbers";

export default function SchoolLessonPage() {
  const { levelSlug: routeLevelSlug, lessonSlug } = useParams();
  const lesson = findSchoolLesson(routeLevelSlug, lessonSlug);
  if (!lesson) return <LessonNotFound />;
  if (lesson.slug === DECIMAL_EXPANSION_ROUTE_SLUG)
    return <DecimalExpansionLessonPage lesson={lesson} />;
  if (lesson.numericId === 10001)
    return <PlaceValueTargetLesson10001 lesson={lesson} />;
  if (lesson.numericId === 10002)
    return <NumberNamingTargetLesson10002 lesson={lesson} />;
  if (lesson.numericId === 10003)
    return <EstimationRoundingTargetLesson10003 lesson={lesson} />;
  if (lesson.numericId === 10004)
    return <ErrorBoundsTargetLesson10004 lesson={lesson} />;
  if (lesson.numericId === 10005)
    return <MixedUnitsTargetLesson10005 lesson={lesson} />;
  if (lesson.numericId === 10006)
    return <PictographTargetLesson10006 lesson={lesson} />;
  if (lesson.numericId === 10007)
    return <BarGraphTargetLesson10007 lesson={lesson} />;
  const adjacent = adjacentSchoolLessons(lesson);
  const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
  const content = strengthened
    ? strengthenedSchoolContent(strengthened)
    : lesson.content;
  const objectives =
    strengthened?.learningObjectives ?? lesson.metadata.learningObjectives;

  return (
    <div className="space-y-4" data-testid="school-lesson-page">
      <header className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
              {lesson.metadata.academicLevel} - {lesson.metadata.conceptFamily}
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              {lesson.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {content.summary}
            </p>
          </div>
          <Link className="action-secondary" to="/lessons/school">
            <ArrowLeft className="h-4 w-4" />
            School lessons
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label={`${lesson.metadata.estimatedMinutes} min`} />
          <Chip label={lesson.metadata.difficulty} />
          <Chip label={lesson.metadata.lessonType} />
          {lesson.metadata.engineDependencies?.map((engine) => (
            <Chip key={engine} label={engine} />
          ))}
        </div>
      </header>

      <SchoolLessonInteractiveLab lesson={lesson} />

      <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <QualitySection
            lessonTitle={lesson.title}
            family={lesson.metadata.conceptFamily}
          />
          <Section
            icon={<BookOpen className="h-4 w-4" />}
            title="Learn"
            items={content.learn}
          />
          <Section
            icon={<Route className="h-4 w-4" />}
            title="Explore"
            items={content.explore}
          />
          <Section
            icon={<ListChecks className="h-4 w-4" />}
            title="Practice"
            items={content.practice}
          />
          {content.proofChecklist ? (
            <Section
              icon={<SearchCheck className="h-4 w-4" />}
              title="Proof checklist"
              items={content.proofChecklist}
            />
          ) : null}
          {content.constructionChecklist ? (
            <Section
              icon={<SearchCheck className="h-4 w-4" />}
              title="Construction checklist"
              items={content.constructionChecklist}
            />
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
              <ClipboardCheck className="h-4 w-4" />
              Objectives
            </h2>
            <ul className="mt-3 space-y-2">
              {objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
              Syllabus tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.metadata.syllabusTags.map((tag) => (
                <span
                  key={`${tag.board}-${tag.level}`}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300"
                >
                  {tag.board}
                </span>
              ))}
            </div>
          </section>
          <Section
            icon={<ClipboardCheck className="h-4 w-4" />}
            title="Assessment prompts"
            items={content.assessmentPrompts}
          />
        </aside>
      </main>

      <nav
        className="grid gap-3 sm:grid-cols-2"
        aria-label="Adjacent school lessons"
      >
        {adjacent.previous ? (
          <Link
            className="action-secondary justify-start"
            to={adjacent.previous.route}
          >
            <ArrowLeft className="h-4 w-4" />
            {adjacent.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link
            className="action-secondary justify-end text-right"
            to={adjacent.next.route}
          >
            {adjacent.next.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function strengthenedSchoolContent(
  lesson: NonNullable<ReturnType<typeof getStrengthenedFoundationLesson>>,
): SchoolLessonContent {
  return {
    summary: lesson.introduction,
    learn: [
      lesson.basicIdea,
      lesson.howItWorks,
      `Common mistake: ${lesson.misconceptions[0].mistake} Correction: ${lesson.misconceptions[0].correction}`,
    ],
    explore: lesson.guidedExploration.map((step) => step.prompt),
    practice: lesson.practice.slice(1, 4).map((item) => item.prompt),
    assessmentPrompts: [
      lesson.challenge.prompt,
      ...lesson.exitCheck.map((item) => item.prompt),
      `Give one real-life use: ${lesson.realLifeExamples[0].context}.`,
    ],
    proofChecklist:
      lesson.lessonType === "proof"
        ? [
            "Write the given statement clearly.",
            "Name the accepted definition, axiom, postulate, or theorem used.",
            "Give a reason for each step.",
            "Check that the conclusion proves exactly what was asked.",
          ]
        : undefined,
    constructionChecklist:
      lesson.topic.includes("Geometry") && lesson.lessonType === "procedure"
        ? [
            "Draw the given object first.",
            "Keep compass width fixed when equal lengths are needed.",
            "Mark intersection points clearly.",
            "Check the required equal length, angle, or parallel condition.",
          ]
        : undefined,
  };
}

function Section({
  icon,
  title,
  items,
}: {
  icon: JSX.Element;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
        {icon}
        {title}
      </h2>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QualitySection({
  lessonTitle,
  family,
}: {
  lessonTitle: string;
  family: string;
}) {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/20 dark:bg-violet-300/10">
      <h2 className="text-sm font-black uppercase text-violet-800 dark:text-violet-100">
        Lesson arc
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Hook
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Start with a prediction about {lessonTitle}, then change one input
            in the lab and name what stayed fixed.
          </p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Worked connection
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Connect the visual pattern to the formula, diagram, table, or proof
            language used in {family}.
          </p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Exit check
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Ask for one correct example, one non-example, and one sentence
            explaining why the method works.
          </p>
        </article>
      </div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">
      {label}
    </span>
  );
}

function LessonNotFound() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
      <h1 className="text-2xl font-black">School lesson not found</h1>
      <p className="mt-2 text-sm">
        This generated school lesson is not registered.
      </p>
      <Link className="action-secondary mt-4" to="/lessons/school">
        Open school lessons
      </Link>
    </div>
  );
}
