import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { engineeringLabLaunchers, launcherCoverageSummary, launchersForDomain } from "./engineeringLabLaunchers";

const pageSource = new URL("../pages/EngineeringMath.tsx", import.meta.url);

describe("engineering lab launchers", () => {
  it("gives every engineering math domain multiple native launchers", () => {
    expect(engineeringMathDomains.every((domain) => launchersForDomain(domain.id).length >= 4)).toBe(true);
    expect(engineeringLabLaunchers.every((launcher) => launcher.route.startsWith("/"))).toBe(true);
    expect(engineeringLabLaunchers.every((launcher) => launcher.formulas.length > 0)).toBe(true);
  });

  it("covers concept labs, workspaces, formula maps, and practice-ready routes", () => {
    const kinds = new Set(engineeringLabLaunchers.map((launcher) => launcher.kind));
    const summary = launcherCoverageSummary();

    expect(Array.from(kinds)).toEqual(expect.arrayContaining(["concept-lab", "workspace", "formula-map", "practice"]));
    expect(summary.coveredDomainCount).toBe(summary.domainCount);
    expect(summary.workspaceLauncherCount).toBeGreaterThanOrEqual(engineeringMathDomains.length);
    expect(summary.formulaMapLauncherCount).toBeGreaterThan(0);
  });

  it("keeps protected 2D and 3D workspaces as launch targets without rewriting them", () => {
    const workspaceRoutes = engineeringLabLaunchers.filter((launcher) => launcher.kind === "workspace").map((launcher) => launcher.route);

    expect(workspaceRoutes.some((route) => route.startsWith("/workspace/3d"))).toBe(true);
    expect(workspaceRoutes).toContain("/workspace/data");
    expect(workspaceRoutes).toContain("/linear-algebra");
    expect(workspaceRoutes.every((route) => route.startsWith("/"))).toBe(true);
  });

  it("renders launchers on the Engineering Mathematics hub", async () => {
    const source = await readFile(pageSource, "utf8");

    expect(source).toContain("Engineering Math Hub");
    expect(source).toContain("Semester Command Center");
    expect(source).toContain("Native Lab Launchers");
    expect(source).toContain("Quick Start Paths");
    expect(source).toContain("Domain Readiness");
    expect(source).toContain("Domain Comparison Matrix");
    expect(source).toContain("Build Priorities");
    expect(source).toContain("launchersForDomain");
    expect(source).toContain("launcherCoverageSummary");
  });
});
