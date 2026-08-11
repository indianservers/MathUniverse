import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import VisualMathsGraphingSection, { visualMathsGraphingModules } from "../components/home/VisualMathsGraphingSection";
import { navSections } from "../components/layout/navItems";
import MathLab3DGraphing from "./MathLab3DGraphing";
import MathLabGraphingCalculator from "./MathLabGraphingCalculator";

describe("Visual Maths & Graphing discovery", () => {
  it("groups the six differentiated modules on Home and in navigation", () => {
    const html = renderToStaticMarkup(<MemoryRouter><VisualMathsGraphingSection /></MemoryRouter>);
    const navigation = navSections.find((section) => section.title === "Visual Maths & Graphing");

    expect(visualMathsGraphingModules).toHaveLength(6);
    expect(navigation?.items).toHaveLength(6);
    for (const title of ["2D Explorer", "3D Explorer", "Shapes Explorer", "2D Graphs", "3D Graphs", "CAS - Computer Algebra System"]) {
      expect(html).toContain(title);
      expect(navigation?.items.some((item) => item.title === title)).toBe(true);
    }
  });
});

describe("graphing workspaces", () => {
  it("renders the completed 2D graph controls and canonical examples", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLabGraphingCalculator /></MemoryRouter>);

    expect(html).toContain("Collapse equation panel");
    expect(html).toContain("x^2 + y^2 = 25");
    expect(html).toContain("(2, 3)");
    expect(html).toContain("Derivative");
    expect(html).toContain("Integral");
    expect(html).toContain("Saved (0)");
    expect(html).toContain("X minimum");
    expect(html).toContain("Intersections");
  });

  it("renders multi-surface, slice, opacity, solid, save, and camera controls in 3D", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLab3DGraphing /></MemoryRouter>);

    expect(html).toContain("Second surface");
    expect(html).toContain("Surface opacity");
    expect(html).toContain("Cross-section slice");
    expect(html).toContain("Parametric helix");
    expect(html).toContain("Sphere");
    expect(html).toContain("Cylinder");
    expect(html).toContain("Saved (0)");
    expect(html).toContain("Reset Camera");
    expect(html).toContain("Top");
    expect(html).toContain("Front");
  });
});
