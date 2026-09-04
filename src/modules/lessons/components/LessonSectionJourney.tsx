import { BookOpen, Dumbbell, Eye, Lightbulb, Sigma } from "lucide-react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import type { LessonDefinition } from "../types";

export type LessonSection = "interaction" | "learn" | "examples" | "formulas" | "practice";

const sectionAliases: Array<[RegExp, LessonSection]> = [
  [/^(interact|interaction|explore|construction)\b/i, "interaction"],
  [/^(learn|explain)\b/i, "learn"],
  [/^(example|examples|worked example|worked examples)\b/i, "examples"],
  [/^(formula|formulas|formula & rules|rules)\b/i, "formulas"],
  [/^(practice|know more|summary)\b/i, "practice"],
];

export function scrollToLessonSection(section: LessonSection) {
  window.requestAnimationFrame(() => {
    document.getElementById(`lesson-section-${section}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function captureLessonTabClick(event: ReactMouseEvent<HTMLElement>) {
  const control = (event.target as HTMLElement).closest("button");
  if (!control || !control.closest("nav")) return;
  const section = lessonSectionForLabel(control.textContent ?? "");
  if (!section) return;
  event.preventDefault();
  event.stopPropagation();
  scrollToLessonSection(section);
}

export function lessonSectionForLabel(rawLabel: string): LessonSection | null {
  const label = rawLabel.replace(/\s+/g, " ").trim().replace(/^[^A-Za-z]+/, "");
  return sectionAliases.find(([pattern]) => pattern.test(label))?.[1] ?? null;
}

export function LessonSectionNav({ active = "interaction" }: { active?: LessonSection }) {
  const tabs: Array<{ id: LessonSection; label: string; icon: ReactNode }> = [
    { id: "interaction", label: "Interaction + visualization", icon: <Eye className="h-4 w-4" /> },
    { id: "learn", label: "Learn", icon: <BookOpen className="h-4 w-4" /> },
    { id: "examples", label: "Examples", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "formulas", label: "Formulas", icon: <Sigma className="h-4 w-4" /> },
    { id: "practice", label: "Practice", icon: <Dumbbell className="h-4 w-4" /> },
  ];
  return (
    <nav className="mobile-safe-scroll flex gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm dark:border-white/10 dark:bg-slate-950/80" aria-label="Lesson sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-current={active === tab.id ? "location" : undefined}
          onClick={() => scrollToLessonSection(tab.id)}
          className={active === tab.id
            ? "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white shadow"
            : "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100"}
        >
          {tab.icon}{tab.label}
        </button>
      ))}
    </nav>
  );
}

export function CoreLessonSections({ lesson }: { lesson: LessonDefinition }) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  return <LessonSpecificSections lesson={lesson} strengthened={strengthened} />;
}

export function SchoolLessonSections({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
  if (strengthened) return <LessonSpecificSections strengthened={strengthened} />;
  return (
    <div className="space-y-4" data-testid="lesson-specific-sections">
      <JourneySection id="learn" title={`Learn ${lesson.title}`} icon={<BookOpen className="h-4 w-4" />}>
        <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{lesson.content.summary}</p>
        <NumberedList items={lesson.content.learn} />
      </JourneySection>
      <JourneySection id="examples" title={`${lesson.title} examples`} icon={<Lightbulb className="h-4 w-4" />}>
        <NumberedList items={lesson.content.explore} />
      </JourneySection>
      <JourneySection id="formulas" title={`${lesson.title} formulas and rules`} icon={<Sigma className="h-4 w-4" />}>
        <NumberedList items={[...lesson.content.learn.slice(0, 2), ...lesson.content.proofChecklist?.slice(0, 1) ?? []]} />
      </JourneySection>
      <JourneySection id="practice" title={`Practice ${lesson.title}`} icon={<Dumbbell className="h-4 w-4" />}>
        <NumberedList items={[...lesson.content.practice, ...lesson.content.assessmentPrompts]} />
      </JourneySection>
    </div>
  );
}

function LessonSpecificSections({ lesson, strengthened }: { lesson?: LessonDefinition; strengthened: StrengthenedLesson | null }) {
  const title = strengthened?.title ?? lesson!.title;
  const learn = strengthened
    ? [strengthened.introduction, strengthened.basicIdea, strengthened.howItWorks, strengthened.whyItWorks]
    : [lesson!.content.summary, lesson!.content.explanation, ...lesson!.content.keyIdeas];
  const realExamples = strengthened?.realLifeExamples.map((item) => `${item.context}: ${item.connection}`) ?? lesson!.content.realWorldExamples;
  const workedExamples = strengthened?.workedExamples ?? [];
  const formulas = strengthened?.formulas ?? lesson!.content.formulas;
  const definingRules = strengthened && !formulas.length
    ? [...strengthened.definitions.map((item) => item.statement), ...strengthened.facts.map((item) => item.statement)].slice(0, 4)
    : [];
  const practice = strengthened?.practice ?? [];
  const fallbackPractice = lesson ? [
    `Explain ${lesson.title} using ${lesson.contract.requiredRepresentations.join(", ")}.`,
    `Use ${lesson.contract.requiredControlIds.join(", ")} and record how ${lesson.contract.observableOutputs.join(", ")} changes.`,
    `Apply ${lesson.content.formulas[0]?.label ?? lesson.title} to this lesson's worked connection: ${lesson.content.workedConnection}`,
  ] : [];

  return (
    <div className="space-y-4" data-testid="lesson-specific-sections">
      <JourneySection id="learn" title={`Learn ${title}`} icon={<BookOpen className="h-4 w-4" />}>
        <NumberedList items={learn} />
        {strengthened?.misconceptions[0] ? <Callout label="Common mistake" text={`${strengthened.misconceptions[0].mistake} ${strengthened.misconceptions[0].correction}`} /> : null}
      </JourneySection>

      <JourneySection id="examples" title={`${title} examples`} icon={<Lightbulb className="h-4 w-4" />}>
        {workedExamples.map((example, index) => (
          <article key={example.id} className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-300/20 dark:bg-amber-300/10">
            <h3 className="font-black text-slate-900 dark:text-white">Worked example {index + 1}: {example.prompt}</h3>
            <ol className="mt-2 space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {example.steps.map((step, stepIndex) => <li key={step}><strong>Step {stepIndex + 1}:</strong> {step}</li>)}
            </ol>
            <p className="mt-2 font-black text-amber-900 dark:text-amber-100">Answer: {example.answer}</p>
          </article>
        ))}
        <NumberedList items={realExamples} />
      </JourneySection>

      <JourneySection id="formulas" title={`${title} formulas and rules`} icon={<Sigma className="h-4 w-4" />}>
        {formulas.map((formula) => (
          <article key={`${formula.label}-${formula.expression}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/10">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{formula.label}</h3>
            <div className="mt-2 overflow-x-auto rounded-lg bg-white px-3 py-2 dark:bg-slate-950"><MathExpression value={formula.expression} /></div>
            {"explanation" in formula ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formula.explanation}</p> : null}
            {"restrictions" in formula && formula.restrictions?.length ? <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-300">Conditions: {formula.restrictions.join("; ")}</p> : null}
          </article>
        ))}
        {definingRules.length ? <NumberedList items={definingRules} /> : null}
      </JourneySection>

      <JourneySection id="practice" title={`Practice ${title}`} icon={<Dumbbell className="h-4 w-4" />}>
        {practice.length ? practice.map((question, index) => (
          <details key={question.id} className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
            <summary className="cursor-pointer font-black text-slate-900 dark:text-white">Question {index + 1}: {question.prompt}</summary>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {question.hints[0] ? <p><strong>Hint:</strong> {question.hints[0]}</p> : null}
              {question.workedSolution.map((step, stepIndex) => <p key={step}><strong>Step {stepIndex + 1}:</strong> {step}</p>)}
              <p className="font-black text-emerald-900 dark:text-emerald-100">Answer: {question.answer}</p>
            </div>
          </details>
        )) : <NumberedList items={fallbackPractice} />}
        {strengthened?.challenge ? <Callout label="Challenge" text={strengthened.challenge.prompt} /> : null}
      </JourneySection>
    </div>
  );
}

function JourneySection({ id, title, icon, children }: { id: Exclude<LessonSection, "interaction">; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section id={`lesson-section-${id}`} className="scroll-mt-20 space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/80" aria-labelledby={`lesson-heading-${id}`}>
      <h2 id={`lesson-heading-${id}`} className="flex items-center gap-2 text-lg font-black text-cyan-700 dark:text-cyan-200">{icon}{title}</h2>
      {children}
    </section>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return <ol className="space-y-2">{items.filter(Boolean).map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{index + 1}</span><span>{item}</span></li>)}</ol>;
}

function Callout({ label, text }: { label: string; text: string }) {
  return <p className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-sm leading-6 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100"><strong>{label}:</strong> {text}</p>;
}
