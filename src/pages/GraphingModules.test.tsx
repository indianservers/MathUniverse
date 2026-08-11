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

    expect(html).toContain("Expressions &amp; Layers");
    expect(html).toContain("x^2 + y^2 = 25");
    expect(html).toContain("(2, 3)");
    expect(html).toContain("Derivative");
    expect(html).toContain("Shade integral");
    expect(html).toContain("Table of values");
    expect(html).toContain("Visible range");
    expect(html).toContain("Find intersections");
    expect(html).toContain("Graph Studio 2D");
    expect(html).toContain("Build");
    expect(html).toContain("Analyze");
    expect(html).toContain("Animate");
    expect(html).toContain("Learn");
    expect(html).toContain("Offline ready");
  });

  it("renders multi-surface, slice, opacity, solid, save, and camera controls in 3D", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLab3DGraphing /></MemoryRouter>);

    expect(html).toContain("Graph Studio 3D");
    expect(html).toContain("Expressions &amp; Layers");
    expect(html).toContain("Surface Inspector");
    expect(html).toContain("Cross-section");
    expect(html).toContain("Timeline");
    expect(html).toContain("Build");
    expect(html).toContain("Analyze");
    expect(html).toContain("Animate");
    expect(html).toContain("Learn");
    expect(html).toContain("Export");
    expect(html).toContain("Offline ready");
  });
});
