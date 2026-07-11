import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { navItems } from "../../components/layout/navItems";
import { journeySteps } from "../components/formula-visualizer/FormulaJourneyMode";
import {
  computeTrigFormulaValues,
  getFormulaDefinition,
  getFormulaLiveValue,
  snapToSpecialAngle,
  trigFormulaDefinitions,
} from "../utils/trigFormulaUtils";
import TrigFormulaVisualizerPage, { trianglePointerToDegrees } from "./TrigFormulaVisualizerPage";

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

  it("renders the compact learning workspace surfaces", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigFormulaVisualizerPage />
      </MemoryRouter>,
    );

    expect(html).toContain("formula-journey-mode");
    expect(html).toContain("Formula Journey Mode");
    expect(html).toContain(journeySteps[0].title);
    expect(html).toContain("formula-control-panel");
    expect(html).toContain("trig-main-visual-pane");
    expect(html).toContain("Values and explanation");
    expect(html).toContain("Open formula controls");
    expect(html).toContain("formula-comparison-mode");
    expect(html).toContain("comparison-graph-svg");
  });

  it("renders every formula in the top picker with stable picker IDs", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigFormulaVisualizerPage />
      </MemoryRouter>,
    );

    expect(trigFormulaDefinitions).toHaveLength(40);
    expect(trigFormulaDefinitions.filter((formula) => ["reciprocal-identities", "periodic-identities", "sum-difference-identities", "double-angle-identities"].includes(formula.groupId)).length).toBe(12);
    expect(trigFormulaDefinitions.filter((formula) => formula.groupId === "basic-flip-formulas")).toHaveLength(6);

    for (const formula of trigFormulaDefinitions) {
      expect(html).toContain(`formula-picker-${formula.id}`);
      expect(html).toContain(formula.meaning);
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
    expect(getFormulaLiveValue("reciprocal-cos-sec", sixty)).toBe("1");
    expect(getFormulaLiveValue("basic-sin-from-cosec", sixty)).toBe("0.866 = 0.866");
    expect(getFormulaLiveValue("basic-cos-from-sec", sixty)).toBe("0.5 = 0.5");
    expect(getFormulaLiveValue("basic-sec-from-cos", sixty)).toBe("2");
    expect(getFormulaLiveValue("periodic-tan", sixty).trim()).toBe("1.732 = 1.732");
    expect(getFormulaLiveValue("double-sin", sixty)).toBe("0.866 = 0.866");
    expect(getFormulaLiveValue("angle-sum-cos", sixty)).toContain("0 = 0");
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

  it("maps right-triangle pane dragging to a usable acute angle", () => {
    const origin = { x: 100, y: 330 };

    expect(Math.round(trianglePointerToDegrees({ x: 200, y: 230 }, origin))).toBe(45);
    expect(Math.round(trianglePointerToDegrees({ x: 460, y: 318 }, origin))).toBe(2);
    expect(Math.round(trianglePointerToDegrees({ x: 112, y: 60 }, origin))).toBe(87);
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
