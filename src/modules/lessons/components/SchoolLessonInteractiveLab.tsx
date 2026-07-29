import { CheckCircle2, Gauge, Lightbulb, RotateCcw, SlidersHorizontal, Target } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import VisualizationTools from "../../../components/ui/VisualizationTools";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import SchoolProofMiniTool, { hasSchoolProofMiniTool } from "./SchoolProofMiniTool";

type LabModel = {
  family: "algebra" | "calculus" | "geometry" | "probability" | "statistics" | "trigonometry" | "vectors" | "number";
  title: string;
  formula: string;
  formulaNote: string;
  controlA: string;
  controlB: string;
  outputLabel: string;
  outputValue: string;
  secondaryOutput: string;
  visualLabel: string;
  challenge: string;
  expected: string;
  misconception: string;
  teacherMove: string;
  story: string;
};

export default function SchoolLessonInteractiveLab({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [showReason, setShowReason] = useState(false);
  const visualRef = useRef<HTMLElement>(null);
  const model = useMemo(() => createLabModel(lesson, a, b), [lesson, a, b]);

  if (hasSchoolProofMiniTool(lesson)) return <SchoolProofMiniTool lesson={lesson} />;

  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75" aria-label="Interactive lesson lab">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300"><SlidersHorizontal className="h-4 w-4" />Interactive lab</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{model.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{model.story}</p>
        </div>
        <button type="button" className="action-secondary" onClick={() => { setA(4); setB(3); setShowReason(false); }}><RotateCcw className="h-4 w-4" />Reset lab</button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.25fr)]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <Slider label={model.controlA} value={a} min={1} max={10} onChange={setA} />
          <Slider label={model.controlB} value={b} min={1} max={10} onChange={setB} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Metric label={model.outputLabel} value={model.outputValue} />
            <Metric label="Linked observation" value={model.secondaryOutput} />
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-white p-3 dark:border-cyan-300/20 dark:bg-slate-950/70">
            <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">Formula link</p>
            <div className="mt-2 overflow-x-auto rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/10"><MathExpression value={model.formula} /></div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{model.formulaNote}</p>
          </div>
        </div>

        <div className="space-y-3">
          <section ref={visualRef} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase text-slate-700 dark:text-slate-200"><Gauge className="h-4 w-4 text-cyan-600" />{model.visualLabel}</h3>
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{lesson.metadata.lessonType}</span>
            </div>
            <VisualizationTools title={`${lesson.title} ${model.visualLabel}`} targetRef={visualRef}>
              <ConceptVisual model={model} a={a} b={b} />
            </VisualizationTools>
          </section>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Lightbulb className="h-4 w-4" />Common mistake</h3>
              <p className="mt-2 text-sm font-semibold leading-6">{model.misconception}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Target className="h-4 w-4" />Board-style check</h3>
              <p className="mt-2 text-sm font-semibold leading-6">{model.challenge}</p>
              <button type="button" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-500" onClick={() => setShowReason((value) => !value)}>
                <CheckCircle2 className="h-4 w-4" />{showReason ? "Hide answer" : "Show answer"}
              </button>
              {showReason ? <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm font-black text-emerald-900 dark:bg-slate-950/40 dark:text-emerald-100">{model.expected}</p> : null}
            </div>
          </div>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">{model.teacherMove}</p>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-xs font-black uppercase text-slate-600 dark:text-slate-300"><span>{label}</span><span>{value}</span></span>
      <input className="mt-2 w-full accent-cyan-600" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function ConceptVisual({ model, a, b }: { model: LabModel; a: number; b: number }) {
  const left = Math.max(8, Math.min(96, a * 9));
  const right = Math.max(8, Math.min(96, b * 9));
  const combined = Math.max(10, Math.min(100, (a + b) * 5));
  return (
    <div className="mt-4 space-y-3">
      <div className="grid h-44 grid-cols-10 items-end gap-1 rounded-2xl bg-slate-50 p-4 dark:bg-white/5" aria-label={`${model.family} visual model`}>
        {Array.from({ length: 10 }, (_, index) => {
          const height = model.family === "calculus" ? Math.max(10, ((index + 1) ** 2 / 100) * combined) : index % 2 === 0 ? left : right;
          return <span key={index} className="rounded-t-lg bg-cyan-500/80" style={{ height: `${height}%` }} />;
        })}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <VisualChip label="First value" value={String(a)} />
        <VisualChip label="Second value" value={String(b)} />
        <VisualChip label="Combined signal" value={String(a + b)} />
      </div>
    </div>
  );
}

function VisualChip({ label, value }: { label: string; value: string }) {
  return <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{label}: {value}</span>;
}

function createLabModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const text = `${lesson.title} ${lesson.metadata.conceptFamily}`.toLowerCase();
  if (/probability|bayes|event|random|distribution|permutation|combination/.test(text)) return probabilityModel(lesson, a, b);
  if (/calculus|limit|derivative|integral|continuity|rolle|mean value|differential/.test(text)) return calculusModel(lesson, a, b);
  if (/trig|sine|cosine|tangent|angle|circle/.test(text)) return trigonometryModel(lesson, a, b);
  if (/vector|matrix|determinant|direction cosine|3d|plane|line/.test(text)) return vectorModel(lesson, a, b);
  if (/mean|median|mode|quartile|statistics|data|histogram|variance/.test(text)) return statisticsModel(lesson, a, b);
  if (/geometry|euclid|triangle|congruence|similar|construction|quadrilateral|area|volume|mensuration/.test(text)) return geometryModel(lesson, a, b);
  if (/algebra|equation|polynomial|identity|function|sequence|series|linear|quadratic/.test(text)) return algebraModel(lesson, a, b);
  return numberModel(lesson, a, b);
}

function probabilityModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const total = a + b + 2;
  const probability = a / total;
  return baseModel(lesson, "probability", "Probability balance board", "P(A)=\\frac{favourable}{total}", "Move favourable cases and total cases to see probability as a ratio.", "Favourable cases", "Other cases", "Probability", probability.toFixed(3), `Complement ${(1 - probability).toFixed(3)}`, "Sample-space bars", `Find P(A) when favourable=${a} and total=${total}.`, `P(A)=${a}/${total}=${probability.toFixed(3)}`, "Do not add probabilities unless the events are disjoint and the sample space is clear.");
}

function calculusModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const x = a;
  const h = b / 10;
  const slope = 2 * x + h;
  return baseModel(lesson, "calculus", "Limit and rate explorer", "\\frac{f(x+h)-f(x)}{h}", "Shrink h to watch a secant slope approach the tangent slope.", "Point x", "Step h x10", "Secant slope", slope.toFixed(2), `Target derivative ${(2 * x).toFixed(2)}`, "Changing-slope columns", `For f(x)=x^2, estimate the slope at x=${x} with h=${h.toFixed(1)}.`, `Secant slope = ${slope.toFixed(2)}; as h approaches 0, it approaches ${(2 * x).toFixed(2)}.`, "Do not treat one large secant step as the final derivative.");
}

function geometryModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const area = (a * b) / 2;
  return baseModel(lesson, "geometry", "Invariant geometry studio", "A=\\frac{1}{2}bh", "Change base and height while the relationship stays visible.", "Base", "Height", "Triangle area", area.toFixed(1), `Rectangle area ${a * b}`, "Area comparison model", `Find the area of a triangle with base ${a} and height ${b}.`, `Area = 1/2 x ${a} x ${b} = ${area.toFixed(1)} square units.`, "Do not use a slant side as height; height must be perpendicular to the base.");
}

function algebraModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const output = a * 2 + b;
  return baseModel(lesson, "algebra", "Function machine", "f(x)=mx+c", "Adjust the rule and inspect how each input maps to an output.", "Multiplier m", "Constant c", "f(2)", String(output), `Rate of change ${a}`, "Input-output table", `For f(x)=${a}x+${b}, find f(2).`, `f(2)=${a} x 2 + ${b} = ${output}.`, "Do not combine unlike terms; substitute first, then simplify.");
}

function trigonometryModel(lesson: SchoolSyllabusLesson, a: number, _b: number): LabModel {
  const angle = a * 9;
  const sine = Math.sin((angle * Math.PI) / 180);
  return baseModel(lesson, "trigonometry", "Angle ratio explorer", "\\sin\\theta=\\frac{opposite}{hypotenuse}", "Move the angle and compare the ratio with the visual height.", "Angle step", "Scale", "sin(theta)", sine.toFixed(3), `Angle ${angle} deg`, "Ratio bars", `Estimate sin(${angle} deg).`, `sin(${angle} deg) is about ${sine.toFixed(3)}.`, "Do not confuse sine with cosine; sine tracks the vertical/opposite side.");
}

function vectorModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const magnitude = Math.hypot(a, b);
  return baseModel(lesson, "vectors", "Vector component lab", "\\|v\\|=\\sqrt{x^2+y^2}", "Change components and watch magnitude and direction update together.", "x component", "y component", "Magnitude", magnitude.toFixed(2), `Dot with (1,1): ${a + b}`, "Component bars", `Find the magnitude of vector (${a}, ${b}).`, `Magnitude = sqrt(${a}^2 + ${b}^2) = ${magnitude.toFixed(2)}.`, "Do not add components directly when the question asks for length.");
}

function statisticsModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const values = [a, b, a + b];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return baseModel(lesson, "statistics", "Data balance lab", "\\bar{x}=\\frac{\\sum x}{n}", "Move data values and see the average as a balance point.", "Data value A", "Data value B", "Mean", mean.toFixed(2), `Range ${Math.max(...values) - Math.min(...values)}`, "Distribution bars", `Find the mean of ${values.join(", ")}.`, `Mean = (${values.join(" + ")})/3 = ${mean.toFixed(2)}.`, "Do not read the tallest bar as the mean; mean depends on all values.");
}

function numberModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const ratio = a / b;
  return baseModel(lesson, "number", "Number relationship lab", "\\frac{a}{b}=a\\div b", "Move the two quantities and read the relationship as a ratio, decimal, and comparison.", "Quantity a", "Quantity b", "a divided by b", ratio.toFixed(3), `Difference ${a - b}`, "Ratio bars", `Write ${a}:${b} as a decimal.`, `${a}:${b} = ${a}/${b} = ${ratio.toFixed(3)}.`, "Do not compare only by subtraction when the concept asks for a multiplicative relationship.");
}

function baseModel(
  lesson: SchoolSyllabusLesson,
  family: LabModel["family"],
  title: string,
  formula: string,
  formulaNote: string,
  controlA: string,
  controlB: string,
  outputLabel: string,
  outputValue: string,
  secondaryOutput: string,
  visualLabel: string,
  challenge: string,
  expected: string,
  misconception: string,
): LabModel {
  return {
    family,
    title,
    formula,
    formulaNote,
    controlA,
    controlB,
    outputLabel,
    outputValue,
    secondaryOutput,
    visualLabel,
    challenge,
    expected,
    misconception,
    teacherMove: `Best classroom move: ask learners to predict the change, move exactly one control, then explain ${lesson.title} using the displayed formula and the ${visualLabel.toLowerCase()}.`,
    story: `${lesson.title} becomes easier when learners can move inputs, see the representation update, and connect the result to the syllabus term used in ${lesson.metadata.academicLevel.replace("_", " ")}.`,
  };
}
