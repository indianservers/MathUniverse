import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { launchersForDomain } from "./engineeringLabLaunchers";
import { engineeringSolverPresets } from "./engineeringMathSolvers";
import { practicePackForDomain } from "./engineeringPracticePacks";

export type EngineeringAssessmentBand = "Exam ready" | "Practice ready" | "Build depth" | "Needs foundation";

export type EngineeringAssessmentPlan = {
  domainId: string;
  title: string;
  semesterBand: string;
  score: number;
  band: EngineeringAssessmentBand;
  nextAction: string;
  drillRoute: string;
  checkpoint: string;
  evidence: string[];
};

export type EngineeringExamSprint = {
  id: string;
  title: string;
  minutes: number;
  domainIds: string[];
  objective: string;
  route: string;
};

export function buildEngineeringAssessmentPlans(): EngineeringAssessmentPlan[] {
  return engineeringMathDomains.map((domain) => {
    const launchers = launchersForDomain(domain.id);
    const solverCount = engineeringSolverPresets.filter((preset) => preset.domainId === domain.id).length;
    const practicePack = practicePackForDomain(domain.id);
    const promptCount = practicePack?.prompts.length ?? 0;
    const examPrompt = practicePack?.prompts.find((prompt) => prompt.level === "exam") ?? practicePack?.prompts[0];
    const score = Math.min(100, Math.round(
      Math.min(domain.topics.length, 6) * 6 +
      Math.min(domain.nativeRoutes.length, 4) * 8 +
      Math.min(launchers.length, 5) * 6 +
      Math.min(domain.formulaFamilies.length, 5) * 5 +
      Math.min(promptCount, 3) * 6 +
      Math.min(solverCount, 2) * 5,
    ));
    return {
      domainId: domain.id,
      title: domain.title,
      semesterBand: domain.semesterBand,
      score,
      band: bandForScore(score),
      nextAction: nextActionFor(score, solverCount, promptCount),
      drillRoute: examPrompt?.route ?? domain.nativeRoutes[0] ?? "/syllabus-lab/partial-derivative-slicer",
      checkpoint: examPrompt?.title ?? `${domain.title} checkpoint`,
      evidence: [
        `${domain.topics.length} mapped topics`,
        `${launchers.length} launchers`,
        `${domain.formulaFamilies.length} formula families`,
        `${promptCount} practice prompts`,
        `${solverCount} deterministic solvers`,
      ],
    };
  }).sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
}

export function assessmentSummary() {
  const plans = buildEngineeringAssessmentPlans();
  return {
    domainCount: plans.length,
    averageScore: Math.round(plans.reduce((sum, plan) => sum + plan.score, 0) / Math.max(1, plans.length)),
    examReadyCount: plans.filter((plan) => plan.band === "Exam ready").length,
    needsFoundationCount: plans.filter((plan) => plan.band === "Needs foundation").length,
    topDomain: plans[0]?.title ?? "",
    nextFocus: plans.at(-1)?.title ?? "",
  };
}

export const engineeringExamSprints: EngineeringExamSprint[] = [
  {
    id: "m1-core-sprint",
    title: "M1 Core Exam Sprint",
    minutes: 60,
    domainIds: ["engineering-calculus", "engineering-differential-equations", "engineering-linear-algebra"],
    objective: "Run one calculus setup, one ODE classification, and one rank/eigen checkpoint.",
    route: "/syllabus-lab/partial-derivative-slicer",
  },
  {
    id: "signals-pde-sprint",
    title: "Signals and PDE Sprint",
    minutes: 75,
    domainIds: ["transforms-signals", "partial-differential-equations", "complex-special-control"],
    objective: "Connect transform-domain reasoning, boundary-value models, and pole/residue interpretation.",
    route: "/syllabus-lab/laplace-transform-workflow",
  },
  {
    id: "simulation-sprint",
    title: "Simulation and Data Sprint",
    minutes: 90,
    domainIds: ["numerical-methods", "probability-statistics-stochastic", "optimization-operations-research"],
    objective: "Build iteration tables, probability checks, and optimization decisions with reproducible evidence.",
    route: "/syllabus-lab/statistical-inference-regression-lab",
  },
  {
    id: "field-theory-sprint",
    title: "Field Theory Sprint",
    minutes: 45,
    domainIds: ["vector-calculus-fields", "engineering-calculus", "partial-differential-equations"],
    objective: "Move from gradients and surfaces to flux, circulation, and PDE boundary behavior.",
    route: "/syllabus-lab/vector-calculus-field-theorems",
  },
];

export function sprintReadiness(sprint: EngineeringExamSprint) {
  const plans = buildEngineeringAssessmentPlans().filter((plan) => sprint.domainIds.includes(plan.domainId));
  const averageScore = Math.round(plans.reduce((sum, plan) => sum + plan.score, 0) / Math.max(1, plans.length));
  return {
    ...sprint,
    averageScore,
    weakestDomain: plans.sort((left, right) => left.score - right.score)[0]?.title ?? "",
  };
}

function bandForScore(score: number): EngineeringAssessmentBand {
  if (score >= 85) return "Exam ready";
  if (score >= 70) return "Practice ready";
  if (score >= 50) return "Build depth";
  return "Needs foundation";
}

function nextActionFor(score: number, solverCount: number, promptCount: number) {
  if (score < 50) return "Start with prerequisite review and first native lab.";
  if (promptCount < 3) return "Add more practice prompts before timed work.";
  if (solverCount === 0) return "Use the practice pack, then add solver-backed examples.";
  if (score < 85) return "Run the exam prompt and compare against the expected checkpoint.";
  return "Move to timed mixed-domain sprint.";
}
