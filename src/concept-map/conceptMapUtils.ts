import { conceptEdges, conceptNodes } from "./conceptMapData";
import type { ConceptMapFilters, ConceptModuleFilter, ConceptNode } from "./conceptMapTypes";

const conceptById = new Map(conceptNodes.map((concept) => [concept.id, concept]));

export function getConceptById(id: string): ConceptNode | undefined {
  return conceptById.get(id);
}

function getConceptsByIds(ids: string[]) {
  return ids.map((id) => conceptById.get(id)).filter((concept): concept is ConceptNode => Boolean(concept));
}

export function getPrerequisites(conceptId: string): ConceptNode[] {
  return getConceptsByIds(getConceptById(conceptId)?.prerequisites ?? []);
}

export function getNextConcepts(conceptId: string): ConceptNode[] {
  return getConceptsByIds(getConceptById(conceptId)?.nextConcepts ?? []);
}

export function getRelatedConcepts(conceptId: string): ConceptNode[] {
  return getConceptsByIds(getConceptById(conceptId)?.relatedConcepts ?? []);
}

export function getAvailableModuleCount(concept: ConceptNode): number {
  return Object.values(concept.availableModules).filter(Boolean).length;
}

export function findLearningPath(startId: string, goalId: string): ConceptNode[] {
  if (startId === goalId) return getConceptsByIds([startId]);
  const queue: string[][] = [[startId]];
  const visited = new Set<string>([startId]);

  while (queue.length) {
    const path = queue.shift();
    if (!path) continue;
    const last = path[path.length - 1];
    const concept = getConceptById(last);
    if (!concept) continue;
    const neighbors = [
      ...concept.nextConcepts,
      ...concept.relatedConcepts,
      ...conceptEdges.filter((edge) => edge.source === last).map((edge) => edge.target),
    ];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor) || !getConceptById(neighbor)) continue;
      const nextPath = [...path, neighbor];
      if (neighbor === goalId) return getConceptsByIds(nextPath);
      visited.add(neighbor);
      queue.push(nextPath);
    }
  }

  return [];
}

export function getConceptReadiness(conceptId: string, masteredIds: string[]) {
  const mastered = new Set(masteredIds);
  const missingPrerequisites = getPrerequisites(conceptId).filter((concept) => !mastered.has(concept.id));
  return {
    ready: missingPrerequisites.length === 0,
    missingPrerequisites,
  };
}

function matchesModule(concept: ConceptNode, moduleName: ConceptModuleFilter) {
  return Boolean(concept.availableModules[moduleName]);
}

function searchText(concept: ConceptNode) {
  return [
    concept.title,
    concept.shortTitle,
    concept.category,
    concept.difficulty,
    concept.description,
    concept.whyItMatters,
    concept.formulas?.join(" "),
    concept.theorems?.join(" "),
    concept.realLifeUses?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterConcepts(filters: ConceptMapFilters): ConceptNode[] {
  const search = filters.search?.trim().toLowerCase();
  return conceptNodes.filter((concept) => {
    if (search && !searchText(concept).includes(search)) return false;
    if (filters.categories?.length && !filters.categories.includes(concept.category)) return false;
    if (filters.difficulties?.length && !filters.difficulties.includes(concept.difficulty)) return false;
    if (filters.modules?.length && !filters.modules.every((moduleName) => matchesModule(concept, moduleName))) return false;
    return true;
  });
}

export function getVisibleEdges(visibleConcepts: ConceptNode[], selectedId?: string, onlyPrerequisites?: boolean, onlyNext?: boolean) {
  const visible = new Set(visibleConcepts.map((concept) => concept.id));
  return conceptEdges.filter((edge) => {
    if (!visible.has(edge.source) || !visible.has(edge.target)) return false;
    if (onlyPrerequisites && selectedId) return edge.target === selectedId && edge.type === "prerequisite";
    if (onlyNext && selectedId) return edge.source === selectedId && edge.type === "builds-into";
    return true;
  });
}

export function getImmediateConnectionIds(conceptId: string) {
  const concept = getConceptById(conceptId);
  if (!concept) return new Set<string>();
  return new Set([
    concept.id,
    ...concept.prerequisites,
    ...concept.nextConcepts,
    ...concept.relatedConcepts,
    ...conceptEdges.filter((edge) => edge.source === conceptId).map((edge) => edge.target),
    ...conceptEdges.filter((edge) => edge.target === conceptId).map((edge) => edge.source),
  ]);
}
