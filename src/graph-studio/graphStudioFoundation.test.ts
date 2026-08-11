import { beforeEach, describe, expect, it } from "vitest";
import { compileFunctionExpression } from "../utils/functionParser";
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
