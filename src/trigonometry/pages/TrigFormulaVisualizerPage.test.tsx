import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { navItems } from "../../components/layout/navItems";
import { journeySteps } from "../components/formula-visualizer/FormulaJourneyMode";
import { practiceQuestions } from "../components/formula-visualizer/FormulaPracticeMode";
import { misconceptionAlerts } from "../components/formula-visualizer/MisconceptionAlerts";
import {
  computeTrigFormulaValues,
  getFormulaDefinition,
  getFormulaLiveValue,
  snapToSpecialAngle,
  trigFormulaGroups,
  trigFormulaDefinitions,
} from "../utils/trigFormulaUtils";
import TrigFormulaVisualizerPage from "./TrigFormulaVisualizerPage";

describe("Trigonometric Formula Visualizer page", () => {
  it("renders the new page without replacing the existing trigonometry overview", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigFormulaVisualizerPage />
      </MemoryRouter>,
    );

    expect(html).toContain("Trigonometric Formula Visualizer");
    expect(html).toContain("Back to Trigonometry");
    expect(html).toContain("formula-unit-circle-svg");
  });

  it("renders the premium learning experience surfaces", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigFormulaVisualizerPage />
      </MemoryRouter>,
    );

    expect(html).toContain("formula-journey-mode");
    expect(html).toContain("Formula Journey Mode");
    expect(html).toContain(journeySteps[0].title);
    expect(html).toContain("formula-practice-mode");
    expect(html).toContain(practiceQuestions[0].prompt);
    expect(html).toContain("misconception-alerts");
    expect(html).toContain(misconceptionAlerts[0]);
    expect(html).toContain("formula-comparison-mode");
    expect(html).toContain("comparison-graph-svg");
  });

  it("renders every formula group and gallery card", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigFormulaVisualizerPage />
      </MemoryRouter>,
    );

    for (const group of trigFormulaGroups) {
      expect(html).toContain(`formula-group-${group.id}`);
      expect(html).toContain(group.title);
    }

    for (const formula of trigFormulaDefinitions) {
      expect(html).toContain(`formula-card-${formula.id}`);
      expect(html).toContain(formula.formula);
    }
  });

  it("updates formula values when theta changes", () => {
    const fortyFive = computeTrigFormulaValues(45);
    const sixty = computeTrigFormulaValues(60);

    expect(getFormulaLiveValue("sin", fortyFive)).toBe("0.707");
    expect(getFormulaLiveValue("cos", fortyFive)).toBe("0.707");
    expect(getFormulaLiveValue("tan-ratio", fortyFive)).toBe("1");
    expect(getFormulaLiveValue("sin", sixty)).toBe("0.866");
    expect(getFormulaLiveValue("cos", sixty)).toBe("0.5");
    expect(getFormulaLiveValue("pythagorean", sixty)).toBe("1");
    expect(getFormulaLiveValue("sec", sixty)).toBe("2");
    expect(getFormulaLiveValue("comp-sin", sixty)).toBe("0.5");
  });

  it("changes the selected visual explanation by formula", () => {
    expect(getFormulaDefinition("sin").visualExplanation).toContain("vertical height");
    expect(getFormulaDefinition("cos").visualExplanation).toContain("horizontal distance");
    expect(getFormulaDefinition("tan").visualExplanation).toContain("tangent line");
    expect(getFormulaDefinition("pythagorean").visualExplanation).toContain("combine");
    expect(getFormulaDefinition("even-sin").explanations.simple).toContain("reflects");
    expect(getFormulaDefinition("comp-tan").explanations.memory).toContain("cotangent");
  });

  it("supports snap-to-special-angle math", () => {
    expect(snapToSpecialAngle(58)).toBe(60);
    expect(snapToSpecialAngle(44)).toBe(45);
    expect(snapToSpecialAngle(52)).toBe(52);
  });

  it("adds the new route and keeps existing trigonometry routes discoverable", () => {
    const routes = navItems.map((item) => item.route);
    expect(routes).toContain("/trigonometry");
    expect(routes).toContain("/trigonometry/unit-circle");
    expect(routes).toContain("/trigonometry/formula-visualizer");

    const appSource = readFileSync(fileURLToPath(new URL("../../App.tsx", import.meta.url)), "utf8");
    const formulaRouteIndex = appSource.indexOf('path="trigonometry/formula-visualizer"');
    const conceptRouteIndex = appSource.indexOf('path="trigonometry/:conceptId"');

    expect(formulaRouteIndex).toBeGreaterThan(-1);
    expect(conceptRouteIndex).toBeGreaterThan(-1);
    expect(formulaRouteIndex).toBeLessThan(conceptRouteIndex);
  });
});
