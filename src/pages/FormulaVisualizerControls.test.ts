import { describe, expect, it } from "vitest";
import { getFormulaVisualizerConfig, type FormulaVisualizerEntry } from "../data/formulaVisualizerRoutes";
import { getFormulaControlSpecs } from "./FormulaVisualizerPage";

function entry(id: string, variables: string[]): FormulaVisualizerEntry {
  return {
    id,
    title: id,
    latex: id,
    plainText: id,
    description: id,
    group: "Test",
    difficulty: "Foundation",
    variables,
    visualizerType: "geometry",
    tags: [],
  };
}

describe("formula-specific visualizer controls", () => {
  it("uses the real Geometry route metadata for Pythagoras and circles", () => {
    const geometry = getFormulaVisualizerConfig("geometry");
    const pythagoras = geometry?.formulas.find((formula) => formula.id === "pythagoras");
    const circleArea = geometry?.formulas.find((formula) => formula.id === "circle-area");

    expect(pythagoras && getFormulaControlSpecs(pythagoras).map((control) => control.label)).toEqual(["a", "b"]);
    expect(circleArea && getFormulaControlSpecs(circleArea).map((control) => control.label)).toEqual(["r"]);
  });

  it("shows only the two declared Pythagoras controls", () => {
    expect(getFormulaControlSpecs(entry("pythagoras", ["a", "b"]))).toMatchObject([
      { key: "a", label: "a" },
      { key: "b", label: "b" },
    ]);
  });

  it("maps a radius to the visualizer's primary value", () => {
    expect(getFormulaControlSpecs(entry("circle-area", ["r"]))).toMatchObject([
      { key: "a", label: "r" },
    ]);
  });

  it("maps theta to the angle control with degree units", () => {
    expect(getFormulaControlSpecs(entry("sector-area", ["theta", "r"]))).toMatchObject([
      { key: "p", label: "θ", min: 5, max: 85, unit: "°" },
      { key: "a", label: "r" },
    ]);
  });

  it("maps coordinate components to four distinct controls", () => {
    expect(getFormulaControlSpecs(entry("distance", ["x1", "y1", "x2", "y2"])).map(({ key, label }) => ({ key, label }))).toEqual([
      { key: "a", label: "x1" },
      { key: "b", label: "y1" },
      { key: "c", label: "x2" },
      { key: "n", label: "y2" },
    ]);
  });
});
