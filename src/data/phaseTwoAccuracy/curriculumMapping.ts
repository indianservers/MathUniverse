import { phaseTwoAdvancedContracts } from "./registry";
import type { PhaseTwoAdvancedDomain } from "./types";

export type AdvancedCurriculumMapping = {
  conceptId: string;
  board: string;
  grade: string;
  chapter: string;
  exercise: string;
  learningOutcome: string;
  prerequisites: string[];
  nextConcepts: string[];
  sourceEdition: string;
  reviewDate: string;
};

const domainCurriculum: Record<PhaseTwoAdvancedDomain, Omit<AdvancedCurriculumMapping, "conceptId" | "learningOutcome" | "nextConcepts">> = {
  "complex-numbers": { board: "NCERT / advanced extension", grade: "11", chapter: "Complex Numbers and Quadratic Equations", exercise: "Complex representation, polar form, powers and roots", prerequisites: ["real numbers", "trigonometry", "coordinate plane"], sourceEdition: "NCERT Mathematics Class XI 2025-26", reviewDate: "2026-07-18" },
  combinatorics: { board: "NCERT / Olympiad extension", grade: "11", chapter: "Permutations and Combinations; Binomial Theorem", exercise: "Counting principles, arrangements, selections and expansions", prerequisites: ["sets", "factorials", "algebraic expansion"], sourceEdition: "NCERT Mathematics Class XI 2025-26", reviewDate: "2026-07-18" },
  "sets-relations-functions": { board: "NCERT / advanced extension", grade: "11-12", chapter: "Sets; Relations and Functions", exercise: "Operations, mappings, relation properties and orders", prerequisites: ["logic", "ordered pairs", "number sets"], sourceEdition: "NCERT Mathematics Classes XI-XII 2025-26", reviewDate: "2026-07-18" },
  "mathematical-logic": { board: "Degree / discrete mathematics", grade: "Undergraduate", chapter: "Propositional and Predicate Logic", exercise: "Truth tables, normal forms, inference and quantifiers", prerequisites: ["sets", "statements", "Boolean operations"], sourceEdition: "Math Universe advanced curriculum v1", reviewDate: "2026-07-18" },
  "linear-algebra": { board: "NCERT / engineering mathematics", grade: "12-Undergraduate", chapter: "Vectors, Matrices and Linear Algebra", exercise: "Vector operations, transformations, systems, eigenpairs and basis", prerequisites: ["coordinates", "systems of equations", "functions"], sourceEdition: "NCERT Class XII 2025-26 and advanced curriculum v1", reviewDate: "2026-07-18" },
  "statistics-probability": { board: "NCERT / advanced extension", grade: "9-12", chapter: "Statistics and Probability", exercise: "Data summaries, distributions, conditioning and regression", prerequisites: ["fractions", "sets", "algebra"], sourceEdition: "NCERT Mathematics Classes IX-XII 2025-26", reviewDate: "2026-07-18" },
  "graph-discrete": { board: "Degree / discrete mathematics", grade: "Undergraduate", chapter: "Graphs, Automata and Complexity", exercise: "Representations, algorithms, formal languages and machines", prerequisites: ["sets", "relations", "logic", "algorithms"], sourceEdition: "Math Universe advanced curriculum v1", reviewDate: "2026-07-18" },
  "ai-engineering": { board: "Engineering / applied mathematics", grade: "11-Undergraduate", chapter: "AI, Signals, Robotics and Simulation", exercise: "Transparent models, numerical validation and limitations", prerequisites: ["calculus", "linear algebra", "probability", "trigonometry"], sourceEdition: "Math Universe applied curriculum v1", reviewDate: "2026-07-18" },
};

export const phaseTwoCurriculumMappings: AdvancedCurriculumMapping[] = phaseTwoAdvancedContracts.map((contract, index, contracts) => {
  const metadata = domainCurriculum[contract.domain];
  const next = contracts.find((candidate, candidateIndex) => candidateIndex > index && candidate.domain === contract.domain);
  return { ...metadata, conceptId: contract.id, learningOutcome: `Learner can explain and verify ${contract.topic.toLowerCase()} using its restrictions, invariants, and independent oracle.`, nextConcepts: next ? [next.id] : [] };
});

export function curriculumCoverageSummary() {
  return {
    mapped: phaseTwoCurriculumMappings.length,
    total: phaseTwoAdvancedContracts.length,
    percentage: phaseTwoAdvancedContracts.length ? Math.round(100 * phaseTwoCurriculumMappings.length / phaseTwoAdvancedContracts.length) : 0,
    boards: new Set(phaseTwoCurriculumMappings.map((item) => item.board)).size,
  };
}
