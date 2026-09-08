import { describe, expect, it } from "vitest";
import {
  checkPlacement,
  checkPractice,
  familyOf,
  graphExplanation,
  placeVariable,
  placementScore,
  practiceVariables,
  suitableGraphs,
  variables,
  type Placements,
} from "./dataTypesModel";

describe("Data Types dedicated model", () => {
  it("classifies all ten contextualized variables without numerical-label confusion", () => {
    expect(variables).toHaveLength(10);
    expect(new Set(variables.map((item) => item.id)).size).toBe(10);
    expect(
      variables
        .filter((item) => familyOf(item.type) === "Categorical")
        .map((item) => item.id),
    ).toEqual(["blood", "rank", "satisfaction", "shirt"]);
    expect(variables.find((item) => item.id === "score")?.type).toBe(
      "Discrete",
    );
    expect(variables.find((item) => item.id === "height")?.type).toBe(
      "Continuous",
    );
  });
  it("retains independent type and graph placements, supports corrections and rejects foreign ids", () => {
    const original: Placements = {};
    const first = placeVariable(original, "blood", "Numerical");
    const second = placeVariable(first, "blood", "Pie chart");
    expect(original).toEqual({});
    expect(checkPlacement(variables[0], second.blood)).toEqual({
      familyCorrect: false,
      graphCorrect: true,
    });
    const corrected = placeVariable(second, "blood", "Categorical");
    expect(corrected.blood).toEqual({
      family: "Categorical",
      graph: "Pie chart",
    });
    expect(placeVariable(corrected, "foreign", "Categorical")).toBe(corrected);
  });
  it("only counts variables with both assignments correct", () => {
    let state: Placements = {};
    expect(placementScore(state)).toBe(0);
    for (const variable of variables)
      state = placeVariable(state, variable.id, familyOf(variable.type));
    expect(placementScore(state)).toBe(0);
    for (const variable of variables)
      state = placeVariable(
        state,
        variable.id,
        suitableGraphs(variable.type)[0],
      );
    expect(placementScore(state)).toBe(10);
    state = placeVariable(state, "blood", "Histogram");
    expect(placementScore(state)).toBe(9);
  });
  it("accepts legitimate graph alternatives with their conditions", () => {
    expect(suitableGraphs("Nominal")).toEqual(["Bar chart", "Pie chart"]);
    expect(suitableGraphs("Ordinal")).not.toContain("Histogram");
    expect(suitableGraphs("Continuous")).toContain("Dot plot");
    expect(suitableGraphs("Discrete")).toContain("Histogram");
    expect(graphExplanation("Nominal", "Pie chart")).toContain("whole sample");
    expect(graphExplanation("Discrete", "Histogram")).toContain("bins");
    expect(graphExplanation("Continuous", "Dot plot")).toContain(
      "small sample",
    );
  });
  it("requires both practice selections and distinguishes counts, duration and ratings", () => {
    expect(checkPractice({})).toEqual([false, false, false, false]);
    const answers = Object.fromEntries(
      practiceVariables.map((variable) => [
        variable.id,
        { type: variable.type, graph: suitableGraphs(variable.type)[0] },
      ]),
    );
    expect(checkPractice(answers)).toEqual([true, true, true, true]);
    expect(
      checkPractice({
        ...answers,
        experience: { type: "Discrete", graph: "Dot plot" },
        rating: { type: "Continuous", graph: "Histogram" },
      }),
    ).toEqual([true, false, true, false]);
  });
});
