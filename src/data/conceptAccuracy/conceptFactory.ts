import type { ConceptExample, ConceptLevel, ConceptMisconception, PhaseOneDomain, StrengthenedConcept } from "./types";

type ConceptSeed = {
  id: string;
  domain: PhaseOneDomain;
  title: string;
  aliases?: string[];
  level: ConceptLevel;
  precise: string;
  learner: string;
  prerequisites: string[];
  nextConcepts: string[];
  grade: string;
  chapter: string;
  notation: StrengthenedConcept["notation"];
  assumptions: string[];
  domainStatement: string;
  formula: string;
  formulaMeaning: string;
  formulaConditions: string[];
  controls: StrengthenedConcept["controls"];
  invariants: string[];
  oracle: string;
  tolerance?: number;
  properties: string[];
  examples: ConceptExample[];
  misconceptions: ConceptMisconception[];
  sourceSection: string;
};

export type CompactConceptSeed = Omit<ConceptSeed, "aliases" | "level" | "formulaMeaning" | "controls" | "tolerance" | "examples"> & {
  aliases?: string[];
  level?: ConceptLevel;
  formulaMeaning?: string;
  controls?: StrengthenedConcept["controls"];
  tolerance?: number;
  cases: {
    foundational: [string, string, string];
    visual: [string, string, string];
    realWorld: [string, string, string];
    misconception: [string, string, string];
    boundary: [string, string, string];
    challenge: [string, string, string];
    connection: [string, string, string];
  };
};

export function concept(seed: ConceptSeed): StrengthenedConcept {
  return {
    id: seed.id,
    domain: seed.domain,
    title: seed.title,
    aliases: seed.aliases ?? [],
    level: seed.level,
    definition: { precise: seed.precise, learner: seed.learner },
    prerequisites: seed.prerequisites,
    nextConcepts: seed.nextConcepts,
    syllabus: [{ board: "NCERT", grade: seed.grade, chapter: seed.chapter }],
    notation: seed.notation,
    assumptions: seed.assumptions,
    domainStatement: seed.domainStatement,
    formulas: [{ id: `${seed.id}.canonical`, latex: seed.formula, meaning: seed.formulaMeaning, conditions: seed.formulaConditions }],
    controls: seed.controls,
    invariants: seed.invariants,
    validation: { oracle: seed.oracle, tolerance: seed.tolerance, properties: seed.properties },
    examples: seed.examples,
    misconceptions: seed.misconceptions,
    sources: [
      { title: "NCERT Mathematics", section: seed.sourceSection, scope: "School terminology, definitions, and canonical examples" },
      { title: "Math Universe independent verification", section: seed.id, scope: "Numeric oracle, invariants, boundary cases, and visual consistency" },
    ],
  };
}

export function examples(items: Array<[ConceptExample["kind"], string, string, string, ConceptExample["values"]?]>): ConceptExample[] {
  return items.map(([kind, prompt, result, reasoning, values], index) => ({ id: `${kind}-${index + 1}`, kind, prompt, result, reasoning, values }));
}

/** A concise authoring form for the long tail of Phase 1 topics. */
export function compactConcept(seed: CompactConceptSeed): StrengthenedConcept {
  const c = seed.cases;
  return concept({
    ...seed,
    aliases: seed.aliases ?? [],
    level: seed.level ?? "Intermediate",
    formulaMeaning: seed.formulaMeaning ?? seed.learner,
    controls: seed.controls ?? [{ id: "parameters", meaning: `Valid inputs for ${seed.title}`, validRange: seed.domainStatement }],
    examples: examples([
      ["foundational", ...c.foundational],
      ["visual", ...c.visual],
      ["real-world", ...c.realWorld],
      ["misconception", ...c.misconception],
      ["boundary", ...c.boundary],
      ["challenge", ...c.challenge],
      ["connection", ...c.connection],
    ]),
  });
}
