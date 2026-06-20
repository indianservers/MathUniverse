import { describe, expect, it } from "vitest";
import { resolveWorkspaceModeFromPath, workspaceModeConfigs, workspaceModeNavigation } from "./workspaceModeConfig";

describe("workspace mode config", () => {
  it.each([
    ["/workspace", "home"],
    ["/workspace/", "home"],
    ["/workspace/graph", "graph"],
    ["/workspace/geometry", "geometry"],
    ["/workspace/3d", "three-d"],
    ["/workspace/data", "data"],
    ["/workspace/data/spreadsheet", "data"],
    ["/workspace/data/cas", "data"],
    ["/workspace/teach", "teacher"],
  ])("resolves %s to %s", (route, mode) => {
    expect(resolveWorkspaceModeFromPath(route)?.mode).toBe(mode);
  });

  it("returns null for unknown workspace subroutes", () => {
    expect(resolveWorkspaceModeFromPath("/workspace/unknown")).toBeNull();
  });

  it("keeps navigation route configs aligned with primary surfaces", () => {
    expect(workspaceModeNavigation.map((item) => item.mode)).toEqual(["graph", "geometry", "three-d", "data", "teacher"]);

    for (const config of Object.values(workspaceModeConfigs)) {
      expect(config.routePath).toMatch(/^\/workspace/);
      expect(config.title.length).toBeGreaterThan(0);
      expect(config.description.length).toBeGreaterThan(20);
      expect(config.primarySurfaceTestId?.startsWith("workspace-")).toBe(true);
    }
  });
});
