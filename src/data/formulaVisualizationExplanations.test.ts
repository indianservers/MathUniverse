import { describe, expect, it } from "vitest";
import { formulaVisualizerConfigs } from "./formulaVisualizerRoutes";
import { buildFormulaVisualizationExplanation } from "./formulaVisualizationExplanations";

describe("formula visualization explanations", () => {
  const formulas = formulaVisualizerConfigs.flatMap((config) => config.formulas);

  it("provides a detailed explanation for every configured formula", () => {
    expect(formulas.length).toBeGreaterThan(450);
    for (const formula of formulas) {
      const explanation = buildFormulaVisualizationExplanation(formula);
      expect(explanation.conceptSummary, formula.id).toContain(formula.title);
      expect(explanation.diagramReading, formula.id).toHaveLength(4);
      expect(explanation.controlEffects, formula.id).toHaveLength(6);
      expect(explanation.reasoningSteps, formula.id).toHaveLength(5);
      expect(explanation.invariant.length, formula.id).toBeGreaterThan(35);
      expect(explanation.commonMistake.length, formula.id).toBeGreaterThan(25);
      expect(explanation.tryThis.length, formula.id).toBeGreaterThan(20);
      expect(explanation.successCondition.length, formula.id).toBeGreaterThan(20);
      expect(explanation.textAlternative, formula.id).toContain(formula.plainText);
    }
  });

  it("uses topic-aware visual language", () => {
    const derivative = formulas.find((formula) => formula.visualizerType === "calculus")!;
    const setFormula = formulas.find((formula) => formula.visualizerType === "set-logic")!;
    expect(buildFormulaVisualizationExplanation(derivative).diagramReading.join(" ")).toMatch(/curve|slope|area/);
    expect(buildFormulaVisualizationExplanation(setFormula).diagramReading.join(" ")).toMatch(/set|region|row|operation/);
  });
});
