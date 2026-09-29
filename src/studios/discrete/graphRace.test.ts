import { expect, it } from "vitest";
import { dijkstraSteps, kruskalSteps } from "./graphRace";

it("Dijkstra reaches all nodes with nondecreasing settled distances", () => {
  const steps = dijkstraSteps();
  expect(steps.at(-1)?.visited).toEqual(["A", "C", "B", "D", "E"]);
  expect(steps.slice(1).map((step) => step.cost)).toEqual([0, 2, 3, 8, 10]);
});

it("Kruskal accepts four edges without a cycle", () => {
  const final = kruskalSteps().at(-1)!;
  expect(final.chosen).toHaveLength(4);
  expect(final.cost).toBe(10);
});
