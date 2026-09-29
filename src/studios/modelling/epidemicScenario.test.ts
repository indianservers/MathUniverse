import { expect, it } from "vitest";
import { epidemicScenario } from "./epidemicScenario";

it("conserves population and intervention lowers the effective reproduction number", () => {
  const input = { beta: 0.45, gamma: 0.15, vaccination: 0.02, infected: 50, population: 100000, seir: true, interventionDay: 20, reduction: 0.6 };
  const result = epidemicScenario(input);
  expect(result[20].re).toBeLessThan(result[19].re);
  result.forEach((point) => expect(point.s + point.e + point.i + point.r).toBeCloseTo(input.population, 6));
});
