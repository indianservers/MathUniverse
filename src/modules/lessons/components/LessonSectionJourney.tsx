import { BookOpen, CheckCircle2, Dumbbell, Eye, EyeOff, Hash, Lightbulb, Sigma } from "lucide-react";
import { useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import MathExpression, { MathText } from "../../../components/ui/MathExpression";
import { getSupplementalNumericalExamples } from "../strengthening/catalogNumericalExamples";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import type { LessonDefinition } from "../types";

export type LessonSection = "interaction" | "learn" | "examples" | "formulas" | "practice";

export type LessonWorkedExample = {
  id: string;
  prompt: string;
  steps: string[];
  answer: string;
};

export type LessonTryItem = LessonWorkedExample & {
  hint?: string;
};

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

export function captureLessonTabClick(event: ReactMouseEvent<HTMLElement>, onSelect?: (section: LessonSection) => void) {
  const control = (event.target as HTMLElement).closest("button");
  if (!control || !control.closest("nav")) return;
  const section = lessonSectionForLabel(control.textContent ?? "");
  if (!section) return;
  event.preventDefault();
  if (onSelect) onSelect(section);
  else scrollToLessonSection(section);
}

export function lessonSectionForLabel(rawLabel: string): LessonSection | null {
  const label = rawLabel.replace(/\s+/g, " ").trim().replace(/^[^A-Za-z]+/, "");
  return sectionAliases.find(([pattern]) => pattern.test(label))?.[1] ?? null;
}

export function LessonIdBadge({ id }: { id: number }) {
  return (
    <span
      className="lesson-id-badge inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-black text-cyan-800 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100"
      aria-label={`Lesson ID ${id}`}
      data-testid="lesson-id-badge"
    >
      <Hash className="h-3.5 w-3.5" aria-hidden="true" />
      Lesson ID: {id}
    </span>
  );
}

export function LessonSectionNav({ active = "interaction", onChange, lessonId }: { active?: LessonSection; onChange?: (section: LessonSection) => void; lessonId?: number }) {
  const tabs: Array<{ id: LessonSection; label: string; icon: ReactNode }> = [
    { id: "interaction", label: "Interaction + visualization", icon: <Eye className="h-4 w-4" /> },
    { id: "learn", label: "Learn", icon: <BookOpen className="h-4 w-4" /> },
    { id: "examples", label: "Examples", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "formulas", label: "Formulas", icon: <Sigma className="h-4 w-4" /> },
    { id: "practice", label: "Know more", icon: <Dumbbell className="h-4 w-4" /> },
  ];
  return (
    <div className="lesson-section-toolbar flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <nav className="lesson-section-nav mobile-safe-scroll flex min-w-0 flex-1 gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm dark:border-white/10 dark:bg-slate-950/80" aria-label="Lesson sections" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange ? onChange(tab.id) : scrollToLessonSection(tab.id)}
            className={active === tab.id
              ? "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white shadow"
              : "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100"}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </nav>
      {lessonId !== undefined ? <LessonIdBadge id={lessonId} /> : null}
    </div>
  );
}

export function CoreLessonSections({ lesson, active }: { lesson: LessonDefinition; active?: LessonSection }) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  return <LessonSpecificSections lesson={lesson} strengthened={strengthened} active={active} />;
}

export function SchoolLessonSections({ lesson, active }: { lesson: SchoolSyllabusLesson; active?: LessonSection }) {
  const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
  if (strengthened) return <LessonSpecificSections strengthened={strengthened} active={active} />;
  return (
    <div className="space-y-4" data-testid="lesson-specific-sections">
      <JourneySection hidden={Boolean(active && active !== "learn")} id="learn" title={`Learn ${lesson.title}`} icon={<BookOpen className="h-4 w-4" />}>
        <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{lesson.content.summary}</p>
        <NumberedList items={lesson.content.learn} />
      </JourneySection>
      <JourneySection hidden={Boolean(active && active !== "examples")} id="examples" title={`${lesson.title} examples`} icon={<Lightbulb className="h-4 w-4" />}>
        <NumberedList items={lesson.content.explore} />
      </JourneySection>
      <JourneySection hidden={Boolean(active && active !== "formulas")} id="formulas" title={`${lesson.title} formulas and rules`} icon={<Sigma className="h-4 w-4" />}>
        <NumberedList items={[...lesson.content.learn.slice(0, 2), ...lesson.content.proofChecklist?.slice(0, 1) ?? []]} />
      </JourneySection>
      <JourneySection hidden={Boolean(active && active !== "practice")} id="practice" title={`Practice ${lesson.title}`} icon={<Dumbbell className="h-4 w-4" />}>
        <NumberedList items={[...lesson.content.practice, ...lesson.content.assessmentPrompts]} />
      </JourneySection>
    </div>
  );
}

function LessonSpecificSections({ lesson, strengthened, active }: { lesson?: LessonDefinition; strengthened: StrengthenedLesson | null; active?: LessonSection }) {
  const title = strengthened?.title ?? lesson!.title;
  const learn = strengthened
    ? [strengthened.introduction, strengthened.basicIdea, strengthened.howItWorks, strengthened.whyItWorks]
    : [lesson!.content.summary, lesson!.content.explanation, ...lesson!.content.keyIdeas];
  const realExamples = strengthened?.realLifeExamples.map((item) => `${item.context}: ${item.connection}`) ?? lesson!.content.realWorldExamples;
  const workedExamples = strengthened ? expandedWorkedExamples(strengthened) : [];
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
      <JourneySection hidden={Boolean(active && active !== "learn")} id="learn" title={`Learn ${title}`} icon={<BookOpen className="h-4 w-4" />}>
        {strengthened?.learningObjectives.length ? (
          <ContentGroup title="What you should be able to do" items={strengthened.learningObjectives} />
        ) : null}
        {strengthened?.prerequisites.length ? (
          <ContentGroup title="Before you start" items={strengthened.prerequisites} />
        ) : null}
        <NumberedList items={learn} />
        {strengthened?.keyVocabulary.length ? (
          <div>
            <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Key vocabulary</h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              {strengthened.keyVocabulary.map((item) => (
                <div key={item.term} className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
                  <dt className="text-sm font-black text-cyan-900 dark:text-cyan-100">{item.term}</dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200"><MathText value={item.meaning} /></dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        {strengthened?.misconceptions.map((misconception) => (
          <Callout key={misconception.code} label="Common mistake" text={`${misconception.mistake} ${misconception.correction}`} />
        ))}
      </JourneySection>

      <JourneySection hidden={Boolean(active && active !== "examples")} id="examples" title={`${title} examples`} icon={<Lightbulb className="h-4 w-4" />}>
        <StepByStepExamples lessonTitle={title} examples={workedExamples} />
        <h3 className="pt-2 text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Where {title} appears</h3>
        <NumberedList items={realExamples} />
      </JourneySection>

      <JourneySection hidden={Boolean(active && active !== "formulas")} id="formulas" title={`${title} formulas and rules`} icon={<Sigma className="h-4 w-4" />}>
        {formulas.map((formula) => (
          <article key={`${formula.label}-${formula.expression}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/10">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{formula.label}</h3>
            <div className="mt-2 overflow-x-auto rounded-lg bg-white px-3 py-2 dark:bg-slate-950"><MathExpression value={formula.expression} /></div>
            {"explanation" in formula ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formula.explanation}</p> : null}
            {"restrictions" in formula && formula.restrictions?.length ? <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-300">Conditions: {formula.restrictions.join("; ")}</p> : null}
          </article>
        ))}
        {definingRules.length ? <NumberedList items={definingRules} /> : null}
        {strengthened?.facts.length ? (
          <ContentGroup
            title="Essential facts"
            items={strengthened.facts.flatMap((fact) => [fact.statement, ...(fact.conditions ?? []).map((condition) => `Condition: ${condition}`)])}
          />
        ) : null}
        {strengthened?.conditionsAndRestrictions.length ? (
          <ContentGroup title="Conditions and edge cases" items={strengthened.conditionsAndRestrictions} />
        ) : null}
      </JourneySection>

      <JourneySection hidden={Boolean(active && active !== "practice")} id="practice" title={`Practice ${title}`} icon={<Dumbbell className="h-4 w-4" />}>
        {practice.length ? (
          <TryThese
            lessonTitle={title}
            items={practice.map((question) => ({
              id: question.id,
              prompt: question.prompt,
              hint: question.hints[0],
              steps: question.workedSolution,
              answer: question.answer,
            }))}
          />
        ) : <NumberedList items={fallbackPractice} />}
        {strengthened?.challenge ? <Callout label="Challenge" text={strengthened.challenge.prompt} /> : null}
        {strengthened?.exitCheck.length ? (
          <ContentGroup title="Exit check" items={strengthened.exitCheck.map((item) => `${item.prompt} Answer: ${item.answer}`)} />
        ) : null}
      </JourneySection>
    </div>
  );
}

export function StepByStepExamples({ lessonTitle, examples }: { lessonTitle: string; examples: LessonWorkedExample[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3" data-testid="step-by-step-examples">
      {examples.map((example, index) => (
        <article key={example.id} className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-300/20 dark:bg-amber-300/10">
          <div className="border-b border-amber-200 bg-amber-100/70 px-4 py-3 dark:border-amber-300/20 dark:bg-amber-300/10">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">{lessonTitle} · Example {index + 1}</p>
            <h3 className="mt-1 font-black leading-6 text-slate-900 dark:text-white"><MathText value={example.prompt} /></h3>
          </div>
          <ol className="space-y-3 p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
            {example.steps.map((step, stepIndex) => (
              <li key={`${stepIndex}-${step}`} className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white">{stepIndex + 1}</span>
                <MathText value={step} mathClassName="text-base" />
              </li>
            ))}
          </ol>
          <p className="m-4 mt-0 flex items-start gap-2 rounded-lg bg-white/80 p-3 text-sm font-black text-amber-900 dark:bg-slate-950/50 dark:text-amber-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Answer: <MathText value={example.answer} /></span>
          </p>
        </article>
      ))}
    </div>
  );
}

export function TryThese({ lessonTitle, items }: { lessonTitle: string; items: LessonTryItem[] }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-3" data-testid="try-these">
      <div>
        <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-100">Try these</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Solve each {lessonTitle} question first, then use Show answer to check every step.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item, index) => {
          const isRevealed = Boolean(revealed[item.id]);
          const answerId = `try-answer-${item.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return (
            <article key={item.id} className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">Try {index + 1} · {lessonTitle}</p>
              <h4 className="mt-2 font-black leading-6 text-slate-900 dark:text-white"><MathText value={item.prompt} /></h4>
              {item.hint ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><strong>Hint:</strong> {item.hint}</p> : null}
              <button
                type="button"
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                aria-expanded={isRevealed}
                aria-controls={answerId}
                onClick={() => setRevealed((current) => ({ ...current, [item.id]: !current[item.id] }))}
              >
                {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isRevealed ? "Hide answer" : "Show answer"}
              </button>
              {isRevealed ? (
                <div id={answerId} role="region" aria-label={`Answer to try ${index + 1}`} className="mt-3 space-y-2 rounded-lg border border-emerald-200 bg-white/90 p-3 text-sm leading-6 text-slate-700 dark:border-emerald-300/20 dark:bg-slate-950/60 dark:text-slate-200">
                  {item.steps.map((step, stepIndex) => <p key={`${stepIndex}-${step}`}><strong>Step {stepIndex + 1}:</strong> <MathText value={step} /></p>)}
                  <p className="font-black text-emerald-800 dark:text-emerald-100">Answer: <MathText value={item.answer} /></p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function expandedWorkedExamples(lesson: StrengthenedLesson): LessonWorkedExample[] {
  const candidates: LessonWorkedExample[] = getSupplementalNumericalExamples(lesson.id);
  const seenPrompts = new Set(candidates.map((example) => example.prompt.trim().toLowerCase()));
  for (const example of lesson.workedExamples) {
    const key = example.prompt.trim().toLowerCase();
    if (seenPrompts.has(key)) continue;
    seenPrompts.add(key);
    candidates.push(example);
  }
  const practiceOrder = ["direct", "multi_step", "transfer", "recognition", "error_diagnosis"];
  const additional = [...lesson.practice].sort((left, right) => practiceOrder.indexOf(left.difficulty) - practiceOrder.indexOf(right.difficulty));
  for (const question of additional) {
    const key = question.prompt.trim().toLowerCase();
    if (seenPrompts.has(key)) continue;
    seenPrompts.add(key);
    candidates.push({ id: `worked-${question.id}`, prompt: question.prompt, steps: question.workedSolution, answer: question.answer });
  }
  for (const application of lesson.realLifeExamples) {
    const prompt = `How does ${lesson.title} apply to ${application.context}?`;
    const key = prompt.toLowerCase();
    if (seenPrompts.has(key)) continue;
    seenPrompts.add(key);
    candidates.push({
      id: `worked-${application.id}`,
      prompt,
      steps: [
        `Identify the lesson connection: ${application.connection}`,
        `Apply the definition: ${lesson.definitions[0]?.statement ?? lesson.basicIdea}`,
        `Check the result with this fact: ${lesson.facts[0]?.statement ?? lesson.whyItWorks}`,
      ],
      answer: application.connection,
    });
  }
  const selected = candidates
    .map((example, sourceIndex) => ({ example, sourceIndex, numerical: isNumericalExample(example) }))
    .sort((left, right) => Number(right.numerical) - Number(left.numerical) || left.sourceIndex - right.sourceIndex)
    .filter(({ numerical }) => numerical)
    .slice(0, 3)
    .map(({ example }) => example);

  return completeNumericalExamples(lesson, selected, candidates);
}

const numericalTokenPattern = /[\d⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]|\\(?:frac|sqrt|sum|int|cdot|times|theta|pi|begin|displaystyle|Rightarrow)|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|half|third|quarter)\b/i;
const theoryPromptPattern = /^(?:how do|how does|what is|what are|give one|state one|explain|describe|use the worked example|what is wrong|why )/i;

export function isNumericalExample(example: LessonWorkedExample) {
  const prompt = example.prompt.trim();
  return !theoryPromptPattern.test(prompt) && numericalTokenPattern.test(prompt);
}

function completeNumericalExamples(
  lesson: StrengthenedLesson,
  selected: LessonWorkedExample[],
  candidates: LessonWorkedExample[],
) {
  if (selected.length >= 3) return selected;
  const source = selected[0] ?? candidates.find(hasNumericalContent) ?? candidates[0];
  if (!source) return selected;

  const evidence = [source.prompt, ...source.steps, source.answer].find((value) => numericalTokenPattern.test(value)) ?? "2 + 3 = 5";
  const numericResult = firstDecimal(source.answer) ?? firstDecimal(evidence) ?? 5;
  const verification: LessonWorkedExample = {
    id: `${lesson.id}-numerical-verification`,
    prompt: `Numerical verification for ${lesson.title}: using ${evidence}, confirm the result ${source.answer}.`,
    steps: [
      ...source.steps,
      String.raw`\displaystyle \text{verified numerical result}=${source.answer}`,
    ],
    answer: source.answer,
  };
  const reported = Number((numericResult + 1).toFixed(4));
  const errorCheck: LessonWorkedExample = {
    id: `${lesson.id}-numerical-error-check`,
    prompt: `For this ${lesson.title} case, the correct numerical value is ${numericResult}, but ${reported} was reported. Find the absolute error.`,
    steps: [
      String.raw`\displaystyle e=\left|\text{reported value}-\text{correct value}\right|`,
      String.raw`\displaystyle e=\left|${reported}-${numericResult}\right|`,
      String.raw`\displaystyle e=1`,
    ],
    answer: "1",
  };
  const numericalCase: LessonWorkedExample = {
    id: `${lesson.id}-numerical-case`,
    prompt: `${lesson.title} numerical case: calculate or verify ${evidence}`,
    steps: source.steps,
    answer: source.answer,
  };

  const additions = selected.length === 0
    ? [numericalCase, verification, errorCheck]
    : selected.length === 1
      ? [verification, errorCheck]
      : [errorCheck];
  return [...selected, ...additions].slice(0, 3);
}

function hasNumericalContent(example: LessonWorkedExample) {
  return numericalTokenPattern.test([example.prompt, ...example.steps, example.answer].join(" "));
}

function firstDecimal(value: string) {
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function JourneySection({ id, title, icon, children, hidden = false }: { id: Exclude<LessonSection, "interaction">; title: string; icon: ReactNode; children: ReactNode; hidden?: boolean }) {
  return (
    <section hidden={hidden} role="tabpanel" aria-hidden={hidden} id={`lesson-section-${id}`} className="scroll-mt-20 space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/80" aria-labelledby={`lesson-heading-${id}`}>
      <h2 id={`lesson-heading-${id}`} className="flex items-center gap-2 text-lg font-black text-cyan-700 dark:text-cyan-200">{icon}{title}</h2>
      {children}
    </section>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return <ol className="space-y-2">{items.filter(Boolean).map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-base leading-7 text-slate-700 dark:text-slate-200"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{index + 1}</span><MathText value={item} /></li>)}</ol>;
}

function ContentGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</h3>
      <NumberedList items={items} />
    </section>
  );
}

function Callout({ label, text }: { label: string; text: string }) {
  return <p className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 text-sm leading-6 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100"><strong>{label}:</strong> {text}</p>;
}
