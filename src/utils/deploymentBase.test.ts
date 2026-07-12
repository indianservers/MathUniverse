import { describe, expect, it } from "vitest";
import { DEPLOYMENT_BASE_PATH, getRouterBasename } from "./deploymentBase";

describe("deployment base routing", () => {
  it("uses the public Maths-Visualizations folder as the router basename", () => {
    expect(getRouterBasename("/Maths-Visualizations")).toBe(DEPLOYMENT_BASE_PATH);
    expect(getRouterBasename("/Maths-Visualizations/")).toBe(DEPLOYMENT_BASE_PATH);
    expect(getRouterBasename("/Maths-Visualizations/theorems/geometry")).toBe(DEPLOYMENT_BASE_PATH);
  });

  it("keeps local and root deployments unchanged", () => {
    expect(getRouterBasename("/")).toBeUndefined();
    expect(getRouterBasename("/theorems/geometry")).toBeUndefined();
    expect(getRouterBasename("/maths-visualizations")).toBeUndefined();
  });
});
