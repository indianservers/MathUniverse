import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { phase1BackupManifest, protectedLayoutInvariants, protectedWorkspaceBaselines } from "./workspaceBaselineGuards";

const pageSources = {
  mathWorkspace: new URL("../pages/MathWorkspace.tsx", import.meta.url),
  geometryCommandController: new URL("./geometryCommandController.ts", import.meta.url),
  geometryConstructionBuilder: new URL("./geometryConstructionBuilder.ts", import.meta.url),
  geometryAdvancedConstructionBuilder: new URL("./geometryAdvancedConstructionBuilder.ts", import.meta.url),
  geometryWorkspacePanel: new URL("../components/workspace/panels/GeometryWorkspacePanel.tsx", import.meta.url),
  shapesExplorer: new URL("../pages/ShapesExplorer.tsx", import.meta.url),
};

describe("phase 1 workspace baseline guards", () => {
  it("records a recoverable backup branch and source archive", () => {
    expect(phase1BackupManifest.branch).toBe("codex/phase-1-baseline-20260611");
    expect(phase1BackupManifest.archivedFolders).toEqual([
      "src/pages",
      "src/components",
      "src/workspace",
      "src/data",
      "src/modules",
      "src/visualizations",
    ]);
    expect(phase1BackupManifest.archive).toContain("phase-1-baseline-20260611");
    expect(existsSync(phase1BackupManifest.archive)).toBe(true);
  });

  it("protects the main smoke routes before future phases expand the app", () => {
    const ids = new Set(protectedWorkspaceBaselines.map((item) => item.id));
    expect(ids.size).toBe(protectedWorkspaceBaselines.length);
    expect(protectedWorkspaceBaselines).toHaveLength(6);
    expect(protectedWorkspaceBaselines.every((item) => item.route.startsWith("/"))).toBe(true);
    expect(protectedWorkspaceBaselines.every((item) => item.protectedSignals.length >= 4)).toBe(true);
    expect(protectedWorkspaceBaselines.every((item) => item.mustKeep.length >= 4)).toBe(true);
  });

  it("keeps current 2D and 3D workspace layout signals in source", async () => {
    const mathWorkspace = await readFile(pageSources.mathWorkspace, "utf8");
    const geometryCommandController = await readFile(pageSources.geometryCommandController, "utf8");
    const geometryConstructionBuilder = await readFile(pageSources.geometryConstructionBuilder, "utf8");
    const geometryAdvancedConstructionBuilder = await readFile(pageSources.geometryAdvancedConstructionBuilder, "utf8");
    const geometryWorkspacePanel = await readFile(pageSources.geometryWorkspacePanel, "utf8");
    const geometrySource = `${mathWorkspace}\n${geometryCommandController}\n${geometryConstructionBuilder}\n${geometryAdvancedConstructionBuilder}\n${geometryWorkspacePanel}`;
    const geometry = protectedWorkspaceBaselines.find((item) => item.id === "workspace-geometry-2d");
    const workspace3d = protectedWorkspaceBaselines.find((item) => item.id === "workspace-3d");

    expect(geometry).toBeTruthy();
    expect(workspace3d).toBeTruthy();
    for (const signal of geometry?.protectedSignals ?? []) expect(geometrySource).toContain(signal);
    for (const signal of workspace3d?.protectedSignals ?? []) expect(mathWorkspace).toContain(signal);
  });

  it("keeps the premium angle tool guidance and measured-angle rendering", async () => {
    const mathWorkspace = await readFile(pageSources.mathWorkspace, "utf8");
    const geometryConstructionBuilder = await readFile(pageSources.geometryConstructionBuilder, "utf8");
    const geometryAdvancedConstructionBuilder = await readFile(pageSources.geometryAdvancedConstructionBuilder, "utf8");
    const geometryWorkspacePanel = await readFile(pageSources.geometryWorkspacePanel, "utf8");
    const geometrySource = `${mathWorkspace}\n${geometryConstructionBuilder}\n${geometryAdvancedConstructionBuilder}\n${geometryWorkspacePanel}`;

    expect(geometrySource).toContain("side point, vertex, side point");
    expect(geometrySource).toContain("AngleToolPreview");
    expect(geometrySource).toContain("buildAngleFromPoints");
    expect(geometrySource).toContain("kind: \"angle\"");
    expect(geometrySource).toContain("stroke=\"#f97316\"");
    expect(geometrySource).toContain("vertex second");
  });

  it("keeps current Shapes Explorer layout signals in source", async () => {
    const shapesExplorer = await readFile(pageSources.shapesExplorer, "utf8");
    const shapes = protectedWorkspaceBaselines.find((item) => item.id === "shapes-explorer");

    expect(shapes).toBeTruthy();
    for (const signal of shapes?.protectedSignals ?? []) expect(shapesExplorer).toContain(signal);
  });

  it("documents explicit no-regression rules for future expansion phases", () => {
    expect(protectedLayoutInvariants.some((item) => item.includes("2D geometry board"))).toBe(true);
    expect(protectedLayoutInvariants.some((item) => item.includes("3D workspace"))).toBe(true);
    expect(protectedLayoutInvariants.some((item) => item.includes("engineering mathematics"))).toBe(true);
  });
});
