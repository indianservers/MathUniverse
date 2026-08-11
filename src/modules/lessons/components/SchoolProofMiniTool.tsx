import { CheckCircle2, GitFork, Lightbulb, RotateCcw, Scale, SlidersHorizontal, Target } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import VisualizationTools from "../../../components/ui/VisualizationTools";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";

export type SchoolProofToolMode = "polynomial" | "classifier" | "parallel-angles" | "triangle-angles" | "congruence" | "quadrilateral" | "heron" | "circle" | "induction" | "conic-tangent" | "calculus-theorem" | "cofactor" | "probability-theorem";

type ProofToolConfig = {
  mode: SchoolProofToolMode;
  title: string;
  theorem: string;
  formula: string;
  given: string[];
  prove: string;
  steps: string[];
  invalidStep: string;
  misconception: string;
};

export const phaseOneSchoolProofToolTitles = [
  "Remainder Reasoning",
  "Scale Factor in Maps and Recipes",
  "Remainder Theorem",
  "Factor Theorem",
  "Polynomial Factorisation Practice",
  "Definitions Axioms and Postulates",
  "Euclid's Five Postulates",
  "Equivalent Forms of the Fifth Postulate",
  "Axiom versus Theorem",
  "Proof Structure and Logical Statements",
  "Vertically Opposite Angles",
  "Linear Pair Axiom and Converse",
  "Corresponding Angles",
  "Alternate Interior Angles",
  "Interior Angles on the Same Side",
  "Parallel Line Converse Theorems",
  "Triangle Angle Sum Theorem",
  "Exterior Angle Theorem",
] as const;

export const phaseTwoSchoolProofToolTitles = [
  "SAS Congruence",
  "ASA Congruence",
  "AAS Congruence",
  "SSS Congruence",
  "RHS Congruence",
  "Equal Sides and Equal Angles",
  "Parallelogram Opposite Sides",
  "Parallelogram Opposite Angles",
  "Parallelogram Diagonals",
  "Conditions for a Quadrilateral to Be a Parallelogram",
  "Midpoint Theorem",
  "Converse of Midpoint Theorem",
  "Heron's Formula Derivation",
  "Equal Chords and Equal Angles",
  "Angles in the Same Segment",
  "Cyclic Quadrilateral",
  "Opposite Angles of a Cyclic Quadrilateral",
  "Tangent Perpendicular to Radius",
  "Tangent Lengths from an External Point",
] as const;

export const phaseThreeSchoolProofToolTitles = [
  "Logic of Mathematical Induction",
  "Sum Formula by Induction",
  "Divisibility by Induction",
  "Inequality by Induction",
  "Strong Induction Introduction",
  "Tangent to a Parabola",
  "Tangent to an Ellipse",
  "Tangent to a Hyperbola",
  "Rolle's Theorem",
  "Lagrange Mean Value Theorem",
  "Tangents and Normals",
  "Minors and Cofactors",
  "Total Probability Theorem",
  "Bayes' Theorem",
] as const;

const phaseOneTitleSet = new Set<string>(phaseOneSchoolProofToolTitles);
const phaseTwoTitleSet = new Set<string>(phaseTwoSchoolProofToolTitles);
const phaseThreeTitleSet = new Set<string>(phaseThreeSchoolProofToolTitles);

export function hasPhaseOneSchoolProofTool(lesson: SchoolSyllabusLesson) {
  return phaseOneTitleSet.has(lesson.title);
}

export function hasPhaseTwoSchoolProofTool(lesson: SchoolSyllabusLesson) {
  return phaseTwoTitleSet.has(lesson.title);
}

export function hasPhaseThreeSchoolProofTool(lesson: SchoolSyllabusLesson) {
  return phaseThreeTitleSet.has(lesson.title);
}

export function hasSchoolProofMiniTool(lesson: SchoolSyllabusLesson) {
  return hasPhaseOneSchoolProofTool(lesson) || hasPhaseTwoSchoolProofTool(lesson) || hasPhaseThreeSchoolProofTool(lesson);
}

export function schoolProofToolConfigFor(lesson: SchoolSyllabusLesson): ProofToolConfig | null {
  if (!hasSchoolProofMiniTool(lesson)) return null;
  if (/remainder theorem|factor theorem|polynomial factorisation/i.test(lesson.title)) return polynomialConfig(lesson);
  if (/vertically|linear pair|corresponding|alternate|interior angles|parallel line/i.test(lesson.title)) return parallelConfig(lesson);
  if (/triangle angle sum|exterior angle/i.test(lesson.title)) return triangleConfig(lesson);
  if (/congruence|equal sides/i.test(lesson.title)) return congruenceConfig(lesson);
  if (/parallelogram|midpoint theorem/i.test(lesson.title)) return quadrilateralConfig(lesson);
  if (/heron/i.test(lesson.title)) return heronConfig(lesson);
  if (/induction/i.test(lesson.title)) return inductionConfig(lesson);
  if (/tangent to a parabola|tangent to an ellipse|tangent to a hyperbola/i.test(lesson.title)) return conicTangentConfig(lesson);
  if (/rolle|mean value|tangents and normals/i.test(lesson.title)) return calculusTheoremConfig(lesson);
  if (/minors and cofactors/i.test(lesson.title)) return cofactorConfig(lesson);
  if (/total probability|bayes/i.test(lesson.title)) return probabilityTheoremConfig(lesson);
  if (/chords|segment|cyclic|tangent|circle/i.test(`${lesson.title} ${lesson.metadata.conceptFamily}`)) return circleConfig(lesson);
  return classifierConfig(lesson);
}

export default function SchoolProofMiniTool({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const config = schoolProofToolConfigFor(lesson);
  if (!config) return null;
  if (config.mode === "polynomial") return <PolynomialProofTool lesson={lesson} config={config} />;
  if (config.mode === "parallel-angles") return <ParallelAnglesProofTool lesson={lesson} config={config} />;
  if (config.mode === "triangle-angles") return <TriangleAnglesProofTool lesson={lesson} config={config} />;
  if (config.mode === "congruence") return <CongruenceProofTool lesson={lesson} config={config} />;
  if (config.mode === "quadrilateral") return <QuadrilateralProofTool lesson={lesson} config={config} />;
  if (config.mode === "heron") return <HeronProofTool lesson={lesson} config={config} />;
  if (config.mode === "circle") return <CircleProofTool lesson={lesson} config={config} />;
  if (config.mode === "induction") return <InductionProofTool lesson={lesson} config={config} />;
  if (config.mode === "conic-tangent") return <ConicTangentProofTool lesson={lesson} config={config} />;
  if (config.mode === "calculus-theorem") return <CalculusTheoremProofTool lesson={lesson} config={config} />;
  if (config.mode === "cofactor") return <CofactorProofTool lesson={lesson} config={config} />;
  if (config.mode === "probability-theorem") return <ProbabilityTheoremProofTool lesson={lesson} config={config} />;
  return <ClassifierProofTool lesson={lesson} config={config} />;
}

function ProofShell({ lesson, config, children, onReset }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig; children: JSX.Element; onReset: () => void }) {
  const proofRef = useRef<HTMLElement>(null);

  return (
    <section ref={proofRef} className="rounded-3xl border border-violet-100 bg-white p-4 shadow-xl shadow-violet-950/5 dark:border-white/10 dark:bg-slate-950/75" aria-label="Exact proof mini tool" data-proof-tool={config.mode}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300"><GitFork className="h-4 w-4" />Exact proof mini tool</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{config.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.title} now uses a lesson-specific proof lab with exact theorem language, diagram evidence, and a reasoned board-style check.</p>
        </div>
        <button type="button" className="action-secondary" onClick={onReset}><RotateCcw className="h-4 w-4" />Reset proof</button>
      </div>

      <VisualizationTools title={`${lesson.title} proof tool`} targetRef={proofRef}>
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.25fr)]">
          <aside className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <InfoBlock label="Theorem statement" value={config.theorem} />
            <div className="rounded-2xl border border-violet-100 bg-white p-3 dark:border-violet-300/20 dark:bg-slate-950/70">
              <p className="text-xs font-black uppercase text-violet-600 dark:text-violet-300">Exact formula / relation</p>
              <div className="mt-2 overflow-x-auto rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/10"><MathExpression value={config.formula} /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
              <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Given</p>
              <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                {config.given.map((item) => <li key={item}>- {item}</li>)}
              </ul>
              <p className="mt-3 text-xs font-black uppercase text-slate-500 dark:text-slate-400">To prove</p>
              <p className="mt-1 text-sm font-black text-slate-800 dark:text-slate-100">{config.prove}</p>
            </div>
          </aside>
          {children}
        </div>
      </VisualizationTools>
    </section>
  );
}

function PolynomialProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [a, setA] = useState(2);
  const [show, setShow] = useState(false);
  const value = a ** 3 - 3 * a + 2;
  const quotientText = useMemo(() => syntheticDivisionText(a), [a]);
  const reset = () => { setA(2); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Test value a" value={a} min={-4} max={4} onChange={setA} />
        <div className="grid gap-2 sm:grid-cols-3">
          <Metric label="Polynomial" value="p(x)=x^3-3x+2" />
          <Metric label="p(a)" value={String(value)} />
          <Metric label="Conclusion" value={value === 0 ? "(x-a) is a factor" : "remainder is p(a)"} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase text-slate-700 dark:text-slate-200"><Scale className="h-4 w-4 text-violet-600" />Division evidence</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{quotientText}</p>
          <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        </div>
        <CheckPanel challenge={`For p(x)=x^3-3x+2 and a=${a}, what is the remainder on division by x-${a}?`} answer={`Remainder = p(${a}) = ${value}. ${value === 0 ? "So x-" + a + " is a factor." : ""}`} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function ClassifierProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const statements = [
    { text: "A line segment can be drawn joining any two points.", type: "Postulate" },
    { text: "Vertically opposite angles are equal.", type: "Theorem" },
    { text: "A point has position but no size.", type: "Definition" },
    { text: "If two lines never meet, corresponding angles must be equal without any parallel condition.", type: "Invalid inference" },
  ];
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("Definition");
  const current = statements[index];
  const reset = () => { setIndex(0); setChoice("Definition"); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Statement classifier</h3>
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-lg font-black text-slate-900 dark:bg-white/10 dark:text-white">{current.text}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {["Definition", "Postulate", "Theorem", "Invalid inference"].map((item) => (
              <button key={item} type="button" onClick={() => setChoice(item)} className={choice === item ? "rounded-xl bg-violet-600 px-3 py-2 text-sm font-black text-white" : "rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 dark:bg-white/10 dark:text-slate-200"}>{item}</button>
            ))}
          </div>
          <p className={choice === current.type ? "status-good mt-3" : "status-neutral mt-3"}>{choice === current.type ? "Correct classification." : "Choose the exact role this statement plays in a proof."}</p>
          <button type="button" className="action-secondary mt-3" onClick={() => setIndex((value) => (value + 1) % statements.length)}>Next statement</button>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="Why can an axiom/postulate start a proof without proof inside the same system?" answer="It is accepted as a starting rule of the system; theorems are then derived from definitions, postulates, and earlier theorems." show={choice === current.type} setShow={() => undefined} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function ParallelAnglesProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [angle, setAngle] = useState(62);
  const [show, setShow] = useState(false);
  const pairValue = parallelAngleValue(lesson.title, angle);
  const reset = () => { setAngle(62); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Base angle" value={angle} min={25} max={155} onChange={setAngle} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase text-slate-700 dark:text-slate-200"><SlidersHorizontal className="h-4 w-4 text-violet-600" />Parallel-line diagram</h3>
          <ParallelSvg angle={angle} />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Metric label="Marked angle" value={`${angle} deg`} />
            <Metric label="Linked angle" value={`${pairValue} deg`} />
            <Metric label="Reason" value={parallelReason(lesson.title)} />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge={`If the marked angle is ${angle} deg, what value should the theorem highlight?`} answer={`${pairValue} deg, because ${parallelReason(lesson.title).toLowerCase()}.`} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function TriangleAnglesProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [a, setA] = useState(52);
  const [b, setB] = useState(68);
  const [show, setShow] = useState(false);
  const c = 180 - a - b;
  const exterior = a + b;
  const reset = () => { setA(52); setB(68); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Angle A" value={a} min={25} max={110} onChange={(value) => setA(Math.min(value, 150 - b))} />
        <Slider label="Angle B" value={b} min={25} max={110} onChange={(value) => setB(Math.min(value, 150 - a))} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Triangle proof diagram</h3>
          <TriangleSvg />
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <Metric label="Angle A" value={`${a} deg`} />
            <Metric label="Angle B" value={`${b} deg`} />
            <Metric label="Angle C" value={`${c} deg`} />
            <Metric label="Exterior" value={`${exterior} deg`} />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge={lesson.title.includes("Exterior") ? "What is the exterior angle?" : "What is A+B+C?"} answer={lesson.title.includes("Exterior") ? `Exterior angle = ${a}+${b} = ${exterior} deg.` : `A+B+C = ${a}+${b}+${c} = 180 deg.`} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function CongruenceProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [criterion, setCriterion] = useState("SAS");
  const [show, setShow] = useState(false);
  const expected = congruenceCriterion(lesson.title);
  const reset = () => { setCriterion("SAS"); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Congruence matcher</h3>
          <CongruenceSvg />
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {["SAS", "ASA", "AAS", "SSS", "RHS"].map((item) => (
              <button key={item} type="button" onClick={() => setCriterion(item)} className={criterion === item ? "rounded-xl bg-violet-600 px-3 py-2 text-sm font-black text-white" : "rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 dark:bg-white/10 dark:text-slate-200"}>{item}</button>
            ))}
          </div>
          <p className={criterion === expected ? "status-good mt-3" : "status-neutral mt-3"}>{criterion === expected ? `Correct: ${expected} matches the marked evidence.` : "Select the congruence test justified by the marked evidence."}</p>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="Which congruence criterion is valid for the displayed evidence?" answer={`${expected} is valid. Matching parts must be in corresponding order before writing the congruence statement.`} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function QuadrilateralProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [skew, setSkew] = useState(38);
  const [show, setShow] = useState(false);
  const reset = () => { setSkew(38); setShow(false); };
  const isMidpoint = lesson.title.includes("Midpoint");

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label={isMidpoint ? "Triangle spread" : "Parallelogram skew"} value={skew} min={10} max={80} onChange={setSkew} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">{isMidpoint ? "Midpoint relation" : "Parallelogram invariant"}</h3>
          {isMidpoint ? <MidpointSvg skew={skew} /> : <ParallelogramSvg skew={skew} />}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Metric label="Opposite sides" value={isMidpoint ? "not the focus" : "equal and parallel"} />
            <Metric label="Diagonals" value={lesson.title.includes("Diagonals") ? "bisect each other" : "tracked"} />
            <Metric label="Mid-segment" value={isMidpoint ? "parallel and half base" : "derived by triangles"} />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge={isMidpoint ? "What does the midpoint theorem prove?" : "Which invariant stays true as the shape moves?"} answer={isMidpoint ? "The segment joining midpoints of two sides of a triangle is parallel to the third side and half its length." : config.prove} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function HeronProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(6);
  const [c, setC] = useState(7);
  const [show, setShow] = useState(false);
  const s = (a + b + c) / 2;
  const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
  const reset = () => { setA(5); setB(6); setC(7); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Slider label="Side a" value={a} min={3} max={10} onChange={setA} />
          <Slider label="Side b" value={b} min={3} max={10} onChange={setB} />
          <Slider label="Side c" value={c} min={3} max={10} onChange={setC} />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Metric label="Semiperimeter s" value={formatNumber(s)} />
          <Metric label="Heron radicand" value={formatNumber(s * (s - a) * (s - b) * (s - c))} />
          <Metric label="Area" value={formatNumber(area)} />
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="Use Heron's formula for the current side lengths." answer={`s=${formatNumber(s)}, area=sqrt(s(s-a)(s-b)(s-c))=${formatNumber(area)}.`} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function CircleProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [angle, setAngle] = useState(54);
  const [show, setShow] = useState(false);
  const reset = () => { setAngle(54); setShow(false); };
  const linked = circleLinkedValue(lesson.title, angle);

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Reference angle" value={angle} min={20} max={120} onChange={setAngle} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Circle theorem diagram</h3>
          <CircleSvg title={lesson.title} />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Metric label="Reference" value={`${angle} deg`} />
            <Metric label="Linked result" value={linked} />
            <Metric label="Theorem type" value={circleKind(lesson.title)} />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="State the exact circle theorem used by the marked diagram." answer={config.theorem} show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function InductionProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [n, setN] = useState(5);
  const [show, setShow] = useState(false);
  const sum = (n * (n + 1)) / 2;
  const reset = () => { setN(5); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Test n" value={n} min={1} max={12} onChange={setN} />
        <div className="grid gap-2 sm:grid-cols-4">
          <Metric label="Base case" value="P(1)" />
          <Metric label="Hypothesis" value="assume P(k)" />
          <Metric label="Step" value="prove P(k+1)" />
          <Metric label="Example sum" value={String(sum)} />
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="Name the required parts of an induction proof." answer="Base case, induction hypothesis, induction step, and conclusion for all allowed n." show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function ConicTangentProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [t, setT] = useState(2);
  const [show, setShow] = useState(false);
  const reset = () => { setT(2); setShow(false); };
  const equation = conicTangentEquation(lesson.title, t);

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Point parameter" value={t} min={1} max={5} onChange={setT} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Conic tangent view</h3>
          <ConicSvg title={lesson.title} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Metric label="Tangent equation" value={equation} />
            <Metric label="Check" value="one-point contact" />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="What must a tangent line do at the point of contact?" answer="It must meet the conic at the chosen point with the correct slope/contact condition, not cut it as a secant." show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function CalculusTheoremProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [left, setLeft] = useState(1);
  const [right, setRight] = useState(5);
  const [show, setShow] = useState(false);
  const secantSlope = lesson.title.includes("Rolle") ? 0 : left + right;
  const reset = () => { setLeft(1); setRight(5); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Left endpoint a" value={left} min={-4} max={4} onChange={(value) => setLeft(Math.min(value, right - 1))} />
        <Slider label="Right endpoint b" value={right} min={-3} max={8} onChange={(value) => setRight(Math.max(value, left + 1))} />
        <div className="grid gap-2 sm:grid-cols-3">
          <Metric label="Continuity" value="required on [a,b]" />
          <Metric label="Differentiability" value="required on (a,b)" />
          <Metric label="Target slope" value={String(secantSlope)} />
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="Which conditions must be checked before using the theorem?" answer="Continuity on the closed interval and differentiability on the open interval; Rolle also needs equal endpoint values." show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function CofactorProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [row, setRow] = useState(1);
  const [show, setShow] = useState(false);
  const reset = () => { setRow(1); setShow(false); };
  const matrix = [[2, 1, 3], [0, 4, 5], [1, -2, 2]];
  const determinant = determinant3(matrix);

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Expansion row" value={row} min={1} max={3} onChange={setRow} />
        <div className="grid gap-2 sm:grid-cols-3">
          {matrix[row - 1].map((value, index) => <Metric key={index} label={`a${row}${index + 1}`} value={String(value)} />)}
        </div>
        <Metric label="Determinant" value={String(determinant)} />
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="How is a cofactor different from a minor?" answer="The cofactor includes the sign factor (-1)^(i+j) times the minor determinant." show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function ProbabilityTheoremProofTool({ lesson, config }: { lesson: SchoolSyllabusLesson; config: ProofToolConfig }) {
  const [prior, setPrior] = useState(30);
  const [likelihood, setLikelihood] = useState(80);
  const [show, setShow] = useState(false);
  const denominator = prior * likelihood + (100 - prior) * 20;
  const bayes = denominator === 0 ? 0 : (prior * likelihood) / denominator;
  const reset = () => { setPrior(30); setLikelihood(80); setShow(false); };

  return (
    <ProofShell lesson={lesson} config={config} onReset={reset}>
      <div className="space-y-3">
        <Slider label="Prior P(A) %" value={prior} min={5} max={95} onChange={setPrior} />
        <Slider label="Likelihood P(B|A) %" value={likelihood} min={10} max={95} onChange={setLikelihood} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Probability tree</h3>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500 dark:text-slate-300">tree diagram visual model</p>
          <ProbabilityTreeSvg />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Metric label="Numerator" value={`${prior * likelihood}`} />
            <Metric label="Denominator" value={String(denominator)} />
            <Metric label="Bayes value" value={formatNumber(bayes)} />
          </div>
        </div>
        <ProofSteps steps={config.steps} invalidStep={config.invalidStep} />
        <CheckPanel challenge="What does Bayes' denominator represent?" answer="It is the total probability of the evidence B across every partition case." show={show} setShow={setShow} misconception={config.misconception} />
      </div>
    </ProofShell>
  );
}

function ProofSteps({ steps, invalidStep }: { steps: string[]; invalidStep: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
      <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-200">Reasoned proof steps</h3>
      <ol className="mt-3 space-y-2">
        {steps.map((step, index) => (
          <li key={step} className={selected === index ? "rounded-xl bg-violet-50 p-2 text-sm font-bold leading-6 text-violet-900 dark:bg-violet-300/10 dark:text-violet-100" : "rounded-xl bg-slate-50 p-2 text-sm font-bold leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-200"}>
            <button type="button" className="w-full text-left" onClick={() => setSelected(index)}>{index + 1}. {step}</button>
          </li>
        ))}
      </ol>
      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase"><Lightbulb className="h-4 w-4" />Invalid step to reject</h4>
        <p className="mt-1 text-sm font-semibold leading-6">{invalidStep}</p>
      </div>
    </div>
  );
}

function CheckPanel({ challenge, answer, show, setShow, misconception }: { challenge: string; answer: string; show: boolean; setShow: (show: boolean) => void; misconception: string }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Lightbulb className="h-4 w-4" />Common mistake</h3>
        <p className="mt-2 text-sm font-semibold leading-6">{misconception}</p>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Target className="h-4 w-4" />Board-style check</h3>
        <p className="mt-2 text-sm font-semibold leading-6">{challenge}</p>
        <button type="button" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-500" onClick={() => setShow(!show)}><CheckCircle2 className="h-4 w-4" />{show ? "Hide answer" : "Show answer"}</button>
        {show ? <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm font-black text-emerald-900 dark:bg-slate-950/40 dark:text-emerald-100">{answer}</p> : null}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <span className="flex items-center justify-between gap-2 text-xs font-black uppercase text-slate-600 dark:text-slate-300"><span>{label}</span><span>{value}</span></span>
      <input className="mt-2 w-full accent-violet-600" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70"><p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-base font-black text-slate-950 dark:text-white">{value}</p></div>;
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-violet-100 bg-white p-3 dark:border-violet-300/20 dark:bg-slate-950/70"><p className="text-xs font-black uppercase text-violet-600 dark:text-violet-300">{label}</p><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{value}</p></div>;
}

function ParallelSvg({ angle }: { angle: number }) {
  return (
    <svg viewBox="0 0 520 230" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label={`Parallel lines with a transversal and marked ${angle} degree angle`}>
      <line x1="40" y1="70" x2="480" y2="70" stroke="#334155" strokeWidth="4" />
      <line x1="40" y1="160" x2="480" y2="160" stroke="#334155" strokeWidth="4" />
      <line x1="160" y1="25" x2="350" y2="205" stroke="#7c3aed" strokeWidth="4" />
      <path d="M185 70 A42 42 0 0 1 216 98" fill="none" stroke="#f59e0b" strokeWidth="5" />
      <path d="M280 160 A42 42 0 0 0 311 188" fill="none" stroke="#06b6d4" strokeWidth="5" />
      <text x="220" y="62" fontWeight="900" fill="#92400e">{angle} deg</text>
      <text x="314" y="155" fontWeight="900" fill="#0e7490">linked</text>
      <text x="42" y="55" fontWeight="800" fill="#475569">l</text>
      <text x="42" y="145" fontWeight="800" fill="#475569">m</text>
    </svg>
  );
}

function TriangleSvg() {
  return (
    <svg viewBox="0 0 520 250" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label="Triangle with parallel line construction for angle proof">
      <polygon points="95,195 430,195 245,48" fill="#e0f2fe" stroke="#0369a1" strokeWidth="4" />
      <line x1="50" y1="48" x2="470" y2="48" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 7" />
      <line x1="430" y1="195" x2="490" y2="195" stroke="#0369a1" strokeWidth="4" />
      <text x="86" y="218" fontWeight="900" fill="#075985">A</text>
      <text x="435" y="218" fontWeight="900" fill="#075985">B</text>
      <text x="245" y="38" fontWeight="900" fill="#075985">C</text>
      <text x="300" y="86" fontWeight="900" fill="#7c2d12">parallel through C</text>
      <text x="448" y="185" fontWeight="900" fill="#0f766e">exterior</text>
    </svg>
  );
}

function CongruenceSvg() {
  return (
    <svg viewBox="0 0 560 240" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label="Two triangles with corresponding sides and angles marked">
      <polygon points="75,190 225,190 130,55" fill="#e0f2fe" stroke="#0369a1" strokeWidth="4" />
      <polygon points="335,190 485,190 390,55" fill="#ede9fe" stroke="#7c3aed" strokeWidth="4" />
      <line x1="75" y1="190" x2="225" y2="190" stroke="#f59e0b" strokeWidth="6" />
      <line x1="335" y1="190" x2="485" y2="190" stroke="#f59e0b" strokeWidth="6" />
      <circle cx="130" cy="55" r="10" fill="#10b981" />
      <circle cx="390" cy="55" r="10" fill="#10b981" />
      <text x="66" y="214" fontWeight="900" fill="#075985">A</text>
      <text x="226" y="214" fontWeight="900" fill="#075985">B</text>
      <text x="126" y="45" fontWeight="900" fill="#075985">C</text>
      <text x="326" y="214" fontWeight="900" fill="#5b21b6">D</text>
      <text x="486" y="214" fontWeight="900" fill="#5b21b6">E</text>
      <text x="386" y="45" fontWeight="900" fill="#5b21b6">F</text>
    </svg>
  );
}

function ParallelogramSvg({ skew }: { skew: number }) {
  const offset = skew;
  return (
    <svg viewBox="0 0 560 240" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label="Parallelogram with opposite sides and diagonals marked">
      <polygon points={`${110 + offset},45 450,45 ${450 - offset},190 110,190`} fill="#e0f2fe" stroke="#0369a1" strokeWidth="4" />
      <line x1={110 + offset} y1="45" x2={450 - offset} y2="190" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 6" />
      <line x1="450" y1="45" x2="110" y2="190" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 6" />
      <circle cx="280" cy="117" r="8" fill="#7c3aed" />
      <text x={96 + offset} y="38" fontWeight="900" fill="#075985">A</text>
      <text x="456" y="38" fontWeight="900" fill="#075985">B</text>
      <text x={456 - offset} y="210" fontWeight="900" fill="#075985">C</text>
      <text x="96" y="210" fontWeight="900" fill="#075985">D</text>
      <text x="292" y="112" fontWeight="900" fill="#5b21b6">midpoint</text>
    </svg>
  );
}

function MidpointSvg({ skew }: { skew: number }) {
  const top = 50 + skew / 3;
  return (
    <svg viewBox="0 0 560 240" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label="Triangle with midpoint segment parallel to base">
      <polygon points={`95,195 465,195 260,${top}`} fill="#dcfce7" stroke="#15803d" strokeWidth="4" />
      <line x1="178" y1="134" x2="362" y2="134" stroke="#7c3aed" strokeWidth="5" />
      <circle cx="178" cy="134" r="8" fill="#f59e0b" />
      <circle cx="362" cy="134" r="8" fill="#f59e0b" />
      <text x="182" y="126" fontWeight="900" fill="#92400e">midpoint</text>
      <text x="250" y="158" fontWeight="900" fill="#5b21b6">parallel, half base</text>
    </svg>
  );
}

function CircleSvg({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 560 260" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label={`${title} circle theorem diagram`}>
      <circle cx="280" cy="130" r="92" fill="#eef2ff" stroke="#4f46e5" strokeWidth="4" />
      <circle cx="280" cy="130" r="5" fill="#4f46e5" />
      <line x1="188" y1="130" x2="372" y2="130" stroke="#0369a1" strokeWidth="4" />
      <line x1="220" y1="58" x2="372" y2="130" stroke="#f59e0b" strokeWidth="4" />
      <line x1="220" y1="58" x2="188" y2="130" stroke="#f59e0b" strokeWidth="4" />
      {title.includes("Tangent") ? <line x1="372" y1="38" x2="372" y2="222" stroke="#dc2626" strokeWidth="4" /> : null}
      {title.includes("Cyclic") ? <polygon points="188,130 220,58 350,72 372,130" fill="none" stroke="#10b981" strokeWidth="4" /> : null}
      <text x="292" y="126" fontWeight="900" fill="#4f46e5">O</text>
      <text x="378" y="132" fontWeight="900" fill="#991b1b">{title.includes("Tangent") ? "tangent" : "B"}</text>
      <text x="210" y="50" fontWeight="900" fill="#92400e">A</text>
    </svg>
  );
}

function ConicSvg({ title }: { title: string }) {
  const path = title.includes("Parabola") ? "M90 210 Q280 20 470 210" : title.includes("Ellipse") ? "M120 130 C120 55 440 55 440 130 C440 205 120 205 120 130" : "M80 205 C170 60 240 60 280 130 C320 200 390 200 480 55";
  return (
    <svg viewBox="0 0 560 260" className="mt-3 h-56 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label={`${title} tangent diagram`}>
      <path d={path} fill="none" stroke="#0369a1" strokeWidth="5" />
      <line x1="120" y1="195" x2="465" y2="70" stroke="#dc2626" strokeWidth="4" />
      <circle cx="300" cy="130" r="8" fill="#7c3aed" />
      <text x="310" y="124" fontWeight="900" fill="#5b21b6">point</text>
      <text x="370" y="86" fontWeight="900" fill="#991b1b">tangent</text>
    </svg>
  );
}

function ProbabilityTreeSvg() {
  return (
    <svg viewBox="0 0 560 230" className="mt-3 h-52 w-full rounded-2xl bg-slate-50 dark:bg-white/5" role="img" aria-label="tree diagram visual model showing branches multiply along paths">
      <circle cx="80" cy="115" r="8" fill="#4f46e5" />
      <line x1="88" y1="115" x2="230" y2="60" stroke="#0369a1" strokeWidth="4" />
      <line x1="88" y1="115" x2="230" y2="170" stroke="#0369a1" strokeWidth="4" />
      <line x1="238" y1="60" x2="420" y2="40" stroke="#10b981" strokeWidth="4" />
      <line x1="238" y1="60" x2="420" y2="85" stroke="#f59e0b" strokeWidth="4" />
      <line x1="238" y1="170" x2="420" y2="145" stroke="#10b981" strokeWidth="4" />
      <line x1="238" y1="170" x2="420" y2="190" stroke="#f59e0b" strokeWidth="4" />
      <text x="245" y="55" fontWeight="900" fill="#075985">A</text>
      <text x="245" y="180" fontWeight="900" fill="#075985">not A</text>
      <text x="430" y="44" fontWeight="900" fill="#047857">B</text>
      <text x="430" y="150" fontWeight="900" fill="#047857">B</text>
      <text x="80" y="214" fontWeight="900" fill="#475569">branches multiply along paths</text>
    </svg>
  );
}

function polynomialConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title === "Factor Theorem") {
    return baseConfig("polynomial", lesson.title, "If p(a)=0, then x-a is a factor of p(x); conversely, if x-a is a factor, then p(a)=0.", "p(a)=0\\iff (x-a)\\mid p(x)", ["p(x) is a polynomial", "a is a real number", "division by x-a is possible"], "x-a is a factor exactly when p(a)=0", ["Divide p(x) by x-a.", "By the division algorithm, p(x)=(x-a)q(x)+r.", "Substitute x=a to get p(a)=r.", "Therefore r=0 exactly when x-a is a factor."], "Claiming x-a is a factor only because a appears in the expression.", "Do not confuse x-a with x+a; the test value for x-a is a.");
  }
  return baseConfig("polynomial", lesson.title, "When a polynomial p(x) is divided by x-a, the remainder is p(a).", "p(x)=(x-a)q(x)+r,\\ r=p(a)", ["p(x) is a polynomial", "x-a is a linear divisor"], "the remainder equals p(a)", ["Use the division algorithm: p(x)=(x-a)q(x)+r.", "Substitute x=a.", "The factor x-a becomes 0.", "The remaining value is p(a)=r."], "Finding the quotient but forgetting that the remainder is the value at x=a.", "The theorem gives the remainder directly; synthetic division is evidence, not a different rule.");
}

function classifierConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  const theorem = lesson.title.includes("Five Postulates") ? "Euclid's postulates are accepted starting assumptions for plane geometry." : "A proof separates definitions, accepted postulates, derived theorems, and invalid inferences.";
  return baseConfig("classifier", lesson.title, theorem, "definitions+postulates\\Rightarrow theorems", ["A statement from Euclidean geometry", "A proof system with accepted starting rules"], "the statement's role in a proof", ["Read the exact wording of the statement.", "Decide whether it defines a term, states an accepted rule, or needs proof.", "Use postulates and earlier results only as valid reasons.", "Reject conclusions that assume what they must prove."], "Using a theorem as a reason before it has been proved or accepted.", "A diagram suggests relationships, but proof needs a valid reason for each step.");
}

function parallelConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Vertically")) return baseConfig("parallel-angles", lesson.title, "When two lines intersect, each pair of vertically opposite angles is equal.", "\\angle 1=\\angle 3,\\ \\angle 2=\\angle 4", ["Two lines intersect at one point"], "vertically opposite angles are equal", ["Adjacent angles on a straight line form 180 deg.", "Write two linear-pair equations.", "Subtract the common adjacent angle.", "The vertically opposite angles are equal."], "Assuming all angles around an intersection are equal.", "Only opposite pairs are equal; adjacent linear-pair angles are usually supplementary.");
  if (lesson.title.includes("Interior Angles")) return baseConfig("parallel-angles", lesson.title, "Interior angles on the same side of a transversal are supplementary when the two lines are parallel.", "\\angle A+\\angle B=180^\\circ", ["Two parallel lines", "A transversal cuts both lines"], "same-side interior angles are supplementary", ["Mark the corresponding angle equal to the first angle.", "Use a linear pair on the second line.", "The two same-side interior angles add to 180 deg."], "Treating same-side interior angles as equal.", "These angles are supplementary, not equal except in the special 90 deg case.");
  if (lesson.title.includes("Converse")) return baseConfig("parallel-angles", lesson.title, "If a transversal creates equal corresponding or alternate interior angles, or supplementary same-side interior angles, then the lines are parallel.", "angle\\ condition\\Rightarrow l\\parallel m", ["Two lines cut by a transversal", "One angle relationship is known"], "the two lines are parallel", ["Check the exact angle condition.", "Match it to its converse theorem.", "Conclude that the two lines are parallel.", "State which converse was used."], "Using a forward theorem when the problem needs a converse.", "The converse changes what is given and what is proved.");
  const theorem = lesson.title.includes("Alternate") ? "If two parallel lines are cut by a transversal, alternate interior angles are equal." : lesson.title.includes("Linear Pair") ? "A linear pair of adjacent angles has sum 180 deg; conversely, adjacent supplementary angles form a line." : "If two parallel lines are cut by a transversal, corresponding angles are equal.";
  const formula = lesson.title.includes("Linear Pair") ? "\\angle A+\\angle B=180^\\circ" : "\\angle A=\\angle B";
  return baseConfig("parallel-angles", lesson.title, theorem, formula, ["Two parallel lines", "A transversal cuts both lines"], "the marked angle relation", ["Identify the two lines and the transversal.", "Mark the named angle pair.", "Use the parallel-line theorem.", "Transfer the angle measure to the linked angle."], "Using the theorem without first checking that the lines are parallel.", "The angle pair name matters; corresponding, alternate, and same-side interior angles have different conclusions.");
}

function triangleConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Exterior")) return baseConfig("triangle-angles", lesson.title, "An exterior angle of a triangle equals the sum of the two opposite interior angles.", "\\angle exterior=\\angle A+\\angle C", ["A triangle", "One side is extended"], "the exterior angle equals the two remote interior angles", ["Use the triangle angle sum.", "Use the linear pair at the exterior angle.", "Subtract the adjacent interior angle from 180 deg.", "The exterior angle equals the sum of the two remote interior angles."], "Adding the exterior angle to all three interior angles as if four triangle angles exist.", "The exterior angle replaces the adjacent interior angle in a straight-line pair.");
  return baseConfig("triangle-angles", lesson.title, "The three interior angles of a triangle add to 180 deg.", "\\angle A+\\angle B+\\angle C=180^\\circ", ["A triangle ABC", "A line through one vertex parallel to the opposite side"], "the angle sum is 180 deg", ["Draw a line through C parallel to AB.", "Use alternate interior angles to transfer angles A and B to the line through C.", "The three angles on the straight line sum to 180 deg.", "Therefore the triangle's interior angles sum to 180 deg."], "Measuring one triangle and treating measurement as proof for every triangle.", "The parallel construction proves the result for all triangles, not just the drawn one.");
}

function congruenceConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title === "Equal Sides and Equal Angles") return baseConfig("congruence", lesson.title, "In a triangle, equal sides subtend equal opposite angles; conversely, equal angles stand opposite equal sides.", "AB=AC\\iff \\angle B=\\angle C", ["Triangle ABC", "Two sides or two angles are marked equal"], "the corresponding opposite angles or sides are equal", ["Identify the equal sides or equal angles.", "Use the isosceles triangle theorem or its converse.", "Match opposite side to opposite angle.", "State the equality with correct vertex names."], "Claiming adjacent angles are equal because the diagram looks symmetric.", "The equal parts must be opposite each other in the same triangle.");
  const criterion = congruenceCriterion(lesson.title);
  const theorem = `${criterion} congruence: two triangles are congruent when the listed corresponding parts match in the required order.`;
  return baseConfig("congruence", lesson.title, theorem, `${criterion}\\Rightarrow \\triangle ABC\\cong\\triangle DEF`, ["Two triangles ABC and DEF", "Corresponding marked sides and angles"], `triangles are congruent by ${criterion}`, ["Mark corresponding vertices in order.", `Verify the ${criterion} evidence only.`, "Write the congruence statement with matching order.", "Use CPCTC only after congruence is proved."], `Using ${wrongCongruenceCriterion(criterion)} when the marked evidence shows ${criterion}.`, "A correct criterion still fails if corresponding vertices are written in the wrong order.");
}

function quadrilateralConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Opposite Sides")) return baseConfig("quadrilateral", lesson.title, "In a parallelogram, opposite sides are equal and parallel.", "AB=CD,\\ BC=AD", ["ABCD is a parallelogram"], "opposite sides are equal", ["Draw a diagonal to form two triangles.", "Use alternate interior angles from parallel sides.", "Prove the triangles congruent.", "Conclude opposite sides are equal by CPCTC."], "Assuming all four sides are equal; that describes a rhombus, not every parallelogram.", "Opposite sides match in pairs, not necessarily all four sides.");
  if (lesson.title.includes("Opposite Angles")) return baseConfig("quadrilateral", lesson.title, "In a parallelogram, opposite angles are equal.", "\\angle A=\\angle C,\\ \\angle B=\\angle D", ["ABCD is a parallelogram"], "opposite angles are equal", ["Use opposite sides parallel.", "Use angle relationships made by a diagonal.", "Prove triangle congruence.", "Transfer equal corresponding angles."], "Treating adjacent angles as equal instead of supplementary.", "Adjacent angles in a parallelogram are supplementary; opposite angles are equal.");
  if (lesson.title.includes("Diagonals")) return baseConfig("quadrilateral", lesson.title, "The diagonals of a parallelogram bisect each other.", "AO=OC,\\ BO=OD", ["ABCD is a parallelogram", "Diagonals AC and BD meet at O"], "the diagonals bisect each other", ["Use parallel sides to get alternate interior angles.", "Use vertical opposite angles at O.", "Prove the small triangles congruent.", "Conclude each diagonal is cut into equal halves."], "Saying diagonals are equal; that is not true for every parallelogram.", "Bisecting means cut into equal halves, not necessarily equal diagonals.");
  if (lesson.title.includes("Conditions")) return baseConfig("quadrilateral", lesson.title, "A quadrilateral is a parallelogram if one valid condition holds: both pairs of opposite sides parallel, both pairs equal, opposite angles equal, or diagonals bisect.", "condition\\Rightarrow parallelogram", ["A quadrilateral with one marked condition"], "the quadrilateral is a parallelogram", ["Identify the given condition exactly.", "Match it to a parallelogram converse theorem.", "Prove the missing parallel/equal relation if needed.", "Conclude the quadrilateral is a parallelogram."], "Using one pair of equal opposite sides alone as enough evidence.", "One pair must be both equal and parallel, or both pairs must satisfy the required condition.");
  if (lesson.title.includes("Converse")) return baseConfig("quadrilateral", lesson.title, "If a line through a midpoint of one side of a triangle is parallel to another side, it bisects the third side.", "D\\ midpoint,\\ DE\\parallel BC\\Rightarrow E\\ midpoint", ["D is midpoint of AB", "DE is parallel to BC"], "E is midpoint of AC", ["Use parallel lines to form equal angles.", "Compare triangles made by the midpoint line.", "Use similarity or congruence to show equal ratios.", "Conclude E bisects AC."], "Assuming the point is a midpoint because it appears near the middle.", "The converse needs the parallel condition as evidence.");
  return baseConfig("quadrilateral", lesson.title, "The segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length.", "DE\\parallel BC,\\ DE=\\frac12BC", ["D and E are midpoints of two sides of triangle ABC"], "DE is parallel to BC and half of BC", ["Mark the two midpoint equalities.", "Use proportional sides to show similarity.", "Match corresponding angles to prove parallel lines.", "Compare corresponding sides to get the half-length relation."], "Proving only parallelism and forgetting the half-length relation.", "The theorem has two conclusions: parallel and half the third side.");
}

function heronConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  return baseConfig("heron", lesson.title, "For a triangle with side lengths a, b, c and semiperimeter s, area equals sqrt(s(s-a)(s-b)(s-c)).", "A=\\sqrt{s(s-a)(s-b)(s-c)},\\ s=\\frac{a+b+c}{2}", ["Triangle side lengths a, b, c", "s is the semiperimeter"], "Heron's area formula", ["Drop an altitude to express area as 1/2 base times height.", "Use side lengths to express the altitude algebraically.", "Substitute into the area formula.", "Simplify to sqrt(s(s-a)(s-b)(s-c))."], "Using perimeter instead of semiperimeter.", "Heron's formula uses s=(a+b+c)/2, not the full perimeter.");
}

function circleConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Equal Chords")) return baseConfig("circle", lesson.title, "Equal chords of a circle subtend equal angles at the center and at the circumference.", "AB=CD\\Rightarrow \\angle AOB=\\angle COD", ["A circle with equal chords"], "the subtended angles are equal", ["Join chord endpoints to the center.", "Use equal radii and equal chord lengths.", "Prove the central triangles congruent.", "Transfer equal angles."], "Assuming equal arcs without proving equal chords or equal central angles.", "Equal chord, equal arc, and equal angle statements must be connected by a theorem.");
  if (lesson.title.includes("Same Segment")) return baseConfig("circle", lesson.title, "Angles in the same segment of a circle are equal.", "\\angle APB=\\angle AQB", ["Points P and Q lie on the same segment cut by chord AB"], "the two angles are equal", ["Connect the chord to the center if needed.", "Relate each angle to the same arc.", "Use the same intercepted arc.", "Conclude the angles are equal."], "Comparing angles that stand on different chords.", "The theorem applies only when both angles stand on the same chord or arc.");
  if (lesson.title.includes("Opposite Angles") || lesson.title.includes("Cyclic Quadrilateral")) return baseConfig("circle", lesson.title, "Opposite angles of a cyclic quadrilateral are supplementary.", "\\angle A+\\angle C=180^\\circ", ["ABCD is cyclic"], "opposite angles sum to 180 deg", ["Use the arcs intercepted by opposite angles.", "The two arcs together make the full circle.", "Angles at the circumference are half their intercepted arcs.", "Therefore opposite angles add to 180 deg."], "Treating opposite angles as equal in every cyclic quadrilateral.", "Cyclic opposite angles are supplementary, not generally equal.");
  if (lesson.title.includes("Perpendicular")) return baseConfig("circle", lesson.title, "The tangent at any point of a circle is perpendicular to the radius through the point of contact.", "OT\\perp tangent", ["A tangent touches the circle at T", "O is the center"], "radius OT is perpendicular to the tangent", ["The radius to the point of contact is the shortest distance from center to tangent.", "Shortest distance from a point to a line is perpendicular.", "Therefore OT is perpendicular to the tangent.", "Mark the right angle at T."], "Drawing the radius to a nearby point instead of the point of contact.", "The perpendicular radius must go to the exact point where the tangent touches.");
  return baseConfig("circle", lesson.title, "Tangents drawn from the same external point to a circle are equal in length.", "PA=PB", ["PA and PB are tangents from external point P", "A and B are contact points"], "the tangent lengths are equal", ["Join O to A, O to B, and O to P.", "Radii to tangents are perpendicular.", "The two right triangles share hypotenuse OP and have equal radii.", "Use RHS congruence to prove PA=PB."], "Measuring from different external points and expecting equal tangents.", "The equal tangents must come from the same external point.");
}

function inductionConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Strong")) return baseConfig("induction", lesson.title, "Strong induction proves P(n) by assuming all earlier cases P(1),...,P(k) before proving P(k+1).", "P(1),...,P(k)\\Rightarrow P(k+1)", ["A statement P(n) over positive integers"], "P(n) is true for every n in the domain", ["Prove the base case.", "Assume all earlier cases up to k.", "Use those assumptions to prove P(k+1).", "Conclude the statement for all n by strong induction."], "Assuming P(k+1) directly in the induction step.", "The induction hypothesis can be used only for earlier cases, not the result being proved.");
  if (lesson.title.includes("Sum")) return baseConfig("induction", lesson.title, "The formula 1+2+...+n=n(n+1)/2 can be proved by induction.", "1+2+\\cdots+n=\\frac{n(n+1)}2", ["n is a positive integer"], "the sum formula holds for all n", ["Check n=1.", "Assume 1+...+k=k(k+1)/2.", "Add k+1 to both sides.", "Simplify to (k+1)(k+2)/2."], "Testing several values and calling it a proof.", "Examples support a pattern; induction proves every case.");
  if (lesson.title.includes("Divisibility")) return baseConfig("induction", lesson.title, "A divisibility statement can be proved by showing the next expression differs by a multiple of the divisor.", "d\\mid P(k)\\Rightarrow d\\mid P(k+1)", ["A divisibility claim for n"], "the divisor divides every case", ["Check the base case.", "Assume divisibility at k.", "Rewrite the k+1 expression using the k expression.", "Show the remaining terms are also divisible."], "Dividing by a variable expression without preserving integer divisibility.", "Divisibility proof must show an integer multiple of the divisor.");
  if (lesson.title.includes("Inequality")) return baseConfig("induction", lesson.title, "An inequality can be proved by induction when the induction step preserves the comparison.", "P(k)\\ and\\ extra\\ positive\\ term\\Rightarrow P(k+1)", ["An inequality statement for n"], "the inequality holds for all allowed n", ["Check the first allowed value.", "Assume the inequality for k.", "Transform the k+1 side to include the k case.", "Use positivity or monotonicity to finish."], "Applying an operation that reverses inequality without changing the sign.", "Multiplying or dividing by a negative reverses inequality direction.");
  return baseConfig("induction", lesson.title, "Mathematical induction proves a statement for infinitely many integers by proving a first case and a domino step.", "P(1)\\ and\\ (P(k)\\Rightarrow P(k+1))\\Rightarrow \\forall nP(n)", ["A statement P(n)", "A starting integer"], "P(n) is true for every later integer", ["Prove the base case.", "Assume P(k) for an arbitrary k.", "Prove P(k+1) using the hypothesis.", "State the induction conclusion."], "Skipping the base case.", "The domino chain never starts unless the base case is proved.");
}

function conicTangentConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Ellipse")) return baseConfig("conic-tangent", lesson.title, "For x^2/a^2+y^2/b^2=1, the tangent at (x1,y1) is xx1/a^2+yy1/b^2=1.", "\\frac{xx_1}{a^2}+\\frac{yy_1}{b^2}=1", ["A point (x1,y1) on an ellipse"], "the tangent equation at the point", ["Verify the point lies on the ellipse.", "Use the tangent form T=0.", "Substitute the point coordinates.", "Confirm the line touches at exactly that point."], "Using the circle tangent formula for an ellipse.", "Each conic has its own tangent form.");
  if (lesson.title.includes("Hyperbola")) return baseConfig("conic-tangent", lesson.title, "For x^2/a^2-y^2/b^2=1, the tangent at (x1,y1) is xx1/a^2-yy1/b^2=1.", "\\frac{xx_1}{a^2}-\\frac{yy_1}{b^2}=1", ["A point (x1,y1) on a hyperbola"], "the tangent equation at the point", ["Check the point on the hyperbola.", "Apply the tangent form with the minus sign.", "Substitute the point.", "Verify single contact with the branch."], "Losing the minus sign in the hyperbola equation.", "The sign separates ellipse and hyperbola tangent forms.");
  return baseConfig("conic-tangent", lesson.title, "For y^2=4ax, the tangent at parameter t is ty=x+at^2.", "ty=x+at^2", ["A point on y^2=4ax with parameter t"], "the tangent equation at that point", ["Write the parametric point (at^2,2at).", "Use the tangent form ty=x+at^2.", "Substitute the point to verify contact.", "Reject secant lines that meet twice."], "Using y=mx+c without enforcing one-point contact.", "A tangent must satisfy the contact condition, not only pass through the point.");
}

function calculusTheoremConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Rolle")) return baseConfig("calculus-theorem", lesson.title, "If f is continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then some c in (a,b) has f'(c)=0.", "f(a)=f(b)\\Rightarrow \\exists c:f'(c)=0", ["Continuity on [a,b]", "Differentiability on (a,b)", "Equal endpoint values"], "there is a stationary point inside", ["Check continuity.", "Check differentiability.", "Check f(a)=f(b).", "Apply Rolle's theorem to guarantee f'(c)=0."], "Using Rolle's theorem when endpoint values are not equal.", "Rolle's theorem has a special equal-endpoint condition.");
  if (lesson.title.includes("Mean Value")) return baseConfig("calculus-theorem", lesson.title, "If f is continuous on [a,b] and differentiable on (a,b), then some c has f'(c)=(f(b)-f(a))/(b-a).", "f'(c)=\\frac{f(b)-f(a)}{b-a}", ["Continuity on [a,b]", "Differentiability on (a,b)"], "an interior tangent slope equals the secant slope", ["Check the two conditions.", "Compute the secant slope.", "Find or guarantee c in the open interval.", "Interpret tangent parallel to secant."], "Using an endpoint as the c value.", "The guaranteed c must lie inside the open interval.");
  return baseConfig("calculus-theorem", lesson.title, "The tangent slope is dy/dx and the normal slope is the negative reciprocal when the tangent slope is nonzero.", "m_n=-\\frac1{m_t}", ["A differentiable curve", "A point of contact"], "tangent and normal equations", ["Differentiate the curve.", "Evaluate dy/dx at the point.", "Write the tangent line with that slope.", "Use the negative reciprocal for the normal."], "Using the same slope for tangent and normal.", "Normal is perpendicular to tangent, so slopes multiply to -1 when both are finite.");
}

function cofactorConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  return baseConfig("cofactor", lesson.title, "A minor Mij is the determinant left after deleting row i and column j; cofactor Cij=(-1)^(i+j)Mij.", "C_{ij}=(-1)^{i+j}M_{ij}", ["A square matrix", "A selected row and column"], "minor and cofactor values", ["Delete the selected row and column.", "Compute the remaining determinant as the minor.", "Apply the checkerboard sign.", "Use cofactors in determinant expansion."], "Forgetting the alternating sign.", "Minor is unsigned; cofactor includes the sign.");
}

function probabilityTheoremConfig(lesson: SchoolSyllabusLesson): ProofToolConfig {
  if (lesson.title.includes("Bayes")) return baseConfig("probability-theorem", lesson.title, "Bayes' theorem reverses conditional probability using a prior, likelihood, and total evidence probability.", "P(A_i|B)=\\frac{P(A_i)P(B|A_i)}{\\sum_jP(A_j)P(B|A_j)}", ["A partition A1,...,An", "Evidence event B"], "posterior probability P(Ai|B)", ["Partition the sample space.", "Compute each path probability P(Aj)P(B|Aj).", "Add paths to get P(B).", "Divide the target path by total evidence."], "Using P(B|A) as if it were P(A|B).", "Bayes reverses the condition only after dividing by total evidence.");
  return baseConfig("probability-theorem", lesson.title, "The total probability theorem adds the probabilities of evidence across a full partition.", "P(B)=\\sum_iP(A_i)P(B|A_i)", ["A partition A1,...,An", "Event B"], "the total probability of B", ["Check the Ai events are mutually exclusive and exhaustive.", "Compute each branch probability.", "Add all branch probabilities that lead to B.", "Use the total as evidence probability."], "Adding branches that do not form a full partition.", "The theorem requires the cases to cover the whole sample space without overlap.");
}

function baseConfig(mode: SchoolProofToolMode, title: string, theorem: string, formula: string, given: string[], prove: string, steps: string[], invalidStep: string, misconception: string): ProofToolConfig {
  return { mode, title, theorem, formula, given, prove, steps, invalidStep, misconception };
}

function syntheticDivisionText(a: number) {
  const remainder = a ** 3 - 3 * a + 2;
  return `For p(x)=x^3-3x+2, substituting x=${a} gives p(${a})=${remainder}. By the Remainder Theorem, this is the exact remainder when dividing by x-${a}.`;
}

function parallelAngleValue(title: string, angle: number) {
  return title.includes("Interior Angles") || title.includes("Linear Pair") ? 180 - angle : angle;
}

function parallelReason(title: string) {
  if (title.includes("Interior Angles")) return "supplementary same-side interior angles";
  if (title.includes("Linear Pair")) return "linear pair sums to 180 deg";
  if (title.includes("Alternate")) return "alternate interior angles are equal";
  if (title.includes("Vertically")) return "vertically opposite angles are equal";
  if (title.includes("Converse")) return "the converse proves parallel lines";
  return "corresponding angles are equal";
}

function congruenceCriterion(title: string) {
  if (title.includes("ASA")) return "ASA";
  if (title.includes("AAS")) return "AAS";
  if (title.includes("SSS")) return "SSS";
  if (title.includes("RHS")) return "RHS";
  return "SAS";
}

function wrongCongruenceCriterion(expected: string) {
  return expected === "SAS" ? "ASA" : "SAS";
}

function circleLinkedValue(title: string, angle: number) {
  if (title.includes("Cyclic") || title.includes("Opposite Angles")) return `${180 - angle} deg`;
  if (title.includes("Perpendicular")) return "90 deg";
  if (title.includes("Tangent Lengths")) return "PA = PB";
  return `${angle} deg`;
}

function circleKind(title: string) {
  if (title.includes("Tangent")) return "tangent";
  if (title.includes("Cyclic")) return "cyclic";
  if (title.includes("Chord")) return "chord";
  return "angle";
}

function formatNumber(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

function conicTangentEquation(title: string, t: number) {
  if (title.includes("Ellipse")) return `x*x1/a^2 + y*y1/b^2 = 1`;
  if (title.includes("Hyperbola")) return `x*x1/a^2 - y*y1/b^2 = 1`;
  return `${t}y = x + ${t ** 2}a`;
}

function determinant3(matrix: number[][]) {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}
