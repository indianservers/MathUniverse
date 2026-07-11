import { useState } from "react";
import { Link } from "react-router-dom";
import NCERTCompactPanel from "../layout/NCERTCompactPanel";
import NCERTSubTabs from "../layout/NCERTSubTabs";
import NCERTTabbedWorkspace from "../layout/NCERTTabbedWorkspace";
import NCERTPracticeCheck from "../practice/NCERTPracticeCheck";
import type { NCERTConcept } from "../../../data/ncertConcepts";
import { getNCERTPracticeItems } from "../../../data/ncertPracticeBank";
import { getNCERTConceptResourceLinks } from "../../../data/ncertResourceLinks";
import NCERTTeacherModePanel from "../teacher/NCERTTeacherModePanel";
import {
  annulusArea,
  bptRatios,
  classifyLinearSystem,
  coneSlantHeight,
  coneVolume,
  cylinderVolume,
  distanceFromHeightAngle,
  frustumCSA,
  frustumSlantHeight,
  frustumTSA,
  frustumVolume,
  groupedStats,
  heightFromAngleDistance,
  hemisphereCSA,
  round,
  safeNumber,
  sectorArea,
  segmentArea,
  similarTriangleAreaRatio,
  solveLinearSystem,
  sphereVolume,
  tangentCase,
  tangentLength,
  type GroupedClass,
} from "./class10BoardExamMath";

export const class10PriorityRouteIds = [
  "class-10-circle-tangent-radius",
  "class-10-two-tangents",
  "class-10-triangle-bpt-converse",
  "class-10-similarity-criteria",
  "class-10-areas-similar-triangles",
  "class-10-linear-substitution-elimination",
  "class-10-linear-consistency",
  "class-10-grouped-mean-methods",
  "class-10-grouped-mode",
  "class-10-grouped-median",
  "class-10-composite-circle-regions",
  "class-10-combination-solids",
  "class-10-recasting-solids",
  "class-10-frustum-cone",
  "class-10-heights-distances",
] as const;

export type Class10PriorityRouteId = typeof class10PriorityRouteIds[number];

export function isClass10PriorityRoute(id: string): id is Class10PriorityRouteId {
  return (class10PriorityRouteIds as readonly string[]).includes(id);
}

function resourceLinksForConcept(concept: NCERTConcept) {
  return getNCERTConceptResourceLinks(concept).map((resource) => ({
    label: resource.label,
    to: resource.href,
  }));
}

type Preset = {
  label: string;
  values: number[];
};

type Practice = {
  prompt: string;
  expected: number | string;
  tolerance?: number;
  hint: string;
};

type LabPanel = {
  title: string;
  subtitle: string;
  presets: Preset[];
  labels: string[];
  defaults: number[];
  formula: string;
  theoremLinks: { label: string; to: string }[];
  render: (values: number[], routeId: Class10PriorityRouteId) => JSX.Element;
  metrics: (values: number[], routeId: Class10PriorityRouteId) => { label: string; value: string }[];
  steps: (values: number[], routeId: Class10PriorityRouteId) => string[];
  practice: (values: number[], routeId: Class10PriorityRouteId) => Practice;
  feedback: (values: number[], routeId: Class10PriorityRouteId) => string;
};

export default function Class10BoardExamLab({ concept }: { concept: NCERTConcept }) {
  const routeId = concept.id as Class10PriorityRouteId;
  const config = getLabPanel(routeId, concept);
  const [values, setValues] = useState(config.defaults);
  const [presetIndex, setPresetIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const practice = config.practice(values, routeId);
  const bankPractice = getNCERTPracticeItems(routeId);
  const result = checkPractice(answer, practice);
  const controlsPanel = (
    <div className="space-y-4">
      <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
        Preset
        <select
          className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-3 py-3 text-sm font-bold dark:border-cyan-300/20 dark:bg-slate-900"
          value={presetIndex}
          onChange={(event) => {
            const next = Number(event.target.value);
            setPresetIndex(next);
            setValues(config.presets[next]?.values ?? config.defaults);
            setAnswer("");
          }}
        >
          {config.presets.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
        </select>
      </label>
      {config.labels.map((label, index) => (
        <NumberInput
          key={label}
          label={label}
          value={values[index] ?? 0}
          onChange={(next) => {
            const updated = [...values];
            updated[index] = next;
            setValues(updated);
          }}
        />
      ))}
      <div className="rounded-2xl bg-slate-950 p-4 text-sm font-bold leading-6 text-cyan-50">
        {config.feedback(values, routeId)}
      </div>
    </div>
  );
  const visualPanel = (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-slate-950 p-2 dark:border-cyan-300/20">
        <svg viewBox="0 0 760 480" role="img" aria-label={`${concept.title} board exam visualization`} className="h-[340px] w-full sm:h-[390px]">
          <title>{concept.title}</title>
          <desc>{config.subtitle}</desc>
          <Grid />
          {config.render(values, routeId)}
        </svg>
      </div>
      <aside className="space-y-3">
        <NCERTCompactPanel title="Live values" description="Read these before solving." accent="emerald">
          <div className="grid gap-2">
            {config.metrics(values, routeId).map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
          </div>
        </NCERTCompactPanel>
        <NCERTCompactPanel title="Controls" description="Tune the current diagram." accent="cyan">
          {controlsPanel}
        </NCERTCompactPanel>
      </aside>
    </div>
  );
  const proofPanel = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-black leading-6 text-cyan-950 dark:bg-cyan-300/10 dark:text-cyan-50">
          {config.formula}
        </div>
        <ol className="space-y-2">
          {config.steps(values, routeId).map((step, index) => (
            <li key={step} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <span className="font-black text-cyan-700 dark:text-cyan-200">Step {index + 1}: </span>{step}
            </li>
          ))}
        </ol>
      </div>
      <NCERTCompactPanel title="Formula substitution" description="Use the current values." accent="violet">
        <div className="space-y-2">
          {config.metrics(values, routeId).map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
        </div>
      </NCERTCompactPanel>
    </div>
  );
  const practicePanel = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      {bankPractice.length > 0 ? (
        <NCERTPracticeCheck title={`${concept.title} practice bank`} questions={bankPractice} conceptId={routeId} compact />
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
          <p className="text-base font-black text-slate-950 dark:text-white">{practice.prompt}</p>
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            inputMode="decimal"
            className="mt-3 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-3 font-mono font-black dark:border-emerald-300/20 dark:bg-slate-900"
            placeholder="Type your answer"
            aria-label="Practice answer"
          />
          <p className={`mt-3 text-sm font-bold ${result.ok ? "text-emerald-700 dark:text-emerald-200" : "text-slate-600 dark:text-slate-300"}`}>
            {answer ? result.message : practice.hint}
          </p>
        </div>
      )}
      <NCERTCompactPanel title="Try next" description="Change the preset, then answer again." accent="amber">
        {controlsPanel}
      </NCERTCompactPanel>
    </div>
  );
  const linksPanel = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {config.theoremLinks.map((link) => (
        <Link key={link.to} to={link.to} className="action-secondary justify-center">
          Open {link.label}
        </Link>
      ))}
      <Link to="/ncert" className="action-secondary justify-center">Open NCERT dashboard</Link>
      <Link to="/formulas" className="action-secondary justify-center">Open formulas</Link>
    </div>
  );
  const notesPanel = (
    <div className="grid gap-4 md:grid-cols-3">
      <NCERTCompactPanel title="Student task" accent="cyan">
        <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{concept.tasks[0] ?? "Move values, predict, then verify."}</p>
      </NCERTCompactPanel>
      <NCERTCompactPanel title="Common mistake" accent="amber">
        <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{config.feedback(values, routeId)}</p>
      </NCERTCompactPanel>
      <NCERTCompactPanel title="Recap" accent="emerald">
        <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{concept.summary}</p>
      </NCERTCompactPanel>
      {bankPractice.length > 0 && (
        <div className="md:col-span-3">
          <NCERTTeacherModePanel title={concept.title} classLevel={concept.classLevel} questions={bankPractice} prompts={concept.tasks} misconception={config.feedback(values, routeId)} extension={concept.outcomes[1] ?? concept.summary} />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Class 10 NCERT board-exam lab</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white">{concept.title}</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{config.subtitle}</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-50">
            real manipulative + checker
          </span>
        </div>
      </section>

      <NCERTTabbedWorkspace
        ariaLabel={`${concept.title} compact board exam tabs`}
        tabs={[
          {
            id: "visual",
            label: "Visual Lab",
            content: (
              <NCERTSubTabs
                ariaLabel={`${concept.title} visual sub-tabs`}
                tabs={class10SubTabs(routeId, {
                  first: visualPanel,
                  second: proofPanel,
                  third: controlsPanel,
                  fourth: linksPanel,
                  practice: practicePanel,
                })}
              />
            ),
          },
          { id: "proof", label: "Stepper / Proof", content: proofPanel },
          { id: "practice", label: "Practice", content: practicePanel },
          { id: "links", label: "Links", content: linksPanel },
          { id: "notes", label: "Notes", content: notesPanel },
        ]}
      />
    </div>
  );
}

function class10SubTabs(routeId: Class10PriorityRouteId, panels: { first: JSX.Element; second: JSX.Element; third: JSX.Element; fourth: JSX.Element; practice: JSX.Element }) {
  if (routeId.includes("circle") || routeId.includes("tangent")) {
    return [
      { id: "construction", label: "Construction", content: panels.first },
      { id: "measurements", label: "Measurements", content: panels.third },
      { id: "proof", label: "Proof", content: panels.second },
      { id: "cases", label: "Cases", content: panels.fourth },
      { id: "practice", label: "Practice", content: panels.practice },
    ];
  }
  if (routeId.includes("triangle") || routeId.includes("similar")) {
    return [
      { id: "bpt", label: "BPT", content: panels.first },
      { id: "converse", label: "Converse", content: panels.second },
      { id: "criteria", label: "Criteria", content: panels.third },
      { id: "area-ratio", label: "Area Ratio", content: panels.fourth },
      { id: "practice", label: "Practice", content: panels.practice },
    ];
  }
  if (routeId.includes("linear")) {
    return [
      { id: "graph", label: "Graph", content: panels.first },
      { id: "substitution", label: "Substitution", content: panels.second },
      { id: "elimination", label: "Elimination", content: panels.third },
      { id: "consistency", label: "Consistency", content: panels.fourth },
      { id: "practice", label: "Practice", content: panels.practice },
    ];
  }
  if (routeId.includes("grouped")) {
    return [
      { id: "table", label: "Table", content: panels.first },
      { id: "mean", label: "Mean", content: panels.second },
      { id: "mode", label: "Mode", content: panels.third },
      { id: "median", label: "Median", content: panels.fourth },
      { id: "practice", label: "Practice", content: panels.practice },
    ];
  }
  if (routeId.includes("height")) {
    return [
      { id: "diagram", label: "Diagram", content: panels.first },
      { id: "one-position", label: "One-position", content: panels.second },
      { id: "two-position", label: "Two-position", content: panels.third },
      { id: "angle-depression", label: "Angle of Depression", content: panels.fourth },
      { id: "practice", label: "Practice", content: panels.practice },
    ];
  }
  return [
    { id: "shape", label: "Shape Visual", content: panels.first },
    { id: "formula", label: "Formula", content: panels.second },
    { id: "decomposition", label: "Decomposition", content: panels.third },
    { id: "live-values", label: "Live Values", content: panels.fourth },
    { id: "practice", label: "Practice", content: panels.practice },
  ];
}

function getLabPanel(routeId: Class10PriorityRouteId, concept: NCERTConcept): LabPanel {
  if (routeId.includes("circle-tangent")) return circleTangentPanel(concept);
  if (routeId.includes("two-tangents")) return twoTangentsPanel(concept);
  if (routeId.includes("triangle") || routeId.includes("similar")) return trianglePanel(concept);
  if (routeId.includes("linear")) return linearPanel(concept);
  if (routeId.includes("grouped")) return statsPanel(concept);
  if (routeId.includes("circle-regions")) return circleRegionPanel(concept);
  if (routeId.includes("solid") || routeId.includes("frustum")) return solidsPanel(concept);
  return heightsPanel(concept);
}

function circleTangentPanel(concept: NCERTConcept): LabPanel {
  return {
    title: "Tangent-radius proof animation",
    subtitle: "Move the point of contact and compare a true tangent with a nearby secant.",
    presets: [
      { label: "standard radius 2", values: [40, 2, 12] },
      { label: "large circle", values: [130, 3, 18] },
      { label: "near-horizontal tangent", values: [5, 2.4, 6] },
    ],
    labels: ["Contact angle degrees", "Radius", "Secant tilt degrees"],
    defaults: [40, concept.defaultB, 12],
    formula: "Radius at the point of contact is perpendicular to the tangent: OT perpendicular PT.",
    theoremLinks: resourceLinksForConcept(concept),
    render: circleTangentSvg,
    metrics: (values) => {
      const theta = values[0];
      return [
        { label: "radius", value: round(values[1]).toString() },
        { label: "tangent angle", value: `${round(theta + 90)} deg` },
        { label: "radius-tangent", value: "90 deg" },
      ];
    },
    steps: () => ["Draw radius OT to the point of contact.", "Draw the line perpendicular to OT at T.", "A line not perpendicular crosses the circle at two points, so it is a secant, not a tangent."],
    practice: () => ({ prompt: "What angle does the radius make with the tangent?", expected: 90, tolerance: 0.5, hint: "Think perpendicular." }),
    feedback: (values) => values[2] === 0 ? "Mistake watch: the comparison line matches the tangent; tilt it to see a secant." : "The tangent touches once; the tilted comparison line cuts the circle twice.",
  };
}

function twoTangentsPanel(concept: NCERTConcept): LabPanel {
  return {
    title: "Two tangents from an external point",
    subtitle: "Move point P inside, on, and outside the circle, then verify both tangent lengths.",
    presets: [
      { label: "external point", values: [5, 2] },
      { label: "on the circle", values: [2, 2] },
      { label: "inside circle", values: [1, 2] },
    ],
    labels: ["OP distance", "Radius"],
    defaults: [concept.defaultA, concept.defaultB],
    formula: "From an external point, tangent lengths are equal: PA = PB.",
    theoremLinks: resourceLinksForConcept(concept),
    render: twoTangentsSvg,
    metrics: (values) => {
      const length = tangentLength(values[0], values[1]);
      return [
        { label: "case", value: tangentCase(values[0], values[1]) },
        { label: "PA", value: round(length).toString() },
        { label: "PB", value: round(length).toString() },
      ];
    },
    steps: () => ["Join OA, OB, and OP.", "OA perpendicular PA and OB perpendicular PB.", "Right triangles OAP and OBP share OP and have OA = OB, so PA = PB by RHS."],
    practice: (values) => ({ prompt: `If OP=${round(values[0])} and r=${round(values[1])}, find each tangent length.`, expected: round(tangentLength(values[0], values[1])), tolerance: 0.08, hint: "Use sqrt(OP^2 - r^2) when P is outside." }),
    feedback: (values) => tangentCase(values[0], values[1]),
  };
}

function trianglePanel(concept: NCERTConcept): LabPanel {
  const isArea = concept.id.includes("areas");
  const isCriteria = concept.id.includes("criteria");
  return {
    title: isArea ? "Area ratio of similar triangles" : isCriteria ? "AA, SSS, SAS similarity checker" : "BPT and converse manipulative",
    subtitle: isArea ? "Scale one triangle and watch area grow by the square of the side ratio." : isCriteria ? "Toggle side and angle conditions to see when similarity is valid." : "Move D and E on two sides and compare AD/DB with AE/EC.",
    presets: [
      { label: "valid theorem case", values: isArea ? [1.5, 0, 1] : [0.45, 0.45, 1.5] },
      { label: "wrong condition", values: isArea ? [2, 8, 1] : [0.35, 0.55, 1.2] },
      { label: "exam friendly", values: isArea ? [2, 0, 1] : [0.6, 0.6, 2] },
    ],
    labels: isArea ? ["Side ratio k", "Angle mismatch", "Area model"] : ["Cut or scale A", "Cut or angle B", "Scale/check C"],
    defaults: [concept.defaultA, concept.defaultB, concept.defaultC ?? 1],
    formula: concept.formula,
    theoremLinks: resourceLinksForConcept(concept),
    render: triangleSvg,
    metrics: (values, routeId) => {
      if (routeId.includes("areas")) return [
        { label: "side ratio", value: round(values[0]).toString() },
        { label: "area ratio", value: round(similarTriangleAreaRatio(values[0])).toString() },
        { label: "verdict", value: Math.abs(values[1]) < 0.1 ? "similar" : "not similar" },
      ];
      const ratios = bptRatios(values[0], values[1]);
      return [
        { label: "AD/DB", value: round(ratios.ratioAB).toString() },
        { label: "AE/EC", value: round(ratios.ratioAC).toString() },
        { label: "verdict", value: ratios.parallel ? "parallel/similar" : "not verified" },
      ];
    },
    steps: (values, routeId) => routeId.includes("areas")
      ? ["Similar triangles keep equal angles.", "All lengths scale by k.", "Area uses two dimensions, so area ratio is k^2."]
      : routeId.includes("criteria")
        ? ["Check angle equality for AA.", "Check all side ratios for SSS.", "Check two side ratios plus the included angle for SAS."]
        : ["Draw DE across the two sides.", "Compute AD/DB and AE/EC.", "If ratios match, the converse says DE is parallel to BC."],
    practice: (values, routeId) => routeId.includes("areas")
      ? { prompt: `If side ratio k=${round(values[0])}, what is the area ratio?`, expected: round(similarTriangleAreaRatio(values[0])), tolerance: 0.08, hint: "Square the side ratio." }
      : { prompt: "For a valid BPT/converse case, should the two ratios be equal? Type yes or no.", expected: bptRatios(values[0], values[1]).parallel ? "yes" : "no", hint: "Compare AD/DB and AE/EC." },
    feedback: (values, routeId) => routeId.includes("areas") ? "Common mistake: do not use k for area ratio; use k squared." : bptRatios(values[0], values[1]).parallel ? "The side ratios match, so the parallel/similarity condition is verified." : "The ratios do not match; this is the wrong-case visual.",
  };
}

function linearPanel(concept: NCERTConcept): LabPanel {
  return {
    title: concept.id.includes("consistency") ? "Consistency ratio and graph checker" : "Substitution and elimination stepper",
    subtitle: "Edit coefficients, read the algebra steps, and verify the result on a graph.",
    presets: [
      { label: "unique solution", values: [2, 1, 7, 1, -1, 1] },
      { label: "parallel lines", values: [2, 1, 7, 4, 2, 3] },
      { label: "coincident lines", values: [2, 1, 7, 4, 2, 14] },
    ],
    labels: ["a1", "b1", "c1", "a2", "b2", "c2"],
    defaults: [2, 1, 7, 1, -1, 1],
    formula: "a1x + b1y = c1 and a2x + b2y = c2; determinant a1b2 - a2b1 decides uniqueness.",
    theoremLinks: resourceLinksForConcept(concept),
    render: linearSvg,
    metrics: (values) => {
      const verdict = classifyLinearSystem(values[0], values[1], values[2], values[3], values[4], values[5]);
      const solution = solveLinearSystem(values[0], values[1], values[2], values[3], values[4], values[5]);
      return [
        { label: "determinant", value: round(values[0] * values[4] - values[3] * values[1]).toString() },
        { label: "verdict", value: verdict },
        { label: "solution", value: solution ? `(${round(solution.x)}, ${round(solution.y)})` : "not unique" },
      ];
    },
    steps: (values) => {
      const [a1, b1, c1, a2, b2, c2] = values;
      return [`Equation 1: ${a1}x + ${b1}y = ${c1}.`, `Equation 2: ${a2}x + ${b2}y = ${c2}.`, `Elimination determinant is ${round(a1 * b2 - a2 * b1)}; classify before solving.`, "Substitution isolates one variable, then replaces it in the other equation."];
    },
    practice: (values) => {
      const solution = solveLinearSystem(values[0], values[1], values[2], values[3], values[4], values[5]);
      return solution
        ? { prompt: "Find x for the unique solution.", expected: round(solution.x), tolerance: 0.08, hint: "Use elimination or the graph intersection." }
        : { prompt: "Type the solution count: none or infinite.", expected: classifyLinearSystem(values[0], values[1], values[2], values[3], values[4], values[5]) === "none" ? "none" : "infinite", hint: "Parallel means none; coincident means infinite." };
    },
    feedback: (values) => `System classification: ${classifyLinearSystem(values[0], values[1], values[2], values[3], values[4], values[5])}. Common mistake: compare all three ratios, not only slopes.`,
  };
}

function statsPanel(concept: NCERTConcept): LabPanel {
  return {
    title: "Grouped statistics table, ogive, and formula checker",
    subtitle: "Edit the distribution by preset and compare mean, mode, median, modal class, and median class.",
    presets: [
      { label: "marks distribution", values: [0, 10, 6, 10, 20, 10, 20, 30, 14, 30, 40, 18, 40, 50, 12] },
      { label: "height distribution", values: [140, 150, 4, 150, 160, 9, 160, 170, 16, 170, 180, 11, 180, 190, 5] },
      { label: "age distribution", values: [10, 20, 3, 20, 30, 8, 30, 40, 15, 40, 50, 7, 50, 60, 2] },
      { label: "daily wages", values: [100, 120, 5, 120, 140, 12, 140, 160, 20, 160, 180, 8, 180, 200, 4] },
    ],
    labels: ["l1", "u1", "f1", "l2", "u2", "f2", "l3", "u3", "f3", "l4", "u4", "f4", "l5", "u5", "f5"],
    defaults: [0, 10, 6, 10, 20, 10, 20, 30, 14, 30, 40, 18, 40, 50, 12],
    formula: concept.formula,
    theoremLinks: resourceLinksForConcept(concept),
    render: statsSvg,
    metrics: (values) => {
      const stats = groupedStats(rowsFromValues(values));
      return [
        { label: "mean", value: round(stats.mean).toString() },
        { label: "mode", value: round(stats.modal).toString() },
        { label: "median", value: round(stats.median).toString() },
      ];
    },
    steps: (values, routeId) => {
      const stats = groupedStats(rowsFromValues(values));
      if (routeId.includes("mode")) return [`Modal class is row ${stats.modalIndex + 1}.`, "Use l + [(f1-f0)/(2f1-f0-f2)]h.", `Mode is ${round(stats.modal)}.`];
      if (routeId.includes("median")) return [`Total frequency n is ${stats.totalFrequency}.`, `Find n/2 = ${round(stats.totalFrequency / 2)} in cumulative frequency.`, `Median is ${round(stats.median)}.`];
      return [`Find each class mark xi.`, `Compute sum fi xi and divide by n=${stats.totalFrequency}.`, `Mean is ${round(stats.mean)}; assumed mean gives the same result.`];
    },
    practice: (values, routeId) => {
      const stats = groupedStats(rowsFromValues(values));
      const expected = routeId.includes("mode") ? stats.modal : routeId.includes("median") ? stats.median : stats.mean;
      return { prompt: `Calculate the ${routeId.includes("mode") ? "mode" : routeId.includes("median") ? "median" : "mean"} for this table.`, expected: round(expected), tolerance: 0.12, hint: "Use the highlighted formula and table values." };
    },
    feedback: (values) => {
      const rows = rowsFromValues(values);
      const invalid = rows.some((row) => row.upper <= row.lower || row.frequency < 0);
      return invalid ? "Invalid input: every class needs upper > lower and non-negative frequency." : "Valid grouped table. Common mistake: use class marks for mean, not lower limits.";
    },
  };
}

function circleRegionPanel(concept: NCERTConcept): LabPanel {
  return {
    title: "Composite circle regions builder",
    subtitle: "Build sectors, segments, annuli, quadrants, semicircles, and cutout-style shaded regions.",
    presets: [
      { label: "sector and segment", values: [90, 5, 2] },
      { label: "ring/annulus", values: [180, 6, 3] },
      { label: "quadrant cutout", values: [90, 4, 1.5] },
    ],
    labels: ["Angle degrees", "Outer radius", "Inner radius"],
    defaults: [concept.defaultA, concept.defaultB, concept.defaultC ?? 2],
    formula: "Sector = theta/360 * pi r^2; segment = sector - triangle; annulus = pi(R^2-r^2).",
    theoremLinks: resourceLinksForConcept(concept),
    render: circleRegionSvg,
    metrics: (values) => [
      { label: "sector", value: round(sectorArea(values[1], values[0])).toString() },
      { label: "segment", value: round(segmentArea(values[1], values[0])).toString() },
      { label: "annulus", value: round(annulusArea(values[1], Math.min(values[1], values[2]))).toString() },
    ],
    steps: () => ["Choose the useful full shapes.", "Subtract the overlap or cutout.", "For segment area, subtract triangle area from sector area."],
    practice: (values) => ({ prompt: "Find the sector area for the shown outer circle.", expected: round(sectorArea(values[1], values[0])), tolerance: 0.12, hint: "Use theta/360 times pi r squared." }),
    feedback: (values) => values[2] >= values[1] ? "Invalid input: inner radius must be smaller than outer radius." : "Common mistake: segment is not just a sector; subtract the triangle.",
  };
}

function solidsPanel(concept: NCERTConcept): LabPanel {
  const isFrustum = concept.id.includes("frustum");
  const isRecast = concept.id.includes("recasting");
  return {
    title: isFrustum ? "Frustum cone slicer" : isRecast ? "Recasting volume conservation" : "Combined solids exposed-area lab",
    subtitle: isFrustum ? "Slice a cone and calculate CSA, TSA, and volume." : isRecast ? "Melt one solid and solve the missing dimension of another using equal volume." : "Stack or remove solids and separate visible surface from hidden joining faces.",
    presets: [
      { label: isFrustum ? "bucket shape" : isRecast ? "sphere to cylinder" : "cylinder + cone", values: isFrustum ? [4, 2, 5] : [2, 6, 3] },
      { label: isFrustum ? "nearly cylinder" : isRecast ? "cone to cylinder" : "cylinder + hemisphere", values: isFrustum ? [4, 3.5, 5] : [3, 5, 2] },
      { label: isFrustum ? "wide frustum" : isRecast ? "many small spheres" : "cone removed", values: isFrustum ? [6, 1, 7] : [2.5, 4, 1.5] },
    ],
    labels: isFrustum ? ["Large radius R", "Small radius r", "Height h"] : ["Radius", "Height", "Second radius/height"],
    defaults: [concept.defaultA, concept.defaultB, concept.defaultC ?? 3],
    formula: concept.formula,
    theoremLinks: resourceLinksForConcept(concept),
    render: solidsSvg,
    metrics: (values, routeId) => {
      if (routeId.includes("frustum")) {
        const l = frustumSlantHeight(values[0], values[1], values[2]);
        return [
          { label: "slant l", value: round(l).toString() },
          { label: "CSA", value: round(frustumCSA(values[0], values[1], l)).toString() },
          { label: "volume", value: round(frustumVolume(values[0], values[1], values[2])).toString() },
        ];
      }
      if (routeId.includes("recasting")) {
        const original = cylinderVolume(values[0], values[1]);
        const newHeight = original / (Math.PI * Math.max(0.1, values[2]) ** 2);
        return [
          { label: "old volume", value: round(original).toString() },
          { label: "new radius", value: round(values[2]).toString() },
          { label: "new height", value: round(newHeight).toString() },
        ];
      }
      return [
        { label: "cylinder volume", value: round(cylinderVolume(values[0], values[1])).toString() },
        { label: "cone volume", value: round(coneVolume(values[0], values[2])).toString() },
        { label: "hidden face", value: round(Math.PI * values[0] ** 2).toString() },
      ];
    },
    steps: (values, routeId) => routeId.includes("frustum")
      ? [`l = sqrt((R-r)^2+h^2) = ${round(frustumSlantHeight(values[0], values[1], values[2]))}.`, "CSA = pi(R+r)l.", "Volume = 1/3 pi h(R^2+r^2+Rr)."]
      : routeId.includes("recasting")
        ? ["Write volume before = volume after.", "Keep pi symbolic until cancellation.", "Solve the missing dimension last."]
        : ["Add volumes of joined solids.", "For surface area, remove hidden common faces.", "Use curved surface only where flat faces are not exposed."],
    practice: (values, routeId) => routeId.includes("frustum")
      ? { prompt: "Find the frustum volume.", expected: round(frustumVolume(values[0], values[1], values[2])), tolerance: 0.2, hint: "Use 1/3 pi h(R^2+r^2+Rr)." }
      : routeId.includes("recasting")
        ? { prompt: "Find the new cylinder height after recasting.", expected: round(cylinderVolume(values[0], values[1]) / (Math.PI * Math.max(0.1, values[2]) ** 2)), tolerance: 0.15, hint: "Set old volume equal to new volume." }
        : { prompt: "Find total combined volume for cylinder plus cone.", expected: round(cylinderVolume(values[0], values[1]) + coneVolume(values[0], values[2])), tolerance: 0.2, hint: "Volume adds even when one face is hidden." },
    feedback: (values, routeId) => routeId.includes("frustum") && values[1] >= values[0] ? "Warning: for a cone frustum, small radius should be less than large radius." : "Common mistake: hidden faces affect surface area, not volume.",
  };
}

function heightsPanel(concept: NCERTConcept): LabPanel {
  return {
    title: "Heights and distances tangent lab",
    subtitle: "Move the observer, compare one-angle and two-angle cases, and calculate height or distance.",
    presets: [
      { label: "one observation point", values: [35, 120, 0] },
      { label: "two observation points", values: [45, 90, 40] },
      { label: "angle of depression", values: [30, 80, 20] },
    ],
    labels: ["Angle degrees", "Distance", "Observer shift"],
    defaults: [concept.defaultA, concept.defaultB, 0],
    formula: "tan(theta) = opposite / adjacent, so height = distance * tan(theta).",
    theoremLinks: resourceLinksForConcept(concept),
    render: heightsSvg,
    metrics: (values) => [
      { label: "height", value: round(heightFromAngleDistance(values[0], values[1])).toString() },
      { label: "distance from height", value: round(distanceFromHeightAngle(heightFromAngleDistance(values[0], values[1]), values[0])).toString() },
      { label: "angle", value: `${round(values[0])} deg` },
    ],
    steps: () => ["Mark the angle of elevation from the observer.", "Use tangent because opposite height and adjacent distance are known.", "For two-position problems, write two tangent equations and subtract distances."],
    practice: (values) => ({ prompt: `Find the height when angle=${round(values[0])} deg and distance=${round(values[1])}.`, expected: round(heightFromAngleDistance(values[0], values[1])), tolerance: 0.15, hint: "Use distance times tan(angle)." }),
    feedback: () => "Common mistake: use tan for height/distance, not sin or cos, when the ground distance is adjacent.",
  };
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const safe = safeNumber(value);
  return (
    <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
      {label}
      <input type="number" value={safe} step={0.1} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-cyan-200 bg-white px-3 py-2 font-mono font-black dark:border-cyan-300/20 dark:bg-slate-900" />
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

function checkPractice(answer: string, practice: Practice) {
  if (!answer.trim()) return { ok: false, message: practice.hint };
  if (typeof practice.expected === "string") {
    const ok = answer.trim().toLowerCase() === practice.expected.toLowerCase();
    return { ok, message: ok ? "Correct. Your reasoning matches the theorem." : `Not yet. ${practice.hint}` };
  }
  const parsed = Number(answer);
  if (!Number.isFinite(parsed)) return { ok: false, message: "Enter a number." };
  const ok = Math.abs(parsed - practice.expected) <= (practice.tolerance ?? 0.05);
  return { ok, message: ok ? "Correct. Your calculation checks out." : `Not yet. Expected about ${round(practice.expected)}. ${practice.hint}` };
}

function rowsFromValues(values: number[]): GroupedClass[] {
  const rows: GroupedClass[] = [];
  for (let index = 0; index < values.length; index += 3) {
    rows.push({ lower: values[index], upper: values[index + 1], frequency: values[index + 2] });
  }
  return rows;
}

function Grid() {
  return (
    <g opacity="0.22">
      {Array.from({ length: 13 }, (_, i) => <line key={`v-${i}`} x1={40 + i * 60} x2={40 + i * 60} y1="30" y2="450" stroke="#38bdf8" />)}
      {Array.from({ length: 8 }, (_, i) => <line key={`h-${i}`} x1="40" x2="720" y1={45 + i * 55} y2={45 + i * 55} stroke="#38bdf8" />)}
    </g>
  );
}

function Label({ x, y, text, fill = "#e0f2fe", size = 18 }: { x: number; y: number; text: string; fill?: string; size?: number }) {
  return <text x={x} y={y} fill={fill} fontSize={size} fontWeight="900">{text}</text>;
}

function circleTangentSvg(values: number[]) {
  const [angle, radius, secantTilt] = values;
  const cx = 330;
  const cy = 245;
  const r = radius * 55;
  const t = (Math.PI * angle) / 180;
  const px = cx + r * Math.cos(t);
  const py = cy - r * Math.sin(t);
  const tangentAngle = t + Math.PI / 2;
  const dx = 190 * Math.cos(tangentAngle);
  const dy = -190 * Math.sin(tangentAngle);
  const sx = 170 * Math.cos(tangentAngle + (Math.PI * secantTilt) / 180);
  const sy = -170 * Math.sin(tangentAngle + (Math.PI * secantTilt) / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0e7490" fillOpacity="0.24" stroke="#67e8f9" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#facc15" strokeWidth="5" />
      <line x1={px - dx} y1={py - dy} x2={px + dx} y2={py + dy} stroke="#f8fafc" strokeWidth="5" />
      <line x1={px - sx} y1={py - sy} x2={px + sx} y2={py + sy} stroke="#fb7185" strokeWidth="3" strokeDasharray="10 8" />
      <circle cx={cx} cy={cy} r="7" fill="#facc15" />
      <circle cx={px} cy={py} r="9" fill="#22d3ee" />
      <path d={`M ${px - 22 * Math.cos(t)} ${py + 22 * Math.sin(t)} l ${18 * Math.cos(tangentAngle)} ${-18 * Math.sin(tangentAngle)} l ${22 * Math.cos(t)} ${-22 * Math.sin(t)}`} fill="none" stroke="#facc15" strokeWidth="3" />
      <Label x={cx + 10} y={cy - 10} text="O" />
      <Label x={px + 12} y={py - 12} text="T" />
      <Label x={70} y={70} text="True tangent touches once; secant cuts twice." />
    </g>
  );
}

function twoTangentsSvg(values: number[]) {
  const [distance, radius] = values;
  const cx = 270;
  const cy = 240;
  const r = radius * 55;
  const px = cx + distance * 55;
  const py = cy;
  const canDraw = distance > radius;
  const alpha = canDraw ? Math.acos(radius / distance) : 0;
  const base = 0;
  const t1 = { x: cx + r * Math.cos(base + alpha), y: cy - r * Math.sin(base + alpha) };
  const t2 = { x: cx + r * Math.cos(base - alpha), y: cy - r * Math.sin(base - alpha) };
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0e7490" fillOpacity="0.24" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={px} cy={py} r="10" fill="#facc15" />
      <Label x={px + 12} y={py - 12} text="P" />
      <Label x={cx - 25} y={cy - 12} text="O" />
      {canDraw ? (
        <>
          <line x1={px} y1={py} x2={t1.x} y2={t1.y} stroke="#f8fafc" strokeWidth="5" />
          <line x1={px} y1={py} x2={t2.x} y2={t2.y} stroke="#f8fafc" strokeWidth="5" />
          <line x1={cx} y1={cy} x2={t1.x} y2={t1.y} stroke="#facc15" strokeWidth="4" />
          <line x1={cx} y1={cy} x2={t2.x} y2={t2.y} stroke="#facc15" strokeWidth="4" />
          <circle cx={t1.x} cy={t1.y} r="8" fill="#22d3ee" />
          <circle cx={t2.x} cy={t2.y} r="8" fill="#22d3ee" />
          <Label x={70} y={70} text={`PA = PB = ${round(tangentLength(distance, radius))}`} />
        </>
      ) : <Label x={70} y={70} text={tangentCase(distance, radius)} fill="#fecaca" />}
    </g>
  );
}

function triangleSvg(values: number[], routeId: Class10PriorityRouteId) {
  const A = { x: 260, y: 90 };
  const B = { x: 105, y: 390 };
  const C = { x: 630, y: 390 };
  if (routeId.includes("areas")) {
    const k = Math.max(0.3, values[0]);
    const B2 = { x: 480, y: 390 };
    const C2 = { x: 480 + 120 * k, y: 390 };
    const A2 = { x: 480 + 45 * k, y: 390 - 120 * k };
    return (
      <g>
        <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}`} fill="#0e7490" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="4" />
        <polygon points={`${B2.x},${B2.y} ${C2.x},${C2.y} ${A2.x},${A2.y}`} fill="#facc15" fillOpacity="0.42" stroke="#fde047" strokeWidth="4" />
        <Label x={75} y={70} text={`Area ratio = k^2 = ${round(similarTriangleAreaRatio(k))}`} />
        <Label x={500} y={90} text={`k = ${round(k)}`} />
      </g>
    );
  }
  const D = pointOn(A, B, Math.min(0.9, Math.max(0.1, values[0])));
  const E = pointOn(A, C, Math.min(0.9, Math.max(0.1, values[1])));
  const ratios = bptRatios(values[0], values[1]);
  return (
    <g>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#0e7490" fillOpacity="0.28" stroke="#67e8f9" strokeWidth="4" />
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke={ratios.parallel ? "#facc15" : "#fb7185"} strokeWidth="5" />
      {[A, B, C, D, E].map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="8" fill={index < 3 ? "#f8fafc" : "#facc15"} />)}
      <Label x={78} y={70} text={ratios.parallel ? "Ratios match: DE || BC" : "Wrong case: ratios do not match"} fill={ratios.parallel ? "#bbf7d0" : "#fecaca"} />
      <Label x={90} y={430} text={`AD/DB=${round(ratios.ratioAB)}  AE/EC=${round(ratios.ratioAC)}`} />
    </g>
  );
}

function linearSvg(values: number[]) {
  const [a1, b1, c1, a2, b2, c2] = values;
  const solution = solveLinearSystem(a1, b1, c1, a2, b2, c2);
  const toX = (x: number) => 380 + x * 42;
  const toY = (y: number) => 240 - y * 42;
  const linePoints = (a: number, b: number, c: number) => {
    if (Math.abs(b) < 1e-9) {
      const x = c / a;
      return { x1: toX(x), y1: 60, x2: toX(x), y2: 420 };
    }
    const y1 = (c - a * -7) / b;
    const y2 = (c - a * 7) / b;
    return { x1: toX(-7), y1: toY(y1), x2: toX(7), y2: toY(y2) };
  };
  const p1 = linePoints(a1, b1, c1);
  const p2 = linePoints(a2, b2, c2);
  return (
    <g>
      <line x1="70" x2="690" y1="240" y2="240" stroke="#94a3b8" strokeWidth="2" />
      <line x1="380" x2="380" y1="60" y2="420" stroke="#94a3b8" strokeWidth="2" />
      <line {...p1} stroke="#22d3ee" strokeWidth="5" />
      <line {...p2} stroke="#facc15" strokeWidth="5" />
      {solution && <circle cx={toX(solution.x)} cy={toY(solution.y)} r="9" fill="#fb7185" />}
      <Label x={70} y={70} text={`Verdict: ${classifyLinearSystem(a1, b1, c1, a2, b2, c2)}`} />
    </g>
  );
}

function statsSvg(values: number[]) {
  const stats = groupedStats(rowsFromValues(values));
  const maxF = Math.max(1, ...stats.rows.map((row) => row.frequency));
  return (
    <g>
      <Label x={60} y={65} text="Grouped table and ogive" />
      {stats.rows.map((row, index) => {
        const x = 80 + index * 120;
        const barH = (row.frequency / maxF) * 250;
        return (
          <g key={`${row.lower}-${row.upper}`}>
            <rect x={x} y={390 - barH} width="72" height={barH} fill={index === stats.modalIndex ? "#facc15" : "#22d3ee"} opacity="0.75" />
            <Label x={x - 5} y={425} text={`${row.lower}-${row.upper}`} size={13} />
            <Label x={x + 18} y={380 - barH} text={String(row.frequency)} size={14} />
          </g>
        );
      })}
      <polyline points={stats.cumulative.map((cf, index) => `${116 + index * 120},${390 - (cf / Math.max(1, stats.totalFrequency)) * 280}`).join(" ")} fill="none" stroke="#fb7185" strokeWidth="4" />
      <Label x={70} y={105} text={`n=${stats.totalFrequency}, mean=${round(stats.mean)}, mode=${round(stats.modal)}, median=${round(stats.median)}`} size={16} />
    </g>
  );
}

function circleRegionSvg(values: number[]) {
  const [angle, outer, inner] = values;
  const cx = 350;
  const cy = 250;
  const R = outer * 32;
  const r = Math.min(inner, outer - 0.1) * 32;
  const end = (Math.PI * angle) / 180;
  const x = cx + R * Math.cos(end);
  const y = cy - R * Math.sin(end);
  const largeArc = angle > 180 ? 1 : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="#0e7490" fillOpacity="0.22" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r} fill="#020617" stroke="#facc15" strokeWidth="3" />
      <path d={`M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 ${largeArc} 0 ${x} ${y} Z`} fill="#facc15" fillOpacity="0.42" stroke="#fde047" strokeWidth="3" />
      <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#fff" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#fff" />
      <Label x={65} y={70} text={`sector=${round(sectorArea(outer, angle))}, segment=${round(segmentArea(outer, angle))}`} />
      <Label x={65} y={102} text={`annulus=${round(annulusArea(outer, Math.min(inner, outer)))}`} />
    </g>
  );
}

function solidsSvg(values: number[], routeId: Class10PriorityRouteId) {
  const [a, b, c] = values;
  if (routeId.includes("frustum")) {
    const l = frustumSlantHeight(a, c, b);
    return (
      <g>
        <path d="M 260 120 L 500 120 L 610 390 L 150 390 Z" fill="#0e7490" fillOpacity="0.38" stroke="#67e8f9" strokeWidth="5" />
        <ellipse cx="380" cy="120" rx="120" ry="28" fill="#22d3ee" opacity="0.55" />
        <ellipse cx="380" cy="390" rx="230" ry="45" fill="#facc15" opacity="0.45" />
        <Label x={80} y={70} text={`R=${round(a)}, r=${round(c)}, h=${round(b)}, l=${round(l)}`} />
        <Label x={80} y={105} text={`CSA=${round(frustumCSA(a, c, l))}, TSA=${round(frustumTSA(a, c, l))}`} />
      </g>
    );
  }
  const combined = routeId.includes("combination");
  return (
    <g>
      <rect x="250" y="210" width="220" height="165" rx="28" fill="#0e7490" fillOpacity="0.5" stroke="#67e8f9" strokeWidth="4" />
      {combined ? <path d="M 250 210 L 360 80 L 470 210 Z" fill="#facc15" fillOpacity="0.55" stroke="#fde047" strokeWidth="4" /> : <circle cx="520" cy="285" r={Math.max(45, c * 35)} fill="#facc15" fillOpacity="0.5" stroke="#fde047" strokeWidth="4" />}
      <ellipse cx="360" cy="210" rx="110" ry="28" fill="#22d3ee" opacity="0.55" />
      <ellipse cx="360" cy="375" rx="110" ry="28" fill="#0f172a" stroke="#67e8f9" strokeWidth="3" />
      <Label x={70} y={70} text={combined ? "Combined solid: hidden shared face is not exposed." : "Recasting: old volume equals new volume."} />
      <Label x={70} y={105} text={`Cylinder V=${round(cylinderVolume(a, b))}, cone V=${round(coneVolume(a, c))}, sphere V=${round(sphereVolume(a))}, hemi CSA=${round(hemisphereCSA(a))}, cone l=${round(coneSlantHeight(a, c))}`} size={15} />
    </g>
  );
}

function heightsSvg(values: number[]) {
  const [angle, distance, shift] = values;
  const baseX = 150;
  const baseY = 390;
  const towerX = 580 - shift;
  const height = Math.min(260, heightFromAngleDistance(angle, distance) * 1.15);
  const topY = baseY - height;
  return (
    <g>
      <line x1="70" x2="700" y1={baseY} y2={baseY} stroke="#e2e8f0" strokeWidth="4" />
      <rect x={towerX - 25} y={topY} width="50" height={height} fill="#0e7490" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={baseX} cy={baseY} r="10" fill="#facc15" />
      <line x1={baseX} y1={baseY} x2={towerX} y2={topY} stroke="#facc15" strokeWidth="5" />
      <path d={`M ${baseX + 45} ${baseY} A 45 45 0 0 0 ${baseX + 45 * Math.cos((-angle * Math.PI) / 180)} ${baseY + 45 * Math.sin((-angle * Math.PI) / 180)}`} fill="none" stroke="#fb7185" strokeWidth="4" />
      <Label x={70} y={70} text={`height = ${round(heightFromAngleDistance(angle, distance))}`} />
      <Label x={70} y={105} text={`tan(${round(angle)} deg) = height / ${round(distance)}`} />
    </g>
  );
}

function pointOn(p1: { x: number; y: number }, p2: { x: number; y: number }, t: number) {
  return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
}
