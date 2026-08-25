import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import { createLessonInteractionEvent } from "../engine/lessonInteraction";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type { LessonAdapterProps, LessonDefinition } from "../types";
import AlgebraWorkspaceTargetLesson19 from "./AlgebraWorkspaceTargetLesson19";
import VariableExplorerTargetLesson20 from "./VariableExplorerTargetLesson20";
import NumericSlidersTargetLesson21 from "./NumericSlidersTargetLesson21";
import IntegerSlidersTargetLesson22 from "./IntegerSlidersTargetLesson22";
import AngleSlidersTargetLesson23 from "./AngleSlidersTargetLesson23";
import AnimationControlsTargetLesson24 from "./AnimationControlsTargetLesson24";
import DependentObjectsTargetLesson25 from "./DependentObjectsTargetLesson25";
import ConditionalVisibilityTargetLesson26 from "./ConditionalVisibilityTargetLesson26";
import DynamicLabelsTargetLesson27 from "./DynamicLabelsTargetLesson27";
import AlgebraicInputTargetLesson28 from "./AlgebraicInputTargetLesson28";

const viewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };

export default function AlgebraLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id === 19) {
    return <AlgebraWorkspaceTargetLesson19 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 20) {
    return <VariableExplorerTargetLesson20 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 21) {
    return <NumericSlidersTargetLesson21 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 22) {
    return <IntegerSlidersTargetLesson22 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 23) {
    return <AngleSlidersTargetLesson23 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 24) {
    return <AnimationControlsTargetLesson24 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 25) {
    return <DependentObjectsTargetLesson25 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 26) {
    return <ConditionalVisibilityTargetLesson26 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 27) {
    return <DynamicLabelsTargetLesson27 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 28) {
    return <AlgebraicInputTargetLesson28 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "core-workspaces" && lesson.id >= 19 && lesson.id <= 38) {
    return <RedesignedCoreAlgebraLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "core-workspaces" && lesson.id >= 31 && lesson.id <= 38) {
    return <CoreWorkspaceAlgebraAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.categorySlug === "algebra" && lesson.id >= 92 && lesson.id <= 128) {
    return <AlgebraConceptWorkspace lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  return <GenericAlgebraLessonAdapter lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

void RedesignedCoreAlgebraLesson;

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

type RedesignedAlgebraKind =
  | "workspace-flow"
  | "variable-flow"
  | "numeric-slider"
  | "integer-slider"
  | "angle-slider"
  | "animation"
  | "dependency"
  | "visibility"
  | "dynamic-label"
  | "algebraic-input"
  | "redefinition"
  | "equation-input"
  | "inequality-input"
  | "lists"
  | "matrices"
  | "sequences"
  | "piecewise"
  | "boolean-variables"
  | "dynamic-text"
  | "latex-display";

type RedesignedAlgebraSpec = {
  kind: RedesignedAlgebraKind;
  snippet: string;
  heading: string;
  badge: string;
  initialValue: number;
  min: number;
  max: number;
  step: number;
  sliderLabel: string;
  overlay: (value: number) => string;
  valueLabel: (value: number) => string;
  trace: (value: number) => Array<{ label: string; value: string; note: string }>;
  table: (value: number) => Array<[string, string, string]>;
  practice: { prompt: string; answer: string; hint: string };
  guardrail: string;
  footer: string;
};

function RedesignedCoreAlgebraLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = redesignedAlgebraSpecFor(lesson.id);
  const [value, setValue] = useState(spec.initialValue);
  const [selectedTrace, setSelectedTrace] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [eventLog, setEventLog] = useState(`${spec.snippet} ready - the model is linked.`);

  useEffect(() => {
    setValue(spec.initialValue);
    setSelectedTrace(0);
    setShowPractice(false);
    setEventLog(`${spec.snippet} ready - the model is linked.`);
  }, [resetToken, spec]);

  const updateValue = (nextValue: number) => {
    const before = value;
    setValue(nextValue);
    setEventLog(`Action fired - ${spec.sliderLabel} changed to ${nextValue}, and every linked output updated.`);
    onInteraction(createLessonInteractionEvent({
      controlId: `${spec.kind}-value`,
      kind: "slider",
      before,
      after: nextValue,
      affectedOutputs: ["algebra-redesign-visual", "algebra-redesign-trace", "algebra-redesign-table"],
    }));
  };

  const selectTrace = (index: number) => {
    const before = selectedTrace;
    setSelectedTrace(index);
    setEventLog(`Trace ${index + 1} selected - ${spec.trace(value)[index]?.label ?? "step"} is now highlighted.`);
    onInteraction(createLessonInteractionEvent({
      controlId: `${spec.kind}-trace`,
      kind: "selection",
      before,
      after: index,
      affectedOutputs: ["algebra-redesign-trace", "algebra-redesign-feedback"],
    }));
  };

  const revealPractice = () => {
    setShowPractice((current) => !current);
    setEventLog("Practice checked - answer is shown with the reasoning source.");
    onInteraction(createLessonInteractionEvent({
      controlId: `${spec.kind}-practice`,
      kind: "tool",
      before: showPractice,
      after: !showPractice,
      affectedOutputs: ["algebra-redesign-practice", "algebra-redesign-feedback"],
    }));
  };

  const reset = () => {
    setValue(spec.initialValue);
    setSelectedTrace(0);
    setShowPractice(false);
    setEventLog(`${spec.snippet} ready - the model is linked.`);
    onInteraction(createLessonInteractionEvent({
      controlId: `${spec.kind}-reset`,
      kind: "tool",
      before: { value, selectedTrace, showPractice },
      after: { value: spec.initialValue, selectedTrace: 0, showPractice: false },
      affectedOutputs: ["algebra-redesign-visual", "algebra-redesign-practice", "algebra-redesign-table"],
    }));
  };

  const traceRows = spec.trace(value);
  return (
    <AdapterFrame title={`${lesson.title} workspace`} value={spec.valueLabel(value)} footer={spec.footer}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/45 to-violet-50 p-4 shadow-sm dark:border-cyan-300/20 dark:from-slate-950 dark:via-cyan-300/10 dark:to-violet-300/10" aria-label={`${lesson.title} redesigned algebra lab`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Interaction + visualization</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{spec.heading}</h3>
            </div>
            <span className="rounded-2xl border border-cyan-200 bg-white px-4 py-2 text-sm font-black text-cyan-800 shadow-sm">{spec.badge}</span>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-center text-white shadow-xl">
            <p className="font-mono text-2xl font-black tracking-wide sm:text-4xl">{spec.overlay(value)}</p>
          </div>

          <div className="mt-4">
            {renderRedesignedAlgebraVisual(spec, value, updateValue)}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(240px,.65fr)_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <p className="font-black text-slate-950 dark:text-white">{spec.sliderLabel}</p>
              <label className="sr-only" htmlFor={`${spec.kind}-slider`}>{spec.sliderLabel}</label>
              <input id={`${spec.kind}-slider`} aria-label={spec.sliderLabel} type="range" min={spec.min} max={spec.max} step={spec.step} value={value} onChange={(event) => updateValue(Number(event.target.value))} className="mt-4 w-full accent-cyan-600" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set([spec.min, spec.initialValue, spec.max])).map((preset) => (
                  <button key={preset} type="button" className={value === preset ? "rounded-xl bg-cyan-600 px-3 py-2 text-xs font-black text-white" : "rounded-xl border border-cyan-200 bg-white px-3 py-2 text-xs font-black text-cyan-700"} onClick={() => updateValue(preset)}>{preset}</button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 dark:border-white/10 dark:bg-slate-950/60">
              <p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-cyan-700">{algebraTableTitle(spec.kind)}</p>
              <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-xs font-black uppercase text-slate-500 dark:bg-white/5 dark:text-slate-300"><span>Input</span><span>Transformation</span><span>Output</span></div>
              {spec.table(value).map(([input, rule, output]) => (
                <div key={`${input}-${rule}-${output}`} className="grid grid-cols-3 border-t border-slate-100 px-3 py-2 text-sm font-semibold dark:border-white/10">
                  <span className="font-mono">{input}</span><span className="font-mono">{rule}</span><span className="font-mono text-cyan-700">{output}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-emerald-200 bg-white/95 p-4 dark:border-emerald-300/20 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-emerald-700">Practice</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">{spec.practice.prompt}</p>
              <button type="button" className="action-primary" onClick={revealPractice}>{showPractice ? "Hide answer" : "Show answer"}</button>
            </div>
            {showPractice ? <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-mono text-lg font-black text-emerald-800">Answer: {spec.practice.answer}. {spec.practice.hint}</p> : null}
          </div>
        </section>

        <aside className="space-y-3">
          <section className="rounded-3xl border border-cyan-100 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70" aria-label={`${lesson.title} concept trace`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Concept trace</p>
            <div className="mt-3 grid gap-2">
              {traceRows.map((row, index) => (
                <button key={row.label} type="button" className={selectedTrace === index ? "rounded-2xl border-2 border-cyan-400 bg-cyan-50 p-3 text-left" : "rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-cyan-300"} onClick={() => selectTrace(index)}>
                  <span className="text-[10px] font-black uppercase text-slate-500">{row.label}</span>
                  <strong className="mt-1 block font-mono text-lg text-slate-950">{row.value}</strong>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-600">{row.note}</span>
                </button>
              ))}
            </div>
          </section>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.guardrail}</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-slate-500">Event log</p>
            <p className="mt-2 text-sm font-black text-slate-800 dark:text-slate-100">{eventLog}</p>
          </div>
          <button type="button" className="action-secondary w-full justify-center" onClick={reset}>Reset lab</button>
        </aside>
      </div>
    </AdapterFrame>
  );
}

function redesignedAlgebraSpecFor(lessonId: number): RedesignedAlgebraSpec {
  const y = (x: number) => 2 * x + 3;
  const baseTrace = (x: number) => [
    { label: "Input", value: `x = ${x}`, note: "Chosen value stored in the algebra workspace." },
    { label: "Rule", value: "2x + 3", note: "The rule reads the current value of x." },
    { label: "Substitute", value: `2(${x}) + 3`, note: "Replace every x before simplifying." },
    { label: "Output", value: String(y(x)), note: "Computed result updates live." },
    { label: "Check", value: "Preserve equivalence", note: "The output comes from the stored rule, not a separate guess." },
  ];
  const table = (points: number[]) => points.map((x) => [`x=${x}`, `2(${x})+3`, String(y(x))] as [string, string, string]);
  const commonFooter = "This workspace uses the provided algebra/dynamic-variables mockup as a lesson-specific interactive model instead of a generic graph.";
  const specs: Record<number, RedesignedAlgebraSpec> = {
    19: {
      kind: "workspace-flow",
      snippet: "Workspace rule",
      heading: "Build, link, substitute, and check",
      badge: "Symbolic workspace",
      initialValue: 5,
      min: -10,
      max: 10,
      step: 1,
      sliderLabel: "Variable x",
      overlay: (x) => `x = ${x} -> 2x + 3 -> 2(${x}) + 3 = ${y(x)}`,
      valueLabel: (x) => `Output ${y(x)}`,
      trace: baseTrace,
      table: () => table([0, 5, 10]),
      practice: { prompt: "If x=4, what does 2x+3 output?", answer: "11", hint: "Substitute x=4 into 2x+3." },
      guardrail: "Watch out: changing x only matters if the rule card is linked to x. A copied result is not a live object.",
      footer: commonFooter,
    },
    20: {
      kind: "variable-flow",
      snippet: "Variable rule",
      heading: "Input, rule, substitution, output",
      badge: "Variable dependency",
      initialValue: 1,
      min: -5,
      max: 5,
      step: 1,
      sliderLabel: "Adjust x",
      overlay: (x) => `INPUT x=${x} -> RULE y=2x+3 -> OUTPUT y=${y(x)}`,
      valueLabel: (x) => `y = ${y(x)}`,
      trace: baseTrace,
      table: () => table([-2, 0, 1, 3]),
      practice: { prompt: "If x changes to 3, what does y=2x+3 become?", answer: "9", hint: "Changing x updates every linked expression." },
      guardrail: "Changing x updates every linked expression. Watch out: update the variable once and let dependency arrows carry the change. Do not edit each output by hand.",
      footer: commonFooter,
    },
    21: {
      kind: "numeric-slider",
      snippet: "Numeric slider",
      heading: "Move one number and watch linked values update",
      badge: "Continuous parameter",
      initialValue: 2,
      min: -5,
      max: 5,
      step: 0.1,
      sliderLabel: "Numeric slider x",
      overlay: (x) => `x = ${formatNumber(x)} -> y = 2(${formatNumber(x)}) + 3 = ${formatNumber(y(x))}`,
      valueLabel: (x) => `Point (${formatNumber(x)}, ${formatNumber(y(x))})`,
      trace: baseTrace,
      table: () => table([-2, 0, 2, 4]),
      practice: { prompt: "If x=4, what point lies on y=2x+3?", answer: "(4, 11)", hint: "Use the same linked expression." },
      guardrail: "Watch out: move one parameter at a time so cause and effect stay visible.",
      footer: commonFooter,
    },
    22: {
      kind: "integer-slider",
      snippet: "Integer slider",
      heading: "Discrete integer slider",
      badge: "Snaps to whole numbers",
      initialValue: 3,
      min: -5,
      max: 5,
      step: 1,
      sliderLabel: "Integer slider x",
      overlay: (x) => `x snaps to ${x} -> y = 2(${x}) + 3 = ${y(x)}`,
      valueLabel: (x) => `Integer output ${y(x)}`,
      trace: baseTrace,
      table: () => [0, 1, 2, 3].map((step) => [`step ${step}`, `x=${step}`, `y=${y(step)}`]),
      practice: { prompt: "What is y when the integer slider snaps to x=3?", answer: "9", hint: "Only whole-number slider stops are allowed." },
      guardrail: "Only whole-number values are allowed. Watch out: integer sliders are for countable values. Do not use 2.5 people, sides, or sequence indices.",
      footer: commonFooter,
    },
    23: {
      kind: "angle-slider",
      snippet: "Angle slider",
      heading: "Rotate an angle and read the trig values",
      badge: "60 deg = pi/3 rad",
      initialValue: 60,
      min: 0,
      max: 360,
      step: 1,
      sliderLabel: "Angle theta in degrees",
      overlay: (theta) => `theta = ${theta} deg -> sin(theta) = ${sinDeg(theta)}`,
      valueLabel: (theta) => `theta ${theta} deg`,
      trace: (theta) => [
        { label: "Angle", value: `${theta} deg`, note: "The slider controls the rotation." },
        { label: "Radians", value: theta === 60 ? "pi/3 rad" : `${formatNumber((theta * Math.PI) / 180)} rad`, note: "Degrees and radians measure the same turn." },
        { label: "Point", value: `P(${cosDeg(theta)}, ${sinDeg(theta)})`, note: "Unit-circle coordinates are (cos theta, sin theta)." },
        { label: "Sine", value: `sin(theta)=${sinDeg(theta)}`, note: "The sine wave marker has this height." },
      ],
      table: (theta) => [["cos(theta)", "unit circle x", cosDeg(theta)], ["sin(theta)", "unit circle y", sinDeg(theta)], ["tan(theta)", "sin/cos", tanDeg(theta)]],
      practice: { prompt: "How many radians is 60 degrees?", answer: "pi/3 rad", hint: "A full turn is 2pi radians." },
      guardrail: "Watch out: 60 degrees is not 60 radians. Check the angle unit before using trig values.",
      footer: commonFooter,
    },
    24: {
      kind: "animation",
      snippet: "Animation rule",
      heading: "Animate parameter a from 0 to 2",
      badge: "Current frame 3",
      initialValue: 3,
      min: 0,
      max: 5,
      step: 1,
      sliderLabel: "Timeline frame",
      overlay: (frame) => `frame ${frame} -> a=${frameA(frame)} -> y = ax + 1`,
      valueLabel: (frame) => `a = ${frameA(frame)}`,
      trace: (frame) => [
        { label: "Frame", value: String(frame), note: "The timeline chooses the current animation moment." },
        { label: "Parameter", value: `a=${frameA(frame)}`, note: "Animation changes one parameter automatically." },
        { label: "Rule", value: `y=${frameA(frame)}x+1`, note: "The graph updates from the current a value." },
        { label: "Inspect", value: `y(2)=${formatNumber(2 * Number(frameA(frame)) + 1)}`, note: "Pause to inspect exact values." },
      ],
      table: () => [1, 2, 3, 4].map((frame) => [`frame ${frame}`, `a=${frameA(frame)}`, `y(2)=${formatNumber(2 * Number(frameA(frame)) + 1)}`]),
      practice: { prompt: "At frame 3, with a=1.5, what is y(2) for y=ax+1?", answer: "4", hint: "Compute 1.5 x 2 + 1." },
      guardrail: "Frame table: pause to inspect exact values at each frame. Watch out: animation is not just motion. Name the parameter that changes at each frame.",
      footer: commonFooter,
    },
    25: {
      kind: "dependency",
      snippet: "Dependency rule",
      heading: "Independent parents update dependent children",
      badge: "A and B unlocked",
      initialValue: 5,
      min: 2,
      max: 8,
      step: 1,
      sliderLabel: "Move point B x-coordinate",
      overlay: (bx) => `A(1,2), B(${bx},2) -> midpoint M(${formatNumber((1 + bx) / 2)},2)`,
      valueLabel: (bx) => `AB = ${formatNumber(bx - 1)}`,
      trace: (bx) => [
        { label: "Independent A", value: "A(1, 2)", note: "A can be moved directly." },
        { label: "Independent B", value: `B(${bx}, 2)`, note: "B is another parent object." },
        { label: "Segment AB", value: `length ${formatNumber(bx - 1)}`, note: "The segment depends on A and B." },
        { label: "Midpoint M", value: `M(${formatNumber((1 + bx) / 2)}, 2)`, note: "M is calculated from both parents." },
      ],
      table: (bx) => [["A", "independent", "unlocked"], ["B", "independent", `x=${bx}`], ["M", "dependent", `(${formatNumber((1 + bx) / 2)},2)`]],
      practice: { prompt: "If A(1,2) and B(5,2), what is midpoint M?", answer: "M(3, 2)", hint: "Average the x-coordinates and y-coordinates." },
      guardrail: "Watch out: a dependent midpoint is locked. Move a parent object to update its children.",
      footer: commonFooter,
    },
    26: {
      kind: "visibility",
      snippet: "Visibility rule",
      heading: "Condition-based visibility on a number line",
      badge: "Visible if x >= 2",
      initialValue: 2.5,
      min: -5,
      max: 5,
      step: 0.5,
      sliderLabel: "Visibility value x",
      overlay: (x) => `${formatNumber(x)} >= 2 -> ${x >= 2 ? "TRUE: Object P visible" : "FALSE: Object P hidden"}`,
      valueLabel: (x) => x >= 2 ? "Visible" : "Hidden",
      trace: (x) => [
        { label: "Condition", value: "x >= 2", note: "The object appears only when this statement is true." },
        { label: "Current x", value: formatNumber(x), note: "The slider supplies the value to test." },
        { label: "Truth", value: x >= 2 ? "TRUE" : "FALSE", note: "Visibility follows the truth value." },
        { label: "Object P", value: x >= 2 ? "visible" : "hidden", note: "The object is not decorative; it obeys the rule." },
      ],
      table: () => [["x=1.5", "1.5 >= 2", "hidden"], ["x=2.5", "2.5 >= 2", "visible"], ["x=2", "2 >= 2", "visible"]],
      practice: { prompt: "Should x=1.5 show for the condition x >= 2?", answer: "no", hint: "1.5 >= 2 is false." },
      guardrail: "Watch out: boundary values matter. x=2 is visible for x >= 2, but not for x > 2.",
      footer: commonFooter,
    },
    27: {
      kind: "dynamic-label",
      snippet: "Dynamic label",
      heading: "Labels read linked values, not fixed text",
      badge: "Live label",
      initialValue: 3,
      min: -5,
      max: 6,
      step: 1,
      sliderLabel: "Point P x-coordinate",
      overlay: (px) => `P = (${px}, 2), distance from origin = ${distance(px, 2)}`,
      valueLabel: (px) => `P(${px}, 2)`,
      trace: (px) => [
        { label: "Template", value: "P = ({x}, {y}), distance = {d}", note: "The label stores placeholders." },
        { label: "Values", value: `{x}=${px}, {y}=2`, note: "Placeholders read current coordinates." },
        { label: "Distance", value: `sqrt(${px}^2 + 2^2)`, note: "The distance token is calculated." },
        { label: "Live label", value: `P = (${px}, 2), distance = ${distance(px, 2)}`, note: "The displayed label updates automatically." },
      ],
      table: () => [["P(3,2)", "sqrt(13)", "3.61"], ["P(4,1)", "sqrt(17)", "4.12"], ["P(0,2)", "sqrt(4)", "2.00"]],
      practice: { prompt: "If P moves to (4,1), what distance label should show?", answer: "4.12", hint: "sqrt(4^2+1^2)=sqrt(17)." },
      guardrail: "Watch out: a typed number in a label goes stale. Link the label to values instead.",
      footer: commonFooter,
    },
    28: {
      kind: "algebraic-input",
      snippet: "Input syntax",
      heading: "Construct objects from typed notation",
      badge: "Valid expression",
      initialValue: 0,
      min: -2,
      max: 2,
      step: 1,
      sliderLabel: "Evaluate f(x) at x",
      overlay: (x) => `f(x) = x^2 - 4 -> f(${x}) = ${x * x - 4}`,
      valueLabel: (x) => `f(${x})=${x * x - 4}`,
      trace: (x) => [
        { label: "Name", value: "f", note: "The parser detects the function name." },
        { label: "Variable", value: "x", note: "A single variable is detected." },
        { label: "Operation", value: "x^2 - 4", note: "Powers and subtraction are parsed." },
        { label: "Evaluation", value: `f(${x})=${x * x - 4}`, note: "Preview before graphing or using the object." },
      ],
      table: () => [["f(-2)", "(-2)^2-4", "0"], ["f(0)", "0^2-4", "-4"], ["f(2)", "2^2-4", "0"]],
      practice: { prompt: "For f(x)=x^2-4, what is f(0)?", answer: "-4", hint: "Square 0, then subtract 4." },
      guardrail: "Watch out: typed notation must parse before the graph or table can be trusted.",
      footer: commonFooter,
    },
    29: {
      kind: "redefinition",
      snippet: "Redefinition rule",
      heading: "Name preserved; definition changed",
      badge: "All dependents refresh",
      initialValue: 1,
      min: 0,
      max: 1,
      step: 1,
      sliderLabel: "Definition state",
      overlay: (state) => state ? "f: x+1 -> x^2-1; dependents recomputed" : "f(x)=x+1 before redefinition",
      valueLabel: (state) => state ? "new f(x)=x^2-1" : "old f(x)=x+1",
      trace: (state) => [
        { label: "Object name", value: "f", note: "The name stays attached to the object." },
        { label: "Old definition", value: "f(x)=x+1", note: "Before redefinition, f is a line." },
        { label: "New definition", value: state ? "f(x)=x^2-1" : "pending", note: "After redefinition, f is a parabola." },
        { label: "Dependents", value: "A, B, table, graph", note: "Every linked object refreshes from the new rule." },
      ],
      table: () => [["A=f(2)", "before 3", "after 3"], ["B=f(0)", "before 1", "after -1"], ["Graph", "line", "parabola"]],
      practice: { prompt: "After redefining f(x)=x^2-1, what is B=f(0)?", answer: "-1", hint: "Use the new definition while keeping the name f." },
      guardrail: "Watch out: redefining a parent object can surprise dependents. Inspect the update list before continuing.",
      footer: commonFooter,
    },
    30: {
      kind: "equation-input",
      snippet: "Equation input",
      heading: "Enter and check two balanced sides",
      badge: "Valid equation",
      initialValue: 4,
      min: 0,
      max: 8,
      step: 1,
      sliderLabel: "Test solution x",
      overlay: (x) => `2x + 3 = 11; test x=${x} -> ${2 * x + 3 === 11 ? "TRUE" : "FALSE"}`,
      valueLabel: (x) => `test x=${x}`,
      trace: (x) => [
        { label: "Equation", value: "2x + 3 = 11", note: "The parser detects two sides." },
        { label: "Step 1", value: "2x = 8", note: "Subtract 3 from both sides." },
        { label: "Solution", value: "x = 4", note: "Divide both sides by 2." },
        { label: "Checker", value: `2(${x})+3=${2 * x + 3}`, note: x === 4 ? "Both sides are equal." : "This test value does not balance the equation." },
      ],
      table: () => [["Start", "2x+3=11", "two sides"], ["Subtract 3", "2x=8", "balanced"], ["Divide by 2", "x=4", "solution"]],
      practice: { prompt: "Solve 2x+3=11.", answer: "x=4", hint: "Subtract 3, then divide by 2." },
      guardrail: "Watch out: an expression is not an equation. Use an equals sign with a left side and right side.",
      footer: commonFooter,
    },
    31: {
      kind: "inequality-input",
      snippet: "Inequality input",
      heading: "Solve and shade every value that works",
      badge: "Solution x < 4",
      initialValue: 3,
      min: 0,
      max: 6,
      step: 1,
      sliderLabel: "Test x on the inequality",
      overlay: (x) => `2x + 3 < 11; test x=${x} -> ${2 * x + 3 < 11 ? "TRUE" : "FALSE"}`,
      valueLabel: (x) => `test x=${x}`,
      trace: (x) => [
        { label: "Inequality", value: "2x + 3 < 11", note: "The parser detects a comparison sign instead of equals." },
        { label: "Subtract 3", value: "2x < 8", note: "Do the same operation to both sides." },
        { label: "Divide by 2", value: "x < 4", note: "The solution is a shaded set, not one point." },
        { label: "Test value", value: x === 4 ? "x=4 FALSE" : `x=${x} ${2 * x + 3 < 11 ? "TRUE" : "FALSE"}`, note: "Open circle means 4 is not included." },
      ],
      table: () => [["x=3", "2(3)+3<11", "TRUE"], ["x=4", "2(4)+3<11", "FALSE"], ["x=5", "2(5)+3<11", "FALSE"]],
      practice: { prompt: "Which values solve 2x + 3 < 11?", answer: "x < 4", hint: "Subtract 3, divide by 2, then shade left of 4." },
      guardrail: "Reverse the sign when dividing by a negative. Open circle means 4 is not included.",
      footer: commonFooter,
    },
    32: {
      kind: "lists",
      snippet: "List rule",
      heading: "List entries, positions, and operations",
      badge: "L = [2, 4, 6, 8]",
      initialValue: 3,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Selected list index",
      overlay: () => "L = [2, 4, 6, 8] -> append 10 -> remove 4 -> map x -> 2x",
      valueLabel: (index) => `index ${index}`,
      trace: (index) => [
        { label: "Original list", value: "[2, 4, 6, 8]", note: "A list is an ordered collection." },
        { label: "Selected", value: `index ${index}`, note: `Selected entry is ${[2, 4, 6, 8][index - 1]}.` },
        { label: "Operations", value: "append, remove, sort, map", note: "Each operation creates a traceable list state." },
        { label: "Final", value: "[4, 12, 16, 20]", note: "No graph needed for ordered entries and operations." },
      ],
      table: () => [["start", "[2, 4, 6, 8]", "length 4"], ["append 10", "[2, 4, 6, 8, 10]", "length 5"], ["remove 4", "[2, 6, 8, 10]", "length 4"], ["map x -> 2x", "[4, 12, 16, 20]", "sum 52"]],
      practice: { prompt: "After removing 4 and doubling each remaining entry, what list appears?", answer: "[4, 12, 16, 20]", hint: "Keep the order, then apply the map rule." },
      guardrail: "Why this visual is valid: A list is an ordered collection, so positions and operation history matter. No graph needed.",
      footer: commonFooter,
    },
    33: {
      kind: "matrices",
      snippet: "Matrix size",
      heading: "Rows, columns, entries, and a transformation",
      badge: "2 x 2 matrix",
      initialValue: 4,
      min: 1,
      max: 4,
      step: 1,
      sliderLabel: "Selected matrix entry",
      overlay: () => "A = [[1, 2], [3, 4]], trace(A)=1+4=5",
      valueLabel: (entry) => `selected ${entry}`,
      trace: () => [
        { label: "Matrix", value: "A = [[1,2],[3,4]]", note: "Rows are read first, then columns." },
        { label: "Selected", value: "a22 = 4", note: "Entry a22 is row 2, column 2." },
        { label: "Trace", value: "1 + 4 = 5", note: "Trace adds the main diagonal." },
        { label: "Vector", value: "A[1,1]^T = [3,7]^T", note: "A matrix can transform vectors." },
      ],
      table: () => [["row 1", "1, 2", "first row"], ["row 2", "3, 4", "second row"], ["diagonal", "1 + 4", "trace 5"], ["vector", "A(1,1)", "(3,7)"]],
      practice: { prompt: "What is a22 in A = [[1,2],[3,4]]?", answer: "4", hint: "Row 2, column 2." },
      guardrail: "Rows first, then columns. Matrix position labels prevent confusing a12 with a21.",
      footer: commonFooter,
    },
    34: {
      kind: "sequences",
      snippet: "Sequence rule",
      heading: "Connect term number to term value",
      badge: "Arithmetic +3",
      initialValue: 5,
      min: 1,
      max: 6,
      step: 1,
      sliderLabel: "Term number n",
      overlay: (n) => `2, 5, 8, 11, 14, 17; a_${n}=2+(${n}-1)3=${2 + (n - 1) * 3}`,
      valueLabel: (n) => `a${n} = ${2 + (n - 1) * 3}`,
      trace: (n) => [
        { label: "First term", value: "a1 = 2", note: "Start from the first tile." },
        { label: "Common difference", value: "d = 3", note: "Each jump on the number line is +3." },
        { label: "Rule", value: "a_n = 2 + (n-1)3", note: "Term number maps to term value." },
        { label: "Selected", value: `a${n} = ${2 + (n - 1) * 3}`, note: "The rule and tile agree." },
      ],
      table: () => [1, 2, 3, 4, 5, 6].map((n) => [`n=${n}`, `2+(${n}-1)3`, String(2 + (n - 1) * 3)]),
      practice: { prompt: "Predict a6 for 2, 5, 8, 11, 14, ...", answer: "17", hint: "Add 3 one more time." },
      guardrail: "Term number is not the same as term value. Use a_n=2+(n-1)3.",
      footer: commonFooter,
    },
    35: {
      kind: "piecewise",
      snippet: "Piecewise rule",
      heading: "Choose the branch from the condition",
      badge: "Boundary x = 0",
      initialValue: 1,
      min: -2,
      max: 2,
      step: 1,
      sliderLabel: "Input x",
      overlay: (x) => `f(x)=x+3 if x<0, f(x)=2x if x>=0; f(${x})=${x < 0 ? x + 3 : 2 * x}`,
      valueLabel: (x) => `f(${x})=${x < 0 ? x + 3 : 2 * x}`,
      trace: (x) => [
        { label: "Left branch", value: "x+3 if x<0", note: "Open circle at (0,3)." },
        { label: "Right branch", value: "2x if x>=0", note: "Closed point at (0,0)." },
        { label: "Input", value: `x=${x}`, note: x < 0 ? "Use the left branch." : "Use the right branch." },
        { label: "Output", value: String(x < 0 ? x + 3 : 2 * x), note: "Boundary symbols decide which point is filled." },
      ],
      table: () => [["x=-1", "-1+3", "2"], ["x=0", "2(0)", "0"], ["x=1", "2(1)", "2"]],
      practice: { prompt: "For f(x)=x+3 if x<0 and f(x)=2x if x>=0, what is f(1)?", answer: "2", hint: "x=1 uses the x>=0 branch." },
      guardrail: "Boundary symbols decide which point is filled. x=0 belongs to f(x)=2x because the rule says x>=0.",
      footer: commonFooter,
    },
    36: {
      kind: "boolean-variables",
      snippet: "Boolean rule",
      heading: "Truth values drive logic gates",
      badge: "A=true, B=false",
      initialValue: 0,
      min: 0,
      max: 1,
      step: 1,
      sliderLabel: "Toggle B truth value",
      overlay: (b) => `A=true, B=${b ? "true" : "false"}; A AND B=${b ? "true" : "false"}`,
      valueLabel: (b) => `B=${b ? "true" : "false"}`,
      trace: (b) => [
        { label: "A", value: "true", note: "A is switched on." },
        { label: "B", value: b ? "true" : "false", note: "The control toggles B." },
        { label: "A AND B", value: b ? "true" : "false", note: "AND requires both statements to be true." },
        { label: "Object P", value: b ? "visible" : "hidden", note: "Show Object P if A AND B." },
      ],
      table: (b) => [["A AND B", `true AND ${b ? "true" : "false"}`, b ? "true" : "false"], ["A OR B", `true OR ${b ? "true" : "false"}`, "true"], ["NOT A", "NOT true", "false"]],
      practice: { prompt: "With A=true and B=false, is A AND B true?", answer: "false", hint: "AND needs both inputs true." },
      guardrail: "AND is strict: one false input hides Object P. OR behaves differently.",
      footer: commonFooter,
    },
    37: {
      kind: "dynamic-text",
      snippet: "Dynamic text",
      heading: "A sentence that reads live values",
      badge: "x=2, y=7",
      initialValue: 2,
      min: 0,
      max: 5,
      step: 1,
      sliderLabel: "Dynamic text x",
      overlay: (x) => `When x = ${x}, the output 2x + 3 is ${2 * x + 3}.`,
      valueLabel: (x) => `y=${2 * x + 3}`,
      trace: (x) => [
        { label: "Template", value: "When x = {x}, the output 2x + 3 is {y}.", note: "Placeholders are linked, not typed copies." },
        { label: "Calculation", value: `y=2(${x})+3=${2 * x + 3}`, note: "The output placeholder uses this value." },
        { label: "Rendered", value: `x=${x}, y=${2 * x + 3}`, note: "The sentence updates as x changes." },
        { label: "Second preview", value: "x=4 -> y=11", note: "Linked values are not fixed." },
      ],
      table: () => [["x=2", "2(2)+3", "7"], ["x=4", "2(4)+3", "11"], ["template", "{x}, {y}", "live text"]],
      practice: { prompt: "What does the sentence show when x=4?", answer: "When x = 4, the output 2x + 3 is 11.", hint: "Update both placeholders." },
      guardrail: "Linked values are not fixed. Do not type a number into dynamic text when a placeholder should update.",
      footer: commonFooter,
    },
    38: {
      kind: "latex-display",
      snippet: "LaTeX display",
      heading: "Type source, preview mathematical notation",
      badge: "Preview ready",
      initialValue: 2,
      min: 2,
      max: 10,
      step: 8,
      sliderLabel: "Exponent preview",
      overlay: (power) => power === 10 ? "x^{10}+3x+2 -> x¹⁰ + 3x + 2" : "x^{2}+3x+2 -> x² + 3x + 2",
      valueLabel: (power) => `x^${power}`,
      trace: (power) => [
        { label: "Source", value: power === 10 ? "x^{10}+3x+2" : "x^{2}+3x+2", note: "Braces group the exponent." },
        { label: "Rendered", value: power === 10 ? "x¹⁰ + 3x + 2" : "x² + 3x + 2", note: "Preview before sharing." },
        { label: "Checklist", value: "balanced braces", note: "Braces balanced, exponent detected, plus signs spaced, preview ready." },
        { label: "Library", value: "Fraction, Square root, Integral", note: "Formula snippets reduce syntax mistakes." },
      ],
      table: () => [["x^2", "no braces needed", "x²"], ["x^{10}", "braces group 10", "x¹⁰"], ["preview", "balanced source", "ready"]],
      practice: { prompt: "Why use braces in x^{10}?", answer: "They make 10 the whole exponent.", hint: "Without braces, only the next character may be exponented." },
      guardrail: "Preview before sharing. Check that braces are balanced and the exponent group is highlighted.",
      footer: commonFooter,
    },
  };
  return specs[lessonId] ?? specs[19];
}

function algebraTableTitle(kind: RedesignedAlgebraKind) {
  if (kind === "variable-flow") return "Value table";
  if (kind === "animation") return "Frame table";
  if (kind === "workspace-flow") return "Test values table";
  if (kind === "integer-slider") return "Iteration table";
  if (kind === "redefinition") return "Dependent outputs";
  if (kind === "equation-input") return "Solve step-by-step";
  if (kind === "inequality-input") return "Test points";
  if (kind === "lists") return "List operation pipeline";
  if (kind === "matrices") return "Matrix audit";
  if (kind === "sequences") return "Term table";
  if (kind === "piecewise") return "Boundary tests";
  if (kind === "boolean-variables") return "Truth table";
  if (kind === "dynamic-text") return "Placeholder table";
  if (kind === "latex-display") return "Source-to-preview table";
  return "Compare linked values";
}

function renderRedesignedAlgebraVisual(spec: RedesignedAlgebraSpec, value: number, updateValue: (value: number) => void) {
  if (spec.kind === "workspace-flow" || spec.kind === "variable-flow") return <FlowVisual value={value} vertical={spec.kind === "variable-flow"} />;
  if (spec.kind === "numeric-slider" || spec.kind === "integer-slider") return <SliderVisual value={value} integer={spec.kind === "integer-slider"} />;
  if (spec.kind === "angle-slider") return <AngleVisual theta={value} />;
  if (spec.kind === "animation") return <AnimationVisual frame={value} updateValue={updateValue} />;
  if (spec.kind === "dependency") return <DependencyVisual bx={value} />;
  if (spec.kind === "visibility") return <VisibilityVisual x={value} />;
  if (spec.kind === "dynamic-label") return <DynamicLabelVisual px={value} />;
  if (spec.kind === "algebraic-input") return <AlgebraicInputVisual x={value} />;
  if (spec.kind === "redefinition") return <RedefinitionVisual active={value === 1} />;
  if (spec.kind === "equation-input") return <EquationInputVisual testX={value} />;
  if (spec.kind === "inequality-input") return <InequalityInputVisual testX={value} />;
  if (spec.kind === "lists") return <ListsVisual selectedIndex={value} />;
  if (spec.kind === "matrices") return <MatricesVisual />;
  if (spec.kind === "sequences") return <SequencesVisual selectedN={value} />;
  if (spec.kind === "piecewise") return <PiecewiseVisual x={value} />;
  if (spec.kind === "boolean-variables") return <BooleanVariablesVisual b={value === 1} />;
  if (spec.kind === "dynamic-text") return <DynamicTextVisual x={value} />;
  return <LatexFormulaVisual power={value} />;
}

function FlowVisual({ value, vertical }: { value: number; vertical: boolean }) {
  const cards = [
    ["Input", `x = ${value}`, "Given value"],
    ["Rule", "f(x) = 2x + 3", "Algebraic rule"],
    ["Substitute", `2(${value}) + 3`, `Replace x with ${value}`],
    ["Output", String(2 * value + 3), "Result (live)"],
  ];
  return (
    <div className={vertical ? "grid gap-3" : "grid gap-3 md:grid-cols-4"}>
      {cards.map(([label, val, note], index) => (
        <div key={label} className="relative rounded-3xl border border-slate-200 bg-white/95 p-4 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-sm font-black text-white">{index + 1}</span>
          <p className="mt-2 text-[10px] font-black uppercase text-slate-500">{label}</p>
          <p className="mt-1 font-mono text-2xl font-black text-slate-950 dark:text-white">{val}</p>
          <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">{note}</p>
          {index < cards.length - 1 ? <span className={vertical ? "absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl font-black text-cyan-700" : "absolute -right-3 top-1/2 hidden -translate-y-1/2 text-2xl font-black text-cyan-700 md:block"}>{"->"}</span> : null}
        </div>
      ))}
    </div>
  );
}

function SliderVisual({ value, integer }: { value: number; integer: boolean }) {
  const position = ((value + 5) / 10) * 100;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black text-slate-950 dark:text-white">{integer ? "Snap to whole numbers" : "Move the slider"}</p>
        <div className="relative mt-10 h-24">
          <div className="absolute left-4 right-4 top-8 h-2 rounded-full bg-slate-200" />
          {[-5, integer ? -4 : -2, 0, value, 5].map((tick) => (
            <span key={tick} className="absolute top-12 -translate-x-1/2 font-mono text-sm font-black" style={{ left: `${((tick + 5) / 10) * 100}%` }}>{formatNumber(tick)}</span>
          ))}
          {integer ? Array.from({ length: 11 }, (_, index) => <span key={index} className="absolute top-6 h-6 w-1 -translate-x-1/2 rounded-full bg-amber-400" style={{ left: `${index * 10}%` }} />) : null}
          <span className="absolute top-2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-cyan-600 font-mono text-xl font-black text-white shadow" style={{ left: `${position}%` }}>{formatNumber(value)}</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-cyan-50 p-3 text-center font-mono font-black text-cyan-900">y = 2x + 3</div>
          <div className="rounded-2xl bg-violet-50 p-3 text-center font-mono font-black text-violet-900">y = 2({formatNumber(value)}) + 3</div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-center font-mono font-black text-emerald-900">y = {formatNumber(2 * value + 3)}</div>
        </div>
      </div>
      <MiniLineGraph x={value} stepped={integer} />
    </div>
  );
}

function AngleVisual({ theta }: { theta: number }) {
  const r = (theta * Math.PI) / 180;
  const px = 140 + 90 * Math.cos(r);
  const py = 140 - 90 * Math.sin(r);
  const waveX = 28 + (theta / 360) * 300;
  const waveY = 105 - 70 * Math.sin(r);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Unit circle</p>
        <svg viewBox="0 0 280 280" className="mx-auto mt-2 w-full max-w-[360px]" role="img" aria-label={`Unit circle angle ${theta} degrees`}>
          <circle cx="140" cy="140" r="90" fill="rgba(14,165,233,.04)" stroke="#94a3b8" strokeWidth="2" />
          <line x1="40" y1="140" x2="240" y2="140" stroke="#334155" />
          <line x1="140" y1="240" x2="140" y2="40" stroke="#334155" />
          <line x1="140" y1="140" x2={px} y2={py} stroke="#0891b2" strokeWidth="4" />
          <circle cx={px} cy={py} r="7" fill="#0891b2" />
          <path d="M178 140 A38 38 0 0 0 159 107" fill="none" stroke="#7c3aed" strokeWidth="4" />
          <text x="178" y="126" fill="#7c3aed" fontWeight="900">{theta}°</text>
          <text x={px + 8} y={py - 8} fill="#0891b2" fontWeight="900">P({cosDeg(theta)}, {sinDeg(theta)})</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Sine wave: y = sin(theta)</p>
        <svg viewBox="0 0 360 210" className="mt-2 w-full" role="img" aria-label={`Sine wave marker at ${theta} degrees`}>
          <line x1="28" y1="105" x2="338" y2="105" stroke="#334155" />
          <path d="M28 105 C78 10 128 10 178 105 C228 200 278 200 328 105" fill="none" stroke="#7c3aed" strokeWidth="4" />
          <line x1={waveX} y1="105" x2={waveX} y2={waveY} stroke="#0891b2" strokeDasharray="5 4" />
          <circle cx={waveX} cy={waveY} r="7" fill="#0891b2" />
          <text x={waveX + 8} y={waveY - 8} fill="#0891b2" fontWeight="900">sin(theta)={sinDeg(theta)}</text>
          {[0, 90, 180, 270, 360].map((mark) => <text key={mark} x={28 + (mark / 360) * 300} y="130" textAnchor="middle" fontSize="12" fontWeight="800">{mark}°</text>)}
        </svg>
      </div>
    </div>
  );
}

function AnimationVisual({ frame, updateValue }: { frame: number; updateValue: (value: number) => void }) {
  const a = Number(frameA(frame));
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <MiniLineGraph x={2} slope={a} ghosts />
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Timeline</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          {[0, 1, 2, 3, 4, 5].map((nextFrame) => (
            <button key={nextFrame} type="button" className={frame === nextFrame ? "h-10 w-10 rounded-full bg-amber-500 font-black text-white" : "h-10 w-10 rounded-full border border-slate-200 bg-white font-black"} onClick={() => updateValue(nextFrame)}>{nextFrame}</button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button type="button" className="action-secondary justify-center" onClick={() => updateValue(Math.max(0, frame - 1))}>Step back</button>
          <button type="button" className="action-primary justify-center">Pause</button>
          <button type="button" className="action-secondary justify-center" onClick={() => updateValue(Math.min(5, frame + 1))}>Step forward</button>
        </div>
        <p className="mt-4 rounded-2xl bg-cyan-50 p-3 font-mono text-2xl font-black text-cyan-800">a = {frameA(frame)}</p>
      </div>
    </div>
  );
}

function DependencyVisual({ bx }: { bx: number }) {
  const mx = (1 + bx) / 2;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <svg viewBox="0 0 520 260" className="w-full" role="img" aria-label="Independent points A and B with dependent midpoint M">
          {Array.from({ length: 11 }, (_, i) => <line key={`v-${i}`} x1={40 + i * 42} x2={40 + i * 42} y1="20" y2="230" stroke="#e2e8f0" />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`h-${i}`} x1="30" x2="480" y1={30 + i * 30} y2={30 + i * 30} stroke="#e2e8f0" />)}
          <line x1="82" y1="140" x2={82 + (bx - 1) * 42} y2="140" stroke="#2563eb" strokeWidth="4" />
          <circle cx="82" cy="140" r="8" fill="#2563eb" /><text x="62" y="122" fill="#2563eb" fontWeight="900">A(1, 2)</text>
          <circle cx={82 + (bx - 1) * 42} cy="140" r="8" fill="#2563eb" /><text x={90 + (bx - 1) * 42} y="122" fill="#2563eb" fontWeight="900">B({bx}, 2)</text>
          <circle cx={82 + (mx - 1) * 42} cy="140" r="8" fill="#16a34a" /><text x={90 + (mx - 1) * 42} y="162" fill="#15803d" fontWeight="900">M({formatNumber(mx)}, 2)</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-black text-emerald-900">Dependency hierarchy</p>
        <div className="mt-3 grid gap-2 text-center font-mono font-black">
          <div className="rounded-2xl bg-white p-3">A, B</div>
          <div>{"->"}</div>
          <div className="rounded-2xl bg-white p-3">Segment AB</div>
          <div>{"->"}</div>
          <div className="rounded-2xl bg-white p-3">Midpoint M</div>
        </div>
      </div>
    </div>
  );
}

function VisibilityVisual({ x }: { x: number }) {
  const pos = ((x + 5) / 10) * 100;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Condition-based visibility on a number line</p>
        <div className="relative mt-6 h-28 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="absolute bottom-0 left-0 top-0 w-[70%] bg-rose-50" />
          <div className="absolute bottom-0 right-0 top-0 w-[30%] bg-emerald-50" />
          <div className="absolute left-6 right-6 top-14 h-1 bg-slate-700" />
          <span className="absolute top-8 h-12 w-1 -translate-x-1/2 bg-emerald-700" style={{ left: `${pos}%` }} />
          <span className="absolute top-4 -translate-x-1/2 rounded-xl bg-emerald-600 px-2 py-1 font-mono text-sm font-black text-white" style={{ left: `${pos}%` }}>{formatNumber(x)}</span>
          <span className="absolute left-[70%] top-12 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-slate-700 bg-white" />
          <span className="absolute left-[18%] top-4 text-xs font-black uppercase text-rose-700">Hidden region x &lt; 2</span>
          <span className="absolute right-[12%] top-4 text-xs font-black uppercase text-emerald-700">Visible region x &gt;= 2</span>
        </div>
      </div>
      <div className={x >= 2 ? "rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900" : "rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-900"}>
        <p className="font-black">{x >= 2 ? "Object P is visible" : "Object P is hidden"}</p>
        <p className="mt-3 text-5xl">{x >= 2 ? "★" : "○"}</p>
        <p className="mt-3 font-mono font-black">{formatNumber(x)} &gt;= 2 {"->"} {x >= 2 ? "TRUE" : "FALSE"}</p>
      </div>
    </div>
  );
}

function DynamicLabelVisual({ px }: { px: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <svg viewBox="0 0 420 260" className="w-full" role="img" aria-label={`Point P label at ${px}, 2`}>
          {Array.from({ length: 11 }, (_, i) => <line key={`v-${i}`} x1={30 + i * 36} x2={30 + i * 36} y1="20" y2="230" stroke="#e2e8f0" />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`h-${i}`} x1="20" x2="390" y1={30 + i * 30} y2={30 + i * 30} stroke="#e2e8f0" />)}
          <line x1="210" y1="20" x2="210" y2="230" stroke="#334155" /><line x1="20" y1="140" x2="390" y2="140" stroke="#334155" />
          <line x1="210" y1="140" x2={210 + px * 24} y2="92" stroke="#38bdf8" />
          <circle cx={210 + px * 24} cy="92" r="7" fill="#0891b2" />
          <rect x={230 + px * 10} y="35" width="170" height="48" rx="10" fill="white" stroke="#0891b2" />
          <text x={242 + px * 10} y="57" fontWeight="900">P = ({px}, 2),</text>
          <text x={242 + px * 10} y="75" fontWeight="900">distance = {distance(px, 2)}</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase text-emerald-700">Template to output</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono font-black">P = ({"{x}"}, {"{y}"}), distance = {"{d}"}</p>
        <p className="mt-3 text-center font-black">{"->"}</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono font-black text-emerald-800">P = ({px}, 2), distance = {distance(px, 2)}</p>
      </div>
    </div>
  );
}

function AlgebraicInputVisual({ x }: { x: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl border-2 border-blue-500 bg-white p-4 font-mono text-3xl font-black">f(x) = x^2 - 4</p>
        <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800">Valid expression</p>
        <MiniParabola />
      </div>
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
        <p className="font-black text-violet-900">Parsed structure</p>
        <p className="mt-3 font-mono">name: f</p>
        <p className="mt-2 font-mono">variable: x</p>
        <p className="mt-2 font-mono">operation: x^2 - 4</p>
        <p className="mt-4 rounded-2xl bg-white p-3 font-mono font-black">f({x}) = {x * x - 4}</p>
      </div>
    </div>
  );
}

function RedefinitionVisual({ active }: { active: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-blue-200 bg-white/95 p-4">
        <p className="font-black text-blue-800">Before: f(x)=x+1</p>
        <MiniLineGraph x={2} slope={1} intercept={1} />
        <p className="mt-3 font-mono font-black">A=f(2)=3, B=f(0)=1</p>
      </div>
      <div className={active ? "rounded-3xl border-2 border-violet-300 bg-violet-50 p-4" : "rounded-3xl border border-violet-200 bg-white/95 p-4"}>
        <p className="font-black text-violet-800">After: f(x)=x^2-1</p>
        <MiniParabola />
        <p className="mt-3 font-mono font-black">A=f(2)=3, B=f(0)=-1</p>
      </div>
    </div>
  );
}

function EquationInputVisual({ testX }: { testX: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl border-2 border-violet-500 bg-white p-4 font-mono text-3xl font-black text-violet-700">2x + 3 = 11</p>
        <p className="mt-3 rounded-2xl bg-emerald-50 p-3 font-black text-emerald-800">Valid equation: two sides detected</p>
        <div className="mt-4 grid gap-2 font-mono font-black">
          {["2x + 3 = 11", "2x = 8", "x = 4"].map((step, index) => <div key={step} className="rounded-2xl border border-violet-100 bg-violet-50 p-3">Step {index + 1}: {step}</div>)}
        </div>
        <p className={testX === 4 ? "mt-4 rounded-2xl bg-emerald-50 p-3 font-mono font-black text-emerald-800" : "mt-4 rounded-2xl bg-amber-50 p-3 font-mono font-black text-amber-900"}>Substitute x={testX}: 2({testX}) + 3 = {2 * testX + 3} {2 * testX + 3 === 11 ? "TRUE" : "FALSE"}</p>
      </div>
      <MiniLineGraph x={4} slope={2} intercept={3} horizontal={11} />
    </div>
  );
}

function InequalityInputVisual({ testX }: { testX: number }) {
  const trueRegionWidth = 58;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl border-2 border-cyan-500 bg-white p-4 font-mono text-3xl font-black text-cyan-800">2x + 3 &lt; 11</p>
        <div className="mt-4 grid gap-2 font-mono font-black">
          {["2x + 3 < 11", "2x < 8", "x < 4"].map((step, index) => <div key={step} className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3">Step {index + 1}: {step}</div>)}
        </div>
        <div className="relative mt-6 h-24 rounded-3xl border border-slate-200 bg-white">
          <div className="absolute left-6 right-6 top-11 h-1 rounded-full bg-slate-700" />
          <div className="absolute left-6 top-11 h-2 -translate-y-1/2 rounded-full bg-cyan-500" style={{ width: `${trueRegionWidth}%` }} />
          <span className="absolute left-[64%] top-7 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-cyan-600 bg-white" />
          {[0, 3, 4, 5, 6].map((tick) => <span key={tick} className="absolute top-14 -translate-x-1/2 font-mono text-sm font-black" style={{ left: `${8 + (tick / 6) * 84}%` }}>{tick}</span>)}
          <span className="absolute top-2 -translate-x-1/2 rounded-xl bg-amber-500 px-2 py-1 font-mono text-sm font-black text-white" style={{ left: `${8 + (testX / 6) * 84}%` }}>x={testX}</span>
        </div>
        <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-900">Open circle means 4 is not included.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">Compare y=2x+3 with y=11</p>
        <MiniLineGraph x={testX} slope={2} intercept={3} horizontal={11} />
      </div>
    </div>
  );
}

function ListsVisual({ selectedIndex }: { selectedIndex: number }) {
  const original = [2, 4, 6, 8];
  const final = [4, 12, 16, 20];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">List entries, positions, and operations</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {original.map((item, index) => (
            <div key={item} className={selectedIndex === index + 1 ? "rounded-2xl border-2 border-cyan-500 bg-cyan-50 p-3 text-center" : "rounded-2xl border border-slate-200 bg-white p-3 text-center"}>
              <span className="block text-[10px] font-black uppercase text-slate-500">index {index + 1}</span>
              <strong className="font-mono text-2xl">{item}</strong>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 font-mono text-sm font-black">
          {["append 10 -> [2, 4, 6, 8, 10]", "remove 4 -> [2, 6, 8, 10]", "sort asc -> [2, 6, 8, 10]", "map x -> 2x -> [4, 12, 16, 20]", "sum 52, mean 13"].map((step) => <p key={step} className="rounded-2xl bg-cyan-50 p-3 text-cyan-900">{step}</p>)}
        </div>
      </div>
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
        <p className="font-black text-violet-900">Final list [4, 12, 16, 20]</p>
        <div className="mt-4 flex h-40 items-end gap-3">
          {final.map((item) => <div key={item} className="flex flex-1 flex-col items-center gap-2"><span className="w-full rounded-t-2xl bg-violet-500" style={{ height: `${item * 5}px` }} /><strong className="font-mono">{item}</strong></div>)}
        </div>
        <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-violet-900">No graph needed: A list is an ordered collection.</p>
      </div>
    </div>
  );
}

function MatricesVisual() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-black">A = [[1, 2], [3, 4]]</p>
        <div className="mx-auto mt-4 grid max-w-[240px] grid-cols-2 gap-2 rounded-3xl border-4 border-slate-800 p-4">
          {[1, 2, 3, 4].map((entry) => <div key={entry} className={entry === 1 || entry === 4 ? "rounded-2xl bg-cyan-100 p-5 text-center font-mono text-3xl font-black text-cyan-900" : "rounded-2xl bg-slate-100 p-5 text-center font-mono text-3xl font-black"}>{entry}</div>)}
        </div>
        <p className="mt-3 text-center font-mono font-black">a22=4, trace(A)=1+4=5</p>
      </div>
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-black text-emerald-900">Transformation preview</p>
        <svg viewBox="0 0 260 220" className="mt-2 w-full" role="img" aria-label="Matrix transforms unit square to parallelogram">
          <line x1="25" y1="180" x2="240" y2="180" stroke="#334155" /><line x1="50" y1="200" x2="50" y2="20" stroke="#334155" />
          <polygon points="55,175 105,175 105,125 55,125" fill="#bfdbfe" stroke="#2563eb" strokeWidth="3" />
          <polygon points="145,175 195,115 220,55 170,115" fill="#bbf7d0" stroke="#16a34a" strokeWidth="3" />
          <text x="56" y="114" fontWeight="900">unit square</text>
          <text x="132" y="43" fontWeight="900" fill="#15803d">A[1,1]^T=[3,7]^T</text>
        </svg>
      </div>
    </div>
  );
}

function SequencesVisual({ selectedN }: { selectedN: number }) {
  const terms = [2, 5, 8, 11, 14, 17];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {terms.map((term, index) => <div key={term} className={selectedN === index + 1 ? "rounded-2xl border-2 border-cyan-500 bg-cyan-50 p-3 text-center" : "rounded-2xl border border-slate-200 bg-white p-3 text-center"}><span className="block text-[10px] font-black uppercase text-slate-500">a{index + 1}</span><strong className="font-mono text-2xl">{term}</strong></div>)}
      </div>
      <div className="relative mt-8 h-20">
        <div className="absolute left-6 right-6 top-8 h-1 rounded-full bg-slate-700" />
        {terms.map((term, index) => <span key={term} className="absolute top-2 -translate-x-1/2 rounded-full bg-amber-400 px-2 py-1 font-mono text-xs font-black" style={{ left: `${8 + index * 17}%` }}>{term}</span>)}
        {[1, 2, 3, 4, 5].map((jump) => <span key={jump} className="absolute top-12 text-xs font-black text-cyan-700" style={{ left: `${12 + (jump - 1) * 17}%` }}>+3</span>)}
      </div>
      <p className="rounded-2xl bg-cyan-50 p-3 text-center font-mono text-xl font-black text-cyan-900">a_n = 2 + (n-1)3; a{selectedN} = {2 + (selectedN - 1) * 3}</p>
    </div>
  );
}

function PiecewiseVisual({ x }: { x: number }) {
  const output = x < 0 ? x + 3 : 2 * x;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="font-mono text-xl font-black">f(x)=x+3 if x&lt;0</p>
        <p className="font-mono text-xl font-black">f(x)=2x if x&gt;=0</p>
        <svg viewBox="0 0 340 230" className="mt-2 w-full" role="img" aria-label="Piecewise graph with open and closed boundary points">
          <line x1="30" y1="170" x2="310" y2="170" stroke="#334155" /><line x1="170" y1="25" x2="170" y2="210" stroke="#334155" />
          <line x1="70" y1="120" x2="170" y2="80" stroke="#2563eb" strokeWidth="4" />
          <line x1="170" y1="170" x2="270" y2="90" stroke="#7c3aed" strokeWidth="4" />
          <circle cx="170" cy="80" r="8" fill="white" stroke="#2563eb" strokeWidth="4" />
          <circle cx="170" cy="170" r="8" fill="#7c3aed" />
          <circle cx={170 + x * 45} cy={170 - output * 20} r="7" fill="#f59e0b" />
          <text x="184" y="76" fill="#2563eb" fontWeight="900">open (0,3)</text>
          <text x="184" y="166" fill="#7c3aed" fontWeight="900">closed (0,0)</text>
        </svg>
      </div>
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-black text-amber-900">Active input</p>
        <p className="mt-3 rounded-2xl bg-white p-3 font-mono text-2xl font-black">x={x} {"->"} f({x})={output}</p>
        <p className="mt-3 text-sm font-black text-amber-900">Boundary symbols decide which point is filled.</p>
      </div>
    </div>
  );
}

function BooleanVariablesVisual({ b }: { b: boolean }) {
  const rows = [["true", "false", "false"], ["true", "true", "true"]];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4 text-center font-black text-emerald-900">A=true</div>
          <div className={b ? "rounded-2xl bg-emerald-50 p-4 text-center font-black text-emerald-900" : "rounded-2xl bg-rose-50 p-4 text-center font-black text-rose-900"}>B={b ? "true" : "false"}</div>
          <div className={b ? "rounded-2xl bg-emerald-50 p-4 text-center font-black text-emerald-900" : "rounded-2xl bg-rose-50 p-4 text-center font-black text-rose-900"}>Object P {b ? "visible" : "hidden"}</div>
        </div>
        <div className="mt-4 grid gap-2 font-mono font-black">
          <p className="rounded-2xl bg-white p-3">A AND B = {b ? "true" : "false"}</p>
          <p className="rounded-2xl bg-white p-3">A OR B = true</p>
          <p className="rounded-2xl bg-white p-3">NOT A = false</p>
        </div>
      </div>
      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
        <p className="font-black text-cyan-900">Truth table</p>
        <div className="mt-3 grid grid-cols-3 text-center font-mono font-black"><span>A</span><span>B</span><span>A AND B</span></div>
        {rows.map(([a, rowB, out]) => <div key={rowB} className={rowB === String(b) ? "mt-2 grid grid-cols-3 rounded-2xl bg-white p-3 text-center font-mono font-black ring-2 ring-cyan-500" : "mt-2 grid grid-cols-3 rounded-2xl bg-white p-3 text-center font-mono font-black"}><span>{a}</span><span>{rowB}</span><span>{out}</span></div>)}
      </div>
    </div>
  );
}

function DynamicTextVisual({ x }: { x: number }) {
  const y = 2 * x + 3;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl bg-slate-950 p-4 font-mono text-lg font-black text-white">When x = {"{x}"}, the output 2x + 3 is {"{y}"}.</p>
        <p className="mt-4 text-center text-2xl font-black text-cyan-900">When x = {x}, the output 2x + 3 is {y}.</p>
        <p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-center font-mono font-black text-cyan-900">y=2({x})+3={y}</p>
      </div>
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-black text-emerald-900">Connector placeholders</p>
        {["{x} -> current x", "{y} -> calculated output", "x=4 -> 11"].map((item) => <p key={item} className="mt-3 rounded-2xl bg-white p-3 font-mono font-black">{item}</p>)}
      </div>
    </div>
  );
}

function LatexFormulaVisual({ power }: { power: number }) {
  const source = power === 10 ? "x^{10}+3x+2" : "x^{2}+3x+2";
  const rendered = power === 10 ? "x¹⁰ + 3x + 2" : "x² + 3x + 2";
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <p className="rounded-2xl border-2 border-violet-500 bg-white p-4 font-mono text-2xl font-black">{source}</p>
        <p className="mt-4 rounded-2xl bg-violet-50 p-6 text-center text-4xl font-black text-violet-900">{rendered}</p>
        <p className="mt-3 rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Highlight group: {"{2}"} or {"{10}"}</p>
      </div>
      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
        <p className="font-black text-cyan-900">Checklist</p>
        {["Braces balanced", "Exponent detected", "Plus signs spaced", "Preview ready"].map((item) => <p key={item} className="mt-3 rounded-2xl bg-white p-3 font-black text-cyan-900">{item}</p>)}
        <p className="mt-3 text-sm font-black text-cyan-900">Formula library: Fraction, Square root, Integral</p>
      </div>
    </div>
  );
}

function MiniLineGraph({ x, stepped = false, slope = 2, intercept = 3, ghosts = false, horizontal }: { x: number; stepped?: boolean; slope?: number; intercept?: number; ghosts?: boolean; horizontal?: number }) {
  const px = 150 + x * 22;
  const y = slope * x + intercept;
  const py = 150 - y * 10;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="font-black">{stepped ? "Step plot" : "Visual on the graph"}</p>
      <svg viewBox="0 0 320 260" className="mt-2 w-full" role="img" aria-label={`Graph point ${formatNumber(x)}, ${formatNumber(y)}`}>
        <line x1="20" y1="150" x2="300" y2="150" stroke="#334155" /><line x1="150" y1="20" x2="150" y2="240" stroke="#334155" />
        {ghosts ? <><line x1="30" y1="135" x2="290" y2="70" stroke="#93c5fd" strokeWidth="3" strokeDasharray="6 5" /><line x1="30" y1="125" x2="290" y2="20" stroke="#bfdbfe" strokeWidth="3" strokeDasharray="2 5" /></> : null}
        {stepped ? <polyline points="-5,250 -5,230 -3,230 -3,210 -1,210 -1,190 1,190 1,170 3,170 3,150 5,150" transform="translate(150 -20) scale(22 .8)" fill="none" stroke="#2563eb" strokeWidth="4" /> : <line x1="30" y1={150 - (slope * -5 + intercept) * 10} x2="290" y2={150 - (slope * 6 + intercept) * 10} stroke="#2563eb" strokeWidth="4" />}
        {horizontal !== undefined ? <line x1="30" x2="290" y1={150 - horizontal * 10} y2={150 - horizontal * 10} stroke="#0ea5e9" strokeWidth="3" /> : null}
        <line x1={px} x2={px} y1={py} y2="150" stroke="#0ea5e9" strokeDasharray="4 4" /><line x1="150" x2={px} y1={py} y2={py} stroke="#0ea5e9" strokeDasharray="4 4" />
        <circle cx={px} cy={py} r="7" fill="#2563eb" />
        <text x={px + 8} y={py - 8} fill="#2563eb" fontWeight="900">({formatNumber(x)}, {formatNumber(y)})</text>
      </svg>
    </div>
  );
}

function MiniParabola() {
  return (
    <svg viewBox="0 0 340 220" className="mt-4 w-full" role="img" aria-label="Parabola y equals x squared minus 4">
      <line x1="20" y1="150" x2="320" y2="150" stroke="#334155" /><line x1="170" y1="20" x2="170" y2="205" stroke="#334155" />
      <path d="M50 20 C90 150 130 190 170 190 C210 190 250 150 290 20" fill="none" stroke="#2563eb" strokeWidth="4" />
      <circle cx="110" cy="150" r="6" fill="#2563eb" /><text x="78" y="140" fill="#2563eb" fontWeight="900">(-2,0)</text>
      <circle cx="230" cy="150" r="6" fill="#2563eb" /><text x="238" y="140" fill="#2563eb" fontWeight="900">(2,0)</text>
      <circle cx="170" cy="190" r="6" fill="#7c3aed" /><text x="178" y="203" fill="#7c3aed" fontWeight="900">(0,-4)</text>
    </svg>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function sinDeg(theta: number) {
  return Math.sin((theta * Math.PI) / 180).toFixed(3);
}

function cosDeg(theta: number) {
  return Math.cos((theta * Math.PI) / 180).toFixed(3);
}

function tanDeg(theta: number) {
  return Math.tan((theta * Math.PI) / 180).toFixed(3);
}

function frameA(frame: number) {
  return Math.min(2, frame * 0.5).toFixed(1);
}

function distance(x: number, y: number) {
  return Math.sqrt(x * x + y * y).toFixed(2);
}

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
