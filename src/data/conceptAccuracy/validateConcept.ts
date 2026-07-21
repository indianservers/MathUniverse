import type { ConceptValidationIssue, ExampleKind, StrengthenedConcept } from "./types";

const requiredExampleKinds: ExampleKind[] = ["foundational", "visual", "real-world", "misconception", "boundary", "challenge", "connection"];

export function validateStrengthenedConcept(concept: StrengthenedConcept): ConceptValidationIssue[] {
  const issues: ConceptValidationIssue[] = [];
  const add = (field: string, message: string) => issues.push({ conceptId: concept.id, field, message });

  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(concept.id)) add("id", "Use a stable lowercase concept ID.");
  if (!concept.definition.precise.trim()) add("definition.precise", "A precise definition is required.");
  if (!concept.definition.learner.trim()) add("definition.learner", "A learner-friendly definition is required.");
  if (!concept.prerequisites.length) add("prerequisites", "At least one prerequisite is required.");
  if (!concept.nextConcepts.length) add("nextConcepts", "At least one next concept is required.");
  if (!concept.syllabus.length) add("syllabus", "At least one syllabus mapping is required.");
  if (!concept.domainStatement.trim()) add("domainStatement", "Domain and exclusions must be explicit.");
  if (!concept.formulas.length) add("formulas", "At least one canonical formula is required.");
  if (!concept.assumptions.length) add("assumptions", "At least one assumption or convention is required.");
  if (!concept.invariants.length) add("invariants", "At least one visual or mathematical invariant is required.");
  if (!concept.validation.oracle.trim()) add("validation.oracle", "An independent validation oracle is required.");
  if (!concept.validation.properties.length) add("validation.properties", "At least one validation property is required.");
  if (!concept.sources.length) add("sources", "At least one content source is required.");
  if (concept.misconceptions.length < 2) add("misconceptions", "At least two misconception checks are required.");

  const exampleIds = new Set<string>();
  for (const example of concept.examples) {
    if (exampleIds.has(example.id)) add("examples", `Duplicate example ID: ${example.id}`);
    exampleIds.add(example.id);
    if (!example.prompt.trim() || !example.result.trim() || !example.reasoning.trim()) add("examples", `Example ${example.id} must include prompt, result, and reasoning.`);
  }
  for (const kind of requiredExampleKinds) {
    if (!concept.examples.some((example) => example.kind === kind)) add("examples", `Missing ${kind} example.`);
  }

  for (const formula of concept.formulas) {
    if (!formula.conditions.length) add(`formulas.${formula.id}`, "Every formula must state its validity conditions.");
  }

  return issues;
}

export function validateConceptCollection(concepts: StrengthenedConcept[]): ConceptValidationIssue[] {
  const issues = concepts.flatMap(validateStrengthenedConcept);
  const ids = new Set<string>();
  for (const concept of concepts) {
    if (ids.has(concept.id)) issues.push({ conceptId: concept.id, field: "id", message: "Concept ID must be unique." });
    ids.add(concept.id);
  }
  return issues;
}

