import { describe, expect, it } from "vitest";
import { sampleGraph } from "../../../modules/graph-theory/graphTheoryEngine";
import { deriveDiscreteGraphResult } from "./discreteConceptModels";
import type { DiscreteLessonMode } from "../presets/discreteLessonPresets";
import { initialDiscreteGraph, toggleDiscreteConceptGraph } from "../adapters/discrete/DiscreteConceptActivities";

const graphModes: DiscreteLessonMode[] = ["graph-builder","directed","weighted","degree","paths-cycles","components","euler","hamiltonian","tree","mst","shortest-path","bipartite","planar","flow","tsp","adjacency"];

describe("discrete concept graph models",()=>{
 it("derives a checkable result for every graph preset",()=>{
  for(const mode of graphModes){
   const result=deriveDiscreteGraphResult(mode,sampleGraph,"A");
   expect(result.label,mode).toBeTruthy();
   expect(result.value,mode).toBeTruthy();
   expect(result.prompt,mode).toBeTruthy();
   expect(result.expected,mode).toBeTruthy();
  }
 });
 it("keeps minimum-spanning-tree and shortest-path calculations distinct",()=>{
  const mst=deriveDiscreteGraphResult("mst",sampleGraph,"A");
  const shortest=deriveDiscreteGraphResult("shortest-path",sampleGraph,"A");
  expect(mst.label).toContain("spanning");
  expect(shortest.label).toContain("Distance");
  expect(mst.steps.some(step=>step.label.includes("Kruskal"))).toBe(true);
  expect(shortest.steps.some(step=>step.label.includes("Dijkstra"))).toBe(true);
 });
 it("changes the declared result when each concept graph is edited",()=>{
  for(const mode of graphModes){
   const beforeGraph=initialDiscreteGraph(mode);
   const afterGraph=toggleDiscreteConceptGraph(mode,beforeGraph);
   const before=deriveDiscreteGraphResult(mode,beforeGraph,"A");
   const after=deriveDiscreteGraphResult(mode,afterGraph,"A");
   expect(`${after.value}|${after.expected}`,mode).not.toBe(`${before.value}|${before.expected}`);
  }
 });
});
