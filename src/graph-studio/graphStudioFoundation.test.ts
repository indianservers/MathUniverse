import { beforeEach, describe, expect, it } from "vitest";
import { compileFunctionExpression } from "../utils/functionParser";
import { linearRegression, numericGraphData, parseGraphData } from "./dataAnalysis";
import { sampleAdvancedGraphExpression } from "./advancedGraphLayers";
import { createGraphVariable, detectGraphVariables, reconcileGraphVariables, substituteGraphVariables } from "./expressionEngine";
import { createGraphStudioProject, exportGraphStudioProject, importGraphStudioProject, readGraphStudioProjects, saveGraphStudioProject } from "./projectStorage";

describe("Graph Studio expression foundation", () => {
  it("detects parameters without treating coordinates and functions as sliders", () => {
    expect(detectGraphVariables(["y = a*sin(b*x+c)", "z = r*(x^2+y^2)+t"])).toEqual(["a", "b", "c", "r", "t"]);
    const variables = reconcileGraphVariables(["y=a*x+b"], [createGraphVariable("a", 3)]);
    expect(variables.map((item) => [item.name, item.value])).toEqual([["a", 3], ["b", 1]]);
    expect(substituteGraphVariables("a*sin(x)+b", variables)).toBe("(3)*sin(x)+(1)");
  });

  it("keeps mathematical evaluation inside the safe parser", () => {
    expect(compileFunctionExpression("sinh(x)+cosh(x)")(0)).toBe(1);
    expect(() => compileFunctionExpression("window.alert(1)")).toThrow(/Unsupported/);
  });

  it("supports safe piecewise functions and domain restrictions", () => {
    const absolute = compileFunctionExpression("{x < 0: -x, x >= 0: x}");
    const restricted = compileFunctionExpression("sin(x) {-pi <= x <= pi}");

    expect(absolute(-3)).toBe(3);
    expect(absolute(4)).toBe(4);
    expect(restricted(0)).toBe(0);
    expect(restricted(4)).toBeNaN();
    expect(detectGraphVariables(["a*x {-b <= x <= b}"])).toEqual(["a", "b"]);
  });

  it("parses pasted data and calculates linear regression with residuals", () => {
    const rows = parseGraphData("1,3\n2,5\n3,7");
    const regression = linearRegression(numericGraphData(rows));

    expect(regression?.slope).toBeCloseTo(2);
    expect(regression?.intercept).toBeCloseTo(1);
    expect(regression?.rSquared).toBeCloseTo(1);
    expect(regression?.residuals).toHaveLength(3);
  });

  it("samples sequences and bounded recurrences with safe expressions", () => {
    const sequence = sampleAdvancedGraphExpression("seq(n^2, 2, 5)", -10, 10);
    const recurrence = sampleAdvancedGraphExpression("recur(1, 2*prev+n, 4)", -10, 10);

    expect(sequence?.family).toBe("sequence");
    expect(sequence?.points.map((point) => point.y)).toEqual([4, 9, 16, 25]);
    expect(recurrence?.points.map((point) => point.y)).toEqual([1, 2, 5, 12]);
  });

  it("samples contour, vector, slope, and polar-range layers", () => {
    const contour = sampleAdvancedGraphExpression("contour(x^2+y^2, 1;4)", -3, 3);
    const vector = sampleAdvancedGraphExpression("vector(-y, x)", -3, 3);
    const slope = sampleAdvancedGraphExpression("slope(x-y)", -3, 3);
    const polar = sampleAdvancedGraphExpression("r=2*sin(3*theta),theta=0..pi", -3, 3);

    expect(contour?.points.length).toBeGreaterThan(100);
    expect(vector?.style).toBe("vectors");
    expect(slope?.points.length).toBeGreaterThan(100);
    expect(polar?.points).toHaveLength(720);
  });

  it("caps advanced plot density to preserve interaction performance", () => {
    const sequence = sampleAdvancedGraphExpression("seq(n,0,9999)", -10, 10);
    const vector = sampleAdvancedGraphExpression("vector(-y,x)", -100, 100);

    expect(sequence?.points).toHaveLength(500);
    expect(vector?.points.length).toBeLessThanOrEqual(625 * 3);
  });
});

describe("Graph Studio offline projects", () => {
  beforeEach(() => localStorage.clear());

  it("saves, exports, imports, and migrates a versioned project", () => {
    const project = createGraphStudioProject("2d", "Wave lab", { expression: "sin(x)" });
    const saved = saveGraphStudioProject({ ...project, variables: [createGraphVariable("a", 2)] });
    expect(readGraphStudioProjects("2d")).toHaveLength(1);
    const imported = importGraphStudioProject<{ expression: string }>(exportGraphStudioProject(saved), "2d");
    expect(imported.schemaVersion).toBe(1);
    expect(imported.name).toContain("imported");
    expect(imported.variables[0].value).toBe(2);
    expect(readGraphStudioProjects("2d")).toHaveLength(2);
  });

  it("rejects opening a 3D project in the 2D studio", () => {
    const project = createGraphStudioProject("3d", "Surface", { expression: "x^2+y^2" });
    expect(() => importGraphStudioProject(exportGraphStudioProject(project), "2d")).toThrow(/Graph Studio 3D/);
  });
});
