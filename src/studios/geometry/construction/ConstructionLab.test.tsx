import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MockupStudioApp from "../../mockup/MockupStudioApp";
import { parseConstructionPanel } from "./constructionMode";
import { defaultConstruction, evaluate, collectMeasurements } from "./constructionEngine";
import { buildProofs } from "./constructionProofs";

describe("Construction Workspace", () => {
  it("parses inspector panels from the URL", () => {
    expect(parseConstructionPanel(null)).toBe("objects");
    expect(parseConstructionPanel("Measurements")).toBe("measurements");
    expect(parseConstructionPanel("proof")).toBe("proof");
    expect(parseConstructionPanel("deps")).toBe("dependencies");
  });

  it("renders the live construction workspace inside Geometry Studio", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/geometry/construction"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(html).toContain("Construction Workspace");
    expect(html).toContain("Live object tree");
    expect(html).toContain("Perp. bisector of AB");
    expect(html).toContain("Construct");
    expect(html).toContain("Perpendicular bisector construction canvas");
    expect(html).not.toContain("workspace-suite-bar");
  });

  it("opens measurements, dependencies, and proof inspectors from the panel query", () => {
    const measure = renderToString(
      <MemoryRouter initialEntries={["/geometry/construction?panel=measurements"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(measure).toContain("Measurements");
    expect(measure).toContain("distances");
    const deps = renderToString(
      <MemoryRouter initialEntries={["/geometry/construction?panel=dependencies"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(deps).toContain("Construction dependency graph");
    const proof = renderToString(
      <MemoryRouter initialEntries={["/geometry/construction?panel=proof"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(proof).toContain("Proof explanation");
    expect(proof).toContain("Perpendicular bisector theorem");
    expect(proof).toContain("equidistant");
  });

  it("derives CA = CB from the default construction", () => {
    const objects = defaultConstruction();
    const world = evaluate(objects);
    const proofs = buildProofs(objects, world);
    expect(proofs[0]?.constructed).toBe(true);
    expect(proofs.some((p) => p.goal.includes("CA = CB"))).toBe(true);
    const measures = collectMeasurements(objects, world, null);
    expect(measures.some((m) => m.label === "AB" && Math.abs((m.numeric ?? 0) - 4) < 1e-6)).toBe(true);
  });
});
