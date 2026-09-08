import { describe, expect, it } from "vitest";
import { WORKSHOP, FACTORY, formulationSlots, checkFormulation, formulationTokens, placeFormulationToken, formulationSources } from "./linearProgrammingFormulationModel";
describe("linear programming formulation", () => {
  it("traces individual quantities to their scenario sources", () => {
    expect(formulationSources(WORKSHOP, "50").profits).toEqual([true, false]);
    expect(formulationSources(WORKSHOP, "80").resources).toEqual([true, false]);
    expect(formulationSources(WORKSHOP, "3x").resources).toEqual([false, true]);
    expect(formulationSources(WORKSHOP, "2").resources).toEqual([true, true]);
    expect(formulationSources(FACTORY, "150").resources).toEqual([false, true]);
    expect(formulationSources(WORKSHOP, "0").profits).toEqual([false, false]);
    expect(formulationSources(WORKSHOP, "x").description).toBe("x counts chairs");
  });
  it("accepts reversed term order without accepting missing or duplicate terms", () => {
    const values = formulationSlots(WORKSHOP).map(slot => slot.answer);
    values[0] = "y, x"; values[1] = "Maximize 40y + 50x"; values[2] = "4y + 2x";
    expect(checkFormulation(WORKSHOP, values).complete).toBe(true);
    values[1] = "Maximize 50x + 50x";
    expect(checkFormulation(WORKSHOP, values).checks[1]).toBe(false);
    values[1] = "40y + 50x";
    expect(checkFormulation(WORKSHOP, values).checks[1]).toBe(false);
  });
  it.each([WORKSHOP, FACTORY])("assembles a full model from individual quantities", scenario => {
    let values: string[] = Array(10).fill("");
    const put = (index: number, tokens: string[]) => tokens.forEach(token => { values = placeFormulationToken(scenario, values, index, token); });
    put(0, scenario.variables);
    put(1, ["Maximize", String(scenario.profits[0]), scenario.variables[0], String(scenario.profits[1]), scenario.variables[1]]);
    scenario.resources.forEach((resource, i) => {
      put(2+i*3, [String(resource.coefficients[0]), scenario.variables[0], String(resource.coefficients[1]), scenario.variables[1]]);
      put(3+i*3, ["≤"]); put(4+i*3, [String(resource.limit)]);
    });
    put(8, [scenario.variables[0], "≥", "0"]); put(9, [scenario.variables[1], "≥", "0"]);
    expect(checkFormulation(scenario, values).complete).toBe(true);
    expect(formulationTokens(scenario)).not.toContain(formulationSlots(scenario)[1].answer);
  });
  it("rejects external drag payloads without changing the model", () => {
    const values = Array(10).fill("");
    expect(placeFormulationToken(WORKSHOP, values, 1, "injected answer")).toBe(values);
  });
  it.each([WORKSHOP, FACTORY])("validates all ten slots independently", scenario => {
    const answers = formulationSlots(scenario).map(slot => slot.answer);
    expect(checkFormulation(scenario, answers)).toMatchObject({ correct:10, placed:10, complete:true });
    answers.forEach((_, index) => {
      const wrong = [...answers]; wrong[index] = "incorrect";
      expect(checkFormulation(scenario, wrong)).toMatchObject({ correct:9, complete:false });
    });
  });
  it("rejects reversed inequalities and omitted non-negativity", () => {
    const answers = formulationSlots(WORKSHOP).map(slot => slot.answer);
    answers[3] = "≥"; answers[8] = "";
    expect(checkFormulation(WORKSHOP, answers)).toMatchObject({ correct:8, placed:9, complete:false });
  });
  it("uses the factory's distinct coefficients and limits", () => {
    expect(formulationSlots(FACTORY).map(slot => slot.answer)).toEqual(["d, c", "Maximize 60d + 70c", "3d + 2c", "≤", "120", "2d + 5c", "≤", "150", "d ≥ 0", "c ≥ 0"]);
  });
});
