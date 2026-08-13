import { describe, expect, it } from "vitest";
import { mathLabEngineFamilies, mathLabEngineReport, mathLabTools } from "./mathLabTools";

describe("Math Lab engine catalog", () => {
  it("declares real options and validation checks for every tool", () => {
    expect(mathLabTools.length).toBeGreaterThan(30);
    mathLabTools.forEach((tool) => {
      expect(tool.route.startsWith("/")).toBe(true);
      expect(tool.options.length).toBeGreaterThan(0);
      expect(tool.checks.length).toBeGreaterThanOrEqual(3);
      expect(tool.status).toBe("validated");
    });
  });

  it("reports actual catalog totals without invented progress", () => {
    expect(mathLabEngineReport.tools).toBe(mathLabTools.length);
    expect(mathLabEngineReport.validated).toBe(mathLabTools.length);
    expect(mathLabEngineReport.families).toBe(mathLabEngineFamilies.length);
    expect(mathLabEngineReport.options).toBeGreaterThan(mathLabEngineReport.families);
    expect(mathLabEngineFamilies.every((family) => family.tools > 0 && family.options > 0)).toBe(true);
  });
});
