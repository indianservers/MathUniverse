import { assessmentSummary, buildEngineeringAssessmentPlans } from "./engineeringAssessmentPlanner";
import { caseStudiesForDomain } from "./engineeringCaseStudies";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { formulasForDomain } from "./engineeringFormulaAtlas";
import { launchersForDomain } from "./engineeringLabLaunchers";
import { engineeringSolverPresets } from "./engineeringMathSolvers";
import { practicePackForDomain } from "./engineeringPracticePacks";
import { projectsForDomain } from "./engineeringProjects";
import { workedExamplesForDomain } from "./engineeringWorkedExamples";

export type EngineeringCoverageDimension =
  | "topics"
  | "nativeVisuals"
  | "formulas"
  | "launchers"
  | "solvers"
  | "workedExamples"
  | "practice"
  | "projects"
  | "caseStudies"
  | "assessment";

export type EngineeringConceptCoverageRow = {
  domainId: string;
  title: string;
  semesterBand: string;
  score: number;
  maxScore: number;
  percent: number;
  counts: Record<EngineeringCoverageDimension, number>;
  missing: string[];
  nextActions: string[];
};

const minimums: Record<EngineeringCoverageDimension, number> = {
  topics: 1,
  nativeVisuals: 1,
  formulas: 4,
  launchers: 5,
  solvers: 1,
  workedExamples: 2,
  practice: 1,
  projects: 2,
  caseStudies: 2,
  assessment: 1,
};

const labels: Record<EngineeringCoverageDimension, string> = {
  topics: "syllabus topics",
  nativeVisuals: "native visualization routes",
  formulas: "interactive formula visuals",
  launchers: "lab launchers",
  solvers: "deterministic solver presets",
  workedExamples: "worked examples",
  practice: "practice pack",
  projects: "portfolio projects",
  caseStudies: "industry case studies",
  assessment: "exam readiness plan",
};

export function buildEngineeringConceptCoverage(): EngineeringConceptCoverageRow[] {
  const assessmentPlans = buildEngineeringAssessmentPlans();
  return engineeringMathDomains.map((domain) => {
    const counts: Record<EngineeringCoverageDimension, number> = {
      topics: domain.topics.length,
      nativeVisuals: domain.nativeRoutes.length,
      formulas: formulasForDomain(domain.id).length,
      launchers: launchersForDomain(domain.id).length,
      solvers: engineeringSolverPresets.filter((preset) => preset.domainId === domain.id).length,
      workedExamples: workedExamplesForDomain(domain.id).length,
      practice: practicePackForDomain(domain.id) ? 1 : 0,
      projects: projectsForDomain(domain.id).length,
      caseStudies: caseStudiesForDomain(domain.id).length,
      assessment: assessmentPlans.some((plan) => plan.domainId === domain.id) ? 1 : 0,
    };
    const dimensions = Object.keys(minimums) as EngineeringCoverageDimension[];
    const missing = dimensions.filter((dimension) => counts[dimension] < minimums[dimension]).map((dimension) => `${labels[dimension]} ${counts[dimension]}/${minimums[dimension]}`);
    const score = dimensions.filter((dimension) => counts[dimension] >= minimums[dimension]).length;
    return {
      domainId: domain.id,
      title: domain.title,
      semesterBand: domain.semesterBand,
      score,
      maxScore: dimensions.length,
      percent: Math.round((score / dimensions.length) * 100),
      counts,
      missing,
      nextActions: missing.length ? missing.slice(0, 3).map((gap) => `Add ${gap}.`) : ["Ready for deeper simulations, timed tests, and exportable reports."],
    };
  });
}

export function engineeringCoverageSummary() {
  const rows = buildEngineeringConceptCoverage();
  const average = Math.round(rows.reduce((sum, row) => sum + row.percent, 0) / rows.length);
  return {
    average,
    completeDomains: rows.filter((row) => row.missing.length === 0).length,
    domainCount: rows.length,
    remainingGapCount: rows.reduce((sum, row) => sum + row.missing.length, 0),
    examReadinessAverage: assessmentSummary().averageScore,
  };
}
