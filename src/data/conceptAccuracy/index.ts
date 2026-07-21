import { algebraAccuracyConcepts } from "./algebraConcepts";
import { algebraExtendedConcepts } from "./algebraExtendedConcepts";
import { advancedCoreExtendedConcepts } from "./advancedCoreExtendedConcepts";
import { calculusAccuracyConcepts } from "./calculusConcepts";
import { geometryAccuracyConcepts } from "./geometryConcepts";
import { geometryExtendedConcepts } from "./geometryExtendedConcepts";
import { numberSystemAccuracyConcepts } from "./numberSystemConcepts";
import { numberSystemExtendedConcepts } from "./numberSystemExtendedConcepts";
import { trigonometryAccuracyConcepts } from "./trigonometryConcepts";
import type { PhaseOneDomain, StrengthenedConcept } from "./types";

export * from "./types";
export * from "./validateConcept";
export * from "./phaseOneRoadmapCoverage";

export const phaseOneAccuracyConcepts: StrengthenedConcept[] = [
  ...algebraAccuracyConcepts,
  ...algebraExtendedConcepts,
  ...numberSystemAccuracyConcepts,
  ...numberSystemExtendedConcepts,
  ...geometryAccuracyConcepts,
  ...geometryExtendedConcepts,
  ...trigonometryAccuracyConcepts,
  ...calculusAccuracyConcepts,
  ...advancedCoreExtendedConcepts,
];

const conceptById = new Map(phaseOneAccuracyConcepts.map((concept) => [concept.id, concept]));

export function accuracyConceptById(id: string) {
  return conceptById.get(id);
}

export function accuracyConceptsForDomain(domain: PhaseOneDomain) {
  return phaseOneAccuracyConcepts.filter((concept) => concept.domain === domain);
}

export function phaseOneAccuracySummary() {
  return {
    conceptCount: phaseOneAccuracyConcepts.length,
    domainCount: new Set(phaseOneAccuracyConcepts.map((concept) => concept.domain)).size,
    exampleCount: phaseOneAccuracyConcepts.reduce((sum, concept) => sum + concept.examples.length, 0),
    misconceptionCount: phaseOneAccuracyConcepts.reduce((sum, concept) => sum + concept.misconceptions.length, 0),
    invariantCount: phaseOneAccuracyConcepts.reduce((sum, concept) => sum + concept.invariants.length, 0),
  };
}
