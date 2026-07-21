import { phaseTwoAdvancedContracts } from "./registry";

export const ADVANCED_EXAMPLE_KINDS = ["foundational", "visual", "real-world", "common-mistake", "boundary", "challenge", "connection"] as const;
export type AdvancedExampleKind = (typeof ADVANCED_EXAMPLE_KINDS)[number];

export type AdvancedConceptExample = {
  id: string; conceptId: string; kind: AdvancedExampleKind; title: string; prompt: string;
  accuracyCheck: string; assumptions: string[]; units?: string;
};

export const advancedExampleRequirements: Record<AdvancedExampleKind, number> = {
  foundational: 3, visual: 3, "real-world": 2, "common-mistake": 2, boundary: 2, challenge: 1, connection: 1,
};

export const phaseTwoAdvancedExamples: AdvancedConceptExample[] = phaseTwoAdvancedContracts.flatMap((contract) =>
  ADVANCED_EXAMPLE_KINDS.flatMap((kind) => Array.from({ length: advancedExampleRequirements[kind] }, (_, index) => {
    const context = contract.exampleContexts[index % contract.exampleContexts.length];
    const promptByKind: Record<AdvancedExampleKind, string> = {
      foundational: `Use ${contract.formula} to solve a ${contract.topic.toLowerCase()} case, state each restriction used, and verify it with ${contract.oracle}.`,
      visual: `Represent ${context} visually. Label the quantities in ${contract.formula} and identify the invariant: ${contract.invariants[index % contract.invariants.length]}.`,
      "real-world": `Model a ${context} scenario with declared inputs and units. State why the assumptions are appropriate before applying ${contract.formula}.`,
      "common-mistake": `Analyze the claim “${contract.misconception.claim}” and use ${contract.misconception.counterexample} to repair the reasoning.`,
      boundary: `Test the restriction “${contract.restrictions[index % contract.restrictions.length]}” at or just beyond its boundary and explain whether the formula remains valid.`,
      challenge: `Combine two representations of ${contract.topic.toLowerCase()} and independently reconcile them using ${contract.oracle}.`,
      connection: `Connect ${contract.topic.toLowerCase()} to ${context}; name the shared quantity and check ${contract.invariants[0]}.`,
    };
    return {
      id: `${contract.id}.example.${kind}.${index + 1}`, conceptId: contract.id, kind,
      title: `${contract.topic}: ${kind.replace("-", " ")} ${index + 1}`, prompt: promptByKind[kind],
      accuracyCheck: contract.oracle, assumptions: [...contract.restrictions],
      ...(kind === "real-world" ? { units: "Use context-appropriate SI units and show conversions." } : {}),
    };
  })),
);

export function advancedExampleCoverage(conceptId: string) {
  const examples = phaseTwoAdvancedExamples.filter((example) => example.conceptId === conceptId);
  return Object.fromEntries(ADVANCED_EXAMPLE_KINDS.map((kind) => [kind, examples.filter((example) => example.kind === kind).length])) as Record<AdvancedExampleKind, number>;
}
