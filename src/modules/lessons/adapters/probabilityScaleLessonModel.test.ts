import { describe, expect, it } from "vitest";
import { likelihood, probabilityScenarios, scenarioProbability, simulateProbability } from "./probabilityScaleLessonModel";
describe("Probability scale model", () => { it("maps scenarios to the 0-to-1 scale", () => { expect(probabilityScenarios.map(scenarioProbability)).toEqual([1/6, .5, .5, 1, 0]); expect(likelihood(0)).toBe("Impossible"); expect(likelihood(1)).toBe("Certain"); }); it("simulates trials", () => { expect(simulateProbability(.5, 4, () => .25)).toBe(1); expect(simulateProbability(.5, 4, () => .75)).toBe(0); }); });
