export const PHASE_TWO_ADVANCED_DOMAINS = [
  "complex-numbers",
  "combinatorics",
  "sets-relations-functions",
  "mathematical-logic",
  "linear-algebra",
  "statistics-probability",
  "graph-discrete",
  "ai-engineering",
] as const;

export type PhaseTwoAdvancedDomain = (typeof PHASE_TWO_ADVANCED_DOMAINS)[number];
export type CertificationStatus = "inventory" | "in-progress" | "review" | "certified" | "blocked";

export type AdvancedAccuracyContract = {
  id: string;
  domain: PhaseTwoAdvancedDomain;
  topic: string;
  route: string;
  definition: string;
  formula: string;
  restrictions: string[];
  invariants: string[];
  oracle: string;
  misconception: { claim: string; correction: string; counterexample: string };
  exampleContexts: string[];
  assessmentModes: ["recognition", "calculation", "interpretation", "error-analysis", "transfer"];
  accessibilityEvidence: string[];
  source: string;
  status: CertificationStatus;
};

export type PhaseTwoSystemArea = "libraries" | "tools-workspaces" | "ar-xr" | "practice" | "curriculum" | "certification";

export type SystemAccuracyContract = {
  id: string;
  area: PhaseTwoSystemArea;
  title: string;
  route: string;
  requirements: string[];
  invariants: string[];
  evidence: string[];
  ownerFiles: string[];
  status: CertificationStatus;
};

export type CertificationEvidence = {
  contractId: string;
  mathematical: "missing" | "partial" | "passed";
  content: "missing" | "partial" | "passed";
  assessment: "missing" | "partial" | "passed";
  accessibility: "missing" | "partial" | "passed";
  browser: "missing" | "partial" | "passed";
  reviewer: string | null;
  reviewedAt: string | null;
};
