import { useMemo, useState } from "react";
import NCERTCompactPanel from "../layout/NCERTCompactPanel";
import NCERTSubTabs from "../layout/NCERTSubTabs";
import NCERTTabbedWorkspace from "../layout/NCERTTabbedWorkspace";
import NCERTPracticeCheck from "../practice/NCERTPracticeCheck";
import type { NCERTPracticeQuestion } from "../practice/ncertPracticeTypes";
import { getNCERTPracticeItems } from "../../../data/ncertPracticeBank";
import NCERTTeacherModePanel from "../teacher/NCERTTeacherModePanel";
import { classifyContinuityCase, derivativeRuleStep } from "./class12CalculusUtils";
import { cramer2, det2, det3, inverse2, multiplyMatrixVector2, type Matrix2, type Matrix3 } from "./class12DeterminantUtils";
import { applyInitialConditionForGrowth, differentialEquationPreset } from "./class12DifferentialEquationsUtils";
import { integrationPresetStepper } from "./class12IntegrationUtils";
import { feasibleCorners, optimizeCorners } from "./class12LppUtils";
import { bayesPosterior } from "./class12ProbabilityUtils";
import { composeRelations, functionClassifier, inverseRelation, relationMatrix, relationPropertyReport, type RelationPair } from "./class12RelationsUtils";
import { angleBetween, cross, directionCosines, dot, lineVectorForm, magnitude, projectionLength, shortestDistanceSkew, type Vector3 } from "./class12Vectors3DUtils";
import { getNCERTConceptResourceLinks } from "../../../data/ncertResourceLinks";

export type Class12LabKind =
  | "relations-functions"
  | "determinants"
  | "continuity-differentiability"
  | "integration-methods"
  | "differential-equations"
  | "vectors-3d-geometry"
  | "bayes-theorem"
  | "linear-programming"
  | "inverse-trig";

type LabConfig = {
  title: string;
  subtitle: string;
  badge: string;
  examples: string[];
  prompts: string[];
};

const configs: Record<Class12LabKind, LabConfig> = {
  "relations-functions": {
    title: "Relations and Functions",
    subtitle: "Build a relation, inspect its matrix and arrow graph, then classify function behavior.",
    badge: "Set mapping + relation checker",
    examples: ["equivalence relation", "one-one function", "onto function", "not a function"],
    prompts: ["Which ordered pairs make the relation reflexive?", "When does every output get hit?", "What breaks the inverse?"],
  },
  determinants: {
    title: "Determinants",
    subtitle: "Change a 2 by 2 matrix and watch area scale, cofactors, inverse, and Cramer's rule values update.",
    badge: "Determinant + inverse stepper",
    examples: ["area scale", "singular matrix", "inverse exists", "Cramer's rule"],
    prompts: ["What does determinant 0 mean?", "Which cofactor signs change?", "How does inverse verify A times A inverse?"],
  },
  "continuity-differentiability": {
    title: "Continuity and Differentiability",
    subtitle: "Compare left and right limits for holes, jumps, corners, cusps, and smooth curves.",
    badge: "Limit and derivative classifier",
    examples: ["smooth parabola", "removable hole", "jump", "corner"],
    prompts: ["Do the left and right limits match?", "Can a tangent slope be assigned?", "Is continuity enough for differentiability?"],
  },
  "integration-methods": {
    title: "Integration Methods",
    subtitle: "Choose a method and see how substitution, parts, partial fractions, and definite-area ideas connect.",
    badge: "Method visual stepper",
    examples: ["substitution", "by parts", "partial fractions", "area between curves"],
    prompts: ["What is the inside function?", "Which term becomes u?", "Where does the shaded area come from?"],
  },
  "differential-equations": {
    title: "Differential Equations",
    subtitle: "Classify order and degree, then compare a solution curve against a slope field.",
    badge: "Slope field + solution verifier",
    examples: ["separable", "linear first order", "initial condition", "solution family"],
    prompts: ["What is the order?", "Where does the initial point sit?", "Does the curve follow the local slopes?"],
  },
  "vectors-3d-geometry": {
    title: "Vectors and 3D Geometry",
    subtitle: "Move vectors in space and read dot product, cross product area, projection, and line direction.",
    badge: "3D vector measurement lab",
    examples: ["dot product angle", "cross product area", "projection", "3D line form"],
    prompts: ["What angle do the vectors make?", "Which area does the cross product measure?", "What is the projection length?"],
  },
  "bayes-theorem": {
    title: "Bayes' Theorem",
    subtitle: "Update from prior probability to posterior probability with tree and table views.",
    badge: "Bayes tree + posterior calculator",
    examples: ["medical test", "factory defect", "bag and balls", "spam filter"],
    prompts: ["What is the prior?", "What is the evidence?", "How does the posterior change after a positive result?"],
  },
  "linear-programming": {
    title: "Linear Programming",
    subtitle: "Move an objective function across a feasible polygon and compare corner values.",
    badge: "Feasible region optimizer",
    examples: ["maximize profit", "minimize cost", "corner table", "constraint check"],
    prompts: ["Which side of each constraint is feasible?", "Which corner maximizes Z?", "What changes when c1 or c2 changes?"],
  },
  "inverse-trig": {
    title: "Inverse Trigonometric Functions",
    subtitle: "Restrict the original trig graph and read principal values from inverse graphs.",
    badge: "Principal value visualizer",
    examples: ["sin inverse", "cos inverse", "tan inverse", "identity card"],
    prompts: ["Why is the range restricted?", "Which principal value is chosen?", "What happens at domain endpoints?"],
  },
};

export default function Class12GuidedLab({ kind }: { kind: Class12LabKind }) {
  const config = configs[kind];
  const [preset, setPreset] = useState(0);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);

  const panel = useMemo(() => class12Panel(kind, preset, a, b, c), [kind, preset, a, b, c]);
  const details = useMemo(() => class12Details(kind, preset, a, b, c), [kind, preset, a, b, c]);
  const conceptId = conceptIdByKind[kind];
  const bankQuestions = getNCERTPracticeItems(conceptId);
  const practiceQuestions = bankQuestions.length > 0 ? bankQuestions : details.questions;
  const controlsPanel = (
    <div className="space-y-4">
      <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
        Example
        <select className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-3 py-3 text-sm font-bold dark:border-cyan-300/20 dark:bg-slate-900" value={preset} onChange={(event) => setPreset(Number(event.target.value))}>
          {config.examples.map((example, index) => <option key={example} value={index}>{example}</option>)}
        </select>
      </label>
      <NumberInput label="a" value={a} setValue={setA} min={-8} max={8} step={0.5} />
      <NumberInput label="b" value={b} setValue={setB} min={-8} max={8} step={0.5} />
      <NumberInput label="c" value={c} setValue={setC} min={-8} max={8} step={0.5} />
      <div className="rounded-2xl bg-slate-950 p-4 text-sm font-bold leading-6 text-cyan-50">
        {panel.verdict}
      </div>
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
        Diagram summary: {details.diagramSummary}
      </div>
    </div>
  );
  const visualPanel = (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <svg viewBox="0 0 760 460" role="img" aria-label={`${config.title} visual model`} className="h-[330px] w-full rounded-2xl bg-slate-950 sm:h-[380px]">
          <Grid />
          {panel.svg}
        </svg>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {panel.metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
        </div>
      </div>
      <NCERTCompactPanel title="Controls and live verdict" description="Change one value, then verify the method." accent="cyan">
        {controlsPanel}
      </NCERTCompactPanel>
    </div>
  );
  const methodPanel = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        {details.steps.map((prompt, index) => (
          <div key={prompt} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="font-black text-cyan-700 dark:text-cyan-200">Step {index + 1}: </span>{prompt}
          </div>
        ))}
      </div>
      <NCERTCompactPanel title="Current conclusion" accent="emerald">
        <p className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{panel.verdict}</p>
      </NCERTCompactPanel>
    </div>
  );
  const practicePanel = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <NCERTPracticeCheck title={`${config.title} practice bank`} questions={practiceQuestions} conceptId={conceptId} compact />
      <NCERTCompactPanel title="Practice prompt" description="Answer verbally or in notebook, then change values." accent="violet">
        <p className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{panel.practice}</p>
      </NCERTCompactPanel>
    </div>
  );
  const verificationPanel = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <NCERTCompactPanel title="Verification workflow" description="Every route shows how the result is checked, not only guessed." accent="emerald">
        <div className="space-y-2">
          {details.verification.map((item) => (
            <p key={item} className="rounded-2xl bg-white/70 p-3 text-sm font-bold leading-6 text-slate-700 dark:bg-slate-950/40 dark:text-slate-100">{item}</p>
          ))}
        </div>
      </NCERTCompactPanel>
      <NCERTCompactPanel title="Examples" accent="cyan">
        <div className="flex flex-wrap gap-2">
          {config.examples.map((example) => (
            <span key={example} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">{example}</span>
          ))}
        </div>
      </NCERTCompactPanel>
    </div>
  );
  const subTabs = class12SubTabs(kind, visualPanel, methodPanel, controlsPanel, practicePanel);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Class 12 NCERT guided visualization</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">{config.title}</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{config.subtitle}</p>
          </div>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-black uppercase text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
            {config.badge}
          </span>
        </div>
      </section>

        <NCERTTabbedWorkspace
        ariaLabel={`${config.title} compact Class 12 guided tabs`}
        tabs={[
          {
            id: "visual",
            label: "Visual",
            content: <NCERTSubTabs ariaLabel={`${config.title} method sub-tabs`} tabs={subTabs} />,
          },
          { id: "method", label: "Method Stepper", content: methodPanel },
          { id: "verification", label: "Verification", content: verificationPanel },
          { id: "practice", label: "Practice", content: practicePanel },
          {
            id: "notes",
            label: "Notes / Links",
            content: (
              <div className="grid gap-4 lg:grid-cols-2">
                <NCERTCompactPanel title="Teacher prompts" description={config.subtitle} accent="amber">
                  {bankQuestions.length > 0 ? (
                    <NCERTTeacherModePanel title={config.title} classLevel="Class 12" questions={bankQuestions} prompts={config.prompts} misconception={details.verification[0]} extension={panel.practice} />
                  ) : (
                    <div className="space-y-2">
                    {config.prompts.map((prompt) => <p key={prompt} className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{prompt}</p>)}
                    </div>
                  )}
                </NCERTCompactPanel>
                <NCERTCompactPanel title="Formula / theorem / proof links" description="Exact links are used where available; category links are used when no exact route exists." accent="cyan">
                  <div className="flex flex-wrap gap-2">
                    {details.links.map((link) => (
                      <a key={link.href} href={link.href} className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-black text-cyan-900 hover:bg-cyan-50 dark:border-cyan-300/20 dark:bg-slate-950 dark:text-cyan-50">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </NCERTCompactPanel>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function class12SubTabs(kind: Class12LabKind, visualPanel: JSX.Element, methodPanel: JSX.Element, controlsPanel: JSX.Element, practicePanel: JSX.Element) {
  if (kind === "relations-functions") {
    return [
      { id: "matrix", label: "Relation Matrix", content: visualPanel },
      { id: "graph", label: "Directed Graph", content: visualPanel },
      { id: "mapping", label: "Mapping", content: controlsPanel },
      { id: "composition", label: "Composition", content: methodPanel },
      { id: "inverse", label: "Inverse", content: practicePanel },
    ];
  }
  if (kind === "determinants") {
    return [
      { id: "2x2", label: "2x2", content: visualPanel },
      { id: "3x3", label: "3x3", content: methodPanel },
      { id: "cofactors", label: "Minors/Cofactors", content: controlsPanel },
      { id: "inverse", label: "Adjoint/Inverse", content: methodPanel },
      { id: "cramer", label: "Cramer's Rule", content: practicePanel },
    ];
  }
  if (kind === "continuity-differentiability") {
    return [
      { id: "continuity", label: "Continuity", content: visualPanel },
      { id: "differentiability", label: "Differentiability", content: methodPanel },
      { id: "rules", label: "Derivative Rules", content: controlsPanel },
      { id: "log", label: "Log Differentiation", content: methodPanel },
      { id: "parametric", label: "Parametric", content: practicePanel },
      { id: "concavity", label: "Concavity", content: visualPanel },
    ];
  }
  if (kind === "integration-methods") {
    return [
      { id: "substitution", label: "Substitution", content: visualPanel },
      { id: "parts", label: "By Parts", content: methodPanel },
      { id: "fractions", label: "Partial Fractions", content: controlsPanel },
      { id: "definite", label: "Definite Properties", content: methodPanel },
      { id: "area", label: "Area", content: practicePanel },
    ];
  }
  if (kind === "differential-equations") {
    return [
      { id: "classify", label: "Classify", content: visualPanel },
      { id: "separable", label: "Separable", content: methodPanel },
      { id: "linear", label: "Linear", content: controlsPanel },
      { id: "slope-field", label: "Slope Field", content: visualPanel },
      { id: "verify", label: "Verify", content: practicePanel },
    ];
  }
  if (kind === "vectors-3d-geometry") {
    return [
      { id: "vectors", label: "Vectors", content: visualPanel },
      { id: "dot", label: "Dot Product", content: methodPanel },
      { id: "cross", label: "Cross Product", content: controlsPanel },
      { id: "projection", label: "Projection", content: methodPanel },
      { id: "lines", label: "3D Lines", content: practicePanel },
      { id: "distance", label: "Shortest Distance", content: methodPanel },
    ];
  }
  if (kind === "bayes-theorem") {
    return [
      { id: "tree", label: "Tree", content: visualPanel },
      { id: "table", label: "Table", content: methodPanel },
      { id: "formula", label: "Formula", content: controlsPanel },
      { id: "update", label: "Update", content: methodPanel },
      { id: "presets", label: "Presets", content: practicePanel },
    ];
  }
  if (kind === "linear-programming") {
    return [
      { id: "constraints", label: "Constraints", content: controlsPanel },
      { id: "region", label: "Feasible Region", content: visualPanel },
      { id: "corners", label: "Corners", content: methodPanel },
      { id: "objective", label: "Objective Line", content: visualPanel },
      { id: "maxmin", label: "Max/Min", content: practicePanel },
    ];
  }
  if (kind === "inverse-trig") {
    return [
      { id: "domain", label: "Domain/Range", content: visualPanel },
      { id: "branch", label: "Principal Branch", content: methodPanel },
      { id: "graphs", label: "Graphs", content: visualPanel },
      { id: "identities", label: "Identities", content: controlsPanel },
      { id: "decision", label: "Decision Tree", content: practicePanel },
    ];
  }
  return [
    { id: "model", label: "Model", content: visualPanel },
    { id: "method", label: "Method", content: methodPanel },
    { id: "controls", label: "Controls", content: controlsPanel },
    { id: "practice", label: "Practice", content: practicePanel },
  ];
}

type Class12Details = {
  steps: string[];
  verification: string[];
  questions: NCERTPracticeQuestion[];
  diagramSummary: string;
  links: { label: string; href: string }[];
};

function class12Details(kind: Class12LabKind, preset: number, a: number, b: number, c: number): Class12Details {
  const commonLinks = linksFor(kind);
  if (kind === "relations-functions") {
    const domain = ["A", "B", "C"];
    const codomain = ["1", "2", "3"];
    const pairs: RelationPair[] = preset === 0
      ? [["A", "A"], ["B", "B"], ["C", "C"], ["A", "B"], ["B", "A"]]
      : preset === 1
        ? [["A", "1"], ["B", "2"], ["C", "3"]]
        : preset === 2
          ? [["A", "1"], ["B", "1"], ["C", "2"]]
          : [["A", "1"], ["A", "2"], ["B", "2"]];
    const relationSet = ["A", "B", "C"];
    const propertyReport = relationPropertyReport(relationSet, pairs);
    const classifier = functionClassifier(domain, codomain, pairs);
    const composed = composeRelations([["A", "B"], ["B", "C"]], [["B", "A"], ["C", "C"]]);
    return {
      steps: [
        `Build the relation matrix row by row: ${relationMatrix(domain, codomain, pairs).map((row) => row.join(" ")).join(" / ")}.`,
        `Check reflexive pairs: missing ${propertyReport.missingReflexive.join(", ") || "none"}.`,
        `Check symmetry and transitivity: symmetric ${propertyReport.symmetric ? "yes" : "no"}, transitive ${propertyReport.transitive ? "yes" : "no"}.`,
        `Classify function behavior: function ${classifier.isFunction ? "yes" : "no"}, one-one ${classifier.oneOne ? "yes" : "no"}, onto ${classifier.onto ? "yes" : "no"}.`,
        `Composition sample gives ${composed.map(([x, y]) => `${x}->${y}`).join(", ") || "no matching chain"}; inverse pairs are ${inverseRelation(pairs).map(([x, y]) => `${x}->${y}`).join(", ")}.`,
      ],
      verification: [
        `Equivalence verdict: ${propertyReport.equivalence ? "yes" : "no"}.`,
        classifier.functionFailures.length ? `Function fails at ${classifier.functionFailures.map(([input]) => input).join(", ")}.` : "Every input has exactly one image.",
        classifier.repeatedOutputs.length ? `Not one-one because outputs repeat: ${classifier.repeatedOutputs.join(", ")}.` : "No output is repeated.",
        classifier.missingOutputs.length ? `Not onto because missing outputs: ${classifier.missingOutputs.join(", ")}.` : "Every codomain element is used.",
      ],
      questions: [
        { id: "rf-function", prompt: "In a function, how many outputs may one input have?", answer: "one", hint: "Use the vertical/arrow rule.", explanation: "A function gives each input exactly one output.", choices: ["one", "two", "any number", "none"] },
        { id: "rf-bijection", prompt: "A one-one and onto function is called what?", answer: "bijective", hint: "It has both injective and surjective behavior.", explanation: "One-one plus onto is bijective.", choices: ["bijective", "constant", "partial", "empty"] },
      ],
      diagramSummary: "Left nodes are inputs, right nodes are outputs, arrows are ordered pairs, and the matrix records the same relation.",
      links: commonLinks,
    };
  }
  if (kind === "determinants") {
    const matrix2: Matrix2 = [[a, b], [c, 4]];
    const matrix3: Matrix3 = [[1, 2, 3], [0, Math.max(1, Math.round(a)), 4], [5, 6, Math.round(b)]];
    const determinant2 = det2(matrix2);
    const determinant3 = det3(matrix3);
    const inv = inverse2(matrix2);
    const cramer = cramer2([[2, 1], [1, 1]], [5, 3]);
    return {
      steps: [
        `2x2 determinant: ad - bc = ${fmt(a)}*4 - ${fmt(b)}*${fmt(c)} = ${fmt(determinant2)}.`,
        `3x3 preset determinant by first-row expansion is ${fmt(determinant3)}.`,
        "Minors remove one row and one column; cofactors apply the + - + sign pattern.",
        inv ? `Adjoint inverse exists. First inverse row is [${fmt(inv[0][0])}, ${fmt(inv[0][1])}].` : "Inverse does not exist because determinant is zero.",
        cramer ? `Cramer's rule preset solves x=${fmt(cramer.x)}, y=${fmt(cramer.y)}.` : "Cramer's rule needs a nonzero determinant.",
      ],
      verification: [
        `Singular check: ${Math.abs(determinant2) < 0.001 ? "singular" : "non-singular"}.`,
        inv ? `A times solution vector check: ${multiplyMatrixVector2([[2, 1], [1, 1]], [2, 1]).join(", ")} equals constants 5, 3.` : "A inverse check is blocked because det(A)=0.",
        "Cofactor sign pattern is + - + / - + - / + - +.",
        `Cramer determinant denominator is ${fmt(cramer?.determinant ?? 0)}.`,
      ],
      questions: [
        { id: "det-2", prompt: "Find det [[2, 3], [1, 4]].", answer: 5, tolerance: 0.001, hint: "Use ad - bc.", explanation: "2*4 - 3*1 = 5." },
        { id: "det-singular", prompt: "If det(A)=0, does A inverse exist?", answer: "no", hint: "Zero area scale collapses space.", explanation: "A matrix with determinant 0 is singular and has no inverse.", choices: ["yes", "no", "always", "only for 3x3"] },
      ],
      diagramSummary: "The parallelogram shows signed area scaling; determinant zero collapses the shape into a line.",
      links: commonLinks,
    };
  }
  if (kind === "continuity-differentiability") {
    const cases = ["continuous", "removable-hole", "jump", "corner", "cusp", "vertical-tangent"] as const;
    const report = classifyContinuityCase(cases[preset] ?? "continuous");
    return {
      steps: [
        `Compare LHL = ${report.lhl} and RHL = ${report.rhl}.`,
        `Compare the common limit with f(a): ${report.value}.`,
        `Continuity verdict: ${report.continuous ? "continuous" : "not continuous"}.`,
        `Differentiability verdict: ${report.differentiable ? "differentiable" : "not differentiable"}.`,
        `Rule stepper sample: ${derivativeRuleStep("chain").join(" -> ")}`,
      ],
      verification: [
        report.reason,
        "Differentiability requires continuity plus equal finite left and right derivatives.",
        `Product rule: ${derivativeRuleStep("product").join(" / ")}`,
        `Parametric derivative: ${derivativeRuleStep("parametric").join(" / ")}`,
      ],
      questions: [
        { id: "cd-corner", prompt: "Is a sharp corner differentiable?", answer: "no", hint: "Check left and right slopes.", explanation: "A corner has different one-sided derivative values.", choices: ["yes", "no", "only if continuous", "always"] },
        { id: "cd-hole", prompt: "A removable hole has matching LHL/RHL but f(a) missing. Is it continuous?", answer: "no", hint: "Continuity also needs f(a).", explanation: "The value must equal the limit." },
      ],
      diagramSummary: "The curve marks the test point; breaks, holes, jumps, corners, and tangent behavior decide the verdict.",
      links: commonLinks,
    };
  }
  if (kind === "integration-methods") {
    const presets = ["substitution-cos-x2", "by-parts-x-exp", "partial-fractions", "even-definite", "odd-definite", "area-between"] as const;
    const integration = integrationPresetStepper(presets[preset] ?? "substitution-cos-x2");
    return {
      steps: integration.steps,
      verification: [
        `Supported preset: ${integration.expression}.`,
        `Method: ${integration.method}.`,
        `Answer: ${integration.answer}.`,
        `Verification: ${integration.verification}.`,
        "Unsupported free-form expressions should be labeled as unsupported instead of guessed.",
      ],
      questions: [
        { id: "int-sub", prompt: "What is integral 2x cos(x^2) dx?", answer: "sin(x^2)+c", hint: "Let u=x^2.", explanation: "du=2x dx, so the integral is sin(x^2)+C.", commonMistake: "Use substitution and include +C." },
        { id: "int-area", prompt: "Area between y=x and y=x^2 on [0,1] is?", answer: 1 / 6, tolerance: 0.001, hint: "Integrate x - x^2 from 0 to 1.", explanation: "1/2 - 1/3 = 1/6." },
      ],
      diagramSummary: "The shaded region and method card connect the symbolic integral to a visual area or algebraic transformation.",
      links: commonLinks,
    };
  }
  if (kind === "differential-equations") {
    const presets = ["growth", "xy-separable", "linear-exp", "linear-x"] as const;
    const de = differentialEquationPreset(presets[preset] ?? "growth");
    const ic = applyInitialConditionForGrowth(a / 4, 0, b);
    return {
      steps: de.steps,
      verification: [
        `Equation: ${de.equation}.`,
        `Type: ${de.type}.`,
        `Solution form: ${de.solution}.`,
        `Substitution check: ${de.verification}.`,
        `Initial-condition sample gives ${ic.solution}.`,
      ],
      questions: [
        { id: "de-order", prompt: "What is the order of dy/dx + y = e^x?", answer: 1, tolerance: 0.001, hint: "Look at the highest derivative.", explanation: "Only first derivative appears." },
        { id: "de-if", prompt: "For dy/dx + y = e^x, the integrating factor is?", answer: "e^x", hint: "IF = e^(integral P dx).", explanation: "Here P(x)=1, so IF=e^x." },
      ],
      diagramSummary: "Small slope marks show the differential equation field; the solution curve should follow the local directions.",
      links: commonLinks,
    };
  }
  if (kind === "vectors-3d-geometry") {
    const u: Vector3 = [a, c, 2];
    const v: Vector3 = [b, 2, 3];
    const crossValue = cross(u, v);
    const cosines = directionCosines(u);
    return {
      steps: [
        `Vector addition forms the parallelogram from u=(${u.join(",")}) and v=(${v.join(",")}).`,
        `Dot product u.v = ${fmt(dot(u, v))}; angle = ${fmt(angleBetween(u, v))} radians.`,
        `Cross product u x v = (${crossValue.map(fmt).join(", ")}), area = ${fmt(magnitude(crossValue))}.`,
        `Projection length of u on v = ${fmt(projectionLength(u, v))}.`,
        `3D line form: ${lineVectorForm([1, 2, 3], u)}.`,
      ],
      verification: [
        "Dot product verifies u.v = |u||v|cos(theta).",
        "Cross product magnitude verifies parallelogram area.",
        `Direction cosines are (${cosines.map(fmt).join(", ")}), and their squares sum to ${fmt(cosines.reduce((sum, item) => sum + item * item, 0))}.`,
        `Skew-line shortest-distance sample: ${fmt(shortestDistanceSkew([0, 0, 0], [1, 0, 0], [0, 1, 1], [0, 1, 0]))}.`,
      ],
      questions: [
        { id: "vec-dot", prompt: "Dot product of (1,2,3) and (4,5,6)?", answer: 32, tolerance: 0.001, hint: "Multiply matching components and add.", explanation: "1*4 + 2*5 + 3*6 = 32." },
        { id: "vec-perp", prompt: "If a.b = 0 for nonzero vectors, the vectors are?", answer: "perpendicular", hint: "cos(theta)=0.", explanation: "The angle is 90 degrees.", choices: ["parallel", "perpendicular", "same", "zero"] },
      ],
      diagramSummary: "The 3D-like vector scene projects vectors to the plane while reporting dot, cross, projection, direction cosines, and line form.",
      links: commonLinks,
    };
  }
  if (kind === "bayes-theorem") {
    const prior = clamp01((a + 8) / 16);
    const likelihood = clamp01((b + 8) / 16);
    const falsePositive = clamp01((c + 8) / 32);
    const bayes = bayesPosterior(prior, likelihood, falsePositive);
    return {
      steps: [
        `Prior P(A) = ${fmt(prior)}.`,
        `Likelihood P(E|A) = ${fmt(likelihood)} and false positive P(E|not A) = ${fmt(falsePositive)}.`,
        `Evidence P(E) = P(A)P(E|A) + P(not A)P(E|not A) = ${fmt(bayes.evidence)}.`,
        `Posterior numerator = ${fmt(bayes.numerator)}; denominator = ${fmt(bayes.denominator)}.`,
        `P(A|E) = ${fmt(bayes.posterior)}.`,
      ],
      verification: [
        "Tree mode and table mode use the same numerator/denominator.",
        "Posterior must stay between 0 and 1.",
        "A high false-positive rate can reduce confidence even when the test is sensitive.",
      ],
      questions: [
        { id: "bayes-evidence", prompt: "If P(A)=0.5, P(E|A)=0.8, P(E|not A)=0.2, what is P(E)?", answer: 0.5, tolerance: 0.001, hint: "Use total probability.", explanation: "0.5*0.8 + 0.5*0.2 = 0.5." },
        { id: "bayes-name", prompt: "Bayes theorem computes posterior probability after what is observed?", answer: "evidence", hint: "The event E updates belief.", explanation: "Evidence updates the prior into the posterior.", choices: ["evidence", "area", "slope", "matrix"] },
      ],
      diagramSummary: "The probability tree splits prior and non-prior cases, then recombines positive evidence into the posterior.",
      links: commonLinks,
    };
  }
  if (kind === "linear-programming") {
    const constraints = [
      { a: 1, b: 1, c: 6, relation: "<=" as const },
      { a: 1, b: 0, c: 5, relation: "<=" as const },
      { a: 0, b: 1, c: 4, relation: "<=" as const },
    ];
    const corners = feasibleCorners(constraints);
    const optimum = optimizeCorners(corners, [Math.max(1, a), Math.max(1, b)]);
    return {
      steps: [
        "Plot each constraint boundary as a line.",
        "Shade the side satisfying all inequalities.",
        `List feasible corners: ${corners.map(([x, y]) => `(${x},${y})`).join(", ")}.`,
        `Evaluate Z=${fmt(Math.max(1, a))}x+${fmt(Math.max(1, b))}y at each corner.`,
        optimum ? `Optimum shown at (${optimum.point.join(",")}) with value ${fmt(optimum.value)}.` : "No feasible corner detected.",
      ],
      verification: [
        "Linear objectives reach max/min at a corner when the feasible region is bounded.",
        "The corner table checks every candidate.",
        optimum ? `Highlighted optimum value is ${fmt(optimum.value)}.` : "Simple infeasible warning: no common feasible corner was found.",
      ],
      questions: [
        { id: "lpp-corner", prompt: "For a bounded feasible polygon, where does a linear objective attain optimum?", answer: "corner", hint: "Check the corner-point theorem.", explanation: "It is enough to evaluate corner points.", choices: ["corner", "middle only", "outside", "never"] },
        { id: "lpp-eval", prompt: "Evaluate Z=3x+2y at (3,1).", answer: 11, tolerance: 0.001, hint: "Substitute x=3,y=1.", explanation: "3*3 + 2*1 = 11." },
      ],
      diagramSummary: "The shaded polygon is the feasible region, and the dashed objective line slides until it touches the best corner.",
      links: commonLinks,
    };
  }
  const principal = inverseTrigPrincipal(preset, Math.max(-1, Math.min(1, a / 8)));
  return {
    steps: [
      "Restrict the original trig function so its inverse becomes a function.",
      `Choose principal branch for ${principal.fn}.`,
      `Input x = ${fmt(principal.x)} lies in the allowed domain.`,
      `Principal value = ${fmt(principal.value)} radians.`,
      "Use identity cards only within their principal-value conditions.",
    ],
    verification: [
      "sin^-1(x) + cos^-1(x) = pi/2 for x in [-1,1].",
      "tan^-1(x) + cot^-1(x) = pi/2 under the principal convention used in NCERT examples.",
      "Principal branch prevents multiple answers for the same inverse input.",
    ],
    questions: [
      { id: "it-sin", prompt: "sin^-1(1/2) equals?", answer: "pi/6", hint: "Use the principal range [-pi/2, pi/2].", explanation: "sin(pi/6)=1/2 and pi/6 is principal.", choices: ["pi/6", "5pi/6", "pi", "0"] },
      { id: "it-id", prompt: "sin^-1(x)+cos^-1(x) equals?", answer: "pi/2", hint: "This is the standard complementary identity.", explanation: "For x in [-1,1], the principal values sum to pi/2." },
    ],
    diagramSummary: "The highlighted band marks the chosen principal branch so the inverse graph passes the function test.",
    links: commonLinks,
  };
}

function linksFor(kind: Class12LabKind) {
  return getNCERTConceptResourceLinks(conceptIdByKind[kind]).map((resource) => ({
    label: resource.label,
    href: resource.href,
  }));
}

const conceptIdByKind: Record<Class12LabKind, string> = {
  "relations-functions": "class-12-relations-functions",
  determinants: "class-12-determinants",
  "continuity-differentiability": "class-12-continuity-differentiability",
  "integration-methods": "class-12-integration-methods",
  "differential-equations": "class-12-differential-equations",
  "vectors-3d-geometry": "class-12-vectors-3d-geometry",
  "bayes-theorem": "class-12-bayes-theorem",
  "linear-programming": "class-12-linear-programming",
  "inverse-trig": "class-12-inverse-trig",
};

function inverseTrigPrincipal(preset: number, x: number) {
  const fns = ["sin^-1", "cos^-1", "tan^-1"];
  const fn = fns[preset] ?? fns[0];
  const value = fn === "cos^-1" ? Math.acos(x) : fn === "tan^-1" ? Math.atan(x) : Math.asin(x);
  return { fn, x, value };
}

function NumberInput({ label, value, setValue, min, max, step }: { label: string; value: number; setValue: (value: number) => void; min: number; max: number; step: number }) {
  return (
    <label className="mt-4 block text-sm font-black text-slate-700 dark:text-slate-200">
      {label}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
      <input type="number" value={value} step={step} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-3 py-2 font-mono font-black dark:border-cyan-300/20 dark:bg-slate-900" />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

type Panel = {
  visualTitle: string;
  visualDescription: string;
  verdict: string;
  practice: string;
  metrics: { label: string; value: string }[];
  svg: JSX.Element;
};

function class12Panel(kind: Class12LabKind, preset: number, a: number, b: number, c: number): Panel {
  if (kind === "relations-functions") return relationPanel(preset);
  if (kind === "determinants") return determinantPanel(a, b, c);
  if (kind === "continuity-differentiability") return continuityPanel(preset);
  if (kind === "integration-methods") return integrationPanel(preset, a, b);
  if (kind === "differential-equations") return differentialEquationPanel(a, b);
  if (kind === "vectors-3d-geometry") return vectorPanel(a, b, c);
  if (kind === "bayes-theorem") return bayesPanel(a, b, c);
  if (kind === "linear-programming") return lppPanel(a, b);
  return inverseTrigPanel(preset, Math.max(-1, Math.min(1, a / 8)));
}

function relationPanel(preset: number): Panel {
  const relations = [
    { pairs: [["A", "A"], ["B", "B"], ["C", "C"], ["A", "B"], ["B", "A"]], verdict: "Reflexive and symmetric; not transitive because A relates B and B relates A but A-A is okay while added chains can fail in variants." },
    { pairs: [["A", "1"], ["B", "2"], ["C", "3"]], verdict: "One-one and onto for the shown codomain: each input has one output and every output is used." },
    { pairs: [["A", "1"], ["B", "1"], ["C", "2"]], verdict: "Function but not one-one; two inputs share output 1." },
    { pairs: [["A", "1"], ["A", "2"], ["B", "2"]], verdict: "Not a function because A has two images." },
  ];
  const relation = relations[preset] ?? relations[0];
  return {
    visualTitle: "Mapping diagram and relation matrix",
    visualDescription: "Arrows show ordered pairs; the matrix records the same information.",
    verdict: relation.verdict,
    practice: "Change examples and decide: function, one-one, onto, equivalence, or not.",
    metrics: [
      { label: "ordered pairs", value: String(relation.pairs.length) },
      { label: "inputs", value: "A, B, C" },
      { label: "outputs", value: "1, 2, 3" },
    ],
    svg: (
      <g>
        {["A", "B", "C"].map((node, i) => <Node key={node} x={150} y={130 + i * 90} label={node} />)}
        {["1", "2", "3"].map((node, i) => <Node key={node} x={520} y={130 + i * 90} label={node} />)}
        {relation.pairs.map(([from, to], i) => {
          const fy = 130 + ["A", "B", "C"].indexOf(from) * 90;
          const ty = 130 + ["1", "2", "3", "A", "B", "C"].indexOf(to) % 3 * 90;
          return <Arrow key={`${from}-${to}-${i}`} x1={190} y1={fy} x2={480} y2={ty} />;
        })}
        <Text x={80} y={60} value="Relation as arrows" />
        <Text x={590} y={60} value="Matrix: 1 means related" />
      </g>
    ),
  };
}

function determinantPanel(a: number, b: number, c: number): Panel {
  const d = 4;
  const det = a * d - b * c;
  const invertible = Math.abs(det) > 0.001;
  return {
    visualTitle: "Area scale and inverse check",
    visualDescription: "The transformed unit square has signed area equal to the determinant.",
    verdict: invertible ? `det(A) = ${fmt(det)}, so the inverse exists.` : "det(A) is 0, so rows/columns collapse and inverse does not exist.",
    practice: "Try to make determinant 0. What happens to the parallelogram area?",
    metrics: [
      { label: "matrix", value: `[[${fmt(a)}, ${fmt(b)}], [${fmt(c)}, 4]]` },
      { label: "det", value: fmt(det) },
      { label: "inverse", value: invertible ? "exists" : "no inverse" },
    ],
    svg: (
      <g>
        <Axis2D />
        <polygon points={`380,230 ${380 + a * 35},${230 - c * 35} ${380 + (a + b) * 35},${230 - (c + d) * 35} ${380 + b * 35},${230 - d * 35}`} fill="#22d3ee55" stroke="#67e8f9" strokeWidth="4" />
        <Arrow x1={380} y1={230} x2={380 + a * 35} y2={230 - c * 35} color="#facc15" />
        <Arrow x1={380} y1={230} x2={380 + b * 35} y2={230 - d * 35} color="#fb7185" />
        <Text x={80} y={70} value="det = ad - bc" />
        <Text x={80} y={105} value={`= ${fmt(a)}*4 - ${fmt(b)}*${fmt(c)} = ${fmt(det)}`} />
      </g>
    ),
  };
}

function continuityPanel(preset: number): Panel {
  const labels = ["smooth", "hole", "jump", "corner"];
  const verdicts = [
    "Continuous and differentiable at the marked point.",
    "Left and right limits agree, but the function value is missing: not continuous.",
    "Left and right limits differ: not continuous and not differentiable.",
    "Continuous, but the sharp corner has no single tangent slope.",
  ];
  return {
    visualTitle: "Limit and derivative behavior",
    visualDescription: "The highlighted point tests continuity first, then differentiability.",
    verdict: verdicts[preset] ?? verdicts[0],
    practice: "Ask first: do the limits match? Then ask: is there one tangent slope?",
    metrics: [
      { label: "case", value: labels[preset] ?? labels[0] },
      { label: "continuous", value: preset === 0 || preset === 3 ? "yes" : "no" },
      { label: "differentiable", value: preset === 0 ? "yes" : "no" },
    ],
    svg: <CurveCase preset={preset} />,
  };
}

function integrationPanel(preset: number, a: number, b: number): Panel {
  const method = ["substitution", "by parts", "partial fractions", "area between curves"][preset] ?? "substitution";
  const area = Math.abs((a + 4) * (b + 4)) / 4;
  return {
    visualTitle: "Method stepper and shaded area",
    visualDescription: "Each method is shown as a structural choice, not just a formula.",
    verdict: `${method}: identify the structure first, then transform the integral.`,
    practice: "Before calculating, name the method and the reason it fits.",
    metrics: [
      { label: "method", value: method },
      { label: "sample area", value: fmt(area) },
      { label: "check", value: "differentiate answer" },
    ],
    svg: (
      <g>
        <Axis2D />
        <path d="M100 330 C220 160 300 120 390 250 C470 360 570 220 670 135" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <path d="M150 330 C240 210 330 190 420 260 C500 315 570 250 640 190 L640 330 Z" fill="#facc1555" stroke="#facc15" strokeWidth="3" />
        <Text x={95} y={70} value={`Selected method: ${method}`} />
        <Text x={95} y={105} value="Shaded part connects the symbolic integral to area." />
      </g>
    ),
  };
}

function differentialEquationPanel(a: number, b: number): Panel {
  return {
    visualTitle: "Slope field and solution curve",
    visualDescription: "The blue curve should locally follow the small line segments.",
    verdict: `Example family: y = C e^(${fmt(a / 4)}x). Initial value slider gives C = ${fmt(b)}.`,
    practice: "Pick one point on the solution curve and compare it with the nearby slope marker.",
    metrics: [
      { label: "order", value: "1" },
      { label: "degree", value: "1" },
      { label: "initial C", value: fmt(b) },
    ],
    svg: (
      <g>
        <Axis2D />
        {Array.from({ length: 10 }, (_, ix) => Array.from({ length: 6 }, (_, iy) => {
          const x = 120 + ix * 60;
          const y = 100 + iy * 50;
          return <line key={`${ix}-${iy}`} x1={x - 15} y1={y + 6} x2={x + 15} y2={y - 6} stroke="#94a3b8" strokeWidth="2" />;
        }))}
        <path d="M105 335 C210 310 310 260 420 205 C530 150 610 115 680 95" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <Node x={260} y={285} label="IC" color="#facc15" />
      </g>
    ),
  };
}

function vectorPanel(a: number, b: number, c: number): Panel {
  const dot = a * b + c * 2;
  const area = Math.abs(a * 2 - b * c);
  return {
    visualTitle: "Dot, cross, projection, and line direction",
    visualDescription: "The same two vectors explain angle, area, and projection.",
    verdict: `Dot product controls angle; cross product magnitude gives parallelogram area ${fmt(area)}.`,
    practice: "Make the dot product near 0 and observe the angle becoming close to 90 degrees.",
    metrics: [
      { label: "u dot v", value: fmt(dot) },
      { label: "|u x v|", value: fmt(area) },
      { label: "projection", value: fmt(dot / Math.max(1, Math.hypot(b, 2))) },
    ],
    svg: (
      <g>
        <Axis2D />
        <Arrow x1={380} y1={250} x2={380 + a * 40} y2={250 - c * 40} color="#22d3ee" />
        <Arrow x1={380} y1={250} x2={380 + b * 40} y2={170} color="#facc15" />
        <polygon points={`380,250 ${380 + a * 40},${250 - c * 40} ${380 + (a + b) * 40},${170 - c * 40} ${380 + b * 40},170`} fill="#22d3ee33" stroke="#67e8f9" />
        <Text x={95} y={75} value="u dot v measures alignment" />
        <Text x={95} y={110} value="|u x v| measures parallelogram area" />
      </g>
    ),
  };
}

function bayesPanel(a: number, b: number, c: number): Panel {
  const prior = clamp01((a + 8) / 16);
  const sensitivity = clamp01((b + 8) / 16);
  const falsePositive = clamp01((c + 8) / 32);
  const evidence = prior * sensitivity + (1 - prior) * falsePositive;
  const posterior = evidence === 0 ? 0 : (prior * sensitivity) / evidence;
  return {
    visualTitle: "Tree update from prior to posterior",
    visualDescription: "Bayes theorem reweights the branch after evidence is observed.",
    verdict: `After positive evidence, posterior probability is ${fmt(100 * posterior)}%.`,
    practice: "Raise the false-positive rate and notice how the posterior can fall.",
    metrics: [
      { label: "prior", value: `${fmt(100 * prior)}%` },
      { label: "evidence", value: `${fmt(100 * evidence)}%` },
      { label: "posterior", value: `${fmt(100 * posterior)}%` },
    ],
    svg: (
      <g>
        <Text x={80} y={65} value="Bayes tree" />
        <Node x={120} y={230} label="Start" />
        <Node x={340} y={150} label="A" color="#22d3ee" />
        <Node x={340} y={310} label="not A" color="#fb7185" />
        <Node x={590} y={115} label="E" color="#facc15" />
        <Node x={590} y={275} label="E" color="#facc15" />
        <Arrow x1={155} y1={220} x2={305} y2={160} />
        <Arrow x1={155} y1={240} x2={305} y2={300} />
        <Arrow x1={375} y1={145} x2={555} y2={120} />
        <Arrow x1={375} y1={305} x2={555} y2={280} />
        <Text x={205} y={170} value={`P(A) ${fmt(prior)}`} />
        <Text x={410} y={115} value={`P(E|A) ${fmt(sensitivity)}`} />
        <Text x={405} y={285} value={`P(E|not A) ${fmt(falsePositive)}`} />
      </g>
    ),
  };
}

function lppPanel(a: number, b: number): Panel {
  const corners = [[0, 0], [6, 0], [4, 3], [0, 5]];
  const scored = corners.map(([x, y]) => ({ x, y, z: a * x + b * y })).sort((p, q) => q.z - p.z);
  const best = scored[0];
  return {
    visualTitle: "Feasible region and corner evaluation",
    visualDescription: "The objective line reaches its optimum at a corner of the polygon.",
    verdict: `Best shown corner is (${best.x}, ${best.y}) with Z = ${fmt(best.z)}.`,
    practice: "Change objective coefficients and watch the winning corner change.",
    metrics: [
      { label: "objective", value: `Z=${fmt(a)}x+${fmt(b)}y` },
      { label: "best corner", value: `(${best.x}, ${best.y})` },
      { label: "max Z", value: fmt(best.z) },
    ],
    svg: (
      <g>
        <Axis2D />
        <polygon points="160,330 520,330 440,180 160,80" fill="#22d3ee44" stroke="#67e8f9" strokeWidth="4" />
        {corners.map(([x, y]) => <Node key={`${x}-${y}`} x={160 + x * 60} y={330 - y * 50} label={`${x},${y}`} color="#facc15" />)}
        <line x1="165" y1={330 - (best.z / Math.max(1, b || 1)) * 20} x2="610" y2={330 - (best.z / Math.max(1, a || 1)) * 20} stroke="#fb7185" strokeWidth="4" strokeDasharray="10 8" />
      </g>
    ),
  };
}

function inverseTrigPanel(preset: number, x: number): Panel {
  const fns = ["sin^-1", "cos^-1", "tan^-1"];
  const fn = fns[preset] ?? fns[0];
  const value = fn === "cos^-1" ? Math.acos(x) : fn === "tan^-1" ? Math.atan(x) : Math.asin(x);
  return {
    visualTitle: "Principal value graph",
    visualDescription: "The restricted range makes the inverse relation a function.",
    verdict: `${fn}(${fmt(x)}) = ${fmt(value)} radians.`,
    practice: "Explain why inverse sine and inverse cosine choose different principal ranges.",
    metrics: [
      { label: "function", value: fn },
      { label: "input", value: fmt(x) },
      { label: "principal value", value: fmt(value) },
    ],
    svg: (
      <g>
        <Axis2D />
        <path d="M115 250 C220 90 320 90 430 250 C530 410 620 410 690 250" fill="none" stroke="#22d3ee" strokeWidth="4" />
        <rect x="260" y="90" width="210" height="320" fill="#facc151f" stroke="#facc15" strokeDasharray="8 6" />
        <Node x={380 + x * 120} y={250 - Math.sin(value) * 120} label="PV" color="#facc15" />
        <Text x={90} y={70} value="Highlighted band = chosen principal range" />
      </g>
    ),
  };
}

function CurveCase({ preset }: { preset: number }) {
  if (preset === 1) {
    return (
      <g>
        <Axis2D />
        <path d="M110 330 C230 220 320 185 370 175 M390 175 C470 185 560 240 660 335" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <circle cx="380" cy="175" r="12" fill="#020617" stroke="#facc15" strokeWidth="4" />
        <Node x={380} y={260} label="f(a)" color="#fb7185" />
      </g>
    );
  }
  if (preset === 2) {
    return (
      <g>
        <Axis2D />
        <path d="M120 310 C230 260 310 230 380 220" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <path d="M390 130 C470 155 560 210 660 290" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <line x1="385" y1="90" x2="385" y2="350" stroke="#facc15" strokeDasharray="8 8" />
      </g>
    );
  }
  if (preset === 3) {
    return (
      <g>
        <Axis2D />
        <polyline points="120,330 380,175 650,325" fill="none" stroke="#22d3ee" strokeWidth="5" />
        <Node x={380} y={175} label="corner" color="#facc15" />
      </g>
    );
  }
  return (
    <g>
      <Axis2D />
      <path d="M110 330 C210 270 300 210 380 180 C470 145 570 180 660 250" fill="none" stroke="#22d3ee" strokeWidth="5" />
      <line x1="315" y1="205" x2="455" y2="155" stroke="#facc15" strokeWidth="4" />
      <Node x={380} y={180} label="a" color="#facc15" />
    </g>
  );
}

function Grid() {
  return (
    <g>
      <rect width="760" height="460" fill="#020617" />
      {Array.from({ length: 13 }, (_, i) => <line key={`v-${i}`} x1={80 + i * 50} y1="50" x2={80 + i * 50} y2="410" stroke="#123044" strokeWidth="1" />)}
      {Array.from({ length: 8 }, (_, i) => <line key={`h-${i}`} x1="70" y1={70 + i * 45} x2="700" y2={70 + i * 45} stroke="#123044" strokeWidth="1" />)}
    </g>
  );
}

function Axis2D() {
  return (
    <g>
      <line x1="80" y1="330" x2="700" y2="330" stroke="#cbd5e1" strokeWidth="3" />
      <line x1="380" y1="60" x2="380" y2="410" stroke="#cbd5e1" strokeWidth="3" />
    </g>
  );
}

function Node({ x, y, label, color = "#22d3ee" }: { x: number; y: number; label: string; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="24" fill={color} stroke="#f8fafc" strokeWidth="3" />
      <text x={x} y={y + 5} textAnchor="middle" className="fill-slate-950 text-sm font-black">{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#e2e8f0" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r="5" fill={color} />
    </g>
  );
}

function Text({ x, y, value }: { x: number; y: number; value: string }) {
  return <text x={x} y={y} className="fill-slate-100 text-lg font-black">{value}</text>;
}

function fmt(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  return Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2).replace(/\.00$/, "");
}

function clamp01(value: number) {
  return Math.max(0.01, Math.min(0.99, value));
}
