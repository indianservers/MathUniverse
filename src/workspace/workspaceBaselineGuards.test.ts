import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { phase1BackupManifest, protectedLayoutInvariants, protectedWorkspaceBaselines } from "./workspaceBaselineGuards";

const pageSources = {
  mathWorkspace: new URL("../pages/MathWorkspace.tsx", import.meta.url),
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
    if (process.env.CI) {
      expect(phase1BackupManifest.archive).toContain("Math Universe Backups");
    } else {
      expect(existsSync(phase1BackupManifest.archive)).toBe(true);
    }
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
    const geometry = protectedWorkspaceBaselines.find((item) => item.id === "workspace-geometry-2d");
    const workspace3d = protectedWorkspaceBaselines.find((item) => item.id === "workspace-3d");

    expect(geometry).toBeTruthy();
    expect(workspace3d).toBeTruthy();
    for (const signal of geometry?.protectedSignals ?? []) expect(mathWorkspace).toContain(signal);
    for (const signal of workspace3d?.protectedSignals ?? []) expect(mathWorkspace).toContain(signal);
  });

  it("keeps the premium angle tool guidance and measured-angle rendering", async () => {
    const mathWorkspace = await readFile(pageSources.mathWorkspace, "utf8");

    expect(mathWorkspace).toContain("side point, vertex, side point");
    expect(mathWorkspace).toContain("angle-tool-preview");
    expect(mathWorkspace).toContain("addAngleMeasurement");
    expect(mathWorkspace).toContain("reflex");
    expect(mathWorkspace).toContain("vertex second");
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
