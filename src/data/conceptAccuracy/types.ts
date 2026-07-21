export const PHASE_ONE_DOMAINS = ["algebra", "number-systems", "geometry", "trigonometry", "calculus"] as const;

export type PhaseOneDomain = (typeof PHASE_ONE_DOMAINS)[number];
export type ConceptLevel = "Foundational" | "Intermediate" | "Advanced";
export type ExampleKind = "foundational" | "visual" | "real-world" | "misconception" | "boundary" | "challenge" | "connection";

export type ConceptFormula = {
  id: string;
  latex: string;
  meaning: string;
  conditions: string[];
  equivalentForms?: string[];
};

export type ConceptExample = {
  id: string;
  kind: ExampleKind;
  prompt: string;
  result: string;
  reasoning: string;
  values?: Record<string, number | string>;
  units?: string;
};

export type ConceptMisconception = {
  claim: string;
  correction: string;
  counterexample: string;
};

export type ConceptSource = {
  title: string;
  section: string;
  scope: string;
};

export type StrengthenedConcept = {
  id: string;
  domain: PhaseOneDomain;
  title: string;
  aliases: string[];
  level: ConceptLevel;
  definition: {
    precise: string;
    learner: string;
  };
  prerequisites: string[];
  nextConcepts: string[];
  syllabus: { board: string; grade: string; chapter: string }[];
  notation: { symbol: string; meaning: string; unit?: string }[];
  assumptions: string[];
  domainStatement: string;
  formulas: ConceptFormula[];
  examples: ConceptExample[];
  misconceptions: ConceptMisconception[];
  controls: { id: string; meaning: string; validRange: string }[];
  invariants: string[];
  validation: {
    oracle: string;
    tolerance?: number;
    properties: string[];
  };
  sources: ConceptSource[];
};

export type ConceptValidationIssue = {
  conceptId: string;
  field: string;
  message: string;
};

