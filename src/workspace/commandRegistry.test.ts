import { describe, expect, it } from "vitest";
import { commandExamplesFor, commandRegistrySummary, normalizeCommandName, resolveCommandSpec, workspaceCommandCatalog } from "./commandRegistry";

describe("workspace command registry", () => {
  it("groups critical GeoGebra-style commands by domain", () => {
    const summary = commandRegistrySummary();

    expect(summary.total).toBeGreaterThan(40);
    expect(summary.byGroup.Algebra.total).toBeGreaterThan(5);
    expect(summary.byGroup["Geometry 3D"].total).toBeGreaterThan(5);
    expect(summary.byGroup.Matrices.implemented).toBeGreaterThanOrEqual(3);
  });

  it("normalizes aliases and returns examples for suggestions", () => {
    expect(normalizeCommandName("Diff")).toBe("derivative");
    expect(normalizeCommandName("Intersection")).toBe("intersect");
    expect(resolveCommandSpec("Limit")?.implemented).toBe(true);
    expect(commandExamplesFor("matrix")).toEqual(expect.arrayContaining(["Matrix[[1,2],[3,4]]"]));
  });

  it("keeps every command discoverable with examples", () => {
    expect(workspaceCommandCatalog.every((command) => command.signature && command.description && command.examples.length)).toBe(true);
  });
});
