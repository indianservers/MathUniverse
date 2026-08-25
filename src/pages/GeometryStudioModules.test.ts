import { describe, expect, it } from "vitest";
import { geometryWorkspaceModule } from "./geometryStudioModules";
import { workspaceById } from "../workspace/mathWorkspaces";

describe("Geometry Studio modules", () => {
  it("exposes the existing 2D geometry workspace as a studio module", () => {
    expect(geometryWorkspaceModule).toEqual({
      id: "workspace-2d",
      label: "2D Geometry Workspace",
      route: "/workspace/geometry",
    });
    expect(workspaceById("geometry")?.route).toBe(geometryWorkspaceModule.route);
  });
});
