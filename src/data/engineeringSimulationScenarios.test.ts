import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { adjustedSimulationSamples, engineeringSimulationScenarios, simulationCoverageSummary, simulationsForDomain } from "./engineeringSimulationScenarios";

const pageSource = new URL("../pages/EngineeringMath.tsx", import.meta.url);

describe("engineering simulation scenarios", () => {
  it("adds one deterministic simulation studio scenario for every domain", () => {
    const summary = simulationCoverageSummary();

    expect(summary.domainCount).toBe(engineeringMathDomains.length);
    expect(summary.coveredDomainCount).toBe(engineeringMathDomains.length);
    expect(summary.scenarioCount).toBeGreaterThanOrEqual(engineeringMathDomains.length);
    expect(engineeringMathDomains.every((domain) => simulationsForDomain(domain.id).length >= 1)).toBe(true);
    expect(engineeringSimulationScenarios.every((scenario) => scenario.route.startsWith("/"))).toBe(true);
    expect(engineeringSimulationScenarios.every((scenario) => scenario.route.startsWith("/syllabus-lab/"))).toBe(true);
    expect(engineeringSimulationScenarios.every((scenario) => scenario.exportArtifacts.length >= 3)).toBe(true);
  });

  it("keeps live preview samples bounded and control-driven", () => {
    const scenario = engineeringSimulationScenarios[0];
    const first = adjustedSimulationSamples(scenario.samples, { shape: 1.2, forcing: 0.8, time: 0.2 });
    const second = adjustedSimulationSamples(scenario.samples, { shape: 1.2, forcing: 1.4, time: 0.8 });

    expect(first).toHaveLength(scenario.samples.length);
    expect(first.every((sample) => sample >= 0 && sample <= 1)).toBe(true);
    expect(second).not.toEqual(first);
  });

  it("renders the simulation studio on the Engineering Mathematics hub", async () => {
    const source = await readFile(pageSource, "utf8");

    expect(source).toContain("Simulation Studio");
    expect(source).toContain("simulationsForDomain");
    expect(source).toContain("adjustedSimulationSamples");
  });
});
