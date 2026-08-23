import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import AnimationControlsLessonAdapter from "./AnimationControlsLessonAdapter";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type { LessonAdapterProps, LessonDefinition } from "../types";

const viewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };

export default function AlgebraLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.categorySlug === "core-workspaces" && lesson.id === 24) {
    return <AnimationControlsLessonAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "core-workspaces" && lesson.id >= 19 && lesson.id <= 38) {
    return <CoreWorkspaceAlgebraAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "algebra" && lesson.id >= 92 && lesson.id <= 128) {
    return <AlgebraConceptWorkspace lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  return <GenericAlgebraLessonAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

export function AlgebraConceptWorkspace({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  const workspace = algebraConceptWorkspaceFor(lesson, strengthened);
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(workspace.initialValue);

  useEffect(() => {
    setStep(0);
    setValue(workspace.initialValue);
  }, [resetToken, workspace.initialValue]);

  const selectStep = (nextStep: number) => {
    const before = step;
    setStep(nextStep);
    onInteraction(createLessonInteractionEvent({ controlId: "algebra-concept-step", kind: "selection", before, after: nextStep, affectedOutputs: ["algebra-structure-trace", "algebra-worked-step"] }));
  };

  const changeValue = (nextValue: number) => {
    const before = value;
    setValue(nextValue);
    onInteraction(createLessonInteractionEvent({ controlId: "algebra-concept-value", kind: "slider", before, after: nextValue, affectedOutputs: ["algebra-structure-trace", "algebra-sample-output"] }));
  };

  return (
    <AdapterFrame title={`${lesson.title} algebra workspace`} value={workspace.valueLabel(value)} footer={workspace.footer}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/60 to-cyan-50 p-4 dark:border-violet-300/20 dark:from-slate-950 dark:via-violet-300/10 dark:to-cyan-300/10" aria-label={`${lesson.title} lesson-specific algebra workspace`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">{workspace.representation}</p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{workspace.heading}</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-100">{workspace.badge}</span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,1.15fr)]">
            <div className="grid gap-2">
              {workspace.objects.map((object) => (
                <article key={object.label} className="rounded-xl border border-slate-200 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/55">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{object.label}</p>
                  <strong className="mt-1 block font-mono text-lg text-slate-950 dark:text-white">{object.value(value)}</strong>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{object.note}</p>
                </article>
              ))}
            </div>
            <div className="rounded-2xl border border-dashed border-violet-200 bg-white/80 p-3 dark:border-violet-300/20 dark:bg-slate-950/50">
              <p className="text-sm font-black text-slate-900 dark:text-white">Worked structure</p>
              <ol className="mt-3 space-y-2">
                {workspace.steps.map((item, index) => (
                  <li key={item} className={step === index ? "rounded-xl border-2 border-violet-400 bg-violet-50 p-3 text-sm font-bold leading-6 text-violet-950 dark:bg-violet-300/10 dark:text-violet-100" : "rounded-xl border border-slate-200 bg-white/75 p-3 text-sm font-semibold leading-6 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300"}>
                    <button type="button" className="w-full text-left" onClick={() => selectStep(index)}><strong>Step {index + 1}:</strong> {item}</button>
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded-xl bg-violet-100/70 p-3 text-sm font-black leading-6 text-violet-950 dark:bg-violet-300/10 dark:text-violet-100">{workspace.answer}</p>
            </div>
          </div>
        </section>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{workspace.guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{workspace.guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{workspace.guidance[2]}</p>
          </div>
          <SliderGroup title="Test the structure">
            <SliderControl density="compact" label={workspace.sliderLabel} value={value} min={workspace.min} max={workspace.max} step={workspace.step} onChange={changeValue} />
          </SliderGroup>
          <section className="rounded-2xl border border-violet-100 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70" aria-label={`${lesson.title} concept trace`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-violet-700 dark:text-violet-200">Concept trace</p>
            <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{workspace.traceTitle}</h3>
            <div className="mt-3 grid gap-2">
              {workspace.traceRows.map((row) => (
                <div key={row.label} className="rounded-xl bg-slate-50 p-2 dark:bg-white/10">
                  <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">{row.label}</span><strong className="max-w-[150px] truncate font-mono text-sm">{row.value(value)}</strong></div>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-xl bg-violet-50 p-2 text-xs font-black leading-5 text-violet-950 dark:bg-violet-300/10 dark:text-violet-100">{workspace.validity}</p>
          </section>
        </div>
      </div>
    </AdapterFrame>
  );
}

type AlgebraConceptWorkspaceSpec = {
  heading: string;
  badge: string;
  representation: string;
  footer: string;
  guidance: [string, string, string];
  sliderLabel: string;
  initialValue: number;
  min: number;
  max: number;
  step: number;
  valueLabel: (value: number) => string;
  objects: Array<{ label: string; value: (value: number) => string; note: string }>;
  steps: string[];
  answer: string;
  traceTitle: string;
  traceRows: Array<{ label: string; value: (value: number) => string; note: string }>;
  validity: string;
};

function AlgebraConceptWorkspaceForFallback(lesson: LessonDefinition): StrengthenedLesson {
  return {
    id: lesson.id,
    title: lesson.title,
    route: lesson.route,
    category: lesson.category,
    topic: lesson.topic,
    lessonType: "concept",
    learningObjectives: [lesson.outcome],
    prerequisites: ["Variables", "Expressions"],
    keyVocabulary: [{ term: lesson.title, meaning: lesson.description }],
    introduction: lesson.purpose,
    basicIdea: lesson.description,
    howItWorks: lesson.interactions,
    whyItWorks: lesson.outcome,
    definitions: [{ id: `${lesson.slug}-definition`, statement: lesson.description }],
    facts: [{ id: `${lesson.slug}-fact`, statement: lesson.outcome }],
    formulas: [],
    conditionsAndRestrictions: ["Use valid algebraic steps."],
    representations: [{ id: `${lesson.slug}-representation`, type: "symbolic_steps", learningPurpose: `Show the exact algebraic structure used in ${lesson.title}.` }],
    workedExamples: [{ id: `${lesson.slug}-worked`, prompt: lesson.title, steps: [lesson.description], answer: lesson.outcome }],
    realLifeExamples: [],
    misconceptions: [{ code: "GENERIC_ALGEBRA", mistake: "Using a generic graph without checking the algebraic object.", correction: "Use the representation that matches the algebraic structure." }],
    interaction: { id: `${lesson.slug}-interaction`, learningPurpose: lesson.outcome, parameters: [], initialState: lesson.description, dynamicFeedback: lesson.outcome, successCriteria: [lesson.outcome], accessibilityAlternative: "Read the symbolic steps as text." },
    guidedExploration: [],
    practice: [],
    challenge: { id: `${lesson.slug}-challenge`, prompt: lesson.outcome, successCriteria: [lesson.outcome], hints: [lesson.description] },
    exitCheck: [],
    accessibilityNotes: [],
    expertReviewRequired: false,
  };
}

function algebraConceptWorkspaceFor(lesson: LessonDefinition, strengthened: StrengthenedLesson | null): AlgebraConceptWorkspaceSpec {
  const source = strengthened ?? AlgebraConceptWorkspaceForFallback(lesson);
  const representation = source.representations[0]?.type ?? "symbolic_steps";
  const worked = source.workedExamples[0];
  const formula = source.formulas[0];
  const misconception = source.misconceptions[0];
  const family = algebraFamilyFor(lesson.id, representation);
  const initialValue = lesson.id % 6 + 1;
  return {
    heading: `${lesson.title} structure lab`,
    badge: family.badge,
    representation: representation.replace(/_/g, " "),
    footer: "This algebra page uses a lesson-specific symbolic workspace instead of a default line graph.",
    guidance: [family.rule, source.howItWorks, misconception?.correction ?? source.whyItWorks],
    sliderLabel: family.sliderLabel,
    initialValue,
    min: -6,
    max: 8,
    step: 1,
    valueLabel: (value) => family.valueLabel(lesson, value),
    objects: [
      { label: "Object", value: () => family.objectValue(lesson), note: source.definitions[0]?.statement ?? lesson.description },
      { label: "Rule", value: () => formula?.expression ?? family.ruleExpression, note: formula?.label ?? family.rule },
      { label: "Test value", value: (value) => `x=${value}`, note: "Substitute a value to check whether the algebraic structure behaves as expected." },
      { label: "Warning", value: () => misconception?.code ?? "CHECK_STEPS", note: misconception?.mistake ?? "Do not use a generic representation when the algebra object is symbolic." },
    ],
    steps: worked?.steps.length ? worked.steps : [source.basicIdea, source.howItWorks, source.whyItWorks],
    answer: `Answer: ${worked?.answer ?? source.challenge.prompt}`,
    traceTitle: `${lesson.title} concept trace`,
    traceRows: family.traceRows(source, valueSafeExpression(formula?.expression)),
    validity: `${lesson.title} needs ${representation.replace(/_/g, " ")} because ${source.representations[0]?.learningPurpose ?? source.whyItWorks}`,
  };
}

function algebraFamilyFor(lessonId: number, representation: string) {
  if ([92, 96].includes(lessonId) || representation === "algebra_tiles") {
    return algebraFamily("Tile/area model", "tile pieces", "Tile count", "x tiles and unit tiles", (lesson, value) => `${value}x + ${value + 2}`, [
      ["Tiles", () => "x, 1, x^2", "Each tile shape represents a different algebraic term."],
      ["Combine", (expression) => expression, "Only matching variable parts can be combined."],
      ["Check", () => "expand back", "The area or tile layout must rebuild the original expression."],
    ]);
  }
  if ([103, 128].includes(lessonId) || representation === "table") {
    return algebraFamily("Table/check model", "rows", "Test input", "coefficient table", (_lesson, value) => `row x=${value}`, [
      ["Input row", () => "x, f(x)", "A table tests values without pretending every lesson is one line graph."],
      ["Residual", () => "left - right", "Numerical and division checks need the leftover error visible."],
      ["Decision", () => "checked", "The answer is accepted only after the table check works."],
    ]);
  }
  if ([120].includes(lessonId) || representation === "unit_circle") {
    return algebraFamily("Unit-circle equation", "angle set", "Angle", "sin(theta)=value", (_lesson, value) => `${value * 30} degrees`, [
      ["Reference angle", () => "30 degrees", "Trig equations need quadrant checks."],
      ["Period", () => "360 degrees", "Repeated angles can create more solutions."],
      ["Solutions", () => "30, 150", "One calculator angle is not the full equation answer."],
    ]);
  }
  if ([121, 122, 123].includes(lessonId) || representation === "number_line") {
    return algebraFamily("Number-line solution set", "interval", "Boundary", "solution interval", (_lesson, value) => `boundary ${value}`, [
      ["Boundary", () => "open/closed", "Endpoint circles depend on the inequality sign."],
      ["Direction", () => "left/right/between", "A solution set usually contains many values."],
      ["Check", () => "test point", "Substitute a point from the shaded region."],
    ]);
  }
  if ([124, 125].includes(lessonId) || representation === "function_graph") {
    return algebraFamily("Graph sign structure", "roots/intervals", "Root test", "roots split intervals", (_lesson, value) => `test x=${value}`, [
      ["Roots", () => "critical points", "Roots split the graph into sign intervals."],
      ["Intervals", () => "test each", "Inequalities need intervals, not only roots."],
      ["Sign", () => "positive/negative", "The graph tells where the expression is above or below zero."],
    ]);
  }
  if ([126, 127].includes(lessonId) || representation === "coordinate_graph") {
    return algebraFamily("Coordinate-region model", "half-plane", "Test point", "boundary and shade", (_lesson, value) => `(0,${value})`, [
      ["Boundary", () => "solid/dashed", "The sign decides whether boundary points are included."],
      ["Test point", () => "(0,0)", "A test point chooses the correct side."],
      ["Overlap", () => "feasible region", "Systems keep only points satisfying every rule."],
    ]);
  }
  return algebraFamily("Symbolic-step model", "exact steps", "x value", "equivalent expressions", (lesson, value) => `${lesson.title}: x=${value}`, [
    ["Start", (expression) => expression, "Read the exact expression or equation first."],
    ["Transform", () => "valid algebra step", "Each step must preserve equivalence or follow a named rule."],
    ["Check", () => "substitute back", "A final answer should satisfy the original algebraic object."],
  ]);
}

function algebraFamily(
  rule: string,
  badge: string,
  sliderLabel: string,
  ruleExpression: string,
  valueLabel: (lesson: LessonDefinition, value: number) => string,
  trace: Array<[string, (expression: string) => string, string]>,
) {
  return {
    rule,
    badge,
    sliderLabel,
    ruleExpression,
    valueLabel,
    objectValue: (lesson: LessonDefinition) => lesson.title,
    traceRows: (_source: StrengthenedLesson, expression: string) => trace.map(([label, value, note]) => ({ label, value: () => value(expression), note })),
  };
}

function valueSafeExpression(expression: string | undefined) {
  return expression?.replace(/=>/g, "implies") ?? "algebraic structure";
}

function GenericAlgebraLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initialA = lesson.id % 4 + 1;
  const initialB = lesson.id % 7 - 3;
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [animated, setAnimated] = useState(false);
  const guidance = algebraGuidanceFor(lesson.id);
  const plot = useMemo<PlotItem>(() => ({ id: `lesson-${lesson.id}`, expression: "a*x+b", color: "#06b6d4", kind: "function", visible: true }), [lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, a, b), [a, b, plot]);

  useEffect(() => { setA(initialA); setB(initialB); setAnimated(false); }, [initialA, initialB, resetToken]);
  useEffect(() => {
    if (!animated) return;
    const timer = window.setInterval(() => setB((value) => value >= 5 ? -5 : Number((value + 0.25).toFixed(2))), 180);
    return () => window.clearInterval(timer);
  }, [animated]);

  const changeA = (value: number) => { setA(value); onInteraction(); };
  const changeB = (value: number) => { setB(value); onInteraction(); };
  return (
    <AdapterFrame title={`${lesson.title} linked algebra view`} value={`y=${a}x${b >= 0 ? "+" : ""}${b}`} footer="The curve is sampled by the existing graph engine; both parameters update the linked equation and table.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Graph of y equals ${a} x plus ${b}`}>
            <GraphGrid />
            {layer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}
            <circle cx="320" cy={180 - b * 18} r="6" fill="#f59e0b" />
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="Linked variables">
            <SliderControl density="compact" label="a" value={a} min={-5} max={5} step={0.25} onChange={changeA} />
            <SliderControl density="compact" label="b" value={b} min={-5} max={5} step={0.25} onChange={changeB} />
          </SliderGroup>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setAnimated((value) => !value); onInteraction(); }}>{animated ? "Pause animation" : "Animate b"}</button>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[-2, 0, 2].map((x) => <div key={x} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">x={x}</span><strong className="font-mono">{Number((a * x + b).toFixed(2))}</strong></div>)}
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function CoreWorkspaceAlgebraAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const workspace = coreWorkspaceVisualFor(lesson);
  const [selected, setSelected] = useState(0);
  const [value, setValue] = useState(workspace.initialValue);

  useEffect(() => {
    setSelected(0);
    setValue(workspace.initialValue);
  }, [resetToken, workspace.initialValue]);

  const selectRow = (index: number) => {
    const before = selected;
    setSelected(index);
    onInteraction(createLessonInteractionEvent({ controlId: `${workspace.kind}-row`, kind: "selection", before, after: index, affectedOutputs: ["core-workspace-trace", "core-workspace-result"] }));
  };

  const changeValue = (nextValue: number) => {
    const before = value;
    setValue(nextValue);
    onInteraction(createLessonInteractionEvent({ controlId: `${workspace.kind}-value`, kind: "slider", before, after: nextValue, affectedOutputs: ["core-workspace-trace", "core-workspace-result"] }));
  };

  return (
    <AdapterFrame title={`${lesson.title} workspace`} value={workspace.valueLabel(value)} footer={workspace.footer}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/60 to-violet-50 p-4 dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10" aria-label={`${lesson.title} relevant visual workspace`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{workspace.kind.replace(/-/g, " ")}</p>
              <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{workspace.heading}</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-100">{workspace.badge}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.rows.map((row, index) => (
              <button
                key={row.label}
                type="button"
                className={selected === index ? "rounded-xl border-2 border-cyan-400 bg-white p-3 text-left shadow-lg shadow-cyan-950/10 dark:bg-slate-950/80" : "rounded-xl border border-slate-200 bg-white/80 p-3 text-left transition hover:border-cyan-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"}
                onClick={() => selectRow(index)}
              >
                <span className="block text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{row.label}</span>
                <strong className="mt-1 block font-mono text-lg text-slate-950 dark:text-white">{row.value(value)}</strong>
                <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{row.note}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-cyan-200 bg-white/80 p-3 dark:border-cyan-300/20 dark:bg-slate-950/50">
            <p className="text-sm font-black text-slate-900 dark:text-white">Selected trace</p>
            <p className="mt-1 text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">{workspace.rows[selected]?.explain(value)}</p>
          </div>
        </section>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{workspace.guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{workspace.guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{workspace.guidance[2]}</p>
          </div>
          <SliderGroup title="Relevant control">
            <SliderControl density="compact" label={workspace.sliderLabel} value={value} min={workspace.min} max={workspace.max} step={workspace.step} onChange={changeValue} />
          </SliderGroup>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">Why this visual is valid</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{workspace.validity}</p>
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

type CoreWorkspaceVisual = {
  kind: string;
  heading: string;
  badge: string;
  sliderLabel: string;
  initialValue: number;
  min: number;
  max: number;
  step: number;
  guidance: [string, string, string];
  footer: string;
  validity: string;
  valueLabel: (value: number) => string;
  rows: Array<{
    label: string;
    value: (value: number) => string;
    note: string;
    explain: (value: number) => string;
  }>;
};

function coreWorkspaceVisualFor(lesson: LessonDefinition): CoreWorkspaceVisual {
  const guidance = algebraGuidanceFor(lesson.id);
  const base = {
    guidance,
    footer: "This workspace uses a lesson-specific representation instead of a generic graph.",
    valueLabel: (value: number) => String(value),
  };
  if (lesson.id === 32) return {
    ...base,
    kind: "text-table",
    heading: "List entries, positions, and operations",
    badge: "No graph needed",
    sliderLabel: "Append value",
    initialValue: 8,
    min: -10,
    max: 20,
    step: 1,
    validity: "A list is an ordered collection, so the useful visual is a table of entries, indexes, length, sum, and mean.",
    valueLabel: (value) => `[2, 4, 6, ${value}]`,
    rows: [
      { label: "List", value: (value) => `[2, 4, 6, ${value}]`, note: "Ordered entries stay visible.", explain: (value) => `The fourth entry is ${value}; it is not mixed into one number until an operation is chosen.` },
      { label: "Indexes", value: () => "1, 2, 3, 4", note: "Each entry has a position.", explain: () => "Indexing answers position questions such as first, second, or fourth entry." },
      { label: "Length", value: () => "4", note: "Count entries.", explain: () => "Length is 4 because the list has four stored values." },
      { label: "Sum", value: (value) => String(12 + value), note: "Chosen operation.", explain: (value) => `Sum is allowed because we chose an operation: 2 + 4 + 6 + ${value} = ${12 + value}.` },
    ],
  };
  if (lesson.id === 33) return {
    ...base,
    kind: "matrix-grid",
    heading: "Rows, columns, and entries",
    badge: "Matrix grid",
    sliderLabel: "Entry a22",
    initialValue: 4,
    min: -9,
    max: 9,
    step: 1,
    validity: "A matrix should be inspected as rows, columns, and positions; a random line graph hides the core idea.",
    rows: [
      { label: "Matrix", value: (value) => `[[1, 2], [3, ${value}]]`, note: "Two rows, two columns.", explain: (value) => `The entry in row 2, column 2 is ${value}.` },
      { label: "Size", value: () => "2 x 2", note: "Rows first.", explain: () => "Matrix size is read rows by columns." },
      { label: "Main diagonal", value: (value) => `1, ${value}`, note: "Top-left to bottom-right.", explain: (value) => `The main diagonal entries are 1 and ${value}.` },
      { label: "Trace", value: (value) => String(1 + value), note: "Diagonal sum.", explain: (value) => `Trace equals 1 + ${value} = ${1 + value}.` },
    ],
  };
  if (lesson.id === 34) return {
    ...base,
    kind: "sequence-table",
    heading: "Term number to term value",
    badge: "Ordered rule",
    sliderLabel: "Common difference",
    initialValue: 3,
    min: -5,
    max: 8,
    step: 1,
    validity: "A sequence is best shown as ordered terms generated by a rule, not as an unrelated line.",
    rows: [1, 2, 3, 4].map((n) => ({
      label: `Term ${n}`,
      value: (value) => String(2 + (n - 1) * value),
      note: `a_${n}=2+${n - 1}d`,
      explain: (value) => `With common difference ${value}, term ${n} is ${2 + (n - 1) * value}.`,
    })),
  };
  if (lesson.id === 35) return {
    ...base,
    kind: "piecewise-rule",
    heading: "One condition chooses one rule",
    badge: "Condition visible",
    sliderLabel: "x",
    initialValue: 1,
    min: -5,
    max: 5,
    step: 1,
    validity: "Piecewise lessons need condition cards so learners see which rule is active at the boundary.",
    rows: [
      { label: "Condition", value: (value) => value < 0 ? "x < 0 active" : "x >= 0 active", note: "Only one branch is used.", explain: (value) => value < 0 ? "Because x is negative, use the first rule." : "Because x is zero or positive, use the second rule." },
      { label: "Rule 1", value: () => "f(x)=x+3 if x<0", note: "Negative branch.", explain: () => "This branch is ignored unless x is less than zero." },
      { label: "Rule 2", value: () => "f(x)=2x if x>=0", note: "Zero belongs here.", explain: () => "The greater-than-or-equal condition includes the boundary value 0." },
      { label: "Output", value: (value) => String(value < 0 ? value + 3 : 2 * value), note: "Selected branch result.", explain: (value) => `The active rule gives f(${value}) = ${value < 0 ? value + 3 : 2 * value}.` },
    ],
  };
  if (lesson.id === 36) return {
    ...base,
    kind: "boolean-table",
    heading: "Truth values and logical operations",
    badge: "True/false",
    sliderLabel: "Statement A",
    initialValue: 1,
    min: 0,
    max: 1,
    step: 1,
    validity: "Boolean ideas belong in truth tables; graph axes do not explain true/false operations.",
    valueLabel: (value) => value ? "A=true" : "A=false",
    rows: [
      { label: "A", value: (value) => value ? "true" : "false", note: "Chosen statement.", explain: (value) => `Statement A is currently ${value ? "true" : "false"}.` },
      { label: "B", value: () => "true", note: "Fixed comparison.", explain: () => "Statement B stays true so the effect of A is isolated." },
      { label: "A and B", value: (value) => value ? "true" : "false", note: "Both must be true.", explain: (value) => `A and B is ${value ? "true" : "false"} because both inputs must be true.` },
      { label: "A or B", value: () => "true", note: "At least one is true.", explain: () => "A or B stays true because B is true." },
    ],
  };
  if (lesson.id === 37 || lesson.id === 38) return {
    ...base,
    kind: lesson.id === 37 ? "dynamic-text" : "latex-preview",
    heading: lesson.id === 37 ? "Live text linked to values" : "Formula grouping preview",
    badge: lesson.id === 37 ? "Text updates" : "LaTeX syntax",
    sliderLabel: lesson.id === 37 ? "Live value" : "Exponent",
    initialValue: 2,
    min: 1,
    max: 9,
    step: 1,
    validity: lesson.id === 37 ? "Dynamic text should show linked values updating in a sentence." : "LaTeX display should expose grouping and rendered formula text.",
    rows: [
      { label: "Source", value: (value) => lesson.id === 37 ? `"The value is ${value}"` : `x^{${value}}`, note: "Editable source.", explain: () => "The source text is what the tool stores." },
      { label: "Preview", value: (value) => lesson.id === 37 ? `The value is ${value}.` : `x to the power ${value}`, note: "Rendered result.", explain: () => "The preview is what learners read after the source is parsed." },
      { label: "Check", value: () => lesson.id === 37 ? "linked" : "braces closed", note: "Avoid static mistakes.", explain: () => "The check confirms the display is linked or grouped correctly." },
      { label: "Use", value: () => "shareable math text", note: "Communication.", explain: () => "The final output should communicate the current mathematical state clearly." },
    ],
  };
  return {
    ...base,
    kind: "symbolic-steps",
    heading: "Input, rule, and checked output",
    badge: "Symbolic trace",
    sliderLabel: "Algebra value",
    initialValue: lesson.id % 5 + 1,
    min: -5,
    max: 5,
    step: 1,
    validity: "This lesson is about algebra workspace behavior, so a symbolic trace is more relevant than a decorative graph.",
    rows: [
      { label: "Input", value: (value) => `x = ${value}`, note: "Chosen value.", explain: (value) => `The workspace starts by storing x as ${value}.` },
      { label: "Rule", value: () => "2x + 3", note: "Linked expression.", explain: () => "The expression reads the stored value of x." },
      { label: "Substitute", value: (value) => `2(${value}) + 3`, note: "Replace x everywhere.", explain: (value) => `Substitution means every x becomes ${value}.` },
      { label: "Output", value: (value) => String(2 * value + 3), note: "Checked result.", explain: (value) => `The output is ${2 * value + 3}.` },
    ],
  };
}

function algebraGuidanceFor(lessonId: number) {
  const guidance: Record<number, [string, string, string]> = {
    19: ["Workspace rule", "Every algebra step should preserve equivalence.", "Substitute a test value to check a step."],
    20: ["Variable rule", "A variable value updates every expression using it.", "Replace the variable everywhere, not in one place."],
    21: ["Numeric slider", "Move one number and watch the linked output.", "Change one parameter at a time."],
    22: ["Integer slider", "Integer sliders move in whole-number steps.", "Use them for counts and sequence indices."],
    23: ["Angle slider", "Angle sliders need a clear unit.", "Do not mix degrees and radians."],
    24: ["Animation rule", "Animation repeatedly changes one parameter.", "Pause and read the changing value."],
    25: ["Dependency rule", "Independent values are chosen; dependent values are calculated.", "Change the parent value to update the child."],
    26: ["Visibility rule", "A condition must be true before an object appears.", "Check boundary values carefully."],
    27: ["Dynamic label", "A dynamic label reads the current linked value.", "Avoid typing a fixed number into a live label."],
    28: ["Input syntax", "The parser needs clear multiplication and brackets.", "Check the preview before using the result."],
    29: ["Redefinition rule", "Changing a parent definition can update dependent objects.", "Inspect linked outputs after redefining."],
    30: ["Equation input", "An equation needs two sides and an equals sign.", "Solve by keeping both sides balanced."],
    31: ["Inequality input", "Use <, >, <=, or >= to compare two sides.", "Reverse the sign when dividing by a negative."],
    32: ["List rule", "A list stores ordered entries.", "Choose an operation before treating a list like a value."],
    33: ["Matrix size", "Matrix size is rows by columns.", "Count rows first, then columns."],
    34: ["Sequence rule", "A sequence is an ordered list made by a rule.", "Term n uses n-1 jumps after the first term."],
    35: ["Piecewise rule", "Only the rule with the true condition is active.", "Check boundary symbols carefully."],
    36: ["Boolean rule", "Boolean values are true or false.", "For and, both statements must be true."],
    37: ["Dynamic text", "Dynamic text reads live linked values.", "Use a link instead of typing a fixed value."],
    38: ["LaTeX display", "LaTeX needs correct grouping braces.", "Preview the formula before sharing it."],
  };
  return guidance[lessonId] ?? ["Algebra rule", "Link variables, expressions, and outputs.", "Use the table to check the rule."];
}

function GraphGrid() {
  return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, index) => <line key={`v-${index}`} x1={index * 32} x2={index * 32} y1="0" y2="360" stroke="#cbd5e1" opacity="0.35" />)}{Array.from({ length: 13 }, (_, index) => <line key={`h-${index}`} x1="0" x2="640" y1={index * 30} y2={index * 30} stroke="#cbd5e1" opacity="0.35" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>;
}
