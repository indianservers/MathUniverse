import { describe, expect, it } from "vitest";
import { runWorkspaceQaSuite } from "./workspaceQaSuite";

describe("workspace QA suite", () => {
  it("passes geometry, parser, dependency, performance, accessibility, offline, and export checks", () => {
    const report = runWorkspaceQaSuite();

    expect(report.failed).toBe(0);
    expect(report.passed).toBe(report.checks.length);
    expect(report.checks.map((check) => check.area)).toEqual(expect.arrayContaining(["geometry", "parser", "dependencies", "performance", "accessibility", "offline", "exports", "engine"]));
  });

  it("keeps each check id unique and actionable", () => {
    const report = runWorkspaceQaSuite();
    const ids = report.checks.map((check) => check.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(report.checks.every((check) => check.label.length > 8 && check.detail.length > 8)).toBe(true);
  });
});
