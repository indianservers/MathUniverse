import { describe, expect, it } from "vitest";

import { geogebraCasParityReport, geogebraCasParitySummary, missingGeoGebraCasCommands } from "./casGeoGebraParity";

describe("casGeoGebraParity", () => {
  it("tracks GeoGebra CAS coverage and remaining gaps", () => {
    const summary = geogebraCasParitySummary();

    expect(summary.geogebraTotal).toBeGreaterThan(120);
    expect(summary.localTotal).toBeGreaterThan(90);
    expect(summary.covered).toBe(summary.geogebraTotal);
    expect(summary.missing).toBe(0);
    expect(summary.missingByPriority.P0).toBe(0);
  });

  it("marks direct and equivalent commands separately", () => {
    const report = geogebraCasParityReport();
    const byName = new Map(report.map((entry) => [entry.geogebra, entry]));

    expect(byName.get("Derivative")?.status).toBe("direct");
    expect(byName.get("IntegralBetween")?.localCommand).toBe("DefiniteIntegral");
    expect(byName.get("ReducedRowEchelonForm")?.localCommand).toBe("RREF");
    expect(byName.get("SVD")?.status).toBe("direct");
    expect(byName.get("RandomBetween")?.status).toBe("direct");
    expect(byName.get("RandomPolynomial")?.status).toBe("direct");
    expect(byName.get("GroebnerLex")?.status).toBe("direct");
    expect(missingGeoGebraCasCommands("P1")).toEqual([]);
  });
});
